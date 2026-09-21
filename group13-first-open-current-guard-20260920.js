/* K-Talk 13명방 첫 진입 안정화 전용.
   첫 입장 때 예전 13명방 DOM이 잠깐 다시 그려지면 즉시 현재 승인 화면으로 복구한다.
   13명방 외 다른 방/카메라/채팅/선물/스위치/프로필은 변경하지 않음. */
(function(){
  if(window.__ktGroup13FirstOpenCurrentGuard20260920)return;
  window.__ktGroup13FirstOpenCurrentGuard20260920=true;

  var guardUntil=0;
  var stableUntil=0;
  var repairing=false;
  var startWrapped=false;

  function is13(){
    try{
      var st=window.state||{};
      var t=String(st.liveRoomType||'');
      var n=String(st.liveRoomName||'');
      var max=Number(st.liveRoomMax||0);
      if(t==='group13')return true;
      if(t==='group'&&max===13)return true;
      if(n==='13명 방송')return true;
    }catch(e){}
    try{
      var title=document.getElementById('liveTitle');
      if(title&&String(title.value||'').trim()==='13명 방송')return true;
    }catch(e){}
    return false;
  }

  function opening(){
    return Date.now()<guardUntil;
  }

  function arm(){
    /* 사양이 낮은 기기에서는 13명방 DOM 생성 전에 홈 동영상 복구가 먼저 실행될 수 있어
       방송 시작 터치 순간부터 13명방이 실제로 그려질 때까지 홈 복구를 막는다. */
    guardUntil=Date.now()+20000;
    stableUntil=0;
    window.__ktGroup13StartInProgress=true;
    try{document.documentElement.classList.add('kt-g13-current-guard');}catch(e){}
    check();
  }

  function disarmIfDone(){
    if(opening())return;
    if(Date.now()<stableUntil)return;
    window.__ktGroup13StartInProgress=false;
    try{
      document.documentElement.classList.remove('kt-g13-current-guard');
    }catch(e){}
  }

  function check(){
    if(repairing)return;
    if(!is13()&&!opening()){disarmIfDone();return;}

    var room=null;
    try{room=document.querySelector('#screen .ktg13-room');}catch(e){}
    if(!room)return;

    if(room.getAttribute('data-kt-room')==='9'||room.getAttribute('data-kt-room')==='15')return;
    if(room.getAttribute('data-kt-approved13')==='1'){
      /* 현재 승인 화면이 떠도 보호를 바로 풀지 않는다.
         느린 기기에서 뒤늦게 옛 13명방 렌더가 한 번 더 들어오는 구간을 6초간 막는다. */
      stableUntil=Math.max(stableUntil,Date.now()+6000);
      window.__ktGroup13StartInProgress=false;
      try{document.documentElement.classList.add('kt-g13-current-guard');}catch(e){}
      return;
    }

    if(typeof window.ktOpenApprovedGroup13Now!=='function')return;
    repairing=true;
    try{
      window.ktOpenApprovedGroup13Now(true);
    }catch(e){}
    setTimeout(function(){repairing=false;},60);
  }

  function ensureStyle(){
    if(document.getElementById('ktGroup13CurrentOnlyGuardStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13CurrentOnlyGuardStyle';
    s.textContent=
      'html.kt-g13-current-guard #screen{background:#000!important}'+
      'html.kt-g13-current-guard #screen>*:not(.ktg13-room[data-kt-approved13="1"]){opacity:0!important;pointer-events:none!important}'+
      'html.kt-g13-current-guard #screen .ktg13-room[data-kt-approved13="1"]{opacity:1!important;pointer-events:auto!important}'+
      'html.kt-g13-current-guard #ktLiveInstantHandoff{display:none!important;opacity:0!important;visibility:hidden!important}';
    document.head.appendChild(s);
  }

  ensureStyle();

  function wrapStartBroadcastForSlowPhone(){
    if(startWrapped)return;
    var old=window.startBroadcast;
    if(typeof old!=='function'||old.__ktG13SlowStartGuard)return;
    var fn=function(){
      if(is13())arm();
      return old.apply(this,arguments);
    };
    fn.__ktG13SlowStartGuard=true;
    window.startBroadcast=fn;
    startWrapped=true;
  }
  wrapStartBroadcastForSlowPhone();
  [120,400,900,1800].forEach(function(ms){setTimeout(wrapStartBroadcastForSlowPhone,ms);});

  document.addEventListener('pointerdown',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(btn&&is13())arm();
    }catch(err){}
  },true);

  document.addEventListener('click',function(e){
    try{
      var b=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(b&&is13())arm();
    }catch(err){}
  },true);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG13FirstOpenGuardTimer);
      window.__ktG13FirstOpenGuardTimer=setTimeout(check,10);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  [50,120,250,500,900,1500,2500,4000,6500,9000].forEach(function(ms){
    setTimeout(check,ms);
  });
  setInterval(function(){
    check();
    disarmIfDone();
  },120);
})();