/* Vhennus service worker — lightweight runtime caching (v2).
 * Navigations are network-first (never serve a stale app shell); static
 * same-origin GETs are cached on first use for offline resilience.
 * Background web-push is handled at the bottom (Firebase, optional).
 *
 * NOTE: this is a TEMPLATE. scripts/inject-sw-config.mjs bakes the
 * Firebase config into public/sw.js at dev-start/build time from the
 * VITE_FIREBASE_* env vars. Edit here, never in the generated file.
 */
const VERSION = 'vhennus-sw-v2'
const STATIC_CACHE = `${VERSION}-static`

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('vhennus-sw-') && k !== STATIC_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Never let the SW serve install/manifest plumbing from cache weirdness.
  if (url.pathname === '/sw.js' || url.pathname === '/manifest.webmanifest') return

  // App navigations: network first, fall back to cached shell, then offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', copy))
          return res
        })
        .catch(() =>
          caches.match('/index.html').then((cached) => {
            if (cached) return cached
            return new Response('You are offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            })
          }),
        ),
    )
    return
  }

  // Static assets: cache-first, populate in background.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy))
          }
          return res
        }),
    ),
  )
})

/* Background web push (Firebase Cloud Messaging).
 * FIREBASE_CONFIG below is baked in at build/dev-start time (placeholders
 * replaced by scripts/inject-sw-config.mjs). Initializing at worker
 * evaluation — NOT on a runtime message — is what makes pushes work when
 * the worker wakes cold with the app closed and no page alive to message
 * it. The postMessage bridge is kept only as a fallback.
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
