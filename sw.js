const CACHE_NAME = 'portal-magico-v5';

// ── Recursos locais ──
const LOCAL_URLS = [
  './',
  './index.html',
  './forca.html',
  './pintura.html',
  './puzzle.html',
  './mundo.html',
  './style.css',
  './pintura.js',
  './forca.js',
  './puzzle.js',
  './mundo.js',
  './icon.svg',
  './manifest.json',
  './bg_garden.png',
  './arca_noe.png',
  './davi_golias.png',
  './jonas_baleia.png',
  './moises_mar.png',
  './arca_noe_color.png',
  './davi_golias_color.png',
  './jonas_baleia_color.png',
  './moises_mar_color.png',
  './doll.png',
  './doll_sad.png'
];

// ── Recursos externos (CDNs) ──
const CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://unpkg.com/globe.gl',
  'https://unpkg.com/three-globe/example/img/earth-day.jpg',
  'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
  'https://raw.githubusercontent.com/umpirsky/country-list/master/data/pt_BR/country.json',
  'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Quicksand:wght@700;900&display=swap'
];

const ALL_URLS = [...LOCAL_URLS, ...CDN_URLS];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        ALL_URLS.map(url =>
          cache.add(url).catch(err => console.warn(`Falha ao cachear ${url}:`, err))
        )
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Google Fonts: cache dynamically (font files loaded after CSS)
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }

  // unpkg/jsdelivr/github CDN: cache-first for speed
  if (url.hostname.includes('unpkg.com') ||
      url.hostname.includes('jsdelivr.net') ||
      url.hostname.includes('githubusercontent.com')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        }).catch(() => new Response('', { status: 503, statusText: 'Offline' }));
      })
    );
    return;
  }

  // Local resources: Network First with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }
});

// ── Message handler for the offline button ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_ALL') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async cache => {
        const results = await Promise.allSettled(
          ALL_URLS.map(url => cache.add(url).catch(err => { throw err; }))
        );

        // After caching main resources, also try to cache the Google Fonts CSS responses
        // so font files get pulled in
        try {
          const fontCssUrl = 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Quicksand:wght@700;900&display=swap';
          const fontResponse = await fetch(fontCssUrl);
          const fontCss = await fontResponse.text();
          // Extract font file URLs
          const fontUrlMatches = fontCss.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g);
          if (fontUrlMatches) {
            const fontFileUrls = fontUrlMatches.map(m => m.replace('url(', '').replace(')', ''));
            await Promise.allSettled(fontFileUrls.map(u => cache.add(u).catch(() => {})));
          }
        } catch (e) {
          console.warn('Falha ao cachear fontes:', e);
        }

        // Also cache Globe.gl redirects (unpkg resolves to versioned URL)
        try {
          const globeResp = await fetch('https://unpkg.com/globe.gl');
          if (globeResp.redirected) {
            await cache.put(new Request(globeResp.url), globeResp.clone());
          }
        } catch(e) {}

        const failed = results.filter(r => r.status === 'rejected').length;
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        
        // Notify all clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_COMPLETE',
            succeeded,
            failed,
            total: ALL_URLS.length
          });
        });
      })
    );
  }

  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async cache => {
        const keys = await cache.keys();
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_STATUS',
            cachedCount: keys.length,
            totalNeeded: ALL_URLS.length
          });
        });
      })
    );
  }
});
