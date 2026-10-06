/* K-Talk 4444 — 15명 구독자 게스트방 새 코드.
   구독자 호스트방 화면을 그대로 사용하고, 게스트에게 필요한 영상 소스만 연결한다.
   다른 방은 건드리지 않는다. */
(function(){
  if(window.__ktSubscriberGuestFresh4444)return;
  window.__ktSubscriberGuestFresh4444=true;

  function isSubscriberRemote(){
    var t='';
    try{
      var r=window.__ktLastLiveRoom||{};
      t+=' '+String(r.room_type||'')+' '+String(r.room_name||'')+' '+String(r.title||'');
    }catch(e){}
    try{t+=' '+String(window.__ktRemoteRoomType||'')+' '+String(window.__ktRemoteRoomName||'');}catch(e){}
    return /subscriber|구독자|15\s*명/i.test(t);
  }

  function live(st){
    try{return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(x){return x.readyState==='live';}));}
    catch(e){return false;}
  }

  function render(){
    if(!isSubscriberRemote())return false;
    if(typeof window.ktRenderSubscriberHostRoom4444!=='function')return false;

    window.ktRenderSubscriberHostRoom4444();

    var host=null,self=null;
    try{host=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{self=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}

    var hv=document.getElementById('ktLiveVideo');
    if(hv&&live(host)){
      try{
        hv.muted=false;
        if(hv.srcObject!==host)hv.srcObject=host;
        var hp=hv.play();if(hp&&hp.catch)hp.catch(function(){});
      }catch(e){}
    }

    var cell=document.querySelector('.ktsubscriber-guest[data-guest-slot="1"]');
    if(cell&&live(self)){
      var sv=cell.querySelector('video');
      if(!sv){
        cell.innerHTML='<video class="ktsubscriber-self-video" autoplay playsinline muted></video><b>나 · 게스트</b>';
        sv=cell.querySelector('video');
        sv.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111';
      }
      try{
        if(sv.srcObject!==self)sv.srcObject=self;
        var sp=sv.play();if(sp&&sp.catch)sp.catch(function(){});
      }catch(e){}
    }
    return true;
  }

  window.ktRenderSubscriberGuestFresh4444=render;
  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){setTimeout(render,30);});
  });
  [0,80,220,500].forEach(function(ms){setTimeout(render,ms);});
})();