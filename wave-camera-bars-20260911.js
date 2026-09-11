/* 2026-09-11 요청: 1인/13명/구독자/비밀방 파장만 세로 막대 무지개 형태로 통일. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraBars20260911)return;
  window.__ktWaveCameraBars20260911=true;

  var st=document.createElement('style');
  st.id='ktWaveCameraBarsStyle20260911';
  st.textContent=''
    +'.kt-open-camera-wave{background-image:none!important;background:none!important;display:flex!important;align-items:flex-end!important;gap:1px!important;padding:0!important;overflow:hidden!important;filter:none!important;opacity:.98!important;animation:none!important}'
    +'.kt-open-camera-wave i{display:block!important;flex:1 1 0!important;min-width:1px!important;max-width:5px!important;height:var(--kt-wave-h,18px)!important;border-radius:2px 2px 0 0!important;transform-origin:center bottom!important;animation:ktCameraBarBeat var(--kt-wave-d,.58s) ease-in-out infinite alternate!important;box-shadow:0 0 5px currentColor!important}'
    +'.kt-open-camera-wave i:nth-child(12n+1),.kt-open-camera-wave i:nth-child(12n+2){background:#ff1fbf!important;color:#ff1fbf!important}'
    +'.kt-open-camera-wave i:nth-child(12n+3),.kt-open-camera-wave i:nth-child(12n+4){background:#ff3c55!important;color:#ff3c55!important}'
    +'.kt-open-camera-wave i:nth-child(12n+5){background:#ff9e2f!important;color:#ff9e2f!important}'
    +'.kt-open-camera-wave i:nth-child(12n+6){background:#ffe13b!important;color:#ffe13b!important}'
    +'.kt-open-camera-wave i:nth-child(12n+7){background:#75ee45!important;color:#75ee45!important}'
    +'.kt-open-camera-wave i:nth-child(12n+8){background:#22ddb8!important;color:#22ddb8!important}'
    +'.kt-open-camera-wave i:nth-child(12n+9){background:#33cfff!important;color:#33cfff!important}'
    +'.kt-open-camera-wave i:nth-child(12n+10){background:#3c79ff!important;color:#3c79ff!important}'
    +'.kt-open-camera-wave i:nth-child(12n+11){background:#704dff!important;color:#704dff!important}'
    +'.kt-open-camera-wave i:nth-child(12n){background:#d52cff!important;color:#d52cff!important}'
    +'@keyframes ktCameraBarBeat{0%{transform:scaleY(.45)}45%{transform:scaleY(1.05)}100%{transform:scaleY(.68)}}'
    +'/* 1인방: 얼굴을 가리지 않게 아래로 내리고 카메라 끝에서 끝까지 */'
    +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:0!important;bottom:88px!important;width:auto!important;height:38px!important;z-index:5!important}'
    +'/* 13명/구독자/비밀방: 카메라가 열린 각 칸의 맨 아래에만 */'
    +'.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{left:0!important;right:0!important;bottom:0!important;width:auto!important;height:28px!important;z-index:5!important}'
    +'@media(max-width:390px){.ktsolo-main>.kt-open-camera-wave{bottom:82px!important;height:34px!important}.ktg13-host>.kt-open-camera-wave,.ktg13-guest>.kt-open-camera-wave,.ktsubscriber-host>.kt-open-camera-wave,.ktsubscriber-guest>.kt-open-camera-wave,.ktsecret-slot>.kt-open-camera-wave{height:25px!important}}';
  document.head.appendChild(st);

  function fill(wave){
    if(!wave||wave.dataset.ktBars==='1')return;
    wave.dataset.ktBars='1';
    wave.innerHTML='';
    for(var i=0;i<48;i++){
      var b=document.createElement('i');
      b.style.setProperty('--kt-wave-h',(8+((i*17)%29))+'px');
      b.style.setProperty('--kt-wave-d',(0.46+(i%7)*0.055).toFixed(3)+'s');
      wave.appendChild(b);
    }
  }

  function apply(){
    document.querySelectorAll('.kt-open-camera-wave').forEach(fill);
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();
