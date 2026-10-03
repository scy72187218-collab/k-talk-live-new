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


/* Lock 7: protect the complete current approved K-Talk state (5555).
   Maintenance/edit guard only; runtime controls remain usable. */
(function(){
  if(window.__ktFullStateLock7Installed20260927)return;
  window.__ktFullStateLock7Installed20260927=true;

  function markLock7(){
    try{
      var root=document.documentElement;
      root.setAttribute('data-kt-work-protected','1');
      root.setAttribute('data-kt-protection-slot','7');
      root.setAttribute('data-kt-protected-area','current_full_state_20260927_5555');

      document.querySelectorAll(
        '#screen,.ktsolo-room,.ktg9-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','7');
        el.setAttribute('data-kt-protected-area','current_full_state_20260927_5555');
      });

      document.querySelectorAll('button,[role="switch"],input,select,textarea').forEach(function(el){
        try{
          if(el.tagName==='BUTTON')el.disabled=false;
          el.setAttribute('aria-disabled','false');
          el.style.setProperty('pointer-events','auto','important');
          el.style.setProperty('touch-action','manipulation','important');
        }catch(e){}
      });
    }catch(e){}
  }

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.current_full_state_20260927_5555=true;
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[7]=['current_full_state_20260927_5555'];
    return s;
  };

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='current_full_state_20260927_5555')return true;
    try{return typeof oldProtected==='function'?!!oldProtected(name):false;}catch(e){return false;}
  };

  markLock7();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(markLock7,ms);});
})();


/* Lock 8: 2026-10-03 approved full-state lock.
   Password marker: 1150617.
   Only communication / live-signal connection work is allowed.
   Runtime controls remain usable; this is an edit/maintenance protection marker. */
(function(){
  if(window.__ktFullStateExceptCommunicationLock1150617)return;
  window.__ktFullStateExceptCommunicationLock1150617=true;

  var PASSWORD='1150617';
  var ALLOWED=[
    'communication',
    'live_signal',
    'webrtc',
    'livekit',
    'peer_connection',
    'remote_video_connection',
    'host_viewer_connection'
  ];

  function mark(){
    try{
      var root=document.documentElement;
      root.setAttribute('data-kt-work-protected','1');
      root.setAttribute('data-kt-protection-password',PASSWORD);
      root.setAttribute('data-kt-protection-mode','communication_only');
      root.setAttribute('data-kt-protected-area','everything_except_communication_20261003_1150617');

      document.querySelectorAll('#screen,.ktsolo-room,.ktg9-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-password',PASSWORD);
        el.setAttribute('data-kt-protection-mode','communication_only');
        el.setAttribute('data-kt-protected-area','everything_except_communication_20261003_1150617');
      });

      /* Do not disable user controls. Lock is for edits, not app usage. */
      document.querySelectorAll('button,[role="switch"],input,select,textarea').forEach(function(el){
        try{
          if(el.tagName==='BUTTON')el.disabled=false;
          el.setAttribute('aria-disabled','false');
          el.style.setProperty('pointer-events','auto','important');
          el.style.setProperty('touch-action','manipulation','important');
        }catch(e){}
      });
    }catch(e){}
  }

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.everything_except_communication_20261003_1150617=true;
    s.protection_password='1150617';
    s.edit_mode='communication_only';
    s.allowed_edit_areas=ALLOWED.slice();
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[8]=['everything_except_communication_20261003_1150617'];
    return s;
  };

  window.ktProtectionPassword1150617=function(v){return String(v||'')===PASSWORD;};
  window.ktIsCommunicationEditAllowed=function(name){
    name=String(name||'').toLowerCase();
    return ALLOWED.some(function(x){return name.indexOf(x)>-1;});
  };
  window.ktIsLiveSignalWorkAllowed=function(){return true;};

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='everything_except_communication_20261003_1150617')return true;
    if(window.ktIsCommunicationEditAllowed(name))return false;
    try{return typeof oldProtected==='function'?!!oldProtected(name):true;}catch(e){return true;}
  };

  mark();
  [60,180,450,900,1800].forEach(function(ms){setTimeout(mark,ms);});
})();


/* 2026-10-03 explicit protected-area declaration.
   Communication only is excluded; chat/switch/AI guidance/usage UI are protected under 1150617. */
(function(){
  try{
    window.__ktProtectedAreas1150617 = {
      password: '1150617',
      mode: 'communication_only',
      chat_switch_ai_usage_locked_1150617: true,
      protected: [
        'chat',
        'switches',
        'ai_voice_and_ai_talk',
        'usage_guide_and_help',
        'screen_layout',
        'buttons',
        'settings',
        'revenue_ui',
        'all_non_communication_features'
      ],
      allowed: [
        'communication',
        'live_signal',
        'webrtc',
        'livekit',
        'peer_connection',
        'remote_video_connection',
        'host_viewer_connection'
      ]
    };
  }catch(e){}
})();


/* Lock 9: preserve the currently working 9-room entry/display exactly as approved.
   Password marker: 1150617.
   Runtime buttons remain usable; this is an edit/maintenance lock only. */
(function(){
  if(window.__ktNineRoomDisplayLock1150617)return;
  window.__ktNineRoomDisplayLock1150617=true;

  function markNine(){
    try{
      document.querySelectorAll(
        '#screen .ktg13-room[data-kt-room="9"],#screen .kt-remote-live.kt-g9-host-copy,#screen .ktg9-room'
      ).forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-password','1150617');
        el.setAttribute('data-kt-protected-area','nine_room_entry_display_20261003_1150617');
        el.setAttribute('data-kt-nine-room-locked','1');
      });
    }catch(e){}
  }

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.nine_room_entry_display_20261003_1150617=true;
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[9]=['nine_room_entry_display_20261003_1150617'];
    return s;
  };

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='nine_room_entry_display_20261003_1150617')return true;
    try{return typeof oldProtected==='function'?!!oldProtected(name):false;}catch(e){return false;}
  };

  markNine();
  [60,180,450,900,1800].forEach(function(ms){setTimeout(markNine,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktNineRoomDisplayLockTimer1150617);
      window.__ktNineRoomDisplayLockTimer1150617=setTimeout(markNine,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();


/* Saved state: 2026-10-03 current approved 9-room appearance/video behavior.
   Password marker: 1150617.
   Preserve current room layout, host video placement, and transient-flash suppression. */
(function(){
  if(window.__ktSavedNineRoomState20261003_1150617)return;
  window.__ktSavedNineRoomState20261003_1150617=true;

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.saved_current_nine_room_state_20261003_1150617=true;
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[10]=['saved_current_nine_room_state_20261003_1150617'];
    return s;
  };

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='saved_current_nine_room_state_20261003_1150617')return true;
    try{return typeof oldProtected==='function'?!!oldProtected(name):false;}catch(e){return false;}
  };
})();


/* Lock 9: protect current red LIVE indicator behavior (2026-10-03, 1150617).
   Maintenance marker only; runtime LIVE state still follows actual broadcast status. */
(function(){
  if(window.__ktRedLiveIndicatorLock1150617)return;
  window.__ktRedLiveIndicatorLock1150617=true;

  function markRedLive(){
    try{
      document.querySelectorAll('.kt-live-dot,.kt-live-card em,.kt-live-list-head,.kt-live-now-title').forEach(function(el){
        el.setAttribute('data-kt-work-protected','1');
        el.setAttribute('data-kt-protection-slot','9');
        el.setAttribute('data-kt-protected-area','red_live_indicator_current_state_20261003_1150617');
        el.setAttribute('data-kt-protection-password','1150617');
      });
    }catch(e){}
  }

  var oldState=window.ktCurrentProtectionState;
  window.ktCurrentProtectionState=function(){
    var s={};
    try{s=typeof oldState==='function'?(oldState()||{}):{};}catch(e){s={};}
    s.red_live_indicator_current_state_20261003_1150617=true;
    s.lock_slots=s.lock_slots||{};
    s.lock_slots[9]=['red_live_indicator_current_state_20261003_1150617'];
    return s;
  };

  var oldProtected=window.ktIsWorkProtected;
  window.ktIsWorkProtected=function(name){
    if(name==='red_live_indicator_current_state_20261003_1150617')return true;
    try{return typeof oldProtected==='function'?!!oldProtected(name):false;}catch(e){return false;}
  };

  markRedLive();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(markRedLive,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRedLiveLockTimer);
      window.__ktRedLiveLockTimer=setTimeout(markRedLive,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
