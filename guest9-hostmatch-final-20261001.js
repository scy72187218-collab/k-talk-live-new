/* K-Talk 9-person approved guest final host-match override — 2026-10-01
   5555: ONLY approved 9-person guest screen.
   Keep treasure box wording. Match host 3x3 grid. Small earnings.
   Bottom: chat input + people + rose + gift + share.
*/
(function(){
  if(window.__ktGuest9HostMatchFinal20261001)return;
  window.__ktGuest9HostMatchFinal20261001=true;

  function root(){
    var room=document.querySelector('#screen .kt-remote-live .kt-guest-hostlike-room[data-kt-room="9"]');
    if(!room)return null;
    var r=room.closest('.kt-remote-live');
    return r?{root:r,room:room}:null;
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9HostMatchFinalStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktGuest9HostMatchFinalStyle20261001';
    s.textContent=''
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;'
        +'gap:2px!important;width:100%!important;height:calc(100vw - 14px)!important;'
        +'flex:0 0 calc(100vw - 14px)!important;max-height:none!important;min-height:0!important;overflow:hidden!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-cell{'
        +'min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;border:1px solid #28282d!important;border-radius:7px!important;overflow:hidden!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-quick{'
        +'display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;flex:0 0 42px!important;min-height:42px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-quick button{'
        +'display:flex!important;align-items:center!important;justify-content:center!important;border:0!important;border-radius:12px!important;background:#111114!important;color:#fff!important;font-weight:950!important;font-size:12px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-chat{'
        +'display:block!important;flex:0 0 0!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;overflow:visible!important;background:transparent!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-chatbox{display:none!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-earn{'
        +'position:fixed!important;left:auto!important;right:8px!important;top:auto!important;bottom:74px!important;'
        +'width:112px!important;min-width:112px!important;max-width:112px!important;height:62px!important;min-height:62px!important;max-height:62px!important;'
        +'margin:0!important;padding:3px 4px!important;border-radius:9px!important;z-index:2147482490!important;overflow:hidden!important;box-sizing:border-box!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kgh-earn .top span{font-size:4.8px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kgh-earn .top b{font-size:7.5px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kgh-earn-detail{font-size:4.5px!important;gap:1px 2px!important;line-height:1.05!important;margin-top:1px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom{'
        +'position:fixed!important;left:8px!important;right:8px!important;bottom:4px!important;z-index:2147482500!important;'
        +'display:flex!important;align-items:center!important;gap:6px!important;margin:0!important;transform:none!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom input{'
        +'flex:1 1 auto!important;min-width:80px!important;height:44px!important;border-radius:23px!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom .kt-remote-action{'
        +'width:44px!important;height:44px!important;flex:0 0 44px!important;border-radius:50%!important;display:grid!important;place-items:center!important}'
      +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom .send{display:none!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{height:calc(100vw - 8px)!important;flex-basis:calc(100vw - 8px)!important}'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom{left:5px!important;right:5px!important;gap:4px!important}'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom .kt-remote-action{width:40px!important;height:40px!important;flex-basis:40px!important}'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom input{height:40px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function quick(room){
    var q=room.querySelector('.kgh-quick');
    var stats=room.querySelector('.kgh-stats');
    if(!q){
      q=document.createElement('div');
      q.className='kgh-quick';
      q.innerHTML='<button type="button" class="kgh-undo-btn">↩ 되돌리기</button>'
        +'<button type="button" class="kgh-treasure-btn">🎁 보물상자</button>'
        +'<button type="button" class="kgh-match-btn">⚔ 매치</button>';
    }else{
      q.innerHTML='<button type="button" class="kgh-undo-btn">↩ 되돌리기</button>'
        +'<button type="button" class="kgh-treasure-btn">🎁 보물상자</button>'
        +'<button type="button" class="kgh-match-btn">⚔ 매치</button>';
    }
    if(stats&&q.previousElementSibling!==stats)stats.insertAdjacentElement('afterend',q);

    var u=q.querySelector('.kgh-undo-btn');
    var t=q.querySelector('.kgh-treasure-btn');
    var m=q.querySelector('.kgh-match-btn');
    if(u)u.onclick=function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
      }catch(e){}
    };
    if(t)t.onclick=function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openGifts==='function')return window.openGifts();
      }catch(e){}
    };
    if(m)m.onclick=function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    };
  }

  function bottom(r){
    var bar=r.querySelector(':scope > .kt-remote-bottom')||document.getElementById('ktRemoteBottom');
    if(!bar)return;

    var send=bar.querySelector('.send');
    if(send)send.remove();

    var people=bar.querySelector('.kt-guest9-people');
    if(!people){
      people=document.createElement('button');
      people.type='button';
      people.className='kt-remote-action kt-guest9-people';
      people.setAttribute('aria-label','사람');
      people.textContent='👥';
      people.onclick=function(){
        try{
          if(typeof window.friends==='function')return window.friends();
          if(typeof window.openFriends==='function')return window.openFriends();
        }catch(e){}
      };
    }

    var rose=bar.querySelector('.kt-guest9-rose');
    if(!rose){
      rose=document.createElement('button');
      rose.type='button';
      rose.className='kt-remote-action kt-guest9-rose';
      rose.setAttribute('aria-label','장미');
      rose.textContent='🌹';
      rose.onclick=function(){
        try{if(typeof window.ktRemoteSendOneRose==='function')return window.ktRemoteSendOneRose();}catch(e){}
      };
    }

    var gift=bar.querySelector('.gift');
    var share=bar.querySelector('.share');
    var input=bar.querySelector('input');

    if(input&&people.previousElementSibling!==input)input.insertAdjacentElement('afterend',people);
    if(people&&rose.previousElementSibling!==people)people.insertAdjacentElement('afterend',rose);
    if(gift&&gift.previousElementSibling!==rose)rose.insertAdjacentElement('afterend',gift);
    if(share&&gift&&share.previousElementSibling!==gift)gift.insertAdjacentElement('afterend',share);

    [].slice.call(bar.querySelectorAll('button')).forEach(function(b){
      if(b===people||b===rose||b===gift||b===share)return;
      b.remove();
    });
  }

  function apply(){
    ensureStyle();
    var x=root();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(r){
      r.classList.toggle('kt-guest9-hostmatch-final',!!(x&&r===x.root));
    });
    if(!x)return;

    quick(x.room);
    bottom(x.root);

    var earn=x.room.querySelector('.kgh-earn');
    if(earn){
      earn.style.setProperty('position','fixed','important');
      earn.style.setProperty('right','8px','important');
      earn.style.setProperty('bottom','74px','important');
      earn.style.setProperty('width','112px','important');
      earn.style.setProperty('min-width','112px','important');
      earn.style.setProperty('max-width','112px','important');
      earn.style.setProperty('height','62px','important');
      earn.style.setProperty('min-height','62px','important');
      earn.style.setProperty('max-height','62px','important');
    }
  }

  apply();
  [20,80,180,400,900,1600,2800].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,600);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9HostMatchFinalTimer20261001);
      window.__ktGuest9HostMatchFinalTimer20261001=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();