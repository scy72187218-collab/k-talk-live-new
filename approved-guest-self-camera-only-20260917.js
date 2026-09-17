/* K-Talk: 승인된 게스트 격자에서 '나·게스트' 칸만 해당 기기의 앞카메라로 보강. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestSelfCameraOnly20260917)return;
  window.__ktApprovedGuestSelfCameraOnly20260917=true;

  var localStream=null;
  var opening=false;

  function liveTracks(st){
    try{return (st&&st.getVideoTracks?st.getVideoTracks():[]).filter(function(t){return t.readyState==='live';});}
    catch(e){return [];}
  }
  function streamLive(st){return liveTracks(st).length>0;}
  function sameVideoSource(a,b){
    try{
      var aa=liveTracks(a),bb=liveTracks(b);
      if(!aa.length||!bb.length)return false;
      return aa.some(function(x){return bb.some(function(y){return x===y||x.id===y.id;});});
    }catch(e){return false;}
  }
  function attachSelf(v,st){
    if(!v||!streamLive(st))return false;
    try{
      if(v.srcObject!==st)v.srcObject=st;
      v.muted=true;
      v.autoplay=true;
      v.playsInline=true;
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.style.setProperty('transform','scaleX(-1)','important');
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      return true;
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

      /* 이미 확보한 이 기기의 앞카메라가 있으면 항상 그 스트림을 우선 사용한다. */
      if(streamLive(localStream)){
        attachSelf(selfVideo,localStream);
        return;
      }

      /* 객체가 다르더라도 실제 영상 트랙이 호스트와 같으면 정상 게스트 영상으로 보지 않는다. */
      if(streamLive(selfStream)&&!sameVideoSource(selfStream,hostStream)){
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
      attachSelf(selfVideo,localStream);
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
