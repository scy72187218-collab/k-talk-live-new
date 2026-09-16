/* K-Talk 사운드 목록 전용: 자유 이용 보컬곡 20곡 + 허가된 옛날 가요 메뉴. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktFreeVocal20Installed20260915)return;
  window.__ktFreeVocal20Installed20260915=true;

  var tracks=[
    {name:'Like a Child',source:'Toni Willé · 사람 보컬 · CC BY-SA 3.0',time:'3:10',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Like_a_Child_Radio_Version_Toni_Wille.ogg'},
    {name:'Wikipedia Pop Anthem',source:'Paul Dreifus · 사람 보컬 · CC BY-SA 3.0',time:'3:37',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Wikipedia_Pop_Anthem.ogg'},
    {name:'Binbataye',source:'Gadadharadas · 사람 보컬 · CC BY-SA 3.0',time:'2:36',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Binbataye_Hindi_pop.oga'},
    {name:'오빠는 풍각쟁이',source:'박향림 · 한국 옛날 가요 · 퍼블릭도메인',time:'2:52',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Park_Hyang-rim_-_Oppaneun_punggakjaeng-i.ogg',oldKorean:true},
    {name:'청춘계급',source:'김해송 · 한국 옛날 가요 · 퍼블릭도메인',time:'3:08',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kim_Hae-Song,_Cheong-chun-gye-geup.ogg',oldKorean:true},
    {name:'전화일기',source:'박향림·김해송 · 한국 옛날 가요 · 퍼블릭도메인',time:'3:06',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bak_Hyang_Rim_Kim_Hae_Song_jeonhwa_ilgi.ogg',oldKorean:true},
    {name:'사의 찬미',source:'윤심덕 · 한국 옛날 가요 · 퍼블릭도메인',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Yun_Sim-Deok_-_In_Praise_of_Death.ogg',oldKorean:true},
    {name:'진국명산',source:'송만갑 · 한국 옛날 노래 · 퍼블릭도메인',time:'3:28',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Song_Mangab_-_Jingukmyeongsan.ogg',oldKorean:true},
    {name:'Frankie and Johnny',source:'전통 포크 · 사람 보컬 · 퍼블릭도메인',time:'3:20',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/FrankieandJohnny_Live.ogg'},
    {name:'Jesse James',source:'Bentley Ball · 사람 보컬 · 퍼블릭도메인',time:'3:00',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Jesse_James_(Bentley_Ball).ogg'},
    {name:'Au Clair de la Lune',source:'고전 성악 · 사람 보컬 · 퍼블릭도메인',time:'2:46',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Au_Clair_de_la_Lune_1913.ogg'},
    {name:'Old Folks at Home',source:'고전 보컬 · 사람 보컬 · 퍼블릭도메인',time:'4:02',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Foster_-_Schumann-Heink_-_Old_Folks_at_Home_(rec._1918).ogg'},
    {name:'In My Merry Oldsmobile',source:'Billy Murray · 사람 보컬 · 퍼블릭도메인',time:'2:51',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bill_Murray_-_In_My_Merry_Oldsmobile.ogg'},
    {name:'Avalon',source:'Al Jolson · 사람 보컬 · 퍼블릭도메인',time:'2:58',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Al_Jolson_-_Avalon_(1920).ogg'},
    {name:'I Shall Not Be Moved',source:'전통 포크 · 사람이 직접 부른 자유 이용 보컬 · 퍼블릭도메인',time:'3:06',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/IShallNotBeMoved.ogg'},
    {name:"Nobody Knows the Trouble I've Seen",source:'Vernon Dalhart · 전통 보컬 · 퍼블릭도메인',time:'3:33',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/NobodyKnowsTheTroubleISee.ogg'},
    {name:'O mio babbino caro',source:'Frances Alda · 성악 보컬 · 퍼블릭도메인 표시',time:'2:37',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Frances_Alda,_O_mio_babbino_caro_(Gianni_Schicchi)_unrestored.ogg'},
    {name:'Chanson du toréador',source:'Pasquale Amato · 성악 보컬 · 퍼블릭도메인 표시',time:'',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pasquale_Amato,_Georges_Bizet,_Chanson_du_tor%C3%A9ador,_Carmen.ogg'},
    {name:'Retseh',source:'Gershon Sirota · 사람 보컬 · 퍼블릭도메인',time:'3:03',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Retseh_(1908).ogg'},
    {name:'Wěseeraw olecho',source:'Gershon Sirota · 사람 보컬 · 퍼블릭도메인',time:'2:58',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/W%C4%9Bseeraw_olecho_(1902).ogg'}
  ];

  function currentTracks(){
    return Array.isArray(window.ktCreatorTracks)&&window.ktCreatorTracks.length?window.ktCreatorTracks:tracks;
  }

  function setNote(text){
    var note=document.querySelector('.kt-sound-panel .note');
    if(note)note.textContent=text||'사람이 직접 부른 자유 이용 보컬곡 20곡만 들어 있습니다. 곡을 누르면 촬영 화면에서도 바로 소리가 납니다.';
  }

  function disconnectBroadcastNodes(){
    try{if(window.ktCreatorMusicSource)window.ktCreatorMusicSource.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicBass)window.ktCreatorMusicBass.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicPresence)window.ktCreatorMusicPresence.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicCompressor)window.ktCreatorMusicCompressor.disconnect();}catch(e){}
    try{if(window.ktCreatorMusicGain)window.ktCreatorMusicGain.disconnect();}catch(e){}
    window.ktCreatorMusicSource=null;
    window.ktCreatorMusicBass=null;
    window.ktCreatorMusicPresence=null;
    window.ktCreatorMusicCompressor=null;
    window.ktCreatorMusicGain=null;
  }

  function stopCreatorMusic(){
    try{
      if(window.ktCreatorMusicFadeTimer){clearInterval(window.ktCreatorMusicFadeTimer);window.ktCreatorMusicFadeTimer=null;}
      if(window.ktCreatorMusicAudio){
        window.ktCreatorMusicAudio.pause();
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
        ctx=new AC();
        window.ktCreatorMusicAudioContext=ctx;
      }
      if(ctx.state==='suspended')ctx.resume().catch(function(){});

      var source=ctx.createMediaElementSource(audio);
      var bass=ctx.createBiquadFilter();
      bass.type='lowshelf';
      bass.frequency.value=140;
      bass.gain.value=2.2;

      var presence=ctx.createBiquadFilter();
      presence.type='peaking';
      presence.frequency.value=2600;
      presence.Q.value=.85;
      presence.gain.value=1.4;

      var comp=ctx.createDynamicsCompressor();
      comp.threshold.value=-21;
      comp.knee.value=18;
      comp.ratio.value=2.7;
      comp.attack.value=.012;
      comp.release.value=.24;

      var gain=ctx.createGain();
      gain.gain.value=.92;

      source.connect(bass);
      bass.connect(presence);
      presence.connect(comp);
      comp.connect(gain);
      gain.connect(ctx.destination);

      window.ktCreatorMusicSource=source;
      window.ktCreatorMusicBass=bass;
      window.ktCreatorMusicPresence=presence;
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
    var audio=new Audio();
    audio.crossOrigin='anonymous';
    audio.preload='auto';
    audio.loop=true;
    audio.src=t.url;
    var processed=connectBroadcastSound(audio);
    audio.volume=processed?.82:.16;
    window.ktCreatorMusicAudio=audio;
    var p=audio.play();
    if(p&&p.then){
      p.then(function(){
        var target=processed?.92:.64;
        window.ktCreatorMusicFadeTimer=setInterval(function(){
          if(!window.ktCreatorMusicAudio||window.ktCreatorMusicAudio!==audio){clearInterval(window.ktCreatorMusicFadeTimer);window.ktCreatorMusicFadeTimer=null;return;}
          audio.volume=Math.min(target,audio.volume+.05);
          if(audio.volume>=target){clearInterval(window.ktCreatorMusicFadeTimer);window.ktCreatorMusicFadeTimer=null;}
        },70);
      }).catch(function(){
        stopCreatorMusic();
        alert('사운드를 재생하지 못했습니다. 곡을 한 번 더 눌러 주세요.');
      });
    }else if(p&&p.catch){
      p.catch(function(){
        stopCreatorMusic();
        alert('사운드를 재생하지 못했습니다. 곡을 한 번 더 눌러 주세요.');
      });
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
    window.ktCreatorTracks=tracks.filter(function(t){return !!t.oldKorean;});
    var tabs=document.querySelectorAll('.kt-sound-tabs button');
    tabs.forEach(function(b){b.classList.remove('on');});
    if(btn)btn.classList.add('on');
    var input=document.getElementById('ktSoundSearchInput');
    if(input)input.value='';
    renderCurrent();
    setNote('옛날 가요는 사용 가능한 퍼블릭도메인·자유 이용 음원만 표시합니다. 김광석·바다새·골목길 등 권리 확인이 필요한 유명곡 원음은 넣지 않습니다.');
  };

  function installOldSongTab(){
    var tabs=document.querySelector('.kt-sound-tabs');
    if(!tabs||tabs.querySelector('.kt-old-song-tab'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-old-song-tab';
    b.textContent='옛날 가요';
    b.onclick=function(){window.ktShowOldKoreanSongs(b);};
    tabs.appendChild(b);
  }

  function apply(){
    window.ktCreatorTracks=tracks.slice(0,20);
    window.ktSearchFreeMusicOnline=function(){ return Promise.resolve(); };
    window.ktOpenLicensedSongSearch=function(index,ev){
      if(ev){try{ev.stopPropagation();ev.preventDefault();}catch(e){}}
      if(typeof window.ktPlaySoundPreview==='function')window.ktPlaySoundPreview(index,ev);
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
      playCreatorTrack(t);
      if(typeof window.closeSheet==='function')window.closeSheet();
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
      window.ktCreatorTracks=tracks.slice(0,20);
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