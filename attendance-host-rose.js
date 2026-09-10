/* K-Talk 출석체크: 기존 하트 보상 대신 방송자에게 장미 1송이 적립 + 출석체크 옆 🌹+1 표시. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktAttendanceHostRoseInstalled)return;
  window.__ktAttendanceHostRoseInstalled=true;

  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function checkedToday(){
    try{return localStorage.getItem('ktalk_attendance_date')===todayKey();}catch(e){return false;}
  }

  function markChecked(){
    try{localStorage.setItem('ktalk_attendance_date',todayKey());}catch(e){}
    try{if(window.state)state.attendanceDate=todayKey();}catch(e){}
  }

  function liveAttendanceButton(){
    return document.querySelector('.ktsolo-att,.ktsubscriber-att,.ktsecret-att,.ktg13-attend,.kt-live-attendance,.kt-s2-att-small,.kt-s2-att-large,#ktAttendanceHeart');
  }

  function decorate(btn){
    if(!btn)return;
    var heart=btn.querySelector&&btn.querySelector('.heart');
    if(heart)heart.textContent='🌹';
    if(btn.id==='ktAttendanceHeart'){
      var label=btn.querySelector('.kt-attendance-label');
      var sub=btn.querySelector('.kt-attendance-sub');
      if(label)label.textContent=checkedToday()?'출석 완료':'출석체크';
      if(sub)sub.textContent=checkedToday()?'방송자에게 장미 +1':'방송자에게 장미 1송이';
    }
  }

  function showPlusOne(btn,already){
    if(!btn)return;
    var old=document.getElementById('ktAttendanceRosePlusOne');
    if(old)old.remove();
    var pop=document.createElement('span');
    pop.id='ktAttendanceRosePlusOne';
    pop.className='kt-attendance-rose-plus';
    pop.textContent=already?'오늘 완료':'🌹 +1';
    try{
      var r=btn.getBoundingClientRect();
      pop.style.left=Math.min(window.innerWidth-82,Math.max(6,r.right+6))+'px';
      pop.style.top=Math.max(8,r.top+(r.height/2)-16)+'px';
    }catch(e){}
    document.body.appendChild(pop);
    setTimeout(function(){if(pop&&pop.parentNode)pop.remove();},2200);
  }

  function giveHostRose(btn){
    decorate(btn);
    if(checkedToday()){
      showPlusOne(btn,true);
      return false;
    }

    /* 기존 방송 수익 집계 함수로 장미 1송이를 넣어 방송 종료 정산에도 포함시킨다. */
    try{
      if(typeof window.giftSend==='function')window.giftSend('출석 장미',1,'출석체크');
    }catch(e){}

    markChecked();
    try{
      var count=parseInt(localStorage.getItem('ktalk_attendance_host_roses')||'0',10)||0;
      localStorage.setItem('ktalk_attendance_host_roses',String(count+1));
    }catch(e){}

    decorate(btn);
    showPlusOne(btn,false);
    try{if(window.ktAnnounceEvent)ktAnnounceEvent('reward',{text:'출석 체크 완료. 방송하는 분에게 장미 한 송이가 올라갔습니다.'});}catch(e){}
    return true;
  }

  /* 기존 하트 출석 함수는 같은 이름을 유지하되 장미 적립으로 교체 */
  window.ktAttendanceCheck=function(){
    return giveHostRose(liveAttendanceButton());
  };

  var oldRender=window.ktRenderAttendance;
  window.ktRenderAttendance=function(){
    try{if(typeof oldRender==='function')oldRender.apply(this,arguments);}catch(e){}
    decorate(liveAttendanceButton());
  };

  if(!document.getElementById('ktAttendanceHostRoseStyle')){
    var s=document.createElement('style');
    s.id='ktAttendanceHostRoseStyle';
    s.textContent=''
      +'.kt-attendance-rose-plus{position:fixed;z-index:999999;padding:6px 10px;border-radius:999px;background:rgba(18,10,15,.94);border:1px solid rgba(255,82,155,.78);color:#ffe36b;font-size:14px;font-weight:950;white-space:nowrap;box-shadow:0 0 10px rgba(255,46,139,.55);pointer-events:none;animation:ktAttendanceRoseUp 2.2s ease-out both}'
      +'@keyframes ktAttendanceRoseUp{0%{opacity:0;transform:translateY(8px) scale(.92)}18%{opacity:1;transform:translateY(0) scale(1)}75%{opacity:1;transform:translateY(-5px) scale(1)}100%{opacity:0;transform:translateY(-15px) scale(.96)}}';
    document.head.appendChild(s);
  }

  /* 실제 라이브 화면의 출석체크 버튼만 가로채서 안내창 대신 즉시 적립 */
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!btn)return;
    var txt=String(btn.innerText||btn.textContent||'').replace(/\s+/g,'');
    if(txt.indexOf('출석체크')<0&&btn.id!=='ktAttendanceHeart')return;
    var inLive=btn.matches('.ktsolo-att,.ktsubscriber-att,.ktsecret-att,.ktg13-attend,.kt-live-attendance,.kt-s2-att-small,.kt-s2-att-large,#ktAttendanceHeart')
      || !!btn.closest('.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.ktg13-room,#ktSept2Live');
    if(!inLive)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    giveHostRose(btn);
  },true);

  function refresh(){
    document.querySelectorAll('.ktsolo-att,.ktsubscriber-att,.ktsecret-att,.ktg13-attend,.kt-live-attendance,.kt-s2-att-small,.kt-s2-att-large,#ktAttendanceHeart').forEach(decorate);
  }
  refresh();
  var mo=new MutationObserver(function(){refresh();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
