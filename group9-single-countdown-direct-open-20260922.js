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

  function selectedNineNow(){
    try{
      var b=document.querySelector('.live-prep .kt-room-bottom5 button.on,.kt-room-bottom5 button.on');
      if(b&&/9\s*명/.test(String(b.textContent||'')))return true;
      return isGroup9();
    }catch(e){return isGroup9();}
  }

  /* 첫 카운트다운을 시작하는 순간 9명방 선택을 12초 동안 기억한다.
     첫 5→1이 끝난 뒤 내부 코드가 상태값을 잠깐 바꿔도 두 번째 카운트다운은 막는다. */
  window.addEventListener('pointerdown',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(btn&&selectedNineNow())window.__ktGroup9FirstCountdownUntil=Date.now()+12000;
    }catch(_e){}
  },true);

  window.addEventListener('click',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(btn&&selectedNineNow())window.__ktGroup9FirstCountdownUntil=Date.now()+12000;
    }catch(_e){}
  },true);

  var oldCountdown=window.ktLiveStartCountdown;
  if(typeof oldCountdown==='function'&&!oldCountdown.__ktGroup9SingleCountdownDirectOpen){
    var fn=async function(){
      var remembered=Number(window.__ktGroup9FirstCountdownUntil||0)>Date.now();
      if(remembered||isGroup9())return true;
      return oldCountdown.apply(this,arguments);
    };
    fn.__ktGroup9SingleCountdownDirectOpen=true;
    fn.__ktGroup9SingleCountdownDirectOpenBase=oldCountdown;
    window.ktLiveStartCountdown=fn;
  }
})();