/* K-Talk loader: keep the existing music fix unchanged, then load the approved 13-person room preview. */
(function(){
  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  load('music-recording-base.js?v=20260907-group13');
  load('group13-approved-room.js?v=20260907-group13');
  load('earnings-rooms-copy.js?v=20260909-earnings-restore1');
  load('mobile-open-compat.js?v=20260909-mobile1');
  load('video-more-menu.js?v=20260909-video-more1');
  load('beauty-natural-upgrade.js?v=20260909-beauty2');
  load('public-feed-three-dot.js?v=20260909-feedmore1');
  load('solo-right-dedupe.js?v=20260909-solo-right2');
  load('fanclub-restore.js?v=20260910-fanclub1');
})();

/* 촬영 화면의 편집효과 바로 아래 V(더보기) 버튼만 제거. 다른 버튼/기능은 건드리지 않음. */
(function(){
  var btn=document.querySelector('#creator .creator-tools > button[aria-label="더보기"]');
  if(btn)btn.remove();
})();
