/* K-Talk 선물상자 분리 로더 */
(function(){
  if(document.querySelector('script[data-kt-gift-room-separation]'))return;
  var s=document.createElement('script');
  s.src='gift-room-separation.js?v=20260908a';
  s.async=false;
  s.setAttribute('data-kt-gift-room-separation','1');
  document.head.appendChild(s);
})();
