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
  load('karaoke-audio-quality.js?v=20260910-karaoke1');
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

/* 1인 방송: 오른쪽 하트 바로 위에 카메라 앞/뒤 전환 버튼 하나만 추가. */
(function(){
  if(window.__ktSoloCameraFlipInstalled)return;
  window.__ktSoloCameraFlipInstalled=true;

  function applyMirror(v,facing){
    if(!v)return;
    try{
      v.style.setProperty('transform',facing==='environment'?'none':'scaleX(-1)','important');
    }catch(e){}
  }

  window.ktSoloFlipCamera=async function(btn){
    if(btn&&btn.dataset.busy==='1')return;
    if(btn)btn.dataset.busy='1';
    var oldFacing='user';
    try{oldFacing=(window.state&&state.cameraFacing)||'user';}catch(e){}
    var next=oldFacing==='environment'?'user':'environment';
    try{
      if(window.state)state.cameraFacing=next;
      var ok=false;
      if(typeof window.ensureLiveCamera==='function')ok=await window.ensureLiveCamera(next);
      if(!ok)throw new Error('camera switch failed');
      var v=document.getElementById('ktLiveVideo');
      if(v&&window.state&&state.stream){
        v.srcObject=state.stream;
        v.muted=true;
        v.setAttribute('playsinline','');
        applyMirror(v,next);
        try{await v.play();}catch(e){}
      }
      if(btn){
        btn.title=next==='environment'?'전면 카메라로 바꾸기':'후면 카메라로 바꾸기';
        btn.setAttribute('aria-label','카메라 뒤집기');
      }
    }catch(err){
      try{
        if(window.state)state.cameraFacing=oldFacing;
        if(typeof window.ensureLiveCamera==='function')await window.ensureLiveCamera(oldFacing);
        var oldV=document.getElementById('ktLiveVideo');
        if(oldV&&window.state&&state.stream){
          oldV.srcObject=state.stream;
          applyMirror(oldV,oldFacing);
          try{await oldV.play();}catch(e){}
        }
      }catch(e){}
    }finally{
      if(btn)btn.dataset.busy='0';
    }
  };

  function install(){
    var right=document.querySelector('.ktsolo-right');
    if(!right||right.querySelector('.kt-solo-camera-flip'))return;
    var like=right.querySelector('.like');
    if(!like)return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-solo-camera-flip';
    b.setAttribute('aria-label','카메라 뒤집기');
    b.title='카메라 앞/뒤 바꾸기';
    b.innerHTML='↻<small>뒤집기</small>';
    b.onclick=function(){window.ktSoloFlipCamera(this);};
    right.insertBefore(b,like);
  }

  install();
  var obs=new MutationObserver(function(){install();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
})();
