/* K-Talk 작업 중 잠금 해제 유지 (2026-09-19)
   사용자가 작업 종료 후 잠그라고 하기 전까지 지정 조작부만 해제 유지.
   다른 방송/게스트/채팅/카메라/레이아웃은 변경하지 않음. */
(function(){
  if(window.__ktWorkingControlsUnlock20260919)return;
  window.__ktWorkingControlsUnlock20260919=true;

  /* 잠금 상태 자체를 사용하지 않는다. 지정 조작부는 항상 터치 가능 상태 유지. */

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .room-switch',
    '.live-prep .prep-bottom button',
    '.creator-bottom .modes span',
    '.creator-bottom .modes button',
    '#creator .creator-top .creator-rotate',
    '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"]',
    '#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]',
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
    try{document.querySelectorAll(selector).forEach(unlockOne);}catch(e){}
  }

  function clearClosedOverlayBlock(){
    try{
      var sh=document.getElementById('sheet');
      if(sh && !sh.classList.contains('show')){
        sh.style.setProperty('pointer-events','none','important');
      }else if(sh && sh.classList.contains('show')){
        sh.style.removeProperty('pointer-events');
      }
    }catch(e){}

    /* 닫힌 프로필/효과 오버레이가 남아 아래 동영상으로 터치가 샐 때만 정리 */
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
    refresh();
    clearClosedOverlayBlock();
    return true;
  };

  /* 잠금 기능 제거: 다른 코드가 호출해도 다시 잠기지 않음. */
  window.ktLockWorkingControls=function(){
    refresh();
    clearClosedOverlayBlock();
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
        clearTimeout(window.__ktWorkUnlockTimer);
      window.__ktWorkUnlockTimer=setTimeout(run,25);
    });
    mo.observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,
      attributeFilter:['disabled','aria-disabled','class','style']
    });
  }catch(e){}

  setInterval(run,900);
})();