/* 2026-09-11 요청: 1인/13명/구독자/비밀방 파장만 실제 목소리에 반응하는 무지개 음성 파형으로 통일. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraBars20260911V2)return;
  window.__ktWaveCameraBars20260911V2=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraBarsStyle20260911V2';
  st.textContent=''
    +'.kt-open-camera-wave{background:none!important;background-image:none!important;position:absolute!important;display:flex!important;align-items:center!important;justify-content:stretch!important;gap:1px!important;padding:0!important;overflow:hidden!important;filter:drop-shadow(0 0 4px rgba(255,55,210,.34))!important;opacity:.98!important;animation:none!important;pointer-events:none!important}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:50%!important;height:2px!important;transform:translateY(-50%)!important;background:linear-gradient(90deg,#ff19bd 0%,#ff315b 17%,#ff9b2f 30%,#ffe33e 41%,#59eb4d 52%,#29ded2 63%,#31bfff 74%,#3b6cff 86%,#b32dff 100%)!important;opacity:.82!important;box-shadow:0 0 6px rgba(255,255,255,.20)!important}'
    +'.kt-open-camera-wave i{display:block!important;flex:1 1 0!important;min-width:1px!important;max-width:3px!important;height:2px!important;border-radius:999px!important;transform:none!important;transform-origin:center center!important;animation:none!important;box-shadow:0 0 4px currentColor!important;transition:height 45ms linear!important;position:relative!important;z-index:1!important}'
    +'/* 1인방: 얼굴을 가리지 않게 선물줄 바로 위, 카메라 왼쪽 끝부터 오른쪽 끝까지 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:68px!important;width:auto!important;height:42px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 실제 카메라/사진이 열린 각 칸의 맨 아래 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:34px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:62px!important;height:38px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:30px!important}}';
  document.head.appendChild(st);

  var BAR_COUNT=72;
  var audioCtx=null;
  var analyser=null;
  var source=null;
  var currentStream=null;
  var freqData=null;
  var raf=0;
  var micRequested=false;
  var fallbackStream=null;

  function paintBars(wave){
    if(!wave||wave.dataset.ktVoiceBars==='1')return;
    wave.dataset.ktVoiceBars='1';
    wave.innerHTML='';
    for(var i=0;i<BAR_COUNT;i++){
      var b=document.createElement('i');
      var hue=(330+(i/(BAR_COUNT-1))*300)%360;
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
    try{return !!(stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }

  async function ensureAudioStream(){
    var stream=stateStream();
    if(hasLiveAudio(stream))return stream;
    if(hasLiveAudio(fallbackStream))return fallbackStream;
    if(micRequested||!roomVisible()||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return stream;
    micRequested=true;
    try{
      fallbackStream=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      if(stream&&stream.addTrack){
        fallbackStream.getAudioTracks().forEach(function(t){
          try{stream.addTrack(t.clone());}catch(e){}
        });
      }
      return fallbackStream;
    }catch(e){return stream;}
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
      analyser.smoothingTimeConstant=.72;
      source.connect(analyser);
      freqData=new Uint8Array(analyser.frequencyBinCount);
      currentStream=stream;
      return true;
    }catch(e){return false;}
  }

  function levelFor(index,data){
    if(!data||!data.length)return 2;
    var usable=Math.min(data.length,58);
    var pos=Math.floor((index/(BAR_COUNT-1))*(usable-1));
    var mirror=Math.abs((BAR_COUNT-1)/2-index)/((BAR_COUNT-1)/2);
    var centerBoost=1.20-(mirror*.28);
    var raw=data[pos]||0;
    return Math.max(2,Math.min(100,(raw/255)*100*centerBoost));
  }

  function draw(){
    raf=requestAnimationFrame(draw);
    var waves=document.querySelectorAll('.kt-open-camera-wave');
    if(!waves.length)return;
    waves.forEach(paintBars);

    if(!analyser||!freqData){
      connectAudio();
      return;
    }
    try{analyser.getByteFrequencyData(freqData);}catch(e){return;}

    var total=0;
    for(var n=0;n<Math.min(freqData.length,48);n++)total+=freqData[n];
    var avg=total/Math.min(freqData.length,48);
    var speaking=avg>7;

    waves.forEach(function(wave){
      var maxH=Math.max(12,wave.clientHeight||30);
      var bars=wave.querySelectorAll('i');
      bars.forEach(function(bar,i){
        var pct=speaking?levelFor(i,freqData):5;
        var px=Math.max(2,Math.round((pct/100)*maxH));
        bar.style.height=px+'px';
      });
    });
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(paintBars);
    connectAudio();
    if(!raf)draw();
  }

  document.addEventListener('pointerdown',function(){
    if(audioCtx&&audioCtx.state==='suspended'){try{audioCtx.resume();}catch(e){}}
    connectAudio();
  },{passive:true});

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,100);
  setTimeout(apply,300);
})();
