/* K-Talk earnings width trim only — 2026-09-30
   Reduce the visible earnings box width slightly.
   Do not change vertical position, content, video, chat, gifts, or room layout. */
(function(){
  if(window.__ktEarningsWidthTrim20260930)return;
  window.__ktEarningsWidthTrim20260930=true;

  function apply(){
    document.querySelectorAll(
      '#screen .ktsolo-earn #myEarnHud,'+
      '#screen .ktg13-earn #myEarnHud,'+
      '#screen .ktsubscriber-earn #ktSubscriberEarnHud,'+
      '#screen .ktsecret-earn-row #myEarnHud'
    ).forEach(function(hud){
      try{
        hud.style.setProperty('width','280px','important');
        hud.style.setProperty('min-width','0','important');
        hud.style.setProperty('max-width','280px','important');
        hud.style.setProperty('box-sizing','border-box','important');

        var wrap=hud.parentElement;
        if(wrap){
          wrap.style.setProperty('width','280px','important');
          wrap.style.setProperty('min-width','0','important');
          wrap.style.setProperty('max-width','280px','important');
          /* Keep the existing right-side placement, only shorten the horizontal span. */
        }
      }catch(e){}
    });
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktEarningsWidthTrimTimer20260930);
      window.__ktEarningsWidthTrimTimer20260930=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();