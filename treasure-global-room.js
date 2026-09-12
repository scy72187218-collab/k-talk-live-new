/* K-Talk: 기존 보물상자 기능은 그대로 두고, 카메라 뒤집기만 실제 전면/후면 전환으로 보정. */
(function(){
  function loadTreasureCore(){
    var s=document.createElement('script');
    s.src='treasure-global-room-core.js?v=20260911-treasure1';
    s.async=false;
    document.head.appendChild(s);
  }

  function loadTreasureHostResults(){
    var s=document.createElement('script');
    s.src='treasure-host-results.js?v=20260911-hostresults1';
    s.async=false;
    document.head.appendChild(s);
  }

  function installRealCameraFlip(){
    if(window.__ktRealCameraFlipInstalled)return;
    if(typeof window.ktSoloFlipCamera!=='function')return;
    window.__ktRealCameraFlipInstalled=true;

    function setVideo(el,stream,facing){
      if(!el)return;
      try{
        el.srcObject=stream;
        el.muted=true;
        el.setAttribute('playsinline','');
        el.style.setProperty('transform',facing==='environment'?'none':'scaleX(-1)','important');
        var p=el.play();
        if(p&&p.catch)p.catch(function(){});
      }catch(e){}
    }

    async function getVideoStream(facing){
      try{
        return await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:facing},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }catch(e){
        return await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }
    }

    async function switchTo(facing){
      var oldStream=null;
      try{oldStream=window.state&&state.stream?state.stream:null;}catch(e){}
      var audioTracks=[];
      try{audioTracks=oldStream&&oldStream.getAudioTracks?oldStream.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];}catch(e){}
      try{if(oldStream&&oldStream.getVideoTracks)oldStream.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}

      var fresh=await getVideoStream(facing);
      var videoTrack=fresh&&fresh.getVideoTracks?fresh.getVideoTracks()[0]:null;
      if(!videoTrack)throw new Error('camera track missing');

      var combined=new MediaStream();
      combined.addTrack(videoTrack);
      audioTracks.forEach(function(t){try{combined.addTrack(t);}catch(e){}});
      if(window.state){state.stream=combined;state.cameraFacing=facing;}

      try{if(typeof window.ktAttachCreatorCamera==='function')await window.ktAttachCreatorCamera(combined);}catch(e){}

      var seen=[];
      document.querySelectorAll('#ktLiveVideo,.ktsolo-main video,.ktg13-host video,.ktsubscriber-host video,.ktsecret-host video,.ktg9-host video').forEach(function(v){
        if(seen.indexOf(v)>-1)return;
        seen.push(v);
        setVideo(v,combined,facing);
      });
      try{if(window.camera)setVideo(window.camera,combined,facing);}catch(e){}
      return true;
    }

    window.ktSoloFlipCamera=async function(btn){
      if(btn&&btn.dataset.busy==='1')return;
      if(btn)btn.dataset.busy='1';
      var oldFacing='user';
      try{oldFacing=(window.state&&state.cameraFacing)||'user';}catch(e){}
      var next=oldFacing==='environment'?'user':'environment';
      try{
        await switchTo(next);
        if(btn){
          btn.title=next==='environment'?'전면 카메라로 바꾸기':'후면 카메라로 바꾸기';
          btn.setAttribute('aria-label','카메라 앞뒤 전환');
        }
      }catch(err){
        try{await switchTo(oldFacing);}catch(e){}
      }finally{
        if(btn)btn.dataset.busy='0';
      }
    };
  }

  loadTreasureCore();
  loadTreasureHostResults();
  setTimeout(installRealCameraFlip,0);
  setTimeout(installRealCameraFlip,300);
  setTimeout(installRealCameraFlip,1000);
})();
