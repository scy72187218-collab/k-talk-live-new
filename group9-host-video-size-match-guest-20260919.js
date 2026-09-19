/* K-Talk 9명방 호스트 영상 크기만 게스트와 비슷하게 보이도록 조정.
   타일 크기/방송/게스트/채팅/스위치/효과는 변경하지 않음. */
(function(){
  if(window.__ktGroup9HostVideoSizeMatchGuest20260919)return;
  window.__ktGroup9HostVideoSizeMatchGuest20260919=true;

  if(document.getElementById('ktGroup9HostVideoSizeMatchGuestStyle'))return;

  var s=document.createElement('style');
  s.id='ktGroup9HostVideoSizeMatchGuestStyle';
  s.textContent=''
    +'#screen .ktg13-room[data-kt-room="9"] .ktg13-host > video{object-fit:cover!important;object-position:center center!important;background:#08090c!important}'
    +'.kt-guest-hostlike-room .kgh-main:not(.is13) .kgh-cell.host > video{object-fit:cover!important;object-position:center center!important;background:#08090c!important}';
  document.head.appendChild(s);
})();
