/* K-Talk: 촬영/보정 화면을 둘러볼 때는 마이크를 요청하지 않고, 실제 촬영/방송 시작 때만 마이크를 요청한다. */
(function(){
  function install(){
    if(window.__ktMicPromptFixInstalled)return;
    if(typeof window.ensureLiveCamera!=='function')return;
    window.__ktMicPromptFixInstalled=true;

    var oldEnsure=window.ensureLiveCamera;
    var oldOpenCreator=window.openCreator;
    var oldStartCreator=window.startCreatorRecording;
    var oldStartBroadcast=window.startBroadcast;
    var forcingMic=false;

    function hasLiveVideo(stream){
      try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
    }

    function isCreatorPreview(){
      var c=document.getElementById('creator');
      if(!c||!c.classList.contains('show'))return false;
      if(forcingMic)return false;
      if(c.classList.contains('creator-recording'))return false;
      return true;
    }

    async function attachVideoOnly(facing){
      var stream=null;
      try{stream=window.state&&state.stream;}catch(e){}
      if(!hasLiveVideo(stream)){
        if(!navigator.mediaDevices||typeof navigator.mediaDevices.getUserMedia!=='function')return false;
        var face=facing||(window.state&&state.cameraFacing)||'user';
        var tries=[
          {video:{facingMode:{ideal:face},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},audio:false},
          {video:{facingMode:{ideal:face},width:{ideal:640},height:{ideal:480}},audio:false},
          {video:{facingMode:{ideal:face}},audio:false},
          {video:true,audio:false}
        ];
        for(var i=0;i<tries.length;i++){
          try{
            stream=await navigator.mediaDevices.getUserMedia(tries[i]);
            if(hasLiveVideo(stream))break;
          }catch(e){stream=null;}
        }
        if(!hasLiveVideo(stream))return false;
        try{if(window.state&&state.stream&&state.stream!==stream){state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}}catch(e){}
        try{if(window.state){state.stream=stream;state.cameraFacing=face;}}catch(e){}
      }
      try{
        var cam=document.getElementById('camera');
        var bg=document.getElementById('cameraBg');
        if(cam){cam.srcObject=stream;cam.muted=true;cam.setAttribute('playsinline','');try{await cam.play();}catch(e){}}
        if(bg){bg.srcObject=stream;bg.muted=true;bg.setAttribute('playsinline','');try{await bg.play();}catch(e){}}
        var c=document.getElementById('creator');if(c)c.classList.add('camera-on');
        return true;
      }catch(e){return false;}
    }

    window.ensureLiveCamera=async function(facing){
      if(isCreatorPreview())return attachVideoOnly(facing);
      return oldEnsure.apply(this,arguments);
    };

    if(typeof oldOpenCreator==='function'){
      window.openCreator=async function(){
        var c=document.getElementById('creator');
        if(c)c.classList.add('show');
        return oldOpenCreator.apply(this,arguments);
      };
    }

    if(typeof oldStartCreator==='function'){
      window.startCreatorRecording=async function(){
        forcingMic=true;
        try{return await oldStartCreator.apply(this,arguments);}finally{forcingMic=false;}
      };
    }

    if(typeof oldStartBroadcast==='function'){
      window.startBroadcast=async function(){
        forcingMic=true;
        try{return await oldStartBroadcast.apply(this,arguments);}finally{forcingMic=false;}
      };
    }
  }

  if(document.readyState==='complete')setTimeout(install,0);
  else window.addEventListener('load',function(){setTimeout(install,0);},{once:true});
})();
