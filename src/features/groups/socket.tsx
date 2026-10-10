import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuthStore } from '../auth/useAuthStore'
import { useGroupStore } from './useGroupStore'
import type { GroupMessage } from './api'

export type GroupServerFrame =
  | { type: 'joined'; groups: string[] }
  | { type: 'sent'; temp_id?: string | null; message: GroupMessage }
  | { type: 'new'; message: GroupMessage }
  | { type: 'unread'; total: number; groups: { group_id: string; unread: number }[] }
  | { type: 'error'; temp_id?: string | null; message: string }
  | { type: 'presence'; group_id: string; online: string[] }

interface WsGroupContextType {
  isConnected: boolean
}

export const WsGroupContext = createContext<WsGroupContextType | undefined>(undefined)

export const useWsGroup = () => {
  const context = useContext(WsGroupContext)
  if (!context) throw new Error('useWsGroup must be used within WsGroupProvider')
  return context
}

const WS_URL =
  import.meta.env.VITE_WS_GROUP ?? 'ws://localhost:8000/group/ws'

export const WSGroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    const store = useGroupStore.getState()
    if (!token) {
      setIsConnected(false)
      store.setSender(null)
      store.setConnected(false)
      return
    }

    const handleFrame = (frame: GroupServerFrame) => {
      const st = useGroupStore.getState()
      switch (frame.type) {
        case 'sent':
          if (frame.temp_id && frame.message) st.confirmSent(frame.temp_id, frame.message)
          else if (frame.message) st.ingestNew(frame.message)
          break
        case 'new':
          if (frame.message) {
            st.ingestNew(frame.message)
            st.refreshUnread()
          }
          break
        case 'unread':
          if (typeof frame.total === 'number') {
            const map: Record<string, number> = {}
            for (const g of frame.groups ?? []) map[g.group_id] = g.unread
            st.setUnread(frame.total, map)
          }
          break
        case 'error':
          if (frame.temp_id) st.failSend(frame.temp_id)
          toast.error(frame.message || 'Group message failed')
          break
        case 'joined':
        case 'presence':
          break
        default:
          break
      }
    }

    const handleStatus = (status: boolean) => {
      setIsConnected(status)
      useGroupStore.getState().setConnected(status)
    }

    const client = new GroupClient(handleFrame, handleStatus)
    useGroupStore.getState().setSender((frame: object) => client.send(frame))
    store.refreshUnread()
    const poll = setInterval(() => useGroupStore.getState().refreshUnread(), 30000)

    return () => {
      clearInterval(poll)
      client.disconnect()
    }
  }, [token])

  return <WsGroupContext.Provider value={{ isConnected }}>{children}</WsGroupContext.Provider>
}

type MessageHandler = (frame: GroupServerFrame) => void
type StatusHandler = (ok: boolean) => void

class GroupClient {
  private socket: WebSocket | null = null
  private attempts = 0
  private maxAttempts = 15
  private timer: number | undefined
  private shouldReconnect = true
  private reconnecting = false
  private onFrame: MessageHandler
  private onStatus: StatusHandler

  constructor(onFrame: MessageHandler, onStatus: StatusHandler) {
    this.onFrame = onFrame
    this.onStatus = onStatus
    this.connect()
  }

  private token(): string | null {
    return useAuthStore.getState().token
  }

  private connect(): void {
    if (this.reconnecting || !this.shouldReconnect) return
    const token = this.token()
    if (!token) {
      this.onStatus(false)
      return
    }
    if (this.attempts >= this.maxAttempts) {
      this.onStatus(false)
      return
    }
    try {
      this.reconnecting = true
      this.socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`)
      this.socket.onopen = () => {
        this.attempts = 0
        this.reconnecting = false
        this.onStatus(true)
      }
      this.socket.onmessage = (evt: MessageEvent) => {
        try {
          const frame = JSON.parse(evt.data)
          if (frame && typeof frame.type === 'string') this.onFrame(frame as GroupServerFrame)
        } catch {
          // ignore malformed frames
        }
      }
      this.socket.onclose = () => {
        this.onStatus(false)
        this.reconnecting = false
        if (this.shouldReconnect) this.schedule()
      }
      this.socket.onerror = () => {
        // onclose handles reconnect
      }
    } catch {
      this.schedule()
    }
  }

  private schedule(): void {
    const delay = Math.min(1000 * Math.pow(2, this.attempts) + Math.random() * 500, 30000)
    this.timer = setTimeout(() => {
      this.attempts++
      this.connect()
    }, Math.floor(delay)) as unknown as number
  }

  public send(data: object): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }

  public disconnect(): void {
    this.shouldReconnect = false
    if (this.timer) clearTimeout(this.timer)
    if (this.socket) {
      this.socket.close(1000, 'unmount')
      this.socket = null
    }
    this.onStatus(false)
  }
}

export default GroupClient
