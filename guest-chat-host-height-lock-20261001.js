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
      +'.kt-remote-live>.kt-remote-chat{bottom:64px!important;max-height:70px!important;overflow:hidden!important;justify-content:flex-end!important}'
      +'.kt-remote-live.kt-guest-hostlike-active>.kt-remote-chat{bottom:64px!important;max-height:70px!important}'
      +'@media(max-width:390px){.kt-remote-live>.kt-remote-chat{bottom:60px!important;max-height:66px!important}.kt-remote-live.kt-guest-hostlike-active>.kt-remote-chat{bottom:60px!important;max-height:66px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  ensureStyle();
  [50,150,400,900,1800].forEach(function(ms){setTimeout(ensureStyle,ms);});
  try{
    new MutationObserver(function(){ensureStyle();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();