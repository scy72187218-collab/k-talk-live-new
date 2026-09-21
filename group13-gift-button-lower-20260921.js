/* K-Talk 13명방 하단 선물 버튼 위치만 아래로 조정.
   다른 버튼/채팅/방송/게스트/신호는 변경하지 않음. */
(function(){
  if(window.__ktGroup13GiftButtonLower20260921)return;
  window.__ktGroup13GiftButtonLower20260921=true;
  var s=document.createElement('style');
  s.id='ktGroup13GiftButtonLowerStyle';
  s.textContent=
    '.ktg13-room .ktg13-tools .ktg13-tool:nth-child(5),'+
    '.kt-guest-hostlike-room .kgh-tools .kgh-tool:nth-child(5){'+
      'position:relative!important;top:10px!important;'+
    '}';
  (document.head||document.documentElement).appendChild(s);
})();