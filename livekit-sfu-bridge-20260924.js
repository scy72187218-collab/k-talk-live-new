/* K-Talk LiveKit SFU bridge (2026-09-24)
   Scope: transport fallback/accelerator only.
   - Does not change room layout, buttons, chat, gifts, badges, directions, countdowns, or earnings.
   - Reuses the existing camera/mic MediaStream; it never opens a second camera.
   - Existing direct WebRTC paths stay active as fallback while this bridge is tested. */
(function(){
  if(window.__ktLiveKitSfuBridge20260924)return;
  window.__ktLiveKitSfuBridge20260924=true;

  var DEFAULT_URL='wss://magnetic-being-advised-gadgets.trycloudflare.com';
  var TOKEN_URL='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-livekit-token';
  var SDK_URL='https://cdn.jsdelivr.net/npm/livekit-client@2.22.3/dist/livekit-client.umd.min.js';

  var room=null,currentHostId='',currentRole='',currentRunId='',connecting=false;
  var publishedVideoId='',publishedAudioId='',lastConnectAt=0;
  var approvedHostId='',watchHostId='',audioEls={},guestVideoById={};
  var sdkPromise=null;

  window.__ktLiveKitSfuState20260924={
    enabled:true,connected:false,connecting:false,url:DEFAULT_URL,hostId:'',role:'',lastError:''
  };

  function setState(p){
    try{
      Object.keys(p||{}).forEach(function(k){window.__ktLiveKitSfuState20260924[k]=p[k];});
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
    return document.querySelector('#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
  }
  function isHostRole(){
    try{return !document.documentElement.classList.contains('kt-remote-viewing')&&!!roomEl();}catch(e){return false;}
  }
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
  function guestStream(){
    try{if(liveStream(window.__ktApprovedGuestSelfStream))return window.__ktApprovedGuestSelfStream;}catch(e){}
    return null;
  }
  function remoteHostId(){
    var h='';
    try{h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!h)try{h=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return h;
  }
  function approvedGuestTransportReady(){
    var st='';
    try{st=String(window.__ktDirectGuestUplinkState20260923||'');}catch(e){}
    return !!(remoteHostId()&&guestStream()&&(st==='connecting'||st==='connected'));
  }
  function cleanRoom(hostId,runId){
    var h=String(hostId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,72);
    var r=String(runId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,44);
    return 'ktalk_'+h+(r?'_'+r:'');
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
  async function tokenFor(hostId,identity,runId){
    var q='?room='+encodeURIComponent(cleanRoom(hostId,runId))+
      '&identity='+encodeURIComponent(identity)+
      '&name='+encodeURIComponent(profileName())+
      '&t='+Date.now();
    var r=await fetch(TOKEN_URL+q,{cache:'no-store'});
    if(!r.ok)throw new Error('livekit_token_'+r.status);
    var j=await r.json();
    if(!j||!j.ok||!j.token)throw new Error(String(j&&j.error||'livekit_token_invalid'));
    return j;
  }
  function stopAudio(identity){
    var a=audioEls[identity];
    if(a){try{a.remove();}catch(e){}delete audioEls[identity];}
  }
  function attachAudio(track,identity){
    try{
      stopAudio(identity);
      var a=track.attach();
      a.autoplay=true;a.playsInline=true;a.style.display='none';
      a.dataset.ktLivekitAudio=identity;
      document.body.appendChild(a);
      audioEls[identity]=a;
      var p=a.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }
  function mediaStreamFor(track){
    try{
      var mt=track&&track.mediaStreamTrack;
      return mt?new MediaStream([mt]):null;
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
      if(v.srcObject!==stream)v.srcObject=stream;
      v.autoplay=true;v.playsInline=true;v.muted=true;v.defaultMuted=true;
      v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('muted','');
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      var sm=v.parentElement&&v.parentElement.querySelector('small');if(sm)sm.style.display='none';
      return true;
    }catch(e){return false;}
  }
  function attachHostVideo(stream){
    var targets=[];
    function add(v){if(v&&targets.indexOf(v)<0)targets.push(v);}
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
    var self=guestStream();
    if(main&&(!self||main.srcObject!==self))add(main);
    targets.forEach(function(v){setVideo(v,stream);});
    if(targets.length){
      try{window.__ktRemoteHostStream=stream;}catch(e){}
      var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';
    }
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
      '.ktg9-guest[data-viewer-id="'+esc+'"] video'
    ];
    for(var i=0;i<selectors.length;i++){
      try{var v=document.querySelector(selectors[i]);if(v)return v;}catch(e){}
    }
    return null;
  }

  function clearDuplicateGuestTargets(identity,keepVideo){
    var esc=identity;
    try{esc=CSS.escape(identity);}catch(e){}
    var selectors=[
      '[data-kt-livekit-guest="'+esc+'"]',
      '[data-kt-peer-viewer="'+esc+'"]'
    ];
    selectors.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(cell){
          var v=cell.querySelector&&cell.querySelector('video');
          if(v&&v===keepVideo)return;
          var direct=String(cell.dataset&&cell.dataset.ktDirectGuest||'');
          var legacy=String(cell.dataset&&cell.dataset.ktGuestViewerId||'');
          if(direct===identity||legacy===identity)return;
          try{if(v){v.pause();v.srcObject=null;}}catch(e){}
          try{delete cell.dataset.ktLivekitGuest;delete cell.dataset.ktPeerViewer;}catch(e){}
          try{cell.classList.remove('kt-livekit-peer-guest','kt-peer-guest');}catch(e){}
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
        '.kt-guest-room-grid .kt-guest-room-cell:not(.host):not(.self)'
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
  function attachGuestVideo(identity,stream){
    if(isHostRole()){
      try{if(!window.__ktApprovedGuestIds20260924||!window.__ktApprovedGuestIds20260924[identity])return;}catch(e){return;}
    }
    var known=guestVideoById[identity];
    if(known&&document.contains(known)){setVideo(known,stream);return;}
    var exact=exactGuestVideo(identity);
    if(exact){
      clearDuplicateGuestTargets(identity,exact);
      guestVideoById[identity]=exact;
      setVideo(exact,stream);
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
      setVideo(target,stream);
    }
  }
  function reattachRemoteTracks(){
    if(!room||room.state!=='connected')return;
    try{
      room.remoteParticipants.forEach(function(p){
        p.trackPublications.forEach(function(pub){
          if(pub&&pub.track)onRemoteTrack(pub.track,pub,p);
        });
      });
    }catch(e){}
  }
  function onRemoteTrack(track,publication,participant){
    var identity=String(participant&&participant.identity||'');
    if(!identity||identity===viewerId()||identity===DEVICE)return;
    if(track.kind==='audio'){attachAudio(track,identity);return;}
    if(track.kind!=='video')return;
    var s=mediaStreamFor(track);if(!s)return;
    if(identity===currentHostId)attachHostVideo(s);
    else attachGuestVideo(identity,s);
  }
  function clearRoomRefs(){
    Object.keys(audioEls).forEach(stopAudio);
    guestVideoById={};
    publishedVideoId='';publishedAudioId='';
  }
  async function disconnectRoom(){
    var old=room;room=null;connecting=false;
    setState({connected:false,connecting:false});
    clearRoomRefs();
    if(old){try{await old.disconnect(false);}catch(e){}}
  }
  async function ensureRoom(hostId,role,runId){
    hostId=String(hostId||'').trim();runId=String(runId||'').trim();
    if(!hostId||!runId)return null;
    if(room&&currentHostId===hostId&&currentRunId===runId&&room.state==='connected')return room;
    if(connecting&&currentHostId===hostId&&currentRunId===runId)return room;
    if(Date.now()-lastConnectAt<350&&currentHostId===hostId&&currentRunId===runId)return room;
    lastConnectAt=Date.now();connecting=true;currentHostId=hostId;currentRunId=runId;currentRole=role||'viewer';
    setState({connecting:true,connected:false,hostId:hostId,role:currentRole,lastError:''});
    try{
      var LK=await ensureSdk();
      if(room){try{await room.disconnect(false);}catch(e){}}
      clearRoomRefs();
      var identity=(currentRole==='host')?DEVICE:viewerId();
      var auth=await tokenFor(hostId,identity,runId);
      var r=new LK.Room({
        adaptiveStream:true,
        dynacast:true,
        disconnectOnPageLeave:false,
        stopLocalTrackOnUnpublish:false
      });
      room=r;
      r.on(LK.RoomEvent.TrackSubscribed,onRemoteTrack);
      r.on(LK.RoomEvent.TrackUnsubscribed,function(track,publication,participant){
        var id=String(participant&&participant.identity||'');if(track.kind==='audio')stopAudio(id);
      });
      r.on(LK.RoomEvent.Disconnected,function(){
        if(room===r){setState({connected:false,connecting:false});}
      });
      try{r.prepareConnection(auth.url||DEFAULT_URL,auth.token);}catch(e){}
      await r.connect(auth.url||DEFAULT_URL,auth.token,{autoSubscribe:true});
      if(room!==r){try{await r.disconnect(false);}catch(e){}return room;}
      connecting=false;
      setState({url:auth.url||DEFAULT_URL,connected:true,connecting:false,hostId:hostId,role:currentRole,runId:runId});
      try{
        r.remoteParticipants.forEach(function(p){
          p.trackPublications.forEach(function(pub){
            if(pub.track)onRemoteTrack(pub.track,pub,p);
          });
        });
      }catch(e){}
      return r;
    }catch(e){
      connecting=false;
      setState({connected:false,connecting:false,lastError:String(e&&e.message||e)});
      return null;
    }
  }
  async function publishSharedStream(stream){
    if(!room||room.state!=='connected'||!liveStream(stream))return;
    var LK=window.LivekitClient;if(!LK)return;
    var vp=room.localParticipant;
    try{
      var vt=stream.getVideoTracks&&stream.getVideoTracks()[0];
      if(vt&&vt.readyState==='live'&&publishedVideoId!==vt.id){
        if(publishedVideoId){
          try{
            vp.trackPublications.forEach(function(pub){if(pub.track&&pub.track.mediaStreamTrack&&pub.track.mediaStreamTrack.id===publishedVideoId)vp.unpublishTrack(pub.track,false);});
          }catch(e){}
        }
        var lv=new LK.LocalVideoTrack(vt);
        await vp.publishTrack(lv,{source:LK.Track.Source.Camera,simulcast:true});
        publishedVideoId=vt.id;
      }
    }catch(e){}
    try{
      var at=stream.getAudioTracks&&stream.getAudioTracks()[0];
      if(at&&at.readyState==='live'&&publishedAudioId!==at.id){
        var la=new LK.LocalAudioTrack(at);
        await vp.publishTrack(la,{source:LK.Track.Source.Microphone});
        publishedAudioId=at.id;
      }
    }catch(e){}
  }
  async function hostTick(){
    if(!isHostRole()&&!approvedHostId&&approvedGuestTransportReady()){
      approvedHostId=remoteHostId();
      watchHostId=approvedHostId;
    }
    if(isHostRole()){
      var hostRun=String(window.__ktHostRunId20260924||'').trim();
      if(!hostRun)return;
      var s=hostStream();
      if(s){
        var r=await ensureRoom(DEVICE,'host',hostRun);
        if(r){await publishSharedStream(s);reattachRemoteTracks();}
      }
      return;
    }
    var remoteRun=String(window.__ktRemoteHostRunId20260924||'').trim();
    if(approvedHostId){
      if(!remoteRun)return;
      var gs=guestStream();
      var gr=await ensureRoom(approvedHostId,'guest',remoteRun);
      if(gr){
        if(gs)await publishSharedStream(gs);
        reattachRemoteTracks();
      }
      return;
    }
    if(watchHostId){
      if(!remoteRun)return;
      var vr=await ensureRoom(watchHostId,'viewer',remoteRun);
      if(vr)reattachRemoteTracks();
    }
  }

  window.addEventListener('kt-guest-approval-received',function(e){
    approvedHostId=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(approvedHostId){watchHostId=approvedHostId;setTimeout(hostTick,0);setTimeout(hostTick,180);}
  });
  window.addEventListener('kt-remote-host-selected',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(h){watchHostId=h;setTimeout(hostTick,0);}
  });
  window.addEventListener('kt-host-session-reset',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;
    if(h===watchHostId||h===approvedHostId||h===currentHostId){
      approvedHostId='';watchHostId=h;
      disconnectRoom();
      setTimeout(hostTick,40);
    }
  });
  window.addEventListener('kt-host-session-ready',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||'').trim();
    if(!h)return;
    if(String(e&&e.detail&&e.detail.role||'')!=='host')watchHostId=h;
    if(room&&currentHostId===h&&currentRunId&&currentRunId!==String(e&&e.detail&&e.detail.run_id||''))disconnectRoom();
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

  setInterval(hostTick,650);
  setTimeout(hostTick,120);
  setTimeout(hostTick,900);
})();