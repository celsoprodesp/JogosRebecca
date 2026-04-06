const CACHE_NAME = 'portal-magico-v3';
const urlsToCache = [
  './',
  './index.html',
  './forca.html',
  './pintura.html',
  './puzzle.html',
  './style.css',
  './pintura.js',
  './forca.js',
  './puzzle.js',
  './icon.svg',
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

self.addEventListener('install', event => {
  self.skipWaiting(); // Força a ativação imediata do novo SW
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Tenta fazer o cache de tudo de forma independente
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => console.warn(`Falha ao cachear ${url}:`, err)))
        );
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Assume o controle imediatamente
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  // Ignora requisições de outras origens ou que não sejam GET
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Estratégia Network First (Rede Primeiro, com fallback para o Cache)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se a rede respondeu com sucesso, clona a resposta para atualizar o cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Se a rede falhar, busca no cache ignorando as query strings (ex: ?v=2)
        return caches.match(event.request, { ignoreSearch: true });
      })
  );
});
