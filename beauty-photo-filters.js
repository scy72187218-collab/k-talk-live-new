/* K-Talk 보정 추가: 전체 보정 1~100 + 사진 느낌 필터. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyPhotoFiltersInstalled)return;
  window.__ktBeautyPhotoFiltersInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function setOverall(value){
    value=clamp(value,72);
    try{
      state.beautyOn=true;
      state.beautyOverall=value;
      state.beautySkin=clamp(Math.round(60+value*0.39),88);
      state.beautyWrinkle=clamp(Math.round(40+value*0.45),72);
      state.beautyBright=clamp(Math.round(50+value*0.28),70);
      state.beautyTone=clamp(Math.round(50+value*0.11),58);
      state.beautyFace=clamp(Math.round(50+(value-50)*0.05),50);
      state.beautyEyes=clamp(Math.round(50+(value-50)*0.09),52);
      state.beautyNose=clamp(Math.round(50+(value-50)*0.02),50);
      state.beautyMouth=clamp(Math.round(50+(value-50)*0.08),52);
      state.beautyJaw=clamp(Math.round(50+(value-50)*0.02),50);
    }catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
    var v=document.getElementById('beautySingleValue');
    if(v)v.textContent=value;
  }

  var oldInfo=window.getBeautyControlInfo;
  if(typeof oldInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='overall')return {label:'전체 보정',key:'beautyOverall',def:72};
      if(kind==='mouth')return {label:'입 조절',key:'beautyMouth',def:52};
      return oldInfo.apply(this,arguments);
    };
  }

  var oldSet=window.setBeautyValue;
  if(typeof oldSet==='function'){
    window.setBeautyValue=function(kind,value){
      if(kind==='overall'){
        setOverall(value);
        return;
      }
      return oldSet.apply(this,arguments);
    };
  }

  var looks={
    natural:'',
    bright:'brightness(1.055) saturate(1.05)',
    warm:'sepia(.055) saturate(1.075) hue-rotate(-5deg) brightness(1.025)',
    pink:'sepia(.035) saturate(1.10) hue-rotate(-8deg) brightness(1.035)',
    cool:'saturate(1.035) hue-rotate(6deg) brightness(1.02)',
    vivid:'contrast(1.045) saturate(1.14)',
    soft:'brightness(1.04) contrast(.965) saturate(.98)',
    mono:'grayscale(1) contrast(1.04)'
  };
  var labels={natural:'자연',bright:'화사',warm:'따뜻',pink:'핑크',cool:'시원',vivid:'선명',soft:'부드럽게',mono:'흑백'};

  function currentLook(){
    try{
      var saved=String(localStorage.getItem('kt_beauty_photo_look')||'');
      if(saved&&Object.prototype.hasOwnProperty.call(looks,saved))return saved;
    }catch(e){}
    try{
      if(window.state&&state.ktPhotoLook&&Object.prototype.hasOwnProperty.call(looks,state.ktPhotoLook))return state.ktPhotoLook;
    }catch(e){}
    return 'natural';
  }

  function applyLook(){
    var key=currentLook();
    var extra=looks[key]||'';
    ['camera','cameraBg'].forEach(function(id){
      var el=document.getElementById(id);
      if(!el)return;
      try{
        var previous=el.getAttribute('data-kt-photo-extra')||'';
        var base=String(el.style.filter||'').trim();
        if(previous&&base.slice(-previous.length)===previous)base=base.slice(0,-previous.length).trim();
        el.setAttribute('data-kt-photo-extra',extra);
        el.style.filter=(base+(base&&extra?' ':'')+extra).trim();
      }catch(e){}
    });
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'){
    window.applyBeautyPreview=function(){
      var r=oldApply.apply(this,arguments);
      applyLook();
      return r;
    };
  }

  window.ktSetBeautyPhotoLook=function(key){
    if(!Object.prototype.hasOwnProperty.call(looks,key))key='natural';
    try{state.ktPhotoLook=key;}catch(e){}
    try{localStorage.setItem('kt_beauty_photo_look',key);}catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();else applyLook();}catch(e){applyLook();}
    document.querySelectorAll('.kt-beauty-look-btn').forEach(function(btn){btn.classList.toggle('on',btn.getAttribute('data-look')===key);});
  };

  function decorate(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var controls=sheet.querySelector('.kt-beauty-controls-pro');
      if(controls&&!controls.querySelector('[data-beauty-kind="overall"]')){
        var all=document.createElement('button');
        all.setAttribute('data-beauty-kind','overall');
        all.innerHTML='<b>✨</b><span>전체</span><i></i>';
        all.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl('overall');};
        controls.insertBefore(all,controls.firstChild);
      }
      if(controls){
        var mouth=controls.querySelector('[data-beauty-kind="mouth"]');
        if(mouth)mouth.innerHTML='<b>👄</b><span>입</span><i></i>';
        var selected=(window.state&&state.beautyControl)||'overall';
        controls.querySelectorAll('button').forEach(function(btn){btn.classList.toggle('on',btn.getAttribute('data-beauty-kind')===selected);});
      }

      var group=sheet.querySelector('.kt-beauty-single-group');
      if(group){
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
      if(pro&&!pro.querySelector('.kt-beauty-photo-looks')){
        var box=document.createElement('div');
        box.className='kt-beauty-photo-looks';
        var key=currentLook();
        var html='<div class="kt-beauty-look-title"><b>사진 필터</b><span>촬영 화면에 바로 적용</span></div><div class="kt-beauty-look-row">';
        Object.keys(labels).forEach(function(k){html+='<button type="button" class="kt-beauty-look-btn '+(k===key?'on':'')+'" data-look="'+k+'" onclick="ktSetBeautyPhotoLook(\''+k+'\')">'+labels[k]+'</button>';});
        html+='</div>';
        box.innerHTML=html;
        pro.appendChild(box);
      }

      var current=(window.state&&state.beautyControl)||'overall';
      if(current==='overall'){
        var info=window.getBeautyControlInfo?window.getBeautyControlInfo('overall'):null;
        var value=clamp((window.state&&state.beautyOverall)||72,72);
        var label=document.getElementById('beautySingleLabel');
        var rangeEl=document.getElementById('beautySingleRange');
        var valEl=document.getElementById('beautySingleValue');
        if(label&&info)label.textContent=info.label;
        if(rangeEl)rangeEl.value=value;
        if(valEl)valEl.textContent=value;
      }
    }catch(e){}
  }

  if(!document.getElementById('ktBeautyPhotoFiltersStyle')){
    var st=document.createElement('style');
    st.id='ktBeautyPhotoFiltersStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-photo-looks{margin-top:9px!important;padding:9px!important;border-radius:13px!important;background:rgba(255,255,255,.055)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-title{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:7px!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-title b{font-size:13px!important}.kt-beauty-look-title span{font-size:10px!important;color:#bbb!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-row{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-btn{min-height:34px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:10px!important;background:rgba(20,20,24,.88)!important;color:#eee!important;font-size:11px!important;font-weight:850!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-btn.on{border-color:#ff4eb8!important;background:linear-gradient(135deg,rgba(126,54,255,.7),rgba(255,68,162,.72))!important;color:#fff!important}';
    document.head.appendChild(st);
  }

  var oldOpen=window.openBeautyPanel;
  if(typeof oldOpen==='function'){
    window.openBeautyPanel=function(){
      try{
        if(window.state&&!state.__ktOverallBeautyPreset){
          state.__ktOverallBeautyPreset=true;
          state.beautyOverall=72;
          if(!state.beautyControl)state.beautyControl='overall';
          setOverall(72);
        }
      }catch(e){}
      var r=oldOpen.apply(this,arguments);
      setTimeout(decorate,0);
      return r;
    };
  }

  var oldSelect=window.selectBeautyControl;
  if(typeof oldSelect==='function'){
    window.selectBeautyControl=function(kind){
      var r=oldSelect.apply(this,arguments);
      setTimeout(decorate,0);
      return r;
    };
  }

  try{
    if(window.state&&!state.__ktOverallBeautyPreset){
      state.__ktOverallBeautyPreset=true;
      state.beautyOverall=72;
      if(!state.beautyControl)state.beautyControl='overall';
      setOverall(72);
    }
  }catch(e){}
  setTimeout(function(){applyLook();},0);
})();

/* 편집효과 배경에서 가요무대형 8개만 따로 불러온다. */
(function(){
  if(document.querySelector('script[data-kt-stage-backgrounds-8]'))return;
  var s=document.createElement('script');
  s.src='stage-backgrounds-8.js?v=20260907a';
  s.async=false;
  s.setAttribute('data-kt-stage-backgrounds-8','1');
  document.head.appendChild(s);
})();
