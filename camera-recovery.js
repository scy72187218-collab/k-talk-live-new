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
    g.src='group13-reference-layout.js?v=20260905-group13-08';
    g.defer=true;
    g.setAttribute('data-kt-group13-layout','1');
    document.head.appendChild(g);
  }

  if(!document.querySelector('script[data-kt-password-layout]')){
    var p=document.createElement('script');
    p.src='password-room-reference-layout.js?v=20260905-password01';
    p.defer=true;
    p.setAttribute('data-kt-password-layout','1');
    document.head.appendChild(p);
  }

  if(!document.querySelector('script[data-kt-password-host-cover]')){
    var ph=document.createElement('script');
    ph.src='password-host-cover-fix.js?v=20260905-password-host01';
    ph.defer=true;
    ph.setAttribute('data-kt-password-host-cover','1');
    document.head.appendChild(ph);
  }
})();
