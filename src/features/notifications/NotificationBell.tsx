import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  getUnreadCount,
  listNotifications,
  markNotificationsRead,
  type AppNotification,
} from './api'
import { subscribeForegroundPush } from '../../Shared/firebase'
import RelativeTime from '../../Shared/components/RelativeTime'

const POLL_MS = 30000

const NotificationBell: React.FC = () => {
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [items, setItems] = useState<AppNotification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const refreshCount = useCallback(async () => {
    try {
      const result = await getUnreadCount()
      setUnread(result.data?.count ?? 0)
    } catch {
      /* badge is best-effort */
    }
  }, [])

  const refreshItems = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listNotifications(10, 0)
      setItems(result.data ?? [])
    } catch {
      /* dropdown is best-effort */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCount()
    const timer = setInterval(refreshCount, POLL_MS)
    const unsubscribe = subscribeForegroundPush(() => {
      refreshCount()
      if (open) refreshItems()
    })
    return () => {
      clearInterval(timer)
      unsubscribe()
    }
  }, [refreshCount, refreshItems, open])

  useEffect(() => {
    if (!open) return
    refreshItems()
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open, refreshItems])

  const handleOpenItem = async (item: AppNotification) => {
    setOpen(false)
    if (!item.is_read) {
      try {
        await markNotificationsRead([item.id])
      } catch {
        /* non-blocking */
      }
      setUnread((c) => Math.max(0, c - 1))
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)))
    }
    if (item.link) navigate(item.link)
  }

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead()
      setUnread(0)
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch {
      /* non-blocking */
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-10 w-10 place-items-center rounded-full text-[#0A1931] transition-colors hover:bg-[#0A1931]/5"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#CC5A2A] px-1 text-[11px] font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-[#E8E0CF] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-[#0A1931]">Notifications</p>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#CC5A2A] hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  navigate('/home/notifications')
                }}
                className="text-xs font-semibold text-[#0A1931] hover:underline"
              >
                View all
              </button>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">
                You're all caught up.
              </p>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className={[
                    'flex w-full gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#F5F5F0]',
                    !item.is_read ? 'bg-[#C9A86A]/10' : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      item.is_read ? 'bg-transparent' : 'bg-[#CC5A2A]',
                    ].join(' ')}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#0A1931]">
                      {item.title}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-[#4d5666]">
                      {item.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      <RelativeTime date={item.created_at} />
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
