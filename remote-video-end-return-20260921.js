/* K-Talk remote viewer freeze guard.
   2026-09-26: a transient ended/emptied/frozen media element is NOT proof that
   the host broadcast ended. Stay in the live room and let realtime recovery
   reconnect. Explicit broadcast-end synchronization handles real host stops.
   Does not touch layouts, chat, switches, or host room controls. */
(function(){
  if(window.__ktRemoteVideoEndReturn20260921)return;
  window.__ktRemoteVideoEndReturn20260921=true;

  var watched=null,lastTime=-1,lastProgress=0,armedAt=0,busy=false;

  function inRemote(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
             !!document.querySelector('.kt-remote-live,#ktRemoteLiveVideo');
    }catch(e){return false;}
  }

  function reset(){
    watched=null;lastTime=-1;lastProgress=0;armedAt=0;busy=false;
  }

  function keepRoomAndRecover(){
    if(!inRemote())return;
    try{
      var st=document.getElementById('ktRemoteLiveStatus');
      if(st){st.style.display='block';st.textContent='신호 다시 연결 중...';}
    }catch(e){}
    /* Do not clear host id, remote-viewing class, or navigate to the public
       video feed. Existing direct/fallback transports own reconnection. */
    lastProgress=Date.now();
  }

  function watchedVideo(){
    try{
      var hostLike=document.querySelector('.kt-guest-hostlike-room .kgh-cell.host video');
      if(hostLike&&hostLike.isConnected)return hostLike;
      var approved=document.querySelector('.kt-approved-guest-grid .kt-approved-guest-cell.host video');
      if(approved&&approved.isConnected)return approved;
      var prejoin=document.querySelector('.kt-prejoin-room-grid .kt-prejoin-room-cell.host video');
      if(prejoin&&prejoin.isConnected)return prejoin;
      var preview=document.getElementById('ktRemoteHostPreview');
      if(preview&&preview.isConnected)return preview;
    }catch(e){}
    return document.getElementById('ktRemoteLiveVideo');
  }

  function tick(){
    if(!inRemote()){reset();return;}
    var v=watchedVideo();
    if(!v||!v.isConnected)return;

    if(watched!==v){
      watched=v;lastTime=Number(v.currentTime||0);lastProgress=Date.now();armedAt=0;busy=false;
      try{
        v.addEventListener('ended',keepRoomAndRecover,{once:true});
        v.addEventListener('emptied',function(){if(armedAt)keepRoomAndRecover();},{once:true});
      }catch(e){}
      return;
    }

    var t=Number(v.currentTime||0),now=Date.now();
    if(t>lastTime+0.04){
      lastTime=t;lastProgress=now;
      if(!armedAt&&t>0.15)armedAt=now;
      return;
    }

    if(!armedAt)return;

    /* A five-second frame stall is a reconnect condition, not a host-end
       condition. Never auto-eject to the public video feed here. */
    if(now-lastProgress>5000){
      keepRoomAndRecover();
    }
  }

  setInterval(tick,400);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(tick,80);});
  window.addEventListener('focus',function(){setTimeout(tick,80);});
})();