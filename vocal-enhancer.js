/* K-Talk 녹음 보컬 강화: 화면/UI는 건드리지 않고 녹음되는 소리만 정리한다. */
(function(){
  if(window.__ktVocalEnhancerInstalled)return;
  window.__ktVocalEnhancerInstalled=true;

  var engine=null;

  function liveAudioTrack(){
    try{
      var s=window.state&&state.stream;
      if(!s||!s.getAudioTracks)return null;
      return s.getAudioTracks().find(function(t){return t&&t.readyState==='live';})||null;
    }catch(e){return null;}
  }

  function externalLike(label){
    return /(usb|audio interface|interface|uac|codec|line in|stereo mix|external|인터페이스|외장|라인|스테레오 믹스)/i.test(String(label||''));
  }

  function isExternalInterface(track){
    if(!track)return false;
    if(externalLike(track.label))return true;
    try{return !!(window.state&&state.__ktInterfaceAudioReady&&externalLike(state.__ktInterfaceAudioLabel||track.label));}catch(e){return false;}
  }

  function stopEngine(keepCurrent){
    var e=engine;
    if(!e)return;
    engine=null;
    try{
      if(!keepCurrent&&e.processedTrack&&e.processedTrack.readyState==='live')e.processedTrack.stop();
    }catch(err){}
    try{
      if(e.rawTrack&&e.rawTrack.readyState==='live')e.rawTrack.stop();
    }catch(err){}
    try{if(e.ctx&&e.ctx.state!=='closed')e.ctx.close();}catch(err){}
  }

  function impulse(ctx,seconds,decay){
    var rate=ctx.sampleRate||48000;
    var len=Math.max(1,Math.floor(rate*seconds));
    var buf=ctx.createBuffer(2,len,rate);
    for(var ch=0;ch<2;ch++){
      var data=buf.getChannelData(ch);
      for(var i=0;i<len;i++){
        data[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay);
      }
    }
    return buf;
  }

  async function enhanceCurrentMic(){
    var raw=liveAudioTrack();
    if(!raw)return false;

    /* USB/오디오 인터페이스는 이미 음악+목소리가 완성되어 들어오므로 EQ/리버브를 다시 걸지 않는다.
       그래야 음악 음색과 인터페이스의 에코/보컬 효과가 원음대로 보존된다. */
    if(isExternalInterface(raw)){
      try{if(engine)stopEngine(false);}catch(e){}
      try{raw.contentHint='music';}catch(e){}
      try{
        state.__ktVocalEnhanced=false;
        state.__ktVocalEnhancerName='인터페이스 원음';
        state.__ktInterfaceOriginalSound=true;
      }catch(e){}
      return true;
    }

    /* 이미 이번 입력이 보컬 강화된 트랙이면 그대로 사용한다. */
    if(engine&&engine.processedTrack===raw&&raw.readyState==='live'){
      try{if(engine.ctx&&engine.ctx.state==='suspended')await engine.ctx.resume();}catch(e){}
      return true;
    }

    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return false;

    /* 새 입력 장치가 들어온 경우에만 이전 엔진을 정리한다. */
    if(engine)stopEngine(false);

    try{
      var ctx=new AC({sampleRate:48000});
      if(ctx.state==='suspended'){
        try{await ctx.resume();}catch(e){}
      }

      var source=ctx.createMediaStreamSource(new MediaStream([raw]));

      /* 휴대폰 마이크만 자연스럽게 정리한다. */
      var highpass=ctx.createBiquadFilter();
      highpass.type='highpass';
      highpass.frequency.value=70;
      highpass.Q.value=.7;

      var mud=ctx.createBiquadFilter();
      mud.type='peaking';
      mud.frequency.value=280;
      mud.Q.value=1.0;
      mud.gain.value=-1.5;

      var presence=ctx.createBiquadFilter();
      presence.type='peaking';
      presence.frequency.value=3200;
      presence.Q.value=.9;
      presence.gain.value=2.2;

      var air=ctx.createBiquadFilter();
      air.type='highshelf';
      air.frequency.value=8500;
      air.gain.value=1.2;

      var comp=ctx.createDynamicsCompressor();
      comp.threshold.value=-23;
      comp.knee.value=18;
      comp.ratio.value=3.0;
      comp.attack.value=.006;
      comp.release.value=.20;

      var makeup=ctx.createGain();
      makeup.gain.value=1.07;

      var dry=ctx.createGain();
      dry.gain.value=.98;

      /* 리버브는 아주 약하게만 넣어 말소리와 음악이 뭉개지지 않게 한다. */
      var wet=ctx.createGain();
      wet.gain.value=.045;

      var verb=ctx.createConvolver();
      verb.buffer=impulse(ctx,.42,3.6);

      var limiter=ctx.createDynamicsCompressor();
      limiter.threshold.value=-3.0;
      limiter.knee.value=0;
      limiter.ratio.value=18;
      limiter.attack.value=.002;
      limiter.release.value=.12;

      var dest=ctx.createMediaStreamDestination();

      source.connect(highpass);
      highpass.connect(mud);
      mud.connect(presence);
      presence.connect(air);
      air.connect(comp);
      comp.connect(makeup);

      makeup.connect(dry);
      dry.connect(limiter);

      makeup.connect(verb);
      verb.connect(wet);
      wet.connect(limiter);

      limiter.connect(dest);

      var processed=dest.stream.getAudioTracks()[0];
      if(!processed)throw new Error('processed audio track missing');
      try{processed.contentHint='speech';}catch(e){}

      /* 원본 마이크 트랙은 AudioContext 입력으로 살아 있어야 하므로 stop하지 않고 스트림에서만 뺀다. */
      var s=window.state&&state.stream;
      if(!s)throw new Error('state stream missing');
      try{s.removeTrack(raw);}catch(e){}
      try{s.addTrack(processed);}catch(e){throw e;}

      engine={ctx:ctx,source:source,rawTrack:raw,processedTrack:processed,dest:dest};
      window.ktVocalEnhancer=engine;
      try{
        state.__ktVocalEnhanced=true;
        state.__ktVocalEnhancerName='자연 보컬 강화';
        state.__ktInterfaceOriginalSound=false;
      }catch(e){}
      return true;
    }catch(e){
      try{stopEngine(false);}catch(err){}
      return false;
    }
  }

  /* 인터페이스 선택이 끝난 다음, 촬영 직전에 소리만 확인한다. */
  var oldStart=window.startCreatorRecording;
  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      try{await enhanceCurrentMic();}catch(e){}
      return oldStart.apply(this,arguments);
    };
  }

  window.ktEnhanceCurrentMic=enhanceCurrentMic;

  window.addEventListener('pagehide',function(){
    try{stopEngine(false);}catch(e){}
  });
})();
