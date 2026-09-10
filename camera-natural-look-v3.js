/* K-Talk 카메라 기본 화질 보정 v3: 외모 형태는 자동으로 바꾸지 않고, 기존 1~100 보정 위에 노출·색감·선명도만 자연스럽게 더합니다. */
(function(){
  if(window.__ktCameraNaturalLookV3Installed)return;
  window.__ktCameraNaturalLookV3Installed=true;

  function clamp(v,min,max){v=Number(v);if(!isFinite(v))v=min;return Math.max(min,Math.min(max,v));}
  function strength(){try{return clamp(state.beautyStrength||68,1,100);}catch(e){return 68;}}

  function polishVideo(v){
    if(!v)return;
    try{
      var s=strength()/100;
      var extraBrightness=1.018+s*0.022;
      var extraContrast=1.010+s*0.015;
      var extraSaturation=1.010+s*0.022;
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
