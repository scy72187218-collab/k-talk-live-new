/* K-Talk 보정 전용 보강: 1~100 변화가 화면에서 분명히 보이게 하고, 보정창 크기만 유지. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyVisibleFixInstalled)return;
  window.__ktBeautyVisibleFixInstalled=true;

  function clamp(v,d){
    v=Number(v);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }
  function norm(v,d){return (clamp(v,d)-1)/99;}

  /* 카메라를 켜면 처음부터 확실히 보정된 느낌으로 시작한다. */
  function strongDefaults(){
    try{
      if(!window.state||state.__ktBeautyVisibleDefaultApplied)return;
      state.beautyOn=true;
      state.beautyStrength=92;
      state.beautySkin=94;
      state.beautyWrinkle=96;
      state.beautyBright=80;
      state.beautySharp=42;
      state.beautyTone=72;
      state.beautyFace=68;
      state.beautyEyes=72;
      state.beautyNose=60;
      state.beautyMouth=64;
      state.beautyJaw=66;
      state.__ktBeautyVisibleDefaultApplied=true;
    }catch(e){}
  }

  /* 1은 거의 원본, 100은 매우 강한 보정이 되도록 최종 필터 범위를 크게 잡는다. */
  function applyVisibleBeauty(){
    strongDefaults();
    try{
      if(!window.state)return;
      var strength=norm(state.beautyStrength,92);
      var skin=norm(state.beautySkin,94);
      var wrinkle=norm(state.beautyWrinkle,96);
      var bright=norm(state.beautyBright,80);
      var sharp=norm(state.beautySharp,42);
      var tone=norm(state.beautyTone,72);
      var eyes=norm(state.beautyEyes,72);
      var nose=norm(state.beautyNose,60);
      var mouth=norm(state.beautyMouth,64);
      var face=norm(state.beautyFace,68);
      var jaw=norm(state.beautyJaw,66);

      var brightness=.995 + strength*.125 + bright*.120 + (eyes-.5)*.085;
      var saturation=.965 + strength*.085 + tone*.115 + (mouth-.5)*.135;
      var contrast=1.025 - skin*.105 - wrinkle*.095 + (sharp-.5)*.155 + (nose-.5)*.090;
      var blur=.05 + skin*1.10 + wrinkle*.88;
      var sepia=Math.max(0,(tone-.42)*.060);
      var scale=1 + (face-.5)*.075 - (jaw-.5)*.024;

      brightness=Math.max(.90,Math.min(1.34,brightness));
      saturation=Math.max(.86,Math.min(1.32,saturation));
      contrast=Math.max(.70,Math.min(1.20,contrast));
      blur=Math.max(0,Math.min(2.10,blur));
      scale=Math.max(.955,Math.min(1.075,scale));

      var filter='brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')';
      ['camera','cameraBg'].forEach(function(id){
        var v=document.getElementById(id);
        if(!v)return;
        v.style.setProperty('filter',filter,'important');
        v.style.setProperty('-webkit-filter',filter,'important');
        var rear=false;
        try{rear=!!(window.state&&state.cameraFacing==='environment');}catch(e){}
        v.style.setProperty('transform',(rear?'scaleX(1)':'scaleX(-1)')+' scale('+scale.toFixed(3)+')','important');
      });
    }catch(e){}
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'&&!oldApply.__ktBeautyVisibleWrapped){
    var wrappedApply=function(){
      var r;
      try{r=oldApply.apply(this,arguments);}catch(e){}
      applyVisibleBeauty();
      return r;
    };
    wrappedApply.__ktBeautyVisibleWrapped=true;
    window.applyBeautyPreview=wrappedApply;
  }else if(typeof oldApply!=='function'){
    window.applyBeautyPreview=applyVisibleBeauty;
  }

  document.addEventListener('input',function(e){
    var el=e.target;
    if(!el||el.type!=='range')return;
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('beauty-control-sheet')||!sheet.contains(el))return;
    setTimeout(function(){try{applyVisibleBeauty();}catch(err){}},0);
  },true);
  document.addEventListener('change',function(e){
    var el=e.target;
    if(!el||el.type!=='range')return;
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('beauty-control-sheet')||!sheet.contains(el))return;
    setTimeout(function(){try{applyVisibleBeauty();}catch(err){}},0);
  },true);

  if(!document.getElementById('ktBeautyVisibleCompactStyle')){
    var st=document.createElement('style');
    st.id='ktBeautyVisibleCompactStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .sheet-inner{max-height:29dvh!important;width:calc(100% - 24px)!important;padding:6px 8px 8px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-pro-tabs{height:34px!important;margin:0 0 4px!important;padding:0 2px 2px!important;font-size:10px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-pro-tabs b{height:31px!important;font-size:12px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:3px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button{min-height:46px!important;padding:2px 1px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button b{width:30px!important;height:30px!important;margin:0 auto 2px!important;font-size:16px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button span{font-size:9px!important;line-height:1!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-base-note{display:none!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-single-group{margin:3px 0!important;padding:5px 7px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-slider-row{min-height:31px!important;grid-template-columns:72px minmax(0,1fr) 28px!important;gap:5px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-slider-row span{font-size:9px!important}'
      +'#sheet.beauty-control-sheet #beautySingleValue{font-size:14px!important;min-width:28px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale{display:none!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-pro-actions{margin-top:3px!important;gap:5px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-pro-actions button{min-height:32px!important;font-size:12px!important}'
      +'@media(max-width:390px){#sheet.beauty-control-sheet .sheet-inner{max-height:30dvh!important;width:calc(100% - 18px)!important}}';
    document.head.appendChild(st);
  }

  strongDefaults();
  setTimeout(function(){try{if(window.applyBeautyPreview)window.applyBeautyPreview();else applyVisibleBeauty();}catch(e){}},40);
})();

/* AI 보정과 편집 효과 두 화면에 각각 보이는 나가기 화살표를 표시한다. */
(function(){
  if(window.__ktPanelBackArrowVisibleFixInstalled)return;
  window.__ktPanelBackArrowVisibleFixInstalled=true;

  var style=document.createElement('style');
  style.id='ktPanelBackArrowVisibleFixStyle';
  style.textContent=''
    +'#sheet.camera-effect-sheet.beauty-control-sheet .sheet-head,'
    +'#sheet.camera-effect-sheet.stage-effect-sheet .sheet-head{display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:40px!important;padding:0 2px 6px!important}'
    +'#sheet.camera-effect-sheet.beauty-control-sheet .sheet-head button,'
    +'#sheet.camera-effect-sheet.stage-effect-sheet .sheet-head button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:78px!important;height:36px!important;padding:0 10px!important;border-radius:12px!important;background:rgba(255,255,255,.12)!important;color:#fff!important;font-size:13px!important;font-weight:950!important;white-space:nowrap!important;pointer-events:auto!important;touch-action:manipulation!important;z-index:30!important}'
    +'#sheet.camera-effect-sheet.beauty-control-sheet .sheet-head h3,'
    +'#sheet.camera-effect-sheet.stage-effect-sheet .sheet-head h3{display:block!important;margin:0!important;font-size:13px!important;color:#fff!important;opacity:.88!important}';
  document.head.appendChild(style);

  function fixArrow(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('show'))return;
      var beauty=sheet.classList.contains('beauty-control-sheet');
      var edit=sheet.classList.contains('stage-effect-sheet')||sheet.classList.contains('camera-effect-sheet');
      if(!beauty&&!edit)return;
      var head=sheet.querySelector('.sheet-head');
      if(!head)return;
      var btn=head.querySelector('button');
      if(!btn)return;
      btn.type='button';
      btn.textContent='← 나가기';
      btn.setAttribute('aria-label',beauty?'AI 보정 나가기':'편집 효과 나가기');
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        try{if(window.closeSheet)window.closeSheet();}catch(err){}
      };
    }catch(e){}
  }

  var sheet=document.getElementById('sheet');
  if(sheet&&window.MutationObserver){
    try{new MutationObserver(function(){fixArrow();}).observe(sheet,{attributes:true,childList:true,subtree:true});}catch(e){}
  }
  document.addEventListener('click',function(){setTimeout(fixArrow,0);},true);
  setTimeout(fixArrow,0);
})();