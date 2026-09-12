/* K-Talk 출석체크 보상만 수정: 하루 1회 장미 1송이. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktAttendanceOneRoseFixInstalled)return;
  window.__ktAttendanceOneRoseFixInstalled=true;

  function todayKey(){
    try{if(typeof window.ktTodayKey==='function')return window.ktTodayKey();}catch(e){}
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function checkedToday(){
    try{return localStorage.getItem('ktalk_attendance_date')===todayKey();}catch(e){return false;}
  }

  function roseCount(){
    try{return parseInt(localStorage.getItem('ktalk_attendance_roses')||'0',10)||0;}catch(e){return 0;}
  }

  function saveRoseCount(n){
    try{localStorage.setItem('ktalk_attendance_roses',String(n));}catch(e){}
  }

  window.ktAttendanceCheck=function(){
    if(checkedToday()){
      try{if(window.ktSpeak)ktSpeak('오늘 출석 장미는 이미 받았습니다.');}catch(e){}
      alert('오늘 출석 장미 1송이는 이미 받았습니다.');
      try{if(window.ktRenderAttendance)ktRenderAttendance();}catch(e){}
      return false;
    }

    var count=roseCount()+1;
    saveRoseCount(count);
    try{localStorage.setItem('ktalk_attendance_date',todayKey());}catch(e){}
    try{
      if(window.state){
        state.attendanceDate=todayKey();
        state.attendanceRoses=count;
      }
    }catch(e){}
    try{if(window.ktAnnounceEvent)ktAnnounceEvent('reward',{text:'출석 체크 완료. 장미 1송이를 받았습니다.'});}catch(e){}
    alert('🌹 출석 완료! 장미 1송이 받았습니다.');
    try{if(window.ktRenderAttendance)ktRenderAttendance();}catch(e){}
    return true;
  };

  window.ktRenderAttendance=function(){
    var btn=document.getElementById('ktAttendanceHeart');
    if(!btn)return;
    var done=checkedToday();
    btn.classList.toggle('done',done);
    var label=btn.querySelector('.kt-attendance-label');
    var sub=btn.querySelector('.kt-attendance-sub');
    if(label)label.textContent=done?'출석 완료':'출석체크';
    if(sub)sub.textContent=done?'오늘 장미 1송이 받음':'장미 1송이';
  };

  window.openAttendanceBenefits=function(){
    var done=checkedToday();
    var total=roseCount();
    var html=''
      +'<div class="rowbox"><b>🌹 출석 보상</b><br>매일 출석하면 하루 1번 장미 1송이를 받습니다.</div>'
      +'<div class="rowbox"><b>오늘 상태</b><br>'+(done?'오늘 장미 1송이를 이미 받았습니다.':'아래 버튼을 누르면 오늘 장미 1송이가 들어갑니다.')+'</div>'
      +'<div class="rowbox"><b>출석으로 받은 장미</b><br>총 '+total+'송이</div>'
      +(done?'':'<button class="act" onclick="ktAttendanceCheck();closeSheet()">🌹 장미 1송이 받기</button>');
    try{showSheet('✅ 출석 · 참여 보상',html);}catch(e){}
  };

  setTimeout(function(){try{window.ktRenderAttendance();}catch(e){}},50);
})();