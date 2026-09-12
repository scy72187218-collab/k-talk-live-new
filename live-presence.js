/* K-Talk LIVE 실시간 방송 표시 전용: 방송중 빨간불, 방송목록, 입퇴장 알림, 다른 기기 영상 연결. 기존 방 UI는 건드리지 않음. */
(function(){
  if(window.__ktLivePresenceInstalled)return;
  window.__ktLivePresenceInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var STALE_MS=50000;
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var hostActive=false,hostRoomId='',hostHeartbeat=null,hostSignalTimer=null,hostActivityTimer=null;
  var hostStartPending=false;
  var hostPeers={};
  var viewerCtx=null;
  var lastActivityStamp='';

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};
    opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('live api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();
    return t?JSON.parse(t):null;
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
  function hasOpenedBroadcastRoom(){
    try{return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');}catch(e){return false;}
  }

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
      return Array.isArray(rows)?rows:[];
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
        if(lastActivityStamp&&newest.created_at!==lastActivityStamp)showActivity(newest.message);
        lastActivityStamp=newest.created_at;
      }
    }catch(e){}
  }

  async function startHostPresence(){
    if(hostActive||hostStartPending||!hasLiveLocalVideo())return;
    hostStartPending=true;
    var p=profile(),r=currentRoom(),hostId=deviceId(),stamp=nowIso();
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
      var rows=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      hostRoomId=rows&&rows[0]?rows[0].id:'';hostActive=true;lastActivityStamp='';
      showActivity('🔴 방송이 시작되었습니다. 방송목록에 표시됩니다.');
      clearInterval(hostHeartbeat);clearInterval(hostSignalTimer);clearInterval(hostActivityTimer);
      hostHeartbeat=setInterval(async function(){if(!hostActive||!hostRoomId)return;try{await req('ktalk_live_rooms?id=eq.'+enc(hostRoomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});}catch(e){}},12000);
      hostSignalTimer=setInterval(hostProcessSignals,1400);hostProcessSignals();
      hostActivityTimer=setInterval(hostPollActivity,1800);hostPollActivity();
      renderLiveCards();
    }catch(e){hostActive=false;hostRoomId='';}
    finally{hostStartPending=false;}
  }
  window.ktStartHostPresence=startHostPresence;

  function recoverHostPresence(){
    if(hostActive||hostStartPending)return;
    if(!hasOpenedBroadcastRoom()||!hasLiveLocalVideo())return;
    startHostPresence();
  }

  async function stopHostPresence(){
    if(!hostActive&&!hostRoomId)return;
    var hostId=deviceId(),roomId=hostRoomId;hostActive=false;hostRoomId='';
    clearInterval(hostHeartbeat);clearInterval(hostSignalTimer);clearInterval(hostActivityTimer);hostHeartbeat=hostSignalTimer=hostActivityTimer=null;
    Object.keys(hostPeers).forEach(function(k){try{hostPeers[k].pc.close();}catch(e){}});hostPeers={};
    try{if(roomId)await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});else await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
    try{await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
    renderLiveCards();
  }
  window.ktStopHostPresence=stopHostPresence;

  function renderRemote(room){
    ensureStyle();document.documentElement.classList.add('kt-remote-viewing');
    var s=document.getElementById('screen');if(!s)return;
    s.innerHTML='<section class="kt-remote-live"><video id="ktRemoteLiveVideo" autoplay playsinline></video><div class="kt-remote-shade"></div><div class="kt-remote-top"><button class="kt-remote-back" onclick="ktLeaveRemoteLive()">‹</button><div class="kt-remote-meta"><b><i class="kt-live-dot"></i>'+esc(room.host_name||'K-Talk')+'</b><span>'+esc(room.title||room.room_name||'라이브')+' · '+esc(room.room_name||'방송')+'</span></div><div id="ktRemoteViewerCount" class="kt-remote-viewers">👁 1명</div></div><div id="ktRemoteLiveStatus" class="kt-remote-status">방송 영상 연결 중…</div></section>';
  }

  async function remotePollRoom(){
    if(!viewerCtx)return;
    var c=viewerCtx;
    try{
      var rows=await req('ktalk_live_rooms?select=id,host_id,active,updated_at&host_id=eq.'+enc(c.hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=rows&&rows[0];
      if(!room||Date.now()-new Date(room.updated_at).getTime()>STALE_MS){showActivity('방송이 종료되었습니다.');setTimeout(function(){window.ktLeaveRemoteLive();},700);return;}
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
      if(!x||!x.active)return;
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
      var p=profile(),viewerId='viewer_'+deviceId();
      await req('ktalk_live_viewers?on_conflict=host_id,viewer_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({host_id:hostId,viewer_id:viewerId,viewer_name:p.name||'게스트',active:true,updated_at:nowIso()})});
      await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(viewerId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});
      var sessions=await req('ktalk_webrtc_sessions',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,viewer_id:viewerId,offer_sdp:'pending',answer_sdp:null,active:true,updated_at:nowIso()})});
      var sessionId=sessions&&sessions[0]?sessions[0].id:'';if(!sessionId)throw new Error('session');
      var pc=new RTCPeerConnection(ICE);
      viewerCtx={hostId:hostId,viewerId:viewerId,viewerName:p.name||'게스트',sessionId:sessionId,pc:pc,answered:false,signalTimer:null,heartbeat:null,activityTimer:null,lastMsg:''};
      pc.ontrack=function(ev){var v=document.getElementById('ktRemoteLiveVideo');if(v){v.srcObject=ev.streams[0]||new MediaStream([ev.track]);v.play().catch(function(){});}var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';};
      pc.onconnectionstatechange=function(){var st=document.getElementById('ktRemoteLiveStatus');if(!st)return;if(pc.connectionState==='connected')st.style.display='none';else if(pc.connectionState==='failed'||pc.connectionState==='disconnected'){st.style.display='block';st.textContent='영상 연결을 다시 확인해 주세요.';}};
      await insertSystem(hostId,viewerId,viewerCtx.viewerName,viewerCtx.viewerName+'님이 들어왔습니다.');showActivity(viewerCtx.viewerName+'님이 들어왔습니다.');
      viewerCtx.signalTimer=setInterval(remotePollSignal,1100);remotePollSignal();
      viewerCtx.heartbeat=setInterval(remotePollRoom,10000);remotePollRoom();
      viewerCtx.activityTimer=setInterval(remotePollActivity,1800);remotePollActivity();
    }catch(e){document.documentElement.classList.remove('kt-remote-viewing');viewerCtx=null;alert('방송 영상 연결을 시작하지 못했습니다. 잠시 후 다시 눌러 주세요.');}
  };

  window.ktLeaveRemoteLive=async function(silent){
    var c=viewerCtx;viewerCtx=null;document.documentElement.classList.remove('kt-remote-viewing');
    if(c){
      clearInterval(c.signalTimer);clearInterval(c.heartbeat);clearInterval(c.activityTimer);try{c.pc.close();}catch(e){}
      try{await req('ktalk_live_viewers?host_id=eq.'+enc(c.hostId)+'&viewer_id=eq.'+enc(c.viewerId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      try{await req('ktalk_webrtc_sessions?id=eq.'+enc(c.sessionId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
      await insertSystem(c.hostId,c.viewerId,c.viewerName,c.viewerName+'님이 나갔습니다.');
    }
    if(!silent){if(window.openBroadcastList)window.openBroadcastList();else if(window.friends)window.friends();setTimeout(renderLiveCards,80);}
  };

  function wrap(name,before,after){
    var old=window[name];if(typeof old!=='function'||old.__ktLiveWrapped)return;
    var fn=function(){var args=arguments,self=this;if(before)try{before.apply(self,args);}catch(e){}var r=old.apply(self,args);if(r&&typeof r.then==='function')return r.then(function(v){if(after)try{after.apply(self,args);}catch(e){}return v;});if(after)try{after.apply(self,args);}catch(e){}return r;};fn.__ktLiveWrapped=true;window[name]=fn;
  }

  ensureStyle();
  wrap('startBroadcast',null,function(){setTimeout(startHostPresence,260);});
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

  var hostPresenceObserver=new MutationObserver(function(){setTimeout(recoverHostPresence,40);});
  try{hostPresenceObserver.observe(document.body,{childList:true,subtree:true});}catch(e){}

  setInterval(function(){
    recoverHostPresence();
    if(document.querySelector('.kt-dashboard')||document.querySelector('.friends-list'))renderLiveCards();
  },1200);
  setTimeout(function(){recoverHostPresence();renderLiveCards();},900);
})();
