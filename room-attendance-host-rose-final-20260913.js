/* K-Talk 라이브방 출석체크: 시청자가 1회 누르면 호스트에게 장미 1송이. 호스트 본인 self 지급은 차단. */
(function(){
  if(window.__ktRoomAttendanceHostRoseFinal20260913)return;
  window.__ktRoomAttendanceHostRoseFinal20260913=true;

  var originalAttendanceCheck=window.ktAttendanceCheck;
  var originalOpenAttendanceBenefits=window.openAttendanceBenefits;
  var roomSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';

  function visibleHostRoom(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return null;
    var rooms=[].slice.call(document.querySelectorAll(roomSelector));
    if(!rooms.length)return null;
    for(var i=0;i<rooms.length;i++){
      try{
        var cs=getComputedStyle(rooms[i]);
        var rect=rooms[i].getBoundingClientRect();
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&rect.width>0&&rect.height>0)return rooms[i];
      }catch(e){}
    }
    return rooms[0]||null;
  }

  /* 호스트 자신의 방에서 출석 버튼을 눌러도 안내창/음성은 띄우지 않는다. */
  function explainHostAttendance(){
    return;
  }

  /* 호스트 자신의 방에서는 self 보상을 절대 주지 않는다. 실제 지급은 원격 시청자의 ktRemoteAttendance → 호스트 동기화 경로에서만 처리한다. */
  window.ktAttendanceCheck=function(){
    if(visibleHostRoom()){
      explainHostAttendance();
      return;
    }
    if(document.documentElement.classList.contains('kt-remote-viewing')&&typeof window.ktRemoteAttendance==='function'){
      return window.ktRemoteAttendance();
    }
    if(typeof originalAttendanceCheck==='function')return originalAttendanceCheck.apply(this,arguments);
  };

  window.openAttendanceBenefits=function(){
    if(visibleHostRoom()){
      explainHostAttendance();
      return;
    }
    if(document.documentElement.classList.contains('kt-remote-viewing')&&typeof window.ktRemoteAttendance==='function'){
      return window.ktRemoteAttendance();
    }
    if(typeof originalOpenAttendanceBenefits==='function')return originalOpenAttendanceBenefits.apply(this,arguments);
  };
})();

/* 방송 시작 카운트다운만 보강: 손을 대는 순간 5부터 바로 보이고, 검은 화면으로 먼저 가리지 않는다. 방 열기 흐름은 기존 그대로 사용. */
(function(){
  if(window.__ktFullFiveSecondStartGate20260917)return;
  window.__ktFullFiveSecondStartGate20260917=true;

  var previousStart=window.startBroadcast;
  var previousCountdown=window.ktLiveStartCountdown;
  if(typeof previousStart!=='function')return;

  var launching=false;
  var bypassNestedCountdown=false;
  var countdownPromise=null;

  function sleep(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}

  function removeCountdown(){
    var old=document.getElementById('ktLiveCountdown');
    if(old&&old.parentNode)old.parentNode.removeChild(old);
  }

  function runCountdown(){
    if(countdownPromise)return countdownPromise;

    /* 5초를 세는 동안 카메라를 뒤에서 미리 준비해서 1 다음에 검은 화면으로 기다리지 않게 한다. */
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

      /* 타이머가 잠깐 밀려도 전체 5초가 늘어나지 않게 실제 경과시간 기준으로 숫자를 바꾼다. */
      var started=performance.now();
      var last=0;
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

    countdownPromise.finally(function(){
      setTimeout(function(){countdownPromise=null;},250);
    });
    return countdownPromise;
  }

  /* 손을 대는 순간 5를 먼저 띄운다. */
  window.addEventListener('pointerdown',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(btn)runCountdown();
  },true);

  /*
   * 라이브 시작 버튼의 원래 click 처리는 카운트다운이 끝난 뒤 한 번만 실행한다.
   * 이렇게 해야 준비화면이 먼저 검게 바뀌면서 5·4·3·2를 가리는 현상이 생기지 않는다.
   */
  var releaseStartButton=false;
  window.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(!btn||releaseStartButton)return;

    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    if(launching)return;

    launching=true;
    runCountdown().then(async function(){
      try{
        releaseStartButton=true;
        bypassNestedCountdown=true;
        await window.startBroadcast();

        /* 13명방만: 첫 5초 뒤 최종 13명방 화면이 아직 안 만들어졌으면
           사용자가 다시 누르지 않아도 시작 호출을 한 번 자동 재실행한다.
           재실행 중에는 카운트다운을 다시 띄우지 않는다. */
        var isGroup13=false;
        try{
          var st=window.state||{};
          var rt=String(st.liveRoomType||st.prepRoomType||st.roomType||'');
          var rn=String(st.liveRoomName||st.prepRoomName||'');
          var rm=Number(st.liveRoomMax||st.prepRoomMax||0);
          isGroup13=(rt==='group'||rt==='group13'||rn.indexOf('13명')>-1||rm===13);
        }catch(e){}

        if(isGroup13){
          await new Promise(function(resolve){setTimeout(resolve,180);});
          if(!document.querySelector('#screen .ktg13-room')){
            await window.startBroadcast();
          }
        }
      }finally{
        releaseStartButton=false;
        bypassNestedCountdown=false;
        removeCountdown();
        setTimeout(function(){launching=false;},300);
      }
    }).catch(function(){
      releaseStartButton=false;
      bypassNestedCountdown=false;
      removeCountdown();
      setTimeout(function(){launching=false;},300);
    });
  },true);

  /* 기존 내부 코드가 또 카운트다운을 부르면 같은 카운트다운 완료만 기다린다. */
  window.ktLiveStartCountdown=async function(){
    if(bypassNestedCountdown)return true;
    return runCountdown();
  };

  window.startBroadcast=async function(){
    if(releaseStartButton)return previousStart.apply(this,arguments);
    if(launching)return;
    launching=true;
    bypassNestedCountdown=true;
    var self=this,args=arguments;

    try{
      await runCountdown();
      return await previousStart.apply(self,args);
    }finally{
      removeCountdown();
      bypassNestedCountdown=false;
      setTimeout(function(){launching=false;},300);
    }
  };
})();

/* 동영상 화면 위 LIVE 표시만 정리: 이 휴대폰의 방송방이 실제로 열려 있지 않으면 이 휴대폰의 오래된 LIVE 배지/팔로우 표시를 숨긴다. 다른 사람의 실제 LIVE 표시는 건드리지 않음. */
(function(){
  if(window.__ktHideStaleSelfLiveBadge20260917)return;
  window.__ktHideStaleSelfLiveBadge20260917=true;

  function localHostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'');}catch(e){return '';}
  }

  function hostRoomVisible(){
    var q='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';
    var list=[].slice.call(document.querySelectorAll(q));
    for(var i=0;i<list.length;i++){
      try{
        var r=list[i].getBoundingClientRect(),cs=getComputedStyle(list[i]);
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0)return true;
      }catch(e){}
    }
    return false;
  }

  function hasHostId(root,id){
    if(!root||!id)return false;
    var tagged=root.querySelectorAll('[data-host]');
    for(var i=0;i<tagged.length;i++){
      if(String(tagged[i].getAttribute('data-host')||'')===id)return true;
    }
    return false;
  }

  function cleanStaleSelf(){
    if(hostRoomVisible())return;
    var id=localHostId();
    if(!id)return;

    var peek=document.getElementById('ktVideoLivePeek');
    if(peek&&hasHostId(peek,id))peek.remove();

    var strip=document.getElementById('ktFollowLiveStrip');
    if(strip){
      [].slice.call(strip.querySelectorAll('.kt-follow-person[data-host]')).forEach(function(b){
        if(String(b.getAttribute('data-host')||'')===id)b.remove();
      });
      if(!strip.querySelector('.kt-follow-person')){
        strip.remove();
        try{document.body.classList.remove('kt-follow-status-open');}catch(e){}
      }
    }
  }

  setInterval(cleanStaleSelf,700);
  try{
    new MutationObserver(function(){setTimeout(cleanStaleSelf,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setTimeout(cleanStaleSelf,100);
})();
