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

  function explainHostAttendance(){
    var msg='출석체크는 시청자가 누르면 호스트에게 장미 1송이가 들어갑니다.';
    try{
      if(typeof window.ktSpeak==='function')window.ktSpeak(msg);
    }catch(e){}
    try{
      if(typeof window.showSheet==='function'){
        window.showSheet('🌹 출석체크','<div class="rowbox"><b>시청자 출석 응원</b><br>방에 들어온 시청자가 출석체크를 한 번 누르면 호스트에게 장미 1송이가 들어갑니다.<br><small>호스트 본인이 누른 것은 지급되지 않습니다.</small></div>');
      }
    }catch(e){}
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
