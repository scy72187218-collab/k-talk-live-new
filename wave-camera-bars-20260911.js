/* 2026-09-11 요청: 1인/13명/구독자/비밀방 파장만 참고사진처럼 크게 움직이는 무지개 음성 파형으로 통일. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraBars20260911V4)return;
  window.__ktWaveCameraBars20260911V4=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraBarsStyle20260911V4';
  st.textContent=''
    +'.kt-open-camera-wave{background:none!important;background-image:none!important;position:absolute!important;display:flex!important;align-items:center!important;justify-content:stretch!important;gap:1px!important;padding:0!important;overflow:hidden!important;filter:drop-shadow(0 0 6px rgba(255,55,210,.48))!important;opacity:1!important;animation:none!important;pointer-events:none!important}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:50%!important;height:1px!important;transform:translateY(-50%)!important;background:linear-gradient(90deg,#ff18bd 0%,#ff3158 15%,#ff962e 28%,#ffe43c 40%,#66ec49 52%,#28dfcf 64%,#31c5ff 75%,#3b73ff 87%,#c22dff 100%)!important;opacity:.98!important;box-shadow:0 0 7px rgba(255,255,255,.35)!important}'
    +'.kt-open-camera-wave i{display:block!important;flex:1 1 0!important;min-width:1px!important;max-width:3px!important;height:3px!important;border-radius:999px!important;transform:none!important;transform-origin:center center!important;animation:none!important;box-shadow:0 0 5px currentColor!important;transition:height 22ms linear!important;position:relative!important;z-index:1!important}'
    +'/* 1인방: 선물줄 바로 위, 카메라 왼쪽 끝부터 오른쪽 끝까지 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:66px!important;width:auto!important;height:66px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 실제 카메라/사진이 열린 각 칸의 맨 아래 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:48px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:60px!important;height:60px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:44px!important}}';
  document.head.appendChild(st);

  var BAR_COUNT=112;
  var audioCtx=null;
  var analyser=null;
  var source=null;
  var currentStream=null;
  var timeData=null;
  var raf=0;
  var micRequested=false;
  var fallbackStream=null;

  function colorFor(p){
    var hue;
    if(p<.16)hue=322+(p/.16)*34;
    else if(p<.32)hue=356+((p-.16)/.16)*36;
    else if(p<.46)hue=32+((p-.32)/.14)*28;
    else if(p<.60)hue=60+((p-.46)/.14)*66;
    else if(p<.73)hue=126+((p-.60)/.13)*56;
    else if(p<.86)hue=182+((p-.73)/.13)*44;
    else hue=226+((p-.86)/.14)*62;
    return 'hsl('+hue+',100%,60%)';
  }

  function paintBars(wave){
    if(!wave||wave.dataset.ktVoiceBarsV4==='1')return;
    wave.dataset.ktVoiceBarsV4='1';
    wave.innerHTML='';
    for(var i=0;i<BAR_COUNT;i++){
      var b=document.createElement('i');
      var color=colorFor(i/(BAR_COUNT-1));
      b.style.background=color;
      b.style.color=color;
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
      analyser.fftSize=512;
      analyser.smoothingTimeConstant=.12;
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

    var sum=0,maxAmp=0;
    for(var n=0;n<timeData.length;n++){
      var d=Math.abs((timeData[n]-128)/128);
      sum+=d*d;
      if(d>maxAmp)maxAmp=d;
    }
    var rms=Math.sqrt(sum/timeData.length);
    var active=(rms>.0035||maxAmp>.018);
    var voiceBoost=Math.min(1,Math.max(0,(rms-.002)*30));

    waves.forEach(function(wave){
      var maxH=Math.max(28,wave.clientHeight||48);
      var bars=wave.querySelectorAll('i');
      bars.forEach(function(bar,i){
        var idx=Math.floor((i/(BAR_COUNT-1))*(timeData.length-1));
        var local=0;
        for(var k=-3;k<=3;k++){
          var j=Math.max(0,Math.min(timeData.length-1,idx+k));
          var v=Math.abs((timeData[j]-128)/128);
          if(v>local)local=v;
        }
        if(active){
          var shaped=Math.pow(local,0.34);
          var ripple=.86+.14*Math.sin((i*.53)+(performance.now()*.018));
          var ratio=Math.min(1,.10+(shaped*.88)+(voiceBoost*.58));
          ratio=Math.max(.12,ratio*ripple);
          bar.style.setProperty('height',Math.max(4,Math.round(maxH*ratio))+'px','important');
        }else{
          var idle=3+Math.round((1+Math.sin(i*.55+performance.now()*.006))*1.5);
          bar.style.setProperty('height',idle+'px','important');
        }
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
  document.addEventListener('click',wakeAudio,{passive:true});

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,100);
  setTimeout(apply,300);
})();
