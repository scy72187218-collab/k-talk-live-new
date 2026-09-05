/* K-Talk LIVE: viewer guest participation for multi-person rooms. Keeps approved room layout; fills only existing guest slots. */
(function(){
  if(window.__ktGuestParticipationLoaded)return;
  window.__ktGuestParticipationLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var rtcConfig={iceServers:[
    {urls:'stun:stun.l.google.com:19302'},
    {urls:'stun:stun1.l.google.com:19302'}
  ]};

  var viewerHostId='';
  var viewerRoomName='';
  var guestLocalStream=null;
  var guestPeer=null;
  var guestSessionId='';
  var guestPollTimer=null;
  var hostPollBusy=false;
  var hostGuestPeers={};
  var shownRequestId='';

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function viewerId(){
    var id='';
    try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}
    if(!id){id='viewer_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('ktalk_viewer_id',id);}catch(e){}}
    return id;
  }
  function person(){
    var id=viewerId(),name='게스트';
    try{
      name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||name;
    }catch(e){}
    try{
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub&&window.ktSubAccountInfo){var si=ktSubAccountInfo(sub);if(si&&si.name)name=si.name;}
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
    }catch(e){}
    if(!name||name==='K-Talk')name='게스트 '+id.slice(-4);
    return {id:String(id).slice(0,80),name:String(name).slice(0,80)};
  }
  function hostWho(){
    var id='guest',name='K-Talk';
    try{id=state.profileId||state.currentAccountId||state.accountId||id;name=state.profileName||state.currentProfileName||state.accountName||name;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;}catch(e){}
    return {id:String(id).slice(0,80),name:String(name).slice(0,80)};
  }
  function isMultiRoomName(name){
    name=String(name||'');
    if(!name)return true;
    return name.indexOf('13명')>-1||name.indexOf('구독자')>-1||name.indexOf('비밀')>-1||name.indexOf('게스트')>-1;
  }
  function hostRoomAllowsGuests(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      if(t==='solo')return false;
      return !!document.getElementById('ktSept2Live');
    }catch(e){return false;}
  }
  function waitIce(pc,timeout){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete'){resolve();return;}
      var done=false;
      function finish(){if(done)return;done=true;try{pc.removeEventListener('icegatheringstatechange',change);}catch(e){}resolve();}
      function change(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',change);
      setTimeout(finish,timeout||3500);
    });
  }

  function buttonText(text,busy){
    var b=document.getElementById('ktGuestJoinBtn');
    if(!b)return;
    b.textContent=text;
    b.style.opacity=busy?'.75':'1';
  }
  function ensureViewerButton(){
    var remote=document.getElementById('ktRemoteLive');
    if(!remote||!isMultiRoomName(viewerRoomName)){
      var old=document.getElementById('ktGuestJoinBtn');if(old)old.remove();
      return;
    }
    var section=remote.closest('section');
    if(!section||document.getElementById('ktGuestJoinBtn'))return;
    var b=document.createElement('button');
    b.id='ktGuestJoinBtn';b.type='button';b.textContent='🙋 게스트 참여';
    b.style.cssText='position:absolute;right:12px;bottom:28px;z-index:12;min-height:44px;padding:0 16px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:linear-gradient(135deg,#ff315f,#a94dff);color:#fff;font-family:inherit;font-size:14px;font-weight:950;box-shadow:0 5px 18px #0008;touch-action:manipulation';
    b.onclick=function(){
      if(guestSessionId)endGuestParticipation(true);
      else requestGuestParticipation();
    };
    section.appendChild(b);
  }

  async function inferViewerHost(){
    if(viewerHostId||!document.getElementById('ktRemoteLive'))return;
    try{
      var since=new Date(Date.now()-180000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=host_id,room_name&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=1';
      var r=await fetch(u,{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json(),x=rows&&rows[0];
      if(x){viewerHostId=String(x.host_id||'guest');viewerRoomName=String(x.room_name||viewerRoomName||'');ensureViewerButton();}
    }catch(e){}
  }

  async function requestGuestParticipation(){
    if(!viewerHostId){await inferViewerHost();}
    if(!viewerHostId){buttonText('방송을 다시 들어가 주세요');return;}
    if(!isMultiRoomName(viewerRoomName)){buttonText('이 방은 게스트 참여가 없습니다');return;}
    buttonText('카메라 연결 중...',true);
    try{
      guestLocalStream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:'user',width:{ideal:720},height:{ideal:1280},frameRate:{ideal:24,max:30}},
        audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}
      });
    }catch(e){
      buttonText('카메라·마이크 허용 필요');
      return;
    }

    var pc=new RTCPeerConnection(rtcConfig);
    guestPeer=pc;
    try{
      guestLocalStream.getTracks().forEach(function(t){pc.addTrack(t,guestLocalStream);});
      pc.onconnectionstatechange=function(){
        if(pc.connectionState==='connected')buttonText('✓ 게스트 참여 중');
        else if(pc.connectionState==='failed'||pc.connectionState==='disconnected')buttonText('연결 끊김 · 다시 참여');
      };
      var offer=await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitIce(pc,3500);
      var me=person();
      var body={host_id:String(viewerHostId),guest_id:me.id,guest_name:me.name,offer_sdp:JSON.stringify(pc.localDescription),status:'requested',active:true,updated_at:new Date().toISOString()};
      var r=await fetch(SB+'/rest/v1/ktalk_guest_sessions',{
        method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify(body)
      });
      if(!r.ok)throw new Error('request');
      var rows=await r.json();
      guestSessionId=rows&&rows[0]&&rows[0].id?String(rows[0].id):'';
      if(!guestSessionId)throw new Error('no id');
      buttonText('요청 보냄 · 취소');
      pollGuestAnswer();
      clearInterval(guestPollTimer);
      guestPollTimer=setInterval(pollGuestAnswer,700);
    }catch(e){
      await endGuestParticipation(false);
      buttonText('게스트 참여 다시 누르기');
    }
  }

  async function pollGuestAnswer(){
    if(!guestSessionId||!guestPeer)return;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_guest_sessions?select=answer_sdp,status,active&id=eq.'+encodeURIComponent(guestSessionId)+'&limit=1',{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json(),x=rows&&rows[0];if(!x)return;
      if(x.status==='accepted'&&x.answer_sdp&&!guestPeer.currentRemoteDescription){
        await guestPeer.setRemoteDescription(JSON.parse(x.answer_sdp));
        buttonText('✓ 게스트 참여 중');
      }else if(x.status==='rejected'||x.active===false){
        var rejected=x.status==='rejected';
        await endGuestParticipation(false);
        buttonText(rejected?'호스트가 참여를 받지 않았습니다':'🙋 게스트 참여');
        if(rejected)setTimeout(function(){buttonText('🙋 게스트 참여');},2200);
      }
    }catch(e){}
  }

  async function endGuestParticipation(markServer){
    clearInterval(guestPollTimer);guestPollTimer=null;
    var id=guestSessionId;guestSessionId='';
    if(markServer&&id){
      try{await fetch(SB+'/rest/v1/ktalk_guest_sessions?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,status:'ended',updated_at:new Date().toISOString()})});}catch(e){}
    }
    if(guestPeer){try{guestPeer.close();}catch(e){}guestPeer=null;}
    if(guestLocalStream){try{guestLocalStream.getTracks().forEach(function(t){t.stop();});}catch(e){}guestLocalStream=null;}
    buttonText('🙋 게스트 참여');
  }
  window.ktEndGuestParticipation=function(){return endGuestParticipation(true);};

  function findFreeSlot(){
    var a=[].slice.call(document.querySelectorAll('#ktGroup13GuestGrid .kt-group13-guest'));
    var b=[].slice.call(document.querySelectorAll('#ktPasswordGuestGrid .guest'));
    var c=[].slice.call(document.querySelectorAll('#ktSept2Live .kt-live-guests button'));
    var slots=a.length?a:(b.length?b:c);
    return slots.find(function(s){return !s.dataset.guestSession;})||null;
  }
  function releaseSlot(id){
    var slot=document.querySelector('[data-guest-session="'+String(id).replace(/"/g,'')+'"]');
    if(!slot)return;
    var kind=slot.dataset.guestSlotKind||'';
    slot.removeAttribute('data-guest-session');
    slot.removeAttribute('data-guest-slot-kind');
    slot.style.position='';slot.style.overflow='';slot.style.padding='';
    if(kind==='group13')slot.textContent='게스트';
    else if(kind==='password')slot.innerHTML='<b>＋</b><small>초대</small>';
    else slot.innerHTML='<span>🙂</span><small>게스트</small>';
  }
  function displayGuest(row,stream){
    var existing=document.querySelector('[data-guest-session="'+String(row.id).replace(/"/g,'')+'"]');
    var slot=existing||findFreeSlot();
    if(!slot)return false;
    var kind=slot.classList.contains('kt-group13-guest')?'group13':(slot.classList.contains('guest')?'password':'strip');
    slot.dataset.guestSession=String(row.id);slot.dataset.guestSlotKind=kind;
    slot.style.position='relative';slot.style.overflow='hidden';slot.style.padding='0';
    slot.innerHTML='<video autoplay playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111;transform:scaleX(-1)"></video>'
      +'<small style="position:absolute;left:3px;right:3px;bottom:3px;z-index:2;padding:2px 4px;border-radius:6px;background:#000a;color:#fff;font-size:8px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(row.guest_name||'게스트')+'</small>';
    var v=slot.querySelector('video');if(v){v.srcObject=stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}
    return true;
  }

  function requestBox(row){
    var section=document.getElementById('ktSept2Live');if(!section)return;
    var old=document.getElementById('ktGuestRequestBox');
    if(old&&shownRequestId===String(row.id))return;
    if(old)old.remove();
    shownRequestId=String(row.id);
    var d=document.createElement('div');d.id='ktGuestRequestBox';
    d.style.cssText='position:absolute;right:8px;top:148px;z-index:60;width:min(210px,54vw);padding:8px;border:1px solid #ff6eb7;border-radius:12px;background:rgba(12,9,16,.94);color:#fff;box-shadow:0 5px 20px #000b;font-family:inherit';
    d.innerHTML='<b style="display:block;font-size:12px;color:#ff8bc6">🙋 게스트 참여 요청</b><span style="display:block;margin:4px 0 7px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(row.guest_name||'게스트')+'</span>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px"><button id="ktGuestAccept" type="button" style="height:32px;border:0;border-radius:9px;background:#ff315f;color:#fff;font-weight:900">수락</button><button id="ktGuestReject" type="button" style="height:32px;border:0;border-radius:9px;background:#303038;color:#fff;font-weight:900">거절</button></div>';
    section.appendChild(d);
    d.querySelector('#ktGuestAccept').onclick=function(){acceptGuest(row);};
    d.querySelector('#ktGuestReject').onclick=function(){rejectGuest(row.id);};
  }
  function clearRequestBox(id){
    var d=document.getElementById('ktGuestRequestBox');
    if(d&&(!id||shownRequestId===String(id)))d.remove();
    if(!id||shownRequestId===String(id))shownRequestId='';
  }

  async function rejectGuest(id){
    clearRequestBox(id);
    try{await fetch(SB+'/rest/v1/ktalk_guest_sessions?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({status:'rejected',active:false,updated_at:new Date().toISOString()})});}catch(e){}
  }

  async function acceptGuest(row){
    if(!row||!row.id||hostGuestPeers[row.id])return;
    if(!findFreeSlot()){
      clearRequestBox(row.id);
      try{alert('게스트 자리가 모두 찼습니다.');}catch(e){}
      await rejectGuest(row.id);return;
    }
    clearRequestBox(row.id);
    var pc=new RTCPeerConnection(rtcConfig);hostGuestPeers[row.id]=pc;
    var remote=new MediaStream();
    pc.ontrack=function(ev){
      var s=ev.streams&&ev.streams[0];
      if(s)remote=s;else if(ev.track&&!remote.getTracks().some(function(t){return t.id===ev.track.id;}))remote.addTrack(ev.track);
      displayGuest(row,remote);
    };
    pc.onconnectionstatechange=function(){
      var s=pc.connectionState;
      if(s==='failed'||s==='closed'||s==='disconnected'){
        releaseSlot(row.id);
        try{pc.close();}catch(e){}
        delete hostGuestPeers[row.id];
        fetch(SB+'/rest/v1/ktalk_guest_sessions?id=eq.'+encodeURIComponent(row.id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,status:'ended',updated_at:new Date().toISOString()})}).catch(function(){});
      }
    };
    try{
      await pc.setRemoteDescription(JSON.parse(row.offer_sdp));
      var answer=await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitIce(pc,3500);
      var r=await fetch(SB+'/rest/v1/ktalk_guest_sessions?id=eq.'+encodeURIComponent(row.id),{
        method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({answer_sdp:JSON.stringify(pc.localDescription),status:'accepted',active:true,updated_at:new Date().toISOString()})
      });
      if(!r.ok)throw new Error('answer');
    }catch(e){
      try{pc.close();}catch(_e){}delete hostGuestPeers[row.id];releaseSlot(row.id);await rejectGuest(row.id);
    }
  }

  async function scanHostRequests(){
    if(hostPollBusy||!hostRoomAllowsGuests())return;
    hostPollBusy=true;
    try{
      var me=hostWho();
      var since=new Date(Date.now()-180000).toISOString();
      var u=SB+'/rest/v1/ktalk_guest_sessions?select=id,host_id,guest_id,guest_name,offer_sdp,status,active,created_at&host_id=eq.'+encodeURIComponent(me.id)+'&status=eq.requested&active=eq.true&created_at=gte.'+encodeURIComponent(since)+'&order=created_at.asc&limit=6';
      var r=await fetch(u,{headers:headers()});
      if(r.ok){
        var rows=await r.json();
        if(rows&&rows.length)requestBox(rows[0]);
        else clearRequestBox();
      }
    }catch(e){}
    hostPollBusy=false;
  }

  function cleanupHostPeers(){
    Object.keys(hostGuestPeers).forEach(function(id){try{hostGuestPeers[id].close();}catch(e){}releaseSlot(id);});
    hostGuestPeers={};clearRequestBox();
  }

  function wrapJoin(){
    var old=window.ktJoinLive;
    if(typeof old!=='function'||old.__ktGuestCaptureWrapped)return;
    var wrapped=async function(hostId,title,roomName){
      await endGuestParticipation(true);
      viewerHostId=String(hostId||'guest');viewerRoomName=String(roomName||'');
      var out=await old.apply(this,arguments);
      setTimeout(ensureViewerButton,80);setTimeout(ensureViewerButton,500);
      return out;
    };
    wrapped.__ktGuestCaptureWrapped=true;wrapped.__ktOriginal=old;window.ktJoinLive=wrapped;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktGuestLeaveWrapped)return;
    var wrapped=async function(){await endGuestParticipation(true);viewerHostId='';viewerRoomName='';return old.apply(this,arguments);};
    wrapped.__ktGuestLeaveWrapped=true;wrapped.__ktOriginal=old;window.ktLeaveRemoteLive=wrapped;
  }

  function sync(){
    wrapJoin();wrapLeave();ensureViewerButton();
    if(document.getElementById('ktRemoteLive')&&!viewerHostId)inferViewerHost();
    if(hostRoomAllowsGuests())scanHostRequests();
    else if(!document.getElementById('ktSept2Live')&&Object.keys(hostGuestPeers).length)cleanupHostPeers();
  }

  try{new MutationObserver(function(){setTimeout(sync,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(sync,250);setInterval(sync,800);
  window.addEventListener('pagehide',function(){endGuestParticipation(true);cleanupHostPeers();});
})();
