/* K-Talk 13-person room bottom fit only. Keep all other layouts/features untouched. */
(function(){
  if(window.__ktGroup13BottomFitInstalled)return;
  window.__ktGroup13BottomFitInstalled=true;

  function setVh(){
    try{
      var h=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||700;
      document.documentElement.style.setProperty('--kt-g13-visible-h',Math.round(h)+'px');
    }catch(e){}
  }

  function installStyle(){
    if(document.getElementById('ktGroup13BottomFitStyle'))return;
    var st=document.createElement('style');
    st.id='ktGroup13BottomFitStyle';
    st.textContent='\
#screen.ktg13-fit-screen{height:var(--kt-g13-visible-h,100dvh)!important;min-height:0!important;max-height:var(--kt-g13-visible-h,100dvh)!important;overflow:hidden!important;}\
#screen.ktg13-fit-screen .ktg13-room{height:100%!important;min-height:0!important;max-height:100%!important;box-sizing:border-box!important;}\
#screen.ktg13-fit-screen .ktg13-main{min-height:0!important;}\
#screen.ktg13-fit-screen .ktg13-gifts,#screen.ktg13-fit-screen .ktg13-tools{flex-shrink:0!important;}';
    document.head.appendChild(st);
  }

  function apply(){
    setVh();
    var s=document.getElementById('screen');
    if(!s)return;
    var room=s.querySelector('.ktg13-room');
    s.classList.toggle('ktg13-fit-screen',!!room);
  }

  setVh();installStyle();apply();
  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,160);});
  try{if(window.visualViewport)window.visualViewport.addEventListener('resize',apply);}catch(e){}
  try{new MutationObserver(function(){setTimeout(apply,10);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
