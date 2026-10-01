/* K-Talk guest 9-room final host-match lock — 5555 — 2026-10-01
   Scope ONLY: remote/viewer 9-person room.
   Does not touch host room, video streams, signaling, approval logic, other rooms. */
(function(){
  if(window.__ktGuest9HostMatchFinal5555)return;
  window.__ktGuest9HostMatchFinal5555=true;

  function isNine(root){
    try{
      var room=root.querySelector('.kt-guest-hostlike-room,.kt-prejoin-room-view,.kt-prejoin-room-grid');
      if(room&&room.getAttribute&&room.getAttribute('data-kt-room')==='9')return true;
      var last=window.__ktLastLiveRoom||{};
      var txt=[
        root.textContent||'',
        last.room_name||'',last.title||'',last.room_type||'',
        window.__ktRemoteRoomName||'',window.__ktRemoteRoomType||''
      ].join(' ');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function mk(label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.textContent=label;
    if(fn)b.addEventListener('click',fn);
    return b;
  }

  function undo(){
    try{
      if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
      if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
      if(typeof window.leaveBroadcastToDashboard==='function')return window.leaveBroadcastToDashboard();
    }catch(e){}
  }
  function treasure(){
    try{
      if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
      if(typeof window.openTreasure==='function')return window.openTreasure();
      if(typeof window.openGifts==='function')return window.openGifts();
    }catch(e){}
  }
  function match(){
    try{
      if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
      if(typeof window.openMatch==='function')return window.openMatch();
    }catch(e){}
  }

  function ensureQuick(root){
    var room=root.querySelector('.kt-guest-hostlike-room');
    var stats=null,grid=null,q=null;
    if(room){
      room.setAttribute('data-kt-room','9');
      stats=room.querySelector(':scope > .kgh-stats');
      grid=room.querySelector(':scope > .kgh-main');
      q=room.querySelector(':scope > .kgh-quick');
      if(!q){
        q=document.createElement('div');
        q.className='kgh-quick';
      }
    }else{
      stats=root.querySelector('.kt-prejoin-room-stats,.kt-approved-guest-stats');
      grid=root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid');
      q=root.querySelector('.kt-prejoin-quick-5555,.kt-viewer-quick-20261001,.kt-g9-final-quick-5555');
      if(!q){
        q=document.createElement('div');
        q.className='kt-g9-final-quick-5555';
      }
    }
    if(!stats||!q)return;

    if(q.dataset.ktFinal5555!=='1'){
      q.innerHTML='';
      q.appendChild(mk('↩ 되돌리기',undo));
      q.appendChild(mk('🎁 보물상자',treasure));
      q.appendChild(mk('⚔ 매치',match));
      q.dataset.ktFinal5555='1';
    }
    if(stats.nextElementSibling!==q)stats.insertAdjacentElement('afterend',q);
  }

  function normalizeGrid(root){
    var grid=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"] > .kgh-main,.kt-prejoin-room-grid,.kt-approved-guest-grid');
    if(!grid)return;
    grid.style.setProperty('display','grid','important');
    grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('gap','2px','important');
    grid.style.setProperty('min-height','0','important');
  }

  function compactEarn(root){
    var e=root.querySelector('.kgh-earn,#ktAllRoomGuestEarnHud20260921');
    if(!e)return;
    e.style.setProperty('width','92px','important');
    e.style.setProperty('min-width','92px','important');
    e.style.setProperty('max-width','92px','important');
    e.style.setProperty('height','44px','important');
    e.style.setProperty('min-height','44px','important');
    e.style.setProperty('max-height','44px','important');
    e.style.setProperty('padding','1px 2px','important');
    e.style.setProperty('border-radius','8px','important');
  }

  function bottom(root){
    var bar=root.querySelector(':scope > .kt-remote-bottom,#ktRemoteBottom');
    if(!bar)return;

    var input=bar.querySelector('#ktRemoteChatInput,input');
    var send=bar.querySelector('#ktRemoteChatSend,.kt-remote-action.send');
    var people=bar.querySelector('#ktRemoteGuestRequest,[aria-label*="참여"],[aria-label*="사람"]');
    var rose=bar.querySelector('#ktRemoteRoseButton,.kt-remote-rose,[aria-label*="장미"]');
    var gift=bar.querySelector('.kt-remote-action.gift,[aria-label="선물"]');
    var share=bar.querySelector('.kt-remote-action.share,[aria-label="공유"]');

    if(send)send.style.setProperty('display','none','important');

    if(input)bar.appendChild(input);
    if(people)bar.appendChild(people);
    if(rose)bar.appendChild(rose);
    if(gift)bar.appendChild(gift);
    if(share)bar.appendChild(share);

    [people,rose,gift,share].forEach(function(b){
      if(b){
        b.style.removeProperty('display');
        b.style.setProperty('visibility','visible','important');
        b.style.setProperty('opacity','1','important');
      }
    });
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9HostMatchFinal5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGuest9HostMatchFinal5555Style';
    s.textContent=''
      +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick,'
      +'#screen .kt-remote-live .kt-g9-final-quick-5555,'
      +'#screen .kt-remote-live .kt-prejoin-quick-5555,'
      +'#screen .kt-remote-live .kt-viewer-quick-20261001{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'gap:5px!important;flex:0 0 40px!important;min-height:40px!important;width:100%!important;'
        +'margin:0!important;padding:0!important;visibility:visible!important;opacity:1!important;z-index:70!important}'
      +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick>button,'
      +'#screen .kt-remote-live .kt-g9-final-quick-5555>button,'
      +'#screen .kt-remote-live .kt-prejoin-quick-5555>button,'
      +'#screen .kt-remote-live .kt-viewer-quick-20261001>button{'
        +'height:40px!important;min-width:0!important;border:0!important;border-radius:12px!important;'
        +'background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-main{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;'
        +'grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;flex:1 1 0!important;min-height:0!important}'
      +'#screen .kt-remote-live .kgh-chat{grid-template-columns:minmax(0,1fr) 92px!important;gap:4px!important}'
      +'#screen .kt-remote-live .kgh-earn .top span{font-size:5.5px!important}'
      +'#screen .kt-remote-live .kgh-earn .top b{font-size:7px!important}'
      +'#screen .kt-remote-live .kgh-earn-detail{font-size:5px!important;line-height:1!important;gap:0 1px!important}'
      +'#screen .kt-remote-live>.kt-remote-bottom{display:flex!important;align-items:center!important;gap:6px!important}'
      +'#screen .kt-remote-live>.kt-remote-bottom #ktRemoteChatSend,'
      +'#screen .kt-remote-live>.kt-remote-bottom .kt-remote-action.send{display:none!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick,'
        +'#screen .kt-remote-live .kt-g9-final-quick-5555,'
        +'#screen .kt-remote-live .kt-prejoin-quick-5555,'
        +'#screen .kt-remote-live .kt-viewer-quick-20261001{flex-basis:37px!important;min-height:37px!important}'
        +'#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]>.kgh-quick>button,'
        +'#screen .kt-remote-live .kt-g9-final-quick-5555>button,'
        +'#screen .kt-remote-live .kt-prejoin-quick-5555>button,'
        +'#screen .kt-remote-live .kt-viewer-quick-20261001>button{height:37px!important;font-size:10px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNine(root))return;
      ensureQuick(root);
      normalizeGrid(root);
      compactEarn(root);
      bottom(root);
    });
  }

  apply();
  [40,120,260,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,20);setTimeout(apply,150);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,20);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9HostMatchFinal5555Timer);
      window.__ktGuest9HostMatchFinal5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();