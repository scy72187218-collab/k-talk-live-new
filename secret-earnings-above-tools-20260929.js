/* K-Talk 비밀방 수익률: 화면 오른쪽 아래, 공유/효과/더보기 바로 위 */
(function(){
  if(window.__ktSecretEarnAboveTools20260929V2)return;
  window.__ktSecretEarnAboveTools20260929V2=true;

  function place(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;
      var earn=room.querySelector('.ktsecret-earn-row');
      var tools=room.querySelector('.ktsecret-tools');
      if(!earn||!tools)return;

      var rr=room.getBoundingClientRect();
      var tr=tools.getBoundingClientRect();
      if(!rr.width||!tr.width)return;

      /* 공유/효과/더보기 바로 위의 오른쪽 끝에 화면 기준으로 고정 */
      var w=92,h=50,gap=4;
      var left=Math.round(Math.max(rr.left+4,rr.right-w-6));
      var top=Math.round(Math.max(rr.top+4,tr.top-h-gap));

      earn.style.setProperty('position','fixed','important');
      earn.style.setProperty('left',left+'px','important');
      earn.style.setProperty('right','auto','important');
      earn.style.setProperty('top',top+'px','important');
      earn.style.setProperty('bottom','auto','important');
      earn.style.setProperty('width',w+'px','important');
      earn.style.setProperty('height',h+'px','important');
      earn.style.setProperty('margin','0','important');
      earn.style.setProperty('padding','0','important');
      earn.style.setProperty('transform','none','important');
      earn.style.setProperty('z-index','2147483000','important');
      earn.style.setProperty('display','flex','important');
      earn.style.setProperty('align-items','flex-end','important');
      earn.style.setProperty('justify-content','flex-end','important');

      var hud=earn.querySelector('#myEarnHud');
      if(hud){
        hud.style.setProperty('width',w+'px','important');
        hud.style.setProperty('min-width',w+'px','important');
        hud.style.setProperty('max-width',w+'px','important');
        hud.style.setProperty('height',h+'px','important');
        hud.style.setProperty('max-height',h+'px','important');
        hud.style.setProperty('margin','0','important');
        hud.style.setProperty('transform','none','important');
      }
    }catch(e){}
  }

  place();
  [30,80,160,320,650,1200,2200].forEach(function(ms){setTimeout(place,ms);});
  setInterval(place,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretEarnAboveToolsTimer20260929V2);
      window.__ktSecretEarnAboveToolsTimer20260929V2=setTimeout(place,20);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}

  window.addEventListener('resize',function(){setTimeout(place,30);});
  window.addEventListener('orientationchange',function(){setTimeout(place,120);});
})();