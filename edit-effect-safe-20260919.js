/* K-Talk 편집효과 안전화 (2026-09-19)
   얼굴 앞에 붙는 추적 효과와 사람 분리/투명 배경 효과를 제거하고,
   편집효과를 열고 닫아도 촬영화면 터치가 막히지 않게 한다.
   다른 방/게스트/채팅/관리자/수익/카메라 보정은 변경하지 않음. */
(function(){
  if(window.__ktEditEffectSafe20260919)return;
  window.__ktEditEffectSafe20260919=true;

  function creator(){return document.getElementById('creator');}
  function camera(){return document.getElementById('camera');}
  function sheet(){return document.getElementById('sheet');}

  function removeProblemEffects(){
    try{
      if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');
    }catch(e){}

    try{
      var face=document.getElementById('ktFaceEffectLayer');
      if(face&&face.parentNode)face.parentNode.removeChild(face);
    }catch(e){}

    try{
      if(typeof window.ktStopStageBackground==='function')window.ktStopStageBackground();
    }catch(e){}

    try{
      var stage=document.getElementById('ktStageCanvas');
      if(stage&&stage.parentNode)stage.parentNode.removeChild(stage);
      window.ktStageCanvas=null;
      window.ktStageBgImage=null;
      window.ktStageLoopRunning=false;
    }catch(e){}

    try{
      if(window.state){
        state.editSticker='';
        state.pendingEditEffect='off';
        state.appliedEditEffect='off';
        state.stageBackground='';
        state.stageBackgroundUrl='';
      }
    }catch(e){}

    var c=creator();
    if(c){
      c.classList.remove('stage-bg-active');
      c.classList.remove('beauty-preview-open');
    }
  }

  function unlockCreator(){
    var c=creator();
    if(!c)return;
    c.querySelectorAll(
      '.creator-top button,.creator-tools button,.creator-bottom button,'+
      '.creator-bottom .modes span,.creator-bottom .creator-foot span'
    ).forEach(function(el){
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });

    try{
      if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();
    }catch(e){}
  }

  function hardClose(){
    removeProblemEffects();

    try{
      if(typeof window.closeSheet==='function')window.closeSheet();
    }catch(e){}

    var s=sheet();
    if(s){
      try{
        s.classList.remove('show','camera-effect-sheet','stage-effect-sheet','beauty-control-sheet');
        s.style.setProperty('display','none','important');
        s.style.setProperty('pointer-events','none','important');
        setTimeout(function(){
          try{
            s.style.removeProperty('display');
            s.style.removeProperty('pointer-events');
          }catch(e){}
        },60);
      }catch(e){}
    }

    var c=creator();
    if(c){
      try{
        c.classList.remove('beauty-preview-open');
        var lp=c.querySelector('.live-prep');
        if(lp)lp.style.removeProperty('display');
      }catch(e){}
    }

    unlockCreator();
    setTimeout(unlockCreator,80);
    setTimeout(unlockCreator,220);
  }

  window.ktClearProblemEditEffects=function(){
    removeProblemEffects();
    unlockCreator();
  };

  /* 기존 무거운 얼굴추적/사람분리 효과는 사용하지 않음 */
  window.ktApplyFaceEffect=function(){
    removeProblemEffects();
  };
  window.setEditEffect=function(){
    removeProblemEffects();
  };
  window.previewEditEffect=function(){
    removeProblemEffects();
  };
  window.applyEditEffect=function(){
    removeProblemEffects();
  };
  window.selectStageBackground=function(){
    removeProblemEffects();
  };
  window.switchEditEffectTab=function(){
    /* 투명인간/사람분리 배경 탭을 열지 않음 */
    openSafePanel();
  };

  function openSafePanel(){
    removeProblemEffects();

    var html=''
      +'<div class="rowbox" style="text-align:center;padding:18px 12px">'
      +'<b style="font-size:15px">편집 효과</b><br>'
      +'<span style="font-size:11px;color:#ccc">얼굴 앞에 붙는 효과와 사람 투명 효과는 제거했습니다.</span>'
      +'</div>'
      +'<button class="act" type="button" onclick="ktCloseSafeEditEffect()">확인</button>';

    try{
      if(typeof window.showSheet==='function'){
        window.showSheet('편집 효과',html);
        var s=sheet();
        if(s){
          s.classList.remove('stage-effect-sheet','beauty-control-sheet');
          s.classList.add('camera-effect-sheet');
        }
      }
    }catch(e){}
  }

  window.openEditEffectPanel=openSafePanel;
  window.closeEditEffectPanel=hardClose;
  window.ktCloseSafeEditEffect=hardClose;

  /* 혹시 예전 효과가 남아 있으면 최초 로드 시 바로 정리 */
  removeProblemEffects();
  unlockCreator();

  window.addEventListener('pageshow',function(){
    removeProblemEffects();
    unlockCreator();
  });

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'){
      setTimeout(function(){
        removeProblemEffects();
        unlockCreator();
      },50);
    }
  });
})();