import { useEffect, useRef, useState } from 'react'
import { useGroupCallStore } from './useGroupCallStore'
import { useGroupStore } from './useGroupStore'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: import.meta.env.VITE_STUN_URL ?? 'stun:stun.l.google.com:19302' },
  ...(import.meta.env.VITE_TURN_URL
    ? [
        {
          urls: import.meta.env.VITE_TURN_URL,
          username: import.meta.env.VITE_TURN_USER ?? '',
          credential: import.meta.env.VITE_TURN_PASS ?? '',
        } as RTCIceServer,
      ]
    : []),
]

/**
 * Star-mesh audio: speaker publishes 1 PC per listener, listeners are recvonly.
 * Signaling goes over the existing group WS (call_offer/answer/ice).
 * Server guarantees only the speaker's offers are forwarded.
 */
export function useGroupVoice(groupId: string, myName: string) {
  const call = useGroupCallStore((s) => s.callsByGroup[groupId])
  const [micError, setMicError] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<Record<string, MediaStream>>({})
  const pcs = useRef<Map<string, RTCPeerConnection>>(new Map())
  const micStream = useRef<MediaStream | null>(null)

  const amInCall = !!call?.active && (call.participants ?? []).some((p) => p.user_name === myName)
  const amSpeaker = !!call?.active && call.speaker === myName

  const send = (frame: object) => useGroupStore.getState().sender?.(frame)

  const closePeer = (user: string) => {
    pcs.current.get(user)?.close()
    pcs.current.delete(user)
    setAudioElements((prev) => {
      if (!(user in prev)) return prev
      const next = { ...prev }
      delete next[user]
      return next
    })
  }

  const closeAll = () => {
    for (const [, pc] of pcs.current) {
      try {
        pc.close()
      } catch {
        /* ignore */
      }
    }
    pcs.current.clear()
    setAudioElements({})
  }

  // Speaker: ensure mic
  useEffect(() => {
    if (!amSpeaker) return
    let cancelled = false
    setMicError(null)
    navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        micStream.current = s
        // (re)offer to every listener
        const listeners = (call?.participants ?? []).map((p) => p.user_name).filter((u) => u !== myName)
        for (const to of listeners) void offerTo(to)
      })
      .catch(() => {
        if (!cancelled) setMicError('Mic blocked — listening only. Allow mic access to speak.')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amSpeaker, call?.version])

  // Speaker: drop PCs for users who left
  useEffect(() => {
    if (!amSpeaker || !call) return
    const alive = new Set(call.participants.map((p) => p.user_name))
    for (const user of [...pcs.current.keys()]) {
      if (!alive.has(user) || user === myName) closePeer(user)
    }
    // offer to newcomers
    for (const p of call.participants) {
      if (p.user_name !== myName && !pcs.current.has(p.user_name)) void offerTo(p.user_name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call?.version])

  // Role change / leave: tear down everything, listener side rebuilds on next offer
  useEffect(() => {
    if (!amInCall) {
      closeAll()
      micStream.current?.getTracks().forEach((t) => t.stop())
      micStream.current = null
    } else if (!amSpeaker) {
      // was speaker, now listener: stop mic + speaker PCs
      micStream.current?.getTracks().forEach((t) => t.stop())
      micStream.current = null
      closeAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amSpeaker, amInCall])

  async function offerTo(to: string) {
    if (!micStream.current) return
    closePeer(to)
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    micStream.current.getTracks().forEach((t) => pc.addTrack(t, micStream.current!))
    pc.onicecandidate = (e) => {
      if (e.candidate) send({ type: 'call_ice', group_id: groupId, to, candidate: JSON.stringify(e.candidate) })
    }
    pcs.current.set(to, pc)
    try {
      const offer = await pc.createOffer({ offerToReceiveAudio: false })
      await pc.setLocalDescription(offer)
      send({ type: 'call_offer', group_id: groupId, to, sdp: JSON.stringify(offer) })
    } catch {
      closePeer(to)
    }
  }

  // Listener + speaker signaling events
  useEffect(() => {
    const handler = async (e: Event) => {
      const frame = (e as CustomEvent).detail as
        | { type: string; group_id: string; from: string; sdp?: string; candidate?: string }
      if (!frame || frame.group_id !== groupId) return
      if (frame.type === 'call_offer' && !amSpeaker && amInCall && frame.sdp) {
        // incoming speaker stream
        const from = frame.from
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
        pc.ontrack = (ev) => {
          const stream = ev.streams[0]
          if (stream) setAudioElements((prev) => ({ ...prev, [from]: stream }))
        }
        pc.onicecandidate = (ev) => {
          if (ev.candidate) send({ type: 'call_ice', group_id: groupId, to: from, candidate: JSON.stringify(ev.candidate) })
        }
        pcs.current.set(from, pc)
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(frame.sdp)))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          send({ type: 'call_answer', group_id: groupId, to: from, sdp: JSON.stringify(answer) })
        } catch {
          closePeer(from)
        }
      } else if (frame.type === 'call_answer' && amSpeaker && frame.sdp) {
        const pc = pcs.current.get(frame.from)
        if (pc && pc.signalingState !== 'closed') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(frame.sdp)))
          } catch {
            /* ignore stale answer */
          }
        }
      } else if (frame.type === 'call_ice' && frame.candidate) {
        const pc = pcs.current.get(frame.from)
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(frame.candidate)))
          } catch {
            /* ignore */
          }
        }
      }
    }
    window.addEventListener('group-rtc', handler)
    return () => window.removeEventListener('group-rtc', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, amSpeaker, amInCall])

  useEffect(() => () => closeAll(), [])

  return { call, amInCall, amSpeaker, micError, audioElements }
}
