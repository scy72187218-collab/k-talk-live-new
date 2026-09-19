/* K-Talk 카메라 보정 전용 - 투명/복제 레이어 없는 방식.
   원본 카메라 한 장에 밝기/톤/선명도 보정만 적용.
   방송방·게스트방·채팅·스위치·버튼·레이아웃은 건드리지 않음. */
(function(){
  if(window.__ktCreatorNoOverlayBeauty20260919)return;
  window.__ktCreatorNoOverlayBeauty20260919=true;

  function creator(){return document.getElementById('creator');}
  function camera(){return document.getElementById('camera');}

  function removeTransparentLayers(){
    try{
      var old=document.getElementById('ktCreatorFaceBeautyV4');
      if(old&&old.parentNode)old.parentNode.removeChild(old);
    }catch(e){}
    try{
      var bg=document.getElementById('cameraBg');
      if(bg){
        bg.style.setProperty('display','none','important');
        bg.style.setProperty('visibility','hidden','important');
        bg.style.setProperty('opacity','0','important');
        bg.style.setProperty('pointer-events','none','important');
      }
    }catch(e){}
  }

  function applyNaturalTone(){
    var v=camera();
    if(!v)return;
    try{
      /* 기존 AI 보정 슬라이더가 있으면 그 값을 그대로 사용 */
      if(typeof window.applyBeautyPreview==='function'){
        window.applyBeautyPreview();
        return;
      }
    }catch(e){}
    try{
      v.style.setProperty(
        'filter',
        'brightness(1.08) contrast(.97) saturate(1.04)',
        'important'
      );
      v.style.setProperty('-webkit-filter','brightness(1.08) contrast(.97) saturate(1.04)','important');
    }catch(e){}
  }

  function clean(){
    removeTransparentLayers();
    var c=creator();
    if(c&&c.classList.contains('show'))applyNaturalTone();
  }

  /* 녹화 영상에도 얼굴 복제/투명 레이어를 다시 얹지 않는다. */
  window.ktDrawFaceBeautyForRecording=function(){
    return;
  };

  function wrapAsync(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktNoOverlayBeauty)return;
    var fn=async function(){
      removeTransparentLayers();
      var out=await old.apply(this,arguments);
      setTimeout(clean,0);
      setTimeout(clean,100);
      return out;
    };
    fn.__ktNoOverlayBeauty=true;
    window[name]=fn;
  }

  wrapAsync('openCreator');
  wrapAsync('ensureLiveCamera');
  wrapAsync('startCreatorRecording');

  /* AI 보정 값을 바꿀 때도 원본 카메라 한 장만 유지 */
  if(typeof window.applyBeautyPreview==='function'&&!window.applyBeautyPreview.__ktNoOverlayBeauty){
    var oldBeauty=window.applyBeautyPreview;
    var beauty=function(){
      removeTransparentLayers();
      var out=oldBeauty.apply(this,arguments);
      removeTransparentLayers();
      return out;
    };
    beauty.__ktNoOverlayBeauty=true;
    window.applyBeautyPreview=beauty;
  }

  removeTransparentLayers();
  [50,150,400,900,1600].forEach(function(ms){setTimeout(clean,ms);});

  try{
    var c=creator();
    if(c&&window.MutationObserver){
      new MutationObserver(function(){
        clearTimeout(window.__ktNoOverlayBeautyTimer);
        window.__ktNoOverlayBeautyTimer=setTimeout(clean,25);
      }).observe(c,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(clean,50);
  });
})();