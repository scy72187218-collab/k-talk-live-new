/* K-Talk 9명방 수익률 크기만 축소 - 다른 요소 변경 금지 */
(function(){
  if(window.__ktGroup9EarnWidthOnly20260930)return;
  window.__ktGroup9EarnWidthOnly20260930=true;

  function apply(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var wrap=room.querySelector('.ktg13-earn');
      var hud=wrap&&wrap.querySelector('#myEarnHud');
      if(!wrap||!hud)return;

      /* 위치는 건드리지 않고, 가로 폭만 구독자방처럼 컴팩트하게 */
      wrap.style.setProperty('width','145px','important');
      wrap.style.setProperty('max-width','145px','important');
      wrap.style.setProperty('min-width','145px','important');
      wrap.style.setProperty('justify-self','end','important');
      wrap.style.setProperty('justify-content','flex-end','important');

      hud.style.setProperty('width','145px','important');
      hud.style.setProperty('max-width','145px','important');
      hud.style.setProperty('min-width','145px','important');
      hud.style.setProperty('box-sizing','border-box','important');
      hud.style.setProperty('overflow','hidden','important');

      var top=hud.querySelector(':scope > div:first-child');
      if(top){
        top.style.setProperty('gap','2px','important');
        top.querySelectorAll('span').forEach(function(x){
          x.style.setProperty('font-size','6px','important');
        });
        var b=top.querySelector('b');
        if(b)b.style.setProperty('font-size','9px','important');
      }
      var detail=hud.querySelector('#myEarnDetail');
      if(detail){
        detail.style.setProperty('font-size','5.5px','important');
        detail.style.setProperty('line-height','1.05','important');
        detail.style.setProperty('gap','1px 2px','important');
      }
    }catch(e){}
  }

  apply();
  [30,100,250,600,1200].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9EarnWidthOnlyTimer20260930);
      window.__ktGroup9EarnWidthOnlyTimer20260930=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-kt-room']});
  }catch(e){}
})();