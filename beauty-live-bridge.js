/* K-Talk: 1인 방송 라이브 화면에 기존 AI 보정(1~100)을 연결. 다른 방송 UI는 변경하지 않음. */
(function(){
  if(window.__ktBeautyLiveBridgeInstalled)return;
  window.__ktBeautyLiveBridgeInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function liveBeautyStyle(){
    var skin=clamp(window.state&&state.beautySkin,88);
    var wrinkle=clamp(window.state&&state.beautyWrinkle,72);
    var bright=clamp(window.state&&state.beautyBright,70);
    var sharp=clamp(window.state&&state.beautySharp,50);
    var tone=clamp(window.state&&state.beautyTone,58);
    var face=clamp(window.state&&state.beautyFace,50);
    var jaw=clamp(window.state&&state.beautyJaw,50);

    var smooth=Math.max(skin,Math.round(55+wrinkle*.43));
    var brightness=0.96+(bright/100)*0.18;
    var saturation=0.98+(tone/100)*0.12;
    var contrast=1.02-(smooth/100)*0.07+(sharp/100)*0.04;
    var blur=Math.max(0,(smooth-55)*0.010);
    var sepia=Math.max(0,(tone-45)*.0018);
    var scale=1+(face-50)*0.0008+(50-jaw)*0.00035;

    return {
      filter:'brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')',
      transform:'scaleX(-1) scale('+scale.toFixed(3)+')'
    };
  }

  window.ktSyncLiveBeauty=function(){
    try{
      var s=liveBeautyStyle();
      document.querySelectorAll('.ktsolo-main video,.ktsubscriber-main video,.ktsecret-main video,.ktg13-main video').forEach(function(v){
        v.style.setProperty('filter',s.filter,'important');
        v.style.setProperty('transform',s.transform,'important');
      });
    }catch(e){}
  };

  var oldApply=window.applyBeautyPreview;
  if(typeof oldApply==='function'&&!oldApply.__ktLiveBeautyBridge){
    var wrapped=function(){
      var r=oldApply.apply(this,arguments);
      setTimeout(window.ktSyncLiveBeauty,0);
      return r;
    };
    wrapped.__ktLiveBeautyBridge=true;
    window.applyBeautyPreview=wrapped;
  }

  function openChooser(){
    if(typeof window.showSheet!=='function')return;
    showSheet('효과 · AI 보정',
      '<button class="act" onclick="closeSheet();setTimeout(function(){if(window.openBeautyPanel)openBeautyPanel();},20)">✨ AI 보정 1~100</button>'+
      '<button class="act" onclick="closeSheet();setTimeout(function(){if(window.openEditEffectPanel)openEditEffectPanel();},20)" style="margin-top:8px;background:linear-gradient(135deg,#6f41ff,#d13cff)">🎭 틱톡 효과 · 배경</button>'
    );
  }

  if(typeof window.ktSoloEffect==='function'){
    window.ktSoloEffect=openChooser;
  }

  try{
    var host=document.getElementById('screen');
    if(host&&window.MutationObserver){
      new MutationObserver(function(){setTimeout(window.ktSyncLiveBeauty,0);}).observe(host,{childList:true,subtree:true});
    }
  }catch(e){}

  document.addEventListener('input',function(e){
    if(e.target&&e.target.id==='beautySingleRange')setTimeout(window.ktSyncLiveBeauty,0);
  },true);

  setTimeout(window.ktSyncLiveBeauty,120);
})();