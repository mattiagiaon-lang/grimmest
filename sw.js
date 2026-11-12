// Service worker: tiene in memoria tutti i file del gioco, così l'app installata funziona anche senza internet.
// Versione del 12 novembre (gioco in un file solo, index.html): cambia CACHE a ogni versione nuova.
const CACHE = "grimo-beba-1794488668274";
const FILES = ["./","./manifest.webmanifest","./icona-192.png","./icona-512.png","./apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// prima la rete per la pagina (così arrivano gli aggiornamenti), la memoria se non c'è campo; il resto dalla memoria
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("./", copy)); return r; }).catch(() => caches.match("./")));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
