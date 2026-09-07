/* K-Talk 촬영 전용: 5초 준비 카운트다운 + 선택 시간(10분/60초/15초) + 촬영 경과시간 표시. 다른 기능은 변경하지 않음. */
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

  function ensureStyle(){
    if(document.getElementById('ktCreatorRecordTimerStyle'))return;
    var style=document.createElement('style');
    style.id='ktCreatorRecordTimerStyle';
    style.textContent=''
      +'.kt-creator-countdown{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.48);border:5px solid rgba(255,255,255,.92);color:#fff;font-size:58px;font-weight:950;text-shadow:0 2px 12px #000;box-shadow:0 0 0 5px rgba(255,45,85,.28),0 0 28px rgba(255,45,85,.62);pointer-events:none}'
      +'.creator-bottom .record.kt-record-counting{font-size:34px!important;font-weight:950!important;color:#fff!important;background:#ff2d55!important}'
      +'.creator-bottom .record.kt-record-progress{font-size:18px!important;font-weight:950!important;color:#fff!important;line-height:1.05!important;background:conic-gradient(#ff2d55 var(--kt-record-deg,360deg),#2d2d33 0)!important;box-shadow:0 0 0 3px rgba(255,45,85,.18),0 0 18px rgba(255,45,85,.28)!important}'
      +'.creator-bottom .record.kt-record-progress::after{content:"REC";display:block;font-size:10px;letter-spacing:1px;margin-top:4px;color:#fff}'
      +'.kt-creator-elapsed{position:fixed;z-index:70;display:none;min-width:78px;padding:4px 10px;border-radius:12px;background:rgba(0,0,0,.48);color:#fff;text-align:center;font-size:22px;font-weight:950;line-height:1;letter-spacing:.5px;text-shadow:0 2px 8px #000;pointer-events:none;transform:translateX(-50%)}';
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

  function ensureElapsed(){
    var el=document.getElementById('ktCreatorElapsed');
    if(el)return el;
    el=document.createElement('div');
    el.id='ktCreatorElapsed';
    el.className='kt-creator-elapsed';
    el.textContent='00:00';
    document.body.appendChild(el);
    return el;
  }

  function placeElapsed(){
    var el=ensureElapsed();
    var btn=recordButton();
    if(!btn)return;
    var r=btn.getBoundingClientRect();
    el.style.left=(r.left+r.width/2)+'px';
    el.style.top=Math.max(8,r.top-38)+'px';
  }

  function clearCountdown(){
    if(countdownTimer){clearTimeout(countdownTimer);countdownTimer=0;}
    countingDown=false;
    var el=document.getElementById('ktCreatorCountdown');
    if(el)el.style.display='none';
    var btn=recordButton();
    if(btn){
      btn.classList.remove('kt-record-counting');
      if(!btn.classList.contains('kt-record-progress'))btn.textContent='촬영 시작';
    }
  }

  function clearProgress(resetText){
    if(progressTimer){clearInterval(progressTimer);progressTimer=0;}
    recordingStartedAt=0;
    recordingTotal=0;
    var elapsedEl=document.getElementById('ktCreatorElapsed');
    if(elapsedEl)elapsedEl.style.display='none';
    var btn=recordButton();
    if(btn){
      btn.classList.remove('kt-record-progress');
      btn.style.removeProperty('--kt-record-deg');
      if(resetText!==false)btn.textContent='촬영 시작';
    }
  }

  function fmt(ms){
    var sec=Math.max(0,Math.ceil(ms/1000));
    var m=Math.floor(sec/60);
    var s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function fmtElapsed(ms){
    var sec=Math.max(0,Math.floor(ms/1000));
    var m=Math.floor(sec/60);
    var s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function updateProgress(){
    if(!recordingStartedAt||!recordingTotal)return;
    var elapsed=Math.max(0,Date.now()-recordingStartedAt);
    var remain=Math.max(0,recordingTotal-elapsed);
    var ratio=Math.max(0,Math.min(1,remain/recordingTotal));
    var elapsedEl=ensureElapsed();
    elapsedEl.textContent=fmtElapsed(elapsed);
    elapsedEl.style.display='block';
    placeElapsed();
    var btn=recordButton();
    if(btn){
      btn.classList.add('kt-record-progress');
      btn.style.setProperty('--kt-record-deg',(ratio*360).toFixed(1)+'deg');
      btn.textContent=fmt(remain);
    }
    if(remain<=0&&progressTimer){clearInterval(progressTimer);progressTimer=0;}
  }

  function startProgress(){
    clearProgress(false);
    recordingTotal=(typeof window.ktCreatorDuration==='number'&&window.ktCreatorDuration>0)?window.ktCreatorDuration:600000;
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
          if(window.ktCreatorRecording===true || (window.ktCreatorRecorder&&window.ktCreatorRecorder.state==='recording'))startProgress();
        }catch(e){}
      },30);
      return result;
    }catch(e){
      clearProgress(true);
      throw e;
    }
  }

  window.startCreatorRecording=function(){
    if(window.ktCreatorRecording){
      return window.stopCreatorRecording();
    }
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
    clearProgress(true);
    return originalStop.apply(window,arguments);
  };

  var originalClose=window.closeCreator;
  if(typeof originalClose==='function'){
    window.closeCreator=function(){
      clearCountdown();
      clearProgress(true);
      return originalClose.apply(window,arguments);
    };
  }

  ensureStyle();
})();
