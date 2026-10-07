/* K-Talk: 승인된 게스트 화면을 호스트의 9/13명방 화면처럼 한 화면으로 표시. 다른 방/기능 변경 없음. */
(function(){
  /* KT_GUEST_FIRST_PAGE_NO_ATTENDANCE_20261007: 게스트 첫 페이지는 모든 방에서 출석체크 숨김, 호스트만 유지 */
  function hideGuestAttendance20261007(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing')&&!document.querySelector('.kt-remote-live,.kt-guest-hostlike-room'))return;
      document.querySelectorAll('.kt-remote-live [class*="attend"],.kt-remote-live [class*="attendance"],.kt-remote-live [id*="Attend"],.kt-remote-live [id*="Attendance"],.kt-guest-hostlike-room [class*="attend"],.kt-guest-hostlike-room [class*="attendance"],.kt-guest-hostlike-room [id*="Attend"],.kt-guest-hostlike-room [id*="Attendance"]').forEach(function(x){x.style.setProperty('display','none','important');});
    }catch(e){}
  }
  setTimeout(hideGuestAttendance20261007,0);setTimeout(hideGuestAttendance20261007,120);setInterval(hideGuestAttendance20261007,500);
  try{new MutationObserver(function(){setTimeout(hideGuestAttendance20261007,0);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}

  if(window.__ktApprovedGuestMatchHostRoom20260918)return;
  window.__ktApprovedGuestMatchHostRoom20260918=true;

  var builtRoot=null;
  var hostVideo=null;
  var selfVideo=null;
  var hostStream=null;
  var selfStream=null;
  var guestEarnRoses=0;
  /* Do not build the guest self slot until a real approval signal arrives.
     This prevents an old/prewarmed camera stream from appearing as '나 · 게스트'
     before the viewer has even requested or been approved for guest participation. */
  var approvalActive=false;

  function ktIsSecretRemoteReset20261004(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var r=window.__ktLastLiveRoom||{};
      var t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }

  function localViewerId20260924(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      return d?'viewer_'+d:'';
    }catch(e){return '';}
  }
  function approvedByRealtimeRoster20260924(){
    try{
      var id=localViewerId20260924();
      var map=window.__ktApprovedGuestIds20260924||{};
      return !!(id&&map[id]===true);
    }catch(e){return false;}
  }
  function forceApprovedGridNow20260924(){
    if(ktIsSecretRemoteReset20261004())return false;
    if(!approvedByRealtimeRoster20260924()&&!approvalActive)return false;
    approvalActive=true;
    repair();
    [15,40,90,180].forEach(function(ms){setTimeout(repair,ms);});
    return true;
  }
  window.ktForceApprovedGuestGridNow20260924=forceApprovedGridNow20260924;

  function live(st){
    try{
      var ts=st&&st.getVideoTracks?st.getVideoTracks():[];
      return !!(ts&&ts.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }
  function sameVideoSource20260926(a,b){
    if(!a||!b)return false;
    if(a===b)return true;
    try{
      var at=a.getVideoTracks&&a.getVideoTracks()[0];
      var bt=b.getVideoTracks&&b.getVideoTracks()[0];
      return !!(at&&bt&&at.id&&bt.id&&at.id===bt.id);
    }catch(e){return false;}
  }
  function isRemoteHostStream20260926(st){
    if(!st)return false;
    try{
      var list=[window.__ktRemoteHostStream,window.__ktLastApprovedGuestHostStream,hostStream];
      for(var i=0;i<list.length;i++)if(sameVideoSource20260926(st,list[i]))return true;
    }catch(e){}
    return false;
  }

  function guestEarnRate(){
    try{
      var saved=localStorage.getItem('ktalk_member_type');
      if(saved==='subscriber')return {rate:.40,label:'구독자 · 40%'};
    }catch(e){}
    try{
      if(window.state&&(state.memberType==='subscriber'||state.subscribed===true||state.subscriptionActive===true)){
        return {rate:.40,label:'구독자 · 40%'};
      }
    }catch(e){}
    return {rate:.35,label:'일반회원 · 35%'};
  }
  function guestEarnMoney(){
    var r=guestEarnRate();
    return Math.round(guestEarnRoses*30*r.rate).toLocaleString('ko-KR')+'원';
  }
  function updateGuestEarnHud(){
    var a=document.getElementById('ktGuestEarnNet');
    var b=document.getElementById('ktGuestEarnRoses');
    var c=document.getElementById('ktGuestEarnRate');
    var r=guestEarnRate();
    if(a)a.textContent=guestEarnMoney();
    if(b)b.textContent='🌹 '+guestEarnRoses.toLocaleString('ko-KR')+'송이';
    if(c)c.textContent=r.label;
  }
  window.ktGuestAddEarnedRoses=function(count){
    var n=parseInt(count,10)||0;
    if(n<=0)return;
    guestEarnRoses+=n;
    updateGuestEarnHud();
  };
  window.ktGuestToggleEarnings=function(){
    var d=document.getElementById('ktGuestEarnDetail');
    if(!d)return;
    d.style.display=d.style.display==='none'?'grid':'none';
  };

  function roomInfo(root){
    var txt='';
    try{
      var meta=root&&root.querySelector('.kt-remote-meta');
      txt=String(meta&&meta.textContent||root&&root.textContent||'');
    }catch(e){}
    /* 13명방은 게스트 기기에서 메타 문구가 늦게 붙어도 9칸으로 떨어지지 않게
       현재 선택된 방송 메타까지 같이 확인한다. */
    try{
      var r=window.__ktLastLiveRoom||{};
      txt+=' '+String(r.room_name||'')+' '+String(r.title||'')+' '+String(r.room_type||'');
    }catch(e){}
    try{
      txt+=' '+String(window.__ktRemoteRoomName||'')+' '+String(window.__ktRemoteRoomType||'');
    }catch(e){}
    /* 4444: 구독자 15명방은 이 공통 게스트 렌더러가 시작 화면을 가로채지 않는다. */
    if(/16\s*명|15\s*명|subscriber|구독자/i.test(txt))return null;
    var is16=false;
    var is13=/13\s*명|group13/i.test(txt);
    if(!is13)return null;
    return {
      is15:is16,
      is16:is16,
      is13:is13,
      total:is16?16:13,
      gridTotal:is16?16:13,
      label:is16?'15명 방송':'13명 방송'
    };
  }

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestMatchHostRoomStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestMatchHostRoomStyle';
    s.textContent=''
      +'.kt-remote-live.kt-guest-hostlike-active{display:block!important;padding:0!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-guest-hostlike-active> :not(.kt-guest-hostlike-room):not(.kt-remote-chat):not(.kt-remote-bottom):not(.kt-remote-leave-fixed-1150617){display:none!important}'
      +'.kt-guest-hostlike-room{width:100%;height:100dvh;min-height:620px;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(62px + env(safe-area-inset-bottom));gap:4px}'
      +'.kgh-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 12px}'
      +'.kgh-air{font-weight:950;line-height:1.05}.kgh-air strong{display:block;font-size:20px;white-space:nowrap}.kgh-air strong i{font-style:normal;color:#ff2e67}.kgh-air small{display:block;margin-top:5px;color:#fff;font-size:12px;font-weight:900;white-space:nowrap}.kgh-air small i{font-style:normal;color:#ff315f}.kgh-live-heart{display:inline-flex;align-items:center;gap:3px;margin-left:5px;padding:1px 6px;border:1px solid #b83d79;border-radius:12px;color:#fff}.kgh-live-heart b{color:#ff4b9b}.kgh-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.kgh-attend{justify-self:center;min-width:132px;height:43px;padding:0 14px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:18px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;white-space:nowrap}'
      +'.kgh-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}'
      +'.kgh-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:kghMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.kgh-led-track span{display:inline-block;padding-right:80px}.kgh-led-track b{color:#ff59c9}@keyframes kghMarquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}'
      +'.kgh-quick{flex:0 0 35px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.kgh-quick button{border:0;border-radius:11px;background:#101014;color:#fff;font-size:11px;font-weight:900}'
      +'.kgh-stats{flex:0 0 47px;display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:7px}.kgh-stats button,.kgh-viewers{border:0;border-radius:14px;background:#111114;color:#fff;font-size:15px;font-weight:950;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;overflow:hidden}'
      +'.kgh-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:2px;overflow:hidden}.kgh-main.is13{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}.kgh-main.is13 .kgh-cell:nth-child(13){grid-column:4!important}.kt-guest-hostlike-room[data-kt-room="13"] .kgh-main.is13>.kgh-cell:last-child{grid-column:4!important;grid-row:auto!important}.kgh-main.is15,.kgh-main.is16{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}.kgh-main.is15 .kgh-cell.host,.kgh-main.is16 .kgh-cell.host{grid-column:1!important;grid-row:1/span 2!important}'
      +'.kgh-cell{position:relative;display:grid;place-items:center;min-width:0;min-height:0;border:1px solid #28282d;border-radius:7px;background:linear-gradient(145deg,#17181b,#111214);color:#bdbdc4;font-size:13px;font-weight:900;overflow:hidden}'
      +'.kgh-cell video{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;object-fit:cover!important;object-position:center center!important;background:#111}'
      +'.kgh-cell.host video{transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important}.kgh-cell.self video{left:0!important;top:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important}.kgh-cell.self{outline:2px solid #61d9ff;outline-offset:-2px}'
      +'.kgh-label{position:absolute;left:7px;bottom:6px;z-index:3;padding:3px 7px;border-radius:10px;background:#111d;color:#fff;font-size:10px;font-weight:950}'
      +'.kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom{display:flex!important;z-index:80!important}.kt-remote-live.kt-guest-hostlike-active .kt-remote-chat{display:flex!important;position:absolute!important;z-index:79!important;bottom:68px!important;max-height:78px!important;left:auto!important;right:8px!important;width:46%!important;max-width:46%!important}'
      +'.kgh-chat{flex:0 0 74px;position:relative;overflow:hidden;background:#000;display:grid;grid-template-columns:38% minmax(0,1fr);gap:7px;align-items:end;padding:1px 6px 2px}.kgh-chatbox{grid-column:2!important;width:100%!important;height:74px;max-height:74px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;font-size:11px;font-weight:850;line-height:1.35;color:#fff}.kgh-earn{grid-column:1!important}'
      +'.kgh-earn{position:static!important;right:auto!important;bottom:auto!important;z-index:6;width:100%!important;height:64px;border:1px solid #d2a936;border-radius:10px;background:linear-gradient(135deg,#17140be8,#0d0d12e8);color:#fff;padding:2px 6px;text-align:center;overflow:hidden;align-self:end}.kgh-earn .top{display:flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap}.kgh-earn .top span{font-size:8px;color:#8fe8ff;font-weight:950}.kgh-earn .top b{font-size:12px;color:#ffe071}.kgh-earn-detail{display:grid;grid-template-columns:1fr auto;gap:1px 4px;margin-top:2px;font-size:7px;color:#ddd;white-space:nowrap}'
      +'.kgh-tools{display:none!important}.kgh-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;font-size:9px;display:grid;justify-items:center;gap:2px}.kgh-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px;box-shadow:inset 0 0 13px #ffffff08}.kgh-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.kt-guest-hostlike-room{padding-left:4px;padding-right:4px;gap:3px}.kgh-head{flex-basis:58px;padding:4px 8px}.kgh-air strong{font-size:17px}.kgh-air small{font-size:10px}.kgh-brand{font-size:17px}.kgh-attend{min-width:108px;height:38px;font-size:15px;padding:0 8px}.kgh-led{flex-basis:50px}.kgh-led-track{font-size:20px}.kgh-quick{flex-basis:31px}.kgh-stats{flex-basis:42px;gap:4px}.kgh-stats button,.kgh-viewers{font-size:12px}.kgh-cell{font-size:11px}.kgh-chat{flex-basis:70px;grid-template-columns:40% minmax(0,1fr);gap:5px;padding-left:3px;padding-right:3px}.kgh-chatbox{height:70px;max-height:70px;font-size:9px}.kgh-earn{height:62px}.kgh-tools{flex-basis:48px}.kgh-tool i{width:32px;height:32px;font-size:16px}}';
    document.head.appendChild(s);
  }

  function safeAction(name,arg){
    return function(){
      try{
        if(typeof window[name]==='function'){
          if(arguments.length)return window[name].apply(window,arguments);
          return arg===undefined?window[name]():window[name](arg);
        }
      }catch(e){}
    };
  }

  function makeTool(icon,label,fn){
    var b=document.createElement('button');
    b.className='kgh-tool';
    b.type='button';
    b.innerHTML='<i>'+icon+'</i><span>'+label+'</span>';
    if(fn)b.addEventListener('click',fn);
    return b;
  }

  function makeCell(cls,label){
    var d=document.createElement('div');
    d.className='kgh-cell '+(cls||'');
    if(label){
      var l=document.createElement('span');
      l.className='kgh-label';
      l.textContent=label;
      d.appendChild(l);
    }else{
      d.textContent='게스트';
    }
    return d;
  }

  function build(root){
    if(!root||!approvalActive)return;
    var info=roomInfo(root);
    if(!info)return;
    if(root.querySelector('.kt-guest-hostlike-room'))return;

    var main=document.getElementById('ktRemoteLiveVideo');
    var preview=document.getElementById('ktRemoteHostPreview');
    if(!main&&!preview)return;

    ensureStyle();

    var mainStream=main&&main.srcObject||null;
    var previewStream=preview&&preview.srcObject||null;
    var approvedSelf=null;
    try{
      approvedSelf=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;
    }catch(e){}

    /* Approval must switch screens immediately. The old code waited until both
       host + self streams were already live, which left the viewer in the
       one-person screen for several seconds. Build the room shell as soon as
       approval arrives and attach each stream when it becomes ready. */
    var hostCandidate=null;
    var candidates=[
      window.__ktRemoteHostStream,
      window.__ktLastApprovedGuestHostStream,
      previewStream,
      hostStream,
      mainStream
    ];
    for(var ci=0;ci<candidates.length;ci++){
      var s=candidates[ci];
      if(!s||!live(s))continue;
      /* Object identity is not enough: two MediaStream objects can wrap the
         same video track. Never use the local guest camera as the host. */
      if(approvedSelf&&sameVideoSource20260926(s,approvedSelf))continue;
      var localGuest=null;
      try{localGuest=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}
      if(localGuest&&sameVideoSource20260926(s,localGuest))continue;
      hostCandidate=s;break;
    }

    /* Approval changes the layout immediately. A missing stream reference is
       temporary and must not keep the device in the old one-person view. */
    var selfCandidate=null;
    if(approvedSelf&&live(approvedSelf)&&!isRemoteHostStream20260926(approvedSelf)&&!sameVideoSource20260926(approvedSelf,hostCandidate)){
      selfCandidate=approvedSelf;
    }else if(approvedSelf&&isRemoteHostStream20260926(approvedSelf)){
      /* Never recycle the host receive stream as the guest's local camera. */
      try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
      approvedSelf=null;
    }

    if(hostCandidate){
      hostStream=hostCandidate;
      window.__ktLastApprovedGuestHostStream=hostCandidate;
    }
    selfStream=selfCandidate||selfStream||null;
    if(selfStream&&hostStream&&sameVideoSource20260926(selfStream,hostStream))selfStream=null;

    /* Reuse the visible remote video even while its MediaStream reference is
       being refreshed; do not delay the approved grid for that refresh. */
    if(preview&&hostCandidate&&previewStream===hostCandidate){
      hostVideo=preview;
    }else if(main&&(!hostCandidate||mainStream===hostCandidate)){
      hostVideo=main;
    }else if(preview){
      hostVideo=preview;
    }else{
      hostVideo=document.createElement('video');
    }

    if(main&&main!==hostVideo&&selfCandidate&&mainStream===selfCandidate){
      selfVideo=main;
    }else{
      selfVideo=document.createElement('video');
    }

    root.querySelectorAll('.kt-approved-guest-led,.kt-approved-guest-stats,.kt-approved-guest-grid,.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(x){try{x.remove();}catch(e){}});
    root.classList.remove('kt-approved-guest-room','kt-prejoin-room-view');
    root.classList.add('kt-guest-hostlike-active');

    var room=document.createElement('section');
    room.className='kt-guest-hostlike-room';
    room.setAttribute('data-kt-room',info.is16?'16':'13');

    var head=document.createElement('div');
    head.className='kgh-head';
    head.innerHTML='<div class="kgh-air"><strong><i>●</i> '+info.label+'</strong><small><i>● ON AIR</i> <span class="kgh-clock">00:00:00</span>'+(info.is16?' <span class="kgh-live-heart"><b>♥</b><span class="kgh-live-heart-count">0</span></span>':'')+'</small></div>'
      +'<button class="kgh-attend" type="button">🌹 출석체크</button><div class="kgh-brand">K-Talk LIVE</div>';
    var attend=head.querySelector('.kgh-attend');
    attend.addEventListener('click',function(){try{if(window.ktAttendanceCheck)window.ktAttendanceCheck();}catch(e){}});

    var led=document.createElement('div');
    led.className='kgh-led';
    led.innerHTML='<div class="kgh-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div>';

    var quick=document.createElement('div');
    quick.className='kgh-quick';
    quick.innerHTML='<button type="button" class="kgh-undo-btn">↩ 되돌리기</button><button type="button" class="kgh-treasure-btn">🎁 보물 상자</button><button type="button" class="kgh-match-btn">⚔ 매치</button>';
    var undoBtn=quick.querySelector('.kgh-undo-btn');
    var treasureBtn=quick.querySelector('.kgh-treasure-btn');
    var matchBtn=quick.querySelector('.kgh-match-btn');
    if(undoBtn)undoBtn.onclick=function(){
      try{
        if(typeof window.ktUndoLastSeatMove==='function')return window.ktUndoLastSeatMove();
        if(typeof window.ktUndoLastAction==='function')return window.ktUndoLastAction();
        if(typeof window.undoLastSeatMove==='function')return window.undoLastSeatMove();
      }catch(e){}
    };
    if(treasureBtn)treasureBtn.onclick=function(){
      try{
        if(typeof window.openTreasureBox==='function')return window.openTreasureBox();
        if(typeof window.openTreasure==='function')return window.openTreasure();
        if(typeof window.openPackageBox==='function')return window.openPackageBox();
        if(typeof window.openGifts==='function')return window.openGifts();
      }catch(e){}
    };
    if(matchBtn)matchBtn.onclick=function(){
      try{
        if(typeof window.openHostMatchArena==='function')return window.openHostMatchArena('1대1');
        if(typeof window.openMatch==='function')return window.openMatch();
      }catch(e){}
    };

    var stats=document.createElement('div');
    stats.className='kgh-stats';
    stats.innerHTML='<button type="button">🔥 일일 랭킹</button><button type="button">🎯 미션</button><div class="kgh-viewers">시청자 '+(info.is16?15:info.total)+'명이 시청중 🏃</div>';

    var grid=document.createElement('div');
    grid.className='kgh-main'+(info.is16?' is16':' is13');
    var hostCell=makeCell('host','호스트');
    var selfCell=makeCell('self','나 · 게스트');

    hostVideo.id='ktRemoteHostPreview';
    hostVideo.className='';
    hostVideo.autoplay=true;
    hostVideo.playsInline=true;
    hostVideo.muted=true;
    hostVideo.defaultMuted=true;
    hostVideo.setAttribute('autoplay','');
    hostVideo.setAttribute('playsinline','');
    hostVideo.setAttribute('muted','');
    hostVideo.style.cssText='';
    if(hostCandidate&&hostVideo.srcObject!==hostCandidate)hostVideo.srcObject=hostCandidate;

    selfVideo.id='ktRemoteLiveVideo';
    selfVideo.className='';
    selfVideo.autoplay=true;
    selfVideo.playsInline=true;
    selfVideo.muted=true;
    selfVideo.style.cssText='';
    if(selfCandidate)selfVideo.srcObject=selfCandidate;

    hostCell.appendChild(hostVideo);
    selfCell.appendChild(selfVideo);
    grid.appendChild(hostCell);
    grid.appendChild(selfCell);
    for(var i=2;i<(info.gridTotal||info.total);i++)grid.appendChild(makeCell('',''));

    var chat=document.createElement('div');
    chat.className='kgh-chat';
    var chatbox=document.createElement('div');
    chatbox.className='kgh-chatbox';
    /* Do not show the approval/system lines directly under the people grid.
       Put them into the real bottom chat area so messages start above the input. */
    chatbox.innerHTML='';
    chat.appendChild(chatbox);
    var earn=document.createElement('button');
    earn.type='button';
    earn.className='kgh-earn';
    earn.id='ktGuestEarnHud';
    earn.onclick=window.ktGuestToggleEarnings;
    earn.innerHTML='<div class="top"><span>🔒 내 수익 · 본인만 표시</span><b id="ktGuestEarnNet">0원</b></div>'
      +'<div id="ktGuestEarnDetail" class="kgh-earn-detail"><span id="ktGuestEarnRoses">🌹 0송이</span><span id="ktGuestEarnRate">일반회원 · 35%</span></div>';
    chat.appendChild(earn);
    setTimeout(updateGuestEarnHud,0);

    var tools=document.createElement('div');
    tools.className='kgh-tools';
    tools.appendChild(makeTool('🔗','매치',function(){try{if(window.openHostMatchArena)window.openHostMatchArena('1대1');}catch(e){}}));
    tools.appendChild(makeTool('👥','친구',safeAction('shareApp')));
    tools.appendChild(makeTool('💬','메시지',function(){try{var inp=document.querySelector('.kt-remote-chat input, .kt-remote-bottom input');if(inp){inp.focus();return;}if(window.ktGroup13OpenMessage)window.ktGroup13OpenMessage();}catch(e){}}));
    tools.appendChild(makeTool('🌹','장미',function(){try{if(window.openGifts)window.openGifts();}catch(e){}}));
    tools.appendChild(makeTool('🎁','선물',function(){try{if(window.openGifts)window.openGifts();}catch(e){}}));
    tools.appendChild(makeTool('↗','공유',safeAction('shareApp')));
    tools.appendChild(makeTool('🪄','효과',function(){try{if(window.openEditEffectPanel)window.openEditEffectPanel();else if(window.ktGroup13Effect)window.ktGroup13Effect();}catch(e){}}));
    tools.appendChild(makeTool('•••','더보기',function(){try{if(window.openLiveSettings)window.openLiveSettings();else if(window.ktGroup13More)window.ktGroup13More();}catch(e){}}));

    room.appendChild(head);
    room.appendChild(led);
    room.appendChild(stats);
    room.appendChild(quick);
    room.appendChild(grid);
    room.appendChild(chat);
    room.appendChild(tools);
    root.appendChild(room);

    /* Approved 9-room: first system lines belong to the bottom chat, not under the grid. */
    try{
      var bottomChat=root.querySelector(':scope > .kt-remote-chat')||root.querySelector('.kt-remote-chat');
      if(bottomChat&&!bottomChat.dataset.ktApprovalIntroMoved20261002){
        bottomChat.dataset.ktApprovalIntroMoved20261002='1';
        var msgs=[
          '<span style="color:#ffe071">● K-톡 태권1님이 들어왔습니다.</span>'
        ];
        msgs.forEach(function(html){
          var d=document.createElement('div');
          d.innerHTML=html;
          bottomChat.appendChild(d);
        });
        bottomChat.style.setProperty('display','flex','important');
        bottomChat.style.setProperty('flex-direction','column','important');
        bottomChat.style.setProperty('justify-content','flex-end','important');
        bottomChat.style.setProperty('overflow','hidden','important');
      }
    }catch(e){}

    builtRoot=root;

    try{var p=hostVideo.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    if(selfCandidate){
      try{var q=selfVideo.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
      try{window.__ktApprovedGuestSelfStream=selfCandidate;}catch(e){}
    }

    var start=Date.now();
    var clock=room.querySelector('.kgh-clock');
    var heartCount=room.querySelector('.kgh-live-heart-count');
    if(info.is16){try{root.querySelectorAll('.kt-remote-chat .kt-live-clock-heart,.kt-remote-chat .kt-attendance-heart-badge,.kt-remote-chat .heart,.kt-remote-bottom .kt-live-clock-heart,.kt-remote-bottom .kt-attendance-heart-badge,.kt-remote-bottom .heart').forEach(function(x){x.remove();});}catch(e){}}
    setInterval(function(){
      if(!document.documentElement.contains(room))return;
      var sec=Math.max(0,Math.floor((Date.now()-start)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      if(clock)clock.textContent=h+':'+m+':'+s;
      if(heartCount){var n=0;try{n=Number((window.__ktLastLiveRoom||{}).heart_count||(window.__ktLastLiveRoom||{}).likes||(window.__ktLastLiveRoom||{}).like_count||0)||0;}catch(e){}heartCount.textContent=n;}
    },1000);
  }

  function forceLast13GuestBottomRight20261004(root){
    try{
      if(!root)return;
      var grid=root.querySelector('.kt-guest-hostlike-room[data-kt-room="13"] .kgh-main.is13');
      if(!grid)return;
      var cells=[].slice.call(grid.querySelectorAll(':scope > .kgh-cell'));
      if(!cells.length)return;
      var last=cells[cells.length-1];
      if(!last)return;
      last.style.setProperty('grid-column','4','important');
      last.style.setProperty('grid-row','4','important');
    }catch(e){}
  }

  function removeGuest13ChatHeart20261004(root){
    try{
      if(!root)return;
      var room=root.querySelector('.kt-guest-hostlike-room[data-kt-room="13"]');
      if(!room)return;

      /* 13명방 게스트 화면 하단의 하트 0만 제거한다.
         호스트 방/다른 방/전광판 하트는 건드리지 않는다. */
      root.querySelectorAll(
        '.kt-remote-chat .kt-live-clock-heart,'+
        '.kt-remote-chat .kt-attendance-heart-badge,'+
        '.kt-remote-chat .kt-remote-action.heart,'+
        '.kt-remote-chat .heart,'+
        '.kt-remote-bottom .kt-live-clock-heart,'+
        '.kt-remote-bottom .kt-attendance-heart-badge,'+
        '.kt-remote-bottom .heart'
      ).forEach(function(el){try{el.remove();}catch(e){}});

      [].slice.call(root.querySelectorAll('*')).forEach(function(el){
        try{
          if(!el||el.children.length)return;
          if(el.closest&&el.closest('.kgh-led,.kgh-head,.kgh-stats'))return;
          var t=String(el.textContent||'').replace(/\s+/g,'').trim();
          if(!/^[♥♡❤💗]0$/.test(t))return;
          var r=el.getBoundingClientRect();
          if(r&&r.top>window.innerHeight*0.58){
            el.remove();
          }
        }catch(e){}
      });
    }catch(e){}
  }

  function repair(){
    if(ktIsSecretRemoteReset20261004())return;
    try{
      if(window.__ktUseSingleG9ViewerHostCopy20261003){
        var r9=document.querySelector('.kt-remote-live');
        if(r9){
          var i9=roomInfo(r9);
          if(i9&&i9.total===9)return;
        }
      }
      var preRoot=document.querySelector('.kt-remote-live');
      var preInfo=preRoot?roomInfo(preRoot):null;
      if(window.__ktApprovedUsePrejoinLayout20261002&&typeof window.ktApplyApprovedPrejoinLayout20261002==='function'&&!(preInfo&&preInfo.is13)){
        window.ktApplyApprovedPrejoinLayout20261002();
        return;
      }
      var root=preRoot;
      removeGuest13ChatHeart20261004(root);
      forceLast13GuestBottomRight20261004(root);
      if(!root){builtRoot=null;return;}
      var room=root.querySelector('.kt-guest-hostlike-room');
      if(room){
        /* 기존 연결 스트림이 바뀌어도 두 영상만 유지 */
        var hostCell=room.querySelector('.kgh-cell.host');
        var hv=hostCell&&hostCell.querySelector('video');
        var sv=room.querySelector('.kgh-cell.self video');
        var candidates=[window.__ktRemoteHostStream,window.__ktLastApprovedGuestHostStream,hostStream];
        var trueHost=null;
        for(var ci=0;ci<candidates.length;ci++){
          var hc=candidates[ci];
          if(!hc||!live(hc))continue;
          if(selfStream&&sameVideoSource20260926(hc,selfStream))continue;
          var localSelf=null;
          try{localSelf=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}
          if(localSelf&&sameVideoSource20260926(hc,localSelf))continue;
          trueHost=hc;break;
        }
        if(trueHost){
          hostStream=trueHost;
          window.__ktLastApprovedGuestHostStream=trueHost;
        }
        if(!hv&&hostCell&&hostStream&&live(hostStream)){
          hv=document.createElement('video');
          hv.autoplay=true;hv.playsInline=true;hv.muted=false;
          hostCell.appendChild(hv);
        }
        if(hv&&hostStream&&live(hostStream)){
          if(hv.srcObject!==hostStream)hv.srcObject=hostStream;
          if(hv.paused){try{var hp=hv.play();if(hp&&hp.catch)hp.catch(function(){});}catch(e){}}
        }
        var latestSelf=null;
        try{latestSelf=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}
        if(latestSelf&&live(latestSelf)&&!isRemoteHostStream20260926(latestSelf)&&!sameVideoSource20260926(latestSelf,hostStream)){
          selfStream=latestSelf;
        }else if(latestSelf&&isRemoteHostStream20260926(latestSelf)){
          try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
          if(sameVideoSource20260926(selfStream,latestSelf))selfStream=null;
        }
        if(selfStream&&hostStream&&sameVideoSource20260926(selfStream,hostStream))selfStream=null;
        if(sv&&selfStream&&live(selfStream)&&sv.srcObject!==selfStream){
          sv.srcObject=selfStream;
          try{var sp=sv.play();if(sp&&sp.catch)sp.catch(function(){});}catch(e){}
        }
        if(sv&&hostStream&&sameVideoSource20260926(sv.srcObject,hostStream)){
          try{sv.pause();}catch(e){}
          try{sv.srcObject=null;}catch(e){}
        }
        if(sv){
          try{
            sv.style.setProperty('transform','scaleX(-1)','important');
            sv.style.setProperty('-webkit-transform','scaleX(-1)','important');
          }catch(e){}
        }
        if(selfStream&&live(selfStream))window.__ktApprovedGuestSelfStream=selfStream;
        return;
      }
      build(root);
    }catch(e){}
  }

  window.addEventListener('kt-guest-approval-received',function(){
    approvalActive=true;
    /* Switch to the multi-person room immediately, before camera negotiation ends. */
    repair();
    [20,60,120,220,400,700].forEach(function(ms){setTimeout(repair,ms);});
  });
  window.addEventListener('kt-approved-guest-stream-ready',function(){
    if(!approvalActive)return;
    repair();
    setTimeout(repair,40);
  });
  window.addEventListener('kt-livekit-state',function(){
    if(!approvalActive&&!approvedByRealtimeRoster20260924())return;
    forceApprovedGridNow20260924();
  });
  window.addEventListener('kt-any-guest-approved',function(){
    forceApprovedGridNow20260924();
  });
  window.addEventListener('kt-three-person-sync-now',function(){
    forceApprovedGridNow20260924();
  });

  function clearApprovedViewForFreshRoom(){
    approvalActive=false;
    try{
      var root=document.querySelector('.kt-remote-live');

      /* 9명방은 신호 재연결/호스트 상태 갱신 때 방 화면 자체를 절대 지우지 않는다.
         기존 코드는 여기서 ktRemoteLiveVideo를 방 밖으로 꺼내고 room을 remove해서
         일부 기기가 다시 사람 전체 화면으로 튀었다. */
      if(root){
        var keep9=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]');
        if(keep9){
          try{
            var selfCell=keep9.querySelector('.kgh-cell.self');
            if(selfCell){
              var sv=selfCell.querySelector('video');
              if(sv){try{sv.pause();}catch(e){}try{sv.srcObject=null;}catch(e){}}
              selfCell.classList.remove('self');
              selfCell.innerHTML='<span class="kgh-label">게스트</span>';
            }
            root.classList.remove('kt-approved-guest-room','kt-prejoin-room-view');
            root.classList.add('kt-guest-hostlike-active');
            selfVideo=null;selfStream=null;
            try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
          }catch(e){}
          return;
        }
      }

      if(!root){
        selfVideo=null;hostVideo=null;selfStream=null;builtRoot=null;
        try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
        return;
      }
      var room=root.querySelector('.kt-guest-hostlike-room');
      if(!room){
        root.classList.remove('kt-guest-hostlike-active','kt-approved-guest-room');
        selfVideo=null;hostVideo=null;selfStream=null;builtRoot=null;
        try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
        return;
      }
      var main=room.querySelector('#ktRemoteLiveVideo')||document.getElementById('ktRemoteLiveVideo');
      var trueHost=null;
      var candidates=[window.__ktRemoteHostStream,window.__ktLastApprovedGuestHostStream,hostStream];
      for(var i=0;i<candidates.length;i++){if(candidates[i]&&live(candidates[i])){trueHost=candidates[i];break;}}
      if(main){
        try{main.srcObject=trueHost||null;}catch(e){}
        main.muted=true;main.autoplay=true;main.playsInline=true;
        try{delete main.dataset.ktLocalGuestView;delete main.dataset.ktStableGuestStyle;}catch(e){}
        try{root.insertBefore(main,root.firstChild);}catch(e){try{root.appendChild(main);}catch(_e){}}
        if(trueHost){try{var p=main.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
      }
      var preview=document.getElementById('ktRemoteHostPreview');
      if(preview&&preview!==main){try{preview.remove();}catch(e){}}
      try{room.remove();}catch(e){}
      root.classList.remove('kt-guest-hostlike-active','kt-approved-guest-room');
      selfVideo=null;hostVideo=null;selfStream=null;builtRoot=null;
      try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
    }catch(e){}
  }

  window.addEventListener('kt-host-session-reset',clearApprovedViewForFreshRoom);

  /* Do NOT tear down an already-approved 3-person room just because the same
     host is selected/refreshed again. That old listener was clearing the self
     stream and sending one guest back to the single-person screen. Only a real
     host change may reset the approved layout. */
  var lastSelectedHost20260924='';
  try{
    lastSelectedHost20260924=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();
  }catch(e){}
  window.addEventListener('kt-remote-host-selected',function(e){
    var next='';
    try{next=String(e&&e.detail&&e.detail.host_id||'').trim();}catch(_e){}
    var current='';
    try{current=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||lastSelectedHost20260924||'').trim();}catch(_e){}
    if(next)lastSelectedHost20260924=next;

    if(approvalActive||approvedByRealtimeRoster20260924()){
      if(!next||!current||next===current){
        forceApprovedGridNow20260924();
        return;
      }
    }
    if(next&&current&&next===current)return;
    clearApprovedViewForFreshRoom();
  });

  window.addEventListener('kt-broadcast-ended',clearApprovedViewForFreshRoom);

  repair();
  [50,120,250,500,900,1500,2400,4000].forEach(function(ms){setTimeout(repair,ms);});
  setInterval(repair,300);
  try{
    new MutationObserver(function(){setTimeout(repair,20);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();