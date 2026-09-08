/* K-Talk 보정 패널 고정 표시: 전체/피부/주름/눈/코/입/턱 1~100 + 사진 필터. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyPhotoFiltersInstalledV2)return;
  window.__ktBeautyPhotoFiltersInstalledV2=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
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
  var icons={natural:'🙂',bright:'✨',warm:'☀️',pink:'🌸',cool:'❄️',vivid:'🌈',soft:'💫',mono:'◐'};

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

  function setOverall(value){
    value=clamp(value,72);
    try{
      state.beautyOn=true;
      state.beautyOverall=value;
      state.beautySkin=clamp(Math.round(58+value*0.40),86);
      state.beautyWrinkle=clamp(Math.round(38+value*0.46),70);
      state.beautyBright=clamp(Math.round(48+value*0.30),68);
      state.beautyTone=clamp(Math.round(48+value*0.14),58);
      state.beautyFace=clamp(Math.round(50+(value-50)*0.04),50);
      state.beautyEyes=clamp(Math.round(50+(value-50)*0.06),52);
      state.beautyNose=clamp(Math.round(50+(value-50)*0.03),50);
      state.beautyMouth=clamp(Math.round(50+(value-50)*0.05),52);
      state.beautyJaw=clamp(Math.round(50+(value-50)*0.03),50);
    }catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
  }

  var oldInfo=window.getBeautyControlInfo;
  if(typeof oldInfo==='function'&&!oldInfo.__ktBeautyV2){
    var wrappedInfo=function(kind){
      if(kind==='overall')return {label:'전체 보정',key:'beautyOverall',def:72};
      if(kind==='mouth')return {label:'입 효과',key:'beautyMouth',def:52};
      if(kind==='jaw')return {label:'턱 효과',key:'beautyJaw',def:50};
      if(kind==='wrinkle')return {label:'주름 완화',key:'beautyWrinkle',def:70};
      var r=oldInfo.apply(this,arguments);
      if(kind==='eyes'&&r)r.label='눈 효과';
      if(kind==='nose'&&r)r.label='코 효과';
      if(kind==='skin'&&r)r.label='피부 부드러움';
      return r;
    };
    wrappedInfo.__ktBeautyV2=true;
    window.getBeautyControlInfo=wrappedInfo;
  }

  var oldSet=window.setBeautyValue;
  if(typeof oldSet==='function'&&!oldSet.__ktBeautyV2){
    var wrappedSet=function(kind,value){
      value=clamp(value,50);
      if(kind==='overall'){
        setOverall(value);
        try{state.beautyOverall=value;}catch(e){}
        return;
      }
      if(kind==='jaw'){
        try{state.beautyJaw=value;}catch(e){}
        try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
        return;
      }
      return oldSet.apply(this,arguments);
    };
    wrappedSet.__ktBeautyV2=true;
    window.setBeautyValue=wrappedSet;
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'&&!oldApply.__ktBeautyLookV2){
    var wrappedApply=function(){
      var r=oldApply.apply(this,arguments);
      applyLook();
      return r;
    };
    wrappedApply.__ktBeautyLookV2=true;
    window.applyBeautyPreview=wrappedApply;
  }

  function getValue(kind){
    try{
      if(kind==='overall')return clamp(state.beautyOverall,72);
      if(window.getBeautyControlValue)return clamp(window.getBeautyControlValue(kind),50);
    }catch(e){}
    var map={skin:86,wrinkle:70,eyes:52,nose:50,mouth:52,jaw:50};
    return map[kind]||50;
  }

  function kindLabel(kind){
    var map={overall:'전체 보정',skin:'피부 부드러움',wrinkle:'주름 완화',eyes:'눈 효과',nose:'코 효과',mouth:'입 효과',jaw:'턱 효과'};
    return map[kind]||'전체 보정';
  }

  window.ktBeautyPick=function(kind){
    try{state.beautyControl=kind;}catch(e){}
    var value=getValue(kind);
    document.querySelectorAll('.kt-beauty-v2-kind').forEach(function(btn){
      btn.classList.toggle('on',btn.getAttribute('data-kind')===kind);
    });
    var label=document.getElementById('ktBeautyV2Label');
    var range=document.getElementById('ktBeautyV2Range');
    var num=document.getElementById('ktBeautyV2Num');
    if(label)label.textContent=kindLabel(kind);
    if(range)range.value=value;
    if(num)num.textContent=value;
  };

  window.ktBeautySlide=function(value){
    value=clamp(value,50);
    var kind='overall';
    try{kind=(window.state&&state.beautyControl)||'overall';}catch(e){}
    try{if(window.setBeautyValue)window.setBeautyValue(kind,value);}catch(e){}
    var num=document.getElementById('ktBeautyV2Num');
    if(num)num.textContent=value;
  };

  window.ktSetBeautyPhotoLook=function(key){
    if(!Object.prototype.hasOwnProperty.call(looks,key))key='natural';
    try{state.ktPhotoLook=key;}catch(e){}
    try{localStorage.setItem('kt_beauty_photo_look',key);}catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();else applyLook();}catch(e){applyLook();}
    document.querySelectorAll('.kt-beauty-look-btn').forEach(function(btn){btn.classList.toggle('on',btn.getAttribute('data-look')===key);});
  };

  function kindButton(kind,icon,text){
    return '<button type="button" class="kt-beauty-v2-kind" data-kind="'+kind+'" onclick="ktBeautyPick(\''+kind+'\')"><b>'+icon+'</b><span>'+text+'</span></button>';
  }

  function makePanel(){
    var selected='overall';
    try{selected=(window.state&&state.beautyControl)||'overall';}catch(e){}
    if(['overall','skin','wrinkle','eyes','nose','mouth','jaw'].indexOf(selected)<0)selected='overall';
    try{if(window.state)state.beautyControl=selected;}catch(e){}
    var value=getValue(selected);
    var look=currentLook();

    var filters='';
    Object.keys(labels).forEach(function(k){
      filters+='<button type="button" class="kt-beauty-look-btn '+(k===look?'on':'')+'" data-look="'+k+'" onclick="ktSetBeautyPhotoLook(\''+k+'\')"><span class="kt-beauty-look-icon kt-look-'+k+'">'+icons[k]+'</span><small>'+labels[k]+'</small></button>';
    });

    return '<div class="kt-beauty-v2">'
      +'<div class="kt-beauty-v2-head"><b>AI 보정</b><span>항목을 누르고 1~100으로 조절</span></div>'
      +'<div class="kt-beauty-v2-kinds">'
        +kindButton('overall','✨','전체')
        +kindButton('skin','💧','피부')
        +kindButton('wrinkle','〰','주름')
        +kindButton('eyes','◉','눈')
        +kindButton('nose','♢','코')
        +kindButton('mouth','👄','입')
        +kindButton('jaw','⌄','턱')
      +'</div>'
      +'<div class="kt-beauty-v2-slider">'
        +'<div class="kt-beauty-v2-slider-top"><span id="ktBeautyV2Label">'+kindLabel(selected)+'</span><b id="ktBeautyV2Num">'+value+'</b></div>'
        +'<input id="ktBeautyV2Range" type="range" min="1" max="100" value="'+value+'" oninput="ktBeautySlide(this.value)">'
        +'<div class="kt-beauty-v2-scale"><span>1</span><strong>1 ~ 100</strong><span>100</span></div>'
      +'</div>'
      +'<div class="kt-beauty-photo-looks"><div class="kt-beauty-look-title"><b>사진 필터</b><span>촬영 화면에 바로 적용</span></div><div class="kt-beauty-look-row">'+filters+'</div></div>'
      +'<div class="kt-beauty-v2-actions"><button type="button" onclick="if(window.resetBeautyAll)resetBeautyAll();setTimeout(function(){ktBeautyPick(\'overall\')},0)">초기화</button><button type="button" class="primary" onclick="closeSheet()">적용</button></div>'
      +'</div>';
  }

  function installStyle(){
    if(document.getElementById('ktBeautyPanelV2Style'))return;
    var st=document.createElement('style');
    st.id='ktBeautyPanelV2Style';
    st.textContent=''
      +'#sheet.beauty-control-sheet .sheet-body{overflow:auto!important;padding-bottom:12px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2{width:100%!important;max-width:100%!important;padding:4px 2px 2px!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-head{display:flex!important;align-items:flex-end!important;justify-content:space-between!important;gap:8px!important;margin-bottom:8px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-head b{font-size:18px!important}.kt-beauty-v2-head span{font-size:10px!important;color:#bbb!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-kinds{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-kind{min-height:54px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:12px!important;background:rgba(20,20,25,.90)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;padding:4px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-kind b{font-size:20px!important;line-height:1!important}.kt-beauty-v2-kind span{font-size:11px!important;font-weight:900!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-kind.on{border-color:#ff4eb8!important;background:linear-gradient(135deg,rgba(116,61,255,.86),rgba(255,62,161,.82))!important;box-shadow:0 0 12px rgba(255,70,184,.28)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-slider{margin-top:9px!important;padding:10px!important;border-radius:13px!important;background:rgba(255,255,255,.075)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-slider-top{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:6px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-slider-top span{font-size:13px!important;font-weight:900!important}.kt-beauty-v2-slider-top b{display:inline-flex!important;min-width:42px!important;height:28px!important;align-items:center!important;justify-content:center!important;border-radius:9px!important;background:#fff!important;color:#111!important;font-size:17px!important}'
      +'#sheet.beauty-control-sheet #ktBeautyV2Range{display:block!important;width:100%!important;height:32px!important;margin:0!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-scale{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-top:1px!important;color:#ccc!important;font-size:10px!important}.kt-beauty-v2-scale strong{color:#fff!important;font-size:11px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-photo-looks{margin-top:9px!important;padding:9px!important;border-radius:13px!important;background:rgba(255,255,255,.055)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-title{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:7px!important}.kt-beauty-look-title b{font-size:13px!important}.kt-beauty-look-title span{font-size:10px!important;color:#bbb!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-row{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-btn{min-height:55px!important;padding:5px 3px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:10px!important;background:rgba(20,20,24,.88)!important;color:#eee!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-icon{display:flex!important;width:28px!important;height:28px!important;border-radius:50%!important;align-items:center!important;justify-content:center!important;font-size:17px!important;border:1px solid rgba(255,255,255,.25)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-btn small{font-size:10px!important;font-weight:900!important;color:inherit!important}'
      +'#sheet.beauty-control-sheet .kt-look-natural{background:linear-gradient(135deg,#544b52,#25252a)!important}'
      +'#sheet.beauty-control-sheet .kt-look-bright{background:linear-gradient(135deg,#fff7b0,#ffcb62)!important}'
      +'#sheet.beauty-control-sheet .kt-look-warm{background:linear-gradient(135deg,#ffbd6b,#c96b43)!important}'
      +'#sheet.beauty-control-sheet .kt-look-pink{background:linear-gradient(135deg,#ffb3d7,#d35a99)!important}'
      +'#sheet.beauty-control-sheet .kt-look-cool{background:linear-gradient(135deg,#a8ddff,#547fc4)!important}'
      +'#sheet.beauty-control-sheet .kt-look-vivid{background:linear-gradient(135deg,#f65d8b,#f6c95d,#62d6b8,#6668df)!important}'
      +'#sheet.beauty-control-sheet .kt-look-soft{background:linear-gradient(135deg,#e8d9ff,#8d7ab5)!important}'
      +'#sheet.beauty-control-sheet .kt-look-mono{background:linear-gradient(135deg,#f2f2f2,#383838)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-look-btn.on{border-color:#ff4eb8!important;background:linear-gradient(135deg,rgba(126,54,255,.7),rgba(255,68,162,.72))!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-actions{display:grid!important;grid-template-columns:1fr 1.35fr!important;gap:8px!important;margin-top:9px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-actions button{height:42px!important;border:0!important;border-radius:12px!important;background:#2c2c32!important;color:#fff!important;font-size:14px!important;font-weight:950!important}.kt-beauty-v2-actions .primary{background:linear-gradient(135deg,#7c45ff,#d63cff)!important}'
      +'@media(max-width:390px){#sheet.beauty-control-sheet .kt-beauty-v2-kinds{grid-template-columns:repeat(4,minmax(0,1fr))!important}.kt-beauty-v2-kind{min-height:50px!important}.kt-beauty-look-btn{min-height:50px!important}}';
    document.head.appendChild(st);
  }

  installStyle();

  /* 카메라를 열면 기본 전체 보정값만 미리 켜 둔다. */
  try{
    if(window.state&&!state.__ktOverallBeautyPresetV2){
      state.__ktOverallBeautyPresetV2=true;
      if(!(Number(state.beautyOverall)>0))state.beautyOverall=72;
      if(!state.beautyControl)state.beautyControl='overall';
      setOverall(state.beautyOverall);
    }
  }catch(e){}

  var previousOpen=window.openBeautyPanel;
  window.openBeautyPanel=function(){
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('beauty-preview-open');
      if(window.ensureLiveCamera){
        try{var p=window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');if(p&&p.catch)p.catch(function(){});}catch(e){}
      }
      if(window.showSheet){
        showSheet('AI 보정',makePanel());
        var sheet=document.getElementById('sheet');
        if(sheet)sheet.classList.add('camera-effect-sheet','beauty-control-sheet');
        setTimeout(function(){
          var k=(window.state&&state.beautyControl)||'overall';
          window.ktBeautyPick(k);
        },0);
        return;
      }
    }catch(e){}
    if(typeof previousOpen==='function')return previousOpen.apply(this,arguments);
  };

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