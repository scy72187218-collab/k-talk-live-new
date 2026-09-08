/* K-Talk AI 보정창 전용 보강: AI 보정은 1~100 조절창, 하트/꽃 등은 편집효과로 분리. */
(function(){
  if(window.__ktBeautyPanelV2Installed)return;
  window.__ktBeautyPanelV2Installed=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  var oldSetBeautyValue=window.setBeautyValue;
  var oldOpenCreator=window.openCreator;

  function baseDefaults(){
    try{
      state.beautyOn=true;
      if(!(Number(state.beautySkin)>0))state.beautySkin=78;
      if(!(Number(state.beautyWrinkle)>0))state.beautyWrinkle=68;
      if(!(Number(state.beautyBright)>0))state.beautyBright=66;
      if(!(Number(state.beautySharp)>0))state.beautySharp=54;
      if(!(Number(state.beautyFace)>0))state.beautyFace=50;
      if(!(Number(state.beautyEyes)>0))state.beautyEyes=50;
      if(!(Number(state.beautyNose)>0))state.beautyNose=50;
      if(!(Number(state.beautyMouth)>0))state.beautyMouth=50;
      if(!(Number(state.beautyJaw)>0))state.beautyJaw=50;
    }catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
  }

  function info(kind){
    var map={
      skin:{label:'피부',key:'beautySkin',def:78,icon:'💧'},
      wrinkle:{label:'주름 완화',key:'beautyWrinkle',def:68,icon:'〰'},
      bright:{label:'밝기',key:'beautyBright',def:66,icon:'☀'},
      eyes:{label:'눈',key:'beautyEyes',def:50,icon:'◉'},
      nose:{label:'코',key:'beautyNose',def:50,icon:'♢'},
      mouth:{label:'입',key:'beautyMouth',def:50,icon:'👄'},
      jaw:{label:'턱',key:'beautyJaw',def:50,icon:'⌄'}
    };
    return map[kind]||map.skin;
  }

  function current(kind){
    var i=info(kind);
    try{return clamp(state[i.key],i.def);}catch(e){return i.def;}
  }

  function applyValue(kind,value){
    value=clamp(value,50);
    try{
      var i=info(kind);
      state[i.key]=value;
      state.beautyOn=true;

      if(kind==='wrinkle'){
        var mapped=Math.round(58+(value*.34));
        if(typeof oldSetBeautyValue==='function')oldSetBeautyValue.call(window,'skin',mapped);
        else if(window.applyBeautyPreview)window.applyBeautyPreview();
      }else if(kind==='jaw'){
        /* 현재 엔진의 얼굴형 효과에 턱 값을 연결해 실제 화면 변화가 나도록 한다. */
        var faceValue=clamp(50+(50-value)*.55,50);
        state.beautyFace=faceValue;
        if(typeof oldSetBeautyValue==='function')oldSetBeautyValue.call(window,'face',faceValue);
        else if(window.applyBeautyPreview)window.applyBeautyPreview();
      }else if(typeof oldSetBeautyValue==='function'){
        oldSetBeautyValue.call(window,kind,value);
      }else if(window.applyBeautyPreview){
        window.applyBeautyPreview();
      }
    }catch(e){}

    var val=document.getElementById('beautySingleValue');
    if(val)val.textContent=value;
  }

  window.getBeautyControlInfo=function(kind){
    var i=info(kind);
    return {label:i.label,key:i.key,def:i.def};
  };

  window.getBeautyControlValue=function(kind){return current(kind);};

  window.selectBeautyControl=function(kind){
    try{state.beautyControl=kind;}catch(e){}
    document.querySelectorAll('.kt-beauty-controls-pro button').forEach(function(btn){
      btn.classList.toggle('on',btn.getAttribute('data-beauty-kind')===kind);
    });
    var i=info(kind),v=current(kind);
    var label=document.getElementById('beautySingleLabel');
    var range=document.getElementById('beautySingleRange');
    var val=document.getElementById('beautySingleValue');
    if(label)label.textContent=i.label;
    if(range)range.value=v;
    if(val)val.textContent=v;
  };

  window.setBeautyActiveValue=function(value){
    var kind='skin';
    try{kind=state.beautyControl||'skin';}catch(e){}
    applyValue(kind,value);
  };

  window.setBeautyValue=function(kind,value){applyValue(kind,value);};

  function renderBeautyPanel(){
    baseDefaults();
    var selected='skin';
    try{selected=state.beautyControl||'skin';}catch(e){}
    if(!['skin','wrinkle','bright','eyes','nose','mouth','jaw'].includes(selected))selected='skin';
    try{state.beautyControl=selected;}catch(e){}
    var active=info(selected),value=current(selected);
    var kinds=['skin','wrinkle','bright','eyes','nose','mouth','jaw'];
    var buttons=kinds.map(function(k){
      var i=info(k);
      return '<button type="button" class="'+(k===selected?'on':'')+'" data-beauty-kind="'+k+'" onclick="selectBeautyControl(\''+k+'\')"><b>'+i.icon+'</b><span>'+i.label+'</span></button>';
    }).join('');

    var html=''
      +'<div class="kt-beauty-panel kt-beauty-panel-pro kt-beauty-v2">'
      +'<div class="kt-beauty-v2-top"><b>AI 보정</b><span>각 항목을 1~100으로 조절</span><button type="button" onclick="resetBeautyAll()">초기화</button></div>'
      +'<div class="kt-beauty-controls-pro">'+buttons+'</div>'
      +'<div class="kt-beauty-single-group">'
      +'<div class="kt-beauty-single-row"><span id="beautySingleLabel">'+active.label+'</span><b id="beautySingleValue">'+value+'</b></div>'
      +'<input id="beautySingleRange" type="range" min="1" max="100" value="'+value+'" oninput="setBeautyActiveValue(this.value)">'
      +'<div class="kt-beauty-scale"><span>1</span><strong>1 ~ 100</strong><span>100</span></div>'
      +'</div>'
      +'<div class="kt-beauty-v2-actions"><button type="button" onclick="if(window.applyAIBeautyPreset)applyAIBeautyPreset()">자동 보정</button><button type="button" class="primary" onclick="closeSheet()">적용</button></div>'
      +'</div>';

    try{
      if(window.showSheet)showSheet('AI 보정',html);
      else return;
      var sh=document.getElementById('sheet');
      if(sh){
        sh.classList.remove('stage-effect-sheet');
        sh.classList.add('camera-effect-sheet','beauty-control-sheet');
      }
      var c=document.getElementById('creator');
      if(c)c.classList.add('beauty-preview-open','beauty-on');
    }catch(e){}
  }

  window.openBeautyPanel=function(){
    try{
      var c=document.getElementById('creator');
      if(c)c.classList.add('beauty-preview-open');
      var lp=c&&c.querySelector('.live-prep');
      if(lp)lp.style.setProperty('display','none','important');
      if(window.ensureLiveCamera)window.ensureLiveCamera((window.state&&state.cameraFacing)||'user').catch(function(){});
    }catch(e){}
    renderBeautyPanel();
  };

  window.resetBeautyAll=function(){
    try{
      state.beautyOn=true;
      state.beautyControl='skin';
      state.beautySkin=78;
      state.beautyWrinkle=68;
      state.beautyBright=66;
      state.beautySharp=54;
      state.beautyFace=50;
      state.beautyEyes=50;
      state.beautyNose=50;
      state.beautyMouth=50;
      state.beautyJaw=50;
    }catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
    renderBeautyPanel();
  };

  /* AI 보정과 편집효과가 가까워서 잘못 열리는 문제를 확실히 분리한다. */
  var lastBeautyTap=0;
  function beautyButton(target){
    if(!target||!target.closest)return null;
    var b=target.closest('button');
    if(!b)return null;
    var aria=String(b.getAttribute('aria-label')||'');
    var txt=String(b.textContent||'').replace(/\s+/g,'');
    if(aria==='AI 보정'||txt.indexOf('AI보정')>-1)return b;
    return null;
  }
  function forceBeauty(e){
    var b=beautyButton(e.target);
    if(!b)return;
    var now=Date.now();
    if(now-lastBeautyTap<180){e.preventDefault();e.stopImmediatePropagation();return;}
    lastBeautyTap=now;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.openBeautyPanel();
  }
  document.addEventListener('pointerup',forceBeauty,true);
  document.addEventListener('click',forceBeauty,true);

  if(!document.getElementById('ktBeautyPanelV2Style')){
    var s=document.createElement('style');
    s.id='ktBeautyPanelV2Style';
    s.textContent=''
      +'#creator .creator-tools .creator-tool-text[aria-label="AI 보정"]{position:relative!important;z-index:60!important;transform:translateY(-16px)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]{position:relative!important;z-index:40!important;transform:translateY(6px)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#sheet.beauty-control-sheet .sheet-inner{max-height:min(66dvh,560px)!important;overflow:auto!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2{padding:4px 2px 8px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-top{display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center!important;gap:8px!important;margin-bottom:9px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-top>b{font-size:17px!important}.kt-beauty-v2-top>span{font-size:10px!important;color:#ccc!important}.kt-beauty-v2-top>button{border:0!important;border-radius:10px!important;padding:7px 9px!important;background:#2b2b33!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button{min-height:54px!important;border:1px solid rgba(255,255,255,.15)!important;border-radius:12px!important;background:#19191f!important;color:#fff!important;padding:5px 2px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button.on{border-color:#ff4db8!important;box-shadow:0 0 0 1px #ff4db8 inset!important;background:#2b1525!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button b{display:block!important;font-size:20px!important;line-height:1!important}#sheet.beauty-control-sheet .kt-beauty-controls-pro button span{display:block!important;margin-top:4px!important;font-size:10px!important;font-weight:900!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-single-group{display:block!important;visibility:visible!important;opacity:1!important;margin-top:10px!important;padding:10px!important;border-radius:14px!important;background:rgba(255,255,255,.07)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-single-row{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-bottom:7px!important}#sheet.beauty-control-sheet #beautySingleLabel{font-weight:900!important}#sheet.beauty-control-sheet #beautySingleValue{font-size:20px!important;font-weight:950!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{display:block!important;width:100%!important;min-width:0!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-scale{display:flex!important;justify-content:space-between!important;margin-top:5px!important;font-size:10px!important;color:#ccc!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-v2-actions{display:grid!important;grid-template-columns:1fr 1.4fr!important;gap:8px!important;margin-top:10px!important}.kt-beauty-v2-actions button{height:42px!important;border:0!important;border-radius:12px!important;background:#2b2b33!important;color:#fff!important;font-weight:900!important}.kt-beauty-v2-actions .primary{background:linear-gradient(135deg,#7046ff,#d63cff)!important}';
    document.head.appendChild(s);
  }

  if(typeof oldOpenCreator==='function'){
    window.openCreator=async function(){
      var r=await oldOpenCreator.apply(this,arguments);
      baseDefaults();
      return r;
    };
  }

  setTimeout(baseDefaults,0);
})();
