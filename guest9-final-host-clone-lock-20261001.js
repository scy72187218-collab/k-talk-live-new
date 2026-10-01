/* K-Talk 9-person approved guest FINAL layout lock — 2026-10-01
   5555 scope ONLY:
   - remote/approved guest in 9-person room
   - host-style upper layout: stats -> undo / treasure / match -> 3x3 grid
   - keep guest bottom controls: chat input / people / rose / gift / share
   - keep earnings small
   DO NOT touch host room, other room types, video source, approval, signaling, exit. */
(function(){
  if(window.__ktGuest9FinalHostClone5555_20261001)return;
  window.__ktGuest9FinalHostClone5555_20261001=true;

  function textOf(el){return String(el&&el.textContent||'').replace(/\s+/g,'');}

  function isNineRoot(root){
    if(!root)return false;
    try{
      var room=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]');
      if(room)return true;
    }catch(e){}
    try{
      var r=window.__ktLastLiveRoom||{};
      var meta=[r.room_name,r.title,r.room_type,window.__ktRemoteRoomName,window.__ktRemoteRoomType].join(' ');
      if(/9\s*명|group9/i.test(meta))return true;
    }catch(e){}
    try{
      var t=textOf(root);
      if(/9명방송|9명방/.test(t))return true;
    }catch(e){}
    return false;
  }

  function findStats(scope){
    if(!scope)return null;
    return scope.querySelector(
      ':scope > .kgh-stats,'+
      ':scope > .kt-prejoin-room-stats,'+
      ':scope > .kt-approved-guest-stats,'+
      ':scope > .kt-guest-room-stats,'+
      '.kgh-stats,.kt-prejoin-room-stats,.kt-approved-guest-stats,.kt-guest-room-stats'
    )||[].slice.call(scope.querySelectorAll('div,section,nav')).find(function(el){
      var t=textOf(el);
      return /일일랭킹/.test(t)&&/미션/.test(t)&&/시청자/.test(t);
    })||null;
  }

  function findGrid(scope){
    if(!scope)return null;
    return scope.querySelector(
      ':scope > .kgh-main,'+
      ':scope > .kt-prejoin-room-grid,'+
      ':scope > .kt-approved-guest-grid,'+
      ':scope > .kt-guest-room-grid,'+
      '.kgh-main,.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid'
    );
  }

  function undo(){
    try{
      if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
      if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
      if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
    }catch(e){}
  }
  function treasure(){
    try{
      if(typeof window.ktUnifiedQuickTreasure==='function')return window.ktUnifiedQuickTreasure();
      if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
      if(typeof window.openTreasure==='function')return window.openTreasure();
      if(typeof window.openPackageBox==='function')return window.openPackageBox();
      if(typeof window.openGifts==='function')return window.openGifts();
    }catch(e){}
  }
  function match(){
    try{
      if(typeof window.ktUnifiedQuickMatch==='function')return window.ktUnifiedQuickMatch();
      if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
      if(typeof window.openMatch==='function')return window.openMatch();
    }catch(e){}
  }

  function wire(bar){
    var bs=bar&&bar.querySelectorAll('button');
    if(!bs||bs.length<3)return;
    bs[0].onclick=undo;
    bs[1].onclick=treasure;
    bs[2].onclick=match;
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9FinalHostClone5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGuest9FinalHostClone5555Style';
    s.textContent=''
      /* hide every older competing quick row in 9-person remote guest only */
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-quick:not(.kt-g9-final-quick-5555),'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-viewer-quick-20261001,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-approved-roster-quick-5555,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-prejoin-quick-5555,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-g9-quick-5555,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-remote-guest-upper-quick-5555{display:none!important}'

      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick-5555{'
        +'display:grid!important;visibility:visible!important;opacity:1!important;'
        +'grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'flex:0 0 42px!important;min-height:42px!important;height:42px!important;'
        +'width:100%!important;max-width:100%!important;gap:5px!important;'
        +'margin:0!important;padding:0!important;box-sizing:border-box!important;'
        +'position:relative!important;z-index:2147482600!important}'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick-5555>button{'
        +'display:flex!important;align-items:center!important;justify-content:center!important;'
        +'height:42px!important;min-width:0!important;padding:0 4px!important;'
        +'border:0!important;border-radius:12px!important;background:#101014!important;'
        +'color:#fff!important;font:950 12px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
        +'white-space:nowrap!important;touch-action:manipulation!important}'

      /* exact host-style 3 x 3 */
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-main,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-prejoin-room-grid,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-approved-guest-grid,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-guest-room-grid{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;'
        +'flex:1 1 0!important;min-height:0!important;overflow:hidden!important}'

      /* keep guest earnings compact */
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921,'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-earn{'
        +'width:112px!important;min-width:112px!important;max-width:112px!important;'
        +'height:52px!important;min-height:52px!important;max-height:52px!important;'
        +'padding:2px 4px!important;border-radius:9px!important;box-sizing:border-box!important}'
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-chat{'
        +'grid-template-columns:minmax(0,1fr) 112px!important;gap:4px!important}'

      /* bottom guest controls stay visible; do not alter their actions */
      +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555>.kt-remote-bottom{'
        +'display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'

      +'@media(max-width:390px){'
        +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick-5555{flex-basis:39px!important;min-height:39px!important;height:39px!important;gap:4px!important}'
        +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick-5555>button{height:39px!important;font-size:11px!important}'
        +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921,'
        +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-earn{width:104px!important;min-width:104px!important;max-width:104px!important;height:50px!important;min-height:50px!important;max-height:50px!important}'
        +'html.kt-remote-viewing #screen .kt-remote-live.kt-g9-final-5555 .kgh-chat{grid-template-columns:minmax(0,1fr) 104px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function ensureNineCells(grid){
    if(!grid)return;
    var direct=[].slice.call(grid.children||[]).filter(function(el){
      return el&&el.nodeType===1&&(
        el.classList.contains('kgh-cell')||
        el.classList.contains('kt-prejoin-room-cell')||
        el.classList.contains('kt-approved-guest-cell')||
        el.classList.contains('kt-guest-room-cell')
      );
    });
    if(!direct.length)return;
    while(direct.length<9){
      var d=document.createElement('div');
      d.className=direct[0].className.replace(/\b(host|self)\b/g,'').trim();
      d.textContent='게스트';
      grid.appendChild(d);
      direct.push(d);
    }
    while(direct.length>9){
      var d2=direct.pop();
      if(d2&&!d2.querySelector('video'))try{d2.remove();}catch(e){}
      else break;
    }
  }

  function canonicalQuick(scope,stats){
    var bar=scope.querySelector(':scope > .kt-g9-final-quick-5555');
    if(!bar){
      bar=document.createElement('div');
      bar.className='kt-g9-final-quick-5555';
      bar.innerHTML='<button type="button">↩ 되돌리기</button>'
        +'<button type="button">🎁 보물 상자</button>'
        +'<button type="button">⚔ 매치</button>';
    }
    wire(bar);
    if(stats&&stats.parentNode){
      if(stats.nextElementSibling!==bar)stats.insertAdjacentElement('afterend',bar);
    }else if(!bar.parentNode){
      scope.insertBefore(bar,scope.firstChild||null);
    }
    return bar;
  }

  function apply(){
    ensureStyle();
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root||!isNineRoot(root)){
      if(root)root.classList.remove('kt-g9-final-5555');
      return;
    }
    root.classList.add('kt-g9-final-5555');

    var scope=root.querySelector('.kt-guest-hostlike-room')||root;
    try{
      if(scope.classList.contains('kt-guest-hostlike-room'))scope.setAttribute('data-kt-room','9');
    }catch(e){}

    var stats=findStats(scope);
    canonicalQuick(scope,stats);

    var grid=findGrid(scope);
    if(grid){
      grid.style.setProperty('display','grid','important');
      grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('gap','2px','important');
      grid.style.setProperty('flex','1 1 0','important');
      grid.style.setProperty('min-height','0','important');
      ensureNineCells(grid);
    }

    var earn=root.querySelector('#ktAllRoomGuestEarnHud20260921,.kgh-earn');
    if(earn){
      earn.style.setProperty('width','112px','important');
      earn.style.setProperty('min-width','112px','important');
      earn.style.setProperty('max-width','112px','important');
      earn.style.setProperty('height','52px','important');
      earn.style.setProperty('min-height','52px','important');
      earn.style.setProperty('max-height','52px','important');
    }
  }

  apply();
  [0,30,80,160,300,600,1000,1800,3000].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,500);
  window.addEventListener('kt-guest-approval-received',function(){[0,20,80,180,400].forEach(function(ms){setTimeout(apply,ms);});});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,0);setTimeout(apply,80);});
  window.addEventListener('kt-any-guest-approved',function(){setTimeout(apply,0);});
  window.addEventListener('kt-livekit-state',function(){setTimeout(apply,0);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9FinalHostCloneTimer5555);
      window.__ktGuest9FinalHostCloneTimer5555=setTimeout(apply,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-kt-room']});
  }catch(e){}
})();