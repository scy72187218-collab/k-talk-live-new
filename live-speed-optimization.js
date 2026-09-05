/* K-Talk LIVE: reduce host upload/encoding load so several phones can watch with less delay. */
(function(){
  if(window.__ktLiveSpeedOptimizationLoaded)return;
  window.__ktLiveSpeedOptimizationLoaded=true;

  function tuneSender(sender){
    try{
      if(!sender||!sender.track||sender.track.kind!=='video'||!sender.getParameters||!sender.setParameters)return;
      var p=sender.getParameters()||{};
      if(!p.encodings||!p.encodings.length)p.encodings=[{}];
      p.encodings.forEach(function(e){
        e.maxBitrate=700000;
        e.maxFramerate=20;
        if(e.scaleResolutionDownBy==null||e.scaleResolutionDownBy<1.45)e.scaleResolutionDownBy=1.45;
      });
      p.degradationPreference='maintain-framerate';
      Promise.resolve(sender.setParameters(p)).catch(function(){});
    }catch(e){}
  }

  try{
    if(window.RTCPeerConnection&&RTCPeerConnection.prototype&&!RTCPeerConnection.prototype.__ktSpeedAddTrackPatched){
      var oldAddTrack=RTCPeerConnection.prototype.addTrack;
      RTCPeerConnection.prototype.addTrack=function(){
        var sender=oldAddTrack.apply(this,arguments);
        setTimeout(function(){tuneSender(sender);},0);
        setTimeout(function(){tuneSender(sender);},700);
        return sender;
      };
      RTCPeerConnection.prototype.__ktSpeedAddTrackPatched=true;
    }
  }catch(e){}

  function tuneLocalTrack(){
    try{
      var st=window.state&&state.stream;
      var t=st&&st.getVideoTracks&&st.getVideoTracks()[0];
      if(!t||!t.applyConstraints)return;
      t.applyConstraints({
        width:{ideal:720,max:960},
        height:{ideal:1280,max:1600},
        frameRate:{ideal:20,max:24}
      }).catch(function(){});
    }catch(e){}
  }

  function tuneExistingSenders(){
    try{
      if(!window.__ktAllPeerConnections)return;
      window.__ktAllPeerConnections.forEach(function(pc){
        if(pc&&pc.getSenders)pc.getSenders().forEach(tuneSender);
      });
    }catch(e){}
  }

  /* Keep source camera lighter while broadcasting. Framing/UI are untouched. */
  setInterval(function(){
    try{
      if(document.getElementById('ktSept2Live')||document.getElementById('ktLiveVideo'))tuneLocalTrack();
    }catch(e){}
    tuneExistingSenders();
  },2500);
})();