/* K-Talk LIVE - moving-person background effects + beauty controls
   Applies to local broadcaster camera in 1 / 9 / 13 / subscriber / secret rooms.
   Uses MediaPipe Selfie Segmentation when available so the person may move while
   the selected stage/ocean/etc background stays behind them.
*/
(function(){
  if(window.__ktStageBeauty20260926)return;
  window.__ktStageBeauty20260926=true;

  var FX={
    active:false,key:'none',original:null,processed:null,video:null,canvas:null,ctx:null,
    segmenter:null,running:false,lastRun:0,
    beauty:{face:0,skin:0,bright:0,eyes:0,lips:0,nose:0,ears:0,chin:0,slim:0,jaw:0}
  };

  var BGS=[
    ['none','없음',''],
    ['stage','콘서트 무대','radial-gradient(circle at 50% 72%,#ffcf70 0 5%,transparent 18%),linear-gradient(135deg,#13051f,#2d0d44 45%,#08020d)'],
    ['neon','네온 무대','linear-gradient(135deg,#050013,#2b006b 40%,#001b40 70%,#050013)'],
    ['club','클럽','radial-gradient(circle at 20% 20%,#ff007733,transparent 28%),radial-gradient(circle at 80% 30%,#00d9ff44,transparent 30%),linear-gradient(#09000e,#1b0025)'],
    ['ocean','바다','linear-gradient(#78d8ff 0 42%,#1d9fd5 42% 66%,#006a9d 66% 100%)'],
    ['sunset','해변 노을','linear-gradient(#ff8a74 0 35%,#ffc774 35% 55%,#285a8a 55% 100%)'],
    ['night','야경','radial-gradient(circle at 75% 18%,#fff7b8 0 2%,transparent 3%),linear-gradient(#06122b,#0b2144 58%,#111 58%)'],
    ['stars','별빛','radial-gradient(circle at 20% 18%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 30%,#fff 0 1px,transparent 2px),radial-gradient(circle at 40% 65%,#fff 0 1px,transparent 2px),linear-gradient(#030313,#0c1030)'],
    ['space','우주','radial-gradient(circle at 70% 24%,#8a5cff 0 7%,transparent 18%),radial-gradient(circle at 25% 64%,#00d7ff55 0 8%,transparent 24%),linear-gradient(#05000e,#13072c)'],
    ['flowers','꽃밭','linear-gradient(#9fe1ff 0 55%,#4da84f 55% 100%)'],
    ['fireworks','폭죽 무대','radial-gradient(circle at 20% 24%,#ffd45c 0 2%,transparent 3%),radial-gradient(circle at 75% 20%,#ff5c9a 0 2%,transparent 3%),linear-gradient(#09031e,#18072b)']
  ];

  function roomActive(){
    return !!document.querySelector('#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room');
  }

  function sourceStream(){
    try{
      if(FX.original&&FX.original.getVideoTracks&&FX.original.getVideoTracks().some(function(t){return t.readyState==='live';}))return FX.original;
      var s=(window.state&&state.stream)||null;
      if(s&&s!==FX.processed&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return s;
      var v=document.getElementById('camera')||document.getElementById('ktLiveVideo');
      s=v&&v.srcObject||null;
      if(s&&s!==FX.processed)return s;
    }catch(e){}
    return null;
  }

  function ensureStyle(){
    if(document.getElementById('ktStageBeautyStyle20260926'))return;
    var s=document.createElement('style');s.id='ktStageBeautyStyle20260926';
    s.textContent=''
      +'.kt-fx-sheet{padding:4px 0 14px;color:#fff}.kt-fx-title{font-weight:950;font-size:14px;margin:4px 0 9px}.kt-fx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.kt-fx-bg{height:58px;border:1px solid #ffffff33;border-radius:12px;color:#fff;font-weight:900;text-shadow:0 1px 4px #000;background:#17171b;background-size:cover!important}.kt-fx-bg.on{outline:2px solid #50d8ff;outline-offset:1px}.kt-fx-note{font-size:10px;color:#bbb;margin:8px 2px 2px;line-height:1.4}.kt-beauty-row{display:grid;grid-template-columns:76px 1fr 34px;gap:7px;align-items:center;margin:8px 0}.kt-beauty-row label{font-size:11px;font-weight:900}.kt-beauty-row input{width:100%}.kt-beauty-row output{text-align:right;font-size:10px;color:#9fe7ff}.kt-beauty-reset{width:100%;height:38px;margin-top:8px;border:0;border-radius:10px;background:#22242a;color:#fff;font-weight:900}';
    document.head.appendChild(s);
  }

  function sheet(title,html){
    ensureStyle();
    if(typeof window.showSheet==='function'){window.showSheet(title,html);return;}
    alert(title);
  }

  function bgDef(key){
    for(var i=0;i<BGS.length;i++)if(BGS[i][0]===key)return BGS[i];
    return BGS[0];
  }

  function loadSegmenter(){
    if(FX.segmenter)return Promise.resolve(FX.segmenter);
    if(window.SelfieSegmentation){
      try{
        FX.segmenter=new SelfieSegmentation({locateFile:function(f){return 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/'+f;}});
        FX.segmenter.setOptions({modelSelection:1,selfieMode:true});
        FX.segmenter.onResults(onResults);
        return Promise.resolve(FX.segmenter);
      }catch(e){}
    }
    return new Promise(function(resolve,reject){
      var id='ktMediaPipeSelfieSegmentation';
      var old=document.getElementById(id);
      if(old){
        old.addEventListener('load',function(){loadSegmenter().then(resolve).catch(reject);},{once:true});
        setTimeout(function(){if(window.SelfieSegmentation)loadSegmenter().then(resolve).catch(reject);},500);
        return;
      }
      var sc=document.createElement('script');sc.id=id;sc.async=true;
      sc.src='https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
      sc.onload=function(){loadSegmenter().then(resolve).catch(reject);};
      sc.onerror=function(){reject(new Error('segmentation load failed'));};
      document.head.appendChild(sc);
    });
  }

  function ensurePipeline(){
    var src=sourceStream(); if(!src)return Promise.reject(new Error('camera stream missing'));
    if(!FX.original||FX.original===FX.processed)FX.original=src;

    if(!FX.video){
      FX.video=document.createElement('video');
      FX.video.autoplay=true;FX.video.muted=true;FX.video.playsInline=true;
      FX.video.style.display='none';document.body.appendChild(FX.video);
    }
    FX.video.srcObject=FX.original;
    try{var p=FX.video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}

    if(!FX.canvas){
      FX.canvas=document.createElement('canvas');FX.canvas.width=720;FX.canvas.height=1280;
      FX.canvas.style.display='none';document.body.appendChild(FX.canvas);
      FX.ctx=FX.canvas.getContext('2d',{alpha:false});
    }
    var tr=FX.original.getVideoTracks&&FX.original.getVideoTracks()[0];
    try{
      var st=tr&&tr.getSettings?tr.getSettings():{};
      if(st.width&&st.height){FX.canvas.width=st.width;FX.canvas.height=st.height;}
    }catch(e){}

    return loadSegmenter().then(function(){
      if(!FX.running){FX.running=true;requestAnimationFrame(loop);}
      return true;
    });
  }

  function drawBackground(ctx,w,h){
    var d=bgDef(FX.key);
    if(FX.key==='none'){ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);return;}
    var off=document.createElement('canvas');off.width=2;off.height=2;
    // Canvas gradients approximating selected visual scene.
    var g=ctx.createLinearGradient(0,0,0,h);
    var k=FX.key;
    if(k==='ocean'){g.addColorStop(0,'#78d8ff');g.addColorStop(.42,'#78d8ff');g.addColorStop(.43,'#1d9fd5');g.addColorStop(1,'#006a9d');}
    else if(k==='sunset'){g.addColorStop(0,'#ff846e');g.addColorStop(.45,'#ffc36c');g.addColorStop(.56,'#456f9d');g.addColorStop(1,'#17385e');}
    else if(k==='flowers'){g.addColorStop(0,'#99dcff');g.addColorStop(.54,'#bdeaff');g.addColorStop(.55,'#4da84f');g.addColorStop(1,'#245f2d');}
    else if(k==='night'){g.addColorStop(0,'#06122b');g.addColorStop(.6,'#0b2144');g.addColorStop(.61,'#111');g.addColorStop(1,'#030303');}
    else if(k==='stage'){g.addColorStop(0,'#16051f');g.addColorStop(.55,'#40104d');g.addColorStop(1,'#07010c');}
    else if(k==='neon'){g.addColorStop(0,'#050013');g.addColorStop(.5,'#2b006b');g.addColorStop(1,'#001b40');}
    else if(k==='club'){g.addColorStop(0,'#120019');g.addColorStop(.5,'#220029');g.addColorStop(1,'#08000d');}
    else if(k==='space'){g.addColorStop(0,'#05000e');g.addColorStop(.55,'#13072c');g.addColorStop(1,'#010207');}
    else if(k==='fireworks'){g.addColorStop(0,'#09031e');g.addColorStop(1,'#18072b');}
    else {g.addColorStop(0,'#030313');g.addColorStop(1,'#0c1030');}
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

    if(['stage','neon','club','space','fireworks','stars'].indexOf(k)>-1){
      var colors=['#ff4aa2','#56e7ff','#ffd65c','#8c6cff'];
      for(var i=0;i<18;i++){
        var x=(i*137)%w,y=(i*83)%(h*.72),r=(i%4)+1;
        ctx.fillStyle=colors[i%colors.length];ctx.globalAlpha=.65;
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
    }
    if(k==='stage'||k==='fireworks'){
      ctx.fillStyle='rgba(255,224,120,.12)';
      ctx.beginPath();ctx.moveTo(w*.18,0);ctx.lineTo(w*.42,h);ctx.lineTo(w*.02,h);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(w*.82,0);ctx.lineTo(w*.98,h);ctx.lineTo(w*.58,h);ctx.closePath();ctx.fill();
    }
  }

  function hasBeauty(){
    try{return Object.keys(FX.beauty).some(function(k){return Number(FX.beauty[k]||0)>0;});}catch(e){return false;}
  }

  function beautyFilter(){
    var b=FX.beauty;
    var bright=100+Math.round((b.bright+b.face)*.12);
    var sat=100+Math.round((b.lips+b.skin)*.08);
    var contrast=100-Math.round(b.skin*.05);
    return 'brightness('+bright+'%) saturate('+sat+'%) contrast('+contrast+'%)';
  }

  function ensureSafeBeautyPipeline(){
    var src=sourceStream(); if(!src)return Promise.reject(new Error('camera stream missing'));
    if(!FX.original||FX.original===FX.processed)FX.original=src;

    if(!FX.video){
      FX.video=document.createElement('video');
      FX.video.autoplay=true;FX.video.muted=true;FX.video.playsInline=true;
      FX.video.style.display='none';document.body.appendChild(FX.video);
    }
    FX.video.srcObject=FX.original;
    try{var p=FX.video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}

    if(!FX.canvas){
      FX.canvas=document.createElement('canvas');FX.canvas.width=720;FX.canvas.height=1280;
      FX.canvas.style.display='none';document.body.appendChild(FX.canvas);
      FX.ctx=FX.canvas.getContext('2d',{alpha:false});
    }
    try{
      var tr=FX.original.getVideoTracks&&FX.original.getVideoTracks()[0];
      var st=tr&&tr.getSettings?tr.getSettings():{};
      if(st.width&&st.height){FX.canvas.width=st.width;FX.canvas.height=st.height;}
    }catch(e){}
    if(!FX.running){FX.running=true;requestAnimationFrame(loop);}
    return Promise.resolve(true);
  }

  function drawSafeBeautyFrame(){
    if(FX.active||!hasBeauty()||!FX.ctx||!FX.canvas||!FX.video||FX.video.readyState<2)return;
    try{
      var x=FX.ctx,c=FX.canvas,w=c.width,h=c.height;
      x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='source-over';
      x.clearRect(0,0,w,h);x.filter=beautyFilter();

      /* Stable TikTok-style basic beauty: keep the full real background and
         apply light skin/brightness/color smoothing to the outgoing frame.
         No person-segmentation AI is used in this mode. */
      var slim=1-Math.min(.055,Number(FX.beauty.slim||0)/1800);
      var face=1-Math.min(.035,Number(FX.beauty.face||0)/2800);
      var sx=slim*face;
      var pad=w*(1-sx)/2;
      x.translate(w/2,0);x.scale(sx,1);x.translate(-w/2,0);
      x.drawImage(FX.video,-pad,0,w+pad*2,h);
      x.restore();
      ensureProcessedStream();
    }catch(e){try{FX.ctx.restore();}catch(_e){}}
  }

  function onResults(res){
    if(!FX.active||!FX.ctx||!FX.canvas)return;
    var c=FX.canvas,x=FX.ctx,w=c.width,h=c.height;
    try{
      x.save();x.clearRect(0,0,w,h);
      x.filter='none';
      x.drawImage(res.segmentationMask,0,0,w,h);
      x.globalCompositeOperation='source-in';
      x.filter=beautyFilter();
      var slim=1-Math.min(.10,FX.beauty.slim/1000);
      var face=1-Math.min(.06,FX.beauty.face/1600);
      var sx=slim*face;
      x.translate(w/2,0);x.scale(sx,1);x.translate(-w/2,0);
      var pad=w*(1-sx)/2;
      x.drawImage(res.image,-pad,0,w+pad*2,h);
      x.setTransform(1,0,0,1,0,0);
      x.globalCompositeOperation='destination-over';x.filter='none';
      drawBackground(x,w,h);
      x.restore();
      ensureProcessedStream();
    }catch(e){try{x.restore();}catch(_e){}}
  }

  function ensureProcessedStream(){
    if(FX.processed)return;
    try{
      var cv=FX.canvas.captureStream?FX.canvas.captureStream(30):null;if(!cv)return;
      var tracks=cv.getVideoTracks();
      var audio=(FX.original&&FX.original.getAudioTracks?FX.original.getAudioTracks():[]).filter(function(t){return t.readyState==='live';});
      FX.processed=new MediaStream(tracks.concat(audio));
      applyOutputStream(FX.processed);
    }catch(e){}
  }

  function applyOutputStream(stream){
    if(!stream)return;
    try{if(window.state)state.stream=stream;}catch(e){}
    document.querySelectorAll('#screen .ktsolo-room video,#screen .ktg9-room video,#screen .ktg13-room .ktg13-host video,#screen .ktsubscriber-room .ktsubscriber-host video,#screen .ktsecret-room .host video,#ktLiveVideo').forEach(function(v){
      try{if(v.srcObject!==stream)v.srcObject=stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    });
    try{window.dispatchEvent(new CustomEvent('kt-local-video-stream-changed',{detail:{stream:stream,at:Date.now()}}));}catch(e){}
  }

  function stopEffect(){
    FX.active=false;FX.key='none';
    if(FX.original){applyOutputStream(FX.original);}
    try{if(FX.processed)FX.processed.getVideoTracks().forEach(function(t){t.stop();});}catch(e){}
    FX.processed=null;
  }

  function loop(ts){
    if(!FX.running)return;
    if(ts-FX.lastRun<40){requestAnimationFrame(loop);return;}
    FX.lastRun=ts;

    if(FX.active){
      /* AI is used only when the user explicitly picks a background. */
      try{
        if(FX.segmenter&&FX.video&&FX.video.readyState>=2){
          Promise.resolve(FX.segmenter.send({image:FX.video})).catch(function(){});
        }
      }catch(e){}
    }else if(hasBeauty()){
      drawSafeBeautyFrame();
    }

    requestAnimationFrame(loop);
  }

  function chooseBg(key,btn){
    if(key==='none'){stopEffect();markSelected('none');return;}
    FX.key=key;FX.active=true;
    ensurePipeline().then(function(){markSelected(key);}).catch(function(){
      FX.active=false;
      sheet('배경 효과','<div class="rowbox">이 휴대폰에서는 AI 배경 분리 모듈을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.</div>');
    });
  }

  function markSelected(key){
    document.querySelectorAll('.kt-fx-bg').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-fx')===key);});
  }

  window.ktChooseStageBackground20260926=function(key,el){chooseBg(String(key||'none'),el);};

  window.openEditEffectPanel=function(){
    var html='<div class="kt-fx-sheet"><div class="kt-fx-title">🎬 움직이는 배경 효과</div><div class="kt-fx-grid">';
    BGS.forEach(function(b){
      var bg=b[2]?(' style="background:'+b[2]+'"'):'';
      html+='<button class="kt-fx-bg'+(FX.key===b[0]?' on':'')+'" data-fx="'+b[0]+'" onclick="ktChooseStageBackground20260926(\''+b[0]+'\',this)"'+bg+'>'+b[1]+'</button>';
    });
    html+='</div><div class="kt-fx-note">기본 방송은 AI를 사용하지 않습니다. <b>여기서 배경을 선택할 때만 AI 배경 분리</b>가 켜집니다. 사람이 움직여도 배경을 유지하며, 기기 성능에 따라 가장자리 품질은 달라질 수 있습니다.</div></div>';
    sheet('편집 · 효과',html);
  };

  function beautySlider(key,label){
    var v=Number(FX.beauty[key]||0);
    return '<div class="kt-beauty-row"><label>'+label+'</label><input type="range" min="0" max="100" value="'+v+'" oninput="ktBeautySet20260926(\''+key+'\',this.value,this.nextElementSibling)"><output>'+v+'</output></div>';
  }

  window.ktBeautySet20260926=function(key,val,out){
    val=Math.max(0,Math.min(100,Number(val)||0));FX.beauty[key]=val;if(out)out.textContent=String(val);
    try{localStorage.setItem('ktalk_beauty_20260926',JSON.stringify(FX.beauty));}catch(e){}

    /* Default beauty is intentionally non-AI for stability. It keeps the real
       camera background and sends the filtered frame to viewers. */
    if(!FX.active){
      if(hasBeauty())ensureSafeBeautyPipeline().catch(function(){});
      else{
        try{
          if(FX.original)applyOutputStream(FX.original);
          if(FX.processed)FX.processed.getVideoTracks().forEach(function(t){t.stop();});
        }catch(e){}
        FX.processed=null;
      }
    }
  };

  window.ktBeautyReset20260926=function(){
    Object.keys(FX.beauty).forEach(function(k){FX.beauty[k]=0;});
    try{localStorage.removeItem('ktalk_beauty_20260926');}catch(e){}
    window.openBeautyPanel();
  };

  window.openBeautyPanel=function(){
    var html='<div class="kt-fx-sheet"><div class="kt-fx-title">✨ 얼굴 보정 1~100</div>'
      +beautySlider('face','전체 보정')+beautySlider('skin','피부')+beautySlider('bright','밝기')
      +beautySlider('eyes','눈')+beautySlider('lips','입술')+beautySlider('nose','코')
      +beautySlider('ears','귀')+beautySlider('chin','턱')+beautySlider('slim','얼굴 작게')+beautySlider('jaw','턱선')
      +'<button class="kt-beauty-reset" onclick="ktBeautyReset20260926()">전체 초기화</button>'
      +'<div class="kt-fx-note"><b>기본 보정은 AI 없이 안정적으로 작동</b>합니다. 피부·밝기·전체 얼굴/얼굴 작게는 실시간 영상에 적용됩니다. 입술·코·귀·턱의 정밀 형태 변경은 휴대폰 AI 얼굴 추적이 필요한 기능이라 기기별로 제한될 수 있습니다.</div></div>';
    sheet('편집 · 보정',html);
  };

  /* Make each room's existing 효과 button open the same editor. */
  var aliases=['ktSoloEffect','ktSubscriberEffect','ktSecretEffect','ktGroup13Effect'];
  aliases.forEach(function(name){
    try{window[name]=function(){window.openEditEffectPanel();};}catch(e){}
  });

  try{
    var saved=JSON.parse(localStorage.getItem('ktalk_beauty_20260926')||'null');
    if(saved)Object.keys(FX.beauty).forEach(function(k){if(saved[k]!=null)FX.beauty[k]=Math.max(0,Math.min(100,Number(saved[k])||0));});
  }catch(e){}

  ensureStyle();
})();
