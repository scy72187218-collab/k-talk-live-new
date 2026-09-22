/* K-Talk: 1인방/9명방/구독자방/비밀방 카운트다운을
   승인된 13명방 09:00 방식과 같은 5→4→3→2→1로 통일.
   방 UI/버튼/수익률/통신은 변경하지 않음. */
(function(){
  if(window.__ktFourRoomCountdownMatch20260922)return;
  window.__ktFourRoomCountdownMatch20260922=true;

  var oldStart=window.startBroadcast;
  if(typeof oldStart!=='function')return;

  function roomKind(){
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      var m=Number((window.state&&state.liveRoomMax)||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');

      if(t==='group13'||m===13||n.indexOf('13명')>-1)return '';
      if(t==='solo'||m===1||n.indexOf('1인')>-1||title.indexOf('1인 방송')>-1)return 'solo';
      if(t==='group9'||m===9||n.indexOf('9명')>-1)return 'group9';
      if(t==='subscriber'||n.indexOf('구독자')>-1||title.indexOf('구독자 방송')>-1)return 'subscriber';
      if(t==='password'||t==='secret'||n.indexOf('비밀')>-1||title.indexOf('비밀방')>-1)return 'secret';
    }catch(e){}
    return '';
  }

  function removeOverlay(){
    try{
      var el=document.getElementById('ktFourRoomSingleCountdown');
      if(el)el.remove();
    }catch(e){}
  }

  async function runFiveToOne(){
    removeOverlay();

    var overlay=document.createElement('div');
    overlay.id='ktFourRoomSingleCountdown';
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:rgba(0,0,0,.16);pointer-events:none;color:#fff;text-align:center;text-shadow:0 3px 16px rgba(0,0,0,.72)';
    document.body.appendChild(overlay);

    var num=document.createElement('div');
    num.style.cssText='width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.72);border:4px solid rgba(255,255,255,.92);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.7);text-shadow:0 0 12px rgba(255,255,255,.7)';
    overlay.appendChild(num);

    for(var n=5;n>=1;n--){
      num.textContent=String(n);
      num.style.transform='scale(1)';
      await new Promise(function(resolve){
        setTimeout(function(){num.style.transform='scale(.92)';},650);
        setTimeout(resolve,1000);
      });
    }
    return overlay;
  }

  window.startBroadcast=async function(){
    var kind=roomKind();
    if(!kind)return oldStart.apply(this,arguments);
    if(window.__ktFourRoomCountdownRunning)return;

    window.__ktFourRoomCountdownRunning=true;
    var originalCountdown=window.ktLiveStartCountdown;
    var overlay=null;

    try{
      /* 기존 내부 카운트다운은 이 네 방에서만 막고,
         실제 방송 준비는 카운트다운과 동시에 뒤에서 진행한다. */
      if(typeof originalCountdown==='function'){
        window.ktLiveStartCountdown=async function(){return;};
      }

      var startPromise=Promise.resolve(oldStart.apply(this,arguments));
      overlay=await runFiveToOne();

      /* 13명방 승인 버전과 마찬가지로 실제 방 준비가 끝난 뒤 숫자를 치운다. */
      var result=await startPromise;
      if(overlay){overlay.remove();overlay=null;}
      return result;
    }catch(e){
      try{if(overlay)overlay.remove();}catch(_e){}
      throw e;
    }finally{
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      window.__ktFourRoomCountdownRunning=false;
    }
  };
})();