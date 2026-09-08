/* K-Talk 태블릿 전용 안정화: 휴대폰/PC는 건드리지 않고 태블릿에서 카메라 중복 연결과 과한 해상도만 줄인다. */
(function(){
  if(window.__ktTabletPerformanceFixInstalled)return;

  function isAndroidTablet(){
    try{
      var ua=navigator.userAgent||'';
      if(!/Android/i.test(ua))return false;
      var w=Math.min(window.screen&&screen.width||innerWidth,window.screen&&screen.height||innerHeight);
      var cssW=Math.min(innerWidth||0,innerHeight||0);
      return w>=600||cssW>=600||!/Mobile/i.test(ua);
    }catch(e){return false;}
  }

  if(!isAndroidTablet())return;
  window.__ktTabletPerformanceFixInstalled=true;
  document.documentElement.classList.add('kt-tablet-stable');

  function hasLive(stream,kind){
    try{
      var tracks=kind==='audio'?stream.getAudioTracks():stream.getVideoTracks();
      return !!(tracks&&tracks.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  async function attach(stream){
    if(!stream)return false;
    try{if(window.state)state.stream=stream;}catch(e){}
    var cam=document.getElementById('camera');
    var bg=document.getElementById('cameraBg');
    try{
      if(cam){
        if(cam.srcObject!==stream)cam.srcObject=stream;
        cam.muted=true;cam.setAttribute('playsinline','');
        var p=cam.play();if(p&&p.catch)await p.catch(function(){});
      }
      if(bg){
        if(bg.srcObject!==stream)bg.srcObject=stream;
        bg.muted=true;bg.setAttribute('playsinline','');
        var q=bg.play();if(q&&q.catch)await q.catch(function(){});
      }
      var c=document.getElementById('creator');if(c)c.classList.add('camera-on');
    }catch(e){}
    return hasLive(stream,'video');
  }

  async function addMic(stream){
    if(!stream||hasLive(stream,'audio')||!navigator.mediaDevices)return;
    try{
      var a=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      a.getAudioTracks().forEach(function(t){try{stream.addTrack(t);}catch(e){}});
    }catch(e){}
  }

  var pending=null;
  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
    window.ensureLiveCamera=async function(facing){
      var current=null;
      try{current=window.state&&state.stream;}catch(e){}
      if(current&&hasLive(current,'video')){
        await attach(current);
        return true;
      }
      if(pending)return pending;

      pending=(async function(){
        var face=facing||((window.state&&state.cameraFacing)||'user');
        var tries=[
          {video:{facingMode:{ideal:face},width:{ideal:960,max:1280},height:{ideal:540,max:720},frameRate:{ideal:24,max:24}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}},
          {video:{facingMode:{ideal:face},width:{ideal:640},height:{ideal:480},frameRate:{ideal:20,max:24}},audio:false},
          {video:{facingMode:{ideal:face}},audio:false},
          {video:true,audio:false}
        ];
        for(var i=0;i<tries.length;i++){
          try{
            var stream=await navigator.mediaDevices.getUserMedia(tries[i]);
            if(!hasLive(stream,'video')){try{stream.getTracks().forEach(function(t){t.stop();});}catch(e){}continue;}
            try{
              var prev=window.state&&state.stream;
              if(prev&&prev!==stream)prev.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
            }catch(e){}
            try{if(window.state){state.stream=stream;state.cameraFacing=face;}}catch(e){}
            await attach(stream);
            if(!hasLive(stream,'audio'))await addMic(stream);
            try{sessionStorage.setItem('kt_camera_allowed_this_session','1');}catch(e){}
            return true;
          }catch(e){}
        }
        /* 태블릿 전용 시도가 모두 실패한 경우에만 기존 연결을 한 번 사용 */
        try{return await oldEnsure.call(this,face);}catch(e){return false;}
      }).call(this);

      try{return await pending;}finally{pending=null;}
    };
  }

  /* 태블릿에서만 GPU 부담이 큰 장식 효과를 살짝 가볍게. 위치/버튼/기능은 그대로 유지. */
  var st=document.createElement('style');
  st.id='ktTabletStableStyle';
  st.textContent='html.kt-tablet-stable .ktsolo-wave,html.kt-tablet-stable .ktsubscriber-wave,html.kt-tablet-stable .ktsecret-wave,html.kt-tablet-stable .ktg13-main::after{filter:none!important}html.kt-tablet-stable #creator video{will-change:auto!important}';
  document.head.appendChild(st);
})();
