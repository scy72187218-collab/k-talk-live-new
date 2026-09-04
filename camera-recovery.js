/* K-Talk: restore the camera preview when the creator screen opens, while keeping the approved stream reusable. */
(function(){
  if(window.__ktCameraRecoveryLoaded)return;
  window.__ktCameraRecoveryLoaded=true;

  function restoreCreatorCameraOpen(){
    try{
      var current=window.openCreator;
      if(current&&current.__ktPermissionOnActionWrapped&&current.__ktOriginal){
        var original=current.__ktOriginal;
        /* Prevent permission-reuse.js from wrapping it again on its later install checks. */
        original.__ktPermissionOnActionWrapped=true;
        window.openCreator=original;
      }
    }catch(e){}
  }

  restoreCreatorCameraOpen();
  setTimeout(restoreCreatorCameraOpen,120);
  setTimeout(restoreCreatorCameraOpen,800);
})();
