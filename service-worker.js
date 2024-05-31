self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    // Here you would cache files
    event.waitUntil(
        caches.open('static-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/manifest.json',
                '/MyIcon-192.png',
                '/MyIcon-512.png'
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

