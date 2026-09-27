/* K-Talk 1인 방송 전용 카운트다운 중복 방지
   1인 방송 시작 때 예전 첫 카운트다운만 건너뛰고,
   기존 ktLiveStartCountdown 5→4→3→2→1은 그대로 사용한다.
   다른 방/통신/UI는 변경하지 않음. */
(function(){
  if(window.__ktSoloCountdownSinglePass20260927)return;
  window.__ktSoloCountdownSinglePass20260927=true;

  var previousStart=window.startBroadcast;
  if(typeof previousStart!=='function')return;

  function isSolo(){
    try{
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      return t==='solo'||m===1||n.indexOf('1인')>-1||title.indexOf('1인 방송')>-1;
    }catch(e){ return false; }
  }

  window.startBroadcast=async function(){
    if(!isSolo())return previousStart.apply(this,arguments);

    var hadOwn=Object.prototype.hasOwnProperty.call(window,'__ktGroup9RoomFirstCountdown');
    var oldFlag=window.__ktGroup9RoomFirstCountdown;
    window.__ktGroup9RoomFirstCountdown=true;

    try{
      return await previousStart.apply(this,arguments);
    }finally{
      if(hadOwn)window.__ktGroup9RoomFirstCountdown=oldFlag;
      else try{delete window.__ktGroup9RoomFirstCountdown;}catch(e){window.__ktGroup9RoomFirstCountdown=oldFlag;}
    }
  };
})();