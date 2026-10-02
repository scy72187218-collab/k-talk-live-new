/* K-Talk 9-room approved guest: restore ONLY quick row
   (되돌리기 / 보물 상자 / 매치). Do not touch grid, chat, video, bottom controls or signaling. */
(function(){
  if(window.__ktGuest9QuickRowRestoreOnly20261002)return;
  window.__ktGuest9QuickRowRestoreOnly20261002=true;

  function bind(q){
    if(!q)return;
    var u=q.querySelector('.kgh-undo-btn');
    var t=q.querySelector('.kgh-treasure-btn');
    var m=q.querySelector('.kgh-match-btn');

    if(u)u.onclick=function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
      }catch(e){}
    };
    if(t)t.onclick=function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openPackageBox==='function')return window.openPackageBox();
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

  function ensure(room){
    if(!room)return;
    var q=room.querySelector(':scope > .kgh-quick');
    if(!q){
      q=document.createElement('div');
      q.className='kgh-quick';
      q.innerHTML=
        '<button type="button" class="kgh-undo-btn">↩ 되돌리기</button>'+
        '<button type="button" class="kgh-treasure-btn">🎁 보물 상자</button>'+
        '<button type="button" class="kgh-match-btn">⚔ 매치</button>';

      var stats=room.querySelector(':scope > .kgh-stats');
      var led=room.querySelector(':scope > .kgh-led');
      if(stats)room.insertBefore(q,stats);
      else if(led&&led.nextSibling)room.insertBefore(q,led.nextSibling);
      else room.appendChild(q);
    }

    q.style.setProperty('display','grid','important');
    q.style.setProperty('visibility','visible','important');
    q.style.setProperty('opacity','1','important');
    q.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    q.style.setProperty('height','29px','important');
    q.style.setProperty('min-height','29px','important');
    q.style.setProperty('max-height','29px','important');
    q.style.setProperty('flex','0 0 29px','important');
    q.style.setProperty('gap','4px','important');
    q.style.setProperty('margin','0','important');
    q.style.setProperty('padding','0','important');

    q.querySelectorAll('button').forEach(function(b){
      b.style.setProperty('display','flex','important');
      b.style.setProperty('align-items','center','important');
      b.style.setProperty('justify-content','center','important');
      b.style.setProperty('height','29px','important');
      b.style.setProperty('min-height','29px','important');
      b.style.setProperty('padding','0 4px','important');
      b.style.setProperty('border','0','important');
      b.style.setProperty('border-radius','9px','important');
      b.style.setProperty('background','#101014','important');
      b.style.setProperty('color','#fff','important');
      b.style.setProperty('font-size','10px','important');
      b.style.setProperty('font-weight','900','important');
      b.style.setProperty('white-space','nowrap','important');
    });

    bind(q);
  }

  function apply(){
    document.querySelectorAll('#screen .kt-guest-hostlike-room[data-kt-room="9"]').forEach(ensure);
  }

  apply();
  [20,80,180,400,900,1600].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,20);setTimeout(apply,120);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,20);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9QuickRestoreTimer20261002);
      window.__ktGuest9QuickRestoreTimer20261002=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();