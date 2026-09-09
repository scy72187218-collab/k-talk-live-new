/* K-Talk 카메라 화면 보정: 피부톤/밝기/부드러움/색감/선명도 1~100 + 라이브 적용. 다른 방송 UI는 건드리지 않음. */
(function(){
  if(window.__ktBeautyVisibleLiveFixInstalled)return;
  window.__ktBeautyVisibleLiveFixInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function ensureDefaults(){
    try{
      if(!(Number(state.beautySoft)>0))state.beautySoft=62;
      if(!(Number(state.beautyBright)>0))state.beautyBright=58;
      if(!(Number(state.beautyTone)>0))state.beautyTone=55;
      if(!(Number(state.beautySharp)>0))state.beautySharp=52;
      if(!(Number(state.beautyColor)>0))state.beautyColor=55;
      state.beautyOn=true;
    }catch(e){}
  }

  function filterString(){
    ensureDefaults();
    var soft=clamp(state.beautySoft,62);
    var bright=clamp(state.beautyBright,58);
    var tone=clamp(state.beautyTone,55);
    var sharp=clamp(state.beautySharp,52);
    var color=clamp(state.beautyColor,55);
    var brightness=(0.92+bright*0.0030).toFixed(3);
    var saturation=(0.90+color*0.0022).toFixed(3);
    var softContrast=Math.max(0.90,0.98-(soft-50)*0.0008);
    var contrast=(softContrast+(sharp-50)*0.0010).toFixed(3);
    var sepia=Math.max(0,(tone-50)*0.0015).toFixed(3);
    return 'brightness('+brightness+') saturate('+saturation+') contrast('+contrast+') sepia('+sepia+')';
  }

  function setFilterOnce(v,f){
    if(!v)return;
    try{
      if(v.dataset&&v.dataset.ktBeautyFilter===f)return;
      v.style.setProperty('filter',f,'important');
      if(v.dataset)v.dataset.ktBeautyFilter=f;
    }catch(e){}
  }

  function applyBeauty(){
    var f=filterString();
    setFilterOnce(document.getElementById('camera'),f);
    setFilterOnce(document.getElementById('cameraBg'),f);
    setFilterOnce(document.getElementById('ktLiveVideo'),f);
    try{
      var c=document.getElementById('creator');
      if(c)c.classList.add('beauty-on');
    }catch(e){}
  }

  var applyTimer=0;
  function scheduleBeauty(delay){
    try{clearTimeout(applyTimer);}catch(e){}
    applyTimer=setTimeout(applyBeauty,Math.max(40,delay||70));
  }

  window.ktBeautySet=function(key,value){
    value=clamp(value,50);
    try{state[key]=value;}catch(e){}
    var out=document.getElementById('ktb-'+key+'-v');
    if(out)out.textContent=value;
    applyBeauty();
  };

  function row(key,label){
    var value=clamp(state[key],50);
    return '<div class="ktb-row"><div class="ktb-label"><b>'+label+'</b><strong id="ktb-'+key+'-v">'+value+'</strong></div>'+
      '<input type="range" min="1" max="100" value="'+value+'" oninput="ktBeautySet(\''+key+'\',this.value)">'+
      '<div class="ktb-scale"><span>1</span><span>100</span></div></div>';
  }

  window.openBeautyPanel=function(){
    ensureDefaults();
    var html='<div class="ktb-wrap">'+
      '<div class="ktb-note">카메라 화면 보정 · 각 항목 1~100</div>'+
      row('beautySoft','부드러움')+
      row('beautyBright','밝기')+
      row('beautyTone','톤')+
      row('beautyColor','색감')+
      row('beautySharp','선명도')+
      '<div class="ktb-actions"><button onclick="ktBeautyReset()">기본값</button><button class="on" onclick="closeSheet()">적용</button></div></div>';
    if(window.showSheet)showSheet('✨ 카메라 보정',html);
    var sh=document.getElementById('sheet');
    if(sh)sh.classList.add('beauty-control-sheet');
    applyBeauty();
  };

  window.ktBeautyReset=function(){
    try{
      state.beautySoft=62;state.beautyBright=58;state.beautyTone=55;state.beautyColor=55;state.beautySharp=52;
    }catch(e){}
    if(window.openBeautyPanel)window.openBeautyPanel();
  };

  function injectLiveButton(){
    var live=document.getElementById('ktLiveVideo');
    if(!live)return;
    if(document.getElementById('ktLiveBeautyQuick'))return;
    scheduleBeauty(80);
    var host=live.parentElement;
    if(!host)return;
    var b=document.createElement('button');
    b.id='ktLiveBeautyQuick';
    b.type='button';
    b.innerHTML='✨<small>보정</small>';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();openBeautyPanel();};
    host.appendChild(b);
    try{
      if(!live.dataset.ktBeautyPlayingHook){
        live.dataset.ktBeautyPlayingHook='1';
        live.addEventListener('playing',function(){scheduleBeauty(80);},{once:true});
      }
    }catch(e){}
  }

  if(!document.getElementById('ktBeautyVisibleLiveStyle')){
    var s=document.createElement('style');
    s.id='ktBeautyVisibleLiveStyle';
    s.textContent=''
      +'#sheet.beauty-control-sheet .sheet-inner{max-height:86dvh!important;overflow:auto!important}'
      +'#sheet.beauty-control-sheet .ktb-wrap{padding:4px 0 8px!important}'
      +'#sheet.beauty-control-sheet .ktb-note{margin:0 0 8px;padding:8px 10px;border-radius:11px;background:rgba(125,70,255,.15);color:#fff;text-align:center;font-size:12px;font-weight:900}'
      +'#sheet.beauty-control-sheet .ktb-row{margin:7px 0;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.06)}'
      +'#sheet.beauty-control-sheet .ktb-label{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;color:#fff;font-size:13px}'
      +'#sheet.beauty-control-sheet .ktb-label strong{min-width:38px;text-align:center;color:#ffe075;font-size:17px}'
      +'#sheet.beauty-control-sheet .ktb-row input{display:block;width:100%;margin:0}'
      +'#sheet.beauty-control-sheet .ktb-scale{display:flex;justify-content:space-between;margin-top:2px;color:#aaa;font-size:9px}'
      +'#sheet.beauty-control-sheet .ktb-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}'
      +'#sheet.beauty-control-sheet .ktb-actions button{min-height:42px;border:1px solid #ffffff22;border-radius:12px;background:#222;color:#fff;font-weight:900}'
      +'#sheet.beauty-control-sheet .ktb-actions button.on{border:0;background:linear-gradient(135deg,#7b4dff,#dd38e8)}'
      +'#ktLiveBeautyQuick{position:absolute!important;right:10px!important;top:154px!important;z-index:12!important;width:54px!important;height:54px!important;border-radius:50%!important;border:1px solid #ffffff44!important;background:#151018df!important;color:#fff!important;font-size:19px!important;font-weight:900!important;display:grid!important;place-items:center!important;line-height:1!important}'
      +'#ktLiveBeautyQuick small{display:block!important;margin-top:-9px!important;font-size:8px!important;color:#fff!important}'
      +'#camera,#cameraBg,#ktLiveVideo{-webkit-backface-visibility:hidden!important;backface-visibility:hidden!important;}';
    document.head.appendChild(s);
  }

  var oldOpenCreator=window.openCreator;
  if(typeof oldOpenCreator==='function'){
    window.openCreator=async function(){
      var r=await oldOpenCreator.apply(this,arguments);
      scheduleBeauty(90);
      return r;
    };
  }

  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'){
    window.ensureLiveCamera=async function(){
      var r=await oldEnsure.apply(this,arguments);
      scheduleBeauty(90);
      return r;
    };
  }

  var mo=new MutationObserver(function(){
    var live=document.getElementById('ktLiveVideo');
    if(live&&!document.getElementById('ktLiveBeautyQuick'))setTimeout(injectLiveButton,0);
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
  ensureDefaults();
  scheduleBeauty(80);
  setTimeout(injectLiveButton,0);
})();