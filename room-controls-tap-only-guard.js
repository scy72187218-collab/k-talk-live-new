/* 카메라·마이크·자리이동 표시 전용 보정: 방 입장 시 숨김, 사람 칸을 눌렀을 때만 표시, 한 번 사용하면 즉시 숨김. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomControlsTapOnlyGuardInstalled)return;
  window.__ktRoomControlsTapOnlyGuardInstalled=true;

  var tileSelector='.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot';
  var roomSelector='.ktg13-room,.ktsubscriber-room,.ktsecret-room';
  var controlSelector='.kt-inside-camera,.kt-inside-mic,.kt-inside-move-seat,.kt-inside-seat-up,.kt-inside-seat-down';

  function ensureStyle(){
    if(document.getElementById('ktRoomControlsTapOnlyGuardStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomControlsTapOnlyGuardStyle';
    s.textContent=''
      +'.kt-room-controls-hidden>.kt-inside-av-controls{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(3px)!important}'
      +'.kt-room-controls-tap-open>.kt-inside-av-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}';
    document.head.appendChild(s);
  }

  function hide(tile){
    if(!tile)return;
    try{clearTimeout(tile.__ktTapOnlyHideTimer);}catch(e){}
    tile.classList.remove('kt-room-controls-tap-open');
    tile.classList.add('kt-room-controls-hidden');
  }

  function hideRoom(room){
    if(!room)return;
    try{room.querySelectorAll(tileSelector).forEach(hide);}catch(e){}
  }

  function open(tile){
    if(!tile||!tile.querySelector(':scope > .kt-inside-av-controls'))return;
    var room=tile.closest(roomSelector);
    if(room)hideRoom(room);
    tile.classList.remove('kt-room-controls-hidden');
    tile.classList.add('kt-room-controls-tap-open');
    try{clearTimeout(tile.__ktTapOnlyHideTimer);}catch(e){}
    tile.__ktTapOnlyHideTimer=setTimeout(function(){hide(tile);},2600);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll(tileSelector).forEach(function(tile){
      if(!tile.classList.contains('kt-room-controls-tap-open'))tile.classList.add('kt-room-controls-hidden');
    });
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest(controlSelector);
    if(btn){
      var tile=btn.closest(tileSelector);
      var room=btn.closest(roomSelector);
      setTimeout(function(){
        if(tile)hide(tile);
        if(room)hideRoom(room);
      },0);
      return;
    }
    if(t.closest('.kt-inside-av-controls'))return;
    var tile=t.closest(tileSelector);
    if(tile)open(tile);
  },true);

  install();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktRoomControlsTapOnlyGuardTimer);
      window.__ktRoomControlsTapOnlyGuardTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
