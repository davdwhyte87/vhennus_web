import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ArrowLeft, Info, Loader2, Reply, Send, Settings, X } from 'lucide-react'
import {
  addTopicAPI,
  closeTopicAPI,
  getGroupAPI,
  getGroupMembersAPI,
  getGroupMessagesAPI,
  type GroupDetail,
  type GroupMember,
  type GroupMessage,
  type GroupReplyPreview,
} from '../api.ts'
import { useGroupStore } from '../useGroupStore.ts'
import { useAuthStore } from '../../auth/useAuthStore.ts'
import formatISOTime from '../../../Shared/formatISOString.ts'
import LinkifiedText from '../../../Shared/components/LinkifiedText.tsx'

const EMPTY_MESSAGES: GroupMessage[] = []

export default function SingleGroupPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const myName = useAuthStore((s) => s.authUserName ?? '')
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [composer, setComposer] = useState('')
  const [replyTarget, setReplyTarget] = useState<GroupMessage | null>(null)
  const [flashId, setFlashId] = useState<string | null>(null)
  const [msgError, setMsgError] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [topicDraft, setTopicDraft] = useState('')
  // Stable empty fallback: returning a fresh `[]` from the selector retriggers
  // useSyncExternalStore on every snapshot (infinite loop → blank page).
  const messagesByGroup = useGroupStore((s) => s.messagesByGroup)
  const messages = id ? (messagesByGroup[id] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES
  const setMessages = useGroupStore((s) => s.setMessages)
  const prependMessages = useGroupStore((s) => s.prependMessages)
  const sendMessage = useGroupStore((s) => s.sendMessage)
  const markRead = useGroupStore((s) => s.markRead)
  const connected = useGroupStore((s) => s.connected)
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    if (!id) return
    setLoading(true)
    setMsgError(false)
    try {
      // Fetch group first — a messages failure must never blank the whole page
      // (e.g. brand-new group with zero messages).
      const g = await getGroupAPI(id)
      setGroup(g.data)
      try {
        const msgs = await getGroupMessagesAPI(id, { limit: 30 })
        // server returns newest-first; display oldest-first
        const ordered = [...(msgs.data ?? [])].reverse()
        setMessages(id, ordered)
        setHasMore((msgs.data ?? []).length >= 30)
        if (g.data.is_member) {
          const last = ordered[ordered.length - 1]
          markRead(id, last?.id)
        }
      } catch {
        // Messages are non-fatal: still show the group shell + composer.
        setMessages(id, [])
        setHasMore(false)
        setMsgError(true)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error loading group')
        if (err.response?.status === 401 || err.response?.status === 404) navigate('/home/groups')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (id && messages.length > 0 && group?.is_member) {
      markRead(id, messages[messages.length - 1]?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  const loadOlder = async () => {
    if (!id || loadingMore || !hasMore || messages.length === 0) return
    setLoadingMore(true)
    try {
      const oldest = messages[0]
      const resp = await getGroupMessagesAPI(id, { limit: 30, before: oldest.created_at })
      const ordered = [...(resp.data ?? [])].reverse()
      if (ordered.length === 0 || (resp.data ?? []).length < 30) setHasMore(false)
      prependMessages(id, ordered)
    } catch {
      // best-effort
    } finally {
      setLoadingMore(false)
    }
  }

  const scrollToMessage = (targetId: string) => {
    const el = document.getElementById(`group-msg-${targetId}`)
    if (!el) {
      toast.info('Original message is not loaded yet — tap “Load older messages”')
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFlashId(targetId)
    setTimeout(() => setFlashId((cur) => (cur === targetId ? null : cur)), 1600)
  }

  const send = () => {
    if (!id || !composer.trim()) return
    if (!connected) {
      toast.error('Still connecting… try again in a moment')
      return
    }
    // A still-sending (tmp-id) target has no server id yet — send plain instead
    // of failing validation; ids swap in on confirm.
    const reply: GroupReplyPreview | null = replyTarget && !replyTarget.id.startsWith('tmp-')
      ? { id: replyTarget.id, sender: replyTarget.sender, sender_name: replyTarget.sender_name ?? null, text: replyTarget.text }
      : null
    sendMessage(id, composer.trim(), myName, reply)
    setComposer('')
    setReplyTarget(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading group…
      </div>
    )
  }
  if (!group) return <p className="py-20 text-center text-[#4d5666]">Group not found.</p>

  const isOwner = group.owner === myName

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-30 border-b border-[#C9A86A]/60 bg-[#F5F5F0]/95 backdrop-blur-md">
        <div className="flex items-center gap-2 px-3 py-3 sm:px-5">
          <button type="button" onClick={() => navigate('/home/groups')} aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif">
            {group.image ? <img src={group.image} alt={group.name} className="h-full w-full object-cover" /> : group.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[#0A1931]">{group.name}</p>
            <p className="truncate text-xs text-[#6b7180]">
              {group.member_count} member{group.member_count === 1 ? '' : 's'}
              {group.is_private ? ' · Private' : ' · Public'}
            </p>
          </div>
          <button type="button" onClick={() => setShowMembers(true)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5" aria-label="Group info">
            <Info className="h-5 w-5" />
          </button>
          {isOwner && (
            <button
              type="button"
              onClick={() => navigate(`/home/groups/${group.id}/settings`)}
              aria-label="Group settings"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
        </div>
        {/* topic banner */}
        {group.open_topic ? (
          <div className="flex items-center gap-2 bg-[#0A1931] px-4 py-2 text-sm text-white">
            <span className="shrink-0 rounded bg-[#C9A86A] px-1.5 py-0.5 text-[11px] font-bold uppercase text-[#0A1931]">Topic</span>
            <span className="min-w-0 flex-1 truncate">{group.open_topic.title}</span>
            {isOwner && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await closeTopicAPI(group.id, group.open_topic!.id)
                    toast.success('Topic closed')
                    load()
                  } catch {
                    toast.error('Failed to close topic')
                  }
                }}
                className="flex shrink-0 items-center gap-1 text-xs text-[#C9A86A] hover:text-white"
              >
                <X className="h-3.5 w-3.5" /> Close
              </button>
            )}
          </div>
        ) : (
          isOwner && <TopicCreator groupId={group.id} draft={topicDraft} setDraft={setTopicDraft} onDone={load} />
        )}
      </header>

      {showMembers && <MembersModal groupId={group.id} onClose={() => setShowMembers(false)} />}

      {/* messages */}
      <main className="flex-1 space-y-2 px-3 py-4 sm:px-5">
        {msgError && (
          <div className="mx-auto flex max-w-md items-center justify-between gap-2 bg-[#CC5A2A]/10 px-3 py-2 text-sm text-[#0A1931]">
            <span>Couldn't load messages.</span>
            <button type="button" onClick={load} className="shrink-0 font-medium text-[#CC5A2A] hover:underline">
              Retry
            </button>
          </div>
        )}
        {hasMore && messages.length > 0 && (
          <button type="button" onClick={loadOlder} disabled={loadingMore} className="mx-auto block text-xs text-[#CC5A2A] hover:underline">
            {loadingMore ? 'Loading…' : 'Load older messages'}
          </button>
        )}
        {messages.length === 0 ? (
          <p className="py-16 text-center text-[#4d5666]">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((m) => (
            <Bubble
              key={m.id}
              msg={m}
              mine={m.sender === myName}
              flash={m.id === flashId}
              onReply={setReplyTarget}
              onQuoteClick={scrollToMessage}
            />
          ))
        )}
        <div ref={bottomRef} />
      </main>

      {/* composer */}
      <footer className="sticky bottom-20 z-30 border-t border-[#C9A86A]/60 bg-white/95 px-3 py-3 backdrop-blur-md lg:bottom-0">
        {!connected && <p className="mb-1 text-center text-xs text-[#CC5A2A]">Connecting to live chat…</p>}
        {replyTarget && (
          <div className="mb-2 flex items-center gap-2 border-l-2 border-[#CC5A2A] bg-[#0A1931]/5 px-2 py-1.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-[#CC5A2A]">
                Replying to {replyTarget.sender_name || replyTarget.sender}
              </p>
              <p className="truncate text-xs text-[#4d5666]">{replyTarget.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              aria-label="Cancel reply"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-[#0A1931]/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Send a message…"
            maxLength={4000}
            className="flex-1 border border-[#0A1931]/25 px-3 py-2.5 outline-none focus:border-[#CC5A2A]"
          />
          <button type="button" onClick={send} aria-label="Send" className="grid h-11 w-11 place-items-center bg-[#0A1931] text-white hover:bg-[#CC5A2A]">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  )
}

function Bubble({ msg, mine, flash, onReply, onQuoteClick }: { msg: GroupMessage; mine: boolean; flash: boolean; onReply: (m: GroupMessage) => void; onQuoteClick: (id: string) => void }) {
  const failed = msg.id.startsWith('tmp-')
  return (
    <div id={`group-msg-${msg.id}`} className={`flex scroll-mt-32 ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-3 py-2 text-left transition-shadow ${mine ? 'bg-[#0A1931] text-white' : 'bg-white text-[#0A1931]'} ${failed ? 'opacity-60' : ''} ${flash ? 'ring-2 ring-[#C9A86A]' : ''}`}>
        <p className={`text-left text-xs font-medium ${mine ? 'text-[#C9A86A]' : 'text-[#CC5A2A]'}`}>{msg.sender_name || msg.sender}</p>
        {msg.reply_to && (
          <button
            type="button"
            onClick={() => onQuoteClick(msg.reply_to!.id)}
            title="Jump to original message"
            className={`mb-1 mt-1 block w-full border-l-2 pl-2 text-left hover:opacity-80 ${mine ? 'border-[#C9A86A]/70' : 'border-[#CC5A2A]/60'}`}
          >
            <p className={`truncate text-[11px] font-medium ${mine ? 'text-[#C9A86A]' : 'text-[#CC5A2A]'}`}>
              {msg.reply_to.sender_name || msg.reply_to.sender}
            </p>
            <p className={`truncate text-xs ${mine ? 'text-white/80' : 'text-[#4d5666]'}`}>{msg.reply_to.text}</p>
          </button>
        )}
        <p className="whitespace-pre-wrap break-words text-[15px]">
          <LinkifiedText
            text={msg.text}
            linkClassName={
              mine
                ? 'text-[#C9A86A] underline decoration-[#C9A86A]/40 underline-offset-2 break-all hover:text-white'
                : undefined
            }
          />
        </p>
        {msg.image && <img src={msg.image} alt="" className="mt-1 max-h-48 rounded object-cover" />}
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className={`text-left text-[11px] ${mine ? 'text-white/70' : 'text-[#6b7180]'}`}>{formatISOTime(msg.created_at)}</p>
          <button
            type="button"
            onClick={() => onReply(msg)}
            aria-label="Reply to this message"
            className={`grid h-6 w-6 place-items-center rounded-full ${mine ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-[#6b7180] hover:bg-[#0A1931]/5 hover:text-[#0A1931]'}`}
          >
            <Reply className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function TopicCreator({
  groupId,
  draft,
  setDraft,
  onDone,
}: {
  groupId: string
  draft: string
  setDraft: (s: string) => void
  onDone: () => void
}) {
  const [saving, setSaving] = useState(false)
  return (
    <div className="flex items-center gap-2 bg-[#C9A86A]/20 px-4 py-2">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a topic… (e.g. Weekend match discussion)"
        className="flex-1 bg-white px-2 py-1.5 text-sm outline-none"
      />
      <button
        type="button"
        disabled={saving || !draft.trim()}
        onClick={async () => {
          setSaving(true)
          try {
            await addTopicAPI(groupId, draft.trim())
            toast.success('Topic added')
            setDraft('')
            onDone()
          } catch (err) {
            if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Failed to add topic')
          } finally {
            setSaving(false)
          }
        }}
        className="bg-[#0A1931] px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {saving ? '…' : 'Add'}
      </button>
    </div>
  )
}

function MembersModal({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const navigate = useNavigate()
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGroupMembersAPI(groupId)
      .then((r) => setMembers(r.data ?? []))
      .catch(() => toast.error('Unable to load members'))
      .finally(() => setLoading(false))
  }, [groupId])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" onClick={onClose}>
      <div className="max-h-[80vh] w-full max-w-md overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#0A1931]/10 px-4 py-3">
          <p className="font-serif text-lg text-[#0A1931]">
            Members{!loading && ` (${members.length})`}
          </p>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-4 py-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-[#4d5666]">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading members…
            </div>
          ) : members.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#6b7180]">No members yet.</p>
          ) : (
            members.map((m) => (
              <div key={m.user_name} className="flex items-center gap-2 py-2">
                <button type="button" onClick={() => navigate(`/user_profile/${m.user_name}`)} className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 text-sm">
                  {m.profile?.image ? <img src={m.profile.image} alt="" className="h-full w-full object-cover" /> : m.user_name.slice(0, 1).toUpperCase()}
                </button>
                <button type="button" onClick={() => navigate(`/user_profile/${m.user_name}`)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm text-[#0A1931]">{m.profile?.name || m.user_name}</span>
                  <span className="block text-xs text-[#6b7180]">@{m.user_name} · {m.role}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
