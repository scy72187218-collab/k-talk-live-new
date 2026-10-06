/* 5555 — 승인 로스터 감지 시 게스트 대기화면 UI만 즉시 전환.
   범위: 원격 게스트 화면의 3버튼/칸 높이/수익박스만.
   통신, 영상 소스, 승인/퇴장 로직은 절대 변경하지 않음. */
(function(){
  if(window.__ktGuestApprovedRosterUi5555_20261001)return;
  window.__ktGuestApprovedRosterUi5555_20261001=true;

  function viewerId(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      return d?'viewer_'+d:'';
    }catch(e){return '';}
  }
  function isApproved(){
    try{
      var id=viewerId();
      var map=window.__ktApprovedGuestIds20260924||{};
      return !!(id&&map[id]===true);
    }catch(e){return false;}
  }
  function ensureStyle(){
    if(document.getElementById('ktGuestApprovedRosterUi5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGuestApprovedRosterUi5555Style';
    s.textContent=''
      +'.kt-remote-live.kt-approved-roster-5555 .kt-approved-roster-quick-5555{flex:0 0 35px!important;min-height:35px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;position:relative!important;z-index:60!important}'
      +'.kt-remote-live.kt-approved-roster-5555 .kt-approved-roster-quick-5555 button{min-width:0!important;border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;padding:0 3px!important}'
      +'.kt-remote-live.kt-approved-roster-5555 .kt-prejoin-room-grid{flex:1 1 0!important;min-height:0!important}'
      +'.kt-remote-live.kt-approved-roster-5555 #ktAllRoomGuestEarnHud20260921{width:76px!important;min-width:76px!important;max-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important}'
      +'.kt-remote-live.kt-approved-roster-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top span{font-size:4.8px!important;line-height:1!important}'
      +'.kt-remote-live.kt-approved-roster-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-top b{font-size:7px!important;line-height:1!important}'
      +'.kt-remote-live.kt-approved-roster-5555 #ktAllRoomGuestEarnHud20260921 .kt-ge-detail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-approved-roster-5555 .kt-approved-roster-quick-5555{flex-basis:31px!important;min-height:31px!important;gap:4px!important}.kt-remote-live.kt-approved-roster-5555 .kt-approved-roster-quick-5555 button{font-size:10px!important}.kt-remote-live.kt-approved-roster-5555 #ktAllRoomGuestEarnHud20260921{width:72px!important;min-width:72px!important;max-width:72px!important;height:43px!important;max-height:43px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }
  function wire(bar){
    var bs=bar.querySelectorAll('button');
    if(bs[0])bs[0].onclick=function(){try{if(window.leaveBroadcastToDashboard)return window.leaveBroadcastToDashboard();if(window.home)return window.home();}catch(e){}};
    if(bs[1])bs[1].onclick=function(){try{if(window.openGifts)return window.openGifts();if(window.openTreasure)return window.openTreasure();}catch(e){}};
    if(bs[2])bs[2].onclick=function(){try{if(window.openHostMatchArena)return window.openHostMatchArena('1대1');if(window.openMatch)return window.openMatch();}catch(e){}};
  }
  function apply(){
    ensureStyle();
    if(!isApproved())return;
    var root=document.querySelector('.kt-remote-live');
    if(!root)return;
    /* 4444: 15명 구독자 게스트방은 새 전용 화면만 사용. 이 옛 공통 승인 UI는 제외. */
    try{
      var rr=window.__ktLastLiveRoom||{}, rt=[
        rr.room_type,rr.room_name,rr.title,window.__ktRemoteRoomType,window.__ktRemoteRoomName
      ].filter(Boolean).join(' ');
      if(/subscriber|구독자|15\s*명/i.test(rt))return;
    }catch(e){}
    root.classList.add('kt-approved-roster-5555');

    var existing=root.querySelector('.kgh-quick');
    if(existing){
      existing.style.setProperty('display','grid','important');
      existing.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      existing.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
      wire(existing);
      return;
    }

    var stats=root.querySelector('.kt-prejoin-room-stats,.kt-approved-guest-stats,.kt-guest-room-stats');
    var grid=root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid');
    if(!stats||!grid)return;
    var bar=root.querySelector('.kt-approved-roster-quick-5555');
    if(!bar){
      bar=document.createElement('div');
      bar.className='kt-approved-roster-quick-5555';
      bar.innerHTML='<button type="button">↩ 되돌리기</button><button type="button">📦 보물상자</button><button type="button">⚔ 매치</button>';
      wire(bar);
      stats.insertAdjacentElement('afterend',bar);
    }
  }

  ensureStyle();
  setInterval(apply,250);
  window.addEventListener('kt-guest-approval-received',function(){apply();setTimeout(apply,30);setTimeout(apply,120);});
  window.addEventListener('kt-livekit-state',apply);
})();