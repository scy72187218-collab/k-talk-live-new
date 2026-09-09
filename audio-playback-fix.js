/* K-Talk: 동영상/음악 소리만 복구. 화면/방송/보정 UI는 건드리지 않음. */
(function(){
  if(window.__ktAudioPlaybackFix20260910Installed)return;
  window.__ktAudioPlaybackFix20260910Installed=true;

  function soundOn(media){
    if(!media)return;
    try{media.defaultMuted=false;}catch(e){}
    try{media.muted=false;}catch(e){}
    try{media.volume=1;}catch(e){}
    try{
      if(media.paused){
        var p=media.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  /* 공개 동영상은 처음에는 무음 자동재생을 유지하고, 화면을 한 번 누르면 바로 소리를 켠다. */
  function primePublicVideo(v){
    if(!v||v.dataset.ktSoundTouched==='1')return;
    try{v.defaultMuted=true;v.muted=true;v.volume=1;}catch(e){}
    try{
      if(v.paused&&v.hasAttribute('autoplay')){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function primeAll(){
    try{document.querySelectorAll('.kt-public-video').forEach(primePublicVideo);}catch(e){}
  }
  primeAll();

  try{
    var publicObserver=new MutationObserver(function(){primeAll();});
    publicObserver.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  document.addEventListener('pointerdown',function(ev){
    var v=null;
    try{v=ev.target&&ev.target.closest?ev.target.closest('.kt-public-video'):null;}catch(e){}
    if(!v)return;
    v.dataset.ktSoundTouched='1';
    v.dataset.ktSoundFirstTap='1';
    soundOn(v);
  },true);

  document.addEventListener('click',function(ev){
    var v=null;
    try{v=ev.target&&ev.target.closest?ev.target.closest('.kt-public-video'):null;}catch(e){}
    if(!v||v.dataset.ktSoundFirstTap!=='1')return;
    v.dataset.ktSoundFirstTap='0';
    try{ev.preventDefault();ev.stopImmediatePropagation();}catch(e){}
    soundOn(v);
  },true);

  /* 음악 목록의 미리듣기 소리는 항상 음소거 해제. */
  ['ktPlaySoundPreview','ktPlayRemoteSound'].forEach(function(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktAudioSoundOn)return;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(function(){try{soundOn(window.ktSoundAudio);}catch(e){}},0);
      return r;
    };
    wrapped.__ktAudioSoundOn=true;
    window[name]=wrapped;
  });

  /* 촬영에 섞는 음악은 DOM에서 떼어 두어 촬영 화면의 '배경 미디어 정지' 처리에 끊기지 않게 한다. */
  var oldMake=window.makeEffectRecordingStream;
  if(typeof oldMake==='function'&&!oldMake.__ktAudioDetached){
    var makeWrapped=function(){
      var out=oldMake.apply(this,arguments);
      try{
        var c=window.ktCreatorMusicCapture;
        if(c&&c.audio){
          if(c.audio.parentNode)c.audio.parentNode.removeChild(c.audio);
          c.audio.muted=false;
          c.audio.volume=1;
        }
      }catch(e){}
      return out;
    };
    makeWrapped.__ktAudioDetached=true;
    window.makeEffectRecordingStream=makeWrapped;
  }

  var oldStart=window.startCreatorRecording;
  if(typeof oldStart==='function'&&!oldStart.__ktAudioRestart){
    var startWrapped=async function(){
      var r=await oldStart.apply(this,arguments);
      try{
        var c=window.ktCreatorMusicCapture;
        if(c&&c.audio){
          if(c.audio.parentNode)c.audio.parentNode.removeChild(c.audio);
          c.audio.muted=false;
          c.audio.volume=1;
          if(c.ctx&&c.ctx.state==='suspended')await c.ctx.resume();
          if(c.audio.paused){
            var p=c.audio.play();
            if(p&&p.catch)p.catch(function(){});
          }
        }
      }catch(e){}
      return r;
    };
    startWrapped.__ktAudioRestart=true;
    window.startCreatorRecording=startWrapped;
  }
})();
