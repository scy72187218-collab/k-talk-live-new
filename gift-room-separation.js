/* K-Talk 선물상자와 방 선택 터치 분리: 선물상자는 방 위에 완전히 떠서 겹쳐 눌리지 않게 함. */
(function(){
  if(window.__ktGiftRoomSeparationInstalled)return;
  window.__ktGiftRoomSeparationInstalled=true;

  var style=document.createElement('style');
  style.id='ktGiftRoomSeparationStyle';
  style.textContent=''
    +'.sheet.gift-final-v1{z-index:180!important;align-items:flex-start!important;padding:0!important;pointer-events:auto!important;}'
    +'.sheet.gift-final-v1 .sheet-inner{height:100dvh!important;max-height:100dvh!important;margin:0 auto!important;border-radius:0!important;pointer-events:auto!important;}'
    +'.sheet.gift-final-v1 .kt-gift-final{padding-top:calc(12px + env(safe-area-inset-top))!important;pointer-events:auto!important;}'
    +'.sheet.gift-final-v1 .kt-gift-final button{position:relative!important;z-index:2!important;pointer-events:auto!important;touch-action:manipulation!important;}';
  document.head.appendChild(style);

  function giftOpen(){
    var sheet=document.getElementById('sheet');
    return !!(sheet&&sheet.classList.contains('show')&&sheet.classList.contains('gift-final-v1'));
  }

  function syncRoomTouch(){
    var off=giftOpen();
    document.querySelectorAll('.room-switch,.kt-creator-room-shortcuts button,.kt-room').forEach(function(el){
      if(off){
        if(!el.hasAttribute('data-kt-old-pointer'))el.setAttribute('data-kt-old-pointer',el.style.pointerEvents||'');
        el.style.setProperty('pointer-events','none','important');
      }else if(el.hasAttribute('data-kt-old-pointer')){
        var old=el.getAttribute('data-kt-old-pointer')||'';
        el.style.removeProperty('pointer-events');
        if(old)el.style.pointerEvents=old;
        el.removeAttribute('data-kt-old-pointer');
      }
    });
  }

  var sheet=document.getElementById('sheet');
  if(sheet){
    new MutationObserver(syncRoomTouch).observe(sheet,{attributes:true,attributeFilter:['class']});
  }
  document.addEventListener('click',function(e){
    if(!giftOpen())return;
    var gift=e.target&&e.target.closest?e.target.closest('.kt-gift-final button,.ktgf button'):null;
    if(gift)e.stopPropagation();
  },false);
  syncRoomTouch();
})();
