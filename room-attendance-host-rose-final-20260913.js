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

/* 방송 시작 카운트다운만 고정: 시작 버튼을 누르는 순간 5부터 바로 보이고 5→4→3→2→1을 전부 표시한 뒤 약 1초 후 기존 방송 시작 흐름을 계속한다. 다른 UI/방/선물/버튼은 변경하지 않음. */
(function(){
  if(window.__ktFullFiveSecondStartGate20260917)return;
  window.__ktFullFiveSecondStartGate20260917=true;

  var countdownPromise=null;

  function removeCountdown(){
    var old=document.getElementById('ktLiveCountdown');
    if(old&&old.parentNode)old.parentNode.removeChild(old);
  }

  function runCountdown(){
    if(countdownPromise)return countdownPromise;

    countdownPromise=(async function(){
      removeCountdown();

      var wrap=document.createElement('div');
      wrap.id='ktLiveCountdown';
      wrap.style.cssText='position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(0,0,0,.18);pointer-events:none;';
      var num=document.createElement('div');
      num.style.cssText='width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.74);border:4px solid rgba(255,255,255,.94);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.72);text-shadow:0 0 12px rgba(255,255,255,.72);transition:transform .2s ease;';
      wrap.appendChild(num);
      document.body.appendChild(wrap);

      for(var n=5;n>=1;n--){
        num.textContent=String(n);
        num.style.transform='scale(1)';
        setTimeout(function(){try{num.style.transform='scale(.92)';}catch(e){}},650);
        await new Promise(function(resolve){setTimeout(resolve,1000);});
      }

      removeCountdown();
      await new Promise(function(resolve){setTimeout(resolve,1000);});
      return true;
    })();

    countdownPromise.finally(function(){
      setTimeout(function(){countdownPromise=null;},300);
    });
    return countdownPromise;
  }

  /* 손을 대는 순간 바로 5를 띄워, 다른 준비 동작이 숫자 5~2를 먹지 못하게 한다. */
  window.addEventListener('pointerdown',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(btn)runCountdown();
  },true);

  window.ktLiveStartCountdown=async function(){
    return runCountdown();
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
