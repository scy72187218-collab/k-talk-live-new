/* K-Talk 카메라 보정 업그레이드: 기본 자연 보정 + 항목별 1~100 (피부/주름/눈/코/입/턱). 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyNaturalUpgradeInstalled)return;
  window.__ktBeautyNaturalUpgradeInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function applyBaseDefaults(){
    try{
      state.beautyOn=true;
      if(!state.__ktBaseBeautySet){
        if(!(Number(state.beautySkin)>0))state.beautySkin=88;
        if(!(Number(state.beautyWrinkle)>0))state.beautyWrinkle=72;
        if(!(Number(state.beautyBright)>0))state.beautyBright=70;
        if(!(Number(state.beautySharp)>0))state.beautySharp=50;
        if(!(Number(state.beautyTone)>0))state.beautyTone=58;
        if(!(Number(state.beautyFace)>0))state.beautyFace=50;
        if(!(Number(state.beautyEyes)>0))state.beautyEyes=52;
        if(!(Number(state.beautyNose)>0))state.beautyNose=50;
        if(!(Number(state.beautyMouth)>0))state.beautyMouth=52;
        if(!(Number(state.beautyJaw)>0))state.beautyJaw=50;
        state.__ktBaseBeautySet=true;
      }
    }catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
  }

  var oldInfo=window.getBeautyControlInfo;
  if(typeof oldInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='mouth')return {label:'입 조절',key:'beautyMouth',def:52};
      if(kind==='jaw')return {label:'턱선 조절',key:'beautyJaw',def:50};
      return oldInfo.apply(this,arguments);
    };
  }

  var oldSet=window.setBeautyValue;
  if(typeof oldSet==='function'){
    window.setBeautyValue=function(kind,value){
      value=clamp(value,50);
      if(kind==='jaw'){
        try{state.beautyJaw=value;}catch(e){}
        try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
        var val=document.getElementById('beautySingleValue');
        if(val)val.textContent=value;
        return;
      }
      return oldSet.apply(this,arguments);
    };
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'){
    window.applyBeautyPreview=function(){
      var r=oldApply.apply(this,arguments);
      try{
        var cam=document.getElementById('camera');
        if(cam){
          var face=clamp(state.beautyFace,50);
          var jaw=clamp(state.beautyJaw,50);
          var scale=1+(face-50)*0.0008+(50-jaw)*0.00035;
          cam.style.setProperty('transform','scaleX(-1) scale('+scale.toFixed(3)+')','important');
        }
      }catch(e){}
      return r;
    };
  }

  function decoratePanel(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var controls=sheet.querySelector('.kt-beauty-controls-pro');
      if(controls){
        var mouth=controls.querySelector('[data-beauty-kind="mouth"]');
        if(mouth){mouth.innerHTML='<b>👄</b><span>입</span><i></i>';}
        if(!controls.querySelector('[data-beauty-kind="jaw"]')){
          var jaw=document.createElement('button');
          jaw.setAttribute('data-beauty-kind','jaw');
          jaw.innerHTML='<b>⌄</b><span>턱</span><i></i>';
          jaw.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl('jaw');};
          controls.appendChild(jaw);
        }
      }

      var group=sheet.querySelector('.kt-beauty-single-group');
      if(group){
        group.style.setProperty('display','block','important');
        group.style.setProperty('visibility','visible','important');
        group.style.setProperty('opacity','1','important');
        var range=group.querySelector('#beautySingleRange');
        if(range){
          range.min='1';range.max='100';
          range.style.setProperty('width','100%','important');
        }
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
        note.textContent='카메라 기본 자연 보정 ON · 항목별 1~100 조절';
        var tabs=pro.querySelector('.kt-beauty-pro-tabs');
        if(tabs&&tabs.parentNode)tabs.parentNode.insertBefore(note,tabs.nextSibling);
      }

      var current=(window.state&&state.beautyControl)||'skin';
      if(current==='mouth'||current==='jaw'){
        var info=window.getBeautyControlInfo?window.getBeautyControlInfo(current):null;
        var v=window.getBeautyControlValue?window.getBeautyControlValue(current):50;
        var label=document.getElementById('beautySingleLabel');
        var rangeEl=document.getElementById('beautySingleRange');
        var valEl=document.getElementById('beautySingleValue');
        if(label&&info)label.textContent=info.label;
        if(rangeEl)rangeEl.value=v;
        if(valEl)valEl.textContent=v;
      }
    }catch(e){}
  }

  if(!document.getElementById('ktBeautyNaturalUpgradeStyle')){
    var st=document.createElement('style');
    st.id='ktBeautyNaturalUpgradeStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button{min-height:58px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-single-group{display:block!important;visibility:visible!important;opacity:1!important;margin-top:10px!important;padding:10px!important;border-radius:14px!important;background:rgba(255,255,255,.07)!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{display:block!important;width:100%!important;min-width:0!important}'
      +'#sheet.beauty-control-sheet #beautySingleValue{display:inline-flex!important;min-width:38px!important;justify-content:center!important;font-size:18px!important;font-weight:950!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-top:5px!important;font-size:11px!important;color:#ddd!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale strong{font-size:12px!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-base-note{margin:7px 0 4px!important;padding:7px 9px!important;border-radius:10px!important;background:rgba(128,70,255,.16)!important;color:#fff!important;font-size:11px!important;font-weight:850!important;text-align:center!important}';
    document.head.appendChild(st);
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      applyBaseDefaults();
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(decoratePanel,0);
      return r;
    };
  }

  var oldSelect=window.selectBeautyControl;
  if(typeof oldSelect==='function'){
    window.selectBeautyControl=function(kind){
      var r=oldSelect.apply(this,arguments);
      setTimeout(decoratePanel,0);
      return r;
    };
  }

  var oldReset=window.resetBeautyAll;
  if(typeof oldReset==='function'){
    window.resetBeautyAll=function(){
      var r=oldReset.apply(this,arguments);
      try{state.beautyWrinkle=72;state.beautyJaw=50;state.beautyMouth=52;}catch(e){}
      applyBaseDefaults();
      setTimeout(decoratePanel,0);
      return r;
    };
  }

  var oldOpenCreator=window.openCreator;
  if(typeof oldOpenCreator==='function'){
    window.openCreator=async function(){
      var r=await oldOpenCreator.apply(this,arguments);
      applyBaseDefaults();
      return r;
    };
  }

  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'){
    window.ensureLiveCamera=async function(){
      var r=await oldEnsure.apply(this,arguments);
      applyBaseDefaults();
      return r;
    };
  }

  setTimeout(applyBaseDefaults,0);
})();

/* 전체 보정 1~100 + 사진 필터는 별도 파일로만 추가 로드 */
(function(){
  if(document.querySelector('script[data-kt-beauty-photo-filters]'))return;
  var s=document.createElement('script');
  s.src='beauty-photo-filters.js?v=20260907a';
  s.async=false;
  s.setAttribute('data-kt-beauty-photo-filters','1');
  document.head.appendChild(s);
})();

/* 13명방 참여자 안쪽 조작키만 별도 파일로 추가 로드 */
(function(){
  if(document.querySelector('script[data-kt-group13-participant-controls]'))return;
  var s=document.createElement('script');
  s.src='group13-participant-controls.js?v=20260908a';
  s.async=false;
  s.setAttribute('data-kt-group13-participant-controls','1');
  document.head.appendChild(s);
})();

/* 장미 빠른 선물 수량만 별도 파일로 추가 로드 */
(function(){
  if(document.querySelector('script[data-kt-rose-quick-packs]'))return;
  var s=document.createElement('script');
  s.src='gift-rose-quick-packs.js?v=20260908a';
  s.async=false;
  s.setAttribute('data-kt-rose-quick-packs','1');
  document.head.appendChild(s);
})();
