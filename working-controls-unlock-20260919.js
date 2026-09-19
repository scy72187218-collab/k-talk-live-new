/* K-Talk 작업중 스위치/촬영버튼 잠금 해제 유지 (2026-09-19)
   사용자가 "잠그라"고 하기 전까지 페이지를 닫았다 열어도 해제 상태 유지.
   대상: 스위치 + 되돌리기 + AI 보정 + 편집효과.
   다른 방송/게스트/채팅/카메라 로직은 변경하지 않음. */
(function(){
  if(window.__ktWorkingControlsUnlock20260919)return;
  window.__ktWorkingControlsUnlock20260919=true;

  var KEY='ktalk_work_controls_unlocked';

  function setStore(v){
    try{localStorage.setItem(KEY,v?'1':'0');}catch(e){}
  }
  function isUnlocked(){
    try{return localStorage.getItem(KEY)!=='0';}catch(e){return true;}
  }

  /* 지금은 작업 중이므로 기본값을 '해제 유지'로 둔다. */
  try{
    if(localStorage.getItem(KEY)==null)localStorage.setItem(KEY,'1');
  }catch(e){}

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .room-switch',
    '.live-prep .prep-bottom button',
    '.creator-bottom .modes span',
    '.creator-bottom .modes button',
    '#creator .creator-top .creator-rotate',
    '#creator .creator-tools .creator-tool-text[aria-label="AI 보정"]',
    '#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]'
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
    try{
      document.querySelectorAll(selector).forEach(unlockOne);
    }catch(e){}
  }

  /* 편집효과 창이 닫힌 뒤 투명 시트가 남아 버튼을 막는 경우만 정리 */
  function clearClosedSheetBlock(){
    if(!isUnlocked())return;
    try{
      var sh=document.getElementById('sheet');
      if(sh && !sh.classList.contains('show')){
        sh.style.setProperty('pointer-events','none','important');
      }else if(sh && sh.classList.contains('show')){
        sh.style.removeProperty('pointer-events');
      }
    }catch(e){}
  }

  window.ktKeepWorkingControlsUnlocked=function(){
    setStore(true);
    refresh();
    clearClosedSheetBlock();
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

  refresh();
  clearClosedSheetBlock();
  [80,200,500,1000,1800,3000].forEach(function(ms){
    setTimeout(function(){refresh();clearClosedSheetBlock();},ms);
  });

  /* 페이지를 닫았다 다시 열어도 localStorage 값으로 다시 해제 */
  window.addEventListener('pageshow',function(){
    refresh();clearClosedSheetBlock();
  });
  window.addEventListener('focus',function(){
    refresh();clearClosedSheetBlock();
  });
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'){
      setTimeout(function(){refresh();clearClosedSheetBlock();},40);
    }
  });

  try{
    var mo=new MutationObserver(function(){
      if(!isUnlocked())return;
      clearTimeout(window.__ktWorkUnlockTimer);
      window.__ktWorkUnlockTimer=setTimeout(function(){
        refresh();clearClosedSheetBlock();
      },25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','aria-disabled','class','style']});
  }catch(e){}

  /* 자동 잠금이 다시 걸려도 작업 중에는 재해제 */
  setInterval(function(){
    if(!isUnlocked())return;
    refresh();
    clearClosedSheetBlock();
  },700);
})();