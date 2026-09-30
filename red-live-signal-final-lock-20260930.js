/* K-Talk 빨간 LIVE 신호 최종 잠금 1111
   현재 신호 표시/수신/입장 함수 참조만 보호.
   화면 배치/수익률/게스트/호스트 영상 로직은 변경하지 않음. */
(function(){
  if(window.__ktRedLiveFinalLock1111)return;
  window.__ktRedLiveFinalLock1111=true;

  var savedRefresh=null;
  var savedEnter=null;

  function capture(){
    try{
      if(!savedRefresh && typeof window.ktRefreshVideoLivePeek==='function'){
        savedRefresh=window.ktRefreshVideoLivePeek;
      }
      if(!savedEnter && typeof window.ktEnterRemoteLive==='function'){
        savedEnter=window.ktEnterRemoteLive;
      }
    }catch(e){}
  }

  function restore(){
    capture();
    try{
      if(savedRefresh && window.ktRefreshVideoLivePeek!==savedRefresh){
        window.ktRefreshVideoLivePeek=savedRefresh;
      }
    }catch(e){}
    try{
      if(savedEnter && window.ktEnterRemoteLive!==savedEnter){
        window.ktEnterRemoteLive=savedEnter;
      }
    }catch(e){}
    try{
      if(window.__ktRedLiveSignalReceiverLock20260930!==true){
        window.__ktRedLiveSignalReceiverLock20260930=true;
      }
      if(window.__ktRedLiveIncomingSignalLock1111!==true){
        window.__ktRedLiveIncomingSignalLock1111=true;
      }
    }catch(e){}
  }

  capture();
  [100,300,700,1500].forEach(function(ms){setTimeout(restore,ms);});
  setInterval(restore,1500);
  window.addEventListener('pageshow',restore);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)restore();});
})();