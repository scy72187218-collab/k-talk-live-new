/* K-Talk 카메라 기본 화질 보정 v3: 외모 형태는 자동으로 바꾸지 않고, 기존 1~100 보정 위에 노출·색감·선명도만 자연스럽게 더합니다. */
(function(){
  if(window.__ktCameraNaturalLookV3Installed)return;
  window.__ktCameraNaturalLookV3Installed=true;

  function clamp(v,min,max){v=Number(v);if(!isFinite(v))v=min;return Math.max(min,Math.min(max,v));}

  /* 카메라를 켰을 때 기본값은 자연스럽게 시작. 눈·코·입·턱 수동 조절은 그대로 유지. */
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
      if(!(Number(state.beautyMakeup)>0))state.beautyMakeup=42;
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

/* 화장 강도 1~100 추가. 1은 거의 원본, 100은 진한 톤. */
(function(){
  if(window.__ktMakeupBeautyInstalled)return;
  window.__ktMakeupBeautyInstalled=true;

  function clamp100(v,d){v=parseInt(v,10);if(!isFinite(v))v=d;return Math.max(1,Math.min(100,v));}

  try{if(window.state&&!(Number(state.beautyMakeup)>0))state.beautyMakeup=42;}catch(e){}

  var oldInfo=window.getBeautyControlInfo;
  if(typeof oldInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='makeup')return {label:'화장 강도',key:'beautyMakeup',def:42};
      return oldInfo.apply(this,arguments);
    };
  }

  var oldSet=window.setBeautyValue;
  if(typeof oldSet==='function'){
    window.setBeautyValue=function(kind,value){
      if(kind==='makeup'){
        try{state.beautyMakeup=clamp100(value,42);}catch(e){}
        try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
        var val=document.getElementById('beautySingleValue');
        if(val)val.textContent=clamp100(value,42);
        return;
      }
      return oldSet.apply(this,arguments);
    };
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'&&!oldApply.__ktMakeupWrapped){
    var wrapped=function(){
      var r=oldApply.apply(this,arguments);
      try{
        var m=clamp100((window.state&&state.beautyMakeup)||42,42);
        var t=(m-1)/99;
        var bright=1.000+t*.035;
        var sat=1.000+t*.16;
        var con=1.000+t*.025;
        var sep=t*.025;
        ['camera','cameraBg'].forEach(function(id){
          var v=document.getElementById(id);if(!v)return;
          var base=(v.style&&v.style.getPropertyValue('filter'))||'';
          if(!base||base==='none')base='';
          var extra=' brightness('+bright.toFixed(3)+') saturate('+sat.toFixed(3)+') contrast('+con.toFixed(3)+') sepia('+sep.toFixed(3)+')';
          v.style.setProperty('filter',(base+extra).trim(),'important');
        });
      }catch(e){}
      return r;
    };
    wrapped.__ktMakeupWrapped=true;
    window.applyBeautyPreview=wrapped;
  }

  function decorate(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var controls=sheet.querySelector('.kt-beauty-controls-pro');
      if(controls&&!controls.querySelector('[data-beauty-kind="makeup"]')){
        var b=document.createElement('button');
        b.setAttribute('data-beauty-kind','makeup');
        b.innerHTML='<b>💄</b><span>화장</span><i></i>';
        b.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl('makeup');};
        controls.appendChild(b);
      }
      var note=sheet.querySelector('.kt-beauty-base-note');
      if(note)note.textContent='카메라 기본 보정 ON · 피부·주름·눈·코·입·턱·화장 각각 1~100 조절';
      if(window.state&&state.beautyControl==='makeup'){
        var label=document.getElementById('beautySingleLabel');
        var range=document.getElementById('beautySingleRange');
        var val=document.getElementById('beautySingleValue');
        var v=clamp100(state.beautyMakeup,42);
        if(label)label.textContent='화장 강도';
        if(range){range.min='1';range.max='100';range.step='1';range.value=v;}
        if(val)val.textContent=v;
      }
    }catch(e){}
  }

  var oldOpen=window.openBeautyPanel;
  if(typeof oldOpen==='function')window.openBeautyPanel=function(){var r=oldOpen.apply(this,arguments);setTimeout(decorate,0);return r;};
  var oldSelect=window.selectBeautyControl;
  if(typeof oldSelect==='function')window.selectBeautyControl=function(kind){var r=oldSelect.apply(this,arguments);setTimeout(decorate,0);return r;};
  var oldReset=window.resetBeautyAll;
  if(typeof oldReset==='function')window.resetBeautyAll=function(){var r=oldReset.apply(this,arguments);try{state.beautyMakeup=42;}catch(e){}setTimeout(decorate,0);try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}return r;};
})();

/* 보정 숫자는 사용자 요청대로 1~100으로 고정. */
(function(){
  if(window.__ktBeautyRange100Installed)return;
  window.__ktBeautyRange100Installed=true;

  function clamp100(v,d){v=parseInt(v,10);if(!isFinite(v))v=d;return Math.max(1,Math.min(100,v));}
  function currentKind(){try{return (window.state&&state.beautyControl)||'skin';}catch(e){return 'skin';}}
  function currentValue(kind){try{return clamp100(window.getBeautyControlValue?window.getBeautyControlValue(kind):50,50);}catch(e){return 50;}}

  function syncRange(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var kind=currentKind();
      var range=document.getElementById('beautySingleRange');
      var val=document.getElementById('beautySingleValue');
      var value=currentValue(kind);
      if(kind==='makeup')value=clamp100((window.state&&state.beautyMakeup)||42,42);
      if(range){
        range.min='1';range.max='100';range.step='1';range.value=value;
        range.oninput=function(){if(window.setBeautyValue)window.setBeautyValue(currentKind(),this.value);var x=document.getElementById('beautySingleValue');if(x)x.textContent=this.value;};
        range.onchange=range.oninput;
      }
      if(val)val.textContent=value;
      var scale=sheet.querySelector('.kt-beauty-range-scale');
      if(scale){
        var spans=scale.querySelectorAll('span');
        if(spans[0])spans[0].textContent='1';
        if(spans[spans.length-1])spans[spans.length-1].textContent='100';
        var strong=scale.querySelector('strong');if(strong)strong.textContent='1 ~ 100 조절';
      }
      var note=sheet.querySelector('.kt-beauty-base-note');
      if(note)note.textContent='카메라 기본 보정 ON · 피부·주름·눈·코·입·턱·화장 각각 1~100 조절';
    }catch(e){}
  }

  var oldOpen=window.openBeautyPanel;
  if(typeof oldOpen==='function')window.openBeautyPanel=function(){var r=oldOpen.apply(this,arguments);setTimeout(syncRange,0);setTimeout(syncRange,60);return r;};
  var oldSelect=window.selectBeautyControl;
  if(typeof oldSelect==='function')window.selectBeautyControl=function(kind){var r=oldSelect.apply(this,arguments);setTimeout(syncRange,0);return r;};
  setTimeout(syncRange,120);
})();

/* 컴퓨터·태블릿에서 공개 동영상이 검게 멈출 때 재생만 다시 시도. 휴대폰 UI/방송방은 건드리지 않음. */
(function(){
  if(window.__ktDesktopVideoPlayRetryInstalled)return;
  window.__ktDesktopVideoPlayRetryInstalled=true;

  function desktopLike(){
    try{return window.matchMedia('(min-width:700px)').matches;}catch(e){return window.innerWidth>=700;}
  }
  function retry(){
    if(!desktopLike())return;
    try{
      document.querySelectorAll('#screen video').forEach(function(v){
        try{
          v.muted=true;
          v.autoplay=true;
          v.preload='auto';
          v.setAttribute('playsinline','');
          if(v.readyState===0&&v.currentSrc)v.load();
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }
  window.addEventListener('pageshow',function(){setTimeout(retry,80);});
  window.addEventListener('focus',function(){setTimeout(retry,80);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(retry,80);});
  document.addEventListener('pointerdown',function(){setTimeout(retry,0);},true);
  setTimeout(retry,80);setTimeout(retry,500);setTimeout(retry,1500);
})();
