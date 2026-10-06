/* K-Talk 사운드 목록 전용: 자유 이용 사운드 10곡 + 허가된 옛날 가요 메뉴. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktFreeVocal20Installed20260915)return;
  window.__ktFreeVocal20Installed20260915=true;

  var tracks=[
    {name:'에어 온 더 G 스트링',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'3:03',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Air_-_Air_Force_Strings_-_United_States_Air_Force_Band.mp3'},
    {name:'타란텔라',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Tarantella_-_Air_Force_Strings_-_United_States_Air_Force_Band.mp3'},
    {name:'스킵 투 마이 루',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'2:11',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Skip_to_My_Lou_-_Singing_Sergeants_-_United_States_Air_Force_Band.mp3'},
    {name:'셰넌도어',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Shenandoah_(2017)_-_Singing_Sergeants_-_United_States_Air_Force_Band.mp3'},
    {name:'왕벌의 비행',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flight_of_the_Bumblebee_-_Strolling_Strings_-_United_States_Air_Force_Band.mp3'},
    {name:'내 주를 가까이',source:'미 공군 밴드 · 퍼블릭도메인 MP3',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nearer_My_God_to_Thee_-_Ceremonial_Brass_-_United_States_Air_Force_Band.mp3'},
    {name:'왈츠 E단조',source:'Musopen · CC0 MP3',time:'2:56',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/WaltzB.56InEMinor.mp3'},
    {name:'왈츠 E플랫장조',source:'Musopen · CC0 MP3',time:'2:24',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/WaltzB.46InEFlatMajor.mp3'},
    {name:'모차르트 미사 Kyrie',source:'Musopen · CC0 MP3',time:'6:51',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mozart_-_Mass_in_C_minor_K.427_-_I._Kyrie.mp3'},
    {name:'Shenandoah 연주곡',source:'미 공군 아카데미 밴드 · 퍼블릭도메인 MP3',time:'3:23',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Shenandoah_-_United_States_Air_Force_Academy_Band.mp3'}
  ];

  function currentTracks(){
    return Array.isArray(window.ktCreatorTracks)&&window.ktCreatorTracks.length?window.ktCreatorTracks:tracks;
  }

  function setNote(text){
    var note=document.querySelector('.kt-sound-panel .note');
    if(note)note.textContent=text||'사람이 직접 부른 자유 이용 사운드 10곡만 들어 있습니다. 곡을 누르면 촬영 화면에서도 바로 소리가 납니다.';
  }

  function disconnectBroadcastNodes(){
    try{if(window.ktCreatorMusicSource)window.ktCreatorMusicSource.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicHighpass)window.ktCreatorMusicHighpass.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicBass)window.ktCreatorMusicBass.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicPresence)window.ktCreatorMusicPresence.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicAir)window.ktCreatorMusicAir.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicCompressor)window.ktCreatorMusicCompressor.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicGain)window.ktCreatorMusicGain.disconnect();}catch(e){}
    window.ktCreatorMusicSource=null;
    window.ktCreatorMusicHighpass=null;
    window.ktCreatorMusicBass=null;
    window.ktCreatorMusicPresence=null;
    window.ktCreatorMusicAir=null;
    window.ktCreatorMusicCompressor=null;
    window.ktCreatorMusicGain=null;
  }

  function stopCreatorMusic(){
    try{
      if(window.ktCreatorMusicFadeTimer){clearInterval(window.ktCreatorMusicFadeTimer);window.ktCreatorMusicFadeTimer=null;}
      if(window.ktCreatorMusicAudio){
        window.ktCreatorMusicAudio.pause();
        try{window.ktCreatorMusicAudio.remove();}catch(e){}
        window.ktCreatorMusicAudio.removeAttribute('src');
        try{window.ktCreatorMusicAudio.load();}catch(e){}
        window.ktCreatorMusicAudio=null;
      }
      disconnectBroadcastNodes();
    }catch(e){}
  }
  window.ktStopCreatorMusic=stopCreatorMusic;

  function connectBroadcastSound(audio){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      var ctx=window.ktCreatorMusicAudioContext;
      if(!ctx||ctx.state==='closed'){
        try{ctx=new AC({latencyHint:'interactive',sampleRate:44100});}
        catch(_e){ctx=new AC();}
        window.ktCreatorMusicAudioContext=ctx;
      }
      if(ctx.state==='suspended')ctx.resume().catch(function(){});

      var source=ctx.createMediaElementSource(audio);

      var highpass=ctx.createBiquadFilter();
      highpass.type='highpass';
      highpass.frequency.value=58;
      highpass.Q.value=.55;

      var bass=ctx.createBiquadFilter();
      bass.type='lowshelf';
      bass.frequency.value=125;
      bass.gain.value=2.2;

      var presence=ctx.createBiquadFilter();
      presence.type='peaking';
      presence.frequency.value=2600;
      presence.Q.value=.78;
      presence.gain.value=1.25;

      var air=ctx.createBiquadFilter();
      air.type='highshelf';
      air.frequency.value=7200;
      air.gain.value=1.15;

      var comp=ctx.createDynamicsCompressor();
      comp.threshold.value=-18;
      comp.knee.value=14;
      comp.ratio.value=2.15;
      comp.attack.value=.006;
      comp.release.value=.22;

      var gain=ctx.createGain();
      gain.gain.value=.90;

      source.connect(highpass);
      highpass.connect(bass);
      bass.connect(presence);
      presence.connect(air);
      air.connect(comp);
      comp.connect(gain);
      gain.connect(ctx.destination);

      window.ktCreatorMusicSource=source;
      window.ktCreatorMusicHighpass=highpass;
      window.ktCreatorMusicBass=bass;
      window.ktCreatorMusicPresence=presence;
      window.ktCreatorMusicAir=air;
      window.ktCreatorMusicCompressor=comp;
      window.ktCreatorMusicGain=gain;
      return true;
    }catch(e){
      disconnectBroadcastNodes();
      return false;
    }
  }

  function playCreatorTrack(t){
    if(!t||!t.url)return;
    stopCreatorMusic();

    /* Keep playback simple and inside the user's tap.
       WebAudio/crossOrigin processing was causing Android first-tap failures. */
    var audio=document.createElement('audio');
    audio.id='ktCreatorMusicAudio';
    audio.preload='auto';
    audio.loop=true;
    audio.playsInline=true;
    audio.setAttribute('playsinline','');
    audio.src=t.url;
    audio.volume=.85;
    document.body.appendChild(audio);
    window.ktCreatorMusicAudio=audio;

    try{
      var p=audio.play();
      if(p&&p.catch){
        p.catch(function(err){
          try{console.warn('K-Talk sound play failed',err);}catch(e){}
          setNote('이 음원은 재생되지 않습니다. 다른 곡을 눌러 주세요.');
        });
      }
    }catch(err){
      setNote('이 음원은 재생되지 않습니다. 다른 곡을 눌러 주세요.');
    }
  }

  function renderCurrent(){
    try{
      var list=document.getElementById('ktSoundList');
      if(list&&typeof window.renderCreatorSoundList==='function'){
        var input=document.getElementById('ktSoundSearchInput');
        window.renderCreatorSoundList(input?String(input.value||''):'');
      }
    }catch(e){}
  }

  window.ktShowOldKoreanSongs=function(btn){
    window.ktCreatorTracks=tracks.slice();
    var tabs=document.querySelectorAll('.kt-sound-tabs button');
    tabs.forEach(function(b){b.classList.remove('on');});
    if(btn)btn.classList.add('on');
    var input=document.getElementById('ktSoundSearchInput');
    if(input)input.value='';
    renderCurrent();
    setNote('신나는 외국 올드 재즈·스윙·팝 계열의 자유 이용 음원만 표시합니다.');
  };

  function installOldSongTab(){
    var tabs=document.querySelector('.kt-sound-tabs');
    if(!tabs||tabs.querySelector('.kt-old-song-tab'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-old-song-tab';
    b.textContent='신나는 올드팝';
    b.onclick=function(){window.ktShowOldKoreanSongs(b);};
    tabs.appendChild(b);
  }

  function apply(){
    window.ktCreatorTracks=tracks.slice(0,10);
    window.ktSearchFreeMusicOnline=function(){ return Promise.resolve(); };
    window.ktOpenLicensedSongSearch=function(index,ev){
      if(ev){try{ev.stopPropagation();ev.preventDefault();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();}catch(e){}}
      var t=currentTracks()[index];
      if(!t)return false;
      playCreatorTrack(t);
      try{
        if(window.state)window.state.creatorSound=t.name;
        var btn=document.getElementById('creatorSoundBtn');
        if(btn)btn.textContent='♪ '+t.name;
      }catch(e){}
      return false;
    };
    window.selectCreatorSoundByIndex=function(index,ev){
      if(ev){try{ev.stopPropagation();ev.preventDefault();}catch(e){}}
      var t=currentTracks()[index];
      if(!t)return;
      try{
        if(window.state)window.state.creatorSound=t.name;
        else if(typeof state!=='undefined')state.creatorSound=t.name;
      }catch(e){}
      var btn=document.getElementById('creatorSoundBtn');
      if(btn)btn.textContent='♪ '+t.name;
      /* Keep the sound sheet open while playback starts.
         closeSheet() can trigger global media-stop handlers and immediately pause this audio. */
      playCreatorTrack(t);
    };
    renderCurrent();
    installOldSongTab();
    setNote();
  }

  apply();
  setTimeout(apply,0);
  setTimeout(apply,250);
  setTimeout(apply,800);

  var oldOpen=window.openSoundPanel;
  if(typeof oldOpen==='function'){
    window.openSoundPanel=function(){
      window.ktCreatorTracks=tracks.slice(0,10);
      oldOpen.apply(this,arguments);
      setTimeout(function(){
        installOldSongTab();
        setNote();
      },0);
    };
  }

  var oldCloseCreator=window.closeCreator;
  if(typeof oldCloseCreator==='function'){
    window.closeCreator=function(){
      stopCreatorMusic();
      return oldCloseCreator.apply(this,arguments);
    };
  }
})();

/* 2026-09-15 참고 영상과 현재 촬영 화면 비교 후: 촬영 화면 사람 크기·기본 보정만 맞춤. 다른 UI/방/선물은 변경하지 않음. */
(function(){
  if(window.__ktCreatorReferenceLook20260915)return;
  window.__ktCreatorReferenceLook20260915=true;

  function ensureLookStyle(){
    if(document.getElementById('ktCreatorReferenceLookStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktCreatorReferenceLookStyle20260915';
    s.textContent='#creator.creator.camera-on:not(.creator-review) video#camera{transform:scaleX(-1) scale(1)!important;transform-origin:center center!important;}';
    document.head.appendChild(s);
  }

  function tryWiderCamera(){
    try{
      var c=document.getElementById('camera');
      if(!c||!c.srcObject)return;
      var tracks=c.srcObject.getVideoTracks&&c.srcObject.getVideoTracks();
      var track=tracks&&tracks[0];
      if(!track||!track.getCapabilities||!track.applyConstraints)return;
      var caps=track.getCapabilities();
      if(!caps||!caps.zoom)return;
      var min=typeof caps.zoom.min==='number'?caps.zoom.min:1;
      track.applyConstraints({advanced:[{zoom:min}]}).catch(function(){});
    }catch(e){}
  }

  function applyDefaultBeauty(){
    try{
      var saved=localStorage.getItem('ktalk_simple_beauty_preset');
      if(!saved&&typeof window.ktApplySimpleBeautyPreset==='function'){
        localStorage.setItem('ktalk_simple_beauty_preset','strong');
        window.ktApplySimpleBeautyPreset('strong');
      }
    }catch(e){}
  }

  function applyReferenceLook(){
    ensureLookStyle();
    tryWiderCamera();
    applyDefaultBeauty();
  }

  applyReferenceLook();
  [120,350,800,1500].forEach(function(ms){setTimeout(applyReferenceLook,ms);});
  try{
    var c=document.getElementById('camera');
    if(c)c.addEventListener('loadedmetadata',function(){setTimeout(applyReferenceLook,40);});
  }catch(e){}
})();

/* 2026-09-15 참고 화면 고정: AI 보정을 눌러도 사람 크기가 다시 커지지 않게 하고 강한 보정만 조금 더 분명하게. */
(function(){
  if(window.__ktCreatorReferenceBeautyLock20260915)return;
  window.__ktCreatorReferenceBeautyLock20260915=true;

  function lockFrame(name){
    try{
      var c=document.getElementById('camera');
      if(!c)return;
      c.style.setProperty('transform','scaleX(-1) scale(1)','important');
      if(name==='strong')c.style.setProperty('filter','brightness(1.15) saturate(1.08) contrast(.82) blur(.88px)','important');
      if(name==='makeupStrong')c.style.setProperty('filter','brightness(1.16) saturate(1.20) contrast(.82) sepia(.05) hue-rotate(-4deg) blur(.92px)','important');
    }catch(e){}
  }

  function wrapBeauty(){
    try{
      if(typeof window.ktApplySimpleBeautyPreset!=='function'||window.ktApplySimpleBeautyPreset.__ktReferenceLocked)return;
      var original=window.ktApplySimpleBeautyPreset;
      var wrapped=function(name){
        var result=original.apply(this,arguments);
        setTimeout(function(){lockFrame(name);},0);
        return result;
      };
      wrapped.__ktReferenceLocked=true;
      window.ktApplySimpleBeautyPreset=wrapped;
    }catch(e){}
  }

  function apply(){
    wrapBeauty();
    var saved='';
    try{saved=localStorage.getItem('ktalk_simple_beauty_preset')||'';}catch(e){}
    lockFrame(saved);
  }

  apply();
  [50,180,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var c=document.getElementById('camera');
    if(c)c.addEventListener('loadedmetadata',function(){setTimeout(apply,30);});
  }catch(e){}
})();