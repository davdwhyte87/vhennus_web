import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Phone } from 'lucide-react'
import { getCallAPI, startCallAPI } from '../api'
import { useGroupCallStore } from '../useGroupCallStore'
import { useGroupVoice } from '../useGroupVoice'

export function GroupCallHeaderButton({ groupId, myName, myRole, isOwner }: { groupId: string; myName: string; myRole?: string | null; isOwner: boolean }) {
  const navigate = useNavigate()
  const call = useGroupCallStore((s) => s.callsByGroup[groupId])
  const setCall = useGroupCallStore((s) => s.setCall)
  const store = useGroupCallStore.getState()

  const isGroupAdmin = isOwner || myRole === 'admin' || myRole === 'owner'
  const canStart = !call?.active && isGroupAdmin
  // Read-only check — voice/WebRTC stays owned by GroupCallBar to avoid double peer connections.
  const amInCall = !!call?.active && (call.participants ?? []).some((p) => p.user_name === myName)

  useEffect(() => {
    let cancelled = false
    getCallAPI(groupId)
      .then((r) => {
        if (!cancelled && r.data) setCall(r.data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  const doStart = async () => {
    try {
      const r = await startCallAPI(groupId)
      if (r.data) setCall(r.data)
      store.startCall(groupId)
      store.joinCall(groupId)
      navigate(`/home/groups/${groupId}/call`)
    } catch {
      toast.error('Could not start call')
    }
  }

  const doJoin = () => {
    store.joinCall(groupId)
    navigate(`/home/groups/${groupId}/call`)
  }

  // No call + no permission → no button at all
  if (!call?.active) {
    if (!canStart) return null
    return (
      <button
        type="button"
        onClick={doStart}
        aria-label="Start call"
        title="Start call"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5"
      >
        <Phone className="h-5 w-5" />
      </button>
    )
  }

  // Active call
  if (!amInCall) {
    return (
      <button
        type="button"
        onClick={doJoin}
        aria-label="Join call"
        title="Join live call"
        className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-[#0A1931]/5"
      >
        <Phone className="h-5 w-5" />
        <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 ring-2 ring-[#F5F5F0]" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate(`/home/groups/${groupId}/call`)}
      aria-label="Return to call"
      title="Return to call (you're on this call)"
      className="relative grid h-9 w-9 place-items-center rounded-full bg-green-600/10 text-green-700 hover:bg-green-600 hover:text-white"
    >
      <Phone className="h-5 w-5" />
      <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 ring-2 ring-[#F5F5F0]" />
    </button>
  )
}

export default function GroupCallBar({ groupId, myName }: { groupId: string; myName: string; myRole?: string | null; isOwner: boolean }) {
  const navigate = useNavigate()
  const call = useGroupCallStore((s) => s.callsByGroup[groupId])
  const setCall = useGroupCallStore((s) => s.setCall)
  // Voice stays mounted here so audio keeps playing while reading messages.
  // The call page mounts its own voice session when opened.
  const { amInCall, audioElements } = useGroupVoice(groupId, myName)

  useEffect(() => {
    let cancelled = false
    getCallAPI(groupId)
      .then((r) => {
        if (!cancelled && r.data) setCall(r.data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  // Idle state lives in the header button now — no banner when there's no live call.
  if (!call?.active) {
    return null
  }

  const count = call.participants?.length ?? 0

  return (
    <div className="border-b border-[#C9A86A]/60 bg-[#0A1931] text-white">
      <button
        type="button"
        onClick={() => navigate(`/home/groups/${groupId}/call`)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
      >
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-400" />
        <span className="min-w-0 flex-1 truncate text-sm">
          <span className="font-medium">Live call · {count} on call</span>
          <span className="text-white/60"> · 🎙 {call.speaker ?? '—'}</span>
        </span>
        <span className="shrink-0 bg-[#C9A86A] px-3 py-1.5 text-xs font-bold text-[#0A1931]">
          {amInCall ? 'Open call' : 'Join'}
        </span>
      </button>

      {/* remote audio */}
      {Object.entries(audioElements).map(([user, stream]) => (
        <RemoteAudio key={user} stream={stream} />
      ))}
    </div>
  )
}

function RemoteAudio({ stream }: { stream: MediaStream }) {
  return (
    <audio
      autoPlay
      playsInline
      ref={(el) => {
        if (el && el.srcObject !== stream) el.srcObject = stream
      }}
    />
  )
}
