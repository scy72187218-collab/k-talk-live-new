/* K-Talk secret host earnings position only.
   1111: move ONLY the secret-room host earnings box lower, below guest tiles.
   Do not change guest tiles, transport, buttons, chat, or other rooms. */
(function(){
  if(window.__ktSecretHostEarnLower20261004)return;
  window.__ktSecretHostEarnLower20261004=true;

  function isRemoteViewer(){
    try{return document.documentElement.classList.contains('kt-remote-viewing');}
    catch(e){return false;}
  }

  function findEarn(room){
    var direct=room.querySelector('#myEarnHud');
    if(direct)return direct;

    var candidates=[].slice.call(room.querySelectorAll('button,div'));
    for(var i=0;i<candidates.length;i++){
      var el=candidates[i];
      var t=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(t.indexOf('내 수익')>=0 && t.indexOf('원')>=0){
        /* Prefer the smallest earnings box, not a large wrapper. */
        var r=el.getBoundingClientRect();
        if(r.width>50 && r.width<190 && r.height>24 && r.height<120)return el;
      }
    }
    return null;
  }

  function moveOnlySecretHostEarn(){
    try{
      if(isRemoteViewer())return;
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;

      var earn=findEarn(room);
      if(!earn)return;

      earn.style.setProperty('position','fixed','important');
      earn.style.setProperty('left','auto','important');
      earn.style.setProperty('right','8px','important');
      earn.style.setProperty('top','auto','important');
      earn.style.setProperty('bottom','calc(96px + env(safe-area-inset-bottom))','important');
      earn.style.setProperty('transform','none','important');
      earn.style.setProperty('translate','none','important');
      earn.style.setProperty('margin','0','important');
      earn.style.setProperty('z-index','120','important');
    }catch(e){}
  }

  setTimeout(moveOnlySecretHostEarn,30);
  setTimeout(moveOnlySecretHostEarn,120);
  setTimeout(moveOnlySecretHostEarn,350);
  setInterval(moveOnlySecretHostEarn,500);
  try{
    new MutationObserver(function(){setTimeout(moveOnlySecretHostEarn,20);})
      .observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();