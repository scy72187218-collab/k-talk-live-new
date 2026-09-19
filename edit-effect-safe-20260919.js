/* K-Talk 편집효과 안전화 (2026-09-19)
   문제를 만들던 얼굴 부착 효과/배경 투명 처리만 제거하고
   다른 방송방·게스트·채팅·카메라 보정은 건드리지 않는다. */
(function(){
  if(window.__ktEditEffectSafe20260919)return;
  window.__ktEditEffectSafe20260919=true;

  var editOpen=false;

  function creator(){
    return document.getElementById('creator');
  }

  function sheet(){
    return document.getElementById('sheet');
  }

  function restoreControls(){
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

  function clearDangerousEffects(){
    var c=creator();
    if(!c)return;

    try{if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');}catch(e){}

    try{
      var face=document.getElementById('ktFaceEffectLayer');
      if(face&&face.parentNode)face.parentNode.removeChild(face);
    }catch(e){}

    try{
      var canvas=document.getElementById('ktStageCanvas');
      if(canvas&&canvas.parentNode)canvas.parentNode.removeChild(canvas);
    }catch(e){}

    try{
      if(window.state){
        state.stageBackground='';
        state.stageBackgroundUrl='';
        state.editSticker='';
        state.pendingEditEffect='off';
        state.appliedEditEffect='off';
      }
    }catch(e){}

    try{
      window.ktStageBgImage=null;
      window.ktStageCanvas=null;
      window.ktStageLoopRunning=false;
    }catch(e){}

    try{
      c.classList.remove('stage-bg-active','beauty-preview-open');
      c.removeAttribute('data-beauty-char');
    }catch(e){}

    try{
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      [cam,bg].forEach(function(v){
        if(!v)return;
        v.style.removeProperty('opacity');
        v.style.removeProperty('visibility');
      });
    }catch(e){}

    try{
      var lp=c.querySelector('.live-prep');
      if(lp)lp.style.removeProperty('display');
    }catch(e){}

    restoreControls();
  }

  window.ktClearUnsafeEditEffects=clearDangerousEffects;

  function safePanelHtml(){
    return '<div class="kt-safe-edit-panel" style="padding:12px 10px 8px;color:#fff">'
      +'<div style="padding:12px;border:1px solid #ffffff22;border-radius:14px;background:#11131a">'
      +'<b style="display:block;font-size:15px">편집 효과</b>'
      +'<span style="display:block;margin-top:6px;font-size:11px;color:#c7c8cf;line-height:1.45">'
      +'화면 앞에 붙는 효과와 사람을 투명하게 만드는 효과는 제거했습니다.</span>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">'
      +'<button type="button" onclick="ktSafeEditNone()" style="height:42px;border:1px solid #ffffff22;border-radius:12px;background:#181922;color:#fff;font-weight:900">효과 없음</button>'
      +'<button type="button" onclick="closeEditEffectPanel()" style="height:42px;border:0;border-radius:12px;background:linear-gradient(135deg,#7048ff,#b14fe8);color:#fff;font-weight:900">확인</button>'
      +'</div></div>';
  }

  window.ktSafeEditNone=function(){
    clearDangerousEffects();
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
  };

  var oldCloseSheet=window.closeSheet;
  if(typeof oldCloseSheet==='function'&&!oldCloseSheet.__ktSafeEditWrapped){
    var wrappedClose=function(){
      var wasEdit=editOpen;
      var r=oldCloseSheet.apply(this,arguments);
      if(wasEdit){
        editOpen=false;
        clearDangerousEffects();
        setTimeout(restoreControls,20);
        setTimeout(restoreControls,160);
      }
      return r;
    };
    wrappedClose.__ktSafeEditWrapped=true;
    window.closeSheet=wrappedClose;
  }

  window.openEditEffectPanel=function(){
    clearDangerousEffects();
    editOpen=true;

    var c=creator();
    if(c)c.classList.add('beauty-preview-open');

    try{
      if(typeof window.showSheet==='function'){
        window.showSheet('편집 효과',safePanelHtml());
        var sh=sheet();
        if(sh){
          sh.classList.add('camera-effect-sheet','stage-effect-sheet');
          sh.style.removeProperty('pointer-events');
        }
      }
    }catch(e){
      editOpen=false;
      clearDangerousEffects();
    }
  };

  window.closeEditEffectPanel=function(){
    editOpen=false;
    try{
      if(typeof window.closeSheet==='function')window.closeSheet();
    }catch(e){}
    clearDangerousEffects();

    var sh=sheet();
    if(sh){
      try{
        sh.classList.remove('show','camera-effect-sheet','stage-effect-sheet');
        sh.style.removeProperty('pointer-events');
      }catch(e){}
    }

    setTimeout(restoreControls,20);
    setTimeout(restoreControls,150);
    setTimeout(restoreControls,500);
  };

  /* 기존에 남아 있던 투명/부착 효과가 있으면 페이지 시작 시 즉시 제거 */
  clearDangerousEffects();

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&!editOpen){
      clearDangerousEffects();
    }
  });

  window.addEventListener('pageshow',function(){
    if(!editOpen)clearDangerousEffects();
  });
})();