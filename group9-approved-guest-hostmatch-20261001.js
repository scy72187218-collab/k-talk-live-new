/* K-Talk 2026-10-01 — 5555
   9명방 승인 게스트 화면을 호스트방과 맞춤.
   - 되돌리기 / 패키지 상자 / 매치 3칸 추가
   - 그 줄만큼 게스트 3x3 칸 높이 자연 축소
   - 게스트 수익률 박스를 호스트방처럼 작게
   다른 통신/승인/퇴장/하단 버튼은 변경하지 않음. */
(function(){
  if(window.__ktGroup9ApprovedGuestHostMatch20261001)return;
  window.__ktGroup9ApprovedGuestHostMatch20261001=true;

  function isNineRoom(room){
    if(!room)return false;
    try{
      if(room.getAttribute('data-kt-room')==='9')return true;
      var t=String(room.textContent||'');
      if(/9\s*명\s*방송/.test(t))return true;
      var s=window.state||{};
      return String(s.liveRoomType||'')==='group9'||Number(s.liveRoomMax||0)===9||String(s.liveRoomName||'').indexOf('9명')>-1;
    }catch(e){return false;}
  }

  function hasExactQuick(room){
    try{
      return [].slice.call(room.querySelectorAll('div,nav,section')).some(function(box){
        var direct=[].slice.call(box.children||[]).filter(function(x){return x&&x.tagName==='BUTTON';});
        if(direct.length!==3)return false;
        var t=direct.map(function(b){return String(b.textContent||'').replace(/\s+/g,'');}).join('|');
        return /되돌리기/.test(t)&&/(패키지상자|보물상자)/.test(t)&&/매치/.test(t);
      });
    }catch(e){return false;}
  }

  function wire(bar){
    if(!bar)return;
    var bs=bar.querySelectorAll('button');
    if(bs[0])bs[0].onclick=function(){
      try{
        if(typeof window.leaveBroadcastToDashboard==='function')return window.leaveBroadcastToDashboard();
        if(typeof window.home==='function')return window.home();
      }catch(e){}
    };
    if(bs[1])bs[1].onclick=function(){
      try{
        if(typeof window.openGifts==='function')return window.openGifts();
        if(typeof window.openTreasure==='function')return window.openTreasure();
      }catch(e){}
    };
    if(bs[2])bs[2].onclick=function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    };
  }

  function ensureStyle(){
    if(document.getElementById('ktGroup9ApprovedGuestHostMatchStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktGroup9ApprovedGuestHostMatchStyle20261001';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-quick-5555{flex:0 0 35px!important;min-height:35px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;position:relative!important;z-index:60!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.kt-g9-quick-5555 button{min-width:0!important;border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;padding:0 3px!important}'
      /* 새 줄 때문에 main은 남은 높이만 사용 */
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-main{flex:1 1 0!important;min-height:0!important}'
      /* 원격/게스트 수익박스만 호스트방처럼 작게 */
      +'.kt-remote-live #ktAllRoomGuestEarnHud20260921{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-remote-live #ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-remote-live #ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}'
      +'.kt-remote-live #ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'.kt-guest-hostlike-room .kgh-chat{grid-template-columns:minmax(0,1fr) 76px!important;gap:4px!important}'
      +'.kt-guest-hostlike-room .kgh-earn{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-guest-hostlike-room .kgh-earn .top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-guest-hostlike-room .kgh-earn .top b{font-size:7px!important;line-height:1!important}'
      +'.kt-guest-hostlike-room .kgh-earn-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'@media(max-width:390px){#screen .ktg13-room[data-kt-room="9"]>.kt-g9-quick-5555{flex-basis:31px!important;min-height:31px!important;gap:4px!important}#screen .ktg13-room[data-kt-room="9"]>.kt-g9-quick-5555 button{font-size:10px!important}.kt-remote-live #ktAllRoomGuestEarnHud20260921,.kt-guest-hostlike-room .kgh-earn{width:72px!important;min-width:72px!important;max-width:72px!important;height:43px!important;max-height:43px!important}.kt-guest-hostlike-room .kgh-chat{grid-template-columns:minmax(0,1fr) 72px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function installRoom(room){
    if(!room||!isNineRoom(room))return;
    room.setAttribute('data-kt-room','9');
    if(hasExactQuick(room))return;

    var stats=room.querySelector(':scope > .ktg13-stats')||room.querySelector('.ktg13-stats');
    var main=room.querySelector(':scope > .ktg13-main')||room.querySelector('.ktg13-main');
    if(!stats&&!main)return;

    var bar=document.createElement('div');
    bar.className='kt-g9-quick-5555';
    bar.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
    wire(bar);
    if(stats&&stats.parentNode)stats.insertAdjacentElement('afterend',bar);
    else if(main&&main.parentNode)main.parentNode.insertBefore(bar,main);
  }

  function run(){
    ensureStyle();

    /* 일반 9명방 화면 */
    [].slice.call(document.querySelectorAll('#screen .ktg13-room')).forEach(installRoom);

    /* 승인 게스트 hostlike 화면 */
    [].slice.call(document.querySelectorAll('.kt-remote-live .kt-guest-hostlike-room')).forEach(function(room){
      var root=room.closest('.kt-remote-live');
      var txt=String(room.textContent||'')+' '+String((window.state&&state.liveRoomName)||'');
      if(!/9\s*명|group9/i.test(txt))return;
      var q=room.querySelector('.kgh-quick');
      if(q){
        q.style.setProperty('display','grid','important');
        q.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
        q.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
        wire(q);
      }
      if(root)root.classList.add('kt-g9-approved-5555');
    });
  }

  window.addEventListener('kt-guest-approval-received',function(){[0,20,60,140,300,600].forEach(function(ms){setTimeout(run,ms);});});
  window.addEventListener('kt-any-guest-approved',function(){setTimeout(run,0);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(run,0);});
  run();
  [40,120,260,520,900,1600,2800].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9Approved5555Timer);
      window.__ktG9Approved5555Timer=setTimeout(run,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();