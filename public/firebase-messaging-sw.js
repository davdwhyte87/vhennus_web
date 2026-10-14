/* Firebase messaging service worker (dev fallback).
 *
 * Used when no service worker is registered yet (local dev, where /sw.js is
 * skipped). In production push is handled inside /sw.js.
 *
 * No keys live in this file: the app posts its Firebase web config (from
 * the VITE_FIREBASE_* env vars, single source of truth) here at startup
 * via postMessage (see Shared/firebase.ts).
 */

let pushInit = false

function setupPush(config) {
  if (pushInit) return
  if (
    !config ||
    !config.apiKey ||
    !config.projectId ||
    !config.messagingSenderId ||
    !config.appId
  ) {
    return
  }
  try {
    importScripts(
      'https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js',
    )
    firebase.initializeApp(config)
    const messaging = firebase.messaging()

    messaging.onBackgroundMessage((payload) => {
      const title =
        (payload.notification && payload.notification.title) || 'Vhennus'
      const body = (payload.notification && payload.notification.body) || ''
      const link =
        (payload.data && payload.data.link) || '/home/notifications'
      self.registration.showNotification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: { link: String(link) },
      })
    })
    pushInit = true
  } catch (e) {
    /* push stays disabled */
  }
}

self.addEventListener('message', (event) => {
  const data = event.data
  if (data && data.type === 'FIREBASE_CONFIG') setupPush(data.config)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const link =
    (event.notification.data && event.notification.data.link) ||
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
