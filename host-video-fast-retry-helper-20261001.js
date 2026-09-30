/* K-Talk host video fast retry helper 2026-10-01
   Auxiliary only. Does not modify locked host-video or red-LIVE files.
   If a viewer enters a room but the remote host stream still has not arrived,
   re-announce the same selected host a small number of times. */
(function(){
  if(window.__ktHostVideoFastRetryHelper20261001)return;
  window.__ktHostVideoFastRetryHelper20261001=true;

  var timers=[];

  function clearTimers(){
    timers.forEach(function(t){try{clearTimeout(t);}catch(e){}});
    timers=[];
  }

  function hostId(){
    try{
      return String(
        window.__ktRemoteHostId||
        window.__ktCurrentRemoteHostId||
        sessionStorage.getItem('kt_remote_host_id')||
        ''
      ).trim();
    }catch(e){return '';}
  }

  function streamReady(){
    try{
      var s=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}))return true;
      var v=document.querySelector('#ktRemoteLiveVideo,#ktRemoteHostPreview,.kt-guest-hostlike-room .kgh-cell.host video');
      return !!(v&&v.srcObject&&v.readyState>=2&&v.videoWidth>0&&v.videoHeight>0);
    }catch(e){return false;}
  }

  function kick(expected){
    if(streamReady())return;
    var hid=hostId();
    if(!hid||hid!==expected)return;
    try{
      window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{
        detail:{host_id:hid,fast_retry_helper:true,at:Date.now()}
      }));
    }catch(e){}
  }

  function arm(){
    clearTimers();
    var hid=hostId();
    if(!hid)return;
    [650,1400,2600].forEach(function(ms){
      timers.push(setTimeout(function(){kick(hid);},ms));
    });
  }

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      if(e&&e.detail&&e.detail.fast_retry_helper)return;
    }catch(_e){}
    setTimeout(arm,0);
  });

  window.addEventListener('kt-approved-guest-stream-ready',clearTimers);
  window.addEventListener('kt-broadcast-ended',clearTimers);
  window.addEventListener('kt-remote-host-left',clearTimers);
})();