/* K-Talk 라이브방 출석체크 최종 보정: 방문자가 1회 누르면 호스트에게 장미 1송이만 지급. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomAttendanceHostRoseFinal20260913)return;
  window.__ktRoomAttendanceHostRoseFinal20260913=true;

  var originalAttendanceCheck=window.ktAttendanceCheck;
  var originalOpenAttendanceBenefits=window.openAttendanceBenefits;
  var roomSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';

  function visibleRoom(){
    var rooms=[].slice.call(document.querySelectorAll(roomSelector));
    if(!rooms.length)return null;
    for(var i=0;i<rooms.length;i++){
      var r=rooms[i];
      try{
        var cs=getComputedStyle(r);
        var rect=r.getBoundingClientRect();
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&rect.width>0&&rect.height>0)return r;
      }catch(e){}
    }
    return rooms[0]||null;
  }

  function today(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function roomIdentity(room){
    if(!room)return 'room';
    var kind='room';
    if(room.classList.contains('ktsolo-room'))kind='solo';
    else if(room.classList.contains('ktsubscriber-room'))kind='subscriber';
    else if(room.classList.contains('ktsecret-room'))kind='secret';
    else if(room.classList.contains('ktg13-room'))kind='group'+String(room.getAttribute('data-kt-room')||'13');
    var title='';
    try{title=String((window.state&&(state.currentLiveRoomTitle||state.currentViewRoomTitle))||'').trim();}catch(e){}
    return kind+':'+(title||'live');
  }

  function attendanceKey(room){
    return 'ktalk_host_room_attendance_once:'+today()+':'+roomIdentity(room);
  }

  function nickname(){
    var name='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        name=String(p.nickname||p.name||p.displayName||'').trim();
      }
    }catch(e){}
    if(!name){
      try{
        var sub=typeof window.ktGetSelectedSubAccount==='function'?window.ktGetSelectedSubAccount():'';
        if(sub&&typeof window.ktSubProfileCard==='function'){
          var sp=window.ktSubProfileCard(sub)||{};
          name=String(sp.nickname||sp.name||sp.displayName||'').trim();
        }
      }catch(e){}
    }
    if(!name){
      try{
        ['ktalk_nickname','ktalk_profile_name','nickname','profileName','displayName'].some(function(k){
          var v=String(localStorage.getItem(k)||'').trim();
          if(v){name=v;return true;}
          return false;
        });
      }catch(e){}
    }
    return name||'회원';
  }

  function markButton(room){
    if(!room)return;
    var btn=room.querySelector('.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.kt-live-attendance,[data-kt-attendance]');
    if(!btn)return;
    try{
      btn.classList.add('kt-attendance-done');
      btn.setAttribute('aria-pressed','true');
      btn.setAttribute('data-kt-host-attended','1');
      btn.title='호스트 출석 완료 · 장미 1송이';
    }catch(e){}
  }

  function addHostRose(){
    try{
      if(typeof window.addMyEarnedRoses==='function'){
        window.addMyEarnedRoses(1);
        return true;
      }
    }catch(e){}
    return false;
  }

  function announce(name){
    var msg=(name||'회원')+'님이 출석했습니다. 호스트에게 장미 1송이가 들어왔습니다.';
    try{
      if(typeof window.ktSpeak==='function'){
        try{if(window.speechSynthesis&&window.speechSynthesis.cancel)window.speechSynthesis.cancel();}catch(e){}
        window.ktSpeak(msg);
      }
    }catch(e){}
  }

  function hostAttendance(){
    var room=visibleRoom();
    if(!room)return false;
    var key=attendanceKey(room);
    var done=false;
    try{done=localStorage.getItem(key)==='1';}catch(e){}
    if(done){
      markButton(room);
      return true;
    }
    try{localStorage.setItem(key,'1');}catch(e){}
    addHostRose();
    markButton(room);
    announce(nickname());
    return true;
  }

  /* 예전 '본인 출석 보상' 함수는 라이브방 안에서만 호스트 출석으로 바꾼다. */
  window.ktAttendanceCheck=function(){
    if(visibleRoom()){
      hostAttendance();
      return;
    }
    if(typeof originalAttendanceCheck==='function')return originalAttendanceCheck.apply(this,arguments);
  };

  /* 방 안의 출석 버튼이 예전 혜택 팝업을 불러도 호스트 출석으로 처리한다. 방 밖 혜택센터는 그대로 둔다. */
  window.openAttendanceBenefits=function(){
    if(visibleRoom()){
      hostAttendance();
      return;
    }
    if(typeof originalOpenAttendanceBenefits==='function')return originalOpenAttendanceBenefits.apply(this,arguments);
  };
})();
