/* K-Talk remote viewer end cleanup.
   Scope: if a remote LIVE video freezes after having played, leave the live room
   and return to the normal video feed. Does not touch LIVE signal publishing,
   guest requests, layouts, chat, switches, or host room controls. */
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

  function inApprovedGuestRoom(){
    try{
      return !!document.querySelector(
        '.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-prejoin-room-grid'
      );
    }catch(e){return false;}
  }

  function keepApprovedGuestConnected(){
    if(!inApprovedGuestRoom())return false;
    /* Approved guest rooms must never interpret a temporary WebRTC/LiveKit
       track replacement, mute, ended, or stalled currentTime as a real host end.
       Explicit host-end synchronization already handles genuine broadcast ends. */
    lastProgress=Date.now();
    armedAt=0;
    busy=false;
    try{
      if(typeof window.ktAttachDirectRemoteStream20260922==='function'){
        window.ktAttachDirectRemoteStream20260922();
      }
    }catch(e){}
    return true;
  }

  function returnToVideo(){
    if(keepApprovedGuestConnected())return;
    if(busy)return;
    busy=true;
    try{
      if(typeof window.ktCloseRemoteFallbackInApp20260923==='function'){
        window.ktCloseRemoteFallbackInApp20260923();
      }
    }catch(e){}
    try{
      if(typeof window.ktCloseRemotePresenceInApp20260923==='function'){
        var q=window.ktCloseRemotePresenceInApp20260923();
        if(q&&typeof q.catch==='function')q.catch(function(){});
      }
    }catch(e){}
    try{document.documentElement.classList.remove('kt-remote-viewing');}catch(e){}
    setTimeout(function(){
      try{
        if(typeof window.ktShowSharedServerFeed==='function'){
          window.ktShowSharedServerFeed();
        }else if(typeof window.ktForceHomeVideoRecovery==='function'){
          window.ktForceHomeVideoRecovery(true);
        }else if(typeof window.home==='function'){
          window.home();
        }
      }catch(e){}
      reset();
    },60);
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
        v.addEventListener('ended',function(){
          if(!keepApprovedGuestConnected())returnToVideo();
        },{once:true});
        v.addEventListener('emptied',function(){
          if(!armedAt)return;
          if(!keepApprovedGuestConnected())returnToVideo();
        },{once:true});
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

    /* Host broadcast ended: browsers can keep the last video frame frozen.
       If no new frame/time progress arrives for 8.5s after video had played,
       close the room and go back to the normal video feed. */
    if(now-lastProgress>5000){
      /* 승인된 게스트는 연결 경로가 교체되는 동안 currentTime이 잠깐 멈출 수 있다.
         이 상태를 방송 종료로 보지 않고 현재 방에 유지한다. 실제 종료는
         realtime/live_off 및 explicit broadcast-end sync가 처리한다. */
      if(keepApprovedGuestConnected())return;
      returnToVideo();
    }
  }

  setInterval(tick,400);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(tick,80);});
  window.addEventListener('focus',function(){setTimeout(tick,80);});
})();