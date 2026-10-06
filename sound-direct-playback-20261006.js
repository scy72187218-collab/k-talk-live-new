/* K-Talk sound playback override 2026-10-06.
   Sound only. No room/chat/gift/revenue/signaling/layout changes. */
(function(){
  if(window.__ktSoundDirectPlayback1515)return;
  window.__ktSoundDirectPlayback1515=true;

  function currentTrack(index){
    var list=Array.isArray(window.ktCreatorTracks)?window.ktCreatorTracks:[];
    return list[index]||null;
  }

  function stop(){
    try{
      if(window.ktCreatorMusicAudio){
        window.ktCreatorMusicAudio.pause();
        window.ktCreatorMusicAudio.src='';
        window.ktCreatorMusicAudio.load();
      }
    }catch(e){}
    window.ktCreatorMusicAudio=null;
  }

  function play(index){
    var t=currentTrack(index);
    if(!t||!t.url)return false;
    stop();

    var a=document.createElement('audio');
    a.preload='auto';
    a.loop=true;
    a.volume=.9;
    a.src=t.url;
    window.ktCreatorMusicAudio=a;

    try{
      if(window.state){
        window.state.creatorSound=t.name||'';
        window.state.creatorSoundUrl=t.url||'';
      }
      var b=document.getElementById('creatorSoundBtn');
      if(b)b.textContent='♪ '+(t.name||'사운드');
    }catch(e){}

    try{
      var p=a.play();
      if(p&&p.catch)p.catch(function(){
        alert('이 곡은 현재 휴대폰에서 재생되지 않습니다. 다른 곡을 눌러 주세요.');
      });
    }catch(e){
      alert('이 곡은 현재 휴대폰에서 재생되지 않습니다. 다른 곡을 눌러 주세요.');
    }
    return false;
  }

  window.ktPlaySoundPreview=function(index,ev){
    if(ev){try{ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();}catch(e){}}
    return play(index);
  };
  window.ktOpenLicensedSongSearch=function(index,ev){
    if(ev){try{ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();}catch(e){}}
    return play(index);
  };
  window.selectCreatorSoundByIndex=function(index,ev){
    if(ev){try{ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();}catch(e){}}
    play(index);
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    return false;
  };
})();