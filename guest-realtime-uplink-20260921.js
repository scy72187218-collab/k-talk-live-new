/* K-Talk guest request + approval + camera sync over Supabase Realtime.
   Scope: guest request button, applicant photos, approval, approved guest video sync.
   Does not change red LIVE, room layout, chat position, switches, or home/feed video. */
(function(){
  if(window.__ktGuestRealtimeFullFlow20260921)return;
  window.__ktGuestRealtimeFullFlow20260921=true;

  var URL='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var client=null,libLoading=false;
  var channels={},requests={},approved={},readyGuests={};
  var sourcePeers={},receivePeers={},watchAt={};
  var localGuestStream=null,selfApprovedHost='',selfApprovedToken='';
  var requestedHost='';
  var rosterTimer=null,readyTimer=null;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function viewerId(){return 'viewer_'+deviceId();}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function profile(){
    var p={name:'게스트',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.nickname||x.name||x.displayName||p.name);p.photo=String(x.photo||'');}}catch(e){}
    try{var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.nickname||s.name||s.displayName||p.name);p.photo=String(s.photo||p.photo);}}catch(e){}
    try{p.name=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}
    return p;
  }
  function hostRoomId(){return document.querySelector('.ktg13-room')?deviceId():'';}
  function remoteHostId(){return String(window.__ktRemoteHostId||'');}
  function channelName(hostId){return 'ktalk-guest-room-'+String(hostId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,110);}
  function token(){return 'ap_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
  function sessionId(){return 'gp_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);}
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(!pc||pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||3200);
      function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }

  async function smallPhoto(src){
    src=String(src||'');
    if(!src)return '';
    if(/^https?:/i.test(src)&&src.length<1800)return src;
    if(!/^data:image/i.test(src))return '';
    if(src.length<90000)return src;
    return new Promise(function(resolve){
      try{
        var im=new Image();
        im.onload=function(){
          try{
            var max=112,w=im.naturalWidth||1,h=im.naturalHeight||1,scale=Math.min(1,max/Math.max(w,h));
            var cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(w*scale));cv.height=Math.max(1,Math.round(h*scale));
            var cx=cv.getContext('2d');cx.drawImage(im,0,0,cv.width,cv.height);
            resolve(cv.toDataURL('image/jpeg',.72));
          }catch(e){resolve('');}
        };
        im.onerror=function(){resolve('');};im.src=src;
      }catch(e){resolve('');}
    });
  }

  function ensureStyle(){
    if(document.getElementById('ktGuestRealtimeFullStyle'))return;
    var s=document.createElement('style');s.id='ktGuestRealtimeFullStyle';
    s.textContent=''
      +'#ktGuestPhotoRequestRail{position:absolute!important;right:7px!important;top:132px!important;z-index:150!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:7px!important;max-height:52%!important;overflow-y:auto!important;padding:5px!important;border-radius:18px!important;background:rgba(5,8,12,.42)!important;backdrop-filter:blur(3px)!important;scrollbar-width:none!important;pointer-events:auto!important}'
      +'#ktGuestPhotoRequestRail::-webkit-scrollbar{display:none!important}'
      +'.kt-guest-photo-request{position:relative!important;width:52px!important;height:52px!important;flex:0 0 52px!important;border:2px solid #59ddff!important;border-radius:50%!important;background:#11151c!important;color:#fff!important;padding:0!important;overflow:visible!important;box-shadow:0 0 11px #35d8ff88!important;display:grid!important;place-items:center!important;touch-action:manipulation!important}'
      +'.kt-guest-photo-request img{width:100%!important;height:100%!important;border-radius:50%!important;object-fit:cover!important;display:block!important}'
      +'.kt-guest-photo-request .fallback{font-size:25px!important}.kt-guest-photo-request .name{position:absolute!important;right:58px!important;top:50%!important;transform:translateY(-50%)!important;max-width:110px!important;padding:4px 7px!important;border-radius:9px!important;background:rgba(7,10,15,.94)!important;border:1px solid #4fcff088!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.kt-guest-photo-request .dot{position:absolute!important;right:-2px!important;bottom:-2px!important;width:14px!important;height:14px!important;border-radius:50%!important;background:#39e575!important;border:2px solid #071018!important}'
      +'#ktGuestRealtimeChoice{position:absolute!important;right:66px!important;top:132px!important;z-index:151!important;display:flex!important;gap:5px!important;padding:6px!important;border-radius:12px!important;background:rgba(7,9,13,.98)!important;border:1px solid #454954!important;pointer-events:auto!important}'
      +'#ktGuestRealtimeChoice button{height:31px!important;padding:0 9px!important;border-radius:9px!important;border:1px solid #444!important;background:#17191f!important;color:#fff!important;font-size:9px!important;font-weight:950!important}#ktGuestRealtimeChoice .approve{border-color:#52dfff!important;background:#073342!important}'
      +'.kt-remote-bottom #ktRemoteGuestRequest.kt-requested{color:#77ff9e!important;border-color:#77ff9e88!important;box-shadow:0 0 9px #32d86c66!important}'
      +'@media(max-width:390px){#ktGuestPhotoRequestRail{right:4px!important;top:122px!important}.kt-guest-photo-request{width:46px!important;height:46px!important;flex-basis:46px!important}.kt-guest-photo-request .name{right:51px!important;max-width:90px!important;font-size:8px!important}#ktGuestRealtimeChoice{right:56px!important;top:122px!important}}';
    document.head.appendChild(s);
  }

  function getChannelState(hostId){
    hostId=String(hostId||'');if(!hostId||!client)return null;
    if(channels[hostId])return channels[hostId];
    var st={hostId:hostId,ch:null,ready:false,queue:[]};
    var ch=client.channel(channelName(hostId),{config:{broadcast:{self:false,ack:false},presence:{key:deviceId()}}});
    st.ch=ch;channels[hostId]=st;

    ch.on('broadcast',{event:'guest_request'},function(msg){onRequest(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_cancel'},function(msg){onCancel(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_approved'},function(msg){onApproved(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'approved_roster'},function(msg){onRoster(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_ready'},function(msg){onReady(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_watch'},function(msg){onWatch(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_offer'},function(msg){onOffer(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_answer'},function(msg){onAnswer(hostId,msg&&msg.payload||{});});
    ch.on('broadcast',{event:'guest_left'},function(msg){onGuestLeft(hostId,msg&&msg.payload||{});});

    ch.subscribe(function(status){
      if(status==='SUBSCRIBED'){
        st.ready=true;
        var q=st.queue.splice(0);q.forEach(function(x){sendNow(st,x.event,x.payload);});
        if(hostRoomId()===hostId)broadcastRoster(hostId);
        if(selfApprovedHost===hostId&&selfApprovedToken)broadcastReady(hostId);
      }
    });
    return st;
  }
  function sendNow(st,event,payload){
    try{return Promise.resolve(st.ch.send({type:'broadcast',event:event,payload:payload||{}})).catch(function(){});}catch(e){return Promise.resolve();}
  }
  function emit(hostId,event,payload,retry){
    var st=getChannelState(hostId);if(!st)return;
    if(!st.ready){st.queue.push({event:event,payload:payload});return;}
    sendNow(st,event,payload);
    if(retry){
      [260,720,1450].forEach(function(ms){setTimeout(function(){if(st.ready)sendNow(st,event,payload);},ms);});
    }
  }

  function requestList(hostId){
    if(!requests[hostId])requests[hostId]={};
    return requests[hostId];
  }
  function approvalList(hostId){
    if(!approved[hostId])approved[hostId]={};
    return approved[hostId];
  }

  function renderRequests(hostId){
    ensureStyle();
    if(hostRoomId()!==hostId)return;
    var room=document.querySelector('.ktg13-room');if(!room)return;
    var map=requestList(hostId),items=Object.keys(map).map(function(k){return map[k];}).filter(function(x){return !x.cancelled&&!approvalList(hostId)[x.viewer_id];});
    var rail=document.getElementById('ktGuestPhotoRequestRail');
    if(!items.length){if(rail)rail.remove();var ch=document.getElementById('ktGuestRealtimeChoice');if(ch)ch.remove();return;}
    if(!rail){rail=document.createElement('div');rail.id='ktGuestPhotoRequestRail';room.appendChild(rail);}
    rail.innerHTML='';
    items.forEach(function(x){
      var b=document.createElement('button');b.type='button';b.className='kt-guest-photo-request';b.dataset.viewerId=x.viewer_id;
      var photo=String(x.photo||'');
      b.innerHTML=(photo?'<img src="'+esc(photo)+'" alt="">':'<span class="fallback">👤</span>')+'<span class="name">'+esc(x.name||'게스트')+' 신청</span><span class="dot"></span>';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();openChoice(hostId,x);};
      rail.appendChild(b);
    });
  }
  function openChoice(hostId,x){
    var old=document.getElementById('ktGuestRealtimeChoice');if(old)old.remove();
    var room=document.querySelector('.ktg13-room');if(!room)return;
    var box=document.createElement('div');box.id='ktGuestRealtimeChoice';
    box.innerHTML='<button type="button" class="approve">올리기</button><button type="button" class="reject">거부</button>';
    box.querySelector('.approve').onclick=function(e){e.preventDefault();e.stopPropagation();box.remove();approveGuest(hostId,x);};
    box.querySelector('.reject').onclick=function(e){e.preventDefault();e.stopPropagation();box.remove();delete requestList(hostId)[x.viewer_id];renderRequests(hostId);emit(hostId,'guest_cancel',{viewer_id:x.viewer_id},true);};
    room.appendChild(box);
  }

  function onRequest(hostId,p){
    if(hostRoomId()!==hostId)return;
    var vid=String(p.viewer_id||'');if(!vid)return;
    requestList(hostId)[vid]={viewer_id:vid,name:String(p.name||'게스트'),photo:String(p.photo||''),cancelled:false,at:Date.now()};
    renderRequests(hostId);
  }
  function onCancel(hostId,p){
    var vid=String(p.viewer_id||'');if(!vid)return;
    if(requestList(hostId)[vid])delete requestList(hostId)[vid];
    renderRequests(hostId);
  }

  function hostSlot(vid,name){
    var slot=null;
    try{slot=document.querySelector('.ktg13-guest[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]');}catch(e){}
    if(!slot){
      var all=[].slice.call(document.querySelectorAll('.ktg13-guest'));
      for(var i=0;i<all.length;i++)if(!all[i].dataset.ktGuestViewerId){slot=all[i];break;}
    }
    if(!slot)return null;
    if(!slot.dataset.ktGuestViewerId){
      slot.dataset.ktGuestViewerId=vid;slot.classList.add('kt-guest-approved');
      slot.innerHTML='<video autoplay playsinline muted></video><small>게스트 연결 중...</small><span class="kt-guest-name">👤 '+esc(name||'게스트')+'</span>';
    }
    return slot;
  }
  function viewerSlot(vid,name){
    var grid=document.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid');if(!grid)return null;
    var slot=null;
    try{slot=grid.querySelector('[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]');}catch(e){}
    if(!slot){
      var all=[].slice.call(grid.querySelectorAll('.kt-prejoin-room-cell:not(.host),.ktg13-guest'));
      for(var i=0;i<all.length;i++)if(!all[i].dataset.ktGuestViewerId){slot=all[i];break;}
    }
    if(!slot)return null;
    if(!slot.dataset.ktGuestViewerId){
      slot.dataset.ktGuestViewerId=vid;
      slot.innerHTML='<video autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video><label style="position:absolute;left:4px;bottom:4px;z-index:3;padding:2px 5px;border-radius:7px;background:#000b;color:#fff;font-size:8px">'+esc(name||'게스트')+'</label>';
    }
    return slot;
  }
  function targetSlot(vid,name){
    if(hostRoomId())return hostSlot(vid,name);
    if(document.querySelector('.kt-remote-live'))return viewerSlot(vid,name);
    return null;
  }
  function attachStream(vid,name,stream){
    var slot=targetSlot(vid,name);if(!slot||!stream)return;
    var v=slot.querySelector('video');if(!v){
      v=document.createElement('video');v.autoplay=true;v.playsInline=true;v.muted=true;slot.appendChild(v);
    }
    v.srcObject=stream;v.autoplay=true;v.playsInline=true;v.muted=true;
    v.style.setProperty('width','100%','important');v.style.setProperty('height','100%','important');v.style.setProperty('object-fit','cover','important');v.style.setProperty('object-position','center center','important');
    var sm=slot.querySelector('small');if(sm)sm.style.display='none';
    try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }

  function approveGuest(hostId,x){
    var ap=approvalList(hostId),tok=token();
    ap[x.viewer_id]={viewer_id:x.viewer_id,name:x.name||'게스트',photo:x.photo||'',token:tok,at:Date.now()};
    delete requestList(hostId)[x.viewer_id];
    hostSlot(x.viewer_id,x.name);
    renderRequests(hostId);
    emit(hostId,'guest_approved',{viewer_id:x.viewer_id,name:x.name||'게스트',photo:x.photo||'',token:tok},true);
    broadcastRoster(hostId);
  }
  function broadcastRoster(hostId){
    if(hostRoomId()!==hostId)return;
    var ap=approvalList(hostId),items=Object.keys(ap).map(function(k){return ap[k];});
    emit(hostId,'approved_roster',{items:items},false);
  }
  function onApproved(hostId,p){
    var vid=String(p.viewer_id||''),tok=String(p.token||'');if(!vid||!tok)return;
    approvalList(hostId)[vid]={viewer_id:vid,name:String(p.name||'게스트'),photo:String(p.photo||''),token:tok,at:Date.now()};
    if(requestList(hostId)[vid])delete requestList(hostId)[vid];
    renderRequests(hostId);
    if(vid===viewerId()&&remoteHostId()===hostId){
      selfApprovedHost=hostId;selfApprovedToken=tok;
      var b=document.getElementById('ktRemoteGuestRequest');if(b){b.classList.remove('kt-requested');b.setAttribute('title','참여 승인됨');}
      startLocalGuest(hostId,tok);
    }
  }
  function onRoster(hostId,p){
    var items=Array.isArray(p&&p.items)?p.items:[];
    var ap=approvalList(hostId);
    items.forEach(function(x){if(x&&x.viewer_id&&x.token)ap[String(x.viewer_id)]={viewer_id:String(x.viewer_id),name:String(x.name||'게스트'),photo:String(x.photo||''),token:String(x.token),at:Date.now()};});
    if(remoteHostId()===hostId){
      var me=ap[viewerId()];
      if(me){selfApprovedHost=hostId;selfApprovedToken=me.token;startLocalGuest(hostId,me.token);}
    }
  }

  async function startLocalGuest(hostId,tok){
    if(selfApprovedHost!==hostId||selfApprovedToken!==tok)return;
    var live=false;
    try{live=!!(localGuestStream&&localGuestStream.getVideoTracks&&localGuestStream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(!live){
      try{localGuestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});}
      catch(e){try{localGuestStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});}catch(z){return;}}
    }
    attachStream(viewerId(),profile().name,localGuestStream);
    broadcastReady(hostId);
  }
  function broadcastReady(hostId){
    if(selfApprovedHost!==hostId||!selfApprovedToken||!localGuestStream)return;
    emit(hostId,'guest_ready',{viewer_id:viewerId(),name:profile().name,token:selfApprovedToken},false);
  }
  function onReady(hostId,p){
    var vid=String(p.viewer_id||''),tok=String(p.token||'');if(!vid||!tok)return;
    var ap=approvalList(hostId)[vid];if(!ap||String(ap.token)!==tok)return;
    readyGuests[hostId+'|'+vid]={hostId:hostId,viewer_id:vid,name:String(p.name||ap.name||'게스트'),token:tok,at:Date.now()};
    if(vid===viewerId()&&selfApprovedHost===hostId&&localGuestStream){attachStream(vid,p.name||ap.name,localGuestStream);return;}
    requestGuestStream(hostId,vid);
  }
  function requestGuestStream(hostId,guestId){
    if(guestId===viewerId())return;
    var key=hostId+'|'+guestId,now=Date.now();if(now-Number(watchAt[key]||0)<2200)return;watchAt[key]=now;
    emit(hostId,'guest_watch',{guest_id:guestId,receiver_id:deviceId()},false);
  }

  async function onWatch(hostId,p){
    if(selfApprovedHost!==hostId||viewerId()!==String(p.guest_id||'')||!localGuestStream)return;
    var receiver=String(p.receiver_id||'');if(!receiver||receiver===deviceId())return;
    var key=hostId+'|'+receiver,old=sourcePeers[key];
    if(old){
      try{var st=String(old.pc.connectionState||'');if(st==='connected'||st==='connecting'||st==='new')return;old.pc.close();}catch(e){}
      delete sourcePeers[key];
    }
    var sid=sessionId();
    try{
      var pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
      sourcePeers[key]={pc:pc,session_id:sid};
      localGuestStream.getTracks().forEach(function(t){try{pc.addTrack(t,localGuestStream);}catch(e){}});
      pc.onconnectionstatechange=function(){if(['failed','closed'].indexOf(String(pc.connectionState||''))>-1){try{pc.close();}catch(e){}delete sourcePeers[key];}};
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});await pc.setLocalDescription(offer);await waitIce(pc,3200);
      emit(hostId,'guest_offer',{guest_id:viewerId(),guest_name:profile().name,receiver_id:receiver,session_id:sid,offer_sdp:pc.localDescription.sdp},true);
    }catch(e){try{if(sourcePeers[key])sourcePeers[key].pc.close();}catch(z){}delete sourcePeers[key];}
  }

  async function onOffer(hostId,p){
    if(String(p.receiver_id||'')!==deviceId())return;
    var guestId=String(p.guest_id||''),sid=String(p.session_id||''),sdp=String(p.offer_sdp||'');if(!guestId||!sid||!sdp)return;
    var ap=approvalList(hostId)[guestId];if(!ap)return;
    if(receivePeers[sid])return;
    try{
      var pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
      receivePeers[sid]={pc:pc,guest_id:guestId};
      pc.ontrack=function(ev){attachStream(guestId,String(p.guest_name||ap.name||'게스트'),ev.streams[0]||new MediaStream([ev.track]));};
      pc.onconnectionstatechange=function(){if(['failed','closed'].indexOf(String(pc.connectionState||''))>-1){try{pc.close();}catch(e){}delete receivePeers[sid];setTimeout(function(){requestGuestStream(hostId,guestId);},500);}};
      await pc.setRemoteDescription({type:'offer',sdp:sdp});var ans=await pc.createAnswer();await pc.setLocalDescription(ans);await waitIce(pc,3200);
      emit(hostId,'guest_answer',{guest_id:guestId,receiver_id:deviceId(),session_id:sid,answer_sdp:pc.localDescription.sdp},true);
    }catch(e){try{if(receivePeers[sid])receivePeers[sid].pc.close();}catch(z){}delete receivePeers[sid];}
  }
  async function onAnswer(hostId,p){
    if(selfApprovedHost!==hostId||viewerId()!==String(p.guest_id||''))return;
    var receiver=String(p.receiver_id||''),sid=String(p.session_id||''),key=hostId+'|'+receiver,entry=sourcePeers[key];
    if(!entry||entry.session_id!==sid||!p.answer_sdp)return;
    try{await entry.pc.setRemoteDescription({type:'answer',sdp:String(p.answer_sdp)});}catch(e){}
  }
  function onGuestLeft(hostId,p){
    var vid=String(p.viewer_id||'');if(!vid)return;
    delete approvalList(hostId)[vid];delete requestList(hostId)[vid];delete readyGuests[hostId+'|'+vid];
    var slots=[];try{slots=[].slice.call(document.querySelectorAll('[data-kt-guest-viewer-id="'+CSS.escape(vid)+'"]'));}catch(e){}
    slots.forEach(function(slot){delete slot.dataset.ktGuestViewerId;slot.classList.remove('kt-guest-approved');slot.innerHTML='<span>게스트</span>';});
    renderRequests(hostId);
  }

  async function toggleRequest(){
    var hostId=remoteHostId();if(!hostId)return;
    var b=document.getElementById('ktRemoteGuestRequest'),isOn=!!(b&&b.classList.contains('kt-requested'));
    if(isOn){
      requestedHost='';if(b){b.classList.remove('kt-requested');b.setAttribute('title','방송 참여 신청');b.setAttribute('aria-label','방송 참여 신청');}
      emit(hostId,'guest_cancel',{viewer_id:viewerId()},true);return;
    }
    var p=profile(),photo=await smallPhoto(p.photo);
    requestedHost=hostId;if(b){b.classList.add('kt-requested');b.setAttribute('title','참여 신청 취소');b.setAttribute('aria-label','참여 신청 취소');}
    emit(hostId,'guest_request',{viewer_id:viewerId(),name:p.name||'게스트',photo:photo},true);
  }

  function captureRequestClick(e){
    var b=e.target&&e.target.closest?e.target.closest('#ktRemoteGuestRequest'):null;if(!b)return;
    e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    toggleRequest();
  }

  function tick(){
    ensureStyle();
    var hid=hostRoomId();if(hid)getChannelState(hid);
    var rh=remoteHostId();if(rh)getChannelState(rh);
    if(hid){renderRequests(hid);Object.keys(readyGuests).forEach(function(k){var g=readyGuests[k];if(g&&g.hostId===hid&&Date.now()-g.at<8000)requestGuestStream(hid,g.viewer_id);});}
    if(rh){Object.keys(readyGuests).forEach(function(k){var g=readyGuests[k];if(g&&g.hostId===rh&&Date.now()-g.at<8000)requestGuestStream(rh,g.viewer_id);});}
  }

  function connect(){
    if(client||!window.supabase||typeof window.supabase.createClient!=='function')return;
    try{
      client=window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},realtime:{params:{eventsPerSecond:20}}});
      window.__ktGuestRealtimeFlowActive=true;
      document.addEventListener('click',captureRequestClick,true);
      tick();
      setInterval(tick,650);
      rosterTimer=setInterval(function(){var hid=hostRoomId();if(hid)broadcastRoster(hid);},1800);
      readyTimer=setInterval(function(){if(selfApprovedHost&&selfApprovedToken)broadcastReady(selfApprovedHost);},1800);
    }catch(e){client=null;}
  }
  function loadLib(){
    if(window.supabase&&typeof window.supabase.createClient==='function'){connect();return;}
    if(libLoading)return;libLoading=true;
    var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';s.async=true;
    s.onload=function(){libLoading=false;connect();};s.onerror=function(){libLoading=false;};document.head.appendChild(s);
  }

  window.addEventListener('pagehide',function(){
    var rh=remoteHostId();if(rh)emit(rh,'guest_cancel',{viewer_id:viewerId()},false);
    if(selfApprovedHost)emit(selfApprovedHost,'guest_left',{viewer_id:viewerId()},false);
    Object.keys(sourcePeers).forEach(function(k){try{sourcePeers[k].pc.close();}catch(e){}});
    Object.keys(receivePeers).forEach(function(k){try{receivePeers[k].pc.close();}catch(e){}});
    if(localGuestStream){try{localGuestStream.getTracks().forEach(function(t){t.stop();});}catch(e){}}
  });

  loadLib();
})();