/* K-Talk 모바일 브라우저 하단바 겹침 방지.
   1인/9명/13명/구독자/비밀방의 하단 아이콘과 글씨를 브라우저 흰색 바 위로 올림.
   방송/카메라/채팅 기능은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomBrowserBottomSafe20260918)return;
  window.__ktAllRoomBrowserBottomSafe20260918=true;

  function standalone(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone===true;
    }catch(e){return false;}
  }

  function guardPx(){
    if(standalone())return 6;
    var ua=String(navigator.userAgent||'').toLowerCase();
    if(/naver/.test(ua))return 74;
    if(/android|iphone|ipad|ipod/.test(ua))return 62;
    return 8;
  }

  function ensureStyle(){
    if(document.getElementById('ktAllRoomBrowserBottomSafeStyle'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomBrowserBottomSafeStyle';
    s.textContent=''
      +':root{--kt-room-browser-bottom-safe:62px}'
      +'.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room{'
        +'padding-bottom:calc(5px + env(safe-area-inset-bottom) + var(--kt-room-browser-bottom-safe))!important;'
      +'}'
      +'.ktsolo-room,.ktsecret-room,.ktg13-room:not([data-kt-room]){'
        +'padding-bottom:calc(17px + env(safe-area-inset-bottom) + var(--kt-room-browser-bottom-safe))!important;'
      +'}'
      +'.ktg13-room[data-kt-room="9"]{'
        +'padding-bottom:calc(10px + env(safe-area-inset-bottom))!important;'
      +'}'
      +'.ktsolo-tools,.ktg13-tools,.ktsubscriber-tools,.ktsecret-tools{'
        +'position:relative!important;z-index:30!important;flex-shrink:0!important;'
      +'}'
      +'.ktsolo-tool span,.ktg13-tool span,.ktsubscriber-tool span,.ktsecret-tool span{'
        +'position:relative!important;z-index:31!important;line-height:1.2!important;'
      +'}'
      +'@media(min-width:700px){:root{--kt-room-browser-bottom-safe:8px}}';
    document.head.appendChild(s);
  }

  function apply(){
    ensureStyle();
    try{
      document.documentElement.style.setProperty('--kt-room-browser-bottom-safe',guardPx()+'px');
    }catch(e){}
  }

  apply();
  window.addEventListener('resize',apply);
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
  window.addEventListener('pageshow',apply);
  if(window.visualViewport){
    try{window.visualViewport.addEventListener('resize',apply);}catch(e){}
  }
  new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
})();