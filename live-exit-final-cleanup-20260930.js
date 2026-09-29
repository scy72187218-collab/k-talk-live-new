/* K-Talk 최종 퇴장 정리 2026-09-30
   방송 나가기/종료/홈 이동 시 서버 LIVE 상태만 즉시 종료.
   UI/방 배치/통신 입장 로직은 변경하지 않음. */
(function(){
  if(window.__ktLiveExitFinalCleanup20260930)return;
  window.__ktLiveExitFinalCleanup20260930=true;

  var lastEnd=0;
  function deviceId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'').trim();}catch(e){return '';}
  }
  function endBeacon(){
    var id=deviceId();
    if(!id)return;
    try{
      fetch('/api/live-beacon-memory',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'end',host_id:id,at:Date.now()}),
        cache:'no-store',
        keepalive:true
      }).catch(function(){});
    }catch(e){}
  }
  function forceServerExit(){
    var now=Date.now();
    if(now-lastEnd<250)return;
    lastEnd=now;
    try{endBeacon();}catch(e){}
    try{
      if(typeof window.ktStopHostPresence==='function'){
        var p=window.ktStopHostPresence();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function wrap(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktFinalExitWrapped20260930)return;
    var fn=function(){
      forceServerExit();
      return old.apply(this,arguments);
    };
    fn.__ktFinalExitWrapped20260930=true;
    window[name]=fn;
  }

  function install(){
    wrap('leaveBroadcastToDashboard');
    wrap('endBroadcastEarnings');
    wrap('home');
  }

  install();
  [50,150,350,800,1500,2600].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,1500);

  window.addEventListener('pagehide',forceServerExit);
  window.addEventListener('beforeunload',forceServerExit);
})();
