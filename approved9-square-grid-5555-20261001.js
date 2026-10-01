/* K-Talk approved guest 9-room square grid lock — 2026-10-01 — 5555
   ONLY approved guest 9-room visual grid.
   Make the whole 3x3 grid square so each host/guest cell is square.
   Do not touch signaling, video source, approval, buttons, chat, earnings, or other rooms.
*/
(function(){
  if(window.__ktApproved9SquareGrid5555_20261001)return;
  window.__ktApproved9SquareGrid5555_20261001=true;

  function apply(){
    document.querySelectorAll('#screen .kt-guest-hostlike-room[data-kt-room="9"]').forEach(function(room){
      var grid=room.querySelector(':scope > .kgh-main')||room.querySelector('.kgh-main');
      if(!grid)return;
      var r;
      try{r=grid.getBoundingClientRect();}catch(e){return;}
      var w=Math.round(r.width||0);
      if(w<180)return;

      grid.style.setProperty('display','grid','important');
      grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('gap','2px','important');
      grid.style.setProperty('width','100%','important');
      grid.style.setProperty('height',w+'px','important');
      grid.style.setProperty('min-height',w+'px','important');
      grid.style.setProperty('max-height','none','important');
      grid.style.setProperty('flex','0 0 '+w+'px','important');
      grid.style.setProperty('overflow','hidden','important');

      [].slice.call(grid.children||[]).forEach(function(cell){
        if(!cell||cell.nodeType!==1)return;
        cell.style.setProperty('min-width','0','important');
        cell.style.setProperty('min-height','0','important');
        cell.style.setProperty('width','auto','important');
        cell.style.setProperty('height','auto','important');
      });
    });
  }

  apply();
  [30,100,250,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,30);setTimeout(apply,180);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,30);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktApproved9SquareGrid5555Timer);
      window.__ktApproved9SquareGrid5555Timer=setTimeout(apply,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();