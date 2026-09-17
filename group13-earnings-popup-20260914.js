/* 13명 방 수익률 터치 확대 보기 전용. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13EarningsPopup20260914)return;
  window.__ktGroup13EarningsPopup20260914=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  window.ktGroup13ShowEarningsBig=function(){
    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var current=(document.getElementById('hudEarnRate')||{}).textContent||'일반회원 35%';
    var html=''
      +'<div style="padding:8px 2px;color:#fff;text-align:center">'
      +'<div style="padding:17px 12px;border-radius:20px;background:linear-gradient(145deg,#21152c,#0c111b);border:1px solid #b85cff;box-shadow:0 0 18px rgba(167,71,255,.28)">'
      +'<div style="font-size:13px;color:#8fe8ff;font-weight:900">🔒 내 수익 · 본인만 표시</div>'
      +'<div style="margin-top:9px;font-size:31px;color:#ffe071;font-weight:950">'+esc(net)+'</div>'
      +'<div style="margin-top:8px;font-size:18px;color:#ff9bd3;font-weight:900">'+esc(roses)+'</div>'
      +'</div>'
      +'<div style="display:grid;gap:9px;margin-top:12px;text-align:left">'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#ffe071">일반회원 수익률</b><br>35%</div>'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#8fe8ff">구독자회원 수익률</b><br>40%</div>'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#d9a3ff">소속사 회원 수익률</b><br>65%</div>'
      +'</div>'
      +'<div style="margin-top:10px;color:#ffe071;font-size:13px">현재 표시: '+esc(current)+'</div>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('💰 13명 방 수익률',html);
  };

  window.addEventListener('click',function(e){
    var target=e.target&&e.target.closest?e.target.closest('.ktg13-room #myEarnHud'):null;
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    window.ktGroup13ShowEarningsBig();
  },true);
})();

/* 친구 화면 방송상태/쪽지 모듈 로더만 추가. 기존 기능은 변경하지 않음. */
(function(){
  if(window.__ktFriendsLiveMessageLoader20260915)return;
  window.__ktFriendsLiveMessageLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='friends-live-message-status-20260915.js?v=20260915-status1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 이용방법·혜택 AI 음성 읽기 모듈 로더만 추가. 기존 기능은 변경하지 않음. */
(function(){
  if(window.__ktAiHelpReaderLoader20260915)return;
  window.__ktAiHelpReaderLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='ai-help-reader-20260915.js?v=20260915-voice1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 사운드 목록: 자유 이용 보컬곡 20곡 전용 로더. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktFreeVocal20Loader20260915)return;
  window.__ktFreeVocal20Loader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='sound-free-vocals-20-20260915.js?v=20260915-vocal20-1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 방송방 상단 퀵버튼/LED 높이 조정 모듈 로더만 추가. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktTopQuickBarLoader20260915)return;
  window.__ktTopQuickBarLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='live-top-quickbar-20260915.js?v=20260915-topbar1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 2026-09-15: 방송 진입을 막는 K-Talk 아이콘 설치 안내를 항상 제거. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRemoveInstallOffer20260915)return;
  window.__ktRemoveInstallOffer20260915=true;

  function removeInstallOffer(){
    try{
      ['ktFirstJoinIconOffer','ktInstallOffer','ktInstallPrompt','ktHomeInstallBanner'].forEach(function(id){
        var el=document.getElementById(id);
        if(el)el.remove();
      });
      document.querySelectorAll('[data-kt-install-offer],[data-kt-install-banner]').forEach(function(el){el.remove();});
      document.querySelectorAll('body *').forEach(function(el){
        if(!el||!el.textContent)return;
        var t=String(el.textContent).replace(/\s+/g,' ').trim();
        if((t.indexOf('K-Talk 아이콘 설치')>-1||t.indexOf('K-Talk 새 아이콘')>-1) &&
           (t.indexOf('설치 준비')>-1||t.indexOf('홈 화면')>-1||t.indexOf('아이콘 추가')>-1)){
          var box=el;
          while(box&&box.parentElement&&box.parentElement!==document.body){
            var cs='';
            try{cs=getComputedStyle(box).position;}catch(e){}
            if(cs==='fixed'||cs==='sticky')break;
            box=box.parentElement;
          }
          if(box&&box!==document.body)box.remove();
        }
      });
    }catch(e){}
  }

  removeInstallOffer();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeInstallOffer,{once:true});
  setTimeout(removeInstallOffer,50);
  setTimeout(removeInstallOffer,250);
  setTimeout(removeInstallOffer,1000);
  try{
    var mo=new MutationObserver(removeInstallOffer);
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 2026-09-15: 동영상 게시 시 휴대폰 저장 모듈 로더. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktGallerySaveLoader20260915)return;
  window.__ktGallerySaveLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='gallery-save-on-post-20260915.js?v=20260915-gallery1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 2026-09-15: 장미 레벨 시스템 로더. 기존 방 UI와 선물 UI는 변경하지 않음. */
(function(){
  if(window.__ktLevelSystemLoader20260915)return;
  window.__ktLevelSystemLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='level-system-20260915.js?v=20260915-level1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 2026-09-15: 방을 먼저 열고, 방이 보이는 순간부터 5초 카운트 시작. 다른 UI/선물/버튼은 변경하지 않음. */
(function(){
  if(window.__ktRoomFirstCountdownFix20260915)return;
  window.__ktRoomFirstCountdownFix20260915=true;

  var previousStart=window.startBroadcast;
  var previousCountdown=window.ktLiveStartCountdown;
  var previousEnsure=window.ensureLiveCamera;
  if(typeof previousStart!=='function')return;

  var launching=false;
  var warmPromise=null;
  var overlay=null;
  var numberEl=null;
  var readyPoll=null;
  var freezeTimer=null;
  var correctedClockTimer=null;
  var correctedClockObserver=null;
  var token=0;
  var countdownStartedToken=0;
  var countdownDone=null;
  var resolveCountdown=null;

  function selectedType(){
    try{return String((window.state&&state.liveRoomType)||'');}catch(e){return '';}
  }

  function finalRoomReady(){
    var t=selectedType();
    if(t==='solo')return document.querySelector('.ktsolo-room');
    if(t==='subscriber')return document.querySelector('.ktsubscriber-room');
    if(t==='password')return document.querySelector('.ktsecret-room');
    if(t==='group9')return document.querySelector('.ktg13-room[data-kt-room="9"]')||document.querySelector('.ktg13-room');
    if(t==='group15')return document.querySelector('.ktg13-room[data-kt-room="15"]')||document.querySelector('.ktg13-room');
    if(t==='group'||t==='group13'||t==='general')return document.querySelector('.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])')||document.querySelector('.ktg13-room');
    return document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
  }

  function removeOldCountdowns(){
    ['ktLiveCountdown','ktLiveStartCountdown','ktRoomFirstCountdown20260915'].forEach(function(id){
      var old=document.getElementById(id);
      if(old&&old!==overlay)old.remove();
    });
  }

  function ensureOverlay(){
    if(overlay&&overlay.isConnected)return overlay;
    removeOldCountdowns();
    overlay=document.createElement('div');
    overlay.id='ktRoomFirstCountdown20260915';
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgba(0,0,0,.24);pointer-events:auto;color:#fff;text-align:center;text-shadow:0 3px 16px rgba(0,0,0,.75)';
    overlay.innerHTML='<div><div data-kt-room-count style="width:116px;height:116px;margin:auto;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.74);border:4px solid rgba(255,255,255,.94);box-shadow:0 0 28px rgba(255,44,130,.72);font:900 64px/1 system-ui,-apple-system,sans-serif">5</div><div style="margin-top:14px;font-size:20px;font-weight:900">잠시 후 방송이 시작됩니다</div></div>';
    document.body.appendChild(overlay);
    numberEl=overlay.querySelector('[data-kt-room-count]');
    return overlay;
  }

  function showFive(){
    ensureOverlay();
    if(numberEl)numberEl.textContent='5';
  }

  function hasLiveVideo(){
    try{
      return !!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function attachWarmStream(){
    try{
      if(!(window.state&&state.stream))return;
      var q='#ktLiveVideo,.ktsolo-main video,.ktsubscriber-host video,.ktsecret-slot.host video,.ktg13-host video,.ktg13-hostwrap video';
      document.querySelectorAll(q).forEach(function(v){
        try{
          if(v.srcObject!==state.stream)v.srcObject=state.stream;
          var p=v.play&&v.play();
          if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }

  function startWarm(facing){
    if(hasLiveVideo()){
      attachWarmStream();
      return Promise.resolve(true);
    }
    if(warmPromise)return warmPromise;
    if(typeof previousEnsure!=='function')return Promise.resolve(false);
    try{
      warmPromise=Promise.resolve(previousEnsure.call(window,facing||((window.state&&state.cameraFacing)||'user'))).catch(function(){return false;});
    }catch(e){
      warmPromise=Promise.resolve(false);
    }
    warmPromise.then(function(){attachWarmStream();});
    return warmPromise;
  }

  if(typeof previousEnsure==='function'){
    window.ensureLiveCamera=function(facing){
      if(!launching)return previousEnsure.apply(this,arguments);
      startWarm(facing);
      return Promise.resolve(true);
    };
  }

  window.ktLiveStartCountdown=async function(){
    if(launching||window.__ktRoomFirstCountdownBypass20260915){
      showFive();
      return countdownDone||true;
    }
    if(typeof previousCountdown==='function')return previousCountdown.apply(this,arguments);
    return true;
  };

  function stopClockHelpers(){
    if(freezeTimer){clearInterval(freezeTimer);freezeTimer=null;}
    if(correctedClockTimer){clearInterval(correctedClockTimer);correctedClockTimer=null;}
    if(correctedClockObserver){try{correctedClockObserver.disconnect();}catch(e){}correctedClockObserver=null;}
  }

  function freezeClockAtZero(){
    if(freezeTimer)clearInterval(freezeTimer);
    freezeTimer=setInterval(function(){
      var el=document.getElementById('ktLiveClock');
      if(el&&el.textContent!=='00:00:00')el.textContent='00:00:00';
    },80);
  }

  function startCorrectedClock(){
    stopClockHelpers();
    var zero=Date.now();
    function textNow(){
      var sec=Math.max(0,Math.floor((Date.now()-zero)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      return h+':'+m+':'+s;
    }
    function correct(){
      var el=document.getElementById('ktLiveClock');
      if(!el)return;
      var txt=textNow();
      if(el.textContent!==txt)el.textContent=txt;
    }
    correct();
    correctedClockTimer=setInterval(correct,250);
    var el=document.getElementById('ktLiveClock');
    if(el&&window.MutationObserver){
      correctedClockObserver=new MutationObserver(function(){setTimeout(correct,0);});
      try{correctedClockObserver.observe(el,{childList:true,characterData:true,subtree:true});}catch(e){}
    }
  }

  function finishCountdown(myToken){
    if(myToken!==token)return;
    if(readyPoll){clearInterval(readyPoll);readyPoll=null;}
    if(freezeTimer){clearInterval(freezeTimer);freezeTimer=null;}
    if(overlay&&overlay.parentNode)overlay.remove();
    overlay=null;
    numberEl=null;
    window.__ktRoomFirstCountdownBypass20260915=false;
    launching=false;
    warmPromise=null;
    if(resolveCountdown){resolveCountdown(true);resolveCountdown=null;}
    countdownDone=null;
    attachWarmStream();
    startCorrectedClock();
  }

  function countFromFive(myToken){
    if(myToken!==token)return;
    if(countdownStartedToken===myToken)return;
    countdownStartedToken=myToken;
    showFive();
    freezeClockAtZero();
    var n=5;
    function tick(){
      if(myToken!==token)return;
      if(numberEl)numberEl.textContent=String(n);
      if(n<=1){
        setTimeout(function(){finishCountdown(myToken);},1000);
        return;
      }
      n--;
      setTimeout(tick,1000);
    }
    tick();
  }

  function waitForRoomThenCount(myToken){
    if(readyPoll)clearInterval(readyPoll);
    var waited=0;
    readyPoll=setInterval(function(){
      if(myToken!==token){clearInterval(readyPoll);readyPoll=null;return;}
      attachWarmStream();
      waited+=25;
      var room=finalRoomReady();
      if(!room&&waited<1800)return;
      if(!room&&!document.getElementById('ktLiveVideo'))return;
      clearInterval(readyPoll);readyPoll=null;
      countFromFive(myToken);
    },25);
  }

  function markStart(){
    if(launching)return;
    stopClockHelpers();
    token++;
    launching=true;
    countdownDone=new Promise(function(resolve){resolveCountdown=resolve;});
    window.__ktRoomFirstCountdownBypass20260915=true;
    countFromFive(token);
    startWarm((window.state&&state.cameraFacing)||'user');
  }

  window.addEventListener('pointerdown',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.prep-start'):null;
    if(b)markStart();
  },true);
  window.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.prep-start'):null;
    if(b)markStart();
  },true);

  window.startBroadcast=async function(){
    if(!launching)markStart();
    var myToken=token;
    try{
      var result=await previousStart.apply(this,arguments);
      setTimeout(function(){waitForRoomThenCount(myToken);},0);
      return result;
    }catch(e){
      if(overlay&&overlay.parentNode)overlay.remove();
      overlay=null;numberEl=null;
      window.__ktRoomFirstCountdownBypass20260915=false;
      launching=false;warmPromise=null;
      if(resolveCountdown){resolveCountdown(false);resolveCountdown=null;}
      countdownDone=null;
      throw e;
    }
  };
})();
