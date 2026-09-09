/* K-Talk 4개 방송방 채팅 + 무지개 파장만 수정: 1인/13명/구독자/비밀방. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktRainbowWaveformInstalled)return;
  window.__ktRainbowWaveformInstalled=true;

  /* 13명 방송 전용 화면 스크립트가 빠져 있어도 이 파일에서 한 번만 불러온다. */
  if(!window.__ktGroup13ApprovedRoomInstalled && !document.querySelector('script[data-kt-group13-loader]')){
    var g=document.createElement('script');
    g.src='group13-approved-room.js?v=20260907-wavebottom1';
    g.setAttribute('data-kt-group13-loader','1');
    document.head.appendChild(g);
  }

  var style=document.createElement('style');
  style.id='ktRainbowWaveformStyle';
  style.textContent=`
    @keyframes ktRainbowWaveBeat{
      0%{transform:scaleY(.58)}
      28%{transform:scaleY(1.10)}
      52%{transform:scaleY(.76)}
      76%{transform:scaleY(1.18)}
      100%{transform:scaleY(.68)}
    }

    /* 기존에 승인한 무지개 파장은 그대로 유지 */
    .ktsolo-wave,.ktsubscriber-wave,.ktsecret-wave,.kt-secret-wave,.secret-wave{
      position:absolute!important;
      left:0!important;
      right:0!important;
      width:auto!important;
      bottom:72px!important;
      height:34px!important;
      z-index:6!important;
      display:block!important;
      pointer-events:none!important;
      background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wavebottom1")!important;
      background-repeat:no-repeat!important;
      background-position:center!important;
      background-size:100% 100%!important;
      opacity:.96!important;
      transform-origin:center bottom!important;
      animation:ktRainbowWaveBeat .62s ease-in-out infinite alternate!important;
      filter:drop-shadow(0 0 4px rgba(255,65,210,.35))!important;
    }
    .ktsolo-wave>i,.ktsubscriber-wave>i,.ktsecret-wave>i,.kt-secret-wave>i,.secret-wave>i{display:none!important}
    .ktg13-main::after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      bottom:2px;
      height:32px;
      z-index:8;
      pointer-events:none;
      background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wavebottom1");
      background-repeat:no-repeat;
      background-position:center;
      background-size:100% 100%;
      opacity:.96;
      transform-origin:center bottom;
      animation:ktRainbowWaveBeat .62s ease-in-out infinite alternate;
      filter:drop-shadow(0 0 4px rgba(255,65,210,.35));
    }

    /* 1인/구독자/비밀방: 큰 네모 채팅 배경 제거, 파장 위에서 새 글이 아래부터 위로 쌓임 */
    .ktsolo-chat,.ktsubscriber-chat,.ktsecret-chat{
      position:absolute!important;
      left:10px!important;
      right:150px!important;
      bottom:110px!important;
      height:auto!important;
      min-height:0!important;
      max-height:118px!important;
      padding:0 3px 2px!important;
      margin:0!important;
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      backdrop-filter:none!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-end!important;
      overflow:hidden!important;
      pointer-events:none!important;
      z-index:9!important;
    }

    /* 13명방: 기존 자리 그대로, 네모칸 없이 여러 줄이 아래부터 위로 쌓임 */
    .ktg13-chat{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      padding:0 4px 2px!important;
      margin:0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:flex-end!important;
      overflow:hidden!important;
      pointer-events:none!important;
    }

    .ktsolo-chat:empty::before,
    .ktsubscriber-chat:empty::before,
    .ktsecret-chat:empty::before,
    .ktg13-chat:empty::before{
      content:"채팅을 입력하면 아래에서 위로 올라옵니다"!important;
      display:block!important;
      color:rgba(255,255,255,.62)!important;
      background:transparent!important;
      font-size:10px!important;
      font-weight:800!important;
      line-height:1.25!important;
      margin:0 0 2px!important;
      padding:0!important;
      text-shadow:0 1px 3px #000,0 0 5px #000!important;
    }

    .ktsolo-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.ktg13-chat-line{
      display:grid!important;
      grid-template-columns:18px auto minmax(0,1fr)!important;
      align-items:center!important;
      column-gap:5px!important;
      margin:4px 0 0!important;
      padding:0!important;
      min-width:0!important;
      color:#fff!important;
      font-size:11px!important;
      line-height:1.25!important;
      font-weight:850!important;
      text-shadow:0 1px 3px #000,0 0 5px #000!important;
    }
    .ktsolo-chat-line::before,.ktsubscriber-chat-line::before,.ktsecret-chat-line::before,.ktg13-chat-line::before{
      content:"";
      width:17px;
      height:17px;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.78);
      background:linear-gradient(135deg,#9b65ff,#ff5da8);
      box-shadow:0 0 5px rgba(255,70,190,.38);
    }
    .ktsolo-chat-line b,.ktsubscriber-chat-line b,.ktsecret-chat-line b,.ktg13-chat-line b{
      white-space:nowrap!important;
      color:#ff6bc9!important;
      font-size:11px!important;
      font-weight:950!important;
    }
    .ktsolo-chat-line span,.ktsubscriber-chat-line span,.ktsecret-chat-line span,.ktg13-chat-line span{
      min-width:0!important;
      color:#fff!important;
      font-size:11px!important;
      font-weight:800!important;
      white-space:normal!important;
      overflow-wrap:anywhere!important;
    }

    .ktsolo-chat-line:nth-child(2n) b,.ktsubscriber-chat-line:nth-child(2n) b,.ktsecret-chat-line:nth-child(2n) b,.ktg13-chat-line:nth-child(2n) b{color:#55d9ff!important}
    .ktsolo-chat-line:nth-child(3n) b,.ktsubscriber-chat-line:nth-child(3n) b,.ktsecret-chat-line:nth-child(3n) b,.ktg13-chat-line:nth-child(3n) b{color:#79ef72!important}
    .ktsolo-chat-line:nth-child(4n) b,.ktsubscriber-chat-line:nth-child(4n) b,.ktsecret-chat-line:nth-child(4n) b,.ktg13-chat-line:nth-child(4n) b{color:#ffd45c!important}

    @media(max-width:390px){
      .ktsolo-chat,.ktsubscriber-chat,.ktsecret-chat{
        left:8px!important;
        right:136px!important;
        bottom:104px!important;
        max-height:108px!important;
      }
      .ktsolo-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.ktg13-chat-line{
        grid-template-columns:16px auto minmax(0,1fr)!important;
        column-gap:4px!important;
        font-size:10px!important;
      }
      .ktsolo-chat-line::before,.ktsubscriber-chat-line::before,.ktsecret-chat-line::before,.ktg13-chat-line::before{
        width:15px;
        height:15px;
      }
      .ktsolo-chat-line b,.ktsubscriber-chat-line b,.ktsecret-chat-line b,.ktg13-chat-line b,
      .ktsolo-chat-line span,.ktsubscriber-chat-line span,.ktsecret-chat-line span,.ktg13-chat-line span{font-size:10px!important}
    }
  `;
  document.head.appendChild(style);
})();

/* 이번 요청 3가지만 별도 파일로 불러온다. 기존 파장/채팅 코드는 그대로 둔다. */
(function(){
  if(document.querySelector('script[data-kt-requested-fixes]'))return;
  var s=document.createElement('script');
  s.src='requested-fixes-20260907.js?v=20260907a';
  s.async=false;
  s.setAttribute('data-kt-requested-fixes','1');
  document.head.appendChild(s);
})();

/* 촬영 화면을 열면 사람(카메라 미리보기)이 바로 보이게 복구. 녹화 전에는 카메라만, 녹화 시작 때 마이크를 붙인다. */
(function(){
  if(window.__ktCreatorPersonPreviewRestoreInstalled)return;
  window.__ktCreatorPersonPreviewRestoreInstalled=true;

  function liveTracks(stream,kind){
    try{
      var list=kind==='audio'?stream.getAudioTracks():stream.getVideoTracks();
      return list&&list.some(function(t){return t.readyState==='live';});
    }catch(e){return false;}
  }

  async function attachPreview(){
    var c=document.getElementById('creator');
    if(!c||!c.classList.contains('show'))return false;
    var stream=null;
    try{stream=window.state&&state.stream;}catch(e){}
    if(!stream||!liveTracks(stream,'video')){
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;
      try{
        stream=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:(window.state&&state.cameraFacing)||'user'}},
          audio:false
        });
        if(window.state)state.stream=stream;
        try{sessionStorage.setItem('kt_camera_allowed_this_session','1');}catch(e){}
      }catch(e){return false;}
    }
    try{
      var cam=document.getElementById('camera');
      var bg=document.getElementById('cameraBg');
      if(cam){cam.srcObject=stream;cam.muted=true;cam.setAttribute('playsinline','');try{await cam.play();}catch(e){}}
      if(bg){bg.srcObject=stream;bg.muted=true;bg.setAttribute('playsinline','');try{await bg.play();}catch(e){}}
      c.classList.add('camera-on');
      return true;
    }catch(e){return false;}
  }

  var previousOpen=window.openCreator;
  if(typeof previousOpen==='function'){
    window.openCreator=async function(){
      var r=await previousOpen.apply(this,arguments);
      await attachPreview();
      return r;
    };
  }

  var previousStart=window.startCreatorRecording;
  if(typeof previousStart==='function'){
    window.startCreatorRecording=async function(){
      await attachPreview();
      var stream=null;
      try{stream=window.state&&state.stream;}catch(e){}
      if(stream&&liveTracks(stream,'video')&&!liveTracks(stream,'audio')&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
        try{
          var mic=await navigator.mediaDevices.getUserMedia({video:false,audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
          mic.getAudioTracks().forEach(function(t){try{stream.addTrack(t);}catch(e){}});
        }catch(e){}
      }
      return previousStart.apply(this,arguments);
    };
  }

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(function(){attachPreview();},80);
  });
})();

/* 비밀방 스위치만 터치 보강: 비밀방 버튼을 누르면 반드시 선택되고 비밀번호 입력칸이 열린다. */
(function(){
  if(window.__ktSecretSwitchTouchFixInstalled)return;
  window.__ktSecretSwitchTouchFixInstalled=true;

  function isSecretButton(el){
    if(!el)return false;
    var txt=String(el.textContent||'').replace(/\s+/g,'');
    return txt.indexOf('비밀방')>-1 && (el.classList.contains('room-switch') || !!el.closest('.kt-creator-room-shortcuts'));
  }

  function forceSecret(el){
    try{
      if(window.state){
        state.liveRoomType='password';
        state.liveRoomName='비밀방';
        state.liveRoomMax=7;
      }
      var title=document.getElementById('liveTitle');
      if(title)title.value='비밀방';
      document.querySelectorAll('.room-switch').forEach(function(b){b.classList.remove('on');});
      if(el&&el.classList.contains('room-switch'))el.classList.add('on');
      else{
        document.querySelectorAll('.room-switch').forEach(function(b){
          if(String(b.textContent||'').indexOf('비밀방')>-1)b.classList.add('on');
        });
      }
      if(typeof window.selectPrepRoom==='function'){
        var sw=el&&el.classList.contains('room-switch')?el:Array.from(document.querySelectorAll('.room-switch')).find(function(b){return String(b.textContent||'').indexOf('비밀방')>-1;});
        window.selectPrepRoom(sw||null,'password','비밀방',7);
      }
    }catch(e){}
  }

  document.addEventListener('pointerup',function(e){
    var el=e.target&&e.target.closest?e.target.closest('button'):null;
    if(isSecretButton(el))setTimeout(function(){forceSecret(el);},0);
  },true);

  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest('button'):null;
    if(isSecretButton(el))setTimeout(function(){forceSecret(el);},0);
  },true);

  var style=document.createElement('style');
  style.id='ktSecretSwitchTouchFixStyle';
  style.textContent='.room-switch,.kt-creator-room-shortcuts button{pointer-events:auto!important;touch-action:manipulation!important}.room-switch{position:relative!important;z-index:20!important}';
  document.head.appendChild(style);
})();

/* 13명 방에 첫 번째 사진 저장본만 연결. */
(function(){
  if(document.querySelector('script[data-kt-group13-first-photo]'))return;
  var s=document.createElement('script');
  s.src='group13-first-photo.js?v=20260909a';
  s.async=false;
  s.setAttribute('data-kt-group13-first-photo','1');
  document.head.appendChild(s);
})();

/* 13명 방의 기존 보물상자 기능을 1인/구독자/비밀방에도 연결. */
(function(){
  if(document.querySelector('script[data-kt-treasure-other-rooms]'))return;
  var s=document.createElement('script');
  s.src='treasure-other-rooms.js?v=20260909a';
  s.async=false;
  s.setAttribute('data-kt-treasure-other-rooms','1');
  document.head.appendChild(s);
})();
