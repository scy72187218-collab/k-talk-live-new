/* 1인방·9명방·13명방·구독자방·비밀방: 출석은 팝업 없이 장미 1송이, 출석 옆 숫자 표시. 기존 좋아요/호스트 얼굴 하트 기능은 유지. */
(function(){
  if(window.__ktAttendanceHeartHostTapFixInstalled)return;
  window.__ktAttendanceHeartHostTapFixInstalled=true;

  var roomSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';
  var attendanceSelector='.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att';
  var sideLikeSelector='.ktg13-right-quick .ktg13-like,.ktsubscriber-right .like,.ktsecret-right .like';
  var hostSelector='.ktg13-room .ktg13-host,.ktsubscriber-room .ktsubscriber-host,.ktsecret-room .ktsecret-slot.host';

  function today(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function roomKey(room){
    if(!room)return 'room';
    if(room.classList.contains('ktsolo-room'))return 'solo';
    if(room.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(room.classList.contains('ktsecret-room'))return 'secret';
    if(room.classList.contains('ktg13-room'))return room.getAttribute('data-kt-room')==='9'?'group9':'group13';
    return 'room';
  }

  function numberFrom(el){
    if(!el)return 0;
    var m=String(el.textContent||'').match(/(\d[\d,]*)/);
    return m?parseInt(m[1].replace(/,/g,''),10)||0:0;
  }

  function addRoseOne(){
    var list=[];
    ['hudEarnRoses','ktSubscriberEarnRoses','ktSecretEarnRoses'].forEach(function(id){
      var el=document.getElementById(id);if(el&&list.indexOf(el)<0)list.push(el);
    });
    try{
      document.querySelectorAll('[id*="EarnRoses"]').forEach(function(el){if(list.indexOf(el)<0)list.push(el);});
    }catch(e){}
    list.forEach(function(el){el.textContent='🌹 '+(numberFrom(el)+1)+'송이';});
  }

  function speakAttendanceDone(){
    try{
      if(typeof window.ktSpeak==='function'){
        window.ktSpeak('출석 체크했다');
        return;
      }
      if('speechSynthesis' in window){
        window.speechSynthesis.cancel();
        var u=new SpeechSynthesisUtterance('출석 체크했다');
        u.lang='ko-KR';
        u.volume=1;
        u.rate=0.95;
        u.pitch=1;
        window.speechSynthesis.speak(u);
      }
    }catch(e){}
  }

  function countKey(room){
    return 'ktalk_room_attendance_count:'+today()+':'+roomKey(room);
  }

  function doneKey(room){
    return 'ktalk_quiet_attendance_rose:'+today()+':'+roomKey(room);
  }

  function getCount(room){
    try{return Math.max(0,parseInt(localStorage.getItem(countKey(room))||'0',10)||0);}catch(e){return 0;}
  }

  function setCount(room,n){
    try{localStorage.setItem(countKey(room),String(Math.max(0,Number(n)||0)));}catch(e){}
  }

  function ensureCountStyle(){
    if(document.getElementById('ktAttendanceRoomCountStyle'))return;
    var s=document.createElement('style');
    s.id='ktAttendanceRoomCountStyle';
    s.textContent=''
      +'.kt-attendance-room-count{display:inline-grid!important;place-items:center!important;min-width:20px!important;height:20px!important;padding:0 5px!important;margin-left:4px!important;border-radius:999px!important;background:#ff3ba7!important;color:#fff!important;font-size:11px!important;font-weight:950!important;line-height:20px!important;vertical-align:middle!important;box-shadow:0 0 7px rgba(255,59,167,.72)!important;flex:0 0 auto!important}'
      +'.ktsolo-att .kt-attendance-room-count{min-width:18px!important;height:18px!important;line-height:18px!important;font-size:10px!important;padding:0 4px!important;margin-left:2px!important}';
    document.head.appendChild(s);
  }

  function renderCount(btn,room){
    if(!btn||!room)return;
    ensureCountStyle();
    var n=getCount(room);
    var done=false;
    try{done=localStorage.getItem(doneKey(room))==='1';}catch(e){}
    if(done&&n<1){n=1;setCount(room,n);}
    var badge=btn.querySelector('.kt-attendance-room-count');
    if(!badge){
      badge=document.createElement('span');
      badge.className='kt-attendance-room-count';
      badge.setAttribute('aria-label','출석 인원');
      btn.appendChild(badge);
    }
    badge.textContent=String(n);
  }

  function attendance(btn){
    var room=btn&&btn.closest?btn.closest(roomSelector):null;
    if(!room)return;
    var key=doneKey(room);
    var done=false;
    try{done=localStorage.getItem(key)==='1';}catch(e){}
    if(!done){
      try{localStorage.setItem(key,'1');}catch(e){}
      setCount(room,getCount(room)+1);
      addRoseOne();
      speakAttendanceDone();
    }else if(getCount(room)<1){
      setCount(room,1);
    }
    try{
      btn.classList.add('kt-attendance-done');
      btn.setAttribute('aria-pressed','true');
      btn.title='출석완료 · 장미 1송이 지급';
    }catch(e){}
    renderCount(btn,room);
  }

  function installAttendanceCounts(){
    ensureCountStyle();
    try{
      document.querySelectorAll(attendanceSelector).forEach(function(btn){
        var room=btn.closest(roomSelector);
        if(room)renderCount(btn,room);
      });
    }catch(e){}
  }

  function likeKey(room){
    if(!room)return 'group13';
    if(room.classList.contains('ktsolo-room'))return 'solo';
    if(room.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(room.classList.contains('ktsecret-room'))return 'secret';
    return 'group13';
  }

  function addTopHeart(room){
    if(!room)return;
    var key=likeKey(room);
    window.__ktLiveClockLikes=window.__ktLiveClockLikes||{solo:0,group13:0,subscriber:0,secret:0};
    window.__ktLiveClockLikes[key]=Number(window.__ktLiveClockLikes[key]||0)+1;
    var count=room.querySelector('.kt-live-clock-heart .count')||document.querySelector('.kt-live-clock-heart[data-room="'+key+'"] .count');
    if(count)count.textContent=String(window.__ktLiveClockLikes[key]);
  }

  /* window 캡처에서 5개 방 출석 클릭을 먼저 잡아 기존 alert/혜택 팝업 호출만 막는다. */
  window.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest(attendanceSelector);
    if(!btn)return;
    try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(err){}
    attendance(btn);
  },true);

  /* 오른쪽 좋아요 버튼은 기존 기능은 그대로 두고 상단 하트 숫자만 +1 한다. */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var like=t.closest(sideLikeSelector);
    if(!like)return;
    var room=like.closest(roomSelector);
    if(room)addTopHeart(room);
  },true);

  /* 호스트 얼굴/영상 자체를 누른 경우만 상단 하트 +1. 카메라·마이크·기타 버튼 탭은 제외. */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    if(t.closest('button,a,input,select,textarea,.kt-inside-av-controls,.kt-person-mic,.ktg13-camera-toggle,.kt-host-camera-toggle,.kt-open-camera-wave'))return;
    var host=t.closest(hostSelector);
    if(!host)return;
    var room=host.closest(roomSelector);
    if(room)addTopHeart(room);
  },true);

  installAttendanceCounts();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(installAttendanceCounts,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktAttendanceCountInstallTimer);
      window.__ktAttendanceCountInstallTimer=setTimeout(installAttendanceCounts,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 프로필 사진·레벨·닉네임 표시 파일 로딩만 보강. 다른 기능은 변경하지 않음. */
(function(){
  if(document.querySelector('script[data-kt-profile-level="1"]'))return;
  var s=document.createElement('script');
  s.src='room-host-guest-profile-level.js?v=20260913-profilelevel2';
  s.async=false;
  s.setAttribute('data-kt-profile-level','1');
  document.head.appendChild(s);
})();
