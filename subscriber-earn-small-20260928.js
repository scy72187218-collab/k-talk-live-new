/* K-Talk 2026-09-28: 구독자방 수익률 박스만 축소. 다른 방/배치/버튼은 변경하지 않음. */
(function(){
  if(window.__ktSubscriberEarnSmall20260928)return;
  window.__ktSubscriberEarnSmall20260928=true;
  var s=document.createElement('style');
  s.id='ktSubscriberEarnSmallStyle20260928';
  s.textContent=''
    +'html body .ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 76px!important;gap:4px!important}'
    +'html body .ktsubscriber-room .ktsubscriber-earn{width:76px!important;max-width:76px!important;justify-self:end!important;align-items:flex-end!important}'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud{width:76px!important;max-width:76px!important;min-width:76px!important;height:45px!important;max-height:45px!important;padding:1px 2px!important;border-radius:8px!important}'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud span,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud span{font-size:4.8px!important;line-height:1!important}'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud b,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud b{font-size:7px!important;line-height:1!important}'
    +'html body .ktsubscriber-room #ktSubscriberEarnDetail{font-size:4.5px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
    +'@media(max-width:390px){'
      +'html body .ktsubscriber-room .ktsubscriber-info{grid-template-columns:minmax(0,1fr) 72px!important}'
      +'html body .ktsubscriber-room .ktsubscriber-earn{width:72px!important;max-width:72px!important}'
      +'html body .ktsubscriber-room #ktSubscriberEarnHud,'
      +'html body .ktsubscriber-room .ktsubscriber-earnhud{width:72px!important;max-width:72px!important;min-width:72px!important;height:43px!important;max-height:43px!important}'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();