// Service Worker for Currency Converter PWA
const CACHE_NAME = 'currency-converter-v2.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/renderer.js',
  '/add_stars.js',
  '/favorites.js',
  '/click_to_copy.js',
  '/theme_toggle.js',
  '/main.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Currency Converter: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Currency Converter: Cache failed', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Currency Converter: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
