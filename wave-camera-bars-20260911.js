/* 2026-09-11 요청: 1인/13명/구독자/비밀방 파장만 참고사진처럼 가운데선을 기준으로 움직이는 무지개 음성 파형으로 통일. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraBars20260911V3)return;
  window.__ktWaveCameraBars20260911V3=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraBarsStyle20260911V3';
  st.textContent=''
    +'.kt-open-camera-wave{background:none!important;background-image:none!important;position:absolute!important;display:flex!important;align-items:center!important;justify-content:stretch!important;gap:1px!important;padding:0!important;overflow:hidden!important;filter:drop-shadow(0 0 5px rgba(255,55,210,.40))!important;opacity:1!important;animation:none!important;pointer-events:none!important}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:50%!important;height:1px!important;transform:translateY(-50%)!important;background:linear-gradient(90deg,#ff18bd 0%,#ff3158 16%,#ff9c2f 29%,#ffe43c 40%,#64ec49 52%,#29dfd0 64%,#31c5ff 75%,#3b73ff 87%,#b52dff 100%)!important;opacity:.92!important;box-shadow:0 0 5px rgba(255,255,255,.28)!important}'
    +'.kt-open-camera-wave i{display:block!important;flex:1 1 0!important;min-width:1px!important;max-width:2px!important;height:2px!important;border-radius:999px!important;transform:none!important;transform-origin:center center!important;animation:none!important;box-shadow:0 0 4px currentColor!important;transition:height 28ms linear!important;position:relative!important;z-index:1!important}'
    +'/* 1인방: 선물줄 바로 위, 카메라 왼쪽 끝부터 오른쪽 끝까지 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:68px!important;width:auto!important;height:56px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 실제 카메라/사진이 열린 각 칸의 맨 아래 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:42px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:62px!important;height:52px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:38px!important}}';
  document.head.appendChild(st);

  var BAR_COUNT=96;
  var audioCtx=null;
  var analyser=null;
  var source=null;
  var currentStream=null;
  var timeData=null;
  var raf=0;
  var micRequested=false;
  var fallbackStream=null;

  function paintBars(wave){
    if(!wave||wave.dataset.ktVoiceBarsV3==='1')return;
    wave.dataset.ktVoiceBarsV3='1';
    wave.innerHTML='';
    for(var i=0;i<BAR_COUNT;i++){
      var b=document.createElement('i');
      var p=i/(BAR_COUNT-1);
      var hue;
      if(p<.18)hue=324+(p/.18)*24;
      else if(p<.40)hue=348+((p-.18)/.22)*54;
      else if(p<.56)hue=42+((p-.40)/.16)*78;
      else if(p<.74)hue=120+((p-.56)/.18)*74;
      else hue=194+((p-.74)/.26)*92;
      b.style.background='hsl('+hue+',100%,60%)';
      b.style.color='hsl('+hue+',100%,60%)';
      wave.appendChild(b);
    }
  }

  function roomVisible(){
    return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
  }

  function stateStream(){
    try{return window.state&&state.stream?state.stream:null;}catch(e){return null;}
  }

  function hasLiveAudio(stream){
    try{return !!(stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live'&&t.enabled!==false;}));}catch(e){return false;}
  }

  async function ensureAudioStream(){
    var stream=stateStream();
    if(hasLiveAudio(stream))return stream;
    if(hasLiveAudio(fallbackStream))return fallbackStream;
    if(micRequested||!roomVisible()||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return stream;
    micRequested=true;
    try{
      fallbackStream=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      return fallbackStream;
    }catch(e){
      micRequested=false;
      return stream;
    }
  }

  async function connectAudio(){
    var stream=await ensureAudioStream();
    if(!hasLiveAudio(stream))return false;
    if(currentStream===stream&&analyser)return true;
    try{
      if(source){try{source.disconnect();}catch(e){}}
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      if(!audioCtx)audioCtx=new AC();
      if(audioCtx.state==='suspended'){try{await audioCtx.resume();}catch(e){}}
      source=audioCtx.createMediaStreamSource(stream);
      analyser=audioCtx.createAnalyser();
      analyser.fftSize=256;
      analyser.smoothingTimeConstant=.35;
      source.connect(analyser);
      timeData=new Uint8Array(analyser.fftSize);
      currentStream=stream;
      return true;
    }catch(e){return false;}
  }

  function draw(){
    raf=requestAnimationFrame(draw);
    var waves=document.querySelectorAll('.kt-open-camera-wave');
    if(!waves.length)return;
    waves.forEach(paintBars);

    if(!analyser||!timeData){
      connectAudio();
      return;
    }
    try{analyser.getByteTimeDomainData(timeData);}catch(e){return;}

    var sum=0;
    for(var n=0;n<timeData.length;n++){
      var d=(timeData[n]-128)/128;
      sum+=d*d;
    }
    var rms=Math.sqrt(sum/timeData.length);
    var active=rms>.006;
    var gain=rms<.025?4.8:(rms<.07?3.9:3.2);

    waves.forEach(function(wave){
      var maxH=Math.max(20,wave.clientHeight||42);
      var bars=wave.querySelectorAll('i');
      bars.forEach(function(bar,i){
        var idx=Math.floor((i/(BAR_COUNT-1))*(timeData.length-1));
        var a=Math.abs((timeData[Math.max(0,idx-1)]-128)/128);
        var b=Math.abs((timeData[idx]-128)/128);
        var c=Math.abs((timeData[Math.min(timeData.length-1,idx+1)]-128)/128);
        var amp=Math.max(a,b,c);
        var px=active?Math.max(2,Math.min(maxH,Math.round(2+amp*maxH*gain))):2;
        bar.style.height=px+'px';
      });
    });
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(paintBars);
    connectAudio();
    if(!raf)draw();
  }

  function wakeAudio(){
    if(audioCtx&&audioCtx.state==='suspended'){try{audioCtx.resume();}catch(e){}}
    connectAudio();
  }
  document.addEventListener('pointerdown',wakeAudio,{passive:true});
  document.addEventListener('touchstart',wakeAudio,{passive:true});

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,100);
  setTimeout(apply,300);
})();
