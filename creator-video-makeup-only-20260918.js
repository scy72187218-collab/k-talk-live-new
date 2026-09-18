/* K-Talk 동영상 촬영 화면 전용 자연 보정.
   동영상 촬영 화면만: 피부/주름 완화 + 아주 약한 메이크업.
   방송방·게스트방·채팅·스위치·버튼·레이아웃은 건드리지 않음. */
(function(){
  if(window.__ktCreatorVideoMakeupOnlyInstalled)return;
  window.__ktCreatorVideoMakeupOnlyInstalled=true;

  var raf=0;

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
      +'#ktCreatorMakeupCanvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;pointer-events:none!important}'
      +'#ktCreatorMakeupAnchor{position:absolute!important;left:50%;top:39%;width:170px;height:205px;transform:translate(-50%,-50%)!important;opacity:0!important;pointer-events:none!important}';
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
      layer.innerHTML='<canvas id="ktCreatorMakeupCanvas"></canvas><div id="ktCreatorMakeupAnchor"></div>';
      c.appendChild(layer);
    }
    return layer;
  }

  function seed(){
    try{
      if(!window.state)return;
      state.beautyOn=true;
      state.beautySkin=Math.max(Number(state.beautySkin||0),92);
      state.beautyWrinkle=Math.max(Number(state.beautyWrinkle||0),96);
      state.beautyBright=Math.max(Number(state.beautyBright||0),76);
      state.beautyTone=Math.max(Number(state.beautyTone||0),62);
      state.beautyMakeup=Math.max(Number(state.beautyMakeup||0),56);
      state.beautySharp=Math.min(Number(state.beautySharp||48),48);
    }catch(e){}
  }

  function baseVideoLook(){
    var f='brightness(1.055) contrast(.945) saturate(1.040)';
    var v=camera();
    if(v){
      v.style.setProperty('filter',f,'important');
      v.style.setProperty('-webkit-filter',f,'important');
    }
    var bg=document.getElementById('cameraBg');
    if(bg){
      bg.style.setProperty('filter',f,'important');
      bg.style.setProperty('-webkit-filter',f,'important');
    }
  }

  function drawVideoCover(ctx,v,w,h){
    var vw=v.videoWidth||w,vh=v.videoHeight||h;
    var s=Math.max(w/vw,h/vh);
    var dw=vw*s,dh=vh*s,dx=(w-dw)/2,dy=(h-dh)/2;
    ctx.translate(w,0);
    ctx.scale(-1,1);
    ctx.drawImage(v,dx,dy,dw,dh);
  }

  function paint(){
    raf=requestAnimationFrame(paint);
    if(!active())return;

    var c=creator(),v=camera();
    var layer=document.getElementById('ktCreatorMakeupLayer');
    var canvas=document.getElementById('ktCreatorMakeupCanvas');
    var anchor=document.getElementById('ktCreatorMakeupAnchor');
    if(!c||!v||!layer||!canvas||!anchor||v.readyState<2||!v.videoWidth)return;

    var cr=c.getBoundingClientRect();
    var ar=anchor.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;

    var dpr=Math.min(2,window.devicePixelRatio||1);
    var cw=Math.round(cr.width*dpr),ch=Math.round(cr.height*dpr);
    if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
    var ctx=canvas.getContext('2d');
    if(!ctx)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,cr.width,cr.height);

    var x=(ar.left-cr.left),y=(ar.top-cr.top);
    var fw=ar.width,fh=ar.height;
    var cx=x+fw/2,cy=y+fh/2;

    /* 얼굴 안쪽만 부드럽게 덮어 주어 배경/머리카락은 흐리지 않음 */
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx,cy+fh*.01,fw*.39,fh*.42,0,0,Math.PI*2);
    ctx.clip();
    ctx.globalAlpha=.70;
    ctx.filter='blur(1.45px) brightness(1.060) contrast(.900) saturate(1.035)';
    try{drawVideoCover(ctx,v,cr.width,cr.height);}catch(e){}
    ctx.restore();

    /* BB크림처럼 아주 옅은 피부 톤 */
    ctx.save();
    ctx.globalAlpha=.055;
    ctx.fillStyle='rgb(255,226,216)';
    ctx.beginPath();
    ctx.ellipse(cx,cy,fw*.36,fh*.39,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    /* 볼터치: 둥근 스티커처럼 보이지 않도록 아주 약하게 */
    function cheek(px){
      var g=ctx.createRadialGradient(px,cy+fh*.055,0,px,cy+fh*.055,fw*.105);
      g.addColorStop(0,'rgba(236,92,116,.075)');
      g.addColorStop(.45,'rgba(236,92,116,.035)');
      g.addColorStop(1,'rgba(236,92,116,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.ellipse(px,cy+fh*.055,fw*.12,fh*.075,0,0,Math.PI*2);
      ctx.fill();
    }
    cheek(cx-fw*.225);cheek(cx+fw*.225);

    /* 입술색도 매우 약하게 */
    ctx.save();
    ctx.globalAlpha=.10;
    ctx.filter='blur(.55px)';
    ctx.fillStyle='rgb(165,57,78)';
    ctx.beginPath();
    ctx.ellipse(cx,cy+fh*.225,fw*.105,fh*.030,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function startFace(){
    var layer=ensureLayer(),v=camera();
    if(!layer||!v)return;
    var anchor=document.getElementById('ktCreatorMakeupAnchor');
    try{
      if(window.ktStartFaceTrackingFor&&anchor)window.ktStartFaceTrackingFor(v,layer,anchor,'creator-makeup');
    }catch(e){}
    if(!raf)raf=requestAnimationFrame(paint);
  }

  function apply(){
    if(!active())return;
    seed();
    baseVideoLook();
    var layer=ensureLayer();
    if(layer)layer.style.display='block';
    startFace();
  }

  function hide(){
    var layer=document.getElementById('ktCreatorMakeupLayer');
    if(layer)layer.style.display='none';
    try{if(window.ktStopFaceTrackingFor)window.ktStopFaceTrackingFor('creator-makeup');}catch(e){}
    if(raf){cancelAnimationFrame(raf);raf=0;}
  }

  function after(fn){
    if(typeof fn!=='function')return fn;
    return async function(){
      var r=await fn.apply(this,arguments);
      setTimeout(function(){if(active())apply();else hide();},0);
      setTimeout(function(){if(active())apply();},140);
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