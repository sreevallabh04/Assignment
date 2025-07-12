// Minimal service worker to prevent TypeError
console.log('🔧 Minimal service worker loaded');

// Immediately unregister this service worker
self.addEventListener('install', function(event) {
  console.log('🔧 Service worker installing - will unregister');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('🔧 Service worker activating - will unregister');
  event.waitUntil(
    self.registration.unregister().then(function() {
      console.log('🔧 Service worker unregistered itself');
      return self.clients.matchAll();
    }).then(function(clients) {
      clients.forEach(client => {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url);
        }
      });
    })
  );
});

// Handle fetch events to prevent errors
self.addEventListener('fetch', function(event) {
  // Simply pass through all requests without caching
  event.respondWith(fetch(event.request));
}); 