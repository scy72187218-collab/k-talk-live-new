/* K-Talk host-only effect button hide
   1111: effect button only. Do not change guest/viewer UI or any other control. */
(function(){
  window.__ktHostBottomLock1111='1111';
  window.__ktHostBottomLockedState20261004='effect-hidden+equal-spacing';
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

      var wanted=['카메라','마이크','친구','메시지','영화','공유','더보기'];

      function labelOf(btn){
        try{
          var sp=btn.querySelector('span');
          var raw=String((sp&&sp.textContent)||btn.textContent||'').replace(/\s+/g,'').trim();
          for(var i=0;i<wanted.length;i++){
            if(raw===wanted[i] || raw.indexOf(wanted[i])>=0)return wanted[i];
          }
        }catch(e){}
        return '';
      }

      var groups=[];
      [].slice.call(s.querySelectorAll('button')).forEach(function(btn){
        var lab=labelOf(btn);
        if(!lab)return;
        var p=btn.parentElement;
        if(!p)return;
        var g=groups.find(function(x){return x.parent===p;});
        if(!g){g={parent:p,items:[]};groups.push(g);}
        g.items.push({btn:btn,label:lab});
      });

      groups.forEach(function(g){
        try{
          var seen={};
          g.items.forEach(function(x){
            if(getComputedStyle(x.btn).display!=='none')seen[x.label]=x.btn;
          });
          var labels=Object.keys(seen);
          if(labels.length!==7)return;
          for(var i=0;i<wanted.length;i++)if(!seen[wanted[i]])return;

          var bar=g.parent;
          bar.style.setProperty('display','grid','important');
          bar.style.setProperty('grid-template-columns','repeat(7,minmax(0,1fr))','important');
          bar.style.setProperty('align-items','center','important');
          bar.style.setProperty('justify-content','stretch','important');
          bar.style.setProperty('gap','0','important');
          bar.style.setProperty('column-gap','0','important');

          wanted.forEach(function(name){
            var btn=seen[name];
            btn.style.setProperty('width','100%','important');
            btn.style.setProperty('min-width','0','important');
            btn.style.setProperty('max-width','none','important');
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