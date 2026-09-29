/* K-Talk: hide edit-effect ONLY on video recording screen; keep live-prep controls working */
(function(){
  if(window.__ktHideEditEffectOnly20260929V2)return;
  window.__ktHideEditEffectOnly20260929V2=true;

  function run(){
    try{
      /* Hide only the recording-screen edit-effect tool. */
      document.querySelectorAll('.creator-tools .creator-tool-text[aria-label="편집 효과"]').forEach(function(el){
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
      });

      /* LIVE prep: force all controls back to enabled/touchable. */
      document.querySelectorAll(
        '.live-prep .prep-item,'+
        '.live-prep .room-switch,'+
        '.live-prep .prep-start,'+
        '.live-prep .prep-bottom button,'+
        '.live-prep .prep-mini'
      ).forEach(function(el){
        try{
          el.disabled=false;
          el.removeAttribute('disabled');
          el.setAttribute('aria-disabled','false');
          el.style.setProperty('pointer-events','auto','important');
          el.style.setProperty('touch-action','manipulation','important');
        }catch(e){}
      });
    }catch(e){}
  }

  run();
  [60,180,400,800,1500].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHideEditEffectTimer20260929V2);
      window.__ktHideEditEffectTimer20260929V2=setTimeout(run,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();