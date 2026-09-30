/* 9명방 수익률 노란칸 가로폭만 축소 — 5555
   깜빡임 방지: 9명방의 정확한 수익률 요소만 한정해서 적용.
   다른 방/버튼/위치/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup9EarningsWidthOnly5555)return;
  window.__ktGroup9EarningsWidthOnly5555=true;

  function apply(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var wrap=room.querySelector('.ktg13-earn');
      var hud=wrap&&wrap.querySelector('#myEarnHud');
      if(!wrap||!hud)return;

      wrap.style.setProperty('width','170px','important');
      wrap.style.setProperty('min-width','170px','important');
      wrap.style.setProperty('max-width','170px','important');
      wrap.style.setProperty('left','auto','important');
      wrap.style.setProperty('right','8px','important');
      wrap.style.setProperty('transform','none','important');
      wrap.style.setProperty('animation','none','important');
      wrap.style.setProperty('transition','none','important');

      hud.style.setProperty('width','170px','important');
      hud.style.setProperty('min-width','170px','important');
      hud.style.setProperty('max-width','170px','important');
      hud.style.setProperty('box-sizing','border-box','important');
      hud.style.setProperty('left','auto','important');
      hud.style.setProperty('right','auto','important');
      hud.style.setProperty('transform','none','important');
      hud.style.setProperty('animation','none','important');
      hud.style.setProperty('transition','none','important');
    }catch(e){}
  }

  apply();
  [80,220,500,900,1400].forEach(function(ms){setTimeout(apply,ms);});
})();