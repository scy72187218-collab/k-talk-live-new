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
