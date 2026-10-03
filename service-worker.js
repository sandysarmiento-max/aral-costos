const CACHE_NAME = "costalia-v6";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./site.webmanifest",
  "./costalia-icon.svg",
  "./costalia-mark.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./v2-fixes.js",
  "./v2-layout.js",
  "./v2-profit.js",
  "./v2-charges.js",
  "./v2-tools.js",
  "./v2-products-storage.js",
  "./v2-products.js",
  "./v2-inventory-edit.js",
  "./v2-product-card-layout.js",
  "./v2-material-quantity.js",
  "./v2-pro-ui.js",
  "./v2-currencies.js",
  "./v2-new-product.js",
  "./v2-branding.js",
  "./v2-backup-modal.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
