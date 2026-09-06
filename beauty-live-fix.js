/* K-Talk beauty controls fix: clear AI beauty without making the whole camera blurry. */
(function(){
  if(window.__ktBeautyWorkingFixLoaded)return;
  window.__ktBeautyWorkingFixLoaded=true;

  function clamp(v,min,max){v=Number(v);return Math.max(min,Math.min(max,isFinite(v)?v:min));}
  function cam(){return document.getElementById('camera');}
  function targets(){
    var list=[];
    ['camera','ktLiveVideo','ktCreatorPreview'].forEach(function(id){var el=document.getElementById(id);if(el&&list.indexOf(el)<0)list.push(el);});
    return list;
  }
  function markActive(mode){
    document.querySelectorAll('[data-kt-beauty-mode]').forEach(function(btn){btn.classList.toggle('on',btn.getAttribute('data-kt-beauty-mode')===mode);});
  }
  function updateMasterUI(){
    var r=document.getElementById('ktBeautyMasterRange');
    var v=document.getElementById('ktBeautyMasterValue');
    var n=clamp((window.state&&state.beautyMaster)||72,1,100);
    if(r)r.value=n;
    if(v)v.textContent=Math.round(n);
  }

  window.applyBeautyPreview=function(){
    if(!window.state)return;
    var master=clamp(state.beautyMaster||72,1,100);
    var skin=clamp(state.beautySkin||72,1,100);
    var bright=clamp(state.beautyBright||68,1,100);
    var tone=clamp(state.beautyTone||58,1,100);
    var sharp=clamp(state.beautySharp||68,1,100);
    var face=clamp(state.beautyFace||50,1,100);
    var makeup=!!state.beautyMakeup;

    var smooth=Math.max(0,(skin-1)/99);
    var strength=Math.max(0,(master-1)/99);

    /* TikTok-style target: keep camera crisp, then add light skin/tone correction. */
    var brightness=1.00+(bright-50)*0.0024+strength*0.035;
    var saturation=1.00+(tone-50)*0.0028+strength*0.025+(makeup?0.075:0);
    var contrast=1.025+(sharp-50)*0.0022-smooth*0.018;
    var blur=smooth*(0.07+strength*0.09);
    var sepia=Math.max(0,(tone-50))*0.00045+(makeup?0.020:0);
    var hue=makeup?-2:0;
    var filter='brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+') hue-rotate('+hue+'deg)';

    targets().forEach(function(el){
      try{
        el.style.setProperty('filter',filter,'important');
        el.style.setProperty('-webkit-filter',filter,'important');
        el.style.setProperty('image-rendering','auto','important');
      }catch(e){}
    });

    var c=cam();
    if(c){
      var faceScale=1+(face-50)*0.0008;
      c.style.setProperty('transform','scaleX(-1) scale('+faceScale.toFixed(3)+')','important');
    }
    try{if(window.creator)creator.classList.toggle('beauty-on',master>1||skin>1||makeup);}catch(e){}
  };

  window.setBeautyMaster=function(value){
    if(!window.state)return;
    var n=clamp(value,1,100);
    state.beautyMaster=n;
    state.beautySkin=Math.round(55+n*0.35);
    state.beautyBright=Math.round(56+n*0.22);
    state.beautyTone=Math.round(50+n*0.18);
    state.beautySharp=Math.round(60+n*0.14);
    applyBeautyPreview();
    updateMasterUI();
    markActive('beauty');
  };

  window.applyAIBeautyPreset=function(){
    if(!window.state)return;
    state.beautyMaster=88;
    state.beautySkin=86;
    state.beautyBright=72;
    state.beautyTone=61;
    state.beautySharp=76;
    state.beautyFace=52;
    state.beautyEyes=50;
    state.beautyNose=50;
    state.beautyMouth=51;
    state.beautyMakeup=false;
    applyBeautyPreview();
    updateMasterUI();
    markActive('ai');
  };

  window.applyStrongBeautyPreset=function(){
    if(!window.state)return;
    state.beautyMaster=100;
    state.beautySkin=94;
    state.beautyBright=78;
    state.beautyTone=65;
    state.beautySharp=74;
    state.beautyFace=53;
    state.beautyMakeup=false;
    applyBeautyPreview();
    updateMasterUI();
    markActive('strong');
  };

  window.toggleMakeupBeauty=function(){
    if(!window.state)return;
    state.beautyMakeup=!state.beautyMakeup;
    if(state.beautyMakeup){
      state.beautyMaster=Math.max(Number(state.beautyMaster||0),84);
      state.beautySkin=Math.max(Number(state.beautySkin||0),84);
      state.beautyBright=Math.max(Number(state.beautyBright||0),74);
      state.beautyTone=Math.max(Number(state.beautyTone||0),68);
      state.beautySharp=Math.max(Number(state.beautySharp||0),72);
    }
    applyBeautyPreview();
    updateMasterUI();
    markActive(state.beautyMakeup?'makeup':'beauty');
  };

  window.resetBeautyAll=function(){
    if(!window.state)return;
    state.beautyMaster=50;state.beautySkin=50;state.beautyFace=50;state.beautyEyes=50;state.beautyNose=50;state.beautyMouth=50;state.beautyTone=50;state.beautyBright=50;state.beautySharp=50;state.beautyMakeup=false;
    targets().forEach(function(el){try{el.style.removeProperty('filter');el.style.removeProperty('-webkit-filter');}catch(e){}});
    var c=cam();if(c){try{c.style.removeProperty('transform');}catch(e){}}
    updateMasterUI();
    markActive('beauty');
  };

  window.openBeautyPanel=function(){
    try{if(window.creator)creator.classList.add('beauty-preview-open');}catch(e){}
    try{var lp=window.creator&&creator.querySelector('.live-prep');if(lp)lp.style.setProperty('display','none','important');}catch(e){}
    try{if(window.ensureLiveCamera)window.ensureLiveCamera((window.state&&state.cameraFacing)||'user').catch(function(){});}catch(e){}
    if(window.state&&state.beautyMaster==null)state.beautyMaster=72;

    var value=Math.round(clamp((window.state&&state.beautyMaster)||72,1,100));
    var html=''
      +'<div class="kt-beauty-panel kt-beauty-panel-pro" style="pointer-events:auto">'
      +'<div class="kt-beauty-pro-tabs" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">'
      +'<button type="button" data-kt-beauty-mode="ai" onclick="applyAIBeautyPreset()" style="touch-action:manipulation">AI 최적화</button>'
      +'<button type="button" data-kt-beauty-mode="beauty" onclick="setBeautyMaster(document.getElementById(\'ktBeautyMasterRange\').value)" style="touch-action:manipulation">Beauty</button>'
      +'<button type="button" data-kt-beauty-mode="makeup" onclick="toggleMakeupBeauty()" style="touch-action:manipulation">메이크업</button>'
      +'<button type="button" data-kt-beauty-mode="strong" onclick="applyStrongBeautyPreset()" style="touch-action:manipulation">강한 보정</button>'
      +'</div>'
      +'<div class="kt-beauty-slider-group" style="margin-top:16px">'
      +'<div class="kt-beauty-slider-row"><span>Beauty</span><input id="ktBeautyMasterRange" type="range" min="1" max="100" value="'+value+'" oninput="setBeautyMaster(this.value)" style="touch-action:pan-x"><b id="ktBeautyMasterValue">'+value+'</b></div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px">'
      +'<button type="button" onclick="state.beautySkin=92;state.beautySharp=Math.max(Number(state.beautySharp||0),72);applyBeautyPreview();markBeautyTap(this)" style="min-height:46px">피부 정돈</button>'
      +'<button type="button" onclick="state.beautyBright=80;applyBeautyPreview();markBeautyTap(this)" style="min-height:46px">밝기</button>'
      +'<button type="button" onclick="state.beautyTone=68;state.beautySharp=Math.max(Number(state.beautySharp||0),70);applyBeautyPreview();markBeautyTap(this)" style="min-height:46px">톤</button>'
      +'</div>'
      +'<div class="kt-beauty-pro-actions" style="margin-top:14px"><button onclick="resetBeautyAll()">초기화</button><button class="primary" onclick="closeSheet()">적용</button></div>'
      +'</div>';
    if(typeof window.showSheet==='function')showSheet('뷰티',html);
    try{if(window.sheet)sheet.classList.add('camera-effect-sheet','beauty-control-sheet');}catch(e){}
    applyBeautyPreview();
    setTimeout(function(){markActive('beauty');},0);
  };

  window.markBeautyTap=function(btn){
    if(!btn)return;btn.classList.add('on');setTimeout(function(){btn.classList.remove('on');},180);
  };

  try{
    var mo=new MutationObserver(function(muts){
      var needs=false;
      for(var i=0;i<muts.length;i++){
        for(var j=0;j<muts[i].addedNodes.length;j++){
          var n=muts[i].addedNodes[j];
          if(n&&n.nodeType===1&&(n.id==='ktLiveVideo'||(n.querySelector&&n.querySelector('#ktLiveVideo')))){needs=true;break;}
        }
        if(needs)break;
      }
      if(needs)setTimeout(function(){try{applyBeautyPreview();}catch(e){}},40);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
