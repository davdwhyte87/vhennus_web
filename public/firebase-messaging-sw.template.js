/* Firebase messaging service worker (dev fallback).
 *
 * Used when no service worker is registered yet (local dev, where /sw.js is
 * skipped). In production push is handled inside /sw.js.
 *
 * NOTE: this is a TEMPLATE. scripts/inject-sw-config.mjs bakes the
 * Firebase config into public/firebase-messaging-sw.js at dev-start/build
 * time from the VITE_FIREBASE_* env vars. Edit here, never in the
 * generated file.
 */

const FIREBASE_CONFIG = {
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__',
  projectId: '__FIREBASE_PROJECT_ID__',
  messagingSenderId: '__FIREBASE_MESSAGING_SENDER_ID__',
  appId: '__FIREBASE_APP_ID__',
}

// Take over immediately so a regenerated config (new keys / project) is
// used on the next reload instead of waiting for every tab to close.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

let pushInit = false

function setupPush(config) {
  if (pushInit) return
  if (
    !config ||
    !config.apiKey ||
    !config.projectId ||
    !config.messagingSenderId ||
    !config.appId ||
    String(config.apiKey).startsWith('__FIREBASE_')
  ) {
    return
  }
  try {
    importScripts(
      'https://www.gstatic.com/firebasejs/13.0.0/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging-compat.js',
    )
    firebase.initializeApp(config)
    const messaging = firebase.messaging()

    messaging.onBackgroundMessage((payload) => {
      // The SDK already displays messages that carry a `notification` block.
      // Only render data-only messages here, otherwise every push shows twice.
      if (payload.notification) return
      const data = payload.data || {}
      const title = data.title || 'Vhennus'
      const body = data.body || ''
      if (!title && !body) return
      return self.registration.showNotification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: { link: String(data.link || '/home/notifications') },
      })
    })
    pushInit = true
  } catch (e) {
    // Keep push disabled, but leave a breadcrumb: this used to be silent.
    console.error('[sw] Firebase messaging failed to initialise', e)
  }
}

/* Fallback: if the Firebase SDK failed to load (offline cold start, blocked
 * gstatic, missing config), it installed no push listener and every push
 * would be dropped. Display it ourselves instead. */
self.addEventListener('push', (event) => {
  if (pushInit) return
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch (e) {
    payload = {}
  }
  const notification = payload.notification || {}
  const data = payload.data || {}
  const title = notification.title || data.title || 'Vhennus'
  const body = notification.body || data.body || ''
  if (!title && !body) return
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: { link: String(data.link || '/home/notifications') },
    }),
  )
})

self.addEventListener('message', (event) => {
  const data = event.data
  if (data && data.type === 'FIREBASE_CONFIG') setupPush(data.config)
})

/* Registered before setupPush() on purpose: the Firebase SDK's own click
 * handler calls stopImmediatePropagation(), which would stop this one from
 * ever running. Handles both our own notifications (data.link) and the
 * SDK-shown ones (data.FCM_MSG.data.link). */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.stopImmediatePropagation()
  const payload = event.notification.data || {}
  const fcm = payload.FCM_MSG || {}
  const link =
    payload.link ||
    (fcm.data && fcm.data.link) ||
    (fcm.fcmOptions && fcm.fcmOptions.link) ||
    '/home/notifications'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(link)
            return client.focus()
          }
        }
        return self.clients.openWindow(link)
      }),
  )
})

// Cold-start init: runs on every worker start, including push-wakeups.
// Registered last so our notificationclick handler runs before the SDK's.
setupPush(FIREBASE_CONFIG)
