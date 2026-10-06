/* K-Talk 4444 — 구독자방 게스트 전용 새 설치.
   기존 구독자 게스트 화면은 사용하지 않고, 정상 호스트방 렌더러 하나만 재사용한다.
   다른 방/호스트 코드는 수정하지 않는다. */
(function(){
  if(window.__ktSubscriberGuestOnly4444)return;
  window.__ktSubscriberGuestOnly4444=true;

  function subscriberRemote(){
    var t='';
    try{var r=window.__ktLastLiveRoom||{};t+=' '+(r.room_type||'')+' '+(r.room_name||'')+' '+(r.title||'');}catch(e){}
    try{t+=' '+(window.__ktRemoteRoomType||'')+' '+(window.__ktRemoteRoomName||'');}catch(e){}
    return /subscriber|구독자|15\s*명/i.test(t);
  }
  function live(s){
    try{return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(x){return x.readyState==='live';}));}
    catch(e){return false;}
  }
  function cleanOldSubscriberGuest(){
    if(!subscriberRemote())return;
    try{
      document.querySelectorAll(
        '#screen .kt-guest-hostlike-room,#screen .kt-approved-guest-room,#screen .kt-prejoin-room,'+
        '#screen .kt-guest-room,#screen .kt-approved-guest-grid,#screen .kt-prejoin-room-grid,'+
        '#screen .kt-guest-room-grid,#screen .kt-approved-roster-quick-5555,#screen .kt-prejoin-quick-5555'
      ).forEach(function(el){el.remove();});
    }catch(e){}
  }
  function install(){
    if(!subscriberRemote())return false;
    if(typeof window.ktRenderSubscriberHostRoom4444!=='function')return false;

    cleanOldSubscriberGuest();
    window.ktRenderSubscriberHostRoom4444();

    var host=null,self=null;
    try{host=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{self=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}

    var hv=document.getElementById('ktLiveVideo');
    if(hv&&live(host)){
      try{hv.muted=false;hv.srcObject=host;var p=hv.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    var cell=document.querySelector('#screen .ktsubscriber-room .ktsubscriber-guest[data-guest-slot="1"]');
    if(cell&&live(self)){
      cell.innerHTML='<video class="ktsubscriber-self-video" autoplay playsinline muted></video><b>나 · 게스트</b>';
      var sv=cell.querySelector('video');
      sv.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111';
      try{sv.srcObject=self;var q=sv.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
    }
    return true;
  }

  window.ktRenderSubscriberGuestFresh4444=install;
  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){setTimeout(install,20);});
  });
  [0,60,160,360,700].forEach(function(ms){setTimeout(install,ms);});
})();