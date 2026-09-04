/* K-Talk home feed: uploaded videos + active LIVE cards + direct WebRTC viewing. */
(function(){
  if(window.__ktHomeFeedFixInstalled)return;
  window.__ktHomeFeedFixInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var heartbeatTimer=null;
  var livePresenceOn=false;
  var hostSignalTimer=null;
  var hostPeers={};
  var viewerPeer=null;
  var viewerSessionId='';
  var viewerPollTimer=null;
  var viewerHostId='';
  var rtcConfig={iceServers:[
    {urls:'stun:stun.l.google.com:19302'},
    {urls:'stun:stun1.l.google.com:19302'}
  ]};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function who(){
    var name='K-Talk',id='guest';
    try{
      name=state.profileName||state.currentProfileName||state.accountName||name;
      id=state.profileId||state.currentAccountId||state.accountId||id;
    }catch(e){}
    try{
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    return {name:String(name).slice(0,80),id:String(id).slice(0,80)};
  }
  function viewerId(){
    var id='';
    try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}
    if(!id){
      id='viewer_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('ktalk_viewer_id',id);}catch(e){}
    }
    return id;
  }

  async function getVideos(){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{headers:headers()});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  async function getLives(){
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=20';
      var r=await fetch(u,{headers:headers()});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  function videoCard(x,i){
    var id=esc(x.id),u=esc(x.video_url),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    return '<section class="kt-feed-card" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="metadata" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
        +'<button onclick="ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button>'
        +'<button onclick="ktPublicComments(\''+id+'\')">💬<small>댓글</small></button>'
        +'<button onclick="openGifts()">🎁<small>선물</small></button>'
        +'<button onclick="ktPublicShare(\''+u+'\')">↗<small>공유</small></button>'
      +'</div>'
    +'</section>';
  }

  function liveCard(x){
    var host=esc(x.host_id||'guest');
    var name=esc(x.host_name||'K-Talk');
    var title=esc(x.title||x.room_name||'K-Talk LIVE');
    var room=esc(x.room_name||'라이브 방송');
    return '<section class="kt-feed-card kt-live-feed-card" data-live-host="'+host+'" data-live-title="'+title+'" data-live-room="'+room+'" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;overflow:hidden;background:radial-gradient(circle at 50% 30%,#35102c 0,#120914 40%,#030305 78%);cursor:pointer">'
      +'<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:30px;color:#fff">'
        +'<div><div style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ff2d55;font-size:20px;font-weight:950;box-shadow:0 0 28px #ff2d5577">● LIVE</div>'
        +'<div style="font-size:72px;margin:28px 0 14px">📡</div>'
        +'<b style="display:block;font-size:27px">'+name+'</b><span style="display:block;margin-top:8px;font-size:19px">'+title+'</span><small style="display:block;margin-top:10px;font-size:15px;opacity:.8">'+room+' · 방송 중</small>'
        +'<strong style="display:block;margin-top:20px;padding:12px 18px;border-radius:999px;background:#ffffff18;border:1px solid #ffffff33;font-size:16px">방송 자동 연결 중...</strong></div>'
      +'</div>'
      +'<div class="vh-tabs"><span class="on">LIVE</span><span>커뮤니티</span><span>팔로잉</span><span>추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>🔴 '+name+'</b><span>'+title+'</span></div>'
    +'</section>';
  }

  function bindVideos(){
    var vs=[].slice.call(document.querySelectorAll('.kt-public-video'));
    vs.forEach(function(v){
      v.onclick=function(){
        try{v.muted=false;v.defaultMuted=false;v.volume=1;}catch(e){}
        if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}
      };
    });
    if('IntersectionObserver'in window){
      var ob=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting&&e.intersectionRatio>.6)e.target.play().catch(function(){});
          else e.target.pause();
        });
      },{threshold:[.6]});
      vs.forEach(function(v){ob.observe(v);});
    }
  }

  function bindLives(){
    [].slice.call(document.querySelectorAll('.kt-live-feed-card')).forEach(function(card){
      card.onclick=function(){
        ktJoinLive(card.dataset.liveHost||'guest',card.dataset.liveTitle||'K-Talk LIVE',card.dataset.liveRoom||'라이브 방송');
      };
    });
  }

  var fallbackHome=window.home;
  var fallbackMedia=window.media;

  async function showFeed(fallback){
    stopViewerConnection(false);
    var results=await Promise.all([getLives(),getVideos()]);
    var lives=results[0]||[],videos=results[1]||[];
    if(!lives.length&&!videos.length){if(fallback)fallback();return;}
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    var html=lives.map(liveCard).join('')+videos.map(function(v,i){return videoCard(v,i+lives.length);}).join('');
    screen.innerHTML='<div id="ktUnifiedFeed" style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+html+'</div>';
    bindVideos();
    bindLives();
  }

  window.home=function(){try{if(window.activate)activate('home');}catch(e){}showFeed(fallbackHome);};
  window.media=function(type){try{if(window.activate)activate(type);}catch(e){}showFeed(function(){if(fallbackMedia)fallbackMedia(type);});};
  window.ktRefreshUnifiedFeed=function(){return showFeed(fallbackHome);};

  function fitLiveCamera(){
    try{
      var v=document.getElementById('ktLiveVideo');
      if(!v)return;
      v.style.setProperty('object-fit','contain','important');
      v.style.setProperty('transform','scaleX(-1) scale(.72)','important');
      v.style.setProperty('transform-origin','50% 50%','important');
      var layer=document.getElementById('ktLiveEffectLayer');
      if(layer){
        layer.style.setProperty('transform','scale(.72)','important');
        layer.style.setProperty('transform-origin','50% 50%','important');
      }
      try{
        var track=state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks()[0];
        if(track&&track.getCapabilities&&track.applyConstraints){
          var caps=track.getCapabilities();
          if(caps&&caps.zoom&&typeof caps.zoom.min==='number'){
            track.applyConstraints({advanced:[{zoom:caps.zoom.min}]}).catch(function(){});
          }
        }
      }catch(e){}
    }catch(e){}
  }

  function waitIce(pc,timeout){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete'){resolve();return;}
      var done=false;
      function finish(){if(done)return;done=true;try{pc.removeEventListener('icegatheringstatechange',onchange);}catch(e){}resolve();}
      function onchange(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',onchange);
      setTimeout(finish,timeout||3500);
    });
  }

  function stopHostSignalLoop(markInactive){
    clearInterval(hostSignalTimer);hostSignalTimer=null;
    Object.keys(hostPeers).forEach(function(id){try{hostPeers[id].close();}catch(e){}});
    hostPeers={};
    if(markInactive){
      var me=who();
      fetch(SB+'/rest/v1/ktalk_webrtc_sessions?host_id=eq.'+encodeURIComponent(me.id)+'&active=eq.true',{
        method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,updated_at:new Date().toISOString()})
      }).catch(function(){});
    }
  }

  async function answerOffer(row){
    if(!row||!row.id||hostPeers[row.id])return;
    var stream=null;
    try{stream=state.stream;}catch(e){}
    if(!stream||!stream.getTracks||!stream.getVideoTracks().length)return;
    var pc=new RTCPeerConnection(rtcConfig);
    hostPeers[row.id]=pc;
    try{
      stream.getTracks().forEach(function(track){pc.addTrack(track,stream);});
      pc.onconnectionstatechange=function(){
        var s=pc.connectionState;
        if(s==='failed'||s==='closed'||s==='disconnected'){
          try{pc.close();}catch(e){}
          delete hostPeers[row.id];
        }
      };
      await pc.setRemoteDescription(JSON.parse(row.offer_sdp));
      var answer=await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitIce(pc,3500);
      await fetch(SB+'/rest/v1/ktalk_webrtc_sessions?id=eq.'+encodeURIComponent(row.id),{
        method:'PATCH',
        headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({answer_sdp:JSON.stringify(pc.localDescription),updated_at:new Date().toISOString()})
      });
    }catch(e){
      try{pc.close();}catch(_e){}
      delete hostPeers[row.id];
    }
  }

  async function scanOffers(hostId){
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var u=SB+'/rest/v1/ktalk_webrtc_sessions?select=id,offer_sdp,answer_sdp,active,created_at&host_id=eq.'+encodeURIComponent(hostId)+'&active=eq.true&answer_sdp=is.null&created_at=gte.'+encodeURIComponent(since)+'&order=created_at.asc&limit=12';
      var r=await fetch(u,{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json();
      rows.forEach(function(row){answerOffer(row);});
    }catch(e){}
  }

  function startHostSignalLoop(hostId){
    stopHostSignalLoop(false);
    scanOffers(hostId);
    hostSignalTimer=setInterval(function(){scanOffers(hostId);},700);
  }

  function setViewerStatus(text,bad){
    var el=document.getElementById('ktRemoteLiveStatus');
    if(el){el.textContent=text;el.style.color=bad?'#ff9aae':'#fff';}
  }

  async function stopViewerConnection(markInactive){
    clearInterval(viewerPollTimer);viewerPollTimer=null;
    if(markInactive&&viewerSessionId){
      try{
        await fetch(SB+'/rest/v1/ktalk_webrtc_sessions?id=eq.'+encodeURIComponent(viewerSessionId),{
          method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,updated_at:new Date().toISOString()})
        });
      }catch(e){}
    }
    viewerSessionId='';viewerHostId='';
    if(viewerPeer){try{viewerPeer.close();}catch(e){}viewerPeer=null;}
  }

  async function pollAnswer(id,pc){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_webrtc_sessions?select=answer_sdp,active&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json(),row=rows&&rows[0];
      if(!row)return;
      if(row.active===false){setViewerStatus('방송이 종료되었습니다.',true);clearInterval(viewerPollTimer);viewerPollTimer=null;return;}
      if(row.answer_sdp&&!pc.currentRemoteDescription){
        await pc.setRemoteDescription(JSON.parse(row.answer_sdp));
        setViewerStatus('방송 연결 중...');
      }
    }catch(e){}
  }

  window.ktJoinLive=async function(hostId,title,roomName){
    await stopViewerConnection(true);
    viewerHostId=String(hostId||'guest');
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    screen.innerHTML='<section style="height:calc(100dvh - 78px);position:relative;overflow:hidden;background:#000;color:#fff">'
      +'<video id="ktRemoteLive" autoplay playsinline controls style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;transform:scaleX(-1);transform-origin:50% 50%"></video>'
      +'<div style="position:absolute;left:12px;right:12px;top:12px;z-index:8;display:flex;align-items:center;gap:10px">'
        +'<button onclick="ktLeaveRemoteLive()" style="width:46px;height:46px;border:0;border-radius:50%;background:#08080bbb;color:#fff;font-size:29px">‹</button>'
        +'<div style="min-width:0;flex:1;padding:9px 12px;border-radius:14px;background:#09090dbb"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🔴 '+esc(title||'K-Talk LIVE')+'</b><small>'+esc(roomName||'라이브 방송')+'</small></div>'
        +'<span style="padding:9px 12px;border-radius:999px;background:#ff2d55;font-weight:950">LIVE</span>'
      +'</div>'
      +'<div id="ktRemoteLiveStatus" style="position:absolute;left:50%;top:50%;z-index:7;transform:translate(-50%,-50%);padding:13px 18px;border-radius:999px;background:#08080bdd;font-weight:900;white-space:nowrap">방송 연결 중...</div>'
      +'<button id="ktRemoteSoundBtn" onclick="var v=document.getElementById(\'ktRemoteLive\');if(v){v.muted=false;v.volume=1;v.play().catch(function(){});}this.style.display=\'none\';" style="display:none;position:absolute;left:50%;bottom:30px;z-index:9;transform:translateX(-50%);padding:13px 20px;border:0;border-radius:999px;background:#fff;color:#111;font-weight:950">🔊 소리 켜기</button>'
      +'</section>';

    if(!window.RTCPeerConnection){setViewerStatus('이 휴대폰에서는 방송 연결을 지원하지 않습니다.',true);return;}
    var pc=new RTCPeerConnection(rtcConfig);
    viewerPeer=pc;
    var video=document.getElementById('ktRemoteLive');
    var remote=new MediaStream();
    if(video)video.srcObject=remote;

    pc.ontrack=function(ev){
      try{
        var src=ev.streams&&ev.streams[0];
        if(src){video.srcObject=src;}else if(ev.track&&!remote.getTracks().some(function(t){return t.id===ev.track.id;})){remote.addTrack(ev.track);}
        setViewerStatus('연결됨');
        setTimeout(function(){var s=document.getElementById('ktRemoteLiveStatus');if(s)s.style.display='none';},700);
        if(video){
          video.muted=false;video.volume=1;
          var p=video.play();
          if(p&&p.catch)p.catch(function(){var b=document.getElementById('ktRemoteSoundBtn');if(b)b.style.display='block';});
        }
      }catch(e){}
    };
    pc.onconnectionstatechange=function(){
      var s=pc.connectionState;
      if(s==='connected')setViewerStatus('연결됨');
      else if(s==='failed'||s==='disconnected')setViewerStatus('연결이 끊겼습니다. 다시 들어가 주세요.',true);
    };

    try{
      pc.addTransceiver('video',{direction:'recvonly'});
      pc.addTransceiver('audio',{direction:'recvonly'});
      var offer=await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitIce(pc,3500);
      var body={host_id:viewerHostId,viewer_id:viewerId(),offer_sdp:JSON.stringify(pc.localDescription),active:true,updated_at:new Date().toISOString()};
      var r=await fetch(SB+'/rest/v1/ktalk_webrtc_sessions',{
        method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify(body)
      });
      if(!r.ok)throw new Error('signal insert');
      var rows=await r.json();
      viewerSessionId=rows&&rows[0]&&rows[0].id?rows[0].id:'';
      if(!viewerSessionId)throw new Error('no session');
      pollAnswer(viewerSessionId,pc);
      viewerPollTimer=setInterval(function(){pollAnswer(viewerSessionId,pc);},600);
      setTimeout(function(){
        if(viewerPeer===pc&&pc.connectionState!=='connected')setViewerStatus('연결이 늦습니다. 방송하는 휴대폰도 새로고침 후 다시 방송을 열어 주세요.',true);
      },15000);
    }catch(e){
      setViewerStatus('방송 연결에 실패했습니다. 다시 눌러 주세요.',true);
    }
  };

  window.ktLeaveRemoteLive=function(){
    stopViewerConnection(true).then(function(){window.home();});
  };

  async function setPresence(active){
    var me=who();
    var title='K-Talk LIVE',roomType='solo',roomName='1인 방송';
    try{
      title=state.currentLiveRoomTitle||document.getElementById('liveTitle')&&document.getElementById('liveTitle').value||title;
      roomType=state.liveRoomType||roomType;
      roomName=state.liveRoomName||roomName;
    }catch(e){}
    try{
      if(active){
        var body={host_id:me.id,host_name:me.name,title:String(title||roomName).slice(0,120),room_type:String(roomType).slice(0,40),room_name:String(roomName).slice(0,80),active:true,started_at:new Date().toISOString(),updated_at:new Date().toISOString()};
        var r=await fetch(SB+'/rest/v1/ktalk_live_rooms?on_conflict=host_id',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(body)});
        if(r.ok){
          livePresenceOn=true;
          clearInterval(heartbeatTimer);
          heartbeatTimer=setInterval(function(){touchPresence();},20000);
          startHostSignalLoop(me.id);
          fitLiveCamera();
        }
      }else{
        clearInterval(heartbeatTimer);heartbeatTimer=null;livePresenceOn=false;
        stopHostSignalLoop(true);
        await fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,updated_at:new Date().toISOString()})});
      }
    }catch(e){}
  }

  async function touchPresence(){
    if(!livePresenceOn)return;
    var me=who();
    try{await fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:true,updated_at:new Date().toISOString()})});}catch(e){}
  }

  window.ktSetLivePresence=setPresence;
  function announceLiveSoon(){
    setTimeout(function(){
      try{
        fitLiveCamera();
        var liveView=document.getElementById('ktLiveVideo');
        var liveTrack=state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';});
        if(liveView||liveTrack)setPresence(true);
      }catch(e){}
    },120);
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var r=await oldStart.apply(this,arguments);
      announceLiveSoon();
      return r;
    };
  }

  var oldTestStart=window.startTestBroadcast;
  if(typeof oldTestStart==='function'){
    window.startTestBroadcast=async function(){
      var r=await oldTestStart.apply(this,arguments);
      announceLiveSoon();
      return r;
    };
  }

  var oldEnd=window.endBroadcastEarnings;
  if(typeof oldEnd==='function'){
    window.endBroadcastEarnings=function(){setPresence(false);return oldEnd.apply(this,arguments);};
  }
  var oldTestEnd=window.endTestBroadcast;
  if(typeof oldTestEnd==='function'){
    window.endTestBroadcast=function(){setPresence(false);return oldTestEnd.apply(this,arguments);};
  }

  try{
    var liveDomObserver=new MutationObserver(function(){
      var liveView=document.getElementById('ktLiveVideo');
      if(liveView){fitLiveCamera();if(!livePresenceOn)setPresence(true);}
    });
    liveDomObserver.observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pagehide',function(){
    if(livePresenceOn)setPresence(false);
    stopViewerConnection(true);
  });

  setTimeout(function(){
    try{
      var creatorOpen=window.creator&&creator.classList&&creator.classList.contains('show');
      var liveOpen=document.getElementById('ktLiveVideo');
      if(liveOpen){fitLiveCamera();if(!livePresenceOn)setPresence(true);}
      if(!creatorOpen&&!liveOpen)window.home();
    }catch(e){}
  },450);
})();

/* K-Talk: reliable viewer LIVE discovery. */
(function(){
  if(window.__ktLiveAutoEntryLoaded)return;
  window.__ktLiveAutoEntryLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var joining=false;
  var snoozeUntil=0;
  var lastHost='';
  var lastAttemptAt=0;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function hostDevice(){
    try{
      if(document.body.classList.contains('kt-solo-host-live'))return true;
      if(document.getElementById('ktLiveVideo'))return true;
      var stream=window.state&&state.stream;
      if(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
      var creator=document.getElementById('creator')||window.creator;
      if(creator&&creator.classList&&creator.classList.contains('show'))return true;
    }catch(e){}
    return false;
  }
  function viewerReady(){
    try{
      if(document.getElementById('ktRemoteLive'))return false;
      if(document.getElementById('ktUnifiedFeed'))return true;
      if(document.querySelector('.kt-live-feed-card'))return true;
      if(document.body.classList.contains('kt-home'))return true;
    }catch(e){}
    return false;
  }
  function installLeaveSnooze(){
    var fn=window.ktLeaveRemoteLive;
    if(typeof fn!=='function'||fn.__ktLiveVisibleLeaveWrapped)return;
    function wrapped(){
      snoozeUntil=Date.now()+30000;
      return fn.apply(this,arguments);
    }
    wrapped.__ktLiveVisibleLeaveWrapped=true;
    window.ktLeaveRemoteLive=wrapped;
  }
  async function scan(){
    installLeaveSnooze();
    if(joining||Date.now()<snoozeUntil||hostDevice()||!viewerReady())return;
    if(typeof window.ktJoinLive!=='function')return;
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var url=SB+'/rest/v1/ktalk_live_rooms?select=host_id,host_name,title,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=1';
      var r=await fetch(url,{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json();
      var live=rows&&rows[0];
      if(!live)return;
      var host=String(live.host_id||'guest');
      if(lastHost===host&&Date.now()-lastAttemptAt<4000)return;
      lastHost=host;
      lastAttemptAt=Date.now();
      try{
        var card=document.querySelector('.kt-live-feed-card');
        var strong=card&&card.querySelector('strong');
        if(strong)strong.textContent='방송 자동 연결 중...';
      }catch(e){}
      joining=true;
      try{await window.ktJoinLive(host,live.title||live.host_name||'K-Talk LIVE',live.room_name||'라이브 방송');}catch(e){}
      setTimeout(function(){joining=false;},1000);
    }catch(e){}
  }

  try{new MutationObserver(function(){setTimeout(scan,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(scan,450);
  setInterval(scan,1500);
})();
