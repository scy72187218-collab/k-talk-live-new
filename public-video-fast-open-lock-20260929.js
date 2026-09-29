/* K-Talk 공개 동영상 빠른 열기 보호 2026-09-29
   - 첫 동영상/공개 동영상만 보정
   - 방송방, 채팅, 수익률, 카메라, 매치 등은 건드리지 않음
   - 이미 잠금된 public_video_first_page_opening 상태를 다시 고정 */
(function(){
  if(window.__ktPublicVideoFastOpenLock20260929)return;
  window.__ktPublicVideoFastOpenLock20260929=true;

  var FALLBACK='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516618159-4ep5ki.mp4';
  var lastRecovery=0;

  function inLiveRoom(){
    return !!document.querySelector(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,'+
      '#screen .kt-remote-live,#screen .kt-guest-hostlike-room'
    );
  }

  function publicVideos(){
    if(inLiveRoom())return [];
    return [].slice.call(document.querySelectorAll(
      '#ktPublicFirstPaintVideo,#screen .kt-public-video,#screen #homeVideo,#screen .kt-hard-public-video'
    ));
  }

  function preferredUrl(v){
    var u='';
    try{u=String(v.currentSrc||v.getAttribute('src')||'');}catch(e){}
    if(!u){
      try{u=String(window.__ktPublicFirstPaintUrl20260924||'');}catch(e){}
    }
    return u||FALLBACK;
  }

  function start(v,force){
    if(!v)return;
    try{
      v.setAttribute('preload','auto');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.autoplay=true;
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;

      var u=preferredUrl(v);
      if(!v.getAttribute('src')&&u)v.src=u;

      if(force){
        var now=Date.now();
        if(now-lastRecovery>1200){
          lastRecovery=now;
          try{
            v.pause();
            v.removeAttribute('src');
            v.load();
            v.src=u;
            v.load();
          }catch(_e){}
        }
      }

      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function tune(v){
    if(!v||v.dataset.ktFastVideoLocked==='1')return;
    v.dataset.ktFastVideoLocked='1';
    v.setAttribute('data-kt-protected-area','public_video_first_page_opening');

    v.addEventListener('loadedmetadata',function(){start(v,false);},{passive:true});
    v.addEventListener('canplay',function(){start(v,false);},{passive:true});
    v.addEventListener('error',function(){start(v,true);},{passive:true});
    v.addEventListener('stalled',function(){start(v,true);},{passive:true});

    start(v,false);
    [40,120,280,650,1200].forEach(function(ms){
      setTimeout(function(){
        try{
          if(v.paused||v.readyState<2)start(v,ms>=650);
        }catch(e){}
      },ms);
    });
  }

  function scan(){
    publicVideos().forEach(tune);
  }

  scan();
  [0,40,100,220,500,900,1600].forEach(function(ms){setTimeout(scan,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktPublicVideoFastOpenLockTimer20260929);
      window.__ktPublicVideoFastOpenLockTimer20260929=setTimeout(scan,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(scan,20);
  });
})();