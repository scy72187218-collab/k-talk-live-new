/* K-Talk 오늘의 돌리기 전용: 메인 화면 밖에 버튼만 표시. 다른 화면/기능은 변경하지 않음. */
(function(){
  function removeDuplicateButtons(){
    try{
      var nodes=[].slice.call(document.querySelectorAll('#ktDailySpinFab,.kt-daily-spin-fab'));
      var keep=null;
      nodes.forEach(function(n){
        if(!keep){keep=n;return;}
        if(n!==keep&&n.parentNode)n.remove();
      });
      if(keep){
        keep.id='ktDailySpinFab';
        keep.classList.add('kt-daily-spin-fab');
      }
    }catch(e){}
  }

  removeDuplicateButtons();
  setTimeout(removeDuplicateButtons,50);
  setTimeout(removeDuplicateButtons,300);
  setTimeout(removeDuplicateButtons,900);

  if(window.__ktDailySpinRewardInstalled)return;
  window.__ktDailySpinRewardInstalled=true;

  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function accountKey(){
    try{if(typeof window.ktProfileAccountKey==='function')return String(window.ktProfileAccountKey()||'default');}catch(e){}
    try{var s=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';if(s)return 'sub:'+s;}catch(e){}
    try{return localStorage.getItem('kt_live_device_id')||'default';}catch(e){return 'default';}
  }

  function slotInfo(){
    var h=new Date().getHours();
    if(h<12)return {key:'morning',label:'아침'};
    if(h<17)return {key:'lunch',label:'점심'};
    return {key:'evening',label:'저녁'};
  }

  function spinKey(){
    var slot=slotInfo();
    return 'ktalk_daily_spin_used:'+accountKey()+':'+todayKey()+':'+slot.key;
  }

  function wasUsed(){
    try{return localStorage.getItem(spinKey())==='1';}catch(e){return false;}
  }

  function saveUsed(){
    try{localStorage.setItem(spinKey(),'1');}catch(e){}
  }

  function addRoses(n){
    n=parseInt(n,10)||0;
    if(n<1)return;
    try{
      var k='ktalk_daily_spin_roses:'+accountKey();
      var total=parseInt(localStorage.getItem(k)||'0',10)||0;
      localStorage.setItem(k,String(total+n));
    }catch(e){}
    try{
      var el=document.getElementById('hudEarnRoses')||document.getElementById('ktSubscriberEarnRoses');
      if(el){
        var m=String(el.textContent||'').match(/(\d[\d,]*)/);
        var cur=m?parseInt(m[1].replace(/,/g,''),10)||0:0;
        el.textContent='🌹 '+(cur+n)+'송이';
      }
    }catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById('ktDailySpinStyle'))return;
    var s=document.createElement('style');
    s.id='ktDailySpinStyle';
    s.textContent=''
      +'.kt-daily-spin-fab{display:none;position:fixed;left:12px;bottom:92px;z-index:49;border:1px solid #ffd85a;border-radius:17px;background:linear-gradient(145deg,#3d2200,#171008);color:#fff;padding:9px 11px;box-shadow:0 0 14px #ffb00066;font:900 11px/1.15 system-ui,-apple-system,"Noto Sans KR",sans-serif;align-items:center;gap:7px;touch-action:manipulation}'
      +'.kt-home .kt-daily-spin-fab{display:flex}.kt-daily-spin-fab .ico{font-size:24px}.kt-daily-spin-fab small{display:block;margin-top:2px;color:#ffe37a;font-size:9px}'
      +'.kt-daily-spin-fab.used{opacity:.7;border-color:#777;box-shadow:none}.kt-daily-spin-fab.spinning .ico{animation:ktDailySpin .65s linear 2}'
      +'@keyframes ktDailySpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  function updateButton(){
    var b=document.getElementById('ktDailySpinFab');
    if(!b)return;
    var slot=slotInfo(),used=wasUsed();
    b.classList.toggle('used',used);
    var html='<span class="ico">🎡</span><span>오늘의 돌리기<small>'+slot.label+' 1회'+(used?' · 완료':'')+'</small></span>';
    if(b.innerHTML!==html)b.innerHTML=html;
  }

  function installButton(){
    ensureStyle();
    removeDuplicateButtons();
    var b=document.getElementById('ktDailySpinFab');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.id='ktDailySpinFab';
      b.className='kt-daily-spin-fab';
      b.setAttribute('aria-label','오늘의 돌리기');
      b.onclick=function(){window.ktDailySpinNow(this);};
      document.body.appendChild(b);
    }
    updateButton();
  }

  window.ktDailySpinNow=function(btn){
    var slot=slotInfo();
    if(wasUsed()){
      alert('🎡 '+slot.label+' 돌리기는 이미 했습니다. 다음 시간대에 다시 할 수 있습니다.');
      updateButton();
      return;
    }
    if(btn){btn.disabled=true;btn.classList.add('spinning');}
    setTimeout(function(){
      var rewards=[0,1,2,3];
      var reward=rewards[Math.floor(Math.random()*rewards.length)];
      saveUsed();
      addRoses(reward);
      if(btn){btn.disabled=false;btn.classList.remove('spinning');}
      updateButton();
      if(reward===0)alert('🎡 결과: 꽝\n다음 '+(slot.key==='morning'?'점심':slot.key==='lunch'?'저녁':'아침')+'에 다시 돌릴 수 있습니다.');
      else alert('🎡 결과: 🌹 장미 '+reward+'송이 당첨!');
    },1300);
  };

  installButton();
  var obs=new MutationObserver(function(){installButton();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(updateButton,60000);
})();

/* 공개 동영상을 보다가 다른 화면으로 가면 뒤에서 다시 소리가 나지 않게 막는다. 라이브/카메라는 건드리지 않음. */
(function(){
  if(window.__ktPageVideoExitGuardInstalled)return;
  window.__ktPageVideoExitGuardInstalled=true;

  function isPageVideo(m){
    return !!(m&&(m.id==='homeVideo'||(m.classList&&m.classList.contains('kt-public-video'))));
  }

  function pageVideoShouldStop(m){
    if(!isPageVideo(m))return false;
    if(!m.isConnected)return true;
    try{
      var sheet=document.getElementById('sheet');
      if(sheet&&sheet.classList.contains('show')&&!sheet.contains(m))return true;
      var creator=document.getElementById('creator');
      if(creator&&creator.classList.contains('show')&&!creator.contains(m))return true;
      var cs=getComputedStyle(m);
      if(cs.display==='none'||cs.visibility==='hidden')return true;
      var r=m.getBoundingClientRect();
      if(r.width<2||r.height<2)return true;
    }catch(e){}
    return false;
  }

  function hardStop(m){
    if(!isPageVideo(m))return;
    try{m.pause();}catch(e){}
    try{m.muted=true;}catch(e){}
  }

  var tracked=null;
  try{
    document.querySelectorAll('#homeVideo,.kt-public-video').forEach(function(m){
      if(!m.paused)tracked=m;
    });
  }catch(e){}

  var nativePlay=HTMLMediaElement.prototype.play;
  if(nativePlay&&!nativePlay.__ktPageExitGuardWrapped){
    var guardedPlay=function(){
      if(isPageVideo(this)&&pageVideoShouldStop(this)){
        hardStop(this);
        return Promise.resolve();
      }
      return nativePlay.apply(this,arguments);
    };
    guardedPlay.__ktPageExitGuardWrapped=true;
    HTMLMediaElement.prototype.play=guardedPlay;
  }

  document.addEventListener('play',function(e){
    var m=e.target;
    if(!isPageVideo(m))return;
    tracked=m;
    if(pageVideoShouldStop(m))hardStop(m);
  },true);

  function checkAfterMove(){
    if(tracked&&pageVideoShouldStop(tracked)){
      hardStop(tracked);
      try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
    }
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t&&t.closest&&t.closest('#homeVideo,.kt-public-video'))return;
    setTimeout(checkAfterMove,0);
    setTimeout(checkAfterMove,80);
    setTimeout(checkAfterMove,300);
    setTimeout(checkAfterMove,900);
  },true);

  try{
    var screen=document.getElementById('screen');
    if(screen){
      new MutationObserver(function(){
        setTimeout(checkAfterMove,0);
        setTimeout(checkAfterMove,120);
      }).observe(screen,{childList:true,subtree:false});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.hidden&&tracked)hardStop(tracked);
  });
  window.addEventListener('pagehide',function(){if(tracked)hardStop(tracked);});
})();
