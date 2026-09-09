/* K-Talk gift window viewport fix only. Keeps all other screens/features untouched. */
(function(){
  if(window.__ktGiftViewportFixInstalled)return;
  window.__ktGiftViewportFixInstalled=true;

  function setGiftVh(){
    try{
      var h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||700;
      document.documentElement.style.setProperty('--kt-gift-vh',Math.round(h)+'px');
    }catch(e){}
  }

  function installStyle(){
    if(document.getElementById('ktGiftViewportFixStyle'))return;
    var st=document.createElement('style');
    st.id='ktGiftViewportFixStyle';
    st.textContent='\
#sheet.kt-gift-force.show{position:fixed!important;inset:0!important;align-items:flex-end!important;justify-content:center!important;overflow:hidden!important;padding:0!important;}\
#sheet.kt-gift-force .sheet-inner{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;margin:0 auto!important;width:min(100%,560px)!important;height:auto!important;max-height:calc(var(--kt-gift-vh,100dvh) - 4px)!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;padding-bottom:max(10px,env(safe-area-inset-bottom))!important;}\
#sheet.kt-gift-force #sheetBody{min-height:0!important;overflow:visible!important;padding-bottom:max(8px,env(safe-area-inset-bottom))!important;}\
#sheet.kt-gift-force .ktgf{padding-bottom:calc(18px + env(safe-area-inset-bottom))!important;}\
#sheet.kt-gift-force .ktgf-main{min-height:0!important;}\
@media(max-width:410px){#sheet.kt-gift-force .sheet-inner{max-height:calc(var(--kt-gift-vh,100dvh) - 2px)!important;}#sheet.kt-gift-force .ktgf{padding-bottom:calc(12px + env(safe-area-inset-bottom))!important;}}';
    document.head.appendChild(st);
  }

  function fixGift(){
    setGiftVh();
    var sh=document.getElementById('sheet');
    if(!sh||!sh.classList.contains('kt-gift-force'))return;
    var inner=sh.querySelector('.sheet-inner');
    if(inner){
      try{inner.scrollTop=Math.max(0,inner.scrollTop||0);}catch(e){}
    }
  }

  setGiftVh();installStyle();
  window.addEventListener('resize',fixGift);
  window.addEventListener('orientationchange',function(){setTimeout(fixGift,160);});
  try{if(window.visualViewport)window.visualViewport.addEventListener('resize',fixGift);}catch(e){}
  try{new MutationObserver(function(){setTimeout(fixGift,20);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}catch(e){}
})();
