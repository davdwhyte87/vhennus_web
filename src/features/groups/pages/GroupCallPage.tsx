import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ArrowLeft, Crown, Hand, Loader2, Mic, MicOff, Phone, PhoneOff } from 'lucide-react'
import { endCallAPI, getCallAPI, getGroupAPI, startCallAPI, type GroupDetail } from '../api.ts'
import { useGroupCallStore } from '../useGroupCallStore.ts'
import { useGroupVoice } from '../useGroupVoice.ts'
import { useAuthStore } from '../../auth/useAuthStore.ts'

/**
 * Dedicated voice-call screen. Joining a call (from the group header, the
 * group strip, the groups list or the global banner) lands here.
 * Leaving this screen does NOT leave the call — only "Leave" does.
 */
export default function GroupCallPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const myName = useAuthStore((s) => s.authUserName ?? '')
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const call = useGroupCallStore((s) => (id ? s.callsByGroup[id] : undefined))
  const setCall = useGroupCallStore((s) => s.setCall)
  const store = useGroupCallStore.getState()
  const { amInCall, amSpeaker, micError, audioElements } = useGroupVoice(id ?? '', myName)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    Promise.all([getGroupAPI(id), getCallAPI(id)])
      .then(([g, c]) => {
        if (cancelled) return
        setGroup(g.data)
        if (c.data) setCall(c.data)
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || 'Error loading call')
          if (err.response?.status === 401 || err.response?.status === 404) navigate('/home/groups')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-[#4d5666]">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading call…
      </div>
    )
  }
  if (!id || !group) return <p className="py-20 text-center text-[#4d5666]">Group not found.</p>

  const myRole = group.my_role ?? null
  const isOwner = group.owner === myName
  const isGroupAdmin = isOwner || myRole === 'admin' || myRole === 'owner'
  const amCallAdmin = call?.active && call.call_admin === myName
  const canModerateCall = !!amCallAdmin

  const doStart = async () => {
    try {
      const r = await startCallAPI(id)
      if (r.data) setCall(r.data)
      store.startCall(id)
      store.joinCall(id)
    } catch {
      toast.error('Could not start call')
    }
  }

  const doLeave = () => {
    store.leaveCall(id)
    navigate(`/home/groups/${id}`)
  }

  const doEnd = async () => {
    try {
      await endCallAPI(id)
    } catch {
      /* ws broadcast still ends it */
    }
    store.endCall(id)
    navigate(`/home/groups/${id}`)
  }

  // ---- idle: no live call ----
  if (!call?.active) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <button
          type="button"
          onClick={() => navigate(`/home/groups/${id}`)}
          aria-label="Back to group"
          className="absolute left-4 top-20 grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5 lg:top-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#0A1931]/10 font-serif text-3xl">
          {group.image ? <img src={group.image} alt={group.name} className="h-full w-full object-cover" /> : group.name.slice(0, 1).toUpperCase()}
        </div>
        <h1 className="mt-4 font-serif text-2xl text-[#0A1931]">{group.name}</h1>
        <p className="mt-1 text-sm text-[#6b7180]">No live call right now.</p>
        {isGroupAdmin ? (
          <button
            type="button"
            onClick={doStart}
            className="mt-6 flex items-center gap-2 bg-[#0A1931] px-6 py-3 font-medium text-white hover:bg-[#CC5A2A]"
          >
            <Phone className="h-5 w-5" /> Start call
          </button>
        ) : (
          <p className="mt-6 text-sm text-[#4d5666]">You'll be notified here when an admin starts one.</p>
        )}
      </div>
    )
  }

  const sorted = [...(call.participants ?? [])].sort((a, b) => a.joined_at.localeCompare(b.joined_at))
  const hands = call.hands ?? []
  const iRaised = hands.includes(myName)

  // ---- active but not joined: preview + join ----
  if (!amInCall) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <button
          type="button"
          onClick={() => navigate(`/home/groups/${id}`)}
          aria-label="Back to group"
          className="absolute left-4 top-20 grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5 lg:top-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="flex items-center gap-1.5 rounded-full bg-green-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" /> Live now
        </span>
        <h1 className="mt-3 font-serif text-2xl text-[#0A1931]">{group.name}</h1>
        <p className="mt-1 text-sm text-[#6b7180]">
          {sorted.length} on call · Speaker: {call.speaker ?? '—'}
        </p>
        <button
          type="button"
          onClick={() => store.joinCall(id)}
          className="mt-6 flex items-center gap-2 bg-[#C9A86A] px-8 py-3 font-bold text-[#0A1931] hover:bg-[#0A1931] hover:text-white"
        >
          <Phone className="h-5 w-5" /> Join call
        </button>
      </div>
    )
  }

  // ---- in call: full call screen ----
  return (
    <div className="flex min-h-[80vh] flex-col bg-[#0A1931] px-4 py-5 text-white sm:px-6 [&>*]:mx-auto [&>*]:w-full [&>*]:max-w-4xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(`/home/groups/${id}`)}
          aria-label="Back to messages (stays on call)"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg">{group.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Live · {sorted.length} on call
          </p>
        </div>
        <span className="shrink-0 rounded bg-[#C9A86A] px-2 py-1 text-[11px] font-bold uppercase text-[#0A1931]">
          {amSpeaker ? 'You have the mic' : `🎙 ${call.speaker ?? '—'}`}
        </span>
      </div>

      {micError && <p className="mt-3 text-center text-xs text-amber-300">{micError}</p>}

      {/* participants */}
      <div className="mt-5 grid flex-1 grid-cols-2 content-start gap-2.5 sm:grid-cols-3">
        {sorted.map((p) => {
          const isMe = p.user_name === myName
          const isSpeaker = p.user_name === call.speaker
          const raised = hands.includes(p.user_name)
          const canGive = raised && (canModerateCall || amSpeaker) && !isSpeaker
          return (
            <div
              key={p.user_name}
              className={`flex flex-col items-center gap-1.5 px-3 py-5 text-center ${isSpeaker ? 'bg-[#C9A86A]/15 ring-1 ring-[#C9A86A]' : 'bg-white/5'}`}
            >
              <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white/10 font-serif text-xl">
                {p.user_name.slice(0, 1).toUpperCase()}
                {isSpeaker && <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#C9A86A] text-[#0A1931]"><Mic className="h-3.5 w-3.5" /></span>}
                {!isSpeaker && <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-white/15 text-white/70"><MicOff className="h-3.5 w-3.5" /></span>}
              </div>
              <p className="w-full truncate text-sm font-medium">
                {isMe ? 'You' : p.user_name}
                {p.user_name === call.call_admin && <Crown className="ml-1 inline h-3.5 w-3.5 text-[#C9A86A]" />}
              </p>
              <p className="h-4 text-xs text-white/60">
                {isSpeaker ? 'Speaking' : raised ? '✋ Hand raised' : 'Listening'}
              </p>
              {canGive && (
                <button
                  type="button"
                  onClick={() => store.grantMic(id, p.user_name)}
                  className="mt-1 flex items-center gap-1 bg-[#C9A86A] px-2.5 py-1 text-[11px] font-bold text-[#0A1931]"
                >
                  <Mic className="h-3 w-3" /> Give mic
                </button>
              )}
            </div>
          )
        })}
      </div>

      {canModerateCall && call.speaker !== call.call_admin && (
        <button type="button" onClick={() => store.revokeMic(id)} className="mx-auto mt-3 text-xs text-[#C9A86A] hover:underline">
          Take mic back
        </button>
      )}

      {/* controls */}
      <div className="mt-5 flex items-center justify-center gap-3 pb-2">
        {!amSpeaker && (
          <button
            type="button"
            onClick={() => (iRaised ? store.lowerHand(id) : store.raiseHand(id))}
            aria-label={iRaised ? 'Lower hand' : 'Raise hand'}
            title={iRaised ? 'Lower hand' : 'Raise hand'}
            className={`grid h-12 w-12 place-items-center rounded-full ${iRaised ? 'bg-[#C9A86A] text-[#0A1931]' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <Hand className="h-5 w-5" />
          </button>
        )}
        <button
          type="button"
          onClick={doLeave}
          aria-label="Leave call"
          title="Leave call"
          className="grid place-items-center rounded-full bg-red-600 p-4 hover:bg-red-500"
        >
          <PhoneOff className="h-6 w-6" />
        </button>
        {(canModerateCall || isGroupAdmin) && (
          <button type="button" onClick={doEnd} className="px-3 py-2 text-xs text-white/70 hover:text-white hover:underline">
            End call
          </button>
        )}
      </div>
      <p className="pb-4 text-center text-[11px] text-white/50">Leaving this screen keeps you on the call — tap the red button to leave.</p>

      {/* remote audio */}
      {Object.entries(audioElements).map(([user, stream]) => (
        <audio
          key={user}
          autoPlay
          playsInline
          ref={(el) => {
            if (el && el.srcObject !== stream) el.srcObject = stream
          }}
        />
      ))}
    </div>
  )
}
