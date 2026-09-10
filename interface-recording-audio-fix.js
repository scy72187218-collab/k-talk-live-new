/* K-Talk: 외부 USB/오디오 인터페이스의 음악+목소리 녹음만 보강. 화면/방송 UI는 변경하지 않음. */
(function(){
  if(window.__ktInterfaceRecordingAudioFixInstalled)return;
  window.__ktInterfaceRecordingAudioFixInstalled=true;

  function liveAudio(stream){
    try{return !!(stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  function externalLike(label){
    return /(usb|audio interface|interface|uac|codec|line in|stereo mix|external|인터페이스|외장|라인|스테레오 믹스)/i.test(String(label||''));
  }

  function preferredAudioInput(devices){
    var list=(devices||[]).filter(function(d){return d&&d.kind==='audioinput';});
    return list.find(function(d){return externalLike(d.label);})||null;
  }

  async function enumerate(){
    try{return await navigator.mediaDevices.enumerateDevices();}catch(e){return [];}
  }

  async function requestAudio(deviceId){
    var clean={
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      sampleRate:{ideal:48000},
      channelCount:{ideal:2}
    };
    var tries=[];
    if(deviceId)tries.push({audio:Object.assign({},clean,{deviceId:{exact:deviceId}}),video:false});
    tries.push({audio:clean,video:false});
    tries.push({audio:true,video:false});
    for(var i=0;i<tries.length;i++){
      try{
        var s=await navigator.mediaDevices.getUserMedia(tries[i]);
        if(liveAudio(s))return s;
        try{s.getTracks().forEach(function(t){t.stop();});}catch(e){}
      }catch(e){}
    }
    return null;
  }

  async function ensureRecordingAudio(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;
    var current=null;
    try{current=window.state&&state.stream;}catch(e){}
    var currentTrack=null;
    try{currentTrack=current&&current.getAudioTracks&&current.getAudioTracks()[0];}catch(e){}

    var devices=await enumerate();
    var preferred=preferredAudioInput(devices);

    /* 권한 전에는 장치 이름이 비어 있을 수 있으므로, 소리가 아직 없을 때만 한 번 기본 입력을 열어 이름을 확인한다. */
    if(!preferred&&!currentTrack){
      var warm=null;
      try{warm=await navigator.mediaDevices.getUserMedia({audio:true,video:false});}catch(e){}
      if(warm){
        try{warm.getTracks().forEach(function(t){t.stop();});}catch(e){}
        devices=await enumerate();
        preferred=preferredAudioInput(devices);
      }
    }

    /* 이미 외부 인터페이스가 붙어 있으면 그대로 사용한다. */
    if(currentTrack&&currentTrack.readyState==='live'&&externalLike(currentTrack.label))return true;

    /* 외부 인터페이스가 보이면 그것을 우선 사용하고, 없으면 현재 마이크를 보존한다. */
    if(!preferred&&currentTrack&&currentTrack.readyState==='live')return true;

    var audioStream=await requestAudio(preferred&&preferred.deviceId?preferred.deviceId:'');
    if(!audioStream)return !!(currentTrack&&currentTrack.readyState==='live');
    var track=null;
    try{track=audioStream.getAudioTracks()[0];}catch(e){}
    if(!track)return !!(currentTrack&&currentTrack.readyState==='live');

    try{
      if(window.state&&state.stream){
        state.stream.getAudioTracks().forEach(function(t){try{state.stream.removeTrack(t);t.stop();}catch(e){}});
        state.stream.addTrack(track);
        state.__ktInterfaceAudioReady=true;
        state.__ktInterfaceAudioLabel=track.label||'';
        return true;
      }
    }catch(e){}
    return false;
  }

  /* 5초 카운트다운 뒤 실제 녹화가 시작될 때 생성되는 음악 캡처도 깨운다. */
  function wakeMusicCapture(){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      var c=window.ktCreatorMusicCapture;
      if(c){
        try{if(c.ctx&&c.ctx.state==='suspended')c.ctx.resume().catch(function(){});}catch(e){}
        try{
          if(c.audio){
            var audio=c.audio;
            var originalId=audio.id||'ktCreatorMusicCapture';
            /* 촬영 화면이 다른 미디어를 자동 정지할 때 이 녹음용 음악까지 꺼지는 것을 막는다. */
            audio.id='ktCreatorPreview';
            audio.muted=false;
            audio.volume=1;
            var p=audio.play();
            var restore=function(){setTimeout(function(){try{audio.id=originalId;}catch(e){}},180);};
            if(p&&p.then)p.then(restore).catch(function(){try{audio.id=originalId;}catch(e){}});
            else restore();
          }
        }catch(e){}
        clearInterval(timer);
      }else if(tries>=100){clearInterval(timer);}
    },100);
  }

  var oldStart=window.startCreatorRecording;
  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      try{await ensureRecordingAudio();}catch(e){}
      wakeMusicCapture();
      return oldStart.apply(this,arguments);
    };
  }

  window.ktEnsureInterfaceRecordingAudio=ensureRecordingAudio;
})();
