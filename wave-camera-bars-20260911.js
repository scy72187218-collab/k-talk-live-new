/* 2026-09-11 요청: 현재 무지개 파장 모양과 위치는 그대로 두고 움직임만 확실하게 적용. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraPhotoStyle20260911V9)return;
  window.__ktWaveCameraPhotoStyle20260911V9=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraPhotoStyle20260911V9';
  st.textContent=''
    +'.kt-open-camera-wave{position:absolute!important;display:block!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;opacity:.98!important;background:none!important;filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;animation:none!important}'
    +'.kt-open-camera-wave:before{content:""!important;position:absolute!important;left:0!important;right:0!important;top:0!important;bottom:0!important;background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave9")!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:100% 100%!important;transform-origin:center bottom!important;will-change:transform!important;animation:ktWavePhotoMove .48s ease-in-out infinite alternate!important}'
    +'@keyframes ktWavePhotoMove{0%{transform:scaleY(.52)}45%{transform:scaleY(.82)}100%{transform:scaleY(1)}}'
    +'.kt-open-camera-wave i{display:none!important}'
    +'/* 1인방: 기존 위치/크기 그대로 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:66px!important;width:auto!important;height:58px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 기존 위치/크기 그대로 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:42px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:60px!important;height:54px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:38px!important}}';
  document.head.appendChild(st);

  function clean(wave){
    if(!wave)return;
    if(wave.children.length)wave.innerHTML='';
    wave.removeAttribute('data-kt-bars');
    wave.removeAttribute('data-kt-bars-restore');
    wave.removeAttribute('data-kt-voice-bars');
    wave.removeAttribute('data-kt-voice-bars-v3');
    wave.removeAttribute('data-kt-voice-bars-v4');
    wave.style.removeProperty('--kt-wave-scale');
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(clean);
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();
