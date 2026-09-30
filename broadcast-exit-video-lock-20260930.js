/* K-Talk 방송 종료 후 즉시 동영상 복귀 잠금 2026-09-30
   현재 정상 동작만 보호.
   다른 방송/게스트/수익률/신호/운세 기능은 변경하지 않음. */
(function(){
  if(window.__ktBroadcastExitVideoLock20260930)return;
  window.__ktBroadcastExitVideoLock20260930=true;

  var savedReturn=null;
  var savedLeaveRemote=null;
  var savedEnd=null;
  var savedLeaveHost=null;

  function capture(){
    try{
      if(!savedReturn&&typeof window.ktReturnLatestVideoAfterBroadcast==='function')savedReturn=window.ktReturnLatestVideoAfterBroadcast;
      if(!savedLeaveRemote&&typeof window.ktLeaveRemoteLive==='function')savedLeaveRemote=window.ktLeaveRemoteLive;
      if(!savedEnd&&typeof window.endBroadcastEarnings==='function')savedEnd=window.endBroadcastEarnings;
      if(!savedLeaveHost&&typeof window.leaveBroadcastToDashboard==='function')savedLeaveHost=window.leaveBroadcastToDashboard;
    }catch(e){}
  }

  function restore(){
    capture();
    try{if(savedReturn&&window.ktReturnLatestVideoAfterBroadcast!==savedReturn)window.ktReturnLatestVideoAfterBroadcast=savedReturn;}catch(e){}
    try{if(savedLeaveRemote&&window.ktLeaveRemoteLive!==savedLeaveRemote)window.ktLeaveRemoteLive=savedLeaveRemote;}catch(e){}
    try{if(savedEnd&&window.endBroadcastEarnings!==savedEnd)window.endBroadcastEarnings=savedEnd;}catch(e){}
    try{if(savedLeaveHost&&window.leaveBroadcastToDashboard!==savedLeaveHost)window.leaveBroadcastToDashboard=savedLeaveHost;}catch(e){}
  }

  capture();
  [50,150,350,800,1500].forEach(function(ms){setTimeout(restore,ms);});
  setInterval(restore,1200);
  window.addEventListener('pageshow',restore);
  window.addEventListener('focus',restore);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)restore();});
})();