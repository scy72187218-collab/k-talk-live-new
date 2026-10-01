/* K-Talk approved guest 9-room FINAL UI lock — 2026-10-01 — 5555
   Scope: approved guest in 9-person room only.
   Keep video/signaling/approval/exit logic untouched.
   UI:
   - top quick: undo / treasure box / match
   - 3x3 grid sized like host 9-room
   - small earnings box
   - bottom: chat / people / rose / gift / share
*/
(function(){
  if(window.__ktGuest9FinalUi5555_20261001)return;
  window.__ktGuest9FinalUi5555_20261001=true;

  function live(st){
    try{return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}
    catch(e){return false;}
  }
  function viewerId(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      return d?'viewer_'+d:'';
    }catch(e){return '';}
  }
  function rosterApproved(){
    try{
      var id=viewerId(),m=window.__ktApprovedGuestIds20260924||{};
      return !!(id&&m[id]===true);
    }catch(e){return false;}
  }
  function approved(root){
    if(!root)return false;
    if(root.querySelector('.kt-guest-hostlike-room,.kt-approved-guest-room'))return true;
    if(root.classList.contains('kt-approved-now-5555')||root.classList.contains('kt-approved-roster-5555'))return true;
    if(rosterApproved())return true;
    if(live(window.__ktApprovedGuestSelfStream))return true;
    return false;
  }
  function nineRoom(root){
    try{
      var h=root.querySelector('.kt-guest-hostlike-room');
      if(h&&h.getAttribute('data-kt-room')==='9')return true;
      var txt=String(root.textContent||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.title||'')+' '+String(last.room_type||'');
      var s=window.state||{};
      txt+=' '+String(s.liveRoomName||'')+' '+String(s.liveRoomType||'')+' '+String(s.liveRoomMax||'');
      if(/9\s*명|group9/i.test(txt))return true;
      var g=root.querySelector('.kgh-main,.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid');
      if(g){
        var cells=g.querySelectorAll('.kgh-cell,.kt-prejoin-room-cell,.kt-approved-guest-cell,.kt-guest-room-cell');
        if(cells.length===9)return true;
      }
    }catch(e){}
    return false;
  }

  function style(){
    if(document.getElementById('ktGuest9FinalUi5555Style20261001'))return;
    var s=document.createElement('style');
    s.id='ktGuest9FinalUi5555Style20261001';
    s.textContent=''
      +'.kt-remote-live.kt-g9-final-5555 .kgh-quick,.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;flex:0 0 35px!important;min-height:35px!important;width:100%!important;margin:0!important;padding:0!important;position:relative!important;z-index:90!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-quick>button,.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick>button{min-width:0!important;border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;padding:0 3px!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-main,.kt-remote-live.kt-g9-final-5555 .kt-prejoin-room-grid,.kt-remote-live.kt-g9-final-5555 .kt-approved-guest-grid,.kt-remote-live.kt-g9-final-5555 .kt-guest-room-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important;flex:0 0 auto!important;height:min(calc(100vw - 14px),calc(100dvh - 410px))!important;min-height:0!important;max-height:none!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-cell,.kt-remote-live.kt-g9-final-5555 .kt-prejoin-room-cell,.kt-remote-live.kt-g9-final-5555 .kt-approved-guest-cell,.kt-remote-live.kt-g9-final-5555 .kt-guest-room-cell{min-width:0!important;min-height:0!important;width:auto!important;height:auto!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-chat{position:relative!important;display:block!important;flex:0 0 54px!important;height:54px!important;min-height:54px!important;max-height:54px!important;padding:1px 4px 2px!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-chatbox{width:calc(100% - 90px)!important;height:52px!important;max-height:52px!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-earn{position:absolute!important;right:4px!important;left:auto!important;bottom:3px!important;width:82px!important;min-width:82px!important;max-width:82px!important;height:40px!important;min-height:40px!important;max-height:40px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-g9-final-5555 .kgh-earn .top span{font-size:5px!important;line-height:1!important}.kt-remote-live.kt-g9-final-5555 .kgh-earn .top b{font-size:7px!important;line-height:1!important}.kt-remote-live.kt-g9-final-5555 .kgh-earn-detail{font-size:4.7px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921{right:6px!important;left:auto!important;bottom:58px!important;width:82px!important;min-width:82px!important;max-width:82px!important;height:40px!important;min-height:40px!important;max-height:40px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:5px!important;line-height:1!important}.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.7px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'.kt-remote-live.kt-g9-final-5555>.kt-remote-bottom{display:flex!important;align-items:center!important;gap:6px!important;z-index:2147482500!important}'
      +'.kt-remote-live.kt-g9-final-5555>.kt-remote-bottom input{flex:1 1 auto!important;min-width:0!important}'
      +'.kt-remote-live.kt-g9-final-5555>.kt-remote-bottom .kt-remote-action{display:grid!important;flex:0 0 44px!important;width:44px!important;height:44px!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-g9-final-5555 .kgh-quick,.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick{flex-basis:31px!important;min-height:31px!important;gap:4px!important}.kt-remote-live.kt-g9-final-5555 .kgh-quick>button,.kt-remote-live.kt-g9-final-5555 .kt-g9-final-quick>button{font-size:10px!important}.kt-remote-live.kt-g9-final-5555>.kt-remote-bottom{gap:5px!important}.kt-remote-live.kt-g9-final-5555>.kt-remote-bottom .kt-remote-action{width:40px!important;height:40px!important;flex-basis:40px!important}.kt-remote-live.kt-g9-final-5555 .kgh-earn,.kt-remote-live.kt-g9-final-5555 #ktAllRoomGuestEarnHud20260921{width:78px!important;min-width:78px!important;max-width:78px!important;height:39px!important;min-height:39px!important;max-height:39px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function wireQuick(bar){
    if(!bar)return;
    var bs=bar.querySelectorAll('button');
    if(bs[0])bs[0].onclick=function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
      }catch(e){}
    };
    if(bs[1])bs[1].onclick=function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openPackageBox==='function')return window.openPackageBox();
        if(typeof window.openGifts==='function')return window.openGifts();
      }catch(e){}
    };
    if(bs[2])bs[2].onclick=function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    };
  }

  function exactQuick(bar){
    if(!bar)return;
    var wanted='↩ 되돌리기|🎁 보물 상자|⚔ 매치';
    var cur=[].slice.call(bar.querySelectorAll(':scope > button')).map(function(b){return String(b.textContent||'').trim();}).join('|');
    if(cur!==wanted){
      bar.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물 상자</button><button type="button">⚔ 매치</button>';
    }
    wireQuick(bar);
  }

  function ensureQuick(root){
    var q=root.querySelector('.kt-guest-hostlike-room .kgh-quick');
    if(q){exactQuick(q);return;}

    q=root.querySelector('.kt-g9-final-quick');
    if(q){exactQuick(q);return;}

    var stats=root.querySelector('.kt-prejoin-room-stats,.kt-approved-guest-stats,.kt-guest-room-stats');
    if(!stats){
      stats=[].slice.call(root.querySelectorAll('div,section')).find(function(el){
        if(el.closest('.kt-remote-bottom,.kt-remote-chat'))return false;
        var t=String(el.textContent||'').replace(/\s+/g,'');
        return /일일랭킹/.test(t)&&/미션/.test(t)&&/(시청자|함께시청)/.test(t);
      })||null;
    }
    var grid=root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid,.kgh-main');
    if(!grid)return;

    q=document.createElement('div');
    q.className='kt-g9-final-quick';
    q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">🎁 보물 상자</button><button type="button">⚔ 매치</button>';
    wireQuick(q);
    if(stats&&stats.parentNode)stats.insertAdjacentElement('afterend',q);
    else if(grid.parentNode)grid.parentNode.insertBefore(q,grid);
  }

  function people(){
    try{
      if(typeof window.ktRemoteOpenPeople==='function')return window.ktRemoteOpenPeople();
      if(typeof window.openFriends==='function')return window.openFriends();
      if(typeof window.friends==='function')return window.friends();
    }catch(e){}
  }
  function rose(){
    try{
      if(typeof window.ktRemoteSendOneRose==='function')return window.ktRemoteSendOneRose();
      if(typeof window.openGifts==='function')return window.openGifts();
    }catch(e){}
  }
  function gift(){
    try{
      if(typeof window.ktRemoteOpenGifts==='function')return window.ktRemoteOpenGifts();
      if(typeof window.openGifts==='function')return window.openGifts();
    }catch(e){}
  }
  function share(){
    try{
      if(typeof window.ktRemoteShare==='function')return window.ktRemoteShare();
      if(typeof window.shareApp==='function')return window.shareApp();
    }catch(e){}
  }
  function ensureBottom(root){
    var bar=root.querySelector(':scope > .kt-remote-bottom');
    if(!bar)return;
    var input=bar.querySelector('input');
    var value=input?input.value:'';
    var sig=[].slice.call(bar.children).map(function(x){return x.getAttribute&&x.getAttribute('data-kt-g9-final');}).join(',');
    if(bar.dataset.ktG9Final==='1'&&sig.indexOf('people')>-1&&sig.indexOf('rose')>-1&&sig.indexOf('gift')>-1&&sig.indexOf('share')>-1)return;

    bar.innerHTML='<input id="ktRemoteChatInput" maxlength="100" placeholder="입력하세요…" aria-label="라이브 채팅 입력">'
      +'<button type="button" class="kt-remote-action people" data-kt-g9-final="people" aria-label="사람">👥</button>'
      +'<button type="button" class="kt-remote-action rose" data-kt-g9-final="rose" aria-label="장미">🌹</button>'
      +'<button type="button" class="kt-remote-action gift" data-kt-g9-final="gift" aria-label="선물상자">🎁</button>'
      +'<button type="button" class="kt-remote-action share" data-kt-g9-final="share" aria-label="공유">↗</button>';
    bar.dataset.ktG9Final='1';

    input=bar.querySelector('#ktRemoteChatInput');
    if(input){
      input.value=value||'';
      input.addEventListener('keydown',function(e){
        if(e.key==='Enter'){
          e.preventDefault();
          try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(z){}
        }
      });
    }
    var p=bar.querySelector('[data-kt-g9-final="people"]'); if(p)p.onclick=people;
    var r=bar.querySelector('[data-kt-g9-final="rose"]'); if(r)r.onclick=rose;
    var g=bar.querySelector('[data-kt-g9-final="gift"]'); if(g)g.onclick=gift;
    var sh=bar.querySelector('[data-kt-g9-final="share"]'); if(sh)sh.onclick=share;
  }

  function apply(){
    style();
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root||!approved(root)||!nineRoom(root))return;
    root.classList.add('kt-g9-final-5555');
    var hostlike=root.querySelector('.kt-guest-hostlike-room');
    if(hostlike)hostlike.setAttribute('data-kt-room','9');
    ensureQuick(root);
    ensureBottom(root);
  }

  window.addEventListener('kt-guest-approval-received',function(){[0,40,120,300,700].forEach(function(ms){setTimeout(apply,ms);});});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,20);});
  window.addEventListener('kt-any-guest-approved',function(){setTimeout(apply,20);});
  window.addEventListener('kt-livekit-state',function(){setTimeout(apply,20);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  [80,220,600,1200,2500].forEach(function(ms){setTimeout(apply,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9FinalUiTimer5555);
      window.__ktGuest9FinalUiTimer5555=setTimeout(apply,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();