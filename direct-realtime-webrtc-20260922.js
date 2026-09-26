/* K-Talk direct realtime WebRTC transport (2026-09-22)
   Communications only: host video, guest request/approval, approved guest camera.
   Uses Supabase Realtime broadcast and does not depend on Postgres polling.
   Does not change room layout, chat, gifts, earnings, switches, countdown or feed UI. */
(function(){
  if(window.__ktDirectRealtimeRtc20260922)return;
  window.__ktDirectRealtimeRtc20260922=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var REST_BROADCAST='https://'+REF+'.supabase.co/realtime/v1/api/broadcast';
  var ws=null,joined=false,joinRef='',seq=1,topic='',activeHostId='',queue=[],reconnectTimer=null,heartbeatTimer=null,reconnectFailures=0;
  var hostViewPeers={};
  var viewerPc=null,viewerSession='',viewerWatchToken='',viewerConnected=false,viewerIce={},viewerConnectTimer=null,viewerAnswerSdp='';
  var pendingRequests={},approvedGuests={},hostGuestPeers={},guestPc=null,guestSession='',guestApprovedHost='',guestApproved=false,guestStream=null,guestIce={};
  var guestPrewarmTimer=null;
  var pendingHostGuestOffers={},pendingHostGuestIce={},pendingGuestPhotos20260926={};
  /* 2026-09-26 communication-only guest order numbers.
     First approved guest = 1, second = 2 ... up to 15.
     This only tags/labels the connected guest slot; room layout is untouched. */
  var guestJoinNumber20260926=window.__ktGuestJoinNumber20260926||{};
  window.__ktGuestJoinNumber20260926=guestJoinNumber20260926;
  function resetGuestJoinNumbers20260926(){
    guestJoinNumber20260926={};
    window.__ktGuestJoinNumber20260926=guestJoinNumber20260926;
  }
  var requestOn=false,lastRemoteHost='',lastHostRole='',lastWatchAt=0;
  var sharedApprovalPollBusy=false,leaveAnnouncedHost='',guestAliveLastSent=0,guestAliveSharedLastSent=0,hostGuestAliveAt={},remoteHostMissingSince=0;
  var signalSeen={},viewerOfferInFlight='',lastHostReadyAt=0,lastGuestRequestAt=0,guestApprovedAt=0;
  var guestMediaAckTimer=null,guestMediaAckSession='',guestMediaRecoveryCount=0,guestMediaReadyAt=0;
  var guestPhotoCache20260926='',guestPhotoCacheTrack20260926='',guestPhotoCacheAt20260926=0;
  var sharedRuntimeStartedAt=Date.now()-5000,sharedRoomCutCache={};
  var hostRunId='',hostRunStartedAt=0,remoteRunId='',remoteRunStartedAt=0;
  window.__ktApprovedGuestIds20260924=window.__ktApprovedGuestIds20260924||{};
  window.__ktApprovedGuestNames20260924=window.__ktApprovedGuestNames20260924||{};
  function publishRunContext(hostId,runId,startedAt,role){
    try{
      if(role==='host'){
        window.__ktHostRunId20260924=String(runId||'');
        window.__ktHostRunStartedAt20260924=Number(startedAt||0);
      }else{
        window.__ktRemoteHostRunId20260924=String(runId||'');
        window.__ktRemoteHostSessionStartedAt20260924=Number(startedAt||0);
      }
      window.dispatchEvent(new CustomEvent('kt-host-session-ready',{detail:{host_id:String(hostId||''),run_id:String(runId||''),started_at:Number(startedAt||0),role:String(role||'')}}));
    }catch(e){}
  }

  async function sharedCurrentRoomCutoff(hostId){
    hostId=String(hostId||'').trim();
    if(!hostId)return sharedRuntimeStartedAt;
    var cached=sharedRoomCutCache[hostId];
    if(cached&&Date.now()-Number(cached.at||0)<3000)return Number(cached.cut||sharedRuntimeStartedAt);
    var cut=0;
    try{
      var url='https://'+REF+'.supabase.co/rest/v1/ktalk_live_rooms?select=started_at,active&host_id=eq.'+
        encodeURIComponent(hostId)+'&active=eq.true&order=started_at.desc&limit=1';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(r&&r.ok){
        var rows=await r.json();
        if(rows&&rows[0]&&rows[0].started_at){
          var t=Date.parse(String(rows[0].started_at||''));
          if(isFinite(t)&&t>0)cut=t;
        }
      }
    }catch(e){}
    if(!cut)cut=sharedRuntimeStartedAt;
    sharedRoomCutCache[hostId]={cut:cut,at:Date.now()};
    return cut;
  }

  function resetGuestForNewRun(hostId,runId,startedAt){
    try{closePc(guestPc);}catch(e){}
    guestPc=null;guestSession='';guestApproved=false;guestApprovedHost='';guestApprovedAt=0;requestOn=false;leaveAnnouncedHost='';guestAliveLastSent=0;guestAliveSharedLastSent=0;
    try{
      window.__ktApprovedGuestIds20260924={};
      window.__ktApprovedGuestNames20260924={};
    }catch(e){}
    try{if(guestStream)guestStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}
    guestStream=null;
    try{window.__ktApprovedGuestSelfStream=null;}catch(e){}
    try{window.__ktDirectGuestUplinkState20260923='closed';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
    try{var b=document.getElementById('ktRemoteGuestRequest');if(b){b.classList.remove('kt-requested');b.style.removeProperty('box-shadow');}}catch(e){}
    try{window.dispatchEvent(new CustomEvent('kt-host-session-reset',{detail:{host_id:String(hostId||''),run_id:String(runId||''),started_at:Number(startedAt||0)}}));}catch(e){}
  }

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  var DEVICE=deviceId();
  function viewerId(){return 'viewer_'+DEVICE;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function profileName(){
    try{if(window.ktProfileLoad){var p=window.ktProfileLoad()||{};return String(p.nickname||p.name||p.displayName||'게스트').slice(0,60);}}catch(e){}
    try{return String(localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'게스트').slice(0,60);}catch(e){}
    return '게스트';
  }
  function roomEl(){return document.querySelector('#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');}
  function isHostRole(){
    try{
      var local=roomEl(),visible=false;
      try{
        if(local){
          var st=getComputedStyle(local);
          visible=st.display!=='none'&&st.visibility!=='hidden'&&(!local.getClientRects||local.getClientRects().length>0);
        }
      }catch(_e){visible=!!local;}
      if(visible){
        try{
          window.__ktRemoteHostId='';
          window.__ktCurrentRemoteHostId='';
          sessionStorage.removeItem('kt_remote_host_id');
        }catch(_e){}
        return true;
      }
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var rh='';
      try{rh=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(_e){}
      if(rh)return false;
      return false;
    }catch(e){return false;}
  }
  function hostStream(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return s;
    }catch(e){}
    try{
      var r=roomEl(),v=r&&r.querySelector('video'),s2=v&&v.srcObject;
      if(s2&&s2.getTracks&&s2.getVideoTracks().some(function(t){return t.readyState==='live';}))return s2;
    }catch(e){}
    return null;
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
  function isRemoteHostMedia20260926(st){
    if(!st)return false;
    try{
      return sameVideoSource20260926(st,window.__ktRemoteHostStream)||
        sameVideoSource20260926(st,window.__ktLastApprovedGuestHostStream);
    }catch(e){return false;}
  }
  function isLocalGuestMedia20260926(st){
    if(!st)return false;
    try{
      return sameVideoSource20260926(st,window.__ktLocalGuestCameraStream20260926)||
        sameVideoSource20260926(st,window.__ktApprovedGuestSelfStream);
    }catch(e){return false;}
  }
  function adoptExistingSelfCamera20260926(){
    try{
      var selectors=[
        '#screen .kt-guest-hostlike-room .kgh-cell.self video',
        '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self video',
        '#screen .kt-prejoin-room-grid .kt-prejoin-room-cell.self video',
        '#screen .kt-guest-room-grid .kt-guest-room-cell.self video'
      ];
      var hostStreams=[];
      try{
        if(window.__ktRemoteHostStream)hostStreams.push(window.__ktRemoteHostStream);
        if(window.__ktLastApprovedGuestHostStream)hostStreams.push(window.__ktLastApprovedGuestHostStream);
      }catch(e){}
      var hostVideos=[].slice.call(document.querySelectorAll(
        '#screen .kt-guest-hostlike-room .kgh-cell.host video,'+
        '#screen .kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '#screen .kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '#screen .kt-guest-room-grid .kt-guest-room-cell.host video'
      ));
      hostVideos.forEach(function(v){try{if(v&&v.srcObject)hostStreams.push(v.srcObject);}catch(e){}});
      for(var i=0;i<selectors.length;i++){
        var v=document.querySelector(selectors[i]);
        var s=v&&v.srcObject||null;
        var vt=s&&s.getVideoTracks&&s.getVideoTracks()[0]||null;
        if(!s||!vt||vt.readyState!=='live')continue;
        var sameHost=hostStreams.some(function(h){return h&&sameVideoSource20260926(s,h);});
        if(sameHost)continue;
        if(rememberTrustedGuestCamera20260926(s)){
          guestStream=s;
          window.__ktApprovedGuestSelfStream=s;
          setTimeout(cacheTrustedGuestPhoto20260926,0);
          return true;
        }
      }
    }catch(e){}
    return false;
  }

  function rememberTrustedGuestCamera20260926(st){
    try{
      var vt=st&&st.getVideoTracks&&st.getVideoTracks()[0]||null;
      if(vt&&vt.readyState==='live'&&vt.id){
        window.__ktLocalGuestCameraStream20260926=st;
        window.__ktLocalGuestCameraTrackId20260926=String(vt.id);
        return true;
      }
    }catch(e){}
    return false;
  }
  function isTrustedGuestCamera20260926(st){
    try{
      var id=String(window.__ktLocalGuestCameraTrackId20260926||'');
      var vt=st&&st.getVideoTracks&&st.getVideoTracks()[0]||null;
      if(!id||!vt||vt.readyState!=='live'||String(vt.id)!==id)return false;
      if(isRemoteHostMedia20260926(st))return false;
      return true;
    }catch(e){return false;}
  }

  function useLegacyApprovedGuestUplink(){
    try{
      return window.__ktGuestRequestFlow20260914===true && typeof window.ktRequestGuestJoin==='function';
    }catch(e){return false;}
  }

  function remoteHostId(){
    var id='';
    try{id=String(window.__ktRemoteHostId||'');}catch(e){}
    if(!id)try{id=String(sessionStorage.getItem('kt_remote_host_id')||'');}catch(e){}
    return id;
  }
  function rtcConfig(){return window.ktGetRtcConfig?window.ktGetRtcConfig():{iceServers:[{urls:'stun:stun.cloudflare.com:3478'},{urls:'stun:stun.l.google.com:19302'}]};}
  async function ensureTurnBeforeGuestRtc20260926(){
    try{
      if(typeof window.ktRefreshTurnRelay!=='function')return;
      var q=window.ktRefreshTurnRelay();
      if(q&&typeof q.then==='function'){
        await Promise.race([
          q,
          new Promise(function(resolve){setTimeout(resolve,45);})
        ]);
      }
    }catch(e){}
  }
  function ktTuneDirectVideoSender20260923(sender,kind){
    try{
      if(!sender||!sender.track||sender.track.kind!=='video'||typeof sender.getParameters!=='function'||typeof sender.setParameters!=='function')return;
      var p=sender.getParameters()||{};
      if(!p.encodings||!p.encodings.length)p.encodings=[{}];
      var guest=(kind==='guest');
      p.encodings.forEach(function(enc){
        enc.maxBitrate=guest?400000:600000;
        enc.maxFramerate=guest?15:18;
        if(!enc.scaleResolutionDownBy||enc.scaleResolutionDownBy<1.20)enc.scaleResolutionDownBy=guest?1.35:1.20;
        try{enc.networkPriority='high';}catch(e){}
      });
      try{p.degradationPreference='balanced';}catch(e){}
      var q=sender.setParameters(p);if(q&&q.catch)q.catch(function(){});
    }catch(e){}
  }
  function sid(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);}
  function channelFor(hostId){return 'ktalk-direct-rtc-'+String(hostId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,110);}
  function restBroadcastToHost20260926(hostId,eventName,payload){
    hostId=String(hostId||activeHostId||'').trim();
    if(!hostId)return Promise.resolve(false);
    var body={messages:[{
      topic:channelFor(hostId),
      event:eventName,
      payload:payload||{}
    }]};
    try{
      return fetch(REST_BROADCAST,{
        method:'POST',
        cache:'no-store',
        keepalive:true,
        headers:{'Content-Type':'application/json','apikey':KEY},
        body:JSON.stringify(body)
      }).then(function(r){return !!(r&&r.ok);}).catch(function(){return false;});
    }catch(e){return Promise.resolve(false);}
  }
  function restBroadcast(eventName,payload){
    return restBroadcastToHost20260926(activeHostId,eventName,payload);
  }

  function send(eventName,payload){
    if(!activeHostId)return;
    payload=payload||{};

    /* 2026-09-24 communication stability:
       Use one signaling path at a time. Supabase WebSocket Broadcast is
       cluster-wide after the channel is joined. REST is fallback only while
       the socket is not joined or if a synchronous WS send throws.
       This prevents duplicate offer/answer/ICE/guest events from racing. */
    if(joined&&ws&&ws.readyState===1){
      try{
        ws.send(JSON.stringify({
          topic:topic,event:'broadcast',
          payload:{type:'broadcast',event:eventName,payload:payload},
          ref:String(seq++),join_ref:joinRef
        }));
        window.__ktSignalTransport20260924='websocket';
        return;
      }catch(e){}
    }
    window.__ktSignalTransport20260924='rest-fallback';
    restBroadcast(eventName,payload);
  }
  function sendCriticalMedia20260926(eventName,payload,hostId){
    /* Communication-only fast path:
       guest approval + guest SDP are tiny and infrequent, so deliver them over
       both joined WebSocket and REST at the same moment. duplicateSignal()
       de-dupes the receiver. ICE candidates remain single-path to avoid floods. */
    try{
      var target=String(hostId||payload&&payload.host_id||activeHostId||'').trim();
      var body=payload||{};
      var dual=(eventName==='guest_approved'||eventName==='guest_offer'||eventName==='guest_answer'||
        eventName==='video_watch'||eventName==='video_offer'||eventName==='video_answer');
      if(!target)return;

      if(target===activeHostId){
        var socketReady=!!(joined&&ws&&ws.readyState===1);
        send(eventName,body);
        if(dual&&socketReady){
          try{restBroadcastToHost20260926(target,eventName,body);}catch(_e){}
        }
        return;
      }

      /* Never temporarily retarget the live WebSocket topic. For another host
         id, use the exact REST topic directly. */
      restBroadcastToHost20260926(target,eventName,body);
    }catch(e){
      try{restBroadcastToHost20260926(hostId||payload&&payload.host_id||activeHostId,eventName,payload||{});}catch(_e){}
    }
  }

  function flush(){
    /* Messages sent during reconnect already used REST fallback.
       Do not replay them after WS join, which used to duplicate signaling. */
    queue.length=0;
  }

  function sharedApprovalPost(hostId,type,vid,name){
    hostId=String(hostId||'').trim();
    vid=String(vid||'').trim();
    if(!hostId||!vid)return Promise.resolve(false);
    var payload={
      action:'message',
      host_id:hostId,
      sender_id:vid,
      sender_name:String(name||'게스트').slice(0,100),
      message:type.indexOf('approved')>-1?'참여 승인':(type.indexOf('cancelled')>-1?'참여 신청 취소':(type.indexOf('left')>-1?'방송 나감':(type.indexOf('alive')>-1?'방송 참여 유지':'방송 참여 신청'))),
      message_type:type+':'+vid
    };
    try{
      return fetch('/api/live-interaction-memory?t='+Date.now(),{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      }).then(function(r){return !!(r&&r.ok);}).catch(function(){return false;});
    }catch(e){return Promise.resolve(false);}
  }

  function sharedMsgTime(m){
    var t=Date.parse(String(m&&m.created_at||''));return isFinite(t)?t:0;
  }

  function clearApprovedGuestFromHost(vid){
    vid=String(vid||'').trim();
    if(!vid)return;
    delete pendingRequests[vid];
    delete approvedGuests[vid];
    delete pendingGuestPhotos20260926[vid];
    delete guestJoinNumber20260926[vid];
    try{
      delete window.__ktApprovedGuestIds20260924[vid];
      if(window.__ktApprovedGuestNames20260924)delete window.__ktApprovedGuestNames20260924[vid];
    }catch(e){}
    delete hostGuestAliveAt[vid];
    delete pendingHostGuestOffers[vid];
    Object.keys(pendingHostGuestIce).forEach(function(k){
      if(k.indexOf(vid+'|')===0)delete pendingHostGuestIce[k];
    });

    var hp=hostGuestPeers[vid];
    if(hp){try{closePc(hp.pc);}catch(e){}delete hostGuestPeers[vid];}

    var slots=[];
    try{
      slots=[].slice.call(document.querySelectorAll(
        '[data-kt-direct-guest="'+CSS.escape(vid)+'"],'+
        '[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]'
      ));
    }catch(e){}

    slots.forEach(function(slot){
      try{
        var v=slot.querySelector('video');
        if(v){try{v.pause();}catch(e){}v.srcObject=null;}
        delete slot.dataset.ktDirectGuest;
        delete slot.dataset.ktGuestViewerId;
        slot.classList.remove('kt-guest-approved');

        if(slot.classList.contains('ktg13-guest')){
          slot.innerHTML='<span>게스트</span>';
        }else if(slot.classList.contains('ktsubscriber-guest')){
          var n=String(slot.getAttribute('data-guest-slot')||'').trim();
          slot.innerHTML='<span>👤</span><b>게스트'+(n?' '+n:'')+'</b>';
        }else if(slot.classList.contains('ktsecret-guest-slot')){
          var empty=slot.querySelector('.ktsecret-guest-empty');
          var name=slot.querySelector('.ktsecret-guest-name');
          if(empty)empty.style.display='';
          if(name)name.textContent='게스트';
        }else{
          var sm=slot.querySelector('small');if(sm){sm.style.display='';sm.textContent='게스트';}
          var nm=slot.querySelector('.kt-guest-name');if(nm)nm.textContent='게스트';
        }
      }catch(e){}
    });

    renderDirectRequests();
  }

  window.ktDirectEndAllGuestSessions20260923=function(){
    if(!isHostRole())return false;
    var ids={};
    Object.keys(approvedGuests).forEach(function(id){ids[id]=1;});
    Object.keys(pendingRequests).forEach(function(id){ids[id]=1;});
    Object.keys(hostGuestPeers).forEach(function(id){ids[id]=1;});

    Object.keys(ids).forEach(function(vid){
      var nm=(approvedGuests[vid]&&approvedGuests[vid].name)||(pendingRequests[vid]&&pendingRequests[vid].name)||'게스트';
      try{sharedApprovalPost(DEVICE,'guest_left',vid,nm);}catch(e){}
      try{send('guest_left',{host_id:DEVICE,viewer_id:vid,name:nm,at:Date.now(),broadcast_end:true});}catch(e){}
      try{clearApprovedGuestFromHost(vid);}catch(e){}
    });

    Object.keys(hostViewPeers).forEach(function(id){
      try{closePc(hostViewPeers[id]&&hostViewPeers[id].pc);}catch(e){}
    });
    hostViewPeers={};
    pendingRequests={};
    approvedGuests={};
    hostGuestPeers={};
    hostGuestAliveAt={};
    try{send('broadcast_ended',{host_id:DEVICE,run_id:hostRunId,run_started_at:hostRunStartedAt,at:Date.now()});}catch(e){}
    return true;
  };

  /* Host rapid-restart cleanup (2026-09-24):
     an explicit broadcast end must mark the host run ended immediately.
     Otherwise a new room opened within the 12s viewer grace can inherit
     the previous approved guest/video slots. */
  window.ktDirectHostRunEnded20260924=function(){
    try{
      if(typeof window.ktDirectEndAllGuestSessions20260923==='function'){
        window.ktDirectEndAllGuestSessions20260923();
      }
    }catch(e){}
    Object.keys(hostViewPeers).forEach(function(id){
      try{closePc(hostViewPeers[id]&&hostViewPeers[id].pc);}catch(e){}
    });
    hostViewPeers={};
    pendingRequests={};
    approvedGuests={};
    hostGuestPeers={};
    hostGuestAliveAt={};
    pendingHostGuestOffers={};
    pendingHostGuestIce={};
    resetGuestJoinNumbers20260926();
    lastHostRole='';
    hostRunId='';
    hostRunStartedAt=0;
    lastHostReadyAt=0;
    sharedRuntimeStartedAt=Date.now();
    sharedRoomCutCache={};
    try{window.__ktApprovedGuestIds20260924={};}catch(e){}
    try{
      window.__ktHostRunId20260924='';
      window.__ktHostRunStartedAt20260924=0;
    }catch(e){}
    try{
      window.dispatchEvent(new CustomEvent('kt-host-session-reset',{
        detail:{host_id:DEVICE,run_id:'',started_at:Date.now(),ended:true}
      }));
    }catch(e){}
    return true;
  };

  function postGuestLeaveShared(hostId){
    hostId=String(hostId||'').trim();
    if(!hostId)return;
    var vid=viewerId(),name=profileName();
    var payload={
      action:'message',
      host_id:hostId,
      sender_id:vid,
      sender_name:name,
      message:'방송 나감',
      message_type:'guest_left:'+vid
    };
    try{
      fetch('/api/live-interaction-memory?t='+Date.now(),{
        method:'POST',
        cache:'no-store',
        keepalive:true,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
      }).catch(function(){});
    }catch(e){}
  }

  function announceGuestLeave(hostId){
    hostId=String(hostId||guestApprovedHost||remoteHostId()||lastRemoteHost||'').trim();
    if(!hostId||leaveAnnouncedHost===hostId)return;
    leaveAnnouncedHost=hostId;
    var vid=viewerId(),data={host_id:hostId,viewer_id:vid,name:profileName(),at:Date.now()};
    /* Explicit leave is authoritative: send over realtime + REST immediately,
       then repeat briefly so every phone removes the guest slot without waiting. */
    try{sendCriticalMedia20260926('guest_left',data,hostId);}catch(e){}
    [70,180].forEach(function(ms){
      setTimeout(function(){try{sendCriticalMedia20260926('guest_left',data,hostId);}catch(_e){}},ms);
    });
    postGuestLeaveShared(hostId);
    try{
      delete window.__ktApprovedGuestIds20260924[vid];
      if(window.__ktApprovedGuestNames20260924)delete window.__ktApprovedGuestNames20260924[vid];
      window.dispatchEvent(new CustomEvent('kt-any-guest-left',{detail:{
        host_id:hostId,viewer_id:vid,at:Date.now(),explicit:true
      }}));
    }catch(e){}
    try{closePc(guestPc);}catch(e){}
    guestPc=null;guestSession='';guestApproved=false;guestApprovedHost='';requestOn=false;
    try{
      if(guestStream){guestStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}
    }catch(e){}
    guestStream=null;
  }

  window.ktDirectGuestLeaveNow20260923=function(hostId){
    var hid=String(hostId||guestApprovedHost||remoteHostId()||lastRemoteHost||'').trim();
    if(!hid)return false;
    announceGuestLeave(hid);
    return true;
  };

  /* Viewer leave/re-entry cleanup (2026-09-24):
     close the old receive/uplink transports immediately instead of waiting for
     the 12s missing-host grace period. This prevents an old black/stale guest
     session from being reused when the same phone enters the room again. */
  window.ktDirectRemoteLeaveNow20260924=function(hostId){
    var hid=String(hostId||guestApprovedHost||remoteHostId()||lastRemoteHost||activeHostId||'').trim();
    try{if(hid)announceGuestLeave(hid);}catch(e){}
    clearViewerConnectTimer();
    try{closePc(viewerPc);}catch(e){}
    try{closePc(guestPc);}catch(e){}
    viewerPc=null;viewerSession='';viewerWatchToken='';viewerConnected=false;viewerIce={};
    guestPc=null;guestSession='';guestApproved=false;guestApprovedHost='';guestApprovedAt=0;guestIce={};
    requestOn=false;leaveAnnouncedHost='';guestAliveLastSent=0;guestAliveSharedLastSent=0;
    remoteRunId='';remoteRunStartedAt=0;remoteHostMissingSince=0;
    try{window.__ktRemoteHostStream=null;}catch(e){}
    try{window.__ktUseMemoryGuestVideo20260922=false;}catch(e){}
    lastRemoteHost='';
    activeHostId='';
    try{closeSocket();}catch(e){}
    return true;
  };

  async function syncSharedApprovalSignals(){
    if(sharedApprovalPollBusy)return;
    var host=isHostRole(),hid=host?DEVICE:remoteHostId();
    if(!hid)return;
    sharedApprovalPollBusy=true;
    try{
      var r=await fetch('/api/live-interaction-memory?action=messages&host_id='+encodeURIComponent(hid)+'&t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      var j=await r.json(),rows=Array.isArray(j&&j.messages)?j.messages:[];
      /* 이전 방송의 참여 신청/승인 기록이 30분 캐시에 남아 있으면
         새 방송에서 사용자가 신청하지 않았는데도 게스트 영상이 자동 복원될 수 있다.
         현재 활성 방송 시작 이후 신호만 인정한다. DB 조회가 잠시 실패하면
         이 브라우저가 열린 시점 이후 신호만 인정해서 오래된 승인을 자동 복구하지 않는다. */
      var roomCut=await sharedCurrentRoomCutoff(hid);
      var runCut=host?Number(hostRunStartedAt||0):Number(remoteRunStartedAt||0);
      var effectiveCut=Math.max(Number(roomCut||0),Number(runCut||0));
      rows=rows.filter(function(m){return sharedMsgTime(m)>=effectiveCut;});
      if(host){
        /* Host may restore a guest only when THIS run contains both:
           request -> approval. A stale approval/alive by itself must never
           create a guest slot before the user requests to join. */
        var states={};
        rows.forEach(function(m){
          var t=String(m.message_type||''),vid='',kind='';
          if(t.indexOf('guest_request:')===0){vid=t.slice(14);kind='request';}
          else if(t.indexOf('guest_cancelled:')===0){vid=t.slice(16);kind='end';}
          else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);kind='approved';}
          else if(t.indexOf('guest_alive:')===0){vid=t.slice(12);kind='alive';}
          else if(t.indexOf('guest_left:')===0){vid=t.slice(11);kind='end';}
          if(!vid)return;
          var ts=sharedMsgTime(m);
          var x=states[vid]||(states[vid]={request:0,approved:0,end:0,alive:0,name:'게스트'});
          if(kind==='request'){
            if(ts>=x.request){x.request=ts;x.name=String(m.sender_name||x.name||'게스트');}
          }else if(kind==='approved'){
            if(ts>=x.approved){x.approved=ts;x.name=String(m.sender_name||x.name||'게스트');}
          }else if(kind==='alive'){
            if(ts>=x.alive)x.alive=ts;
          }else if(kind==='end'){
            if(ts>=x.end)x.end=ts;
          }
        });

        Object.keys(states).forEach(function(vid){
          var x=states[vid];
          var requested=!!(x.request&&x.request>x.end);
          var active=!!(requested&&x.approved>=x.request&&x.approved>x.end);

          if(active){
            delete pendingRequests[vid];
            if(!approvedGuests[vid])approvedGuests[vid]={name:x.name||'게스트',at:x.approved||Date.now()};
            try{
              window.__ktApprovedGuestIds20260924[vid]=true;
              window.__ktApprovedGuestNames20260924=window.__ktApprovedGuestNames20260924||{};
              window.__ktApprovedGuestNames20260924[vid]=String(x.name||'게스트');
            }catch(e){}
            try{guestSlot(vid,x.name||'게스트');}catch(e){}
            hostGuestAliveAt[vid]=Math.max(
              Number(hostGuestAliveAt[vid]||0),
              Number(x.alive||0),
              Number(x.approved||0)
            );
            replayPendingHostGuestOffer(vid);
            return;
          }

          /* A current request without approval is only pending; do not raise a slot. */
          if(requested){
            if(!approvedGuests[vid])pendingRequests[vid]={name:x.name||'게스트',at:x.request||Date.now()};
            return;
          }

          delete pendingRequests[vid];

          /* Never recreate a guest from stale approval/alive. Only an explicit
             current leave/cancel tears down a guest that is already live. */
          if(approvedGuests[vid]&&x.end&&x.end>=Number(approvedGuests[vid].at||0)){
            delete hostGuestAliveAt[vid];
            clearApprovedGuestFromHost(vid);
          }
        });

        var now=Date.now();
        Object.keys(approvedGuests).forEach(function(vid){
          var seen=Number(hostGuestAliveAt[vid]||0);
          if(!seen)return;
          if(useLegacyApprovedGuestUplink())return;
          if(now-seen>45000){
            var entry=hostGuestPeers[vid]||null;
            var pc=entry&&entry.pc||null;
            var cs='',is='';
            try{cs=String(pc&&pc.connectionState||'');is=String(pc&&pc.iceConnectionState||'');}catch(e){}
            if(cs==='connected'||is==='connected'||is==='completed'){
              hostGuestAliveAt[vid]=now;
              return;
            }
            if(now-seen<90000){
              var ap=approvedGuests[vid];
              if(ap)send('guest_approved',{host_id:DEVICE,viewer_id:vid,name:ap.name||'게스트',guest_no:Number(guestJoinNumber20260926[vid]||0),at:now,reconnect:true});
              return;
            }
            delete hostGuestAliveAt[vid];
            clearApprovedGuestFromHost(vid);
          }
        });
        renderDirectRequests();
      }else{
        var vid=viewerId(),states={};
        rows.forEach(function(m){
          var t=String(m.message_type||''),ts=sharedMsgTime(m),id='',kind='';
          if(t.indexOf('guest_request:')===0){id=t.slice(14);kind='request';}
          else if(t.indexOf('guest_approved:')===0){id=t.slice(15);kind='approved';}
          else if(t.indexOf('guest_cancelled:')===0){id=t.slice(16);kind='end';}
          else if(t.indexOf('guest_left:')===0){id=t.slice(11);kind='end';}
          if(!id)return;
          var x=states[id]||(states[id]={request:0,approved:0,end:0,name:'게스트'});
          if(kind==='request'){
            if(ts>=x.request){x.request=ts;x.name=String(m.sender_name||x.name||'게스트');}
          }else if(kind==='approved'){
            if(ts>=x.approved)x.approved=ts;
          }else if(kind==='end'){
            if(ts>=x.end)x.end=ts;
          }
        });

        var roster=window.__ktApprovedGuestIds20260924||{};
        var names=window.__ktApprovedGuestNames20260924||{};
        Object.keys(states).forEach(function(id){
          var x=states[id];
          var active=!!(x.request&&x.approved>=x.request&&x.approved>x.end);
          if(active){
            var was=roster[id]===true;
            roster[id]=true;
            names[id]=String(x.name||names[id]||'게스트');
            if(!was){
              try{window.dispatchEvent(new CustomEvent('kt-any-guest-approved',{detail:{
                host_id:hid,viewer_id:id,name:names[id],at:x.approved||Date.now(),fallback:true
              }}));}catch(e){}
            }
          }else if(roster[id]===true){
            delete roster[id];delete names[id];
            try{window.dispatchEvent(new CustomEvent('kt-any-guest-left',{detail:{
              host_id:hid,viewer_id:id,at:Date.now(),fallback:true
            }}));}catch(e){}
          }
        });
        window.__ktApprovedGuestIds20260924=roster;
        window.__ktApprovedGuestNames20260924=names;

        var self=states[vid]||null;
        if(self&&self.request&&self.approved>=self.request&&self.approved>self.end&&!guestApproved){
          onGuestApproved({host_id:hid,viewer_id:vid,name:String(self.name||'게스트'),at:self.approved});
        }
        if(roster[vid]===true){
          try{
            if(typeof window.ktForceApprovedGuestGridNow20260924==='function'){
              window.ktForceApprovedGuestGridNow20260924();
            }
          }catch(e){}
        }
      }
    }catch(e){}finally{sharedApprovalPollBusy=false;}
  }
  function closeSocket(){
    joined=false;
    if(heartbeatTimer){clearInterval(heartbeatTimer);heartbeatTimer=null;}
    try{if(ws)ws.close();}catch(e){}
    ws=null;
  }
  function scheduleReconnect(){
    if(reconnectTimer)return;
    reconnectFailures=Math.min(6,Number(reconnectFailures||0)+1);
    var delay=Math.min(3000,250*Math.pow(2,Math.max(0,reconnectFailures-1)));
    reconnectTimer=setTimeout(function(){reconnectTimer=null;if(activeHostId)connect(activeHostId);},delay);
  }
  function connect(hostId){
    hostId=String(hostId||'');if(!hostId)return;
    if(activeHostId===hostId&&ws&&(ws.readyState===0||ws.readyState===1))return;
    activeHostId=hostId;topic='realtime:'+channelFor(hostId);queue=[];
    closeSocket();
    try{
      ws=new WebSocket('wss://'+REF+'.supabase.co/realtime/v1/websocket?apikey='+encodeURIComponent(KEY)+'&vsn=1.0.0');
      ws.onopen=function(){
        joinRef=String(seq++);
        ws.send(JSON.stringify({
          topic:topic,event:'phx_join',
          payload:{config:{broadcast:{ack:false,self:false},presence:{enabled:false},postgres_changes:[],private:false}},
          ref:joinRef,join_ref:joinRef
        }));
        heartbeatTimer=setInterval(function(){
          if(ws&&ws.readyState===1){
            try{ws.send(JSON.stringify({topic:'phoenix',event:'heartbeat',payload:{},ref:String(seq++),join_ref:null}));}catch(e){}
          }
        },20000);
      };
      ws.onmessage=function(ev){
        var m=null;try{m=JSON.parse(ev.data);}catch(e){return;}
        if(!m||m.topic!==topic)return;
        if(m.event==='phx_reply'&&String(m.ref||'')===String(joinRef)){
          joined=!!(m.payload&&m.payload.status==='ok');
          if(joined){reconnectFailures=0;flush();afterJoin();}
          return;
        }
        if(m.event==='broadcast'){
          var p=m.payload||{};handleSignal(String(p.event||''),p.payload||{});
        }
      };
      ws.onerror=function(){};
      ws.onclose=function(){joined=false;scheduleReconnect();};
    }catch(e){scheduleReconnect();}
  }

  function afterJoin(){
    if(isHostRole()){
      if(!hostRunId){hostRunId=sid('run');hostRunStartedAt=Date.now();}
      send('host_ready',{host_id:DEVICE,run_id:hostRunId,run_started_at:hostRunStartedAt,at:Date.now()});
      renderDirectRequests();
    }else{
      var hid=remoteHostId();
      if(hid===activeHostId){
        ensureViewerWatch(true);
        if(requestOn)send('guest_request',{host_id:hid,viewer_id:viewerId(),name:profileName(),at:Date.now()});
      }
    }
  }

  function attachRemoteStreamNow(stream){
    stream=stream||window.__ktRemoteHostStream||null;
    if(!stream)return false;
    /* Never paint this phone's own guest camera into the host cell. */
    if(isLocalGuestMedia20260926(stream)){
      try{
        if(sameVideoSource20260926(window.__ktRemoteHostStream,stream))window.__ktRemoteHostStream=null;
        if(sameVideoSource20260926(window.__ktLastApprovedGuestHostStream,stream))window.__ktLastApprovedGuestHostStream=null;
      }catch(e){}
      return false;
    }

    var targets=[];
    function add(v){if(v&&targets.indexOf(v)<0)targets.push(v);}

    /* Guest layouts rename/move the real host video after room entry/approval. */
    add(document.getElementById('ktRemoteHostPreview'));
    try{
      document.querySelectorAll(
        '.kt-guest-hostlike-room .kgh-cell.host video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '.kt-guest-room-grid .kt-guest-room-cell.host video'
      ).forEach(add);
    }catch(e){}

    var main=document.getElementById('ktRemoteLiveVideo');
    var self=window.__ktApprovedGuestSelfStream||null;
    var mainIsSelf=false;
    try{
      mainIsSelf=!!(main&&main.closest&&main.closest(
        '.kt-guest-hostlike-room .kgh-cell.self,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.self,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.self,'+
        '.kt-guest-room-grid .kt-guest-room-cell.self'
      ));
    }catch(e){}
    if(main&&!mainIsSelf&&(!self||main.srcObject!==self))add(main);

    if(!targets.length)return false;

    targets.forEach(function(v){
      try{
        if(v.srcObject!==stream)v.srcObject=stream;
        v.autoplay=true;
        v.playsInline=true;
        /* Keep remote host muted so mobile autoplay cannot be blocked. */
        v.muted=true;
        v.defaultMuted=true;
        v.setAttribute('autoplay','');
        v.setAttribute('playsinline','');
        v.setAttribute('muted','');
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }catch(e){}
    });

    var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';
    var badge=document.getElementById('ktRemoteViewerCount');if(badge)badge.textContent='👁 LIVE';
    return true;
  }
  function showRemoteStream(stream){
    if(!stream||isLocalGuestMedia20260926(stream))return;
    window.__ktRemoteHostStream=stream;
    window.__ktLastApprovedGuestHostStream=stream;
    attachRemoteStreamNow(stream);
  }
  function ktRemoteStreamStillLive20260923(){
    try{
      var s=window.__ktRemoteHostStream;
      if(!s||!s.getVideoTracks)return false;
      return s.getVideoTracks().some(function(t){return t&&t.readyState==='live';});
    }catch(e){return false;}
  }
  function showConnecting(){
    var st=document.getElementById('ktRemoteLiveStatus');
    if(st){st.style.display='block';st.textContent='방송 영상 연결 중...';}
  }
  function clearViewerConnectTimer(){
    if(viewerConnectTimer){clearTimeout(viewerConnectTimer);viewerConnectTimer=null;}
  }
  function closePc(pc){try{if(pc)pc.close();}catch(e){}}
  function retryViewerSoon(delay){
    clearViewerConnectTimer();
    viewerConnectTimer=setTimeout(function(){
      viewerConnectTimer=null;
      if(viewerConnected)return;
      if(viewerPc){closePc(viewerPc);viewerPc=null;}
      viewerSession='';viewerAnswerSdp='';
      viewerWatchToken=sid('watch');
      lastWatchAt=0;
      showConnecting();
      ensureViewerWatch(true);
    },Math.max(180,Number(delay||1200)));
  }

  async function hostOfferToViewer(vid,watchToken){
    if(!isHostRole())return;
    var stream=hostStream();if(!stream)return;
    var old=hostViewPeers[vid];
    if(old&&old.watchToken===watchToken&&old.pc&&['new','connecting','connected'].indexOf(String(old.pc.connectionState||''))>-1){
      if(old.offer)send('video_offer',{host_id:DEVICE,viewer_id:vid,session_id:old.sid,watch_token:watchToken,offer_sdp:old.offer});
      return;
    }
    if(old){closePc(old.pc);delete hostViewPeers[vid];}
    var pc=new RTCPeerConnection(rtcConfig()),session=sid('view');
    var entry={pc:pc,sid:session,watchToken:watchToken,offer:'',ice:[]};hostViewPeers[vid]=entry;
    stream.getTracks().forEach(function(t){
      try{
        var sender=pc.addTrack(t,stream);
        if(t&&t.kind==='video')ktTuneDirectVideoSender20260923(sender,'host');
      }catch(e){}
    });
    pc.onicecandidate=function(ev){
      if(ev.candidate)sendCriticalMedia20260926('video_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate},DEVICE);
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='failed'||st==='closed'){if(hostViewPeers[vid]===entry)delete hostViewPeers[vid];}
      if(st==='disconnected')setTimeout(function(){
        if(hostViewPeers[vid]===entry&&pc.connectionState==='disconnected'){
          closePc(pc);delete hostViewPeers[vid];
        }
      },15000);
    };
    try{
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
      await pc.setLocalDescription(offer);
      entry.offer=pc.localDescription.sdp;
      var firstOffer={host_id:DEVICE,viewer_id:vid,session_id:session,watch_token:watchToken,offer_sdp:entry.offer};
      sendCriticalMedia20260926('video_offer',firstOffer,DEVICE);
      /* Communication speed only: repeat the SAME first offer briefly so a
         missed mobile packet does not add several seconds. */
      [20,60,140,300].forEach(function(ms){
        setTimeout(function(){
          if(hostViewPeers[vid]!==entry||entry.pc.currentRemoteDescription)return;
          sendCriticalMedia20260926('video_offer',firstOffer,DEVICE);
        },ms);
      });
    }catch(e){closePc(pc);delete hostViewPeers[vid];}
  }

  async function viewerHandleOffer(p){
    if(String(p.viewer_id||'')!==viewerId())return;
    var hid=remoteHostId();if(!hid||String(p.host_id||'')!==hid)return;
    var session=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!session||!sdp)return;
    if(viewerSession===session&&viewerPc&&viewerPc.currentRemoteDescription){
      if(viewerAnswerSdp){
        sendCriticalMedia20260926('video_answer',{host_id:hid,viewer_id:viewerId(),session_id:session,answer_sdp:viewerAnswerSdp},hid);
      }
      return;
    }
    if(viewerOfferInFlight===session)return;
    viewerOfferInFlight=session;

    /* 재연결용 새 offer가 와도 기존 영상부터 끊지 않는다.
       새 PeerConnection이 실제 영상 트랙을 받을 때까지 이전 연결/화면을 유지해
       신호가 잠깐 흔들릴 때 검은 화면으로 바뀌는 시간을 줄인다. */
    var previousPc=viewerPc;
    var previousSession=viewerSession;
    var previousUsable=!!(previousPc&&String(previousPc.connectionState||'')!=='failed'&&String(previousPc.connectionState||'')!=='closed'&&ktRemoteStreamStillLive20260923());
    if(viewerSession!==session)viewerAnswerSdp='';
    viewerSession=session;
    if(!previousUsable){viewerConnected=false;showConnecting();}
    window.__ktDirectRtcProgressAt=Date.now();
    window.__ktDirectRtcPhase='offer';
    var pc=new RTCPeerConnection(rtcConfig());viewerPc=pc;
    pc.ontrack=function(ev){
      try{window.__ktUseMemoryGuestVideo20260922=false;}catch(e){}
      pc.__ktGotRemoteTrack20260923=true;
      viewerConnected=true;
      window.__ktDirectRtcProgressAt=Date.now();
      window.__ktDirectRtcPhase='connected';
      clearViewerConnectTimer();
      showRemoteStream((ev.streams&&ev.streams[0])||new MediaStream([ev.track]));

      /* 새 영상이 화면에 붙은 뒤에만 이전 PeerConnection을 닫는다. */
      if(previousPc&&previousPc!==pc){
        setTimeout(function(){try{closePc(previousPc);}catch(e){}},120);
      }
    };
    pc.onicecandidate=function(ev){
      if(ev.candidate)sendCriticalMedia20260926('video_ice',{host_id:hid,viewer_id:viewerId(),session_id:session,from:'viewer',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate},hid);
    };
    pc.__ktViewerIceRecovery20260923=true;
    pc.oniceconnectionstatechange=function(){
      var s=String(pc.iceConnectionState||'');
      if(s==='failed'&&viewerPc===pc){
        window.__ktDirectRtcProgressAt=Date.now();
        window.__ktDirectRtcPhase='failed';
        closePc(pc);
        if(previousUsable&&previousPc&&String(previousPc.connectionState||'')!=='closed'){
          viewerPc=previousPc;
          viewerSession=previousSession;
          viewerConnected=true;
          attachRemoteStreamNow();
        }else{
          viewerPc=null;viewerSession='';viewerConnected=false;viewerWatchToken=sid('watch');showConnecting();
          setTimeout(function(){ensureViewerWatch(true);},220);
        }
      }
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='connected'){
        viewerConnected=true;
        clearViewerConnectTimer();
        var x=document.getElementById('ktRemoteLiveStatus');if(x)x.style.display='none';
      }
      if(st==='failed'||st==='closed'){
        if(viewerPc===pc){
          window.__ktDirectRtcProgressAt=Date.now();
          window.__ktDirectRtcPhase=st;
          if(previousUsable&&previousPc&&String(previousPc.connectionState||'')!=='closed'){
            viewerPc=previousPc;
            viewerSession=previousSession;
            viewerConnected=true;
            attachRemoteStreamNow();
          }else{
            viewerConnected=false;viewerPc=null;viewerSession='';viewerWatchToken=sid('watch');showConnecting();
            setTimeout(function(){ensureViewerWatch(true);},180);
          }
        }
      }
      if(st==='disconnected'){
        window.__ktDirectRtcProgressAt=Date.now();
        window.__ktDirectRtcPhase='disconnected';

        /* Keep the current frame, but start a parallel reconnect quickly on
           mobile Wi-Fi/5G handoff instead of waiting ten seconds. */
        setTimeout(function(){
          if(viewerPc===pc&&pc.connectionState==='disconnected'){
            viewerWatchToken=sid('watch');
            lastWatchAt=0;
            ensureViewerWatch(true);
          }
        },2500);

        /* Only tear down the old path if the faster parallel reconnect still
           has not recovered the transport. */
        setTimeout(function(){
          if(viewerPc===pc&&pc.connectionState==='disconnected'){
            closePc(pc);viewerPc=null;viewerSession='';viewerConnected=false;viewerWatchToken=sid('watch');showConnecting();
            setTimeout(function(){ensureViewerWatch(true);},180);
          }
        },12000);
      }
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=viewerIce[session]||[];viewerIce[session]=[];
      for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();await pc.setLocalDescription(ans);
      window.__ktDirectRtcProgressAt=Date.now();
      window.__ktDirectRtcPhase='answer-sent';
      viewerAnswerSdp=pc.localDescription.sdp;
      var firstAnswer={host_id:hid,viewer_id:viewerId(),session_id:session,answer_sdp:viewerAnswerSdp};
      sendCriticalMedia20260926('video_answer',firstAnswer,hid);
      /* Communication speed only: repeat the SAME first answer briefly. */
      [20,60,140,300].forEach(function(ms){
        setTimeout(function(){
          if(viewerPc!==pc||viewerSession!==session||viewerConnected)return;
          sendCriticalMedia20260926('video_answer',firstAnswer,hid);
        },ms);
      });

      /* 기존 영상이 살아 있으면 새 연결 확인 동안 화면을 유지한다.
         기존 영상이 없는 최초 연결은 빠르게 재시도한다. */
      if(!previousUsable)retryViewerSoon(420);
      else setTimeout(function(){
        if(viewerPc===pc&&!pc.__ktGotRemoteTrack20260923&&pc.connectionState!=='connected'){
          try{closePc(pc);}catch(e){}
          viewerPc=previousPc;
          viewerSession=previousSession;
          viewerConnected=true;
          attachRemoteStreamNow();
        }
      },4500);
    }catch(e){
      closePc(pc);
      if(viewerPc===pc){
        if(previousUsable&&previousPc&&String(previousPc.connectionState||'')!=='closed'){
          viewerPc=previousPc;
          viewerSession=previousSession;
          viewerConnected=true;
          attachRemoteStreamNow();
        }else{
          viewerPc=null;viewerSession='';viewerConnected=false;
          retryViewerSoon(420);
        }
      }
    }finally{
      if(viewerOfferInFlight===session)viewerOfferInFlight='';
    }
  }

  async function hostHandleAnswer(p){
    if(!isHostRole()||String(p.host_id||'')!==DEVICE)return;
    var vid=String(p.viewer_id||''),entry=hostViewPeers[vid];if(!entry||entry.sid!==String(p.session_id||''))return;
    try{
      if(!entry.pc.currentRemoteDescription)await entry.pc.setRemoteDescription({type:'answer',sdp:String(p.answer_sdp||'')});
      var q=entry.ice.splice(0);for(var i=0;i<q.length;i++)try{await entry.pc.addIceCandidate(q[i]);}catch(e){}
    }catch(e){}
  }

  async function handleVideoIce(p){
    var session=String(p.session_id||''),cand=p.candidate;if(!session||!cand)return;
    if(String(p.from||'')==='host'&&String(p.viewer_id||'')===viewerId()){
      if(viewerPc&&viewerSession===session&&viewerPc.remoteDescription){try{await viewerPc.addIceCandidate(cand);}catch(e){}}
      else{if(!viewerIce[session])viewerIce[session]=[];viewerIce[session].push(cand);}
    }else if(String(p.from||'')==='viewer'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      var e=hostViewPeers[String(p.viewer_id||'')];if(!e||e.sid!==session)return;
      if(e.pc.remoteDescription){try{await e.pc.addIceCandidate(cand);}catch(z){}}
      else e.ice.push(cand);
    }
  }

  function ensureViewerWatch(force){
    var hid=remoteHostId();if(!hid||isHostRole())return;
    if(!viewerWatchToken)viewerWatchToken=sid('watch');
    var now=Date.now();
    if(!force&&viewerConnected)return;
    if(!force&&now-lastWatchAt<120)return;
    lastWatchAt=now;
    sendCriticalMedia20260926('video_watch',{host_id:hid,viewer_id:viewerId(),watch_token:viewerWatchToken,at:now},hid);
  }

  function ensureDirectStyle(){
    if(document.getElementById('ktDirectGuestTransportStyle'))return;
    var s=document.createElement('style');s.id='ktDirectGuestTransportStyle';
    s.textContent='#ktDirectGuestRequestRail{position:absolute!important;left:44%!important;right:4px!important;bottom:4px!important;z-index:2147482000!important;display:flex!important;gap:5px!important;overflow-x:auto!important;padding:3px!important;pointer-events:auto!important}#ktDirectGuestRequestRail button{flex:0 0 auto!important;min-width:86px!important;height:34px!important;border:1px solid #62d8ff!important;border-radius:18px!important;background:rgba(6,18,28,.96)!important;color:#fff!important;padding:0 10px!important;font-size:9px!important;font-weight:950!important;box-shadow:0 0 9px #38cfff55!important}';
    document.head.appendChild(s);
  }
  function requestMount(){
    return document.querySelector(
      '#screen .ktg13-room .ktg13-main,'+
      '#screen .ktsolo-room .ktsolo-main,'+
      '#screen .ktsubscriber-room .ktsubscriber-people,'+
      '#screen .ktsecret-room .ktsecret-main'
    );
  }
  function renderDirectRequests(){
    ensureDirectStyle();
    var main=requestMount();
    if(!main){var o=document.getElementById('ktDirectGuestRequestRail');if(o)o.remove();return;}
    try{
      if(getComputedStyle(main).position==='static')main.style.setProperty('position','relative','important');
    }catch(e){}
    var ids=Object.keys(pendingRequests).filter(function(id){return !approvedGuests[id];});
    var rail=document.getElementById('ktDirectGuestRequestRail');
    if(!ids.length){if(rail)rail.remove();return;}
    if(!rail){
      rail=document.createElement('div');
      rail.id='ktDirectGuestRequestRail';
      main.appendChild(rail);
    }else if(rail.parentNode!==main){
      main.appendChild(rail);
    }
    rail.innerHTML='';
    ids.forEach(function(id){
      var x=pendingRequests[id],b=document.createElement('button');b.type='button';b.dataset.viewerId=id;b.dataset.viewerName=String(x.name||'게스트');b.textContent='👤 '+String(x.name||'게스트')+' 올리기';
      /* Use one approval handler for pointerdown/touch/click.
         It sends the realtime approval first and defers the legacy durable path. */
      b.onclick=forceApprovalTap;
      rail.appendChild(b);
    });
  }
  function resetDuplicateGuestSlot(slot,vid){
    if(!slot)return;
    try{
      var v=slot.querySelector('video');
      if(v){try{v.pause();}catch(e){}v.srcObject=null;}
      if(String(slot.dataset.ktDirectGuest||'')===String(vid||''))delete slot.dataset.ktDirectGuest;
      if(String(slot.dataset.ktGuestViewerId||'')===String(vid||''))delete slot.dataset.ktGuestViewerId;
      delete slot.dataset.ktGuestJoinNumber;
      slot.classList.remove('kt-guest-approved');
      slot.innerHTML='<span>게스트</span>';
    }catch(e){}
  }

  function guestJoinNo20260926(vid){
    vid=String(vid||'').trim();
    if(!vid)return 0;
    var old=Number(guestJoinNumber20260926[vid]||0);
    if(old>=1&&old<=15)return old;
    var used={};
    Object.keys(guestJoinNumber20260926).forEach(function(id){
      var n=Number(guestJoinNumber20260926[id]||0);
      if(n>=1&&n<=15)used[n]=true;
    });
    for(var i=1;i<=15;i++){
      if(!used[i]){
        guestJoinNumber20260926[vid]=i;
        return i;
      }
    }
    return 0;
  }
  function guestSlot(vid,name){
    var slot=null,matches=[];
    try{
      matches=[].slice.call(document.querySelectorAll(
        '.ktg13-guest[data-kt-direct-guest="'+CSS.escape(vid)+'"],'+
        '.ktg13-guest[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]'
      ));
      /* direct/legacy가 동시에 승인돼도 같은 viewer는 한 칸만 유지 */
      if(matches.length){
        slot=matches.find(function(x){return !!x.querySelector('video');})||matches[0];
        matches.forEach(function(x){if(x!==slot)resetDuplicateGuestSlot(x,vid);});
      }
    }catch(e){}
    if(!slot){
      var all=[].slice.call(document.querySelectorAll('#screen .ktg13-room .ktg13-guest'));
      for(var i=0;i<all.length;i++){
        if(!all[i].dataset.ktDirectGuest&&!all[i].dataset.ktGuestViewerId){slot=all[i];break;}
      }
    }
    if(!slot)return null;

    /* 두 연결 경로가 반드시 같은 슬롯을 찾도록 두 식별자를 동시에 기록 */
    slot.dataset.ktDirectGuest=vid;
    slot.dataset.ktGuestViewerId=vid;
    var joinNo=guestJoinNo20260926(vid);
    if(joinNo)slot.dataset.ktGuestJoinNumber=String(joinNo);
    slot.classList.add('kt-guest-approved');

    var existingVideo=slot.querySelector('video');
    if(!existingVideo){
      slot.innerHTML='<video autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#08090c"></video><small style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:8px">게스트 연결 중...</small><span class="kt-guest-name" style="position:absolute;left:4px;bottom:4px;z-index:3;font-size:8px;background:#000b;padding:2px 5px;border-radius:8px">👤 '+(joinNo?joinNo+'번 ':'')+esc(name)+'</span>';
    }else{
      var nm=slot.querySelector('.kt-guest-name');
      if(nm)nm.textContent='👤 '+(joinNo?joinNo+'번 ':'')+String(name||'게스트');
    }
    return slot;
  }
  window.ktEnsureApprovedGuestSlot20260924=function(vid,name){
    try{return guestSlot(String(vid||'').trim(),String(name||'게스트'));}catch(e){return null;}
  };
  function attachGuestToHost(vid,name,stream){
    if(!stream)return;
    try{
      var hs=hostStream();
      if(hs&&sameVideoSource20260926(stream,hs))return;
      var hv=document.querySelector('#screen .ktg13-host>video,#screen .ktg9-host>video,#screen .ktsolo-host>video');
      if(hv&&hv.srcObject&&sameVideoSource20260926(stream,hv.srcObject))return;
    }catch(e){}
    var slot=guestSlot(vid,name);if(!slot)return;
    var v=slot.querySelector('video');
    if(v){
      var currentLive=false,liveKitOn=false;
      try{
        var cur=v.srcObject;
        currentLive=!!(cur&&cur.getVideoTracks&&cur.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));
        liveKitOn=!!(window.__ktLiveKitSfuState20260924&&window.__ktLiveKitSfuState20260924.connected);
      }catch(e){}
      /* When LiveKit already has a live picture, direct WebRTC stays as a
         background fallback and must not keep replacing the same video element. */
      if(!(liveKitOn&&currentLive&&v.srcObject!==stream))v.srcObject=stream;
      try{v.style.removeProperty('background-image');v.removeAttribute('poster');}catch(e){}
      v.muted=true;v.playsInline=true;
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    var sm=slot.querySelector('small');if(sm)sm.style.display='none';
  }
  function paintHostGuestPhoto20260926(vid,name,frame){
    try{
      vid=String(vid||'').trim();frame=String(frame||'');
      if(!vid||!/^data:image\/jpeg;base64,/.test(frame)||frame.length>=16000)return false;
      var slot=guestSlot(vid,String(name||'게스트'));if(!slot)return false;
      var vv=slot.querySelector('video');if(!vv)return false;
      vv.setAttribute('poster',frame);
      vv.style.backgroundImage='url("'+frame+'")';
      vv.style.backgroundSize='cover';
      vv.style.backgroundPosition='center';
      var sm=slot.querySelector('small');if(sm)sm.style.display='none';
      return true;
    }catch(e){return false;}
  }

  function approveDirectGuest(vid,name){
    vid=String(vid||'').trim();
    if(!vid)return;
    name=String(name||'게스트');
    var joinNo=guestJoinNo20260926(vid);
    var data={host_id:DEVICE,viewer_id:vid,name:name,guest_no:joinNo,at:Date.now()};

    approvedGuests[vid]={name:name,guest_no:joinNo,at:data.at};
    try{
      var pre= pendingGuestPhotos20260926[vid]||null;
      if(pre&&Date.now()-Number(pre.at||0)<30000){
        paintHostGuestPhoto20260926(vid,name,pre.frame||'');
      }
    }catch(e){}
    try{
      window.__ktApprovedGuestIds20260924[vid]=true;
      window.__ktApprovedGuestNames20260924=window.__ktApprovedGuestNames20260924||{};
      window.__ktApprovedGuestNames20260924[vid]=name;
    }catch(e){}

    /* REALTIME FIRST: approval goes through realtime + REST immediately so
       the guest rises into the room without waiting for a later retry. */
    sendCriticalMedia20260926('guest_approved',data,DEVICE);

    delete pendingRequests[vid];
    guestSlot(vid,name);
    var warmPeer=hostGuestPeers[vid]||null;
    if(warmPeer&&warmPeer.pendingStream){
      attachGuestToHost(vid,name,warmPeer.pendingStream);
    }
    replayPendingHostGuestOffer(vid);
    renderDirectRequests();

    sharedApprovalPost(DEVICE,'guest_approved',vid,name);
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,name);},120);
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,name);},350);
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,name);},800);
    setTimeout(function(){sendCriticalMedia20260926('guest_approved',data,DEVICE);},50);
    setTimeout(function(){sendCriticalMedia20260926('guest_approved',data,DEVICE);},150);
    setTimeout(function(){sendCriticalMedia20260926('guest_approved',data,DEVICE);},500);
    setTimeout(function(){sendCriticalMedia20260926('guest_approved',data,DEVICE);},1000);
    try{
      window.dispatchEvent(new CustomEvent('kt-host-guest-approved',{
        detail:{host_id:DEVICE,viewer_id:vid,at:Date.now()}
      }));
      window.dispatchEvent(new CustomEvent('kt-three-person-sync-now',{
        detail:{host_id:DEVICE,viewer_id:vid,at:Date.now()}
      }));
    }catch(e){}
  }
  window.ktDirectApproveGuest20260922=function(vid,name){
    try{window.__ktFastApprovedGuest20260926={vid:String(vid||''),at:Date.now()};}catch(e){}
    approveDirectGuest(vid,name);
    return true;
  };

  var __ktApprovalTapAt=0;
  function approvalTargetData(btn){
    if(!btn)return null;
    var vid=String((btn.dataset&&btn.dataset.viewerId)||'').trim();
    var name=String((btn.dataset&&btn.dataset.viewerName)||'').trim();
    if(!vid){
      var p=btn.closest&&btn.closest('[data-viewer-id]');
      if(p){
        vid=String(p.getAttribute('data-viewer-id')||'').trim();
        name=name||String(p.getAttribute('data-viewer-name')||'').trim();
      }
    }
    if(!vid){
      var box=btn.closest&&btn.closest('#ktGuestHostChoice');
      if(box){
        vid=String(box.dataset.viewerId||'').trim();
        name=name||String(box.dataset.viewerName||'').trim();
      }
    }
    if(!vid)return null;
    if(!name){
      var x=pendingRequests[vid];
      name=String(x&&x.name||'게스트');
    }
    return {vid:vid,name:name||'게스트'};
  }
  function forceApprovalTap(e){
    var btn=e.target&&e.target.closest?e.target.closest(
      '#ktDirectGuestRequestRail button,'+
      '.ktg13-request-chip,'+
      '#ktGuestHostChoice button.approve,'+
      '#ktGuestRealtimeChoice button.approve'
    ):null;
    if(!btn)return;
    var data=approvalTargetData(btn);
    if(!data)return;
    var now=Date.now();
    if(now-__ktApprovalTapAt<450){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      return;
    }
    __ktApprovalTapAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
    /* Direct realtime approval must be the first action of the tap. */
    approveDirectGuest(data.vid,data.name);
    setTimeout(function(){
      try{
        if(typeof window.ktApproveGuest==='function'){
          var old=window.ktApproveGuest(data.vid,data.name,null);
          if(old&&old.catch)old.catch(function(){});
        }
      }catch(_e){}
    },0);
    try{
      document.querySelectorAll('.ktg13-request-chip[data-viewer-id="'+CSS.escape(data.vid)+'"]').forEach(function(x){x.remove();});
      var choice=document.getElementById('ktGuestHostChoice');
      if(choice&&String(choice.dataset.viewerId||'')===data.vid)choice.remove();
    }catch(_e){}
  }
  document.addEventListener('pointerdown',forceApprovalTap,true);
  document.addEventListener('touchstart',forceApprovalTap,{capture:true,passive:false});

  async function startGuestCamera(hid){
    if(!guestApproved||guestApprovedHost!==hid)return;
    try{adoptExistingSelfCamera20260926();}catch(e){}

    /* 빠른 Realtime 경로를 우선 사용하고, 느린 DB 경로는 실패 시 보조로 둔다.
       신청 때 미리 연 카메라 스트림을 그대로 재사용한다. */
    var live=false;try{live=!!(guestStream&&guestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(!live){
      try{
        var localCamera=window.__ktLocalGuestCameraStream20260926||null;
        var localLive=!!(localCamera&&localCamera.getVideoTracks&&localCamera.getVideoTracks().some(function(t){return t.readyState==='live';}));
        if(localLive&&!isRemoteHostMedia20260926(localCamera)){
          guestStream=localCamera;live=true;
        }
      }catch(e){}
    }
    if(!live){
      try{
        var shared=window.__ktApprovedGuestSelfStream||null;
        var sharedLive=!!(shared&&shared.getVideoTracks&&shared.getVideoTracks().some(function(t){return t.readyState==='live';}));
        if(sharedLive&&isTrustedGuestCamera20260926(shared)){
          guestStream=shared;live=true;
        }else if(sharedLive){
          /* Never promote an untrusted/shared DOM stream into the canonical
             guest camera. It may briefly be the remote host stream. */
          shared=null;
        }
      }catch(e){}
    }
    /* 신청 순간 미리 연 카메라를 그대로 재사용한다. 없을 때만 한 번 연다. */
    if(!live){
      try{guestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});}
      catch(e){try{guestStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});}catch(z){return;}}
      try{rememberTrustedGuestCamera20260926(guestStream);}catch(e){}
    }
    try{
      if(guestStream){
        if(isTrustedGuestCamera20260926(guestStream)){
          window.__ktLocalGuestCameraStream20260926=guestStream;
          window.__ktApprovedGuestSelfStream=guestStream;
        }
        window.dispatchEvent(new CustomEvent('kt-approved-guest-stream-ready',{
          detail:{host_id:hid,viewer_id:viewerId(),at:Date.now()}
        }));
      }
    }catch(e){}
    makeGuestOffer(hid);
  }
  function waitIceCompleteDirect(pc,ms){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||1400);
      function finish(){
        if(done)return;done=true;clearTimeout(t);
        try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}
        resolve();
      }
      function on(){if(pc.iceGatheringState==='complete')finish();}
      try{pc.addEventListener('icegatheringstatechange',on);}catch(e){finish();}
    });
  }

  function clearGuestOfferRetryTimers(pc){
    try{
      var list=pc&&pc.__ktGuestOfferRetryTimers||[];
      list.forEach(function(t){clearTimeout(t);});
      if(pc)pc.__ktGuestOfferRetryTimers=[];
    }catch(e){}
  }

  function clearGuestMediaAckTimer20260926(){
    try{if(guestMediaAckTimer)clearTimeout(guestMediaAckTimer);}catch(e){}
    guestMediaAckTimer=null;guestMediaAckSession='';
  }
  function scheduleGuestMediaAckFallback20260926(hid,pc,session,delay){
    clearGuestMediaAckTimer20260926();
    guestMediaAckSession=String(session||'');
    if(!guestMediaAckSession||!pc||guestMediaRecoveryCount>=2)return;
    guestMediaAckTimer=setTimeout(function(){
      guestMediaAckTimer=null;
      if(!guestApproved||guestApprovedHost!==hid||guestPc!==pc||guestSession!==guestMediaAckSession)return;

      var cs=String(pc.connectionState||''),is=String(pc.iceConnectionState||'');
      pc.__ktMediaAckGrace20260926=Number(pc.__ktMediaAckGrace20260926||0);
      if((cs==='connected'||cs==='connecting'||cs==='new'||is==='connected'||is==='completed'||is==='checking')&&pc.__ktMediaAckGrace20260926<2){
        pc.__ktMediaAckGrace20260926++;
        var payload=pc.__ktGuestOfferPayload20260926||pc.__ktPreApprovalPayload||null;
        if(payload)try{sendCriticalMedia20260926('guest_offer',payload,hid);}catch(e){}
        scheduleGuestMediaAckFallback20260926(hid,pc,session,450);
        return;
      }

      guestMediaRecoveryCount++;
      try{window.__ktDirectGuestUplinkState20260923='media-retry';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
      try{clearGuestOfferRetryTimers(pc);}catch(e){}
      try{closePc(pc);}catch(e){}
      if(guestPc===pc){guestPc=null;guestSession='';}
      var retry=function(){setTimeout(function(){if(guestApproved&&guestApprovedHost===hid)makeGuestOffer(hid);},40);};
      try{
        var r=window.ktRefreshTurnRelay&&window.ktRefreshTurnRelay();
        if(r&&typeof r.then==='function')r.then(retry).catch(retry);else retry();
      }catch(e){retry();}
    },Math.max(400,Number(delay||650)));
  }

  function scheduleGuestOfferRetries(hid,pc,payload){
    if(!pc||!payload)return;
    clearGuestOfferRetryTimers(pc);
    pc.__ktGuestOfferRetryTimers=[];
    [20,60,140,300].forEach(function(ms){
      var t=setTimeout(function(){
        if(guestPc!==pc||guestSession!==payload.session_id||!guestApproved||guestApprovedHost!==hid)return;
        var cs=String(pc.connectionState||''),is=String(pc.iceConnectionState||'');
        if(cs==='connected'||is==='connected'||is==='completed')return;
        sendCriticalMedia20260926('guest_offer',payload,hid);
      },ms);
      pc.__ktGuestOfferRetryTimers.push(t);
    });
  }

  async function prepareGuestOfferBeforeApproval20260924(hid){
    if(!requestOn||guestApproved||!hid||!guestStream)return;
    if(guestPc&&['new','connecting','connected'].indexOf(String(guestPc.connectionState||''))>-1)return;
    clearGuestOfferRetryTimers(guestPc);
    closePc(guestPc);guestPc=null;guestSession=sid('guestpre');
    var pc=new RTCPeerConnection(rtcConfig());guestPc=pc;
    try{window.__ktDirectGuestUplinkState20260923='preconnecting';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
    /* Pre-negotiate WITHOUT sending camera/mic before host approval.
       The transceivers reserve the media lanes; approval only replaceTrack()s
       the already-prewarmed tracks, so no new SDP round-trip is needed. */
    try{
      var vtx=pc.addTransceiver('video',{direction:'sendonly'});
      pc.__ktPreVideoSender=vtx&&vtx.sender||null;
      if(pc.__ktPreVideoSender)ktTuneDirectVideoSender20260923(pc.__ktPreVideoSender,'guest');
    }catch(e){}
    try{
      var atx=pc.addTransceiver('audio',{direction:'sendonly'});
      pc.__ktPreAudioSender=atx&&atx.sender||null;
    }catch(e){}
    pc.onicecandidate=function(ev){
      if(ev.candidate)sendCriticalMedia20260926('guest_ice',{
        host_id:hid,viewer_id:viewerId(),session_id:guestSession,from:'guest',
        candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate,
        preapproval:true
      },hid);
    };
    pc.oniceconnectionstatechange=function(){
      var st=String(pc.iceConnectionState||'');
      if(st==='failed'&&guestPc===pc&&!guestApproved){
        try{closePc(pc);}catch(e){}
        guestPc=null;
      }
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='connected'){
        try{window.__ktDirectGuestUplinkState20260923='connected';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
      }else if((st==='failed'||st==='closed')&&guestPc===pc&&!guestApproved){
        guestPc=null;
      }
    };
    try{
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
      await pc.setLocalDescription(offer);
      var payload={
        host_id:hid,viewer_id:viewerId(),name:profileName(),
        session_id:guestSession,offer_sdp:pc.localDescription.sdp,
        preapproval:true,at:Date.now()
      };
      pc.__ktPreApprovalPayload=payload;
      pc.__ktGuestOfferPayload20260926=payload;
      /* Host stores this offer while the guest is still awaiting approval.
         No remote description is applied and no media is received by the host
         until the host actually approves. */
      sendCriticalMedia20260926('guest_offer',payload,hid);
      [120,350,800].forEach(function(ms){
        setTimeout(function(){
          if(guestPc!==pc||!requestOn||guestApproved)return;
          sendCriticalMedia20260926('guest_offer',payload,hid);
        },ms);
      });
    }catch(e){
      try{closePc(pc);}catch(_e){}
      if(guestPc===pc)guestPc=null;
    }
  }

  async function activatePreparedGuestMedia20260924(hid){
    var pc=guestPc;
    if(!pc||!pc.__ktPreApprovalPayload||String(pc.__ktPreApprovalPayload.host_id||'')!==String(hid||''))return false;
    if(!guestStream)return false;
    try{
      var vt=guestStream.getVideoTracks&&guestStream.getVideoTracks()[0]||null;
      var at=guestStream.getAudioTracks&&guestStream.getAudioTracks()[0]||null;
      if(pc.__ktPreVideoSender&&vt){
        await pc.__ktPreVideoSender.replaceTrack(vt);
        ktTuneDirectVideoSender20260923(pc.__ktPreVideoSender,'guest');
      }
      if(pc.__ktPreAudioSender)await pc.__ktPreAudioSender.replaceTrack(at||null);
      pc.__ktPreApprovalActivated=true;
      try{window.__ktDirectGuestUplinkState20260923='activating';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
      scheduleGuestMediaAckFallback20260926(hid,pc,guestSession,450);
      return true;
    }catch(e){return false;}
  }

  function forceFreshApprovedGuestOffer20260926(hid){
    hid=String(hid||'').trim();
    if(!hid||!guestApproved||guestApprovedHost!==hid)return;
    var live=false;
    try{live=!!(guestStream&&guestStream.getVideoTracks&&guestStream.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}catch(e){}
    if(!live){
      var q=startGuestCamera(hid);
      if(q&&q.then){
        q.then(function(){setTimeout(function(){forceFreshApprovedGuestOffer20260926(hid);},20);}).catch(function(){});
      }
      return;
    }

    var pc=guestPc;
    /* The pre-approval sendonly PC is useful for signalling warmup, but on
       some Android phones replaceTrack() stays "connected" without producing
       the first upstream frame. Replace only that PC with one real-track PC. */
    if(pc&&pc.__ktPreApprovalPayload){
      try{clearGuestMediaAckTimer20260926();}catch(e){}
      try{clearGuestOfferRetryTimers(pc);}catch(e){}
      try{closePc(pc);}catch(e){}
      if(guestPc===pc){guestPc=null;guestSession='';}
    }
    if(!guestPc){
      var r=makeGuestOffer(hid);
      if(r&&r.catch)r.catch(function(){});
    }
  }

  async function makeGuestOffer(hid){
    if(!guestApproved||guestApprovedHost!==hid||!guestStream)return;
    if(guestPc&&['new','connecting','connected'].indexOf(String(guestPc.connectionState||''))>-1)return;
    await ensureTurnBeforeGuestRtc20260926();
    if(!guestApproved||guestApprovedHost!==hid||!guestStream)return;
    clearGuestOfferRetryTimers(guestPc);
    closePc(guestPc);guestPc=null;guestSession=sid('guest');
    var pc=new RTCPeerConnection(rtcConfig());guestPc=pc;
    try{window.__ktDirectGuestUplinkState20260923='connecting';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
    guestStream.getTracks().forEach(function(t){
      try{
        var sender=pc.addTrack(t,guestStream);
        if(t&&t.kind==='video')ktTuneDirectVideoSender20260923(sender,'guest');
      }catch(e){}
    });
    var guestPcSession20260926=String(guestSession||'');
    pc.onicecandidate=function(ev){
      if(ev.candidate)sendCriticalMedia20260926('guest_ice',{
        host_id:hid,viewer_id:viewerId(),session_id:guestPcSession20260926,from:'guest',
        candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate
      },hid);
    };
    pc.__ktGuestIceRecovery20260923=true;
    pc.oniceconnectionstatechange=function(){
      var s=String(pc.iceConnectionState||'');
      if(s==='failed'&&guestPc===pc){
        try{window.__ktDirectGuestUplinkState20260923='failed';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
        clearGuestOfferRetryTimers(pc);
        closePc(pc);guestPc=null;
        setTimeout(function(){makeGuestOffer(hid);},250);
      }
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='connected'){
        try{window.__ktDirectGuestUplinkState20260923='connected';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
      }
      if(st==='failed'||st==='closed'){
        try{window.__ktDirectGuestUplinkState20260923=st;window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
        if(guestPc===pc){clearGuestOfferRetryTimers(pc);guestPc=null;setTimeout(function(){makeGuestOffer(hid);},350);}
      }
      if(st==='disconnected'){
        try{window.__ktDirectGuestUplinkState20260923='disconnected';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
        setTimeout(function(){
        if(guestPc===pc&&pc.connectionState==='disconnected'){
          clearGuestOfferRetryTimers(pc);closePc(pc);guestPc=null;setTimeout(function(){makeGuestOffer(hid);},300);
        }
      },12000);
      }
    };
    try{
      var offerSession=String(guestSession||'');
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
      await pc.setLocalDescription(offer);
      /* Include gathered ICE candidates in the FIRST SDP as well as trickle
         messages. This avoids a guest uplink getting stuck when a mobile
         candidate packet is delayed or missed. Keep the wait short. */
      /* Trickle ICE is already dual-sent over WebSocket + REST. Do not hold
         the first guest offer for half a second waiting for full ICE gather. */
      try{await waitIceCompleteDirect(pc,80);}catch(e){}
      if(guestPc!==pc||guestSession!==offerSession)return;
      var guestOfferPayload={host_id:hid,viewer_id:viewerId(),name:profileName(),session_id:offerSession,offer_sdp:pc.localDescription.sdp};
      pc.__ktGuestOfferPayload20260926=guestOfferPayload;
      sendCriticalMedia20260926('guest_offer',guestOfferPayload,hid);
      scheduleGuestOfferRetries(hid,pc,guestOfferPayload);
      scheduleGuestMediaAckFallback20260926(hid,pc,offerSession,500);

      /* 연결 협상도 짧은 흔들림 때문에 계속 새로 만들지 않는다.
         10초 동안 기존 세션을 기다린 뒤 실제 연결이 없을 때만 재시도한다. */
      setTimeout(function(){
        if(guestPc!==pc||!guestApproved||guestApprovedHost!==hid)return;
        var cs=String(pc.connectionState||''),is=String(pc.iceConnectionState||'');
        if(cs==='connected'||is==='connected'||is==='completed')return;
        clearGuestOfferRetryTimers(pc);
        try{closePc(pc);}catch(e){}
        if(guestPc===pc)guestPc=null;
        setTimeout(function(){makeGuestOffer(hid);},180);
      },5000);
    }catch(e){
      try{window.__ktDirectGuestUplinkState20260923='failed';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(_e){}
      clearGuestOfferRetryTimers(pc);closePc(pc);if(guestPc===pc)guestPc=null;
    }
  }
  function hostGuestSignalKey(vid,session){
    return String(vid||'')+'|'+String(session||'');
  }
  function replayPendingHostGuestOffer(vid){
    vid=String(vid||'');
    var box=pendingHostGuestOffers[vid];
    if(!box)return;
    delete pendingHostGuestOffers[vid];
    if(Date.now()-Number(box.at||0)>20000)return;
    /* The pre-approval offer has no real camera track yet. On Android it can
       stay "connected" while delivering no first frame. After approval wait
       for the fresh real-track offer instead. */
    if(box.payload&&box.payload.preapproval===true)return;
    setTimeout(function(){
      try{
        var q=hostGuestOffer(box.payload);
        if(q&&q.catch)q.catch(function(){});
      }catch(e){}
    },0);
  }

  async function hostGuestOffer(p){
    if(!isHostRole()||String(p.host_id||'')!==DEVICE)return;
    await ensureTurnBeforeGuestRtc20260926();
    if(!isHostRole()||String(p.host_id||'')!==DEVICE)return;
    var vid=String(p.viewer_id||'');
    var session=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!vid||!session||!sdp)return;
    var isApproved=!!approvedGuests[vid];
    var isRequested=!!pendingRequests[vid];
    /* Once approved, only accept the fresh offer that contains the real
       guest camera track. Ignore delayed pre-approval sendonly offers. */
    if(isApproved&&p.preapproval===true)return;
    if(!isApproved&&!isRequested){
      pendingHostGuestOffers[vid]={payload:p,at:Date.now()};
      return;
    }
    if(isApproved)hostGuestAliveAt[vid]=Date.now();
    delete pendingHostGuestOffers[vid];
    var old=hostGuestPeers[vid]||null;

    /* REST + WebSocket 이중 신호로 같은 guest_offer가 중복 도착할 수 있다.
       같은 세션을 다시 PeerConnection으로 만들면 서로 덮어써서 연결이 늦어질 수 있으므로
       기존 세션을 유지하고, 이미 만든 answer가 있으면 다시 보내기만 한다. */
    if(old&&old.sid===session&&old.pc&&String(old.pc.connectionState||'')!=='closed'){
      if(old.answer){
        sendCriticalMedia20260926('guest_answer',{host_id:DEVICE,viewer_id:vid,session_id:session,answer_sdp:old.answer},DEVICE);
      }
      return;
    }

    var iceKey=hostGuestSignalKey(vid,session);
    var cachedGuestIce=pendingHostGuestIce[iceKey]||[];
    delete pendingHostGuestIce[iceKey];
    var pc=new RTCPeerConnection(rtcConfig()),entry={pc:pc,sid:session,ice:cachedGuestIce.slice(0,32),old:old,answer:'',gotTrack:false,mediaStream:new MediaStream()};hostGuestPeers[vid]=entry;
    pc.ontrack=function(ev){
      try{
        var incoming=(ev.streams&&ev.streams[0])||null;
        if(incoming&&incoming.getTracks){
          incoming.getTracks().forEach(function(t){
            if(!entry.mediaStream.getTracks().some(function(x){return x.id===t.id;}))entry.mediaStream.addTrack(t);
          });
        }else if(ev.track&&!entry.mediaStream.getTracks().some(function(x){return x.id===ev.track.id;})){
          entry.mediaStream.addTrack(ev.track);
        }
      }catch(e){}
      var rs=entry.mediaStream;
      entry.pendingStream=rs;
      entry.pendingTrack=ev.track||null;
      function attachIfApproved(){
        if(!approvedGuests[vid])return;
        var hasVideo=false;
        try{hasVideo=rs.getVideoTracks().some(function(t){return t&&t.readyState==='live';});}catch(e){}
        if(!hasVideo)return;
        attachGuestToHost(vid,String(p.name||(approvedGuests[vid]&&approvedGuests[vid].name)||'게스트'),rs);
      }
      function confirmRealMedia(){
        if(!approvedGuests[vid])return;
        var vt=null;
        try{vt=rs.getVideoTracks().find(function(t){return t&&t.readyState==='live';})||null;}catch(e){}
        if(!vt)return;
        /* ontrack can fire before Android has delivered the first frame.
           Do not acknowledge media until the remote video track is actually
           unmuted, otherwise the guest stops its recovery while host stays blank. */
        if(vt.muted===true)return;
        attachIfApproved();
        entry.gotTrack=true;
        if(!entry.mediaReadySent){
          entry.mediaReadySent=true;
          sendCriticalMedia20260926('guest_media_ready',{host_id:DEVICE,viewer_id:vid,session_id:session,at:Date.now()},DEVICE);
        }
        if(entry.old&&entry.old.pc){try{closePc(entry.old.pc);}catch(e){}entry.old=null;}
      }

      /* Reserve/paint the slot immediately, but keep recovery active until
         a real unmuted guest video track arrives. */
      attachIfApproved();
      try{
        if(ev.track){
          if(ev.track.kind==='video'&&ev.track.muted!==true)confirmRealMedia();
          ev.track.onunmute=function(){confirmRealMedia();};
        }
      }catch(e){}
    };
    pc.onicecandidate=function(ev){if(ev.candidate)sendCriticalMedia20260926('guest_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate},DEVICE);};
    pc.oniceconnectionstatechange=function(){
      var ist=String(pc.iceConnectionState||'');
      if((ist==='connected'||ist==='completed')&&approvedGuests[vid]&&entry.pendingStream){
        /* Transport connected is not the same as receiving video frames.
           Keep the slot attached, but do not stop guest recovery yet. */
        attachGuestToHost(vid,String(p.name||(approvedGuests[vid]&&approvedGuests[vid].name)||'게스트'),entry.pendingStream);
      }
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='connected'&&approvedGuests[vid]&&entry.pendingStream){
        /* Keep displaying the receiver stream, but wait for track.onunmute
           before declaring guest media ready. */
        attachGuestToHost(vid,String(p.name||(approvedGuests[vid]&&approvedGuests[vid].name)||'게스트'),entry.pendingStream);
      }
      if(st==='failed'||st==='closed'){
        if(hostGuestPeers[vid]===entry){
          delete hostGuestPeers[vid];
          var ap=approvedGuests[vid];
          if(ap)setTimeout(function(){send('guest_approved',{host_id:DEVICE,viewer_id:vid,name:ap.name||'게스트',at:Date.now(),reconnect:true});},180);
        }
      }
      if(st==='disconnected')setTimeout(function(){
        if(hostGuestPeers[vid]===entry&&pc.connectionState==='disconnected'){
          closePc(pc);delete hostGuestPeers[vid];
          var ap=approvedGuests[vid];
          if(ap)setTimeout(function(){send('guest_approved',{host_id:DEVICE,viewer_id:vid,name:ap.name||'게스트',at:Date.now(),reconnect:true});},180);
        }
      },12000);
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=entry.ice.splice(0);for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();
      await pc.setLocalDescription(ans);
      /* Send the host answer quickly; remaining candidates continue by
         trickle ICE instead of delaying the first guest frame. */
      try{await waitIceCompleteDirect(pc,80);}catch(e){}
      if(hostGuestPeers[vid]!==entry)return;
      entry.answer=pc.localDescription.sdp;
      var guestAnswerPayload={host_id:DEVICE,viewer_id:vid,session_id:session,answer_sdp:entry.answer};
      sendCriticalMedia20260926('guest_answer',guestAnswerPayload,DEVICE);
      [20,60,140,300].forEach(function(ms){
        setTimeout(function(){
          if(hostGuestPeers[vid]!==entry||entry.gotTrack)return;
          var cs=String(pc.connectionState||'');
          if(cs==='failed'||cs==='closed')return;
          sendCriticalMedia20260926('guest_answer',guestAnswerPayload,DEVICE);
        },ms);
      });

      /* Keep the host receiver alive while Android finishes the first frame.
         Re-send the same answer; failed/closed events still rebuild normally. */
      [900,1800,3200].forEach(function(ms){
        setTimeout(function(){
          if(hostGuestPeers[vid]!==entry||entry.gotTrack||!approvedGuests[vid])return;
          var cs=String(pc.connectionState||'');
          if(cs==='failed'||cs==='closed')return;
          try{sendCriticalMedia20260926('guest_answer',guestAnswerPayload,DEVICE);}catch(e){}
        },ms);
      });
    }catch(e){
      closePc(pc);
      if(hostGuestPeers[vid]===entry){
        if(entry.old&&entry.old.pc&&String(entry.old.pc.connectionState||'')!=='closed')hostGuestPeers[vid]=entry.old;
        else delete hostGuestPeers[vid];
      }
    }
  }
  async function guestHandleAnswer(p){
    if(String(p.viewer_id||'')!==viewerId())return;
    var ansHost=String(p.host_id||'');
    if(!guestPc||guestSession!==String(p.session_id||''))return;
    var currentHost=String(remoteHostId()||'');
    var approvedPath=!!(guestApproved&&ansHost===guestApprovedHost);
    var preapprovalPath=!!(!guestApproved&&requestOn&&ansHost&&ansHost===currentHost);
    if(!approvedPath&&!preapprovalPath)return;
    try{
      clearGuestOfferRetryTimers(guestPc);
      if(!guestPc.currentRemoteDescription)await guestPc.setRemoteDescription({type:'answer',sdp:String(p.answer_sdp||'')});
      var q=guestIce[guestSession]||[];guestIce[guestSession]=[];
      for(var i=0;i<q.length;i++)try{await guestPc.addIceCandidate(q[i]);}catch(e){}
      if(preapprovalPath)guestPc.__ktPreApprovalAnswerApplied=true;
    }catch(e){}
  }
  async function handleGuestIce(p){
    var session=String(p.session_id||''),cand=p.candidate;if(!session||!cand)return;
    if(String(p.from||'')==='host'&&String(p.viewer_id||'')===viewerId()){
      if(guestPc&&guestSession===session&&guestPc.remoteDescription){try{await guestPc.addIceCandidate(cand);}catch(e){}}
      else{if(!guestIce[session])guestIce[session]=[];guestIce[session].push(cand);}
    }else if(String(p.from||'')==='guest'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      var gvid=String(p.viewer_id||'');
      if(approvedGuests[gvid])hostGuestAliveAt[gvid]=Date.now();
      var e=hostGuestPeers[gvid];
      if(!e||e.sid!==session){
        var k=hostGuestSignalKey(gvid,session);
        if(!pendingHostGuestIce[k])pendingHostGuestIce[k]=[];
        if(pendingHostGuestIce[k].length<32)pendingHostGuestIce[k].push(cand);
        return;
      }
      if(e.pc.remoteDescription){try{await e.pc.addIceCandidate(cand);}catch(z){}}
      else if(e.ice.length<32)e.ice.push(cand);
    }
  }

  function cacheTrustedGuestPhoto20260926(){
    var s=null;
    try{s=window.__ktLocalGuestCameraStream20260926||null;}catch(e){}
    if(!s||!isTrustedGuestCamera20260926(s))return;
    var vt=null;
    try{vt=s.getVideoTracks&&s.getVideoTracks()[0]||null;}catch(e){}
    if(!vt||vt.readyState!=='live'||!vt.id)return;
    var trackId=String(vt.id);
    function grab(v){
      if(!v||!v.videoWidth||!v.videoHeight)return false;
      try{
        var cv=document.createElement('canvas');cv.width=72;cv.height=54;
        var cx=cv.getContext('2d',{alpha:false});if(!cx)return false;
        cx.drawImage(v,0,0,72,54);
        var frame=cv.toDataURL('image/jpeg',0.28);
        if(!frame||frame.length>16000)return false;
        guestPhotoCache20260926=frame;
        guestPhotoCacheTrack20260926=trackId;
        guestPhotoCacheAt20260926=Date.now();
        return true;
      }catch(e){return false;}
    }
    try{
      var vids=[].slice.call(document.querySelectorAll('video'));
      for(var i=0;i<vids.length;i++){
        var so=vids[i].srcObject||null;
        if(so&&sameVideoSource20260926(so,s)&&grab(vids[i]))return;
      }
    }catch(e){}
    try{
      var v=document.createElement('video');
      v.muted=true;v.defaultMuted=true;v.autoplay=true;v.playsInline=true;v.srcObject=s;
      var done=function(){grab(v);};
      v.addEventListener('loadeddata',done,{once:true});
      v.addEventListener('playing',done,{once:true});
      var q=v.play();if(q&&q.catch)q.catch(function(){});
      setTimeout(done,30);setTimeout(done,90);
    }catch(e){}
  }

  function sendPreApprovalGuestPhoto20260926(hid){
    hid=String(hid||'').trim();
    if(!hid||!requestOn)return;
    try{cacheTrustedGuestPhoto20260926();}catch(e){}
    setTimeout(function(){
      try{
        var trustedId=String(window.__ktLocalGuestCameraTrackId20260926||'');
        if(!requestOn||!trustedId)return;
        if(!guestPhotoCache20260926||guestPhotoCacheTrack20260926!==trustedId)return;
        if(Date.now()-guestPhotoCacheAt20260926>10000)return;
        var data={
          host_id:hid,viewer_id:viewerId(),name:profileName(),
          frame:guestPhotoCache20260926,at:Date.now()
        };
        sendCriticalMedia20260926('guest_request_photo',data,hid);
      }catch(e){}
    },0);
  }

  function sendApprovedGuestPhoto20260926(hid){
    hid=String(hid||'').trim();
    if(!hid)return;
    var s=null,remote=null;
    try{
      s=window.__ktLocalGuestCameraStream20260926||null;
      remote=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
    }catch(e){}
    /* Photo fallback may use ONLY the exact camera track opened locally by
       getUserMedia. Never fall back to guestStream/shared/DOM media. */
    if(!s||!isTrustedGuestCamera20260926(s)||isRemoteHostMedia20260926(s)||
       (remote&&sameVideoSource20260926(s,remote)))return;
    var vt=null;
    try{vt=s.getVideoTracks&&s.getVideoTracks()[0]||null;}catch(e){}
    if(!vt||vt.readyState!=='live')return;

    var sent=false;
    try{
      var trustedId=String(window.__ktLocalGuestCameraTrackId20260926||'');
      if(guestPhotoCache20260926&&guestPhotoCacheTrack20260926===trustedId&&Date.now()-guestPhotoCacheAt20260926<10000){
        sent=true;
        sendCriticalMedia20260926('guest_photo_frame',{
          host_id:hid,viewer_id:viewerId(),name:profileName(),
          frame:guestPhotoCache20260926,at:Date.now()
        },hid);
        setTimeout(cacheTrustedGuestPhoto20260926,0);
        return;
      }
    }catch(e){}
    function fromVideo(v){
      if(sent||!v||!v.videoWidth||!v.videoHeight)return false;
      try{
        var cv=document.createElement('canvas');
        cv.width=72;cv.height=54;
        var cx=cv.getContext('2d',{alpha:false});if(!cx)return false;
        cx.drawImage(v,0,0,72,54);
        var frame=cv.toDataURL('image/jpeg',0.28);
        if(!frame||frame.length>16000)return false;
        sent=true;
        sendCriticalMedia20260926('guest_photo_frame',{
          host_id:hid,viewer_id:viewerId(),name:profileName(),
          frame:frame,at:Date.now()
        },hid);
        return true;
      }catch(e){return false;}
    }

    try{
      var vids=[].slice.call(document.querySelectorAll('video'));
      for(var i=0;i<vids.length;i++){
        var so=vids[i].srcObject||null;
        if(so&&sameVideoSource20260926(so,s)&&fromVideo(vids[i]))return;
      }
    }catch(e){}

    try{
      var v=document.createElement('video');
      v.muted=true;v.defaultMuted=true;v.autoplay=true;v.playsInline=true;v.srcObject=s;
      var done=function(){fromVideo(v);};
      v.addEventListener('loadeddata',done,{once:true});
      v.addEventListener('playing',done,{once:true});
      var q=v.play();if(q&&q.catch)q.catch(function(){});
      setTimeout(done,80);setTimeout(done,180);
    }catch(e){}
  }

  function onGuestApproved(p){
    if(String(p.viewer_id||'')!==viewerId())return;

    /* 승인 수신 전용 보강:
       게스트 화면에서 호스트 ID가 잠깐 비어도 승인 신호에 들어있는 host_id로 즉시 복구한다.
       다른 UI/방배치/채팅/선물/스위치는 변경하지 않는다. */
    var signalHost=String(p.host_id||'').trim();
    var hid=remoteHostId()||String(activeHostId||'').trim()||signalHost;
    if(!hid||!signalHost)return;
    if(String(activeHostId||'').trim()&&String(activeHostId)!==signalHost)return;
    if(hid!==signalHost)hid=signalHost;

    window.__ktRemoteHostId=hid;
    try{sessionStorage.setItem('kt_remote_host_id',hid);}catch(e){}

    var keepApprovedHostStream20260926=null;
    var keepViewerConnected20260926=viewerConnected;
    try{
      keepApprovedHostStream20260926=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
    }catch(e){}

    requestOn=false;
    guestApproved=true;
    try{if(guestPrewarmTimer)clearTimeout(guestPrewarmTimer);}catch(e){}
    guestPrewarmTimer=null;
    guestApprovedHost=hid;
    guestApprovedAt=Date.now();
    leaveAnnouncedHost='';
    guestAliveLastSent=0;guestAliveSharedLastSent=0;
    guestMediaRecoveryCount=0;
    clearGuestMediaAckTimer20260926();

    /* APPROVAL MEDIA PATH — FAST FIRST:
       신청할 때 이미 협상해 둔 sendonly PeerConnection에 카메라 track만 즉시 꽂는다.
       성공하면 새 offer/answer 왕복이 없어 호스트 칸에 훨씬 빨리 뜬다.
       Android에서 첫 프레임이 안 오는 경우만 짧게 기다렸다가 새 연결로 보조한다. */
    guestMediaReadyAt=0;
    var usedPrepared=false;
    try{
      usedPrepared=!!(guestPc&&guestPc.__ktPreApprovalPayload&&guestStream);
      if(usedPrepared){
        var activated=activatePreparedGuestMedia20260924(hid);
        if(activated&&activated.then){
          activated.then(function(ok){
            if(!ok&&guestApproved&&guestApprovedHost===hid){
              forceFreshApprovedGuestOffer20260926(hid);
            }
          }).catch(function(){
            if(guestApproved&&guestApprovedHost===hid)forceFreshApprovedGuestOffer20260926(hid);
          });
        }
      }
    }catch(e){usedPrepared=false;}

    if(!usedPrepared){
      try{
        if(guestPc){
          clearGuestMediaAckTimer20260926();
          clearGuestOfferRetryTimers(guestPc);
          closePc(guestPc);
        }
      }catch(e){}
      guestPc=null;guestSession='';
      try{
        var firstMedia=startGuestCamera(hid);
        if(firstMedia&&firstMedia.catch)firstMedia.catch(function(){});
      }catch(e){}
    }

    /* Warm pre-approval transport gets a brief head start only. If no real
       frame is confirmed almost immediately, build the real-track connection. */
    setTimeout(function(){
      if(!guestApproved||guestApprovedHost!==hid||guestMediaReadyAt)return;
      forceFreshApprovedGuestOffer20260926(hid);
    },140);

    /* Visible fallback requested by owner: place only the approved guest's own
       camera face into the host guest slot while live transport is connecting. */
    [0,45,140].forEach(function(ms){
      setTimeout(function(){
        if(guestApproved&&guestApprovedHost===hid)try{sendApprovedGuestPhoto20260926(hid);}catch(e){}
      },ms);
    });

    /* UI FIRST: approval must change the guest screen immediately.
       Do not wait for camera/WebRTC/LiveKit work before showing the
       approved multi-person room shell. */
    try{
      var selfVid=viewerId();
      window.__ktApprovedGuestIds20260924=window.__ktApprovedGuestIds20260924||{};
      window.__ktApprovedGuestNames20260924=window.__ktApprovedGuestNames20260924||{};
      window.__ktApprovedGuestIds20260924[selfVid]=true;
      window.__ktApprovedGuestNames20260924[selfVid]=profileName();
      window.dispatchEvent(new CustomEvent('kt-guest-approval-received',{
        detail:{
          host_id:hid,
          viewer_id:selfVid,
          stream:guestStream||window.__ktApprovedGuestSelfStream||null,
          at:Date.now(),
          immediate:true
        }
      }));
      if(typeof window.ktForceApprovedGuestGridNow20260924==='function'){
        window.ktForceApprovedGuestGridNow20260924();
      }
      window.dispatchEvent(new CustomEvent('kt-three-person-sync-now',{
        detail:{host_id:hid,viewer_id:selfVid,at:Date.now(),immediate:true}
      }));

      /* Approval changes only the guest-room DOM. Keep the already-live host
         receive stream attached instead of starting a second viewer session. */
      if(keepApprovedHostStream20260926&&
         keepApprovedHostStream20260926.getVideoTracks&&
         keepApprovedHostStream20260926.getVideoTracks().some(function(t){return t&&t.readyState==='live';})){
        window.__ktRemoteHostStream=keepApprovedHostStream20260926;
        window.__ktLastApprovedGuestHostStream=keepApprovedHostStream20260926;
        if(keepViewerConnected20260926)viewerConnected=true;
        attachRemoteStreamNow(keepApprovedHostStream20260926);
        [0,15,40,90].forEach(function(ms){
          setTimeout(function(){
            if(guestApproved&&guestApprovedHost===hid){
              attachRemoteStreamNow(keepApprovedHostStream20260926);
            }
          },ms);
        });
      }
    }catch(e){}

    var b=document.getElementById('ktRemoteGuestRequest');
    if(b){
      b.classList.remove('kt-requested');
      b.style.removeProperty('box-shadow');
      b.setAttribute('title','참여 승인됨');
      b.setAttribute('aria-label','참여 승인됨');
    }

    try{
      window.dispatchEvent(new CustomEvent('kt-three-person-sync-now',{
        detail:{host_id:hid,viewer_id:viewerId(),at:Date.now(),post_media:true}
      }));
    }catch(e){}
  }
  function duplicateSignal(ev,p){
    try{
      p=p||{};
      var cand=p.candidate&&p.candidate.candidate?String(p.candidate.candidate):'';
      var key=[
        String(ev||''),
        String(p.host_id||''),
        String(p.viewer_id||''),
        String(p.session_id||''),
        String(p.watch_token||''),
        String(p.from||''),
        cand
      ].join('|');
      var now=Date.now(),prev=Number(signalSeen[key]||0);
      signalSeen[key]=now;
      if(Object.keys(signalSeen).length>300){
        Object.keys(signalSeen).forEach(function(k){if(now-Number(signalSeen[k]||0)>5000)delete signalSeen[k];});
      }
      return !!(prev&&now-prev<650);
    }catch(e){return false;}
  }

  function handleSignal(ev,p){
    if(duplicateSignal(ev,p))return;
    if(ev==='broadcast_ended'&&!isHostRole()){
      var ended=String(p&&p.host_id||'').trim();
      var current=String(remoteHostId()||lastRemoteHost||activeHostId||'').trim();
      if(!ended||!current||ended!==current)return;

      /* Ignore a delayed end signal from an older broadcast run of the same host. */
      var endedRun=String(p&&p.run_id||'').trim();
      var endedAt=Number(p&&p.at||0);
      var currentRun=String(remoteRunId||window.__ktRemoteHostRunId20260924||'').trim();
      var currentStarted=Number(remoteRunStartedAt||window.__ktRemoteHostSessionStartedAt20260924||0);
      if(endedRun&&currentRun&&endedRun!==currentRun)return;
      if(endedAt&&currentStarted&&endedAt<currentStarted)return;

      try{closePc(viewerPc);}catch(e){}
      try{closePc(guestPc);}catch(e){}
      viewerPc=null;viewerSession='';viewerConnected=false;
      guestPc=null;guestSession='';guestApproved=false;guestApprovedHost='';requestOn=false;
      try{
        window.__ktApprovedGuestIds20260924={};
        window.__ktApprovedGuestNames20260924={};
      }catch(e){}
      clearViewerConnectTimer();
      window.__ktRemoteHostStream=null;
      window.__ktRemoteHostId='';
      window.__ktCurrentRemoteHostId='';
      window.__ktUseMemoryGuestVideo20260922=false;
      remoteRunId='';remoteRunStartedAt=0;
      try{window.__ktRemoteHostRunId20260924='';window.__ktRemoteHostSessionStartedAt20260924=0;}catch(e){}
      lastRemoteHost='';activeHostId='';
      try{sessionStorage.removeItem('kt_remote_host_id');}catch(e){}
      try{
        if(typeof window.ktCloseRemoteFallbackInApp20260923==='function'){
          window.ktCloseRemoteFallbackInApp20260923();
        }
      }catch(e){}
      try{
        if(typeof window.ktCloseRemotePresenceInApp20260923==='function'){
          var q=window.ktCloseRemotePresenceInApp20260923();
          if(q&&typeof q.catch==='function')q.catch(function(){});
        }
      }catch(e){}
      try{document.documentElement.classList.remove('kt-remote-viewing');}catch(e){}

      setTimeout(function(){
        try{
          if(typeof window.ktShowSharedServerFeed==='function')window.ktShowSharedServerFeed();
          else if(typeof window.ktForceHomeVideoRecovery==='function')window.ktForceHomeVideoRecovery(true);
          else if(typeof window.home==='function')window.home();
        }catch(e){}
      },60);
      return;
    }
    if(ev==='host_ready'&&!isHostRole()){
      var hid=remoteHostId();
      if(hid&&String(p.host_id||'')===hid){
        var incomingRun=String(p.run_id||'').trim();
        var incomingStart=Number(p.run_started_at||p.at||0);
        var runChanged=!!(incomingRun&&remoteRunId&&incomingRun!==remoteRunId);
        var staleApproval=!!(incomingStart&&guestApprovedAt&&incomingStart>guestApprovedAt+800);
        if(runChanged||staleApproval)resetGuestForNewRun(hid,incomingRun,incomingStart);
        if(incomingRun)remoteRunId=incomingRun;
        if(incomingStart)remoteRunStartedAt=incomingStart;
        publishRunContext(hid,remoteRunId,remoteRunStartedAt,'viewer');
        if(!viewerConnected)ensureViewerWatch(false);
      }
      return;
    }
    if(ev==='video_watch'&&isHostRole()&&String(p.host_id||'')===DEVICE){hostOfferToViewer(String(p.viewer_id||''),String(p.watch_token||''));return;}
    if(ev==='video_offer'){viewerHandleOffer(p);return;}
    if(ev==='video_answer'){hostHandleAnswer(p);return;}
    if(ev==='video_ice'){handleVideoIce(p);return;}
    if(ev==='guest_request'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      var vid=String(p.viewer_id||'');
      if(vid){
        /* A repeated/late request is not a leave/rejoin signal. If this guest
           is already approved, keep the live host slot and peer untouched. */
        if(approvedGuests[vid]){
          delete pendingRequests[vid];
          return;
        }
        pendingRequests[vid]={name:String(p.name||'게스트'),at:Number(p.at||Date.now())};
        renderDirectRequests();
        replayPendingHostGuestOffer(vid);
      }
      return;
    }
    if(ev==='guest_cancel'){
      var cid=String(p.viewer_id||'').trim();
      /* guest_cancel means "cancel the pending request", not "leave after
         approval". Late/duplicate cancel packets must never remove a guest
         that is already approved and visible in the host room. */
      if(isHostRole()&&String(p.host_id||'')===DEVICE&&cid&&approvedGuests[cid]){
        delete pendingRequests[cid];
        renderDirectRequests();
        return;
      }
      try{
        if(cid){
          delete pendingRequests[cid];
        }
      }catch(e){}
      if(isHostRole())renderDirectRequests();
      return;
    }
    if(ev==='guest_alive'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      var aliveVid=String(p.viewer_id||'').trim();
      if(aliveVid&&approvedGuests[aliveVid]){
        hostGuestAliveAt[aliveVid]=Date.now();
        try{replayPendingHostGuestOffer(aliveVid);}catch(_e){}
      }
      return;
    }
    if(ev==='guest_left'){
      try{
        var lid=String(p.viewer_id||'').trim();
        if(lid){
          delete window.__ktApprovedGuestIds20260924[lid];
          delete window.__ktApprovedGuestNames20260924[lid];
          delete guestJoinNumber20260926[lid];
          window.__ktGuestJoinNumber20260926=guestJoinNumber20260926;
          window.dispatchEvent(new CustomEvent('kt-any-guest-left',{detail:{host_id:String(p.host_id||''),viewer_id:lid,at:Date.now()}}));
        }
      }catch(e){}
      if(isHostRole()&&String(p.host_id||'')===DEVICE)clearApprovedGuestFromHost(String(p.viewer_id||''));
      return;
    }
    if(ev==='guest_approved'){
      try{
        var aid=String(p.viewer_id||'').trim();
        if(aid){
          window.__ktApprovedGuestIds20260924[aid]=true;
          window.__ktApprovedGuestNames20260924[aid]=String(p.name||'게스트');
          var incomingNo=Number(p.guest_no||0);
          if(incomingNo>=1&&incomingNo<=15){
            guestJoinNumber20260926[aid]=incomingNo;
            window.__ktGuestJoinNumber20260926=guestJoinNumber20260926;
          }
        }
        window.dispatchEvent(new CustomEvent('kt-any-guest-approved',{
          detail:{
            host_id:String(p.host_id||''),
            viewer_id:aid,
            name:String(p.name||'게스트'),
            guest_no:Number(p.guest_no||guestJoinNumber20260926[aid]||0),
            at:Number(p.at||Date.now())
          }
        }));
        try{
          if(typeof window.ktForceApprovedGuestGridNow20260924==='function'){
            window.ktForceApprovedGuestGridNow20260924();
          }
        }catch(_e){}
      }catch(e){}
      onGuestApproved(p);
      return;
    }
    if(ev==='guest_request_photo'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      try{
        var rv=String(p.viewer_id||'').trim();
        var rf=String(p.frame||'');
        if(rv&&/^data:image\/jpeg;base64,/.test(rf)&&rf.length<16000){
          pendingGuestPhotos20260926[rv]={frame:rf,name:String(p.name||'게스트'),at:Number(p.at||Date.now())};
          if(approvedGuests[rv])paintHostGuestPhoto20260926(rv,String(p.name||(approvedGuests[rv]&&approvedGuests[rv].name)||'게스트'),rf);
        }
      }catch(e){}
      return;
    }
    if(ev==='guest_photo_frame'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      try{
        var pv=String(p.viewer_id||'').trim();
        var frame=String(p.frame||'');
        if(pv&&approvedGuests[pv]){
          paintHostGuestPhoto20260926(pv,String(p.name||(approvedGuests[pv]&&approvedGuests[pv].name)||'게스트'),frame);
        }
      }catch(e){}
      return;
    }
    if(ev==='guest_offer'){hostGuestOffer(p);return;}
    if(ev==='guest_answer'){guestHandleAnswer(p);return;}
    if(ev==='guest_ice'){handleGuestIce(p);return;}
    if(ev==='guest_media_ready'){
      var readyViewer=String(p.viewer_id||'');
      var readyHost=String(p.host_id||'');
      var readySession=String(p.session_id||'');
      if(readyViewer===viewerId()&&readySession&&readySession===guestSession&&readyHost===String(guestApprovedHost||remoteHostId()||'')){
        guestMediaReadyAt=Date.now();
        clearGuestMediaAckTimer20260926();
        guestMediaRecoveryCount=0;
        try{window.__ktDirectGuestUplinkState20260923='connected';window.__ktDirectGuestUplinkStateAt20260923=Date.now();}catch(e){}
      }
      return;
    }
  }

  async function prepareGuestCameraFromJoinTap20260923(){
    try{adoptExistingSelfCamera20260926();}catch(e){}
    var live=false;
    try{live=!!(guestStream&&guestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(live){
      try{
        window.__ktLocalGuestCameraStream20260926=guestStream;
        window.__ktApprovedGuestSelfStream=guestStream;
        setTimeout(cacheTrustedGuestPhoto20260926,0);
      }catch(e){}
      return true;
    }
    try{
      guestStream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:'user'},width:{ideal:640,max:640},height:{ideal:480,max:480},frameRate:{ideal:15,max:18}},
        audio:true
      });
    }catch(e){
      try{guestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});}
      catch(z){return false;}
    }
    try{
      rememberTrustedGuestCamera20260926(guestStream);
      window.__ktApprovedGuestSelfStream=guestStream;
      setTimeout(cacheTrustedGuestPhoto20260926,0);
      setTimeout(cacheTrustedGuestPhoto20260926,80);
    }catch(e){}
    try{
      if(guestPrewarmTimer)clearTimeout(guestPrewarmTimer);
      guestPrewarmTimer=setTimeout(function(){
        if(guestApproved||requestOn)return;
        try{if(guestStream)guestStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}
        guestStream=null;
        try{
          window.__ktLocalGuestCameraStream20260926=null;
          window.__ktApprovedGuestSelfStream=null;
        }catch(e){}
        guestPrewarmTimer=null;
      },45000);
    }catch(e){}
    return true;
  }

  var __ktRequestTapAt=0,__ktRequestTapBtn=null;
  function directRequestClick(e){
    var b=e.target&&e.target.closest?e.target.closest('#ktRemoteGuestRequest'):null;if(!b)return;
    var hid=remoteHostId();if(!hid)return;
    var now=Date.now();
    if(__ktRequestTapBtn===b&&now-__ktRequestTapAt<650){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      return;
    }
    __ktRequestTapBtn=b;__ktRequestTapAt=now;
    e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    requestOn=!requestOn;
    if(requestOn){
      b.classList.add('kt-requested');b.style.setProperty('box-shadow','0 0 12px #39e575','important');
      /* 이 capture 핸들러가 기존 onclick보다 먼저 실행되므로 여기서 반드시
         카메라를 미리 준비한다. 승인 뒤 getUserMedia를 시작하면 몇 초 늦어진다.
         이미 열린 스트림은 재사용하므로 두 번째 카메라를 만들지 않는다. */
      try{if(window.ktRefreshTurnRelay)window.ktRefreshTurnRelay();}catch(e){}
      try{
        if(adoptExistingSelfCamera20260926()){
          cacheTrustedGuestPhoto20260926();
          sendPreApprovalGuestPhoto20260926(hid);
        }
      }catch(e){}
      try{
        var prep=prepareGuestCameraFromJoinTap20260923();
        if(prep&&prep.then){
          prep.then(function(ok){
            if(requestOn&&ok){
              try{window.dispatchEvent(new CustomEvent('kt-guest-camera-prewarmed',{
                detail:{host_id:hid,viewer_id:viewerId(),at:Date.now()}
              }));}catch(e){}
              [0,90,220,450].forEach(function(ms){
                setTimeout(function(){if(requestOn)try{sendPreApprovalGuestPhoto20260926(hid);}catch(e){}},ms);
              });
              /* Prepare the guest WebRTC connection while waiting for host approval.
                 No camera/mic is sent before approval; only the transport is warmed.
                 When approval arrives, replaceTrack() can show the guest immediately. */
              try{
                var warm=prepareGuestOfferBeforeApproval20260924(hid);
                if(warm&&warm.catch)warm.catch(function(){});
              }catch(e){}
            }
          }).catch(function(){});
        }
      }catch(e){}
      var reqData={host_id:hid,viewer_id:viewerId(),name:profileName(),at:Date.now()};
      /* send() already uses WebSocket first and REST fallback when needed.
         Do not duplicate the same request on both transports. */
      send('guest_request',reqData);
      sharedApprovalPost(hid,'guest_request',reqData.viewer_id,reqData.name);
    }else{
      b.classList.remove('kt-requested');b.style.removeProperty('box-shadow');
      if(!guestApproved){
        try{if(guestPrewarmTimer)clearTimeout(guestPrewarmTimer);}catch(e){}
        guestPrewarmTimer=null;
        try{if(guestStream)guestStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}
        guestStream=null;
        try{
          window.__ktLocalGuestCameraStream20260926=null;
          window.__ktApprovedGuestSelfStream=null;
        }catch(e){}
      }
      sharedApprovalPost(hid,'guest_cancelled',viewerId(),profileName());
      send('guest_cancel',{host_id:hid,viewer_id:viewerId(),at:Date.now()});
    }
  }
  document.addEventListener('pointerdown',directRequestClick,true);
  document.addEventListener('touchstart',directRequestClick,{capture:true,passive:false});
  document.addEventListener('click',directRequestClick,true);

  function roleTick(){
    var host=isHostRole(),hid=host?DEVICE:remoteHostId();
    var role=host?'host':(hid?'viewer':'');
    if(!hid){
      if(!remoteHostMissingSince)remoteHostMissingSince=Date.now();
      /* 모바일 브라우저/네트워크 전환 때 host id가 한두 번 비는 현상은
         실제 퇴장으로 보지 않는다. 12초 이상 계속 비었을 때만 정리한다. */
      if(Date.now()-remoteHostMissingSince<12000)return;

      if(guestApprovedHost)announceGuestLeave(guestApprovedHost);
      lastHostRole='';
      if(lastRemoteHost){
        lastRemoteHost='';
        requestOn=false;guestApproved=false;guestApprovedHost='';
        clearViewerConnectTimer();
        closePc(viewerPc);viewerPc=null;viewerConnected=false;
        closePc(guestPc);guestPc=null;
      }
      return;
    }
    remoteHostMissingSince=0;
    if(host&&lastHostRole!=='host'){
      hostRunId=sid('run');hostRunStartedAt=Date.now();sharedRuntimeStartedAt=hostRunStartedAt-1000;sharedRoomCutCache={};
      try{window.__ktApprovedGuestIds20260924={};}catch(e){}
      publishRunContext(DEVICE,hostRunId,hostRunStartedAt,'host');
      Object.keys(approvedGuests).forEach(function(id){try{clearApprovedGuestFromHost(id);}catch(e){}});
      Object.keys(hostGuestPeers).forEach(function(id){try{closePc(hostGuestPeers[id]&&hostGuestPeers[id].pc);}catch(e){}});
      pendingRequests={};approvedGuests={};hostGuestPeers={};hostGuestAliveAt={};pendingHostGuestOffers={};pendingHostGuestIce={};pendingGuestPhotos20260926={};
      resetGuestJoinNumbers20260926();
    }
    if(activeHostId!==hid||lastHostRole!==role){lastHostRole=role;connect(hid);}
    if(host){
      renderDirectRequests();
      var tickNow=Date.now();
      if(tickNow-lastHostReadyAt>2000){
        lastHostReadyAt=tickNow;
        send('host_ready',{host_id:DEVICE,run_id:hostRunId,run_started_at:hostRunStartedAt,at:tickNow});
      }
    }else{
      if(lastRemoteHost!==hid){lastRemoteHost=hid;viewerWatchToken=sid('watch');viewerConnected=false;}
      ensureViewerWatch(false);
      var tickNow=Date.now();
      if(requestOn&&tickNow-lastGuestRequestAt>1500){
        lastGuestRequestAt=tickNow;
        send('guest_request',{host_id:hid,viewer_id:viewerId(),name:profileName(),at:tickNow});
      }
      if(guestApproved&&guestApprovedHost===hid){
        if(!document.hidden&&tickNow-guestAliveLastSent>1000){
          guestAliveLastSent=tickNow;
          try{sendCriticalMedia20260926('guest_alive',{
            host_id:hid,viewer_id:viewerId(),name:profileName(),at:tickNow
          },hid);}catch(_e){}
        }
        if(!document.hidden&&tickNow-guestAliveSharedLastSent>4000){
          guestAliveSharedLastSent=tickNow;
          sharedApprovalPost(hid,'guest_alive',viewerId(),profileName());
        }
        if(!guestPc||['failed','closed'].indexOf(String(guestPc.connectionState||''))>-1)startGuestCamera(hid);
      }
    }
  }
  setInterval(roleTick,300);
  setTimeout(roleTick,20);
  setInterval(syncSharedApprovalSignals,250);
  setTimeout(syncSharedApprovalSignals,50);

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      var hid=String(e&&e.detail&&e.detail.host_id||'').trim();
      if(!hid)return;

      var current=String(activeHostId||remoteHostId()||lastRemoteHost||'').trim();
      var existing=null,existingLive=false;
      try{
        existing=(e&&e.detail&&e.detail.entry_stream)||window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||window.__ktEntryHostStream20260925||null;
        existingLive=!!(existing&&existing.getVideoTracks&&existing.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));
      }catch(_e){}

      /* Re-selecting the SAME host during approval/DOM transition must never
         reset the viewer watch token or close the already-working host video. */
      if(current&&hid===current&&existingLive){
        lastRemoteHost=hid;
        window.__ktRemoteHostStream=existing;
        window.__ktLastApprovedGuestHostStream=existing;
        viewerConnected=true;
        clearViewerConnectTimer();
        attachRemoteStreamNow(existing);
        [20,70,160].forEach(function(ms){
          setTimeout(function(){attachRemoteStreamNow(existing);},ms);
        });
        return;
      }

      lastRemoteHost=hid;
      viewerWatchToken=sid('watch');
      viewerConnected=false;
      lastWatchAt=0;
      if(activeHostId!==hid)connect(hid);

      try{
        if(existingLive){
          window.__ktRemoteHostStream=existing;
          attachRemoteStreamNow(existing);
        }
      }catch(_e){}

      ensureViewerWatch(true);
      attachRemoteStreamNow();
      [35,100,220,420].forEach(function(ms){
        setTimeout(function(){ensureViewerWatch(true);attachRemoteStreamNow();},ms);
      });
    }catch(z){}
  });

  try{
    var screen=document.getElementById('screen');
    if(screen&&window.MutationObserver){
      new MutationObserver(function(){
        if(window.__ktRemoteHostStream)setTimeout(function(){attachRemoteStreamNow();},0);
      }).observe(screen,{childList:true,subtree:true});
    }
  }catch(e){}

  window.addEventListener('online',function(){if(activeHostId)connect(activeHostId);});
  document.addEventListener('visibilitychange',function(){
    /* Do not announce leave on a brief mobile visibility change.
       Heartbeat stops while hidden; the host clears only after a sustained absence. */
    if(document.hidden)return;
    guestAliveLastSent=0;guestAliveSharedLastSent=0;
    roleTick();setTimeout(function(){attachRemoteStreamNow();},0);
  });
  window.addEventListener('pagehide',function(){
    if(guestApprovedHost||lastRemoteHost)announceGuestLeave(guestApprovedHost||lastRemoteHost);
    clearViewerConnectTimer();
    closeSocket();closePc(viewerPc);closePc(guestPc);
    Object.keys(hostViewPeers).forEach(function(k){closePc(hostViewPeers[k].pc);});
    Object.keys(hostGuestPeers).forEach(function(k){closePc(hostGuestPeers[k].pc);});
  });
})();