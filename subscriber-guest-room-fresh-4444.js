/* 4444 — 구독자 게스트 전용: 별도 게스트 UI 없음. 호스트방 코드만 그대로 렌더링. */
(function(){
  window.__ktSubscriberGuestOnly4444=true;
  function sub(){
    var t='';
    try{var r=window.__ktLastLiveRoom||{};t+=' '+(r.room_type||'')+' '+(r.room_name||'')+' '+(r.title||'');}catch(e){}
    try{t+=' '+(window.__ktRemoteRoomType||'')+' '+(window.__ktRemoteRoomName||'');}catch(e){}
    try{t+=' '+((window.state&&state.currentViewRoomTitle)||'');}catch(e){}
    return /subscriber|구독자/i.test(t);
  }
  function enteredByRedLive(){
    try{
      return !!(window.__ktSubscriberRedLiveEntered4444 ||
        window.__ktRemoteRoomEnteredByClick ||
        (window.state&&state.ktRemoteRoomEnteredByClick));
    }catch(e){return false;}
  }
  function hostOnly(){
    if(!sub()||!enteredByRedLive()||typeof window.ktRenderSubscriberHostRoom4444!=='function')return false;
    /* 구독자 게스트의 예전 화면 껍데기를 전부 제거한 뒤 호스트 화면 하나만 만든다. */
    try{
      document.querySelectorAll('#screen .kt-remote-live,#screen .kt-approved-guest-room,#screen .kt-prejoin-room,#screen .kt-guest-room,#screen .kt-guest-hostlike-room').forEach(function(x){x.remove();});
    }catch(e){}
    window.ktRenderSubscriberHostRoom4444();
    var s=null;
    try{s=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    var v=document.getElementById('ktLiveVideo');
    try{if(v&&s){v.muted=false;v.srcObject=s;var p=v.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
    return true;
  }
  window.ktRenderSubscriberGuestFresh4444=hostOnly;
  document.addEventListener('click',function(e){
    var x=e.target&&e.target.closest?e.target.closest('.on-air,.live-badge,.kt-live-badge,[data-live-room],[data-action="enter-live"]'):null;
    if(!x)return;
    var tx=String(x.textContent||'')+' '+String(x.getAttribute('aria-label')||'');
    if(/ON\s*AIR|LIVE|빨간|방송/i.test(tx)){window.__ktSubscriberRedLiveEntered4444=true;setTimeout(hostOnly,0);}
  },true);
  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-livekit-state','kt-remote-room-opened'].forEach(function(ev){
    window.addEventListener(ev,function(){setTimeout(hostOnly,0);});
  });
  [0,30,80,160,320,700,1400].forEach(function(ms){setTimeout(hostOnly,ms);});
})();