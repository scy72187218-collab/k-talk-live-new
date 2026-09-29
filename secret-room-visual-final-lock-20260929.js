/* K-Talk 비밀방 화면 최종 고정: 시계 옆 하트 정리
   수익률 위치/크기는 earnings-host-unified-20260929.js 한 곳에서만 관리 */
(function(){
  if(window.__ktSecretVisualFinalLock20260929)return;
  window.__ktSecretVisualFinalLock20260929=true;

  function isHeartText(v){
    v=String(v||'');
    return /[♥❤💗💖💓💕]/.test(v);
  }

  function fix(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;
      room.dataset.ktSecretLayoutLocked='visual-final';

      var air=room.querySelector('.ktsecret-airrow');
      if(air){
        var keep=air.querySelector('.kt-clock-like-20260927');
        Array.from(air.children).forEach(function(el){
          if(el.classList.contains('on')||el.id==='ktLiveClock'||el===keep)return;
          var aria=String(el.getAttribute&&el.getAttribute('aria-label')||'');
          var txt=String(el.textContent||'');
          if(isHeartText(txt)||/좋아요/.test(aria)){
            try{el.remove();}catch(e){}
          }
        });
      }
      room.querySelectorAll('.kt-live-clock-heart').forEach(function(el){try{el.remove();}catch(e){}});
    }catch(e){}
  }

  fix();
  [30,120,350].forEach(function(ms){setTimeout(fix,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretVisualFinalTimer20260929);
      window.__ktSecretVisualFinalTimer20260929=setTimeout(fix,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();