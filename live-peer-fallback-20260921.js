/* K-Talk LIVE entry fallback used only when Supabase DB signaling is unavailable.
   Does not change room layouts, chat, switches, feed playback, or protected UI. */
(function(){
  if(window.__ktLivePeerFallback20260921)return;
  window.__ktLivePeerFallback20260921=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var API='/api/live-peer-memory';
  var BEACON='/api/live-beacon-memory';
  var INTERACT='/api/live-interaction-memory';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var hostPeers={};
  var viewer=null;
  var oldEnter=window.ktEnterRemoteLive;
  var oldLeave=window.ktLeaveRemoteLive;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function stream(){
    try{return window.state&&state.stream?state.stream:null;}catch(e){return null;}
  }
  function actualHostRoomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen')||document;
      return !!s.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
    }catch(e){return false;}
  }
  function hasLiveVideo(){
    try{
      var s=stream();
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }
  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        if(p.name)return String(p.name);
      }
    }catch(e){}
    return '게스트';
  }

  async function jfetch(url,opt,timeout){
    var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
    var timer=ctrl?setTimeout(function(){ctrl.abort();},timeout||2500):null;
    try{
      var o=Object.assign({cache:'no-store'},opt||{});
      if(ctrl)o.signal=ctrl.signal;
      var r=await fetch(url,o);
      if(timer)clearTimeout(timer);
      if(!r.ok)throw new Error('http '+r.status);
      return await r.json();
    }catch(e){
      if(timer)clearTimeout(timer);
      throw e;
    }
  }

  async function dbAvailable(hostId){
    if(Number(window.__ktPrimaryLiveDbDownUntil||0)>Date.now())return false;
    try{
      var ctrl=new AbortController();
      var timer=setTimeout(function(){ctrl.abort();},450);
      var r=await fetch(BASE+'ktalk_live_rooms?select=id&host_id=eq.'+enc(hostId)+'&active=eq.true&limit=1',{
        cache:'no-store',
        headers:{apikey:KEY,Authorization:'Bearer '+KEY},
        signal:ctrl.signal
      });
      clearTimeout(timer);
      if(r.ok){window.__ktPrimaryLiveDbDownUntil=0;return true;}
      window.__ktPrimaryLiveDbDownUntil=Date.now()+120000;
      return false;
    }catch(e){
      window.__ktPrimaryLiveDbDownUntil=Date.now()+120000;
      return false;
    }
  }

  function interactionPost(action,hostId,viewerId,viewerName){
    try{
      fetch(INTERACT+'?t='+Date.now(),{
        method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:action,host_id:hostId,viewer_id:viewerId,viewer_name:viewerName||profileName()})
      }).catch(function(){});
    }catch(e){}
  }

  async function beaconRoom(hostId){
    try{
      var j=await jfetch(BEACON+'?t='+Date.now(),null,1800);
      var rows=Array.isArray(j&&j.rooms)?j.rooms:[];
      return rows.find(function(x){return String(x.host_id||'')===String(hostId);})||null;
    }catch(e){return null;}
  }

  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||4500);
      function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }

  function renderRemote(room){
    try{
      document.documentElement.classList.add('kt-remote-viewing');
      var s=document.getElementById('screen');if(!s)return false;
      s.innerHTML='<section class="kt-remote-live"><video id="ktRemoteLiveVideo" autoplay playsinline></video><div class="kt-remote-shade"></div><div class="kt-remote-top"><button class="kt-remote-back" type="button">‹</button><div class="kt-remote-meta"><b><i class="kt-live-dot"></i>'+String(room.host_name||'K-Talk').replace(/[&<>"]/g,'')+'</b><span>'+String(room.title||room.room_name||'라이브').replace(/[&<>"]/g,'')+' · '+String(room.room_name||'방송').replace(/[&<>"]/g,'')+'</span></div><div id="ktRemoteViewerCount" class="kt-remote-viewers">👁 연결 중</div></div><div id="ktRemoteLiveStatus" class="kt-remote-status">방송 영상 연결 중…</div></section>';
      var back=s.querySelector('.kt-remote-back');
      if(back)back.onclick=function(){window.ktLeaveRemoteLive();};
      return true;
    }catch(e){return false;}
  }

  function closeViewer(silent){
    var c=viewer;viewer=null;
    if(!c)return false;
    clearInterval(c.poll);
    clearInterval(c.touch);
    try{c.pc.close();}catch(e){}
    try{
      fetch(API+'?t='+Date.now(),{
        method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'end',session_id:c.sessionId})
      });
    }catch(e){}
    interactionPost('leave',c.hostId,c.viewerId,c.viewerName);
    window.__ktRemoteHostStream=null;
    document.documentElement.classList.remove('kt-remote-viewing');
    if(!silent){
      try{if(window.openBroadcastList)window.openBroadcastList();else if(window.friends)window.friends();}catch(e){}
    }
    return true;
  }

  async function pollViewer(){
    if(!viewer||viewer.answered)return;
    var c=viewer;
    try{
      var j=await jfetch(API+'?session_id='+enc(c.sessionId)+'&t='+Date.now(),null,1800);
      var x=j&&j.session;
      if(!x||!x.active){closeViewer(false);return;}
      if(x.offer_sdp&&x.offer_sdp!=='pending'){
        await c.pc.setRemoteDescription({type:'offer',sdp:x.offer_sdp});
        var answer=await c.pc.createAnswer();
        await c.pc.setLocalDescription(answer);
        await waitIce(c.pc,4500);
        await jfetch(API+'?t='+Date.now(),{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({action:'answer',session_id:c.sessionId,answer_sdp:c.pc.localDescription.sdp})
        },2200);
        c.answered=true;
        var st=document.getElementById('ktRemoteLiveStatus');
        if(st)st.textContent='영상 연결 확인 중…';
      }
    }catch(e){}
  }

  async function enterMemory(hostId){
    var room=await beaconRoom(hostId);
    if(!room)return false;
    if(!renderRemote(room))return false;

    var viewerId='viewer_'+deviceId();
    var created=await jfetch(API+'?t='+Date.now(),{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'create',host_id:hostId,viewer_id:viewerId})
    },2200);
    var sid=created&&created.id;
    if(!sid)throw new Error('memory session');

    var pc=new RTCPeerConnection(ICE);
    viewer={hostId:hostId,viewerId:viewerId,viewerName:profileName(),sessionId:sid,pc:pc,answered:false,poll:null,touch:null};
    interactionPost('join',hostId,viewerId,viewer.viewerName);

    pc.ontrack=function(ev){
      var hs=ev.streams[0]||new MediaStream([ev.track]);
      window.__ktRemoteHostStream=hs;
      var v=document.getElementById('ktRemoteLiveVideo');
      if(v){v.srcObject=hs;v.play().catch(function(){});}
      var st=document.getElementById('ktRemoteLiveStatus');
      if(st)st.style.display='none';
      var badge=document.getElementById('ktRemoteViewerCount');
      if(badge)badge.textContent='👁 LIVE';
    };
    pc.onconnectionstatechange=function(){
      var st=document.getElementById('ktRemoteLiveStatus');
      if(pc.connectionState==='connected'){if(st)st.style.display='none';return;}
      if(pc.connectionState==='failed'){
        if(st){st.style.display='block';st.textContent='영상 연결을 다시 확인해 주세요.';}
      }
    };

    viewer.poll=setInterval(pollViewer,700);
    viewer.touch=setInterval(function(){
      if(!viewer)return;
      fetch(API+'?t='+Date.now(),{
        method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'touch',session_id:sid})
      }).catch(function(){});
      interactionPost('heartbeat',hostId,viewerId,viewer.viewerName);
    },2500);
    pollViewer();
    return true;
  }

  async function hostPoll(){
    if(!actualHostRoomVisible()||!hasLiveVideo())return;
    var hostId=deviceId(),s=stream();if(!s)return;
    try{
      var j=await jfetch(API+'?host_id='+enc(hostId)+'&t='+Date.now(),null,1600);
      var sessions=Array.isArray(j&&j.sessions)?j.sessions:[];
      for(var i=0;i<sessions.length;i++){
        var x=sessions[i],entry=hostPeers[x.id];
        if(!entry&&x.offer_sdp==='pending'){
          var pc=new RTCPeerConnection(ICE);
          hostPeers[x.id]={pc:pc,remoteSet:false};
          entry=hostPeers[x.id];
          s.getTracks().forEach(function(t){try{pc.addTrack(t,s);}catch(e){}});
          pc.onconnectionstatechange=(function(id,p){return function(){
            if(['failed','closed'].indexOf(p.connectionState)>-1){
              try{p.close();}catch(e){}
              delete hostPeers[id];
            }
          };})(x.id,pc);
          try{
            var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
            await pc.setLocalDescription(offer);
            await waitIce(pc,4500);
            await jfetch(API+'?t='+Date.now(),{
              method:'POST',headers:{'Content-Type':'application/json'},
              body:JSON.stringify({action:'offer',session_id:x.id,offer_sdp:pc.localDescription.sdp})
            },2200);
          }catch(e){
            try{pc.close();}catch(z){}
            delete hostPeers[x.id];
          }
        }else if(entry&&x.answer_sdp&&!entry.remoteSet){
          try{
            await entry.pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});
            entry.remoteSet=true;
          }catch(e){}
        }
      }
    }catch(e){}
  }

  window.ktEnterRemoteLive=async function(hostId){
    hostId=String(hostId||'');if(!hostId)return;
    /* If DB signaling responds, preserve the original working path. */
    if(await dbAvailable(hostId)){
      return oldEnter?oldEnter(hostId):undefined;
    }
    try{
      var ok=await enterMemory(hostId);
      if(!ok){
        if(oldEnter)return oldEnter(hostId);
        alert('방송 연결 정보를 찾지 못했습니다.');
      }
    }catch(e){
      document.documentElement.classList.remove('kt-remote-viewing');
      viewer=null;
      alert('방송 영상 연결을 시작하지 못했습니다. 다시 눌러 주세요.');
    }
  };

  window.ktLeaveRemoteLive=async function(silent){
    if(viewer){
      closeViewer(!!silent);
      return;
    }
    if(oldLeave)return oldLeave(silent);
  };

  setInterval(hostPoll,650);
  setTimeout(hostPoll,350);
})();