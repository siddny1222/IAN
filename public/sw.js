/* IAN Service Worker — runtime cache for media and JS/CSS assets */
const CACHE_NAME = 'ian-cache-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (!url.protocol.startsWith('http')) return

  const isMedia = url.pathname.match(/\/media\/[^/]+$/)
  const isAsset = url.pathname.match(/\/assets\/[^/]+\.(js|css)$/)

  if (!isMedia && !isAsset) return

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        if (cached) return cached

        return fetch(event.request)
          .then((response) => {
            if (response.ok && response.status === 200) {
              cache.put(event.request, response.clone())
            }
            return response
          })
          .catch(() => cached ?? new Response('', { status: 503 }))
      }),
    ),
  )
})
