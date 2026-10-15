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
  apiKey: 'AIzaSyDW48-eyC_oSupHoaL8Ly2OkK-0YARTNro',
  authDomain: 'vhennus-dev.firebaseapp.com',
  projectId: 'vhennus-dev',
  messagingSenderId: '109067936878',
  appId: '1:109067936878:web:18b0f904077c8c6abc727f',
}

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

// Cold-start init: runs on every worker start, including push-wakeups.
setupPush(FIREBASE_CONFIG)

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
