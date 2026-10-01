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
        var oc=String(btn&&btn.getAttribute&&btn.getAttribute('onclick')||'');
        var m=oc.match(/kt(?:FriendEnterLive|EnterRemoteLive)\(\s*['"]([^'"]+)['"]/);
        if(m&&m[1])id=String(m[1]).trim();
      }catch(e){}
    }
    if(!id){
      try{
        var p=btn&&btn.closest&&btn.closest('[data-host]');
        id=String(p&&p.getAttribute('data-host')||'').trim();
      }catch(e){}
    }
    if(!id){
      try{id=String(window.__ktRemoteHostId||'').trim();}catch(e){}
    }
    if(!id){
      try{id=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    }
    if(!id){
      try{id=String(window.__ktLastLiveRoom&&window.__ktLastLiveRoom.host_id||'').trim();}catch(e){}
    }
    return id;
  }

  function enter(btn,e){
    if(!btn)return false;
    var now=Date.now();
    if(now-lastTap<450)return true;
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
        /* 일부 Android WebView에서 첫 pointer 호출이 먹히지 않는 경우만
           같은 host_id로 짧게 한 번 더 보강한다. */
        setTimeout(function(){
          try{
            var root=document.querySelector('.kt-remote-live');
            var visible=!!(root&&getComputedStyle(root).display!=='none');
            if(!visible&&typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(id);
          }catch(_e){}
        },90);
        return true;
      }
    }catch(_e){}

    /* 함수 교체 타이밍이 겹친 경우 한 번 더 즉시 재시도. */
    setTimeout(function(){
      try{
        if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(id);
      }catch(_e){}
    },30);
    return true;
  }

  function target(e){
    try{return e&&e.target&&e.target.closest?e.target.closest('.ktvl-live'):null;}catch(_e){return null;}
  }

  /* window capture에서 먼저 잡아서 다른 스크립트가 클릭을 먹어도 LIVE 입장은 살아 있게 한다. */
  window.addEventListener('pointerdown',function(e){
    var b=target(e);if(b)enter(b,e);
  },true);

  window.addEventListener('touchstart',function(e){
    var b=target(e);if(b)enter(b,e);
  },{capture:true,passive:false});

  window.addEventListener('click',function(e){
    var b=target(e);if(b)enter(b,e);
  },true);

  function repair(){
    try{
      document.querySelectorAll('.ktvl-live').forEach(function(b){
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