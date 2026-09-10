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

  /* 기본은 중간 정도로 시작하고, 100까지 올렸을 때 차이가 크게 남도록 범위를 확보한다. */
  function strongDefaults(){
    try{
      if(!window.state||state.__ktBeautyVisibleDefaultApplied)return;
      state.beautyOn=true;
      state.beautyStrength=68;
      state.beautySkin=72;
      state.beautyWrinkle=68;
      state.beautyBright=62;
      state.beautySharp=52;
      state.beautyTone=56;
      state.beautyFace=52;
      state.beautyEyes=54;
      state.beautyNose=50;
      state.beautyMouth=54;
      state.beautyJaw=50;
      state.__ktBeautyVisibleDefaultApplied=true;
    }catch(e){}
  }

  /* 1은 거의 원본, 100은 강한 보정이 되도록 최종 필터 범위를 크게 잡는다. */
  function applyVisibleBeauty(){
    strongDefaults();
    try{
      if(!window.state)return;
      var strength=norm(state.beautyStrength,68);
      var skin=norm(state.beautySkin,72);
      var wrinkle=norm(state.beautyWrinkle,68);
      var bright=norm(state.beautyBright,62);
      var sharp=norm(state.beautySharp,52);
      var tone=norm(state.beautyTone,56);
      var eyes=norm(state.beautyEyes,54);
      var nose=norm(state.beautyNose,50);
      var mouth=norm(state.beautyMouth,54);
      var face=norm(state.beautyFace,52);
      var jaw=norm(state.beautyJaw,50);

      var brightness=.985 + strength*.105 + bright*.105 + (eyes-.5)*.070;
      var saturation=.970 + strength*.070 + tone*.095 + (mouth-.5)*.120;
      var contrast=1.045 - skin*.075 - wrinkle*.070 + (sharp-.5)*.180 + (nose-.5)*.100;
      var blur=.02 + skin*.72 + wrinkle*.54;
      var sepia=Math.max(0,(tone-.45)*.050);
      var scale=1 + (face-.5)*.055 - (jaw-.5)*.018;

      brightness=Math.max(.90,Math.min(1.25,brightness));
      saturation=Math.max(.88,Math.min(1.24,saturation));
      contrast=Math.max(.78,Math.min(1.20,contrast));
      blur=Math.max(0,Math.min(1.35,blur));
      scale=Math.max(.965,Math.min(1.055,scale));

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

  /* 어떤 보정 슬라이더를 움직여도 기존 값 변경 직후 최종 화면을 다시 계산한다. */
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

  /* 보정창이 얼굴을 너무 가리지 않도록 기존 컴팩트 크기를 그대로 유지한다. */
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