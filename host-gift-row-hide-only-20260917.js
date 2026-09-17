/* K-Talk 호스트 방송방 하단 선물 7개 줄만 숨김. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktHostGiftRowHideOnly20260917)return;
  window.__ktHostGiftRowHideOnly20260917=true;
  function apply(){
    try{
      document.querySelectorAll('.ktg13-room .ktg13-gifts').forEach(function(el){
        el.style.setProperty('display','none','important');
        el.style.setProperty('height','0','important');
        el.style.setProperty('min-height','0','important');
        el.style.setProperty('flex-basis','0','important');
        el.style.setProperty('margin','0','important');
        el.style.setProperty('padding','0','important');
      });
    }catch(e){}
  }
  apply();
  try{new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,1200);
})();
