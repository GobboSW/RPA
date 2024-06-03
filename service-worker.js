const CACHE_NAME = 'property-data-logger-cache-v1';
const urlsToCache = [
  './', // Cache the root URL (index.html)
  './index.html',
  './log-time.html',
  './show-log.html',
  './view-data.html',
  './edit-log.html',
  './about.html',
  './help.html',
  './manifest.json',
  './styles.css',
  './icons/MyIcon-192.png',
  './icons/MyIcon-512.png',
  './service-worker.js'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CCACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell at install');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources have been cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        console.log('Fetching from network:', event.request.url);
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Cached new resource:', event.request.url);
              });
            return response;
          }
        );
      })
  );
});

