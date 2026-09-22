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

  function adaptNineRoomNow(){
    try{
      forceNineState();
      var room=document.querySelector('#screen .ktg13-room');
      if(!room)return false;

      room.setAttribute('data-kt-room','9');
      room.removeAttribute('data-kt-approved13');

      var head=room.querySelector('.ktg13-air strong');
      if(head)head.innerHTML='<i>●</i> 9명 방송';

      var guests=[].slice.call(room.querySelectorAll('.ktg13-guests > .ktg13-guest'));
      guests.slice(8).forEach(function(g){try{g.remove();}catch(e){}});

      var stats=room.querySelectorAll('.ktg13-stats > button');
      if(stats[1]&&String(stats[1].textContent||'').indexOf('지금 추가')>-1){
        stats[1].textContent='🎯 미션';
        stats[1].classList.add('ktg9-mission-btn');
        if(typeof window.ktGroup9Mission==='function'){
          stats[1].onclick=function(){window.ktGroup9Mission();};
        }
      }

      try{
        var cr=window.creator||document.getElementById('creator');
        if(cr)cr.classList.remove('show','live-prep-open');
        document.body.classList.remove('kt-home');
      }catch(e){}
      return true;
    }catch(e){return false;}
  }

  function openNineRoomNow(){
    try{
      window.__ktGroup9RoomFirstCountdown=true;
      forceNineState();

      /* 현재 승인된 방 틀을 같은 JS 턴 안에서 만들고 바로 9명방으로 바꾼다.
         브라우저가 중간 13명방/단일영상/테스트 화면을 그릴 틈을 주지 않는다. */
      if(typeof window.ktOpenApprovedGroup13Now==='function'){
        window.ktOpenApprovedGroup13Now(true);
        forceNineState();
        return adaptNineRoomNow();
      }

      return adaptNineRoomNow();
    }catch(e){return false;}
  }

  function keepOnlyNineRoomVisible(){
    var screen=document.getElementById('screen');
    if(!screen||!window.MutationObserver)return null;
    var busy=false;
    var mo=new MutationObserver(function(){
      if(busy||window.__ktGroup9RoomFirstCountdown!==true)return;
      try{
        var room=screen.querySelector('.ktg13-room[data-kt-room="9"]');
        if(room)return;
        busy=true;
        openNineRoomNow();
      }catch(e){}finally{busy=false;}
    });
    try{mo.observe(screen,{childList:true,subtree:false});}catch(e){return null;}
    return mo;
  }

  function waitPaint(){
    return new Promise(function(resolve){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){resolve();});
      });
    });
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
      var keepObserver=null;
      var startPromise=null;
      try{
        releaseStart=true;
        window.__ktGroup9RoomFirstCountdown=true;
        window.ktLiveStartCountdown=async function(){return true;};

        /* 1) 화면에 9명방부터 즉시 연다. */
        forceNineState();
        openNineRoomNow();
        keepObserver=keepOnlyNineRoomVisible();

        /* 2) 방송 세션 준비는 뒤에서 시작하되, 중간 화면은 MutationObserver가
              같은 프레임 안에서 다시 9명방으로 돌려서 사용자에게 보이지 않게 한다. */
        startPromise=Promise.resolve(previousStart()).catch(function(e){throw e;});

        /* 실제 9명방이 한 번 그려진 뒤 숫자를 시작한다. */
        await waitPaint();
        openNineRoomNow();

        /* 3) 열린 9명방 위에서 5→4→3→2→1 딱 한 번만 센다. */
        await runCountdown();

        await startPromise;
        openNineRoomNow();
      }finally{
        if(keepObserver){try{keepObserver.disconnect();}catch(e){}}
        openNineRoomNow();
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
    var keepObserver=null;
    var startPromise=null;
    try{
      window.__ktGroup9RoomFirstCountdown=true;
      forceNineState();
      window.ktLiveStartCountdown=async function(){return true;};

      openNineRoomNow();
      keepObserver=keepOnlyNineRoomVisible();
      startPromise=Promise.resolve(previousStart.apply(self,args));
      await waitPaint();
      openNineRoomNow();
      await runCountdown();
      var result=await startPromise;
      openNineRoomNow();
      return result;
    }finally{
      if(keepObserver){try{keepObserver.disconnect();}catch(e){}}
      openNineRoomNow();
      window.__ktGroup9RoomFirstCountdown=false;
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      removeCountdown();
      setTimeout(function(){launching=false;},300);
    }
  };
})();