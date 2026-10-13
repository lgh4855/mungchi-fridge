// 오프라인에서도 열리도록 앱 파일을 저장. 새 버전이 올라오면 자동으로 교체됨
const CACHE = "mungchi-45c0d8e1fd";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // 화면(HTML)은 항상 최신 버전을 먼저 시도하고, 안 되면 저장본
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
