const CACHE_NAME = 'pomo-room-v2';
const OFFLINE_URL = '/';
const STATIC_ASSETS = [OFFLINE_URL, '/icon-192.png', '/icon-512.png'];

// 설치 시 기본 페이지 + 정적 자산 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 네비게이션 요청: 네트워크 우선 → 캐시 폴백
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 정적 자산 (이미지, 폰트 등): 캐시 우선 → 네트워크 폴백
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          // 성공 시 캐시에 저장
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  // API 요청 (Supabase 등): 네트워크만, 실패 시 오프라인 응답
  if (request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'offline', message: '오프라인 상태입니다' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  }
});
