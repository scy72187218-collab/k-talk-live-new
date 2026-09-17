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

/* 방송 시작 타이밍만 조정: 기존 카메라 준비 대기에 막히지 않고 5초 카운트가 끝난 뒤 약 1초 후 방송방을 연다. 다른 기능/UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveOpenOneSecondAfterCountdown20260917)return;
  window.__ktLiveOpenOneSecondAfterCountdown20260917=true;

  window.ktLiveStartCountdown=async function(){
    /* 카메라는 뒤에서 미리 준비하되, 준비 완료 Promise가 방송방 전환을 막지 않게 한다. */
    try{
      if(typeof window.ensureLiveCamera==='function'){
        Promise.resolve(window.ensureLiveCamera((window.state&&state.cameraFacing)||'user')).catch(function(){});
      }
    }catch(e){}

    var old=document.getElementById('ktLiveCountdown');
    if(old)old.remove();

    var wrap=document.createElement('div');
    wrap.id='ktLiveCountdown';
    wrap.style.cssText='position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:rgba(0,0,0,.22);pointer-events:none;';
    var num=document.createElement('div');
    num.style.cssText='width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.72);border:4px solid rgba(255,255,255,.92);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.7);text-shadow:0 0 12px rgba(255,255,255,.7);';
    wrap.appendChild(num);
    document.body.appendChild(wrap);

    for(var n=5;n>=1;n--){
      num.textContent=String(n);
      num.style.transform='scale(1)';
      await new Promise(function(resolve){
        setTimeout(function(){num.style.transform='scale(.92)';},650);
        setTimeout(resolve,1000);
      });
    }

    wrap.remove();
    await new Promise(function(resolve){setTimeout(resolve,1000);});
  };
})();
