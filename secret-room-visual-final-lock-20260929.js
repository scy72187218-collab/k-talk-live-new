/* K-Talk 비밀방 화면 최종 고정: 하트 1개 + 수익률 오른쪽 아래 */
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
      room.dataset.ktSecretLayoutLocked='lower-right-final';

      /* 시계 옆 하트 1개만 남긴다. */
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

      /* 수익률 박스: 하단 공유·효과·더보기 3개 바로 위에 고정 */
      var tools=room.querySelector('.ktsecret-tools');
      var hud=room.querySelector('#myEarnHud');
      if(tools&&hud){
        var rr=room.getBoundingClientRect();
        var tr=tools.getBoundingClientRect();
        var w=72,h=34,gap=2;
        if(rr.width&&tr.width){
          var left=Math.round(rr.right-w-6);
          var top=Math.round(tr.top-h+6);

          hud.style.setProperty('position','fixed','important');
          hud.style.setProperty('left',left+'px','important');
          hud.style.setProperty('right','auto','important');
          hud.style.setProperty('top',top+'px','important');
          hud.style.setProperty('bottom','auto','important');
          hud.style.setProperty('width',w+'px','important');
          hud.style.setProperty('min-width',w+'px','important');
          hud.style.setProperty('max-width',w+'px','important');
          hud.style.setProperty('height',h+'px','important');
          hud.style.setProperty('max-height',h+'px','important');
          hud.style.setProperty('margin','0','important');
          hud.style.setProperty('transform','none','important');
          hud.style.setProperty('translate','none','important');
          hud.style.setProperty('z-index','2147483646','important');
          hud.style.setProperty('transition','none','important');
          hud.style.setProperty('animation','none','important');
          hud.querySelectorAll('span,b').forEach(function(el){el.style.setProperty('font-size','6px','important');el.style.setProperty('line-height','1','important');});

          var row=hud.closest('.ktsecret-earn-row');
          if(row){
            row.style.setProperty('position','static','important');
            row.style.setProperty('width','0','important');
            row.style.setProperty('height','0','important');
            row.style.setProperty('margin','0','important');
            row.style.setProperty('padding','0','important');
            row.style.setProperty('overflow','visible','important');
            row.style.setProperty('transform','none','important');
          }
        }
      }
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
  window.addEventListener('resize',function(){setTimeout(fix,30);});
  window.addEventListener('orientationchange',function(){setTimeout(fix,120);});
})();