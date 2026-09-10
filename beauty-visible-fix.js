/* K-Talk 보정 전용 보강: 보정 변화가 눈에 보이게 하고, 보정창 높이만 줄임. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyVisibleFixInstalled)return;
  window.__ktBeautyVisibleFixInstalled=true;

  function clamp(v,d){
    v=Number(v);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  /* 카메라를 열었을 때 기본적으로 강한 동안 느낌이 보이도록 시작값만 올린다. */
  function strongDefaults(){
    try{
      if(!window.state||state.__ktBeautyVisibleDefaultApplied)return;
      state.beautyOn=true;
      state.beautyStrength=90;
      state.beautySkin=96;
      state.beautyWrinkle=94;
      state.beautyBright=80;
      state.beautySharp=46;
      state.beautyTone=60;
      state.beautyFace=54;
      state.beautyEyes=58;
      state.beautyNose=50;
      state.beautyMouth=56;
      state.beautyJaw=48;
      state.__ktBeautyVisibleDefaultApplied=true;
    }catch(e){}
  }

  /* 기존 보정값을 사용하되, 1~100을 움직였을 때 변화가 바로 보이도록 최종 화면 필터를 분명하게 적용한다. */
  function applyVisibleBeauty(){
    strongDefaults();
    try{
      if(!window.state)return;
      var strength=clamp(state.beautyStrength,90)/100;
      var skin=clamp(state.beautySkin,96)/100;
      var wrinkle=clamp(state.beautyWrinkle,94)/100;
      var bright=clamp(state.beautyBright,80);
      var sharp=clamp(state.beautySharp,46);
      var tone=clamp(state.beautyTone,60);
      var eyes=clamp(state.beautyEyes,58);
      var nose=clamp(state.beautyNose,50);
      var mouth=clamp(state.beautyMouth,56);
      var face=clamp(state.beautyFace,54);
      var jaw=clamp(state.beautyJaw,48);

      var brightness=1.035 + strength*.090 + (bright-50)*.00155 + (eyes-50)*.00110;
      var saturation=1.010 + strength*.055 + (tone-50)*.00115 + (mouth-50)*.00155;
      var contrast=1.015 - strength*.085 + (sharp-50)*.00105 + (nose-50)*.00120;
      var blur=.10 + skin*.38 + wrinkle*.28;
      var sepia=Math.max(0,(tone-50)*.00115);
      var scale=1 + (face-50)*.0015 + (50-jaw)*.0008;

      var filter='brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')';
      ['camera','cameraBg'].forEach(function(id){
        var v=document.getElementById(id);
        if(!v)return;
        v.style.setProperty('filter',filter,'important');
        v.style.setProperty('transform','scaleX(-1) scale('+scale.toFixed(3)+')','important');
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

  /* 보정창이 얼굴을 너무 가리지 않도록 세로 높이와 버튼만 줄인다. */
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

  /* 현재 열린 보정창/카메라에도 즉시 반영. */
  strongDefaults();
  setTimeout(function(){try{if(window.applyBeautyPreview)window.applyBeautyPreview();else applyVisibleBeauty();}catch(e){}},40);
})();