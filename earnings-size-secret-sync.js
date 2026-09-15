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

/* 비밀방만: 다른 방송방에서 쓰는 기존 3버튼 퀵바를 그대로 사용하고 위치만 두 번째 사진처럼 랭킹/미션 아래, 방송화면 위에 둠. */
(function(){
  if(window.__ktSecretUseExistingQuickbar20260915)return;
  window.__ktSecretUseExistingQuickbar20260915=true;

  function place(){
    document.querySelectorAll('.ktsecret-room').forEach(function(room){
      var main=room.querySelector(':scope > .ktsecret-main');
      var bar=room.querySelector(':scope > .kt-live-top-quickbar');
      if(!main||!bar||!main.parentNode)return;
      if(bar.nextElementSibling!==main)main.parentNode.insertBefore(bar,main);
    });
  }

  place();
  [50,140,320,700,1300,2200].forEach(function(ms){setTimeout(place,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSecretUseExistingQuickbarTimer20260915);
      window.__ktSecretUseExistingQuickbarTimer20260915=setTimeout(place,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
