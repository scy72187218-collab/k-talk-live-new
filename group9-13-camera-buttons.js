/* 9명방·13명방 전용: 호스트와 모든 게스트 칸에 카메라 버튼만 추가. 다른 방/UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup913CameraButtonsInstalled)return;
  window.__ktGroup913CameraButtonsInstalled=true;

  function isTargetRoom(room){
    if(!room)return false;
    var kind=String(room.getAttribute('data-kt-room')||'');
    if(kind==='15')return false;
    if(kind==='9')return true;
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      return t==='group'||t==='group13'||n==='13명 방송';
    }catch(e){return kind!=='15';}
  }

  function ensureStyle(){
    if(document.getElementById('ktGroup913CameraButtonsStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup913CameraButtonsStyle';
    s.textContent=''
      +'.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest{position:relative!important}'
      +'.ktg13-room .kt-913-camera{position:absolute!important;left:4px!important;bottom:4px!important;z-index:32!important;width:26px!important;height:26px!important;min-width:26px!important;min-height:26px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.50)!important;border-radius:50%!important;background:rgba(8,8,12,.84)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:13px!important;line-height:1!important;box-shadow:0 1px 5px rgba(0,0,0,.48)!important;touch-action:manipulation!important}'
      +'.ktg13-room .kt-913-camera.locked{background:rgba(112,18,32,.90)!important}'
      +'.ktg13-room .ktg13-host>.ktg13-camera-toggle{display:none!important}'
      +'@media(max-width:390px){.ktg13-room .kt-913-camera{left:3px!important;bottom:3px!important;width:23px!important;height:23px!important;min-width:23px!important;min-height:23px!important;font-size:11px!important}}';
    document.head.appendChild(s);
  }

  function tileVideo(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function isHost(tile){
    return !!(tile&&tile.classList&&tile.classList.contains('ktg13-host'));
  }

  function videoTracks(tile){
    if(isHost(tile)){
      try{
        if(window.state&&state.stream&&state.stream.getVideoTracks){
          var a=state.stream.getVideoTracks();
          if(a&&a.length)return a;
        }
      }catch(e){}
    }
    var v=tileVideo(tile);
    try{
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
    }catch(e){}
    return [];
  }

  function isOpen(tile,btn){
    var tracks=videoTracks(tile);
    if(tracks.length)return tracks.some(function(t){return t.enabled!==false;});
    var v=tileVideo(tile);
    if(v&&v.dataset&&v.dataset.kt913CameraLocked==='1')return false;
    return !(btn&&btn.dataset.locked==='1');
  }

  function sync(tile,btn){
    var open=isOpen(tile,btn);
    btn.classList.toggle('locked',!open);
    btn.dataset.locked=open?'0':'1';
    btn.textContent=open?'📷':'🔒';
    btn.title=open?'카메라 끄기':'카메라 켜기';
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(tile,btn){
    var tracks=videoTracks(tile);
    var open=isOpen(tile,btn);
    if(tracks.length){
      tracks.forEach(function(t){try{t.enabled=!open;}catch(e){}});
    }else{
      var v=tileVideo(tile);
      try{
        if(v){
          v.dataset.kt913CameraLocked=open?'1':'0';
          v.style.setProperty('visibility',open?'hidden':'visible','important');
        }
      }catch(e){}
      btn.dataset.locked=open?'1':'0';
    }
    sync(tile,btn);
  }

  function addToTile(tile){
    if(!tile)return;
    var btn=tile.querySelector(':scope > .kt-913-camera');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-913-camera';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        toggle(tile,this);
      };
      tile.appendChild(btn);
    }
    sync(tile,btn);
  }

  function install(){
    var room=document.querySelector('.ktg13-room');
    if(!isTargetRoom(room))return;
    ensureStyle();
    addToTile(room.querySelector('.ktg13-host'));
    room.querySelectorAll('.ktg13-guest').forEach(addToTile);
  }

  install();
  [40,120,260,520,900,1500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup913CameraButtonsTimer);
      window.__ktGroup913CameraButtonsTimer=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
