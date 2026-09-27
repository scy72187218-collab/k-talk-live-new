/* Selective K-Talk work-protection locks.
   Lock 1: 9-person room bottom eight controls.
   Lock 2: current first public-video page opening + current 13-person room open-first countdown.
   Lock 3: current subscriber-room state + public-video rose/message/share controls.
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
      document.querySelectorAll(
        '.kt-public-feed-scroller,.kt-public-video,.video-home,.video-feed,#videoHome,#videoFeed'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','2');
        el.setAttribute('data-kt-protected-area','public_video_first_page_opening');
      });

      document.querySelectorAll('#screen .ktg13-room[data-kt-approved13="1"],#ktLiveCountdown').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','2');
        el.setAttribute('data-kt-protected-area','group13_open_room_then_countdown');
      });
    }catch(e){}
  }

  function markLock3(){
    try{
      /* Subscriber room current approved state */
      document.querySelectorAll(
        '#screen .ktsubscriber-room,.ktsubscriber-room,[data-kt-room="subscriber"]'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','3');
        el.setAttribute('data-kt-protected-area','subscriber_room_current_state');
      });

      /* Public-video rose, message and share controls only */
      document.querySelectorAll(
        '.vh-actions .kt-feed-final-rose,.vh-actions .kt-feed-final-message,.vh-actions .kt-feed-final-share'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','3');
        el.setAttribute('data-kt-protected-area','public_video_rose_message_share');
        el.disabled=false;
        el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  function markAll(){markLock1();markLock2();markLock3();}

  window.ktCurrentProtectionState=function(){
    return {
      group9_bottom_controls_8:true,
      public_video_first_page_opening:true,
      group13_open_room_then_countdown:true,
      subscriber_room_current_state:true,
      public_video_rose_message_share:true,
      lock_slots:{
        1:['group9_bottom_controls_8'],
        2:['public_video_first_page_opening','group13_open_room_then_countdown'],
        3:['subscriber_room_current_state','public_video_rose_message_share']
      }
    };
  };

  window.ktIsWorkProtected=function(name){
    return name==='group9_bottom_controls_8'||
           name==='public_video_first_page_opening'||
           name==='group13_open_room_then_countdown'||
           name==='subscriber_room_current_state'||
           name==='public_video_rose_message_share';
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


/* Lock 4: secret-room ranking / mission / viewers / flip / treasure / match.
   Protection only: controls remain enabled and usable. */
(function(){
  if(window.__ktSecretRoomLock4Installed20260927)return;
  window.__ktSecretRoomLock4Installed20260927=true;

  function markSecretLock4(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;

      var list=[];
      room.querySelectorAll('[data-kt-room-rank],[data-kt-room-mission],.kt-room-viewers-copy,.ktsecret-right button,.kt-three-quick-flip,.kt-three-quick-treasure,.kt-three-quick-match').forEach(function(el){
        var text=String(el.textContent||'').replace(/\s+/g,'');
        var aria=String(el.getAttribute&&el.getAttribute('aria-label')||'').replace(/\s+/g,'');
        var key=text+' '+aria;
        if(
          el.matches('[data-kt-room-rank],[data-kt-room-mission],.kt-room-viewers-copy') ||
          key.indexOf('일일랭킹')>-1 ||
          key.indexOf('미션')>-1 ||
          key.indexOf('시청자')>-1 ||
          key.indexOf('되돌리기')>-1 ||
          key.indexOf('뒤집기')>-1 ||
          key.indexOf('보물상자')>-1 ||
          key.indexOf('매치')>-1
        ) list.push(el);
      });

      list.forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','4');
        el.setAttribute('data-kt-protected-area','secret_room_rank_mission_viewers_flip_treasure_match');
        if(el.tagName==='BUTTON')el.disabled=false;
        el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      });
    }catch(e){}
  }

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.secret_room_rank_mission_viewers_flip_treasure_match=true;
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[4]=['secret_room_rank_mission_viewers_flip_treasure_match'];
    return s;
  };

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='secret_room_rank_mission_viewers_flip_treasure_match')return true;
    try{return typeof oldProtected==='function'?!!oldProtected(name):false;}catch(e){return false;}
  };

  markSecretLock4();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(markSecretLock4,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretLock4Timer);
      window.__ktSecretLock4Timer=setTimeout(markSecretLock4,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
