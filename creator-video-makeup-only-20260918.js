/* K-Talk 카메라 얼굴 보정 전용.
   카메라를 켜면 얼굴을 추적해서 피부/주름/톤/아주 약한 메이크업만 적용.
   방송방·게스트방·채팅·스위치·버튼·레이아웃은 건드리지 않음. */
(function(){
  if(window.__ktCreatorFaceBeautyV4Installed)return;
  window.__ktCreatorFaceBeautyV4Installed=true;

  var landmarkerPromise=null;
  var latest=null;
  var raf=0;
  var busy=false;
  var lastAt=0;

  var FACE_OVAL=[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
  var LEFT_EYE=[33,160,158,133,153,144];
  var RIGHT_EYE=[362,385,387,263,373,380];
  var MOUTH=[61,146,91,181,84,17,314,405,321,375,291,308,324,318,402,317,14,87,178,88,95,78];

  function creator(){return document.getElementById('creator');}
  function camera(){return document.getElementById('camera');}
  function active(){
    var c=creator();
    return !!(c&&c.classList.contains('show')&&c.classList.contains('camera-on')&&!c.classList.contains('creator-review'));
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorFaceBeautyV4Style'))return;
    var s=document.createElement('style');
    s.id='ktCreatorFaceBeautyV4Style';
    s.textContent=''
      +'#ktCreatorFaceBeautyV4{position:absolute!important;inset:0!important;z-index:4!important;pointer-events:none!important;overflow:hidden!important}'
      +'#ktCreatorFaceBeautyCanvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function ensureLayer(){
    var c=creator();
    if(!c)return null;
    ensureStyle();
    var layer=document.getElementById('ktCreatorFaceBeautyV4');
    if(!layer){
      layer=document.createElement('div');
      layer.id='ktCreatorFaceBeautyV4';
      layer.innerHTML='<canvas id="ktCreatorFaceBeautyCanvas"></canvas>';
      c.appendChild(layer);
    }
    return layer;
  }

  function loadLandmarker(){
    if(landmarkerPromise)return landmarkerPromise;
    landmarkerPromise=(async function(){
      try{
        var mod=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/+esm');
        var vision=await mod.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm');
        return await mod.FaceLandmarker.createFromOptions(vision,{
          baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'},
          runningMode:'VIDEO',
          numFaces:1,
          minFaceDetectionConfidence:.45,
          minFacePresenceConfidence:.45,
          minTrackingConfidence:.45,
          outputFaceBlendshapes:false,
          outputFacialTransformationMatrixes:false
        });
      }catch(e){
        return null;
      }
    })();
    return landmarkerPromise;
  }

  function setNeutralCameraLook(){
    var f='brightness(1.045) contrast(.970) saturate(1.025)';
    ['camera','cameraBg'].forEach(function(id){
      var v=document.getElementById(id);
      if(!v)return;
      v.style.setProperty('filter',f,'important');
      v.style.setProperty('-webkit-filter',f,'important');
    });
  }

  function coverMap(v,w,h,mirror){
    var vw=v.videoWidth||w,vh=v.videoHeight||h;
    var sc=Math.max(w/vw,h/vh);
    var dw=vw*sc,dh=vh*sc,dx=(w-dw)/2,dy=(h-dh)/2;
    return {
      dx:dx,dy:dy,dw:dw,dh:dh,
      point:function(lm){
        return {x:(mirror?(w-(dx+lm.x*dw)):(dx+lm.x*dw)),y:dy+lm.y*dh};
      }
    };
  }

  function pathFrom(ctx,landmarks,indices,map){
    if(!landmarks||!indices.length)return;
    var p=map.point(landmarks[indices[0]]);
    ctx.moveTo(p.x,p.y);
    for(var i=1;i<indices.length;i++){
      p=map.point(landmarks[indices[i]]);
      ctx.lineTo(p.x,p.y);
    }
    ctx.closePath();
  }

  function drawMirroredVideo(ctx,v,w,map){
    ctx.save();
    ctx.translate(w,0);
    ctx.scale(-1,1);
    ctx.drawImage(v,map.dx,map.dy,map.dw,map.dh);
    ctx.restore();
  }

  function drawBeauty(ctx,w,h,v,landmarks,map,recording){
    if(!landmarks||!landmarks.length)return;

    /* 피부 부분만 부드럽게 합성하고 눈/입은 선명하게 남김 */
    ctx.save();
    ctx.beginPath();
    pathFrom(ctx,landmarks,FACE_OVAL,map);
    pathFrom(ctx,landmarks,LEFT_EYE,map);
    pathFrom(ctx,landmarks,RIGHT_EYE,map);
    pathFrom(ctx,landmarks,MOUTH,map);
    try{ctx.clip('evenodd');}catch(e){ctx.clip();}
    ctx.globalAlpha=recording?.58:.62;
    ctx.filter=recording
      ?'blur(2.8px) brightness(1.085) contrast(.890) saturate(1.040)'
      :'blur(2.4px) brightness(1.080) contrast(.895) saturate(1.040)';
    drawMirroredVideo(ctx,v,w,map);
    ctx.restore();

    /* 얇은 베이스 메이크업 */
    ctx.save();
    ctx.beginPath();
    pathFrom(ctx,landmarks,FACE_OVAL,map);
    ctx.clip();
    ctx.globalAlpha=.060;
    ctx.fillStyle='rgb(255,226,215)';
    ctx.fillRect(0,0,w,h);
    ctx.restore();

    function pt(i){return map.point(landmarks[i]);}

    /* 볼은 아주 연하게 */
    var lc=pt(205),rc=pt(425);
    [lc,rc].forEach(function(p){
      var radius=Math.max(12,w*.035);
      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);
      g.addColorStop(0,'rgba(229,91,112,.135)');
      g.addColorStop(.45,'rgba(229,91,112,.065)');
      g.addColorStop(1,'rgba(229,91,112,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,radius,0,Math.PI*2);
      ctx.fill();
    });

    /* 입술은 본래 모양을 따라 아주 약하게 */
    ctx.save();
    ctx.beginPath();
    pathFrom(ctx,landmarks,MOUTH,map);
    ctx.globalAlpha=.16;
    ctx.fillStyle='rgb(165,55,78)';
    ctx.filter='blur(.45px)';
    ctx.fill();
    ctx.restore();

    /* 눈가 밝기만 살짝 */
    [pt(159),pt(386)].forEach(function(p){
      var r=Math.max(8,w*.022);
      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
      g.addColorStop(0,'rgba(255,245,236,.085)');
      g.addColorStop(1,'rgba(255,245,236,0)');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
    });
  }

  async function detect(now){
    if(busy||now-lastAt<70)return;
    var v=camera();
    if(!active()||!v||v.readyState<2||!v.videoWidth)return;
    busy=true;lastAt=now;
    try{
      var lm=await loadLandmarker();
      if(!lm)return;
      var r=lm.detectForVideo(v,Math.round(performance.now()));
      if(r&&r.faceLandmarks&&r.faceLandmarks.length)latest=r.faceLandmarks[0];
    }catch(e){}finally{busy=false;}
  }

  function frame(now){
    raf=requestAnimationFrame(frame);
    if(!active())return;
    var c=creator(),v=camera(),layer=ensureLayer();
    var canvas=document.getElementById('ktCreatorFaceBeautyCanvas');
    if(!c||!v||!layer||!canvas)return;
    detect(now);

    var r=c.getBoundingClientRect();
    if(!r.width||!r.height)return;
    var dpr=Math.min(2,window.devicePixelRatio||1);
    var W=Math.round(r.width*dpr),H=Math.round(r.height*dpr);
    if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
    var ctx=canvas.getContext('2d');
    if(!ctx)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,r.width,r.height);
    if(latest&&v.readyState>=2){
      var map=coverMap(v,r.width,r.height,true);
      drawBeauty(ctx,r.width,r.height,v,latest,map,false);
    }
  }

  function start(){
    if(!active())return;
    setNeutralCameraLook();
    var l=ensureLayer();
    if(l)l.style.display='block';
    if(!raf)raf=requestAnimationFrame(frame);
    loadLandmarker();
  }

  function stop(){
    var l=document.getElementById('ktCreatorFaceBeautyV4');
    if(l)l.style.display='none';
    if(raf){cancelAnimationFrame(raf);raf=0;}
  }

  window.ktDrawFaceBeautyForRecording=function(ctx,w,h,v,dx,dy,dw,dh){
    try{
      if(!latest||!ctx||!v)return;
      var map={
        dx:dx,dy:dy,dw:dw,dh:dh,
        point:function(lm){return {x:w-(dx+lm.x*dw),y:dy+lm.y*dh};}
      };
      drawBeauty(ctx,w,h,v,latest,map,true);
    }catch(e){}
  };

  function wrapAsync(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktFaceBeautyV4)return;
    var wrapped=async function(){
      var r=await old.apply(this,arguments);
      setTimeout(function(){if(active())start();else stop();},0);
      setTimeout(function(){if(active())start();},120);
      return r;
    };
    wrapped.__ktFaceBeautyV4=true;
    window[name]=wrapped;
  }

  wrapAsync('openCreator');
  wrapAsync('ensureLiveCamera');

  if(typeof window.applyBeautyPreview==='function'&&!window.applyBeautyPreview.__ktFaceBeautyV4){
    var oldBeauty=window.applyBeautyPreview;
    var wrappedBeauty=function(){
      var r;
      try{r=oldBeauty.apply(this,arguments);}catch(e){}
      if(active())setTimeout(start,0);
      return r;
    };
    wrappedBeauty.__ktFaceBeautyV4=true;
    window.applyBeautyPreview=wrappedBeauty;
  }

  if(typeof window.startCreatorRecording==='function'&&!window.startCreatorRecording.__ktFaceBeautyV4){
    var oldStart=window.startCreatorRecording;
    var wrappedStart=async function(){
      start();
      return await oldStart.apply(this,arguments);
    };
    wrappedStart.__ktFaceBeautyV4=true;
    window.startCreatorRecording=wrappedStart;
  }

  var c=creator();
  if(c&&window.MutationObserver){
    try{
      new MutationObserver(function(){if(active())setTimeout(start,0);else stop();})
        .observe(c,{attributes:true,attributeFilter:['class']});
    }catch(e){}
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&active())setTimeout(start,80);
  });

  setTimeout(function(){if(active())start();},100);
})();