/* K-Talk 방송방 상단 퀵버튼 전용: LED를 조금 줄이고 되돌리기·보물상자·매치를 위 한 줄에 표시. 좋아요는 호스트 사진, 효과는 기존 바깥 버튼 사용. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveTopQuickbar20260915)return;
  window.__ktLiveTopQuickbar20260915=true;

  function ensureStyle(){
    if(document.getElementById('ktLiveTopQuickbarStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktLiveTopQuickbarStyle20260915';
    s.textContent=''
      +'.kt-live-top-quickbar{flex:0 0 38px!important;min-height:38px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;width:100%!important;box-sizing:border-box!important;position:relative!important;z-index:40!important;padding:0 1px!important;pointer-events:auto!important}'
      +'.kt-live-top-quickbar button{min-width:0!important;height:38px!important;margin:0!important;padding:2px 1px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;background:linear-gradient(180deg,rgba(28,28,34,.96),rgba(10,10,14,.96))!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;white-space:nowrap!important;font-size:11px!important;font-weight:950!important;line-height:1!important;letter-spacing:-.3px!important;text-shadow:0 1px 2px #000!important;box-shadow:inset 0 0 10px rgba(255,255,255,.035)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.kt-live-top-quickbar button b{font-size:14px!important;line-height:1!important;font-weight:950!important}.kt-live-top-quickbar button span{font-size:11px!important;font-weight:950!important;line-height:1!important;color:#fff!important}'
      +'.ktsolo-room>.ktsolo-led,.ktg13-room:not([data-kt-room="15"])>.ktg13-led,.ktsubscriber-room>.ktsubscriber-led,.ktsecret-room>.ktsecret-led{flex:0 0 38px!important;min-height:38px!important;height:38px!important;border-radius:16px!important}'
      +'.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{font-size:18px!important;font-weight:950!important}'
      +'.ktsolo-room .ktsolo-right,.ktg13-room:not([data-kt-room="15"]) .ktg13-right-quick,.ktsubscriber-room .ktsubscriber-right,.ktsecret-room .ktsecret-right{display:none!important}'
      +'.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr)!important}'
      +'/* 1인방·비밀방 선물줄만 9명방처럼 하단 메뉴 바로 위로 내림. 다른 방은 변경하지 않음. */'
      +'.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;flex:0 0 64px!important;min-height:64px!important;height:64px!important;width:100%!important;box-sizing:border-box!important;z-index:11!important}'
      +'@media(max-width:390px){.kt-live-top-quickbar{flex-basis:36px!important;min-height:36px!important}.kt-live-top-quickbar button{height:36px!important;font-size:10px!important;gap:2px!important}.kt-live-top-quickbar button b{font-size:13px!important}.kt-live-top-quickbar button span{font-size:10px!important}.ktsolo-room>.ktsolo-led,.ktg13-room:not([data-kt-room="15"])>.ktg13-led,.ktsubscriber-room>.ktsubscriber-led,.ktsecret-room>.ktsecret-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{font-size:17px!important}.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{flex-basis:58px!important;min-height:58px!important;height:58px!important}}';
    document.head.appendChild(s);
  }

  function makeBar(){
    var bar=document.createElement('div');
    bar.className='kt-live-top-quickbar';
    bar.setAttribute('data-kt-top-quickbar','1');
    bar.innerHTML=''
      +'<button type="button" aria-label="되돌리기"><b>↻</b><span>되돌리기</span></button>'
      +'<button type="button" aria-label="보물상자"><b>🎁</b><span>보물상자</span></button>'
      +'<button type="button" aria-label="매치"><b>⚔</b><span>매치</span></button>';
    return bar;
  }

  function findStatsAnchor(room,fallbackSelector){
    var direct=[].slice.call(room.children||[]).find(function(el){
      var t=String(el.textContent||'').replace(/\s+/g,' ');
      return t.indexOf('일일 랭킹')>-1&&t.indexOf('미션')>-1&&t.indexOf('시청자')>-1;
    });
    return direct||room.querySelector(fallbackSelector)||null;
  }

  function anchorFor(room){
    if(room.classList.contains('ktg13-room'))return room.querySelector('.ktg13-stats')||room.querySelector('.ktg13-main');
    if(room.classList.contains('ktsolo-room'))return findStatsAnchor(room,'.ktsolo-stats')||room.querySelector('.ktsolo-main');
    if(room.classList.contains('ktsubscriber-room'))return room.querySelector('.ktsubscriber-main');
    if(room.classList.contains('ktsecret-room'))return findStatsAnchor(room,'.ktsecret-stats')||room.querySelector('.ktsecret-main');
    return null;
  }

  function fixBottomGiftRow(room){
    var gifts=null,tools=null;
    if(room.classList.contains('ktsolo-room')){
      gifts=room.querySelector('.ktsolo-gifts');
      tools=room.querySelector('.ktsolo-tools');
    }else if(room.classList.contains('ktsecret-room')){
      gifts=room.querySelector('.ktsecret-gifts');
      tools=room.querySelector('.ktsecret-tools');
    }else{
      return;
    }
    if(!gifts||!tools||!tools.parentNode)return;
    if(gifts.parentNode!==tools.parentNode||gifts.nextElementSibling!==tools){
      tools.parentNode.insertBefore(gifts,tools);
    }
  }

  function installRoom(room){
    if(!room||!room.isConnected)return;
    fixBottomGiftRow(room);
    if(room.classList.contains('ktg13-room')&&String(room.getAttribute('data-kt-room')||'')==='15')return;
    if(room.querySelector(':scope > .kt-live-top-quickbar'))return;
    var anchor=anchorFor(room);
    if(!anchor||!anchor.parentNode)return;
    anchor.parentNode.insertBefore(makeBar(),anchor);
  }

  function installAll(){
    ensureStyle();
    document.querySelectorAll('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room').forEach(installRoom);
  }

  installAll();
  [30,120,350,800,1500].forEach(function(ms){setTimeout(installAll,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktTopQuickbarTimer20260915);
      window.__ktTopQuickbarTimer20260915=setTimeout(installAll,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
