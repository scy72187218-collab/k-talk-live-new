/* K-Talk 출석체크: 팝업 없이 방송자에게 장미 1송이 적립 + 호스트 화면 옆에 출석 인원/장미 누적 표시. 다른 기능은 건드리지 않음. */
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

  function hostRoseCount(){
    try{
      var key=todayKey();
      var savedDate=localStorage.getItem('ktalk_attendance_host_roses_date')||'';
      if(savedDate!==key){
        localStorage.setItem('ktalk_attendance_host_roses_date',key);
        localStorage.setItem('ktalk_attendance_host_roses','0');
        return 0;
      }
      return Math.max(0,parseInt(localStorage.getItem('ktalk_attendance_host_roses')||'0',10)||0);
    }catch(e){return 0;}
  }

  function setHostRoseCount(n){
    n=Math.max(0,parseInt(n||0,10)||0);
    try{
      localStorage.setItem('ktalk_attendance_host_roses_date',todayKey());
      localStorage.setItem('ktalk_attendance_host_roses',String(n));
    }catch(e){}
    return n;
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
      if(sub)sub.textContent=checkedToday()?'방송자 장미 적립 완료':'누르면 방송자에게 🌹 1';
    }
  }

  function removeAttendancePopup(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('show'))return;
      var title=document.getElementById('sheetTitle');
      var txt=String((title&&title.textContent)||'');
      if(txt.indexOf('출석')>-1){
        if(typeof window.closeSheet==='function')window.closeSheet();
        else sheet.classList.remove('show');
      }
    }catch(e){}
  }

  function renderHostStack(){
    var count=hostRoseCount();
    var old=document.getElementById('ktAttendanceHostStack');
    if(count<1){if(old)old.remove();return;}

    var live=document.querySelector('.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.ktg13-room,#ktSept2Live');
    if(!live){if(old)old.remove();return;}

    var box=old;
    if(!box){
      box=document.createElement('div');
      box.id='ktAttendanceHostStack';
      box.innerHTML='<small>출석</small><strong></strong><div class="kt-attendance-rose-stack"></div>';
      document.body.appendChild(box);
    }
    var strong=box.querySelector('strong');
    if(strong)strong.textContent='🌹 '+count+'명';
    var stack=box.querySelector('.kt-attendance-rose-stack');
    if(stack){
      var visible=Math.min(count,8);
      var html='';
      for(var i=0;i<visible;i++)html+='<i>🌹</i>';
      if(count>8)html+='<b>+'+(count-8)+'</b>';
      stack.innerHTML=html;
    }
  }

  function giveHostRose(btn){
    removeAttendancePopup();
    decorate(btn);
    if(checkedToday()){
      renderHostStack();
      return false;
    }

    /* 기존 방송 수익 집계 함수로 장미 1송이를 넣어 방송 종료 정산에도 포함 */
    try{
      if(typeof window.giftSend==='function')window.giftSend('출석 장미',1,'출석체크');
    }catch(e){}

    markChecked();
    setHostRoseCount(hostRoseCount()+1);
    decorate(btn);
    renderHostStack();
    removeAttendancePopup();
    return true;
  }

  /* 기존 출석 함수 이름은 유지하되 팝업 없이 바로 장미 적립 */
  window.ktAttendanceCheck=function(){
    return giveHostRose(liveAttendanceButton());
  };

  var oldRender=window.ktRenderAttendance;
  window.ktRenderAttendance=function(){
    try{if(typeof oldRender==='function')oldRender.apply(this,arguments);}catch(e){}
    decorate(liveAttendanceButton());
    renderHostStack();
  };

  if(!document.getElementById('ktAttendanceHostRoseStyle')){
    var s=document.createElement('style');
    s.id='ktAttendanceHostRoseStyle';
    s.textContent=''
      +'#ktAttendanceHostStack{position:fixed;right:7px;top:185px;z-index:9998;width:56px;padding:7px 4px;border-radius:15px;background:rgba(12,8,14,.82);border:1px solid rgba(255,88,160,.55);box-shadow:0 0 10px rgba(255,45,133,.28);text-align:center;color:#fff;pointer-events:none}'
      +'#ktAttendanceHostStack small{display:block;font-size:9px;font-weight:900;color:#ffd968;margin-bottom:3px}'
      +'#ktAttendanceHostStack strong{display:block;font-size:11px;line-height:1.2;font-weight:950;color:#fff;white-space:nowrap}'
      +'#ktAttendanceHostStack .kt-attendance-rose-stack{display:flex;flex-direction:column;align-items:center;gap:0;margin-top:3px;max-height:104px;overflow:hidden}'
      +'#ktAttendanceHostStack .kt-attendance-rose-stack i{display:block;height:13px;line-height:13px;font-style:normal;font-size:13px;filter:drop-shadow(0 0 2px rgba(255,45,92,.5))}'
      +'#ktAttendanceHostStack .kt-attendance-rose-stack b{display:block;margin-top:2px;font-size:9px;color:#ffd968}';
    document.head.appendChild(s);
  }

  /* 라이브 화면의 출석체크 버튼을 가장 먼저 가로채서 큰 출석 안내창이 열리지 않게 함 */
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
    removeAttendancePopup();
    giveHostRose(btn);
  },true);

  function refresh(){
    document.querySelectorAll('.ktsolo-att,.ktsubscriber-att,.ktsecret-att,.ktg13-attend,.kt-live-attendance,.kt-s2-att-small,.kt-s2-att-large,#ktAttendanceHeart').forEach(decorate);
    removeAttendancePopup();
    renderHostStack();
  }
  refresh();
  var mo=new MutationObserver(function(){refresh();});
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
