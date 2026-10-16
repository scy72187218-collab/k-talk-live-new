/* Creator sound catalog removed; existing camera appearance preserved below. */
/* 2026-09-15 참고 영상과 현재 촬영 화면 비교 후: 촬영 화면 사람 크기·기본 보정만 맞춤. 다른 UI/방/선물은 변경하지 않음. */
(function(){
  if(window.__ktCreatorReferenceLook20260915)return;
  window.__ktCreatorReferenceLook20260915=true;

  function ensureLookStyle(){
    if(document.getElementById('ktCreatorReferenceLookStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktCreatorReferenceLookStyle20260915';
    s.textContent='#creator.creator.camera-on:not(.creator-review) video#camera{transform:scaleX(-1) scale(1)!important;transform-origin:center center!important;}';
    document.head.appendChild(s);
  }

  function tryWiderCamera(){
    try{
      var c=document.getElementById('camera');
      if(!c||!c.srcObject)return;
      var tracks=c.srcObject.getVideoTracks&&c.srcObject.getVideoTracks();
      var track=tracks&&tracks[0];
      if(!track||!track.getCapabilities||!track.applyConstraints)return;
      var caps=track.getCapabilities();
      if(!caps||!caps.zoom)return;
      var min=typeof caps.zoom.min==='number'?caps.zoom.min:1;
      track.applyConstraints({advanced:[{zoom:min}]}).catch(function(){});
    }catch(e){}
  }

  function applyDefaultBeauty(){
    try{
      var saved=localStorage.getItem('ktalk_simple_beauty_preset');
      if(!saved&&typeof window.ktApplySimpleBeautyPreset==='function'){
        localStorage.setItem('ktalk_simple_beauty_preset','strong');
        window.ktApplySimpleBeautyPreset('strong');
      }
    }catch(e){}
  }

  function applyReferenceLook(){
    ensureLookStyle();
    tryWiderCamera();
    applyDefaultBeauty();
  }

  applyReferenceLook();
  [120,350,800,1500].forEach(function(ms){setTimeout(applyReferenceLook,ms);});
  try{
    var c=document.getElementById('camera');
    if(c)c.addEventListener('loadedmetadata',function(){setTimeout(applyReferenceLook,40);});
  }catch(e){}
})();

/* 2026-09-15 참고 화면 고정: AI 보정을 눌러도 사람 크기가 다시 커지지 않게 하고 강한 보정만 조금 더 분명하게. */
(function(){
  if(window.__ktCreatorReferenceBeautyLock20260915)return;
  window.__ktCreatorReferenceBeautyLock20260915=true;

  function lockFrame(name){
    try{
      var c=document.getElementById('camera');
      if(!c)return;
      c.style.setProperty('transform','scaleX(-1) scale(1)','important');
      if(name==='strong')c.style.setProperty('filter','brightness(1.15) saturate(1.08) contrast(.82) blur(.88px)','important');
      if(name==='makeupStrong')c.style.setProperty('filter','brightness(1.16) saturate(1.20) contrast(.82) sepia(.05) hue-rotate(-4deg) blur(.92px)','important');
    }catch(e){}
  }

  function wrapBeauty(){
    try{
      if(typeof window.ktApplySimpleBeautyPreset!=='function'||window.ktApplySimpleBeautyPreset.__ktReferenceLocked)return;
      var original=window.ktApplySimpleBeautyPreset;
      var wrapped=function(name){
        var result=original.apply(this,arguments);
        setTimeout(function(){lockFrame(name);},0);
        return result;
      };
      wrapped.__ktReferenceLocked=true;
      window.ktApplySimpleBeautyPreset=wrapped;
    }catch(e){}
  }

  function apply(){
    wrapBeauty();
    var saved='';
    try{saved=localStorage.getItem('ktalk_simple_beauty_preset')||'';}catch(e){}
    lockFrame(saved);
  }

  apply();
  [50,180,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var c=document.getElementById('camera');
    if(c)c.addEventListener('loadedmetadata',function(){setTimeout(apply,30);});
  }catch(e){}
})();