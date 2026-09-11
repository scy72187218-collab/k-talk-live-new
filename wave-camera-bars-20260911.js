/* 2026-09-11 요청: 아까 잘 보였던 무지개 파장 모양으로 정확히 복구. 1인/13명/구독자/비밀방 파장만 변경. */
(function(){
  if(window.__ktWaveCameraPhotoStyle20260911V7)return;
  window.__ktWaveCameraPhotoStyle20260911V7=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraPhotoStyle20260911V7';
  st.textContent=''
    +'.kt-open-camera-wave{position:absolute!important;display:block!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;opacity:.98!important;background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave7")!important;background-repeat:no-repeat!important;background-position:center bottom!important;background-size:100% 100%!important;filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;animation:none!important}'
    +'.kt-open-camera-wave i{display:none!important}'
    +'/* 1인방: 카메라 왼쪽 끝부터 오른쪽 끝까지, 얼굴 아래쪽 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:66px!important;width:auto!important;height:58px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 실제 카메라/사진이 열린 각 칸 하단에만 */'
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
