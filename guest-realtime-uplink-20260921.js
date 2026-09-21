/* K-Talk guest camera approval/uplink bridge.
   Uses Supabase Realtime Broadcast only for guest approval + guest camera SDP.
   Does not change room layout, chat positions, switches, feed video, or the red LIVE lock. */
(function(){
  if(window.__ktGuestRealtimeUplink20260921)return;
  window.__ktGuestRealtimeUplink20260921=true;

  var URL='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var client=null,channels={},approved={},hostPeers={},viewerPeer=null,viewerStream=null;
  var libLoading=false;

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
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,'');}
  function roomHostId(){return document.querySelector('.ktg13-room')?deviceId():'';}
  function remoteHostId(){return String(window.__ktRemoteHostId||'');}
  function channelName(hostId){return 'ktalk-guest-uplink-'+String(hostId||'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,120);}
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||3500);
      function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }
  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        return String(p.name||p.nickname||p.displayName||'게스트');
      }
    }catch(e){}
    return '게스트';
  }

  function firstFreeSlot(){
    var all=[].slice.call(document.querySelectorAll('.ktg13-guest'));
    for(var i=0;i<all.length;i++)if(!all[i].dataset.ktGuestViewerId)return all[i];
    return null;
  }
  function findSlot(vid){
    try{return document.querySelector('.ktg13-guest[data-kt-guest-viewer-id="'+CSS.escape(String(vid))+'"]');}catch(e){return null;}
  }
  function ensureSlot(vid,name){
    var slot=findSlot(vid)||firstFreeSlot();
    if(!slot)return null;
    if(!slot.dataset.ktGuestViewerId){
      slot.dataset.ktGuestViewerId=vid;
      slot.classList.add('kt-guest-approved');
      slot.innerHTML='<video autoplay playsinline muted></video><small>게스트 연결 중...</small><span class="kt-guest-name">👤 '+esc(name||'게스트')+'</span>';
    }
    return slot;
  }

  function send(ch,event,payload){
    if(!ch)return Promise.resolve(false);
    try{
      return Promise.resolve(ch.send({type:'broadcast',event:event,payload:payload||{}}))
        .then(function(){return true;}).catch(function(){return false;});
    }catch(e){return Promise.resolve(false);}
  }
  function sendRetry(ch,event,payload){
    [0,220,650,1300].forEach(function(ms){setTimeout(function(){send(ch,event,payload);},ms);});
  }

  async function hostHandleOffer(hostId,payload){
    if(!payload)return;
    var vid=String(payload.viewer_id||''),sid=String(payload.session_id||''),sdp=String(payload.offer_sdp||'');
    if(!vid||!sid||!sdp||!approved[vid])return;
    var ch=channels[hostId];if(!ch)return;

    if(hostPeers[sid])return;
    var slot=ensureSlot(vid,payload.viewer_name||'게스트');if(!slot)return;

    try{
      var pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
      hostPeers[sid]=pc;
      pc.ontrack=function(ev){
        var v=slot.querySelector('video'),sm=slot.querySelector('small');
        if(v){
          v.srcObject=ev.streams[0]||new MediaStream([ev.track]);
          v.autoplay=true;v.playsInline=true;v.muted=true;
          v.style.setProperty('width','100%','important');
          v.style.setProperty('height','100%','important');
          v.style.setProperty('object-fit','cover','important');
          v.style.setProperty('object-position','center center','important');
          try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        }
        if(sm)sm.style.display='none';
      };
      pc.onconnectionstatechange=function(){
        if(['failed','closed'].indexOf(String(pc.connectionState||''))>-1){
          try{pc.close();}catch(e){}
          delete hostPeers[sid];
        }
      };
      await pc.setRemoteDescription({type:'offer',sdp:sdp});
      var answer=await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitIce(pc,3500);
      sendRetry(ch,'guest_answer',{
        host_id:hostId,viewer_id:vid,session_id:sid,answer_sdp:pc.localDescription.sdp
      });
    }catch(e){
      try{if(hostPeers[sid])hostPeers[sid].close();}catch(z){}
      delete hostPeers[sid];
    }
  }

  async function viewerStartUplink(hostId){
    var vid=viewerId(),ch=channels[hostId];if(!ch)return;
    if(viewerPeer){
      try{
        var st=String(viewerPeer.pc.connectionState||'');
        if(st==='connected'||st==='connecting'||st==='new')return;
        viewerPeer.pc.close();
      }catch(e){}
      viewerPeer=null;
    }

    var stream=viewerStream;
    var live=false;
    try{live=!!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){}
    if(!live){
      try{
        stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'}},audio:true});
      }catch(e){
        try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});}
        catch(z){return;}
      }
      viewerStream=stream;
    }

    var sid='rt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);
    try{
      var pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
      viewerPeer={pc:pc,hostId:hostId,viewerId:vid,sessionId:sid};
      stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream);}catch(e){}});
      pc.onconnectionstatechange=function(){
        var st=String(pc.connectionState||'');
        if(st==='failed'||st==='closed'){
          try{pc.close();}catch(e){}
          if(viewerPeer&&viewerPeer.sessionId===sid)viewerPeer=null;
        }
      };
      var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
      await pc.setLocalDescription(offer);
      await waitIce(pc,3500);
      sendRetry(ch,'guest_offer',{
        host_id:hostId,viewer_id:vid,viewer_name:profileName(),session_id:sid,offer_sdp:pc.localDescription.sdp
      });
    }catch(e){
      try{if(viewerPeer)viewerPeer.pc.close();}catch(z){}
      viewerPeer=null;
    }
  }

  async function viewerHandleAnswer(hostId,payload){
    if(!viewerPeer||!payload)return;
    if(String(payload.viewer_id||'')!==viewerPeer.viewerId)return;
    if(String(payload.session_id||'')!==viewerPeer.sessionId)return;
    if(!payload.answer_sdp)return;
    try{
      await viewerPeer.pc.setRemoteDescription({type:'answer',sdp:String(payload.answer_sdp)});
    }catch(e){}
  }

  function ensureChannel(hostId){
    hostId=String(hostId||'');if(!hostId||!client)return null;
    if(channels[hostId])return channels[hostId];
    var ch=client.channel(channelName(hostId),{config:{broadcast:{self:false,ack:false},presence:{key:deviceId()}}});
    ch.on('broadcast',{event:'guest_approved'},function(msg){
      var p=msg&&msg.payload||{};
      if(String(p.viewer_id||'')===viewerId()&&remoteHostId()===hostId)viewerStartUplink(hostId);
    });
    ch.on('broadcast',{event:'guest_offer'},function(msg){
      if(roomHostId()===hostId)hostHandleOffer(hostId,msg&&msg.payload||{});
    });
    ch.on('broadcast',{event:'guest_answer'},function(msg){
      if(remoteHostId()===hostId)viewerHandleAnswer(hostId,msg&&msg.payload||{});
    });
    ch.subscribe();
    channels[hostId]=ch;
    return ch;
  }

  function connect(){
    if(client||!window.supabase||typeof window.supabase.createClient!=='function')return;
    try{
      client=window.supabase.createClient(URL,KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
      tick();
    }catch(e){client=null;}
  }
  function loadLib(){
    if(window.supabase&&typeof window.supabase.createClient==='function'){connect();return;}
    if(libLoading)return;libLoading=true;
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.async=true;
    s.onload=function(){libLoading=false;connect();};
    s.onerror=function(){libLoading=false;};
    document.head.appendChild(s);
  }

  function wrapEnter(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function'||old.__ktGuestRealtimeEnter)return;
    var fn=function(hostId){
      window.__ktRemoteHostId=String(hostId||'');
      var ch=ensureChannel(window.__ktRemoteHostId);
      return old.apply(this,arguments);
    };
    fn.__ktGuestRealtimeEnter=true;
    window.ktEnterRemoteLive=fn;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktGuestRealtimeLeave)return;
    var fn=function(){
      var r=old.apply(this,arguments);
      window.__ktRemoteHostId='';
      if(viewerPeer){try{viewerPeer.pc.close();}catch(e){}viewerPeer=null;}
      if(viewerStream){try{viewerStream.getTracks().forEach(function(t){t.stop();});}catch(e){}viewerStream=null;}
      return r;
    };
    fn.__ktGuestRealtimeLeave=true;
    window.ktLeaveRemoteLive=fn;
  }
  function wrapApprove(){
    var old=window.ktApproveGuest;
    if(typeof old!=='function'||old.__ktGuestRealtimeApprove)return;
    var fn=function(vid,name,slot){
      vid=String(vid||'');
      approved[vid]=true;
      var hostId=deviceId(),ch=ensureChannel(hostId);
      var r=old.apply(this,arguments);
      sendRetry(ch,'guest_approved',{host_id:hostId,viewer_id:vid,viewer_name:String(name||'게스트')});
      return r;
    };
    fn.__ktGuestRealtimeApprove=true;
    window.ktApproveGuest=fn;
  }

  function tick(){
    wrapEnter();wrapLeave();wrapApprove();
    var hid=roomHostId();if(hid)ensureChannel(hid);
    var rh=remoteHostId();if(rh)ensureChannel(rh);
  }

  setInterval(tick,500);
  loadLib();
  tick();
})();