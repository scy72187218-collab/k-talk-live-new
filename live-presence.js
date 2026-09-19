/* K-Talk LIVE 실시간 방송 표시 전용: 방송중 빨간불, 방송목록, 입퇴장 알림, 다른 기기 영상 연결. 기존 방 UI는 건드리지 않음. */
(function(){
  if(window.__ktLivePresenceInstalled)return;
  window.__ktLivePresenceInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var STALE_MS=50000;
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var hostActive=false,hostRoomId='',hostHeartbeat=null,hostSignalTimer=null,hostActivityTimer=null;
  var hostEndLock=false,hostRunToken=0;
  var hostPeers={};
  var viewerCtx=null;
  var lastActivityStamp='';

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function fetchStable(url,opt){
    var lastError=null;
    for(var attempt=0;attempt<2;attempt++){
      var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
      var timer=ctrl?setTimeout(function(){ctrl.abort();},12000):null;
      try{
        var next=Object.assign({},opt||{});
        if(ctrl)next.signal=ctrl.signal;
        var response=await fetch(url,next);
        if(timer)clearTimeout(timer);
        return response;
      }catch(e){
        if(timer)clearTimeout(timer);
        lastError=e;
        if(attempt===0)await new Promise(function(resolve){setTimeout(resolve,700);});
      }
    }
    throw lastError||new Error('live network');
  }
  async function req(path,opt){
    opt=opt||{};
    opt.headers=headers(opt.headers);
    var r=await fetchStable(BASE+path,opt);
    if(!r.ok)throw new Error('live api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();
    return t?JSON.parse(t):null;
  }

  /* 시청 입장 등록만 보강: 일부 기기에서 upsert가 실패해도 기존 행 갱신/새 행 생성으로 재시도.
     방송 화면·버튼·채팅·게스트 칸은 변경하지 않음. */
  async function ensureViewerPresence(hostId,viewerId,viewerName){
    var path='ktalk_live_viewers?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(viewerId);
    try{
      var rows=await req(path+'&select=id,active&limit=1');
      if(rows&&rows.length){
        await req(path,{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({viewer_name:viewerName,active:true,updated_at:nowIso()})
        });
        return true;
      }
    }catch(e){}
    try{
      await req('ktalk_live_viewers',{
        method:'POST',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({host_id:hostId,viewer_id:viewerId,viewer_name:viewerName,active:true,updated_at:nowIso()})
      });
      return true;
    }catch(e){
      /* 동시에 같은 기기에서 행이 생긴 경우 마지막으로 PATCH 한 번만 재시도 */
      try{
        await req(path,{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({viewer_name:viewerName,active:true,updated_at:nowIso()})
        });
        var chk=await req(path+'&select=id&limit=1');
        return !!(chk&&chk.length);
      }catch(z){return false;}
    }
  }

  async function createViewerSession(hostId,viewerId){
    /* 같은 시청자에게 남은 활성 세션만 종료 */
    try{
      await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(viewerId)+'&active=eq.true',{
        method:'PATCH',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });
    }catch(e){}

    for(var attempt=0;attempt<2;attempt++){
      try{
        var sessions=await req('ktalk_webrtc_sessions',{
          method:'POST',
          headers:{Prefer:'return=representation'},
          body:JSON.stringify({host_id:hostId,viewer_id:viewerId,offer_sdp:'pending',answer_sdp:null,active:true,updated_at:nowIso()})
        });
        var sid=sessions&&sessions[0]?sessions[0].id:'';
        if(sid)return sid;
      }catch(e){
        if(attempt===0)await new Promise(function(resolve){setTimeout(resolve,450);});
      }
    }
    return '';
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function nowIso(){return new Date().toISOString();}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function profile(){
    var p={name:'',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||'');p.photo=String(x.photo||'');}}catch(e){}
    if(!p.name){
      try{
        var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
        if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.name||'');p.photo=String(s.photo||'');}
      }catch(e){}
    }
    if(!p.name)p.name='K-Talk 방송자';
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
  }
  function currentRoom(){
    var type='solo',name='1인 방송',title='';
    try{type=String((window.state&&state.liveRoomType)||'solo');name=String((window.state&&state.liveRoomName)||'1인 방송');}catch(e){}
    if(type==='group')type='group13';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }
  function hasLiveLocalVideo(){
    try{return !!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }
  function localStream(){try{return window.state&&state.stream?state.stream:null;}catch(e){return null;}}

  function ensureStyle(){
    if(document.getElementById('ktLivePresenceStyle'))return;
    var s=document.createElement('style');s.id='ktLivePresenceStyle';
    s.textContent=''
      +'@keyframes ktLiveBlink{0%,45%{opacity:1;box-shadow:0 0 5px #ff173f,0 0 15px #ff173f}55%,100%{opacity:.42;box-shadow:0 0 2px #ff173f}}'
      +'.kt-live-dot{display:inline-block;width:11px;height:11px;border-radius:50%;background:#ff173f;vertical-align:-1px;margin-right:5px;animation:ktLiveBlink .9s linear infinite}'
      +'.kt-live-now-strip{margin:0 0 13px;padding:10px;border:1px solid #ff315f88;border-radius:16px;background:linear-gradient(135deg,#25070f,#0b0b12);box-shadow:0 0 15px #ff315f33;color:#fff}'
      +'.kt-live-now-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px;font-weight:950}.kt-live-now-title b{color:#ff6b84}.kt-live-now-title small{color:#ddd;font-size:10px}'
      +'.kt-live-now-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.kt-live-card{position:relative;min-height:104px;border:1px solid #ffffff26;border-radius:13px;background:linear-gradient(160deg,#191921,#08080d);color:#fff;text-align:left;padding:10px;overflow:hidden}.kt-live-card strong{display:block;padding-right:44px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-live-card span{display:block;margin-top:6px;color:#ddd;font-size:10px;line-height:1.35}.kt-live-card em{position:absolute;right:8px;top:8px;padding:3px 6px;border-radius:999px;background:#c91536;color:#fff;font-style:normal;font-size:9px;font-weight:950}.kt-live-card .kt-enter-live{margin-top:8px;display:inline-block;padding:5px 9px;border-radius:8px;background:#ff315f;color:#fff;font-size:10px;font-weight:950}'
      +'.friends-page .kt-live-list-wrap{padding:10px}.friends-page .kt-live-list-head{display:flex;align-items:center;gap:7px;margin-bottom:9px;color:#fff;font-size:15px;font-weight:950}.friends-page .kt-live-list-grid{display:grid;gap:9px}.friends-page .kt-live-list-card{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;padding:10px;border:1px solid #ff315f55;border-radius:15px;background:#101016;color:#fff}.kt-live-list-thumb{width:64px;height:64px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#59123c,#13295a);font-size:29px;overflow:hidden}.kt-live-list-thumb img{width:100%;height:100%;object-fit:cover}.kt-live-list-info b{display:block;font-size:13px}.kt-live-list-info span{display:block;margin-top:4px;color:#cfcfd6;font-size:10px}.kt-live-list-enter{border:0;border-radius:10px;background:#ff315f;color:#fff;padding:9px 10px;font-size:10px;font-weight:950}'
      +'html.kt-remote-viewing .header,html.kt-remote-viewing .bottom{display:none!important}html.kt-remote-viewing #screen{padding:0!important;margin:0!important;width:100%!important;height:100dvh!important;max-width:none!important;background:#000!important}'
      +'.kt-remote-live{position:relative;width:100%;height:100dvh;background:#000;color:#fff;overflow:hidden}.kt-remote-live video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#08080b}.kt-remote-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.56),transparent 24%,transparent 65%,rgba(0,0,0,.68))}.kt-remote-top{position:absolute;left:8px;right:8px;top:8px;z-index:4;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:14px;background:rgba(10,10,14,.62);backdrop-filter:blur(5px)}.kt-remote-back{width:34px;height:34px;border:1px solid #ffffff32;border-radius:50%;background:#111a;color:#fff;font-size:25px}.kt-remote-meta{min-width:0;flex:1}.kt-remote-meta b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-remote-meta span{display:block;margin-top:2px;font-size:10px;color:#ddd}.kt-remote-viewers{font-size:10px;font-weight:900;color:#fff}.kt-remote-status{position:absolute;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%);padding:10px 13px;border-radius:12px;background:#101016dd;font-size:12px;font-weight:900}.kt-live-activity-toast{position:fixed;z-index:99999;left:50%;bottom:88px;transform:translateX(-50%);max-width:88%;padding:8px 12px;border-radius:999px;background:rgba(10,10,14,.88);border:1px solid #ff5a8080;color:#fff;font-size:11px;font-weight:850;box-shadow:0 0 12px #0008;pointer-events:none}'
      +'@media(max-width:390px){.kt-live-now-cards{grid-template-columns:1fr}.friends-page .kt-live-list-card{grid-template-columns:55px 1fr auto}.kt-live-list-thumb{width:55px;height:55px}}';
    document.head.appendChild(s);
  }

  function showActivity(text){
    if(!text)return;
    var old=document.getElementById('ktLiveActivityToast');if(old)old.remove();
    var d=document.createElement('div');d.id='ktLiveActivityToast';d.className='kt-live-activity-toast';d.textContent=text;document.body.appendChild(d);
    setTimeout(function(){if(d&&d.parentNode)d.remove();},2800);
  }

  async function insertSystem(hostId,senderId,senderName,message){
    try{await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:hostId,sender_id:senderId,sender_name:senderName,message:message,message_type:'system'})});}catch(e){}
  }

  async function activeRooms(){
    var cut=new Date(Date.now()-STALE_MS).toISOString();
    try{
      var rows=await req('ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,active,started_at,updated_at,host_photo&active=eq.true&updated_at=gte.'+enc(cut)+'&order=started_at.desc&limit=20');
      rows=Array.isArray(rows)?rows:[];
      if(hostEndLock){var own=deviceId();rows=rows.filter(function(x){return String(x.host_id||'')!==String(own);});}
      return rows;
    }catch(e){return [];}
  }
  async function viewerCounts(){
    var cut=new Date(Date.now()-STALE_MS).toISOString();
    try{
      var rows=await req('ktalk_live_viewers?select=host_id,viewer_id&active=eq.true&updated_at=gte.'+enc(cut)+'&limit=500');
      var out={};(rows||[]).forEach(function(r){out[r.host_id]=(out[r.host_id]||0)+1;});return out;
    }catch(e){return {};}
  }

  function roomCard(r,count,listMode){
    var photo=r.host_photo&&/^data:image|^https?:/.test(r.host_photo)?'<img src="'+esc(r.host_photo)+'" alt="">':'🎥';
    if(listMode){
      return '<div class="kt-live-list-card"><div class="kt-live-list-thumb">'+photo+'</div><div class="kt-live-list-info"><b><i class="kt-live-dot"></i>'+esc(r.host_name||'K-Talk')+'</b><span>'+esc(r.title||r.room_name||'라이브')+' · '+esc(r.room_name||'방송')+'<br>👁 '+count+'명 시청 중</span></div><button class="kt-live-list-enter" onclick="ktEnterRemoteLive(\''+esc(r.host_id)+'\')">입장</button></div>';
    }
    return '<button class="kt-live-card" onclick="ktEnterRemoteLive(\''+esc(r.host_id)+'\')"><em><i class="kt-live-dot"></i>LIVE</em><strong>'+esc(r.host_name||'K-Talk')+'</strong><span>'+esc(r.title||r.room_name||'라이브')+'<br>👁 '+count+'명</span><b class="kt-enter-live">방송 들어가기 ›</b></button>';
  }

  async function renderLiveCards(){
    ensureStyle();
    var rooms=await activeRooms();
    var counts=await viewerCounts();
    var dash=document.querySelector('.kt-dashboard');
    var old=document.getElementById('ktLiveNowStrip');if(old)old.remove();
    if(dash&&rooms.length){
      var box=document.createElement('div');box.id='ktLiveNowStrip';box.className='kt-live-now-strip';
      box.innerHTML='<div class="kt-live-now-title"><b><i class="kt-live-dot"></i>지금 방송 중</b><small>눌러서 바로 입장</small></div><div class="kt-live-now-cards">'+rooms.slice(0,4).map(function(r){return roomCard(r,counts[r.host_id]||0,false);}).join('')+'</div>';
      var notice=dash.querySelector('.kt-notice');if(notice&&notice.parentNode)notice.parentNode.insertBefore(box,notice.nextSibling);else dash.insertBefore(box,dash.firstChild);
    }
    var list=document.querySelector('.friends-list');
    if(list){
      if(rooms.length)list.innerHTML='<div class="kt-live-list-wrap"><div class="kt-live-list-head"><i class="kt-live-dot"></i>현재 방송 중 '+rooms.length+'개</div><div class="kt-live-list-grid">'+rooms.map(function(r){return roomCard(r,counts[r.host_id]||0,true);}).join('')+'</div></div>';
      else list.innerHTML='<div class="friend-row"><div class="friend-info"><b>현재 방송목록</b><span>지금 방송 중인 사람이 없습니다.</span></div></div>';
    }
  }
  window.ktRefreshLiveCards=renderLiveCards;

  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||4500);
      function finish(){if(done)return;done=true;clearTimeout(t);pc.removeEventListener('icegatheringstatechange',on);resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }

  async function hostProcessSignals(){
    if(!hostActive)return;
    var hostId=deviceId(),stream=localStream();if(!stream)return;
    try{
      var rows=await req('ktalk_webrtc_sessions?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=created_at.asc&limit=30');
      for(var i=0;i<(rows||[]).length;i++){
        var x=rows[i],entry=hostPeers[x.id];
        if(!entry&&x.offer_sdp==='pending'){
          var pc=new RTCPeerConnection(ICE);hostPeers[x.id]={pc:pc,remoteSet:false};entry=hostPeers[x.id];
          stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream);}catch(e){}});
          pc.onconnectionstatechange=(function(id,p){return function(){if(['failed','closed','disconnected'].indexOf(p.connectionState)>-1&&hostPeers[id]){try{p.close();}catch(e){}delete hostPeers[id];}};})(x.id,pc);
          try{
            var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});await pc.setLocalDescription(offer);await waitIce(pc,5000);
            await req('ktalk_webrtc_sessions?id=eq.'+enc(x.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({offer_sdp:pc.localDescription.sdp,updated_at:nowIso()})});
          }catch(e){try{pc.close();}catch(z){}delete hostPeers[x.id];}
        }else if(entry&&x.answer_sdp&&!entry.remoteSet){
          try{await entry.pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});entry.remoteSet=true;}catch(e){}
        }
      }
    }catch(e){}
  }

  async function hostPollActivity(){
    if(!hostActive)return;
    var hostId=deviceId();
    try{
      var rows=await req('ktalk_live_messages?select=id,sender_name,message,message_type,created_at&host_id=eq.'+enc(hostId)+'&message_type=eq.system&order=created_at.desc&limit=6');
      if(rows&&rows.length){
        var newest=rows[0];
        if(lastActivityStamp&&newest.created_at!==lastActivityStamp){
          showActivity(newest.message);
          try{
            var msg=String(newest.message||'');
            if(msg.indexOf('님이 들어왔습니다.')>-1){
              var nm=String(newest.sender_name||'').trim();
              if(typeof window.ktAnnounceEvent==='function'){
                window.ktAnnounceEvent('join',{name:nm});
              }else if(typeof window.ktSpeak==='function'){
                window.ktSpeak((nm?nm+'님, ':'')+'K-Talk에 오신 것을 환영합니다.');
              }
            }
          }catch(e){}
        }
        lastActivityStamp=newest.created_at;
      }
    }catch(e){}
  }

  async function startHostPresence(){
    if(hostEndLock||hostActive||!hasLiveLocalVideo())return;
    var p=profile(),r=currentRoom(),hostId=deviceId(),stamp=nowIso();
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
      var rows=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      hostRoomId=rows&&rows[0]?rows[0].id:'';hostActive=true;lastActivityStamp='';
      showActivity('🔴 방송이 시작되었습니다. 방송목록에 표시됩니다.');
      clearInterval(hostHeartbeat);clearInterval(hostSignalTimer);clearInterval(hostActivityTimer);
      var beatToken=hostRunToken;
      hostHeartbeat=setInterval(async function(){if(hostEndLock||beatToken!==hostRunToken||!hostActive||!hostRoomId)return;try{await req('ktalk_live_rooms?id=eq.'+enc(hostRoomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});}catch(e){}},12000);
      hostSignalTimer=setInterval(hostProcessSignals,1400);hostProcessSignals();
      hostActivityTimer=setInterval(hostPollActivity,1800);hostPollActivity();
      renderLiveCards();
    }catch(e){hostActive=false;hostRoomId='';}
  }

  async function stopHostPresence(){
    /* 방송 종료 때 상태값이 이미 풀렸어도 서버의 빨간 LIVE 표시를 반드시 끈다. */
    var hostId=deviceId(),roomId=hostRoomId;hostEndLock=true;hostRunToken++;var stopToken=hostRunToken;hostActive=false;hostRoomId='';
    window.__ktHostEndLock=true;window.__ktHostEndLockHostId=hostId;
    clearInterval(hostHeartbeat);clearInterval(hostSignalTimer);clearInterval(hostActivityTimer);hostHeartbeat=hostSignalTimer=hostActivityTimer=null;
    Object.keys(hostPeers).forEach(function(k){try{hostPeers[k].pc.close();}catch(e){}});hostPeers={};

    /* 내 LIVE 배지는 서버 응답을 기다리지 않고 화면에서 즉시 제거 */
    try{
      var peek=document.getElementById('ktVideoLivePeek');
      if(peek){
        var own=peek.querySelector('[data-host="'+CSS.escape(String(hostId))+'"]');
        if(own)peek.remove();
      }
    }catch(e){}

    /* roomId 유무와 관계없이 현재 기기의 모든 활성 방송/세션을 종료 */
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{
        method:'PATCH',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });
    }catch(e){}
    try{
      await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&active=eq.true',{
        method:'PATCH',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });
    }catch(e){}
    /* 종료 직전 실행 중이던 비동기 heartbeat가 늦게 active:true를 쓰는 경우를 다시 덮어쓴다. */
    [350,1400].forEach(function(delay){setTimeout(function(){
      if(!hostEndLock||hostRunToken!==stopToken)return;
      req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})}).catch(function(){});
      req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})}).catch(function(){});
      try{if(window.ktRefreshVideoLivePeek)window.ktRefreshVideoLivePeek();}catch(e){}
    },delay);});
    renderLiveCards();
    try{if(window.ktRefreshVideoLivePeek)window.ktRefreshVideoLivePeek();}catch(e){}
  }
  window.ktStopHostPresence=stopHostPresence;

  /* 방송 화면이 이미 닫혔는데 LIVE 상태만 남는 경우 자동 정리. 다른 화면은 변경하지 않음. */
  setInterval(function(){
    try{
      if(!hostActive&&!hostRoomId)return;
      if(document.documentElement.classList.contains('kt-remote-viewing'))return;
      var s=document.getElementById('screen');
      var opened=!!(s&&s.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
      if(!opened)stopHostPresence();
    }catch(e){}
  },1200);

  function renderRemote(room){
    ensureStyle();document.documentElement.classList.add('kt-remote-viewing');
    var s=document.getElementById('screen');if(!s)return;
    s.innerHTML='<section class="kt-remote-live"><video id="ktRemoteLiveVideo" autoplay playsinline></video><div class="kt-remote-shade"></div><div class="kt-remote-top"><button class="kt-remote-back" onclick="ktLeaveRemoteLive()">‹</button><div class="kt-remote-meta"><b><i class="kt-live-dot"></i>'+esc(room.host_name||'K-Talk')+'</b><span>'+esc(room.title||room.room_name||'라이브')+' · '+esc(room.room_name||'방송')+'</span></div><div id="ktRemoteViewerCount" class="kt-remote-viewers">👁 1명</div></div><div id="ktRemoteLiveStatus" class="kt-remote-status">방송 영상 연결 중…</div></section>';
  }

  /* 원격 9명 방이 재연결 과정에서 두 번 붙는 경우 첫 방만 유지한다. */
  function dedupeRemoteGroupRooms(){
    var rooms=[].slice.call(document.querySelectorAll('.ktg13-room'));
    if(rooms.length>1){
      rooms.slice(1).forEach(function(room){
        try{room.remove();}catch(e){if(room.parentNode)room.parentNode.removeChild(room);}
      });
      return;
    }
    /* 일부 재연결 화면은 바깥 방 클래스 없이 내부 묶음만 두 번 붙는다. */
    ['.ktg13-head','.ktg13-led','.ktg13-stats','.ktg13-main','.ktg13-mid','.ktg13-gifts','.ktg13-tools'].forEach(function(sel){
      var parts=[].slice.call(document.querySelectorAll(sel));
      if(parts.length>1)parts.slice(1).forEach(function(part){
        try{part.remove();}catch(e){if(part.parentNode)part.parentNode.removeChild(part);}
      });
    });
  }

  var remoteRoomDedupeTimer=null;
  try{
    new MutationObserver(function(){
      clearTimeout(remoteRoomDedupeTimer);
      remoteRoomDedupeTimer=setTimeout(dedupeRemoteGroupRooms,0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(dedupeRemoteGroupRooms,250);

  async function remotePollRoom(){
    if(!viewerCtx)return;
    var c=viewerCtx;
    try{
      var rows=await req('ktalk_live_rooms?select=id,host_id,active,updated_at&host_id=eq.'+enc(c.hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=rows&&rows[0];
      if(!room||Date.now()-new Date(room.updated_at).getTime()>STALE_MS){showActivity('방송이 종료되었습니다.');if(viewerCtx===c){window.ktLeaveRemoteLive();}return;}
      await req('ktalk_live_viewers?host_id=eq.'+enc(c.hostId)+'&viewer_id=eq.'+enc(c.viewerId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});
      var cut=new Date(Date.now()-STALE_MS).toISOString();
      var viewers=await req('ktalk_live_viewers?select=viewer_id&host_id=eq.'+enc(c.hostId)+'&active=eq.true&updated_at=gte.'+enc(cut)+'&limit=300');
      var badge=document.getElementById('ktRemoteViewerCount');if(badge)badge.textContent='👁 '+Math.max(1,(viewers||[]).length)+'명';
    }catch(e){}
  }

  async function remotePollActivity(){
    if(!viewerCtx)return;
    try{
      var rows=await req('ktalk_live_messages?select=id,message,created_at&host_id=eq.'+enc(viewerCtx.hostId)+'&message_type=eq.system&order=created_at.desc&limit=5');
      if(rows&&rows.length){var n=rows[0];if(viewerCtx.lastMsg&&viewerCtx.lastMsg!==n.created_at)showActivity(n.message);viewerCtx.lastMsg=n.created_at;}
    }catch(e){}
  }

  async function remotePollSignal(){
    if(!viewerCtx||viewerCtx.answered)return;
    var c=viewerCtx;
    try{
      var rows=await req('ktalk_webrtc_sessions?select=id,offer_sdp,answer_sdp,active&id=eq.'+enc(c.sessionId)+'&limit=1');var x=rows&&rows[0];
      if(!x||!x.active){if(viewerCtx===c)window.ktLeaveRemoteLive();return;}
      if(x.offer_sdp&&x.offer_sdp!=='pending'){
        await c.pc.setRemoteDescription({type:'offer',sdp:x.offer_sdp});
        var answer=await c.pc.createAnswer();await c.pc.setLocalDescription(answer);await waitIce(c.pc,5000);
        await req('ktalk_webrtc_sessions?id=eq.'+enc(c.sessionId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({answer_sdp:c.pc.localDescription.sdp,updated_at:nowIso()})});
        c.answered=true;clearInterval(c.signalTimer);c.signalTimer=null;
      }
    }catch(e){}
  }

  window.ktEnterRemoteLive=async function(hostId){
    hostId=String(hostId||'');if(!hostId)return;
    if(hostId===deviceId()&&hostActive){showActivity('현재 내가 방송 중인 방입니다.');return;}
    if(viewerCtx)await window.ktLeaveRemoteLive(true);
    try{
      var rows=await req('ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=rows&&rows[0];if(!room||Date.now()-new Date(room.updated_at).getTime()>STALE_MS){alert('방송이 종료되었거나 연결할 수 없습니다.');renderLiveCards();return;}
      renderRemote(room);
      var p=profile(),monitorMode=false;
      try{monitorMode=!!(window.ktAdminMonitorModeEnabled&&window.ktAdminMonitorModeEnabled());}catch(e){}
      var viewerId=(monitorMode?'monitor_':'viewer_')+deviceId();
      var viewerName=monitorMode?'👑 관리자 모니터링':(p.name||'게스트');
      var viewerReady=await ensureViewerPresence(hostId,viewerId,viewerName);
      if(!viewerReady)throw new Error('viewer-presence');
      var sessionId=await createViewerSession(hostId,viewerId);
      if(!sessionId)throw new Error('session');
      var pc=new RTCPeerConnection(ICE);
      viewerCtx={hostId:hostId,viewerId:viewerId,viewerName:viewerName,monitorMode:monitorMode,sessionId:sessionId,pc:pc,answered:false,signalTimer:null,heartbeat:null,activityTimer:null,lastMsg:''};
      pc.ontrack=function(ev){var hs=ev.streams[0]||new MediaStream([ev.track]);window.__ktRemoteHostStream=hs;var v=document.getElementById('ktRemoteLiveVideo');if(v){v.srcObject=hs;v.play().catch(function(){});}try{if(ev.track){ev.track.onended=function(){if(viewerCtx&&viewerCtx.pc===pc)window.ktLeaveRemoteLive();};ev.track.onmute=function(){var tr=ev.track;setTimeout(function(){if(viewerCtx&&viewerCtx.pc===pc&&tr.muted)window.ktLeaveRemoteLive();},2500);};}}catch(e){}var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';};
      pc.onconnectionstatechange=function(){var st=document.getElementById('ktRemoteLiveStatus');if(pc.connectionState==='connected'){if(st)st.style.display='none';return;}if(pc.connectionState==='failed'||pc.connectionState==='disconnected'){if(st){st.style.display='block';st.textContent='영상 연결을 다시 확인해 주세요.';}setTimeout(function(){if(viewerCtx&&viewerCtx.pc===pc&&(pc.connectionState==='failed'||pc.connectionState==='disconnected'))window.ktLeaveRemoteLive();},2200);}};
      if(viewerCtx.monitorMode){
        await insertSystem(hostId,viewerId,viewerCtx.viewerName,'👑 관리자 모니터링이 시작되었습니다.');
        showActivity('👑 관리자 모니터링으로 입장했습니다.');
      }else{
        await insertSystem(hostId,viewerId,viewerCtx.viewerName,viewerCtx.viewerName+'님이 들어왔습니다.');
        showActivity(viewerCtx.viewerName+'님이 들어왔습니다.');
      }
      viewerCtx.signalTimer=setInterval(remotePollSignal,1100);remotePollSignal();
      viewerCtx.heartbeat=setInterval(remotePollRoom,1500);remotePollRoom();
      viewerCtx.activityTimer=setInterval(remotePollActivity,1800);remotePollActivity();
    }catch(e){document.documentElement.classList.remove('kt-remote-viewing');viewerCtx=null;alert('방송 영상 연결을 시작하지 못했습니다. 잠시 후 다시 눌러 주세요.');}
  };

  window.ktLeaveRemoteLive=async function(silent){
    var c=viewerCtx;viewerCtx=null;window.__ktRemoteHostStream=null;document.documentElement.classList.remove('kt-remote-viewing');
    if(c){
      clearInterval(c.signalTimer);clearInterval(c.heartbeat);clearInterval(c.activityTimer);try{c.pc.close();}catch(e){}
      try{await req('ktalk_live_viewers?host_id=eq.'+enc(c.hostId)+'&viewer_id=eq.'+enc(c.viewerId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      try{await req('ktalk_webrtc_sessions?id=eq.'+enc(c.sessionId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      if(c.monitorMode)await insertSystem(c.hostId,c.viewerId,c.viewerName,'👑 관리자 모니터링이 종료되었습니다.');
      else await insertSystem(c.hostId,c.viewerId,c.viewerName,c.viewerName+'님이 나갔습니다.');
    }
    if(!silent){if(window.openBroadcastList)window.openBroadcastList();else if(window.friends)window.friends();setTimeout(renderLiveCards,80);}
  };

  function wrap(name,before,after){
    var old=window[name];if(typeof old!=='function'||old.__ktLiveWrapped)return;
    var fn=function(){var args=arguments,self=this;if(before)try{before.apply(self,args);}catch(e){}var r=old.apply(self,args);if(r&&typeof r.then==='function')return r.then(function(v){if(after)try{after.apply(self,args);}catch(e){}return v;});if(after)try{after.apply(self,args);}catch(e){}return r;};fn.__ktLiveWrapped=true;window[name]=fn;
  }

  async function syncHostPresenceAfterStart(){
    var s=document.getElementById('screen');
    var opened=!!(s&&s.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
    if(opened){
      startHostPresence();
      return;
    }
    /* 시작이 중간에 멈췄으면 준비 화면의 카메라를 방송 중으로 등록하지 않는다. */
    var hostId=deviceId();
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{
        method:'PATCH',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });
    }catch(e){}
    renderLiveCards();
  }

  ensureStyle();
  wrap('startBroadcast',function(){hostEndLock=false;hostRunToken++;window.__ktHostEndLock=false;window.__ktHostEndLockHostId='';},function(){setTimeout(syncHostPresenceAfterStart,260);});
  wrap('friends',null,function(){setTimeout(renderLiveCards,60);});
  wrap('openDashboard',null,function(){setTimeout(renderLiveCards,60);});
  wrap('openBroadcastList',null,function(){setTimeout(renderLiveCards,60);});
  wrap('leaveBroadcastToDashboard',function(){stopHostPresence();});
  wrap('endBroadcastEarnings',function(){stopHostPresence();});

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back'):null;
    if(b&&hostActive)stopHostPresence();
  },true);

  window.addEventListener('pagehide',function(){
    if(hostActive){
      var body=JSON.stringify({active:false,updated_at:nowIso()});
      try{fetch(BASE+'ktalk_live_rooms?host_id=eq.'+enc(deviceId())+'&active=eq.true',{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:body,keepalive:true});}catch(e){}
    }
    if(viewerCtx){
      try{fetch(BASE+'ktalk_live_viewers?host_id=eq.'+enc(viewerCtx.hostId)+'&viewer_id=eq.'+enc(viewerCtx.viewerId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});}catch(e){}
    }
  });

  /* 휴대폰에서 홈 버튼/다른 앱으로 나가면 pagehide가 안 오는 브라우저가 있어
     시청자 쪽만 즉시 퇴장 처리한다. 호스트 방송은 건드리지 않는다. */
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden||!viewerCtx)return;
    var c=viewerCtx;
    try{
      fetch(BASE+'ktalk_live_viewers?host_id=eq.'+enc(c.hostId)+'&viewer_id=eq.'+enc(c.viewerId),{
        method:'PATCH',headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true
      });
    }catch(e){}
    try{
      fetch(BASE+'ktalk_webrtc_sessions?id=eq.'+enc(c.sessionId),{
        method:'PATCH',headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true
      });
    }catch(e){}
    try{
      if(String(c.viewerId||'').indexOf('viewer_')===0){
        fetch(BASE+'ktalk_webrtc_sessions?host_id=eq.'+enc(c.hostId)+'&viewer_id=eq.'+enc('guest:'+c.viewerId)+'&active=eq.true',{
          method:'PATCH',headers:headers({Prefer:'return=minimal'}),
          body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true
        });
      }
    }catch(e){}
    try{window.ktLeaveRemoteLive(true);}catch(e){}
  });

  setInterval(function(){
    if(document.querySelector('.kt-dashboard')||document.querySelector('.friends-list'))renderLiveCards();
  },5000);
  setTimeout(renderLiveCards,900);
})();
