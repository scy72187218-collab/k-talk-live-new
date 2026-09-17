/* K-Talk 실시간 방송 + AI 읽기 실행 연결 보강. UI 변경 없음. */
(function(){
  if(window.__ktRuntimeLiveAIHealth20260913)return;
  window.__ktRuntimeLiveAIHealth20260913=true;

  function hasScript(src){
    return [].slice.call(document.scripts||[]).some(function(s){return String(s.src||'').indexOf(src)>-1;});
  }

  function waitGuard(guard,done,tryNo){
    if(!guard||window[guard]){if(done)done();return;}
    tryNo=tryNo||0;
    if(tryNo>=30){if(done)done();return;}
    setTimeout(function(){waitGuard(guard,done,tryNo+1);},100);
  }

  function load(src,guard,done){
    try{
      if(guard&&window[guard]){if(done)done();return;}
      if(hasScript(src)){waitGuard(guard,done,0);return;}
      var s=document.createElement('script');
      s.src=src+'?v=20260915-requestedonly1';
      s.async=false;
      s.onload=function(){if(done)done();};
      s.onerror=function(){if(done)done();};
      document.head.appendChild(s);
    }catch(e){if(done)done();}
  }

  load('chat-benefit-ai-reader.js','__ktChatBenefitAIReaderInstalled',function(){
    load('live-presence.js','__ktLivePresenceInstalled',function(){
      load('live-video-discovery.js','__ktLiveVideoDiscoveryInstalled',function(){
        load('live-viewer-interactions.js','__ktLiveViewerInteractionInstalled');
      });
    });
  });

  /* 원격 시청 영상이 검게 멈추거나 끊겼을 때만 재연결. */
  load('remote-live-video-fallback-20260914.js','__ktRemoteLiveVideoFallback20260914');

  load('secret-return-down-20260914.js','__ktSecretReturnDown20260914');
  load('creator-room-shortcuts-solo-only-20260914.js','__ktCreatorRoomShortcutsSoloOnly20260914');
  load('live-prep-remove-duplicate-9only-20260914.js','__ktRemoveDuplicate9Only20260914');
  load('creator-top-live-label-only-20260914.js','__ktCreatorTopLiveLabelOnly20260914');
  load('creator-foot-under-timer-20260914.js','__ktCreatorFootUnderTimer20260914');
  load('creator-person-smaller-only-20260917.js','__ktCreatorPersonSmallerOnly20260917');
  load('participant-photo-wave-only-20260915.js','__ktParticipantPhotoWaveOnly20260915');
  load('gift-balance-box-20260915.js','__ktGiftBalanceBox20260915');
  load('group13-approved-room.js','__ktGroup13ApprovedRoomInstalled');
  load('feed-swipe-playback-fix.js','__ktFeedSwipePlaybackFixInstalled',function(){
    load('broadcast-video-resume-fix.js','__ktBroadcastVideoResumeFixInstalled');
  });
  load('live-room-instant-video-fix-20260915.js','__ktLiveRoomInstantVideoFixInstalled');

  /* 조금 아까 정상 동작하던 상태: 승인된 게스트를 칸 안에 넣는 기존 격자 코드만 사용. */
  load('approved-guest-grid-clean-only-20260917.js','__ktApprovedGuestGridCleanOnly20260917');
  load('approved-guest-person-medium-only-20260917.js','__ktApprovedGuestPersonMediumOnly20260917');

  /* 승인된 게스트 격자에서 내 칸은 반드시 해당 폰의 앞카메라만 표시. */
  load('approved-guest-self-camera-only-20260917.js','__ktApprovedGuestSelfCameraOnly20260917');

  load('host-gift-row-hide-only-20260917.js','__ktHostGiftRowHideOnly20260917');
})();
