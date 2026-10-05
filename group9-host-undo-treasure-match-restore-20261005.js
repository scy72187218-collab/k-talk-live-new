/* 9명 호스트방 상단 3버튼 복구 — 2026-10-05
   되돌리기 / 보물상자 / 매치만 복구.
   다른 방/수익률/채팅/하단버튼/통신은 건드리지 않음. */
(function(){
  if(window.__ktG9HostTop3Restore20261005)return;
  window.__ktG9HostTop3Restore20261005=true;

  function isHost9(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    return room||null;
  }

  function makeButton(icon,label,handler){
    var b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      try{handler&&handler(b);}catch(_e){}
    };
    return b;
  }

  function undo(btn){
    try{if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera(btn);return;}}catch(e){}
    try{if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera(btn);return;}}catch(e){}
  }

  function treasure(){
    try{
      if(typeof window.placeTreasureChest==='function'){
        window.placeTreasureChest();
        return;
      }
    }catch(e){}
    try{if(typeof window.openGifts==='function')window.openGifts();}catch(e){}
  }

  function match(){
    try{if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}}catch(e){}
    try{if(typeof window.openHostMatchArena==='function')window.openHostMatchArena('1대1');}catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById('ktG9HostTop3RestoreStyle20261005'))return;
    var s=document.createElement('style');
    s.id='ktG9HostTop3RestoreStyle20261005';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-top3-restore-20261005{'
      +'flex:0 0 30px!important;min-height:30px!important;height:30px!important;'
      +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;'
      +'width:100%!important;margin:-2px 0 2px!important;padding:0!important;box-sizing:border-box!important;'
      +'position:relative!important;z-index:45!important;}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-top3-restore-20261005>button{'
      +'height:30px!important;min-height:30px!important;border:0!important;border-radius:9px!important;'
      +'background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;'
      +'justify-content:center!important;gap:4px!important;padding:0 4px!important;'
      +'font:950 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
      +'white-space:nowrap!important;touch-action:manipulation!important;pointer-events:auto!important;}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-top3-restore-20261005>button b{font-size:14px!important;line-height:1!important;}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-host-top3-restore-20261005>button span{font-size:10px!important;font-weight:950!important;}';
    (document.head||document.documentElement).appendChild(s);
  }

  function install(){
    var room=isHost9();
    if(!room)return;
    ensureStyle();

    var row=room.querySelector(':scope > .kt-g9-host-top3-restore-20261005');
    if(!row){
      row=document.createElement('div');
      row.className='kt-g9-host-top3-restore-20261005';
      row.appendChild(makeButton('↻','되돌리기',undo));
      row.appendChild(makeButton('🎁','보물상자',treasure));
      row.appendChild(makeButton('⚔','매치',match));
    }

    var stats=room.querySelector(':scope > .ktg13-stats');
    var main=room.querySelector(':scope > .ktg13-main');
    if(stats&&stats.parentNode===room){
      if(stats.nextElementSibling!==row)stats.insertAdjacentElement('afterend',row);
    }else if(main&&main.parentNode===room){
      room.insertBefore(row,main);
    }else if(row.parentNode!==room){
      room.appendChild(row);
    }
  }

  install();
  [30,100,250,600,1200].forEach(function(ms){setTimeout(install,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostTop3RestoreTimer20261005);
      window.__ktG9HostTop3RestoreTimer20261005=setTimeout(install,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();