/* K-Talk 2026-10-01
   1111 exact scope: guest/remote chat height only.
   Keep chat low like host room so it does not cover guest faces.
   Do not alter video, live entry/exit, approval, earnings, menus, TV or recording. */
(function(){
  if(window.__ktGuestChatHostHeightLock20261001)return;
  window.__ktGuestChatHostHeightLock20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktGuestChatHostHeightLockStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktGuestChatHostHeightLockStyle20261001';
    s.textContent=''
      /* 일반 게스트 채팅 */
      +'.kt-remote-live>.kt-remote-chat{bottom:64px!important;max-height:70px!important;height:auto!important;overflow:hidden!important;justify-content:flex-end!important}'
      +'.kt-remote-live.kt-guest-hostlike-active>.kt-remote-chat{bottom:64px!important;max-height:70px!important;height:auto!important}'
      /* 승인 게스트 호스트형 화면 내부 채팅 */
      +'.kt-remote-live .kgh-chat{flex:0 0 68px!important;min-height:0!important;height:68px!important;max-height:68px!important;overflow:hidden!important}'
      +'.kt-remote-live .kgh-chatbox{height:64px!important;max-height:64px!important;min-height:0!important;overflow:hidden!important;justify-content:flex-end!important}'
      /* 플로팅 채팅이 별도 클래스인 경우도 게스트 화면 안에서만 제한 */
      +'.kt-remote-live .ktg13-chat,.kt-remote-live .ktsubscriber-chat,.kt-remote-live .ktsolo-chat,.kt-remote-live .ktsecret-chat{height:68px!important;min-height:0!important;max-height:68px!important;overflow:hidden!important;justify-content:flex-end!important}'
      +'@media(max-width:390px){'
        +'.kt-remote-live>.kt-remote-chat{bottom:60px!important;max-height:62px!important;height:auto!important}'
        +'.kt-remote-live.kt-guest-hostlike-active>.kt-remote-chat{bottom:60px!important;max-height:62px!important;height:auto!important}'
        +'.kt-remote-live .kgh-chat{flex-basis:62px!important;height:62px!important;max-height:62px!important}'
        +'.kt-remote-live .kgh-chatbox{height:58px!important;max-height:58px!important}'
        +'.kt-remote-live .ktg13-chat,.kt-remote-live .ktsubscriber-chat,.kt-remote-live .ktsolo-chat,.kt-remote-live .ktsecret-chat{height:62px!important;max-height:62px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensureStyle();
  [50,150,400,900,1800].forEach(function(ms){setTimeout(ensureStyle,ms);});
  try{
    new MutationObserver(function(){ensureStyle();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();