/* 4444: 구독자 게스트용 별도 방 코드는 폐기.
   빨간 LIVE 진입 후 정상 구독자 호스트방 렌더러만 그대로 사용. */
(function(){
  if(window.__ktSubscriber4444HostCloneInstalled)return;
  window.__ktSubscriber4444HostCloneInstalled=true;
  var armed=false;

  function isSubscriber(){
    var t='';
    try{var r=window.__ktLastLiveRoom||{};t+=' '+(r.room_type||'')+' '+(r.room_name||'')+' '+(r.title||'');}catch(e){}
    try{t+=' '+(window.__ktRemoteRoomType||'')+' '+(window.__ktRemoteRoomName||'');}catch(e){}
    try{t+=' '+((window.state&&state.currentViewRoomTitle)||'');}catch(e){}
    return /subscriber|구독자/i.test(t);
  }

  function render(){
    if(!armed||!isSubscriber())return false;
    if(typeof window.ktRenderSubscriberHostRoom4444!=='function')return false;
    window.ktRenderSubscriberHostRoom4444();
    var s=null;
    try{s=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&s){v.muted=false;v.srcObject=s;var p=v.play();if(p&&p.catch)p.catch(function(){});}
    }catch(e){}
    return true;
  }

  window.ktRenderSubscriberGuestFresh4444=render;

  function clearSubscriberLiveFlag(){
    armed=false;
    window.__ktSubscriberRedLiveEntered4444=false;
  }
  var oldLeave=window.leaveBroadcastToDashboard;
  if(typeof oldLeave==='function'){
    window.leaveBroadcastToDashboard=function(){
      clearSubscriberLiveFlag();
      return oldLeave.apply(this,arguments);
    };
  }
  window.addEventListener('kt-live-ended',clearSubscriberLiveFlag);
  window.addEventListener('kt-room-ended',clearSubscriberLiveFlag);

  document.addEventListener('click',function(e){
    var x=e.target&&e.target.closest?e.target.closest('button,[role="button"],.on-air,.live-badge,.kt-live-badge,[data-live-room],[data-action="enter-live"]'):null;
    if(!x)return;
    var tx=(String(x.textContent||'')+' '+String(x.getAttribute('aria-label')||'')).replace(/\s+/g,' ');
    if(/ON AIR|LIVE|방송중|빨간/i.test(tx)&&isSubscriber()){
      armed=true;
      window.__ktSubscriberRedLiveEntered4444=true;
      [0,30,80,160,320].forEach(function(ms){setTimeout(render,ms);});
    }
  },true);

  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){if(armed)setTimeout(render,0);});
  });
})();