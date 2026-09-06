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

/* K-Talk preview: only replace the sound list with playable free-use/public-domain audio. */
(function(){
  function commons(file){
    return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file);
  }
  window.ktCreatorTracks=[
    {name:'Hello, World! (2026)',source:'사람 보컬 · CC BY-SA 4.0 · 요즘 음원',time:'2:46',url:commons('Hello, World!.mp3')},
    {name:'Skip to My Lou',source:'사람 보컬 · 퍼블릭 도메인 · 신나는 포크',time:'2:11',url:commons('Skip to My Lou - Singing Sergeants - United States Air Force Band.mp3')},
    {name:'The Battle Hymn of the Republic',source:'합창 보컬 · 퍼블릭 도메인 · 웅장한 분위기',time:'',url:commons('The Battle Hymn of the Republic (1995) - Singing Sergeants - United States Air Force Band.mp3')},
    {name:'Shenandoah (2017)',source:'여성 솔로·합창 · 퍼블릭 도메인 · 현대 녹음',time:'2:12',url:commons('Shenandoah (2017) - Singing Sergeants - United States Air Force Band.mp3')},
    {name:'Shenandoah (2001)',source:'사람 보컬 · 퍼블릭 도메인 · 합창',time:'3:18',url:commons('Shenandoah - Singing Sergeants - United States Air Force Band.mp3')},
    {name:'Air Force Hymn (Vocal)',source:'사람 보컬 · 퍼블릭 도메인 · 밴드',time:'2:40',url:commons('Air Force Hymn (vocal) - Ceremonial Brass - United States Air Force Band.mp3')},
    {name:'Jesse James',source:'사람 보컬 · 퍼블릭 도메인 · 1919 옛날 음악',time:'3:00',url:commons('Jesse James (Bentley Ball).ogg')},
    {name:'Bully of the Town',source:'사람 보컬 · 퍼블릭 도메인 · 1925 옛날 음악',time:'',url:commons('BullyOfTheTown.ogg')},
    {name:'Au Clair de la Lune',source:'사람 보컬 · 퍼블릭 도메인 · 1913 옛날 음악',time:'2:46',url:commons('Au Clair de la Lune 1913.ogg')},
    {name:"Wait 'Till the Sun Shines, Nellie",source:'사람 보컬 · 퍼블릭 도메인 · 1905 옛날 음악',time:'2:44',url:commons("Wait 'Till the Sun Shines, Nellie - Harry Tally.ogg")},
    {name:'Ogopogo Song',source:'사람 보컬+오케스트라 · 퍼블릭 도메인 · 1925',time:'',url:commons('Ogopogo Song Paul Whiteman Orchestra.ogg')},
    {name:"When the Work's All Done This Fall",source:'사람 보컬 · 퍼블릭 도메인 · 1925 웨스턴',time:'2:48',url:commons("WhenTheWorksAllDoneThisFall(Carl T. Sprague).ogg")},
    {name:'Eu sunt Barbu Lautaru',source:'사람 보컬 · 퍼블릭 도메인 표기 · 1925',time:'2:49',url:commons('Fanica Luca - Eu sunt Barbu Lautaru.ogg')},
    {name:'Kaiserhymne (1910s recording)',source:'옛날 보컬 녹음 · 퍼블릭 도메인',time:'2:58',url:commons("Gott erhalte, Gott beschütze -- Kaiserhymne (1910's recording).ogg")},
    {name:'Salam-e Shah (1910)',source:'옛날 음악 · 퍼블릭 도메인 · 1910',time:'2:29',url:commons('Salâm-e Shâh - recorded by Gramophone company in Istanbul 1910.ogg')},
    {name:'Tarantella',source:'신나는 연주 · 퍼블릭 도메인 · 현대 녹음',time:'',url:commons('Tarantella - Air Force Strings - United States Air Force Band.mp3')},
    {name:'Sax, Rock, and Roll',source:'신나는 록·색소폰 · CC BY 3.0',time:'3:25',url:commons('Kevin MacLeod - Sax, Rock, and Roll.ogg')},
    {name:'Charleston (1925)',source:'신나는 옛날 댄스 음악 · 퍼블릭 도메인',time:'4:08',url:commons('Charleston (1925) - Edison 51542-R.ogg')},
    {name:'Notre Dame Victory March (1925)',source:'신나는 행진곡 · 퍼블릭 도메인',time:'2:30',url:commons('Notre Dame Victory March (1925) - Victor 19932-A.oga')}
  ];
})();
