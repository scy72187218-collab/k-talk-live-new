/* K-Talk: camera recovery is now handled by permission-reuse.js. Keep this loader harmless. */
(function(){
  window.__ktCameraRecoveryLoaded=true;

  if(!document.querySelector('script[data-kt-live-bottom-tools]')){
    var s=document.createElement('script');
    s.src='live-bottom-tiktok.js?v=20260905-bottom01';
    s.defer=true;
    s.setAttribute('data-kt-live-bottom-tools','1');
    document.head.appendChild(s);
  }

  if(!document.querySelector('script[data-kt-group13-layout]')){
    var g=document.createElement('script');
    g.src='group13-reference-layout.js?v=20260905-group13-06';
    g.defer=true;
    g.setAttribute('data-kt-group13-layout','1');
    document.head.appendChild(g);
  }
})();
