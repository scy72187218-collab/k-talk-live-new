/* 9명 호스트방 카메라 재부착 전용 — 2026-10-04
   범위: #screen .ktg13-room[data-kt-room="9"] .ktg13-host > video
   UI/배치/게스트/채팅/버튼은 변경하지 않는다. */
(function(){
  if(window.__ktG9HostCameraReattach20261004)return;
  window.__ktG9HostCameraReattach20261004=true;

  function liveStream(s){
    try{
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){
        return t&&t.readyState==='live';
      }));
    }catch(e){return false;}
  }

  var prewarmedHostStream20261004=null;

  function rememberHostStream20261004(){
    try{
      var s=(window.state&&window.state.stream)||null;
      if(!liveStream(s)){
        var cam=document.getElementById('camera');
        if(cam&&liveStream(cam.srcObject))s=cam.srcObject;
      }
      if(!liveStream(s)){
        var bg=document.getElementById('cameraBg');
        if(bg&&liveStream(bg.srcObject))s=bg.srcObject;
      }
      if(liveStream(s))prewarmedHostStream20261004=s;
    }catch(e){}
  }

  function localHostStream(){
    try{
      if(window.state&&liveStream(window.state.stream)){
        prewarmedHostStream20261004=window.state.stream;
        return window.state.stream;
      }
    }catch(e){}
    try{
      if(liveStream(prewarmedHostStream20261004))return prewarmedHostStream20261004;
    }catch(e){}
    try{
      var c=document.getElementById('camera');
      if(c&&liveStream(c.srcObject))return c.srcObject;
    }catch(e){}
    try{
      var b=document.getElementById('cameraBg');
      if(b&&liveStream(b.srcObject))return b.srcObject;
    }catch(e){}
    return null;
  }

  function isNineHostRoom(room){
    try{
      if(!room)return false;
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return String(room.getAttribute('data-kt-room')||'')==='9';
    }catch(e){return false;}
  }

  function attach(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!isNineHostRoom(room))return;
    var v=room.querySelector('.ktg13-host > video');
    if(!v)return;
    var s=localHostStream();
    if(!s)return;

    try{
      var current=v.srcObject;
      if(!liveStream(current)||current!==s)v.srcObject=s;
      v.autoplay=true;
      v.muted=true;
      v.defaultMuted=true;
      v.playsInline=true;
      v.setAttribute('autoplay','');
      v.setAttribute('muted','');
      v.setAttribute('playsinline','');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function nineStartTarget20261004(t){
    try{
      var btn=t&&t.closest?t.closest('.room-switch,.kt-room-bottom5 button,.kt-creator-room-shortcuts button,.prep-start'):null;
      if(!btn)return false;
      var text=String(btn.textContent||'').replace(/\s+/g,'');
      if(text.indexOf('9명')>-1)return true;
      if(btn.matches('.prep-start')){
        var st=window.state||{};
        return String(st.liveRoomType||'')==='group9'||String(st.liveRoomName||'').indexOf('9명')>-1||Number(st.liveRoomMax||0)===9;
      }
    }catch(e){}
    return false;
  }

  function prewarmOnNineStart20261004(e){
    if(!nineStartTarget20261004(e&&e.target))return;
    rememberHostStream20261004();
  }

  document.addEventListener('pointerdown',prewarmOnNineStart20261004,true);
  document.addEventListener('touchstart',prewarmOnNineStart20261004,{capture:true,passive:true});
  document.addEventListener('click',prewarmOnNineStart20261004,true);

  attach();
  [0,20,60,120,250,500,900,1600].forEach(function(ms){setTimeout(attach,ms);});
  window.addEventListener('pageshow',function(){setTimeout(attach,60);});
  window.addEventListener('online',function(){setTimeout(attach,100);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(attach,80);
  });
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostCameraReattachTimer20261004);
      rememberHostStream20261004();
      attach();
      window.__ktG9HostCameraReattachTimer20261004=setTimeout(attach,12);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
