/* K-Talk 9명방 2026-09-21 오후 5시 복구.
   기준 스냅샷: 093316994b4d4db36b1ee5200bd9a5eb9b63bce3
   (16:49:16 KST, 17:00 시점에 실제로 배포되어 있던 최신 상태)
   9명방만 당시 시작 흐름: 손을 대면 5 즉시 표시 → 5·4·3·2·1 한 번 →
   원래 방송 시작 호출. 방 화면/배치 파일은 당시와 동일한 원본을 그대로 사용. */
(function(){
  if(window.__ktGroup9Restore20260921_1700)return;
  window.__ktGroup9Restore20260921_1700=true;

  var previousStart=window.startBroadcast;
  if(typeof previousStart!=='function')return;

  var launching=false;
  var releaseStart=false;
  var countdownPromise=null;

  function isNine(){
    try{
      var bottom=[].slice.call(document.querySelectorAll('.live-prep .kt-room-bottom5 button.on,.kt-room-bottom5 button.on'));
      if(bottom.some(function(b){return /9\s*명/.test(String(b.textContent||''));}))return true;
      var st=window.state||{};
      var vals=[st.liveRoomType,st.prepRoomType,st.roomType,st.liveRoomName,st.prepRoomName].join(' ');
      if(/group9|9명/.test(String(vals)))return true;
      if(Number(st.liveRoomMax||st.prepRoomMax||0)===9)return true;
      var title=document.getElementById('liveTitle');
      return !!(title&&/9\s*명/.test(String(title.value||'')));
    }catch(e){return false;}
  }

  function removeCountdown(){
    try{
      var old=document.getElementById('ktLiveCountdown');
      if(old&&old.parentNode)old.parentNode.removeChild(old);
    }catch(e){}
  }

  function runCountdown(){
    if(countdownPromise)return countdownPromise;
    try{
      if(typeof window.ensureLiveCamera==='function'){
        Promise.resolve(window.ensureLiveCamera((window.state&&state.cameraFacing)||'user')).catch(function(){});
      }
    }catch(e){}

    countdownPromise=new Promise(function(resolve){
      removeCountdown();
      var wrap=document.createElement('div');
      wrap.id='ktLiveCountdown';
      wrap.style.cssText='position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:transparent;pointer-events:none;';
      var num=document.createElement('div');
      num.style.cssText='width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.74);border:4px solid rgba(255,255,255,.94);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.72);text-shadow:0 0 12px rgba(255,255,255,.72);transition:transform .18s ease;';
      wrap.appendChild(num);
      document.body.appendChild(wrap);

      var started=performance.now(),last=0;
      num.textContent='5';
      function frame(now){
        if(!document.documentElement.contains(wrap)){resolve(true);return;}
        var elapsed=Math.max(0,now-started);
        if(elapsed>=5000){
          removeCountdown();
          resolve(true);
          return;
        }
        var next=Math.max(1,5-Math.floor(elapsed/1000));
        if(next!==last){
          last=next;
          num.textContent=String(next);
          num.style.transform='scale(1)';
          setTimeout(function(){try{if(document.documentElement.contains(num))num.style.transform='scale(.92)';}catch(e){}},620);
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    countdownPromise.finally(function(){setTimeout(function(){countdownPromise=null;},250);});
    return countdownPromise;
  }

  window.addEventListener('pointerdown',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(btn&&isNine())runCountdown();
  },true);

  window.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(!btn||!isNine()||releaseStart)return;

    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    if(launching)return;

    launching=true;
    runCountdown().then(async function(){
      var originalCountdown=window.ktLiveStartCountdown;
      try{
        releaseStart=true;
        window.ktLiveStartCountdown=async function(){return true;};
        await previousStart();
      }finally{
        if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
        releaseStart=false;
        removeCountdown();
        setTimeout(function(){launching=false;},300);
      }
    }).catch(function(){
      releaseStart=false;
      removeCountdown();
      setTimeout(function(){launching=false;},300);
    });
  },true);

  window.startBroadcast=async function(){
    if(!isNine())return previousStart.apply(this,arguments);
    if(releaseStart)return previousStart.apply(this,arguments);
    if(launching)return;
    launching=true;
    var originalCountdown=window.ktLiveStartCountdown;
    var self=this,args=arguments;
    try{
      await runCountdown();
      window.ktLiveStartCountdown=async function(){return true;};
      return await previousStart.apply(self,args);
    }finally{
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      removeCountdown();
      setTimeout(function(){launching=false;},300);
    }
  };
})();