/* K-Talk 실제 방송 시작 등록 연결만 보강. 테스트방/방 UI/다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLivePresenceStartFixInstalled)return;
  window.__ktLivePresenceStartFixInstalled=true;

  function roomOpen(){
    try{return !!document.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');}
    catch(e){return false;}
  }

  function hasLiveVideo(stream){
    try{
      return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(track){
        return track&&track.readyState==='live';
      }));
    }catch(e){return false;}
  }

  function findRoomStream(){
    try{
      if(window.state&&hasLiveVideo(state.stream))return state.stream;
      var videos=document.querySelectorAll('#ktLiveVideo,#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video');
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
    try{
      if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();
    }catch(e){}
  }

  function retryAfterBroadcastStart(){
    [0,80,250,600,1200,2200].forEach(function(ms){
      setTimeout(startPresence,ms);
    });
  }

  function wrapBroadcastStart(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktPresenceStartBridge)return false;
    var wrapped=async function(){
      var result=await original.apply(this,arguments);
      retryAfterBroadcastStart();
      return result;
    };
    wrapped.__ktPresenceStartBridge=true;
    window.startBroadcast=wrapped;
    return true;
  }

  wrapBroadcastStart();
  var tries=0;
  var wrapTimer=setInterval(function(){
    tries++;
    if(wrapBroadcastStart()||tries>30)clearInterval(wrapTimer);
  },100);

  var observer=new MutationObserver(function(){
    if(roomOpen())setTimeout(startPresence,40);
  });
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}

  setInterval(function(){
    if(roomOpen())startPresence();
  },1500);
})();

/* 동영상 작성자 팔로우/방송 상태 + 최종 K-Talk 주소 공유만 별도 파일로 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-video-social-canonical]'))return;
  var s=document.createElement('script');
  s.src='video-social-canonical-fix.js?v=20260912-social1';
  s.async=false;
  s.setAttribute('data-kt-video-social-canonical','1');
  document.head.appendChild(s);
})();
