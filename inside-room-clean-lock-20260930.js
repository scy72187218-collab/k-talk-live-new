/* K-Talk 방 안 정리 잠금 2026-09-30
   요청 범위만: 방 안 파장 완전 숨김 + 방 입장 후 프로필 옆 빨간 LIVE 배지 숨김.
   ON AIR / 통신 / 수익률 / 버튼 / 배치는 변경하지 않음. */
(function(){
  if(window.__ktInsideRoomCleanLock20260930)return;
  window.__ktInsideRoomCleanLock20260930=true;

  function ensureStyle(){
    if(document.getElementById('ktInsideRoomCleanLockStyle20260930'))return;
    var s=document.createElement('style');
    s.id='ktInsideRoomCleanLockStyle20260930';
    s.textContent=''
      +'#screen .ktsolo-wave,#screen .ktg13-wave,#screen .ktsubscriber-wave,#screen .ktsecret-wave,'
      +'#screen .kt-secret-wave,#screen .secret-wave,#screen .kt-room-live-wave,'
      +'#screen .kt-active-sound-wave-20260928{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;animation:none!important}'
      +'#screen .ktg13-main::after{content:none!important;display:none!important;visibility:hidden!important;opacity:0!important}'
      +'html.kt-inside-broadcast-room .kt-video-live-peek .ktvl-live{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function isInsideRoom(){
    return !!document.querySelector(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .ktg9-room'
    );
  }

  function isOnAirArea(el){
    try{
      return !!el.closest(
        '.ktsolo-air,.ktg13-air,.ktsubscriber-air,.ktsecret-airrow,.kt-live-airclock'
      );
    }catch(e){return false;}
  }

  function hideInnerLiveBadges(){
    if(!isInsideRoom())return;
    var root=document.getElementById('screen');
    if(!root)return;
    root.querySelectorAll('span,b,em,i,strong,small,button,div').forEach(function(el){
      if(!el||isOnAirArea(el))return;
      var txt=String(el.textContent||'').replace(/\s+/g,'').toUpperCase();
      if(txt!=='LIVE'&&txt!=='●LIVE'&&txt!=='🔴LIVE')return;
      /* 브랜드 K-Talk LIVE 같은 큰 문구는 정확히 LIVE 단독이 아니므로 대상 아님 */
      try{
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('opacity','0','important');
        el.setAttribute('data-kt-inner-live-hidden','1');
      }catch(e){}
    });
  }

  function removeWaves(){
    try{
      document.querySelectorAll(
        '#screen .ktsolo-wave,#screen .ktg13-wave,#screen .ktsubscriber-wave,#screen .ktsecret-wave,'+
        '#screen .kt-secret-wave,#screen .secret-wave,#screen .kt-room-live-wave,#screen .kt-active-sound-wave-20260928'
      ).forEach(function(el){
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('opacity','0','important');
      });
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    var inside=isInsideRoom();
    try{document.documentElement.classList.toggle('kt-inside-broadcast-room',inside);}catch(e){}
    removeWaves();
    hideInnerLiveBadges();
  }

  apply();
  [20,80,180,400,900].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktInsideRoomCleanLockTimer20260930);
      window.__ktInsideRoomCleanLockTimer20260930=setTimeout(apply,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
