/* K-Talk 수익표 보정: 기존 방은 그대로 두고 13명방에서만 수익표를 조금 줄이고 게스트 영역을 넓힘. */
(function(){
  if(window.__ktSecretEarningsSizeSyncV2Installed)return;
  window.__ktSecretEarningsSizeSyncV2Installed=true;

  var old=document.getElementById('ktSecretEarningsSizeSyncStyle');
  if(old)old.remove();
  var s=document.createElement('style');
  s.id='ktSecretEarningsSizeSyncStyle';
  s.textContent=''
    +'.ktsolo-room .ktsolo-earn{left:auto!important;right:0!important;top:8px!important;width:88px!important;max-width:88px!important;transform:scale(.82)!important;transform-origin:top right!important}'
    +'.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 110px!important}'
    +'.ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 110px!important}'
    +'.ktg13-room .ktg13-earn{grid-column:2!important;justify-self:end!important;width:110px!important;max-width:110px!important;display:flex!important;justify-content:flex-end!important}'
    +'.ktg13-room .ktg13-earn,.ktsubscriber-room .ktsubscriber-earn{height:64px!important;min-height:64px!important;align-items:flex-end!important}'
    +'.ktsolo-room .ktsolo-earn #myEarnHud{width:88px!important;max-width:88px!important;min-width:88px!important;height:54px!important;max-height:54px!important;padding:1px 2px!important}'
    +'.ktsolo-room .ktsolo-main #ktLiveVideo{left:50%!important;right:auto!important;inset-block:0!important;width:112%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center center!important;transform:translateX(-50%) scaleX(-1) scale(1.08)!important;transform-origin:center center!important}'
    +'.ktg13-room .ktg13-earn #myEarnHud,'
    +'.ktg13-room .ktg13-earn #myEarnHud,'
    +'.ktsubscriber-room #ktSubscriberEarnHud,'
    +'.ktsubscriber-room .ktsubscriber-earnhud,'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{width:110px!important;max-width:110px!important;min-width:110px!important;height:64px!important;max-height:64px!important;padding:2px 3px!important;box-sizing:border-box!important;overflow:hidden!important;border-radius:10px!important}'
    +'.ktg13-room .ktg13-earn #myEarnHud{margin-left:auto!important;margin-right:0!important;translate:0 0!important}'
    +'.ktsolo-room #myEarnHud>div:first-child,.ktg13-room #myEarnHud>div:first-child,.ktsubscriber-room #ktSubscriberEarnHud>div:first-child,.ktsubscriber-room .ktsubscriber-earnhud>div:first-child,.ktsecret-room #myEarnHud>div:first-child{display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;white-space:nowrap!important;overflow:hidden!important}'
    +'.ktsolo-room #myEarnHud span,.ktg13-room #myEarnHud span,.ktsubscriber-room #ktSubscriberEarnHud span,.ktsubscriber-room .ktsubscriber-earnhud span,.ktsecret-room #myEarnHud span{font-size:6.5px!important;line-height:1.05!important}'
    +'.ktsolo-room #myEarnHud b,.ktg13-room #myEarnHud b,.ktsubscriber-room #ktSubscriberEarnHud b,.ktsubscriber-room .ktsubscriber-earnhud b,.ktsecret-room #myEarnHud b{font-size:9px!important;line-height:1.05!important}'
    +'.ktg13-room #myEarnDetail,.ktsubscriber-room #ktSubscriberEarnDetail{display:grid!important;width:100%!important;max-width:100%!important;overflow:hidden!important;font-size:6px!important;line-height:1.05!important;gap:1px 2px!important;margin-top:2px!important}'
    +'.ktg13-room #myEarnDetail>*,.ktsubscriber-room #ktSubscriberEarnDetail>*{white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important}'
    +'.ktsecret-room .ktsecret-six-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot.host{height:100%!important;width:auto!important;aspect-ratio:1/1!important;justify-self:start!important;align-self:stretch!important;max-width:100%!important}'
    +'@media(max-width:390px){.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 100px!important}.ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 100px!important}.ktg13-room .ktg13-earn{width:100px!important;max-width:100px!important}.ktg13-room .ktg13-earn #myEarnHud,.ktsubscriber-room #ktSubscriberEarnHud,.ktsubscriber-room .ktsubscriber-earnhud{width:100px!important;max-width:100px!important;min-width:100px!important;height:64px!important;max-height:64px!important;padding:2px 2px!important}}'

    /* 13명방만: 수익표를 줄이고 그만큼 게스트 화면을 넓힘 */
    +'.ktg13-room .ktg13-main{grid-template-columns:38% 62%!important}'
    +'.ktg13-room .ktg13-guests{gap:1px!important}'
    +'.ktg13-room .ktg13-guest{position:relative!important;overflow:hidden!important}'
    +'.ktg13-room .ktg13-guest>video,.ktg13-room .ktg13-guest>img:not(.kt-guest-profile-photo){width:100%!important;height:100%!important;object-fit:cover!important}'
    +'.ktg13-room .ktg13-mid{flex:0 0 58px!important;grid-template-columns:minmax(0,1fr) 104px!important;gap:5px!important}'
    +'.ktg13-room .ktg13-chat{height:58px!important;max-height:58px!important}'
    +'.ktg13-room .ktg13-earn{width:104px!important;max-width:104px!important;height:54px!important;min-height:54px!important}'
    +'.ktg13-room .ktg13-earn #myEarnHud{width:104px!important;max-width:104px!important;min-width:104px!important;height:54px!important;max-height:54px!important;padding:1px 3px!important}'
    +'.ktg13-room #myEarnHud span{font-size:5.5px!important;line-height:1!important}'
    +'.ktg13-room #myEarnHud b{font-size:8px!important;line-height:1!important}'
    +'.ktg13-room #myEarnDetail{font-size:5.2px!important;line-height:1.08!important;gap:1px!important;margin-top:1px!important}'
    +'@media(max-width:390px){.ktg13-room .ktg13-main{grid-template-columns:37% 63%!important}.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 100px!important}.ktg13-room .ktg13-earn{width:100px!important;max-width:100px!important}.ktg13-room .ktg13-earn #myEarnHud{width:100px!important;max-width:100px!important;min-width:100px!important}}';
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
