/* K-Talk 13명방 전용: 호스트를 위 3줄 높이로 줄이고, 그 아래 빈 게스트 1칸만 추가. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13HostThreeRowsInstalled)return;
  window.__ktGroup13HostThreeRowsInstalled=true;

  function addStyle(){
    if(document.getElementById('ktGroup13HostThreeRowsStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13HostThreeRowsStyle';
    s.textContent='\
      #screen .ktg13-room .ktg13-main{grid-template-rows:repeat(4,minmax(0,1fr))!important;}\
      #screen .ktg13-room .ktg13-host{grid-column:1!important;grid-row:1/4!important;}\
      #screen .ktg13-room .ktg13-guests{grid-column:2!important;grid-row:1/5!important;}\
      #screen .ktg13-room .ktg13-host-extra{grid-column:1!important;grid-row:4!important;display:grid!important;place-items:center!important;min-width:0!important;min-height:0!important;}\
      #screen .ktg13-room .ktg13-host>video{width:78%!important;height:76%!important;position:absolute!important;left:11%!important;top:5%!important;object-fit:contain!important;object-position:center top!important;}';
    document.head.appendChild(s);
  }

  function apply(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();
    var main=room.querySelector('.ktg13-main');
    var host=room.querySelector('.ktg13-host');
    var guests=room.querySelector('.ktg13-guests');
    if(!main||!host||!guests)return;
    if(!main.querySelector('.ktg13-host-extra')){
      var extra=document.createElement('div');
      extra.className='ktg13-guest ktg13-host-extra';
      extra.innerHTML='<span>게스트</span>';
      main.insertBefore(extra,guests);
    }
  }

  apply();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13HostThreeRowsTimer);
      window.__ktGroup13HostThreeRowsTimer=setTimeout(apply,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 1인방·13명방·구독자방·비밀방: 방송 시간 바로 옆에 하트 좋아요 숫자만 추가. */
(function(){
  if(window.__ktLiveClockHeartInstalled)return;
  window.__ktLiveClockHeartInstalled=true;
  window.__ktLiveClockLikes=window.__ktLiveClockLikes||{solo:0,group13:0,subscriber:0,secret:0};

  function ensureStyle(){
    if(document.getElementById('ktLiveClockHeartStyle'))return;
    var s=document.createElement('style');
    s.id='ktLiveClockHeartStyle';
    s.textContent='\
      .kt-live-clock-heart{margin-left:7px!important;padding:2px 5px!important;border:0!important;outline:0!important;background:transparent!important;color:#ff6fb8!important;display:inline-flex!important;align-items:center!important;gap:2px!important;font:900 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;vertical-align:middle!important;touch-action:manipulation!important;box-shadow:none!important;}\
      .kt-live-clock-heart .heart{font-size:15px!important;line-height:1!important;}\
      .kt-live-clock-heart .count{font-size:11px!important;color:#fff!important;line-height:1!important;}\
      @media(max-width:390px){.kt-live-clock-heart{margin-left:5px!important;padding:1px 3px!important;font-size:11px!important}.kt-live-clock-heart .heart{font-size:14px!important}.kt-live-clock-heart .count{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function roomInfo(clock){
    var room=clock&&clock.closest?clock.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'):null;
    if(!room)return null;
    if(room.classList.contains('ktsolo-room'))return {room:room,key:'solo'};
    if(room.classList.contains('ktg13-room'))return {room:room,key:'group13'};
    if(room.classList.contains('ktsubscriber-room'))return {room:room,key:'subscriber'};
    if(room.classList.contains('ktsecret-room'))return {room:room,key:'secret'};
    return null;
  }

  function install(){
    var clock=document.getElementById('ktLiveClock');
    if(!clock)return;
    var info=roomInfo(clock);
    if(!info)return;
    ensureStyle();
    var old=clock.parentElement&&clock.parentElement.querySelector?clock.parentElement.querySelector('.kt-live-clock-heart'):null;
    if(old){
      var n=old.querySelector('.count');
      if(n)n.textContent=String(window.__ktLiveClockLikes[info.key]||0);
      old.dataset.room=info.key;
      return;
    }
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-live-clock-heart';
    b.dataset.room=info.key;
    b.setAttribute('aria-label','좋아요');
    b.title='좋아요';
    b.innerHTML='<span class="heart">💗</span><span class="count">'+String(window.__ktLiveClockLikes[info.key]||0)+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(err){}
      var key=this.dataset.room||info.key;
      window.__ktLiveClockLikes[key]=Number(window.__ktLiveClockLikes[key]||0)+1;
      var n=this.querySelector('.count');
      if(n)n.textContent=String(window.__ktLiveClockLikes[key]);
    };
    clock.insertAdjacentElement('afterend',b);
  }

  install();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktLiveClockHeartTimer);
      window.__ktLiveClockHeartTimer=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 1인방·13명방·구독자방·비밀방: 실제 사람이 있는 칸마다 작은 마이크 버튼만 추가. */
(function(){
  if(window.__ktPersonMicButtonsInstalled)return;
  window.__ktPersonMicButtonsInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktPersonMicButtonsStyle'))return;
    var s=document.createElement('style');
    s.id='ktPersonMicButtonsStyle';
    s.textContent='\
      .kt-person-mic{position:absolute!important;right:5px!important;top:5px!important;z-index:25!important;width:25px!important;height:25px!important;min-width:25px!important;min-height:25px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:50%!important;background:rgba(8,8,12,.78)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:13px!important;line-height:1!important;box-shadow:0 1px 5px rgba(0,0,0,.45)!important;touch-action:manipulation!important;}\
      .kt-person-mic.muted{background:rgba(112,18,32,.86)!important;}\
      @media(max-width:390px){.kt-person-mic{right:3px!important;top:3px!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;font-size:11px!important}}';
    document.head.appendChild(s);
  }

  function isHost(tile){
    return !!(tile&&(
      tile.classList.contains('ktsolo-main')||
      tile.classList.contains('ktg13-host')||
      tile.classList.contains('ktsubscriber-host')||
      (tile.classList.contains('ktsecret-slot')&&tile.classList.contains('host'))
    ));
  }

  function tileVideo(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function hasMicSource(tile){
    if(!tile)return false;
    if(isHost(tile))return true;
    var v=tileVideo(tile);
    if(!v)return false;
    try{
      if(v.srcObject&&v.srcObject.getAudioTracks&&v.srcObject.getAudioTracks().length)return true;
    }catch(e){}
    try{if(v.currentSrc||v.src)return true;}catch(e){}
    return false;
  }

  function getAudioTracks(tile){
    if(isHost(tile)){
      try{
        if(window.state&&state.stream&&state.stream.getAudioTracks)return state.stream.getAudioTracks();
      }catch(e){}
    }
    var v=tileVideo(tile);
    try{
      if(v&&v.srcObject&&v.srcObject.getAudioTracks)return v.srcObject.getAudioTracks();
    }catch(e){}
    return [];
  }

  function syncButton(btn,tile){
    var tracks=getAudioTracks(tile);
    var muted=false;
    if(tracks.length){
      muted=!tracks.some(function(t){return t.enabled!==false;});
    }else{
      var v=tileVideo(tile);
      if(v)muted=!!v.muted;
    }
    btn.classList.toggle('muted',muted);
    btn.textContent=muted?'🔇':'🎤';
    btn.title=muted?'마이크 켜기':'마이크 끄기';
    btn.setAttribute('aria-label',btn.title);
  }

  function toggleMic(tile,btn){
    var tracks=getAudioTracks(tile);
    if(tracks.length){
      var turnOn=!tracks.some(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){try{t.enabled=turnOn;}catch(e){}});
    }else{
      var v=tileVideo(tile);
      if(v){
        try{v.muted=!v.muted;}catch(e){}
      }
    }
    syncButton(btn,tile);
  }

  function addToTile(tile){
    if(!tile)return;
    var old=tile.querySelector(':scope > .kt-person-mic');
    if(!hasMicSource(tile)){
      if(old)old.remove();
      return;
    }
    if(!old){
      old=document.createElement('button');
      old.type='button';
      old.className='kt-person-mic';
      old.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        toggleMic(tile,this);
      };
      tile.appendChild(old);
    }
    syncButton(old,tile);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll('.ktsolo-main,.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot').forEach(addToTile);
  }

  install();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktPersonMicButtonsTimer);
      window.__ktPersonMicButtonsTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(install,1200);
})();

/* 13명방만: 마이크·카메라 버튼을 무지개 파장 아래쪽에 두고 카메라 잠김/열림 기능 추가. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktGroup13CameraLockControlsInstalled)return;
  window.__ktGroup13CameraLockControlsInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup13CameraLockControlsStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13CameraLockControlsStyle';
    s.textContent='\
      .ktg13-room .ktg13-host>.kt-open-camera-wave{bottom:31px!important;height:34px!important;}\
      .ktg13-room .ktg13-host>.kt-person-mic{top:auto!important;right:5px!important;bottom:4px!important;}\
      .ktg13-room .ktg13-camera-toggle{position:absolute!important;right:36px!important;bottom:4px!important;z-index:26!important;height:25px!important;min-width:54px!important;padding:0 7px!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:13px!important;background:rgba(8,8,12,.80)!important;color:#fff!important;font:900 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;touch-action:manipulation!important;}\
      .ktg13-room .ktg13-camera-toggle.locked{background:rgba(112,18,32,.88)!important;}\
      .ktg13-room .ktg13-camera-lock-mask{display:none;position:absolute;inset:0;z-index:2;background:#08080b;color:#fff;font:900 13px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif;align-items:center;justify-content:center;text-align:center;}\
      .ktg13-room .ktg13-host.kt-camera-locked .ktg13-camera-lock-mask{display:flex!important;}\
      @media(max-width:390px){.ktg13-room .ktg13-host>.kt-open-camera-wave{bottom:28px!important;height:31px!important}.ktg13-room .ktg13-host>.kt-person-mic{right:3px!important;bottom:3px!important}.ktg13-room .ktg13-camera-toggle{right:31px!important;bottom:3px!important;height:22px!important;min-width:49px!important;font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function videoTracks(){
    try{
      if(window.state&&state.stream&&state.stream.getVideoTracks)return state.stream.getVideoTracks();
    }catch(e){}
    var v=document.querySelector('.ktg13-room .ktg13-host video');
    try{
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
    }catch(e){}
    return [];
  }

  function cameraOpen(){
    var tracks=videoTracks();
    if(!tracks.length)return true;
    return tracks.some(function(t){return t.enabled!==false;});
  }

  function sync(host,btn){
    var open=cameraOpen();
    host.classList.toggle('kt-camera-locked',!open);
    btn.classList.toggle('locked',!open);
    btn.innerHTML=open?'📷 <span>열림</span>':'🔒 <span>잠김</span>';
    btn.title=open?'카메라 잠그기':'카메라 열기';
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(host,btn){
    var tracks=videoTracks();
    if(!tracks.length)return;
    var open=cameraOpen();
    tracks.forEach(function(t){try{t.enabled=!open;}catch(e){}});
    sync(host,btn);
  }

  function install(){
    var host=document.querySelector('.ktg13-room .ktg13-host');
    if(!host)return;
    ensureStyle();

    var mask=host.querySelector(':scope > .ktg13-camera-lock-mask');
    if(!mask){
      mask=document.createElement('div');
      mask.className='ktg13-camera-lock-mask';
      mask.innerHTML='🔒 카메라 잠김';
      host.appendChild(mask);
    }

    var btn=host.querySelector(':scope > .ktg13-camera-toggle');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='ktg13-camera-toggle';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        toggle(host,this);
      };
      host.appendChild(btn);
    }
    sync(host,btn);
  }

  install();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13CameraControlsTimer);
      window.__ktGroup13CameraControlsTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
