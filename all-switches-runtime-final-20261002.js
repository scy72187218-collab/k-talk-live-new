/* K-Talk final switch/runtime enable — functionality only.
   Does not change room layout, video size, chat position, or visual design. */
(function(){
  if(window.__ktAllSwitchesRuntimeFinal20261002)return;
  window.__ktAllSwitchesRuntimeFinal20261002=true;

  var selector=[
    '.kt-switch',
    '[role="switch"]',
    '.live-prep .prep-item',
    '.live-prep .room-switch',
    '.creator-tools button',
    '.creator-bottom .modes span',
    '.creator-bottom .modes button',
    '.creator-bottom .creator-foot span',
    '.kt-total-admin-row',
    '.kt-owner-monitor button',
    '.kt-bottom-media-replaced',
    '.kt-host-admin-media-20260928 button',
    '.kt-guest-self-media-btn',
    '.kt-inside-av-btn',
    '.kt-remote-tv-btn',
    '.kt-tv-movie-more'
  ].join(',');

  function enableOne(el){
    if(!el)return;
    try{
      if(el.disabled)el.disabled=false;
      if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      el.style.setProperty('user-select','none','important');
    }catch(e){}
  }

  function enableAll(){
    try{document.querySelectorAll(selector).forEach(enableOne);}catch(e){}
    try{
      var sh=document.getElementById('sheet');
      if(sh&&!sh.classList.contains('show'))sh.style.setProperty('pointer-events','none','important');
      else if(sh)sh.style.removeProperty('pointer-events');
    }catch(e){}
  }

  function genericSwitch(el){
    if(!el)return false;
    try{
      if(el.classList.contains('kt-switch')&&typeof window.toggleLiveSetting==='function'){
        window.toggleLiveSetting(el);return true;
      }
      if(el.getAttribute('role')==='switch'){
        var attr=el.hasAttribute('aria-checked')?'aria-checked':'aria-pressed';
        var on=el.getAttribute(attr)==='true'||el.classList.contains('on');
        el.classList.toggle('on',!on);
        el.setAttribute(attr,!on?'true':'false');
        return true;
      }
    }catch(e){}
    return false;
  }

  /* Only rescue genuinely handler-less switches; existing working onclick handlers remain untouched. */
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest('.kt-switch,[role="switch"]'):null;
    if(!el)return;
    if(el.getAttribute('onclick')||el.onclick)return;
    genericSwitch(el);
  },false);

  enableAll();
  [50,150,350,700,1300,2200].forEach(function(ms){setTimeout(enableAll,ms);});
  window.addEventListener('pageshow',enableAll);
  window.addEventListener('focus',enableAll);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(enableAll,30);
  });
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllSwitchesRuntimeFinalTimer20261002);
      window.__ktAllSwitchesRuntimeFinalTimer20261002=setTimeout(enableAll,20);
    }).observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,
      attributeFilter:['disabled','aria-disabled','class','style']
    });
  }catch(e){}
  setInterval(enableAll,700);
})();