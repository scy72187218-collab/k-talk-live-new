(function(){
  if(window.__ktEntrySpeedTune20261006)return;
  window.__ktEntrySpeedTune20261006=true;

  function run(hostId,stream){
    hostId=String(hostId||'').trim();
    if(!hostId||typeof window.ktStartRemoteHostVideoNow20261003!=='function')return;
    [0,20,50,100].forEach(function(ms){
      setTimeout(function(){
        try{window.ktStartRemoteHostVideoNow20261003(hostId,stream||null);}catch(e){}
      },ms);
    });
  }

  document.addEventListener('pointerdown',function(e){
    try{
      var card=e.target&&e.target.closest?e.target.closest('[data-host]'):null;
      if(!card)return;
      var hostId=String(card.getAttribute('data-host')||'').trim();
      if(!hostId)return;
      var stream=null;
      var v=card.querySelector('video');
      try{
        var s=v&&v.srcObject||null;
        var t=s&&s.getVideoTracks&&s.getVideoTracks()[0]||null;
        if(t&&t.readyState==='live')stream=s;
      }catch(_e){}
      run(hostId,stream);
    }catch(e){}
  },true);

  window.addEventListener('kt-remote-host-selected',function(e){
    try{
      var d=e&&e.detail||{};
      run(d.host_id,d.entry_stream||null);
    }catch(e){}
  });

  /* 9999 통신 전용 선연결:
     빨간 LIVE가 화면에 보이는 순간 영상 연결만 미리 시작한다.
     방 화면/버튼/배치에는 손대지 않고, 실제 탭 시 이미 받은 스트림을 즉시 재사용한다. */
  var prewarmHost='',prewarmAt=0;
  function prewarmVisibleLive(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return;
      var hostId='';
      var b=document.querySelector('.ktvl-live[data-host],.kt-live-card[data-host],.kt-live-list-enter[data-host]');
      if(b)hostId=String(b.getAttribute('data-host')||'').trim();

      /* LIVE 버튼 DOM이 아직 안 그려졌어도, 방 메타/Realtime에서 host_id가 잡히는 즉시
         영상 연결부터 먼저 시작한다. 페이지가 뜬 뒤 20초 기다리는 구간을 없애기 위한 통신 전용 보강. */
      if(!hostId){
        try{hostId=String(window.__ktLastLiveRoom&&window.__ktLastLiveRoom.host_id||'').trim();}catch(_e){}
      }
      if(!hostId){
        try{
          var rh=window.__ktRealtimeLiveHosts||{};
          var ids=Object.keys(rh);
          if(ids.length)hostId=String((rh[ids[0]]&&rh[ids[0]].data&&rh[ids[0]].data.host_id)||ids[0]||'').trim();
        }catch(_e){}
      }
      if(!hostId)return;

      var now=Date.now();
      if(hostId===prewarmHost&&now-prewarmAt<1200)return;
      prewarmHost=hostId;prewarmAt=now;
      run(hostId,null);
      try{
        window.__ktRemoteHostId=hostId;
        window.__ktCurrentRemoteHostId=hostId;
        sessionStorage.setItem('kt_remote_host_id',hostId);
      }catch(_e){}
      try{
        if(typeof window.ktDirectViewerWatchNow9999==='function'){
          window.ktDirectViewerWatchNow9999();
          setTimeout(function(){try{window.ktDirectViewerWatchNow9999();}catch(_e){}},60);
        }
      }catch(_e){}
    }catch(e){}
  }

  [0,80,180,350,700].forEach(function(ms){setTimeout(prewarmVisibleLive,ms);});
  try{
    new MutationObserver(function(){setTimeout(prewarmVisibleLive,0);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(prewarmVisibleLive,1200);
})();