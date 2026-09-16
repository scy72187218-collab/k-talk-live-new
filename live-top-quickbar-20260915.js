/* K-Talk 방송방 상단 퀵버튼 전용: 되돌리기·보물상자·매치만 표시. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLiveTopQuickbar20260915)return;
  window.__ktLiveTopQuickbar20260915=true;

  function ensureStyle(){
    if(document.getElementById('ktLiveTopQuickbarStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktLiveTopQuickbarStyle20260915';
    s.textContent=''
      +'.kt-live-top-quickbar{flex:0 0 38px!important;min-height:38px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;width:100%!important;box-sizing:border-box!important;position:relative!important;z-index:40!important;padding:0 1px!important;pointer-events:auto!important}'
      +'.ktsecret-room>.kt-live-top-quickbar{grid-template-columns:repeat(3,minmax(0,1fr))!important}'
      +'.kt-live-top-quickbar button{min-width:0!important;height:38px!important;margin:0!important;padding:2px 1px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;background:linear-gradient(180deg,rgba(28,28,34,.96),rgba(10,10,14,.96))!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;white-space:nowrap!important;font-size:11px!important;font-weight:950!important;line-height:1!important;letter-spacing:-.3px!important;text-shadow:0 1px 2px #000!important;box-shadow:inset 0 0 10px rgba(255,255,255,.035)!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'.ktsecret-room>.kt-live-top-quickbar button{font-size:10px!important;gap:2px!important}'
      +'.kt-live-top-quickbar button b{font-size:14px!important;line-height:1!important;font-weight:950!important}.kt-live-top-quickbar button span{font-size:11px!important;font-weight:950!important;line-height:1!important;color:#fff!important}'
      +'.ktsecret-room>.kt-live-top-quickbar button span{font-size:10px!important}'
      +'.ktsolo-room>.ktsolo-led,.ktg13-room:not([data-kt-room="15"])>.ktg13-led,.ktsubscriber-room>.ktsubscriber-led,.ktsecret-room>.ktsecret-led{flex:0 0 38px!important;min-height:38px!important;height:38px!important;border-radius:16px!important}'
      +'.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;transform:none!important;font-size:15px!important;font-weight:950!important;animation:none!important;opacity:1!important;filter:none!important;color:#ffe34e!important;text-shadow:0 0 5px #ffb000,0 0 10px #ff35ce!important}'
      +'.ktsolo-room .ktsolo-led-track span,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track span,.ktsubscriber-room .ktsubscriber-led-track span,.ktsecret-room .ktsecret-led-track span{padding:0!important}.ktsolo-room .ktsolo-led-track span+span,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track span+span,.ktsubscriber-room .ktsubscriber-led-track span+span,.ktsecret-room .ktsecret-led-track span+span{display:none!important}@keyframes ktCompactLedBlink{0%,100%{opacity:1;filter:brightness(1.15)}50%{opacity:.42;filter:brightness(.75)}}'
      +'.ktsolo-room .ktsolo-right,.ktg13-room:not([data-kt-room="15"]) .ktg13-right-quick,.ktsubscriber-room .ktsubscriber-right,.ktsecret-room .ktsecret-right{display:none!important}'
      +'.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr)!important}'
      +'/* 1인방·비밀방 선물줄만 9명방처럼 하단 메뉴 바로 위로 내림. 다른 방은 변경하지 않음. */'
      +'.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;flex:0 0 64px!important;min-height:64px!important;height:64px!important;width:100%!important;box-sizing:border-box!important;z-index:11!important}'
      +'.ktsecret-room>.ktsecret-gifts{order:90!important;margin:0!important}.ktsecret-room>.ktsecret-tools{order:100!important}'
      +'@media(max-width:390px){.kt-live-top-quickbar{flex-basis:36px!important;min-height:36px!important}.kt-live-top-quickbar button{height:36px!important;font-size:10px!important;gap:2px!important}.kt-live-top-quickbar button b{font-size:13px!important}.kt-live-top-quickbar button span{font-size:10px!important}.ktsecret-room>.kt-live-top-quickbar button,.ktsecret-room>.kt-live-top-quickbar button span{font-size:9px!important}.ktsolo-room>.ktsolo-led,.ktg13-room:not([data-kt-room="15"])>.ktg13-led,.ktsubscriber-room>.ktsubscriber-led,.ktsecret-room>.ktsecret-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{font-size:13px!important}.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{flex-basis:58px!important;min-height:58px!important;height:58px!important}}';
    document.head.appendChild(s);
  }

  function makeBar(room){
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
    if(room.classList.contains('ktsecret-room'))return room.querySelector('.ktsecret-main');
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
    if(room.classList.contains('ktsecret-room')){
      gifts.style.setProperty('position','relative','important');
      gifts.style.setProperty('left','auto','important');
      gifts.style.setProperty('right','auto','important');
      gifts.style.setProperty('top','auto','important');
      gifts.style.setProperty('bottom','auto','important');
      gifts.style.setProperty('width','100%','important');
      gifts.style.setProperty('margin','0','important');
      gifts.style.setProperty('order','90','important');
      tools.style.setProperty('order','100','important');
    }
  }

  function installRoom(room){
    if(!room||!room.isConnected)return;
    fixBottomGiftRow(room);
    if(room.classList.contains('ktg13-room')&&String(room.getAttribute('data-kt-room')||'')==='15')return;
    var anchor=anchorFor(room);
    if(!anchor||!anchor.parentNode)return;
    var bar=room.querySelector(':scope > .kt-live-top-quickbar');
    if(!bar){
      bar=makeBar(room);
      anchor.parentNode.insertBefore(bar,anchor);
      return;
    }
    if(bar.nextElementSibling!==anchor){
      anchor.parentNode.insertBefore(bar,anchor);
    }
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

/* 1인방·9명방·13명방·구독자방·비밀방 선물줄만 동일한 아이콘/글씨 스타일로 통일. 외부 이미지 파일을 쓰지 않아 글씨 깨짐/이미지 깨짐을 방지. */
(function(){
  if(window.__ktUnifiedGiftIconsFiveRooms20260915)return;
  window.__ktUnifiedGiftIconsFiveRooms20260915=true;

  var old=document.getElementById('ktCopySoloGiftStyle20260915');
  if(old)old.remove();

  if(!document.getElementById('ktUnifiedGiftIconsFiveRoomsStyle20260915')){
    var st=document.createElement('style');
    st.id='ktUnifiedGiftIconsFiveRoomsStyle20260915';
    st.textContent=''
      +'#screen .ktsolo-gifts,#screen .ktg13-gifts,#screen .ktsubscriber-gifts,#screen .ktsecret-gifts{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important}'
      +'#screen .kt-unified-gift{min-width:0!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:8px!important;background:linear-gradient(180deg,#111116,#09090c)!important;color:#fff!important;padding:2px 1px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;overflow:hidden!important;box-sizing:border-box!important;touch-action:manipulation!important}'
      +'#screen .kt-unified-gift-art{height:30px!important;display:grid!important;place-items:center!important;font-size:26px!important;line-height:1!important;filter:drop-shadow(0 1px 4px rgba(0,0,0,.9))!important}'
      +'#screen .kt-unified-gift-art.big{font-size:29px!important}'
      +'#screen .kt-unified-gift b{display:block!important;color:#ffe33d!important;font-size:10px!important;line-height:1!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .kt-unified-gift small{display:block!important;margin-top:2px!important;color:#fff!important;font-size:8px!important;line-height:1.05!important;font-weight:900!important;text-align:center!important;white-space:normal!important}'
      +'@media(max-width:390px){#screen .kt-unified-gift-art{height:27px!important;font-size:23px!important}#screen .kt-unified-gift-art.big{font-size:26px!important}#screen .kt-unified-gift b{font-size:9px!important}#screen .kt-unified-gift small{font-size:7px!important}}';
    document.head.appendChild(st);
  }

  function item(prefix,icon,count,label,big){
    return '<button type="button" class="'+prefix+'-gift kt-unified-gift" onclick="if(window.openGifts)openGifts()">'
      +'<span class="kt-unified-gift-art'+(big?' big':'')+'">'+icon+'</span>'
      +'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function markup(prefix){
    return ''
      +item(prefix,'🌹','1개','장미',false)
      +item(prefix,'💐','50개','장미다발',false)
      +item(prefix,'💐','100개','특대장미',true)
      +item(prefix,'💗','10개','하트',false)
      +item(prefix,'👑','100개','왕관',false)
      +item(prefix,'🏎️','50개','스포츠카',false)
      +item(prefix,'🎁','선물상자','큰 선물 보기',false);
  }

  function apply(selector,prefix){
    document.querySelectorAll(selector).forEach(function(row){
      var wanted=markup(prefix);
      if(row.dataset.ktUnifiedGiftIcons==='1'&&row.innerHTML===wanted)return;
      row.innerHTML=wanted;
      row.dataset.ktUnifiedGiftIcons='1';
    });
  }

  function normalize(){
    apply('.ktsolo-room .ktsolo-gifts','ktsolo');
    apply('.ktg13-room:not([data-kt-room="15"]) .ktg13-gifts','ktg13');
    apply('.ktsubscriber-room .ktsubscriber-gifts','ktsubscriber');
    apply('.ktsecret-room .ktsecret-gifts','ktsecret');
  }

  normalize();
  [30,90,180,350,700,1300,2200].forEach(function(ms){setTimeout(normalize,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktUnifiedGiftIconsFiveRoomsTimer20260915);
      window.__ktUnifiedGiftIconsFiveRoomsTimer20260915=setTimeout(normalize,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 비밀방만: 아까 승인한 5칸 배치(큰 호스트 1 + 오른쪽 게스트 4)로 복구. 선물/다른 방/기능은 건드리지 않음. */
(function(){
  if(window.__ktSecretFivePanelRestore20260915)return;
  window.__ktSecretFivePanelRestore20260915=true;
  var st=document.createElement('style');
  st.id='ktSecretFivePanelRestoreStyle20260915';
  st.textContent=''
    +'#screen .ktsecret-room .ktsecret-six-grid{grid-template-columns:40% 30% 30%!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot.host{grid-column:1!important;grid-row:1 / 3!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(2){grid-column:2!important;grid-row:1!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(3){grid-column:3!important;grid-row:1!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(4){grid-column:2!important;grid-row:2!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(5){grid-column:3!important;grid-row:2!important}'
    +'#screen .ktsecret-room .ktsecret-main{min-height:0!important;flex:1 1 0!important}';
  document.head.appendChild(st);
})();
