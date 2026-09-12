/* 9명방·13명방·구독자방·비밀방 전용: 호스트/모든 게스트 칸 안쪽 하단에 카메라+마이크 버튼만 표시. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktInsideCameraMicInstalled)return;
  window.__ktInsideCameraMicInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktInsideCameraMicStyle'))return;
    var s=document.createElement('style');
    s.id='ktInsideCameraMicStyle';
    s.textContent=''
      +'.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot{position:relative!important;overflow:hidden!important}'
      +'.ktg13-room .ktg13-host>.kt-person-mic,.ktg13-room .ktg13-guest>.kt-person-mic,.ktg13-room .kt-913-camera,.ktg13-room .ktg13-camera-toggle,.ktsubscriber-room .kt-person-mic,.ktsubscriber-room .kt-host-camera-toggle,.ktsecret-room .kt-person-mic,.ktsecret-room .kt-host-camera-toggle{display:none!important}'
      +'.kt-inside-av-controls{position:absolute!important;left:5px!important;bottom:5px!important;z-index:45!important;display:flex!important;align-items:center!important;gap:4px!important;max-width:calc(100% - 10px)!important;pointer-events:auto!important}'
      +'.kt-inside-av-btn{width:27px!important;height:27px!important;min-width:27px!important;min-height:27px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.55)!important;border-radius:50%!important;background:rgba(8,8,12,.82)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:13px!important;line-height:1!important;box-shadow:0 1px 5px rgba(0,0,0,.5)!important;touch-action:manipulation!important}'
      +'.kt-inside-av-btn.off{background:rgba(112,18,32,.90)!important}'
      +'@media(max-width:390px){.kt-inside-av-controls{left:3px!important;bottom:3px!important;gap:3px!important}.kt-inside-av-btn{width:23px!important;height:23px!important;min-width:23px!important;min-height:23px!important;font-size:11px!important}}';
    document.head.appendChild(s);
  }

  function isHost(tile){
    if(!tile||!tile.classList)return false;
    return tile.classList.contains('ktg13-host')||tile.classList.contains('ktsubscriber-host')||(tile.classList.contains('ktsecret-slot')&&tile.classList.contains('host'));
  }

  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function tracks(tile,kind){
    if(isHost(tile)){
      try{
        if(window.state&&state.stream){
          var a=kind==='audio'&&state.stream.getAudioTracks?state.stream.getAudioTracks():kind==='video'&&state.stream.getVideoTracks?state.stream.getVideoTracks():[];
          if(a&&a.length)return a;
        }
      }catch(e){}
    }
    var v=videoOf(tile);
    try{
      if(v&&v.srcObject){
        if(kind==='audio'&&v.srcObject.getAudioTracks)return v.srcObject.getAudioTracks();
        if(kind==='video'&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
      }
    }catch(e){}
    return [];
  }

  function mediaOn(tile,kind,btn){
    var a=tracks(tile,kind);
    if(a.length)return a.some(function(t){return t.enabled!==false;});
    var v=videoOf(tile);
    if(kind==='audio'&&v)return !v.muted;
    if(kind==='video'&&v)return v.style.visibility!=='hidden';
    return btn&&btn.dataset.off!=='1';
  }

  function sync(tile,kind,btn){
    var on=mediaOn(tile,kind,btn);
    btn.dataset.off=on?'0':'1';
    btn.classList.toggle('off',!on);
    if(kind==='video'){
      btn.textContent=on?'📷':'🔒';
      btn.title=on?'카메라 끄기':'카메라 켜기';
    }else{
      btn.textContent=on?'🎤':'🔇';
      btn.title=on?'마이크 끄기':'마이크 켜기';
    }
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(tile,kind,btn){
    var on=mediaOn(tile,kind,btn);
    var a=tracks(tile,kind);
    if(a.length){
      a.forEach(function(t){try{t.enabled=!on;}catch(e){}});
    }else{
      var v=videoOf(tile);
      if(kind==='audio'&&v){
        try{v.muted=on;}catch(e){}
      }else if(kind==='video'&&v){
        try{v.style.setProperty('visibility',on?'hidden':'visible','important');}catch(e){}
      }else{
        btn.dataset.off=on?'1':'0';
      }
    }
    sync(tile,kind,btn);
  }

  function addToTile(tile){
    if(!tile)return;
    var box=tile.querySelector(':scope > .kt-inside-av-controls');
    if(!box){
      box=document.createElement('div');
      box.className='kt-inside-av-controls';

      var cam=document.createElement('button');
      cam.type='button';
      cam.className='kt-inside-av-btn kt-inside-camera';
      cam.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'video',this);};

      var mic=document.createElement('button');
      mic.type='button';
      mic.className='kt-inside-av-btn kt-inside-mic';
      mic.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'audio',this);};

      box.appendChild(cam);
      box.appendChild(mic);
      tile.appendChild(box);
    }
    var c=box.querySelector('.kt-inside-camera');
    var m=box.querySelector('.kt-inside-mic');
    if(c)sync(tile,'video',c);
    if(m)sync(tile,'audio',m);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot').forEach(addToTile);
  }

  install();
  [40,120,260,520,900,1500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktInsideCameraMicTimer);
      window.__ktInsideCameraMicTimer=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
