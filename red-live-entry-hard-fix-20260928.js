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

  function openShellNow20261001(hostId){
    try{
      hostId=String(hostId||'').trim();
      if(!hostId)return false;
      window.__ktRemoteHostId=hostId;
      window.__ktCurrentRemoteHostId=hostId;
      try{sessionStorage.setItem('kt_remote_host_id',hostId);}catch(e){}
      document.documentElement.classList.add('kt-remote-viewing');

      var screen=document.getElementById('screen');
      if(!screen)return false;
      if(screen.querySelector('.kt-remote-live'))return true;

      var room=null;
      try{
        if(window.__ktLastLiveRoom&&String(window.__ktLastLiveRoom.host_id||'')===hostId){
          room=window.__ktLastLiveRoom;
        }
      }catch(e){}
      room=room||{host_name:'K-Talk',title:'라이브',room_name:'방송'};

      function esc(s){return String(s||'').replace(/[&<>"]/g,'');}
      screen.innerHTML='<section class="kt-remote-live">'+
        '<video id="ktRemoteLiveVideo" autoplay playsinline muted></video>'+
        '<div class="kt-remote-shade"></div>'+
        '<div class="kt-remote-top">'+
          '<button class="kt-remote-back" type="button">‹</button>'+
          '<div class="kt-remote-meta"><b><i class="kt-live-dot"></i>'+esc(room.host_name||'K-Talk')+'</b>'+
          '<span>'+esc(room.title||room.room_name||'라이브')+' · '+esc(room.room_name||'방송')+'</span></div>'+
          '<div id="ktRemoteViewerCount" class="kt-remote-viewers">👁 연결 중</div>'+
        '</div>'+
        '<div id="ktRemoteLiveStatus" class="kt-remote-status">방송 영상 연결 중…</div>'+
      '</section>';
      var back=screen.querySelector('.kt-remote-back');
      if(back)back.onclick=function(){try{if(window.ktLeaveRemoteLive)window.ktLeaveRemoteLive();}catch(e){}};
      try{
        window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{detail:{host_id:hostId,instant_shell:true}}));
      }catch(e){}
      return true;
    }catch(e){return false;}
  }

  function enter(btn,e){
    if(!btn)return false;
    var now=Date.now();
    if(now-lastTap<1500){
      try{
        if(e){
          e.preventDefault();
          e.stopPropagation();
          if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        }
      }catch(_e){}
      return true;
    }
    var id=hostIdFrom(btn);
    if(!id)return false;

    /* 다른 LIVE 입장 보강 코드와도 공유하는 전역 중복 방지.
       같은 호스트는 한 번의 실제 터치에서 입장 함수를 한 번만 호출한다. */
    try{
      var gh=String(window.__ktLiveEnterOnceHost20260930||'');
      var ga=Number(window.__ktLiveEnterOnceAt20260930||0);
      if(gh===id&&now-ga<1800){
        if(e){
          e.preventDefault();
          e.stopPropagation();
          if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        }
        return true;
      }
      window.__ktLiveEnterOnceHost20260930=id;
      window.__ktLiveEnterOnceAt20260930=now;
    }catch(_e){}

    lastTap=now;
    try{
      if(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      }
    }catch(_e){}

    /* Show the room shell on the exact pointer/touch event.
       Network discovery and video negotiation continue after the screen change. */
    try{openShellNow20261001(id);}catch(_e){}

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
        },60);
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
        '.ktvl-live,#ktRedLiveReceiverFallback20260930 .kt-rx-live,.kt-rx-live,'+
        '.kt-follow-person.live,.kt-friend-bubble.live,'+
        '.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,'+
        '[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]'
      );
    }catch(_e){return null;}
  }

  /* window capture에서 먼저 잡아서 다른 스크립트가 클릭을 먹어도 LIVE 입장은 살아 있게 한다. */
  window.addEventListener('pointerdown',function(e){
    var b=target(e);if(b)enter(b,e);
  },{capture:true,passive:false});

  /* PointerEvent가 없는 구형 기기만 touchstart를 사용한다.
     같은 터치를 여러 이벤트가 중복 처리하지 않게 해서 기기별 지연 차이를 줄인다. */
  if(!window.PointerEvent){
    window.addEventListener('touchstart',function(e){
      var b=target(e);if(b)enter(b,e);
    },{capture:true,passive:false});
  }

  /* click은 pointer/touch가 누락된 경우에만 마지막 예비 경로로 사용한다. */
  window.addEventListener('click',function(e){
    var b=target(e);if(b)enter(b,e);
  },true);

  function repair(){
    try{
      document.querySelectorAll('.ktvl-live,#ktRedLiveReceiverFallback20260930 .kt-rx-live,.kt-rx-live,.kt-follow-person.live,.kt-friend-bubble.live,.kt-friend-contact-actions .livebtn,.kt-live-card,.kt-live-list-enter,[onclick*="ktFriendEnterLive"],[onclick*="ktEnterRemoteLive"]').forEach(function(b){
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

  /* Owner lock: keep the current instant red-LIVE entry behavior fixed.
     This locks only this entry handler state, not other room/buttons/features. */
  try{
    Object.defineProperty(window,'__ktRedLiveInstantEntryLocked20261001',{
      value:true,writable:false,configurable:false,enumerable:true
    });
  }catch(e){window.__ktRedLiveInstantEntryLocked20261001=true;}

  repair();
  setInterval(repair,400);
  try{
    new MutationObserver(function(){setTimeout(repair,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();