/* K-Talk: 방송방 옆/중간 퀵 버튼만 제거.
   하단 메뉴와 방송 핵심 기능은 유지.
   제거 대상: 되돌리기/뒤집기(퀵), 선물/보물상자, 매치, 효과.
*/
(function(){
  if(window.__ktRemoveRoomSideQuickControls20260928)return;
  window.__ktRemoveRoomSideQuickControls20260928=true;

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
      if(el.classList.contains('kt-room-treasure-meta-btn'))return true;
    }

    if(t.indexOf('되돌리기')>-1||a.indexOf('되돌리기')>-1)return true;
    if(t.indexOf('보물상자')>-1||a.indexOf('보물상자')>-1)return true;
    if(t.indexOf('매치')>-1||a.indexOf('매치')>-1)return true;
    if(t.indexOf('효과')>-1||a.indexOf('효과')>-1)return true;
    if(t.indexOf('선물')>-1||a.indexOf('선물')>-1)return true;

    // 옆 세로 버튼 중 글자 없이 아이콘만 있는 예전 버튼도 제거
    if(oc.indexOf('openGifts')>-1||oc.indexOf('openTreasure')>-1)return true;
    if(oc.indexOf('openHostMatchArena')>-1||oc.indexOf('openMatchArena')>-1)return true;
    if(oc.indexOf('Effect')>-1||oc.indexOf('openEditEffectPanel')>-1)return true;

    return false;
  }

  function clean(){
    // 중간 가로 퀵 줄 자체 제거
    document.querySelectorAll(
      '#screen .kt-room-second-stats-row-20260927,'+
      '#screen .kt-solo-three-row,'+
      '#screen .kt-solo-top-three'
    ).forEach(function(el){
      try{el.remove();}catch(e){}
    });

    // 옆 세로 퀵 버튼에서 지정 버튼만 제거
    document.querySelectorAll(sideSelectors).forEach(function(box){
      [].slice.call(box.children||[]).forEach(function(el){
        if(unwantedSide(el)){
          try{el.remove();}catch(e){}
        }
      });
    });

    // 구독자방 별도 떠다니는 매치 버튼
    var floating=document.getElementById('ktSubscriberMatchFloating');
    if(floating)try{floating.remove();}catch(e){}

    // 혹시 옛 퀵박스가 비어 있으면 박스도 정리
    document.querySelectorAll('.kt-three-quick-box').forEach(function(box){
      try{
        var keep=[].slice.call(box.children||[]).some(function(el){return !unwantedSide(el);});
        if(!keep)box.remove();
      }catch(e){}
    });
  }

  function style(){
    if(document.getElementById('ktRemoveRoomSideQuickControlsStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktRemoveRoomSideQuickControlsStyle20260928';
    s.textContent=''
      +'#screen .kt-room-second-stats-row-20260927,'
      +'#screen .kt-solo-three-row,'
      +'#screen .kt-solo-top-three,'
      +'#screen .kt-three-quick-flip,'
      +'#screen .kt-three-quick-treasure,'
      +'#screen .kt-three-quick-match,'
      +'#screen .ktsecret-effect-small,'
      +'#screen .ktsecret-gift-small,'
      +'#screen .ktsecret-match-restored,'
      +'#ktSubscriberMatchFloating{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  style();
  clean();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(clean,ms);});
  setInterval(clean,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktRemoveSideQuickTimer20260928);
      window.__ktRemoveSideQuickTimer20260928=setTimeout(clean,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();