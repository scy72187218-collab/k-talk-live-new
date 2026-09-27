/* K-Talk 1인 방송 전용 카운트다운 안정화
   1인 방송만 5→4→3→2→1을 먼저 정확히 1초씩 표시한 뒤 방을 연다.
   카운트다운 중 방 렌더/카메라 재연결을 동시에 돌리지 않아 숫자 누락을 방지한다.
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

  function removeSoloCountdown(){
    try{
      var el=document.getElementById('ktSoloVisibleCountdown20260927');
      if(el)el.remove();
    }catch(e){}
  }

  async function visibleFiveToOne(){
    removeSoloCountdown();

    var overlay=document.createElement('div');
    overlay.id='ktSoloVisibleCountdown20260927';
    overlay.style.cssText='position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;place-items:center!important;background:rgba(0,0,0,.18)!important;pointer-events:none!important;color:#fff!important;text-align:center!important;text-shadow:0 3px 16px rgba(0,0,0,.78)!important;';
    var box=document.createElement('div');
    box.style.cssText='width:124px!important;height:124px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:rgba(10,10,14,.74)!important;border:4px solid rgba(255,255,255,.94)!important;color:#fff!important;font:900 70px/1 system-ui,-apple-system,sans-serif!important;box-shadow:0 0 30px rgba(255,44,130,.72)!important;';
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    /* 매 숫자마다 독립적으로 1초를 보장한다.
       방 열기 작업은 이 루프가 끝난 뒤에만 시작한다. */
    for(var n=5;n>=1;n--){
      box.textContent=String(n);
      box.style.transform='scale(1)';
      await new Promise(function(resolve){
        setTimeout(function(){
          try{box.style.transform='scale(.92)';}catch(e){}
        },650);
        setTimeout(resolve,1000);
      });
    }

    removeSoloCountdown();
  }

  window.startBroadcast=async function(){
    if(!isSolo())return previousStart.apply(this,arguments);
    if(window.__ktSoloVisibleCountdownRunning)return;

    window.__ktSoloVisibleCountdownRunning=true;

    var hadFlag=Object.prototype.hasOwnProperty.call(window,'__ktGroup9RoomFirstCountdown');
    var oldFlag=window.__ktGroup9RoomFirstCountdown;
    var oldInternal=window.ktLiveStartCountdown;
    var self=this,args=arguments;

    try{
      /* 먼저 숫자만 정확히 5초간 표시 */
      await visibleFiveToOne();

      /* 그 다음 1인방에서만 기존 중복 카운트다운을 막고 방을 연다 */
      window.__ktGroup9RoomFirstCountdown=true;
      if(typeof oldInternal==='function'){
        window.ktLiveStartCountdown=async function(){return true;};
      }

      return await Promise.resolve(previousStart.apply(self,args));
    }catch(e){
      removeSoloCountdown();
      throw e;
    }finally{
      if(typeof oldInternal==='function')window.ktLiveStartCountdown=oldInternal;
      if(hadFlag)window.__ktGroup9RoomFirstCountdown=oldFlag;
      else try{delete window.__ktGroup9RoomFirstCountdown;}catch(e){window.__ktGroup9RoomFirstCountdown=oldFlag;}
      window.__ktSoloVisibleCountdownRunning=false;
    }
  };
})();