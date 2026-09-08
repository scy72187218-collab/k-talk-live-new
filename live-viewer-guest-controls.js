/* K-Talk LIVE: 현재 13명방 시청자용 채팅/참여 + 호스트 승인/게스트 슬롯 연결만 추가. 기존 방송/방 UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveViewerGuestControlsInstalled)return;
  window.__ktLiveViewerGuestControlsInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var viewerHostId='';
  var viewerRoom=null;
  var viewerGuestStream=null;
  var viewerGuestPc=null;
  var viewerGuestSessionId='';
  var viewerAnswerApplied=false;
  var viewerPollBusy=false;
  var hostPollBusy=false;
  var hostRequestCache={};
  var hostPeers={};
  var spokenMessages={};
  var speechStartedAt=Date.now();
  var liveBadgeBusy=false;
  var lastChatSend=0;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function nowIso(){return new Date().toISOString();}
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete'){resolve();return;}
      var done=false,t=setTimeout(finish,ms||4000);
      function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',change);}catch(e){}resolve();}
      function change(){if(pc.iceGatheringState==='complete')finish();}
      try{pc.addEventListener('icegatheringstatechange',change);}catch(e){finish();}
    });
  }
  function viewerDeviceId(){
    var id='';
    try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}
    if(!id){id='viewer_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('ktalk_viewer_id',id);}catch(e){}}
    return id;
  }
  function viewerPerson(){
    var id=viewerDeviceId(),name='게스트 '+id.slice(-4);
    try{name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||name;}catch(e){}
    try{
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub&&window.ktSubAccountInfo){var si=window.ktSubAccountInfo(sub);if(si&&si.name)name=si.name;}
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    if(!name||name==='K-Talk')name='게스트 '+viewerDeviceId().slice(-4);
    return {id:String(id).slice(0,80),name:String(name).slice(0,80)};
  }
  function hostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'').slice(0,100);}catch(e){return '';}
  }
  function isGroup13Host(){return !!document.querySelector('.ktg13-room');}
  function isRemoteViewer(){return !!document.querySelector('.kt-remote-live');}
  function isMultiRoom(room){
    room=room||viewerRoom||{};
    var t=String(room.room_type||''),n=String(room.room_name||'');
    return t==='group'||t==='group13'||t==='subscriber'||t==='password'||n.indexOf('13명')>-1||n.indexOf('구독자')>-1||n.indexOf('비밀')>-1;
  }

  async function api(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(SB+'/rest/v1/'+path,opt);
    if(!r.ok)throw new Error('api '+r.status);
    if(r.status===204)return null;
    var txt=await r.text();return txt?JSON.parse(txt):null;
  }

  function installStyle(){
    if(document.getElementById('ktViewerGuestControlsStyle'))return;
    var s=document.createElement('style');s.id='ktViewerGuestControlsStyle';
    s.textContent=''
      +'.kt-remote-live #ktViewerLiveTools{position:absolute;z-index:30;left:8px;right:8px;bottom:10px;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;pointer-events:auto}'
      +'.kt-remote-live #ktViewerChatLog{max-height:116px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:3px;margin:0 0 6px;padding:0 2px}'
      +'.kt-viewer-chat-line{align-self:flex-start;max-width:88%;padding:4px 7px;border-radius:9px;background:rgba(0,0,0,.58);color:#fff;font-size:10.5px;font-weight:800;line-height:1.25;text-shadow:0 1px 2px #000;word-break:break-word}'
      +'.kt-viewer-chat-line b{color:#ff87c1;margin-right:5px}.kt-viewer-chat-line.system{color:#ffe9a8;background:rgba(25,18,12,.62)}'
      +'.kt-remote-live #ktViewerChatRow{display:grid;grid-template-columns:minmax(0,1fr) 52px 72px;gap:5px;align-items:center}'
      +'.kt-remote-live #ktViewerChatInput{min-width:0;height:39px;padding:0 11px;border:1px solid rgba(255,255,255,.28);border-radius:999px;outline:0;background:rgba(0,0,0,.72);color:#fff;font-size:12px;font-weight:800}'
      +'.kt-remote-live #ktViewerChatSend,.kt-remote-live #ktViewerGuestJoin{height:39px;border:0;border-radius:999px;color:#fff;font-size:11px;font-weight:950;touch-action:manipulation}'
      +'.kt-remote-live #ktViewerChatSend{background:#26262d}.kt-remote-live #ktViewerGuestJoin{background:linear-gradient(135deg,#ff315f,#9b4dff);box-shadow:0 3px 12px #0008}'
      +'#ktHostGuestRequest{position:fixed;z-index:99999;right:8px;bottom:64px;width:min(280px,74vw);padding:9px;border:1px solid #ffbf4d88;border-radius:14px;background:rgba(10,10,14,.94);color:#fff;box-shadow:0 5px 18px #000b;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'#ktHostGuestRequest b{display:block;font-size:12px;color:#ffe071;margin-bottom:7px}#ktHostGuestRequest .kt-request-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px}'
      +'#ktHostGuestRequest button{height:34px;border:0;border-radius:10px;color:#fff;font-size:11px;font-weight:950}#ktHostGuestAccept{background:linear-gradient(135deg,#ff315f,#9b4dff)}#ktHostGuestReject{background:#2b2b31}'
      +'.ktg13-guest.ktg13-guest-live{position:relative!important;overflow:hidden!important;background:#050506!important}.ktg13-guest.ktg13-guest-live video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:scaleX(-1)!important;background:#050506!important}.ktg13-guest .kt-guest-live-name{position:absolute;z-index:4;left:3px;bottom:3px;padding:2px 5px;border-radius:7px;background:#000a;color:#fff;font-size:8px;font-weight:900}'
      +'#ktLiveWatchBadge{position:fixed;z-index:9998;left:10px;top:64px;height:34px;padding:0 11px;border:1px solid #ff315f99;border-radius:999px;background:rgba(191,17,48,.94);color:#fff;font-size:11px;font-weight:950;box-shadow:0 0 12px #ff315f66;touch-action:manipulation}'
      +'@media(max-width:390px){.kt-remote-live #ktViewerChatRow{grid-template-columns:minmax(0,1fr) 48px 66px}.kt-remote-live #ktViewerChatInput{font-size:11px}.kt-remote-live #ktViewerChatSend,.kt-remote-live #ktViewerGuestJoin{font-size:10px}}';
    document.head.appendChild(s);
  }

  async function resolveViewerRoom(){
    if(viewerHostId&&viewerRoom&&String(viewerRoom.host_id)===String(viewerHostId))return viewerRoom;
    try{
      var rows;
      if(viewerHostId){
        rows=await api('ktalk_live_rooms?select=host_id,host_name,title,room_type,room_name,active,updated_at&host_id=eq.'+encodeURIComponent(viewerHostId)+'&active=eq.true&order=updated_at.desc&limit=1');
      }else{
        var cut=new Date(Date.now()-70000).toISOString();
        rows=await api('ktalk_live_rooms?select=host_id,host_name,title,room_type,room_name,active,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(cut)+'&order=updated_at.desc&limit=10');
        if(rows&&rows.length){
          var title='';try{title=(document.querySelector('.kt-remote-meta b')||{}).textContent||'';}catch(e){}
          var match=title&&rows.find(function(x){return title.indexOf(String(x.host_name||''))>-1;});
          rows=[match||rows[0]];
        }
      }
      if(rows&&rows[0]){viewerRoom=rows[0];viewerHostId=String(rows[0].host_id||viewerHostId||'');return viewerRoom;}
    }catch(e){}
    return viewerRoom;
  }

  function ensureViewerControls(){
    installStyle();
    var root=document.querySelector('.kt-remote-live');
    if(!root)return null;
    var tools=document.getElementById('ktViewerLiveTools');
    if(!tools){
      tools=document.createElement('div');tools.id='ktViewerLiveTools';
      tools.innerHTML='<div id="ktViewerChatLog"><div class="kt-viewer-chat-line system">입장했습니다. 아래에서 채팅하거나 참여를 요청할 수 있습니다.</div></div>'
        +'<div id="ktViewerChatRow"><input id="ktViewerChatInput" maxlength="300" autocomplete="off" placeholder="채팅 입력"><button id="ktViewerChatSend" type="button">전송</button><button id="ktViewerGuestJoin" type="button">🙋 참여</button></div>';
      root.appendChild(tools);
      tools.querySelector('#ktViewerChatSend').onclick=sendViewerChat;
      tools.querySelector('#ktViewerChatInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();sendViewerChat();}});
      tools.querySelector('#ktViewerGuestJoin').onclick=function(){if(viewerGuestSessionId)leaveGuestParticipation(true);else requestGuestParticipation();};
    }
    resolveViewerRoom().then(function(room){
      var b=document.getElementById('ktViewerGuestJoin');if(b)b.style.display=isMultiRoom(room)?'block':'none';
    });
    return tools;
  }

  async function sendViewerChat(){
    if(Date.now()-lastChatSend<500)return;
    var input=document.getElementById('ktViewerChatInput');if(!input)return;
    var text=String(input.value||'').trim();if(!text)return;
    lastChatSend=Date.now();
    await resolveViewerRoom();if(!viewerHostId)return;
    var p=viewerPerson();input.value='';
    try{
      await api('ktalk_live_messages',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({host_id:viewerHostId,sender_id:p.id,sender_name:p.name,message:text,message_type:'chat'})});
      pollViewerMessages();
    }catch(e){input.value=text;}
  }

  function renderViewerMessages(rows){
    var log=document.getElementById('ktViewerChatLog');if(!log)return;
    var html=(rows||[]).slice(-8).map(function(x){
      if(String(x.message_type||'')==='system')return '<div class="kt-viewer-chat-line system">'+esc(x.message||'')+'</div>';
      return '<div class="kt-viewer-chat-line"><b>'+esc(x.sender_name||'게스트')+'</b>'+esc(x.message||'')+'</div>';
    }).join('');
    if(html)log.innerHTML=html;
  }
  async function pollViewerMessages(){
    if(!isRemoteViewer())return;
    await resolveViewerRoom();if(!viewerHostId)return;
    try{
      var cut=new Date(Date.now()-3600000).toISOString();
      var rows=await api('ktalk_live_messages?select=id,sender_name,message,message_type,created_at&host_id=eq.'+encodeURIComponent(viewerHostId)+'&created_at=gte.'+encodeURIComponent(cut)+'&order=created_at.asc&limit=40');
      renderViewerMessages(rows||[]);
    }catch(e){}
  }

  function guestButton(text,busy){
    var b=document.getElementById('ktViewerGuestJoin');if(!b)return;
    b.textContent=text;b.disabled=!!busy;b.style.opacity=busy?'.72':'1';
  }
  async function requestGuestParticipation(){
    if(viewerPollBusy)return;
    viewerPollBusy=true;
    try{
      var room=await resolveViewerRoom();
      if(!viewerHostId||!isMultiRoom(room)){guestButton('참여 불가',false);return;}
      guestButton('카메라…',true);
      try{
        viewerGuestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:960},frameRate:{ideal:24,max:30}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      }catch(e){guestButton('권한 필요',false);return;}
      var pc=new RTCPeerConnection(ICE);viewerGuestPc=pc;viewerAnswerApplied=false;
      viewerGuestStream.getTracks().forEach(function(t){pc.addTrack(t,viewerGuestStream);});
      pc.onconnectionstatechange=function(){
        if(pc.connectionState==='connected')guestButton('✓ 참여 중',false);
        else if(pc.connectionState==='failed')guestButton('다시 참여',false);
      };
      var offer=await pc.createOffer();await pc.setLocalDescription(offer);await waitIce(pc,4000);
      var p=viewerPerson();
      var rows=await api('ktalk_guest_sessions',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify({host_id:viewerHostId,guest_id:p.id,guest_name:p.name,offer_sdp:JSON.stringify(pc.localDescription),status:'requested',active:true,created_at:nowIso(),updated_at:nowIso()})});
      viewerGuestSessionId=rows&&rows[0]?String(rows[0].id||''):'';
      if(!viewerGuestSessionId)throw new Error('no session');
      guestButton('요청 보냄',false);
    }catch(e){await leaveGuestParticipation(false);guestButton('🙋 참여',false);}
    finally{viewerPollBusy=false;}
  }

  async function pollViewerGuestAnswer(){
    if(!viewerGuestSessionId||!viewerGuestPc)return;
    try{
      var rows=await api('ktalk_guest_sessions?select=id,answer_sdp,status,active&id=eq.'+encodeURIComponent(viewerGuestSessionId)+'&limit=1');
      var x=rows&&rows[0];if(!x)return;
      if((x.status==='rejected'||x.active===false)&&x.status!=='accepted'){
        await leaveGuestParticipation(false);guestButton('참여 거절됨',false);setTimeout(function(){if(!viewerGuestSessionId)guestButton('🙋 참여',false);},1600);return;
      }
      if(x.status==='accepted'&&x.answer_sdp&&!viewerAnswerApplied){
        viewerAnswerApplied=true;
        await viewerGuestPc.setRemoteDescription(new RTCSessionDescription(JSON.parse(x.answer_sdp)));
        guestButton('✓ 참여 중',false);
      }
    }catch(e){}
  }

  async function leaveGuestParticipation(update){
    var sid=viewerGuestSessionId;viewerGuestSessionId='';viewerAnswerApplied=false;
    try{if(viewerGuestPc)viewerGuestPc.close();}catch(e){}viewerGuestPc=null;
    try{if(viewerGuestStream)viewerGuestStream.getTracks().forEach(function(t){t.stop();});}catch(e){}viewerGuestStream=null;
    if(update&&sid){try{await api('ktalk_guest_sessions?id=eq.'+encodeURIComponent(sid),{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({status:'left',active:false,updated_at:nowIso()})});}catch(e){}}
    guestButton('🙋 참여',false);
  }

  function hostSlotFor(sessionId,name){
    var slot=document.querySelector('.ktg13-guest[data-kt-guest-session="'+String(sessionId).replace(/"/g,'')+'"]');
    if(slot)return slot;
    var all=[].slice.call(document.querySelectorAll('.ktg13-guest'));
    slot=all.find(function(x){return !x.getAttribute('data-kt-guest-session');})||null;
    if(!slot)return null;
    slot.setAttribute('data-kt-guest-session',sessionId);slot.classList.add('ktg13-guest-live');
    slot.innerHTML='<video autoplay playsinline></video><span class="kt-guest-live-name">'+esc(name||'게스트')+'</span>';
    return slot;
  }
  function releaseHostSlot(sessionId){
    var slot=document.querySelector('.ktg13-guest[data-kt-guest-session="'+String(sessionId).replace(/"/g,'')+'"]');
    if(slot){slot.removeAttribute('data-kt-guest-session');slot.classList.remove('ktg13-guest-live');slot.innerHTML='<span>게스트</span>';}
    var ent=hostPeers[sessionId];if(ent){try{ent.pc.close();}catch(e){}delete hostPeers[sessionId];}
  }

  function showHostRequest(x){
    if(!x||!x.id||document.getElementById('ktHostGuestRequest'))return;
    hostRequestCache[x.id]=x;
    var d=document.createElement('div');d.id='ktHostGuestRequest';d.setAttribute('data-session',x.id);
    d.innerHTML='<b>🙋 '+esc(x.guest_name||'게스트')+'님이 게스트 참여를 요청했습니다.</b><div class="kt-request-actions"><button id="ktHostGuestAccept" type="button">올리기</button><button id="ktHostGuestReject" type="button">거절</button></div>';
    document.body.appendChild(d);
    d.querySelector('#ktHostGuestAccept').onclick=function(){window.ktAcceptCurrentGuestRequest(x.id);};
    d.querySelector('#ktHostGuestReject').onclick=function(){window.ktRejectCurrentGuestRequest(x.id);};
  }
  function removeHostRequest(id){var d=document.getElementById('ktHostGuestRequest');if(d&&(!id||d.getAttribute('data-session')===String(id)))d.remove();}

  window.ktAcceptCurrentGuestRequest=async function(id){
    var x=hostRequestCache[id];if(!x||hostPeers[id])return;
    var slot=hostSlotFor(id,x.guest_name);if(!slot){alert('빈 게스트 자리가 없습니다.');return;}
    try{
      var pc=new RTCPeerConnection(ICE);hostPeers[id]={pc:pc,slot:slot,name:x.guest_name||'게스트'};
      pc.ontrack=function(ev){
        var v=slot.querySelector('video');if(!v)return;
        v.srcObject=ev.streams&&ev.streams[0]?ev.streams[0]:new MediaStream([ev.track]);
        v.muted=false;v.volume=1;try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
      };
      pc.onconnectionstatechange=function(){if(pc.connectionState==='failed'||pc.connectionState==='closed'){releaseHostSlot(id);}};
      await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(x.offer_sdp)));
      var answer=await pc.createAnswer();await pc.setLocalDescription(answer);await waitIce(pc,4000);
      await api('ktalk_guest_sessions?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({answer_sdp:JSON.stringify(pc.localDescription),status:'accepted',active:true,updated_at:nowIso()})});
      var hid=hostId();
      try{await api('ktalk_live_messages',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({host_id:hid,sender_id:String(x.guest_id||'guest'),sender_name:String(x.guest_name||'게스트'),message:String(x.guest_name||'게스트')+'님이 게스트로 올라왔습니다.',message_type:'system'})});}catch(e){}
      removeHostRequest(id);
    }catch(e){releaseHostSlot(id);alert('게스트 연결을 다시 요청해 주세요.');}
  };
  window.ktRejectCurrentGuestRequest=async function(id){
    try{await api('ktalk_guest_sessions?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({status:'rejected',active:false,updated_at:nowIso()})});}catch(e){}
    removeHostRequest(id);
  };

  function renderHostMessages(rows){
    var box=document.getElementById('ktg13ChatList');if(!box)return;
    var net=(rows||[]).slice(-6);
    var html=net.map(function(x){
      var sys=String(x.message_type||'')==='system';
      if(sys)return '<div class="ktg13-chat-line"><b>알림</b><span>'+esc(x.message||'')+'</span></div>';
      return '<div class="ktg13-chat-line"><b>'+esc(x.sender_name||'게스트')+'</b><span>'+esc(x.message||'')+'</span></div>';
    }).join('');
    if(html)box.innerHTML=html;
  }
  async function pollHostMessages(){
    if(!isGroup13Host())return;
    var hid=hostId();if(!hid)return;
    try{
      var cut=new Date(Date.now()-3600000).toISOString();
      var rows=await api('ktalk_live_messages?select=id,sender_name,message,message_type,created_at&host_id=eq.'+encodeURIComponent(hid)+'&created_at=gte.'+encodeURIComponent(cut)+'&order=created_at.asc&limit=40');
      (rows||[]).forEach(function(x){
        if(String(x.message_type||'')!=='system'||spokenMessages[x.id])return;
        var created=Date.parse(x.created_at||'')||0;
        if(created&&created<speechStartedAt-2000){spokenMessages[x.id]=1;return;}
        if(String(x.message||'').indexOf('들어왔습니다')>-1){
          spokenMessages[x.id]=1;
          try{if(window.ktAnnounceEvent)window.ktAnnounceEvent('join',{name:String(x.sender_name||'게스트')});else if(window.ktSpeak)window.ktSpeak(String(x.sender_name||'게스트')+'님, K-Talk에 오신 것을 환영합니다.');}catch(e){}
        }
      });
      renderHostMessages(rows||[]);
    }catch(e){}
  }
  async function pollHostRequests(){
    if(!isGroup13Host()||hostPollBusy)return;
    var hid=hostId();if(!hid)return;
    hostPollBusy=true;
    try{
      var cut=new Date(Date.now()-300000).toISOString();
      var rows=await api('ktalk_guest_sessions?select=id,host_id,guest_id,guest_name,offer_sdp,status,active,created_at,updated_at&host_id=eq.'+encodeURIComponent(hid)+'&status=eq.requested&active=eq.true&created_at=gte.'+encodeURIComponent(cut)+'&order=created_at.asc&limit=10');
      if(rows&&rows.length){rows.forEach(function(x){hostRequestCache[x.id]=x;});showHostRequest(rows[0]);}
      else removeHostRequest();
    }catch(e){}
    hostPollBusy=false;
  }

  async function refreshLiveBadge(){
    if(liveBadgeBusy)return;liveBadgeBusy=true;
    try{
      var watchingVideos=!!document.querySelector('.kt-public-video')||document.body.classList.contains('kt-video-mode');
      var old=document.getElementById('ktLiveWatchBadge');
      if(!watchingVideos||isRemoteViewer()||isGroup13Host()){if(old)old.remove();return;}
      var cut=new Date(Date.now()-55000).toISOString();
      var rows=await api('ktalk_live_rooms?select=host_id&active=eq.true&updated_at=gte.'+encodeURIComponent(cut)+'&limit=1');
      if(rows&&rows.length&&!old){
        var b=document.createElement('button');b.id='ktLiveWatchBadge';b.type='button';b.textContent='🔴 LIVE 방송 중';
        b.onclick=function(){try{if(window.friends)window.friends();setTimeout(function(){if(window.ktRefreshLiveCards)window.ktRefreshLiveCards();},80);}catch(e){}};
        document.body.appendChild(b);
      }else if((!rows||!rows.length)&&old)old.remove();
    }catch(e){}
    finally{liveBadgeBusy=false;}
  }

  function wrapLivePresence(){
    var enter=window.ktEnterRemoteLive;
    if(typeof enter==='function'&&!enter.__ktViewerGuestWrapped){
      var ewrap=async function(host){viewerHostId=String(host||'');viewerRoom=null;var r=await enter.apply(this,arguments);setTimeout(function(){ensureViewerControls();pollViewerMessages();},120);return r;};
      ewrap.__ktViewerGuestWrapped=true;ewrap.__ktOriginal=enter;window.ktEnterRemoteLive=ewrap;
    }
    var leave=window.ktLeaveRemoteLive;
    if(typeof leave==='function'&&!leave.__ktViewerGuestWrapped){
      var lwrap=async function(){await leaveGuestParticipation(true);var r=await leave.apply(this,arguments);viewerHostId='';viewerRoom=null;return r;};
      lwrap.__ktViewerGuestWrapped=true;lwrap.__ktOriginal=leave;window.ktLeaveRemoteLive=lwrap;
    }
  }

  function sync(){
    installStyle();wrapLivePresence();
    if(isRemoteViewer())ensureViewerControls();
    if(!isGroup13Host())removeHostRequest();
  }
  try{new MutationObserver(function(){setTimeout(sync,30);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(sync,150);
  setInterval(function(){sync();if(isRemoteViewer()){pollViewerMessages();pollViewerGuestAnswer();}if(isGroup13Host()){pollHostMessages();pollHostRequests();}refreshLiveBadge();},950);
  window.addEventListener('pagehide',function(){if(viewerGuestSessionId)leaveGuestParticipation(true);});
})();
