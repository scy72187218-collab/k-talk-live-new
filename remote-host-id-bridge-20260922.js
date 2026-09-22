/* K-Talk remote host-id bridge (2026-09-22)
   Communications only. Persists the selected host id before remote entry so
   realtime WebRTC transport can join the correct host channel immediately.
   No UI/layout/camera/chat/gift/switch changes. */
(function(){
  if(window.__ktRemoteHostIdBridge20260922)return;
  window.__ktRemoteHostIdBridge20260922=true;

  function remember(hostId){
    hostId=String(hostId||'').trim();
    if(!hostId)return;
    window.__ktRemoteHostId=hostId;
    try{sessionStorage.setItem('kt_remote_host_id',hostId);}catch(e){}
    try{window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{detail:{host_id:hostId}}));}catch(e){}
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