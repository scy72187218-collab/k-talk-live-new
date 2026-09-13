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
      s.src=src+'?v=20260913-health2';
      s.async=false;
      s.onload=function(){if(done)done();};
      s.onerror=function(){if(done)done();};
      document.head.appendChild(s);
    }catch(e){if(done)done();}
  }

  load('chat-benefit-ai-reader.js','__ktChatBenefitAIReaderInstalled',function(){
    load('live-presence.js','__ktLivePresenceInstalled',function(){
      load('live-presence-watchdog.js','__ktLivePresenceWatchdogInstalled',function(){
        load('live-video-discovery.js','__ktLiveVideoDiscoveryInstalled',function(){
          load('live-viewer-interactions.js','__ktLiveViewerInteractionInstalled');
        });
      });
    });
  });
})();
