/* 9-room host: slightly smaller 3x3 rectangular grid so bottom icon labels stay visible. Visual only. */
(function(){
  if(window.__ktG9HostSmallRectangle20261002)return;
  window.__ktG9HostSmallRectangle20261002=true;

  function apply(){
    document.querySelectorAll(
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'+
      '#screen .ktg9-room .ktg9-main'
    ).forEach(function(g){
      g.style.setProperty('width','calc(100% - 26px)','important');
      g.style.setProperty('margin','2px auto 0','important');
      g.style.setProperty('height','calc(64vw - 8px)','important');
      g.style.setProperty('min-height','0','important');
      g.style.setProperty('max-height','calc(64vw - 8px)','important');
      g.style.setProperty('flex','0 0 calc(64vw - 8px)','important');
      g.style.setProperty('display','grid','important');
      g.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('gap','2px','important');
      g.style.setProperty('overflow','hidden','important');
    });
  }

  apply();
  [30,100,250,500,900,1600,2800].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,40);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostSmallRectangleTimer20261002);
      window.__ktG9HostSmallRectangleTimer20261002=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
