/* Legacy public-feed profile/like enhancer disabled.
   It conflicted with the approved layout:
   profile photo -> rose/count -> message -> share.
   Kept as a no-op so any old dynamic loader cannot rewrite the current UI. */
(function(){
  window.__ktFeedProfileActionsInstalledV3=true;
  try{
    var st=document.getElementById('ktFeedProfileActionsStyleV2');
    if(st)st.remove();
  }catch(e){}
})();
