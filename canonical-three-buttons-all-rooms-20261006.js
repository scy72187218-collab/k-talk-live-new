/* K-Talk 2026-10-06: ONE canonical three-button row for every live room.
   Host and guest/viewer screens share exactly the same row:
   되돌리기 / 보물상자 / 매치.
   Retired legacy rows are removed so they cannot reappear.
   No changes to room grid, video, chat, gifts panel, earnings, signaling or bottom tools. */
(function(){
  if(window.__ktCanonicalThreeButtonsAllRooms20261006)return;
  window.__ktCanonicalThreeButtonsAllRooms20261006=true;

  var ROW_CLASS='kt-canonical-three-7777';

  function removeRetired(){
    try{
      [
        '.ktg13-quick',
        '.ktsolo-quick',
        '.ktsubscriber-quick',
        '.ktsecret-quick',
        '.kt-all-five-utm-hard1111',
        '.kt-g9-host-top3-restore-20261005',
        '.kt-room-second-stats-row-20260927',
        '.kt-g9-host-utm-20261005',
        '[data-kt-all-five-utm]',
        '[data-kt-locked-duplicate-package-row]'
      ].forEach(function(sel){
        document.querySelectorAll('#screen '+sel).forEach(function(el){
          if(el.classList&&el.classList.contains(ROW_CLASS))return;
          try{el.remove();}catch(e){}
        });
      });

      /* Remove only retired exact trio rows. Never remove the canonical row. */
      document.querySelectorAll('#screen div,#screen section').forEach(function(el){
        if(!el||!el.isConnected||el.classList.contains(ROW_CLASS))return;
        if(el.children&&el.children.length!==3)return;
        var buttons=[].slice.call(el.children).filter(function(x){return x.tagName==='BUTTON';});
        if(buttons.length!==3)return;
        var labs=buttons.map(function(b){return String(b.textContent||b.getAttribute('aria-label')||'').replace(/\s+/g,'');});
        var undo=labs.some(function(x){return x.indexOf('되돌리기')>-1;});
        var treasure=labs.some(function(x){return x.indexOf('보물상자')>-1||x.indexOf('패키지상자')>-1;});
        var match=labs.some(function(x){return x.indexOf('매치')>-1;});
        if(undo&&treasure&&match){try{el.remove();}catch(e){}}
      });
    }catch(e){}
  }

  function action(label,btn){
    if(label==='되돌리기'){
      try{if(typeof window.ktUnifiedQuickFlip==='function'){window.ktUnifiedQuickFlip(btn);return;}}catch(e){}
      try{if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera(btn);return;}}catch(e){}
      try{if(typeof window.ktSoloFlipCamera==='function'){window.ktSoloFlipCamera(btn);return;}}catch(e){}
      try{if(typeof window.flipCamera==='function'){window.flipCamera();return;}}catch(e){}
      return;
    }
    if(label==='보물상자'){
      try{if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}}catch(e){}
      try{if(typeof window.placeTreasureChest==='function'){window.placeTreasureChest();return;}}catch(e){}
      try{if(typeof window.openTreasureBox==='function'){window.openTreasureBox();return;}}catch(e){}
      try{if(typeof window.openTreasure==='function'){window.openTreasure();return;}}catch(e){}
      return;
    }
    if(label==='매치'){
      try{if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}}catch(e){}
      try{if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}}catch(e){}
      try{if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}}catch(e){}
      try{if(typeof window.openMatch==='function'){window.openMatch();return;}}catch(e){}
    }
  }

  function button(icon,label){
    var b=document.createElement('button');
    b.type='button';
    b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      action(label,b);
    };
    return b;
  }

  function makeRow(){
    var d=document.createElement('div');
    d.className=ROW_CLASS;
    d.setAttribute('data-kt-canonical-three','7777');
    d.appendChild(button('↻','되돌리기'));
    d.appendChild(button('🎁','보물상자'));
    d.appendChild(button('⚔','매치'));
    return d;
  }

  function style(){
    if(document.getElementById('ktCanonicalThreeButtonsAllRoomsStyle20261006'))return;
    [
      'ktAllGuestNoUndoTreasureMatchStyle20261006',
      'ktRemoveTopThreeQuickFinalStyle20261006',
      'ktAllFiveUTMHardRestoreStyle1111',
      'ktG9HostTop3RestoreStyle20261005'
    ].forEach(function(id){var old=document.getElementById(id);if(old)try{old.remove();}catch(e){}});
    var s=document.createElement('style');
    s.id='ktCanonicalThreeButtonsAllRoomsStyle20261006';
    s.textContent=''
      +'#screen .'+ROW_CLASS+'{flex:0 0 31px!important;min-height:31px!important;height:31px!important;'
      +'width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
      +'gap:4px!important;margin:0 0 2px!important;padding:0!important;position:relative!important;z-index:98!important;'
      +'visibility:visible!important;opacity:1!important;pointer-events:auto!important;overflow:visible!important;box-sizing:border-box!important}'
      +'#screen .'+ROW_CLASS+'>button{height:31px!important;min-height:31px!important;min-width:0!important;'
      +'display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;'
      +'margin:0!important;padding:0 4px!important;border:0!important;border-radius:9px!important;'
      +'background:#111114!important;color:#fff!important;font:950 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
      +'white-space:nowrap!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#screen .'+ROW_CLASS+' b{font-size:14px!important;line-height:1!important}'
      +'#screen .'+ROW_CLASS+' span{font-size:10px!important;font-weight:950!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function containers(){
    var out=[];
    function add(x){if(x&&x.isConnected&&out.indexOf(x)<0)out.push(x);}

    /* Host room shells. */
    document.querySelectorAll(
      '#screen .ktsolo-room,'+
      '#screen .ktg13-room[data-kt-room="9"],'+
      '#screen .ktg13-room[data-kt-room="13"],'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    ).forEach(add);

    /* Guest/viewer room shells when they have a concrete room container. */
    document.querySelectorAll(
      '#screen .kt-remote-live .ktsolo-room,'+
      '#screen .kt-remote-live .ktg13-room,'+
      '#screen .kt-remote-live .ktsubscriber-room,'+
      '#screen .kt-remote-live .ktsecret-room'
    ).forEach(add);

    /* Generic guest layouts (prejoin/approved) use the remote root itself. */
    var remote=document.querySelector('#screen .kt-remote-live');
    if(remote&&!remote.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room')){
      add(remote);
    }
    return out;
  }

  function anchors(box){
    var led=null,stats=null,main=null;
    try{
      led=box.querySelector(':scope > .ktsolo-led,:scope > .ktg13-led,:scope > .ktsubscriber-led,:scope > .ktsecret-led,:scope > .kt-prejoin-room-led,:scope > .kt-approved-guest-led');
      stats=box.querySelector(':scope > .ktsolo-stats,:scope > .ktg13-stats,:scope > .ktsubscriber-stats,:scope > .ktsecret-stats,:scope > .kt-prejoin-room-stats,:scope > .kt-approved-guest-stats');
      main=box.querySelector(':scope > .ktsolo-main,:scope > .ktg13-main,:scope > .ktsubscriber-main,:scope > .ktsecret-main,:scope > .kt-prejoin-room-grid,:scope > .kt-approved-guest-grid,:scope > .kt-guest-room-grid,:scope > .kt-guest-hostlike-room');
    }catch(e){}
    return {led:led,stats:stats,main:main};
  }

  function install(box){
    if(!box||!box.isConnected)return;
    var row=box.querySelector(':scope > .'+ROW_CLASS);
    if(!row)row=makeRow();

    var a=anchors(box);
    if(a.led&&a.led.parentNode===box){
      if(a.led.nextElementSibling!==row)a.led.insertAdjacentElement('afterend',row);
      return;
    }
    if(a.stats&&a.stats.parentNode===box){
      if(a.stats.previousElementSibling!==row)box.insertBefore(row,a.stats);
      return;
    }
    if(a.main&&a.main.parentNode===box){
      if(a.main.previousElementSibling!==row)box.insertBefore(row,a.main);
      return;
    }
    if(row.parentNode!==box)box.appendChild(row);
  }

  function run(){
    style();
    removeRetired();
    containers().forEach(install);
  }

  run();
  [0,20,50,100,220,450,900,1600,2600].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCanonicalThreeButtonsAllRoomsTimer20261006);
      window.__ktCanonicalThreeButtonsAllRoomsTimer20261006=setTimeout(run,10);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();