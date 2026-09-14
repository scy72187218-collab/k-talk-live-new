/* K-Talk: 일부 휴대폰에서 앞카메라 요청 실패 시 뒷카메라로 떨어지는 경우만 보강. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktFrontCameraUserFallback20260914)return;
  window.__ktFrontCameraUserFallback20260914=true;

  function attachStream(stream){
    if(!stream)return;
    try{
      document.querySelectorAll('#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          v.srcObject=stream;
          v.style.setProperty('transform','scaleX(-1)','important');
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }

  async function forceFrontOnce(){
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.state)return false;
      var current=state.stream;
      var currentVideo=current&&current.getVideoTracks?current.getVideoTracks()[0]:null;
      if(currentVideo&&currentVideo.__ktFrontVerified)return true;

      var front=null;
      try{
        front=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:'user'},width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }catch(e){
        if(currentVideo)currentVideo.__ktFrontVerified=true;
        return false;
      }

      var frontTrack=front&&front.getVideoTracks?front.getVideoTracks()[0]:null;
      if(!frontTrack){try{front&&front.getTracks().forEach(function(t){t.stop();});}catch(e){}return false;}
      frontTrack.__ktFrontVerified=true;

      var audioTracks=current&&current.getAudioTracks?current.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];
      var merged=new MediaStream([frontTrack].concat(audioTracks));
      if(current&&current.getVideoTracks){current.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});}
      state.stream=merged;
      state.cameraFacing='user';
      attachStream(merged);
      return true;
    }catch(e){return false;}
  }

  function install(){
    var old=window.ensureLiveCamera;
    if(typeof old!=='function'||old.__ktFrontCameraUserFallbackWrapped)return;
    var wrapped=async function(facing){
      var want=facing||((window.state&&state.cameraFacing)||'user');
      var ok=await old.apply(this,arguments);
      if(ok&&want==='user')await forceFrontOnce();
      return ok;
    };
    wrapped.__ktFrontCameraUserFallbackWrapped=true;
    window.ensureLiveCamera=wrapped;
  }

  install();
  setTimeout(install,0);
  setTimeout(install,500);
})();
