/* K-Talk 촬영/보정/편집효과 버튼 터치 안정화. 다른 화면 기능은 건드리지 않음. */
(function(){
  if(window.__ktCreatorEffectButtonsFixInstalled)return;
  window.__ktCreatorEffectButtonsFixInstalled=true;

  var lastBtn=null,lastAt=0;
  function creatorOpen(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show'));
  }
  function mark(btn){lastBtn=btn;lastAt=Date.now();}
  function duplicate(btn){return btn===lastBtn&&(Date.now()-lastAt)<420;}

  function applyFaceButton(btn){
    if(!btn)return;
    var name=btn.getAttribute('data-face-effect')||'';
    if(!name)return;
    try{
      if(/^real-/.test(name)&&typeof window.ktApplyRealLook==='function'){
        window.ktApplyRealLook(name,btn);return;
      }
      if(typeof window.setEditEffect==='function')window.setEditEffect(name,btn);
    }catch(e){}
  }

  function applyKoreanButton(btn){
    if(!btn)return;
    var kind=btn.getAttribute('data-kt-kind')||'';
    if(kind!=='male'&&kind!=='female')return;
    try{if(typeof window.ktApplyKoreanPhotoPreset==='function')window.ktApplyKoreanPhotoPreset(kind,btn);}catch(e){}
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

  function route(e,isClick){
    if(!creatorOpen())return;
    var t=e.target;
    if(!t||!t.closest)return;

    var beauty=t.closest('#sheet.beauty-control-sheet .kt-beauty-controls-pro button[data-beauty-kind]');
    var korean=t.closest('#sheet.camera-effect-sheet .kt-korean-photo-card[data-kt-kind]');
    var face=t.closest('#sheet.camera-effect-sheet .kt-face-effect-card[data-face-effect]');
    var stage=t.closest('#sheet.stage-effect-sheet .kt-stage-card[data-stage-id]');
    var btn=beauty||korean||face||stage;
    if(!btn)return;

    if(isClick&&duplicate(btn)){
      e.preventDefault();e.stopImmediatePropagation();return;
    }
    e.preventDefault();e.stopImmediatePropagation();mark(btn);
    if(beauty)applyBeautyButton(beauty);
    else if(korean)applyKoreanButton(korean);
    else if(face)applyFaceButton(face);
    else if(stage)applyStageButton(stage);
  }

  document.addEventListener('pointerup',function(e){route(e,false);},true);
  document.addEventListener('click',function(e){route(e,true);},true);

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
      +'#sheet.beauty-control-sheet button,'
      +'#sheet.camera-effect-sheet button,'
      +'#sheet.stage-effect-sheet button{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important;position:relative!important;z-index:8!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button,'
      +'#sheet.camera-effect-sheet .kt-face-effect-card,'
      +'#sheet.stage-effect-sheet .kt-stage-card{min-width:0!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{pointer-events:auto!important;touch-action:pan-x!important;position:relative!important;z-index:9!important}';
    document.head.appendChild(s);
  }
})();