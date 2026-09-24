/* K-Talk direct realtime WebRTC transport (2026-09-22)
   Communications only: host video, guest request/approval, approved guest camera.
   Uses Supabase Realtime broadcast and does not depend on Postgres polling.
   Does not change room layout, chat, gifts, earnings, switches, countdown or feed UI. */
(function(){
  if(window.__ktDirectRealtimeRtc20260922)return;
  window.__ktDirectRealtimeRtc20260922=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var REST_BROADCAST='https://'+REF+'.supabase.co/realtime/v1/api/broadcast';
  var ws=null,joined=false,joinRef='',seq=1,topic='',activeHostId='',queue=[],reconnectTimer=null,heartbeatTimer=null;
  var hostViewPeers={};
  var viewerPc=null,viewerSession='',viewerWatchToken='',viewerConnected=false,viewerIce={},viewerConnectTimer=null;
  var pendingRequests={},approvedGuests={},hostGuestPeers={},guestPc=null,guestSession='',guestApprovedHost='',guestApproved=false,guestStream=null,guestIce={};
  var pendingHostGuestOffers={},pendingHostGuestIce={};
  var requestOn=false,lastRemoteHost='',lastHostRole='',lastWatchAt=0;
  var sharedApprovalPollBusy=false,leaveAnnouncedHost='',guestAliveLastSent=0,hostGuestAliveAt={},remoteHostMissingSince=0;
  var signalSeen={},viewerOfferInFlight='',lastHostReadyAt=0,lastGuestRequestAt=0,guestApprovedAt=0;
  var sharedRuntimeStartedAt=Date.now()-5000,sharedRoomCutCache={};
  var hostRunId='',hostRunStartedAt=0,remoteRunId='',remoteRunStartedAt=0;
  window.__ktApprovedGuestIds20260924=window.__ktApprovedGuestIds20260924||{};
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
    guestPc=null;guestSession='';guestApproved=false;guestApprovedHost='';guestApprovedAt=0;requestOn=false;leaveAnnouncedHost='';guestAliveLastSent=0;
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
  function roomEl(){return document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');}
  function isHostRole(){
    try{return !document.documentElement.classList.contains('kt-remote-viewing')&&!!roomEl();}catch(e){return false;}
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
  function restBroadcast(eventName,payload){
    if(!activeHostId)return Promise.resolve(false);
    var body={messages:[{
      topic:channelFor(activeHostId),
      event:eventName,
      payload:payload||{}
    }]};
    try{
      return fetch(REST_BROADCAST,{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json','apikey':KEY},
        body:JSON.stringify(body)
      }).then(function(r){return !!(r&&r.ok);}).catch(function(){return false;});
    }catch(e){return Promise.resolve(false);}
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
    try{delete window.__ktApprovedGuestIds20260924[vid];}catch(e){}
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
    postGuestLeaveShared(hostId);
    try{send('guest_left',data);}catch(e){}
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
    requestOn=false;leaveAnnouncedHost='';guestAliveLastSent=0;
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
        var latest={};
        rows.forEach(function(m){
          var t=String(m.message_type||''),vid='',kind='';
          if(t.indexOf('guest_request:')===0){vid=t.slice(14);kind='request';}
          else if(t.indexOf('guest_cancelled:')===0){vid=t.slice(16);kind='cancel';}
          else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);kind='approved';}
          else if(t.indexOf('guest_alive:')===0){vid=t.slice(12);kind='alive';}
          else if(t.indexOf('guest_left:')===0){vid=t.slice(11);kind='left';}
          if(!vid)return;
          var ts=sharedMsgTime(m);
          if(!latest[vid]||ts>=latest[vid].ts)latest[vid]={kind:kind,ts:ts,name:String(m.sender_name||'게스트')};
        });
        Object.keys(latest).forEach(function(vid){
          var x=latest[vid];
          if(x.kind==='request'){
            /* 같은 게스트가 다시 참여 신청하면 예전 승인 슬롯/영상/peer를 먼저 정리한다.
               이전 영상이 남은 채 새 세션이 겹치지 않게 하고, 새 승인 후 새 연결만 올린다. */
            if(approvedGuests[vid]||hostGuestPeers[vid]){
              clearApprovedGuestFromHost(vid);
            }
            pendingRequests[vid]={name:x.name||'게스트',at:x.ts||Date.now()};
          }else{
            delete pendingRequests[vid];
            if(x.kind==='approved'){
              approvedGuests[vid]=approvedGuests[vid]||{name:x.name||'게스트',at:x.ts||Date.now()};
              try{window.__ktApprovedGuestIds20260924[vid]=true;}catch(e){}
              hostGuestAliveAt[vid]=Math.max(Number(hostGuestAliveAt[vid]||0),Number(x.ts||Date.now()));
              replayPendingHostGuestOffer(vid);
            }else if(x.kind==='alive'){
              /* 새 방송에서 heartbeat만으로 예전 승인을 되살리지 않는다. */
              if(approvedGuests[vid]){
                hostGuestAliveAt[vid]=Math.max(Number(hostGuestAliveAt[vid]||0),Number(x.ts||Date.now()));
                replayPendingHostGuestOffer(vid);
              }
            }else if(x.kind==='left'){
              delete hostGuestAliveAt[vid];
              clearApprovedGuestFromHost(vid);
            }
          }
        });
        var now=Date.now();
        Object.keys(approvedGuests).forEach(function(vid){
          var seen=Number(hostGuestAliveAt[vid]||0);
          if(!seen)return;

          /* 기존 승인 게스트 WebRTC 경로가 같이 동작하는 경우에는
             direct heartbeat 하나가 늦었다는 이유만으로 호스트 슬롯을 지우지 않는다.
             실제 guest_left/cancel 신호는 위에서 그대로 즉시 정리한다. */
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
              if(ap)send('guest_approved',{host_id:DEVICE,viewer_id:vid,name:ap.name||'게스트',at:now,reconnect:true});
              return;
            }

            delete hostGuestAliveAt[vid];
            clearApprovedGuestFromHost(vid);
          }
        });
        renderDirectRequests();
      }else{
        var vid=viewerId(),reqTs=0,cancelTs=0,approvedTs=0,approvedName='게스트';
        rows.forEach(function(m){
          var t=String(m.message_type||''),ts=sharedMsgTime(m);
          if(t==='guest_request:'+vid&&ts>=reqTs)reqTs=ts;
          else if(t==='guest_cancelled:'+vid&&ts>=cancelTs)cancelTs=ts;
          else if(t==='guest_approved:'+vid&&ts>=approvedTs){approvedTs=ts;approvedName=String(m.sender_name||'호스트');}
        });
        if(reqTs&&approvedTs>=reqTs&&approvedTs>=cancelTs&&!guestApproved){
          onGuestApproved({host_id:hid,viewer_id:vid,name:approvedName,at:approvedTs});
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
    reconnectTimer=setTimeout(function(){reconnectTimer=null;if(activeHostId)connect(activeHostId);},250);
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
          if(joined){flush();afterJoin();}
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
    if(main&&(!self||main.srcObject!==self))add(main);

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
    if(!stream)return;
    window.__ktRemoteHostStream=stream;
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
      viewerSession='';
      viewerWatchToken=sid('watch');
      lastWatchAt=0;
      showConnecting();
      ensureViewerWatch(true);
    },Math.max(400,Number(delay||2600)));
  }

  async function hostOfferToViewer(vid,watchToken){
    if(!isHostRole()||activeHostId!==DEVICE)return;
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
      if(ev.candidate)send('video_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});
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
      send('video_offer',{host_id:DEVICE,viewer_id:vid,session_id:session,watch_token:watchToken,offer_sdp:entry.offer});
    }catch(e){closePc(pc);delete hostViewPeers[vid];}
  }

  async function viewerHandleOffer(p){
    if(String(p.viewer_id||'')!==viewerId())return;
    var hid=remoteHostId();if(!hid||String(p.host_id||'')!==hid)return;
    var session=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!session||!sdp)return;
    if(viewerSession===session&&viewerPc&&viewerPc.currentRemoteDescription)return;
    if(viewerOfferInFlight===session)return;
    viewerOfferInFlight=session;

    /* 재연결용 새 offer가 와도 기존 영상부터 끊지 않는다.
       새 PeerConnection이 실제 영상 트랙을 받을 때까지 이전 연결/화면을 유지해
       신호가 잠깐 흔들릴 때 검은 화면으로 바뀌는 시간을 줄인다. */
    var previousPc=viewerPc;
    var previousSession=viewerSession;
    var previousUsable=!!(previousPc&&String(previousPc.connectionState||'')!=='failed'&&String(previousPc.connectionState||'')!=='closed'&&ktRemoteStreamStillLive20260923());
    viewerSession=session;
    if(!previousUsable){viewerConnected=false;showConnecting();}
    window.__ktDirectRtcProgressAt=Date.now();
    window.__ktDirectRtcPhase='offer';
    var pc=new RTCPeerConnection(rtcConfig());viewerPc=pc;
    pc.ontrack=function(ev){
      if(window.__ktUseMemoryGuestVideo20260922){
        try{pc.close();}catch(e){}
        return;
      }
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
      if(ev.candidate)send('video_ice',{host_id:hid,viewer_id:viewerId(),session_id:session,from:'viewer',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});
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

        /* 1.8초 이상 끊기면 기존 화면은 그대로 둔 채 새 watch 세션을 병렬 요청한다.
           새 영상이 도착하면 위 ontrack에서 자연스럽게 교체된다. */
        setTimeout(function(){
          if(viewerPc===pc&&pc.connectionState==='disconnected'){
            viewerWatchToken=sid('watch');
            lastWatchAt=0;
            ensureViewerWatch(true);
          }
        },3500);

        /* 장시간 복구되지 않을 때만 기존 연결을 정리한다. */
        setTimeout(function(){
          if(viewerPc===pc&&pc.connectionState==='disconnected'){
            closePc(pc);viewerPc=null;viewerSession='';viewerConnected=false;viewerWatchToken=sid('watch');showConnecting();
            setTimeout(function(){ensureViewerWatch(true);},240);
          }
        },11000);
      }
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=viewerIce[session]||[];viewerIce[session]=[];
      for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();await pc.setLocalDescription(ans);
      window.__ktDirectRtcProgressAt=Date.now();
      window.__ktDirectRtcPhase='answer-sent';
      send('video_answer',{host_id:hid,viewer_id:viewerId(),session_id:session,answer_sdp:pc.localDescription.sdp});

      /* 기존 영상이 살아 있으면 새 연결 확인 동안 화면을 유지한다.
         기존 영상이 없는 최초 연결만 기존 4.5초 watchdog을 사용한다. */
      if(!previousUsable)retryViewerSoon(4500);
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
          retryViewerSoon(900);
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
    if(window.__ktUseMemoryGuestVideo20260922)return;
    var hid=remoteHostId();if(!hid||isHostRole())return;
    if(!viewerWatchToken)viewerWatchToken=sid('watch');
    var now=Date.now();
    if(!force&&viewerConnected)return;
    if(!force&&now-lastWatchAt<900)return;
    lastWatchAt=now;
    send('video_watch',{host_id:hid,viewer_id:viewerId(),watch_token:viewerWatchToken,at:now});
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
      b.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        var nm=x.name||'게스트';
        /* Host approval UI only:
           run the proven room approval flow first so the guest slot + durable approval
           are created, then mirror the same approval into the direct realtime path. */
        try{
          if(typeof window.ktApproveGuest==='function'){
            var old=window.ktApproveGuest(id,nm,null);
            if(old&&old.catch)old.catch(function(){});
          }
        }catch(_e){}
        approveDirectGuest(id,nm);
      };
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
      slot.classList.remove('kt-guest-approved');
      slot.innerHTML='<span>게스트</span>';
    }catch(e){}
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
    slot.classList.add('kt-guest-approved');

    var existingVideo=slot.querySelector('video');
    if(!existingVideo){
      slot.innerHTML='<video autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#08090c"></video><small style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:8px">게스트 연결 중...</small><span class="kt-guest-name" style="position:absolute;left:4px;bottom:4px;z-index:3;font-size:8px;background:#000b;padding:2px 5px;border-radius:8px">👤 '+esc(name)+'</span>';
    }
    return slot;
  }
  function attachGuestToHost(vid,name,stream){
    var slot=guestSlot(vid,name);if(!slot||!stream)return;
    var v=slot.querySelector('video');if(v){v.srcObject=stream;v.muted=true;v.playsInline=true;try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
    var sm=slot.querySelector('small');if(sm)sm.style.display='none';
  }
  function approveDirectGuest(vid,name){
    vid=String(vid||'').trim();
    if(!vid)return;
    approvedGuests[vid]={name:name||'게스트',at:Date.now()};
    try{window.__ktApprovedGuestIds20260924[vid]=true;}catch(e){}
    delete pendingRequests[vid];guestSlot(vid,name);renderDirectRequests();
    replayPendingHostGuestOffer(vid);
    var data={host_id:DEVICE,viewer_id:vid,name:name||'게스트',at:Date.now()};
    sharedApprovalPost(DEVICE,'guest_approved',vid,profileName());
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,profileName());},250);
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,profileName());},800);
    setTimeout(function(){sharedApprovalPost(DEVICE,'guest_approved',vid,profileName());},1600);
    send('guest_approved',data);
    setTimeout(function(){send('guest_approved',data);},300);
    setTimeout(function(){send('guest_approved',data);},900);
    setTimeout(function(){send('guest_approved',data);},1800);
  }
  window.ktDirectApproveGuest20260922=function(vid,name){
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
    try{
      if(typeof window.ktApproveGuest==='function'){
        var old=window.ktApproveGuest(data.vid,data.name,null);
        if(old&&old.catch)old.catch(function(){});
      }
    }catch(_e){}
    approveDirectGuest(data.vid,data.name);
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

    /* 빠른 Realtime 경로를 우선 사용하고, 느린 DB 경로는 실패 시 보조로 둔다.
       신청 때 미리 연 카메라 스트림을 그대로 재사용한다. */
    var live=false;try{live=!!(guestStream&&guestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(!live){
      try{
        var shared=window.__ktApprovedGuestSelfStream||null;
        var sharedLive=!!(shared&&shared.getVideoTracks&&shared.getVideoTracks().some(function(t){return t.readyState==='live';}));
        if(sharedLive){guestStream=shared;live=true;}
      }catch(e){}
    }
    /* 신청 순간 미리 연 카메라를 그대로 재사용한다. 없을 때만 한 번 연다. */
    if(!live){
      try{guestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});}
      catch(e){try{guestStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});}catch(z){return;}}
    }
    try{if(guestStream)window.__ktApprovedGuestSelfStream=guestStream;}catch(e){}
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

  function scheduleGuestOfferRetries(hid,pc,payload){
    if(!pc||!payload)return;
    clearGuestOfferRetryTimers(pc);
    pc.__ktGuestOfferRetryTimers=[];
    [180,450,900,1600].forEach(function(ms){
      var t=setTimeout(function(){
        if(guestPc!==pc||guestSession!==payload.session_id||!guestApproved||guestApprovedHost!==hid)return;
        var cs=String(pc.connectionState||''),is=String(pc.iceConnectionState||'');
        if(cs==='connected'||is==='connected'||is==='completed')return;
        send('guest_offer',payload);
      },ms);
      pc.__ktGuestOfferRetryTimers.push(t);
    });
  }

  async function makeGuestOffer(hid){
    if(!guestApproved||guestApprovedHost!==hid||!guestStream)return;
    if(guestPc&&['new','connecting','connected'].indexOf(String(guestPc.connectionState||''))>-1)return;
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
    pc.onicecandidate=function(ev){if(ev.candidate)send('guest_ice',{host_id:hid,viewer_id:viewerId(),session_id:guestSession,from:'guest',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});};
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
      },2500);
      }
    };
    try{
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});await pc.setLocalDescription(offer);
      var guestOfferPayload={host_id:hid,viewer_id:viewerId(),name:profileName(),session_id:guestSession,offer_sdp:pc.localDescription.sdp};
      send('guest_offer',guestOfferPayload);
      scheduleGuestOfferRetries(hid,pc,guestOfferPayload);

      /* connectionState가 new/connecting에 오래 멈춘 경우 기존 코드는 계속 기다릴 수 있었다.
         4.5초 안에 실제 연결이 안 되면 그 세션만 새로 만들어 빠르게 재시도한다. */
      setTimeout(function(){
        if(guestPc!==pc||!guestApproved||guestApprovedHost!==hid)return;
        var cs=String(pc.connectionState||''),is=String(pc.iceConnectionState||'');
        if(cs==='connected'||is==='connected'||is==='completed')return;
        clearGuestOfferRetryTimers(pc);
        try{closePc(pc);}catch(e){}
        if(guestPc===pc)guestPc=null;
        setTimeout(function(){makeGuestOffer(hid);},180);
      },3500);
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
    setTimeout(function(){
      try{
        var q=hostGuestOffer(box.payload);
        if(q&&q.catch)q.catch(function(){});
      }catch(e){}
    },0);
  }

  async function hostGuestOffer(p){
    if(!isHostRole()||String(p.host_id||'')!==DEVICE)return;
    var vid=String(p.viewer_id||'');
    var session=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!vid||!session||!sdp)return;
    if(!approvedGuests[vid]){
      pendingHostGuestOffers[vid]={payload:p,at:Date.now()};
      return;
    }
    hostGuestAliveAt[vid]=Date.now();
    delete pendingHostGuestOffers[vid];
    var old=hostGuestPeers[vid]||null;

    /* REST + WebSocket 이중 신호로 같은 guest_offer가 중복 도착할 수 있다.
       같은 세션을 다시 PeerConnection으로 만들면 서로 덮어써서 연결이 늦어질 수 있으므로
       기존 세션을 유지하고, 이미 만든 answer가 있으면 다시 보내기만 한다. */
    if(old&&old.sid===session&&old.pc&&String(old.pc.connectionState||'')!=='closed'){
      if(old.answer){
        send('guest_answer',{host_id:DEVICE,viewer_id:vid,session_id:session,answer_sdp:old.answer});
      }
      return;
    }

    var iceKey=hostGuestSignalKey(vid,session);
    var cachedGuestIce=pendingHostGuestIce[iceKey]||[];
    delete pendingHostGuestIce[iceKey];
    var pc=new RTCPeerConnection(rtcConfig()),entry={pc:pc,sid:session,ice:cachedGuestIce.slice(0,32),old:old,answer:'',gotTrack:false};hostGuestPeers[vid]=entry;
    pc.ontrack=function(ev){
      entry.gotTrack=true;
      attachGuestToHost(vid,String(p.name||approvedGuests[vid].name||'게스트'),(ev.streams&&ev.streams[0])||new MediaStream([ev.track]));
      /* 새 영상이 실제로 도착한 뒤에만 예전 연결을 닫아 화면 깜빡임을 줄인다. */
      if(entry.old&&entry.old.pc){try{closePc(entry.old.pc);}catch(e){}entry.old=null;}
    };
    pc.onicecandidate=function(ev){if(ev.candidate)send('guest_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});};
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
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
      },10000);
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=entry.ice.splice(0);for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();await pc.setLocalDescription(ans);
      entry.answer=pc.localDescription.sdp;
      var guestAnswerPayload={host_id:DEVICE,viewer_id:vid,session_id:session,answer_sdp:entry.answer};
      send('guest_answer',guestAnswerPayload);
      [700,1800,3600].forEach(function(ms){
        setTimeout(function(){
          if(hostGuestPeers[vid]!==entry||entry.gotTrack)return;
          var cs=String(pc.connectionState||'');
          if(cs==='failed'||cs==='closed')return;
          send('guest_answer',guestAnswerPayload);
        },ms);
      });

      /* 호스트 칸이 계속 '게스트 연결 중'이면 그 게스트 연결만 새로 요청한다.
         다른 게스트 peer나 방 UI는 건드리지 않는다. */
      setTimeout(function(){
        if(hostGuestPeers[vid]!==entry||entry.gotTrack)return;
        var cs=String(pc.connectionState||'');
        if(cs==='closed')return;
        try{closePc(pc);}catch(e){}
        if(hostGuestPeers[vid]===entry)delete hostGuestPeers[vid];
        var ap=approvedGuests[vid];
        if(ap){
          var reconnect={host_id:DEVICE,viewer_id:vid,name:ap.name||'게스트',at:Date.now(),reconnect:true};
          send('guest_approved',reconnect);
          setTimeout(function(){send('guest_approved',reconnect);},500);
        }
      },4000);
    }catch(e){
      closePc(pc);
      if(hostGuestPeers[vid]===entry){
        if(entry.old&&entry.old.pc&&String(entry.old.pc.connectionState||'')!=='closed')hostGuestPeers[vid]=entry.old;
        else delete hostGuestPeers[vid];
      }
    }
  }
  async function guestHandleAnswer(p){
    if(String(p.viewer_id||'')!==viewerId()||String(p.host_id||'')!==guestApprovedHost)return;
    if(!guestPc||guestSession!==String(p.session_id||''))return;
    try{
      clearGuestOfferRetryTimers(guestPc);
      if(!guestPc.currentRemoteDescription)await guestPc.setRemoteDescription({type:'answer',sdp:String(p.answer_sdp||'')});
      var q=guestIce[guestSession]||[];guestIce[guestSession]=[];
      for(var i=0;i<q.length;i++)try{await guestPc.addIceCandidate(q[i]);}catch(e){}
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

    requestOn=false;
    guestApproved=true;
    guestApprovedHost=hid;
    guestApprovedAt=Date.now();
    leaveAnnouncedHost='';
    guestAliveLastSent=0;

    var b=document.getElementById('ktRemoteGuestRequest');
    if(b){
      b.classList.remove('kt-requested');
      b.style.removeProperty('box-shadow');
      b.setAttribute('title','참여 승인됨');
      b.setAttribute('aria-label','참여 승인됨');
    }

    /* 기존 승인 게스트 카메라가 준비되면 그 같은 스트림을 실시간 경로에도 붙인다.
       카메라를 두 번 열지 않고, 호스트 수신 경로만 이중화한다. */
    startGuestCamera(hid);
    [80,250,600,1200,2200].forEach(function(ms){
      setTimeout(function(){if(guestApproved&&guestApprovedHost===hid)startGuestCamera(hid);},ms);
    });

    try{window.dispatchEvent(new CustomEvent('kt-guest-approval-received',{detail:{host_id:hid,viewer_id:viewerId()}}));}catch(e){}
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
        /* 재입장 신청은 새 세션으로 취급: 기존 게스트 영상/승인/peer를 즉시 비운다. */
        if(approvedGuests[vid]||hostGuestPeers[vid]){
          clearApprovedGuestFromHost(vid);
        }
        pendingRequests[vid]={name:String(p.name||'게스트'),at:Date.now()};
        renderDirectRequests();
      }
      return;
    }
    if(ev==='guest_cancel'&&isHostRole()){
      delete pendingRequests[String(p.viewer_id||'')];renderDirectRequests();return;
    }
    if(ev==='guest_left'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      clearApprovedGuestFromHost(String(p.viewer_id||''));return;
    }
    if(ev==='guest_approved'){onGuestApproved(p);return;}
    if(ev==='guest_offer'){hostGuestOffer(p);return;}
    if(ev==='guest_answer'){guestHandleAnswer(p);return;}
    if(ev==='guest_ice'){handleGuestIce(p);return;}
  }

  async function prepareGuestCameraFromJoinTap20260923(){
    var live=false;
    try{live=!!(guestStream&&guestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(live)return true;
    try{
      guestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});
      return true;
    }catch(e){
      try{
        guestStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
        return true;
      }catch(z){return false;}
    }
  }

  function directRequestClick(e){
    var b=e.target&&e.target.closest?e.target.closest('#ktRemoteGuestRequest'):null;if(!b)return;
    var hid=remoteHostId();if(!hid)return;
    e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    requestOn=!requestOn;
    if(requestOn){
      b.classList.add('kt-requested');b.style.setProperty('box-shadow','0 0 12px #39e575','important');
      /* 기존 승인 게스트 연결이 카메라를 맡는 경우 여기서 두 번째 카메라 스트림을 열지 않는다. */
      if(!useLegacyApprovedGuestUplink()){
        try{
          var prep=prepareGuestCameraFromJoinTap20260923();
          if(prep&&prep.catch)prep.catch(function(){});
        }catch(e){}
      }
      sharedApprovalPost(hid,'guest_request',viewerId(),profileName());
      send('guest_request',{host_id:hid,viewer_id:viewerId(),name:profileName(),at:Date.now()});
    }else{
      b.classList.remove('kt-requested');b.style.removeProperty('box-shadow');
      sharedApprovalPost(hid,'guest_cancelled',viewerId(),profileName());
      send('guest_cancel',{host_id:hid,viewer_id:viewerId(),at:Date.now()});
    }
  }
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
      pendingRequests={};approvedGuests={};hostGuestPeers={};hostGuestAliveAt={};pendingHostGuestOffers={};pendingHostGuestIce={};
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
        if(!document.hidden&&tickNow-guestAliveLastSent>4000){
          guestAliveLastSent=tickNow;
          sharedApprovalPost(hid,'guest_alive',viewerId(),profileName());
        }
        if(!guestPc||['failed','closed'].indexOf(String(guestPc.connectionState||''))>-1)startGuestCamera(hid);
      }
    }
  }
  setInterval(roleTick,300);
  setTimeout(roleTick,20);
  setInterval(syncSharedApprovalSignals,700);
  setTimeout(syncSharedApprovalSignals,120);

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      var hid=String(e&&e.detail&&e.detail.host_id||'').trim();
      if(!hid)return;
      lastRemoteHost=hid;
      if(window.__ktUseMemoryGuestVideo20260922)return;
      viewerWatchToken=sid('watch');
      viewerConnected=false;
      lastWatchAt=0;
      if(activeHostId!==hid)connect(hid);
      else if(joined)ensureViewerWatch(true);
      setTimeout(function(){ensureViewerWatch(true);attachRemoteStreamNow();},80);
      setTimeout(function(){ensureViewerWatch(true);attachRemoteStreamNow();},220);
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
    guestAliveLastSent=0;
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