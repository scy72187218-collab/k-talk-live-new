/* 5555 — 승인 직후 화면만 즉시 맞춤. 다른 기능/방은 건드리지 않음. */
(function(){
  if(window.__ktApprovedGuestImmediate5555_20261001)return;
  window.__ktApprovedGuestImmediate5555_20261001=true;

  function style(){
    if(document.getElementById('ktApprovedGuestImmediate5555Style'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestImmediate5555Style';
    s.textContent=''
      +'.kt-remote-live.kt-approved-now-5555 .kt-prejoin-quick-5555{flex:0 0 35px!important;min-height:35px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;z-index:50!important}'
      +'.kt-remote-live.kt-approved-now-5555 .kt-prejoin-quick-5555 button{border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;min-width:0!important}'
      +'.kt-remote-live.kt-approved-now-5555 .kt-prejoin-room-grid{flex:1 1 0!important;min-height:0!important}'
      +'.kt-remote-live.kt-approved-now-5555 #ktAllRoomGuestEarnHud20260921{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-approved-now-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-remote-live.kt-approved-now-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}'
      +'.kt-remote-live.kt-approved-now-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-approved-now-5555 .kt-prejoin-quick-5555{flex-basis:31px!important;min-height:31px!important;gap:4px!important}.kt-remote-live.kt-approved-now-5555 .kt-prejoin-quick-5555 button{font-size:10px!important}.kt-remote-live.kt-approved-now-5555 #ktAllRoomGuestEarnHud20260921{width:72px!important;min-width:72px!important;max-width:72px!important;height:43px!important;max-height:43px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function wire(bar){
    var b=bar.querySelectorAll('button');
    if(b[0])b[0].onclick=function(){try{if(window.leaveBroadcastToDashboard)return window.leaveBroadcastToDashboard();if(window.home)return window.home();}catch(e){}};
    if(b[1])b[1].onclick=function(){try{if(window.openGifts)return window.openGifts();if(window.openTreasure)return window.openTreasure();}catch(e){}};
    if(b[2])b[2].onclick=function(){try{if(window.openHostMatchArena)return window.openHostMatchArena('1대1');if(window.openMatch)return window.openMatch();}catch(e){}};
  }

  function apply(){
    style();
    var root=document.querySelector('.kt-remote-live');
    if(!root)return;
    root.classList.add('kt-approved-now-5555');

    /* hostlike 전환이 아직 안 된 짧은 순간에도 바로 보이게 */
    var stats=root.querySelector('.kt-prejoin-room-stats');
    var grid=root.querySelector('.kt-prejoin-room-grid');
    if(stats&&grid&&!root.querySelector('.kt-prejoin-quick-5555')){
      var bar=document.createElement('div');
      bar.className='kt-prejoin-quick-5555';
      bar.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
      wire(bar);
      stats.insertAdjacentElement('afterend',bar);
    }

    /* 기존 승인 호스트형 화면이 만들어졌으면 동일 3칸 강제 유지 */
    var q=root.querySelector('.kt-guest-hostlike-room .kgh-quick');
    if(q){
      q.style.setProperty('display','grid','important');
      q.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
      wire(q);
    }
  }

  window.addEventListener('kt-guest-approval-received',function(){
    apply();
    [20,60,120,240,500,900,1500].forEach(function(ms){setTimeout(apply,ms);});
  });
})();