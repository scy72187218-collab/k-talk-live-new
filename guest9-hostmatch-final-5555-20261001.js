/* K-Talk 9명 승인 게스트 최종 화면 보정 — 5555
   범위: 원격 9명방 게스트 승인 화면만.
   변경: 되돌리기/보물 상자/매치, 3x3 칸 높이, 작은 수익률.
   하단 채팅/사람/장미/선물/공유 및 통신/영상/호스트방은 건드리지 않음. */
(function(){
  if(window.__ktGuest9HostMatchFinal5555_20261001)return;
  window.__ktGuest9HostMatchFinal5555_20261001=true;

  function txt(el){return String(el&&el.textContent||'').replace(/\s+/g,' ');}
  function isNine(root){
    try{
      var room=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"],.kt-prejoin-room-grid,.kt-approved-guest-grid');
      var t=txt(root)+' '+String((window.__ktLastLiveRoom&&window.__ktLastLiveRoom.room_name)||'')+' '+String((window.state&&state.liveRoomName)||'');
      return !!room && (/9\s*명|group9/i.test(t)||root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'));
    }catch(e){return false;}
  }

  function wire(bar){
    if(!bar)return;
    var b=bar.querySelectorAll('button');
    if(b[0]&&!b[0].dataset.ktBound5555){
      b[0].dataset.ktBound5555='1';
      b[0].onclick=function(){
        try{
          if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
          if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        }catch(e){}
      };
    }
    if(b[1]&&!b[1].dataset.ktBound5555){
      b[1].dataset.ktBound5555='1';
      b[1].onclick=function(){
        try{
          if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
          if(typeof window.openTreasure==='function')return window.openTreasure();
          if(typeof window.openGifts==='function')return window.openGifts();
        }catch(e){}
      };
    }
    if(b[2]&&!b[2].dataset.ktBound5555){
      b[2].dataset.ktBound5555='1';
      b[2].onclick=function(){
        try{
          if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
          if(typeof window.openMatch==='function')return window.openMatch();
        }catch(e){}
      };
    }
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9HostMatchFinal5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGuest9HostMatchFinal5555Style';
    s.textContent=''
      +'.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;flex:0 0 35px!important;min-height:35px!important;width:100%!important;position:relative!important;z-index:60!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick button{min-width:0!important;border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;padding:0 3px!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main,.kt-remote-live.kt-g9-final-5555 .kt-prejoin-room-grid,.kt-remote-live.kt-g9-final-5555 .kt-approved-guest-grid{flex:0 0 auto!important;height:calc(100vw - 14px)!important;max-height:calc(100dvh - 410px)!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921,.kt-remote-live.kt-g9-final-5555 .kgh-earn{position:fixed!important;right:8px!important;left:auto!important;bottom:86px!important;width:180px!important;min-width:180px!important;max-width:180px!important;height:52px!important;min-height:52px!important;max-height:52px!important;padding:2px 4px!important;border-radius:9px!important;box-sizing:border-box!important;overflow:hidden!important;z-index:2147482490!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top span,.kt-remote-live.kt-g9-final-5555 .kgh-earn .top span{font-size:6px!important;line-height:1!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top b,.kt-remote-live.kt-g9-final-5555 .kgh-earn .top b{font-size:9px!important;line-height:1!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-detail,.kt-remote-live.kt-g9-final-5555 .kgh-earn-detail{font-size:5.4px!important;line-height:1.05!important;gap:1px 2px!important;margin-top:2px!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick{flex-basis:31px!important;min-height:31px!important;gap:4px!important}.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick button{font-size:10px!important}.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921,.kt-remote-live.kt-g9-final-5555 .kgh-earn{width:164px!important;min-width:164px!important;max-width:164px!important;height:48px!important;min-height:48px!important;max-height:48px!important;right:6px!important;bottom:82px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function ensureQuick(root){
    var hostlike=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]');
    if(hostlike){
      var q=hostlike.querySelector('.kgh-quick');
      if(q){
        q.classList.add('kt-g9-final-quick');
        if(!/보물\s*상자/.test(txt(q))||!/되돌리기/.test(txt(q))||!/매치/.test(txt(q))){
          q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물 상자</button><button type="button">⚔ 매치</button>';
        }
        wire(q);
        return;
      }
    }

    var existing=root.querySelector('.kt-g9-final-quick');
    if(existing){wire(existing);return;}

    var stats=root.querySelector('.kt-prejoin-room-stats,.kt-approved-guest-stats,.kt-guest-room-stats,.kgh-stats');
    var grid=root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid,.kgh-main');
    if(!stats||!grid||!stats.parentNode)return;
    var bar=document.createElement('div');
    bar.className='kt-g9-final-quick';
    bar.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물 상자</button><button type="button">⚔ 매치</button>';
    wire(bar);
    stats.insertAdjacentElement('afterend',bar);
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNine(root)){root.classList.remove('kt-g9-final-5555');return;}
      root.classList.add('kt-g9-final-5555');
      ensureQuick(root);
    });
  }

  apply();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  ['kt-guest-approval-received','kt-any-guest-approved','kt-approved-guest-stream-ready'].forEach(function(name){
    window.addEventListener(name,function(){setTimeout(apply,0);setTimeout(apply,120);});
  });
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9HostMatchFinal5555Timer);
      window.__ktGuest9HostMatchFinal5555Timer=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();