/* Selective K-Talk work-protection locks.
   Lock 1: 9-person room bottom eight controls.
   Lock 2: current first public-video page opening + current 13-person room open-first countdown.
   These locks do not disable runtime controls; they mark approved working areas as protected from unrelated edits. */
(function(){
  if(window.__ktSelectiveProtectionLocks20260927)return;
  window.__ktSelectiveProtectionLocks20260927=true;

  function markLock1(){
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
        btn.disabled=false;
        btn.setAttribute('aria-disabled','false');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  function markLock2(){
    try{
      /* First public-video page/current first-video opening path */
      document.querySelectorAll(
        '.kt-public-feed-scroller,.kt-public-video,.video-home,.video-feed,#videoHome,#videoFeed'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','2');
        el.setAttribute('data-kt-protected-area','public_video_first_page_opening');
      });

      /* Current approved 13-person room and its open-first countdown state */
      document.querySelectorAll('#screen .ktg13-room[data-kt-approved13="1"],#ktLiveCountdown').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','2');
        el.setAttribute('data-kt-protected-area','group13_open_room_then_countdown');
      });
    }catch(e){}
  }

  function markAll(){markLock1();markLock2();}

  window.ktCurrentProtectionState=function(){
    return {
      group9_bottom_controls_8:true,
      public_video_first_page_opening:true,
      group13_open_room_then_countdown:true,
      lock_slots:{1:['group9_bottom_controls_8'],2:['public_video_first_page_opening','group13_open_room_then_countdown']}
    };
  };
  window.ktIsWorkProtected=function(name){
    return name==='group9_bottom_controls_8'||
           name==='public_video_first_page_opening'||
           name==='group13_open_room_then_countdown';
  };
  window.ktLockCurrentApprovedState=function(){markAll();return true;};
  window.ktIsLiveSignalWorkAllowed=function(){return true;};

  markAll();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(markAll,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktProtectionMarkTimer);
      window.__ktProtectionMarkTimer=setTimeout(markAll,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
