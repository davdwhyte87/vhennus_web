import { useEffect, useState } from 'react'

/** Minimal shape of the non-standard BeforeInstallPromptEvent. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: InstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()

function emit() {
  for (const fn of listeners) fn()
}

function snapshot() {
  return { canInstall: deferredPrompt !== null, installed }
}

/** Call once at startup — captures the install prompt for on-demand use. */
export function initPwaInstallCapture() {
  if (typeof window === 'undefined') return
  installed =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as unknown as InstallPromptEvent
    emit()
  })
  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    emit()
  })
  emit()
}

/** Reactive install availability for menu rows. */
export function usePwaInstall() {
  const [state, setState] = useState(snapshot)
  useEffect(() => {
    const fn = () => setState(snapshot())
    listeners.add(fn)
    setState(snapshot())
    return () => {
      listeners.delete(fn)
    }
  }, [])
  return state
}

export function isPwaInstalled() {
  return (
    installed ||
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

/** True only on mobile phones (not desktop, not tablet). */
export function isMobilePhone(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }
  const nav = navigator as Navigator & {
    userAgentData?: { mobile?: boolean }
  }
  if (typeof nav.userAgentData?.mobile === 'boolean') {
    return nav.userAgentData.mobile
  }
  const ua = navigator.userAgent || ''
  if (/iPad|Tablet/i.test(ua)) return false
  return /Mobi|Android|iPhone|iPod/i.test(ua)
}

/** Shows the browser install dialog. Returns the outcome. */
export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable'
  await deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    deferredPrompt = null
    installed = true
    emit()
  }
  return outcome
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

/** Asks for the notification permission. Returns the final state. */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission
  }
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/** Registers /sw.js in production only. Safe to call multiple times. */
let swRegistered = false
export function registerServiceWorker() {
  if (swRegistered || typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  if (!import.meta.env.PROD) return
  swRegistered = true
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline-first is best-effort */
    })
  })
}
