/* 1인방·9명방·13명방·구독자방·비밀방: 출석은 팝업 없이 장미 1송이, 출석 옆 숫자 표시. 기존 좋아요/호스트 얼굴 하트 기능은 유지. */
(function(){
  if(window.__ktAttendanceHeartHostTapFixInstalled)return;
  window.__ktAttendanceHeartHostTapFixInstalled=true;

  var roomSelector='.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room';
  var attendanceSelector='.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.kt-live-attendance,[data-kt-attendance],.kt-s2-att-small,.kt-s2-att-large,.kt-sa-att';
  var sideLikeSelector='.ktsolo-right .like,.ktg9-right .like,.ktg13-right-quick .ktg13-like,.ktg13-right-quick .like,.ktsubscriber-right .like,.ktsecret-right .like';
  var hostSelector='.ktsolo-room .ktsolo-main,.ktg9-room .ktg9-host,.ktg13-room .ktg13-host,.ktsubscriber-room .ktsubscriber-host,.ktsecret-room .ktsecret-slot.host';

  function today(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function roomKey(room){
    if(!room)return 'room';
    if(room.classList.contains('ktsolo-room'))return 'solo';
    if(room.classList.contains('ktsubscriber-room'))return 'subscriber';
    if(room.classList.contains('ktsecret-room'))return 'secret';
    if(room.classList.contains('ktg9-room'))return 'group9';
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

  function attendanceNickname(){
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
          name=String(sp.nickname||sp.name||'').trim();
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

  function playAttendanceChime(){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      var ac=window.__ktAttendanceAudioCtx||(window.__ktAttendanceAudioCtx=new AC());
      if(ac.state==='suspended'&&ac.resume)ac.resume().catch(function(){});
      var now=ac.currentTime;
      [659.25,783.99].forEach(function(freq,i){
        var o=ac.createOscillator(),g=ac.createGain();
        o.type='sine';o.frequency.setValueAtTime(freq,now+(i*.08));
        g.gain.setValueAtTime(0.0001,now+(i*.08));
        g.gain.exponentialRampToValueAtTime(0.12,now+(i*.08)+.015);
        g.gain.exponentialRampToValueAtTime(0.0001,now+(i*.08)+.16);
        o.connect(g);g.connect(ac.destination);
        o.start(now+(i*.08));o.stop(now+(i*.08)+.18);
      });
    }catch(e){}
  }

  function speakAttendanceDone(){
    playAttendanceChime();
    var msg=attendanceNickname()+'님, 출석 체크해 주셔서 감사합니다.';
    try{if(window.state)state.aiVoiceOn=true;}catch(e){}
    try{localStorage.setItem('ktalk_ai_voice','on');}catch(e){}
    try{if(window.speechSynthesis&&window.speechSynthesis.cancel)window.speechSynthesis.cancel();}catch(e){}
    try{
      if('speechSynthesis' in window&&typeof window.SpeechSynthesisUtterance==='function'){
        var u=new SpeechSynthesisUtterance(msg);
        u.lang='ko-KR';
        u.volume=1;
        u.rate=0.98;
        u.pitch=1.02;
        try{
          var voices=window.speechSynthesis.getVoices?window.speechSynthesis.getVoices():[];
          var ko=voices.find(function(v){return /^ko(-|_)/i.test(v.lang||'');});
          if(ko)u.voice=ko;
        }catch(e){}
        window.speechSynthesis.speak(u);
        return;
      }
      if(typeof window.ktSpeak==='function')window.ktSpeak(msg);
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

  function globalHeartCount(){
    try{return Math.max(0,parseInt(localStorage.getItem('ktalk_attendance_hearts')||'0',10)||0);}catch(e){return 0;}
  }
  function setGlobalHeartCount(n){
    try{localStorage.setItem('ktalk_attendance_hearts',String(Math.max(0,Number(n)||0)));}catch(e){}
  }
  window.ktAttendanceHeartCount=function(){
    var room=null;
    try{room=document.querySelector('#screen '+roomSelector.split(',').join(',#screen '));}catch(e){}
    var n=room?getCount(room):0;
    return Math.max(n,globalHeartCount());
  };

  function ensureCountStyle(){
    if(document.getElementById('ktAttendanceRoomCountStyle'))return;
    var s=document.createElement('style');
    s.id='ktAttendanceRoomCountStyle';
    s.textContent=''
      +'.kt-attendance-room-count{display:none!important}'
      +'.ktsolo-att .kt-attendance-room-count{min-width:18px!important;height:18px!important;line-height:18px!important;font-size:10px!important;padding:0 4px!important;margin-left:2px!important}'
      +'.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.kt-live-attendance,[data-kt-attendance]{position:relative!important}'
      +'.kt-attendance-heart-badge{position:absolute!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;min-width:38px!important;height:24px!important;padding:0 6px!important;margin:0!important;border-radius:999px!important;background:rgba(52,12,38,.96)!important;border:1px solid rgba(255,91,185,.72)!important;color:#fff!important;font-size:10px!important;font-weight:950!important;line-height:24px!important;box-shadow:0 0 8px rgba(255,67,174,.42)!important;white-space:nowrap!important;pointer-events:none!important;z-index:2147482002!important}'
      +'.kt-attendance-inline-top{position:static!important;transform:none!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:auto!important;height:24px!important;max-height:24px!important;padding:0 7px!important;margin-left:4px!important;border-radius:999px!important;font-size:10px!important;line-height:24px!important;white-space:nowrap!important;flex:0 0 auto!important}';
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

    /* 출석체크 전용 하트: 좋아요 하트와 완전히 별개.
       호스트 좋아요 하트 바로 위에 숫자와 함께 표시한다. */
    var heart=room.querySelector('.kt-attendance-heart-badge');
    if(!heart){
      heart=document.createElement('span');
      heart.className='kt-attendance-heart-badge';
      heart.setAttribute('aria-label','출석체크 하트');
    }
    heart.textContent='💗 '+String(n);

    var host13=room.matches('.ktg13-room[data-kt-approved13="1"][data-kt-room="13"]');
    if(host13&&btn.closest('.ktg13-title-row')){
      heart.textContent='💗 '+String(n)+'명';
      heart.setAttribute('aria-label','출석 인원 '+n+'명');
      if(btn.nextElementSibling!==heart)btn.insertAdjacentElement('afterend',heart);
      return;
    }

    try{
      btn.classList.remove('kt-attendance-inline-top');

      var like=room.querySelector(sideLikeSelector);
      var anchor=like&&like.parentElement?like.parentElement:null;

      if(anchor&&like){
        var cs=getComputedStyle(anchor);
        if(cs.position==='static')anchor.style.setProperty('position','relative','important');
        if(heart.parentElement!==anchor)anchor.appendChild(heart);

        /* 좋아요 버튼 위치는 그대로 두고, 출석 하트만 바로 위에 띄운다. */
        var top=Math.max(-28,(like.offsetTop||0)-27);
        var left=Math.max(0,(like.offsetLeft||0)+Math.round(((like.offsetWidth||44)-42)/2));
        heart.style.setProperty('top',top+'px','important');
        heart.style.setProperty('left',left+'px','important');
        heart.style.setProperty('right','auto','important');
        heart.style.setProperty('bottom','auto','important');
      }else{
        /* 오른쪽 좋아요 줄이 숨겨진 레이아웃은 호스트 영상 오른쪽 위에만 표시한다. */
        var host=room.querySelector(
          '.ktsolo-main,.ktg9-host,.ktg13-host,.ktsubscriber-host,.ktsecret-slot.host'
        );
        if(host){
          var hs=getComputedStyle(host);
          if(hs.position==='static')host.style.setProperty('position','relative','important');
          if(heart.parentElement!==host)host.appendChild(heart);
          heart.style.setProperty('top','6px','important');
          heart.style.setProperty('right','6px','important');
          heart.style.setProperty('left','auto','important');
          heart.style.setProperty('bottom','auto','important');
        }
      }
    }catch(e){}
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
      setGlobalHeartCount(globalHeartCount()+1);
      addRoseOne();
    }else if(getCount(room)<1){
      setCount(room,1);
      if(globalHeartCount()<1)setGlobalHeartCount(1);
    }
    speakAttendanceDone();
    try{window.dispatchEvent(new CustomEvent('kt-attendance-heart-updated',{detail:{count:window.ktAttendanceHeartCount(),at:Date.now()}}));}catch(e){};
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
    if(room.classList.contains('ktg9-room'))return 'group9';
    if(room.classList.contains('ktg13-room')&&room.getAttribute('data-kt-room')==='9')return 'group9';
    return 'group13';
  }

  function ensureTopHeart(room,key){
    if(!room)return null;

    /* 2026-10-01: all-room-clock-like already owns the single heart beside
       the live clock. Reuse that exact counter and remove only the duplicate
       heart created by this attendance helper. */
    try{
      var canonical=room.querySelector('.kt-clock-like-20260927');
      if(canonical){
        var dup=room.querySelector('.kt-live-clock-heart');
        if(dup&&dup.parentNode)dup.parentNode.removeChild(dup);
        var span=canonical.querySelector('span');
        if(span){
          var shown=parseInt(String(span.textContent||'0').replace(/[^0-9]/g,''),10)||0;
          window.__ktLiveClockLikes=window.__ktLiveClockLikes||{solo:0,group9:0,group13:0,subscriber:0,secret:0};
          if(Number(window.__ktLiveClockLikes[key]||0)<shown)window.__ktLiveClockLikes[key]=shown;
          return span;
        }
      }
    }catch(e){}

    if(!document.getElementById('ktTopHeartStyle')){
      var s=document.createElement('style');
      s.id='ktTopHeartStyle';
      s.textContent=''
        +'.kt-live-clock-heart{display:inline-flex!important;align-items:center!important;gap:3px!important;margin-left:auto!important;padding:3px 8px!important;border-radius:999px!important;background:rgba(52,12,38,.88)!important;border:1px solid rgba(255,91,185,.55)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1!important;white-space:nowrap!important;box-shadow:0 0 7px rgba(255,67,174,.28)!important}'
        +'.kt-live-clock-heart .count{font:inherit!important;color:#fff!important}'
        +'.ktg13-air small .kt-live-clock-heart{margin-left:5px!important;padding:2px 6px!important;font-size:10px!important}'
        +'@media(max-width:390px){.kt-live-clock-heart{font-size:10px!important;padding:3px 6px!important}.ktg13-air small .kt-live-clock-heart{font-size:9px!important;padding:2px 5px!important}}';
      document.head.appendChild(s);
    }
    var heart=room.querySelector('.kt-live-clock-heart');
    if(!heart){
      heart=document.createElement('span');
      heart.className='kt-live-clock-heart';
      heart.setAttribute('data-room',key);
      heart.innerHTML='💗 <b class="count">0</b>';
      var air=room.querySelector('.ktsolo-air,.ktsubscriber-air,.ktsecret-air');
      if(air){
        air.appendChild(heart);
      }else{
        var gsmall=room.querySelector('.ktg13-air small');
        if(gsmall)gsmall.appendChild(heart);
        else{
          var head=room.querySelector('.ktg13-head,.ktsubscriber-head,.ktsecret-head,.ktsolo-head');
          if(head)head.appendChild(heart);
        }
      }
    }
    heart.setAttribute('data-room',key);
    return heart.querySelector('.count');
  }

  function addTopHeart(room){
    if(!room)return;
    var key=likeKey(room);
    window.__ktLiveClockLikes=window.__ktLiveClockLikes||{solo:0,group9:0,group13:0,subscriber:0,secret:0};
    window.__ktLiveClockLikes[key]=Number(window.__ktLiveClockLikes[key]||0)+1;
    var count=ensureTopHeart(room,key);
    if(count)count.textContent=String(window.__ktLiveClockLikes[key]);
  }

  function installTopHearts(){
    try{
      document.querySelectorAll(roomSelector).forEach(function(room){
        var key=likeKey(room);
        window.__ktLiveClockLikes=window.__ktLiveClockLikes||{solo:0,group9:0,group13:0,subscriber:0,secret:0};
        var count=ensureTopHeart(room,key);
        if(count)count.textContent=String(Number(window.__ktLiveClockLikes[key]||0));
      });
    }catch(e){}
  }

  /* 호스트 출석 버튼은 레이아웃마다 클래스가 달라도 '출석체크' 문구까지 확인해 한 번만 처리한다. */
  var lastAttendanceTapAt=0,lastAttendanceTapBtn=null;
  function hostAttendanceHit(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest(attendanceSelector);
    if(!btn){
      var cand=t.closest('button,[role="button"],div,span');
      if(cand&&cand.closest(roomSelector)){
        var txt=String(cand.textContent||cand.getAttribute('aria-label')||'').replace(/\s+/g,'');
        if(txt.indexOf('출석체크')>-1)btn=cand;
      }
    }
    if(!btn||!btn.closest(roomSelector))return;
    var now=Date.now();
    if(lastAttendanceTapBtn===btn&&now-lastAttendanceTapAt<500)return;
    lastAttendanceTapBtn=btn;lastAttendanceTapAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(err){}
    attendance(btn);
  }
  window.addEventListener('pointerup',hostAttendanceHit,true);
  window.addEventListener('click',hostAttendanceHit,true);

  /* 오른쪽 좋아요 버튼은 기존 기능은 그대로 두고 상단 하트 숫자만 +1 한다. */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var like=t.closest(sideLikeSelector);
    if(!like){
      var b=t.closest('button[aria-label="좋아요"]');
      if(b&&!b.classList.contains('kt-live-clock-heart')&&b.closest('.ktsolo-right,.ktg13-right-quick,.ktsubscriber-right,.ktsecret-right'))like=b;
    }
    if(!like)return;
    var room=like.closest(roomSelector);
    if(room)addTopHeart(room);
  },true);

  /* 호스트 얼굴/카메라 화면 자체를 누른 경우 좋아요를 영구 누적.
     방송시간 옆 공용 하트 저장소를 직접 올려서 0으로 되돌아가지 않게 한다.
     카메라·마이크 조작 버튼은 제외. */
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    if(t.closest('button,a,input,select,textarea,.kt-inside-av-controls,.kt-person-mic,.ktg13-camera-toggle,.kt-host-camera-toggle,.kt-room-camera-toggle'))return;
    var host=t.closest(hostSelector);
    if(!host)return;
    var room=host.closest(roomSelector);
    if(!room)return;
    try{
      if(typeof window.addHostLike==='function'){
        window.addHostLike(1);
      }else{
        addTopHeart(room);
      }
    }catch(_e){
      addTopHeart(room);
    }
  },true);

  installAttendanceCounts();
  installTopHearts();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(function(){installAttendanceCounts();installTopHearts();},ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktAttendanceCountInstallTimer);
      window.__ktAttendanceCountInstallTimer=setTimeout(function(){installAttendanceCounts();installTopHearts();},30);
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
