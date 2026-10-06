/* 1111: fresh unified undo / treasure / match row for host + guest in every live room.
   One row only. Same markup/style everywhere. */
(function(){
  if(window.__ktFreshThreeAllRooms1111)return;
  window.__ktFreshThreeAllRooms1111=true;
  var CLS='kt-fresh-three-1111';

  function style(){
    if(document.getElementById('ktFreshThreeStyle1111'))return;
    var s=document.createElement('style');
    s.id='ktFreshThreeStyle1111';
    s.textContent=''
      +'#screen .'+CLS+'{flex:0 0 34px!important;height:34px!important;min-height:34px!important;width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;margin:0 0 3px!important;padding:0!important;box-sizing:border-box!important;position:relative!important;z-index:95!important}'
      +'#screen .'+CLS+'>button{height:34px!important;min-width:0!important;margin:0!important;padding:0 4px!important;border:1px solid #ffffff20!important;border-radius:10px!important;background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;touch-action:manipulation!important}'
      +'#screen .'+CLS+' b{font-size:15px!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  function act(kind,btn){
    if(kind==='undo'){
      try{if(typeof window.ktUnifiedQuickFlip==='function')return window.ktUnifiedQuickFlip(btn);}catch(e){}
      try{if(typeof window.ktAllRoomsFlipCamera==='function')return window.ktAllRoomsFlipCamera(btn);}catch(e){}
      try{if(typeof window.flipCamera==='function')return window.flipCamera();}catch(e){}
    }
    if(kind==='treasure'){
      try{if(typeof window.placeTreasureChest==='function')return window.placeTreasureChest();}catch(e){}
      try{if(typeof window.openTreasureBox==='function')return window.openTreasureBox();}catch(e){}
      try{if(typeof window.openTreasure==='function')return window.openTreasure();}catch(e){}
      try{if(typeof window.openPackageBox==='function')return window.openPackageBox();}catch(e){}
    }
    if(kind==='match'){
      try{if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');}catch(e){}
      try{if(typeof window.openMatchArena==='function')return window.openMatchArena('1대1');}catch(e){}
      try{if(typeof window.openMatch==='function')return window.openMatch();}catch(e){}
    }
  }
  function make(){
    var d=document.createElement('div'); d.className=CLS;
    [['↻','되돌리기','undo'],['🎁','보물상자','treasure'],['⚔','매치','match']].forEach(function(x){
      var b=document.createElement('button'); b.type='button'; b.innerHTML='<b>'+x[0]+'</b><span>'+x[1]+'</span>'; b.setAttribute('aria-label',x[1]);
      b.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(_e){} act(x[2],b);}; d.appendChild(b);
    }); return d;
  }
  function roots(){
    var a=[]; function add(x){if(x&&x.isConnected&&a.indexOf(x)<0)a.push(x);}
    document.querySelectorAll('#screen .ktsolo-room,#screen .ktgroup9-room,#screen .ktg9-room,#screen .ktgroup13-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-guest-hostlike-room,#screen .kt-prejoin-room,#screen .kt-approved-guest-room,#screen .kt-guest-room').forEach(add);
    var remote=document.querySelector('#screen .kt-remote-live'); if(remote&&!remote.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'))add(remote);
    return a;
  }
  function anchor(root){
    return root.querySelector(':scope > .ktsolo-stats,:scope > .ktgroup9-stats,:scope > .ktg9-stats,:scope > .ktgroup13-stats,:scope > .ktg13-stats,:scope > .ktsubscriber-stats,:scope > .ktsecret-stats,:scope > .kgh-stats,:scope > .kt-prejoin-room-stats,:scope > .kt-approved-guest-stats')
      ||root.querySelector(':scope > .ktsolo-main,:scope > .ktgroup9-main,:scope > .ktg9-main,:scope > .ktgroup13-main,:scope > .ktg13-main,:scope > .ktsubscriber-main,:scope > .ktsecret-main,:scope > .kgh-main,:scope > [class*="room-grid"]');
  }
  function install(root){
    var rows=root.querySelectorAll(':scope > .'+CLS); for(var i=1;i<rows.length;i++)rows[i].remove();
    var row=rows[0]||make(), a=anchor(root);
    /* 게스트 화면의 옛날 위쪽 3버튼 줄은 클래스/문구와 관계없이 제거 */
    try{
      var guest=!!root.closest('.kt-remote-live,.kt-guest-hostlike-room,.kt-approved-guest-room,.kt-guest-room,.kt-prejoin-room');
      if(guest){
        root.querySelectorAll('.kt-room-second-stats-row-20260927').forEach(function(el){el.remove();});
        Array.prototype.slice.call(root.children||[]).forEach(function(el){
          if(!el||el===row||el.contains(row))return;
          var t=String(el.textContent||'').replace(/\s+/g,'');
          var old3=t.indexOf('되돌리기')>=0&&t.indexOf('매치')>=0&&(t.indexOf('패키지')>=0||t.indexOf('패키지상자')>=0);
          if(old3)el.remove();
        });
      }
    }catch(e){}
    /* 살아있는 새 줄을 메인 화면 바로 위로 올림 */
    if(a&&a.parentNode===root){if(a.previousElementSibling!==row)root.insertBefore(row,a);}
    else if(row.parentNode!==root)root.appendChild(row);
  }
  function run(){
    style();
    var rs=roots();
    rs.forEach(install);
    /* Viewer 9-room and approved-room shells can be rebuilt after this script runs.
       Keep one canonical row alive on every current room instead of leaving some
       phones on the retired package-box row or with no row at all. */
    try{
      document.querySelectorAll('#screen .kt-room-second-stats-row-20260927,#screen .ktg13-quick,#screen .kt-all-five-utm-hard1111,#screen .kt-g9-host-top3-restore-20261005,#screen .kt-g9-host-utm-20261005').forEach(function(el){
        var t=String(el.textContent||'').replace(/\s+/g,'');
        if(t.indexOf('패키지')>=0||(t.indexOf('되돌리기')>=0&&t.indexOf('매치')>=0))el.remove();
      });
    }catch(e){}
  }
  run(); [30,100,250,600,1200,2200,4000].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,1200);
  try{new MutationObserver(function(){clearTimeout(window.__ktFreshThreeTimer1111);window.__ktFreshThreeTimer1111=setTimeout(run,20);}).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
