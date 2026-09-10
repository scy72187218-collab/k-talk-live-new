/* K-Talk 노래방 음질 보강: 외부 오디오 인터페이스의 에코/음악을 브라우저가 지우지 않도록 원음 입력을 우선 사용한다. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktKaraokeAudioQualityInstalled)return;
  window.__ktKaraokeAudioQualityInstalled=true;

  function live(track){return !!(track&&track.readyState==='live');}
  function externalLike(label){
    return /(usb|audio interface|interface|uac|codec|line in|stereo mix|external|인터페이스|외장|라인|스테레오 믹스)/i.test(String(label||''));
  }
  function settings(track){try{return track&&track.getSettings?track.getSettings():{};}catch(e){return {};}}
  function rawAlready(track){
    var s=settings(track);
    return s.echoCancellation===false && s.noiseSuppression===false && s.autoGainControl===false;
  }
  async function devices(){try{return await navigator.mediaDevices.enumerateDevices();}catch(e){return [];}}

  async function openRaw(deviceId){
    var base={
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      sampleRate:{ideal:48000},
      channelCount:{ideal:2}
    };
    var tries=[];
    if(deviceId){
      tries.push({audio:Object.assign({},base,{deviceId:{exact:deviceId}}),video:false});
      tries.push({audio:{deviceId:{exact:deviceId},echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
    }
    tries.push({audio:base,video:false});
    for(var i=0;i<tries.length;i++){
      try{
        var stream=await navigator.mediaDevices.getUserMedia(tries[i]);
        var t=stream.getAudioTracks&&stream.getAudioTracks()[0];
        if(live(t)){
          try{await t.applyConstraints({echoCancellation:false,noiseSuppression:false,autoGainControl:false});}catch(e){}
          return {stream:stream,track:t};
        }
        try{stream.getTracks().forEach(function(x){x.stop();});}catch(e){}
      }catch(e){}
    }
    return null;
  }

  async function prepareRawKaraokeInput(){
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;
    var baseStream=null,current=null;
    try{baseStream=window.state&&state.stream;current=baseStream&&baseStream.getAudioTracks&&baseStream.getAudioTracks()[0];}catch(e){}

    /* 이미 원음 모드로 잡힌 같은 입력이면 그대로 사용한다. */
    if(live(current)&&rawAlready(current)){
      try{state.__ktKaraokeRawAudio=true;}catch(e){}
      return true;
    }

    var list=await devices();
    var currentSettings=settings(current);
    var targetId=currentSettings.deviceId||'';
    var preferred=list.find(function(d){return d&&d.kind==='audioinput'&&externalLike(d.label);});

    /* 외부 인터페이스가 보이면 그것을 가장 먼저 사용한다. */
    if(preferred&&preferred.deviceId)targetId=preferred.deviceId;
    if(!targetId&&current&&current.label){
      var same=list.find(function(d){return d&&d.kind==='audioinput'&&d.label===current.label;});
      if(same)targetId=same.deviceId||'';
    }

    var opened=await openRaw(targetId);
    if(!opened||!live(opened.track))return live(current);

    try{
      if(window.state&&state.stream){
        var oldTracks=state.stream.getAudioTracks?state.stream.getAudioTracks().slice():[];
        oldTracks.forEach(function(t){try{state.stream.removeTrack(t);}catch(e){}});
        state.stream.addTrack(opened.track);
        oldTracks.forEach(function(t){try{if(t!==opened.track)t.stop();}catch(e){}});
        try{
          state.__ktKaraokeRawAudio=true;
          state.__ktInterfaceAudioReady=externalLike(opened.track.label);
          state.__ktInterfaceAudioLabel=opened.track.label||'';
        }catch(e){}
        return true;
      }
    }catch(e){}

    try{opened.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}
    return false;
  }

  /* 실제 촬영 시작 직전에 원음 입력으로 바꾼다. 기존 카운트다운/촬영/화면은 그대로 둔다. */
  var oldStart=window.startCreatorRecording;
  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      try{await prepareRawKaraokeInput();}catch(e){}
      return oldStart.apply(this,arguments);
    };
  }

  window.ktPrepareRawKaraokeInput=prepareRawKaraokeInput;
})();
