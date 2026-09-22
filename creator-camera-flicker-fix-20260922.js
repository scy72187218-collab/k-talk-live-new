/* K-Talk creator camera flicker reduction (2026-09-22)
   Creator preview only.
   Locks exposure/white balance at the current settled values when supported
   and removes fractional CSS blur from the live camera to avoid video-compositor flicker.
   No live-room, guest, chat, gift, earnings or switch changes. */
(function(){
  if(window.__ktCreatorCameraFlickerFix20260922)return;
  window.__ktCreatorCameraFlickerFix20260922=true;

  var lockedTrack=null;
  var lockTimer=null;

  function cam(){return document.getElementById('camera');}
  function creator(){return document.getElementById('creator');}
  function isCreatorVisible(){
    var c=creator();
    return !!(c&&c.classList.contains('show')&&!c.classList.contains('creator-review'));
  }

  function stripFractionalBlur(){
    var v=cam();if(!v||!isCreatorVisible())return;
    try{
      var f=v.style.getPropertyValue('filter')||'';
      if(f&&/blur\(/i.test(f)){
        f=f.replace(/\s*blur\([^)]*\)/ig,'').replace(/\s{2,}/g,' ').trim();
        v.style.setProperty('filter',f||'none','important');
        v.style.setProperty('-webkit-filter',f||'none','important');
      }
      v.style.setProperty('transition','none','important');
      v.style.setProperty('animation','none','important');
      v.style.setProperty('will-change','transform,filter','important');
      v.style.setProperty('backface-visibility','hidden','important');
      v.style.setProperty('-webkit-backface-visibility','hidden','important');
    }catch(e){}
  }

  async function applyOne(track,obj){
    try{await track.applyConstraints({advanced:[obj]});return true;}catch(e){return false;}
  }

  async function lockMetering(track){
    if(!track||track===lockedTrack||track.readyState!=='live')return;
    if(!track.getCapabilities||!track.getSettings||!track.applyConstraints)return;

    var caps={},st={};
    try{caps=track.getCapabilities()||{};st=track.getSettings()||{};}catch(e){return;}

    /* Preserve the currently settled exposure instead of choosing a new brightness. */
    try{
      if(Array.isArray(caps.exposureMode)&&caps.exposureMode.indexOf('manual')>-1 &&
         typeof st.exposureTime==='number'&&caps.exposureTime){
        await applyOne(track,{exposureMode:'manual',exposureTime:st.exposureTime});
      }else if(Array.isArray(caps.exposureMode)&&caps.exposureMode.indexOf('single-shot')>-1){
        await applyOne(track,{exposureMode:'single-shot'});
      }
    }catch(e){}

    /* Preserve the current color temperature when the camera exposes it. */
    try{
      st=track.getSettings?track.getSettings()||{}:st;
      if(Array.isArray(caps.whiteBalanceMode)&&caps.whiteBalanceMode.indexOf('manual')>-1 &&
         typeof st.colorTemperature==='number'&&caps.colorTemperature){
        await applyOne(track,{whiteBalanceMode:'manual',colorTemperature:st.colorTemperature});
      }else if(Array.isArray(caps.whiteBalanceMode)&&caps.whiteBalanceMode.indexOf('single-shot')>-1){
        await applyOne(track,{whiteBalanceMode:'single-shot'});
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
      stripFractionalBlur();
    },900);
  }

  function wrapBeauty(){
    var old=window.applyBeautyPreview;
    if(typeof old!=='function'||old.__ktCreatorFlickerStable)return;
    var fn=function(){
      var r=old.apply(this,arguments);
      stripFractionalBlur();
      return r;
    };
    fn.__ktCreatorFlickerStable=true;
    window.applyBeautyPreview=fn;
  }

  function install(){
    wrapBeauty();
    stripFractionalBlur();
    scheduleLock();
  }

  install();
  [150,500,1200,2200].forEach(function(ms){setTimeout(install,ms);});

  var v=cam();
  if(v){
    v.addEventListener('loadedmetadata',function(){lockedTrack=null;scheduleLock();});
    v.addEventListener('playing',function(){stripFractionalBlur();scheduleLock();});
  }

  try{
    var c=creator();
    if(c&&window.MutationObserver){
      new MutationObserver(function(){
        if(isCreatorVisible()){wrapBeauty();stripFractionalBlur();scheduleLock();}
      }).observe(c,{attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&isCreatorVisible()){
      setTimeout(function(){stripFractionalBlur();scheduleLock();},120);
    }
  });
})();