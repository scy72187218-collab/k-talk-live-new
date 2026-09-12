/* K-Talk 사람 접속 전용 보강: 방송 시작 등록/재등록만 담당. 화면·스위치·하트·보물상자 등 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktLiveConnectionStartOnlyInstalled)return;
  window.__ktLiveConnectionStartOnlyInstalled=true;

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(track){return track&&track.readyState==='live';}));}
    catch(e){return false;}
  }

  function inLiveRoom(){
    try{
      var screen=document.getElementById('screen');
      if(!screen)return false;
      if(screen.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room'))return true;
      var txt=String(screen.innerText||'');
      return txt.indexOf('ON AIR')>-1||txt.indexOf('방송 중')>-1;
    }catch(e){return false;}
  }

  function findRoomStream(){
    try{if(window.state&&hasLiveVideo(window.state.stream))return window.state.stream;}catch(e){}
    try{
      var videos=document.querySelectorAll('#screen video,video');
      for(var i=0;i<videos.length;i++){
        var stream=videos[i]&&videos[i].srcObject;
        if(hasLiveVideo(stream))return stream;
      }
    }catch(e){}
    return null;
  }

  function startPresence(){
    if(!inLiveRoom())return;
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

  try{
    new MutationObserver(function(){if(inLiveRoom())setTimeout(startPresence,80);}).observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  setInterval(startPresence,800);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')retryStart();});
  window.addEventListener('pageshow',retryStart);
})();
