/* K-Talk: 승인된 모든 게스트 폰이 호스트와 같은 9/13명 방 격자로 전환되도록 보강. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestAllDevicesRoomTransition20260917)return;
  window.__ktApprovedGuestAllDevicesRoomTransition20260917=true;

  var cachedHostStream=null;
  var cachedLocalStream=null;

  function liveStream(st){
    try{
      var ts=st&&st.getVideoTracks?st.getVideoTracks():[];
      return !!(ts&&ts.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function isApprovedLocalVideo(v){
    if(!v)return false;
    try{
      var inline=String((v.style&&v.style.getPropertyValue('transform'))||v.style.transform||'');
      return !!v.muted && inline.indexOf('scaleX(-1)')>-1;
    }catch(e){return false;}
  }

  function makeOrRepairHostPreview(root,hostStream){
    if(!root||!hostStream||!liveStream(hostStream))return null;
    var pv=document.getElementById('ktRemoteHostPreview');
    if(!pv){
      pv=document.createElement('video');
      pv.id='ktRemoteHostPreview';
      pv.className='kt-remote-host-preview';
      pv.autoplay=true;
      pv.playsInline=true;
      pv.muted=true;
      root.appendChild(pv);
    }
    if(pv.srcObject!==hostStream)pv.srcObject=hostStream;
    try{var p=pv.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    return pv;
  }

  function tick(){
    try{
      var root=document.querySelector('.kt-remote-live');
      if(!root){cachedHostStream=null;cachedLocalStream=null;return;}
      if(root.querySelector('.kt-approved-guest-grid'))return;

      var main=document.getElementById('ktRemoteLiveVideo');
      if(!main||!main.srcObject)return;

      var approvedLocal=isApprovedLocalVideo(main);

      /* 승인 전에는 현재 시청 중인 호스트 스트림을 기억해 둔다. */
      if(!approvedLocal){
        if(liveStream(main.srcObject))cachedHostStream=main.srcObject;
        return;
      }

      /* 승인 뒤 main은 게스트 본인 카메라가 된다. */
      if(!cachedLocalStream||cachedLocalStream===cachedHostStream)cachedLocalStream=main.srcObject;

      var existing=document.getElementById('ktRemoteHostPreview');
      if(existing&&liveStream(existing.srcObject)){
        cachedHostStream=existing.srcObject;
        return;
      }

      /* 승인 순간 전에 기억한 호스트 영상으로 미리보기를 복원하면 기존 격자 코드가 바로 방을 만든다. */
      if(cachedHostStream&&cachedHostStream!==cachedLocalStream&&liveStream(cachedHostStream)){
        makeOrRepairHostPreview(root,cachedHostStream);
        return;
      }

      /* 호스트 영상이 늦게 도착해 main을 다시 덮는 경우도 놓치지 않는다. */
      if(cachedLocalStream&&main.srcObject!==cachedLocalStream&&liveStream(main.srcObject)){
        cachedHostStream=main.srcObject;
        makeOrRepairHostPreview(root,cachedHostStream);
        main.srcObject=cachedLocalStream;
        main.muted=true;
        main.style.setProperty('transform','scaleX(-1)','important');
        try{var q=main.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
      }
    }catch(e){}
  }

  setInterval(tick,120);
  [0,80,180,350,700,1200,2000].forEach(function(ms){setTimeout(tick,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(tick,20);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
