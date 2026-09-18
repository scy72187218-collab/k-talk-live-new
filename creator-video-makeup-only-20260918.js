/* K-Talk 동영상 촬영 화면 전용 메이크업/주름 완화.
   방송방·게스트방·채팅·스위치·버튼·레이아웃은 건드리지 않음. */
(function(){
  if(window.__ktCreatorVideoMakeupOnlyInstalled)return;
  window.__ktCreatorVideoMakeupOnlyInstalled=true;

  function creator(){return document.getElementById('creator');}
  function camera(){return document.getElementById('camera');}
  function active(){
    var c=creator();
    return !!(c&&c.classList.contains('show')&&c.classList.contains('camera-on')&&!c.classList.contains('creator-review'));
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorVideoMakeupOnlyStyle'))return;
    var st=document.createElement('style');
    st.id='ktCreatorVideoMakeupOnlyStyle';
    st.textContent=''
      +'#ktCreatorMakeupLayer{position:absolute!important;inset:0!important;z-index:4!important;pointer-events:none!important;overflow:hidden!important}'
      +'#ktCreatorMakeupAnchor{position:absolute!important;left:50%;top:50%;width:38%;height:32%;transform:translate(-50%,-50%)!important;pointer-events:none!important}'
      +'#ktCreatorMakeupAnchor .kt-makeup-cheek{position:absolute!important;top:51%!important;width:28%!important;height:19%!important;border-radius:50%!important;background:radial-gradient(ellipse at center,rgba(255,92,132,.34) 0%,rgba(255,112,146,.18) 45%,rgba(255,120,150,0) 78%)!important;filter:blur(4px)!important;mix-blend-mode:soft-light!important}'
      +'#ktCreatorMakeupAnchor .kt-makeup-cheek.left{left:7%!important}'
      +'#ktCreatorMakeupAnchor .kt-makeup-cheek.right{right:7%!important}'
      +'#ktCreatorMakeupAnchor .kt-makeup-lip{position:absolute!important;left:34%!important;top:71%!important;width:32%!important;height:11%!important;border-radius:50% 50% 46% 46%!important;background:rgba(186,45,78,.24)!important;filter:blur(.8px)!important;mix-blend-mode:multiply!important}'
      +'#ktCreatorMakeupAnchor .kt-makeup-glow{position:absolute!important;left:16%!important;top:17%!important;width:68%!important;height:58%!important;border-radius:50%!important;box-shadow:inset 0 0 34px rgba(255,230,220,.18)!important;filter:blur(2px)!important}';
    document.head.appendChild(st);
  }

  function ensureLayer(){
    var c=creator(),v=camera();
    if(!c||!v)return null;
    ensureStyle();
    var layer=document.getElementById('ktCreatorMakeupLayer');
    if(!layer){
      layer=document.createElement('div');
      layer.id='ktCreatorMakeupLayer';
      layer.innerHTML='<div id="ktCreatorMakeupAnchor"><span class="kt-makeup-glow"></span><span class="kt-makeup-cheek left"></span><span class="kt-makeup-cheek right"></span><span class="kt-makeup-lip"></span></div>';
      c.appendChild(layer);
    }
    return layer;
  }

  function seed(){
    try{
      if(!window.state)return;
      state.beautyOn=true;
      state.beautySkin=Math.max(Number(state.beautySkin||0),98);
      state.beautyWrinkle=Math.max(Number(state.beautyWrinkle||0),100);
      state.beautyBright=Math.max(Number(state.beautyBright||0),82);
      state.beautyTone=Math.max(Number(state.beautyTone||0),70);
      state.beautyMakeup=Math.max(Number(state.beautyMakeup||0),72);
      state.beautySharp=Math.min(Number(state.beautySharp||44),44);
    }catch(e){}
  }

  function apply(){
    if(!active())return;
    seed();
    var c=creator(),v=camera();
    if(!c||!v)return;
    var filter='brightness(1.135) contrast(.855) saturate(1.095) sepia(.028) blur(1.35px)';
    v.style.setProperty('filter',filter,'important');
    v.style.setProperty('-webkit-filter',filter,'important');
    var bg=document.getElementById('cameraBg');
    if(bg){
      bg.style.setProperty('filter',filter,'important');
      bg.style.setProperty('-webkit-filter',filter,'important');
    }
    var layer=ensureLayer();
    if(layer){
      layer.style.display='block';
      var anchor=document.getElementById('ktCreatorMakeupAnchor');
      try{
        if(window.ktStartFaceTrackingFor&&anchor)window.ktStartFaceTrackingFor(v,layer,anchor,'creator-makeup');
      }catch(e){}
    }
  }

  function hide(){
    var layer=document.getElementById('ktCreatorMakeupLayer');
    if(layer)layer.style.display='none';
    try{if(window.ktStopFaceTrackingFor)window.ktStopFaceTrackingFor('creator-makeup');}catch(e){}
  }

  function after(fn){
    if(typeof fn!=='function')return fn;
    return async function(){
      var r=await fn.apply(this,arguments);
      setTimeout(function(){if(active())apply();else hide();},0);
      setTimeout(function(){if(active())apply();},120);
      return r;
    };
  }

  if(typeof window.openCreator==='function'&&!window.openCreator.__ktMakeupOnly){
    var oldOpen=window.openCreator;
    window.openCreator=after(oldOpen);
    window.openCreator.__ktMakeupOnly=true;
  }
  if(typeof window.ensureLiveCamera==='function'&&!window.ensureLiveCamera.__ktMakeupOnly){
    var oldEnsure=window.ensureLiveCamera;
    window.ensureLiveCamera=after(oldEnsure);
    window.ensureLiveCamera.__ktMakeupOnly=true;
  }
  if(typeof window.applyBeautyPreview==='function'&&!window.applyBeautyPreview.__ktMakeupOnly){
    var oldBeauty=window.applyBeautyPreview;
    var wrapped=function(){
      var r=oldBeauty.apply(this,arguments);
      if(active())setTimeout(apply,0);
      return r;
    };
    wrapped.__ktMakeupOnly=true;
    window.applyBeautyPreview=wrapped;
  }
  if(typeof window.startCreatorRecording==='function'&&!window.startCreatorRecording.__ktMakeupOnly){
    var oldStart=window.startCreatorRecording;
    window.startCreatorRecording=async function(){
      seed();apply();
      var r=await oldStart.apply(this,arguments);
      setTimeout(apply,0);
      return r;
    };
    window.startCreatorRecording.__ktMakeupOnly=true;
  }

  var c=creator();
  if(c&&window.MutationObserver){
    try{
      new MutationObserver(function(){
        if(active())setTimeout(apply,0);else hide();
      }).observe(c,{attributes:true,attributeFilter:['class']});
    }catch(e){}
  }
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&active())setTimeout(apply,80);});
  setTimeout(function(){if(active())apply();},80);
})();