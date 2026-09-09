/* K-Talk 13-person room bottom fit only. Keep all other layouts/features untouched. */
(function(){
  if(window.__ktGroup13BottomFitInstalled)return;
  window.__ktGroup13BottomFitInstalled=true;

  function visibleHeight(){
    try{
      var s=document.getElementById('screen');
      var vh=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||700;
      var top=0;
      if(s){
        var r=s.getBoundingClientRect();
        top=Math.max(0,Math.round(r.top||0));
      }
      return Math.max(320,Math.floor(vh-top-6));
    }catch(e){return 700;}
  }

  function setVh(){
    try{document.documentElement.style.setProperty('--kt-g13-visible-h',visibleHeight()+'px');}catch(e){}
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
    var s=document.getElementById('screen');
    if(!s)return;
    var room=s.querySelector('.ktg13-room');
    s.classList.toggle('ktg13-fit-screen',!!room);
    if(room)setVh();
  }

  installStyle();apply();
  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,160);});
  try{if(window.visualViewport){window.visualViewport.addEventListener('resize',apply);window.visualViewport.addEventListener('scroll',apply);}}catch(e){}
  try{new MutationObserver(function(){setTimeout(apply,10);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
