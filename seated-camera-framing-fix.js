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
})();
