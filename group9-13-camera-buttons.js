/* 13명방의 기존 카메라 버튼은 유지하고, 9명방은 사진(칸) 탭 방식의 카메라+마이크만 사용. */
(function(){
  if(window.__ktGroup913CameraButtonsInstalled)return;
  window.__ktGroup913CameraButtonsInstalled=true;

  function isTargetRoom(room){
    if(!room)return false;
    var kind=String(room.getAttribute('data-kt-room')||'');
    if(kind==='9'||kind==='15')return false;
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      return t==='group'||t==='group13'||n==='13명 방송';
    }catch(e){return false;}
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
      +'.ktg13-room[data-kt-room="9"] .kt-913-camera{display:none!important}'
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
    if(!room)return;
    var kind=String(room.getAttribute('data-kt-room')||'');
    if(kind==='9'){
      room.querySelectorAll('.kt-913-camera').forEach(function(b){try{b.remove();}catch(e){}});
      return;
    }
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

/* 9명방을 포함한 방송칸 안쪽 카메라+마이크: 사람 사진/칸을 눌렀을 때만 표시. */
(function(){
  if(document.querySelector('script[data-kt-inside-av="1"]'))return;
  var s=document.createElement('script');
  s.src='room-inside-camera-mic.js?v=20260913-inside2';
  s.async=false;
  s.setAttribute('data-kt-inside-av','1');
  document.head.appendChild(s);
})();

/* 비밀방 선택 시 기존 비밀번호/입장 연결을 반드시 거치게 한다. 다른 방 선택은 건드리지 않음. */
(function(){
  if(window.__ktSecretRoomSelectBridgeInstalled)return;
  window.__ktSecretRoomSelectBridgeInstalled=true;

  function bridge(e){
    var b=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(!b)return;
    var text=String(b.textContent||'').replace(/\s+/g,'');
    if(text.indexOf('비밀')<0)return;
    try{
      if(typeof window.selectPrepRoom==='function'){
        window.selectPrepRoom(b,'password','비밀방',7);
      }else if(window.state){
        state.liveRoomType='password';
        state.liveRoomName='비밀방';
        state.liveRoomMax=7;
      }
    }catch(err){}
  }

  document.addEventListener('pointerdown',bridge,true);
})();

/* 열쇠 모양은 숨기고, 메인 동영상의 댓글 비눗방울 터치만 복구. */
(function(){
  if(window.__ktKeyBubbleOnlyFixInstalled)return;
  window.__ktKeyBubbleOnlyFixInstalled=true;

  var st=document.createElement('style');
  st.id='ktHideManagerKeyOnly';
  st.textContent='html body .kt-inside-manager-key{display:none!important}';
  document.head.appendChild(st);

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.vh-actions button,.right-actions button'):null;
    if(!b)return;
    var txt=String(b.textContent||'');
    if(txt.indexOf('댓글')<0&&txt.indexOf('💬')<0)return;
    try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
    if(typeof window.openComments==='function')window.openComments();
  },true);
})();

/* 네 방송방 게스트 프로필·닉네임·받은 장미 표시 파일만 연결. */
(function(){
  if(document.querySelector('script[data-kt-guest-badge="1"]'))return;
  var s=document.createElement('script');
  s.src='guest-tile-profile-badge.js?v=20260913-guestbadge1';
  s.async=false;
  s.setAttribute('data-kt-guest-badge','1');
  document.head.appendChild(s);
})();
