/* 4444 — 구독자 게스트방은 별도 UI를 만들지 않는다.
   정상 구독자 호스트방 렌더러를 그대로 사용한다. 다른 방은 수정하지 않는다. */
(function(){
  window.__ktSubscriberGuestOnly4444=true;
  function isSubscriberRemote(){
    var t='';
    try{var r=window.__ktLastLiveRoom||{};t+=' '+(r.room_type||'')+' '+(r.room_name||'')+' '+(r.title||'');}catch(e){}
    try{t+=' '+(window.__ktRemoteRoomType||'')+' '+(window.__ktRemoteRoomName||'');}catch(e){}
    return /subscriber|구독자|15\s*명/i.test(t);
  }
  function renderHostCodeOnly(){
    if(!isSubscriberRemote())return false;
    if(typeof window.ktRenderSubscriberHostRoom4444!=='function')return false;
    window.ktRenderSubscriberHostRoom4444();
    var host=null;
    try{host=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&host&&host.getVideoTracks&&host.getVideoTracks().some(function(x){return x.readyState==='live';})){
        v.muted=false;v.srcObject=host;var p=v.play();if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
    return true;
  }
  window.ktRenderSubscriberGuestFresh4444=renderHostCodeOnly;
  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){setTimeout(renderHostCodeOnly,20);});
  });
  [0,60,180,400,800].forEach(function(ms){setTimeout(renderHostCodeOnly,ms);});
})();