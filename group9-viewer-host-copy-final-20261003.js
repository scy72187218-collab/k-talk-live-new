/* K-Talk 9-room viewer final: use ONE host-matched room shell.
   Viewer top/room structure follows host 9-room. Guest bottom controls stay separate.
   No alternate full-screen viewer layout is created here. */
(function(){
  if(window.__ktG9ViewerHostCopyFinal20261003)return;
  window.__ktG9ViewerHostCopyFinal20261003=true;
  window.__ktUseSingleG9ViewerHostCopy20261003=true;

  function isNine(){
    try{
      var last=window.__ktLastLiveRoom||{}, st=window.state||{};
      var roomType=String(last.room_type||window.__ktRemoteRoomType||st.liveRoomType||'').toLowerCase();
      var roomName=String(last.room_name||window.__ktRemoteRoomName||st.liveRoomName||'');
      var title=String(last.title||'');
      var txt=[roomType,roomName,title].join(' ');

      /* Secret/password rooms must never be claimed by the 9-room viewer shell. */
      if(/password|secret|비밀방|비밀\s*방/i.test(txt))return false;

      var forced=String(window.__ktForceNineViewerShellHost20261003||'').trim();
      var current=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();
      if(forced&&(!current||forced===current)){
        if(/password|secret|비밀방|비밀\s*방/i.test(txt))return false;
        return true;
      }

      return /group9|9\s*명/i.test(txt);
    }catch(e){return false;}
  }
  function style(){
    if(document.getElementById('ktG9ViewerHostCopyStyle20261003'))return;
    var s=document.createElement('style');
    s.id='ktG9ViewerHostCopyStyle20261003';
    s.textContent=''
    +'#screen .kt-remote-live.kt-g9-host-copy{display:block!important;padding:0!important;background:#000!important;overflow:hidden!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy> :not(.ktg13-room):not(.kt-remote-chat):not(.kt-remote-bottom):not(.kt-remote-leave-fixed-1150617):not(.kt-allroom-guest-earn){display:none!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy>.ktg13-room{height:calc(100dvh + 14px)!important;min-height:0!important;margin-top:-14px!important;padding:4px 7px calc(62px + env(safe-area-inset-bottom))!important;display:flex!important;flex-direction:column!important;gap:4px!important;background:#000!important;color:#fff!important;overflow:hidden!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-head{flex:0 0 58px!important;display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;padding:4px 8px!important;border-radius:16px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-air strong{display:block!important;font-size:17px!important;font-weight:950!important}#screen .kt-remote-live.kt-g9-host-copy .ktg13-air strong i{color:#ff2e67!important;font-style:normal!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-air small{display:block!important;margin-top:4px!important;font-size:10px!important;font-weight:900!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-attend{justify-self:center!important;height:38px!important;min-width:108px!important;padding:0 8px!important;border-radius:19px!important;border:2px solid #ff2bbd!important;background:#130714!important;color:#ffd52f!important;font-size:15px!important;font-weight:950!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-brand{justify-self:end!important;color:#ff3d78!important;font-size:17px!important;font-weight:950!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-led{flex:0 0 50px!important;position:relative!important;border:2px solid #ff28c4!important;border-radius:22px!important;background:#120712!important;overflow:hidden!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-led-track{height:100%!important;display:flex!important;align-items:center!important;white-space:nowrap!important;font-size:20px!important;font-weight:950!important;color:#ffd62d!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-quick{flex:0 0 29px!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:4px!important}#screen .kt-remote-live.kt-g9-host-copy .ktg13-quick button{border:0!important;border-radius:9px!important;background:#101014!important;color:#fff!important;font-size:10px!important;font-weight:900!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-stats{flex:0 0 31px!important;display:grid!important;grid-template-columns:1fr 1fr 1.35fr!important;gap:4px!important}#screen .kt-remote-live.kt-g9-host-copy .ktg13-stats button,#screen .kt-remote-live.kt-g9-host-copy .ktg13-viewers{border:0!important;border-radius:9px!important;background:#111114!important;color:#fff!important;font-size:10px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important;width:calc(100% - 20px)!important;height:78vw!important;max-height:78vw!important;flex:0 0 78vw!important;margin:-4px auto 0!important;overflow:hidden!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-host,#screen .kt-remote-live.kt-g9-host-copy .ktg13-guest{position:relative!important;display:grid!important;place-items:center!important;min-width:0!important;min-height:0!important;border-radius:9px!important;background:linear-gradient(145deg,#17181b,#111214)!important;color:#bdbdc4!important;font-size:11px!important;font-weight:900!important;overflow:hidden!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .ktg13-host video,#screen .kt-remote-live.kt-g9-host-copy .ktg13-guest video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;background:#000!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy .kt-room-second-stats-row-20260927{display:none!important}'
    +'#screen .kt-remote-live.kt-g9-host-copy>.kt-remote-bottom{display:flex!important;z-index:90!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  function hostVideoNode(){
    return document.getElementById('ktRemoteLiveVideo');
  }

  function removeDuplicateQuick(room){
    if(!room)return;
    var quicks=[].slice.call(room.querySelectorAll(':scope > .ktg13-quick'));
    quicks.slice(1).forEach(function(x){try{x.remove();}catch(e){}});
    [].slice.call(room.children||[]).forEach(function(el){
      if(!el||el.classList&&el.classList.contains('ktg13-quick'))return;
      var t=String(el.textContent||'').replace(/\s+/g,'');
      if(t.indexOf('되돌리기')>=0&&t.indexOf('보물상자')>=0&&t.indexOf('매치')>=0){
        try{el.remove();}catch(e){}
      }
    });
  }

  function removeLegacyTopNineGrids20261003(root,preserveVideo){
    if(!root)return;
    try{
      root.querySelectorAll(':scope > .kt-prejoin-room-grid,:scope > .kt-approved-guest-grid,:scope > .kt-guest-room-grid,:scope > .kt-guest-hostlike-room').forEach(function(x){
        try{
          if(preserveVideo&&x.contains(preserveVideo))root.appendChild(preserveVideo);
        }catch(e){}
        try{x.remove();}catch(e){}
      });
    }catch(e){}
  }

  function build(){
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root||!isNine())return false;
    style();

    /* 예전 9칸을 지우기 전에 호스트 영상 노드를 먼저 잡아서 보존한다. */
    var remoteVideo=hostVideoNode();
    try{
      var hs0=window.__ktRemoteHostStream||null;
      if(remoteVideo&&hs0&&remoteVideo.srcObject!==hs0)remoteVideo.srcObject=hs0;
    }catch(_e){}
    removeLegacyTopNineGrids20261003(root,remoteVideo);

    var room=root.querySelector('.ktg13-room[data-kt-viewer-host-copy="1"]');

    /* 이미 정상 9명방이 떠 있으면 DOM 구조는 절대 다시 만들거나 지우지 않는다.
       영상 노드 위치와 재생 상태만 유지해서 화면이 내려갔다 올라오는 재배치를 막는다. */
    if(room){
      root.classList.add('kt-g9-host-copy');
      var stableHost=room.querySelector('.ktg13-host');
      if(remoteVideo&&stableHost&&remoteVideo.parentElement!==stableHost)stableHost.appendChild(remoteVideo);
      if(remoteVideo){
        remoteVideo.autoplay=true;remoteVideo.playsInline=true;remoteVideo.muted=true;remoteVideo.defaultMuted=true;
        try{
          var hs=window.__ktRemoteHostStream||null;
          if(hs&&remoteVideo.srcObject!==hs)remoteVideo.srcObject=hs;
        }catch(_e){}
        try{var sp=remoteVideo.play();if(sp&&sp.catch)sp.catch(function(){});}catch(e){}
      }
      syncSelf();
      return true;
    }

    /* 첫 생성 때만 오래된 9명방 잔여물을 제거한다. */
    root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid,.kt-approved-guest-led,.kt-approved-guest-stats,.kt-approved-guest-grid,.kt-guest-room-grid,.kt-guest-hostlike-room').forEach(function(x){
      try{x.remove();}catch(e){}
    });
    root.classList.remove('kt-prejoin-room-view','kt-approved-guest-room','kt-guest-hostlike-active');

    if(!room){
      room=document.createElement('section');
      room.className='ktg13-room';
      room.setAttribute('data-kt-room','9');
      room.setAttribute('data-kt-viewer-host-copy','1');
      room.innerHTML=''
      +'<div class="ktg13-head"><div class="ktg13-air"><strong><i>●</i> 9명 방송</strong><small><i>● ON AIR</i> <span class="ktg9-copy-clock">00:00:00</span></small></div><button type="button" class="ktg13-attend">🪽 출석체크 🪽</button><div class="ktg13-brand">K-Talk LIVE</div></div>'
      +'<div class="ktg13-led"><div class="ktg13-led-track">💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송 되세요 🌹</div></div>'
      +'<div class="ktg13-quick"><button type="button">↩ 되돌리기</button><button type="button">🎁 보물상자</button><button type="button">⚔ 매치</button></div>'
      +'<div class="ktg13-stats"><button type="button" class="ktg9-rank">🔥 일일 랭킹</button><button type="button" class="ktg9-mission">🎯 미션</button><div class="ktg13-viewers">시청자 9명이 시청중 🏃</div></div>'
      +'<div class="ktg13-main"><div class="ktg13-host"></div><div class="ktg13-guests"></div></div>';
      var guests=room.querySelector('.ktg13-guests');
      for(var i=0;i<8;i++){var g=document.createElement('div');g.className='ktg13-guest';g.textContent='게스트';guests.appendChild(g);}
      var attend=room.querySelector('.ktg13-attend');if(attend)attend.onclick=function(){try{if(window.ktAttendanceCheck)return window.ktAttendanceCheck();if(window.ktRemoteAttendanceCheck)return window.ktRemoteAttendanceCheck();}catch(e){}};
      var rank=room.querySelector('.ktg9-rank');if(rank)rank.onclick=function(){try{if(window.ktGroup13Ranking)return window.ktGroup13Ranking();if(window.openDailyRanking)return window.openDailyRanking();}catch(e){}};
      var mission=room.querySelector('.ktg9-mission');if(mission)mission.onclick=function(){try{if(window.ktGroup9Mission)return window.ktGroup9Mission();if(window.openMission)return window.openMission();if(window.ktGroup13Invite)return window.ktGroup13Invite();}catch(e){}};
      root.appendChild(room);
    }
    root.classList.add('kt-g9-host-copy');
    removeDuplicateQuick(room);
    if(remoteVideo){
      var host=room.querySelector('.ktg13-host');
      if(host&&remoteVideo.parentElement!==host)host.appendChild(remoteVideo);
      remoteVideo.autoplay=true;remoteVideo.playsInline=true;remoteVideo.muted=true;remoteVideo.defaultMuted=true;
      try{var p=remoteVideo.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    syncSelf();
    return true;
  }
  function approved(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      var id=d?'viewer_'+d:'';
      var map=window.__ktApprovedGuestIds20260924||{};
      return !!(id&&map[id]===true);
    }catch(e){return false;}
  }
  function syncSelf(){
    var room=document.querySelector('#screen .kt-remote-live .ktg13-room[data-kt-viewer-host-copy="1"]');
    if(!room)return;
    var cells=[].slice.call(room.querySelectorAll('.ktg13-guest'));
    var cell=room.querySelector('.ktg13-guest.self')||cells[0]||null;
    var stream=null;
    try{stream=window.__ktApprovedGuestSelfStream||window.__ktLocalGuestCameraStream20260926||null;}catch(e){}
    if(approved()&&stream&&cell){
      cell.classList.add('self');
      var v=cell.querySelector('video');
      if(!v){cell.textContent='';v=document.createElement('video');v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;cell.appendChild(v);}
      if(v.srcObject!==stream)v.srcObject=stream;
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }else if(cell&&cell.classList.contains('self')&&!approved()){
      var v2=cell.querySelector('video');if(v2){try{v2.pause();}catch(e){}try{v2.srcObject=null;}catch(e){}}
      cell.classList.remove('self');cell.textContent='게스트';
    }
  }
  window.ktShowNineViewerShellImmediately20261003=function(){return build();};
  window.ktApplyApprovedPrejoinLayout20261002=function(){if(isNine())return build();return false;};
  window.ktForceApprovedGuestGridNow20260924=function(){if(isNine()){build();syncSelf();return true;}return false;};

  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-three-person-sync-now','kt-livekit-state'].forEach(function(n){
    window.addEventListener(n,function(){build();syncSelf();setTimeout(syncSelf,80);});
  });
  [0,50,120,300,700].forEach(function(ms){setTimeout(build,ms);});
  setInterval(function(){if(isNine()){build();syncSelf();}},500);
})();