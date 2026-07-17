// A basic Service Worker to satisfy the PWA installation requirement.
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Pass-through fetch (no offline caching right now, just to allow PWA install)
  e.respondWith(
    fetch(e.request).catch(() => {
      // If the user is offline, return a generic offline response
      return new Response("You are offline. Please reconnect to the internet to use Saksham AI.");
    })
  );
});
