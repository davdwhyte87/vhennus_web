import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Phone } from 'lucide-react'
import { useGroupCallStore } from '../useGroupCallStore'
import { useGroupStore } from '../useGroupStore'
import { useAuthStore } from '../../auth/useAuthStore'

/** Short two-tone ring via WebAudio — no asset needed. Best-effort (autoplay policies may block it). */
function playCallRing() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const times = [0, 0.35, 0.9, 1.25]
    const freqs = [880, 660, 880, 660]
    times.forEach((t, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freqs[i]
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + t + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + t)
      osc.stop(ctx.currentTime + t + 0.32)
    })
    setTimeout(() => void ctx.close(), 2200)
  } catch {
    /* audio is best-effort */
  }
}

/**
 * App-wide live-call presence. Mount once inside HomeLayout (above the page
 * content) so members learn about a call without opening the group:
 *  - slim banner for every active call except the group currently open
 *    (that one is already covered by GroupCallBar)
 *  - toast + ring the moment a new call starts elsewhere
 *
 * Call state arrives over the existing group WS (`call_state` is broadcast to
 * all online members), so no polling is needed here. GroupsListPage does a
 * one-off `getCallAPI` sweep for calls that started before this tab opened.
 */
export default function GlobalCallBanner() {
  const navigate = useNavigate()
  const location = useLocation()
  const myName = useAuthStore((s) => s.authUserName ?? '')
  const callsByGroup = useGroupCallStore((s) => s.callsByGroup)
  const myGroups = useGroupStore((s) => s.groups)

  const openMatch = location.pathname.match(/\/home\/groups\/([^/]+)/)
  const openGroupId = openMatch?.[1] && openMatch[1] !== 'join' ? openMatch[1] : null

  const liveCalls = Object.values(callsByGroup).filter(
    (c) => c.active && c.group_id !== openGroupId,
  )
  const names = new Map(myGroups.map((g) => [g.id, g.name]))
  const nameOf = (id: string) => names.get(id) ?? 'Group'

  // Toast + ring on transitions to active (skip the call I started myself,
  // and skip the group I'm already looking at).
  const prevActive = useRef<Set<string>>(new Set())
  useEffect(() => {
    const nowActive = new Set(
      Object.values(callsByGroup)
        .filter((c) => c.active)
        .map((c) => c.group_id),
    )
    for (const id of nowActive) {
      if (prevActive.current.has(id)) continue
      const call = callsByGroup[id]
      if (call?.started_by === myName) continue
      if (id === openGroupId) continue
      playCallRing()
      toast.info(`Live call started in ${nameOf(id)} — tap to join`, {
        onClick: () => navigate(`/home/groups/${id}/call`),
      })
    }
    prevActive.current = nowActive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callsByGroup])

  if (liveCalls.length === 0) return null

  return (
    <div className="space-y-2 pt-4">
      {liveCalls.map((call) => {
        const count = call.participants?.length ?? 0
        const amIn = (call.participants ?? []).some((p) => p.user_name === myName)
        const open = () => {
          if (!amIn) useGroupCallStore.getState().joinCall(call.group_id)
          navigate(`/home/groups/${call.group_id}/call`)
        }
        return (
          <button
            key={call.group_id}
            type="button"
            onClick={open}
            className="flex w-full items-center gap-2.5 bg-[#0A1931] px-4 py-2.5 text-left text-sm text-white shadow-md"
          >
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-green-400" />
            <span className="min-w-0 flex-1 truncate">
              <span className="font-medium text-green-300">Live</span>
              <span className="text-white/80"> in {nameOf(call.group_id)}</span>
              <span className="text-white/60"> · {count} on call</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 bg-[#C9A86A] px-3 py-1.5 text-xs font-bold text-[#0A1931]">
              <Phone className="h-3.5 w-3.5" /> {amIn ? 'Return' : 'Join'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
