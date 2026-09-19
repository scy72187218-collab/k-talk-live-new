/* K-Talk 편집효과 종료 후 투명 레이어/터치 잠김 방지 (2026-09-19)
   편집효과 창과 촬영화면 3버튼만 관리. 다른 방/채팅/게스트/카메라 보정은 변경하지 않음. */
(function(){
  if(window.__ktEditEffectExitStability20260919)return;
  window.__ktEditEffectExitStability20260919=true;

  function creator(){return document.getElementById('creator');}
  function sheetEl(){return document.getElementById('sheet');}

  function restoreThree(){
    var c=creator();
    if(!c)return;
    [
      c.querySelector('.creator-top .creator-rotate'),
      c.querySelector('.creator-tools .creator-tool-text[aria-label="AI 보정"]'),
      c.querySelector('.creator-tools .creator-tool-text[aria-label="편집 효과"]')
    ].forEach(function(el){
      if(!el)return;
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
    try{if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();}catch(e){}
  }

  function releaseEffectSheet(){
    var c=creator(),s=sheetEl();
    try{
      if(c)c.classList.remove('beauty-preview-open');
      if(c){
        var lp=c.querySelector('.live-prep');
        if(lp)lp.style.removeProperty('display');
      }
    }catch(e){}

    try{
      if(s&&!s.classList.contains('show')){
        s.classList.remove('camera-effect-sheet','stage-effect-sheet','beauty-control-sheet');
        s.style.setProperty('display','none','important');
        s.style.setProperty('pointer-events','none','important');
      }
    }catch(e){}

    restoreThree();
    setTimeout(restoreThree,60);
    setTimeout(restoreThree,220);
  }

  function wrapShow(){
    if(typeof window.showSheet!=='function'||window.showSheet.__ktEffectStable)return;
    var old=window.showSheet;
    var fn=function(){
      var s=sheetEl();
      if(s){
        try{
          s.style.removeProperty('display');
          s.style.removeProperty('pointer-events');
        }catch(e){}
      }
      return old.apply(this,arguments);
    };
    fn.__ktEffectStable=true;
    window.showSheet=fn;
  }

  function wrapClose(){
    if(typeof window.closeSheet!=='function'||window.closeSheet.__ktEffectStable)return;
    var old=window.closeSheet;
    var fn=function(){
      var s=sheetEl();
      var wasEffect=!!(s&&(s.classList.contains('camera-effect-sheet')||
        s.classList.contains('stage-effect-sheet')||
        s.classList.contains('beauty-control-sheet')));
      var r=old.apply(this,arguments);
      if(wasEffect)setTimeout(releaseEffectSheet,0);
      return r;
    };
    fn.__ktEffectStable=true;
    window.closeSheet=fn;
  }

  function wrapEditClose(){
    if(typeof window.closeEditEffectPanel!=='function'||window.closeEditEffectPanel.__ktEffectStable)return;
    var old=window.closeEditEffectPanel;
    var fn=function(){
      var r=old.apply(this,arguments);
      setTimeout(releaseEffectSheet,0);
      return r;
    };
    fn.__ktEffectStable=true;
    window.closeEditEffectPanel=fn;
  }

  function clearStaleBeforeOpen(){
    var c=creator();
    try{
      var s=sheetEl();
      if(s&&!s.classList.contains('show')){
        s.style.removeProperty('display');
        s.style.removeProperty('pointer-events');
      }
      if(c&&!c.classList.contains('stage-bg-active')){
        var oldCanvas=document.getElementById('ktStageCanvas');
        if(oldCanvas)oldCanvas.remove();
      }
    }catch(e){}
  }

  function wrapOpenEdit(){
    if(typeof window.openEditEffectPanel!=='function'||window.openEditEffectPanel.__ktEffectStable)return;
    var old=window.openEditEffectPanel;
    var fn=function(){
      clearStaleBeforeOpen();
      return old.apply(this,arguments);
    };
    fn.__ktEffectStable=true;
    window.openEditEffectPanel=fn;
  }

  function install(){
    wrapShow();
    wrapClose();
    wrapEditClose();
    wrapOpenEdit();
    restoreThree();
  }

  install();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktEditEffectStableTimer);
      window.__ktEditEffectStableTimer=setTimeout(install,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();