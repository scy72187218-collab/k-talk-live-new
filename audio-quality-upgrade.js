/* K-Talk 녹음 음질 업그레이드: 노래/오디오 인터페이스 입력을 최대한 원음에 가깝게 사용. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktAudioQualityUpgradeInstalled)return;
  window.__ktAudioQualityUpgradeInstalled=true;

  function liveAudioTracks(){
    try{
      var s=window.state&&state.stream;
      return s&&s.getAudioTracks?s.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];
    }catch(e){return [];}
  }

  async function tuneTrack(track){
    if(!track)return false;
    try{track.contentHint='music';}catch(e){}
    if(typeof track.applyConstraints!=='function')return true;
    try{
      await track.applyConstraints({
        echoCancellation:false,
        noiseSuppression:false,
        autoGainControl:false,
        channelCount:{ideal:2},
        sampleRate:{ideal:48000},
        sampleSize:{ideal:16},
        latency:{ideal:0.01}
      });
      return true;
    }catch(e){
      try{
        await track.applyConstraints({echoCancellation:false,noiseSuppression:false,autoGainControl:false});
        return true;
      }catch(err){return false;}
    }
  }

  async function getCleanMic(){
    if(!navigator.mediaDevices||typeof navigator.mediaDevices.getUserMedia!=='function')return null;
    var tries=[
      {video:false,audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2},sampleRate:{ideal:48000},sampleSize:{ideal:16},latency:{ideal:0.01}}},
      {video:false,audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}},
      {video:false,audio:true}
    ];
    for(var i=0;i<tries.length;i++){
      try{
        var s=await navigator.mediaDevices.getUserMedia(tries[i]);
        var t=s.getAudioTracks&&s.getAudioTracks()[0];
        if(t){await tuneTrack(t);return s;}
        try{s.getTracks().forEach(function(x){x.stop();});}catch(e){}
      }catch(e){}
    }
    return null;
  }

  async function prepareCleanAudio(){
    var tracks=liveAudioTracks();
    if(tracks.length){
      await tuneTrack(tracks[0]);
      return true;
    }
    var mic=await getCleanMic();
    if(!mic)return false;
    var added=false;
    try{
      if(window.state&&state.stream&&state.stream.addTrack){
        mic.getAudioTracks().forEach(function(t){
          try{t.contentHint='music';}catch(e){}
          try{state.stream.addTrack(t);added=true;}catch(e){}
        });
      }
    }catch(e){}
    if(!added){try{mic.getTracks().forEach(function(t){t.stop();});}catch(e){}}
    return added;
  }

  function install(){
    var oldStart=window.startCreatorRecording;
    if(typeof oldStart==='function'&&!oldStart.__ktCleanAudio){
      var wrappedStart=async function(){
        try{await prepareCleanAudio();}catch(e){}
        return oldStart.apply(this,arguments);
      };
      wrappedStart.__ktCleanAudio=true;
      window.startCreatorRecording=wrappedStart;
    }

    var oldBroadcast=window.startBroadcast;
    if(typeof oldBroadcast==='function'&&!oldBroadcast.__ktCleanAudio){
      var wrappedBroadcast=async function(){
        try{await prepareCleanAudio();}catch(e){}
        return oldBroadcast.apply(this,arguments);
      };
      wrappedBroadcast.__ktCleanAudio=true;
      window.startBroadcast=wrappedBroadcast;
    }
  }

  if(document.readyState==='complete')setTimeout(install,0);
  else window.addEventListener('load',function(){setTimeout(install,0);},{once:true});
})();
