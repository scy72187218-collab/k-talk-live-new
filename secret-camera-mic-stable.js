/* 비밀방 카메라·마이크·자리이동 깜빡임 방지 전용. 사람 칸을 눌렀을 때만 2.6초 표시. */
(function(){
  if(window.__ktSecretCameraMicStableInstalled)return;
  window.__ktSecretCameraMicStableInstalled=true;

  var tileSelector='.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot';
  var controlSelector='.kt-inside-camera,.kt-inside-mic,.kt-inside-move-seat,.kt-inside-seat-up,.kt-inside-seat-down';

  function ensureStyle(){
    var old=document.getElementById('ktSecretCameraMicStableStyle');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktSecretCameraMicStableStyle';
    s.textContent=''
      +'html body .ktsecret-room .ktsecret-slot:not(.kt-secret-stable-open)>.kt-inside-av-controls,html body .ktsecret-room .ktsecret-guest-slot:not(.kt-secret-stable-open)>.kt-inside-av-controls{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:none!important;transform:none!important}'
      +'html body .ktsecret-room .ktsecret-slot.kt-secret-stable-open>.kt-inside-av-controls,html body .ktsecret-room .ktsecret-guest-slot.kt-secret-stable-open>.kt-inside-av-controls{display:flex!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;transition:none!important;transform:none!important}'
      +'html body .ktsecret-room .kt-person-mic,html body .ktsecret-room .kt-host-camera-toggle,html body .ktsecret-room .ktg13-camera-toggle,html body .ktsecret-room .kt-913-camera,html body .ktsecret-room .kt-inside-manager-key{display:none!important}';
    document.head.appendChild(s);
  }

  function boxOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector(':scope > .kt-inside-av-controls'):null;}catch(e){return null;}
  }

  function close(tile){
    if(!tile)return;
    try{clearTimeout(tile.__ktSecretStableTimer);}catch(e){}
    tile.__ktSecretExplicitOpen=false;
    tile.classList.remove('kt-secret-stable-open','kt-secret-controls-open','kt-room-controls-tap-open','kt-av-open');
    tile.classList.add('kt-room-controls-hidden');
    var box=boxOf(tile);
    if(box){
      box.style.setProperty('display','none','important');
      box.style.setProperty('opacity','0','important');
      box.style.setProperty('visibility','hidden','important');
      box.style.setProperty('pointer-events','none','important');
      box.style.setProperty('transition','none','important');
    }
  }

  function closeAll(except){
    document.querySelectorAll(tileSelector).forEach(function(tile){if(tile!==except)close(tile);});
  }

  function open(tile){
    if(!tile)return;
    var box=boxOf(tile);
    if(!box)return;
    closeAll(tile);
    tile.__ktSecretExplicitOpen=true;
    tile.classList.remove('kt-room-controls-hidden');
    tile.classList.add('kt-secret-stable-open','kt-secret-controls-open','kt-room-controls-tap-open','kt-av-open');
    box.style.setProperty('display','flex','important');
    box.style.setProperty('opacity','1','important');
    box.style.setProperty('visibility','visible','important');
    box.style.setProperty('pointer-events','auto','important');
    box.style.setProperty('transition','none','important');
    try{clearTimeout(tile.__ktSecretStableTimer);}catch(e){}
    tile.__ktSecretStableTimer=setTimeout(function(){close(tile);},2600);
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var room=t.closest('.ktsecret-room');
    if(!room)return;
    var ctl=t.closest(controlSelector);
    if(ctl){
      var tile=ctl.closest('.ktsecret-slot,.ktsecret-guest-slot');
      setTimeout(function(){close(tile);},0);
      return;
    }
    if(t.closest('.kt-inside-av-controls'))return;
    var tile=t.closest('.ktsecret-slot,.ktsecret-guest-slot');
    if(tile)open(tile);
  },true);

  function install(){
    ensureStyle();
    document.querySelectorAll(tileSelector).forEach(function(tile){
      if(!tile.classList.contains('kt-secret-stable-open'))close(tile);
    });
  }

  install();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSecretCameraMicStableTimer);
      window.__ktSecretCameraMicStableTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
