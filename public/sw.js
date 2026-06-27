// CarneMX Service Worker
// Handles offline caching and push notifications

const CACHE_NAME = 'carnemx-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ─── Fetch (network-first for API, cache-first for assets) ────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests and Firebase/Stripe API calls
  if (event.request.method !== 'GET') return
  if (url.hostname.includes('firestore') || url.hostname.includes('stripe')) return

  // Network-first for HTML pages (always fresh)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // Cache-first for JS/CSS/images
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        return response
      }))
    )
  }
})

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const { title, body, icon, data: notifData } = data

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: notifData,
      vibrate: [200, 100, 200],
      requireInteraction: notifData?.type === 'new_order',
      actions: notifData?.type === 'new_order'
        ? [{ action: 'confirm', title: '✓ Confirm' }, { action: 'dismiss', title: 'Dismiss' }]
        : [],
      tag: notifData?.orderId || 'carnemx',
    })
  )
})

// ─── Notification Click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const data = event.notification.data || {}

  let url = '/'
  if (data.screen === 'OrderTracking') url = `/orders/${data.orderId}`
  else if (data.screen === 'VendorOrders') url = '/vendor/orders'
  else if (data.screen === 'DriverActive') url = '/driver/active'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.postMessage({ type: 'NAVIGATE', url })
          return
        }
      }
      return clients.openWindow(url)
    })
  )
})

// ─── Background Sync (retry failed orders) ────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-order') {
    event.waitUntil(retryPendingOrders())
  }
})

async function retryPendingOrders() {
  const pending = await getFromIDB('pending_orders')
  if (!pending?.length) return

  for (const order of pending) {
    try {
      await fetch('/api/orders', { method: 'POST', body: JSON.stringify(order), headers: { 'Content-Type': 'application/json' } })
    } catch {}
  }
}

function getFromIDB(key) {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('carnemx', 1)
      req.onsuccess = () => {
        const tx = req.result.transaction('sync', 'readonly')
        const store = tx.objectStore('sync')
        const getReq = store.get(key)
        getReq.onsuccess = () => resolve(getReq.result)
        getReq.onerror = () => resolve(null)
      }
      req.onerror = () => resolve(null)
    } catch { resolve(null) }
  })
}
