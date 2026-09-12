/* 2026-09-12 요청: 1인 방송 무지개 파장만 더 아래로 내리고, 좌우 끝까지 유지. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraPhotoStyle20260911V10)return;
  window.__ktWaveCameraPhotoStyle20260911V10=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraPhotoStyle20260911V10';
  st.textContent=''
    +'.kt-open-camera-wave{position:absolute!important;display:block!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;opacity:.98!important;background:none!important;filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;animation:none!important;--kt-wave-speed:.22s;--kt-wave-delay:0s}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:0!important;bottom:0!important;background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave10")!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:100% 100%!important;transform-origin:center bottom!important;will-change:transform!important;animation:ktWavePhotoMove var(--kt-wave-speed) ease-in-out var(--kt-wave-delay) infinite alternate!important}'
    +'@keyframes ktWavePhotoMove{0%{transform:scaleY(.52)}45%{transform:scaleY(.82)}100%{transform:scaleY(1)}}'
    +'.kt-open-camera-wave i{display:none!important}'
    +'/* 1인방: 좌우 끝까지 유지하고 파장만 더 아래로 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:36px!important;width:auto!important;height:58px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 기존 위치/크기 그대로 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:42px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:30px!important;height:54px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:38px!important}}';
  document.head.appendChild(st);

  var speeds=['.18s','.21s','.24s','.19s','.23s','.20s'];
  var delays=['-.03s','-.11s','-.17s','-.07s','-.14s','-.20s'];

  function clean(wave,index){
    if(!wave)return;
    if(wave.children.length)wave.innerHTML='';
    wave.removeAttribute('data-kt-bars');
    wave.removeAttribute('data-kt-bars-restore');
    wave.removeAttribute('data-kt-voice-bars');
    wave.removeAttribute('data-kt-voice-bars-v3');
    wave.removeAttribute('data-kt-voice-bars-v4');
    wave.style.removeProperty('--kt-wave-scale');
    wave.style.setProperty('--kt-wave-speed',speeds[index%speeds.length]);
    wave.style.setProperty('--kt-wave-delay',delays[index%delays.length]);
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(function(wave,index){clean(wave,index);});
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();

/* 2026-09-12: 9명 방송만 호스트 포함 3 x 3 같은 크기로 정렬. 다른 방/UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktNineRoomThreeByThreeOnly)return;
  window.__ktNineRoomThreeByThreeOnly=true;

  var st=document.createElement('style');
  st.id='ktNineRoomThreeByThreeOnlyStyle';
  st.textContent=''
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-main{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:2px!important}'
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-host{grid-column:1!important;grid-row:1!important;min-width:0!important;min-height:0!important}'
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-guests{display:contents!important}'
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-host-extra{display:none!important}'
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-host>video{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}'
    +'#screen .ktg13-room.kt-nine-grid-only .ktg13-guest{min-width:0!important;min-height:0!important}';
  document.head.appendChild(st);

  function applyNineOnly(){
    var room=document.querySelector('#screen .ktg13-room');
    if(!room)return;
    var head=room.querySelector('.ktg13-air strong');
    var text=String(head&&head.textContent||'').replace(/\s+/g,'');
    var isNine=text.indexOf('9명방송')>-1;
    if(!isNine){
      try{isNine=!!(window.state&&(state.liveRoomType==='group9'||state.liveRoomName==='9명 방송'));}catch(e){}
    }
    room.classList.toggle('kt-nine-grid-only',!!isNine);
  }

  var ob=new MutationObserver(function(){applyNineOnly();});
  try{ob.observe(document.body,{childList:true,subtree:true,characterData:true});}catch(e){}
  setTimeout(applyNineOnly,0);
  setTimeout(applyNineOnly,80);
  setTimeout(applyNineOnly,220);
  setTimeout(applyNineOnly,600);
})();

/* 2026-09-12: 구독자방·비밀방도 9명방/13명방과 같이 마이크·카메라를 파장 아래에 두고 카메라 잠김/열림 사용. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktSubSecretCameraLockControlsInstalled)return;
  window.__ktSubSecretCameraLockControlsInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSubSecretCameraLockControlsStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubSecretCameraLockControlsStyle';
    s.textContent=''
      +'.ktsubscriber-room .ktsubscriber-host>.kt-open-camera-wave,.ktsecret-room .ktsecret-slot.host>.kt-open-camera-wave{bottom:31px!important;height:34px!important}'
      +'.ktsubscriber-room .ktsubscriber-host>.kt-person-mic,.ktsecret-room .ktsecret-slot.host>.kt-person-mic{top:auto!important;right:5px!important;bottom:4px!important}'
      +'.kt-room-camera-toggle{position:absolute!important;right:36px!important;bottom:4px!important;z-index:26!important;height:25px!important;min-width:54px!important;padding:0 7px!important;border:1px solid rgba(255,255,255,.45)!important;border-radius:13px!important;background:rgba(8,8,12,.80)!important;color:#fff!important;font:900 10px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;touch-action:manipulation!important}'
      +'.kt-room-camera-toggle.locked{background:rgba(112,18,32,.88)!important}'
      +'.kt-room-camera-lock-mask{display:none;position:absolute;inset:0;z-index:2;background:#08080b;color:#fff;font:900 13px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif;align-items:center;justify-content:center;text-align:center}'
      +'.ktsubscriber-host.kt-camera-locked>.kt-room-camera-lock-mask,.ktsecret-slot.host.kt-camera-locked>.kt-room-camera-lock-mask{display:flex!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-host>.kt-open-camera-wave,.ktsecret-room .ktsecret-slot.host>.kt-open-camera-wave{bottom:28px!important;height:31px!important}.ktsubscriber-room .ktsubscriber-host>.kt-person-mic,.ktsecret-room .ktsecret-slot.host>.kt-person-mic{right:3px!important;bottom:3px!important}.kt-room-camera-toggle{right:31px!important;bottom:3px!important;height:22px!important;min-width:49px!important;font-size:9px!important}}';
    document.head.appendChild(s);
  }

  function videoTracks(host){
    try{
      if(window.state&&state.stream&&state.stream.getVideoTracks)return state.stream.getVideoTracks();
    }catch(e){}
    var v=host&&host.querySelector?host.querySelector('video'):null;
    try{
      if(v&&v.srcObject&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
    }catch(e){}
    return [];
  }

  function cameraOpen(host){
    var tracks=videoTracks(host);
    if(!tracks.length)return true;
    return tracks.some(function(t){return t.enabled!==false;});
  }

  function sync(host,btn){
    var open=cameraOpen(host);
    host.classList.toggle('kt-camera-locked',!open);
    btn.classList.toggle('locked',!open);
    btn.innerHTML=open?'📷 <span>열림</span>':'🔒 <span>잠김</span>';
    btn.title=open?'카메라 잠그기':'카메라 열기';
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(host,btn){
    var tracks=videoTracks(host);
    if(!tracks.length)return;
    var open=cameraOpen(host);
    tracks.forEach(function(t){try{t.enabled=!open;}catch(e){}});
    sync(host,btn);
  }

  function installHost(host){
    if(!host)return;
    ensureStyle();

    var mask=host.querySelector(':scope > .kt-room-camera-lock-mask');
    if(!mask){
      mask=document.createElement('div');
      mask.className='kt-room-camera-lock-mask';
      mask.innerHTML='🔒 카메라 잠김';
      host.appendChild(mask);
    }

    var btn=host.querySelector(':scope > .kt-room-camera-toggle');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-room-camera-toggle';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        toggle(host,this);
      };
      host.appendChild(btn);
    }
    sync(host,btn);
  }

  function install(){
    installHost(document.querySelector('.ktsubscriber-room .ktsubscriber-host'));
    installHost(document.querySelector('.ktsecret-room .ktsecret-slot.host'));
  }

  install();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSubSecretCameraControlsTimer);
      window.__ktSubSecretCameraControlsTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
