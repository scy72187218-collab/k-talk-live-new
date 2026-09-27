/* K-Talk SOLO countdown OFF 2026-09-27
   SOLO ONLY: no countdown. The 1-person broadcast opens immediately.
   Other rooms, UI, controls, guest transport and layout are untouched. */
(function(){
  if(window.__ktSoloCountdownOff20260927)return;
  window.__ktSoloCountdownOff20260927=true;

  var oldStart=window.startBroadcast;
  if(typeof oldStart!=='function')return;

  function isSolo(){
    try{
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      return t==='solo'||m===1||n.indexOf('1인')>-1||title.indexOf('1인 방송')>-1;
    }catch(e){return false;}
  }

  function clearSoloCountdowns(){
    [
      'ktLiveStartCountdown',
      'ktLiveCountdown',
      'ktFourRoom13StyleCountdown',
      'ktSoloFreshCountdown'
    ].forEach(function(id){
      try{
        var el=document.getElementById(id);
        if(el)el.remove();
      }catch(e){}
    });
  }

  window.startBroadcast=async function(){
    if(!isSolo())return oldStart.apply(this,arguments);

    var savedCountdown=window.ktLiveStartCountdown;
    try{
      clearSoloCountdowns();

      /* SOLO only: suppress every generic countdown call while keeping
         the existing broadcast startup path untouched. */
      window.ktLiveStartCountdown=async function(){return true;};

      var result=await Promise.resolve(oldStart.apply(this,arguments));
      clearSoloCountdowns();
      return result;
    }finally{
      if(savedCountdown)window.ktLiveStartCountdown=savedCountdown;
    }
  };
})();
