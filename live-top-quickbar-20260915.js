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
      +'.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{font-size:18px!important;font-weight:950!important}'
      +'.ktsolo-room .ktsolo-right,.ktg13-room:not([data-kt-room="15"]) .ktg13-right-quick,.ktsubscriber-room .ktsubscriber-right,.ktsecret-room .ktsecret-right{display:none!important}'
      +'.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr)!important}'
      +'/* 1인방·비밀방 선물줄만 하단 메뉴 바로 위로 내림. 다른 방은 변경하지 않음. */'
      +'.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;flex:0 0 64px!important;min-height:64px!important;height:64px!important;width:100%!important;box-sizing:border-box!important;z-index:11!important}'
      +'.ktsecret-room>.ktsecret-gifts{order:90!important;margin:0!important}.ktsecret-room>.ktsecret-tools{order:100!important}'
      +'@media(max-width:390px){.kt-live-top-quickbar{flex-basis:36px!important;min-height:36px!important}.kt-live-top-quickbar button{height:36px!important;font-size:10px!important;gap:2px!important}.kt-live-top-quickbar button b{font-size:13px!important}.kt-live-top-quickbar button span{font-size:10px!important}.ktsecret-room>.kt-live-top-quickbar button,.ktsecret-room>.kt-live-top-quickbar button span{font-size:9px!important}.ktsolo-room>.ktsolo-led,.ktg13-room:not([data-kt-room="15"])>.ktg13-led,.ktsubscriber-room>.ktsubscriber-led,.ktsecret-room>.ktsecret-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}.ktsolo-room .ktsolo-led-track,.ktg13-room:not([data-kt-room="15"]) .ktg13-led-track,.ktsubscriber-room .ktsubscriber-led-track,.ktsecret-room .ktsecret-led-track{font-size:17px!important}.ktsolo-room>.ktsolo-gifts,.ktsecret-room>.ktsecret-gifts{flex-basis:58px!important;min-height:58px!important;height:58px!important}}';
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

/* 13명방 선물줄과 같은 구성/모양을 1인방·9명방·구독자방·비밀방에만 복사. 13명방 원본과 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktCopy13GiftsToOtherRooms20260915)return;
  window.__ktCopy13GiftsToOtherRooms20260915=true;

  var oldStyle=document.getElementById('ktCopySoloGiftStyle20260915');
  if(oldStyle)oldStyle.remove();

  if(!document.getElementById('ktCopy13GiftStyle20260915')){
    var st=document.createElement('style');
    st.id='ktCopy13GiftStyle20260915';
    st.textContent=''
      +'#screen .ktsolo-room .ktsolo-gifts,#screen .ktg13-room[data-kt-room="9"] .ktg13-gifts,#screen .ktsubscriber-room .ktsubscriber-gifts,#screen .ktsecret-room .ktsecret-gifts{flex:0 0 56px!important;min-height:56px!important;height:56px!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important}'
      +'#screen .kt-g13-copy-gift{min-width:0!important;border:1px solid #33343a!important;border-radius:7px!important;background:linear-gradient(180deg,#111116,#09090c)!important;color:#fff!important;padding:2px 1px 2px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;overflow:hidden!important}'
      +'#screen .kt-g13-copy-gift img{width:34px!important;max-width:84%!important;height:24px!important;object-fit:contain!important;filter:drop-shadow(0 2px 4px #000)!important}'
      +'#screen .kt-g13-copy-emoji{height:24px!important;display:grid!important;place-items:center!important;font-size:21px!important;line-height:1!important;filter:drop-shadow(0 0 5px #ff5bd4)!important}'
      +'#screen .kt-g13-copy-gift b{color:#ffe23e!important;font-size:8px!important;line-height:1.02!important}'
      +'#screen .kt-g13-copy-gift small{display:block!important;margin-top:1px!important;color:#fff!important;font-size:6.5px!important;line-height:1.02!important;font-weight:900!important;text-align:center!important;white-space:normal!important}';
    document.head.appendChild(st);
  }

  function item(prefix,kind,count,label,asset){
    var art=asset
      ?'<img src="'+asset+'" alt="'+label+'">'
      :'<span class="kt-g13-copy-emoji">'+kind+'</span>';
    return '<button type="button" class="'+prefix+'-gift kt-g13-copy-gift" onclick="if(window.openGifts)openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function markup(prefix){
    return ''
      +item(prefix,'','1개','장미','rose-single.svg')
      +item(prefix,'','50개','장미다발','rose-bouquet-50.svg')
      +item(prefix,'','100개','특대장미','rose-bouquet-100.svg')
      +item(prefix,'💗','10개','하트','')
      +item(prefix,'👑','100개','왕관','')
      +item(prefix,'🏎️','50개','스포츠카','')
      +item(prefix,'','선물상자','큰 선물 보기','gift-box.svg');
  }

  function apply(selector,prefix){
    document.querySelectorAll(selector).forEach(function(row){
      if(row.dataset.ktG13GiftCopy==='1')return;
      row.innerHTML=markup(prefix);
      row.dataset.ktG13GiftCopy='1';
    });
  }

  function normalize(){
    apply('.ktsolo-room .ktsolo-gifts','ktsolo');
    apply('.ktg13-room[data-kt-room="9"] .ktg13-gifts','ktg13');
    apply('.ktsubscriber-room .ktsubscriber-gifts','ktsubscriber');
    apply('.ktsecret-room .ktsecret-gifts','ktsecret');
  }

  normalize();
  [40,120,300,700,1300].forEach(function(ms){setTimeout(normalize,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktCopy13GiftsTimer20260915);
      window.__ktCopy13GiftsTimer20260915=setTimeout(normalize,25);
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
