/* K-Talk LIVE: seated-person camera framing only. Keep chat/UI unchanged. */
(function(){
  if(window.__ktSeatedCameraFramingFixLoaded)return;
  window.__ktSeatedCameraFramingFixLoaded=true;
  var s=document.createElement('style');
  s.id='ktSeatedCameraFramingFixCss';
  s.textContent='\
#ktSept2Live #ktLiveVideo{object-position:50% 68%!important;}\
#ktRemoteLive{object-position:50% 68%!important;}\
';
  document.head.appendChild(s);

  if(!document.querySelector('script[data-kt-live-speed-opt]')){
    var sp=document.createElement('script');
    sp.src='live-speed-optimization.js?v=20260906-speed01';
    sp.defer=true;
    sp.setAttribute('data-kt-live-speed-opt','1');
    document.head.appendChild(sp);
  }
})();
