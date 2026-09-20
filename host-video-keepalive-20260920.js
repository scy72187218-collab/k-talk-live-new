/* K-Talk 호스트 로컬 영상 유지 장치
   - 13명방 호스트 영상이 잠깐 붙었다가 빠지면 현재 카메라 스트림을 다시 연결
   - 게스트/채팅/레이아웃은 변경하지 않음 */
(function(){
  if(window.__ktHostVideoKeepalive20260920)return;
  window.__ktHostVideoKeepalive20260920=true;

  function liveLocalStream(){
    try{
      var s=window.state&&state.stream;
      if(!s||!s.getVideoTracks)return null;
      var ok=s.getVideoTracks().some(function(t){return t.readyState==='live';});
      return ok?s:null;
    }catch(e){return null;}
  }

  function attach(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return;
      var room=document.querySelector('#screen .ktg13-room');
      if(!room)return;
      var v=room.querySelector('#ktLiveVideo');
      var s=liveLocalStream();
      if(!v||!s)return;

      if(v.srcObject!==s)v.srcObject=s;
      v.muted=true;
      v.defaultMuted=true;
      v.playsInline=true;
      if(v.paused){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  [0,120,350,800,1500].forEach(function(ms){setTimeout(attach,ms);});
  window.__ktHostVideoKeepaliveTimer=setInterval(attach,1600);

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(attach,120);
  });
  window.addEventListener('focus',function(){setTimeout(attach,120);});
  window.addEventListener('pageshow',function(){setTimeout(attach,120);});
})();