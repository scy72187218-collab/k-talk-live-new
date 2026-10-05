/* K-Talk seat layout panel: keep launcher/panel inside host tile only. 1150617 */
(function(){
  if(window.__ktSeatPanelHostInside20261005)return;
  window.__ktSeatPanelHostInside20261005=true;

  function hostTile(){
    return document.querySelector(
      '#screen .ktg13-room .ktg13-host,'+
      '#screen .ktg9-room .ktg9-host,'+
      '#screen .ktg9-room .ktg13-host,'+
      '#screen .ktsubscriber-room .ktsubscriber-host,'+
      '#screen .ktsecret-room .ktsecret-slot.host,'+
      '#screen .ktsecret-room .ktsecret-host'
    );
  }

  function apply(){
    var host=hostTile();
    if(!host)return;
    try{
      host.style.setProperty('position','relative','important');
      host.style.setProperty('overflow','visible','important');
    }catch(e){}

    var launch=document.getElementById('ktPersonLayoutLaunch');
    if(launch){
      if(launch.parentNode!==host)host.appendChild(launch);
      launch.style.setProperty('position','absolute','important');
      launch.style.setProperty('right','3px','important');
      launch.style.setProperty('top','3px','important');
      launch.style.setProperty('left','auto','important');
      launch.style.setProperty('bottom','auto','important');
      launch.style.setProperty('transform','none','important');
      launch.style.setProperty('z-index','2147482000','important');
    }

    var panel=document.getElementById('ktPersonLayoutPanel');
    if(panel){
      if(panel.parentNode!==host)host.appendChild(panel);
      panel.style.setProperty('position','absolute','important');
      panel.style.setProperty('right','2px','important');
      panel.style.setProperty('top','38px','important');
      panel.style.setProperty('left','auto','important');
      panel.style.setProperty('bottom','auto','important');
      panel.style.setProperty('width','174px','important');
      panel.style.setProperty('transform','scale(.62)','important');
      panel.style.setProperty('transform-origin','top right','important');
      panel.style.setProperty('z-index','2147482000','important');
      panel.style.setProperty('max-width','none','important');
    }
  }

  apply();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSeatPanelHostInsideTimer20261005);
      window.__ktSeatPanelHostInsideTimer20261005=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();