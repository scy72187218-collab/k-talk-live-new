/* K-Talk creator camera stability guard (2026-09-22)
   Scope: creator preview only. Prevents repeated detach/reattach of the same live camera stream.
   Does not change live rooms, guest rooms, chat, gifts, earnings or switches. */
(function(){
  if(window.__ktCreatorCameraStability20260922)return;
  window.__ktCreatorCameraStability20260922=true;

  function camera(){return document.getElementById('camera');}
  function creator(){return document.getElementById('creator');}
  function liveStream(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}
    catch(e){return false;}
  }
  function stableSameStream(stream){
    var v=camera();
    if(!v||!stream||v.srcObject!==stream||!liveStream(stream))return false;
    try{
      v.autoplay=true;v.muted=true;v.defaultMuted=true;v.playsInline=true;
      v.setAttribute('autoplay','');v.setAttribute('muted','');v.setAttribute('playsinline','');
      v.style.setProperty('object-fit','cover','important');
      v.style.setProperty('object-position','center center','important');
      v.style.setProperty('transform-origin','50% 50%','important');
      v.style.setProperty('backface-visibility','hidden','important');
      v.style.setProperty('-webkit-backface-visibility','hidden','important');
      var c=creator();if(c)c.classList.add('camera-on');
      if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}
    }catch(e){}
    return true;
  }

  function install(){
    var attach=window.ktAttachCreatorCamera;
    if(typeof attach==='function'&&!attach.__ktStableNoReattach){
      var wrappedAttach=async function(stream){
        if(stableSameStream(stream)){
          try{if(typeof window.applyBaseCameraLook==='function')window.applyBaseCameraLook();}catch(e){}
          return true;
        }
        var out=await attach.apply(this,arguments);
        stableSameStream(stream);
        return out;
      };
      wrappedAttach.__ktStableNoReattach=true;
      window.ktAttachCreatorCamera=wrappedAttach;
    }

    var ensure=window.ensureLiveCamera;
    if(typeof ensure==='function'&&!ensure.__ktStableNoReattach){
      var wrappedEnsure=async function(facing){
        try{
          var stream=window.state&&state.stream;
          var track=stream&&stream.getVideoTracks&&stream.getVideoTracks()[0];
          var live=!!(track&&track.readyState==='live');
          var current=(window.state&&state.cameraFacing)||'user';
          var wanted=facing||current;
          if(live&&wanted===current&&stableSameStream(stream)){
            try{if(typeof window.applyBaseCameraLook==='function')window.applyBaseCameraLook();}catch(e){}
            return true;
          }
        }catch(e){}
        var out=await ensure.apply(this,arguments);
        try{if(window.state&&state.stream)stableSameStream(state.stream);}catch(e){}
        return out;
      };
      wrappedEnsure.__ktStableNoReattach=true;
      window.ensureLiveCamera=wrappedEnsure;
    }
  }

  install();
  setTimeout(install,100);
  setTimeout(install,500);
  setTimeout(install,1200);

  try{
    var c=creator();
    if(c&&window.MutationObserver){
      new MutationObserver(function(){
        clearTimeout(window.__ktCreatorCameraStableInstallTimer);
        window.__ktCreatorCameraStableInstallTimer=setTimeout(install,40);
      }).observe(c,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'){
      setTimeout(function(){
        install();
        try{if(window.state&&state.stream)stableSameStream(state.stream);}catch(e){}
      },80);
    }
  });
})();