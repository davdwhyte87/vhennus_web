import { create } from 'zustand'
import type { GroupCallState } from './api'
import { useGroupStore } from './useGroupStore'

interface GroupCallStore {
  callsByGroup: Record<string, GroupCallState>
  setCall: (call: GroupCallState) => void
  send: (frame: object) => void
  startCall: (groupId: string) => void
  joinCall: (groupId: string) => void
  leaveCall: (groupId: string) => void
  endCall: (groupId: string) => void
  raiseHand: (groupId: string) => void
  lowerHand: (groupId: string) => void
  grantMic: (groupId: string, to: string) => void
  revokeMic: (groupId: string) => void
}

export const useGroupCallStore = create<GroupCallStore>()((set) => ({
  callsByGroup: {},

  setCall: (call) =>
    set((s) => {
      const prev = s.callsByGroup[call.group_id]
      // version guard: ignore stale/out-of-order states
      if (prev && prev.active && call.active && call.version < prev.version) return s
      return { callsByGroup: { ...s.callsByGroup, [call.group_id]: call } }
    }),

  send: (frame) => {
    useGroupStore.getState().sender?.(frame)
  },

  startCall: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'call_start', group_id: groupId })
  },
  joinCall: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'call_join', group_id: groupId })
  },
  leaveCall: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'call_leave', group_id: groupId })
  },
  endCall: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'call_end', group_id: groupId })
  },
  raiseHand: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'raise_hand', group_id: groupId })
  },
  lowerHand: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'lower_hand', group_id: groupId })
  },
  grantMic: (groupId, to) => {
    useGroupStore.getState().sender?.({ type: 'grant_mic', group_id: groupId, to })
  },
  revokeMic: (groupId) => {
    useGroupStore.getState().sender?.({ type: 'revoke_mic', group_id: groupId })
  },
}))
