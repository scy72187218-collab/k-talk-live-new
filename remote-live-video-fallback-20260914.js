/* K-Talk 원격 시청 영상이 검게 멈출 때만 WebRTC 재연결 보강. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktRemoteLiveVideoFallback20260914)return;
  window.__ktRemoteLiveVideoFallback20260914=true;

  var BASE='',KEY='',currentHost='',fallback=null,checkTimer=null,retryCount=0;
  var ICE={iceServers:[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302','stun:stun.cloudflare.com:3478','stun:global.stun.twilio.com:3478']}],iceCandidatePoolSize:4};

  async function ensureConfig(){
    if(BASE&&KEY)return;
    var r=await fetch('live-presence.js?v=20260910-live1',{cache:'no-store'});
    if(!r.ok)throw new Error('live config');
    var t=await r.text();
    var bm=t.match(/var BASE='([^']+)'/),km=t.match(/var KEY='([^']+)'/);
    if(!bm||!km)throw new Error('live config');
    BASE=bm[1];KEY=km[1];
  }
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){await ensureConfig();opt=opt||{};opt.headers=headers(opt.headers);var r=await fetch(BASE+path,opt);if(!r.ok)throw new Error('fallback '+r.status);if(r.status===204)return null;var t=await r.text();return t?JSON.parse(t):null;}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function now(){return new Date().toISOString();}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}return id;}
  function videoWorking(){var v=document.getElementById('ktRemoteLiveVideo');if(!v)return false;try{var s=v.srcObject,tracks=s&&s.getVideoTracks?s.getVideoTracks():[];return !!(v.videoWidth>0&&v.readyState>=2&&tracks.some(function(t){return t.readyState==='live'&&!t.muted;}));}catch(e){return false;}}
  function waitIce(pc,ms){return new Promise(function(resolve){if(pc.iceGatheringState==='complete')return resolve();var done=false,t=setTimeout(finish,ms||7000);function finish(){if(done)return;done=true;clearTimeout(t);try{pc.removeEventListener('icegatheringstatechange',on);}catch(e){}resolve();}function on(){if(pc.iceGatheringState==='complete')finish();}pc.addEventListener('icegatheringstatechange',on);});}

  async function closeFallback(){
    clearTimeout(checkTimer);checkTimer=null;
    var f=fallback;fallback=null;
    if(!f)return;
    clearInterval(f.signalTimer);
    clearTimeout(f.failTimer);
    try{f.pc.close();}catch(e){}
    try{await req('ktalk_webrtc_sessions?id=eq.'+enc(f.sessionId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
  }

  async function startFallback(hostId){
    if(!hostId||fallback||videoWorking()||!document.querySelector('.kt-remote-live'))return;
    try{
      var viewerId='viewer_fallback_'+deviceId()+'_'+Date.now().toString(36);
      var rows=await req('ktalk_webrtc_sessions',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,viewer_id:viewerId,offer_sdp:'pending',answer_sdp:null,active:true,updated_at:now()})});
      var sessionId=rows&&rows[0]?rows[0].id:'';if(!sessionId)return;
      var pc=new RTCPeerConnection(ICE);
      var ctx={hostId:hostId,viewerId:viewerId,sessionId:sessionId,pc:pc,answered:false,signalTimer:null,failTimer:null};
      fallback=ctx;
      pc.ontrack=function(ev){
        var v=document.getElementById('ktRemoteLiveVideo');
        if(v){try{v.srcObject=ev.streams[0]||new MediaStream([ev.track]);v.muted=false;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
        var st=document.getElementById('ktRemoteLiveStatus');if(st)st.style.display='none';
      };
      pc.onconnectionstatechange=function(){
        if(fallback!==ctx)return;
        var st=document.getElementById('ktRemoteLiveStatus');
        if(pc.connectionState==='connected'){
          if(st)st.style.display='none';
        }else if((pc.connectionState==='failed'||pc.connectionState==='disconnected')&&!videoWorking()){
          if(st){st.style.display='block';st.textContent='영상 다시 연결 중…';}
          if(retryCount<2){retryCount++;setTimeout(function(){if(fallback===ctx){closeFallback().then(function(){startFallback(currentHost);});}},900);}
        }
      };
      ctx.signalTimer=setInterval(async function(){
        if(fallback!==ctx)return;
        try{
          var a=await req('ktalk_webrtc_sessions?select=id,offer_sdp,active&id=eq.'+enc(sessionId)+'&limit=1');var x=a&&a[0];
          if(!x||!x.active)return;
          if(x.offer_sdp&&x.offer_sdp!=='pending'&&!ctx.answered){
            await pc.setRemoteDescription({type:'offer',sdp:x.offer_sdp});
            var ans=await pc.createAnswer();await pc.setLocalDescription(ans);await waitIce(pc,7000);
            await req('ktalk_webrtc_sessions?id=eq.'+enc(sessionId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({answer_sdp:pc.localDescription.sdp,updated_at:now()})});
            ctx.answered=true;
          }
        }catch(e){}
      },900);
      ctx.failTimer=setTimeout(function(){
        if(fallback===ctx&&!videoWorking()&&retryCount<2){retryCount++;closeFallback().then(function(){startFallback(currentHost);});}
      },12000);
    }catch(e){}
  }

  function schedule(hostId){
    clearTimeout(checkTimer);
    checkTimer=setTimeout(function(){if(!videoWorking())startFallback(hostId);},3500);
  }

  function wrapEnter(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function'||old.__ktVideoFallbackWrapped)return;
    var fn=async function(hostId){
      currentHost=String(hostId||'');retryCount=0;
      await closeFallback();
      var r=await old.apply(this,arguments);
      schedule(currentHost);
      return r;
    };
    fn.__ktVideoFallbackWrapped=true;
    window.ktEnterRemoteLive=fn;
  }
  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktVideoFallbackWrapped)return;
    var fn=async function(){currentHost='';retryCount=0;await closeFallback();return old.apply(this,arguments);};
    fn.__ktVideoFallbackWrapped=true;
    window.ktLeaveRemoteLive=fn;
  }

  wrapEnter();wrapLeave();
  setInterval(function(){wrapEnter();wrapLeave();},1800);
  window.addEventListener('pagehide',function(){try{if(fallback&&fallback.pc)fallback.pc.close();}catch(e){}});
})();
