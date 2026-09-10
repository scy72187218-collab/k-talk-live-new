/* K-Talk 비밀방 화면 배치만 정리: 6칸/우측버튼/채팅/파장/수익/선물 겹침 제거. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSecretRoomLayoutAdjust20260910Installed)return;
  window.__ktSecretRoomLayoutAdjust20260910Installed=true;

  var style=document.createElement('style');
  style.id='ktSecretRoomLayoutAdjust20260910Style';
  style.textContent=''
    +'body.kt-secret-layout-adjust .ktsecret-main{overflow:hidden!important}'
    +'body.kt-secret-layout-adjust .ktsecret-six-grid{top:0!important;left:0!important;right:52px!important;bottom:132px!important;inset:auto!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-slot{min-width:0!important;min-height:0!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right{top:8px!important;right:5px!important;bottom:auto!important;left:auto!important;display:grid!important;gap:5px!important;z-index:12!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right button{width:40px!important;height:40px!important;min-height:40px!important;font-size:14px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right .like{height:44px!important;min-height:44px!important;border-radius:14px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right small{font-size:7px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-gifts{left:3px!important;right:3px!important;bottom:3px!important;height:56px!important;gap:3px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-wave{left:5px!important;right:5px!important;bottom:62px!important;height:25px!important;z-index:5!important;opacity:.92!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat{left:7px!important;right:142px!important;bottom:92px!important;max-height:34px!important;padding:0 3px 2px!important;background:transparent!important;border-radius:0!important;z-index:9!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat:empty:before{font-size:9px!important;line-height:1.2!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat-line{margin-top:2px!important;font-size:9px!important;line-height:1.15!important}'
    +'body.kt-secret-layout-adjust .ktsecret-earn{right:7px!important;bottom:92px!important;width:132px!important;max-width:40%!important;z-index:10!important}'
    +'body.kt-secret-layout-adjust .ktsecret-earn #myEarnHud{padding:3px 6px!important;border-radius:12px!important}'
    +'body.kt-secret-layout-adjust #ktWifiStatusIndicator{left:auto!important;right:96px!important;top:72px!important;bottom:auto!important;height:25px!important;padding:0 6px!important;font-size:8px!important;gap:3px!important;z-index:40!important}'
    +'body.kt-secret-layout-adjust #ktWifiStatusIndicator .kt-net-icon{font-size:11px!important}'
    +'@media(max-width:390px){'
      +'body.kt-secret-layout-adjust .ktsecret-six-grid{right:48px!important;bottom:126px!important;gap:2px!important;padding:2px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-right{right:4px!important;top:6px!important;gap:4px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-right button{width:38px!important;height:38px!important;min-height:38px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-right .like{height:42px!important;min-height:42px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-gifts{height:54px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-wave{bottom:59px!important;height:23px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-chat{right:136px!important;bottom:86px!important;max-height:32px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-earn{right:5px!important;bottom:86px!important;width:126px!important}'
      +'body.kt-secret-layout-adjust #ktWifiStatusIndicator{right:92px!important;top:70px!important;height:24px!important;font-size:8px!important;padding:0 5px!important}'
    +'}';
  document.head.appendChild(style);

  function sync(){
    try{document.body.classList.toggle('kt-secret-layout-adjust',!!document.querySelector('.ktsecret-room'));}catch(e){}
  }
  sync();
  if(document.body){
    var mo=new MutationObserver(sync);
    mo.observe(document.body,{childList:true,subtree:true});
  }else{
    document.addEventListener('DOMContentLoaded',sync,{once:true});
  }
})();
