/* K-Talk creator camera flicker reduction (2026-09-22)
   Creator preview only.
   Applies beauty tone once without fractional blur and locks settled camera metering where supported.
   No live-room, guest, chat, gift, earnings or switch changes. */
(function(){
  if(window.__ktCreatorCameraFlickerFix20260922)return;
  window.__ktCreatorCameraFlickerFix20260922=true;

  var lockedTrack=null;
  var lockTimer=null;
  var originalBeauty=window.applyBeautyPreview;

  function cam(){return document.getElementById('camera');}
  function creator(){return document.getElementById('creator');}
  function isCreatorVisible(){
    var c=creator();
    return !!(c&&c.classList.contains('show')&&!c.classList.contains('creator-review'));
  }
  function clamp(v,d){
    v=Number(v);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  /* Write one stable filter only. Do not write blur first and remove it afterward. */
  function stableBeauty(){
    if(!isCreatorVisible()){
      if(typeof originalBeauty==='function')return originalBeauty.apply(this,arguments);
      return;
    }
    var v=cam();if(!v)return;

    var st=window.state||{};
    var skin=clamp(st.beautySkin,72);
    var bright=clamp(st.beautyBright,68);
    var sharp=clamp(st.beautySharp,52);
    var face=clamp(st.beautyFace,50);
    var eyes=clamp(st.beautyEyes,50);
    var nose=clamp(st.beautyNose,50);
    var mouth=clamp(st.beautyMouth,50);
    var tone=clamp(st.beautyTone,58);

    var brightness=1.00+(bright/100)*.18+(eyes-50)*.0007;
    var saturation=.98+(sharp/100)*.10+(mouth-50)*.0014;
    var contrast=.94+(sharp/100)*.08+(nose-50)*.0007;
    var sepia=Math.max(0,(tone-45)*.0018);
    var faceScale=1+(face-50)*.0008;

    var filter='brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') sepia('+sepia.toFixed(3)+')';
    var transform='scaleX(-1) scale('+faceScale.toFixed(3)+')';

    try{
      if(v.style.getPropertyValue('filter')!==filter){
        v.style.setProperty('filter',filter,'important');
        v.style.setProperty('-webkit-filter',filter,'important');
      }
      if(v.style.getPropertyValue('transform')!==transform){
        v.style.setProperty('transform',transform,'important');
      }
      v.style.setProperty('transition','none','important');
      v.style.setProperty('animation','none','important');
      v.style.setProperty('transform-origin','50% 50%','important');
      v.style.setProperty('backface-visibility','hidden','important');
      v.style.setProperty('-webkit-backface-visibility','hidden','important');
      v.style.removeProperty('will-change');
    }catch(e){}
  }
  stableBeauty.__ktCreatorFlickerStable=true;

  async function applyOne(track,obj){
    try{await track.applyConstraints({advanced:[obj]});return true;}catch(e){return false;}
  }

  async function lockMetering(track){
    if(!track||track===lockedTrack||track.readyState!=='live')return;
    if(!track.getCapabilities||!track.getSettings||!track.applyConstraints)return;

    var caps={},settings={};
    try{caps=track.getCapabilities()||{};settings=track.getSettings()||{};}catch(e){return;}

    try{
      if(Array.isArray(caps.exposureMode)&&caps.exposureMode.indexOf('manual')>-1 &&
         typeof settings.exposureTime==='number'&&caps.exposureTime){
        await applyOne(track,{exposureMode:'manual',exposureTime:settings.exposureTime});
      }
    }catch(e){}

    try{
      settings=track.getSettings?track.getSettings()||{}:settings;
      if(Array.isArray(caps.whiteBalanceMode)&&caps.whiteBalanceMode.indexOf('manual')>-1 &&
         typeof settings.colorTemperature==='number'&&caps.colorTemperature){
        await applyOne(track,{whiteBalanceMode:'manual',colorTemperature:settings.colorTemperature});
      }
    }catch(e){}

    lockedTrack=track;
  }

  function scheduleLock(){
    clearTimeout(lockTimer);
    lockTimer=setTimeout(function(){
      var v=cam(),track=null;
      try{track=v&&v.srcObject&&v.srcObject.getVideoTracks&&v.srcObject.getVideoTracks()[0];}catch(e){}
      if(track&&track!==lockedTrack)lockMetering(track);
      stableBeauty();
    },900);
  }

  function install(){
    /* If another camera helper replaces the beauty function later, keep creator preview on this single-pass path. */
    if(window.applyBeautyPreview!==stableBeauty){
      if(typeof window.applyBeautyPreview==='function'&&!window.applyBeautyPreview.__ktCreatorFlickerStable){
        originalBeauty=window.applyBeautyPreview;
      }
      window.applyBeautyPreview=stableBeauty;
    }
    stableBeauty();
    scheduleLock();
  }

  install();
  [120,350,800,1500,2600].forEach(function(ms){setTimeout(install,ms);});

  var v=cam();
  if(v){
    v.addEventListener('loadedmetadata',function(){lockedTrack=null;scheduleLock();});
    v.addEventListener('playing',function(){stableBeauty();scheduleLock();});
  }

  try{
    var c=creator();
    if(c&&window.MutationObserver){
      new MutationObserver(function(){
        if(isCreatorVisible())setTimeout(install,30);
      }).observe(c,{attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&isCreatorVisible()){
      setTimeout(install,120);
    }
  });
})();