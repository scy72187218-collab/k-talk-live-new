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

/* 촬영/라이브 준비 화면의 ↻ 버튼: 앞카메라 ↔ 뒷카메라 실제 전환만 담당 */
(function(){
  if(window.__ktCreatorCameraFlipInstalled)return;
  window.__ktCreatorCameraFlipInstalled=true;
  var flipBusy=false;

  function syncMirror(){
    var rear=false;
    try{rear=!!(window.state&&state.cameraFacing==='environment');}catch(e){}
    ['camera','cameraBg'].forEach(function(id){
      var v=document.getElementById(id);
      if(!v)return;
      var current=(v.style&&v.style.getPropertyValue('transform'))||'';
      var scale='';
      var m=current.match(/scale\(([^)]+)\)/);
      if(m&&m[1])scale=' scale('+m[1]+')';
      v.style.setProperty('transform',(rear?'scaleX(1)':'scaleX(-1)')+scale,'important');
    });
    var btn=document.querySelector('#creator .creator-rotate');
    if(btn){
      btn.title=rear?'앞카메라로 전환':'뒷카메라로 전환';
      btn.setAttribute('aria-label',rear?'앞카메라로 전환':'뒷카메라로 전환');
    }
  }

  var previousBeauty=window.applyBeautyPreview;
  if(typeof previousBeauty==='function'&&!previousBeauty.__ktCameraMirrorAware){
    var mirrorAware=function(){
      var r=previousBeauty.apply(this,arguments);
      syncMirror();
      return r;
    };
    mirrorAware.__ktCameraMirrorAware=true;
    window.applyBeautyPreview=mirrorAware;
  }

  window.toggleCreatorCamera=async function(){
    if(flipBusy)return;
    try{
      if(window.ktCreatorRecording){
        alert('촬영 중에는 중지한 뒤 카메라를 전환해 주세요.');
        return;
      }
    }catch(e){}
    flipBusy=true;
    try{
      var next='environment';
      try{next=(window.state&&state.cameraFacing==='environment')?'user':'environment';}catch(e){}
      try{
        if(window.state&&state.stream&&state.stream.getTracks){
          state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
          state.stream=null;
        }
      }catch(e){}
      ['camera','cameraBg'].forEach(function(id){var v=document.getElementById(id);if(v)try{v.srcObject=null;}catch(e){}});
      try{if(window.state)state.cameraFacing=next;}catch(e){}
      if(typeof window.ensureLiveCamera==='function')await window.ensureLiveCamera(next);
      syncMirror();
    }catch(e){}
    flipBusy=false;
  };

  var previousPrepTap=window.prepTap;
  if(typeof previousPrepTap==='function'&&!previousPrepTap.__ktCameraFlipPrep){
    var prepWrapped=async function(el,name){
      if(name==='전환'){
        if(el){el.classList.add('test-active');setTimeout(function(){el.classList.remove('test-active');},180);}
        await window.toggleCreatorCamera();
        return;
      }
      return previousPrepTap.apply(this,arguments);
    };
    prepWrapped.__ktCameraFlipPrep=true;
    window.prepTap=prepWrapped;
  }

  setTimeout(syncMirror,0);
})();

/* 혜택 화면에 성인 방송 이용 기준만 추가. 성인 인증 방송 기준이며 다른 혜택은 변경하지 않음. */
(function(){
  if(window.__ktBenefitAdultRulesInstalled)return;
  window.__ktBenefitAdultRulesInstalled=true;

  function addRules(){
    var body=document.getElementById('sheetBody');
    if(!body||document.getElementById('ktAdultBroadcastRules'))return;
    var title=((document.getElementById('sheetTitle')||{}).textContent||'');
    if(title.indexOf('혜택')<0&&title.indexOf('이용방법')<0)return;
    var box=document.createElement('div');
    box.id='ktAdultBroadcastRules';
    box.className='rowbox';
    box.style.cssText='margin-top:10px;border:1px solid rgba(255,120,170,.30);background:rgba(255,70,120,.08)';
    box.innerHTML='<b>🔞 성인 인증 방송 이용 기준</b><br>'
      +'술·담배 장면은 성인 인증된 방송에서만 허용합니다.<br>'
      +'의상·노출은 남성 상체 가슴까지, 여성은 일반 브라·수영복 수준까지만 허용하며 그 이상 노출은 금지합니다.<br>'
      +'🚗 차량 운행 중 촬영·휴대폰 조작은 금지하고, 안전한 곳에 완전히 주차한 뒤에만 카메라 전환·촬영을 이용합니다.';
    body.appendChild(box);
  }

  var oldBenefit=window.openBenefitHub;
  if(typeof oldBenefit==='function')window.openBenefitHub=function(){var r=oldBenefit.apply(this,arguments);setTimeout(addRules,0);return r;};
  var oldGuide=window.openSiteGuide;
  if(typeof oldGuide==='function')window.openSiteGuide=function(){var r=oldGuide.apply(this,arguments);setTimeout(addRules,0);return r;};
})();

/* 촬영 화면 AI 보정·편집효과 두 버튼의 중심선과 간격만 정리. */
(function(){
  if(window.__ktCreatorTextToolCenterInstalled)return;
  window.__ktCreatorTextToolCenterInstalled=true;
  var s=document.createElement('style');
  s.id='ktCreatorTextToolCenterStyle';
  s.textContent=''
    +'#creator .creator-tools>button.creator-tool-text{width:52px!important;height:52px!important;min-width:52px!important;min-height:52px!important;max-width:52px!important;max-height:52px!important;margin:0!important;padding:0!important;align-self:center!important;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;box-sizing:border-box!important}'
    +'#creator .creator-tools>button.creator-tool-text b{display:block!important;margin:0!important;padding:0!important;font-size:18px!important;line-height:18px!important;text-align:center!important}'
    +'#creator .creator-tools>button.creator-tool-text small{display:block!important;margin:2px 0 0!important;padding:0!important;width:100%!important;font-size:8px!important;line-height:9px!important;font-weight:900!important;text-align:center!important;white-space:nowrap!important}';
  document.head.appendChild(s);
})();