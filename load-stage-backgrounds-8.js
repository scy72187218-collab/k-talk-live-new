/* K-Talk 가요무대형 배경 8개 로더 */
(function(){
  if(document.querySelector('script[data-kt-stage-backgrounds-8]'))return;
  var s=document.createElement('script');
  s.src='stage-backgrounds-8.js?v=20260907a';
  s.async=false;
  s.setAttribute('data-kt-stage-backgrounds-8','1');
  document.head.appendChild(s);
})();
