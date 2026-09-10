/* K-Talk: 외부 USB/오디오 인터페이스 녹음 소리만 보강. 화면/방송 UI는 변경하지 않음. */
(function(){
  if(window.__ktInterfaceRecordingAudioFixInstalled)return;
  window.__ktInterfaceRecordingAudioFixInstalled=true;

  function liveAudio(stream){
    try{return stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live';});}catch(e){return false;}
  }

  function preferredAudioInput(devices){
    var list=(devices||[]).filter(function(d){return d&&d.kind==='audioinput';});
    if(!list.length)return null;
    var re=/(usb|interface|audio interface|uac|codec|line|stereo mix|mix|오디오|인터페이스|라인)/i;
    return list.find(function(d){return re.test(d.label||'');})||null;
  }

  async function getInterfaceAudio(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return null;
    var preferred=null;
    try{preferred=preferredAudioInput(await navigator.mediaDevices.enumerateDevices());}catch(e){}

    var base={
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      sampleRate:{ideal:48000},
      channelCount:{ideal:2}
    };
    var tries=[];
    if(preferred&&preferred.deviceId){
      tries.push({audio:Object.assign({},base,{deviceId:{exact:preferred.deviceId}}),video:false});
    }
    tries.push({audio:base,video:false});
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
    var s=null;
    try{s=window.state&&state.stream;}catch(e){}
    if(liveAudio(s))return true;

    var a=await getInterfaceAudio();
    if(!a)return false;
    var track=null;
    try{track=a.getAudioTracks()[0];}catch(e){}
    if(!track)return false;

    try{
      if(window.state&&state.stream){
        state.stream.getAudioTracks().forEach(function(t){try{state.stream.removeTrack(t);t.stop();}catch(e){}});
        state.stream.addTrack(track);
      }
    }catch(e){}
    return true;
  }

  function wakeMusicCapture(){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      var c=window.ktCreatorMusicCapture;
      if(c){
        try{if(c.ctx&&c.ctx.state==='suspended')c.ctx.resume().catch(function(){});}catch(e){}
        try{
          if(c.audio){
            c.audio.muted=false;
            c.audio.volume=1;
            var p=c.audio.play();
            if(p&&p.catch)p.catch(function(){});
          }
        }catch(e){}
        clearInterval(timer);
      }else if(tries>=90){clearInterval(timer);}
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
