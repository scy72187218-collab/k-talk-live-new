/* 9명방·13명방·구독자방·비밀방 전용: 카메라/마이크는 칸 안쪽에 숨겨 두고, 사람이 있는 칸을 눌렀을 때만 잠깐 표시. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktInsideCameraMicInstalledV2)return;
  window.__ktInsideCameraMicInstalledV2=true;

  function ensureStyle(){
    var old=document.getElementById('ktInsideCameraMicStyle');
    if(old)old.remove();
    if(document.getElementById('ktInsideCameraMicStyleV2'))return;
    var s=document.createElement('style');
    s.id='ktInsideCameraMicStyleV2';
    s.textContent=''
      +'.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot{position:relative!important;overflow:hidden!important}'
      +'.ktg13-room .ktg13-host>.kt-person-mic,.ktg13-room .ktg13-guest>.kt-person-mic,.ktg13-room .kt-913-camera,.ktg13-room .ktg13-camera-toggle,.ktsubscriber-room .kt-person-mic,.ktsubscriber-room .kt-host-camera-toggle,.ktsecret-room .kt-person-mic,.ktsecret-room .kt-host-camera-toggle{display:none!important}'
      +'.kt-inside-av-controls{position:absolute!important;left:6px!important;bottom:6px!important;z-index:45!important;display:flex!important;align-items:center!important;gap:4px!important;max-width:calc(100% - 12px)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(3px)!important;transition:opacity .16s ease,transform .16s ease,visibility .16s!important}'
      +'.kt-av-open>.kt-inside-av-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}'
      +'.kt-inside-av-btn{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.52)!important;border-radius:50%!important;background:rgba(8,8,12,.72)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:11px!important;line-height:1!important;box-shadow:0 1px 4px rgba(0,0,0,.45)!important;backdrop-filter:blur(3px)!important;touch-action:manipulation!important}'
      +'.kt-inside-av-btn.off{background:rgba(112,18,32,.82)!important}'
      +'@media(max-width:390px){.kt-inside-av-controls{left:4px!important;bottom:4px!important;gap:3px!important}.kt-inside-av-btn{width:21px!important;height:21px!important;min-width:21px!important;min-height:21px!important;font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function isHost(tile){
    if(!tile||!tile.classList)return false;
    return tile.classList.contains('ktg13-host')||tile.classList.contains('ktsubscriber-host')||(tile.classList.contains('ktsecret-slot')&&tile.classList.contains('host'));
  }

  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function hasPerson(tile){
    if(!tile)return false;
    if(isHost(tile))return true;
    try{
      if(tile.querySelector('video,img'))return true;
      if(tile.dataset&&(tile.dataset.userId||tile.dataset.participantId||tile.dataset.memberId||tile.dataset.occupied==='1'))return true;
    }catch(e){}
    return false;
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

  function closeLater(tile){
    try{clearTimeout(tile.__ktAvHideTimer);}catch(e){}
    tile.__ktAvHideTimer=setTimeout(function(){try{tile.classList.remove('kt-av-open');}catch(e){}},2600);
  }

  function addToTile(tile){
    if(!tile)return;
    var box=tile.querySelector(':scope > .kt-inside-av-controls');
    if(!hasPerson(tile)){
      if(box)box.remove();
      tile.classList.remove('kt-av-open');
      return;
    }
    if(!box){
      box=document.createElement('div');
      box.className='kt-inside-av-controls';

      var cam=document.createElement('button');
      cam.type='button';
      cam.className='kt-inside-av-btn kt-inside-camera';
      cam.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'video',this);closeLater(tile);};

      var mic=document.createElement('button');
      mic.type='button';
      mic.className='kt-inside-av-btn kt-inside-mic';
      mic.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'audio',this);closeLater(tile);};

      box.appendChild(cam);
      box.appendChild(mic);
      tile.appendChild(box);

      tile.addEventListener('click',function(e){
        if(e.target&&e.target.closest&&e.target.closest('.kt-inside-av-controls'))return;
        this.classList.add('kt-av-open');
        closeLater(this);
      });
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
      clearTimeout(window.__ktInsideCameraMicTimerV2);
      window.__ktInsideCameraMicTimerV2=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
