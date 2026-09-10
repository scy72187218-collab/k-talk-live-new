/* K-Talk 카메라 기본 화질 보정 v3: 외모 형태는 자동으로 바꾸지 않고, 기존 1~100 보정 위에 노출·색감·선명도만 자연스럽게 더합니다. */
(function(){
  if(window.__ktCameraNaturalLookV3Installed)return;
  window.__ktCameraNaturalLookV3Installed=true;

  function clamp(v,min,max){v=Number(v);if(!isFinite(v))v=min;return Math.max(min,Math.min(max,v));}

  /* 이번 요청: 카메라를 켰을 때 기본값은 약하고 자연스럽게 시작. 1~100 수동 조절은 그대로 유지. */
  function applySoftDefault(){
    try{
      if(!window.state||state.__ktSoftDefaultApplied)return;
      state.beautyOn=true;
      state.beautyStrength=52;
      state.beautySkin=65;
      state.beautyWrinkle=55;
      state.beautyBright=55;
      state.beautySharp=50;
      state.beautyTone=52;
      state.beautyFace=50;
      state.beautyEyes=50;
      state.beautyNose=50;
      state.beautyMouth=50;
      state.beautyJaw=50;
      state.__ktSoftDefaultApplied=true;
    }catch(e){}
  }

  applySoftDefault();
  function strength(){try{return clamp(state.beautyStrength||52,1,100);}catch(e){return 52;}}

  function polishVideo(v){
    if(!v)return;
    try{
      var s=strength()/100;
      var extraBrightness=1.010+s*0.014;
      var extraContrast=1.006+s*0.010;
      var extraSaturation=1.006+s*0.014;
      var base=(v.style&&v.style.getPropertyValue('filter'))||'';
      if(!base||base==='none')base='';
      var suffix=' brightness('+extraBrightness.toFixed(3)+') contrast('+extraContrast.toFixed(3)+') saturate('+extraSaturation.toFixed(3)+')';
      v.style.setProperty('filter',(base+suffix).trim(),'important');
    }catch(e){}
  }

  function polishCreator(){
    polishVideo(document.getElementById('camera'));
    polishVideo(document.getElementById('cameraBg'));
  }

  function installWrap(){
    try{
      var old=window.applyBeautyPreview;
      if(typeof old!=='function'||old.__ktNaturalLookV3)return;
      var wrapped=function(){
        var r=old.apply(this,arguments);
        /* 기존 보정이 먼저 필터를 새로 계산한 뒤, 기본 카메라 톤만 한 번 추가 */
        polishCreator();
        return r;
      };
      wrapped.__ktNaturalLookV3=true;
      window.applyBeautyPreview=wrapped;
    }catch(e){}
  }

  function refresh(){
    applySoftDefault();
    installWrap();
    try{
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
      else polishCreator();
    }catch(e){polishCreator();}
  }

  try{
    var oldOpen=window.openCreator;
    if(typeof oldOpen==='function'){
      window.openCreator=async function(){var r=await oldOpen.apply(this,arguments);setTimeout(refresh,40);return r;};
    }
  }catch(e){}

  try{
    var oldStart=window.startBroadcast;
    if(typeof oldStart==='function'){
      window.startBroadcast=async function(){var r=await oldStart.apply(this,arguments);setTimeout(refresh,80);return r;};
    }
  }catch(e){}

  installWrap();
  setTimeout(refresh,0);
  setTimeout(refresh,250);
})();

/* 편집효과에 한국 남자/한국 여자 사진형 프리셋 2개만 추가 */
(function(){
  if(document.querySelector('script[data-kt-korean-face-presets]'))return;
  var s=document.createElement('script');
  s.src='korean-face-presets.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-korean-face-presets','1');
  document.head.appendChild(s);
})();

/* 기존 사진 프리셋은 유지하고 틱톡식 얼굴 추적 재미 효과를 추가 */
(function(){
  if(document.querySelector('script[data-kt-tiktok-face-effects]'))return;
  var s=document.createElement('script');
  s.src='tiktok-face-effects-upgrade.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-tiktok-face-effects','1');
  document.head.appendChild(s);
})();

/* 촬영 화면의 보정·얼굴효과·배경효과 버튼을 터치 한 번에 확실히 작동시킴 */
(function(){
  if(document.querySelector('script[data-kt-creator-effect-buttons-fix]'))return;
  var s=document.createElement('script');
  s.src='creator-effect-buttons-fix.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-creator-effect-buttons-fix','1');
  document.head.appendChild(s);
})();
