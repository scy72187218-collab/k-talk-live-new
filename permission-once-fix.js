/* K-Talk: prevent duplicate camera/mic permission requests during one open page. Browser/OS permission UI itself cannot be bypassed. */
(function(){
  if(window.__ktPermissionOnceFixLoaded)return;
  window.__ktPermissionOnceFixLoaded=true;

  var heldStream=null;
  var ensurePending=null;

  function liveTrack(stream,kind){
    try{
      var a=kind==='audio'?stream.getAudioTracks():stream.getVideoTracks();
      return !!(a&&a.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }
  function usable(stream){return !!stream&&(liveTrack(stream,'video')||liveTrack(stream,'audio'));}
  function enable(stream){
    try{stream.getTracks().forEach(function(t){if(t.readyState==='live')t.enabled=true;});}catch(e){}
  }
  function disable(stream){
    try{stream.getTracks().forEach(function(t){if(t.readyState==='live')t.enabled=false;});}catch(e){}
  }
  function attach(stream){
    try{
      if(!stream||!liveTrack(stream,'video'))return;
      var c=document.getElementById('camera')||window.camera;
      if(c){
        if(c.srcObject!==stream)c.srcObject=stream;
        c.muted=true;c.setAttribute('playsinline','');
        var p=c.play();if(p&&p.catch)p.catch(function(){});
      }
      var cr=document.getElementById('creator')||window.creator;
      if(cr)cr.classList.add('camera-on');
    }catch(e){}
  }
  function remember(stream){
    if(!usable(stream))return;
    heldStream=stream;
    window.__ktHeldMediaStream=stream;
    try{if(window.state)state.stream=stream;}catch(e){}
  }
  function current(){
    try{if(window.state&&usable(state.stream))return state.stream;}catch(e){}
    if(usable(heldStream))return heldStream;
    if(usable(window.__ktHeldMediaStream))return window.__ktHeldMediaStream;
    return null;
  }

  function wrapEnsure(){
    var old=window.ensureLiveCamera;
    if(typeof old!=='function'||old.__ktPermissionOnceFix)return;

    var wrapped=async function(){
      var s=current();
      /* If camera+mic are already alive, never ask the browser again on this page. */
      if(s&&liveTrack(s,'video')&&liveTrack(s,'audio')){
        enable(s);remember(s);attach(s);return true;
      }
      /* If another button started the same permission request, share that one request. */
      if(ensurePending)return ensurePending;

      var ctx=this,args=arguments;
      ensurePending=(async function(){
        try{
          var ok=await old.apply(ctx,args);
          try{
            var now=(window.state&&state.stream)||current();
            if(ok&&usable(now)){remember(now);enable(now);attach(now);}
          }catch(e){}
          return ok;
        }finally{
          setTimeout(function(){ensurePending=null;},80);
        }
      })();
      return ensurePending;
    };
    wrapped.__ktPermissionOnceFix=true;
    wrapped.__ktOriginal=old;
    window.ensureLiveCamera=wrapped;
  }

  function wrapOpen(){
    var old=window.openCreator;
    if(typeof old!=='function'||old.__ktPermissionOnceFix)return;
    var wrapped=async function(){
      var s=current();
      if(s){
        try{if(window.state)state.stream=s;}catch(e){}
        enable(s);attach(s);
      }
      var out=await old.apply(this,arguments);
      try{var now=(window.state&&state.stream)||current();if(usable(now))remember(now);}catch(e){}
      return out;
    };
    wrapped.__ktPermissionOnceFix=true;
    wrapped.__ktOriginal=old;
    window.openCreator=wrapped;
  }

  function wrapClose(){
    var old=window.closeCreator;
    if(typeof old!=='function'||old.__ktPermissionOnceFix)return;
    var wrapped=function(){
      var s=current();
      if(s)remember(s);
      /* Hide state.stream only while old closeCreator runs, so it cannot stop the live tracks. */
      var hidden=false;
      try{
        if(s&&window.state&&state.stream===s){state.stream=null;hidden=true;}
      }catch(e){}
      var out;
      try{out=old.apply(this,arguments);}
      finally{
        if(s&&usable(s)){
          try{if(window.state)state.stream=s;}catch(e){}
          remember(s);disable(s);
        }else if(hidden){try{if(window.state)state.stream=null;}catch(e){}}
      }
      return out;
    };
    wrapped.__ktPermissionOnceFix=true;
    wrapped.__ktOriginal=old;
    window.closeCreator=wrapped;
  }

  function install(){wrapEnsure();wrapOpen();wrapClose();}
  install();
  setTimeout(install,50);
  setTimeout(install,300);
  setInterval(install,1200);

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState!=='visible')return;
    var s=current();if(!s)return;
    try{
      var cr=document.getElementById('creator')||window.creator;
      if(cr&&cr.classList.contains('show')){enable(s);attach(s);}
    }catch(e){}
  });
})();
