/* K-Talk 1인방 최종 배치 잠금 2026-09-29
   - 상단 퀵바 첫 칸은 빈칸 유지
   - 겹쳐 뜨는 뒤집기/되돌리기 버튼 제거
   - 수익률 위치/크기는 earnings-host-unified-20260929.js 한 곳에서만 관리 */
(function(){
  if(window.__ktSoloFinalLayoutLock20260929)return;
  window.__ktSoloFinalLayoutLock20260929=true;

  function isFlipButton(el){
    if(!el)return false;
    var t=String(el.textContent||'').replace(/\s+/g,'');
    var aria=String(el.getAttribute&&el.getAttribute('aria-label')||'');
    return (el.classList&&(
      el.classList.contains('kt-room-camera-flip')||
      el.classList.contains('kt-solo-camera-flip')
    ))||/뒤집기|되돌리기/.test(t)||/뒤집기|되돌리기/.test(aria);
  }

  function apply(){
    try{
      var room=document.querySelector('#screen .ktsolo-room');
      if(!room)return;

      room.querySelectorAll('.kt-room-camera-flip,.kt-solo-camera-flip').forEach(function(el){
        try{el.remove();}catch(e){}
      });

      var right=room.querySelector('.ktsolo-right');
      if(right){
        Array.from(right.querySelectorAll('button')).forEach(function(btn){
          if(isFlipButton(btn)){try{btn.remove();}catch(e){}}
        });
      }

      var bar=room.querySelector(':scope > .kt-live-top-quickbar');
      if(bar){
        var first=bar.children&&bar.children[0];
        if(first&&isFlipButton(first)){
          first.innerHTML='';
          first.setAttribute('aria-hidden','true');
          first.removeAttribute('aria-label');
          first.style.setProperty('visibility','hidden','important');
          first.style.setProperty('pointer-events','none','important');
        }
      }
    }catch(e){}
  }

  apply();
  [30,100,250,600].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloFinalLayoutLockTimer20260929);
      window.__ktSoloFinalLayoutLockTimer20260929=setTimeout(apply,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();