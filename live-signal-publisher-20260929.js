/* K-Talk red LIVE signal publisher only (2026-09-29, 5555)
   Adds beacon heartbeat without changing locked LIVE presence/WebRTC/entry/exit code. */
(function(){
  if(window.__ktLiveSignalPublisher20260929)return;
  window.__ktLiveSignalPublisher20260929=true;

  var timer=null,runId='',runStartedAt=0,lastActive=false,forceOffUntil=0,startGraceUntil=0,roomMissingSince=0;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        if(p.name)return String(p.name);
      }
    }catch(e){}
    try{return localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||'K-Talk 방송자';}catch(e){}
    return 'K-Talk 방송자';
  }
  function hostRoomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen');
      return !!(s&&s.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room'));
    }catch(e){return false;}
  }
  function hostStreamLive(){
    try{
      var st=window.state||{};
      var stream=st.stream;
      return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));
    }catch(e){return false;}
  }
  function roomInfo(){
    var st=window.state||{};
    return {
      title:String(st.currentLiveRoomTitle||st.liveRoomName||'K-Talk LIVE'),
      room_type:String(st.liveRoomType||'solo'),
      room_name:String(st.liveRoomName||st.currentLiveRoomTitle||'방송')
    };
  }

  var hostFrameCache20261001='',hostFrameAt20261001=0;
  function currentHostFrame20261001(){
    try{
      if(hostFrameCache20261001&&Date.now()-hostFrameAt20261001<700)return hostFrameCache20261001;
      var stream=(window.state||{}).stream||null;
      if(!stream)return hostFrameCache20261001||'';
      var vids=[].slice.call(document.querySelectorAll('video'));
      var v=vids.find(function(x){
        try{return x&&x.srcObject===stream&&x.videoWidth>0&&x.videoHeight>0;}catch(e){return false;}
      });
      if(!v)return hostFrameCache20261001||'';
      var cv=document.createElement('canvas');cv.width=96;cv.height=72;
      var cx=cv.getContext('2d',{alpha:false});if(!cx)return hostFrameCache20261001||'';
      cx.drawImage(v,0,0,96,72);
      var frame=cv.toDataURL('image/jpeg',0.34);
      if(/^data:image\/jpeg;base64,/.test(frame)&&frame.length<32000){
        hostFrameCache20261001=frame;hostFrameAt20261001=Date.now();
      }
      return hostFrameCache20261001||'';
    }catch(e){return hostFrameCache20261001||'';}
  }
  function send(action){
    var id=deviceId();
    if(!id)return;
    if(!runId){runStartedAt=Date.now();runId='sig-'+runStartedAt.toString(36)+'-'+Math.random().toString(36).slice(2,7);}
    var r=roomInfo();
    var body={
      action:action,
      host_id:id,
      host_name:profileName(),
      title:r.title,
      room_type:r.room_type,
      room_name:r.room_name,
      run_id:runId,
      run_started_at:runStartedAt,
      host_frame:currentHostFrame20261001(),
      at:Date.now()
    };
    try{
      fetch('/api/live-beacon-memory',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body),
        cache:'no-store',
        keepalive:true
      }).catch(function(){});
    }catch(e){}
  }
  var wakeLockSentinel=null;
  async function keepBroadcastAwake(){
    try{
      if(!('wakeLock' in navigator)||document.hidden||wakeLockSentinel)return;
      wakeLockSentinel=await navigator.wakeLock.request('screen');
      if(wakeLockSentinel&&wakeLockSentinel.addEventListener){
        wakeLockSentinel.addEventListener('release',function(){wakeLockSentinel=null;});
      }
    }catch(e){wakeLockSentinel=null;}
  }
  function releaseBroadcastAwake(){
    try{
      var w=wakeLockSentinel;wakeLockSentinel=null;
      if(w&&w.release)w.release().catch(function(){});
    }catch(e){}
  }

  function forceEnd(){
    try{send('end');}catch(e){}
    releaseBroadcastAwake();
    lastActive=false;
    forceOffUntil=Date.now()+6000;
    runId='';runStartedAt=0;
  }

  function forceStart(){
    forceOffUntil=0;
    keepBroadcastAwake();
    startGraceUntil=Date.now()+10000;
    if(!runId){runStartedAt=Date.now();runId='sig-'+runStartedAt.toString(36)+'-'+Math.random().toString(36).slice(2,7);}
    try{send('publish');}catch(e){}
    /* 방송 시작 신호를 짧게 여러 번 보내 느린 기기/네트워크에서도 빨간 LIVE를 놓치지 않게 한다. */
    [120,300,650,1200].forEach(function(ms){
      setTimeout(function(){
        try{
          if(lastActive||hostRoomVisible())send('heartbeat');
        }catch(e){}
      },ms);
    });
    lastActive=true;
  }

  function wrap(name,before){
    var old=window[name];
    if(typeof old!=='function'||old.__ktSignalWrapped20260929)return;
    var fn=function(){
      try{before&&before();}catch(e){}
      return old.apply(this,arguments);
    };
    fn.__ktSignalWrapped20260929=true;
    window[name]=fn;
  }

  var lastStartBroadcast=null,lastStartLiveRoomNow=null,lastStartRoomNow=null;
  function installWraps(){
    try{
      if(typeof window.startBroadcast==='function'&&window.startBroadcast!==lastStartBroadcast){
        wrap('startBroadcast',forceStart);
        lastStartBroadcast=window.startBroadcast;
      }
      if(typeof window.ktStartLiveRoomNow==='function'&&window.ktStartLiveRoomNow!==lastStartLiveRoomNow){
        wrap('ktStartLiveRoomNow',forceStart);
        lastStartLiveRoomNow=window.ktStartLiveRoomNow;
      }
      if(typeof window.ktStartRoomNow==='function'&&window.ktStartRoomNow!==lastStartRoomNow){
        wrap('ktStartRoomNow',forceStart);
        lastStartRoomNow=window.ktStartRoomNow;
      }
    }catch(e){}
    wrap('endBroadcastEarnings',forceEnd);
    wrap('leaveBroadcastToDashboard',forceEnd);
  }

  function tick(){
    installWraps();
    if(Date.now()<forceOffUntil)return;
    var on=hostRoomVisible();
    if(on){
      roomMissingSince=0;
      try{if(typeof window.ktRepairVisibleHostPresence20260928==='function')window.ktRepairVisibleHostPresence20260928();}catch(e){}
      startGraceUntil=0;
      send(lastActive?'heartbeat':'publish');
      lastActive=true;
    }else if(Date.now()<startGraceUntil&&lastActive){
      /* 방송 시작 직후 방 화면이 늦게 그려져도 빨간 LIVE 신호를 먼저 유지 */
      roomMissingSince=0;
      send('heartbeat');
    }else if(lastActive){
      /* 1111: 방송 화면 DOM이 잠깐 재렌더링돼도 종료로 오해하지 않는다.
         실제 나가기/종료 버튼은 기존 forceEnd 래퍼가 즉시 종료한다. */
      if(!roomMissingSince)roomMissingSince=Date.now();
      if(Date.now()-roomMissingSince<6000){
        send('heartbeat');
        return;
      }
      forceEnd();
      roomMissingSince=0;
    }
  }

  installWraps();
  timer=setInterval(tick,450);
  setTimeout(tick,80);
  [100,300,700,1400].forEach(function(ms){setTimeout(installWraps,ms);});

  /* 실제 사용자가 방송 시작 컨트롤을 누른 경우에만 LIVE publish.
     자동 DOM 감지는 사용하지 않아 빈 방에서 빨간 LIVE가 뜨지 않게 한다. */
  document.addEventListener('pointerdown',function(e){
    try{
      var el=e&&e.target&&e.target.closest?e.target.closest('[onclick],button,span'):null;
      if(!el)return;
      var oc=String(el.getAttribute&&el.getAttribute('onclick')||'');
      var txt=String(el.textContent||'').replace(/\s+/g,'');
      var exactStart=/ktStartLiveRoomNow\s*\(|ktStartRoomNow\s*\(|startBroadcast\s*\(/.test(oc);
      var creatorLive=txt==='라이브'&&!!el.closest('.creator-bottom,.live-prep,.creator');
      if(exactStart||creatorLive){
        forceStart();
        return;
      }

      /* 1111: host exit must end only the red LIVE beacon immediately.
         Do not alter the existing exit/navigation function itself. */
      var hostExit=/^(퇴장|나가기|방송종료|종료)$/.test(txt)||
        /leaveBroadcastToDashboard\s*\(|endBroadcastEarnings\s*\(/.test(oc);
      if(hostExit&&(lastActive||hostRoomVisible())){
        forceEnd();
      }
    }catch(_e){}
  },true);

  window.addEventListener('pageshow',function(){setTimeout(tick,60);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){
      if(lastActive)keepBroadcastAwake();
      setTimeout(tick,60);
    }
  });
  /* 잠깐 백그라운드/화면 전환은 방송 종료가 아니다.
     실제 종료 버튼에서만 forceEnd()를 호출하고,
     신호가 끊기면 1분 유효시간으로 자연 정리한다. */
  window.addEventListener('pagehide',function(){
    if(lastActive){
      try{send('heartbeat');}catch(e){}
    }
  });
})();