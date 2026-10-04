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

  function localHostStream(){
    try{
      if(window.state&&liveStream(window.state.stream))return window.state.stream;
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

  attach();
  [20,80,180,350,700,1200,2200,4000].forEach(function(ms){setTimeout(attach,ms);});
  window.addEventListener('pageshow',function(){setTimeout(attach,60);});
  window.addEventListener('online',function(){setTimeout(attach,100);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(attach,80);
  });
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostCameraReattachTimer20261004);
      window.__ktG9HostCameraReattachTimer20261004=setTimeout(attach,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
