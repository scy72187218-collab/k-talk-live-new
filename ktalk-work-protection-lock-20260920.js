/* Selective K-Talk work-protection lock.
   Lock slot 1: 9-person room bottom controls only.
   This does NOT disable the buttons; it only marks them as protected from unrelated edits. */
(function(){
  if(window.__ktGroup9BottomEightProtection1)return;
  window.__ktGroup9BottomEightProtection1=true;

  function mark(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var tools=room.querySelector('.ktg13-tools');
      if(!tools)return;
      tools.setAttribute('data-kt-work-protected','1');
      tools.setAttribute('data-kt-protection-slot','1');
      tools.querySelectorAll('.ktg13-tool').forEach(function(btn){
        btn.setAttribute('data-kt-work-protected','1');
        btn.setAttribute('data-kt-protection-slot','1');
        /* keep controls fully usable */
        btn.disabled=false;
        btn.setAttribute('aria-disabled','false');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  window.ktCurrentProtectionState=function(){
    return {group9_bottom_controls_8:true,lock_slot:1};
  };
  window.ktIsWorkProtected=function(name){
    return name==='group9_bottom_controls_8';
  };
  window.ktLockCurrentApprovedState=function(){mark();return true;};
  window.ktIsLiveSignalWorkAllowed=function(){return true;};

  mark();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(mark,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9ProtectTimer);
      window.__ktG9ProtectTimer=setTimeout(mark,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
