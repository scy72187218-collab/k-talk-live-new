/* K-Talk 파장 위치만 수정: 새 파장은 만들지 않고, 기존 카메라별 파장만 보이게 한다. 1인/13명/구독자/비밀방 외 다른 UI/기능은 건드리지 않음. */
(function(){
  if(window.__ktCameraPersonWaveOnlyInstalled)return;
  window.__ktCameraPersonWaveOnlyInstalled=true;

  function addStyle(){
    if(document.getElementById('ktCameraPersonWaveOnlyStyle'))return;
    var s=document.createElement('style');
    s.id='ktCameraPersonWaveOnlyStyle';
    s.textContent=`
      /* 아래에 따로 있던 공용 파장은 숨긴다. 새 파장은 만들지 않는다. */
      html body .ktsolo-room .ktsolo-wave,
      html body .ktg13-room .ktg13-wave-bars,
      html body .ktsubscriber-room .ktsubscriber-wave,
      html body .ktsecret-room .ktsecret-wave,
      html body .ktsecret-room .kt-secret-wave,
      html body .ktsecret-room .secret-wave{
        display:none!important;
      }

      /* 이미 만들어져 있는 카메라별 파장만 다시 보이게 한다. */
      html body .ktsolo-room .kt-open-camera-wave,
      html body .ktg13-room .kt-open-camera-wave,
      html body .ktsubscriber-room .kt-open-camera-wave,
      html body .ktsecret-room .kt-open-camera-wave{
        display:block!important;
        pointer-events:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function apply(){
    addStyle();
    /* 기존 파장 DOM은 이동/복제/생성하지 않는다. 카메라가 열린 칸에 이미 붙어 있는 파장만 사용한다. */
  }

  apply();
  setTimeout(apply,80);
  setTimeout(apply,250);
  try{
    new MutationObserver(function(){addStyle();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
