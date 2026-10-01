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
        +'gap:2px!important;width:calc(100% - 18px)!important;margin:8px auto 0!important;height:calc(68vw - 12px)!important;'
        +'flex:0 0 calc(68vw - 12px)!important;max-height:none!important;min-height:0!important;overflow:hidden!important}'
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
        +'width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:50%!important;display:grid!important;place-items:center!important;font-size:16px!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main{width:calc(100% - 16px)!important;margin-top:7px!important;height:calc(68vw - 10px)!important;flex-basis:calc(68vw - 10px)!important}'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom{left:5px!important;right:5px!important;gap:4px!important}'
        +'#screen .kt-remote-live.kt-guest9-hostmatch-final>.kt-remote-bottom .kt-remote-action{width:34px!important;height:34px!important;flex-basis:34px!important;font-size:15px!important}'
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
    var input=bar.querySelector('input');
    if(!input)return;

    /* Approved 9-room uses the SAME six-control row:
       input -> send -> people -> rose -> gift -> share. */
    var send=document.getElementById('ktRemoteChatSend')||
      bar.querySelector('.kt-remote-action.send,[data-kt-send-plane-5555],[data-kt-send-plane-hard-5555]');
    if(!send){
      send=document.createElement('button');
      send.type='button';
      send.className='kt-remote-action send';
      send.setAttribute('aria-label','채팅 보내기');
      send.textContent='➤';
      send.onclick=function(){
        try{
          if(typeof window.ktRemoteSendChat==='function')return window.ktRemoteSendChat();
          var ev=new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true});
          input.dispatchEvent(ev);
        }catch(e){}
      };
    }

    var people=document.getElementById('ktRemoteGuestRequest')||
      bar.querySelector('.kt-guest9-people,.kt-remote-guest-request')||
      [].slice.call(bar.querySelectorAll('button')).find(function(b){return /👥|👤/.test(String(b.textContent||''));});
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

    var rose=document.getElementById('ktRemoteRoseButton')||
      bar.querySelector('.kt-guest9-rose,.kt-remote-rose')||
      [].slice.call(bar.querySelectorAll('button')).find(function(b){return /🌹/.test(String(b.textContent||''));});
    if(!rose){
      rose=document.createElement('button');
      rose.type='button';
      rose.className='kt-remote-action kt-guest9-rose';
      rose.setAttribute('aria-label','장미');
      rose.textContent='🌹';
      rose.onclick=function(){
        try{
          if(typeof window.ktRemoteSendOneRose==='function')return window.ktRemoteSendOneRose();
          if(typeof window.ktRemoteOpenGifts==='function')return window.ktRemoteOpenGifts();
        }catch(e){}
      };
    }

    var gift=bar.querySelector('.kt-remote-action.gift,[data-kt-gift],#ktRemoteGiftButton')||
      [].slice.call(bar.querySelectorAll('button')).find(function(b){return /🎁|선물/.test(String(b.textContent||''));});
    if(!gift){
      gift=document.createElement('button');
      gift.type='button';
      gift.className='kt-remote-action gift';
      gift.setAttribute('aria-label','선물상자');
      gift.textContent='🎁';
      gift.onclick=function(){
        try{
          if(typeof window.ktRemoteOpenGifts==='function')return window.ktRemoteOpenGifts();
          if(typeof window.openGifts==='function')return window.openGifts();
        }catch(e){}
      };
    }

    var share=bar.querySelector('.kt-remote-action.share,[data-kt-share],#ktRemoteShareButton')||
      [].slice.call(bar.querySelectorAll('button')).find(function(b){return /↗|공유/.test(String(b.textContent||''));});
    if(!share){
      share=document.createElement('button');
      share.type='button';
      share.className='kt-remote-action share';
      share.setAttribute('aria-label','공유');
      share.textContent='↗';
      share.onclick=function(){
        try{
          if(typeof window.shareApp==='function')return window.shareApp();
          if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});
        }catch(e){}
      };
    }

    var keep=[send,people,rose,gift,share];
    [].slice.call(bar.children).forEach(function(el){
      if(el===input||keep.indexOf(el)>=0)return;
      if(el.tagName==='BUTTON'){try{el.remove();}catch(e){}}
    });

    bar.appendChild(input);
    bar.appendChild(send);
    bar.appendChild(people);
    bar.appendChild(rose);
    bar.appendChild(gift);
    bar.appendChild(share);
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