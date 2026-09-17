/* K-Talk: 승인된 게스트 격자에서 '나·게스트' 칸만 해당 기기의 앞카메라로 보강. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestSelfCameraOnly20260917)return;
  window.__ktApprovedGuestSelfCameraOnly20260917=true;

  var localStream=null;
  var opening=false;

  function streamLive(st){
    try{
      var tracks=st&&st.getVideoTracks?st.getVideoTracks():[];
      return !!(tracks&&tracks.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  async function ensureSelfCamera(){
    try{
      var room=document.querySelector('.kt-remote-live.kt-approved-guest-room');
      if(!room)return;
      var grid=room.querySelector('.kt-approved-guest-grid');
      var selfCell=grid&&grid.querySelector('.kt-approved-guest-cell.self');
      var hostCell=grid&&grid.querySelector('.kt-approved-guest-cell.host');
      var selfVideo=selfCell&&selfCell.querySelector('video');
      var hostVideo=hostCell&&hostCell.querySelector('video');
      if(!selfVideo)return;

      var selfStream=selfVideo.srcObject||null;
      var hostStream=hostVideo&&hostVideo.srcObject||null;

      /* 이미 서로 다른 정상 카메라면 그대로 둔다. */
      if(streamLive(selfStream)&&selfStream!==hostStream)return;

      if(streamLive(localStream)){
        selfVideo.srcObject=localStream;
        selfVideo.muted=true;
        selfVideo.autoplay=true;
        selfVideo.playsInline=true;
        selfVideo.style.setProperty('transform','scaleX(-1)','important');
        try{var p=selfVideo.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        return;
      }

      if(opening||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
      opening=true;
      try{
        localStream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:'user'},width:{ideal:960},height:{ideal:540},frameRate:{ideal:24,max:30}},
          audio:false
        });
      }catch(e){
        try{localStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});}catch(z){localStream=null;}
      }
      opening=false;
      if(!streamLive(localStream))return;
      selfVideo.srcObject=localStream;
      selfVideo.muted=true;
      selfVideo.autoplay=true;
      selfVideo.playsInline=true;
      selfVideo.style.setProperty('transform','scaleX(-1)','important');
      try{var q=selfVideo.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
    }catch(e){opening=false;}
  }

  setInterval(ensureSelfCamera,500);
  [100,300,700,1200,2000].forEach(function(ms){setTimeout(ensureSelfCamera,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(ensureSelfCamera,60);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pagehide',function(){
    try{if(localStream)localStream.getTracks().forEach(function(t){t.stop();});}catch(e){}
  });
})();
