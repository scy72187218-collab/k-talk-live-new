/* K-Talk remote host-id bridge (2026-09-22)
   Communications only. Persists the selected host id before remote entry so
   realtime WebRTC transport can join the correct host channel immediately.
   No UI/layout/camera/chat/gift/switch changes. */
(function(){
  if(window.__ktRemoteHostIdBridge20260922)return;
  window.__ktRemoteHostIdBridge20260922=true;

  function captureEntryHostStream20260925(){
    var best=null,bestDist=Infinity,vh=innerHeight||document.documentElement.clientHeight||0;
    try{
      document.querySelectorAll('#screen video,.video-home video,.media video').forEach(function(v){
        try{
          var r=v.getBoundingClientRect();
          if(r.width<20||r.height<20||r.bottom<=0||r.top>=vh)return;
          var d=Math.abs(((r.top+r.bottom)/2)-(vh/2));
          if(d<bestDist){best=v;bestDist=d;}
        }catch(e){}
      });
    }catch(e){}
    if(!best)return null;
    var s=null;
    try{
      s=best.srcObject||null;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}))return s;
    }catch(e){}
    try{
      var fn=best.captureStream||best.mozCaptureStream;
      if(typeof fn==='function'){
        s=fn.call(best);
        if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}))return s;
      }
    }catch(e){}
    return null;
  }

  function remember(hostId){
    hostId=String(hostId||'').trim();
    if(!hostId)return;
    var entryStream=null;
    try{
      entryStream=captureEntryHostStream20260925();
      if(entryStream)window.__ktEntryHostStream20260925=entryStream;
    }catch(e){}
    window.__ktRemoteHostId=hostId;
    window.__ktCurrentRemoteHostId=hostId;
    try{sessionStorage.setItem('kt_remote_host_id',hostId);}catch(e){}
    try{window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{detail:{host_id:hostId,entry_stream:entryStream||null}}));}catch(e){}
  }

  function clear(){
    window.__ktRemoteHostId='';
    try{sessionStorage.removeItem('kt_remote_host_id');}catch(e){}
  }

  function wrapEnter(){
    var old=window.ktEnterRemoteLive;
    if(typeof old!=='function'||old.__ktRemoteHostIdBridge)return;
    var fn=function(hostId){
      remember(hostId);
      var r=old.apply(this,arguments);
      if(r&&typeof r.then==='function'){
        return r.catch(function(err){
          /* Entry failed: only clear when remote UI did not open. */
          setTimeout(function(){
            try{
              if(!document.documentElement.classList.contains('kt-remote-viewing'))clear();
            }catch(e){}
          },0);
          throw err;
        });
      }
      return r;
    };
    fn.__ktRemoteHostIdBridge=true;
    window.ktEnterRemoteLive=fn;
  }

  function wrapLeave(){
    var old=window.ktLeaveRemoteLive;
    if(typeof old!=='function'||old.__ktRemoteHostIdBridge)return;
    var fn=function(){
      var r=old.apply(this,arguments);
      if(r&&typeof r.then==='function')return r.finally(clear);
      clear();
      return r;
    };
    fn.__ktRemoteHostIdBridge=true;
    window.ktLeaveRemoteLive=fn;
  }

  wrapEnter();
  wrapLeave();

  /* Other runtime helpers can wrap entry/leave later, so keep the bridge installed. */
  setInterval(function(){
    wrapEnter();
    wrapLeave();
  },500);

  /* Do not re-dispatch the same host-selected event from its own listener.
     The previous loop could recursively fire and delay guest video entry. */
})();