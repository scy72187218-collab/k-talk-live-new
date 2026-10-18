/* K-Talk LiveKit SFU bridge (2026-09-24)
   Scope: transport fallback/accelerator only.
   - Does not change room layout, buttons, chat, gifts, badges, directions, countdowns, or earnings.
   - Reuses the existing camera/mic MediaStream; it never opens a second camera.
   - Existing direct WebRTC paths stay active as fallback while this bridge is tested. */
(function(){
  if(window.__ktLiveKitSfuBridge20260924)return;
  window.__ktLiveKitSfuBridge20260924=true;
  var TOKEN_URL='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-livekit-token';
  var SDK_URL='https://cdn.jsdelivr.net/npm/livekit-client@2.22.3/dist/livekit-client.umd.min.js';

  var hostTickBusy=false,hostFailureCount=0,hostRetryAt=0;
  var room=null,currentHostId='',currentRole='',currentRunId='',connecting=false,reconnectRetryTimer=null,reconnectHoldUntil=0;
  var publishedVideoId='',publishedAudioId='',lastConnectAt=0;
  var approvedHostId='',watchHostId='',audioEls={},audioTracks={},guestVideoById={};
  var sdkPromise=null,connectGeneration20261015=0;
  var sdkStreams=new WeakMap(),streamTracks=new WeakMap(),videoTracks=new WeakMap(),videoRecovery20261015=new WeakMap();

  window.__ktLiveKitSfuState20260924={
    enabled:true,connected:false,connecting:false,url:'',hostId:'',role:'',lastError:''
  };

  function setState(p){
    try{
      Object.keys(p||{}).forEach(function(k){window.__ktLiveKitSfuState20260924[k]=p[k];});
      document.documentElement.setAttribute('data-kt-sfu-state',JSON.stringify({hostId:window.__ktLiveKitSfuState20260924.hostId,role:window.__ktLiveKitSfuState20260924.role,connected:window.__ktLiveKitSfuState20260924.connected,connecting:window.__ktLiveKitSfuState20260924.connecting,error:window.__ktLiveKitSfuState20260924.lastError||''}));
      window.dispatchEvent(new CustomEvent('kt-livekit-state',{detail:Object.assign({},window.__ktLiveKitSfuState20260924)}));
    }catch(e){}
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
  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        return String(p.nickname||p.name||p.displayName||'K-Talk').slice(0,60);
      }
    }catch(e){}
    try{return String(localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'K-Talk').slice(0,60);}catch(e){}
    return 'K-Talk';
  }
  function roomEl(){
    return Array.from(document.querySelectorAll('#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room')).find(function(el){return !el.closest('.kt-remote-live,.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-prejoin-room-grid,.kt-guest-room-grid');})||null;
  }
  function isHostRole(){
    try{
      var local=roomEl();
      if(local){
        var visible=true;
        try{
          var st=getComputedStyle(local);
          visible=st.display!=='none'&&st.visibility!=='hidden'&&
            (!local.getClientRects||local.getClientRects().length>0);
        }catch(_e){visible=true;}
        /* A stale kt-remote-viewing class must never make a visible local
           host room join the SFU as a viewer. */
        if(visible)return true;
      }
      return false;
    }catch(e){return false;}
  }
  function viewerExplicitlyExited20261015(){try{return localStorage.getItem('kt_explicit_guest_exit:'+DEVICE)==='1';}catch(e){return false;}}
  function liveStream(s){
    try{return !!(s&&s.getTracks&&s.getTracks().some(function(t){return t&&t.readyState==='live';}));}catch(e){return false;}
  }
  function hostStream(){
    try{if(window.state&&liveStream(window.state.stream))return window.state.stream;}catch(e){}
    try{
      var r=roomEl(),v=r&&r.querySelector('video'),s=v&&v.srcObject;
      if(liveStream(s))return s;
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
  function guestStream(){
    try{
      var remote=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
      var local=window.__ktLocalGuestCameraStream20260926||null;
      if(liveStream(local)&&!sameVideoSource20260926(local,remote))return local;

      var s=window.__ktApprovedGuestSelfStream||null;
      if(liveStream(s)&&!sameVideoSource20260926(s,remote)){
        try{window.__ktLocalGuestCameraStream20260926=s;}catch(_e){}
        return s;
      }
      if(liveStream(s)&&sameVideoSource20260926(s,remote)){
        try{window.__ktApprovedGuestSelfStream=null;}catch(_e){}
      }
    }catch(e){}
    return null;
  }
  function remoteHostId(){
    var h='';
    try{h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!h)try{h=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return h;
  }
  function approvedGuestTransportReady(){
    var h=remoteHostId(),s=guestStream();
    if(!h||!s)return false;
    /* SFU is an independent fallback. Do not wait for the direct uplink to
       become connecting/connected before joining and publishing. */
    try{
      var me=viewerId();
      var approved=window.__ktApprovedGuestIds20260924||{};
      if(approved[me]===true)return true;
    }catch(e){}
    var st='';
    try{st=String(window.__ktDirectGuestUplinkState20260923||'');}catch(e){}
    return st==='connecting'||st==='connected'||st==='media-retry';
  }
  function cleanRoom(hostId,runId){
    var h=String(hostId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,72);
    /* Use one stable SFU room per host. A guest can miss the host_ready/run-id
       packet while direct WebRTC still shows the host video; tying the SFU
       room name to run_id then prevents that guest from ever publishing. */
    return 'ktalk_'+h;
  }
  function ensureSdk(){
    if(window.LivekitClient&&window.LivekitClient.Room)return Promise.resolve(window.LivekitClient);
    if(sdkPromise)return sdkPromise;
    sdkPromise=new Promise(function(resolve,reject){
      var old=document.querySelector('script[data-kt-livekit-sdk="1"]');
      if(old){
        var wait=0,t=setInterval(function(){
          wait+=1;
          if(window.LivekitClient&&window.LivekitClient.Room){clearInterval(t);resolve(window.LivekitClient);}
          else if(wait>80){clearInterval(t);reject(new Error('livekit_sdk_timeout'));}
        },100);
        return;
      }
      var s=document.createElement('script');
      s.src=SDK_URL;s.async=true;s.dataset.ktLivekitSdk='1';
      s.onload=function(){window.LivekitClient&&window.LivekitClient.Room?resolve(window.LivekitClient):reject(new Error('livekit_sdk_missing'));};
      s.onerror=function(){reject(new Error('livekit_sdk_load_failed'));};
      document.head.appendChild(s);
    });
    return sdkPromise;
  }
  var viewerTokenCache20261015=Object.create(null);
  function tokenFor(hostId,identity,runId){
    if(identity!==viewerId())return fetchTokenFor20261015(hostId,identity,runId);
    var key=cleanRoom(hostId,runId)+'|'+identity,now=Date.now();
    Object.keys(viewerTokenCache20261015).forEach(function(k){if(viewerTokenCache20261015[k].until<=now)delete viewerTokenCache20261015[k];});
    var old=viewerTokenCache20261015[key];if(old)return old.promise;
    var item={until:now+45000,promise:null};
    item.promise=fetchTokenFor20261015(hostId,identity,runId).catch(function(e){if(viewerTokenCache20261015[key]===item)delete viewerTokenCache20261015[key];throw e;});
    viewerTokenCache20261015[key]=item;
    var keys=Object.keys(viewerTokenCache20261015);while(keys.length>5)delete viewerTokenCache20261015[keys.shift()];
    return item.promise;
  }
  function newSfuRoom20261015(LK){
    return new LK.Room({
      adaptiveStream:{pixelDensity:'screen',pauseVideoInBackground:true},
      singlePeerConnection:false,dynacast:true,disconnectOnPageLeave:false,stopLocalTrackOnUnpublish:false
    });
  }
  var preparedViewerRooms20261015=Object.create(null);
  function dropPreparedViewer20261015(hostId){
    var old=preparedViewerRooms20261015[hostId];delete preparedViewerRooms20261015[hostId];
    if(old&&old.room){try{var p=old.room.disconnect(false);if(p&&p.catch)p.catch(function(){});}catch(e){}}
  }
  window.ktPrewarmSfuViewer20261015=function(hostId,priority){
    hostId=String(hostId||'').trim();
    if(!hostId||document.hidden||isHostRole()||document.querySelector('#screen .kt-remote-live'))return Promise.resolve(null);
    Object.keys(preparedViewerRooms20261015).forEach(function(h){if(Date.now()-preparedViewerRooms20261015[h].at>=40000)dropPreparedViewer20261015(h);});
    var old=preparedViewerRooms20261015[hostId];if(old)return old.promise;
    var hosts=Object.keys(preparedViewerRooms20261015);
    if(hosts.length>=5){if(!priority)return Promise.resolve(null);dropPreparedViewer20261015(hosts.sort(function(a,b){return preparedViewerRooms20261015[a].at-preparedViewerRooms20261015[b].at;})[0]);}
    var entry={hostId:hostId,at:Date.now(),room:null,auth:null,promise:null};preparedViewerRooms20261015[hostId]=entry;
    entry.promise=Promise.all([ensureSdk(),tokenFor(hostId,viewerId(),'stable')]).then(function(values){
      if(preparedViewerRooms20261015[hostId]!==entry)return null;
      entry.auth=values[1];entry.room=newSfuRoom20261015(values[0]);
      var p=entry.room.prepareConnection(entry.auth.url,entry.auth.token);
      if(p&&p.catch)p.catch(function(){});
      return entry.room;
    }).catch(function(){if(preparedViewerRooms20261015[hostId]===entry)dropPreparedViewer20261015(hostId);return null;});
    return entry.promise;
  };
  function prewarmVisibleViewer20261015(){
    if(document.hidden||isHostRole()||document.querySelector('#screen .kt-remote-live'))return;
    try{
      var hosts=[];
      Array.from(document.querySelectorAll('.ktvl-live[data-host],.kt-live-card[data-host],.kt-live-list-enter[data-host],.kt-follow-person.live[data-host]')).forEach(function(el){
        var r=el.getBoundingClientRect(),cs=getComputedStyle(el);
        var h=String(el.getAttribute('data-host')||'');
        if(h&&r.width>0&&r.height>0&&r.bottom>0&&r.top<window.innerHeight&&cs.visibility!=='hidden'&&cs.display!=='none'&&hosts.indexOf(h)<0)hosts.push(h);
      });
      hosts.slice(0,5).forEach(function(h){window.ktPrewarmSfuViewer20261015(h);});
    }catch(e){}
  }
  ['pointerdown','focusin'].forEach(function(name){document.addEventListener(name,function(e){
    try{
      var card=e.target&&e.target.closest&&e.target.closest('.ktvl-live[data-host],.kt-live-card[data-host],.kt-live-list-enter[data-host],.kt-follow-person.live[data-host]');
      if(card)window.ktPrewarmSfuViewer20261015(card.getAttribute('data-host'),true);
    }catch(z){}
  },true);});
  async function fetchTokenFor20261015(hostId,identity,runId,signal){
    var q='?room='+encodeURIComponent(cleanRoom(hostId,runId))+
      '&identity='+encodeURIComponent(identity)+
      '&name='+encodeURIComponent(profileName())+
      '&t='+Date.now();
    var options={cache:'no-store'};if(signal)options.signal=signal;
    var r=await fetch(TOKEN_URL+q,options);
    if(!r.ok)throw new Error('livekit_token_'+r.status);
    var j=await r.json();
    if(!j||!j.ok||!j.token||!j.url)throw new Error(String(j&&j.error||'livekit_token_or_url_invalid'));
    return j;
  }
  /* Independent receive-only feed preview: never reuse or mutate the live-room owner. */
  window.ktOpenLiveFeedPreview20261015=function(hostId,callbacks){
    hostId=String(hostId||'').trim();callbacks=callbacks||{};
    var stopped=false,previewRoom=null,deadline=null,firstVideoTimer=null,subscriptionTimer=null,controller=typeof AbortController!=='undefined'?new AbortController():null;
    var handle={stop:function(){
      if(stopped)return;stopped=true;clearTimeout(deadline);clearTimeout(firstVideoTimer);clearInterval(subscriptionTimer);if(controller)controller.abort();
      if(previewRoom)try{var p=previewRoom.disconnect(false);if(p&&p.catch)p.catch(function(){});}catch(e){}
    },ready:null};
    function emit(name){if(!stopped&&typeof callbacks[name]==='function')callbacks[name].apply(null,[].slice.call(arguments,1));}
    handle.ready=(async function(){
      try{
        var identity='viewer_'+DEVICE+'_preview_'+Math.random().toString(36).slice(2,10);
        var timeout=new Promise(function(_,reject){deadline=setTimeout(function(){reject(new Error('preview_timeout'));},15000);});
        var work=(async function(){
          var ready=await Promise.all([ensureSdk(),fetchTokenFor20261015(hostId,identity,'stable',controller&&controller.signal)]);
          if(stopped)return;
          var LK=ready[0],auth=ready[1];
          previewRoom=new LK.Room({adaptiveStream:false,dynacast:false,disconnectOnPageLeave:false});
          function subscribed(track,pub,person){
            if(!stopped&&track&&track.kind==='video'){clearTimeout(firstVideoTimer);emit('track',track,pub,person);}
          }
          previewRoom.on(LK.RoomEvent.TrackSubscribed,subscribed);
          previewRoom.on(LK.RoomEvent.TrackUnsubscribed,function(track,pub,person){emit('removed',track,pub,person);});
          previewRoom.on(LK.RoomEvent.Disconnected,function(){emit('error',new Error('preview_disconnected'));handle.stop();});
          previewRoom.on(LK.RoomEvent.Reconnecting,function(){emit('status','방송을 다시 연결하고 있습니다.');});
          previewRoom.on(LK.RoomEvent.Reconnected,function(){previewRoom.remoteParticipants.forEach(subscribePerson);emit('status','');});
          function subscribePerson(person){person.trackPublications.forEach(function(pub){
            if(pub.kind==='video'&&pub.setSubscribed){if(pub.isSubscribed!==true)pub.setSubscribed(true);if(pub.setVideoQuality&&LK.VideoQuality)pub.setVideoQuality(person.identity===hostId?LK.VideoQuality.HIGH:LK.VideoQuality.LOW);}
            if(pub.track)subscribed(pub.track,pub,person);
          });}
          previewRoom.on(LK.RoomEvent.ParticipantConnected,subscribePerson);
          if(LK.RoomEvent.TrackSubscriptionFailed)previewRoom.on(LK.RoomEvent.TrackSubscriptionFailed,function(){emit('error',new Error('preview_subscription_failed'));handle.stop();});
          previewRoom.on(LK.RoomEvent.TrackPublished,function(pub){if(!stopped&&pub.kind==='video'&&pub.setSubscribed)pub.setSubscribed(true);});
          await previewRoom.connect(auth.url,auth.token,{autoSubscribe:false});
          if(stopped){await previewRoom.disconnect(false);return;}
          previewRoom.remoteParticipants.forEach(subscribePerson);
          if(!Array.from(previewRoom.remoteParticipants.values()).some(function(person){return Array.from(person.trackPublications.values()).some(function(pub){return pub.kind==='video'&&pub.track;});}))firstVideoTimer=setTimeout(function(){emit('error',new Error('preview_video_wait'));handle.stop();},12000);
          subscriptionTimer=setInterval(function(){if(!stopped&&previewRoom&&previewRoom.state==='connected')previewRoom.remoteParticipants.forEach(subscribePerson);},4000);
          emit('status','');
        })();
        await Promise.race([work,timeout]);
        clearTimeout(deadline);
      }catch(e){emit('error',e);handle.stop();}
    })();
    return handle;
  };

  function stopAudio(identity){
    var a=audioEls[identity];
    if(a){try{a.remove();}catch(e){}delete audioEls[identity];}delete audioTracks[identity];
  }
  function attachAudio(track,identity){
    try{
      var existing=audioEls[identity];
      if(existing&&existing.isConnected&&audioTracks[identity]===track)return;
      stopAudio(identity);
      var a=track.attach();
      a.autoplay=true;a.playsInline=true;a.style.display='none';
      a.dataset.ktLivekitAudio=identity;
      document.body.appendChild(a);
      audioEls[identity]=a;audioTracks[identity]=track;
      var p=a.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }
  function mediaStreamFor(track){
    try{
      var mt=track&&track.mediaStreamTrack;
      if(!mt)return null;
      var cached=sdkStreams.get(track);
      if(cached&&cached.getTracks().some(function(t){return t===mt;}))return cached;
      var stream=new MediaStream([mt]);sdkStreams.set(track,stream);streamTracks.set(stream,track);return stream;
    }catch(e){return null;}
  }
  function hasLiveVideo(v){
    try{
      var s=v&&v.srcObject;
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));
    }catch(e){return false;}
  }
  function setVideo(v,stream){
    if(!v||!stream)return false;
    try{
      var sdk=streamTracks.get(stream),previous=videoTracks.get(v);
      if(sdk){
        var attached=v.srcObject&&v.srcObject.getVideoTracks&&v.srcObject.getVideoTracks().some(function(t){return t===sdk.mediaStreamTrack;});
        var observed=!Array.isArray(sdk.attachedElements)||sdk.attachedElements.indexOf(v)>=0;
        if(previous!==sdk||!attached||!observed){if(previous&&previous!==sdk&&previous.detach)previous.detach(v);sdk.attach(v);videoTracks.set(v,sdk);}
      }else if(v.srcObject!==stream)v.srcObject=stream;
      // Repair only a persistently black target; never restart healthy playback.
      if(sdk&&!document.hidden&&room&&room.state==='connected'){
        var health=videoRecovery20261015.get(v),now=Date.now();
        var frames=null;
        try{var quality=v.getVideoPlaybackQuality&&v.getVideoPlaybackQuality();if(quality&&Number.isFinite(quality.totalVideoFrames)&&quality.totalVideoFrames>0)frames=quality.totalVideoFrames;else if(Number.isFinite(v.webkitDecodedFrameCount)&&v.webkitDecodedFrameCount>0)frames=v.webkitDecodedFrameCount;}catch(e){}
        var progress=frames===null?Number(v.currentTime||0):frames;
        if(!health||health.sdk!==sdk){health={sdk:sdk,since:now,last:0,attempts:0,progress:progress};videoRecovery20261015.set(v,health);}
        var ready=v.readyState>=2&&v.videoWidth>0;
        if(ready&&progress!==health.progress){health.since=now;health.attempts=0;}
        health.progress=progress;
        var wait=ready?8000:6000;
        if(!sdk.isMuted&&sdk.mediaStreamTrack&&sdk.mediaStreamTrack.readyState==='live'&&now-health.since>=wait&&now-health.last>=10000&&health.attempts<3){
          health.last=now;health.attempts++;
          if(sdk.detach)sdk.detach(v);
          sdk.attach(v);videoTracks.set(v,sdk);
          v.setAttribute('data-kt-video-recovery',String(health.attempts));
        }
      }
      v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
      v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('muted','');
      if(v.paused||v.readyState<2){var p=v.play();if(p&&p.catch)p.catch(function(){});}
      var sm=v.parentElement&&v.parentElement.querySelector('small');if(sm)sm.style.display='none';
      return true;
    }catch(e){return false;}
  }
  function attachHostVideo(stream){
    window.__ktSfuPreferredHostStream20261015=stream;
    window.__ktSfuPreferredHostId20261015=currentHostId;
    var targets=[];
    function add(v){if(v&&targets.indexOf(v)<0)targets.push(v);}
    add(document.getElementById('ktRemoteHostPreview'));
    try{
      document.querySelectorAll(
        '.kt-remote-live .ktg13-host>video,'+
        '.kt-remote-live .ktg9-host>video,'+
        '.kt-remote-live .ktsubscriber-host>video,'+
        '.kt-remote-live .ktsecret-slot.host>video,'+
        '.kt-remote-live .ktsecret-host>video,'+
        '.kt-remote-live .ktsolo-main>video,'+
        '.kt-guest-hostlike-room .kgh-cell.host video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell.host video,'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell.host video,'+
        '.kt-guest-room-grid .kt-guest-room-cell.host video'
      ).forEach(add);
    }catch(e){}
    var main=document.getElementById('ktRemoteLiveVideo');
    var self=guestStream();
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
    /* Host video can arrive before the guest room tiles are mounted.
       Keep the remote stream available immediately so the existing guest
       source-lock can attach it as soon as the host tile appears. */
    try{window.__ktRemoteHostStream=stream;}catch(e){}
    targets.forEach(function(v){setVideo(v,stream);});
    if(targets.length){
      var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';
    }
    try{if(window.ktFixGuestRoomVideoSources20260926)window.ktFixGuestRoomVideoSources20260926();}catch(e){}
  }
  function exactGuestVideo(identity){
    var esc=identity;
    try{esc=CSS.escape(identity);}catch(e){}
    var selectors=[
      '[data-kt-guest-viewer-id="'+esc+'"] video',
      '[data-kt-direct-guest="'+esc+'"] video',
      '[data-viewer-id="'+esc+'"] video',
      '[data-kt-peer-viewer="'+esc+'"] video',
      '[data-kt-livekit-guest="'+esc+'"] video',
      '.ktg13-guest[data-kt-guest-viewer-id="'+esc+'"] video',
      '.ktg13-guest[data-kt-direct-guest="'+esc+'"] video',
      '.ktg13-guest[data-viewer-id="'+esc+'"] video',
      '.ktg9-guest[data-viewer-id="'+esc+'"] video',
      '.ktsubscriber-guest[data-kt-livekit-guest="'+esc+'"] video',
      '.ktsubscriber-guest[data-kt-peer-viewer="'+esc+'"] video',
      '.ktsecret-slot[data-kt-livekit-guest="'+esc+'"] video',
      '.ktsecret-slot[data-kt-peer-viewer="'+esc+'"] video'
    ];
    for(var i=0;i<selectors.length;i++){
      try{
        var v=document.querySelector(selectors[i]);
        if(v&&!(v.closest&&v.closest('.host,.ktg13-host,.kt-prejoin-room-cell.host,.kt-approved-guest-cell.host,.kt-guest-room-cell.host')))return v;
      }catch(e){}
    }
    return null;
  }

  function clearDuplicateGuestTargets(identity,keepVideo){
    var esc=identity;
    try{esc=CSS.escape(identity);}catch(e){}
    var seen=[];
    var selectors=[
      '[data-kt-guest-viewer-id="'+esc+'"]',
      '[data-kt-direct-guest="'+esc+'"]',
      '[data-viewer-id="'+esc+'"]',
      '[data-kt-peer-viewer="'+esc+'"]',
      '[data-kt-livekit-guest="'+esc+'"]'
    ];
    selectors.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(cell){
          if(seen.indexOf(cell)>=0)return;
          seen.push(cell);
          if(cell.matches&&cell.matches('.host,.ktg13-host,.kt-prejoin-room-cell.host,.kt-approved-guest-cell.host,.kt-guest-room-cell.host'))return;
          var v=cell.querySelector&&cell.querySelector('video');
          if(v&&v===keepVideo)return;
          try{if(v){v.pause();v.srcObject=null;}}catch(e){}
          try{
            delete cell.dataset.ktGuestViewerId;
            delete cell.dataset.ktDirectGuest;
            delete cell.dataset.viewerId;
            delete cell.dataset.ktLivekitGuest;
            delete cell.dataset.ktPeerViewer;
          }catch(e){}
          try{cell.classList.remove('kt-livekit-peer-guest','kt-peer-guest','kt-guest-approved');}catch(e){}
          try{cell.innerHTML='<span>게스트</span>';}catch(e){}
        });
      }catch(e){}
    });
  }
  function createGuestVideoTarget(identity){
    if(isHostRole())return null;
    var current=exactGuestVideo(identity);if(current)return current;
    var cells=[];
    try{
      document.querySelectorAll(
        '.kt-guest-hostlike-room .kgh-cell:not(.host):not(.self),'+
        '.kt-approved-guest-grid .kt-approved-guest-cell:not(.host):not(.self),'+
        '.kt-prejoin-room-grid .kt-prejoin-room-cell:not(.host),'+
        '.kt-guest-room-grid .kt-guest-room-cell:not(.host):not(.self),'+
        '.kt-remote-live .ktg13-room .ktg13-guest,'+
        '.kt-remote-live .ktsubscriber-room .ktsubscriber-guest,'+
        '.kt-remote-live .ktsubscriber-people .ktsubscriber-guest,'+
        '.kt-remote-live .ktsecret-room .ktsecret-slot:not(.host)'
      ).forEach(function(cell){cells.push(cell);});
    }catch(e){}
    var free=cells.find(function(cell){
      try{
        var pid=String(cell.dataset&&cell.dataset.ktPeerViewer||'');
        var lid=String(cell.dataset&&cell.dataset.ktLivekitGuest||'');
        var direct=String(cell.dataset&&cell.dataset.ktDirectGuest||'');
        var legacy=String(cell.dataset&&cell.dataset.ktGuestViewerId||'');
        var viewer=String(cell.dataset&&cell.dataset.viewerId||'');
        if(pid||lid||direct||legacy||viewer)return false;
        var old=cell.querySelector('video');
        return !old||!hasLiveVideo(old);
      }catch(e){return false;}
    });
    if(!free)return null;
    try{
      free.textContent='';
      free.dataset.ktLivekitGuest=identity;
      free.dataset.ktPeerViewer=identity;
      free.classList.add('kt-peer-guest','kt-livekit-peer-guest');
      var v=document.createElement('video');
      v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
      v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('muted','');
      var label=document.createElement(free.classList.contains('kgh-cell')?'span':'label');
      if(free.classList.contains('kgh-cell'))label.className='kgh-label';
      label.textContent='게스트';
      free.appendChild(v);free.appendChild(label);
      return v;
    }catch(e){return null;}
  }
  function approvedRoster20260924(){
    var ids=[],names={};
    try{
      var map=window.__ktApprovedGuestIds20260924||{};
      var nm=window.__ktApprovedGuestNames20260924||{};
      Object.keys(map).forEach(function(id){
        if(map[id]===true){
          ids.push(id);
          names[id]=String(nm[id]||'게스트');
        }
      });
    }catch(e){}
    return {ids:ids,names:names};
  }
  function setGuestTargetLabel20260924(v,name){
    try{
      var cell=v&&v.parentElement;
      if(!cell)return;
      var label=cell.querySelector('.kgh-label,.kt-guest-name,label,span');
      if(label)label.textContent=String(name||'게스트');
    }catch(e){}
  }
  function ensureApprovedRosterSlots20260924(){
    if(!isHostRole()&&viewerExplicitlyExited20261015())return {ids:[],names:{}};
    var roster=approvedRoster20260924();
    var self=viewerId();

    if(isHostRole()){
      roster.ids.forEach(function(id){
        try{
          if(typeof window.ktEnsureApprovedGuestSlot20260924==='function'){
            window.ktEnsureApprovedGuestSlot20260924(id,roster.names[id]||'게스트');
          }
        }catch(e){}
      });
      return roster;
    }

    var selfApproved=roster.ids.indexOf(self)>=0;
    if(selfApproved){
      try{
        if(typeof window.ktForceApprovedGuestGridNow20260924==='function'){
          window.ktForceApprovedGuestGridNow20260924();
        }
      }catch(e){}
    }

    roster.ids.forEach(function(id){
      if(id===self)return;
      var v=exactGuestVideo(id)||createGuestVideoTarget(id);
      if(v)setGuestTargetLabel20260924(v,roster.names[id]||'게스트');
    });
    return roster;
  }
  function removeApprovedGuestSlot20260924(identity){
    identity=String(identity||'').trim();
    if(!identity)return;
    try{
      var esc=identity;
      try{esc=CSS.escape(identity);}catch(e){}
      document.querySelectorAll(
        '[data-kt-guest-viewer-id="'+esc+'"],'+
        '[data-kt-direct-guest="'+esc+'"],'+
        '[data-kt-livekit-guest="'+esc+'"],'+
        '[data-kt-peer-viewer="'+esc+'"]'
      ).forEach(function(cell){
        if(cell.matches('.host,.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsecret-host'))return;
        try{
          var v=cell.querySelector('video');
          if(v){v.pause();v.srcObject=null;}
        }catch(e){}
        try{
          delete cell.dataset.ktLivekitGuest;
          delete cell.dataset.ktPeerViewer;
          delete cell.dataset.ktGuestViewerId;
          delete cell.dataset.ktDirectGuest;
          cell.classList.remove('kt-livekit-peer-guest','kt-peer-guest','kt-guest-approved','kt-guest-occupied','kt-allguest-occupied');
          cell.innerHTML='<span>게스트</span>';
        }catch(e){}
      });
    }catch(e){}
    delete guestVideoById[identity];
  }

  function setGuestVideoDirection20261015(video,stream){
    var ok=setVideo(video,stream);
    if(video){video.style.setProperty('transform','scaleX(-1)','important');video.style.setProperty('-webkit-transform','scaleX(-1)','important');}
    return ok;
  }
  function attachGuestVideo(identity,stream){
    if(!stream)return;
    /* Never reuse the host stream as an approved guest picture. */
    try{
      var hostRef=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
      if(hostRef&&sameVideoSource20260926(stream,hostRef))return;
      if(currentHostId&&String(identity||'')===String(currentHostId))return;
    }catch(e){}
    if(isHostRole()){
      try{if(!window.__ktApprovedGuestIds20260924||!window.__ktApprovedGuestIds20260924[identity])return;}catch(e){return;}
    }
    var known=guestVideoById[identity];
    if(known&&document.contains(known)){setGuestVideoDirection20261015(known,stream);return;}
    var exact=exactGuestVideo(identity);
    if(exact){
      clearDuplicateGuestTargets(identity,exact);
      guestVideoById[identity]=exact;
      setGuestVideoDirection20261015(exact,stream);
      return;
    }
    var candidates=[];
    try{
      document.querySelectorAll(
        '.ktg13-guest video,'+
        '.ktg9-guest video,'+
        '.ktsubscriber-guest video,'+
        '.ktsecret-guest video,'+
        '.kt-guest-hostlike-room .kgh-cell:not(.host):not(.self) video,'+
        '.kt-approved-guest-grid .kt-approved-guest-cell:not(.host):not(.self) video'
      ).forEach(function(v){if(!hasLiveVideo(v))candidates.push(v);});
    }catch(e){}
    /* Do not grab an arbitrary empty video element that may belong to another
       transport/guest. Only create one identity-bound fallback target. */
    var target=createGuestVideoTarget(identity);
    if(target){
      clearDuplicateGuestTargets(identity,target);
      guestVideoById[identity]=target;
      setGuestVideoDirection20261015(target,stream);
    }
  }

  /* Read-only health query for fallback cleanup. Approval is still required;
     this never creates a participant or revives a guest who explicitly left. */
  window.ktSfuGuestMediaActive20261018=function(hostId,identity){
    try{
      if(!room||room.state!=='connected'||currentHostId!==String(hostId||'')||
         !(window.__ktApprovedGuestIds20260924||{})[identity])return false;
      var participant=String(identity||'')===DEVICE?room.localParticipant:room.remoteParticipants.get(String(identity||''));
      if(!participant)return false;
      var active=false;
      participant.trackPublications.forEach(function(pub){
        var mt=pub.track&&pub.track.mediaStreamTrack;
        if(pub.kind==='video'&&mt&&mt.readyState==='live'&&!pub.isMuted)active=true;
      });
      return active;
    }catch(e){return false;}
  };
  var lastVideoDiagnostic20261015=0,lastPublishError20261015='';
  function updateVideoDiagnostics20261015(){
    if(Date.now()-lastVideoDiagnostic20261015<1000)return;
    lastVideoDiagnostic20261015=Date.now();
    var root=document.querySelector('#screen .kt-remote-live')||roomEl();if(!root)return;
    var rows=[];
    try{if(room)room.remoteParticipants.forEach(function(p){
      p.trackPublications.forEach(function(pub){
        if(pub.kind!=='video')return;
        var id=String(p.identity||''),host=id===currentHostId,v=host?document.getElementById('ktRemoteLiveVideo'):exactGuestVideo(id);
        rows.push({id:id,host:host,subscribed:!!pub.isSubscribed,track:!!pub.track,muted:!!pub.isMuted,streamState:pub.track?String(pub.track.streamState||''):'',target:!!v,ready:v?v.readyState:0,width:v?v.videoWidth:0});
      });
    });}catch(e){}
    var data=JSON.stringify({approved:approvedRoster20260924().ids.length,localVideoPublished:!!publishedVideoId,publishError:lastPublishError20261015,videos:rows});
    if(root.getAttribute('data-kt-sfu-video-diagnostics')!==data)root.setAttribute('data-kt-sfu-video-diagnostics',data);
  }

  function reattachRemoteTracks(){
    updateVideoDiagnostics20261015();
    ensureApprovedRosterSlots20260924();
    if(!room||room.state!=='connected')return;
    try{
      room.remoteParticipants.forEach(function(p){
        p.trackPublications.forEach(function(pub){
          if(pub&&pub.track)onRemoteTrack(pub.track,pub,p);
        });
      });
    }catch(e){}
  }
  var largeHostQuality20261015=new WeakSet();
  function preferLargeHostQuality20261015(publication){
    if(!publication||largeHostQuality20261015.has(publication)||document.hidden)return;
    if(!document.querySelector('#screen .kt-remote-live[data-kt-solo-guest-header]'))return;
    if(typeof publication.setVideoDimensions!=='function')return;
    try{
      var dims=publication.dimensions||{},portrait=Number(dims.height)>Number(dims.width);
      publication.setVideoDimensions(portrait?{width:720,height:1280}:{width:1280,height:720});
      largeHostQuality20261015.add(publication);
    }catch(e){}
  }
  function onRemoteTrack(track,publication,participant){
    var identity=String(participant&&participant.identity||'');
    if(!identity||identity===viewerId()||identity===DEVICE)return;
    if(track.kind==='audio'){attachAudio(track,identity);return;}
    if(track.kind!=='video')return;
    var s=mediaStreamFor(track);if(!s)return;
    var knownHost=String(currentHostId||remoteHostId()||watchHostId||approvedHostId||'').trim();
    if(identity===knownHost){attachHostVideo(s);preferLargeHostQuality20261015(publication);}
    else attachGuestVideo(identity,s);
  }
  function clearRoomRefs(){
    Object.keys(audioEls).forEach(stopAudio);
    guestVideoById={};
    publishedVideoId='';publishedAudioId='';
  }
  async function disconnectRoom(){
    window.__ktSfuPreferredHostStream20261015=null;window.__ktSfuPreferredHostId20261015='';
    connectGeneration20261015++;
    roomConnectFlight20261015=null;lastConnectAt=0;
    var old=room;room=null;connecting=false;reconnectHoldUntil=0;hostRetryAt=0;hostFailureCount=0;
    if(reconnectRetryTimer){clearTimeout(reconnectRetryTimer);reconnectRetryTimer=null;}
    setState({connected:false,connecting:false});
    clearRoomRefs();
    if(old){try{await old.disconnect(false);}catch(e){}}
  }
  var roomConnectFlight20261015=null;
  function ensureRoom(hostId,role,runId){
    var key=String(hostId||'').trim();
    if(roomConnectFlight20261015&&roomConnectFlight20261015.hostId===key)return roomConnectFlight20261015.promise;
    var flight={hostId:key,promise:null};
    flight.promise=ensureRoomNow20261015(hostId,role,runId).finally(function(){
      if(roomConnectFlight20261015===flight)roomConnectFlight20261015=null;
    });
    roomConnectFlight20261015=flight;
    return flight.promise;
  }
  async function ensureRoomNow20261015(hostId,role,runId){
    hostId=String(hostId||'').trim();runId=String(runId||'').trim()||'stable';
    if(!hostId)return null;
    if(role!=='host'&&viewerExplicitlyExited20261015())return null;

    /* Communication speed lock:
       the actual SFU room name is already stable per host. A late run-id update
       must never disconnect a healthy room and make host/guest video re-open. */
    if(room&&currentHostId===hostId&&room.state==='connected'){
      reconnectHoldUntil=0;
      currentRunId=runId;
      currentRole=role||currentRole||'viewer';
      setState({connected:true,connecting:false,hostId:hostId,role:currentRole,runId:currentRunId});
      return room;
    }
    /* 통신이 잠깐 흔들릴 때 LiveKit 자체 재연결을 기다린다.
       hostTick이 350ms마다 새 방을 만들며 기존 연결을 끊지 않게 한다. */
    if(room&&currentHostId===hostId&&Date.now()<reconnectHoldUntil){
      currentRunId=runId;
      currentRole=role||currentRole||'viewer';
      return room;
    }
    if(room&&currentHostId===hostId&&room.state==='reconnecting')return room;
    if(role==='host'&&currentHostId===hostId&&Date.now()<hostRetryAt)return room;
    if(connecting&&currentHostId===hostId){
      currentRunId=runId;
      currentRole=role||currentRole||'viewer';
      return room;
    }
    if(Date.now()-lastConnectAt<350&&currentHostId===hostId)return room;
    lastConnectAt=Date.now();connecting=true;currentHostId=hostId;currentRunId=runId;currentRole=role||'viewer';
    setState({connecting:true,connected:false,hostId:hostId,role:currentRole,lastError:''});
    var attemptGeneration=++connectGeneration20261015;
    var attemptRole=currentRole;
    var identity=(attemptRole==='host')?DEVICE:viewerId();
    try{
      // SDK load and token request are independent; start both on the entry tap.
      var ready=await Promise.all([ensureSdk(),tokenFor(hostId,identity,runId)]);
      if(attemptGeneration!==connectGeneration20261015||currentHostId!==hostId)return null;
      var LK=ready[0],auth=ready[1];
      try{document.documentElement.setAttribute('data-kt-sfu-server',new URL(auth.url).origin);}catch(e){}
      var previousRoom=room;room=null;
      if(previousRoom){try{var closing=previousRoom.disconnect(false);if(closing&&closing.catch)closing.catch(function(){});}catch(e){}}
      clearRoomRefs();
      var prepared=preparedViewerRooms20261015[hostId];
      var usePrepared=attemptRole!=='host'&&prepared&&prepared.hostId===hostId&&prepared.auth===auth&&prepared.room&&Date.now()-prepared.at<40000;
      var r=usePrepared?prepared.room:newSfuRoom20261015(LK);
      if(usePrepared)delete preparedViewerRooms20261015[hostId];
      room=r;
      r.on(LK.RoomEvent.TrackSubscribed,function(track,publication,participant){
        if(room!==r||attemptGeneration!==connectGeneration20261015)return;
        onRemoteTrack(track,publication,participant);
      });
      r.on(LK.RoomEvent.TrackUnsubscribed,function(track,publication,participant){
        if(room!==r||attemptGeneration!==connectGeneration20261015)return;
        var id=String(participant&&participant.identity||'');if(track.kind==='audio')stopAudio(id);
      });
      if(LK.RoomEvent.ParticipantConnected)r.on(LK.RoomEvent.ParticipantConnected,function(){
        reattachRemoteTracks();
        [10,35,90,180].forEach(function(ms){setTimeout(reattachRemoteTracks,ms);});
      });
      if(LK.RoomEvent.TrackPublished)r.on(LK.RoomEvent.TrackPublished,function(){
        reattachRemoteTracks();
        [10,30,75].forEach(function(ms){setTimeout(reattachRemoteTracks,ms);});
      });
      if(LK.RoomEvent.Reconnecting)r.on(LK.RoomEvent.Reconnecting,function(){
        if(room===r){
          /* 호스트 송출은 18초 안정 대기를 유지하되,
             시청자/게스트는 얼굴이 늦게 뜨지 않도록 짧게만 기다린다. */
          var hold=(currentRole==='host')?18000:300;
          reconnectHoldUntil=Date.now()+hold;
          setState({connecting:true});
        }
      });
      if(LK.RoomEvent.SignalReconnecting)r.on(LK.RoomEvent.SignalReconnecting,function(){if(room===r&&currentRole==='host'){reconnectHoldUntil=Math.max(reconnectHoldUntil,Date.now()+18000);setState({connecting:true});}});
      if(LK.RoomEvent.Reconnected)r.on(LK.RoomEvent.Reconnected,function(){
        if(room===r){
          reconnectHoldUntil=0;hostFailureCount=0;hostRetryAt=0;
          if(reconnectRetryTimer){clearTimeout(reconnectRetryTimer);reconnectRetryTimer=null;}
          setState({connected:true,connecting:false});
        }
        [0,80,220].forEach(function(ms){setTimeout(reattachRemoteTracks,ms);});
      });
      r.on(LK.RoomEvent.Disconnected,function(){
        if(room===r){
          /* 호스트 송출은 기존 안정 대기를 유지한다.
             시청자/게스트는 18초를 기다리지 않고 빠르게 재연결한다. */
          var guestFast=(currentRole!=='host');
          var hold=guestFast?300:Math.min(30000,1000*Math.pow(2,Math.min(hostFailureCount++,5)));
          var retry=guestFast?400:hold+200;
          if(!guestFast)hostRetryAt=Date.now()+hold;
          reconnectHoldUntil=Date.now()+hold;
          connecting=false;
          window.__ktSfuPreferredHostStream20261015=null;window.__ktSfuPreferredHostId20261015='';
          var backup=window.__ktDirectHostStream20261015;
          try{if(backup&&String(window.__ktDirectHostId20261015||'')===currentHostId&&window.ktAttachRemoteHostStreamEverywhere20261009)window.ktAttachRemoteHostStreamEverywhere20261009(backup);}catch(e){}
          setState({connected:false,connecting:true});
          if(reconnectRetryTimer)clearTimeout(reconnectRetryTimer);
          reconnectRetryTimer=setTimeout(function(){
            reconnectRetryTimer=null;
            if(room===r&&r.state!=='connected'){
              reconnectHoldUntil=0;
              setTimeout(hostTick,20);
            }
          },retry);
        }
      });
      try{r.prepareConnection(auth.url,auth.token);}catch(e){}
      await r.connect(auth.url,auth.token,{autoSubscribe:true});
      if(room!==r||attemptGeneration!==connectGeneration20261015){try{await r.disconnect(false);}catch(e){}return room;}
      connecting=false;
      if(currentRole==='host'){hostFailureCount=0;hostRetryAt=0;}
      setState({url:auth.url,connected:true,connecting:false,hostId:hostId,role:currentRole,runId:runId});
      try{
        r.remoteParticipants.forEach(function(p){
          p.trackPublications.forEach(function(pub){
            if(pub.track)onRemoteTrack(pub.track,pub,p);
          });
        });
      }catch(e){}
      return r;
    }catch(e){
      if(attemptGeneration!==connectGeneration20261015)return null;
      delete viewerTokenCache20261015[cleanRoom(hostId,runId)+'|'+identity];
      connecting=false;
      if(currentRole==='host'){hostFailureCount++;hostRetryAt=Date.now()+Math.min(30000,1000*Math.pow(2,Math.min(hostFailureCount-1,5)));}
      setState({connected:false,connecting:false,lastError:String(e&&e.message||e)});
      try{console.warn('K-Talk LIVE video connection: '+String(e&&e.message||e));}catch(_logError){}
      return null;
    }
  }
  var guestPublishTasks=new WeakMap();
  function publishSharedStream(stream){
    if(currentRole!=='guest'||!room)return publishSharedStreamNow(stream);
    var owner=room,prior=guestPublishTasks.get(owner);
    if(prior&&prior.stream===stream)return prior.promise;
    var entry={stream:stream,promise:null};
    entry.promise=Promise.resolve(prior&&prior.promise).catch(function(){}).then(function(){
      if(room===owner&&currentRole==='guest')return publishSharedStreamNow(stream);
    }).finally(function(){if(guestPublishTasks.get(owner)===entry)guestPublishTasks.delete(owner);});
    guestPublishTasks.set(owner,entry);return entry.promise;
  }
  function hasLocalPublication20261015(participant,trackId){
    var found=false;
    try{participant.trackPublications.forEach(function(pub){
      if(pub.track&&pub.track.mediaStreamTrack&&pub.track.mediaStreamTrack.id===trackId)found=true;
    });}catch(e){}
    return found;
  }
  async function publishSharedStreamNow(stream){
    if(currentRole!=='host'&&viewerExplicitlyExited20261015())return;
    if(!room||room.state!=='connected'||!liveStream(stream))return;
    var LK=window.LivekitClient;if(!LK)return;
    var owner=room,generation=connectGeneration20261015,vp=owner.localParticipant;
    try{
      var vt=stream.getVideoTracks&&stream.getVideoTracks()[0];
      if(vt&&vt.readyState==='live'&&!hasLocalPublication20261015(vp,vt.id)){
        if(publishedVideoId){
          try{
            vp.trackPublications.forEach(function(pub){if(pub.track&&pub.track.mediaStreamTrack&&pub.track.mediaStreamTrack.id===publishedVideoId)vp.unpublishTrack(pub.track,false);});
          }catch(e){}
        }
        var lv=new LK.LocalVideoTrack(vt);
        var options={source:LK.Track.Source.Camera,simulcast:true};
        if(currentRole==='guest')options.videoEncoding={maxBitrate:1500000,maxFramerate:24};
        else if(currentRole==='host'){
          options.videoEncoding={maxBitrate:2500000,maxFramerate:30};
          // Sharper fallback layers during the initial bandwidth ramp.
          options.videoSimulcastLayers=[
            {width:960,height:540,encoding:{maxBitrate:900000,maxFramerate:24}},
            {width:640,height:360,encoding:{maxBitrate:350000,maxFramerate:20}}
          ];
        }
        await vp.publishTrack(lv,options);
        if(room!==owner||generation!==connectGeneration20261015)return;
        publishedVideoId=vt.id;lastPublishError20261015='';
      }
    }catch(e){if(room===owner&&generation===connectGeneration20261015)lastPublishError20261015='video_publish_failed:'+String(e&&e.name||'Error');}
    if(room!==owner||generation!==connectGeneration20261015)return;
    try{
      var at=stream.getAudioTracks&&stream.getAudioTracks()[0];
      if(at&&at.readyState==='live'&&!hasLocalPublication20261015(vp,at.id)){
        var la=new LK.LocalAudioTrack(at);
        await vp.publishTrack(la,{source:LK.Track.Source.Microphone,audioPreset:(LK.AudioPresets&&LK.AudioPresets.musicHighQualityStereo)?LK.AudioPresets.musicHighQualityStereo:undefined});
        if(room!==owner||generation!==connectGeneration20261015)return;
        publishedAudioId=at.id;
      }
    }catch(e){}
  }
  var hostWakeLock20261015=null,hostWakePending20261015=false,hostWakeRetryAt20261015=0;
  function hostNeedsWake20261015(){
    return !document.hidden&&!window.__ktHostEndLock&&isHostRole()&&liveStream(hostStream());
  }
  function releaseHostWake20261015(){
    var lock=hostWakeLock20261015;hostWakeLock20261015=null;
    if(lock)try{var done=lock.release();if(done&&done.catch)done.catch(function(){});}catch(e){}
  }
  async function maintainHostWake20261015(){
    if(!hostNeedsWake20261015()){releaseHostWake20261015();return;}
    if(hostWakeLock20261015||hostWakePending20261015||Date.now()<hostWakeRetryAt20261015||!navigator.wakeLock)return;
    hostWakePending20261015=true;
    try{
      var lock=await navigator.wakeLock.request('screen');
      if(!hostNeedsWake20261015()){await lock.release();return;}
      hostWakeLock20261015=lock;
      lock.addEventListener('release',function(){
        if(hostWakeLock20261015===lock){hostWakeLock20261015=null;hostWakeRetryAt20261015=Date.now()+30000;}
      });
    }catch(e){hostWakeRetryAt20261015=Date.now()+30000;}
    finally{hostWakePending20261015=false;}
  }
  document.addEventListener('visibilitychange',function(){if(!document.hidden){hostWakeRetryAt20261015=0;maintainHostWake20261015();}});
  window.addEventListener('kt-broadcast-ended',releaseHostWake20261015);
  window.addEventListener('pagehide',releaseHostWake20261015);

  async function hostTick(){
    prewarmVisibleViewer20261015();
    maintainHostWake20261015();
    if(!isHostRole()&&viewerExplicitlyExited20261015())return;
    if(!isHostRole()){
      var remoteRoot=document.querySelector('#screen .kt-remote-live');
      var selected=remoteRoot&&String(remoteRoot.getAttribute('data-kt-host-id')||remoteRoot.getAttribute('data-host-id')||'').trim();
      if(selected){watchHostId=selected;if(approvedHostId&&approvedHostId!==selected)approvedHostId='';}
    }
    if(!isHostRole()&&!approvedHostId&&approvedGuestTransportReady()){
      approvedHostId=remoteHostId();
      watchHostId=approvedHostId;
    }
    if(isHostRole()){
      if(hostTickBusy)return;
      hostTickBusy=true;
      try{
        var hostRun=String(window.__ktHostRunId20260924||'').trim()||'stable';
        var s=hostStream();
        if(s){
          var r=await ensureRoom(DEVICE,'host',hostRun);
          if(r){await publishSharedStream(s);reattachRemoteTracks();}
        }
      }finally{hostTickBusy=false;}
      return;
    }
    var remoteRun=String(window.__ktRemoteHostRunId20260924||'').trim()||'stable';
    if(approvedHostId){
      var gs=guestStream();
      var gr=await ensureRoom(approvedHostId,'guest',remoteRun);
      if(gr){
        if(gs)await publishSharedStream(gs);
        reattachRemoteTracks();
      }
      return;
    }
    if(watchHostId){
      var vr=await ensureRoom(watchHostId,'viewer',remoteRun);
      if(vr)reattachRemoteTracks();
    }
  }

  window.addEventListener('kt-guest-approval-received',function(e){
    if(viewerExplicitlyExited20261015())return;
    approvedHostId=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!approvedHostId)return;
    watchHostId=approvedHostId;

    /* If the SFU viewer room is already connected (normal case), do not wait
       for hostTick scheduling. Publish the prewarmed guest stream NOW. */
    try{
      var gs=guestStream();
      if(room&&room.state==='connected'&&currentHostId===approvedHostId&&gs){
        var p=publishSharedStream(gs);
        if(p&&p.then)p.then(function(){
          reattachRemoteTracks();
          setTimeout(reattachRemoteTracks,25);
          setTimeout(reattachRemoteTracks,80);
        }).catch(function(){});
      }else{
        hostTick();
      }
    }catch(z){hostTick();}

    try{setTimeout(hostTick,0);}catch(e){}
    [20,60,140,300,650,1200].forEach(function(ms){
      setTimeout(function(){
        try{
          var gs=guestStream();
          if(gs&&approvedHostId){
            var rr=String(window.__ktRemoteHostRunId20260924||'').trim()||'stable';
            var q=ensureRoom(approvedHostId,'guest',rr);
            if(q&&q.then)q.then(function(rm){
              if(rm){
                var pp=publishSharedStream(gs);
                if(pp&&pp.then)pp.then(reattachRemoteTracks).catch(function(){});
              }
            }).catch(function(){});
          }else hostTick();
        }catch(e){hostTick();}
      },ms);
    });
  });
  window.addEventListener('kt-approved-guest-stream-ready',function(e){
    if(viewerExplicitlyExited20261015())return;
    var h=String(e&&e.detail&&e.detail.host_id||approvedHostId||remoteHostId()||'').trim();
    if(h){approvedHostId=h;watchHostId=h;}
    try{
      var gs=guestStream();
      if(room&&room.state==='connected'&&gs){
        var p=publishSharedStream(gs);
        if(p&&p.then)p.then(function(){reattachRemoteTracks();}).catch(function(){});
      }else hostTick();
    }catch(z){hostTick();}
    [25,80,160].forEach(function(ms){setTimeout(hostTick,ms);});
  });
  window.addEventListener('kt-guest-camera-prewarmed',function(e){
    if(viewerExplicitlyExited20261015())return;
    var h=String(e&&e.detail&&e.detail.host_id||remoteHostId()||'').trim();
    if(h)watchHostId=h;
    /* Keep the viewer already connected to the SFU before approval so approval
       only has to publish the prewarmed track, not create a new room connection. */
    [0,40,120].forEach(function(ms){setTimeout(hostTick,ms);});
  });
  window.addEventListener('kt-host-guest-approved',function(){
    reattachRemoteTracks();
    [15,45,100,200].forEach(function(ms){setTimeout(reattachRemoteTracks,ms);});
  });
  window.addEventListener('kt-any-guest-approved',function(){
    ensureApprovedRosterSlots20260924();
    reattachRemoteTracks();
    [20,60,120,240,420].forEach(function(ms){setTimeout(function(){
      ensureApprovedRosterSlots20260924();
      reattachRemoteTracks();
    },ms);});
  });
  window.addEventListener('kt-three-person-sync-now',function(){
    ensureApprovedRosterSlots20260924();
    reattachRemoteTracks();
    try{hostTick();}catch(e){}
    [20,70,150].forEach(function(ms){setTimeout(function(){
      ensureApprovedRosterSlots20260924();
      reattachRemoteTracks();
      try{hostTick();}catch(e){}
    },ms);});
  });
  window.addEventListener('kt-any-guest-left',function(e){
    var id=String(e&&e.detail&&e.detail.viewer_id||'').trim();
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(h&&currentHostId&&h!==currentHostId)return;
    try{delete (window.__ktApprovedGuestIds20260924||{})[id];delete (window.__ktApprovedGuestNames20260924||{})[id];}catch(z){}
    removeApprovedGuestSlot20260924(id);
    ensureApprovedRosterSlots20260924();
    reattachRemoteTracks();
  });
  window.addEventListener('kt-remote-host-selected',function(e){
    if(e&&e.detail&&e.detail.immediate){try{localStorage.removeItem('kt_explicit_guest_exit:'+DEVICE);}catch(z){}}
    else if(viewerExplicitlyExited20261015())return;
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;

    /* 통신 전용: 빨간 LIVE로 다른 방송을 누르면 이전 승인방/연결을 붙잡지 않는다.
       선택한 host를 최우선으로 즉시 전환하고 UI/방배치에는 손대지 않는다. */
    var changed=!!(currentHostId&&currentHostId!==h);
    if(approvedHostId&&approvedHostId!==h)approvedHostId='';
    watchHostId=h;

    if(changed){
      /* 새 방송방을 눌렀을 때 이전 방 disconnect 완료를 기다리지 않는다.
         room 참조는 disconnectRoom() 시작 즉시 비워지므로 새 방 연결을 바로 시작한다.
         UI/방배치는 건드리지 않고 게스트 영상 연결 속도만 단축한다. */
      try{disconnectRoom();}catch(_e){}
      [0,20,55,110,220,420].forEach(function(ms){
        setTimeout(function(){
          try{hostTick();}catch(e){}
          try{ensureApprovedRosterSlots20260924();reattachRemoteTracks();}catch(e){}
        },ms);
      });
    }else{
      [0,20,55,110,220].forEach(function(ms){
        setTimeout(function(){
          try{hostTick();}catch(e){}
          try{ensureApprovedRosterSlots20260924();reattachRemoteTracks();}catch(e){}
        },ms);
      });
    }
  });
  window.addEventListener('kt-host-session-reset',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;
    if(h===watchHostId||h===approvedHostId||h===currentHostId){
      watchHostId=h;
      try{
        var rr=String(e&&e.detail&&e.detail.run_id||'').trim();
        if(rr)currentRunId=rr;
      }catch(z){}
      /* Same host = same central room. Keep the live connection. */
      setTimeout(hostTick,0);
      setTimeout(hostTick,40);
    }
  });
  window.addEventListener('kt-host-session-ready',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;
    if(String(e&&e.detail&&e.detail.role||'')!=='host')watchHostId=h;
    /* The SFU room is stable per host; a new run id must not tear down an
       otherwise healthy media connection. Host-session reset still handles
       explicit broadcast restarts. */
    setTimeout(hostTick,20);
  });
  window.addEventListener('kt-remote-host-left',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;
    if(h===watchHostId||h===approvedHostId||h===currentHostId){
      approvedHostId='';watchHostId='';currentRunId='';
      disconnectRoom();
    }
  });
  window.addEventListener('kt-broadcast-ended',function(){approvedHostId='';watchHostId='';disconnectRoom();});
  window.addEventListener('online',function(){setTimeout(hostTick,150);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(hostTick,120);});
  window.addEventListener('pagehide',function(){try{if(room)room.disconnect(false);}catch(e){}});

  /* Load the SFU SDK before the user presses approve. This removes the CDN
     download/parse delay from the approval path. */
  setTimeout(function(){try{var q=ensureSdk();if(q&&q.catch)q.catch(function(){});}catch(e){}},0);

  setInterval(hostTick,180);
  setInterval(function(){
    ensureApprovedRosterSlots20260924();
    reattachRemoteTracks();
  },150);
  setTimeout(hostTick,30);
  setTimeout(hostTick,180);
  setTimeout(hostTick,700);
})();

