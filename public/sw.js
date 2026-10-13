/* Vhennus service worker — lightweight runtime caching (v1).
 * Navigations are network-first (never serve a stale app shell); static
 * same-origin GETs are cached on first use for offline resilience.
 */
const VERSION = 'vhennus-sw-v1'
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
