/* K-Talk live prep touch repair 2026-09-29 */
(function(){
  if(window.__ktLivePrepTouchRepair20260929)return;
  window.__ktLivePrepTouchRepair20260929=true;

  function unlock(){
    try{
      var prep=document.querySelector('.live-prep');
      if(!prep)return;
      prep.style.setProperty('pointer-events','auto','important');
      prep.querySelectorAll('button,.prep-item,.room-switch,.prep-start').forEach(function(b){
        b.disabled=false;
        b.removeAttribute('disabled');
        b.style.setProperty('pointer-events','auto','important');
        b.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  document.addEventListener('pointerup',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.live-prep .prep-item,.live-prep .room-switch,.live-prep .prep-start,.live-prep .prep-bottom button'):null;
    if(!b)return;
    unlock();
  },true);

  unlock();
  [100,300,700,1400].forEach(function(ms){setTimeout(unlock,ms);});
  try{new MutationObserver(function(){setTimeout(unlock,20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();