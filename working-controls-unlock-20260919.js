/* K-Talk 작업 잠금/해제 상태 유지 (2026-09-19)
   사용자가 "잠가 주세요"라고 하면 잠금 상태를 유지하고,
   "풀어 주세요"라고 하면 지정 조작부만 다시 해제할 수 있게 한다.
   다른 방송/게스트/채팅/카메라/레이아웃은 변경하지 않음. */
(function(){
  if(window.__ktWorkingControlsUnlock20260919)return;
  window.__ktWorkingControlsUnlock20260919=true;

  var KEY='ktalk_work_controls_unlocked';

  function setStore(v){
    try{localStorage.setItem(KEY,v?'1':'0');}catch(e){}
  }
  function isUnlocked(){
    try{return localStorage.getItem(KEY)==='1';}catch(e){return false;}
  }

  /* 실제 앱 조작부는 자동 잠금하지 않는다. 작업 보호는 코드 수정 범위로만 유지한다. */
  if(localStorage.getItem(KEY)==null)setStore(true);

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .room-switch',
    '.live-prep .prep-bottom button',
    '.creator-bottom .modes span',
    '.creator-bottom .modes button',
    '#creator .creator-top .creator-rotate',
    '.kt-total-admin-row',
    '.kt-live-profile-follow[data-self="1"]',
    '.kt-allhost-photo',
    '.kt-allhost-fallback'
  ].join(',');

  function unlockOne(el){
    if(!el)return;
    try{
      if(el.disabled)el.disabled=false;
      if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      el.dataset.ktWorkUnlocked='1';
    }catch(e){}
  }

  function refresh(){
    if(!isUnlocked())return;
    try{document.querySelectorAll(selector).forEach(unlockOne);}catch(e){}
  }

  function clearClosedOverlayBlock(){
    if(!isUnlocked())return;
    try{
      var sh=document.getElementById('sheet');
      if(sh && !sh.classList.contains('show')){
        sh.style.setProperty('pointer-events','none','important');
      }else if(sh && sh.classList.contains('show')){
        sh.style.removeProperty('pointer-events');
      }
    }catch(e){}

    try{
      document.querySelectorAll(
        '#ktFaceEffectLayer,#ktStageCanvas,.kt-live-profile-pop[aria-hidden="true"]'
      ).forEach(function(el){
        if(!el)return;
        var cs=getComputedStyle(el);
        if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0){
          el.style.setProperty('pointer-events','none','important');
        }
      });
    }catch(e){}
  }

  window.ktKeepWorkingControlsUnlocked=function(){
    setStore(true);
    refresh();
    clearClosedOverlayBlock();
    return true;
  };

  window.ktLockWorkingControls=function(){
    setStore(false);
    try{
      var sh=document.getElementById('sheet');
      if(sh)sh.style.removeProperty('pointer-events');
    }catch(e){}
    return true;
  };

  function run(){
    refresh();
    clearClosedOverlayBlock();
  }

  run();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(run,ms);});

  window.addEventListener('pageshow',run);
  window.addEventListener('focus',run);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(run,40);
  });

  try{
    var mo=new MutationObserver(function(){
      if(!isUnlocked())return;
      clearTimeout(window.__ktWorkUnlockTimer);
      window.__ktWorkUnlockTimer=setTimeout(run,25);
    });
    mo.observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,
      attributeFilter:['disabled','aria-disabled','class','style']
    });
  }catch(e){}

  setInterval(function(){
    if(isUnlocked())run();
  },900);
})();