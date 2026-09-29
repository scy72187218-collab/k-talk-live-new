/* K-Talk red LIVE signal publisher only (2026-09-29, 5555)
   Adds beacon heartbeat without changing locked LIVE presence/WebRTC/entry/exit code. */
(function(){
  if(window.__ktLiveSignalPublisher20260929)return;
  window.__ktLiveSignalPublisher20260929=true;

  var timer=null,runId='',runStartedAt=0,lastActive=false;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  function profileName(){
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        if(p.name)return String(p.name);
      }
    }catch(e){}
    try{return localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||'K-Talk 방송자';}catch(e){}
    return 'K-Talk 방송자';
  }
  function hostRoomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var s=document.getElementById('screen');
      return !!(s&&s.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room'));
    }catch(e){return false;}
  }
  function roomInfo(){
    var st=window.state||{};
    return {
      title:String(st.currentLiveRoomTitle||st.liveRoomName||'K-Talk LIVE'),
      room_type:String(st.liveRoomType||'solo'),
      room_name:String(st.liveRoomName||st.currentLiveRoomTitle||'방송')
    };
  }
  function send(action){
    var id=deviceId();
    if(!id)return;
    if(!runId){runStartedAt=Date.now();runId='sig-'+runStartedAt.toString(36)+'-'+Math.random().toString(36).slice(2,7);}
    var r=roomInfo();
    var body={
      action:action,
      host_id:id,
      host_name:profileName(),
      title:r.title,
      room_type:r.room_type,
      room_name:r.room_name,
      run_id:runId,
      run_started_at:runStartedAt,
      at:Date.now()
    };
    try{
      fetch('/api/live-beacon-memory',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body),
        cache:'no-store',
        keepalive:true
      }).catch(function(){});
    }catch(e){}
  }
  function tick(){
    var on=hostRoomVisible();
    if(on){
      send(lastActive?'heartbeat':'publish');
      lastActive=true;
    }else if(lastActive){
      send('end');
      lastActive=false;runId='';runStartedAt=0;
    }
  }
  timer=setInterval(tick,1200);
  setTimeout(tick,120);
  window.addEventListener('pageshow',function(){setTimeout(tick,80);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(tick,80);});
  window.addEventListener('pagehide',function(){if(lastActive)send('end');});
})();