// 기존 캐시를 모두 파괴하고 네트워크에서만 최신 파일을 가져오는 강제 초기화 코드
self.addEventListener('install', function(e) {
  self.skipWaiting(); // 대기 없이 즉시 새 서비스 워커 적용
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName); // 폰에 남은 모든 옛날 화면 찌꺼기 삭제
        })
      );
    }).then(function() {
      return self.clients.claim(); // 즉시 제어권 확보
    })
  );
});

self.addEventListener('fetch', function(e) {
  // 캐시를 절대 사용하지 않고 무조건 서버(Vercel)에서 최신 파일을 가져옴
  e.respondWith(fetch(e.request));
});
