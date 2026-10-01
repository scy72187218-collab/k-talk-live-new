/* 9-room approved guest: smaller rectangular 3x3 grid, slightly higher. Visual only. */
(function(){
  if(window.__ktG9ApprovedSmallRectangle20261002)return;
  window.__ktG9ApprovedSmallRectangle20261002=true;
  function apply(){
    document.querySelectorAll('#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main').forEach(function(g){
      g.style.setProperty('width','calc(100% - 30px)','important');
      g.style.setProperty('margin','2px auto 0','important');
      g.style.setProperty('height','calc(58vw - 8px)','important');
      g.style.setProperty('flex','0 0 calc(58vw - 8px)','important');
      g.style.setProperty('display','grid','important');
      g.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('gap','2px','important');
    });
  }
  apply();
  [50,150,400,900,1600].forEach(function(ms){setTimeout(apply,ms);});
  try{new MutationObserver(function(){setTimeout(apply,20);}).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
