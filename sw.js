/* K-Talk PWA 설치 전용 서비스 워커. 화면/방송 기능은 건드리지 않음. */
self.addEventListener('install',function(){
  self.skipWaiting();
});

self.addEventListener('activate',function(event){
  event.waitUntil(self.clients.claim());
});

/* 설치 가능 조건만 유지하고 기존 파일/화면 캐시는 건드리지 않는다. */
self.addEventListener('fetch',function(){
  /* network request remains unchanged */
});
