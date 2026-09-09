/* K-Talk 카메라 기본 화질 보정 v3: 외모 형태는 자동으로 바꾸지 않고, 노출·색감·선명도·톤을 자연스럽게 정리합니다. */
(function(){
  if(window.__ktCameraNaturalLookV3Installed)return;
  window.__ktCameraNaturalLookV3Installed=true;

  function clamp(v,min,max){v=Number(v);if(!isFinite(v))v=min;return Math.max(min,Math.min(max,v));}

  function getStrength(){
    try{return clamp(state.beautyStrength||68,1,100);}catch(e){return 68;}
  }

  function applyLook(){
    try{
      var s=getStrength();
      var t=s/100;
      var brightness=1.035 + t*0.045;
      var contrast=1.015 + t*0.020;
      var saturation=1.015 + t*0.035;
      var filter='brightness('+brightness.toFixed(3)+') contrast('+contrast.toFixed(3)+') saturate('+saturation.toFixed(3)+')';
      ['camera','cameraBg'].forEach(function(id){
        var v=document.getElementById(id);
        if(!v)return;
        v.style.setProperty('filter',filter,'important');
      });
      document.querySelectorAll('.ktsolo-main video,.ktsubscriber-main video,.ktsecret-main video,.ktg13-host video').forEach(function(v){
        v.style.setProperty('filter',filter,'important');
      });
    }catch(e){}
  }

  function installWrap(){
    try{
      var old=window.applyBeautyPreview;
      if(typeof old==='function'&&!old.__ktNaturalLookV3){
        var wrapped=function(){var r=old.apply(this,arguments);setTimeout(applyLook,0);return r;};
        wrapped.__ktNaturalLookV3=true;
        window.applyBeautyPreview=wrapped;
      }
    }catch(e){}
  }

  try{
    var oldOpen=window.openCreator;
    if(typeof oldOpen==='function'){
      window.openCreator=async function(){var r=await oldOpen.apply(this,arguments);installWrap();setTimeout(applyLook,40);return r;};
    }
  }catch(e){}

  try{
    var oldStart=window.startBroadcast;
    if(typeof oldStart==='function'){
      window.startBroadcast=async function(){var r=await oldStart.apply(this,arguments);installWrap();setTimeout(applyLook,80);return r;};
    }
  }catch(e){}

  installWrap();
  setTimeout(applyLook,0);
  setTimeout(applyLook,250);

  try{
    var mo=new MutationObserver(function(){setTimeout(applyLook,20);});
    mo.observe(document.body,{childList:true,subtree:true});
  }catch(e){}
})();
