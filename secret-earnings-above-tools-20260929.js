/* K-Talk 비밀방 수익률 최종 위치: 방 전체 기준 오른쪽 아래, 공유/효과/더보기 바로 위 */
(function(){
  if(window.__ktSecretEarnAboveTools20260929)return;
  window.__ktSecretEarnAboveTools20260929=true;

  function place(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;
      var earn=room.querySelector('.ktsecret-earn-row');
      var tools=room.querySelector('.ktsecret-tools');
      if(!earn||!tools)return;

      room.style.setProperty('position','relative','important');

      /* main 안에 있으면 방 전체의 직접 자식으로 옮겨서
         호스트/게스트 칸 위치 영향 없이 하단 도구줄 바로 위에 고정 */
      if(earn.parentElement!==room){
        room.insertBefore(earn,tools);
      }

      earn.style.setProperty('position','absolute','important');
      earn.style.setProperty('right','6px','important');
      earn.style.setProperty('left','auto','important');
      earn.style.setProperty('top','auto','important');
      earn.style.setProperty('bottom','58px','important');
      earn.style.setProperty('width','92px','important');
      earn.style.setProperty('height','50px','important');
      earn.style.setProperty('margin','0','important');
      earn.style.setProperty('padding','0','important');
      earn.style.setProperty('transform','none','important');
      earn.style.setProperty('z-index','999','important');
      earn.style.setProperty('display','flex','important');
      earn.style.setProperty('align-items','flex-end','important');
      earn.style.setProperty('justify-content','flex-end','important');

      var hud=earn.querySelector('#myEarnHud');
      if(hud){
        hud.style.setProperty('width','92px','important');
        hud.style.setProperty('min-width','92px','important');
        hud.style.setProperty('max-width','92px','important');
        hud.style.setProperty('height','50px','important');
        hud.style.setProperty('max-height','50px','important');
        hud.style.setProperty('margin','0','important');
        hud.style.setProperty('transform','none','important');
      }
    }catch(e){}
  }

  place();
  [40,100,220,500,900,1600,2600].forEach(function(ms){setTimeout(place,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretEarnAboveToolsTimer20260929);
      window.__ktSecretEarnAboveToolsTimer20260929=setTimeout(place,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(place,1200);
})();