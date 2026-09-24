import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export function appWorker() {
  let output
  return {
    name: 'fintrack-app-worker',
    apply: 'build',
    configResolved(config) {
      output = config.build.outDir
    },
    closeBundle() {
      const files = [
        '/index.html',
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        ...readdirSync(join(output, 'assets'))
          .filter((name) => /\.(js|css|woff2)$/.test(name))
          .map((name) => `/assets/${name}`),
      ]
      const version = createHash('sha256')
        .update(
          files
            .map((file) => readFileSync(join(output, file.slice(1))))
            .reduce((all, file) => Buffer.concat([all, file]), Buffer.alloc(0)),
        )
        .digest('hex')
        .slice(0, 16)
      const source = `
const CACHE = 'fintrack-shell-${version}';
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('fintrack-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then(cache => cache.match('/index.html'))));
  } else if (FILES.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request).then(hit => hit || fetch(event.request))));
  }
});
`
      writeFileSync(join(output, 'sw.js'), source)
    },
  }
}
