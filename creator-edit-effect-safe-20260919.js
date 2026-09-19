/* K-Talk 편집효과 안전화 (2026-09-19)
   편집효과에서 얼굴 앞 장식/배경 분리(투명인간처럼 보이는 효과)를 사용하지 않는다.
   다른 방/게스트/채팅/방송/AI보정 로직은 변경하지 않음. */
(function(){
  if(window.__ktCreatorEditEffectSafe20260919)return;
  window.__ktCreatorEditEffectSafe20260919=true;

  var current='off';

  function creator(){return document.getElementById('creator');}
  function camera(){return document.getElementById('camera');}

  function hardClearLayers(){
    try{if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');}catch(e){}
    try{
      var face=document.getElementById('ktFaceEffectLayer');
      if(face&&face.parentNode)face.parentNode.removeChild(face);
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
    try{
      var c=creator();
      if(c)c.classList.remove('stage-bg-active','beauty-preview-open');
    }catch(e){}
    try{
      var stage=document.getElementById('ktStageCanvas');
      if(stage&&stage.parentNode)stage.parentNode.removeChild(stage);
      window.ktStageCanvas=null;
      window.ktStageBgImage=null;
    }catch(e){}
  }

  function appendSafeFilter(){
    var v=camera();
    if(!v)return;
    var base=String(v.style.getPropertyValue('filter')||'').trim();
    /* 이전 안전필터 꼬리 제거 */
    base=base.replace(/\s+(?:sepia\([^)]*\)|grayscale\([^)]*\)|hue-rotate\([^)]*\)|saturate\([^)]*\)|contrast\([^)]*\)){1,4}\s*$/,'').trim();

    var extra='';
    if(current==='warm')extra=' sepia(.12) saturate(1.06)';
    else if(current==='vivid')extra=' saturate(1.16) contrast(1.04)';
    else if(current==='mono')extra=' grayscale(1)';
    else if(current==='cool')extra=' hue-rotate(8deg) saturate(1.04)';

    if(!base){
      base='brightness(1.085) contrast(.975) saturate(1.035)';
    }
    v.style.setProperty('filter',(base+extra).trim(),'important');
    v.style.setProperty('-webkit-filter',(base+extra).trim(),'important');
  }

  var originalBeauty=typeof window.applyBeautyPreview==='function'?window.applyBeautyPreview:null;
  if(originalBeauty&&!originalBeauty.__ktSafeEditWrapped){
    var wrapped=function(){
      var r=originalBeauty.apply(this,arguments);
      setTimeout(appendSafeFilter,0);
      return r;
    };
    wrapped.__ktSafeEditWrapped=true;
    window.applyBeautyPreview=wrapped;
  }

  window.ktSetSafeEditEffect=function(name,el){
    current=name||'off';
    hardClearLayers();
    try{if(window.state)state.editFilter=current;}catch(e){}
    try{
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
      else appendSafeFilter();
    }catch(e){appendSafeFilter();}
    document.querySelectorAll('.kt-safe-edit-card').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-safe-effect')===current);
    });
  };

  function restoreCreatorTouch(){
    var c=creator();
    if(!c)return;
    try{
      c.classList.remove('beauty-preview-open');
      var lp=c.querySelector('.live-prep');
      if(lp)lp.style.removeProperty('display');
    }catch(e){}
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
    try{if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();}catch(e){}
  }

  window.ktCloseSafeEditEffect=function(){
    hardClearLayers();
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    try{
      var sh=document.getElementById('sheet');
      if(sh){
        sh.classList.remove('show','camera-effect-sheet','stage-effect-sheet');
        sh.style.removeProperty('pointer-events');
      }
    }catch(e){}
    restoreCreatorTouch();
    setTimeout(restoreCreatorTouch,60);
    setTimeout(restoreCreatorTouch,220);
    return false;
  };

  window.openEditEffectPanel=function(){
    hardClearLayers();
    restoreCreatorTouch();

    var html=''
      +'<div class="kt-safe-edit-panel">'
      +'<div class="kt-safe-edit-note"><b>편집 효과</b><span>얼굴 앞 장식과 투명 배경 효과는 제거했습니다.</span></div>'
      +'<div class="kt-safe-edit-grid">'
      +'<button type="button" class="kt-safe-edit-card '+(current==='off'?'on':'')+'" data-safe-effect="off" onclick="ktSetSafeEditEffect(\'off\',this)"><b>⊘</b><span>효과 없음</span></button>'
      +'<button type="button" class="kt-safe-edit-card '+(current==='warm'?'on':'')+'" data-safe-effect="warm" onclick="ktSetSafeEditEffect(\'warm\',this)"><b>☀</b><span>따뜻하게</span></button>'
      +'<button type="button" class="kt-safe-edit-card '+(current==='vivid'?'on':'')+'" data-safe-effect="vivid" onclick="ktSetSafeEditEffect(\'vivid\',this)"><b>✦</b><span>선명하게</span></button>'
      +'<button type="button" class="kt-safe-edit-card '+(current==='cool'?'on':'')+'" data-safe-effect="cool" onclick="ktSetSafeEditEffect(\'cool\',this)"><b>❄</b><span>차분하게</span></button>'
      +'<button type="button" class="kt-safe-edit-card '+(current==='mono'?'on':'')+'" data-safe-effect="mono" onclick="ktSetSafeEditEffect(\'mono\',this)"><b>◐</b><span>흑백</span></button>'
      +'</div>'
      +'<button type="button" class="kt-safe-edit-close" onclick="ktCloseSafeEditEffect()">적용하고 닫기</button>'
      +'</div>';

    if(typeof window.showSheet==='function'){
      window.showSheet('편집 효과',html);
      var sh=document.getElementById('sheet');
      if(sh){
        sh.classList.add('camera-effect-sheet');
        sh.classList.remove('stage-effect-sheet');
        sh.style.removeProperty('pointer-events');
      }
    }
  };

  /* 예전 얼굴/배경 효과가 다시 호출돼도 안전 효과만 유지 */
  window.ktApplyFaceEffect=function(){hardClearLayers();};
  window.previewEditEffect=function(){hardClearLayers();};
  window.setEditEffect=function(){hardClearLayers();};
  window.applyEditEffect=function(){hardClearLayers();};
  window.selectStageBackground=function(){hardClearLayers();};

  if(!document.getElementById('ktSafeEditEffectStyle')){
    var s=document.createElement('style');
    s.id='ktSafeEditEffectStyle';
    s.textContent=''
      +'.kt-safe-edit-panel{padding:14px 12px 18px;color:#fff}'
      +'.kt-safe-edit-note{padding:12px;border-radius:14px;background:#ffffff0d;border:1px solid #ffffff18}'
      +'.kt-safe-edit-note b{display:block;font-size:15px}.kt-safe-edit-note span{display:block;margin-top:4px;font-size:11px;color:#ccc}'
      +'.kt-safe-edit-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:12px}'
      +'.kt-safe-edit-card{min-height:72px;border-radius:14px;border:1px solid #ffffff1f;background:#ffffff0c;color:#fff;display:flex;align-items:center;gap:10px;padding:10px 12px;font-weight:900}'
      +'.kt-safe-edit-card b{font-size:24px}.kt-safe-edit-card span{font-size:12px}.kt-safe-edit-card.on{border-color:#ff5ca8;background:#ff5ca81a}'
      +'.kt-safe-edit-close{width:100%;height:48px;margin-top:12px;border:0;border-radius:14px;background:#ff416f;color:#fff;font-weight:950;font-size:14px}';
    document.head.appendChild(s);
  }

  hardClearLayers();
})();