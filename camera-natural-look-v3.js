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

/* 보정 변화가 바로 보이게 하고 보정창 높이만 줄이는 전용 보강 */
(function(){
  if(document.querySelector('script[data-kt-beauty-visible-fix]'))return;
  var s=document.createElement('script');
  s.src='beauty-visible-fix.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-beauty-visible-fix','1');
  document.head.appendChild(s);
})();

/* 보정으로 영상이 흐려지는 현상 제거 + 보정 버튼 터치 안정화 */
(function(){
  if(document.querySelector('script[data-kt-beauty-sharp-touch-fix]'))return;
  var s=document.createElement('script');
  s.src='beauty-sharp-touch-fix.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-beauty-sharp-touch-fix','1');
  document.head.appendChild(s);
})();

/* 보정 숫자 표시를 1~1000으로 확장. 실제 효과 엔진은 기존 안정 범위(1~100)에 비례 환산하여 유지. */
(function(){
  if(window.__ktBeautyRange1000Installed)return;
  window.__ktBeautyRange1000Installed=true;

  function clamp1000(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(1000,v));
  }
  function toInternal(v){
    return Math.max(1,Math.min(100,Math.round(clamp1000(v,500)/10)));
  }
  function toDisplay(v){
    v=Number(v);
    if(!isFinite(v)||v<=0)v=50;
    return clamp1000(Math.round(v*10),500);
  }
  function currentKind(){
    try{return (window.state&&state.beautyControl)||'skin';}catch(e){return 'skin';}
  }
  function store(){
    try{
      if(!window.state)return {};
      if(!state.ktBeauty1000)state.ktBeauty1000={};
      return state.ktBeauty1000;
    }catch(e){return {};}
  }
  function currentDisplay(kind){
    var bag=store();
    if(bag[kind])return clamp1000(bag[kind],500);
    try{
      if(window.getBeautyControlValue)return toDisplay(window.getBeautyControlValue(kind));
    }catch(e){}
    return 500;
  }

  window.ktSetBeauty1000=function(value){
    var kind=currentKind();
    var display=clamp1000(value,currentDisplay(kind));
    try{store()[kind]=display;}catch(e){}
    try{
      if(window.setBeautyValue)window.setBeautyValue(kind,toInternal(display));
    }catch(e){}
    var range=document.getElementById('beautySingleRange');
    var val=document.getElementById('beautySingleValue');
    if(range)range.value=display;
    if(val)val.textContent=display;
  };

  function syncRange(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var range=document.getElementById('beautySingleRange');
      var val=document.getElementById('beautySingleValue');
      var kind=currentKind();
      var display=currentDisplay(kind);
      if(range){
        range.min='1';
        range.max='1000';
        range.step='1';
        range.value=display;
        range.oninput=function(){window.ktSetBeauty1000(this.value);};
        range.onchange=function(){window.ktSetBeauty1000(this.value);};
      }
      if(val)val.textContent=display;
      var scale=sheet.querySelector('.kt-beauty-range-scale');
      if(scale){
        var spans=scale.querySelectorAll('span');
        if(spans[0])spans[0].textContent='1';
        if(spans[spans.length-1])spans[spans.length-1].textContent='1000';
        var strong=scale.querySelector('strong');
        if(strong)strong.textContent='1 ~ 1000 조절';
      }
      var note=sheet.querySelector('.kt-beauty-base-note');
      if(note)note.textContent='카메라 기본 보정 ON · 눈·코·입·턱 포함 항목별 1~1000 조절';
    }catch(e){}
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(syncRange,0);
      setTimeout(syncRange,60);
      return r;
    };
  }
  var oldSelectBeauty=window.selectBeautyControl;
  if(typeof oldSelectBeauty==='function'){
    window.selectBeautyControl=function(kind){
      var r=oldSelectBeauty.apply(this,arguments);
      setTimeout(syncRange,0);
      return r;
    };
  }
  var oldEdit=window.openEditEffectPanel;
  if(typeof oldEdit==='function'){
    window.openEditEffectPanel=function(){
      var r=oldEdit.apply(this,arguments);
      setTimeout(function(){
        try{
          var sheet=document.getElementById('sheet');
          if(!sheet)return;
          var span=sheet.querySelector('.kt-stage-title span');
          if(span)span.textContent=String(span.textContent||'').replace('보정 1~100','보정 1~1000');
        }catch(e){}
      },0);
      return r;
    };
  }
  setTimeout(syncRange,120);
})();
