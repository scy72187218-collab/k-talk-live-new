/* K-Talk 2026-10-05 — HOST five rooms only.
   Restore only: 되돌리기 / 보물상자 / 매치.
   Do not change grid, video, chat, earnings, gifts, signaling or bottom tools. PIN 1111 */
(function(){
  if(window.__ktAllFiveUTMHardRestore1111)return;
  window.__ktAllFiveUTMHardRestore1111=true;

  function isRemote(){return document.documentElement.classList.contains('kt-remote-viewing');}
  function hostRooms(){
    if(isRemote())return [];
    return [].slice.call(document.querySelectorAll(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room[data-kt-room="9"],'+
      '#screen .ktg13-room[data-kt-room="13"],'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    ));
  }
  function ensureStyle(){
    if(document.getElementById('ktAllFiveUTMHardRestoreStyle1111'))return;
    var s=document.createElement('style');
    s.id='ktAllFiveUTMHardRestoreStyle1111';
    s.textContent=''
      +'#screen .kt-all-five-utm-hard1111{'
      +'flex:0 0 32px!important;min-height:32px!important;height:32px!important;'
      +'width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
      +'gap:4px!important;margin:0 0 2px!important;padding:0!important;position:relative!important;z-index:99!important;'
      +'visibility:visible!important;opacity:1!important;pointer-events:auto!important;overflow:visible!important}'
      +'#screen .kt-all-five-utm-hard1111>button{'
      +'display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;'
      +'height:32px!important;min-height:32px!important;min-width:0!important;margin:0!important;padding:0 4px!important;'
      +'border:1px solid rgba(255,255,255,.14)!important;border-radius:9px!important;background:#111114!important;'
      +'color:#fff!important;font:950 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
      +'visibility:visible!important;opacity:1!important;pointer-events:auto!important;touch-action:manipulation!important;white-space:nowrap!important}'
      +'#screen .kt-all-five-utm-hard1111 b{font-size:14px!important;line-height:1!important}'
      +'#screen .kt-all-five-utm-hard1111 span{font-size:10px!important;font-weight:950!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  function act(label,btn){
    if(label==='되돌리기'){
      try{if(typeof window.ktUnifiedQuickFlip==='function'){window.ktUnifiedQuickFlip(btn);return;}}catch(e){}
      try{if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera(btn);return;}}catch(e){}
      try{if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera(btn);return;}}catch(e){}
      return;
    }
    if(label==='보물상자'){
      try{if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}}catch(e){}
      try{if(typeof window.placeTreasureChest==='function'){window.placeTreasureChest();return;}}catch(e){}
      try{if(typeof window.openTreasureBox==='function'){window.openTreasureBox();return;}}catch(e){}
      try{if(typeof window.openTreasure==='function'){window.openTreasure();return;}}catch(e){}
      try{if(typeof window.openGifts==='function')window.openGifts();}catch(e){}
      return;
    }
    if(label==='매치'){
      try{if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}}catch(e){}
      try{if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}}catch(e){}
      try{if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}}catch(e){}
      try{if(typeof window.openMatch==='function')window.openMatch();}catch(e){}
    }
  }
  function button(icon,label){
    var b=document.createElement('button');
    b.type='button';b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(_e){}act(label,b);};
    return b;
  }
  function row(){
    var d=document.createElement('div');
    d.className='kt-all-five-utm-hard1111';
    d.setAttribute('data-kt-all-five-utm','1111');
    d.appendChild(button('↻','되돌리기'));
    d.appendChild(button('🎁','보물상자'));
    d.appendChild(button('⚔','매치'));
    return d;
  }
  function anchor(room){
    if(room.classList.contains('ktsolo-room'))return room.querySelector(':scope > .ktsolo-stats')||room.querySelector(':scope > .ktsolo-main');
    if(room.classList.contains('ktg13-room'))return room.querySelector(':scope > .ktg13-stats')||room.querySelector(':scope > .ktg13-main');
    if(room.classList.contains('ktsubscriber-room'))return room.querySelector(':scope > .ktsubscriber-stats')||room.querySelector(':scope > .ktsubscriber-main');
    if(room.classList.contains('ktsecret-room'))return room.querySelector(':scope > .ktsecret-stats')||room.querySelector(':scope > .ktsecret-main');
    return null;
  }
  function install(room){
    if(!room||!room.isConnected)return;
    var r=room.querySelector(':scope > .kt-all-five-utm-hard1111');
    if(!r)r=row();
    var a=anchor(room);
    if(a&&a.parentNode===room){
      if(r.parentNode!==room||r.nextElementSibling!==a)room.insertBefore(r,a);
    }else if(r.parentNode!==room){
      room.appendChild(r);
    }
  }
  function run(){
    ensureStyle();
    hostRooms().forEach(install);
  }
  run();
  [20,60,120,250,500,900,1500,2500].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,600);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllFiveUTMHardTimer1111);
      window.__ktAllFiveUTMHardTimer1111=setTimeout(run,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();