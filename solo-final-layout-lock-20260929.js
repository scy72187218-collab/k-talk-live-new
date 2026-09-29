/* K-Talk 1인방 최종 배치 잠금 2026-09-29
   - 상단 퀵바 첫 칸은 빈칸 유지
   - 겹쳐 뜨는 뒤집기/되돌리기 버튼 제거
   - 수익률은 하단 공유·효과·더보기 바로 위 오른쪽 */
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

      /* 영상 위에 겹쳐 생기는 뒤집기 버튼 제거 */
      room.querySelectorAll('.kt-room-camera-flip,.kt-solo-camera-flip').forEach(function(el){
        try{el.remove();}catch(e){}
      });
      var right=room.querySelector('.ktsolo-right');
      if(right){
        Array.from(right.querySelectorAll('button')).forEach(function(btn){
          if(isFlipButton(btn)){try{btn.remove();}catch(e){}}
        });
      }

      /* 보물상자 왼쪽 칸은 없애지 말고 빈칸으로 유지 */
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

      /* 수익률: 하단 공유·효과·더보기 바로 위 오른쪽 */
      var earn=room.querySelector('.ktsolo-earn');
      var hud=earn&&earn.querySelector('#myEarnHud');
      var tools=room.querySelector('.ktsolo-tools');
      if(earn&&hud&&tools){
        var rr=room.getBoundingClientRect();
        var tr=tools.getBoundingClientRect();
        if(rr.width&&tr.width){
          var w=84,h=38,gap=4;
          var left=Math.round(rr.right-w-7);
          var top=Math.round(tr.top-h-gap);

          earn.style.setProperty('position','fixed','important');
          earn.style.setProperty('left',left+'px','important');
          earn.style.setProperty('right','auto','important');
          earn.style.setProperty('top',top+'px','important');
          earn.style.setProperty('bottom','auto','important');
          earn.style.setProperty('width',w+'px','important');
          earn.style.setProperty('max-width',w+'px','important');
          earn.style.setProperty('height',h+'px','important');
          earn.style.setProperty('margin','0','important');
          earn.style.setProperty('padding','0','important');
          earn.style.setProperty('transform','none','important');
          earn.style.setProperty('z-index','2147483000','important');

          hud.style.setProperty('position','static','important');
          hud.style.setProperty('width',w+'px','important');
          hud.style.setProperty('min-width',w+'px','important');
          hud.style.setProperty('max-width',w+'px','important');
          hud.style.setProperty('height',h+'px','important');
          hud.style.setProperty('max-height',h+'px','important');
          hud.style.setProperty('margin','0','important');
          hud.style.setProperty('transform','none','important');
          hud.style.setProperty('transition','none','important');
          hud.style.setProperty('animation','none','important');
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
  window.addEventListener('resize',function(){setTimeout(apply,30);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
})();