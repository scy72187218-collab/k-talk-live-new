/* K-Talk 카메라 보정 전용: 기본 자연 보정 + 항목별 1~100. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyNaturalUpgradeInstalled)return;
  window.__ktBeautyNaturalUpgradeInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function applyDefaults(){
    try{
      state.beautyOn=true;
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('beauty-on');
      /* 기본은 얼굴이 달라 보이지 않게 아주 자연스럽게 */
      if(!state.__ktBeautyNaturalDefaultsV3){
        state.beautyStrength=28;
        state.beautySkin=48;
        state.beautyWrinkle=45;
        state.beautyBright=52;
        state.beautySharp=50;
        state.beautyTone=50;
        state.beautyFace=50;
        state.beautyEyes=50;
        state.beautyNose=50;
        state.beautyMouth=50;
        state.beautyJaw=50;
        state.__ktBeautyNaturalDefaultsV3=true;
      }
    }catch(e){}
  }

  function clearDecorativeFaceEffect(){
    try{
      if(typeof window.clearAllFaceEffects==='function')window.clearAllFaceEffects();
      else{
        var layer=document.getElementById('ktFaceEffectLayer');
        if(layer)layer.remove();
        if(window.state){
          state.editSticker='';
          state.pendingEditEffect='off';
          state.appliedEditEffect='off';
        }
      }
    }catch(e){}
  }

  var oldInfo=window.getBeautyControlInfo;
  if(typeof oldInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='strength')return {label:'전체 보정',key:'beautyStrength',def:28};
      if(kind==='wrinkle')return {label:'주름 완화',key:'beautyWrinkle',def:45};
      if(kind==='mouth')return {label:'입 조절',key:'beautyMouth',def:50};
      if(kind==='jaw')return {label:'턱선 조절',key:'beautyJaw',def:50};
      return oldInfo.apply(this,arguments);
    };
  }

  var oldSet=window.setBeautyValue;
  if(typeof oldSet==='function'){
    window.setBeautyValue=function(kind,value){
      value=clamp(value,50);
      try{
        if(kind==='strength')state.beautyStrength=value;
        else if(kind==='wrinkle')state.beautyWrinkle=value;
        else if(kind==='jaw')state.beautyJaw=value;
        else return oldSet.apply(this,arguments);
        if(window.applyBeautyPreview)window.applyBeautyPreview();
        var val=document.getElementById('beautySingleValue');
        if(val)val.textContent=value;
      }catch(e){}
    };
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'){
    window.applyBeautyPreview=function(){
      applyDefaults();
      try{oldApply.apply(this,arguments);}catch(e){}
      try{
        var strength=clamp(state.beautyStrength,28)/100;
        var skin=clamp(state.beautySkin,48)/100;
        var wrinkle=clamp(state.beautyWrinkle,45)/100;
        var bright=clamp(state.beautyBright,52);
        var sharp=clamp(state.beautySharp,50);
        var tone=clamp(state.beautyTone,50);
        var face=clamp(state.beautyFace,50);
        var jaw=clamp(state.beautyJaw,50);

        /* 기본 얼굴은 그대로 두고 피부/밝기만 아주 약하게 정리 */
        var brightness=1.00 + strength*.012 + (bright-50)*.0006;
        var saturation=1.00 + (tone-50)*.0004;
        var contrast=1.00 + (sharp-50)*.00025;
        var blur=.02 + skin*.22 + wrinkle*.07;
        var scale=1 + (face-50)*.00015 + (50-jaw)*.00008;
        var filter='brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px)';

        ['camera','cameraBg'].forEach(function(id){
          var cam=document.getElementById(id);
          if(!cam)return;
          cam.style.setProperty('filter',filter,'important');
          cam.style.setProperty('transform','scaleX(-1) scale('+scale.toFixed(3)+')','important');
        });
      }catch(e){}
    };
  }

  function addButton(controls,kind,icon,label,before){
    if(!controls||controls.querySelector('[data-beauty-kind="'+kind+'"]'))return;
    var b=document.createElement('button');
    b.setAttribute('data-beauty-kind',kind);
    b.innerHTML='<b>'+icon+'</b><span>'+label+'</span><i></i>';
    b.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl(kind);};
    if(before&&before.parentNode===controls)controls.insertBefore(b,before);else controls.appendChild(b);
  }

  function decorate(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var controls=sheet.querySelector('.kt-beauty-controls-pro');
      if(controls){
        addButton(controls,'strength','✨','전체',controls.firstChild);
        addButton(controls,'wrinkle','〰','주름');
        var mouth=controls.querySelector('[data-beauty-kind="mouth"]');
        if(mouth)mouth.innerHTML='<b>👄</b><span>입</span><i></i>';
        addButton(controls,'jaw','⌄','턱');
      }

      var group=sheet.querySelector('.kt-beauty-single-group');
      if(group){
        group.style.setProperty('display','block','important');
        group.style.setProperty('visibility','visible','important');
        group.style.setProperty('opacity','1','important');
        var range=group.querySelector('#beautySingleRange');
        if(range){range.min='1';range.max='100';range.style.setProperty('width','100%','important');}
        if(!group.querySelector('.kt-beauty-range-scale')){
          var scale=document.createElement('div');
          scale.className='kt-beauty-range-scale';
          scale.innerHTML='<span>1</span><strong>1 ~ 100 조절</strong><span>100</span>';
          group.appendChild(scale);
        }
      }

      var pro=sheet.querySelector('.kt-beauty-pro');
      if(pro&&!pro.querySelector('.kt-beauty-base-note')){
        var note=document.createElement('div');
        note.className='kt-beauty-base-note';
        note.textContent='기본 자연 보정 ON · 얼굴은 그대로 두고 항목별 1~100 조절';
        pro.insertBefore(note,pro.firstChild);
      }

      var kind=(window.state&&state.beautyControl)||'strength';
      var info=window.getBeautyControlInfo?window.getBeautyControlInfo(kind):null;
      var value=window.getBeautyControlValue?window.getBeautyControlValue(kind):50;
      if(kind==='strength')value=clamp(state.beautyStrength,28);
      if(kind==='wrinkle')value=clamp(state.beautyWrinkle,45);
      if(kind==='jaw')value=clamp(state.beautyJaw,50);
      var label=document.getElementById('beautySingleLabel');
      var rangeEl=document.getElementById('beautySingleRange');
      var valEl=document.getElementById('beautySingleValue');
      if(label&&info)label.textContent=info.label;
      if(rangeEl)rangeEl.value=value;
      if(valEl)valEl.textContent=value;
    }catch(e){}
  }

  if(!document.getElementById('ktBeautyNaturalUpgradeStyle')){
    var st=document.createElement('style');
    st.id='ktBeautyNaturalUpgradeStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button{min-height:56px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-single-group{display:block!important;visibility:visible!important;opacity:1!important;margin-top:9px!important;padding:10px!important;border-radius:14px!important;background:rgba(255,255,255,.07)!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{display:block!important;width:100%!important}'
      +'#sheet.beauty-control-sheet #beautySingleValue{display:inline-flex!important;min-width:38px!important;justify-content:center!important;font-size:18px!important;font-weight:950!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale{display:flex!important;justify-content:space-between!important;margin-top:5px!important;font-size:11px!important;color:#ddd!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale strong{font-size:12px!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-base-note{margin:0 0 7px!important;padding:7px 9px!important;border-radius:10px!important;background:rgba(128,70,255,.16)!important;color:#fff!important;font-size:11px!important;font-weight:850!important;text-align:center!important}';
    document.head.appendChild(st);
  }

  var oldOpen=window.openBeautyPanel;
  if(typeof oldOpen==='function')window.openBeautyPanel=function(){
    applyDefaults();
    clearDecorativeFaceEffect();
    var r=oldOpen.apply(this,arguments);
    setTimeout(decorate,0);
    setTimeout(function(){try{window.applyBeautyPreview();}catch(e){}},20);
    return r;
  };

  var oldSelect=window.selectBeautyControl;
  if(typeof oldSelect==='function')window.selectBeautyControl=function(kind){var r=oldSelect.apply(this,arguments);setTimeout(decorate,0);return r;};

  var oldReset=window.resetBeautyAll;
  if(typeof oldReset==='function')window.resetBeautyAll=function(){
    var r=oldReset.apply(this,arguments);
    try{state.__ktBeautyNaturalDefaultsV3=false;}catch(e){}
    applyDefaults();
    clearDecorativeFaceEffect();
    try{window.applyBeautyPreview();}catch(e){}
    setTimeout(decorate,0);
    return r;
  };

  var oldOpenCreator=window.openCreator;
  if(typeof oldOpenCreator==='function')window.openCreator=async function(){
    var r=await oldOpenCreator.apply(this,arguments);
    applyDefaults();
    clearDecorativeFaceEffect();
    try{window.applyBeautyPreview();}catch(e){}
    return r;
  };

  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function')window.ensureLiveCamera=async function(){var r=await oldEnsure.apply(this,arguments);applyDefaults();try{window.applyBeautyPreview();}catch(e){}return r;};

  applyDefaults();
  setTimeout(function(){try{window.applyBeautyPreview();}catch(e){}},0);
})();

/* 숏폼 얼굴 효과는 별도 선택일 때만 사용 */
(function(){
  if(document.querySelector('script[data-kt-shortform-face-effects]'))return;
  var s=document.createElement('script');
  s.src='face-effects-shortform.js?v=20260909b';
  s.async=false;
  s.setAttribute('data-kt-shortform-face-effects','1');
  document.head.appendChild(s);
})();
