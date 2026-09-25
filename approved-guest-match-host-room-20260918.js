/* K-Talk: 승인된 게스트 화면을 호스트의 9/13명방 화면처럼 한 화면으로 표시. 다른 방/기능 변경 없음. */
(function(){
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
    var is13=txt.indexOf('13명')>-1;
    return {is13:is13,total:is13?13:9,label:is13?'13명 방송':'9명 방송'};
  }

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestMatchHostRoomStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestMatchHostRoomStyle';
    s.textContent=''
      +'.kt-remote-live.kt-guest-hostlike-active{display:block!important;padding:0!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-guest-hostlike-active> :not(.kt-guest-hostlike-room):not(.kt-remote-chat):not(.kt-remote-bottom){display:none!important}'
      +'.kt-guest-hostlike-room{width:100%;height:100dvh;min-height:620px;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(62px + env(safe-area-inset-bottom));gap:4px}'
      +'.kgh-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 12px}'
      +'.kgh-air{font-weight:950;line-height:1.05}.kgh-air strong{display:block;font-size:20px;white-space:nowrap}.kgh-air strong i{font-style:normal;color:#ff2e67}.kgh-air small{display:block;margin-top:5px;color:#fff;font-size:12px;font-weight:900;white-space:nowrap}.kgh-air small i{font-style:normal;color:#ff315f}.kgh-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.kgh-attend{justify-self:center;min-width:132px;height:43px;padding:0 14px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:18px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;white-space:nowrap}'
      +'.kgh-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}'
      +'.kgh-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:kghMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.kgh-led-track span{display:inline-block;padding-right:80px}.kgh-led-track b{color:#ff59c9}@keyframes kghMarquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}'
      +'.kgh-quick{flex:0 0 35px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.kgh-quick button{border:0;border-radius:11px;background:#101014;color:#fff;font-size:11px;font-weight:900}'
      +'.kgh-stats{flex:0 0 42px;display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:5px}.kgh-stats button,.kgh-viewers{border:0;border-radius:13px;background:#111114;color:#fff;font-size:12px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}'
      +'.kgh-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:2px;overflow:hidden}.kgh-main.is13{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}.kgh-main.is13 .kgh-cell:nth-child(13){grid-column:1}'
      +'.kgh-cell{position:relative;display:grid;place-items:center;min-width:0;min-height:0;border:1px solid #28282d;border-radius:7px;background:linear-gradient(145deg,#17181b,#111214);color:#bdbdc4;font-size:13px;font-weight:900;overflow:hidden}'
      +'.kgh-cell video{position:absolute;inset:0;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;object-fit:cover!important;object-position:center center!important;background:#111}'
      +'.kgh-cell.host video{transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important}.kgh-cell.self video{left:0!important;top:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important}.kgh-cell.self{outline:2px solid #61d9ff;outline-offset:-2px}'
      +'.kgh-label{position:absolute;left:7px;bottom:6px;z-index:3;padding:3px 7px;border-radius:10px;background:#111d;color:#fff;font-size:10px;font-weight:950}'
      +'.kt-remote-live.kt-guest-hostlike-active>.kt-remote-bottom{display:flex!important;z-index:80!important}.kt-remote-live.kt-guest-hostlike-active>.kt-remote-chat{display:flex!important;z-index:79!important;bottom:68px!important;max-height:78px!important}'
      +'.kgh-chat{flex:0 0 64px;position:relative;overflow:hidden;background:#000;display:flex;align-items:flex-end;padding:2px 6px 3px}.kgh-chatbox{width:calc(100% - 112px)!important;max-height:60px;overflow:hidden;font-size:10px;font-weight:850;line-height:1.35;color:#fff}'
      +'.kgh-earn{position:absolute;right:5px;bottom:4px;z-index:6;width:104px;height:54px;border:1px solid #d2a936;border-radius:10px;background:linear-gradient(135deg,#17140be8,#0d0d12e8);color:#fff;padding:3px 4px;text-align:center;overflow:hidden}.kgh-earn .top{display:flex;align-items:center;justify-content:center;gap:3px;white-space:nowrap}.kgh-earn .top span{font-size:6px;color:#8fe8ff;font-weight:950}.kgh-earn .top b{font-size:9px;color:#ffe071}.kgh-earn-detail{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:3px;font-size:6px;color:#ddd;white-space:nowrap}'
      +'.kgh-tools{display:none!important}.kgh-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;font-size:9px;display:grid;justify-items:center;gap:2px}.kgh-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px;box-shadow:inset 0 0 13px #ffffff08}.kgh-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.kt-guest-hostlike-room{padding-left:4px;padding-right:4px;gap:3px}.kgh-head{flex-basis:58px;padding:4px 8px}.kgh-air strong{font-size:17px}.kgh-air small{font-size:10px}.kgh-brand{font-size:17px}.kgh-attend{min-width:108px;height:38px;font-size:15px;padding:0 8px}.kgh-led{flex-basis:50px}.kgh-led-track{font-size:20px}.kgh-quick{flex-basis:31px}.kgh-stats{flex-basis:39px}.kgh-stats button,.kgh-viewers{font-size:10px}.kgh-cell{font-size:11px}.kgh-chat{flex-basis:60px}.kgh-tools{flex-basis:48px}.kgh-tool i{width:32px;height:32px;font-size:16px}}';
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
    if(root.querySelector('.kt-guest-hostlike-room'))return;

    var main=document.getElementById('ktRemoteLiveVideo');
    var preview=document.getElementById('ktRemoteHostPreview');
    if(!main&&!preview)return;

    ensureStyle();

    var mainStream=main&&main.srcObject||null;
    var previewStream=preview&&preview.srcObject||null;
    var approvedSelf=null;
    try{approvedSelf=window.__ktApprovedGuestSelfStream||null;}catch(e){}

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
      if(s&&s!==approvedSelf&&live(s)){hostCandidate=s;break;}
    }

    /* Approval changes the layout immediately. A missing stream reference is
       temporary and must not keep the device in the old one-person view. */
    var selfCandidate=null;
    if(approvedSelf&&approvedSelf!==hostCandidate&&live(approvedSelf))selfCandidate=approvedSelf;
    else if(mainStream&&mainStream!==hostCandidate&&live(mainStream))selfCandidate=mainStream;

    if(hostCandidate){
      hostStream=hostCandidate;
      window.__ktLastApprovedGuestHostStream=hostCandidate;
    }
    selfStream=selfCandidate||selfStream||null;

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

    var info=roomInfo(root);

    root.querySelectorAll('.kt-approved-guest-led,.kt-approved-guest-stats,.kt-approved-guest-grid,.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(x){try{x.remove();}catch(e){}});
    root.classList.remove('kt-approved-guest-room','kt-prejoin-room-view');
    root.classList.add('kt-guest-hostlike-active');

    var room=document.createElement('section');
    room.className='kt-guest-hostlike-room';

    var head=document.createElement('div');
    head.className='kgh-head';
    head.innerHTML='<div class="kgh-air"><strong><i>●</i> '+info.label+'</strong><small><i>● ON AIR</i> <span class="kgh-clock">00:00:00</span></small></div>'
      +'<button class="kgh-attend" type="button">🌹 출석체크</button><div class="kgh-brand">K-Talk LIVE</div>';
    var attend=head.querySelector('.kgh-attend');
    attend.addEventListener('click',function(){try{if(window.ktAttendanceCheck)window.ktAttendanceCheck();}catch(e){}});

    var led=document.createElement('div');
    led.className='kgh-led';
    led.innerHTML='<div class="kgh-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div>';

    var quick=document.createElement('div');
    quick.className='kgh-quick';
    quick.innerHTML='<button type="button">🏆 인기</button><button type="button">🎁 보물상자</button><button type="button">⚔ 매치</button>';

    var stats=document.createElement('div');
    stats.className='kgh-stats';
    stats.innerHTML='<button type="button">🔥 일일 랭킹</button><button type="button">🎯 미션</button><div class="kgh-viewers">시청자 9명이 시청중 🏃</div>';

    var grid=document.createElement('div');
    grid.className='kgh-main'+(info.is13?' is13':'');
    var hostCell=makeCell('host','호스트');
    var selfCell=makeCell('self','나 · 게스트');

    hostVideo.id='ktRemoteHostPreview';
    hostVideo.className='';
    hostVideo.autoplay=true;
    hostVideo.playsInline=true;
    /* Keep the already-playing host preview muted in the guest room.
       Mobile browsers can pause/block it when approval flips it to unmuted.
       Host audio is handled by the live media layer; this keeps first video paint immediate. */
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
    for(var i=2;i<info.total;i++)grid.appendChild(makeCell('',''));

    var chat=document.createElement('div');
    chat.className='kgh-chat';
    var chatbox=document.createElement('div');
    chatbox.className='kgh-chatbox';
    chatbox.innerHTML='<div style="color:#ffe071">● K-톡 태권1님이 들어왔습니다.</div><div><b style="color:#64c8ff">K-톡 태권1</b> 👥 방송 참여를 신청했습니다.</div><div><b style="color:#64c8ff">태권이</b> ✅ 참여를 승인했습니다.</div>';
    chat.appendChild(chatbox);
    var earn=document.createElement('button');
    earn.type='button';
    earn.className='kgh-earn';
    earn.id='ktGuestEarnHud';
    earn.onclick=window.ktGuestToggleEarnings;
    earn.innerHTML='<div class="top"><span>🔒 내 수익</span><b id="ktGuestEarnNet">0원</b></div>'
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
    room.appendChild(quick);
    room.appendChild(stats);
    room.appendChild(grid);
    room.appendChild(chat);
    room.appendChild(tools);
    root.appendChild(room);

    builtRoot=root;

    try{var p=hostVideo.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    if(selfCandidate){
      try{var q=selfVideo.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
      try{window.__ktApprovedGuestSelfStream=selfCandidate;}catch(e){}
    }

    var start=Date.now();
    var clock=room.querySelector('.kgh-clock');
    setInterval(function(){
      if(!document.documentElement.contains(room))return;
      var sec=Math.max(0,Math.floor((Date.now()-start)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      if(clock)clock.textContent=h+':'+m+':'+s;
    },1000);
  }

  function repair(){
    try{
      var root=document.querySelector('.kt-remote-live');
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
          if(candidates[ci]&&candidates[ci]!==selfStream&&live(candidates[ci])){trueHost=candidates[ci];break;}
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
        try{latestSelf=window.__ktApprovedGuestSelfStream||null;}catch(e){}
        if(latestSelf&&latestSelf!==hostStream&&live(latestSelf))selfStream=latestSelf;
        if(sv&&selfStream&&live(selfStream)&&sv.srcObject!==selfStream){
          sv.srcObject=selfStream;
          try{var sp=sv.play();if(sp&&sp.catch)sp.catch(function(){});}catch(e){}
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

  window.addEventListener('kt-host-session-reset',function(e){
    try{
      var h=String(e&&e.detail&&e.detail.host_id||'').trim();
      var current=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();
      if((approvalActive||approvedByRealtimeRoster20260924())&&h&&current&&h===current){
        /* Same host, new/late run context: keep the approved guest screen and
           self camera in place. Media transport will switch underneath it. */
        forceApprovedGridNow20260924();
        return;
      }
    }catch(_e){}
    clearApprovedViewForFreshRoom();
  });

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