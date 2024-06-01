self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    // Here you would cache files
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                './', // This caches the root URL (index.html)
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
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    // Here you can control how to respond to requests
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

