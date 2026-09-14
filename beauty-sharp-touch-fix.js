/* K-Talk 카메라 선명도 + 보정 버튼 터치 전용 보강. 다른 화면 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautySharpTouchFixInstalled)return;
  window.__ktBeautySharpTouchFixInstalled=true;

  function clamp(v,min,max){
    v=Number(v);
    if(!isFinite(v))return min;
    return Math.max(min,Math.min(max,v));
  }

  function collectFactors(text,name){
    var re=new RegExp(name+'\\(([-0-9.]+)\\)','gi');
    var out=[],m;
    while((m=re.exec(text)))out.push(Number(m[1]));
    return out.filter(function(v){return isFinite(v);});
  }

  /* 보정 래퍼가 여러 번 실행되며 brightness/contrast/saturate가 계속 겹치는 현상을 막는다. */
  function stabilizeFilter(v){
    if(!v)return;
    try{
      var f=(v.style&&v.style.getPropertyValue('filter'))||'';
      if(!f||f==='none')return;

      f=String(f).replace(/blur\([^)]*\)/gi,'');
      var bs=collectFactors(f,'brightness');
      var cs=collectFactors(f,'contrast');
      var ss=collectFactors(f,'saturate');
      var ps=collectFactors(f,'sepia');

      var brightness=1,contrast=1,saturation=1,sepia=0;
      bs.forEach(function(x){brightness*=x;});
      cs.forEach(function(x){contrast*=x;});
      ss.forEach(function(x){saturation*=x;});
      ps.forEach(function(x){sepia+=x;});

      /* 화이트가 날아가거나 뿌옇게 되지 않도록 자연스러운 범위에서만 유지 */
      brightness=clamp(brightness,.96,1.10);
      contrast=clamp(contrast,.98,1.12);
      saturation=clamp(saturation,.96,1.16);
      sepia=clamp(sepia,0,.05);

      f=f.replace(/brightness\([^)]*\)/gi,'')
         .replace(/contrast\([^)]*\)/gi,'')
         .replace(/saturate\([^)]*\)/gi,'')
         .replace(/sepia\([^)]*\)/gi,'')
         .replace(/\s+/g,' ')
         .trim();

      var stable=(f+' brightness('+brightness.toFixed(3)+') contrast('+contrast.toFixed(3)+') saturate('+saturation.toFixed(3)+') sepia('+sepia.toFixed(3)+') blur(0px)').trim();
      v.style.setProperty('filter',stable,'important');
      v.style.setProperty('-webkit-filter',stable,'important');
    }catch(e){}
  }

  function sharpenCamera(){
    try{
      var selectors=['#camera','#cameraBg','#ktLiveVideo','.ktsolo-main video','.ktsubscriber-main video','.ktsecret-main video','.ktg13-main video','#homeVideo','.video-home video'];
      document.querySelectorAll(selectors.join(',')).forEach(stabilizeFilter);
    }catch(e){}
  }

  /* 같은 카메라 스트림을 가능하면 안정적인 HD(1280x720, 30fps)로 유지한다. 실패하면 기존 화질을 그대로 둔다. */
  async function preferHd(){
    var track=null;
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks)track=s.getVideoTracks().find(function(t){return t.readyState==='live';})||null;
    }catch(e){}
    if(!track||!track.applyConstraints)return false;
    try{
      await track.applyConstraints({width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}});
      return true;
    }catch(e){
      try{
        await track.applyConstraints({width:{ideal:960},height:{ideal:540},frameRate:{ideal:30,max:30}});
        return true;
      }catch(err){return false;}
    }
  }

  function wrapBeauty(){
    try{
      var old=window.applyBeautyPreview;
      if(typeof old!=='function'||old.__ktNoBlurWrapped)return;
      var wrapped=function(){
        var r=old.apply(this,arguments);
        setTimeout(sharpenCamera,0);
        return r;
      };
      wrapped.__ktNoBlurWrapped=true;
      window.applyBeautyPreview=wrapped;
    }catch(e){}
  }

  function beautySheetOpen(){
    var s=document.getElementById('sheet');
    return !!(s&&s.classList.contains('show')&&s.classList.contains('beauty-control-sheet'));
  }

  function touchBeautyButton(e){
    if(!beautySheetOpen())return;
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest('#sheet.beauty-control-sheet .kt-beauty-controls-pro button[data-beauty-kind]');
    if(!btn)return;
    var kind=btn.getAttribute('data-beauty-kind')||'';
    if(!kind)return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(typeof window.selectBeautyControl==='function')window.selectBeautyControl(kind);
      setTimeout(sharpenCamera,0);
    }catch(err){}
  }

  document.addEventListener('touchend',touchBeautyButton,true);
  document.addEventListener('pointerup',function(e){
    if(!beautySheetOpen())return;
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest('#sheet.beauty-control-sheet .kt-beauty-controls-pro button[data-beauty-kind]');
    if(!btn)return;
    var kind=btn.getAttribute('data-beauty-kind')||'';
    if(!kind)return;
    try{if(typeof window.selectBeautyControl==='function')window.selectBeautyControl(kind);}catch(err){}
    setTimeout(sharpenCamera,0);
  },true);

  document.addEventListener('input',function(e){
    var r=e.target;
    if(!r||r.id!=='beautySingleRange'||!beautySheetOpen())return;
    try{if(typeof window.setBeautyActiveValue==='function')window.setBeautyActiveValue(r.value);}catch(err){}
    setTimeout(sharpenCamera,0);
  },true);

  document.addEventListener('loadedmetadata',function(e){
    var v=e.target;
    if(v&&v.tagName==='VIDEO')setTimeout(function(){preferHd();sharpenCamera();},40);
  },true);

  if(!document.getElementById('ktBeautySharpTouchFixStyle')){
    var st=document.createElement('style');
    st.id='ktBeautySharpTouchFixStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro{position:relative!important;z-index:60!important;pointer-events:auto!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:61!important;min-height:52px!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-controls-pro button *{pointer-events:none!important}'
      +'#sheet.beauty-control-sheet #beautySingleRange{pointer-events:auto!important;touch-action:pan-x!important;position:relative!important;z-index:62!important}'
      +'.vh-actions,.vh-actions button,.right-actions,.right-actions button{pointer-events:auto!important;touch-action:manipulation!important}';
    document.head.appendChild(st);
  }

  var oldOpenCreator=window.openCreator;
  if(typeof oldOpenCreator==='function'&&!oldOpenCreator.__ktHdQualityWrapped){
    var wrappedOpen=async function(){
      var r=await oldOpenCreator.apply(this,arguments);
      setTimeout(function(){preferHd();sharpenCamera();},80);
      return r;
    };
    wrappedOpen.__ktHdQualityWrapped=true;
    window.openCreator=wrappedOpen;
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'&&!oldStart.__ktHdQualityWrapped){
    var wrappedStart=async function(){
      await preferHd();
      var r=await oldStart.apply(this,arguments);
      setTimeout(function(){preferHd();sharpenCamera();},100);
      setTimeout(sharpenCamera,350);
      return r;
    };
    wrappedStart.__ktHdQualityWrapped=true;
    window.startBroadcast=wrappedStart;
  }

  wrapBeauty();
  sharpenCamera();
  setTimeout(function(){wrapBeauty();preferHd();sharpenCamera();},100);
  setTimeout(function(){wrapBeauty();preferHd();sharpenCamera();},500);

  try{
    var timer=0;
    new MutationObserver(function(){
      clearTimeout(timer);
      timer=setTimeout(function(){preferHd();sharpenCamera();},25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(function(){preferHd();sharpenCamera();},120);
  });
})();
