/* K-Talk 9명방: 준비화면의 첫 5→4→3→2→1만 사용하고
   그 뒤 내부 카운트다운을 다시 시작하지 않음.
   다른 방/레이아웃/버튼/수익률/통신은 변경하지 않음. */
(function(){
  if(window.__ktGroup9SingleCountdownDirectOpen20260922)return;
  window.__ktGroup9SingleCountdownDirectOpen20260922=true;

  function isGroup9(){
    try{
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      return t==='group9'||m===9||n.indexOf('9명')>-1||title.indexOf('9명 방송')>-1;
    }catch(e){return false;}
  }

  var oldCountdown=window.ktLiveStartCountdown;
  if(typeof oldCountdown==='function'&&!oldCountdown.__ktGroup9SingleCountdownDirectOpen){
    var fn=async function(){
      if(isGroup9())return true;
      return oldCountdown.apply(this,arguments);
    };
    fn.__ktGroup9SingleCountdownDirectOpen=true;
    fn.__ktGroup9SingleCountdownDirectOpenBase=oldCountdown;
    window.ktLiveStartCountdown=fn;
  }
})();