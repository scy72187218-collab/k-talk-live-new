/* K-Talk 동영상 홈 자동 복구 감시
   방/채팅/스위치/라이브 화면에는 손대지 않는다. */
(function(){
  if(window.__ktVideoFeedWatchdog20260920)return;
  window.__ktVideoFeedWatchdog20260920=true;

  var stuckSince=0;
  var retrying=false;

  function busyElsewhere(){
    try{
      if(document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live'))return true;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return true;
    }catch(e){}
    return false;
  }

  async function recover(){
    if(retrying||busyElsewhere())return;
    retrying=true;
    try{
      if(typeof window.ktForceHomeVideoRecovery==='function'){
        await window.ktForceHomeVideoRecovery(true);
      }else if(typeof window.ktShowSharedServerFeed==='function'){
        await window.ktShowSharedServerFeed();
      }else if(typeof window.home==='function'){
        window.home();
      }
    }catch(e){}
    setTimeout(function(){retrying=false;},1200);
  }

  setInterval(function(){
    try{
      if(document.hidden||busyElsewhere()){stuckSince=0;return;}
      var s=document.getElementById('screen');
      if(!s)return;

      if(s.querySelector('.kt-public-video,.kt-hard-public-video,#homeVideo')){
        stuckSince=0;
        return;
      }

      var t=String(s.textContent||'');
      var loading=/동영상 불러오는 중|동영상 연결 중|공용 동영상 목록 연결 중|동영상 연결을 다시 확인/.test(t);

      if(loading){
        if(!stuckSince)stuckSince=Date.now();
        if(Date.now()-stuckSince>3000){
          stuckSince=Date.now();
          recover();
        }
      }else{
        stuckSince=0;
      }
    }catch(e){}
  },1500);

  window.addEventListener('online',function(){
    setTimeout(recover,250);
  });
})();