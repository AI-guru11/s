/*
  Safi Group — Service Worker (Plan B)
  Goal: stable offline-first behavior without changing the UI.
  GENERATED FILE — do not edit. Run: python build.py
*/

const CACHE_VERSION = 'v28';
const CACHE_NAME = `safi-pwa-${CACHE_VERSION}`;

// Core assets (same-origin)
// ملاحظة: صور المنتجات (assets/products/*) تُخزن تلقائياً عند تحميلها
const CORE_ASSETS = [
'./',
'./index.html',
'./portfolio.html',
'./services.html',
'./css/style.css',
'./js/app.js',
'./js/floating-glyphs.js',
'./js/airtable-service.js',
'./manifest.json',
'./assets/icons/icon-192.webp',
'./assets/icons/icon-512.webp',
'./assets/logo.webp',
'./data/config.js',
'./data/products.js',
'./data/portfolio.js',
'./data/partners.js',
'./data/services.js',
'./data/testimonials.js',
'./data/faq.js',
'./assets/events/events.config.js',
'./assets/events/core.splash.js',
'./assets/events/ramadan/ramadan.css',
'./assets/events/ramadan/ramadan.js',
'./assets/events/ramadan/ramadan.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Cache strategy:
// - Navigation requests: Network-first with cache fallback to ./index.html
// - Same-origin assets: Stale-while-revalidate
// - Cross-origin (CDN): Cache-first (opaque allowed) to reduce dependency after first load
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Cross-origin runtime cache
  event.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req, { mode: 'no-cors' })
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone())).catch(() => {});
          return res;
        })
        .catch(() => cached)
    )
  );
});
