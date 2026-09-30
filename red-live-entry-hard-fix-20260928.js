/* K-Talk: 빨간 LIVE 버튼 입장 전용 강제 연결 (2026-09-28)
   범위: 동영상 화면의 빨간 LIVE 버튼 클릭/터치만 보강. 다른 UI/방/통신 로직은 변경하지 않음. */
(function(){
  if(window.__ktRedLiveEntryHardFix20260928)return;
  window.__ktRedLiveEntryHardFix20260928=true;

  var lastTap=0;

  function hostIdFrom(btn){
    var id='';
    try{id=String(btn&&btn.getAttribute&&btn.getAttribute('data-host')||'').trim();}catch(e){}
    if(!id){
      try{
        var p=btn&&btn.closest&&btn.closest('[data-host]');
        id=String(p&&p.getAttribute('data-host')||'').trim();
      }catch(e){}
    }
    if(!id){
      try{id=String(window.__ktLastLiveRoom&&window.__ktLastLiveRoom.host_id||'').trim();}catch(e){}
    }
    return id;
  }

  function enter(btn,e){
    if(!btn)return false;
    var now=Date.now();
    if(now-lastTap<180)return true;
    var id=hostIdFrom(btn);
    if(!id)return false;

    lastTap=now;
    try{
      if(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      }
    }catch(_e){}

    try{
      btn.style.setProperty('pointer-events','auto','important');
      btn.style.setProperty('touch-action','manipulation','important');
      btn.style.setProperty('opacity','1','important');
    }catch(_e){}

    /* 현재 최종 입장 함수를 바로 호출한다. */
    try{
      if(typeof window.ktEnterRemoteLive==='function'){
        window.ktEnterRemoteLive(id);
        /* 정상 함수는 즉시 방 껍데기를 연다. 120ms 뒤에도 화면 전환이
           없을 때만 같은 입장을 한 번 더 호출해 느린 모바일 첫 탭 누락을 보정한다. */
        setTimeout(function(){
          try{
            if(!document.documentElement.classList.contains('kt-remote-viewing')&&
               typeof window.ktEnterRemoteLive==='function'){
              window.ktEnterRemoteLive(id);
            }
          }catch(_e){}
        },120);
        return true;
      }
    }catch(_e){}

    /* 함수 교체 타이밍이 겹친 경우 한 번 더 즉시 재시도. */
    setTimeout(function(){
      try{
        if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(id);
      }catch(_e){}
    },20);
    return true;
  }

  function target(e){
    try{
      if(!e||!e.target||!e.target.closest)return null;
      return e.target.closest(
        '.ktvl-live,.kt-rx-live,.kt-follow-person.live,.kt-friend-bubble.live,'+
        '.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,'+
        '[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]'
      );
    }catch(_e){return null;}
  }

  /* window capture에서 먼저 잡아서 다른 스크립트가 클릭을 먹어도 LIVE 입장은 살아 있게 한다. */
  window.addEventListener('pointerdown',function(e){
    var b=target(e);if(b)enter(b,e);
  },true);

  window.addEventListener('touchstart',function(e){
    var b=target(e);if(b)enter(b,e);
  },{capture:true,passive:false});

  window.addEventListener('touchend',function(e){
    var b=target(e);if(b)enter(b,e);
  },{capture:true,passive:false});

  window.addEventListener('click',function(e){
    var b=target(e);if(b)enter(b,e);
  },true);

  function repair(){
    try{
      document.querySelectorAll('.ktvl-live,.kt-rx-live,.kt-follow-person.live,.kt-friend-bubble.live,.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]').forEach(function(b){
        b.style.setProperty('pointer-events','auto','important');
        b.style.setProperty('touch-action','manipulation','important');
        b.style.setProperty('position','relative','important');
        b.style.setProperty('z-index','999','important');
        if(!b.dataset.ktRedLiveHardFix){
          b.dataset.ktRedLiveHardFix='1';
          b.addEventListener('click',function(e){enter(b,e);},true);
        }
      });
    }catch(e){}
  }

  repair();
  setInterval(repair,400);
  try{
    new MutationObserver(function(){setTimeout(repair,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();