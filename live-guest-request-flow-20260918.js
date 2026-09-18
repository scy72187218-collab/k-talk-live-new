/* K-Talk 13명 방송 참여신청/호스트 올리기 전용. */
(function(){
  if(window.__ktGuestRequestFlow20260914)return;
  window.__ktGuestRequestFlow20260914=true;
  var started=false;
  var BASE='',KEY='';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var hostPoll=null,viewerPoll=null,hostGuestPeers={},requestNames={},hostGuestMissingSince={};
  var viewerGuest={pc:null,stream:null,sessionId:'',hostId:'',approvedKey:'',viewTimer:null,prejoinHostStream:null,connectStartedAt:0,mediaDenied:false,mediaOpening:false};

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];});}
  function css(v){try{return CSS.escape(String(v));}catch(e){return String(v).replace(/[^a-zA-Z0-9_-]/g,'\\$&');}}
  function nowIso(){return new Date().toISOString();}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}return id;}
  function viewerId(){return 'viewer_'+deviceId();}
  function profile(){var p={name:'K-Talk',photo:''};try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.nickname||x.name||x.displayName||p.name);p.photo=String(x.photo||'');}}catch(e){}try{var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.nickname||s.name||s.displayName||p.name);p.photo=String(s.photo||p.photo);}}catch(e){}try{p.name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}return p;}

  async function ensureConfig(){if(BASE&&KEY)return true;try{var r=await fetch('live-presence.js?v=20260914-guestflow',{cache:'no-store'});if(!r.ok)return false;var t=await r.text(),b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);if(!b||!k)return false;BASE=b[1];KEY=k[1];return true;}catch(e){return false;}}
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){if(!(await ensureConfig()))throw new Error('guest config');opt=opt||{};opt.headers=headers(opt.headers);var r=await fetch(BASE+path,opt);if(!r.ok)throw new Error('guest api '+r.status);if(r.status===204)return null;var t=await r.text();return t?JSON.parse(t):null;}
  function waitIce(pc,ms){return new Promise(function(resolve){if(!pc||pc.iceGatheringState==='complete')return resolve();var done=false,t=setTimeout(finish,ms||5000);function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}function on(){if(pc.iceGatheringState==='complete')finish();}pc.addEventListener('icegatheringstatechange',on);});}

  function ensureStyle(){if(document.getElementById('ktGuestRequestFlowStyle'))return;var s=document.createElement('style');s.id='ktGuestRequestFlowStyle';s.textContent=''
    +'.kt-remote-bottom #ktRemoteGuestRequest.kt-requested{color:#77ff9e!important;border-color:#77ff9e88!important;box-shadow:0 0 9px #32d86c66!important}'
    +'.ktg13-request-rail{position:absolute!important;left:44%!important;right:4px!important;bottom:4px!important;z-index:18!important;display:flex!important;gap:5px!important;overflow-x:auto!important;padding:3px!important;pointer-events:auto!important;scrollbar-width:none!important}.ktg13-request-rail::-webkit-scrollbar{display:none!important}'
    +'.ktg13-request-chip{flex:0 0 auto!important;min-width:86px!important;max-width:122px!important;height:36px!important;border:1px solid #62d8ff!important;border-radius:18px!important;background:rgba(6,18,28,.94)!important;color:#fff!important;padding:0 10px!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:0 0 9px #38cfff55!important;touch-action:none!important;user-select:none!important}.ktg13-request-chip b{color:#77e7ff!important}'
    +'.ktg13-guest.kt-guest-drop-ready{outline:2px solid #62d8ff!important;box-shadow:inset 0 0 16px #31cfff55!important}.ktg13-guest.kt-guest-approved{position:relative!important;overflow:hidden!important;background:#08090c!important;color:#fff!important}.ktg13-guest.kt-guest-approved>span.kt-guest-name{position:absolute!important;left:4px!important;bottom:4px!important;z-index:3!important;padding:2px 5px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}.ktg13-guest.kt-guest-approved>small{position:absolute!important;left:50%!important;top:50%!important;z-index:2!important;transform:translate(-50%,-50%)!important;color:#9aa0aa!important;font-size:8px!important;white-space:nowrap!important}.ktg13-guest.kt-guest-approved>video{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center center!important;background:#08090c!important;transform:scaleX(-1)!important}'
    +'.kt-remote-host-preview{position:absolute!important;right:10px!important;top:112px!important;z-index:6!important;width:92px!important;height:128px!important;border:2px solid rgba(255,255,255,.7)!important;border-radius:12px!important;object-fit:cover!important;background:#111!important;box-shadow:0 3px 12px #0008!important}.kt-guest-float{position:fixed!important;z-index:100000!important;pointer-events:none!important;min-width:86px!important;height:36px!important;border:1px solid #62d8ff!important;border-radius:18px!important;background:#06121cf2!important;color:#fff!important;padding:0 10px!important;display:grid!important;place-items:center!important;font-size:9px!important;font-weight:950!important;box-shadow:0 0 14px #38cfff88!important}'
    +'@media(max-width:390px){.ktg13-request-rail{left:42%!important}.ktg13-request-chip{min-width:78px!important;height:32px!important;font-size:8px!important}.kt-remote-host-preview{width:78px!important;height:108px!important;top:106px!important}}';document.head.appendChild(s);}

  async function currentViewerHost(){try{var rows=await req('ktalk_live_viewers?select=host_id,viewer_id,active,updated_at&viewer_id=eq.'+enc(viewerId())+'&active=eq.true&order=updated_at.desc&limit=1');return rows&&rows[0]?String(rows[0].host_id||''):'';}catch(e){return '';}}
  async function activeHostRoom(){
    try{
      var rows=await req('ktalk_live_rooms?select=host_id,started_at,room_type,room_name,active,updated_at&host_id=eq.'+enc(deviceId())+'&active=eq.true&order=started_at.desc&limit=1');
      if(rows&&rows[0])return rows[0];
      /* 화면에는 방송방이 열려 있는데 presence 행만 잠깐 inactive가 되는 경우,
         방을 닫은 것으로 오해하지 말고 최근 방송행을 짧게 복구용으로 사용한다. */
      rows=await req('ktalk_live_rooms?select=host_id,started_at,room_type,room_name,active,updated_at&host_id=eq.'+enc(deviceId())+'&order=started_at.desc&limit=1');
      var r=rows&&rows[0]?rows[0]:null;
      if(!r||!r.started_at)return null;
      var age=Date.now()-new Date(r.started_at).getTime();
      return age>=0&&age<15*60*1000?r:null;
    }catch(e){return null;}
  }
  async function postGuestMessage(hostId,type,message,senderId,senderName){if(!hostId)return false;try{await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:hostId,sender_id:senderId||viewerId(),sender_name:senderName||profile().name||'게스트',message:String(message||'').slice(0,300),message_type:String(type||'guest_request')})});return true;}catch(e){return false;}}

  async function sendGuestRequest(){var hostId=await currentViewerHost();if(!hostId)return;var p=profile(),vid=viewerId();var ok=await postGuestMessage(hostId,'guest_request:'+vid,'👥 '+(p.name||'게스트')+'님이 방송 참여를 신청했습니다.',vid,p.name||'게스트');var b=document.getElementById('ktRemoteGuestRequest');if(ok&&b){b.classList.add('kt-requested');b.setAttribute('title','참여 신청 완료');b.setAttribute('aria-label','참여 신청 완료');}}
  window.ktRequestGuestJoin=sendGuestRequest;
  function bindRequestButton(){var b=document.getElementById('ktRemoteGuestRequest');if(!b)return;if(b.__ktGuestRequestBound)return;b.__ktGuestRequestBound=true;b.onclick=function(e){if(e)e.preventDefault();sendGuestRequest();};}
  function removeDuplicateGroupRoom(){var screen=document.getElementById('screen');if(!screen)return;var rooms=[].slice.call(screen.querySelectorAll('.ktg13-room'));if(rooms.length>1)rooms.slice(1).forEach(function(x){x.remove();});['.ktg13-head','.ktg13-led','.ktg13-stats','.ktg13-main','.ktg13-mid','.ktg13-gifts','.ktg13-tools'].forEach(function(sel){var parts=[].slice.call(screen.querySelectorAll(sel));if(parts.length>1)parts.slice(1).forEach(function(x){x.remove();});});var root=screen.querySelector('.kt-remote-live');if(root&&root.querySelector('.kt-approved-guest-grid')){root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(x){try{x.remove();}catch(e){}});root.classList.remove('kt-prejoin-room-view');}}

  function slotIndex(slot){var all=[].slice.call(document.querySelectorAll('.ktg13-guest'));return Math.max(0,all.indexOf(slot));}
  function decorateSlot(slot,vid,name){if(!slot)return;slot.dataset.ktGuestViewerId=vid;slot.classList.add('kt-guest-approved');slot.innerHTML='<video autoplay playsinline></video><small>게스트 연결 중...</small><span class="kt-guest-name">👤 '+esc(name||'게스트')+'</span>';try{localStorage.setItem('kt_guest_slot:'+deviceId()+':'+vid,String(slotIndex(slot)));}catch(e){}}
  function releaseGuestSlot(slot,vid){if(!slot)return;if(vid&&slot.dataset.ktGuestViewerId&&slot.dataset.ktGuestViewerId!==vid)return;var oldVid=slot.dataset.ktGuestViewerId||vid||'';slot.classList.remove('kt-guest-approved');delete slot.dataset.ktGuestViewerId;slot.innerHTML='<span>게스트</span>';if(oldVid)try{localStorage.removeItem('kt_guest_slot:'+deviceId()+':'+oldVid);}catch(e){}}
  function findOrRestoreSlot(vid,name){var slot=document.querySelector('.ktg13-guest[data-kt-guest-viewer-id="'+css(vid)+'"]');if(slot)return slot;var all=[].slice.call(document.querySelectorAll('.ktg13-guest')),idx=-1;try{idx=parseInt(localStorage.getItem('kt_guest_slot:'+deviceId()+':'+vid)||'-1',10);}catch(e){}if(idx>=0&&all[idx]&&!all[idx].dataset.ktGuestViewerId){decorateSlot(all[idx],vid,name);return all[idx];}return null;}
  function firstFreeSlot(){var all=[].slice.call(document.querySelectorAll('.ktg13-guest'));for(var i=0;i<all.length;i++)if(!all[i].dataset.ktGuestViewerId)return all[i];return null;}
  function clearDropReady(){document.querySelectorAll('.ktg13-guest.kt-guest-drop-ready').forEach(function(x){x.classList.remove('kt-guest-drop-ready');});}
  async function approveGuest(vid,name,slot){slot=slot||findOrRestoreSlot(vid,name)||firstFreeSlot();if(!slot)return;decorateSlot(slot,vid,name);await postGuestMessage(deviceId(),'guest_approved:'+vid,'✅ '+(name||'게스트')+'님 참여를 승인했습니다.',deviceId(),profile().name||'호스트');var chip=document.querySelector('.ktg13-request-chip[data-viewer-id="'+css(vid)+'"]');if(chip)chip.remove();var rail=document.getElementById('ktg13RequestRail');if(rail&&!rail.children.length)rail.remove();}
  window.ktApproveGuest=approveGuest;

  function wireChipDrag(chip,vid,name){if(chip.__ktDragBound)return;chip.__ktDragBound=true;var downX=0,downY=0,moved=false,floatEl=null;function moveFloat(x,y){if(!floatEl)return;floatEl.style.left=(x-45)+'px';floatEl.style.top=(y-18)+'px';clearDropReady();var el=document.elementFromPoint(x,y),slot=el&&el.closest?el.closest('.ktg13-guest'):null;if(slot&&!slot.dataset.ktGuestViewerId)slot.classList.add('kt-guest-drop-ready');}chip.addEventListener('pointerdown',function(e){downX=e.clientX;downY=e.clientY;moved=false;try{chip.setPointerCapture(e.pointerId);}catch(z){}floatEl=document.createElement('div');floatEl.className='kt-guest-float';floatEl.textContent='👤 '+name+' 올리기';document.body.appendChild(floatEl);moveFloat(e.clientX,e.clientY);});chip.addEventListener('pointermove',function(e){if(!floatEl)return;if(Math.abs(e.clientX-downX)>6||Math.abs(e.clientY-downY)>6)moved=true;moveFloat(e.clientX,e.clientY);});chip.addEventListener('pointerup',function(e){if(!floatEl)return;var el=document.elementFromPoint(e.clientX,e.clientY),slot=el&&el.closest?el.closest('.ktg13-guest'):null;floatEl.remove();floatEl=null;clearDropReady();if(slot&&!slot.dataset.ktGuestViewerId){approveGuest(vid,name,slot);return;}if(!moved)approveGuest(vid,name,null);});chip.addEventListener('pointercancel',function(){if(floatEl){floatEl.remove();floatEl=null;}clearDropReady();});}
  function renderRequestRail(pending){var main=document.querySelector('.ktg13-main');if(!main){var old=document.getElementById('ktg13RequestRail');if(old)old.remove();return;}var rail=document.getElementById('ktg13RequestRail');if(!pending.length){if(rail)rail.remove();return;}if(!rail){rail=document.createElement('div');rail.id='ktg13RequestRail';rail.className='ktg13-request-rail';main.appendChild(rail);}rail.innerHTML='';pending.forEach(function(x){var chip=document.createElement('button');chip.type='button';chip.className='ktg13-request-chip';chip.dataset.viewerId=x.vid;chip.innerHTML='👤 <b>'+esc(x.name)+'</b> 올리기';rail.appendChild(chip);wireChipDrag(chip,x.vid,x.name);});}

  async function hostTick(){
    ensureStyle();bindRequestButton();removeDuplicateGroupRoom();
    if(!document.querySelector('.ktg13-room')){
      var old=document.getElementById('ktg13RequestRail');if(old)old.remove();return;
    }
    var room=await activeHostRoom();if(!room)return;
    var path='ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+enc(deviceId());
    if(room.started_at)path+='&created_at=gte.'+enc(room.started_at);
    path+='&order=created_at.desc&limit=240';
    var rows=[];try{rows=await req(path)||[];}catch(e){return;}

    var names={},requestAt={},approvedAt={},joinAt={},approvedNow={},pending=[];
    rows.forEach(function(m){
      var t=String(m.message_type||''),vid='',ts=String(m.created_at||'');
      if(t.indexOf('guest_request:')===0){
        vid=t.slice(14);
        if(vid&&!requestAt[vid]){requestAt[vid]=ts;names[vid]=String(m.sender_name||'게스트');}
      }else if(t.indexOf('guest_approved:')===0){
        vid=t.slice(15);
        if(vid&&!approvedAt[vid])approvedAt[vid]=ts;
      }else if(t==='system'){
        vid=String(m.sender_id||'');
        var msg=String(m.message||'');
        if(vid.indexOf('viewer_')===0&&msg.indexOf('님이 들어왔습니다.')>-1&&!joinAt[vid])joinAt[vid]=ts;
      }
    });

    requestNames=names;

    /* 실제로 지금 방을 보고 있는 기기만 승인 상태로 유지한다.
       홈 화면/앱 전환 등으로 heartbeat가 끊기면 몇 초 뒤 자동으로 게스트 칸에서 내려간다. */
    var freshCut=new Date(Date.now()-10000).toISOString();
    var freshViewers={};
    try{
      var vr=await req('ktalk_live_viewers?select=viewer_id,active,updated_at&host_id=eq.'+enc(deviceId())+'&active=eq.true&updated_at=gte.'+enc(freshCut)+'&limit=300')||[];
      vr.forEach(function(v){freshViewers[String(v.viewer_id||'')]=true;});
    }catch(e){}

    Object.keys(requestAt).forEach(function(vid){
      var reqTs=requestAt[vid],joinTs=joinAt[vid]||'';
      /* 현재 입장 뒤에 직접 신청한 요청만 유효하다. 예전 승인/예전 신청은 재사용하지 않는다. */
      if(joinTs&&reqTs<joinTs)return;
      var apTs=approvedAt[vid]||'';
      if(apTs&&apTs>=reqTs&&freshViewers[vid])approvedNow[vid]=true;
      else if(freshViewers[vid]&&!apTs)pending.push({vid:vid,name:names[vid]||'게스트'});
    });

    renderRequestRail(pending);
    await hostGuestSessionTick(approvedNow);
  }

  /* 현재 방송에서 호스트가 승인한 게스트만 호스트 화면에 카메라를 올린다. 예전/남은 WebRTC 세션은 표시하지 않는다. */
  async function hostGuestSessionTick(approvedNow){
    approvedNow=approvedNow||{};
    if(!document.querySelector('.ktg13-room'))return;

    var hid=deviceId(),rows=[];
    try{
      rows=await req('ktalk_webrtc_sessions?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at&host_id=eq.'+enc(hid)+'&active=eq.true&order=created_at.asc&limit=60')||[];
    }catch(e){return;}

    var activeIds={},activeGuestIds={};

    rows.forEach(function(r){
      var tag=String(r.viewer_id||'');
      var guestVid=tag.indexOf('guest:')===0?tag.slice(6):'';
      if(guestVid&&!approvedNow[guestVid])return;
      activeIds[r.id]=true;
      if(guestVid&&r.offer_sdp&&r.offer_sdp!=='pending'){
        activeGuestIds[guestVid]=true;
        delete hostGuestMissingSince[guestVid];
      }
    });

    /* 승인된 게스트가 휴대폰 통신 때문에 잠깐 재연결돼도 자리를 바로 지우지 않는다. */
    document.querySelectorAll('.ktg13-guest[data-kt-guest-viewer-id]').forEach(function(slot){
      var vid=slot.dataset.ktGuestViewerId||'';
      if(!vid)return;

      if(!approvedNow[vid]){
        delete hostGuestMissingSince[vid];
        releaseGuestSlot(slot,vid);
        return;
      }

      if(activeGuestIds[vid]){
        delete hostGuestMissingSince[vid];
        return;
      }

      if(!hostGuestMissingSince[vid])hostGuestMissingSince[vid]=Date.now();
      if(Date.now()-hostGuestMissingSince[vid]>12000){
        delete hostGuestMissingSince[vid];
        releaseGuestSlot(slot,vid);
      }
    });

    Object.keys(hostGuestPeers).forEach(function(id){
      if(activeIds[id])return;
      var old=hostGuestPeers[id];
      try{old.close();}catch(e){}
      delete hostGuestPeers[id];
      /* 자리는 위의 12초 재연결 유예가 관리하므로 여기서 바로 지우지 않음 */
    });

    for(var i=0;i<rows.length;i++){
      var x=rows[i],vtag=String(x.viewer_id||'');
      if(vtag.indexOf('guest:')!==0||!x.offer_sdp||x.offer_sdp==='pending'||hostGuestPeers[x.id])continue;

      var vid=vtag.slice(6);
      if(!approvedNow[vid])continue;

      var name=requestNames[vid]||'게스트';
      var slot=findOrRestoreSlot(vid,name)||firstFreeSlot();
      if(!slot)continue;
      if(!slot.dataset.ktGuestViewerId)decorateSlot(slot,vid,name);

      try{
        var pc=new RTCPeerConnection(ICE);
        pc.__ktSlot=slot;
        pc.__ktVid=vid;
        hostGuestPeers[x.id]=pc;

        pc.ontrack=(function(target,viewer){
          return function(ev){
            delete hostGuestMissingSince[viewer];
            var v=target.querySelector('video'),sm=target.querySelector('small');
            if(v){
              v.srcObject=ev.streams[0]||new MediaStream([ev.track]);
              v.autoplay=true;
              v.playsInline=true;
              v.muted=true;
              v.style.setProperty('object-fit','cover','important');
              v.style.setProperty('object-position','center center','important');
              v.style.setProperty('width','100%','important');
              v.style.setProperty('height','100%','important');
              try{
                var p=v.play();
                if(p&&p.catch)p.catch(function(){});
              }catch(e){}
            }
            if(sm)sm.style.display='none';
          };
        })(slot,vid);

        pc.onconnectionstatechange=(function(id,p,viewer){
          return function(){
            var st=String(p.connectionState||'');
            if(st==='connected'){
              delete hostGuestMissingSince[viewer];
              return;
            }
            if(st==='failed'||st==='closed'){
              try{p.close();}catch(e){}
              delete hostGuestPeers[id];
              if(!hostGuestMissingSince[viewer])hostGuestMissingSince[viewer]=Date.now();
              /* 다음 hostTick에서 같은 활성 세션도 다시 연결 가능 */
              return;
            }
            if(st==='disconnected'){
              setTimeout(function(){
                try{
                  if(hostGuestPeers[id]===p&&p.connectionState==='disconnected'){
                    p.close();
                    delete hostGuestPeers[id];
                    if(!hostGuestMissingSince[viewer])hostGuestMissingSince[viewer]=Date.now();
                  }
                }catch(e){}
              },4000);
            }
          };
        })(x.id,pc,vid);

        await pc.setRemoteDescription({type:'offer',sdp:x.offer_sdp});
        var ans=await pc.createAnswer();
        await pc.setLocalDescription(ans);
        await waitIce(pc,5000);

        await req('ktalk_webrtc_sessions?id=eq.'+enc(x.id),{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({answer_sdp:pc.localDescription.sdp,updated_at:nowIso()})
        });
      }catch(e){
        if(hostGuestPeers[x.id]){
          try{hostGuestPeers[x.id].close();}catch(z){}
          delete hostGuestPeers[x.id];
        }
        if(!hostGuestMissingSince[vid])hostGuestMissingSince[vid]=Date.now();
      }
    }
  }

  async function latestApproval(hostId,vid){
    try{
      var roomRows=await req('ktalk_live_rooms?select=started_at,active&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=roomRows&&roomRows[0]?roomRows[0]:null;
      if(!room){
        roomRows=await req('ktalk_live_rooms?select=started_at,active&host_id=eq.'+enc(hostId)+'&order=started_at.desc&limit=1');
        room=roomRows&&roomRows[0]?roomRows[0]:null;
        if(room&&room.started_at){
          var age=Date.now()-new Date(room.started_at).getTime();
          if(age<0||age>=15*60*1000)room=null;
        }
      }
      if(!room||!room.started_at)return null;

      var rows=await req('ktalk_live_messages?select=id,sender_id,message,message_type,created_at&host_id=eq.'+enc(hostId)+'&created_at=gte.'+enc(room.started_at)+'&order=created_at.desc&limit=240')||[];
      var reqRow=null,apRow=null,joinRow=null;
      for(var i=0;i<rows.length;i++){
        var m=rows[i],t=String(m.message_type||'');
        if(!reqRow&&t==='guest_request:'+vid)reqRow=m;
        else if(!apRow&&t==='guest_approved:'+vid)apRow=m;
        else if(!joinRow&&t==='system'&&String(m.sender_id||'')===vid&&String(m.message||'').indexOf('님이 들어왔습니다.')>-1)joinRow=m;
        if(reqRow&&apRow&&joinRow)break;
      }

      /* 새로 들어온 뒤 신청 -> 호스트 승인 순서가 모두 맞아야만 게스트 카메라를 올린다. */
      if(!reqRow||!apRow)return null;
      var reqTs=String(reqRow.created_at||''),apTs=String(apRow.created_at||''),joinTs=joinRow?String(joinRow.created_at||''):'';
      if(joinTs&&reqTs<joinTs)return null;
      if(apTs<reqTs)return null;
      return apRow;
    }catch(e){return null;}
  }
  function ensurePrejoinRoomStyle(){
    if(document.getElementById('ktPrejoinRoomGridStyle'))return;
    var s=document.createElement('style');
    s.id='ktPrejoinRoomGridStyle';
    s.textContent=''
      +'.kt-remote-live.kt-prejoin-room-view{display:flex!important;flex-direction:column!important;gap:4px!important;padding:5px 6px calc(62px + env(safe-area-inset-bottom))!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-prejoin-room-view>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 58px!important;border-radius:16px!important;padding:6px 9px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important}'
      +'.kt-remote-live.kt-prejoin-room-view>.kt-remote-shade{display:none!important}'
      +'.kt-prejoin-room-led{flex:0 0 44px!important;border:2px solid #ff28c4!important;border-radius:20px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.4px)!important;background-size:12px 12px!important;box-shadow:0 0 9px #ff28c4,0 0 18px #ff28c455!important;color:#ffd62d!important;font-size:17px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;white-space:nowrap!important}'
      +'.kt-prejoin-room-stats{flex:0 0 42px!important;display:grid!important;grid-template-columns:1fr 1fr 1.3fr!important;gap:5px!important}.kt-prejoin-room-stats>div{border-radius:12px!important;background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important}'
      +'.kt-prejoin-room-grid{flex:1 1 0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important;overflow:hidden!important}.kt-prejoin-room-grid.is13{grid-template-columns:repeat(4,minmax(0,1fr))!important}'
      +'.kt-prejoin-room-cell{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid #292a30!important;border-radius:8px!important;background:linear-gradient(145deg,#17181d,#0e0f13)!important;color:#e6e6eb!important;display:grid!important;place-items:center!important;font-size:12px!important;font-weight:900!important}'
      +'.kt-prejoin-room-cell.host>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;object-fit:cover!important;object-position:center center!important;background:#08090c!important;transform:none!important}'
      +'.kt-prejoin-room-cell.host>label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}'
      +'.kt-remote-live.kt-prejoin-room-view .kt-remote-attendance{left:50%!important;right:auto!important;top:34px!important;transform:translate(-50%,-50%)!important;height:32px!important;font-size:11px!important;padding:0 11px!important;z-index:15!important}'
      +'.kt-remote-live.kt-prejoin-room-view .kt-remote-chat{bottom:60px!important;max-height:105px!important;right:58px!important}.kt-remote-live.kt-prejoin-room-view .kt-remote-bottom{bottom:calc(5px + env(safe-area-inset-bottom))!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-prejoin-room-view{gap:3px!important;padding-left:4px!important;padding-right:4px!important}.kt-prejoin-room-led{flex-basis:40px!important;font-size:15px!important}.kt-prejoin-room-stats{flex-basis:39px!important}.kt-prejoin-room-stats>div{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function removePrejoinRoomGrid(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return;
    var main=document.getElementById('ktRemoteLiveVideo');
    var grid=root.querySelector('.kt-prejoin-room-grid');
    if(main&&grid&&grid.contains(main)){
      try{root.insertBefore(main,root.firstChild);}catch(e){root.appendChild(main);}
      main.style.cssText='';
      main.autoplay=true;main.playsInline=true;
      if(viewerGuest.prejoinHostStream&&main.srcObject!==viewerGuest.prejoinHostStream)main.srcObject=viewerGuest.prejoinHostStream;
      try{var p=main.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(x){try{x.remove();}catch(e){}});
    root.classList.remove('kt-prejoin-room-view');
  }

  function ensurePrejoinRoomGrid(){
    var root=document.querySelector('.kt-remote-live');
    if(!root||root.querySelector('.kt-approved-guest-grid'))return;
    var main=document.getElementById('ktRemoteLiveVideo');
    if(!main)return;
    if(main.srcObject)viewerGuest.prejoinHostStream=main.srcObject;
    if(root.querySelector('.kt-prejoin-room-grid'))return;

    ensurePrejoinRoomStyle();
    root.classList.add('kt-prejoin-room-view');

    var led=document.createElement('div');
    led.className='kt-prejoin-room-led';
    led.textContent='💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송';
    var stats=document.createElement('div');
    stats.className='kt-prejoin-room-stats';
    stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';

    var meta=document.querySelector('.kt-remote-meta');
    var txt=meta?String(meta.textContent||''):'';
    var is13=txt.indexOf('13명')>-1;
    var total=is13?13:9;
    var grid=document.createElement('div');
    grid.className='kt-prejoin-room-grid'+(is13?' is13':'');

    var host=document.createElement('div');
    host.className='kt-prejoin-room-cell host';
    var label=document.createElement('label');label.textContent='호스트';host.appendChild(label);
    main.style.cssText='';
    host.appendChild(main);
    grid.appendChild(host);
    for(var i=1;i<total;i++){
      var cell=document.createElement('div');
      cell.className='kt-prejoin-room-cell';
      cell.textContent='게스트';
      grid.appendChild(cell);
    }

    var top=root.querySelector('.kt-remote-top');
    if(top&&top.nextSibling)root.insertBefore(led,top.nextSibling);else root.appendChild(led);
    if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
    if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);
  }

  function showLocalGuestView(stream){var main=document.getElementById('ktRemoteLiveVideo');if(!main||!stream)return;var hostStream=window.__ktRemoteHostStream||viewerGuest.prejoinHostStream||main.srcObject;var pv=document.getElementById('ktRemoteHostPreview');if(hostStream&&hostStream!==stream){if(!pv){pv=document.createElement('video');pv.id='ktRemoteHostPreview';pv.className='kt-remote-host-preview';pv.autoplay=true;pv.playsInline=true;pv.muted=true;var root=document.querySelector('.kt-remote-live');if(root)root.appendChild(pv);}var hostChanged=pv.srcObject!==hostStream;if(hostChanged)pv.srcObject=hostStream;pv.style.setProperty('transform','none','important');if(hostChanged||pv.paused){var pp=pv.play();if(pp&&pp.catch)pp.catch(function(){});}}main.dataset.ktLocalGuestView='1';var selfChanged=main.srcObject!==stream;if(selfChanged)main.srcObject=stream;main.muted=true;if(!main.dataset.ktStableGuestStyle){main.style.setProperty('object-fit','cover','important');main.style.setProperty('object-position','center center','important');main.style.setProperty('transform','scaleX(-1)','important');main.dataset.ktStableGuestStyle='1';}if(selfChanged||main.paused){var p=main.play();if(p&&p.catch)p.catch(function(){});}}
  function stopLocalGuestViewGuard(){if(viewerGuest.viewTimer){clearInterval(viewerGuest.viewTimer);viewerGuest.viewTimer=null;}var main=document.getElementById('ktRemoteLiveVideo');if(main)delete main.dataset.ktLocalGuestView;}
  function startLocalGuestViewGuard(stream){stopLocalGuestViewGuard();showLocalGuestView(stream);viewerGuest.viewTimer=setInterval(function(){if(!viewerGuest.stream||viewerGuest.stream!==stream||!document.querySelector('.kt-remote-live')){stopLocalGuestViewGuard();return;}var main=document.getElementById('ktRemoteLiveVideo');var pv=document.getElementById('ktRemoteHostPreview');if((main&&main.srcObject!==stream)||(main&&main.paused)||(pv&&window.__ktRemoteHostStream&&pv.srcObject!==window.__ktRemoteHostStream)||(pv&&pv.paused))showLocalGuestView(stream);},900);}
  function endViewerGuestSession(keepalive){var sid=viewerGuest.sessionId;viewerGuest.sessionId='';if(!sid)return;if(keepalive&&BASE&&KEY){try{fetch(BASE+'ktalk_webrtc_sessions?id=eq.'+enc(sid),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});}catch(e){}return;}req('ktalk_webrtc_sessions?id=eq.'+enc(sid),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})}).catch(function(){});}
  function resetViewerGuestPc(pc){
    try{if(pc)pc.close();}catch(e){}
    if(!pc||viewerGuest.pc===pc)viewerGuest.pc=null;
    viewerGuest.sessionId='';
    viewerGuest.connectStartedAt=0;
  }

  async function startViewerGuestUplink(hostId,vid,approvalId){
    approvalId=approvalId||'approved';

    /* 같은 승인이라도 연결이 실제로 살아 있을 때만 그대로 둔다.
       실패/끊김/오래 멈춘 new 상태면 게스트 카메라 연결만 다시 만든다. */
    if(viewerGuest.pc&&viewerGuest.approvedKey===approvalId){
      var st='';
      try{st=String(viewerGuest.pc.connectionState||'');}catch(e){}
      var age=viewerGuest.connectStartedAt?Date.now()-viewerGuest.connectStartedAt:0;
      if(st==='connected'||st==='connecting'||(st==='new'&&age<18000))return;
      resetViewerGuestPc(viewerGuest.pc);
    }

    removePrejoinRoomGrid();

    if(viewerGuest.pc)resetViewerGuestPc(viewerGuest.pc);
    stopLocalGuestViewGuard();

    var stream=viewerGuest.stream||null;
    var liveVideo=false;
    try{liveVideo=!!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){liveVideo=false;}

    /* 이미 한 번 허용해서 살아 있는 게스트 카메라는 재사용한다.
       권한을 거절한 경우 같은 접속에서 브라우저 허용창을 반복해서 띄우지 않는다. */
    if(!liveVideo){
      if(viewerGuest.mediaDenied||viewerGuest.mediaOpening)return;
      viewerGuest.mediaOpening=true;
      try{
        stream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:'user'},width:{ideal:1280},height:{ideal:960},aspectRatio:{ideal:1.333333},resizeMode:'none',frameRate:{ideal:30,max:30}},
          audio:true
        });
      }catch(e){
        var denied=String((e&&e.name)||'').toLowerCase();
        if(denied==='notallowederror'||denied==='permissiondeniederror'||denied==='securityerror'){
          viewerGuest.mediaDenied=true;
          viewerGuest.mediaOpening=false;
          return;
        }
        try{
          stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
        }catch(z){
          var denied2=String((z&&z.name)||'').toLowerCase();
          if(denied2==='notallowederror'||denied2==='permissiondeniederror'||denied2==='securityerror')viewerGuest.mediaDenied=true;
          viewerGuest.mediaOpening=false;
          return;
        }
      }
      viewerGuest.mediaOpening=false;
    }

    try{
      var vt=stream&&stream.getVideoTracks?stream.getVideoTracks()[0]:null;
      if(vt&&vt.getCapabilities&&vt.applyConstraints){
        var caps=vt.getCapabilities()||{};
        if(caps.zoom&&isFinite(caps.zoom.min))vt.applyConstraints({advanced:[{zoom:caps.zoom.min}]}).catch(function(){});
      }
    }catch(e){}

    viewerGuest.stream=stream;
    viewerGuest.hostId=hostId;
    viewerGuest.approvedKey=approvalId;
    startLocalGuestViewGuard(stream);

    var guestViewerId='guest:'+vid;
    var pc=null;
    try{
      /* 이전에 남은 같은 게스트 세션만 종료하고 새 연결을 만든다. */
      await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc(guestViewerId)+'&active=eq.true',{
        method:'PATCH',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({active:false,updated_at:nowIso()})
      });

      pc=new RTCPeerConnection(ICE);
      viewerGuest.pc=pc;
      viewerGuest.connectStartedAt=Date.now();

      pc.onconnectionstatechange=function(){
        if(viewerGuest.pc!==pc)return;
        var s=String(pc.connectionState||'');
        if(s==='connected'){
          viewerGuest.connectStartedAt=0;
          return;
        }
        if(s==='failed'||s==='closed'){
          resetViewerGuestPc(pc);
          return;
        }
        if(s==='disconnected'){
          setTimeout(function(){
            if(viewerGuest.pc===pc&&pc.connectionState==='disconnected')resetViewerGuestPc(pc);
          },3500);
        }
      };

      stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream);}catch(e){}});
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
      await pc.setLocalDescription(offer);
      await waitIce(pc,5000);

      var created=await req('ktalk_webrtc_sessions',{
        method:'POST',
        headers:{Prefer:'return=representation'},
        body:JSON.stringify({
          host_id:hostId,
          viewer_id:guestViewerId,
          offer_sdp:pc.localDescription.sdp,
          answer_sdp:null,
          active:true,
          updated_at:nowIso()
        })
      });

      var sid=created&&created[0]?created[0].id:'';
      viewerGuest.sessionId=sid;
      if(!sid){resetViewerGuestPc(pc);return;}

      var tries=0;
      var t=setInterval(async function(){
        if(viewerGuest.pc!==pc||viewerGuest.sessionId!==sid){clearInterval(t);return;}
        tries++;

        /* 호스트 답이 오래 안 오면 이 연결만 닫고 viewerTick이 자동 재시도한다. */
        if(tries>24){
          clearInterval(t);
          resetViewerGuestPc(pc);
          return;
        }

        try{
          var rows=await req('ktalk_webrtc_sessions?select=id,answer_sdp,active&id=eq.'+enc(sid)+'&limit=1');
          var x=rows&&rows[0];
          if(!x||!x.active){
            clearInterval(t);
            resetViewerGuestPc(pc);
            return;
          }
          if(x.answer_sdp){
            await pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});
            clearInterval(t);
          }
        }catch(e){}
      },850);
    }catch(e){
      resetViewerGuestPc(pc);
    }
  }

  async function viewerTick(){
    ensureStyle();bindRequestButton();
    if(!document.querySelector('.kt-remote-live')){
      endViewerGuestSession(false);
      if(viewerGuest.pc){try{viewerGuest.pc.close();}catch(e){}viewerGuest.pc=null;}
      stopLocalGuestViewGuard();
      viewerGuest.prejoinHostStream=null;
      if(viewerGuest.stream){try{viewerGuest.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}viewerGuest.stream=null;}
      viewerGuest.approvedKey='';
      return;
    }
    var hostId=await currentViewerHost();
    if(!hostId){ensurePrejoinRoomGrid();return;}
    var vid=viewerId(),ap=await latestApproval(hostId,vid);
    if(ap){
      startViewerGuestUplink(hostId,vid,String(ap.id||ap.created_at||'approved'));
    }else{
      /* 신청/승인이 없는 새 입장에서는 예전 게스트 업링크를 즉시 끈다. */
      if(viewerGuest.sessionId||viewerGuest.pc||viewerGuest.hostId){
        try{
          await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc('guest:'+vid)+'&active=eq.true',{
            method:'PATCH',headers:{Prefer:'return=minimal'},
            body:JSON.stringify({active:false,updated_at:nowIso()})
          });
        }catch(e){}
        if(viewerGuest.pc){try{viewerGuest.pc.close();}catch(e){}viewerGuest.pc=null;}
        viewerGuest.sessionId='';
        viewerGuest.hostId='';
        viewerGuest.approvedKey='';
        viewerGuest.connectStartedAt=0;
        stopLocalGuestViewGuard();
        if(viewerGuest.stream){try{viewerGuest.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}viewerGuest.stream=null;}
      }
      ensurePrejoinRoomGrid();
    }
  }


  async function leaveApprovedGuestNow(){
    var hostId=viewerGuest.hostId||'';
    var vid=viewerId();
    var sid=viewerGuest.sessionId||'';

    /* 게스트가 방에서 나가는 순간 업링크 세션을 바로 종료해서 호스트 칸도 즉시 내려가게 한다. */
    try{
      if(sid){
        await req('ktalk_webrtc_sessions?id=eq.'+enc(sid),{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({active:false,updated_at:nowIso()})
        });
      }
    }catch(e){}
    try{
      if(hostId){
        await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hostId)+'&viewer_id=eq.'+enc('guest:'+vid)+'&active=eq.true',{
          method:'PATCH',
          headers:{Prefer:'return=minimal'},
          body:JSON.stringify({active:false,updated_at:nowIso()})
        });
      }
    }catch(e){}

    if(viewerGuest.pc){try{viewerGuest.pc.close();}catch(e){}viewerGuest.pc=null;}
    viewerGuest.sessionId='';
    viewerGuest.connectStartedAt=0;
    stopLocalGuestViewGuard();
    viewerGuest.prejoinHostStream=null;
    if(viewerGuest.stream){
      try{viewerGuest.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}
      viewerGuest.stream=null;
    }
    viewerGuest.hostId='';
    viewerGuest.approvedKey='';
  }

  function bindGuestLeaveCleanup(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktGuestLeaveCleanup)return;
    var wrapped=function(){
      var args=arguments,self=this;
      try{
        var cleaning=leaveApprovedGuestNow();
        if(cleaning&&cleaning.catch)cleaning.catch(function(){});
      }catch(e){}
      return old.apply(self,args);
    };
    wrapped.__ktGuestLeaveCleanup=true;
    window.ktLeaveRemoteLive=wrapped;
  }

  function start(){if(started)return;started=true;bindGuestLeaveCleanup();setInterval(bindGuestLeaveCleanup,800);ensureStyle();bindRequestButton();hostPoll=setInterval(hostTick,1200);viewerPoll=setInterval(viewerTick,1300);setInterval(removeDuplicateGroupRoom,350);setTimeout(hostTick,100);setTimeout(viewerTick,180);var dedupeTimer=null,obs=new MutationObserver(function(){bindRequestButton();clearTimeout(dedupeTimer);dedupeTimer=setTimeout(removeDuplicateGroupRoom,30);});obs.observe(document.documentElement,{childList:true,subtree:true});}
  document.addEventListener('DOMContentLoaded',start);if(document.readyState!=='loading')start();
  window.addEventListener('pagehide',function(){clearInterval(hostPoll);clearInterval(viewerPoll);endViewerGuestSession(true);stopLocalGuestViewGuard();removePrejoinRoomGrid();Object.keys(hostGuestPeers).forEach(function(k){try{hostGuestPeers[k].close();}catch(e){}});hostGuestPeers={};if(viewerGuest.pc){try{viewerGuest.pc.close();}catch(e){}}if(viewerGuest.stream){try{viewerGuest.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}}});
})();
