/* K-Talk AI 보정: 장식용 얼굴 스티커 대신 실제 카메라 화질 조절만 표시/적용. */
(function(){
  if(window.__ktRealCameraControlsInstalled)return;
  window.__ktRealCameraControlsInstalled=true;

  var defaults={bright:60,contrast:50,color:54,warm:52,sharp:52,soft:42};
  var neutral={bright:50,contrast:50,color:50,warm:50,sharp:50,soft:1};
  var map={
    bright:{label:'밝기',key:'ktRealBright'},
    contrast:{label:'대비',key:'ktRealContrast'},
    color:{label:'색감',key:'ktRealColor'},
    warm:{label:'따뜻함',key:'ktRealWarm'},
    sharp:{label:'선명도',key:'ktRealSharp'},
    soft:{label:'부드러움',key:'ktRealSoft'}
  };

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }
  function get(kind){
    var m=map[kind];
    if(!m)return 50;
    var v=0;
    try{v=Number(state[m.key]);}catch(e){}
    return v>0?clamp(v,defaults[kind]):defaults[kind];
  }
  function setState(kind,v){
    var m=map[kind];
    if(!m)return;
    v=clamp(v,defaults[kind]);
    try{state[m.key]=v;state.ktRealCameraAdjustmentsOn=true;}catch(e){}
  }
  function filterString(){
    var bright=get('bright'),contrast=get('contrast'),color=get('color'),warm=get('warm'),sharp=get('sharp'),soft=get('soft');
    var b=1+(bright-50)*0.0032;
    var c=1+(contrast-50)*0.0030+(sharp-50)*0.0010;
    var s=1+(color-50)*0.0030;
    var sep=Math.max(0,warm-50)*0.0020;
    var hue=Math.min(0,(50-warm)*0.10);
    var blur=Math.max(0,(soft-1))*0.0045;
    return 'brightness('+b.toFixed(3)+') contrast('+c.toFixed(3)+') saturate('+s.toFixed(3)+') sepia('+sep.toFixed(3)+') hue-rotate('+hue.toFixed(1)+'deg) blur('+blur.toFixed(2)+'px)';
  }
  function apply(){
    var f=filterString();
    ['camera','cameraBg'].forEach(function(id){
      var v=document.getElementById(id);
      if(!v)return;
      v.style.setProperty('filter',f,'important');
    });
    try{var c=document.getElementById('creator');if(c)c.classList.add('beauty-on');}catch(e){}
  }
  function seed(){
    Object.keys(defaults).forEach(function(k){
      var m=map[k];
      try{if(!(Number(state[m.key])>0))state[m.key]=defaults[k];}catch(e){}
    });
    try{state.ktRealCameraAdjustmentsOn=true;}catch(e){}
    apply();
  }

  function row(kind){
    var m=map[kind],v=get(kind);
    return '<div class="kt-real-beauty-row">'
      +'<div><b>'+m.label+'</b><strong id="ktRealVal-'+kind+'">'+v+'</strong></div>'
      +'<input type="range" min="1" max="100" value="'+v+'" oninput="ktSetRealBeauty(\''+kind+'\',this.value)">'
      +'<div class="kt-real-scale"><span>1</span><span>100</span></div>'
      +'</div>';
  }

  window.ktSetRealBeauty=function(kind,value){
    setState(kind,value);
    var out=document.getElementById('ktRealVal-'+kind);
    if(out)out.textContent=get(kind);
    apply();
  };
  window.ktRealBeautyAuto=function(){
    Object.keys(defaults).forEach(function(k){setState(k,defaults[k]);});
    apply();
    window.ktOpenRealBeautyPanel();
  };
  window.ktRealBeautyNeutral=function(){
    Object.keys(neutral).forEach(function(k){setState(k,neutral[k]);});
    apply();
    window.ktOpenRealBeautyPanel();
  };

  window.ktOpenRealBeautyPanel=function(){
    seed();
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('beauty-preview-open');
      var lp=creator&&creator.querySelector('.live-prep');
      if(lp)lp.style.setProperty('display','none','important');
      if(window.ensureLiveCamera)window.ensureLiveCamera((window.state&&state.cameraFacing)||'user').then(function(){apply();}).catch(function(){});
    }catch(e){}

    var html='<div class="kt-real-beauty">'
      +'<div class="kt-real-beauty-note"><b>카메라 보정</b><span>하트·꽃·동물 효과 없이 실제 화면 조절만 합니다.</span></div>'
      +'<div class="kt-real-beauty-grid">'
        +row('bright')+row('contrast')+row('color')+row('warm')+row('sharp')+row('soft')
      +'</div>'
      +'<div class="kt-real-beauty-actions"><button onclick="ktRealBeautyNeutral()">기본</button><button onclick="ktRealBeautyAuto()">자동 보정</button><button class="primary" onclick="closeSheet()">적용</button></div>'
      +'</div>';
    if(window.showSheet){
      showSheet('카메라 보정',html);
      var sheet=document.getElementById('sheet');
      if(sheet)sheet.classList.add('camera-effect-sheet','beauty-control-sheet','kt-real-beauty-sheet');
    }
  };

  /* 기존 AI 보정 호출은 전부 실제 조절 패널로 보냄. 편집효과는 그대로 분리 유지. */
  window.openBeautyPanel=window.ktOpenRealBeautyPanel;

  function isBeautyButton(btn){
    if(!btn)return false;
    if(btn.matches&&btn.matches('#creator .creator-tool-text[aria-label="AI 보정"]'))return true;
    if(btn.classList&&btn.classList.contains('prep-item')){
      var t=String(btn.textContent||'').replace(/\s+/g,'');
      return t.indexOf('AI보정')>-1||t==='보정';
    }
    return false;
  }
  ['pointerdown','click'].forEach(function(type){
    document.addEventListener(type,function(e){
      var btn=e.target&&e.target.closest?e.target.closest('button'):null;
      if(!isBeautyButton(btn))return;
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      if(type==='pointerdown')setTimeout(window.ktOpenRealBeautyPanel,0);
    },true);
  });

  if(!document.getElementById('ktRealBeautyStyle')){
    var st=document.createElement('style');
    st.id='ktRealBeautyStyle';
    st.textContent=''
      +'#sheet.kt-real-beauty-sheet .sheet-inner{max-height:78dvh!important;overflow:auto!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty{padding:4px 2px 8px!important;color:#fff!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-note{padding:8px 10px!important;margin-bottom:7px!important;border-radius:12px!important;background:rgba(255,255,255,.07)!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-note b{display:block!important;font-size:15px!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-note span{display:block!important;margin-top:2px!important;font-size:11px!important;color:#ddd!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-row{padding:8px 9px!important;border-radius:12px!important;background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.10)!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-row>div:first-child{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-row b{font-size:12px!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-row strong{font-size:14px!important;color:#cfa8ff!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-row input{display:block!important;width:100%!important;margin:7px 0 2px!important;accent-color:#a259ff!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-scale{display:flex!important;justify-content:space-between!important;font-size:9px!important;color:#999!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-actions{display:grid!important;grid-template-columns:1fr 1fr 1.25fr!important;gap:7px!important;margin-top:9px!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-actions button{height:40px!important;border:0!important;border-radius:12px!important;background:#29272f!important;color:#fff!important;font-size:12px!important;font-weight:900!important}'
      +'#sheet.kt-real-beauty-sheet .kt-real-beauty-actions .primary{background:linear-gradient(135deg,#7d4cff,#c63dff)!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="AI 보정"]{margin-bottom:12px!important;z-index:60!important;pointer-events:auto!important;touch-action:manipulation!important}';
    document.head.appendChild(st);
  }

  /* 녹화 파일에도 같은 카메라 보정이 들어가도록 보정된 캔버스 스트림을 사용. */
  var oldMake=window.makeEffectRecordingStream;
  var beautyRAF=0,beautyStream=null,beautyVideo=null;
  function stopBeautyRecord(){
    if(beautyRAF){cancelAnimationFrame(beautyRAF);beautyRAF=0;}
    if(beautyVideo){try{beautyVideo.pause();beautyVideo.srcObject=null;}catch(e){}beautyVideo=null;}
    if(beautyStream){try{beautyStream.getVideoTracks().forEach(function(t){t.stop();});}catch(e){}beautyStream=null;}
  }
  if(typeof oldMake==='function'){
    window.makeEffectRecordingStream=function(){
      var base;
      try{base=oldMake.apply(this,arguments);}catch(e){base=window.state&&state.stream;}
      try{if(window.state&&state.ktRealCameraAdjustmentsOn===false)return base;}catch(e){}
      var cam=document.getElementById('camera');
      if(!cam||!cam.videoWidth||!HTMLCanvasElement.prototype.captureStream)return base;

      stopBeautyRecord();
      var canvas=document.createElement('canvas');
      canvas.width=720;canvas.height=1280;
      var ctx=canvas.getContext('2d');
      if(!ctx)return base;
      var raw=(window.state&&base===state.stream);
      var source=cam;
      if(!raw&&base){
        beautyVideo=document.createElement('video');
        beautyVideo.muted=true;beautyVideo.playsInline=true;beautyVideo.srcObject=base;
        try{beautyVideo.play().catch(function(){});}catch(e){}
        source=beautyVideo;
      }

      function draw(){
        beautyRAF=requestAnimationFrame(draw);
        var sw=source.videoWidth||cam.videoWidth||1280,sh=source.videoHeight||cam.videoHeight||720;
        if(!sw||!sh)return;
        var sc=Math.max(canvas.width/sw,canvas.height/sh);
        var dw=sw*sc,dh=sh*sc,dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;
        ctx.save();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.filter=filterString();
        if(raw){ctx.translate(canvas.width,0);ctx.scale(-1,1);}
        try{ctx.drawImage(source,dx,dy,dw,dh);}catch(e){}
        ctx.restore();
      }
      draw();
      beautyStream=canvas.captureStream(30);
      try{base.getAudioTracks().forEach(function(t){beautyStream.addTrack(t);});}catch(e){}
      return beautyStream;
    };
  }
  var oldStop=window.stopEffectRecordingCanvas;
  if(typeof oldStop==='function'){
    window.stopEffectRecordingCanvas=function(){stopBeautyRecord();return oldStop.apply(this,arguments);};
  }

  /* 카메라가 다시 붙을 때도 설정 유지 */
  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'){
    window.ensureLiveCamera=async function(){var r=await oldEnsure.apply(this,arguments);seed();setTimeout(apply,0);return r;};
  }
  seed();
})();
