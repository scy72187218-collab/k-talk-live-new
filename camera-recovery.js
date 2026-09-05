/* K-Talk: camera recovery is now handled by permission-reuse.js. Keep this loader harmless. */
(function(){
  window.__ktCameraRecoveryLoaded=true;

  /* Approved live-screen UI additions. This loads only app UI; no phone status/browser bars. */
  if(!window.__ktLiveScreenPhotoAdditionsLoader){
    window.__ktLiveScreenPhotoAdditionsLoader=true;
    var s=document.createElement('script');
    s.src='live-screen-photo-additions.js?v=20260905-photo-ui01';
    s.async=false;
    document.head.appendChild(s);
  }
})();
