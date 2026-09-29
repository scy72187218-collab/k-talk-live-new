/* K-Talk 빨간 LIVE 신호 표시 전용 잠금 2026-09-30
   범위: 동영상 화면의 빨간 LIVE 신호 표시/새로고침만 보호.
   입장/퇴장/WebRTC/게스트/수익률/방 배치는 건드리지 않음. */
(function(){
  if(window.__ktRedLiveSignalDisplayLock20260930)return;
  window.__ktRedLiveSignalDisplayLock20260930=true;

  var savedRefresh=null;

  function capture(){
    try{
      if(!savedRefresh && typeof window.ktRefreshVideoLivePeek==='function'){
        savedRefresh=window.ktRefreshVideoLivePeek;
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
  }

  function keepOutsideVisible(){
    try{
      var inside=!!document.documentElement.classList.contains('kt-inside-broadcast-room');
      if(inside)return;
      document.querySelectorAll('.kt-video-live-peek .ktvl-live').forEach(function(el){
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
      });
    }catch(e){}
  }

  function tick(){
    restore();
    keepOutsideVisible();
  }

  capture();
  tick();
  setInterval(tick,1000);

  try{
    new MutationObserver(function(){setTimeout(keepOutsideVisible,0);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();