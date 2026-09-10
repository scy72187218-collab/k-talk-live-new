/* K-Talk camera quality patch: keep existing UI/rooms intact. Prefer stable HD and reduce only artificial softness from beauty preview. */
(function(){
  if(window.__ktCameraQualityHdFixInstalled)return;
  window.__ktCameraQualityHdFixInstalled=true;

  function liveTrack(){
    try{
      var s=window.state&&state.stream;
      return s&&s.getVideoTracks?s.getVideoTracks().find(function(t){return t.readyState==='live';}):null;
    }catch(e){return null;}
  }

  async function preferHd(){
    var track=liveTrack();
    if(!track||!track.applyConstraints)return false;
    try{
      await track.applyConstraints({
        width:{ideal:1280},
        height:{ideal:720},
        frameRate:{ideal:30,max:30}
      });
      return true;
    }catch(e){
      try{
        await track.applyConstraints({width:{ideal:960},height:{ideal:540},frameRate:{ideal:30,max:30}});
        return true;
      }catch(err){return false;}
    }
  }

  function sharpenBeautyPreview(){
    try{
      if(!window.state||!state.beautyOn)return;
      var cam=document.getElementById('camera');
      if(!cam)return;
      function clamp(v,d){v=Number(v);return isFinite(v)?Math.max(1,Math.min(100,v)):d;}
      var skin=clamp(state.beautySkin,72);
      var bright=clamp(state.beautyBright,58);
      var sharp=clamp(state.beautySharp,68);
      var tone=clamp(state.beautyTone,55);
      var eyes=clamp(state.beautyEyes,50);
      var nose=clamp(state.beautyNose,50);
      var mouth=clamp(state.beautyMouth,50);
      var brightness=1.00+(bright/100)*.105+(eyes-50)*.00035;
      var saturation=.99+(sharp/100)*.07+(mouth-50)*.0008;
      var contrast=.98+(sharp/100)*.11+(nose-50)*.00045;
      var blur=.02+(skin/100)*.20;
      var sepia=Math.max(0,(tone-48)*.0011);
      cam.style.setProperty('filter','brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')','important');
    }catch(e){}
  }

  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'){
    window.ensureLiveCamera=async function(){
      var r=await oldEnsure.apply(this,arguments);
      await preferHd();
      sharpenBeautyPreview();
      return r;
    };
  }

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'){
    window.applyBeautyPreview=function(){
      var r=oldApply.apply(this,arguments);
      sharpenBeautyPreview();
      return r;
    };
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      await preferHd();
      var r=await oldStart.apply(this,arguments);
      await preferHd();
      sharpenBeautyPreview();
      return r;
    };
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(function(){preferHd();sharpenBeautyPreview();},120);
  });

  setTimeout(function(){preferHd();sharpenBeautyPreview();},250);
})();
