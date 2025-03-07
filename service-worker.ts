const HOSTNAME_WHITELIST = [
  self.location.hostname,
  'fonts.gstatic.com',
  'fonts.googleapis.com',
  'cdn.jsdelivr.net'
];

const getFixedUrl = (req: Request): string => {
  const now = Date.now();
  const url = new URL(req.url);

  // 1. Fix the protocol to match the current location (http/https)
  url.protocol = self.location.protocol;

  // 2. Add a cache-busting query parameter for requests to the same host
  if (url.hostname === self.location.hostname) {
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
  }

  return url.href;
};

// Lifecycle: Install
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker: Installed', event);
});

// Lifecycle: Activate
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker: Activated', event);
});

// Functional: Fetch
self.addEventListener('fetch', (event: FetchEvent) => {
  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests that are not in the whitelist
  if (HOSTNAME_WHITELIST.indexOf(requestUrl.hostname) === -1) {
      return;
  }

  // Stale-while-revalidate strategy
  const cached = caches.match(event.request);
  const fixedUrl = getFixedUrl(event.request);
  const fetched = fetch(fixedUrl, { cache: 'no-store' });
  const fetchedCopy = fetched.then(resp => resp.clone()); // Исправлено: resp.clone()

  // Respond with the fastest result: cache or network
  event.respondWith(
      Promise.race([fetched.catch(() => cached), cached])
          .then(resp => resp || fetched)
          .catch(() => new Response('Network error', { status: 500 }))
  );

  // Update the cache with the fresh response
  event.waitUntil(
      Promise.all([fetchedCopy, caches.open("pwa-cache")])
          .then(([response, cache]) => {
              if (response.ok) {
                  cache.put(event.request, response);
              }
          })
          .catch(() => { /* Ignore errors */ })
  );
});


/* 

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
    }); */
    