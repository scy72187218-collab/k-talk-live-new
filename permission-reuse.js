/* K-Talk: keep camera/mic permission quiet until the user actually starts a camera action. */
(function(){
  if(window.__ktPermissionReuseLoaded)return;
  window.__ktPermissionReuseLoaded=true;

  function hasLiveTrack(stream,kind){
    try{
      var tracks=kind==='audio'?stream.getAudioTracks():stream.getVideoTracks();
      return !!(stream&&tracks&&tracks.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }
  function hasLiveStream(stream){
    return hasLiveTrack(stream,'video')||hasLiveTrack(stream,'audio');
  }
  function liveScreenOpen(){
    try{
      return !!(document.getElementById('ktLiveVideo')||document.getElementById('ktTestVideo')||document.body.classList.contains('kt-solo-host-live'));
    }catch(e){return false;}
  }
  function enableStream(stream){
    try{stream.getTracks().forEach(function(t){if(t.readyState==='live')t.enabled=true;});}catch(e){}
  }
  function disableStream(stream){
    try{stream.getTracks().forEach(function(t){if(t.readyState==='live')t.enabled=false;});}catch(e){}
  }

  /* Reuse a live, already-approved stream instead of asking again. */
  function keepApprovedStream(stream){
    if(!hasLiveStream(stream))return;
    if(liveScreenOpen())enableStream(stream);
    else disableStream(stream);
  }

  function wrapEnsure(){
    var old=window.ensureLiveCamera;
    if(typeof old!=='function'||old.__ktPermissionReuseWrapped)return;
    var wrapped=async function(){
      try{
        if(window.state&&state.stream&&hasLiveTrack(state.stream,'video')&&hasLiveTrack(state.stream,'audio')){
          enableStream(state.stream);
          if(typeof window.ktAttachCreatorCamera==='function'){
            try{return await window.ktAttachCreatorCamera(state.stream);}catch(e){}
          }
          try{
            var c=document.getElementById('camera');
            if(c){c.srcObject=state.stream;var p=c.play();if(p&&p.catch)p.catch(function(){});}
          }catch(e){}
          return true;
        }
      }catch(e){}
      return await old.apply(this,arguments);
    };
    wrapped.__ktPermissionReuseWrapped=true;
    wrapped.__ktOriginal=old;
    window.ensureLiveCamera=wrapped;
  }

  /*
    Opening the creator/broadcast preparation screen must not itself ask for camera/mic.
    The real permission request remains in startBroadcast/startCreatorRecording and explicit
    beauty/effect camera actions, so it happens only after a user camera action.
  */
  function wrapOpenCreator(){
    var old=window.openCreator;
    if(typeof old!=='function'||old.__ktPermissionOnActionWrapped)return;
    var wrapped=async function(){
      var realEnsure=window.ensureLiveCamera;
      var realPreview=window.ensureCreatorPreviewCamera;
      var noRequest=async function(){return true;};
      try{
        window.ensureLiveCamera=noRequest;
        window.ensureCreatorPreviewCamera=noRequest;
        return await old.apply(this,arguments);
      }finally{
        window.ensureLiveCamera=realEnsure;
        window.ensureCreatorPreviewCamera=realPreview;
      }
    };
    wrapped.__ktPermissionOnActionWrapped=true;
    wrapped.__ktOriginal=old;
    window.openCreator=wrapped;
  }

  function wrapClose(){
    var old=window.closeCreator;
    if(typeof old!=='function'||old.__ktPermissionReuseWrapped)return;
    var wrapped=function(){
      var saved=null;
      try{if(window.state&&hasLiveStream(state.stream)){saved=state.stream;state.stream=null;}}catch(e){}
      var r;
      try{r=old.apply(this,arguments);}finally{
        if(saved){
          try{state.stream=saved;}catch(e){}
          keepApprovedStream(saved);
        }
      }
      return r;
    };
    wrapped.__ktPermissionReuseWrapped=true;
    wrapped.__ktOriginal=old;
    window.closeCreator=wrapped;
  }

  function install(){wrapEnsure();wrapOpenCreator();wrapClose();}
  install();
  setTimeout(install,100);
  setTimeout(install,700);
  setInterval(install,2500);

  document.addEventListener('visibilitychange',function(){
    try{
      if(document.visibilityState==='visible'&&window.state&&hasLiveStream(state.stream)&&liveScreenOpen())enableStream(state.stream);
    }catch(e){}
  });
})();

/* Keep the phone display awake while a LIVE host/viewer screen is actually open. */
(function(){
  if(window.__ktLiveScreenWakeLoaded)return;
  window.__ktLiveScreenWakeLoaded=true;

  var wakeLock=null;
  var asking=false;

  function liveOpen(){
    try{
      return !!(document.getElementById('ktLiveVideo')||document.getElementById('ktRemoteLive')||document.getElementById('ktTestVideo')||document.body.classList.contains('kt-solo-host-live'));
    }catch(e){return false;}
  }

  async function requestWake(){
    if(asking||!liveOpen()||document.visibilityState!=='visible')return;
    if(!('wakeLock' in navigator)||!navigator.wakeLock||typeof navigator.wakeLock.request!=='function')return;
    if(wakeLock&&!wakeLock.released)return;
    asking=true;
    try{
      wakeLock=await navigator.wakeLock.request('screen');
      if(wakeLock&&wakeLock.addEventListener){
        wakeLock.addEventListener('release',function(){wakeLock=null;});
      }
    }catch(e){}
    asking=false;
  }

  function releaseWake(){
    if(!wakeLock)return;
    try{var p=wakeLock.release();if(p&&p.catch)p.catch(function(){});}catch(e){}
    wakeLock=null;
  }

  function sync(){
    if(liveOpen())requestWake();
    else releaseWake();
  }

  document.addEventListener('click',function(){setTimeout(sync,40);},true);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(sync,80);
    else releaseWake();
  });
  try{new MutationObserver(function(){setTimeout(sync,40);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(sync,1500);
  setTimeout(sync,300);
})();

/* Mobile 13-person/subscriber LIVE only: keep the room height stable. */
(function(){
  if(window.__ktMultiLiveViewportStableLoaded)return;
  window.__ktMultiLiveViewportStableLoaded=true;

  var lockedHeight=0;
  var lockedSection=null;
  var lockedScreen=null;

  function isMobile(){return !window.matchMedia||window.matchMedia('(max-width: 767px)').matches;}
  function isMulti(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      return t==='group13'||t==='group'||t==='subscriber'||Number(window.state&&state.liveRoomMax)>1;
    }catch(e){return false;}
  }
  function currentHeight(){
    var h=0;
    try{h=window.visualViewport&&window.visualViewport.height?window.visualViewport.height:0;}catch(e){}
    if(!h)h=window.innerHeight||document.documentElement.clientHeight||0;
    return Math.max(480,Math.round(h||0));
  }
  function unlock(){
    try{
      if(lockedSection){
        lockedSection.style.removeProperty('height');
        lockedSection.style.removeProperty('min-height');
        lockedSection.style.removeProperty('max-height');
      }
      if(lockedScreen){
        lockedScreen.style.removeProperty('height');
        lockedScreen.style.removeProperty('min-height');
        lockedScreen.style.removeProperty('max-height');
      }
    }catch(e){}
    lockedHeight=0;lockedSection=null;lockedScreen=null;
  }
  function apply(){
    if(!isMobile()||!isMulti()){
      if(lockedSection||lockedScreen)unlock();
      return;
    }
    var v=document.getElementById('ktLiveVideo');
    if(!v){if(lockedSection||lockedScreen)unlock();return;}
    var section=v.closest('section');
    var screen=document.getElementById('screen');
    if(!section||!screen)return;
    if(!lockedHeight||lockedSection!==section){
      unlock();
      lockedHeight=currentHeight();
      lockedSection=section;
      lockedScreen=screen;
    }
    var px=lockedHeight+'px';
    section.style.setProperty('height',px,'important');
    section.style.setProperty('min-height',px,'important');
    section.style.setProperty('max-height',px,'important');
    screen.style.setProperty('height',px,'important');
    screen.style.setProperty('min-height',px,'important');
    screen.style.setProperty('max-height',px,'important');
  }

  try{new MutationObserver(function(){setTimeout(apply,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,500);
  setTimeout(apply,100);
})();
