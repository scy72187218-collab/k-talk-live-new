/* K-Talk 9명방 2026-09-21 오후 5시 복구.
   기준 스냅샷: 093316994b4d4db36b1ee5200bd9a5eb9b63bce3
   (16:49:16 KST, 17:00 시점에 실제로 배포되어 있던 최신 상태)
   9명방만 당시 시작 흐름: 손을 대면 5 즉시 표시 → 5·4·3·2·1 한 번 →
   원래 방송 시작 호출. 방 화면/배치 파일은 당시와 동일한 원본을 그대로 사용. */
(function(){
  if(window.__ktGroup9Restore20260921_1700)return;
  window.__ktGroup9Restore20260921_1700=true;

  var previousStart=window.startBroadcast;
  if(typeof previousStart!=='function')return;

  function isNine(){
    try{
      var bottom=[].slice.call(document.querySelectorAll('.live-prep .kt-room-bottom5 button.on,.kt-room-bottom5 button.on'));
      if(bottom.some(function(b){return /9\s*명/.test(String(b.textContent||''));}))return true;
      var st=window.state||{};
      /* 현재 사용자가 고른 방이 구독자/13명/비밀/1인방이면 예전 9명방 보조 상태가 남아 있어도 절대 가로채지 않는다. */
      var currentType=String(st.liveRoomType||'');
      var currentName=String(st.liveRoomName||'');
      if(currentType && currentType!=='group9' && currentName && !/9\s*명/.test(currentName))return false;
      var vals=[st.liveRoomType,st.prepRoomType,st.roomType,st.liveRoomName,st.prepRoomName].join(' ');
      if(/group9|9명/.test(String(vals)))return true;
      if(Number(st.liveRoomMax||st.prepRoomMax||0)===9)return true;
      var title=document.getElementById('liveTitle');
      return !!(title&&/9\s*명/.test(String(title.value||'')));
    }catch(e){return false;}
  }

  function forceNineState(){
    try{
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 방송';
        state.liveRoomMax=9;
        state.prepRoomType='group9';
        state.prepRoomName='9명 방송';
        state.prepRoomMax=9;
        state.roomType='group9';
      }
      var title=document.getElementById('liveTitle');
      if(title)title.value='9명 방송';
    }catch(e){}
  }

  function adaptNineRoomNow(){
    try{
      forceNineState();
      var room=document.querySelector('#screen .ktg13-room');
      if(!room)return false;

      room.setAttribute('data-kt-room','9');
      room.removeAttribute('data-kt-approved13');

      var head=room.querySelector('.ktg13-air strong');
      if(head)head.innerHTML='<i>●</i> 9명 방송';

      var guests=[].slice.call(room.querySelectorAll('.ktg13-guests > .ktg13-guest'));
      guests.slice(8).forEach(function(g){try{g.remove();}catch(e){}});

      var stats=room.querySelectorAll('.ktg13-stats > button');
      if(stats[1]&&String(stats[1].textContent||'').indexOf('지금 추가')>-1){
        stats[1].textContent='🎯 미션';
        stats[1].classList.add('ktg9-mission-btn');
        if(typeof window.ktGroup9Mission==='function'){
          stats[1].onclick=function(){window.ktGroup9Mission();};
        }
      }

      try{
        var cr=window.creator||document.getElementById('creator');
        if(cr)cr.classList.remove('show','live-prep-open');
        document.body.classList.remove('kt-home');
      }catch(e){}
      return true;
    }catch(e){return false;}
  }

  async function attachNineHostCameraNow(){
    try{
      var s=(window.state&&state.stream)||null;
      var hasVideo=!!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}));
      if(!hasVideo&&typeof window.ensureLiveCamera==='function'){
        try{await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
        s=(window.state&&state.stream)||s;
      }
      var v=document.querySelector('#screen .ktg13-room[data-kt-room="9"] .ktg13-host video')||
            document.querySelector('#screen .ktg13-room .ktg13-host video')||
            document.getElementById('ktLiveVideo');
      if(v&&s){
        v.autoplay=true;v.muted=true;v.defaultMuted=true;v.playsInline=true;
        v.setAttribute('autoplay','');v.setAttribute('muted','');v.setAttribute('playsinline','');
        if(v.srcObject!==s)v.srcObject=s;
        try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        return true;
      }
    }catch(e){}
    return false;
  }

  function queueNineHostCamera(){
    [0,60,150,300,600,1000].forEach(function(ms){
      setTimeout(function(){attachNineHostCameraNow();},ms);
    });
  }

  function openNineRoomNow(){
    try{
      
      forceNineState();

      /* 현재 승인된 방 틀을 같은 JS 턴 안에서 만들고 바로 9명방으로 바꾼다.
         브라우저가 중간 13명방/단일영상/테스트 화면을 그릴 틈을 주지 않는다. */
      if(typeof window.ktOpenApprovedGroup13Now==='function'){
        window.ktOpenApprovedGroup13Now(true);
        forceNineState();
        var opened=adaptNineRoomNow();
        queueNineHostCamera();
        return opened;
      }

      var opened=adaptNineRoomNow();
      queueNineHostCamera();
      return opened;
    }catch(e){return false;}
  }

  function keepOnlyNineRoomVisible(){
    var screen=document.getElementById('screen');
    if(!screen||!window.MutationObserver)return null;
    var busy=false;
    var mo=new MutationObserver(function(){
      if(busy||window.__ktGroup9RoomFirstCountdown!==true)return;
      try{
        var room=screen.querySelector('.ktg13-room[data-kt-room="9"]');
        if(room)return;
        busy=true;
        openNineRoomNow();
      }catch(e){}finally{busy=false;}
    });
    try{mo.observe(screen,{childList:true,subtree:false});}catch(e){return null;}
    return mo;
  }
  window.startBroadcast=async function(){
    if(!isNine())return previousStart.apply(this,arguments);

    forceNineState();

    /* 9명방: 카운트다운 없이 방을 먼저 즉시 연다. */
    openNineRoomNow();
    var keepObserver=keepOnlyNineRoomVisible();

    try{
      var result=await Promise.resolve(previousStart.apply(this,arguments));
      openNineRoomNow();
      queueNineHostCamera();
      return result;
    }finally{
      try{if(keepObserver)keepObserver.disconnect();}catch(e){}
      openNineRoomNow();
      try{
        var old=document.getElementById('ktLiveCountdown');
        if(old)old.remove();
      }catch(e){}
    }
  };
})();