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
    /* Final 9-room layout is owned by group9-one-unified-screen-final-20261002.js.
       This helper now keeps controls/actions only so it cannot fight the layout. */
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
      people.id='ktRemoteGuestRequest';
      people.className='kt-remote-action kt-guest9-people kt-remote-guest-request';
      people.setAttribute('aria-label','방송 참여 신청');
      people.setAttribute('title','방송 참여 신청');
      people.textContent='👥';
      people.onclick=function(e){
        try{if(e)e.preventDefault();}catch(_e){}
        try{
          if(typeof window.ktRequestGuestJoin==='function')return window.ktRequestGuestJoin();
        }catch(_e){}
      };
    }else{
      if(!people.id)people.id='ktRemoteGuestRequest';
      people.setAttribute('aria-label','방송 참여 신청');
      people.setAttribute('title','방송 참여 신청');
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