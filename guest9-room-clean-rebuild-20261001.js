/* K-Talk guest 9-person room clean rebuild — 2026-10-01
   Scope: approved guest 9-person room only.
   Keep host/guest video streams alive. Do not touch other rooms or host layout. */
(function(){
  if(window.__ktGuest9CleanRebuild20261001)return;
  window.__ktGuest9CleanRebuild20261001=true;

  function btn(label,cls,fn){
    var b=document.createElement('button');
    b.type='button';
    b.className=cls;
    b.textContent=label;
    if(fn)b.addEventListener('click',fn);
    return b;
  }

  function rebuildQuick(room){
    var old=room.querySelector(':scope > .kgh-quick');
    if(old)try{old.remove();}catch(e){}
    var quick=document.createElement('div');
    quick.className='kgh-quick kt-guest9-quick-rebuilt';
    quick.appendChild(btn('↩ 되돌리기','kgh-undo-btn',function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
      }catch(e){}
    }));
    quick.appendChild(btn('🎁 보물 상자','kgh-treasure-btn',function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openPackageBox==='function')return window.openPackageBox();
        if(typeof window.openGifts==='function')return window.openGifts();
      }catch(e){}
    }));
    quick.appendChild(btn('⚔ 매치','kgh-match-btn',function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    }));

    var stats=room.querySelector(':scope > .kgh-stats');
    if(stats)room.insertBefore(quick,stats);
    else{
      var led=room.querySelector(':scope > .kgh-led');
      if(led&&led.nextSibling)room.insertBefore(quick,led.nextSibling);
      else room.appendChild(quick);
    }
  }

  function normalizeGrid(room){
    var grid=room.querySelector(':scope > .kgh-main');
    if(!grid)return;
    var cells=[].slice.call(grid.querySelectorAll(':scope > .kgh-cell'));
    while(cells.length<9){
      var d=document.createElement('div');
      d.className='kgh-cell';
      d.textContent='게스트';
      grid.appendChild(d);
      cells.push(d);
    }
    while(cells.length>9){
      var last=cells.pop();
      if(last&&!last.classList.contains('host')&&!last.classList.contains('self'))try{last.remove();}catch(e){}
      else break;
    }
  }

  function compactEarn(room){
    var chat=room.querySelector(':scope > .kgh-chat');
    var earn=room.querySelector('.kgh-earn');
    if(!chat||!earn)return;
    earn.style.setProperty('position','absolute','important');
    earn.style.setProperty('right','4px','important');
    earn.style.setProperty('left','auto','important');
    earn.style.setProperty('bottom','3px','important');
    earn.style.setProperty('width','136px','important');
    earn.style.setProperty('min-width','136px','important');
    earn.style.setProperty('max-width','136px','important');
    earn.style.setProperty('height','42px','important');
    earn.style.setProperty('min-height','42px','important');
    earn.style.setProperty('max-height','42px','important');
    earn.style.setProperty('padding','2px 3px','important');
    earn.style.setProperty('border-radius','9px','important');
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9CleanRebuildStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktGuest9CleanRebuildStyle20261001';
    s.textContent=''
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]{gap:4px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick{display:grid!important;visibility:visible!important;opacity:1!important;flex:0 0 42px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;margin:0!important;padding:0!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick>button{display:flex!important;align-items:center!important;justify-content:center!important;height:42px!important;min-width:0!important;padding:0 6px!important;border:0!important;border-radius:12px!important;background:#101014!important;color:#fff!important;font-size:12px!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;min-height:0!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main>.kgh-cell{min-width:0!important;min-height:0!important;width:auto!important;height:auto!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-chat{position:relative!important;display:block!important;flex:0 0 56px!important;height:56px!important;min-height:56px!important;max-height:56px!important;padding:1px 4px 2px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-chat>.kgh-chatbox{width:calc(100% - 144px)!important;height:54px!important;max-height:54px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn .top span{font-size:6.5px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn .top b{font-size:9px!important}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn-detail{font-size:6px!important;margin-top:1px!important;gap:1px 2px!important}'
      +'@media(max-width:390px){#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick{flex-basis:39px!important}#screen .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick>button{height:39px!important;font-size:11px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-guest-hostlike-room[data-kt-room="9"]').forEach(function(room){
      if(room.dataset.ktGuest9CleanRebuilt!=='1'){
        rebuildQuick(room);
        room.dataset.ktGuest9CleanRebuilt='1';
      }
      normalizeGrid(room);
      compactEarn(room);
    });
  }

  apply();
  [30,100,250,500,900,1500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9CleanRebuildTimer20261001);
      window.__ktGuest9CleanRebuildTimer20261001=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,20);setTimeout(apply,120);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,20);});
})();