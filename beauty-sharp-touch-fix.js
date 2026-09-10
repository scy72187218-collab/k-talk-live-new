/* K-Talk 카메라 선명도 + 보정 버튼 터치 전용 보강. 다른 화면 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautySharpTouchFixInstalled)return;
  window.__ktBeautySharpTouchFixInstalled=true;

  function removeBlur(v){
    if(!v)return;
    try{
      var f=(v.style&&v.style.getPropertyValue('filter'))||'';
      if(f){
        f=String(f).replace(/blur\([^)]*\)/gi,'blur(0px)');
        v.style.setProperty('filter',f,'important');
        v.style.setProperty('-webkit-filter',f,'important');
      }
    }catch(e){}
  }

  function sharpenCamera(){
    try{
      var selectors=['#camera','#cameraBg','#ktLiveVideo','.ktsolo-main video','.ktsubscriber-main video','.ktsecret-main video','.ktg13-main video','#homeVideo','.video-home video'];
      document.querySelectorAll(selectors.join(',')).forEach(removeBlur);
    }catch(e){}
  }

  function wrapBeauty(){
    try{
      var old=window.applyBeautyPreview;
      if(typeof old!=='function'||old.__ktNoBlurWrapped)return;
      var wrapped=function(){
        var r=old.apply(this,arguments);
        sharpenCamera();
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

  wrapBeauty();
  sharpenCamera();
  setTimeout(function(){wrapBeauty();sharpenCamera();},100);
  setTimeout(function(){wrapBeauty();sharpenCamera();},500);

  try{
    new MutationObserver(function(){setTimeout(sharpenCamera,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
