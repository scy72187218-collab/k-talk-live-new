/* K-Talk: reuse an already-approved camera/mic stream while the page stays open, so creator reopen does not ask again unnecessarily. */
(function(){
  if(window.__ktPermissionReuseLoaded)return;
  window.__ktPermissionReuseLoaded=true;

  var idleStopTimer=null;
  var IDLE_STOP_MS=3*60*1000;

  function hasLiveStream(stream){
    try{return !!(stream&&stream.getTracks&&stream.getTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
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
  function stopStream(stream){
    try{stream&&stream.getTracks&&stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}
  }
  function keepBriefly(stream){
    if(!hasLiveStream(stream))return;
    clearTimeout(idleStopTimer);

    /* 방송 화면으로 넘어가는 동안에는 카메라/마이크 트랙을 절대 끄지 않습니다. */
    if(liveScreenOpen()){
      enableStream(stream);
      return;
    }

    disableStream(stream);
    idleStopTimer=setTimeout(function(){
      try{
        if(liveScreenOpen()){
          enableStream(stream);
          return;
        }
        if(window.state&&state.stream===stream){
          stopStream(stream);
          state.stream=null;
          var c=document.getElementById('camera');
          if(c)c.srcObject=null;
        }
      }catch(e){}
    },IDLE_STOP_MS);
  }

  function wrapEnsure(){
    var old=window.ensureLiveCamera;
    if(typeof old!=='function'||old.__ktPermissionReuseWrapped)return;
    var wrapped=async function(){
      clearTimeout(idleStopTimer);
      try{
        if(window.state&&hasLiveStream(state.stream))enableStream(state.stream);
      }catch(e){}
      return await old.apply(this,arguments);
    };
    wrapped.__ktPermissionReuseWrapped=true;
    wrapped.__ktOriginal=old;
    window.ensureLiveCamera=wrapped;
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
          keepBriefly(saved);
        }
      }
      return r;
    };
    wrapped.__ktPermissionReuseWrapped=true;
    wrapped.__ktOriginal=old;
    window.closeCreator=wrapped;
  }

  function install(){wrapEnsure();wrapClose();}
  install();
  setTimeout(install,100);
  setTimeout(install,700);
  setInterval(install,2500);

  window.addEventListener('pagehide',function(){
    clearTimeout(idleStopTimer);
    try{if(window.state&&state.stream){stopStream(state.stream);state.stream=null;}}catch(e){}
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
