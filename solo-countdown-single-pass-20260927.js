/* K-Talk 1인 방송 전용 카운트다운 표시 고정
   1인 방송만 5→4→3→2→1을 정확히 1초씩 화면 맨 위에 표시한다.
   기존 내부/예전 카운트다운은 1인 방송에서만 잠시 막아 중복을 없앤다.
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

  function visibleFiveToOne(){
    return new Promise(function(resolve){
      removeSoloCountdown();

      var overlay=document.createElement('div');
      overlay.id='ktSoloVisibleCountdown20260927';
      overlay.style.cssText='position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;place-items:center!important;background:rgba(0,0,0,.18)!important;pointer-events:none!important;color:#fff!important;text-align:center!important;text-shadow:0 3px 16px rgba(0,0,0,.78)!important;';
      var box=document.createElement('div');
      box.style.cssText='width:124px!important;height:124px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:rgba(10,10,14,.74)!important;border:4px solid rgba(255,255,255,.94)!important;color:#fff!important;font:900 70px/1 system-ui,-apple-system,sans-serif!important;box-shadow:0 0 30px rgba(255,44,130,.72)!important;';
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      var started=(window.performance&&performance.now)?performance.now():Date.now();
      var done=false,timer=null,last='';

      function finish(){
        if(done)return;
        done=true;
        if(timer)clearInterval(timer);
        removeSoloCountdown();
        resolve();
      }

      function tick(){
        var now=(window.performance&&performance.now)?performance.now():Date.now();
        var elapsed=Math.max(0,now-started);
        if(elapsed>=5000){ finish(); return; }
        var n=Math.max(1,5-Math.floor(elapsed/1000));
        var s=String(n);
        if(s!==last){
          last=s;
          box.textContent=s;
          box.style.transform='scale(1)';
          setTimeout(function(){
            try{box.style.transform='scale(.92)';}catch(e){}
          },650);
        }
      }

      tick();
      timer=setInterval(tick,50);
      setTimeout(finish,5400);
    });
  }

  window.startBroadcast=async function(){
    if(!isSolo())return previousStart.apply(this,arguments);
    if(window.__ktSoloVisibleCountdownRunning)return;

    window.__ktSoloVisibleCountdownRunning=true;

    var hadFlag=Object.prototype.hasOwnProperty.call(window,'__ktGroup9RoomFirstCountdown');
    var oldFlag=window.__ktGroup9RoomFirstCountdown;
    var oldInternal=window.ktLiveStartCountdown;
    var self=this,args=arguments;
    var startPromise;

    /* 1인방에서만 기존 두 카운트다운을 잠시 막는다. */
    window.__ktGroup9RoomFirstCountdown=true;
    if(typeof oldInternal==='function'){
      window.ktLiveStartCountdown=async function(){return true;};
    }

    try{
      /* 실제 방송 준비는 뒤에서 동시에 진행하고, 숫자는 현재 화면 맨 위에서 정확히 5초 표시 */
      startPromise=Promise.resolve(previousStart.apply(self,args));
      await visibleFiveToOne();
      return await startPromise;
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