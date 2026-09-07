/* K-Talk 요청 수정: 주름살 완화, 보정 뒤로가기, 첫 화면 동영상 즉시 표시. */
(function(){
  if(window.__ktRequestedFixes20260907Installed)return;
  window.__ktRequestedFixes20260907Installed=true;

  /* 1) 보정에 '주름살 완화' 한 항목만 추가. 기존 보정 로직은 그대로 사용한다. */
  var oldBeautyInfo=window.getBeautyControlInfo;
  if(typeof oldBeautyInfo==='function'){
    window.getBeautyControlInfo=function(kind){
      if(kind==='wrinkle')return {label:'주름살 완화',key:'beautyWrinkle',def:65};
      return oldBeautyInfo.apply(this,arguments);
    };
  }

  var oldSetBeautyValue=window.setBeautyValue;
  if(typeof oldSetBeautyValue==='function'){
    window.setBeautyValue=function(kind,value){
      if(kind==='wrinkle'){
        value=Math.max(1,Math.min(100,parseInt(value||1,10)));
        try{state.beautyWrinkle=value;}catch(e){}
        /* 주름 완화는 기존 피부 부드러움 엔진을 이용해 자연스럽게 적용 */
        var skin=Math.round(55+(value*0.43));
        oldSetBeautyValue.call(this,'skin',skin);
        var v=document.getElementById('beautySingleValue');
        if(v)v.textContent=value;
        return;
      }
      return oldSetBeautyValue.apply(this,arguments);
    };
  }

  function decorateBeautyPanel(){
    try{
      var controls=document.querySelector('.kt-beauty-controls-pro');
      if(controls&&!controls.querySelector('[data-beauty-kind="wrinkle"]')){
        var btn=document.createElement('button');
        btn.setAttribute('data-beauty-kind','wrinkle');
        btn.innerHTML='<b>〰</b><span>주름살</span><i></i>';
        btn.onclick=function(){if(window.selectBeautyControl)window.selectBeautyControl('wrinkle');};
        controls.appendChild(btn);
      }
      if(controls&&window.state&&state.beautyControl==='wrinkle'){
        controls.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-beauty-kind')==='wrinkle');});
      }

      /* 2) 보정 화면에서 바로 빠져나오는 왼쪽 화살표 */
      var headBtn=document.querySelector('#sheet .sheet-head button');
      if(headBtn&&document.getElementById('sheet')&&document.getElementById('sheet').classList.contains('beauty-control-sheet')){
        headBtn.textContent='←';
        headBtn.setAttribute('aria-label','보정 화면 나가기');
        headBtn.title='뒤로';
        headBtn.style.fontSize='28px';
        headBtn.style.fontWeight='900';
        headBtn.style.minWidth='44px';
      }
    }catch(e){}
  }

  var oldOpenBeauty=window.openBeautyPanel;
  if(typeof oldOpenBeauty==='function'){
    window.openBeautyPanel=function(){
      var r=oldOpenBeauty.apply(this,arguments);
      setTimeout(decorateBeautyPanel,0);
      return r;
    };
  }

  var oldResetBeauty=window.resetBeautyAll;
  if(typeof oldResetBeauty==='function'){
    window.resetBeautyAll=function(){
      try{state.beautyWrinkle=65;}catch(e){}
      var r=oldResetBeauty.apply(this,arguments);
      setTimeout(decorateBeautyPanel,0);
      return r;
    };
  }

  /* 3) 첫 페이지에서 네트워크 동영상 목록을 기다리는 동안 검정 화면이 보이지 않게 즉시 기본 동영상을 먼저 재생 */
  function quickHomeVideo(){
    var host=document.getElementById('screen');
    if(!host)return;
    try{
      if(document.body.classList.contains('kt-home'))return;
      if(host.querySelector('video'))return;
    }catch(e){}
    document.body.classList.remove('kt-home');
    document.body.classList.add('kt-video-mode');
    host.innerHTML='<section class="video-home">'
      +'<video id="homeVideo" autoplay muted loop playsinline preload="auto" poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80">'
      +'<source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button aria-label="검색">⌕</button></div>'
      +'<div class="vh-title"><b>♛ K-Talk</b><span>추천 동영상 · 화면을 눌러 재생하거나 멈출 수 있습니다.</span></div>'
      +'<div class="vh-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div>'
      +'</section>';
    var v=document.getElementById('homeVideo');
    if(v){
      v.addEventListener('click',function(){if(v.paused)v.play().catch(function(){});else v.pause();});
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
  }

  var loadedHome=window.home;
  if(typeof loadedHome==='function'&&!loadedHome.__ktInstantFirstVideo){
    var wrappedHome=function(){
      quickHomeVideo();
      return loadedHome.apply(this,arguments);
    };
    wrappedHome.__ktInstantFirstVideo=true;
    window.home=wrappedHome;
  }

  /* 첫 진입 때 이미 동영상이 있으면 건드리지 않고, 검정/빈 화면일 때만 채운다. */
  setTimeout(quickHomeVideo,0);
})();

/* 촬영 화면의 '편집효과' 버튼이 아래 라이브 영역에 가려지거나 잘못 눌리지 않도록 터치 영역만 분리한다. */
(function(){
  if(window.__ktEditEffectTouchFixInstalled)return;
  window.__ktEditEffectTouchFixInstalled=true;

  function ensureEditTouchStyle(){
    if(document.getElementById('ktEditEffectTouchFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktEditEffectTouchFixStyle';
    s.textContent=''
      +'#creator .creator-tools{z-index:24!important;pointer-events:auto!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]{position:relative!important;z-index:30!important;transform:translateY(-10px)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#creator .creator-tools .creator-tool-text[aria-label="편집 효과"] *{pointer-events:none!important}';
    document.head.appendChild(s);
  }

  ensureEditTouchStyle();

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try{
      if(window.openEditEffectPanel)window.openEditEffectPanel();
    }catch(err){}
  },true);
})();

/* 컴퓨터/휴대폰 카메라 호환: 기존 연결이 실패할 때 해상도와 마이크를 단계적으로 낮춰 카메라부터 살린다. */
(function(){
  if(window.__ktDeviceConnectionFallbackInstalled)return;
  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure!=='function')return;
  window.__ktDeviceConnectionFallbackInstalled=true;

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }
  function hasLiveAudio(stream){
    try{return !!(stream&&stream.getAudioTracks&&stream.getAudioTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }
  async function attachStream(stream){
    try{
      if(window.state)state.stream=stream;
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      if(cam){cam.srcObject=stream;cam.muted=true;cam.setAttribute('playsinline','');try{await cam.play();}catch(e){}}
      if(bg){bg.srcObject=stream;bg.muted=true;bg.setAttribute('playsinline','');try{await bg.play();}catch(e){}}
      var c=document.getElementById('creator');
      if(c)c.classList.add('camera-on');
      return true;
    }catch(e){return false;}
  }
  async function tryAddMic(stream){
    if(!stream||hasLiveAudio(stream))return;
    try{
      var a=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      a.getAudioTracks().forEach(function(t){stream.addTrack(t);});
    }catch(e){}
  }

  window.ensureLiveCamera=async function(facing){
    try{
      var ok=await oldEnsure.apply(this,arguments);
      if(window.state&&hasLiveVideo(state.stream))return ok===false?true:ok;
    }catch(e){}

    if(!navigator.mediaDevices||typeof navigator.mediaDevices.getUserMedia!=='function')return false;
    var face=facing||(window.state&&state.cameraFacing)||'user';
    var tries=[
      {video:{facingMode:{ideal:face},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},audio:false},
      {video:{facingMode:{ideal:face},width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}},audio:false},
      {video:{facingMode:{ideal:face}},audio:false},
      {video:true,audio:false}
    ];

    for(var i=0;i<tries.length;i++){
      try{
        var stream=await navigator.mediaDevices.getUserMedia(tries[i]);
        if(!hasLiveVideo(stream))continue;
        try{
          if(window.state&&state.stream&&state.stream!==stream){
            state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
          }
        }catch(e){}
        if(window.state)state.cameraFacing=face;
        await attachStream(stream);
        await tryAddMic(stream);
        return true;
      }catch(e){}
    }
    return false;
  };
})();

/* 화면을 잠깐 나갔다가 돌아왔을 때: 이미 허용된 카메라는 권한창 없이 다시 붙여 검은 화면을 막는다. */
(function(){
  if(window.__ktCameraResumeAfterReturnInstalled)return;
  window.__ktCameraResumeAfterReturnInstalled=true;

  function liveStream(){
    try{
      var s=window.state&&state.stream;
      return s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';})?s:null;
    }catch(e){return null;}
  }

  function rememberAllowed(){
    try{sessionStorage.setItem('kt_camera_allowed_this_session','1');}catch(e){}
  }

  function creatorVisible(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList.contains('show'));
  }

  async function reviveExisting(){
    var s=liveStream();
    if(!s)return false;
    try{
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      if(cam){
        if(cam.srcObject!==s)cam.srcObject=s;
        cam.muted=true;
        cam.setAttribute('playsinline','');
        try{await cam.play();}catch(e){}
      }
      if(bg){
        if(bg.srcObject!==s)bg.srcObject=s;
        bg.muted=true;
        bg.setAttribute('playsinline','');
        try{await bg.play();}catch(e){}
      }
      var c=document.getElementById('creator');
      if(c)c.classList.add('camera-on');
      rememberAllowed();
      return true;
    }catch(e){return false;}
  }

  async function permissionState(name){
    try{
      if(navigator.permissions&&navigator.permissions.query){
        var r=await navigator.permissions.query({name:name});
        return r&&r.state?r.state:'unknown';
      }
    }catch(e){}
    return 'unknown';
  }

  async function mayReconnectWithoutPrompt(){
    var cam=await permissionState('camera');
    if(cam==='granted')return true;
    if(cam==='prompt'||cam==='denied')return false;
    try{return sessionStorage.getItem('kt_camera_allowed_this_session')==='1';}catch(e){return false;}
  }

  async function restoreIfAllowed(){
    if(await reviveExisting())return true;
    if(!creatorVisible())return false;
    if(!(await mayReconnectWithoutPrompt()))return false;
    if(typeof window.ensureLiveCamera!=='function')return false;
    try{
      var ok=await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
      if(await reviveExisting())return true;
      return !!ok;
    }catch(e){return false;}
  }

  var ensureNow=window.ensureLiveCamera;
  if(typeof ensureNow==='function'&&!ensureNow.__ktRememberCameraAllowed){
    var wrappedEnsure=async function(){
      var ok=await ensureNow.apply(this,arguments);
      if(liveStream())rememberAllowed();
      return ok;
    };
    wrappedEnsure.__ktRememberCameraAllowed=true;
    window.ensureLiveCamera=wrappedEnsure;
  }

  var openNow=window.openCreator;
  if(typeof openNow==='function'){
    window.openCreator=async function(){
      var result=await openNow.apply(this,arguments);
      setTimeout(function(){restoreIfAllowed();},60);
      return result;
    };
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&creatorVisible()){
      setTimeout(function(){restoreIfAllowed();},120);
    }
  });

  window.addEventListener('pageshow',function(){
    if(creatorVisible())setTimeout(function(){restoreIfAllowed();},120);
  });
})();
