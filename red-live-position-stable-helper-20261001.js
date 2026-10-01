/* K-Talk red LIVE position stable helper 2026-10-01
   Visual position only. Does not alter LIVE signal, entry, exit, or host video logic. */
(function(){
  if(window.__ktRedLivePositionStableHelper20261001)return;
  window.__ktRedLivePositionStableHelper20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktRedLivePositionStableStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktRedLivePositionStableStyle20261001';
    s.textContent=''
      +'.kt-video-live-peek{top:56px!important;left:10px!important;transform:none!important;transition:none!important;animation:none!important}'
      +'body.kt-follow-status-open .kt-video-live-peek{top:56px!important}'
      +'#ktRedLiveReceiverFallback20260930{top:56px!important;left:10px!important;transform:none!important;transition:none!important;animation:none!important}'
      +'.kt-video-live-peek .ktvl-live,#ktRedLiveReceiverFallback20260930 .kt-rx-live{transform:none!important;transition:none!important;animation:none!important}';
    document.head.appendChild(s);
  }

  ensureStyle();
  window.addEventListener('pageshow',ensureStyle);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)ensureStyle();});
})();