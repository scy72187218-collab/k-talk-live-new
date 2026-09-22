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
  var requestOn=false,lastRemoteHost='',lastHostRole='',lastWatchAt=0;
  var sharedApprovalPollBusy=false;

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
  function remoteHostId(){
    var id='';
    try{id=String(window.__ktRemoteHostId||'');}catch(e){}
    if(!id)try{id=String(sessionStorage.getItem('kt_remote_host_id')||'');}catch(e){}
    return id;
  }
  function rtcConfig(){return window.ktGetRtcConfig?window.ktGetRtcConfig():{iceServers:[{urls:'stun:stun.cloudflare.com:3478'},{urls:'stun:stun.l.google.com:19302'}]};}
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

    /* Durable signaling: REST Broadcast is cluster-wide and does not depend
       on one Vercel function instance. Keep WS send as a low-latency second path. */
    restBroadcast(eventName,payload);

    if(!joined||!ws||ws.readyState!==1){
      queue.push({event:eventName,payload:payload});
      if(queue.length>40)queue=queue.slice(-40);
      return;
    }
    try{
      ws.send(JSON.stringify({
        topic:topic,event:'broadcast',
        payload:{type:'broadcast',event:eventName,payload:payload},
        ref:String(seq++),join_ref:joinRef
      }));
    }catch(e){}
  }
  function flush(){
    if(!joined)return;
    var q=queue.splice(0);
    q.forEach(function(x){send(x.event,x.payload);});
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
      message:type.indexOf('approved')>-1?'참여 승인':(type.indexOf('cancelled')>-1?'참여 신청 취소':'방송 참여 신청'),
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

  async function syncSharedApprovalSignals(){
    if(sharedApprovalPollBusy)return;
    var host=isHostRole(),hid=host?DEVICE:remoteHostId();
    if(!hid)return;
    sharedApprovalPollBusy=true;
    try{
      var r=await fetch('/api/live-interaction-memory?action=messages&host_id='+encodeURIComponent(hid)+'&t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      var j=await r.json(),rows=Array.isArray(j&&j.messages)?j.messages:[];
      if(host){
        var latest={};
        rows.forEach(function(m){
          var t=String(m.message_type||''),vid='',kind='';
          if(t.indexOf('guest_request:')===0){vid=t.slice(14);kind='request';}
          else if(t.indexOf('guest_cancelled:')===0){vid=t.slice(16);kind='cancel';}
          else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);kind='approved';}
          if(!vid)return;
          var ts=sharedMsgTime(m);
          if(!latest[vid]||ts>=latest[vid].ts)latest[vid]={kind:kind,ts:ts,name:String(m.sender_name||'게스트')};
        });
        Object.keys(latest).forEach(function(vid){
          var x=latest[vid];
          if(x.kind==='request'){
            pendingRequests[vid]={name:x.name||'게스트',at:x.ts||Date.now()};
            delete approvedGuests[vid];
          }else{
            delete pendingRequests[vid];
            if(x.kind==='approved')approvedGuests[vid]=approvedGuests[vid]||{name:x.name||'게스트',at:x.ts||Date.now()};
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
      send('host_ready',{host_id:DEVICE,at:Date.now()});
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
    stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream);}catch(e){}});
    pc.onicecandidate=function(ev){
      if(ev.candidate)send('video_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='failed'||st==='closed'){if(hostViewPeers[vid]===entry)delete hostViewPeers[vid];}
      if(st==='disconnected')setTimeout(function(){if(hostViewPeers[vid]===entry&&pc.connectionState==='disconnected'){closePc(pc);delete hostViewPeers[vid];}},8000);
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
    closePc(viewerPc);viewerPc=null;viewerSession=session;viewerConnected=false;showConnecting();
    var pc=new RTCPeerConnection(rtcConfig());viewerPc=pc;
    pc.ontrack=function(ev){
      if(window.__ktUseMemoryGuestVideo20260922){
        try{pc.close();}catch(e){}
        return;
      }
      viewerConnected=true;
      clearViewerConnectTimer();
      showRemoteStream((ev.streams&&ev.streams[0])||new MediaStream([ev.track]));
    };
    pc.onicecandidate=function(ev){
      if(ev.candidate)send('video_ice',{host_id:hid,viewer_id:viewerId(),session_id:session,from:'viewer',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});
    };
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='connected'){
        viewerConnected=true;
        clearViewerConnectTimer();
        var x=document.getElementById('ktRemoteLiveStatus');if(x)x.style.display='none';
      }
      if(st==='failed'||st==='closed'){if(viewerPc===pc){viewerConnected=false;viewerPc=null;viewerSession='';viewerWatchToken=sid('watch');showConnecting();}}
      if(st==='disconnected')setTimeout(function(){if(viewerPc===pc&&pc.connectionState==='disconnected'){closePc(pc);viewerPc=null;viewerSession='';viewerConnected=false;viewerWatchToken=sid('watch');showConnecting();}},5000);
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=viewerIce[session]||[];viewerIce[session]=[];
      for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();await pc.setLocalDescription(ans);
      send('video_answer',{host_id:hid,viewer_id:viewerId(),session_id:session,answer_sdp:pc.localDescription.sdp});
      retryViewerSoon(2800);
    }catch(e){
      closePc(pc);
      if(viewerPc===pc){viewerPc=null;viewerSession='';viewerConnected=false;}
      retryViewerSoon(900);
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
    if(!force&&now-lastWatchAt<250)return;
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
      var x=pendingRequests[id],b=document.createElement('button');b.type='button';b.textContent='👤 '+String(x.name||'게스트')+' 올리기';
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
  function guestSlot(vid,name){
    var slot=null;
    try{
      slot=document.querySelector('.ktg13-guest[data-kt-direct-guest="'+CSS.escape(vid)+'"]')
        ||document.querySelector('.ktg13-guest[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]');
    }catch(e){}
    if(!slot){
      var all=[].slice.call(document.querySelectorAll('#screen .ktg13-room .ktg13-guest'));
      for(var i=0;i<all.length;i++){
        if(!all[i].dataset.ktDirectGuest&&!all[i].dataset.ktGuestViewerId){slot=all[i];break;}
      }
    }
    if(!slot)return null;
    if(!slot.dataset.ktDirectGuest){
      slot.dataset.ktDirectGuest=vid;
      slot.classList.add('kt-guest-approved');
      var existingVideo=slot.querySelector('video');
      if(!existingVideo){
        slot.innerHTML='<video autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#08090c"></video><small style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:8px">게스트 연결 중...</small><span class="kt-guest-name" style="position:absolute;left:4px;bottom:4px;z-index:3;font-size:8px;background:#000b;padding:2px 5px;border-radius:8px">👤 '+esc(name)+'</span>';
      }
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
    delete pendingRequests[vid];guestSlot(vid,name);renderDirectRequests();
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

  async function startGuestCamera(hid){
    if(!guestApproved||guestApprovedHost!==hid)return;
    var live=false;try{live=!!(guestStream&&guestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(!live){
      try{guestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});}
      catch(e){try{guestStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});}catch(z){return;}}
    }
    makeGuestOffer(hid);
  }
  async function makeGuestOffer(hid){
    if(!guestApproved||guestApprovedHost!==hid||!guestStream)return;
    if(guestPc&&['new','connecting','connected'].indexOf(String(guestPc.connectionState||''))>-1)return;
    closePc(guestPc);guestPc=null;guestSession=sid('guest');
    var pc=new RTCPeerConnection(rtcConfig());guestPc=pc;
    guestStream.getTracks().forEach(function(t){try{pc.addTrack(t,guestStream);}catch(e){}});
    pc.onicecandidate=function(ev){if(ev.candidate)send('guest_ice',{host_id:hid,viewer_id:viewerId(),session_id:guestSession,from:'guest',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});};
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='failed'||st==='closed'){if(guestPc===pc){guestPc=null;setTimeout(function(){makeGuestOffer(hid);},800);}}
      if(st==='disconnected')setTimeout(function(){if(guestPc===pc&&pc.connectionState==='disconnected'){closePc(pc);guestPc=null;setTimeout(function(){makeGuestOffer(hid);},500);}},5000);
    };
    try{
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});await pc.setLocalDescription(offer);
      send('guest_offer',{host_id:hid,viewer_id:viewerId(),name:profileName(),session_id:guestSession,offer_sdp:pc.localDescription.sdp});
    }catch(e){closePc(pc);if(guestPc===pc)guestPc=null;}
  }
  async function hostGuestOffer(p){
    if(!isHostRole()||String(p.host_id||'')!==DEVICE)return;
    var vid=String(p.viewer_id||'');if(!vid||!approvedGuests[vid])return;
    var session=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!session||!sdp)return;
    var old=hostGuestPeers[vid];if(old)closePc(old.pc);
    var pc=new RTCPeerConnection(rtcConfig()),entry={pc:pc,sid:session,ice:[]};hostGuestPeers[vid]=entry;
    pc.ontrack=function(ev){attachGuestToHost(vid,String(p.name||approvedGuests[vid].name||'게스트'),(ev.streams&&ev.streams[0])||new MediaStream([ev.track]));};
    pc.onicecandidate=function(ev){if(ev.candidate)send('guest_ice',{host_id:DEVICE,viewer_id:vid,session_id:session,from:'host',candidate:ev.candidate.toJSON?ev.candidate.toJSON():ev.candidate});};
    pc.onconnectionstatechange=function(){
      var st=String(pc.connectionState||'');
      if(st==='failed'||st==='closed'){if(hostGuestPeers[vid]===entry)delete hostGuestPeers[vid];}
      if(st==='disconnected')setTimeout(function(){if(hostGuestPeers[vid]===entry&&pc.connectionState==='disconnected'){closePc(pc);delete hostGuestPeers[vid];}},8000);
    };
    try{
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var q=entry.ice.splice(0);for(var i=0;i<q.length;i++)try{await pc.addIceCandidate(q[i]);}catch(e){}
      var ans=await pc.createAnswer();await pc.setLocalDescription(ans);
      send('guest_answer',{host_id:DEVICE,viewer_id:vid,session_id:session,answer_sdp:pc.localDescription.sdp});
    }catch(e){closePc(pc);delete hostGuestPeers[vid];}
  }
  async function guestHandleAnswer(p){
    if(String(p.viewer_id||'')!==viewerId()||String(p.host_id||'')!==guestApprovedHost)return;
    if(!guestPc||guestSession!==String(p.session_id||''))return;
    try{
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
      var e=hostGuestPeers[String(p.viewer_id||'')];if(!e||e.sid!==session)return;
      if(e.pc.remoteDescription){try{await e.pc.addIceCandidate(cand);}catch(z){}}
      else e.ice.push(cand);
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

    var b=document.getElementById('ktRemoteGuestRequest');
    if(b){
      b.classList.remove('kt-requested');
      b.style.removeProperty('box-shadow');
      b.setAttribute('title','참여 승인됨');
      b.setAttribute('aria-label','참여 승인됨');
    }

    /* 승인 직후 카메라 연결을 즉시 시작하고, 모바일에서 권한/스트림 생성이
       한 박자 늦는 경우만 짧게 재시도한다. */
    startGuestCamera(hid);
    setTimeout(function(){if(guestApproved&&guestApprovedHost===hid)startGuestCamera(hid);},250);
    setTimeout(function(){if(guestApproved&&guestApprovedHost===hid)startGuestCamera(hid);},700);
    setTimeout(function(){if(guestApproved&&guestApprovedHost===hid)startGuestCamera(hid);},1500);

    try{window.dispatchEvent(new CustomEvent('kt-guest-approval-received',{detail:{host_id:hid,viewer_id:viewerId()}}));}catch(e){}
  }
  function handleSignal(ev,p){
    if(ev==='host_ready'&&!isHostRole()){
      var hid=remoteHostId();
      if(hid&&String(p.host_id||'')===hid&&!viewerConnected)ensureViewerWatch(false);
      return;
    }
    if(ev==='video_watch'&&isHostRole()&&String(p.host_id||'')===DEVICE){hostOfferToViewer(String(p.viewer_id||''),String(p.watch_token||''));return;}
    if(ev==='video_offer'){viewerHandleOffer(p);return;}
    if(ev==='video_answer'){hostHandleAnswer(p);return;}
    if(ev==='video_ice'){handleVideoIce(p);return;}
    if(ev==='guest_request'&&isHostRole()&&String(p.host_id||'')===DEVICE){
      var vid=String(p.viewer_id||'');if(vid){pendingRequests[vid]={name:String(p.name||'게스트'),at:Date.now()};renderDirectRequests();}return;
    }
    if(ev==='guest_cancel'&&isHostRole()){
      delete pendingRequests[String(p.viewer_id||'')];renderDirectRequests();return;
    }
    if(ev==='guest_approved'){onGuestApproved(p);return;}
    if(ev==='guest_offer'){hostGuestOffer(p);return;}
    if(ev==='guest_answer'){guestHandleAnswer(p);return;}
    if(ev==='guest_ice'){handleGuestIce(p);return;}
  }

  function directRequestClick(e){
    var b=e.target&&e.target.closest?e.target.closest('#ktRemoteGuestRequest'):null;if(!b)return;
    var hid=remoteHostId();if(!hid)return;
    e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    requestOn=!requestOn;
    if(requestOn){
      b.classList.add('kt-requested');b.style.setProperty('box-shadow','0 0 12px #39e575','important');
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
    if(activeHostId!==hid||lastHostRole!==role){lastHostRole=role;connect(hid);}
    if(host){
      renderDirectRequests();
      send('host_ready',{host_id:DEVICE,at:Date.now()});
    }else{
      if(lastRemoteHost!==hid){lastRemoteHost=hid;viewerWatchToken=sid('watch');viewerConnected=false;}
      ensureViewerWatch(false);
      if(requestOn)send('guest_request',{host_id:hid,viewer_id:viewerId(),name:profileName(),at:Date.now()});
      if(guestApproved&&guestApprovedHost===hid&&(!guestPc||['failed','closed'].indexOf(String(guestPc.connectionState||''))>-1))startGuestCamera(hid);
    }
  }
  setInterval(roleTick,250);
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
  document.addEventListener('visibilitychange',function(){if(!document.hidden){roleTick();setTimeout(function(){attachRemoteStreamNow();},0);}});
  window.addEventListener('pagehide',function(){
    clearViewerConnectTimer();
    closeSocket();closePc(viewerPc);closePc(guestPc);
    Object.keys(hostViewPeers).forEach(function(k){closePc(hostViewPeers[k].pc);});
    Object.keys(hostGuestPeers).forEach(function(k){closePc(hostGuestPeers[k].pc);});
  });
})();