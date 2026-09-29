/* K-Talk 방송 표시 + 입장/나가기 현재 정상 동작 잠금 (2026-09-29)
   다른 UI/방 배치/선물/채팅 수정이 이 핵심 함수들을 덮어쓰지 못하게 현재 참조를 유지한다. */
(function(){
  if(window.__ktLiveEntryExitLock20260929)return;
  window.__ktLiveEntryExitLock20260929=true;

  var saved={};
  var names=[
    'ktEnterRemoteLive',
    'ktLeaveRemoteLive',
    'ktStopHostPresence',
    'ktRepairVisibleHostPresence20260928',
    'ktRefreshLiveCards'
  ];

  function capture(){
    names.forEach(function(n){
      try{
        if(!saved[n]&&typeof window[n]==='function')saved[n]=window[n];
      }catch(e){}
    });
  }

  function restore(){
    capture();
    names.forEach(function(n){
      try{
        if(saved[n]&&window[n]!==saved[n])window[n]=saved[n];
      }catch(e){}
    });
  }

  window.ktLiveEntryExitLockState20260929=function(){
    var out={locked:true};
    names.forEach(function(n){out[n]=!!saved[n];});
    return out;
  };

  capture();
  [50,150,350,800,1500,2500].forEach(function(ms){setTimeout(restore,ms);});
  setInterval(restore,1200);
  window.addEventListener('pageshow',restore);
  window.addEventListener('focus',restore);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')restore();
  });
})();