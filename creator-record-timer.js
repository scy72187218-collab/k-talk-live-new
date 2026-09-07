/* K-Talk 촬영 전용: 5초 준비 카운트다운 + 선택 시간(10분/60초/15초) 원형 진행 표시. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktCreatorRecordTimerInstalled)return;
  window.__ktCreatorRecordTimerInstalled=true;

  var originalStart=window.startCreatorRecording;
  var originalStop=window.stopCreatorRecording;
  if(typeof originalStart!=='function'||typeof originalStop!=='function')return;

  var countdownTimer=0;
  var progressTimer=0;
  var countingDown=false;
  var recordingStartedAt=0;
  var recordingTotal=0;

  function recordButton(){
    return document.querySelector('.creator-bottom .record');
  }

  function stopButton(){
    return document.querySelector('.kt-creator-stop-tap');
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorRecordTimerStyle'))return;
    var style=document.createElement('style');
    style.id='ktCreatorRecordTimerStyle';
    style.textContent=''
      +'.kt-creator-countdown{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.48);border:5px solid rgba(255,255,255,.92);color:#fff;font-size:58px;font-weight:950;text-shadow:0 2px 12px #000;box-shadow:0 0 0 5px rgba(255,45,85,.28),0 0 28px rgba(255,45,85,.62);pointer-events:none}'
      +'.creator-bottom .record.kt-record-counting{font-size:34px!important;font-weight:950!important;color:#fff!important;background:#ff2d55!important}'
      +'#creator .kt-creator-stop-tap.kt-record-progress{border:0!important;background:transparent!important;overflow:visible!important;isolation:isolate!important;box-shadow:none!important}'
      +'#creator .kt-creator-stop-tap.kt-record-progress::before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(#ff2d55 var(--kt-record-deg,0deg),rgba(255,255,255,.22) 0);z-index:0;box-shadow:0 0 0 2px rgba(255,255,255,.18),0 0 22px rgba(255,45,85,.42);pointer-events:none}'
      +'#creator .kt-creator-stop-tap.kt-record-progress::after{content:"";position:absolute;inset:7px;border-radius:50%;background:rgba(8,8,14,.94);z-index:1;pointer-events:none}'
      +'#creator .kt-creator-stop-tap.kt-record-progress>b,#creator .kt-creator-stop-tap.kt-record-progress>span{position:relative;z-index:2}'
      +'#creator .kt-creator-stop-tap .kt-record-elapsed{position:absolute;left:50%;top:-31px;transform:translateX(-50%);z-index:3;min-width:108px;padding:4px 9px;border-radius:999px;background:rgba(0,0,0,.68);border:1px solid rgba(255,255,255,.32);color:#fff;font-style:normal;font-size:14px;font-weight:950;line-height:1.1;font-variant-numeric:tabular-nums;white-space:nowrap;text-shadow:0 1px 4px #000;pointer-events:none}'
      +'#creator .kt-creator-stop-tap .kt-record-elapsed small{font-size:9px;color:#ffd9e3;font-weight:850;margin-left:3px}'
      +'@media(max-width:390px){#creator .kt-creator-stop-tap .kt-record-elapsed{top:-29px;min-width:98px;font-size:13px;padding:4px 7px}}';
    document.head.appendChild(style);
  }

  function ensureCountdown(){
    var el=document.getElementById('ktCreatorCountdown');
    if(el)return el;
    el=document.createElement('div');
    el.id='ktCreatorCountdown';
    el.className='kt-creator-countdown';
    el.style.display='none';
    var host=document.getElementById('creator')||document.querySelector('.creator')||document.body;
    host.appendChild(el);
    return el;
  }

  function clearCountdown(){
    if(countdownTimer){clearTimeout(countdownTimer);countdownTimer=0;}
    countingDown=false;
    var el=document.getElementById('ktCreatorCountdown');
    if(el)el.style.display='none';
    var btn=recordButton();
    if(btn){
      btn.classList.remove('kt-record-counting');
      btn.textContent='촬영 시작';
    }
  }

  function clearProgress(){
    if(progressTimer){clearInterval(progressTimer);progressTimer=0;}
    recordingStartedAt=0;
    recordingTotal=0;
    var btn=stopButton();
    if(btn){
      btn.classList.remove('kt-record-progress');
      btn.style.removeProperty('--kt-record-deg');
      var time=btn.querySelector('.kt-record-elapsed');
      if(time)time.remove();
    }
  }

  function fmtElapsed(ms){
    var sec=Math.max(0,Math.floor(ms/1000));
    var m=Math.floor(sec/60);
    var s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function fmtTotal(ms){
    var sec=Math.max(0,Math.round(ms/1000));
    var m=Math.floor(sec/60);
    var s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function ensureElapsedChip(btn){
    var el=btn.querySelector('.kt-record-elapsed');
    if(el)return el;
    el=document.createElement('i');
    el.className='kt-record-elapsed';
    btn.appendChild(el);
    return el;
  }

  function updateProgress(){
    if(!recordingStartedAt||!recordingTotal)return;
    var elapsed=Math.max(0,Date.now()-recordingStartedAt);
    if(elapsed>recordingTotal)elapsed=recordingTotal;
    var ratio=Math.max(0,Math.min(1,elapsed/recordingTotal));
    var btn=stopButton();
    if(btn){
      btn.classList.add('kt-record-progress');
      btn.style.setProperty('--kt-record-deg',(ratio*360).toFixed(1)+'deg');
      var chip=ensureElapsedChip(btn);
      chip.innerHTML=fmtElapsed(elapsed)+' <small>/ '+fmtTotal(recordingTotal)+'</small>';
    }
    if(elapsed>=recordingTotal&&progressTimer){clearInterval(progressTimer);progressTimer=0;}
  }

  function startProgress(){
    clearProgress();
    var d=0;
    try{d=Number(window.ktCreatorDuration||0);}catch(e){}
    if(!d){try{if(typeof ktCreatorDuration!=='undefined')d=Number(ktCreatorDuration||0);}catch(e){}}
    recordingTotal=d>0?d:600000;
    recordingStartedAt=Date.now();
    updateProgress();
    progressTimer=setInterval(updateProgress,100);
  }

  async function beginActualRecording(){
    clearCountdown();
    try{
      var result=await originalStart.apply(window,arguments);
      setTimeout(function(){
        try{
          if(window.ktCreatorRecording===true || (window.ktCreatorRecorder&&window.ktCreatorRecorder.state==='recording') || document.getElementById('creator').classList.contains('creator-recording'))startProgress();
        }catch(e){}
      },60);
      return result;
    }catch(e){
      clearProgress();
      throw e;
    }
  }

  window.startCreatorRecording=function(){
    try{
      if(window.ktCreatorRecording===true){
        return window.stopCreatorRecording();
      }
    }catch(e){}
    if(countingDown)return;

    ensureStyle();
    var overlay=ensureCountdown();
    var btn=recordButton();
    countingDown=true;
    var n=5;

    function show(){
      if(!countingDown)return;
      overlay.textContent=String(n);
      overlay.style.display='grid';
      if(btn){
        btn.classList.add('kt-record-counting');
        btn.textContent=String(n);
      }
      if(n<=1){
        countdownTimer=setTimeout(function(){
          if(!countingDown)return;
          beginActualRecording();
        },1000);
      }else{
        n--;
        countdownTimer=setTimeout(show,1000);
      }
    }
    show();
  };

  window.stopCreatorRecording=function(){
    clearCountdown();
    clearProgress();
    return originalStop.apply(window,arguments);
  };

  var originalClose=window.closeCreator;
  if(typeof originalClose==='function'){
    window.closeCreator=function(){
      clearCountdown();
      clearProgress();
      return originalClose.apply(window,arguments);
    };
  }

  ensureStyle();
})();

/* 권한창 반복 완화: 방송/촬영 화면을 여는 것만으로 권한을 묻지 않고, 실제 촬영·라이브 시작 때만 요청한다. */
(function(){
  if(window.__ktPermissionEntryFixInstalled)return;
  window.__ktPermissionEntryFixInstalled=true;

  function hasLiveVideo(){
    try{return !!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  var openNow=window.openCreator;
  if(typeof openNow==='function'){
    window.openCreator=async function(){
      if(hasLiveVideo())return openNow.apply(this,arguments);
      try{if(window.ktStopBackgroundMedia)window.ktStopBackgroundMedia();}catch(e){}
      var c=document.getElementById('creator');
      if(c){
        c.classList.add('show');
        c.classList.remove('creator-review','creator-recording','live-prep-open');
      }
      return true;
    };
  }

  var recordNow=window.startCreatorRecording;
  if(typeof recordNow==='function'){
    window.startCreatorRecording=async function(){
      if(!hasLiveVideo()&&window.ensureLiveCamera){
        try{await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
      }
      return recordNow.apply(this,arguments);
    };
  }
})();

/* 컴퓨터·태블릿(700px 이상)에서만 화면 크기 보정 파일을 불러온다. 휴대폰은 건드리지 않는다. */
(function(){
  if(document.getElementById('ktDesktopTabletFixCss'))return;
  var link=document.createElement('link');
  link.id='ktDesktopTabletFixCss';
  link.rel='stylesheet';
  link.href='desktop-tablet-fix.css?v=20260907a';
  document.head.appendChild(link);
})();
