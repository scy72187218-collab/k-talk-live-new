/* 2026-09-11 요청: 아까 잘 보였던 무지개 파장 모양은 그대로 두고 실제 목소리에 따라 움직이게 함. 1인/13명/구독자/비밀방 파장만 변경. */
(function(){
  if(window.__ktWaveCameraPhotoStyle20260911V8)return;
  window.__ktWaveCameraPhotoStyle20260911V8=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraPhotoStyle20260911V8';
  st.textContent=''
    +'.kt-open-camera-wave{position:absolute!important;display:block!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;opacity:.98!important;background:none!important;filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;animation:none!important;--kt-wave-scale:.72}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:0!important;bottom:0!important;background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave8")!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:100% 100%!important;transform:scaleY(var(--kt-wave-scale))!important;transform-origin:center bottom!important;transition:transform 45ms linear!important;will-change:transform!important}'
    +'.kt-open-camera-wave i{display:none!important}'
    +'/* 1인방: 카메라 왼쪽 끝부터 오른쪽 끝까지, 얼굴 아래쪽 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:66px!important;width:auto!important;height:58px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 실제 카메라/사진이 열린 각 칸 하단에만 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:42px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:60px!important;height:54px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:38px!important}}';
  document.head.appendChild(st);

  var audioCtx=null;
  var analyser=null;
  var source=null;
  var currentStream=null;
  var data=null;
  var fallbackStream=null;
  var asking=false;
  var raf=0;
  var smooth=.72;

  function clean(wave){
    if(!wave)return;
    if(wave.children.length)wave.innerHTML='';
    wave.removeAttribute('data-kt-bars');
    wave.removeAttribute('data-kt-bars-restore');
    wave.removeAttribute('data-kt-voice-bars');
    wave.removeAttribute('data-kt-voice-bars-v3');
    wave.removeAttribute('data-kt-voice-bars-v4');
  }

  function liveAudio(stream){
    try{return !!(stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live'&&t.enabled!==false;}));}catch(e){return false;}
  }

  function stateStream(){
    try{return window.state&&window.state.stream?window.state.stream:null;}catch(e){return null;}
  }

  async function getStream(){
    var s=stateStream();
    if(liveAudio(s))return s;
    if(liveAudio(fallbackStream))return fallbackStream;
    if(asking||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return null;
    asking=true;
    try{
      fallbackStream=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      return fallbackStream;
    }catch(e){return null;}
    finally{asking=false;}
  }

  async function connect(){
    var s=await getStream();
    if(!liveAudio(s))return false;
    if(s===currentStream&&analyser)return true;
    try{
      if(source){try{source.disconnect();}catch(e){}}
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      if(!audioCtx)audioCtx=new AC();
      if(audioCtx.state==='suspended'){try{await audioCtx.resume();}catch(e){}}
      source=audioCtx.createMediaStreamSource(s);
      analyser=audioCtx.createAnalyser();
      analyser.fftSize=256;
      analyser.smoothingTimeConstant=.18;
      source.connect(analyser);
      data=new Uint8Array(analyser.fftSize);
      currentStream=s;
      return true;
    }catch(e){return false;}
  }

  function voiceScale(){
    if(!analyser||!data)return null;
    try{analyser.getByteTimeDomainData(data);}catch(e){return null;}
    var sum=0,peak=0;
    for(var i=0;i<data.length;i++){
      var d=Math.abs((data[i]-128)/128);
      sum+=d*d;
      if(d>peak)peak=d;
    }
    var rms=Math.sqrt(sum/data.length);
    var target=.48+Math.min(.52,(rms*15)+(peak*1.05));
    if(rms<.004&&peak<.018)target=.58;
    smooth=smooth*.62+target*.38;
    return Math.max(.48,Math.min(1,smooth));
  }

  function draw(t){
    raf=requestAnimationFrame(draw);
    var waves=document.querySelectorAll('.kt-open-camera-wave');
    if(!waves.length)return;
    waves.forEach(clean);

    var s=voiceScale();
    if(s===null){
      connect();
      s=.66+Math.sin((t||0)/240)*.08;
    }
    waves.forEach(function(w){
      w.style.setProperty('--kt-wave-scale',s.toFixed(3));
    });
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(clean);
    connect();
    if(!raf)raf=requestAnimationFrame(draw);
  }

  function wake(){
    if(audioCtx&&audioCtx.state==='suspended'){try{audioCtx.resume();}catch(e){}}
    connect();
  }
  document.addEventListener('pointerdown',wake,{passive:true});
  document.addEventListener('touchstart',wake,{passive:true});
  document.addEventListener('click',wake,{passive:true});

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();
