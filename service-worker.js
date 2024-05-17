self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    // Here you would cache files
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    // Here you can control how to respond to requests
});
