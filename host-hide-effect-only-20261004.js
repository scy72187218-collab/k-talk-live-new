/* K-Talk host-only effect button hide
   1111: effect button only. Do not change guest/viewer UI or any other control. */
(function(){
  if(window.__ktHostHideEffectOnly20261004)return;
  window.__ktHostHideEffectOnly20261004=true;

  function isRemoteViewer(){
    try{return document.documentElement.classList.contains('kt-remote-viewing');}
    catch(e){return false;}
  }

  function isHostScreen(){
    try{
      if(isRemoteViewer())return false;
      var s=document.getElementById('screen');
      if(!s)return false;
      return !!(
        s.querySelector('#ktLiveVideo') ||
        s.querySelector('.ktsolo-room') ||
        s.querySelector('.ktg13-room') ||
        s.querySelector('.ktsubscriber-room') ||
        s.querySelector('.ktsecret-room')
      );
    }catch(e){return false;}
  }

  function hideOnlyEffect(){
    try{
      if(!isHostScreen())return;
      var s=document.getElementById('screen');
      if(!s)return;
      s.querySelectorAll('button').forEach(function(btn){
        try{
          var t=String(btn.textContent||'').replace(/\s+/g,'').trim();
          if(t==='효과'||t==='🪄효과'||t==='✨효과'){
            btn.style.setProperty('display','none','important');
          }
        }catch(e){}
      });
    }catch(e){}
  }

  setTimeout(hideOnlyEffect,20);
  setTimeout(hideOnlyEffect,100);
  setInterval(hideOnlyEffect,400);
  try{
    new MutationObserver(function(){setTimeout(hideOnlyEffect,10);})
      .observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* __ktHostBottomEqualSpacing20261004: host bottom controls only. Equal spacing after effect removal. */
  function equalizeHostBottomOnly(){
    try{
      if(isRemoteViewer())return;
      var s=document.getElementById('screen');
      if(!s)return;

      var bars=s.querySelectorAll(
        '.ktsolo-tools,'+
        '.ktg13-tools,'+
        '.ktsubscriber-tools,'+
        '.ktsecret-tools,'+
        '.kt-live-bottom-tools'
      );
      bars.forEach(function(bar){
        try{
          var visible=[].slice.call(bar.querySelectorAll('button')).filter(function(b){
            return getComputedStyle(b).display!=='none';
          });
          if(visible.length!==7)return;

          bar.style.setProperty('display','grid','important');
          bar.style.setProperty('grid-template-columns','repeat(7,minmax(0,1fr))','important');
          bar.style.setProperty('align-items','center','important');
          bar.style.setProperty('justify-content','stretch','important');
          bar.style.setProperty('column-gap','0','important');

          visible.forEach(function(btn){
            btn.style.setProperty('width','100%','important');
            btn.style.setProperty('min-width','0','important');
            btn.style.setProperty('margin-left','0','important');
            btn.style.setProperty('margin-right','0','important');
            btn.style.setProperty('justify-self','stretch','important');
          });
        }catch(e){}
      });
    }catch(e){}
  }

  setTimeout(equalizeHostBottomOnly,60);
  setTimeout(equalizeHostBottomOnly,180);
  setInterval(equalizeHostBottomOnly,500);
  try{
    new MutationObserver(function(){setTimeout(equalizeHostBottomOnly,20);})
      .observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();