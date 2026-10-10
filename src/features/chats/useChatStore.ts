import { create } from 'zustand'
import type { Chat, ChatReplyPreview } from './socket'
import type { ChatPair } from './api'
import { getUnreadAPI, markChatReadAPI } from './api'

export type FrameSender = ((frame: object) => void) | null

interface ChatState {
  pairs: ChatPair[]
  messagesByPair: Record<string, Chat[]>
  unreadTotal: number
  unreadByPair: Record<string, number>
  connected: boolean
  sender: FrameSender

  setConnected: (connected: boolean) => void
  setSender: (sender: FrameSender) => void
  setPairs: (pairs: ChatPair[]) => void
  upsertPair: (pair: ChatPair) => void
  setMessages: (pairId: string, chats: Chat[]) => void
  // Append a live message; returns true when it changed state.
  ingestNew: (chat: Chat) => boolean
  // Resolve an optimistic row once the server ack arrives.
  confirmSent: (tempId: string, chat: Chat) => void
  // Drop an optimistic row the server rejected.
  failSend: (tempId: string) => void
  setUnread: (total: number, byPair: Record<string, number>) => void
  refreshUnread: () => Promise<void>
  // Optimistic send; resolves when handed to the socket.
  sendChat: (
    receiver: string,
    message: string,
    senderName: string,
    pairIdHint: string,
    replyTo?: ChatReplyPreview | null
  ) => string | null
  // Mark a pair read via socket, falling back to REST when offline.
  markRead: (pairId: string) => void
}

const toByPair = (pairs: { pair_id: string; unread: number }[]) => {
  const map: Record<string, number> = {}
  for (const p of pairs) map[p.pair_id] = p.unread
  return map
}

export const useChatStore = create<ChatState>()((set, get) => ({
  pairs: [],
  messagesByPair: {},
  unreadTotal: 0,
  unreadByPair: {},
  connected: false,
  sender: null,

  setConnected: (connected) => set({ connected }),
  setSender: (sender) => set({ sender }),

  setPairs: (pairs) => set({ pairs }),
  upsertPair: (pair) =>
    set((state) => ({
      pairs: state.pairs.some((p) => p.id === pair.id)
        ? state.pairs.map((p) => (p.id === pair.id ? pair : p))
        : [pair, ...state.pairs],
    })),

  setMessages: (pairId, chats) =>
    set((state) => ({
      messagesByPair: { ...state.messagesByPair, [pairId]: chats },
    })),

  ingestNew: (chat) => {
    const { messagesByPair } = get()
    const list = messagesByPair[chat.pair_id] ?? []
    if (list.some((m) => m.id === chat.id)) return false
    // Resolve a matching optimistic row instead of duplicating.
    const tmpIdx = list.findIndex(
      (m) =>
        m.id.startsWith('tmp-') &&
        m.sender === chat.sender &&
        m.message === chat.message
    )
    const next =
      tmpIdx >= 0
        ? list.map((m, i) => (i === tmpIdx ? chat : m))
        : [...list, chat]
    set({
      messagesByPair: { ...messagesByPair, [chat.pair_id]: next },
    })
    return true
  },

  confirmSent: (tempId, chat) => {
    const { messagesByPair } = get()
    const next: Record<string, Chat[]> = {}
    for (const [pairId, list] of Object.entries(messagesByPair)) {
      next[pairId] = list.filter((m) => m.id !== tempId)
    }
    if (!(next[chat.pair_id] ?? []).some((m) => m.id === chat.id)) {
      next[chat.pair_id] = [...(next[chat.pair_id] ?? []), chat]
    }
    set({ messagesByPair: next })
  },

  failSend: (tempId) => {
    const { messagesByPair } = get()
    let changed = false
    const next: Record<string, Chat[]> = {}
    for (const [pairId, list] of Object.entries(messagesByPair)) {
      const filtered = list.filter((m) => m.id !== tempId)
      if (filtered.length !== list.length) changed = true
      next[pairId] = filtered
    }
    if (changed) set({ messagesByPair: next })
  },

  setUnread: (total, byPair) => set({ unreadTotal: total, unreadByPair: byPair }),

  refreshUnread: async () => {
    try {
      const resp = await getUnreadAPI()
      get().setUnread(resp.data.total ?? 0, toByPair(resp.data.pairs ?? []))
    } catch {
      // Badge is best-effort.
    }
  },

  sendChat: (receiver, message, senderName, pairIdHint, replyTo) => {
    const { sender } = get()
    if (!sender || !message.trim()) return null
    const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const now = new Date().toISOString()
    const optimistic: Chat = {
      id: tempId,
      pair_id: pairIdHint,
      sender: senderName,
      receiver,
      message,
      reply_to_id: replyTo?.id ?? null,
      reply_to: replyTo ?? null,
      created_at: now,
      updated_at: now,
    }
    set((state) => ({
      messagesByPair: {
        ...state.messagesByPair,
        [pairIdHint]: [...(state.messagesByPair[pairIdHint] ?? []), optimistic],
      },
    }))
    sender({ type: 'send', temp_id: tempId, receiver, message, reply_to_id: replyTo?.id ?? null })
    return tempId
  },

  markRead: (pairId) => {
    const { sender, connected } = get()
    if (sender && connected) {
      sender({ type: 'read', pair_id: pairId })
      return
    }
    markChatReadAPI(pairId)
      .then(() => get().refreshUnread())
      .catch(() => {})
  },
}))
