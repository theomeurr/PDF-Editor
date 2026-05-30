/* Service worker — cache app shell + libs CDN pour fonctionner hors-ligne. */
'use strict';

const VERSION = 'v1';
const CACHE = `pdf-editor-${VERSION}`;

// Ressources locales toujours mises en cache à l'installation.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './favicon.png',
];

// Ressources CDN cachées en stratégie « stale-while-revalidate ».
const CDN_HOSTS = [
  'cdn.tailwindcss.com',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll échoue si une seule requête échoue. On utilise add() individuellement.
    await Promise.all(APP_SHELL.map((url) =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isCDN = CDN_HOSTS.includes(url.hostname);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isCDN && !isSameOrigin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: false });

    // Pour le HTML, on tente le réseau d'abord (pour avoir la dernière version), puis cache.
    if (req.mode === 'navigate' || (req.destination === 'document')) {
      try {
        const resp = await fetch(req);
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      } catch (_) {
        return cached || (await cache.match('./index.html')) || Response.error();
      }
    }

    // Pour le reste : stale-while-revalidate
    const fetchPromise = fetch(req).then((resp) => {
      if (resp && resp.ok && (resp.type === 'basic' || resp.type === 'cors')) {
        cache.put(req, resp.clone()).catch(() => {});
      }
      return resp;
    }).catch(() => null);

    return cached || (await fetchPromise) || Response.error();
  })());
});
