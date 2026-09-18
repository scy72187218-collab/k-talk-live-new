/* K-Talk 편집효과 종료 복구 전용 (2026-09-19)
   편집효과에서 나온 뒤 남는 투명 레이어/얼굴 앞 장식/터치 가림만 제거.
   방송방·게스트·채팅·AI보정·카메라 기본 기능은 건드리지 않음. */
(function(){
  if(window.__ktEditEffectExitRecovery20260919)return;
  window.__ktEditEffectExitRecovery20260919=true;

  function sheet(){return document.getElementById('sheet');}
  function creator(){return document.getElementById('creator');}

  function clearEffectOverlays(){
    var c=creator();
    if(!c)return;

    /* 얼굴 앞에 붙는 장식 레이어 제거 */
    try{
      if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');
    }catch(e){}
    try{
      var face=document.getElementById('ktFaceEffectLayer');
      if(face&&face.parentNode)face.parentNode.removeChild(face);
    }catch(e){}

    /* 투명 인물/배경 분리 캔버스 제거 */
    try{
      if(window.state){
        state.editFilter='';
        state.editSticker='';
        state.pendingEditEffect='off';
        state.appliedEditEffect='off';
        state.stageBackground='';
        state.stageBackgroundUrl='';
      }
    }catch(e){}
    try{window.ktStageBgImage=null;}catch(e){}
    try{
      var canvas=document.getElementById('ktStageCanvas');
      if(canvas&&canvas.parentNode)canvas.parentNode.removeChild(canvas);
      window.ktStageCanvas=null;
    }catch(e){}

    try{
      c.classList.remove('beauty-preview-open','stage-bg-active');
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      if(cam){cam.style.removeProperty('opacity');cam.style.setProperty('pointer-events','none','important');}
      if(bg){bg.style.removeProperty('opacity');bg.style.setProperty('pointer-events','none','important');}
    }catch(e){}
  }

  function releaseTouchBlock(){
    var c=creator(),sh=sheet();

    /* 편집효과 창이 닫힌 뒤 투명 전체화면이 남아 터치를 막지 못하게 함 */
    if(sh&&!sh.classList.contains('show')){
      try{
        sh.classList.remove('camera-effect-sheet','stage-effect-sheet','beauty-control-sheet');
        sh.style.setProperty('display','none','important');
        sh.style.setProperty('pointer-events','none','important');
        sh.style.setProperty('visibility','hidden','important');
      }catch(e){}
    }

    if(c){
      var controls=c.querySelectorAll(
        '.creator-top button,.creator-tools button,.creator-bottom button,'+
        '.creator-bottom .modes span,.creator-bottom .creator-foot span'
      );
      controls.forEach(function(el){
        try{
          if(el.disabled)el.disabled=false;
          if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
          if(el.hasAttribute('inert'))el.removeAttribute('inert');
          el.style.setProperty('pointer-events','auto','important');
          el.style.setProperty('touch-action','manipulation','important');
        }catch(e){}
      });
    }

    try{
      if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();
    }catch(e){}
    try{
      if(typeof window.ktHoldSwitchesUnlocked5m==='function')window.ktHoldSwitchesUnlocked5m();
    }catch(e){}
  }

  function recover(){
    clearEffectOverlays();
    releaseTouchBlock();
  }

  /* 다음 시트를 열 때는 숨김 강제값을 먼저 풀어 정상 표시 */
  if(typeof window.showSheet==='function'&&!window.showSheet.__ktEditExitWrapped){
    var oldShow=window.showSheet;
    var showWrap=function(){
      var sh=sheet();
      if(sh){
        try{
          sh.style.removeProperty('display');
          sh.style.removeProperty('pointer-events');
          sh.style.removeProperty('visibility');
        }catch(e){}
      }
      return oldShow.apply(this,arguments);
    };
    showWrap.__ktEditExitWrapped=true;
    window.showSheet=showWrap;
  }

  if(typeof window.closeEditEffectPanel==='function'&&!window.closeEditEffectPanel.__ktEditExitWrapped){
    var oldCloseEdit=window.closeEditEffectPanel;
    var closeEditWrap=function(){
      var r;
      try{r=oldCloseEdit.apply(this,arguments);}catch(e){
        try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(x){}
      }
      setTimeout(recover,0);
      setTimeout(recover,80);
      setTimeout(recover,220);
      return r;
    };
    closeEditWrap.__ktEditExitWrapped=true;
    window.closeEditEffectPanel=closeEditWrap;
  }

  if(typeof window.closeSheet==='function'&&!window.closeSheet.__ktEditExitWrapped){
    var oldCloseSheet=window.closeSheet;
    var closeSheetWrap=function(){
      var sh=sheet();
      var wasEdit=!!(sh&&(sh.classList.contains('stage-effect-sheet')||sh.classList.contains('camera-effect-sheet')));
      var r=oldCloseSheet.apply(this,arguments);
      if(wasEdit){
        setTimeout(recover,0);
        setTimeout(recover,100);
      }
      return r;
    };
    closeSheetWrap.__ktEditExitWrapped=true;
    window.closeSheet=closeSheetWrap;
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'){
      var sh=sheet();
      if(sh&&!sh.classList.contains('show'))setTimeout(releaseTouchBlock,40);
    }
  });
})();