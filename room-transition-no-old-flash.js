/* K-Talk 방송 입장 전환: 새 방송방이 준비되기 전 옛날 방송 화면이 잠깐 보이는 현상만 가림. */
(function(){
  if(window.__ktRoomNoOldFlashInstalled)return;
  window.__ktRoomNoOldFlashInstalled=true;

  function roomSelector(){
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      if(t==='solo'||n.indexOf('1인')>-1)return '.ktsolo-room';
      if(t==='subscriber'||n.indexOf('구독자')>-1)return '.ktsubscriber-room';
      if(t==='password'||n.indexOf('비밀')>-1)return '.ktsecret-room';
      if(t==='group'||t==='group13'||n.indexOf('13명')>-1)return '.ktg13-room';
    }catch(e){}
    return '';
  }

  function showCover(){
    var cover=document.getElementById('ktRoomTransitionCover');
    if(!cover){
      cover=document.createElement('div');
      cover.id='ktRoomTransitionCover';
      cover.setAttribute('aria-hidden','true');
      cover.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#000;pointer-events:none;';
      document.body.appendChild(cover);
    }
    cover.style.display='block';
  }

  function hideCover(){
    var cover=document.getElementById('ktRoomTransitionCover');
    if(cover)cover.remove();
  }

  function watchReady(selector){
    var screen=document.getElementById('screen');
    var finished=false;
    var observer=null;
    function ready(){
      if(finished)return true;
      if(screen&&screen.querySelector(selector)){
        finished=true;
        if(observer)observer.disconnect();
        requestAnimationFrame(function(){
          requestAnimationFrame(hideCover);
        });
        return true;
      }
      return false;
    }
    if(!ready()&&screen&&window.MutationObserver){
      observer=new MutationObserver(ready);
      observer.observe(screen,{childList:true,subtree:true});
    }
    setTimeout(function(){
      if(!finished){
        finished=true;
        if(observer)observer.disconnect();
        hideCover();
      }
    },3000);
    return ready;
  }

  var previousStart=window.startBroadcast;
  if(typeof previousStart!=='function')return;

  window.startBroadcast=async function(){
    var selector=roomSelector();
    if(!selector)return previousStart.apply(this,arguments);

    showCover();
    var checkReady=watchReady(selector);
    try{
      var result=await previousStart.apply(this,arguments);
      setTimeout(checkReady,0);
      return result;
    }catch(err){
      hideCover();
      throw err;
    }
  };
})();
