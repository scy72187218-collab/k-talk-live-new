/* K-Talk 사람 접속 전용 보강: 방송 시작 등록/재등록과 원격 시청 복구만 담당. 화면·스위치·하트·보물상자 등 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktLiveConnectionStartOnlyInstalled)return;
  window.__ktLiveConnectionStartOnlyInstalled=true;

  var armed=false;

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(track){return track&&track.readyState==='live';}));}
    catch(e){return false;}
  }

  function findRoomStream(){
    try{if(window.state&&hasLiveVideo(window.state.stream))return window.state.stream;}catch(e){}
    try{
      var videos=document.querySelectorAll('video');
      for(var i=0;i<videos.length;i++){
        var stream=videos[i]&&videos[i].srcObject;
        if(hasLiveVideo(stream))return stream;
      }
    }catch(e){}
    return null;
  }

  function startPresence(){
    if(!armed)return;
    var stream=findRoomStream();
    if(!stream)return;
    try{
      if(window.state)window.state.stream=stream;
      else if(typeof state!=='undefined')state.stream=stream;
    }catch(e){}
    try{
      if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();
    }catch(e){}
  }

  function retryStart(){
    armed=true;
    [0,80,180,320,600,1000,1600,2400,3600,5200,7500,10000].forEach(function(ms){setTimeout(startPresence,ms);});
  }

  function wrapBroadcastStart(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktConnectionStartOnlyWrapped)return false;
    var wrapped=async function(){
      retryStart();
      var result=await original.apply(this,arguments);
      retryStart();
      return result;
    };
    wrapped.__ktConnectionStartOnlyWrapped=true;
    window.startBroadcast=wrapped;
    return true;
  }

  wrapBroadcastStart();
  var tries=0;
  var wrapTimer=setInterval(function(){
    tries++;
    wrapBroadcastStart();
    if(tries>120)clearInterval(wrapTimer);
  },100);

  document.addEventListener('click',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.prep-start'):null;
      if(btn)retryStart();
    }catch(err){}
  },true);

  setInterval(startPresence,800);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&armed)retryStart();});
  window.addEventListener('pageshow',function(){if(armed)retryStart();});

  setTimeout(function(){
    if(document.querySelector('script[data-kt-live-viewer-recovery]'))return;
    var s=document.createElement('script');
    s.src='live-viewer-recovery.js?v=20260912-connect2';
    s.async=false;
    s.setAttribute('data-kt-live-viewer-recovery','1');
    document.head.appendChild(s);
  },0);
})();
