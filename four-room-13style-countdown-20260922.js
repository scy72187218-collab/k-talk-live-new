/* K-Talk: 승인된 13명방의 09:00 카운트다운 방식 그대로
   1인방 / 9명방 / 구독자방 / 비밀방에 적용.
   5→4→3→2→1을 한 번만 보여주고, 방송 준비는 그 뒤에서 동시에 진행한 뒤
   1이 끝나면 이미 준비된 방을 바로 보여준다. 다른 UI/통신은 변경하지 않음. */
(function(){
  if(window.__ktFourRoom13StyleCountdown20260922)return;
  window.__ktFourRoom13StyleCountdown20260922=true;

  var oldStart=window.startBroadcast;
  if(typeof oldStart!=='function')return;

  function kind(){
    try{
      var s=window.state||{};
      var t=String(s.liveRoomType||s.prepRoomType||s.roomType||'');
      var n=String(s.liveRoomName||s.prepRoomName||'');
      var m=Number(s.liveRoomMax||s.prepRoomMax||0);
      var title=String(((document.getElementById('liveTitle')||{}).value)||'');
      if(t==='group13'||m===13||n.indexOf('13명')>-1)return '';
      if(t==='solo'||m===1||n.indexOf('1인')>-1||title.indexOf('1인 방송')>-1)return 'solo';
      if(t==='group9'||m===9||n.indexOf('9명')>-1||title.indexOf('9명 방송')>-1)return ''; /* 9명방은 09:00 원래 시작 흐름 사용 */
      if(t==='subscriber'||n.indexOf('구독자')>-1||title.indexOf('구독자 방송')>-1)return 'subscriber';
      if(t==='password'||t==='secret'||n.indexOf('비밀')>-1||title.indexOf('비밀방')>-1)return 'secret';
    }catch(e){}
    return '';
  }

  function removeOverlay(){
    try{
      var old=document.getElementById('ktFourRoom13StyleCountdown');
      if(old)old.remove();
    }catch(e){}
  }

  async function showCountdown(){
    removeOverlay();
    var overlay=document.createElement('div');
    overlay.id='ktFourRoom13StyleCountdown';
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
    var roomKind=kind();
    if(!roomKind)return oldStart.apply(this,arguments);
    if(window.__ktFourRoom13StyleRunning)return;

    window.__ktFourRoom13StyleRunning=true;
    var originalCountdown=window.ktLiveStartCountdown;
    var overlay=null;
    var self=this,args=arguments;

    try{
      /* 승인된 13명방처럼 카운트 숫자 뒤에 '방 화면'이 보이게 한다.
         내부 카운트다운은 막은 채 방을 먼저 실제로 열고 렌더링을 끝낸 다음,
         그 완성된 방 위에서 5→4→3→2→1을 딱 한 번만 보여준다. */
      if(typeof originalCountdown==='function'){
        window.ktLiveStartCountdown=async function(){return true;};
      }

      var result=await Promise.resolve(oldStart.apply(self,args));

      /* 각 방의 setTimeout(0~30ms) 렌더까지 기다린 뒤 숫자를 올린다.
         그래서 카운트 동안 검은/빈 준비화면이 아니라 최종 방이 그대로 보인다. */
      await new Promise(function(resolve){
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){setTimeout(resolve,80);});
        });
      });

      overlay=await showCountdown();
      if(overlay){overlay.remove();overlay=null;}
      return result;
    }catch(e){
      try{if(overlay)overlay.remove();}catch(_e){}
      throw e;
    }finally{
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      window.__ktFourRoom13StyleRunning=false;
    }
  };
})();