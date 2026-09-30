/* 9명방 수익률 = 13명방과 동일 — 5555
   9명방 수익률에 남아 있던 별도 폭/위치값을 제거하고
   13명방 기본 .ktg13-earn / #myEarnHud 배치를 그대로 사용한다.
   다른 요소는 변경하지 않는다. */
(function(){
  if(window.__ktGroup9EarningsSameAs13_5555)return;
  window.__ktGroup9EarningsSameAs13_5555=true;

  function apply(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;

      var mid=room.querySelector('.ktg13-mid');
      var wrap=room.querySelector('.ktg13-earn');
      var hud=wrap&&wrap.querySelector('#myEarnHud');
      if(!wrap||!hud)return;

      /* 13명방 기본 중간영역 배치 */
      if(mid){
        mid.style.removeProperty('grid-template-columns');
        mid.style.removeProperty('width');
        mid.style.removeProperty('max-width');
        mid.style.removeProperty('min-width');
      }

      /* 9명방에 남아 있던 별도 폭/위치값 제거 */
      [
        'width','min-width','max-width','left','right','top','bottom',
        'transform','margin-left','margin-right','position'
      ].forEach(function(p){wrap.style.removeProperty(p);});
      [
        'width','min-width','max-width','left','right','top','bottom',
        'transform','margin-left','margin-right','position'
      ].forEach(function(p){hud.style.removeProperty(p);});

      /* 13명방 코드와 같은 값으로 고정 */
      wrap.style.setProperty('height','64px','important');
      wrap.style.setProperty('display','flex','important');
      wrap.style.setProperty('align-items','flex-end','important');
      wrap.style.setProperty('justify-content','flex-end','important');

      hud.style.setProperty('position','static','important');
      hud.style.setProperty('left','auto','important');
      hud.style.setProperty('right','auto','important');
      hud.style.setProperty('top','auto','important');
      hud.style.setProperty('bottom','auto','important');
      hud.style.setProperty('transform','none','important');
      hud.style.setProperty('width','100%','important');
      hud.style.setProperty('min-width','0','important');
      hud.style.setProperty('max-width','none','important');
      hud.style.setProperty('margin','0','important');
      hud.style.setProperty('padding','2px 6px','important');
      hud.style.setProperty('border','1px solid #d2a936','important');
      hud.style.setProperty('border-radius','10px','important');
      hud.style.setProperty('background','linear-gradient(135deg,#17140be8,#0d0d12e8)','important');
      hud.style.setProperty('color','#fff','important');
      hud.style.setProperty('animation','none','important');
      hud.style.setProperty('transition','none','important');
    }catch(e){}
  }

  apply();
  [80,220,500,1000].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9Same13Timer);
      window.__ktG9Same13Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();