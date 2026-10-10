import { create } from 'zustand'
import type { GroupMessage, GroupReplyPreview, MyGroupItem } from './api'
import { getGroupUnreadAPI, markGroupReadAPI } from './api'

export type GroupFrameSender = ((frame: object) => void) | null

interface GroupState {
  groups: MyGroupItem[]
  messagesByGroup: Record<string, GroupMessage[]>
  unreadTotal: number
  unreadByGroup: Record<string, number>
  connected: boolean
  sender: GroupFrameSender

  setConnected: (c: boolean) => void
  setSender: (s: GroupFrameSender) => void
  setGroups: (g: MyGroupItem[]) => void
  upsertGroup: (g: MyGroupItem) => void
  setMessages: (groupId: string, msgs: GroupMessage[]) => void
  prependMessages: (groupId: string, msgs: GroupMessage[]) => void
  ingestNew: (msg: GroupMessage) => boolean
  confirmSent: (tempId: string, msg: GroupMessage) => void
  failSend: (tempId: string) => void
  setUnread: (total: number, byGroup: Record<string, number>) => void
  refreshUnread: () => Promise<void>
  sendMessage: (groupId: string, text: string, senderName: string, replyTo?: GroupReplyPreview | null) => string | null
  markRead: (groupId: string, lastMsgId?: string) => void
}

const toByGroup = (groups: { group_id: string; unread: number }[]) => {
  const map: Record<string, number> = {}
  for (const g of groups) map[g.group_id] = g.unread
  return map
}

// Monotonic guard so out-of-order /unread responses can't clobber fresh state.
let unreadRefreshSeq = 0

export const useGroupStore = create<GroupState>()((set, get) => ({
  groups: [],
  messagesByGroup: {},
  unreadTotal: 0,
  unreadByGroup: {},
  connected: false,
  sender: null,

  setConnected: (connected) => set({ connected }),
  setSender: (sender) => set({ sender }),
  setGroups: (groups) => set({ groups }),
  upsertGroup: (g) =>
    set((s) => ({
      groups: s.groups.some((x) => x.id === g.id)
        ? s.groups.map((x) => (x.id === g.id ? g : x))
        : [g, ...s.groups],
    })),

  setMessages: (groupId, msgs) =>
    set((s) => ({ messagesByGroup: { ...s.messagesByGroup, [groupId]: msgs } })),

  prependMessages: (groupId, msgs) =>
    set((s) => {
      const existing = s.messagesByGroup[groupId] ?? []
      const known = new Set(existing.map((m) => m.id))
      const fresh = msgs.filter((m) => !known.has(m.id))
      if (fresh.length === 0) return s
      return { messagesByGroup: { ...s.messagesByGroup, [groupId]: [...fresh, ...existing] } }
    }),

  ingestNew: (msg) => {
    const { messagesByGroup } = get()
    const list = messagesByGroup[msg.group_id] ?? []
    if (list.some((m) => m.id === msg.id)) return false
    const tmpIdx = list.findIndex(
      (m) => m.id.startsWith('tmp-') && m.sender === msg.sender && m.text === msg.text,
    )
    const next = tmpIdx >= 0 ? list.map((m, i) => (i === tmpIdx ? msg : m)) : [...list, msg]
    set({ messagesByGroup: { ...messagesByGroup, [msg.group_id]: next } })
    // bump last_message preview + unread handled via refresh
    return true
  },

  confirmSent: (tempId, msg) => {
    const { messagesByGroup } = get()
    const next: Record<string, GroupMessage[]> = {}
    for (const [gid, list] of Object.entries(messagesByGroup)) {
      next[gid] = list.filter((m) => m.id !== tempId)
    }
    if (!(next[msg.group_id] ?? []).some((m) => m.id === msg.id)) {
      next[msg.group_id] = [...(next[msg.group_id] ?? []), msg]
    }
    set({ messagesByGroup: next })
  },

  failSend: (tempId) => {
    const { messagesByGroup } = get()
    let changed = false
    const next: Record<string, GroupMessage[]> = {}
    for (const [gid, list] of Object.entries(messagesByGroup)) {
      const filtered = list.filter((m) => m.id !== tempId)
      if (filtered.length !== list.length) changed = true
      next[gid] = filtered
    }
    if (changed) set({ messagesByGroup: next })
  },

  setUnread: (total, byGroup) => set({ unreadTotal: total, unreadByGroup: byGroup }),

  refreshUnread: async () => {
    // Latest-wins: rapid messages fire concurrent refreshes that may resolve
    // out of order — a stale response must never overwrite fresher state.
    const seq = ++unreadRefreshSeq
    try {
      const resp = await getGroupUnreadAPI()
      if (seq !== unreadRefreshSeq) return
      get().setUnread(resp.data.total ?? 0, toByGroup(resp.data.groups ?? []))
    } catch {
      // badge is best-effort
    }
  },

  sendMessage: (groupId, text, senderName, replyTo) => {
    const { sender } = get()
    if (!sender || !text.trim()) return null
    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const now = new Date().toISOString()
    const optimistic: GroupMessage = {
      id: tempId,
      group_id: groupId,
      sender: senderName,
      text,
      reply_to_msg_id: replyTo?.id ?? null,
      reply_to: replyTo ?? null,
      created_at: now,
    }
    set((s) => ({
      messagesByGroup: {
        ...s.messagesByGroup,
        [groupId]: [...(s.messagesByGroup[groupId] ?? []), optimistic],
      },
    }))
    sender({ type: 'send', temp_id: tempId, group_id: groupId, message: text, reply_to_msg_id: replyTo?.id ?? null })
    return tempId
  },

  markRead: (groupId, lastMsgId) => {
    const { sender, connected } = get()
    // optimistic badge clear
    set((s) => {
      if (!s.unreadByGroup[groupId]) return s
      const next = { ...s.unreadByGroup }
      delete next[groupId]
      return { unreadByGroup: next, unreadTotal: Object.keys(next).length }
    })
    if (sender && connected) {
      sender({ type: 'read', group_id: groupId, msg_id: lastMsgId ?? null })
      return
    }
    markGroupReadAPI(groupId, lastMsgId)
      .then(() => get().refreshUnread())
      .catch(() => {})
  },
}))
