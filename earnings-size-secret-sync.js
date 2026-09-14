/* K-Talk 수익표 크기 통일: 비밀방 기준만 적용. 위치·버튼·다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktSecretEarningsSizeSyncInstalled)return;
  window.__ktSecretEarningsSizeSyncInstalled=true;

  var old=document.getElementById('ktSecretEarningsSizeSyncStyle');
  if(old)old.remove();

  var s=document.createElement('style');
  s.id='ktSecretEarningsSizeSyncStyle';
  s.textContent=''
    /* 1인방은 기존 축소 배율만 해제하고 비밀방과 같은 실제 크기로 맞춤 */
    +'html body .ktsolo-room .ktsolo-earn{width:110px!important;max-width:none!important;transform:none!important}'

    /* 1인·9명·13명·구독자·비밀방 수익표: 비밀방 기준 110px */
    +'html body .ktsolo-room .ktsolo-earn #myEarnHud,'
    +'html body .ktg13-room .ktg13-earn #myEarnHud,'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud,'
    +'html body .ktsecret-room .ktsecret-earn-row #myEarnHud{'
      +'width:110px!important;max-width:110px!important;min-width:0!important;'
      +'padding:2px 3px!important;box-sizing:border-box!important'
    +'}'

    /* 글씨도 현재 비밀방 수익표 기준 */
    +'html body .ktsolo-room .ktsolo-earn #myEarnHud span,'
    +'html body .ktg13-room .ktg13-earn #myEarnHud span,'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud span,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud span,'
    +'html body .ktsecret-room .ktsecret-earn-row #myEarnHud span{font-size:6.5px!important}'

    +'html body .ktsolo-room .ktsolo-earn #myEarnHud b,'
    +'html body .ktg13-room .ktg13-earn #myEarnHud b,'
    +'html body .ktsubscriber-room #ktSubscriberEarnHud b,'
    +'html body .ktsubscriber-room .ktsubscriber-earnhud b,'
    +'html body .ktsecret-room .ktsecret-earn-row #myEarnHud b{font-size:9px!important}'

    /* 비밀방과 동일하게 작은 휴대폰에서는 100px */
    +'@media(max-width:390px){'
      +'html body .ktsolo-room .ktsolo-earn{width:100px!important;max-width:none!important;transform:none!important}'
      +'html body .ktsolo-room .ktsolo-earn #myEarnHud,'
      +'html body .ktg13-room .ktg13-earn #myEarnHud,'
      +'html body .ktsubscriber-room #ktSubscriberEarnHud,'
      +'html body .ktsubscriber-room .ktsubscriber-earnhud,'
      +'html body .ktsecret-room .ktsecret-earn-row #myEarnHud{'
        +'width:100px!important;max-width:100px!important;padding:2px 2px!important'
      +'}'
    +'}';

  document.head.appendChild(s);
})();

/* 비밀방만: 되돌리기·좋아요·선물상자·효과·매치를 위로 올리기 전 상태로 복귀. 선물줄/다른 방은 그대로 둠. */
(function(){
  if(window.__ktSecretBeforeTopControls20260915)return;
  window.__ktSecretBeforeTopControls20260915=true;
  var old=document.getElementById('ktSecretBeforeTopControlsStyle20260915');
  if(old)old.remove();
  var s=document.createElement('style');
  s.id='ktSecretBeforeTopControlsStyle20260915';
  s.textContent=''
    +'html body #screen .ktsecret-room>.kt-live-top-quickbar{display:none!important;flex:0 0 0!important;min-height:0!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}'
    +'html body #screen .ktsecret-room .ktsecret-right{display:grid!important}'
    +'html body #screen .ktsecret-room>.ktsecret-led{flex:0 0 58px!important;min-height:58px!important;height:58px!important;border-radius:22px!important}'
    +'html body #screen .ktsecret-room .ktsecret-led-track{font-size:24px!important;font-weight:950!important}'
    +'@media(max-width:390px){'
      +'html body #screen .ktsecret-room>.ktsecret-led{flex-basis:50px!important;min-height:50px!important;height:50px!important}'
      +'html body #screen .ktsecret-room .ktsecret-led-track{font-size:20px!important}'
    +'}';
  document.head.appendChild(s);
})();
