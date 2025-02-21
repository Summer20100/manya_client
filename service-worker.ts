self.addEventListener('install', (event: Event) => {
  console.log('Service Worker: Installed', event);
});

self.addEventListener('activate', (event: Event) => {
  console.log('Service Worker: Activated', event);
});

self.addEventListener('fetch', (event: FetchEvent) => {
  console.log('Service Worker: Fetching', event.request.url);
  event.respondWith(
      fetch(event.request).then((response) => {
          return response;
      }).catch((error) => {
          console.error('Fetch failed:', error);
          return new Response('Something went wrong', { status: 500 });
      })
  );
});
