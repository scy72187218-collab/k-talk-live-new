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
  load('group13-host-three-rows.js?v=20260911-host3rows1');
  load('room-stats-mission-copy.js?v=20260911-mission1');
  load('earnings-rooms-copy.js?v=20260909-earnings-restore1');
  load('mobile-open-compat.js?v=20260909-mobile1');
  load('video-more-menu.js?v=20260909-video-more1');
  load('beauty-natural-upgrade.js?v=20260909-beauty2');
  load('beauty-panel-real-controls.js?v=20260910-real1');
  load('public-feed-three-dot.js?v=20260909-feedmore1');
  load('feed-swipe-playback-fix.js?v=20260910-feedplay1');
  load('broadcast-video-resume-fix.js?v=20260911-return1');
  load('solo-right-dedupe.js?v=20260909-solo-right2');
  load('fanclub-restore.js?v=20260910-fanclub1');
  load('video-gift-benefit.js?v=20260910-gift30-2');
  load('wifi-status-indicator.js?v=20260910-nettoast1');
  load('benefit-ai-reader.js?v=20260910-ai-reader1');
  load('vocal-enhancer.js?v=20260910-vocal1');
  load('interface-recording-audio-fix.js?v=20260910-interface2');
  load('karaoke-audio-quality.js?v=20260910-karaoke1');
  load('waveform-individual-bars.js?v=20260911-auto8');
  load('room-person-layout-controls.js?v=20260911-layout2');
  load('room-person-layout-no-number.js?v=20260911-nonumber3');
  load('group9-approved-room.js?v=20260911-group9-2');
  load('group9-general-button.js?v=20260911-general9-3');
  load('secret-right-controls-fix.js?v=20260911-secret-right4');
  load('subscriber-right-controls-fix.js?v=20260911-subscriber-right1');
  load('level-rules.js?v=20260911-level1');
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

  function isPagePlaybackMedia(m){
    if(!m)return false;
    if(m.id==='homeVideo'||m.id==='ktLibraryPlayer')return true;
    return !!(m.classList&&m.classList.contains('kt-public-video'));
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

  function hasPlayingPageMedia(){
    try{
      var list=document.querySelectorAll('audio,video');
      for(var i=0;i<list.length;i++){
        var m=list[i];
        if(isCameraOrLiveMedia(m))continue;
        if(!m.paused)return true;
      }
    }catch(e){}
    try{if(window.ktSoundAudio&&!window.ktSoundAudio.paused)return true;}catch(e){}
    try{if(window.ktCreatorMusicCapture&&window.ktCreatorMusicCapture.audio&&!window.ktCreatorMusicCapture.audio.paused)return true;}catch(e){}
    return false;
  }

  function armPageMoveStop(){
    window.__ktPageMediaStopUntil=Date.now()+1200;
    window.ktStopPageMedia();
    [40,120,300,700,1100].forEach(function(ms){
      setTimeout(function(){
        if(Date.now()<=Number(window.__ktPageMediaStopUntil||0))window.ktStopPageMedia();
      },ms);
    });
  }

  document.addEventListener('play',function(e){
    var m=e.target;
    if(Date.now()>Number(window.__ktPageMediaStopUntil||0))return;
    if(!isPagePlaybackMedia(m))return;
    try{m.pause();}catch(err){}
    try{m.muted=true;}catch(err){}
  },true);

  document.addEventListener('pointerdown',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    if(t.closest('.kt-public-video,#homeVideo,#ktLibraryPlayer')){
      window.__ktPageMediaStopUntil=0;
    }
  },true);

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var nav=t.closest('.bottom button,.kt-bottom button,[data-bottom]');
    if(nav&&hasPlayingPageMedia())armPageMoveStop();
  },true);

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='hidden')armPageMoveStop();
  });
  window.addEventListener('pagehide',armPageMoveStop);
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

/* 13명방·구독자방·비밀방: 이미 만든 카메라 뒤집기 기능을 좋아요 바로 위에만 추가. */
(function(){
  if(window.__ktThreeRoomCameraFlipInstalled)return;
  window.__ktThreeRoomCameraFlipInstalled=true;

  function addFlip(side,like,group13){
    if(!side||!like)return;
    var b=side.querySelector(':scope > .kt-room-camera-flip');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-room-camera-flip';
      b.setAttribute('aria-label','카메라 뒤집기');
      b.title='카메라 앞/뒤 바꾸기';
      b.innerHTML=group13?'<b>↻</b><span>뒤집기</span>':'↻<small>뒤집기</small>';
      b.onclick=function(){
        if(window.ktSoloFlipCamera)window.ktSoloFlipCamera(this);
      };
    }
    if(like.previousElementSibling!==b)side.insertBefore(b,like);
  }

  function install(){
    var g=document.querySelector('.ktg13-right-quick');
    if(g)addFlip(g,g.querySelector('.ktg13-like'),true);

    var s=document.querySelector('.ktsubscriber-right');
    if(s)addFlip(s,s.querySelector('.like'),false);

    var sec=document.querySelector('.ktsecret-right');
    if(sec)addFlip(sec,sec.querySelector('.like'),false);
  }

  install();
  var obs=new MutationObserver(function(){install();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(install,900);
})();