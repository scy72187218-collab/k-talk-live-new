/* K-Talk 편집효과 안전화 (2026-09-19)
   앞에 붙는 얼굴 장식/투명인간(인물 분리 배경) 기능 제거.
   편집효과를 눌렀다가 나와도 촬영 화면 버튼이 계속 작동하게 함.
   다른 방송방/게스트/채팅/관리자 기능은 건드리지 않음. */
(function(){
  if(window.__ktSafeEditEffects20260919)return;
  window.__ktSafeEditEffects20260919=true;

  var creator=document.getElementById('creator');
  var camera=document.getElementById('camera');
  var sheet=document.getElementById('sheet');

  function cleanupLegacy(){
    try{if(typeof window.ktStopFaceTrackingFor==='function')window.ktStopFaceTrackingFor('creator');}catch(e){}
    try{
      var layer=document.getElementById('ktFaceEffectLayer');
      if(layer)layer.remove();
    }catch(e){}
    try{
      if(typeof window.ktStopStageBackground==='function')window.ktStopStageBackground();
      else{
        if(window.state){state.stageBackground='';state.stageBackgroundUrl='';}
        var sc=document.getElementById('ktStageCanvas');
        if(sc)sc.remove();
      }
    }catch(e){}
    try{
      if(creator){
        creator.classList.remove('stage-bg-active');
        creator.removeAttribute('data-beauty-char');
      }
    }catch(e){}
    try{
      if(window.state){
        state.editSticker='';
        state.pendingEditEffect='off';
        state.appliedEditEffect='off';
      }
    }catch(e){}
  }

  function unlockCreator(){
    if(!creator)return;
    var q=[
      '.creator-top button',
      '.creator-tools button',
      '.creator-bottom button',
      '.creator-bottom .modes span',
      '.creator-bottom .creator-foot span'
    ].join(',');
    creator.querySelectorAll(q).forEach(function(el){
      try{
        if(el.disabled)el.disabled=false;
        if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
      }catch(e){}
    });
    try{
      var top=creator.querySelector('.creator-top');
      var tools=creator.querySelector('.creator-tools');
      var bottom=creator.querySelector('.creator-bottom');
      [top,tools,bottom].forEach(function(el){
        if(!el)return;
        el.style.setProperty('pointer-events','auto','important');
      });
    }catch(e){}
    try{
      if(typeof window.ktFixCreatorFourButtons==='function')window.ktFixCreatorFourButtons();
    }catch(e){}
  }

  function baseFilter(){
    if(!camera)return '';
    try{
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
    }catch(e){}
    try{return camera.style.getPropertyValue('filter')||'';}catch(e){return '';}
  }

  window.ktSafeSetEditEffect=function(name,btn){
    name=name||'none';
    cleanupLegacy();

    var f=baseFilter();
    if(name==='bright')f=(f+' brightness(1.08)').trim();
    else if(name==='warm')f=(f+' sepia(.12) saturate(1.08)').trim();
    else if(name==='clear')f=(f+' contrast(1.06) saturate(1.10)').trim();
    else if(name==='mono')f=(f+' grayscale(1)').trim();

    try{
      if(camera)camera.style.setProperty('filter',f,'important');
      if(window.state)state.ktSafeEditEffect=name;
    }catch(e){}

    document.querySelectorAll('.kt-safe-effect-btn').forEach(function(b){
      b.classList.toggle('on',b===btn);
    });
  };

  function closeSafe(){
    try{
      if(window.state)state.effectReturnBeauty=false;
      if(creator)creator.classList.remove('beauty-preview-open');
      var lp=creator&&creator.querySelector('.live-prep');
      if(lp)lp.style.removeProperty('display');
    }catch(e){}

    try{
      if(sheet){
        sheet.classList.remove('show','camera-effect-sheet','stage-effect-sheet');
        sheet.style.setProperty('pointer-events','none','important');
      }
      var body=document.getElementById('sheetBody');
      if(body)body.innerHTML='';
    }catch(e){}

    unlockCreator();
    setTimeout(unlockCreator,30);
    setTimeout(unlockCreator,180);
  }
  window.ktSafeCloseEditEffectPanel=closeSafe;

  window.openEditEffectPanel=function(){
    cleanupLegacy();
    if(!creator||!sheet)return;

    try{
      creator.classList.add('beauty-preview-open');
      var lp=creator.querySelector('.live-prep');
      if(lp)lp.style.setProperty('display','none','important');
      if(window.ensureLiveCamera)window.ensureLiveCamera((window.state&&state.cameraFacing)||'user').catch(function(){});
    }catch(e){}

    try{sheet.style.removeProperty('pointer-events');}catch(e){}

    var current=(window.state&&state.ktSafeEditEffect)||'none';
    var effects=[
      ['none','⊘','없음'],
      ['bright','☀','밝게'],
      ['warm','◐','따뜻하게'],
      ['clear','✦','선명하게'],
      ['mono','◑','흑백']
    ];
    var cards=effects.map(function(it){
      return '<button type="button" class="kt-safe-effect-btn '+(current===it[0]?'on':'')+'" onclick="ktSafeSetEditEffect(\''+it[0]+'\',this)"><b>'+it[1]+'</b><span>'+it[2]+'</span></button>';
    }).join('');

    var html='<div class="kt-safe-effect-panel">'
      +'<div class="kt-safe-effect-title">편집 효과</div>'
      +'<div class="kt-safe-effect-grid">'+cards+'</div>'
      +'<button type="button" class="kt-safe-effect-done" onclick="ktSafeCloseEditEffectPanel()">적용</button>'
      +'</div>';

    try{
      var title=document.getElementById('sheetTitle');
      var body=document.getElementById('sheetBody');
      if(title)title.textContent='편집 효과';
      if(body)body.innerHTML=html;
      sheet.classList.add('show','camera-effect-sheet','stage-effect-sheet');
    }catch(e){}
  };

  /* 예전 호출이 남아 있어도 앞에 붙는 장식/투명인간 기능은 실행하지 않음 */
  window.setEditEffect=function(name,el){
    var map={off:'none',heart:'warm',flower:'bright',sparkle:'clear',party:'clear'};
    return window.ktSafeSetEditEffect(map[name]||'none',el);
  };
  window.previewEditEffect=window.setEditEffect;
  window.applyEditEffect=window.setEditEffect;
  window.switchEditEffectTab=function(){window.openEditEffectPanel();};
  window.closeEditEffectPanel=closeSafe;

  if(!document.getElementById('ktSafeEditEffectsStyle20260919')){
    var st=document.createElement('style');
    st.id='ktSafeEditEffectsStyle20260919';
    st.textContent=`
#ktFaceEffectLayer,#ktStageCanvas{pointer-events:none!important}
.kt-safe-effect-panel{padding:8px 8px 10px;color:#fff}
.kt-safe-effect-title{font-size:14px;font-weight:950;text-align:center;margin:0 0 8px}
.kt-safe-effect-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.kt-safe-effect-btn{min-width:0;height:62px;border:1px solid rgba(255,255,255,.16);border-radius:13px;background:rgba(255,255,255,.07);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;touch-action:manipulation}
.kt-safe-effect-btn b{font-size:22px;line-height:1}.kt-safe-effect-btn span{font-size:9px;font-weight:900}
.kt-safe-effect-btn.on{border-color:#ff68c8;box-shadow:0 0 0 2px rgba(255,104,200,.18)}
.kt-safe-effect-done{width:100%;height:38px;margin-top:8px;border:0;border-radius:11px;background:#fff;color:#111;font-size:13px;font-weight:950;touch-action:manipulation}
`;
    document.head.appendChild(st);
  }

  /* 이전에 남아 있던 장식/투명 배경 흔적부터 제거 */
  cleanupLegacy();
  unlockCreator();
})();