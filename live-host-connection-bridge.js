/* K-Talk LIVE 사람 접속 전용: 방송자 등록·유지·WebRTC 신호 처리만 담당. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveHostConnectionBridgeInstalled)return;
  window.__ktLiveHostConnectionBridgeInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
  var active=false,roomId='',registering=false,misses=0,lastBeat=0,lastSignal=0,peers={};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('live bridge '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function nowIso(){return new Date().toISOString();}
  function deviceId(){
    var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function hasLiveTrack(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}catch(e){return false;}
  }
  function findStream(){
    try{if(window.state&&hasLiveTrack(window.state.stream))return window.state.stream;}catch(e){}
    try{
      var videos=document.querySelectorAll('#screen video,video');
      for(var i=0;i<videos.length;i++){
        var s=videos[i]&&videos[i].srcObject;
        if(hasLiveTrack(s)){
          try{if(window.state)window.state.stream=s;}catch(e){}
          return s;
        }
      }
    }catch(e){}
    return null;
  }
  function inHostRoom(){
    try{
      var screen=document.getElementById('screen');if(!screen)return false;
      if(screen.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room'))return true;
      var txt=String(screen.innerText||'');
      return txt.indexOf('ON AIR')>-1||txt.indexOf('방송 중')>-1;
    }catch(e){return false;}
  }
  function profile(){
    var p={name:'K-Talk 방송자',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||p.name);p.photo=String(x.photo||'');}}catch(e){}
    try{if((!p.name||p.name==='K-Talk 방송자')&&window.ktGetSelectedSubAccount&&window.ktSubProfileCard){var sub=window.ktGetSelectedSubAccount();if(sub){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.name||p.name);p.photo=String(s.photo||p.photo);}}}catch(e){}
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
  }
  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    try{if(window.state){type=String(window.state.liveRoomType||type);name=String(window.state.liveRoomName||name);}}catch(e){}
    try{
      if(document.querySelector('.ktg13-room')){type='group13';name='13명 방송';}
      else if(document.querySelector('.ktg9-room')){type='group9';name='9명 방송';}
      else if(document.querySelector('.ktsubscriber-room')){type='subscriber';name='구독자 방송';}
      else if(document.querySelector('.ktsecret-room')){type='password';name='비밀방';}
      else if(document.querySelector('.ktsolo-room')){type='solo';name='1인 방송';}
    }catch(e){}
    if(type==='group')type='group13';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }
  function waitIce(pc,ms){
    return new Promise(function(resolve){
      if(pc.iceGatheringState==='complete')return resolve();
      var done=false,t=setTimeout(finish,ms||4500);
      function finish(){if(done)return;done=true;clearTimeout(t);pc.removeEventListener('icegatheringstatechange',on);resolve();}
      function on(){if(pc.iceGatheringState==='complete')finish();}
      pc.addEventListener('icegatheringstatechange',on);
    });
  }

  async function register(stream){
    if(active||registering||!stream)return;
    registering=true;
    var hostId=deviceId(),p=profile(),r=roomInfo(),stamp=nowIso();
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
      var rows=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      roomId=rows&&rows[0]?rows[0].id:'';
      active=!!roomId;lastBeat=Date.now();lastSignal=0;
    }catch(e){active=false;roomId='';}
    registering=false;
  }

  async function heartbeat(){
    if(!active||!roomId)return;
    try{await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});lastBeat=Date.now();}
    catch(e){active=false;roomId='';}
  }

  async function processSignals(stream){
    if(!active||!stream)return;
    var hostId=deviceId();
    try{
      var rows=await req('ktalk_webrtc_sessions?select=id,host_id,viewer_id,offer_sdp,answer_sdp,active,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=created_at.asc&limit=30');
      for(var i=0;i<(rows||[]).length;i++){
        var x=rows[i],entry=peers[x.id];
        if(!entry&&x.offer_sdp==='pending'){
          var pc=new RTCPeerConnection(ICE);entry={pc:pc,remoteSet:false};peers[x.id]=entry;
          stream.getTracks().forEach(function(t){try{pc.addTrack(t,stream);}catch(e){}});
          pc.onconnectionstatechange=(function(id,p){return function(){if(['failed','closed'].indexOf(p.connectionState)>-1&&peers[id]){try{p.close();}catch(e){}delete peers[id];}};})(x.id,pc);
          try{
            var offer=await pc.createOffer({offerToReceiveAudio:false,offerToReceiveVideo:false});
            await pc.setLocalDescription(offer);await waitIce(pc,5000);
            await req('ktalk_webrtc_sessions?id=eq.'+enc(x.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({offer_sdp:pc.localDescription.sdp,updated_at:nowIso()})});
          }catch(e){try{pc.close();}catch(z){}delete peers[x.id];}
        }else if(entry&&x.answer_sdp&&!entry.remoteSet){
          try{await entry.pc.setRemoteDescription({type:'answer',sdp:x.answer_sdp});entry.remoteSet=true;}catch(e){}
        }
      }
    }catch(e){}
  }

  async function stop(){
    if(!active&&!roomId)return;
    var id=roomId;active=false;roomId='';
    Object.keys(peers).forEach(function(k){try{peers[k].pc.close();}catch(e){}});peers={};
    try{if(id)await req('ktalk_live_rooms?id=eq.'+enc(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
  }

  async function tick(){
    var room=inHostRoom(),stream=findStream();
    if(room&&stream){
      misses=0;
      if(!active)await register(stream);
      if(active&&Date.now()-lastBeat>9000)await heartbeat();
      if(active&&Date.now()-lastSignal>1100){lastSignal=Date.now();processSignals(stream);}
    }else if(active){
      misses++;
      if(misses>=4){misses=0;await stop();}
    }
  }

  setInterval(tick,700);
  setTimeout(tick,100);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(tick,80);});
  window.addEventListener('pageshow',function(){setTimeout(tick,80);});
  window.addEventListener('pagehide',function(){if(active&&roomId){try{fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});}catch(e){}}});
})();