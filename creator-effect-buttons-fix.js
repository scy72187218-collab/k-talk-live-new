/* K-Talk 촬영/보정/편집효과 버튼 터치 안정화. 다른 화면 기능은 건드리지 않음. */
(function(){
  if(window.__ktCreatorEffectButtonsFixInstalled)return;
  window.__ktCreatorEffectButtonsFixInstalled=true;

  function creatorOpen(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show'));
  }

  function applyFaceButton(btn){
    if(!btn)return;
    var name=btn.getAttribute('data-face-effect')||'';
    if(!name)return;
    try{
      if(/^real-/.test(name)&&typeof window.ktApplyRealLook==='function'){
        window.ktApplyRealLook(name,btn);return;
      }
      if(/^korean-/.test(name)&&typeof window.ktApplyKoreanFacePreset==='function'){
        window.ktApplyKoreanFacePreset(name,btn);return;
      }
      if(typeof window.setEditEffect==='function')window.setEditEffect(name,btn);
    }catch(e){}
  }

  function applyBeautyButton(btn){
    if(!btn)return;
    var kind=btn.getAttribute('data-beauty-kind')||'';
    if(!kind)return;
    try{if(typeof window.selectBeautyControl==='function')window.selectBeautyControl(kind);}catch(e){}
  }

  function applyStageButton(btn){
    if(!btn)return;
    var id=btn.getAttribute('data-stage-id')||'';
    if(!id)return;
    try{if(typeof window.selectStageBackground==='function')window.selectStageBackground(id);}catch(e){}
  }

  function intercept(e){
    if(!creatorOpen())return;
    var t=e.target;
    if(!t||!t.closest)return;

    var beauty=t.closest('#sheet.beauty-control-sheet .kt-beauty-controls-pro button[data-beauty-kind]');
    if(beauty){
      e.preventDefault();e.stopPropagation();
      applyBeautyButton(beauty);return;
    }

    var face=t.closest('#sheet.camera-effect-sheet .kt-face-effect-card[data-face-effect]');
    if(face){
      e.preventDefault();e.stopPropagation();
      applyFaceButton(face);return;
    }

    var stage=t.closest('#sheet.stage-effect-sheet .kt-stage-card[data-stage-id]');
    if(stage){
      e.preventDefault();e.stopPropagation();
      applyStageButton(stage);return;
    }
  }

  document.addEventListener('pointerup',intercept,true);

  document.addEventListener('input',function(e){
    if(!creatorOpen())return;
    var r=e.target;
    if(!r||r.id!=='beautySingleRange')return;
    try{if(typeof window.setBeautyActiveValue==='function')window.setBeautyActiveValue(r.value);}catch(err){}
  },true);

  if(!document.getElementById('ktCreatorEffectButtonsFixStyle')){
    var s=document.createElement('style');
    s.id='ktCreatorEffectButtonsFixStyle';
    s.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button,'
      +'#sheet.camera-effect-sheet .kt-face-effect-card,'
      +'#sheet.stage-effect-sheet .kt-stage-card{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important;position:relative!important;z-index:5!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{pointer-events:auto!important;touch-action:pan-x!important;position:relative!important;z-index:6!important}';
    document.head.appendChild(s);
  }
})();