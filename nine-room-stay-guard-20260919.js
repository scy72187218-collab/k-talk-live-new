/* K-Talk 9명방: 참여 기기가 순간 연결 끊김/화면 숨김 때문에 자동으로 방송목록으로 빠지지 않게 유지.
   사용자가 직접 뒤로가기를 누르면 정상 퇴장.
   다른 방/레이아웃/버튼은 변경하지 않음. */
(function(){
  if(window.__ktNineRoomStayGuard20260919)return;
  window.__ktNineRoomStayGuard20260919=true;

  var pinnedHost='';
  var manualLeave=false;
  var reconnectTimer=0;
  var wrappingTimer=0;

  function nineContext(){
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      if(t==='group9'||n.indexOf('9명')>-1)return true;
    }catch(e){}
    try{
      if(document.querySelector('.ktg13-room[data-kt-room="9"]'))return true;
      var meta=document.querySelector('.kt-remote-meta span');
      if(meta&&String(meta.textContent||'').indexOf('9명')>-1)return true;
    }catch(e){}
    return false;
  }

  function liveVisible(){
    try{
      return !!document.querySelector('.ktg13-room[data-kt-room="9"],.kt-remote-live,.kt-approved-guest-grid');
    }catch(e){return false;}
  }

  function scheduleReconnect(){
    if(!pinnedHost||manualLeave||document.hidden)return;
    clearTimeout(reconnectTimer);
    reconnectTimer=setTimeout(function(){
      if(!pinnedHost||manualLeave||document.hidden)return;
      try{
        if(liveVisible())return;
        if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(pinnedHost);
      }catch(e){}
    },700);
  }

  function wrap(){
    try{
      var enter=window.ktEnterRemoteLive;
      if(typeof enter==='function'&&!enter.__ktNineStayWrapped){
        var wrappedEnter=async function(hostId){
          if(hostId)pinnedHost=String(hostId);
          manualLeave=false;
          return enter.apply(this,arguments);
        };
        wrappedEnter.__ktNineStayWrapped=true;
        wrappedEnter.__ktNineStayOriginal=enter;
        window.ktEnterRemoteLive=wrappedEnter;
      }
    }catch(e){}

    try{
      var leave=window.ktLeaveRemoteLive;
      if(typeof leave==='function'&&!leave.__ktNineStayWrapped){
        var wrappedLeave=async function(silent){
          if(manualLeave||!pinnedHost||!nineContext()){
            var r=await leave.apply(this,arguments);
            if(manualLeave)pinnedHost='';
            return r;
          }
          /* 자동 끊김은 화면을 유지하고 잠시 뒤 같은 방을 다시 확인 */
          scheduleReconnect();
          return false;
        };
        wrappedLeave.__ktNineStayWrapped=true;
        wrappedLeave.__ktNineStayOriginal=leave;
        window.ktLeaveRemoteLive=wrappedLeave;
      }
    }catch(e){}
  }

  function allowManualLeave(){
    manualLeave=true;
    clearTimeout(reconnectTimer);
    setTimeout(function(){manualLeave=false;},1200);
  }

  document.addEventListener('pointerdown',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.kt-remote-back,.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'):null;
    if(t)allowManualLeave();
  },true);

  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.kt-remote-back,.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'):null;
    if(t)allowManualLeave();
  },true);

  /* 홈 버튼/알림창/다른 앱으로 잠깐 나가도 자동 퇴장 이벤트를 막는다. */
  document.addEventListener('visibilitychange',function(e){
    if(document.hidden&&pinnedHost&&nineContext()){
      try{e.stopImmediatePropagation();}catch(x){}
    }else if(!document.hidden&&pinnedHost){
      setTimeout(function(){wrap();scheduleReconnect();},120);
    }
  },true);

  /* 다른 코드가 방송목록으로 돌려보내도 9명방 참여 중이면 같은 방으로 복귀 */
  try{
    new MutationObserver(function(){
      clearTimeout(wrappingTimer);
      wrappingTimer=setTimeout(function(){
        wrap();
        if(pinnedHost&&!manualLeave&&!document.hidden&&!liveVisible())scheduleReconnect();
      },80);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  wrap();
  [100,350,800,1500,3000].forEach(function(ms){setTimeout(wrap,ms);});
  setInterval(function(){wrap();if(pinnedHost&&!manualLeave&&!document.hidden&&!liveVisible())scheduleReconnect();},1200);
})();