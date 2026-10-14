import { useEffect, useState } from 'react'
import { BellRing, Check, Download, X } from 'lucide-react'
import { toast } from 'react-toastify'
import AppButton from '../../Shared/components/Button'
import {
  isMobilePhone,
  isPwaInstalled,
  promptPwaInstall,
  usePwaInstall,
} from '../../Shared/pwaInstall'
import { isPushConfigured } from '../../Shared/firebase'
import { enablePushOnThisDevice, pushFailureMessage } from './usePushSetup'

const DISMISS_KEY = 'vhennus-pwa-prompt-dismissed'

/**
 * Bottom-sheet shown once per session on the feeds page while the app
 * isn't fully set up (not installed as PWA and/or push not enabled).
 * Both actions need a real user tap, so this sheet *is* the gesture that
 * unlocks the install dialog and the notification permission dialog.
 */
const PwaInstallPrompt: React.FC = () => {
  const { canInstall } = usePwaInstall()
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState<'install' | 'notify' | null>(null)
  const [installed, setInstalled] = useState<boolean>(() =>
    typeof window === 'undefined' ? true : isPwaInstalled(),
  )
  const [perm, setPerm] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied',
  )
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Phones only — desktop and tablet never see this sheet.
    if (!isMobilePhone()) return
    if (sessionStorage.getItem(DISMISS_KEY)) return
    const fullyDone =
      isPwaInstalled() &&
      (!('Notification' in window) || Notification.permission === 'granted')
    if (fullyDone) return
    // Small delay so beforeinstallprompt has a chance to arrive first.
    const timer = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [canInstall])

  useEffect(() => {
    if (visible && installed && perm === 'granted') {
      const timer = setTimeout(() => {
        sessionStorage.setItem(DISMISS_KEY, '1')
        setVisible(false)
      }, 900)
      return () => clearTimeout(timer)
    }
  }, [visible, installed, perm])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  const handleInstall = async () => {
    if (busy) return
    if (!canInstall) {
      // iOS Safari and friends: no programmatic prompt — show manual steps.
      setShowIosHelp((v) => !v)
      return
    }
    setBusy('install')
    try {
      const outcome = await promptPwaInstall()
      if (outcome === 'accepted') {
        setInstalled(true)
        toast.success('Vhennus installed!')
      } else if (outcome === 'dismissed') {
        toast.info('Install dismissed — you can try again anytime.')
      }
    } finally {
      setBusy(null)
    }
  }

  const handleNotify = async () => {
    if (busy) return
    setBusy('notify')
    try {
      const result = await enablePushOnThisDevice()
      setPerm('Notification' in window ? Notification.permission : 'denied')
      if (result.ok) {
        toast.success('Push alerts enabled on this device.')
      } else {
        toast.error(pushFailureMessage(result.reason))
      }
    } finally {
      setBusy(null)
    }
  }

  if (!visible) return null

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
                Get the full Vhennus experience
              </h2>
              <p className="mt-0.5 text-xs text-[#4d5666]">
                Install the app and get alerts for likes, comments and votes.
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

        {/* Install row */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E8E0CF] p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0A1931]/5">
            <Download className="h-5 w-5 text-[#CC5A2A]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#0A1931]">Install the app</p>
            <p className="text-xs text-[#4d5666]">
              {installed ? 'Installed on this device' : 'Home-screen app, works offline'}
            </p>
          </div>
          {installed ? (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-700" />
            </span>
          ) : (
            <AppButton size="sm" loading={busy === 'install'} onClick={handleInstall}>
              Install
            </AppButton>
          )}
        </div>
        {showIosHelp && !installed && (
          <p className="mt-2 rounded-xl bg-[#F5F5F0] p-3 text-xs leading-relaxed text-[#4d5666]">
            To install: open your browser menu → "Add to Home Screen" (on
            iPhone: Share → Add to Home Screen), then reopen Vhennus from the
            new icon.
          </p>
        )}

        {/* Push row */}
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#E8E0CF] p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0A1931]/5">
            <BellRing className="h-5 w-5 text-[#CC5A2A]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#0A1931]">Push alerts</p>
            <p className="text-xs text-[#4d5666]">
              {!isPushConfigured
                ? 'Coming soon'
                : perm === 'granted'
                  ? 'On — alerts enabled'
                  : perm === 'denied'
                    ? 'Blocked — allow in browser site settings'
                    : 'Get notified even when the app is closed'}
            </p>
          </div>
          {perm === 'granted' ? (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-700" />
            </span>
          ) : (
            <AppButton
              size="sm"
              loading={busy === 'notify'}
              disabled={!isPushConfigured || perm === 'denied'}
              onClick={handleNotify}
            >
              Enable
            </AppButton>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-3 w-full py-2 text-center text-sm font-medium text-[#4d5666] hover:text-[#0A1931]"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

export default PwaInstallPrompt
