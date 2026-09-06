/* K-Talk: recovery/feature loaders only. Keep approved live-room layouts unchanged. */
(function(){
  if(window.__ktCameraRecoveryLoaded)return;
  window.__ktCameraRecoveryLoaded=true;

  /* LIVE는 자동 입장하지 않고 사용자가 LIVE 카드를 눌렀을 때만 입장한다. */
  window.__ktManualLiveEntryOnly=true;

  function addScript(key,src,onload){
    var attr='data-'+key;
    var old=document.querySelector('script['+attr+']');
    if(old){if(onload)setTimeout(onload,0);return old;}
    var s=document.createElement('script');
    s.src=src;
    s.defer=true;
    s.setAttribute(attr,'1');
    if(onload)s.onload=onload;
    document.head.appendChild(s);
    return s;
  }

  /* 홈은 여러 복구 코드가 서로 덮어쓰지 않게 최종 피드 하나만 먼저 올린다. */
  addScript('kt-home-feed-swipe-final','home-feed-swipe-final.js?v=20260906-swipe03',function(){
    try{
      if(window.ktHomeFeedStart&&!document.getElementById('ktSept2Live')&&!document.getElementById('ktRemoteLive'))window.ktHomeFeedStart();
    }catch(e){}
  });

  /* 아래는 방송 기능들만 연결한다. 홈 화면을 다시 만드는 예전 복구 코드는 넣지 않는다. */
  var scripts=[
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
    ['kt-live-presence-fast','live-presence-fast-fix.js?v=20260905-fastpresence01'],
    ['kt-playable-sounds','sound-playable-original.js?v=20260905-vocal02'],
    ['kt-requested-behavior-restore','ktalk-requested-behavior-restore.js?v=20260906-restore01']
  ];
  scripts.forEach(function(item){addScript(item[0],item[1]);});

  /* 느린 휴대폰에서도 최종 홈 피드가 도로 포스터 뒤에 묻히지 않게 짧게 재확인한다. */
  function ensureFinalHome(){
    try{
      if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return;
      var f=document.getElementById('ktUnifiedFeed');
      if(f&&f.getAttribute('data-kt-final-home')==='1')return;
      if(window.ktHomeFeedStart)window.ktHomeFeedStart();
    }catch(e){}
  }
  setTimeout(ensureFinalHome,100);
  setTimeout(ensureFinalHome,350);
  setTimeout(ensureFinalHome,800);
  setTimeout(ensureFinalHome,1500);
})();
