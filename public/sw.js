// Service Worker básico para PWA
const CACHE_NAME = 'opin-pwa-v1';
const urlsToCache = [
  '/opin/',
  '/opin/index.html',
  '/opin/manifest.json',
];

// Install event - cache os recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve do cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        // Clone da requisição
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Verifica se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone da resposta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback offline
        if (event.request.destination === 'document') {
          return caches.match('/opin/index.html') || caches.match('/index.html');
        }
      })
  );
});

