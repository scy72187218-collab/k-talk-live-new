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

  function requestRecovery(){
    lastProgress=Date.now();
    armedAt=0;
    busy=false;
    try{
      if(typeof window.ktAttachDirectRemoteStream20260922==='function'){
        window.ktAttachDirectRemoteStream20260922();
      }
    }catch(e){}
    try{
      if(typeof window.ktForceDirectViewerReconnect20260924==='function'){
        window.ktForceDirectViewerReconnect20260924();
      }
    }catch(e){}
    try{
      window.dispatchEvent(new CustomEvent('kt-remote-video-stalled',{detail:{at:Date.now()}}));
    }catch(e){}
  }

  function returnToVideo(){
    /* Video ended/emptied/stalled is not proof that the host ended.
       Keep the room open and let transport recovery work in place.
       Genuine exits are handled only by explicit broadcast-end synchronization. */
    requestRecovery();
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
        v.addEventListener('ended',function(){requestRecovery();},{once:true});
        v.addEventListener('emptied',function(){if(armedAt)requestRecovery();},{once:true});
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

    /* A stalled remote video means reconnect, not exit. */
    if(now-lastProgress>5000){
      requestRecovery();
    }
  }

  setInterval(tick,400);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(tick,80);});
  window.addEventListener('focus',function(){setTimeout(tick,80);});
})();