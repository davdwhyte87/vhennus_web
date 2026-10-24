import { useEffect, useState } from 'react'
import { BellRing, Check, Download, X } from 'lucide-react'
import { toast } from 'react-toastify'
import AppButton from '../../Shared/components/Button'
import {
  isMobilePhone,
  isPwaInstalled,
  promptPwaInstall,
  requestNotificationPermission,
  usePwaInstall,
} from '../../Shared/pwaInstall'
import { isPushConfigured } from '../../Shared/firebase'
import { enablePushOnThisDevice, pushFailureMessage } from './usePushSetup'

/** Session flag: the installed app asks for notifications once per launch. */
const PUSH_PROMPT_KEY = 'vhennus.pushPromptShown'

/**
 * Bottom-sheet shown on the feeds page (phones only).
 *
 * Two modes:
 *  - Not installed: ONE button installs the PWA and enables alerts. The
 *    permission request and the install prompt are both started inside the
 *    same tap, because the browser drops the permission dialog if it is
 *    requested after an await (i.e. after the install prompt resolves).
 *  - Installed but notifications still undecided: browsers never ask on
 *    their own, so the sheet appears once per session with an "Enable
 *    alerts" button. This is the only way to turn push on inside the
 *    installed app (and the only way at all on iOS).
 *
 * Detection: `display-mode: standalone` tells us we're inside the installed
 * app; `beforeinstallprompt` only fires when the app is NOT installed.
 */
const PwaInstallPrompt: React.FC = () => {
  const { canInstall } = usePwaInstall()
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [installed, setInstalled] = useState<boolean>(() =>
    typeof window === 'undefined' ? true : isPwaInstalled(),
  )
  const [perm, setPerm] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported',
  )

  const pushSupported = typeof Notification !== 'undefined'
  const pushWanted = isPushConfigured && pushSupported && perm !== 'granted'

  // Keep the local `installed` flag in sync when the app is installed from
  // the browser menu (not through our button).
  useEffect(() => {
    const onInstalled = () => setInstalled(true)
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  // Re-read permission when the user comes back from browser settings.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setPerm(
          'Notification' in window ? Notification.permission : 'unsupported',
        )
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Phones only — desktop and tablet never see this sheet.
    if (!isMobilePhone()) return
    if (!isPushConfigured) return

    if (isPwaInstalled()) {
      // Inside the installed app the browser never asks for notification
      // permission by itself. Prompt once per session until the user decides
      // (a denial switches permission to "denied", which stops it for good).
      if (typeof Notification === 'undefined') return
      if (Notification.permission !== 'default') return
      try {
        if (sessionStorage.getItem(PUSH_PROMPT_KEY) === '1') return
        sessionStorage.setItem(PUSH_PROMPT_KEY, '1')
      } catch {
        /* storage unavailable — show it anyway */
      }
    } else {
      // beforeinstallprompt fires only when the app is NOT installed, so this
      // is our positive not-installed signal. No event (already installed,
      // unsupported browser) → stay quiet.
      if (!canInstall) return
    }

    // Small delay so the sheet doesn't jump in instantly on page open.
    const timer = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [canInstall])

  // Auto-close shortly after everything is done.
  useEffect(() => {
    if (visible && installed && !pushWanted) {
      const timer = setTimeout(() => setVisible(false), 900)
      return () => clearTimeout(timer)
    }
  }, [visible, installed, pushWanted])

  const dismiss = () => setVisible(false)

  const refreshPerm = () =>
    setPerm(
      'Notification' in window ? Notification.permission : 'unsupported',
    )

  /** Step 2 of the combined flow. */
  const enableAlerts = async (): Promise<boolean> => {
    if (!isPushConfigured) return true
    const result = await enablePushOnThisDevice()
    refreshPerm()
    if (result.ok) {
      toast.success('Push alerts enabled on this device.')
      return true
    }
    toast.error(pushFailureMessage(result.reason))
    return false
  }

  /** The single combined action: install, then enable alerts. */
  const handleSetup = async () => {
    if (busy) return
    setBusy(true)
    try {
      // Read the live value — the `perm` state may be stale.
      let permission: NotificationPermission | 'unsupported' =
        'Notification' in window ? Notification.permission : 'unsupported'

      if (!installed) {
        // Both APIs need the tap's user activation. Start the install prompt
        // and the permission request in the SAME task (before awaiting) so
        // the browser does not drop either one.
        const installPromise = promptPwaInstall()
        const permissionPromise =
          pushWanted && permission === 'default'
            ? requestNotificationPermission()
            : Promise.resolve(permission)
        const outcome = await installPromise
        permission = await permissionPromise
        refreshPerm()

        if (outcome === 'accepted') {
          setInstalled(true)
          toast.success('Vhennus installed!')
        } else if (outcome === 'dismissed') {
          toast.info('Install dismissed — tap again anytime to retry.')
        } else {
          toast.info('Install is not available right now — try Menu → Install App.')
        }
        // Even if the install was dismissed, a granted permission still
        // lets us register push for this origin (it survives installation).
      } else if (pushWanted) {
        // Installed app: this tap is the user gesture the browser needs.
        if (permission === 'denied') {
          toast.error(
            'Notifications are blocked — allow them in your browser site settings.',
          )
          return
        }
        if (permission === 'default') {
          permission = await requestNotificationPermission()
          refreshPerm()
        }
      }

      // Mint + register the token now that permission may have been granted.
      // If the user left the dialog undecided, the sheet stays open and the
      // button retries on the next tap.
      if (isPushConfigured && permission === 'granted') {
        await enableAlerts()
      }
    } finally {
      setBusy(false)
    }
  }

  if (!visible) return null

  const primaryLabel = !installed
    ? pushWanted
      ? 'Install & enable alerts'
      : 'Install app'
    : pushWanted
      ? 'Enable alerts'
      : 'Done'

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Install Vhennus">
      <div className="absolute inset-0 bg-black/50" onClick={dismiss} />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-xl rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#0A1931] font-serif text-2xl font-bold text-[#C9A86A]">
              V
            </span>
            <div>
              <h2 className="font-serif text-lg leading-tight text-[#0A1931]">
                {installed
                  ? 'Turn on notifications'
                  : 'Get the full Vhennus experience'}
              </h2>
              <p className="mt-0.5 text-xs text-[#4d5666]">
                {installed
                  ? 'Get alerts for likes, comments and votes — even when the app is closed.'
                  : 'Install the app and get alerts for likes, comments and votes.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Combined status */}
        <div className="mt-4 space-y-2 rounded-2xl border border-[#E8E0CF] p-3">
          <StatusRow
            icon={<Download className="h-4 w-4 text-[#CC5A2A]" />}
            label="App installed"
            done={installed}
          />
          <StatusRow
            icon={<BellRing className="h-4 w-4 text-[#CC5A2A]" />}
            label={
              !isPushConfigured
                ? 'Push alerts (coming soon)'
                : !pushSupported
                  ? 'Push alerts (not supported here)'
                  : perm === 'granted'
                    ? 'Push alerts on'
                    : perm === 'denied'
                      ? 'Push alerts blocked — allow in browser settings'
                      : 'Push alerts'
            }
            done={perm === 'granted'}
            dimmed={!isPushConfigured || !pushSupported}
          />
        </div>

        <AppButton
          fullWidth
          loading={busy}
          onClick={handleSetup}
          className="mt-3 rounded-full py-3.5"
        >
          {primaryLabel}
        </AppButton>

        <button
          type="button"
          onClick={dismiss}
          className="mt-1 w-full py-2 text-center text-sm font-medium text-[#4d5666] hover:text-[#0A1931]"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

const StatusRow: React.FC<{
  icon: React.ReactNode
  label: string
  done: boolean
  dimmed?: boolean
}> = ({ icon, label, done, dimmed = false }) => (
  <div className="flex items-center gap-3">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0A1931]/5">
      {icon}
    </span>
    <p
      className={[
        'min-w-0 flex-1 text-sm font-medium',
        dimmed ? 'text-gray-400' : 'text-[#0A1931]',
      ].join(' ')}
    >
      {label}
    </p>
    {done ? (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-100">
        <Check className="h-4 w-4 text-green-700" />
      </span>
    ) : (
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-200" />
    )}
  </div>
)

export default PwaInstallPrompt
