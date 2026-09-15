/* K-Talk 호스트 TV/영화 공유 전용.
   일반 회원은 레벨 20부터, 유료 구독자는 레벨 제한 없이 사용.
   본인이 소유하거나 방송 허가를 받은 영상/화면만 공유하도록 안내한다.
   기존 방/선물/버튼 배치는 변경하지 않고 '더보기' 안에 항목만 추가한다. */
(function(){
  if(window.__ktHostTvMovieLevel20_20260915)return;
  window.__ktHostTvMovieLevel20_20260915=true;

  var senderRefs=window.__ktHostMediaSenderRefs=window.__ktHostMediaSenderRefs||[];
  var originalStream=null;
  var sharedStream=null;
  var sourceVideo=null;
  var sourceUrl='';
  var sourceCanvas=null;
  var drawRaf=0;
  var audioCtx=null;
  var audioDest=null;
  var moreRequestedUntil=0;

  function number(v){var n=parseInt(v,10);return isFinite(n)?n:0;}
  function currentLevel(){
    var vals=[];
    try{if(window.state)vals.push(state.level,state.userLevel,state.memberLevel,state.hostLevel);}catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'].forEach(function(k){var v=localStorage.getItem(k);if(v!=null)vals.push(v);});
    }catch(e){}
    var lv=0;
    vals.forEach(function(v){lv=Math.max(lv,number(v));});
    try{if(typeof window.ktEffectiveLevel==='function')lv=window.ktEffectiveLevel(lv||1);}catch(e){}
    return lv||1;
  }
  function isSubscriber(){
    try{if(typeof window.ktIsPaidSubscriber==='function'&&window.ktIsPaidSubscriber())return true;}catch(e){}
    try{if(window.state&&(state.isSubscriber===true||state.subscriber===true||state.vip===true))return true;}catch(e){}
    return false;
  }
  function canUse(){
    try{if(typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin())return true;}catch(e){}
    return isSubscriber()||currentLevel()>=20;
  }
  function deny(){
    alert('📺 TV·영화 공유는 일반 회원은 레벨 20부터 이용할 수 있고, 구독자는 레벨 제한 없이 이용할 수 있습니다.');
  }
  function isLocalLiveRoom(){
    return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room')&&!document.querySelector('.kt-remote-live');
  }

  /* 호스트 WebRTC 송신 sender를 기록해 두었다가 카메라 ↔ 공유영상 트랙만 교체한다. */
  try{
    if(window.RTCPeerConnection&&RTCPeerConnection.prototype&&!RTCPeerConnection.prototype.__ktHostMediaAddTrackWrapped){
      var oldAddTrack=RTCPeerConnection.prototype.addTrack;
      RTCPeerConnection.prototype.addTrack=function(track){
        var args=[].slice.call(arguments);
        var sender=oldAddTrack.apply(this,args);
        try{
          var local=window.state&&state.stream;
          var streams=args.slice(1);
          if(local&&streams.some(function(s){return s===local;})){
            senderRefs.push({pc:this,sender:sender,kind:track&&track.kind||''});
          }
        }catch(e){}
        return sender;
      };
      RTCPeerConnection.prototype.__ktHostMediaAddTrackWrapped=true;
    }
  }catch(e){}

  function liveTrack(stream,kind){
    if(!stream)return null;
    var list=kind==='audio'?stream.getAudioTracks():stream.getVideoTracks();
    return list.find(function(t){return t.readyState==='live';})||list[0]||null;
  }
  async function replaceSenders(stream){
    var keep=[];
    for(var i=0;i<senderRefs.length;i++){
      var r=senderRefs[i];
      if(!r||!r.pc||r.pc.connectionState==='closed'||!r.sender)continue;
      keep.push(r);
      var t=liveTrack(stream,r.kind);
      if(!t)continue;
      try{await r.sender.replaceTrack(t);}catch(e){}
    }
    senderRefs.length=0;
    keep.forEach(function(x){senderRefs.push(x);});
  }
  function cameraEl(){return document.getElementById('camera');}
  function showSharedPreview(stream){
    try{
      var c=cameraEl();
      if(c){
        c.srcObject=stream;
        c.muted=true;
        c.setAttribute('playsinline','');
        var p=c.play();if(p&&p.catch)p.catch(function(){});
      }
      document.documentElement.classList.add('kt-host-media-sharing');
    }catch(e){}
  }
  function showCameraPreview(stream){
    try{
      var c=cameraEl();
      if(c&&stream){c.srcObject=stream;var p=c.play();if(p&&p.catch)p.catch(function(){});}
      document.documentElement.classList.remove('kt-host-media-sharing');
    }catch(e){}
  }
  function ensureStyle(){
    if(document.getElementById('ktHostTvMovieStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostTvMovieStyle';
    s.textContent='html.kt-host-media-sharing #creator video#camera{transform:none!important;object-fit:contain!important;background:#000!important}'
      +'.kt-tv-movie-more{width:100%;margin-top:8px;padding:12px 13px;border:1px solid #ffffff26;border-radius:13px;background:#101018;color:#fff;text-align:left;font-size:13px;font-weight:900}'
      +'.kt-tv-movie-more small{display:block;margin-top:4px;color:#cfd0d8;font-size:10px;font-weight:700}'
      +'.kt-tv-movie-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kt-tv-movie-actions button{min-height:52px;border:1px solid #ffffff26;border-radius:13px;background:#11131b;color:#fff;font-size:12px;font-weight:900}'
      +'.kt-tv-movie-note{margin-top:10px;padding:10px;border-radius:12px;background:#0c0d12;color:#d8d8df;font-size:10px;line-height:1.55}'
      +'.kt-remote-tv-btn{width:34px;height:34px;border:1px solid #ffffff32;border-radius:50%;background:#111a;color:#fff;font-size:16px;display:grid;place-items:center}';
    document.head.appendChild(s);
  }

  function stopSourceOnly(){
    if(drawRaf){cancelAnimationFrame(drawRaf);drawRaf=0;}
    if(sourceVideo){try{sourceVideo.pause();}catch(e){}try{sourceVideo.removeAttribute('src');sourceVideo.load();}catch(e){}try{sourceVideo.remove();}catch(e){}sourceVideo=null;}
    if(sourceUrl){try{URL.revokeObjectURL(sourceUrl);}catch(e){}sourceUrl='';}
    if(sourceCanvas){try{sourceCanvas.remove();}catch(e){}sourceCanvas=null;}
    if(audioCtx){try{audioCtx.close();}catch(e){}audioCtx=null;audioDest=null;}
  }
  async function stopShare(){
    var oldShared=sharedStream;
    sharedStream=null;
    if(originalStream){
      try{if(window.state)state.stream=originalStream;}catch(e){}
      await replaceSenders(originalStream);
      showCameraPreview(originalStream);
    }
    if(oldShared){oldShared.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}
    stopSourceOnly();
    originalStream=null;
  }
  window.ktStopHostTvMovieShare=function(){stopShare();};

  async function activateStream(stream){
    if(!stream||!liveTrack(stream,'video'))throw new Error('공유할 영상이 없습니다.');
    if(!originalStream){try{originalStream=window.state&&state.stream?state.stream:null;}catch(e){originalStream=null;}}
    if(sharedStream&&sharedStream!==stream){sharedStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}
    sharedStream=stream;
    try{if(window.state)state.stream=stream;}catch(e){}
    await replaceSenders(stream);
    showSharedPreview(stream);
    var vt=liveTrack(stream,'video');
    if(vt)vt.addEventListener('ended',function(){if(sharedStream===stream)stopShare();},{once:true});
  }

  function buildFileStream(video){
    if(typeof video.captureStream==='function'){
      try{return Promise.resolve(video.captureStream());}catch(e){}
    }
    if(typeof video.mozCaptureStream==='function'){
      try{return Promise.resolve(video.mozCaptureStream());}catch(e){}
    }
    return new Promise(function(resolve,reject){
      try{
        var canvas=document.createElement('canvas');sourceCanvas=canvas;
        canvas.width=Math.max(640,video.videoWidth||1280);canvas.height=Math.max(360,video.videoHeight||720);
        canvas.style.cssText='position:fixed;width:2px;height:2px;left:-10px;bottom:-10px;opacity:.001;pointer-events:none';
        document.body.appendChild(canvas);
        var ctx=canvas.getContext('2d');
        function draw(){try{ctx.drawImage(video,0,0,canvas.width,canvas.height);}catch(e){}drawRaf=requestAnimationFrame(draw);}
        draw();
        var out=canvas.captureStream(30);
        var AC=window.AudioContext||window.webkitAudioContext;
        if(AC){
          audioCtx=new AC();
          var src=audioCtx.createMediaElementSource(video);audioDest=audioCtx.createMediaStreamDestination();
          src.connect(audioDest);src.connect(audioCtx.destination);
          audioDest.stream.getAudioTracks().forEach(function(t){out.addTrack(t);});
          if(audioCtx.state==='suspended')audioCtx.resume().catch(function(){});
        }
        resolve(out);
      }catch(e){reject(e);}
    });
  }

  window.ktHostMediaPickVideo=function(){
    if(!canUse()){deny();return;}
    var input=document.createElement('input');
    input.type='file';input.accept='video/*';input.style.display='none';
    input.onchange=async function(){
      var file=input.files&&input.files[0];input.remove();if(!file)return;
      try{
        await stopShare();
        var v=document.createElement('video');sourceVideo=v;
        v.playsInline=true;v.autoplay=true;v.controls=false;v.loop=false;v.preload='auto';v.volume=1;
        v.style.cssText='position:fixed;width:2px;height:2px;left:-10px;bottom:-10px;opacity:.001;pointer-events:none';
        sourceUrl=URL.createObjectURL(file);v.src=sourceUrl;document.body.appendChild(v);
        await new Promise(function(resolve,reject){v.onloadedmetadata=resolve;v.onerror=reject;});
        await v.play();
        var stream=await buildFileStream(v);
        await activateStream(stream);
        v.onended=function(){if(sharedStream===stream)stopShare();};
        alert('📺 선택한 동영상이 방송 영상으로 재생됩니다.');
      }catch(e){alert('이 동영상을 방송으로 재생하지 못했습니다. 다른 파일로 다시 시도해 주세요.');}
    };
    document.body.appendChild(input);input.click();
  };

  window.ktHostMediaShareScreen=async function(){
    if(!canUse()){deny();return;}
    if(!navigator.mediaDevices||typeof navigator.mediaDevices.getDisplayMedia!=='function'){
      alert('이 기기 브라우저에서는 화면 공유를 직접 지원하지 않습니다. 동영상 선택 기능을 이용해 주세요.');return;
    }
    try{
      await stopShare();
      var s=await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
      if(!s.getAudioTracks().length&&originalStream){
        originalStream.getAudioTracks().forEach(function(t){try{s.addTrack(t);}catch(e){}});
      }
      await activateStream(s);
    }catch(e){}
  };

  async function remotePrompt(video){
    try{
      if(video&&video.remote&&typeof video.remote.prompt==='function'){
        await video.remote.prompt();return true;
      }
    }catch(e){}
    return false;
  }
  window.ktHostMediaConnectTv=async function(){
    var v=sourceVideo||cameraEl()||document.querySelector('video');
    if(await remotePrompt(v))return;
    alert('📺 이 브라우저에서 직접 TV 선택창을 열 수 없으면 삼성 휴대폰의 Smart View(화면 미러링)로 TV에 연결해 주세요.');
  };
  window.ktViewerConnectTv=async function(){
    var v=document.getElementById('ktRemoteLiveVideo')||document.querySelector('.kt-remote-live video');
    if(await remotePrompt(v))return;
    alert('📺 이 브라우저에서 직접 TV 선택창을 열 수 없으면 삼성 휴대폰의 Smart View(화면 미러링)로 TV에 연결해 주세요.');
  };

  window.ktOpenHostTvMovie=function(){
    if(!canUse()){deny();return;}
    if(typeof window.showSheet!=='function')return;
    var html=''
      +'<div class="kt-tv-movie-actions">'
      +'<button type="button" onclick="ktHostMediaPickVideo()">🎬 내 동영상<br>틀기</button>'
      +'<button type="button" onclick="ktHostMediaShareScreen()">📱 화면<br>공유</button>'
      +'<button type="button" onclick="ktHostMediaConnectTv()">📺 TV<br>연결</button>'
      +'<button type="button" onclick="ktStopHostTvMovieShare()">⏹ 공유<br>중지</button>'
      +'</div>'
      +'<div class="kt-tv-movie-note"><b>이용 기준</b><br>일반 회원: 레벨 20부터 · 구독자: 레벨 제한 없음<br><br><b>방송 콘텐츠</b><br>본인이 소유하거나 방송 허가를 받은 영상·화면만 공유해 주세요.</div>';
    showSheet('📺 TV · 영화 · 화면공유',html);
  };

  function addMoreEntry(){
    if(Date.now()>moreRequestedUntil||!isLocalLiveRoom())return;
    var body=document.getElementById('sheetBody');
    if(!body||body.querySelector('[data-kt-tv-movie-more]'))return;
    var b=document.createElement('button');
    b.type='button';b.className='kt-tv-movie-more';b.setAttribute('data-kt-tv-movie-more','1');
    b.innerHTML='📺 TV · 영화 · 화면공유<small>일반 레벨 20부터 · 구독자는 모두 이용</small>';
    b.onclick=function(){window.ktOpenHostTvMovie();};
    body.appendChild(b);
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;
    var t=String(b.innerText||b.textContent||'').replace(/\s+/g,'');
    if(t.indexOf('더보기')>-1&&isLocalLiveRoom()){
      moreRequestedUntil=Date.now()+1600;
      [60,160,360,700].forEach(function(ms){setTimeout(addMoreEntry,ms);});
    }
  },true);

  function ensureViewerTvButton(){
    var top=document.querySelector('.kt-remote-live .kt-remote-top');if(!top||top.querySelector('[data-kt-remote-tv]'))return;
    var b=document.createElement('button');b.type='button';b.className='kt-remote-tv-btn';b.setAttribute('data-kt-remote-tv','1');b.title='TV 연결';b.textContent='📺';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();window.ktViewerConnectTv();};
    top.appendChild(b);
  }

  ensureStyle();ensureViewerTvButton();
  try{var mo=new MutationObserver(function(){ensureViewerTvButton();addMoreEntry();});mo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('pagehide',function(){try{if(sharedStream)sharedStream.getTracks().forEach(function(t){t.stop();});}catch(e){};});
})();
