/* K-Talk: guest-only top controls for all live room types.
   Adds 되돌리기 / 보물상자 / 매치 above the guest stats row without
   changing host layouts, video transport, chat, gifts, or room sizing. */
(function(){
  if(window.__ktAllGuestTopControls20260926)return;
  window.__ktAllGuestTopControls20260926=true;

  function runAction(kind){
    try{
      if(kind==='return'){
        if(typeof window.ktAllRoomsFlipCamera==='function'){window.ktAllRoomsFlipCamera();return;}
        if(typeof window.flipCamera==='function'){window.flipCamera();return;}
      }
      if(kind==='treasure'){
        if(typeof window.ktUnifiedQuickTreasure==='function'){window.ktUnifiedQuickTreasure();return;}
        if(typeof window.openTreasure==='function'){window.openTreasure();return;}
        if(typeof window.ktSubscriberTreasure==='function'){window.ktSubscriberTreasure();return;}
        if(typeof window.openGifts==='function'){window.openGifts();return;}
      }
      if(kind==='match'){
        if(typeof window.ktUnifiedQuickMatch==='function'){window.ktUnifiedQuickMatch();return;}
        if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return;}
        if(typeof window.openMatchArena==='function'){window.openMatchArena('1대1');return;}
      }
    }catch(e){}
  }

  function bind(btn,kind){
    if(!btn||btn.__ktGuestTopBound)return;
    btn.__ktGuestTopBound=true;
    btn.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      runAction(kind);
    });
  }

  function fill(row){
    if(!row)return;
    row.classList.add('kt-guest-top-controls');
    row.innerHTML='<button type="button" data-kt-kind="return">↻ 되돌리기</button>'+
                  '<button type="button" data-kt-kind="treasure">🎁 보물상자</button>'+
                  '<button type="button" data-kt-kind="match">⚔ 매치</button>';
    bind(row.querySelector('[data-kt-kind="return"]'),'return');
    bind(row.querySelector('[data-kt-kind="treasure"]'),'treasure');
    bind(row.querySelector('[data-kt-kind="match"]'),'match');
  }

  function ensureStyle(){
    if(document.getElementById('ktAllGuestTopControlsStyle20260926'))return;
    var s=document.createElement('style');
    s.id='ktAllGuestTopControlsStyle20260926';
    s.textContent=''
      +'.kt-remote-live .kt-guest-top-controls{width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;box-sizing:border-box!important;flex:0 0 36px!important;min-height:34px!important;margin:0!important;padding:0 4px!important;position:relative!important;z-index:45!important}'
      +'.kt-remote-live .kt-guest-top-controls>button{height:34px!important;min-width:0!important;border:1px solid #35363d!important;border-radius:9px!important;background:linear-gradient(180deg,#17181c,#101116)!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;padding:0 4px!important}'
      +'.kt-remote-live .kgh-quick.kt-guest-top-controls{display:grid!important;flex-basis:36px!important;padding:0 4px!important}'
      +'@media(max-width:390px){.kt-remote-live .kt-guest-top-controls{flex-basis:32px!important;min-height:30px!important;gap:3px!important}.kt-remote-live .kt-guest-top-controls>button{height:30px!important;font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function isGuestRoot(root){
    if(!root)return false;
    /* .kt-remote-live is the viewer/guest room shell. Host rooms use the
       dedicated ktsolo/ktg13/ktsubscriber/ktsecret host roots instead. */
    return root.classList&&root.classList.contains('kt-remote-live');
  }

  function findStatsTarget(root){
    var direct=root.querySelector('.kgh-stats');
    if(direct)return direct;
    var nodes=[].slice.call(root.querySelectorAll('div,section'));
    for(var i=0;i<nodes.length;i++){
      var t=String(nodes[i].textContent||'').replace(/\s+/g,' ');
      if(t.indexOf('일일 랭킹')>-1&&t.indexOf('미션')>-1&&t.indexOf('시청자')>-1){
        return nodes[i];
      }
    }
    return null;
  }

  function fallbackAnchor(root){
    return root.querySelector(
      '.kt-guest-hostlike-room .kgh-main,'+
      '.kt-approved-guest-grid,'+
      '.kt-prejoin-room-grid,'+
      '.kt-guest-room-grid,'+
      '.kt-remote-video-wrap,'+
      '.kt-remote-stage,'+
      '.kt-remote-view-grid'
    );
  }

  function apply(){
    ensureStyle();
    var roots=[].slice.call(document.querySelectorAll('.kt-remote-live'));
    roots.forEach(function(root){
      if(!isGuestRoot(root))return;

      /* 9명/13명 approved guest room already has a quick row. Reuse it so
         spacing stays identical; only its three labels/actions are corrected. */
      var quick=root.querySelector('.kt-guest-hostlike-room .kgh-quick');
      if(quick){
        if(!quick.classList.contains('kt-guest-top-controls')||
           String(quick.textContent||'').indexOf('되돌리기')<0){
          fill(quick);
        }
        return;
      }

      var existing=root.querySelector(':scope > .kt-guest-top-controls');
      if(!existing)existing=root.querySelector('.kt-guest-top-controls');
      if(existing){fill(existing);return;}

      var row=document.createElement('div');
      fill(row);

      var stats=findStatsTarget(root);
      if(stats&&stats.parentNode){
        stats.parentNode.insertBefore(row,stats);
        return;
      }

      var anchor=fallbackAnchor(root);
      if(anchor&&anchor.parentNode){
        anchor.parentNode.insertBefore(row,anchor);
        return;
      }

      var meta=root.querySelector('.kt-remote-meta,.kt-remote-led,.kt-remote-head');
      if(meta&&meta.parentNode){
        if(meta.nextSibling)meta.parentNode.insertBefore(row,meta.nextSibling);
        else meta.parentNode.appendChild(row);
        return;
      }

      root.insertBefore(row,root.firstChild||null);
    });
  }

  apply();
  setTimeout(apply,60);
  setTimeout(apply,250);
  setInterval(apply,900);
  try{
    new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
