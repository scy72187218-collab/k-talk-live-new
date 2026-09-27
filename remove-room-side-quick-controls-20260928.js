/* K-Talk: 방송방 오른쪽/옆 세로 중복 버튼만 제거.
   LED 밑 가로줄(되돌리기/보물상자/매치)과 하단 메뉴는 절대 건드리지 않는다.
*/
(function(){
  if(window.__ktRemoveRoomSideQuickControls20260928v2)return;
  window.__ktRemoveRoomSideQuickControls20260928v2=true;

  var sideSelectors=[
    '.ktsolo-right',
    '.ktsubscriber-right',
    '.ktsecret-right',
    '.ktg13-right-quick'
  ].join(',');

  function textOf(el){
    return String((el&&el.textContent)||'').replace(/\s+/g,'');
  }
  function ariaOf(el){
    return String((el&&el.getAttribute&&el.getAttribute('aria-label'))||'').replace(/\s+/g,'');
  }
  function onclickOf(el){
    return String((el&&el.getAttribute&&el.getAttribute('onclick'))||'');
  }

  function unwantedSide(el){
    if(!el)return false;
    var t=textOf(el), a=ariaOf(el), oc=onclickOf(el);

    if(el.classList){
      if(el.classList.contains('kt-three-quick-flip'))return true;
      if(el.classList.contains('kt-three-quick-treasure'))return true;
      if(el.classList.contains('kt-three-quick-match'))return true;
      if(el.classList.contains('ktsecret-effect-small'))return true;
      if(el.classList.contains('ktsecret-gift-small'))return true;
      if(el.classList.contains('ktsecret-match-restored'))return true;
    }

    if(t.indexOf('되돌리기')>-1||a.indexOf('되돌리기')>-1)return true;
    if(t.indexOf('보물상자')>-1||a.indexOf('보물상자')>-1)return true;
    if(t.indexOf('매치')>-1||a.indexOf('매치')>-1)return true;
    if(t.indexOf('효과')>-1||a.indexOf('효과')>-1)return true;
    if(t.indexOf('선물')>-1||a.indexOf('선물')>-1)return true;

    if(oc.indexOf('openGifts')>-1||oc.indexOf('openTreasure')>-1)return true;
    if(oc.indexOf('openHostMatchArena')>-1||oc.indexOf('openMatchArena')>-1)return true;
    if(oc.indexOf('Effect')>-1||oc.indexOf('openEditEffectPanel')>-1)return true;

    return false;
  }

  function clean(){
    // LED 밑 가로줄은 건드리지 않는다.
    document.querySelectorAll(sideSelectors).forEach(function(box){
      [].slice.call(box.children||[]).forEach(function(el){
        if(unwantedSide(el)){
          try{el.remove();}catch(e){}
        }
      });
    });

    // 구독자방 옆에 별도로 뜨는 매치 버튼만 제거.
    var floating=document.getElementById('ktSubscriberMatchFloating');
    if(floating)try{floating.remove();}catch(e){}

    // 옆 퀵 전용 박스가 비면 박스만 정리.
    document.querySelectorAll('.kt-three-quick-box').forEach(function(box){
      if(!box.closest('.kt-room-second-stats-row-20260927')){
        try{
          var keep=[].slice.call(box.children||[]).some(function(el){return !unwantedSide(el);});
          if(!keep)box.remove();
        }catch(e){}
      }
    });
  }

  function style(){
    if(document.getElementById('ktRemoveRoomSideQuickControlsStyle20260928v2'))return;
    var st=document.createElement('style');
    st.id='ktRemoveRoomSideQuickControlsStyle20260928v2';
    st.textContent=''
      +'#screen .ktsolo-right .kt-three-quick-flip,'
      +'#screen .ktsolo-right .kt-three-quick-treasure,'
      +'#screen .ktsolo-right .kt-three-quick-match,'
      +'#screen .ktsubscriber-right .kt-three-quick-flip,'
      +'#screen .ktsubscriber-right .kt-three-quick-treasure,'
      +'#screen .ktsubscriber-right .kt-three-quick-match,'
      +'#screen .ktsecret-right .kt-three-quick-flip,'
      +'#screen .ktsecret-right .kt-three-quick-treasure,'
      +'#screen .ktsecret-right .kt-three-quick-match,'
      +'#screen .ktg13-right-quick .kt-three-quick-flip,'
      +'#screen .ktg13-right-quick .kt-three-quick-treasure,'
      +'#screen .ktg13-right-quick .kt-three-quick-match,'
      +'#screen .ktsecret-effect-small,'
      +'#screen .ktsecret-gift-small,'
      +'#screen .ktsecret-match-restored,'
      +'#ktSubscriberMatchFloating{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    document.head.appendChild(st);
  }

  style();
  clean();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,900);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoveSideQuickTimer20260928v2);
      window.__ktRemoveSideQuickTimer20260928v2=setTimeout(clean,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();