/* K-Talk 수익표 보정: 13명방과 구독자방을 같은 크기/펼침 상태로 맞춤. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktSecretEarningsSizeSyncV2Installed)return;
  window.__ktSecretEarningsSizeSyncV2Installed=true;

  var old=document.getElementById('ktSecretEarningsSizeSyncStyle');
  if(old)old.remove();
  var s=document.createElement('style');
  s.id='ktSecretEarningsSizeSyncStyle';
  s.textContent=''
    +'.ktsolo-room .ktsolo-earn{width:110px!important;max-width:110px!important;transform:none!important}'
    +'.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 110px!important}'
    +'.ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 110px!important}'
    +'.ktg13-room .ktg13-earn,.ktsubscriber-room .ktsubscriber-earn{height:64px!important;min-height:64px!important;align-items:flex-end!important}'
    +'.ktsolo-room .ktsolo-earn #myEarnHud,'
    +'.ktg13-room .ktg13-earn #myEarnHud,'
    +'.ktsubscriber-room #ktSubscriberEarnHud,'
    +'.ktsubscriber-room .ktsubscriber-earnhud,'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{width:110px!important;max-width:110px!important;min-width:110px!important;height:64px!important;max-height:64px!important;padding:2px 3px!important;box-sizing:border-box!important;overflow:hidden!important;border-radius:10px!important}'
    +'.ktsolo-room #myEarnHud>div:first-child,.ktg13-room #myEarnHud>div:first-child,.ktsubscriber-room #ktSubscriberEarnHud>div:first-child,.ktsubscriber-room .ktsubscriber-earnhud>div:first-child,.ktsecret-room #myEarnHud>div:first-child{display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;white-space:nowrap!important;overflow:hidden!important}'
    +'.ktsolo-room #myEarnHud span,.ktg13-room #myEarnHud span,.ktsubscriber-room #ktSubscriberEarnHud span,.ktsubscriber-room .ktsubscriber-earnhud span,.ktsecret-room #myEarnHud span{font-size:6.5px!important;line-height:1.05!important}'
    +'.ktsolo-room #myEarnHud b,.ktg13-room #myEarnHud b,.ktsubscriber-room #ktSubscriberEarnHud b,.ktsubscriber-room .ktsubscriber-earnhud b,.ktsecret-room #myEarnHud b{font-size:9px!important;line-height:1.05!important}'
    +'.ktg13-room #myEarnDetail,.ktsubscriber-room #ktSubscriberEarnDetail{display:grid!important;width:100%!important;max-width:100%!important;overflow:hidden!important;font-size:6px!important;line-height:1.05!important;gap:1px 2px!important;margin-top:2px!important}'
    +'.ktg13-room #myEarnDetail>*,.ktsubscriber-room #ktSubscriberEarnDetail>*{white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important}'
    +'@media(max-width:390px){.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 100px!important}.ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 100px!important}.ktg13-room .ktg13-earn #myEarnHud,.ktsubscriber-room #ktSubscriberEarnHud,.ktsubscriber-room .ktsubscriber-earnhud{width:100px!important;max-width:100px!important;min-width:100px!important;height:64px!important;max-height:64px!important;padding:2px 2px!important}}';
  document.head.appendChild(s);

  function expandBoth(){
    document.querySelectorAll('.ktg13-room #myEarnDetail,.ktsubscriber-room #ktSubscriberEarnDetail').forEach(function(d){
      d.style.display='grid';
    });
  }
  expandBoth();
  var mo=new MutationObserver(function(){setTimeout(expandBoth,0);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
