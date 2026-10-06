/* K-Talk sound playback override 2026-10-06.
   Sound only. No room/chat/gift/revenue/signaling/layout changes. */
(function(){
  if(window.__ktSoundDirectPlayback1515v2)return;
  window.__ktSoundDirectPlayback1515v2=true;

  function currentTrack(index){
    var list=Array.isArray(window.ktCreatorTracks)?window.ktCreatorTracks:[];
    return list[index]||null;
  }

  function note(msg){
    try{
      var el=document.querySelector('.kt-sound-panel .note');
      if(el)el.textContent=msg;
    }catch(e){}
  }

  function stop(){
    try{
      var a=window.ktCreatorMusicAudio;
      if(a){
        a.pause();
        try{a.currentTime=0;}catch(e){}
        try{a.removeAttribute('src');a.load();}catch(e){}
        try{if(a.parentNode)a.parentNode.removeChild(a);}catch(e){}
      }
    }catch(e){}
    window.ktCreatorMusicAudio=null;
  }
  window.ktStopCreatorMusic=stop;

  function markPlaying(index,on){
    try{
      document.querySelectorAll('.kt-sound-row').forEach(function(row,i){
        row.classList.toggle('kt-sound-playing',!!on&&i===index);
        var b=row.querySelector('button,[data-play],.play');
        if(b&&i===index)b.textContent=on?'❚❚':'▶';
      });
    }catch(e){}
  }

  function play(index,ev){
    if(ev){
      try{
        ev.preventDefault();
        ev.stopPropagation();
        if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();
      }catch(e){}
    }
    var t=currentTrack(index);
    if(!t||!t.url)return false;

    stop();
    markPlaying(index,false);

    var a=document.createElement('audio');
    a.id='ktCreatorMusicAudio1515';
    a.preload='auto';
    a.loop=true;
    a.playsInline=true;
    a.setAttribute('playsinline','');
    a.setAttribute('webkit-playsinline','');
    a.volume=.88;
    a.src=t.url;
    a.style.display='none';
    document.body.appendChild(a);
    window.ktCreatorMusicAudio=a;

    try{
      if(window.state){
        window.state.creatorSound=t.name||'';
        window.state.creatorSoundUrl=t.url||'';
      }
      var btn=document.getElementById('creatorSoundBtn');
      if(btn)btn.textContent='♪ '+(t.name||'사운드');
    }catch(e){}

    function ok(){
      markPlaying(index,true);
      note('재생 중: '+(t.name||'사운드')+' · 다시 누르면 다른 곡으로 바꿀 수 있습니다.');
    }
    function fail(){
      markPlaying(index,false);
      note('이 곡을 재생하지 못했습니다. 다른 곡을 눌러 주세요.');
    }

    a.addEventListener('playing',ok,{once:true});
    a.addEventListener('error',fail,{once:true});

    try{
      a.load();
      var p=a.play();
      if(p&&p.then)p.then(ok).catch(fail);
    }catch(e){fail();}
    return false;
  }

  window.ktPlaySoundPreview=function(index,ev){return play(index,ev);};
  window.ktOpenLicensedSongSearch=function(index,ev){return play(index,ev);};
  window.selectCreatorSoundByIndex=function(index,ev){return play(index,ev);};

  /* Some older sound rows have inline/legacy handlers. Capture the play tap first
     and route it to the current in-app MP3 list so no old handler or external page runs. */
  document.addEventListener('pointerdown',function(ev){
    var t=ev.target&&ev.target.closest?ev.target.closest('.kt-sound-row button,.kt-sound-row [data-play],.kt-sound-row .play'):null;
    if(!t)return;
    var row=t.closest('.kt-sound-row');
    if(!row)return;
    var rows=[].slice.call(document.querySelectorAll('.kt-sound-row'));
    var idx=rows.indexOf(row);
    if(idx<0)return;
    play(idx,ev);
  },true);
})();