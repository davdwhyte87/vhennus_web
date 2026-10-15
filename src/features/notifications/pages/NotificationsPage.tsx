import { useCallback, useEffect, useState } from 'react'
import {
  BarChart3,
  Bell,
  BellOff,
  CheckCheck,
  Heart,
  Megaphone,
  MessageSquare,
  Smartphone,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import BackNav from '../../../Shared/components/BackNav'
import RelativeTime from '../../../Shared/components/RelativeTime'
import AppButton from '../../../Shared/components/Button'
import {
  copyPushToken,
  getPushDiagnostic,
  isPushConfigured,
  pushSupport,
  startForegroundPushListener,
  subscribeForegroundPush,
  type PushDiagnostic,
} from '../../../Shared/firebase'
import { enablePushOnThisDevice, pushFailureMessage } from '../usePushSetup'
import {
  listNotifications,
  markNotificationsRead,
  type AppNotification,
} from '../api'

const PAGE_SIZE = 20

function kindIcon(kind: string) {
  const cls = 'h-4 w-4'
  switch (kind) {
    case 'like':
      return <Heart className={cls} />
    case 'poll_vote':
      return <BarChart3 className={cls} />
    case 'friend_request':
      return <UserPlus className={cls} />
    case 'friend_accepted':
      return <UserCheck className={cls} />
    case 'broadcast':
      return <Megaphone className={cls} />
    case 'comment':
    default:
      return <MessageSquare className={cls} />
  }
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState<AppNotification[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [enabling, setEnabling] = useState(false)
  const [diagnostic, setDiagnostic] = useState<PushDiagnostic | null>(null)
  const [copied, setCopied] = useState(false)
  const [permission, setPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported',
  )

  const loadMore = useCallback(
    async (reset = false) => {
      if (loading) return
      setLoading(true)
      try {
        const nextOffset = reset ? 0 : offset
        const result = await listNotifications(PAGE_SIZE, nextOffset)
        const data = result.data ?? []
        setItems((prev) => (reset ? data : [...prev, ...data]))
        setOffset(nextOffset + data.length)
        setHasMore(data.length === PAGE_SIZE)
      } catch {
        toast.error('Could not load notifications')
      } finally {
        setLoading(false)
      }
    },
    [loading, offset],
  )

  useEffect(() => {
    loadMore(true)
    startForegroundPushListener()
    getPushDiagnostic()
      .then(setDiagnostic)
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Refresh-only: the global toast lives in HomeLayout (avoids doubles).
    const unsubscribe = subscribeForegroundPush(() => {
      loadMore(true)
    })
    return unsubscribe
  }, [loadMore])

  const handleEnablePush = async () => {
    setEnabling(true)
    try {
      const result = await enablePushOnThisDevice()
      setPermission(
        'Notification' in window ? Notification.permission : 'unsupported',
      )
      if (result.ok) {
        toast.success('Push notifications enabled on this device.')
      } else {
        toast.error(pushFailureMessage(result.reason))
      }
    } catch {
      toast.error('Could not enable push notifications.')
    } finally {
      setEnabling(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead()
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success('All marked as read')
    } catch {
      toast.error('Could not update notifications')
    }
  }

  const handleOpenItem = async (item: AppNotification) => {
    if (!item.is_read) {
      try {
        await markNotificationsRead([item.id])
      } catch {
        /* non-blocking */
      }
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n)),
      )
    }
    if (item.link) navigate(item.link)
  }

  const pushState = !isPushConfigured
    ? 'unconfigured'
    : pushSupport() === 'unsupported'
      ? 'unsupported'
      : permission

  return (
    <div className="min-h-screen">
      <BackNav title="Notifications" />

      <main className="mx-auto w-full max-w-xl px-4 pb-10 pt-4 sm:px-2">
        {/* Push settings */}
        <section className="rounded-2xl border border-[#E8E0CF] bg-white p-4 shadow-[0_1px_2px_rgba(10,25,49,0.06)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0A1931]/5">
              {permission === 'granted' ? (
                <Bell className="h-5 w-5 text-[#CC5A2A]" />
              ) : (
                <BellOff className="h-5 w-5 text-[#4d5666]" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#0A1931]">Push notifications</p>
              <p className="truncate text-xs text-[#4d5666]">
                {pushState === 'granted' && 'On — you get alerts even when the app is closed'}
                {pushState === 'denied' && 'Blocked — allow them in browser site settings'}
                {pushState === 'default' && 'Off — enable to get alerts on this device'}
                {pushState === 'unsupported' && 'Not supported on this browser'}
                {pushState === 'unconfigured' && 'Coming soon — almost ready'}
              </p>
            </div>
          </div>
          {pushState !== 'granted' && pushState !== 'unconfigured' && (
            <AppButton
              size="sm"
              fullWidth
              loading={enabling}
              onClick={handleEnablePush}
              className="mt-3"
            >
              <Smartphone className="h-4 w-4" />
              Enable push on this device
            </AppButton>
          )}

          {/* On-device diagnostics: read these off the phone screen. */}
          <div className="mt-3 rounded-xl bg-[#0A1931] p-3 font-mono text-[11px] leading-relaxed text-[#C9A86A]">
            {!diagnostic ? (
              <p>Reading device state…</p>
            ) : (
              <>
                <p>config: {diagnostic.configured ? 'baked ✓' : 'MISSING'}</p>
                <p>permission: {diagnostic.permission}</p>
                {diagnostic.workers.length === 0 && <p>workers: none!</p>}
                {diagnostic.workers.map((w) => (
                  <p key={w.scriptURL + w.scope}>
                    worker: {w.scriptURL.split('/').pop()} [{w.state}]
                  </p>
                ))}
                <p>
                  token:{' '}
                  {diagnostic.tokenPreview
                    ? `${diagnostic.tokenPreview} (${diagnostic.tokenLength} chars)`
                    : 'none'}
                </p>
              </>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <AppButton
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => {
                getPushDiagnostic()
                  .then(setDiagnostic)
                  .catch(() => {})
              }}
            >
              Refresh status
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              fullWidth
              onClick={async () => {
                const ok = await copyPushToken()
                if (ok) {
                  setCopied(true)
                  toast.success('Token copied — paste into Firebase console test.')
                  setTimeout(() => setCopied(false), 2000)
                } else {
                  toast.error('No token to copy — enable push first.')
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy FCM token'}
            </AppButton>
          </div>
        </section>

        {/* Inbox header */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-bold text-[#0A1931]">Inbox</p>
          {items.some((n) => !n.is_read) && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#CC5A2A] hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <section className="mt-2 overflow-hidden rounded-2xl border border-[#E8E0CF] bg-white shadow-[0_1px_2px_rgba(10,25,49,0.06)]">
          {items.length === 0 && !loading ? (
            <div className="px-4 py-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0A1931]/5">
                <Bell className="h-6 w-6 text-[#4d5666]" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0A1931]">No notifications yet</p>
              <p className="mt-1 text-xs text-[#4d5666]">
                Likes, comments, poll votes and friend activity will show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className={[
                    'flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F5F5F0]',
                    !item.is_read ? 'bg-[#C9A86A]/10' : '',
                  ].join(' ')}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0A1931] text-[#C9A86A]">
                    {kindIcon(item.kind)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#0A1931]">
                        {item.title}
                      </span>
                      {!item.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#CC5A2A]" />
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-[#4d5666]">
                      {item.body}
                    </span>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      <RelativeTime date={item.created_at} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {hasMore && items.length > 0 && (
          <AppButton
            variant="outline"
            size="sm"
            fullWidth
            loading={loading}
            onClick={() => loadMore(false)}
            className="mt-3"
          >
            Load more
          </AppButton>
        )}
      </main>
    </div>
  )
}

export default NotificationsPage
