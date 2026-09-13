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

/* 9명 일반방 버튼 터치 선택만 보정하고, 사용방법에 9명 일반방 문구가 빠졌으면 다시 표시. */
(function(){
  if(window.__ktNineGeneralPrepTouchGuideFixInstalled)return;
  window.__ktNineGeneralPrepTouchGuideFixInstalled=true;

  function ensureNineButton(){
    try{
      document.querySelectorAll('.live-prep .kt-room9-general,.live-prep .kt-room9-switch').forEach(function(btn){
        btn.classList.add('room-switch');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('position','relative','important');
        btn.style.setProperty('z-index','31','important');
      });
    }catch(e){}
  }

  function installGuidePatch(){
    if(typeof window.openSiteGuide!=='function'||window.openSiteGuide.__ktNineGeneralGuideFixed)return false;
    var old=window.openSiteGuide;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body)return;
          var rows=[].slice.call(body.querySelectorAll('.rowbox'));
          var row=rows.find(function(el){return String(el.textContent||'').indexOf('방송방 종류')>-1;});
          if(!row)return;
          var txt=String(row.textContent||'');
          if(txt.indexOf('9명 일반방')>-1)return;
          if(row.innerHTML.indexOf('일반 13명방')>-1){
            row.innerHTML=row.innerHTML.replace('일반 13명방','9명 일반방, 13명 방송');
          }else{
            row.innerHTML+='<br>9명 일반방은 호스트 1명과 게스트 8명이 함께 이용합니다.';
          }
        }catch(e){}
      },0);
      return r;
    };
    wrapped.__ktNineGeneralGuideFixed=true;
    window.openSiteGuide=wrapped;
    return true;
  }

  ensureNineButton();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(ensureNineButton,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktNineGeneralPrepTouchTimer);
      window.__ktNineGeneralPrepTouchTimer=setTimeout(ensureNineButton,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  if(!installGuidePatch()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(installGuidePatch()||tries>40)clearInterval(timer);
    },100);
  }
})();
