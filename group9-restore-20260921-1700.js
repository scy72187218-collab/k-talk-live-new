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

  function forceNineState(){
    try{
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 방송';
        state.liveRoomMax=9;
        state.prepRoomType='group9';
        state.prepRoomName='9명 방송';
        state.prepRoomMax=9;
        state.roomType='group9';
      }
      var title=document.getElementById('liveTitle');
      if(title)title.value='9명 방송';
    }catch(e){}
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
    if(btn&&isNine()){
      window.__ktGroup9RoomFirstCountdown=true;
      forceNineState();
      /* 카메라만 미리 준비하고 숫자는 방이 열린 뒤에 시작한다. */
      try{
        if(typeof window.ensureLiveCamera==='function'){
          Promise.resolve(window.ensureLiveCamera((window.state&&state.cameraFacing)||'user')).catch(function(){});
        }
      }catch(_e){}
    }
  },true);

  function waitNineRoom(){
    return new Promise(function(resolve){
      var done=false,mo=null,timer=null;
      function finish(){
        if(done)return;
        done=true;
        try{if(mo)mo.disconnect();}catch(e){}
        try{if(timer)clearTimeout(timer);}catch(e){}
        requestAnimationFrame(function(){requestAnimationFrame(resolve);});
      }
      function check(){
        try{
          var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"],.ktg13-room[data-kt-room="9"]');
          if(room){finish();return;}
        }catch(e){}
      }
      try{
        mo=new MutationObserver(check);
        mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-room','class']});
      }catch(e){}
      timer=setTimeout(finish,1800);
      check();
    });
  }

  window.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(!btn||!isNine()||releaseStart)return;

    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    if(launching)return;

    launching=true;
    (async function(){
      var originalCountdown=window.ktLiveStartCountdown;
      try{
        releaseStart=true;
        /* 방을 여는 동안 기존 내부 카운트다운/검은 가림막은 막는다. */
        window.__ktGroup9RoomFirstCountdown=true;
        window.ktLiveStartCountdown=async function(){return true;};

        /* 1) 13명방 상태가 끼어들지 못하게 9명방을 확정한 뒤 먼저 연다. */
        forceNineState();
        await previousStart();

        /* 2) 9명방 화면이 실제 DOM에 붙고 한 번 그려질 때까지 기다린다. */
        await waitNineRoom();

        /* 3) 열린 9명방 위에서 5→4→3→2→1을 한 번만 센다. */
        await runCountdown();
      }finally{
        window.__ktGroup9RoomFirstCountdown=false;
        if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
        releaseStart=false;
        removeCountdown();
        setTimeout(function(){launching=false;},300);
      }
    })().catch(function(){
      window.__ktGroup9RoomFirstCountdown=false;
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
      window.__ktGroup9RoomFirstCountdown=true;
      forceNineState();
      window.ktLiveStartCountdown=async function(){return true;};
      var result=await previousStart.apply(self,args);
      await waitNineRoom();
      await runCountdown();
      return result;
    }finally{
      window.__ktGroup9RoomFirstCountdown=false;
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      removeCountdown();
      setTimeout(function(){launching=false;},300);
    }
  };
})();