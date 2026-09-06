/* K-Talk: recovery/feature loaders only. Keep room layouts unchanged. */
(function(){
  if(window.__ktCameraRecoveryLoaded)return;
  window.__ktCameraRecoveryLoaded=true;

  /* 주소로 처음 들어왔을 때 첫 영상만 안정적으로 준비한다.
     새 주소에서는 같은 주소의 /api/video 프록시를 유지해 다른 복구 코드와 충돌하지 않는다. */
  function primeHomeVideo(){
    try{
      if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return;
      var v=document.querySelector('.video-home video#homeVideo, .video-home video');
      if(!v)return;
      var isNewHost=location.hostname==='k-talk-new-room.vercel.app';
      var u=isNewHost?'/api/video?i=0&v=20260906-mobile02':'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
      var src=String(v.getAttribute('src')||v.currentSrc||'');
      var correct=isNewHost?src.indexOf('/api/video?i=')===0:src.indexOf('zupwbfmacwzexyvznlzq.supabase.co')>-1;
      if(!correct){
        try{v.pause();}catch(e){}
        while(v.firstChild)v.removeChild(v.firstChild);
        v.removeAttribute('poster');
        v.src=u;
        v.preload='auto';
        v.muted=true;
        v.defaultMuted=true;
        v.volume=0;
        v.autoplay=true;
        v.loop=true;
        v.setAttribute('muted','');
        v.setAttribute('autoplay','');
        v.setAttribute('loop','');
        v.setAttribute('playsinline','');
        v.setAttribute('webkit-playsinline','');
        try{v.load();}catch(e){}
      }else{
        v.removeAttribute('poster');
      }
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }catch(e){}
  }
  primeHomeVideo();
  setTimeout(primeHomeVideo,30);
  setTimeout(primeHomeVideo,120);
  setTimeout(primeHomeVideo,350);

  /* 첫 화면 피드는 다른 기능보다 먼저 불러온다. */
  var scripts=[
    ['kt-feed-startup-stability','feed-startup-stability-fix.js?v=20260906-feedstable06'],
    ['kt-home-first-screen-stable','home-first-screen-stable.js?v=20260906-firststable02'],
    ['kt-permission-once','permission-once-fix.js?v=20260905-permission01'],
    ['kt-live-bottom-tools','live-bottom-tiktok.js?v=20260905-bottom01'],
    ['kt-group13-layout','group13-reference-layout.js?v=20260905-group13-08'],
    ['kt-password-layout','password-room-reference-layout.js?v=20260905-password01'],
    ['kt-password-host-cover','password-host-cover-fix.js?v=20260905-password-host04'],
    ['kt-live-home-indicator','live-home-indicator.js?v=20260905-livehome03'],
    ['kt-live-host-thumbnail','live-host-thumbnail.js?v=20260905-hostthumb01'],
    ['kt-guest-participation','guest-participation.js?v=20260905-guest01'],
    ['kt-song-guest-mic-lock','song-guest-mic-lock.js?v=20260906-songmic02'],
    ['kt-live-viewer-join-chat','live-viewer-join-chat.js?v=20260905-joinchat02'],
    ['kt-live-room-chat','live-room-chat.js?v=20260905-roomchat03'],
    ['kt-live-chat-lower','live-chat-lower-position.js?v=20260906-chatlower01'],
    ['kt-seated-camera-framing','seated-camera-framing-fix.js?v=20260906-seated01'],
    ['kt-attendance-size-position','attendance-size-position-fix.js?v=20260905-attendance04'],
    ['kt-subscriber-title-fix','subscriber-title-position-fix.js?v=20260905-subtitle01'],
    ['kt-viewer-live-reconnect','viewer-live-reconnect-fix.js?v=20260906-viewer02'],
    ['kt-live-first-feed','live-first-feed-fix.js?v=20260905-livefirst01'],
    ['kt-live-presence-fast','live-presence-fast-fix.js?v=20260905-fastpresence01'],
    ['kt-playable-sounds','sound-playable-original.js?v=20260905-vocal02'],
    ['kt-requested-behavior-restore','ktalk-requested-behavior-restore.js?v=20260906-restore01']
  ];

  scripts.forEach(function(item){
    var attr='data-'+item[0];
    if(document.querySelector('script['+attr+']'))return;
    var s=document.createElement('script');
    s.src=item[1];
    s.defer=true;
    s.setAttribute(attr,'1');
    document.head.appendChild(s);
  });

  /* 다른 홈 복구 코드가 모두 올라온 뒤 최종 홈 피드를 마지막에 고정한다.
     첫 카드는 실제 동영상, 다음으로 넘길 때 방송 중인 LIVE 카드가 섞여 나오고 누르면 입장한다. */
  function loadFinalHomeFeed(){
    if(document.querySelector('script[data-kt-home-feed-swipe-final]'))return;
    var s=document.createElement('script');
    s.src='home-feed-swipe-final.js?v=20260906-swipe01';
    s.setAttribute('data-kt-home-feed-swipe-final','1');
    document.head.appendChild(s);
  }
  setTimeout(loadFinalHomeFeed,650);
  setTimeout(loadFinalHomeFeed,1500);

  function forcePublicFeed(){
    try{
      if(document.getElementById('ktUnifiedFeed'))return;
      if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return;
      /* 예전 앱의 '홈 동영상 보기' 카드(.media)에서도 실제 피드로 즉시 전환한다. */
      if(!document.getElementById('screen'))return;
      if(typeof window.ktLowMemoryFeed!=='function')return;
      var r=window.ktLowMemoryFeed();
      if(r&&typeof r.then==='function'){
        r.then(function(){
          var feed=document.getElementById('ktUnifiedFeed');
          if(feed){
            feed.style.setProperty('overflow-y','scroll','important');
            feed.style.setProperty('-webkit-overflow-scrolling','touch','important');
            feed.style.setProperty('touch-action','pan-y','important');
          }
        }).catch(function(){});
      }
    }catch(e){}
  }
  setTimeout(forcePublicFeed,30);
  setTimeout(forcePublicFeed,120);
  setTimeout(forcePublicFeed,300);
  setTimeout(forcePublicFeed,700);
  setTimeout(forcePublicFeed,1400);
  setTimeout(forcePublicFeed,2600);
})();
