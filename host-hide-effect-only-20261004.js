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
})();