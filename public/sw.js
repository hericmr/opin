// Service Worker básico para PWA
// Versão atualizada para evitar problemas de cache com arquivos JavaScript
const CACHE_NAME = 'opin-pwa-v3';
const STATIC_CACHE_NAME = 'opin-static-v3';

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
          // Remove todos os caches antigos (incluindo versões anteriores)
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        // Limpa também todos os caches de recursos com hash antigos
        // Isso força o navegador a buscar novos arquivos
        console.log('Service Worker: Limpeza de cache concluída');
      });
    })
  );
  // Assume controle imediato de todas as páginas
  self.clients.claim();
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
  // NÃO cachear esses arquivos porque o hash muda a cada build
  if (isHashedAsset(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a rede funcionou, retorna a resposta (sem cachear)
          if (response && response.status === 200) {
            return response;
          }
          // Se falhou (404, etc), retorna erro diretamente
          return new Response('Resource not found', { 
            status: response?.status || 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
          });
        })
        .catch((error) => {
          // Se a rede falhou completamente, retorna erro
          // Não tenta cache porque arquivos com hash mudam a cada build
          console.error('Service Worker: Erro ao buscar recurso com hash:', url.pathname, error);
          return new Response('Network error', { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
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
            return response || new Response('Resource not found', { status: 404 });
          }).catch(() => {
            return new Response('Resource not found', { 
              status: 404,
              statusText: 'Not Found',
              headers: { 'Content-Type': 'text/plain' }
            });
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
        return response || new Response('Resource not found', { status: 404 });
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Resource not found', { 
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

