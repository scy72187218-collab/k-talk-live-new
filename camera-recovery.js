/* K-Talk: camera recovery is now handled by permission-reuse.js. Keep this loader harmless. */
(function(){
  window.__ktCameraRecoveryLoaded=true;
  if(document.querySelector('script[data-kt-live-bottom-tools]'))return;
  var s=document.createElement('script');
  s.src='live-bottom-tiktok.js?v=20260905-bottom01';
  s.defer=true;
  s.setAttribute('data-kt-live-bottom-tools','1');
  document.head.appendChild(s);
})();
