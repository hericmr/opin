// Service Worker básico para PWA
// Versão atualizada para evitar problemas de cache com arquivos JavaScript
const CACHE_NAME = 'opin-pwa-v2';
const STATIC_CACHE_NAME = 'opin-static-v2';

// URLs estáticas que podem ser cacheadas
const urlsToCache = [
  '/opin/',
  '/opin/index.html',
  '/opin/manifest.json',
];

// Install event - cache apenas recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache estático aberto');
        return cache.addAll(urlsToCache);
      })
  );
  // Força a ativação imediata do novo service worker
  self.skipWaiting();
});

// Activate event - limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove todos os caches antigos
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Assume controle imediato de todas as páginas
  return self.clients.claim();
});

// Função para verificar se é um arquivo com hash (JS, CSS com hash no nome)
function isHashedAsset(url) {
  // Arquivos JavaScript e CSS com hash no nome (ex: main.abc123.js ou main.16666c3d.js)
  // Padrão: nome.8ouMaisCaracteres.js ou nome.8ouMaisCaracteres.css
  return /\/static\/(js|css)\/.+\.\w{8,}\.(js|css)$/.test(url);
}

// Função para verificar se é um arquivo estático que pode ser cacheado
function isStaticAsset(url) {
  // Imagens, fonts, etc
  return /\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(url);
}

// Fetch event - estratégia network-first para arquivos com hash
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorar requisições que não são do nosso domínio
  if (url.origin !== location.origin) {
    return;
  }

  // Para arquivos com hash (JS/CSS), sempre buscar da rede primeiro
  if (isHashedAsset(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a rede funcionou, retorna a resposta
          if (response && response.status === 200) {
            return response;
          }
          // Se falhou, tenta do cache como fallback
          return caches.match(event.request);
        })
        .catch(() => {
          // Se a rede falhou completamente, tenta do cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para arquivos estáticos (imagens, fonts), usar cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Para index.html e outros, usar network-first
  if (event.request.destination === 'document' || url.pathname === '/opin/' || url.pathname === '/opin/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback para cache se offline
          return caches.match('/opin/index.html') || caches.match('/index.html');
        })
    );
    return;
  }

  // Para outros recursos, usar network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

