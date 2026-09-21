/* K-Talk explicit broadcast-end sync.
   When the host ends a broadcast, all devices viewing/joined to that host
   leave the live room and return to the normal video feed.
   Does not modify room layouts, guest request UI, chat, switches, or LIVE start logic. */
(function(){
  if(window.__ktAllDeviceBroadcastEndSync20260921)return;
  window.__ktAllDeviceBroadcastEndSync20260921=true;

  var API='/api/live-beacon-memory';
  var pollBusy=false,returnBusy=false,lastHandled='',wrapTimer=null,lastRealtimeEndSeen='';

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return String(id||'');
  }
  function currentViewedHost(){
    var h=String(window.__ktRemoteHostId||'');
    if(h)return h;
    try{h=String(sessionStorage.getItem('kt_remote_host_id')||'');}catch(e){}
    if(h)return h;
    try{
      if(window.__ktLastLiveRoom&&window.__ktLastLiveRoom.host_id)h=String(window.__ktLastLiveRoom.host_id||'');
    }catch(e){}
    return h;
  }
  function inJoinedLive(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
        !!document.querySelector('.kt-remote-live,.kt-prejoin-room-grid,.kt-approved-guest-grid');
    }catch(e){return false;}
  }
  function postEnd(hostId){
    hostId=String(hostId||deviceId());if(!hostId)return;
    try{
      fetch(API+'?t='+Date.now(),{
        method:'POST',
        cache:'no-store',
        keepalive:true,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'end',host_id:hostId})
      }).catch(function(){});
    }catch(e){}
  }
  function clearRemoteState(){
    window.__ktRemoteHostId='';
    window.__ktRemoteHostStream=null;
    try{sessionStorage.removeItem('kt_remote_host_id');}catch(e){}
    try{document.documentElement.classList.remove('kt-remote-viewing');}catch(e){}
  }
  function goVideo(){
    if(returnBusy)return;
    returnBusy=true;
    try{
      var leave=window.ktLeaveRemoteLive;
      if(typeof leave==='function'){
        var r=leave(true);
        if(r&&typeof r.catch==='function')r.catch(function(){});
      }
    }catch(e){}
    clearRemoteState();
    setTimeout(function(){
      try{
        if(typeof window.ktReturnLatestVideoAfterBroadcast==='function'){
          window.ktReturnLatestVideoAfterBroadcast();
        }else if(typeof window.ktShowSharedServerFeed==='function'){
          window.ktShowSharedServerFeed();
        }else if(typeof window.ktForceHomeVideoRecovery==='function'){
          window.ktForceHomeVideoRecovery(true);
        }else if(typeof window.home==='function'){
          window.home();
        }
      }catch(e){}
      setTimeout(function(){returnBusy=false;},500);
    },60);
  }

  function realtimeEndCheck(){
    if(!inJoinedLive())return;
    var hostId=currentViewedHost();if(!hostId)return;
    var x=window.__ktRealtimeLastEndedHost||null;
    if(!x||String(x.host_id||'')!==hostId)return;
    var at=Number(x.at||0);
    if(!at||Date.now()-at>45000)return;
    var key=hostId+'|'+at;
    if(key===lastHandled||key===lastRealtimeEndSeen)return;
    lastRealtimeEndSeen=key;lastHandled=key;
    goVideo();
  }

  async function fallbackPoll(){
    /* Shared Realtime is primary. Only if it is not connected do a slow
       fallback check, so phones on the same Wi-Fi do not flood Vercel. */
    if(window.__ktRealtimeSignalReady)return;
    if(pollBusy||!inJoinedLive())return;
    var hostId=currentViewedHost();if(!hostId)return;
    pollBusy=true;
    try{
      var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
      var timer=ctrl?setTimeout(function(){ctrl.abort();},900):null;
      var r=await fetch(API+'?t='+Date.now(),{cache:'no-store',signal:ctrl?ctrl.signal:undefined});
      if(timer)clearTimeout(timer);
      if(!r.ok)return;
      var j=await r.json(),ended=Array.isArray(j&&j.ended)?j.ended:[];
      var hit=ended.find(function(x){return String(x.host_id||'')===hostId;});
      if(!hit)return;
      var stamp=String(hit.ended_at||'');
      var age=Date.now()-(Date.parse(stamp)||0);
      if(age<0||age>45000)return;
      var key=hostId+'|'+stamp;
      if(key===lastHandled)return;
      lastHandled=key;
      goVideo();
    }catch(e){}finally{pollBusy=false;}
  }

  function explicitStopTarget(e){
    var b=e&&e.target&&e.target.closest?e.target.closest('button,.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'):null;
    if(!b)return false;
    if(b.matches&&b.matches('.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'))return true;
    var t=String(b.textContent||'').replace(/\s+/g,'');
    return t.indexOf('방송종료')>-1||t==='종료';
  }

  function wrapStop(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktAllDeviceEndSync)return;
    var fn=function(){
      postEnd(deviceId());
      var r=old.apply(this,arguments);
      setTimeout(goVideo,40);
      return r;
    };
    fn.__ktAllDeviceEndSync=true;
    window[name]=fn;
  }

  document.addEventListener('click',function(e){
    if(!explicitStopTarget(e))return;
    postEnd(deviceId());
    setTimeout(goVideo,70);
  },true);

  function wrapAll(){wrapStop('leaveBroadcastToDashboard');wrapStop('endBroadcastEarnings');}
  wrapAll();
  wrapTimer=setInterval(wrapAll,700);
  setInterval(realtimeEndCheck,350);
  setInterval(fallbackPoll,8000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden){setTimeout(realtimeEndCheck,60);setTimeout(fallbackPoll,250);}});
  window.addEventListener('focus',function(){setTimeout(realtimeEndCheck,60);setTimeout(fallbackPoll,250);});
})();