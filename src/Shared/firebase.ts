/**
 * Firebase Cloud Messaging (web push) helpers.
 *
 * Setup (one time): in the Firebase console create a Web app for the
 * project used by the server (vhennus-dev / vhennus-916a0), copy its config
 * into the VITE_FIREBASE_* vars in vhennus_web/.env, and add a Web Push
 * certificate (VAPID key) under Project settings -> Cloud Messaging as
 * VITE_FIREBASE_VAPID_KEY. The .env file is the only place keys live — the
 * app forwards them to the service worker at runtime (service workers can't
 * read Vite env vars). Until the vars are set every helper is a safe no-op.
 */

export interface FirebaseWebConfig {
  apiKey: string
  authDomain: string
  projectId: string
  messagingSenderId: string
  appId: string
}

function readConfig(): FirebaseWebConfig | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined
  const appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined
  if (!apiKey || !projectId || !messagingSenderId || !appId) return null
  return { apiKey, authDomain: authDomain ?? '', projectId, messagingSenderId, appId }
}

export const isPushConfigured = readConfig() !== null

if (typeof window !== 'undefined') {
  // Secret-free: boolean only, never logs the keys themselves.
  console.info('[push] FCM configured:', isPushConfigured)
}

/**
 * Forwards the Firebase web config to the active service worker so it can
 * show background notifications. Service workers are static files and
 * can't read Vite env vars — this postMessage bridge keeps .env as the
 * single source of truth. Safe to call repeatedly; the worker inits once.
 */
export async function configureServiceWorkerPush(): Promise<boolean> {
  const config = readConfig()
  if (!config || pushSupport() === 'unsupported') return false
  try {
    const registration = await navigator.serviceWorker.ready
    registration.active?.postMessage({ type: 'FIREBASE_CONFIG', config })
    return true
  } catch {
    return false
  }
}

export function pushSupport(): 'supported' | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  if (!('serviceWorker' in navigator)) return 'unsupported'
  return 'supported'
}

async function messagingSupported(): Promise<boolean> {
  try {
    const { isSupported } = await import('firebase/messaging')
    const ok = await isSupported()
    if (!ok) console.warn('[push] firebase messaging not supported in this browser')
    return ok
  } catch (err) {
    console.warn('[push] firebase messaging failed to load', err)
    return false
  }
}

async function getApp() {
  const config = readConfig()
  if (!config) return null
  const { initializeApp, getApps } = await import('firebase/app')
  const existing = getApps()
  if (existing.length > 0) return existing[0]
  return initializeApp(config)
}

/**
 * Ensures we have an FCM registration token for this browser.
 * Requests OS/browser permission when still undecided.
 * Returns the token, or null when push is unavailable / denied / unconfigured.
 */
export async function ensurePushToken(): Promise<string | null> {
  if (!isPushConfigured || pushSupport() === 'unsupported') return null
  if (!(await messagingSupported())) return null

  if (Notification.permission === 'denied') return null
  if (Notification.permission === 'default') {
    try {
      const result = await Notification.requestPermission()
      if (result !== 'granted') return null
    } catch {
      return null
    }
  }

  const app = await getApp()
  if (!app) return null
  const { getMessaging, getToken } = await import('firebase/messaging')
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined
  try {
    // Prefer the app's own /sw.js registration (production); fall back to
    // /firebase-messaging-sw.js (local dev, where /sw.js is skipped).
    let registration: ServiceWorkerRegistration | undefined
    try {
      registration = await navigator.serviceWorker.getRegistration()
    } catch {
      registration = undefined
    }
    if (!registration) {
      try {
        registration =
          await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      } catch {
        return null
      }
    }
    // Push the web config to whichever worker owns the subscription so
    // background notifications render when the app is closed.
    await configureServiceWorkerPush()
    try {
      return await getToken(getMessaging(app), {
        vapidKey,
        serviceWorkerRegistration: registration,
      })
    } catch (err) {
      console.warn('[push] getToken failed (check VAPID key + sender ID match)', err)
      return null
    }
  } catch {
    return null
  }
}

export interface ForegroundPush {
  title: string
  body: string
  link?: string
}

type ForegroundHandler = (push: ForegroundPush) => void
const foregroundListeners = new Set<ForegroundHandler>()

export function subscribeForegroundPush(fn: ForegroundHandler): () => void {
  foregroundListeners.add(fn)
  return () => {
    foregroundListeners.delete(fn)
  }
}

let foregroundStarted = false

/** Delivers foreground FCM messages to subscribers (toast + badge refresh). */
export async function startForegroundPushListener(): Promise<void> {
  if (foregroundStarted || !isPushConfigured) return
  if (!(await messagingSupported())) return
  const app = await getApp()
  if (!app) return
  foregroundStarted = true
  try {
    const { getMessaging, onMessage } = await import('firebase/messaging')
    onMessage(getMessaging(app), (payload) => {
      const title = payload.notification?.title ?? 'Vhennus'
      const body = payload.notification?.body ?? ''
      const rawLink = payload.data?.['link']
      const link = typeof rawLink === 'string' && rawLink !== '' ? rawLink : undefined
      foregroundListeners.forEach((fn) => fn({ title, body, link }))
    })
  } catch {
    foregroundStarted = false
  }
}
