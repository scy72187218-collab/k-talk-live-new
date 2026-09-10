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
  load('beauty-panel-real-controls.js?v=20260910-real1');
  load('public-feed-three-dot.js?v=20260909-feedmore1');
  load('solo-right-dedupe.js?v=20260909-solo-right2');
  load('fanclub-restore.js?v=20260910-fanclub1');
  load('video-gift-benefit.js?v=20260910-gift30-2');
  load('wifi-status-indicator.js?v=20260910-nettoast1');
  load('benefit-ai-reader.js?v=20260910-ai-reader1');
  load('vocal-enhancer.js?v=20260910-vocal1');
  load('interface-recording-audio-fix.js?v=20260910-interface2');
})();

/* 촬영 화면의 편집효과 바로 아래 V(더보기) 버튼만 제거. 다른 버튼/기능은 건드리지 않음. */
(function(){
  var btn=document.querySelector('#creator .creator-tools > button[aria-label="더보기"]');
  if(btn)btn.remove();
})();

/* 동영상/음악을 듣다가 다른 페이지로 이동하면 그 소리만 즉시 멈춘다. 카메라/라이브는 건드리지 않음. */
(function(){
  if(window.__ktStopMediaOnPageMoveInstalled)return;
  window.__ktStopMediaOnPageMoveInstalled=true;

  function isCameraOrLiveMedia(m){
    if(!m)return false;
    var id=m.id||'';
    return id==='camera'||id==='cameraBg'||id==='ktLiveVideo'||id==='ktSept2Live'||id==='ktRemoteLive';
  }

  window.ktStopPageMedia=function(){
    try{
      document.querySelectorAll('audio,video').forEach(function(m){
        if(isCameraOrLiveMedia(m))return;
        try{m.pause();}catch(e){}
        try{m.muted=true;}catch(e){}
      });
    }catch(e){}
    try{
      if(window.ktCreatorMusicCapture&&window.ktCreatorMusicCapture.audio){
        window.ktCreatorMusicCapture.audio.pause();
      }
    }catch(e){}
    try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
  };

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var nav=t.closest('.bottom button,.kt-bottom button');
    if(nav)window.ktStopPageMedia();
  },true);

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='hidden')window.ktStopPageMedia();
  });
  window.addEventListener('pagehide',window.ktStopPageMedia);
})();
