/* K-Talk final switch usability + protection lock (2026-09-26)
   All real UI switches/buttons stay usable. "Lock" here means work-protection only:
   future maintenance must not alter the approved controls, but users can still tap them. */
(function(){
  if(window.__ktAllSwitchesUsableProtected20260926)return;
  window.__ktAllSwitchesUsableProtected20260926=true;

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .prep-item',
    '.live-prep .room-switch',
    '.live-prep .prep-bottom button',
    '.live-prep .prep-bottom span',
    '.creator-top button',
    '.creator-tools button',
    '.creator-bottom button',
    '.creator-bottom .modes span',
    '.creator-bottom .creator-foot span',
    '.sheet button',
    '.kt-bottom button',
    '.bottom button',
    '[data-bottom]'
  ].join(',');

  function enable(el){
    if(!el)return;
    try{
      if(el.disabled)el.disabled=false;
      el.removeAttribute('disabled');
      if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
      if(el.hasAttribute('inert'))el.removeAttribute('inert');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
    }catch(e){}
  }

  function clearInvisibleBlockers(){
    try{
      var sh=document.getElementById('sheet');
      if(sh&&!sh.classList.contains('show'))sh.style.setProperty('pointer-events','none','important');
      else if(sh)sh.style.removeProperty('pointer-events');
    }catch(e){}

    try{
      document.querySelectorAll(
        '#ktFaceEffectLayer,#ktStageCanvas,.kt-live-profile-pop[aria-hidden="true"],[aria-hidden="true"].sheet'
      ).forEach(function(el){
        var cs=getComputedStyle(el);
        if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0){
          el.style.setProperty('pointer-events','none','important');
        }
      });
    }catch(e){}
  }

  function repair(){
    try{document.querySelectorAll(selector).forEach(enable);}catch(e){}
    clearInvisibleBlockers();
    try{
      if(typeof window.ktKeepWorkingControlsUnlocked==='function'){
        window.ktKeepWorkingControlsUnlocked();
      }
    }catch(e){}
  }

  function protect(){
    try{
      /* Protection lock does NOT disable UI. It only marks the approved state
         so later maintenance code should leave these controls alone. */
      if(typeof window.ktLockCurrentApprovedState==='function'){
        window.ktLockCurrentApprovedState();
      }
    }catch(e){}
  }

  repair();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(repair,ms);});
  setTimeout(function(){repair();protect();repair();},3000);

  window.addEventListener('pageshow',function(){repair();setTimeout(protect,180);});
  window.addEventListener('focus',repair);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(repair,40);
  });

  try{
    new MutationObserver(function(records){
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          try{if(n.matches&&n.matches(selector))enable(n);}catch(e){}
          try{if(n.querySelectorAll)n.querySelectorAll(selector).forEach(enable);}catch(e){}
        });
      });
      clearInvisibleBlockers();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* Keep all switches usable even after the protection state is locked. */
  setInterval(repair,1200);
})();
