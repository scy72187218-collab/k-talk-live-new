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

/* 비밀방만: 재실행해도 되돌리기·보물상자·매치 3개를 랭킹/미션 줄 아래, 호스트/게스트 위에 고정. */
(function(){
  if(window.__ktSecretStableTopThree20260915)return;
  window.__ktSecretStableTopThree20260915=true;

  function ensureStyle(){
    if(document.getElementById('ktSecretStableTopThreeStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktSecretStableTopThreeStyle20260915';
    s.textContent=''
      +'#screen .ktsecret-top-three{flex:0 0 44px!important;min-height:44px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;width:100%!important;box-sizing:border-box!important;z-index:30!important}'
      +'#screen .ktsecret-top-three button{height:44px!important;margin:0!important;border:1px solid rgba(255,255,255,.17)!important;border-radius:12px!important;background:linear-gradient(180deg,#1a1a20,#0b0b0f)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;white-space:nowrap!important}'
      +'#screen .ktsecret-top-three button b{font-size:17px!important}'
      +'#screen .ktsecret-room .ktsecret-right{display:grid!important}'
      +'#screen .ktsecret-room .ktsecret-right .ktsecret-return{display:none!important}'
      +'#screen .ktsecret-room .ktsecret-right button:nth-child(3){display:none!important}'
      +'#screen .ktsecret-room .ktsecret-right button:nth-child(4){display:none!important}'
      +'@media(max-width:390px){#screen .ktsecret-top-three{flex-basis:40px!important;min-height:40px!important}#screen .ktsecret-top-three button{height:40px!important;font-size:11px!important}}';
    document.head.appendChild(s);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll('.ktsecret-room').forEach(function(room){
      var main=room.querySelector(':scope > .ktsecret-main');
      if(!main||!main.parentNode)return;
      var bar=room.querySelector(':scope > .ktsecret-top-three');
      if(!bar){
        bar=document.createElement('div');
        bar.className='ktsecret-top-three';
        bar.innerHTML=''
          +'<button type="button" onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()"><b>↻</b><span>되돌리기</span></button>'
          +'<button type="button" onclick="if(window.openGifts)openGifts()"><b>🎁</b><span>보물상자</span></button>'
          +'<button type="button" onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')"><b>⚔</b><span>매치</span></button>';
      }
      if(bar.nextElementSibling!==main)main.parentNode.insertBefore(bar,main);
    });
  }

  install();
  [40,120,300,700,1300].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSecretStableTopThreeTimer20260915);
      window.__ktSecretStableTopThreeTimer20260915=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
