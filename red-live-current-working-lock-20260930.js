/* K-Talk current working red LIVE lock 1111 - 2026-09-30
   현재 빨간 LIVE 표시/시작 신호 상태만 보호. 동작 변경 없음. */
(function(){
  if(window.__ktRedLiveCurrentWorkingLock1111)return;
  window.__ktRedLiveCurrentWorkingLock1111=true;

  var savedRefresh=null;
  var savedStartRoom=null;
  var savedEnter=null;

  function capture(){
    try{
      if(!savedRefresh && typeof window.ktRefreshVideoLivePeek==='function')savedRefresh=window.ktRefreshVideoLivePeek;
      if(!savedStartRoom && typeof window.ktStartLiveRoomNow==='function')savedStartRoom=window.ktStartLiveRoomNow;
      if(!savedEnter && typeof window.ktEnterRemoteLive==='function')savedEnter=window.ktEnterRemoteLive;
    }catch(e){}
  }

  function restore(){
    capture();
    try{if(savedRefresh && window.ktRefreshVideoLivePeek!==savedRefresh)window.ktRefreshVideoLivePeek=savedRefresh;}catch(e){}
    try{if(savedStartRoom && window.ktStartLiveRoomNow!==savedStartRoom)window.ktStartLiveRoomNow=savedStartRoom;}catch(e){}
    try{if(savedEnter && window.ktEnterRemoteLive!==savedEnter)window.ktEnterRemoteLive=savedEnter;}catch(e){}
  }

  capture();
  [80,180,350,700,1200,2000].forEach(function(ms){setTimeout(restore,ms);});
  setInterval(restore,1200);
  window.addEventListener('pageshow',restore);
  window.addEventListener('focus',restore);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)restore();});
})();