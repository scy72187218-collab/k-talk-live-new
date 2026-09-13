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
      s.src=src+'?v=20260913-health3';
      s.async=false;
      s.onload=function(){if(done)done();};
      s.onerror=function(){if(done)done();};
      document.head.appendChild(s);
    }catch(e){if(done)done();}
  }

  /* AI 읽기 → 기본 실시간 방송 등록/입장 → LIVE 표시 → 시청자 상호작용 순서. */
  load('chat-benefit-ai-reader.js','__ktChatBenefitAIReaderInstalled',function(){
    load('live-presence.js','__ktLivePresenceInstalled',function(){
      /* live-presence가 정상 설치되면 별도 watchdog을 같이 돌리지 않는다. 중복 방송 등록 방지. */
      load('live-video-discovery.js','__ktLiveVideoDiscoveryInstalled',function(){
        load('live-viewer-interactions.js','__ktLiveViewerInteractionInstalled');
      });
    });
  });

  /* 비밀방 되돌리기 버튼 위치만 조금 아래로. */
  load('secret-return-down-20260914.js','__ktSecretReturnDown20260914');

  /* 촬영 화면 방송 바로가기는 1인 방송만 표시. */
  load('creator-room-shortcuts-solo-only-20260914.js','__ktCreatorRoomShortcutsSoloOnly20260914');

  /* 라이브 준비 화면의 중복 9명 방송 버튼 하나만 숨김. */
  load('live-prep-remove-duplicate-9only-20260914.js','__ktRemoveDuplicate9Only20260914');

  /* 촬영 화면 위쪽 '라이브' 글씨만 '동영상 촬영 시간'으로 변경. */
  load('creator-top-live-label-only-20260914.js','__ktCreatorTopLiveLabelOnly20260914');

  /* 촬영 화면의 게시·창작하기·라이브 줄만 시간 선택줄 바로 아래로 이동하고 조금 굵게. */
  load('creator-foot-under-timer-20260914.js','__ktCreatorFootUnderTimer20260914');
})();
