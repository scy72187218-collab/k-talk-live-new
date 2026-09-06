/* K-Talk: record the selected in-app/free music together with mic audio. */
(function(){
  if(window.__ktMusicRecordingFixInstalled)return;
  window.__ktMusicRecordingFixInstalled=true;

  var oldSelect=window.selectCreatorSound;
  var oldSelectByIndex=window.selectCreatorSoundByIndex;
  var oldPlayRemote=window.ktPlayRemoteSound;
  var oldPlayPreview=window.ktPlaySoundPreview;
  var oldMake=window.makeEffectRecordingStream;
  var oldStart=window.startCreatorRecording;
  var oldStop=window.stopCreatorRecording;
  var oldDelete=window.deleteCreatorRecording;

  window.ktLastCreatorSoundPreviewUrl='';
  window.ktLastCreatorSoundPreviewName='';
  window.ktCreatorMusicCapture=null;

  function setChosen(name,url){
    try{
      state.creatorSound=name||state.creatorSound||'';
      state.creatorSoundUrl=url||'';
    }catch(e){}
    if(url){
      window.ktLastCreatorSoundPreviewUrl=url;
      window.ktLastCreatorSoundPreviewName=name||'';
    }
    try{
      var b=document.getElementById('creatorSoundBtn');
      if(b&&name)b.textContent='♪ '+name;
    }catch(e){}
  }

  if(typeof oldSelect==='function'){
    window.selectCreatorSound=function(name,url){
      var useUrl=url||'';
      if(!useUrl && name && name===window.ktLastCreatorSoundPreviewName){
        useUrl=window.ktLastCreatorSoundPreviewUrl||'';
      }
      setChosen(name,useUrl);
      return oldSelect.apply(this,[name]);
    };
  }

  if(typeof oldSelectByIndex==='function'){
    window.selectCreatorSoundByIndex=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url){
        setChosen(t.name,t.url);
        if(typeof oldSelect==='function')return oldSelect.call(this,t.name);
      }
      return oldSelectByIndex.apply(this,arguments);
    };
  }

  if(typeof oldPlayPreview==='function'){
    window.ktPlaySoundPreview=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url)setChosen(t.name,t.url);
      return oldPlayPreview.apply(this,arguments);
    };
  }

  if(typeof oldPlayRemote==='function'){
    window.ktPlayRemoteSound=function(url,ev){
      var name='';
      try{
        var row=ev&&ev.currentTarget&&ev.currentTarget.closest?ev.currentTarget.closest('.kt-sound-row'):null;
        var b=row&&row.querySelector?row.querySelector('.kt-sound-info b'):null;
        name=b?String(b.textContent||'').trim():'';
      }catch(e){}
      setChosen(name||'선택한 음악',url||'');
      return oldPlayRemote.apply(this,arguments);
    };
  }

  function stopCapture(closeContext){
    var c=window.ktCreatorMusicCapture;
    if(!c)return;
    try{c.audio.pause();}catch(e){}
    try{c.audio.currentTime=0;}catch(e){}
    if(closeContext){
      try{c.ctx.close();}catch(e){}
      try{c.audio.remove();}catch(e){}
      window.ktCreatorMusicCapture=null;
    }
  }

  function buildMixedStream(base,url){
    if(!base || !url)return base;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return base;
    try{
      stopCapture(true);
      var out=new MediaStream();
      base.getVideoTracks().forEach(function(t){out.addTrack(t);});

      var ctx=new AC();
      var dest=ctx.createMediaStreamDestination();
      var micTracks=base.getAudioTracks?base.getAudioTracks():[];
      if(!micTracks.length && window.state&&state.stream&&state.stream.getAudioTracks){
        micTracks=state.stream.getAudioTracks();
      }
      if(micTracks&&micTracks.length){
        var micStream=new MediaStream(micTracks);
        var micSource=ctx.createMediaStreamSource(micStream);
        var micGain=ctx.createGain();
        micGain.gain.value=1.0;
        micSource.connect(micGain);
        micGain.connect(dest);
      }

      var audio=document.createElement('audio');
      audio.id='ktCreatorMusicCapture';
      audio.preload='auto';
      audio.loop=true;
      audio.crossOrigin='anonymous';
      audio.src=url;
      audio.volume=1;
      audio.playsInline=true;
      document.body.appendChild(audio);

      var musicSource=ctx.createMediaElementSource(audio);
      var musicGain=ctx.createGain();
      musicGain.gain.value=0.62;
      musicSource.connect(musicGain);
      musicGain.connect(dest);
      musicGain.connect(ctx.destination);

      dest.stream.getAudioTracks().forEach(function(t){out.addTrack(t);});
      window.ktCreatorMusicCapture={ctx:ctx,audio:audio,dest:dest};
      return out;
    }catch(e){
      try{stopCapture(true);}catch(err){}
      return base;
    }
  }

  if(typeof oldMake==='function'){
    window.makeEffectRecordingStream=function(){
      var base=oldMake.apply(this,arguments);
      var url='';
      try{url=state.creatorSoundUrl||'';}catch(e){}
      if(!url)return base;
      return buildMixedStream(base,url);
    };
  }

  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      var result=await oldStart.apply(this,arguments);
      var c=window.ktCreatorMusicCapture;
      if(c){
        try{if(c.ctx.state==='suspended')await c.ctx.resume();}catch(e){}
        try{c.audio.currentTime=0;}catch(e){}
        try{
          var p=c.audio.play();
          if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      }
      return result;
    };
  }

  if(typeof oldStop==='function'){
    window.stopCreatorRecording=function(){
      var result=oldStop.apply(this,arguments);
      stopCapture(false);
      setTimeout(function(){stopCapture(true);},700);
      return result;
    };
  }

  if(typeof oldDelete==='function'){
    window.deleteCreatorRecording=function(){
      stopCapture(true);
      return oldDelete.apply(this,arguments);
    };
  }

  /* Sound-only playback fix: do not change any layout or other feature. */
  function soundOn(v){
    if(!v)return;
    try{
      v.defaultMuted=false;
      v.muted=false;
      v.volume=1;
      if(v.paused){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  document.addEventListener('click',function(ev){
    var v=null;
    try{v=ev.target&&ev.target.closest?ev.target.closest('.kt-public-video,#ktLibraryPlayer'):null;}catch(e){}
    if(!v)return;
    if(v.muted){
      try{ev.preventDefault();ev.stopImmediatePropagation();}catch(e){}
      soundOn(v);
    }
  },true);

  try{
    var observer=new MutationObserver(function(){
      document.querySelectorAll('.kt-public-video,#ktLibraryPlayer').forEach(function(v){
        try{v.defaultMuted=false;v.muted=false;v.volume=1;}catch(e){}
      });
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
