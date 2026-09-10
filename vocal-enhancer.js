/* K-Talk 녹음 보컬 강화: 화면/UI는 건드리지 않고 녹음되는 목소리만 정리한다. */
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

      /* 저음 울림 제거 */
      var highpass=ctx.createBiquadFilter();
      highpass.type='highpass';
      highpass.frequency.value=75;
      highpass.Q.value=.7;

      /* 답답한 중저음은 조금 줄이고 목소리 선명도와 공기감은 살린다. */
      var mud=ctx.createBiquadFilter();
      mud.type='peaking';
      mud.frequency.value=280;
      mud.Q.value=1.05;
      mud.gain.value=-2.2;

      var presence=ctx.createBiquadFilter();
      presence.type='peaking';
      presence.frequency.value=3200;
      presence.Q.value=.9;
      presence.gain.value=2.8;

      var air=ctx.createBiquadFilter();
      air.type='highshelf';
      air.frequency.value=8500;
      air.gain.value=1.8;

      /* 작은 목소리는 앞으로, 큰 목소리는 튀지 않게 정리한다. */
      var comp=ctx.createDynamicsCompressor();
      comp.threshold.value=-24;
      comp.knee.value=16;
      comp.ratio.value=3.6;
      comp.attack.value=.004;
      comp.release.value=.18;

      var makeup=ctx.createGain();
      makeup.gain.value=1.12;

      var dry=ctx.createGain();
      dry.gain.value=.94;

      var wet=ctx.createGain();
      wet.gain.value=.11;

      var verb=ctx.createConvolver();
      verb.buffer=impulse(ctx,.62,3.0);

      /* 마지막 피크를 막아서 찢어지는 소리를 줄인다. */
      var limiter=ctx.createDynamicsCompressor();
      limiter.threshold.value=-3.5;
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

      /* 원본 마이크 트랙은 AudioContext 입력으로 살아 있어야 하므로 stop하지 않고 스트림에서만 뺀다. */
      var s=window.state&&state.stream;
      if(!s)throw new Error('state stream missing');
      try{s.removeTrack(raw);}catch(e){}
      try{s.addTrack(processed);}catch(e){throw e;}

      engine={ctx:ctx,source:source,rawTrack:raw,processedTrack:processed,dest:dest};
      window.ktVocalEnhancer=engine;
      try{
        state.__ktVocalEnhanced=true;
        state.__ktVocalEnhancerName='보컬 강화';
      }catch(e){}
      return true;
    }catch(e){
      try{stopEngine(false);}catch(err){}
      return false;
    }
  }

  /* 인터페이스 선택이 끝난 다음, 5초 카운트다운에 들어가기 전에 목소리를 보정한다. */
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
