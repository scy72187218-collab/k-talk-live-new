/* K-Talk central preconnect stability (2026-09-25).
   Communications only:
   - Host publishes one current LiveKit run context to shared cache.
   - Every viewer resolves that run immediately on remote-room entry.
   - Viewer preconnects to LiveKit before approval.
   - Approval keeps the same run locked so the guest screen does not drop/rebuild.
   No room layout, buttons, chat, gifts, rose, switches, or feed changes. */
(function(){
  if(window.__ktCentralPreconnectStability20260925)return;
  window.__ktCentralPreconnectStability20260925=true;

  var lastHostPublishKey='',lastHostPublishAt=0;
  var remoteHost='',remoteRun='',remoteStarted=0,lastResolveAt=0,resolving=false;
  var approvedHost='',approvedRunLock='';

  function deviceId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'').trim();}catch(e){return '';}
  }
  function viewerId(){
    var d=deviceId();return d?'viewer_'+d:'';
  }
  function isHostRole(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return !!document.querySelector('#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
    }catch(e){return false;}
  }
  function currentRemoteHost(){
    var h='';
    try{h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!h)try{h=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return h;
  }
  function presenceContext(hostId){
    try{
      var x=window.__ktRealtimeLiveHosts&&window.__ktRealtimeLiveHosts[String(hostId||'')];
      var d=x&&x.data||{};
      return {run_id:String(d.run_id||'').trim(),run_started_at:Number(d.run_started_at||0)};
    }catch(e){return {run_id:'',run_started_at:0};}
  }
  function hostContext(){
    var run='',started=0;
    try{
      run=String(window.__ktHostRunId20260924||'').trim();
      started=Number(window.__ktHostRunStartedAt20260924||0);
    }catch(e){}
    return {run_id:run,run_started_at:started};
  }
  async function publishHostContext(force){
    if(!isHostRole())return false;
    var host=deviceId(),ctx=hostContext();
    if(!host||!ctx.run_id)return false;
    var now=Date.now(),k=host+'|'+ctx.run_id+'|'+ctx.run_started_at;
    if(!force&&k===lastHostPublishKey&&now-lastHostPublishAt<2500)return true;
    lastHostPublishKey=k;lastHostPublishAt=now;
    try{
      var r=await fetch('/api/live-run-context?t='+now,{
        method:'POST',cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          host_id:host,
          run_id:ctx.run_id,
          run_started_at:ctx.run_started_at
        })
      });
      return !!(r&&r.ok);
    }catch(e){return false;}
  }
  function applyRemoteContext(hostId,runId,startedAt,source){
    hostId=String(hostId||'').trim();
    runId=String(runId||'').trim();
    startedAt=Number(startedAt||0);
    if(!hostId||!runId)return false;
    if(approvedHost===hostId&&approvedRunLock&&runId!==approvedRunLock)return false;
    remoteHost=hostId;remoteRun=runId;remoteStarted=startedAt;
    try{
      window.__ktRemoteHostRunId20260924=runId;
      if(startedAt)window.__ktRemoteHostSessionStartedAt20260924=startedAt;
    }catch(e){}
    try{
      window.dispatchEvent(new CustomEvent('kt-host-session-ready',{
        detail:{
          host_id:hostId,
          run_id:runId,
          started_at:startedAt,
          role:'viewer',
          source:String(source||'central-preconnect'),
          at:Date.now()
        }
      }));
    }catch(e){}
    return true;
  }
  async function fetchRemoteContext(hostId,force){
    hostId=String(hostId||'').trim();
    if(!hostId)return false;
    var p=presenceContext(hostId);
    if(p.run_id){
      applyRemoteContext(hostId,p.run_id,p.run_started_at,'presence');
      return true;
    }
    var now=Date.now();
    if(resolving||(!force&&now-lastResolveAt<850))return false;
    resolving=true;lastResolveAt=now;
    try{
      var r=await fetch('/api/live-run-context?host_id='+encodeURIComponent(hostId)+'&t='+now,{cache:'no-store'});
      if(!r.ok)return false;
      var j=await r.json();
      if(j&&j.ok&&j.run_id){
        applyRemoteContext(hostId,String(j.run_id),Number(j.run_started_at||0),'shared-cache');
        return true;
      }
    }catch(e){}finally{resolving=false;}
    return false;
  }
  function guestStream(){
    try{
      var s=window.__ktApprovedGuestSelfStream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';}))return s;
    }catch(e){}
    return null;
  }
  function promoteIfApproved(hostId,runId){
    hostId=String(hostId||'').trim();runId=String(runId||'').trim();
    if(!hostId||!runId)return;
    try{
      if(typeof window.ktLiveKitPromoteApprovedGuest20260925==='function'){
        var q=window.ktLiveKitPromoteApprovedGuest20260925(hostId,runId,guestStream());
        if(q&&q.catch)q.catch(function(){});
      }
    }catch(e){}
  }
  function resolveFast(hostId){
    hostId=String(hostId||currentRemoteHost()||'').trim();
    if(!hostId)return;
    remoteHost=hostId;
    var p=presenceContext(hostId);
    if(p.run_id)applyRemoteContext(hostId,p.run_id,p.run_started_at,'presence-fast');
    fetchRemoteContext(hostId,true);
    [120,350,800].forEach(function(ms){
      setTimeout(function(){
        if(!remoteRun||remoteHost!==hostId)fetchRemoteContext(hostId,true);
      },ms);
    });
  }

  window.addEventListener('kt-remote-host-selected',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||currentRemoteHost()||'').trim();
    if(h)resolveFast(h);
  });
  window.addEventListener('kt-guest-request-started',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||currentRemoteHost()||'').trim();
    if(h)resolveFast(h);
  });
  window.addEventListener('kt-guest-approval-received',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||currentRemoteHost()||'').trim();
    var run=String(e&&e.detail&&e.detail.run_id||window.__ktRemoteHostRunId20260924||remoteRun||'').trim();
    var started=Number(e&&e.detail&&e.detail.run_started_at||window.__ktRemoteHostSessionStartedAt20260924||remoteStarted||0);
    approvedHost=h;
    approvedRunLock=run;
    if(h&&run){
      applyRemoteContext(h,run,started,'approval-lock');
      promoteIfApproved(h,run);
    }else if(h){
      resolveFast(h);
      [80,220,500].forEach(function(ms){setTimeout(function(){
        var rr=String(window.__ktRemoteHostRunId20260924||remoteRun||'').trim();
        if(rr){
          if(!approvedRunLock)approvedRunLock=rr;
          promoteIfApproved(h,approvedRunLock||rr);
        }
      },ms);});
    }
  });
  window.addEventListener('kt-approved-guest-stream-ready',function(e){
    var h=String(e&&e.detail&&e.detail.host_id||approvedHost||currentRemoteHost()||'').trim();
    var run=String(e&&e.detail&&e.detail.run_id||approvedRunLock||window.__ktRemoteHostRunId20260924||remoteRun||'').trim();
    if(h&&run){
      approvedHost=h;
      if(!approvedRunLock)approvedRunLock=run;
      promoteIfApproved(h,approvedRunLock);
    }
  });
  window.addEventListener('kt-remote-host-left',function(){
    approvedHost='';approvedRunLock='';remoteHost='';remoteRun='';remoteStarted=0;
  });
  window.addEventListener('kt-broadcast-ended',function(){
    approvedHost='';approvedRunLock='';remoteHost='';remoteRun='';remoteStarted=0;
  });

  setInterval(function(){
    if(isHostRole()){
      publishHostContext(false);
      return;
    }
    var h=currentRemoteHost();
    if(!h)return;
    if(remoteHost!==h){remoteHost=h;remoteRun='';remoteStarted=0;}
    var existing='';
    try{existing=String(window.__ktRemoteHostRunId20260924||'').trim();}catch(e){}
    if(existing){
      remoteRun=existing;
      if(approvedHost===h&&approvedRunLock)promoteIfApproved(h,approvedRunLock);
      return;
    }
    fetchRemoteContext(h,false);
  },350);

  setTimeout(function(){
    if(isHostRole())publishHostContext(true);
    else {
      var h=currentRemoteHost();
      if(h)resolveFast(h);
    }
  },40);
  window.addEventListener('pageshow',function(){
    if(isHostRole())publishHostContext(true);
    else {var h=currentRemoteHost();if(h)resolveFast(h);}
  });
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)return;
    if(isHostRole())publishHostContext(true);
    else {var h=currentRemoteHost();if(h)resolveFast(h);}
  });
})();