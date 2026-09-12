/* K-Talk 사람 접속 전용 보강: 방송 시작 등록/재등록과 원격 시청 복구만 담당. 화면·스위치·하트·보물상자 등 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktLiveConnectionStartOnlyInstalled)return;
  window.__ktLiveConnectionStartOnlyInstalled=true;

  function roomOpen(){
    try{return !!document.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room');}
    catch(e){return false;}
  }

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(track){return track&&track.readyState==='live';}));}
    catch(e){return false;}
  }

  function findRoomStream(){
    try{if(window.state&&hasLiveVideo(state.stream))return state.stream;}catch(e){}
    try{
      var videos=document.querySelectorAll('#ktLiveVideo,#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,.ktg9-room video');
      for(var i=0;i<videos.length;i++){
        var stream=videos[i]&&videos[i].srcObject;
        if(hasLiveVideo(stream))return stream;
      }
    }catch(e){}
    return null;
  }

  function startPresence(){
    if(!roomOpen())return;
    var stream=findRoomStream();
    if(!stream)return;
    try{if(window.state)state.stream=stream;}catch(e){}
    try{if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();}catch(e){}
  }

  function retryStart(){
    [0,80,250,600,1200,2200,4000,7000].forEach(function(ms){setTimeout(startPresence,ms);});
  }

  function wrapBroadcastStart(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktConnectionStartOnlyWrapped)return false;
    var wrapped=async function(){
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
    if(wrapBroadcastStart()||tries>60)clearInterval(wrapTimer);
  },100);

  try{
    new MutationObserver(function(){if(roomOpen())setTimeout(startPresence,60);}).observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){if(roomOpen())startPresence();},1000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(startPresence,120);});
  window.addEventListener('pageshow',function(){setTimeout(startPresence,120);});

  setTimeout(function(){
    if(document.querySelector('script[data-kt-live-viewer-recovery]'))return;
    var s=document.createElement('script');
    s.src='live-viewer-recovery.js?v=20260912-connect1';
    s.async=false;
    s.setAttribute('data-kt-live-viewer-recovery','1');
    document.head.appendChild(s);
  },0);
})();
