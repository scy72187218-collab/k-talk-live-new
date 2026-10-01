/* 9-room HOST only: keep the cell size unchanged, but show more of the camera
   so the face/person looks about 40% smaller. Visual only. */
(function(){
  if(window.__ktG9HostFaceVisual60pct20261002)return;
  window.__ktG9HostFaceVisual60pct20261002=true;

  function apply(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!room)return;

    room.querySelectorAll('.ktg13-host,.ktg13-guests>.ktg13-guest').forEach(function(cell){
      var v=cell.querySelector(':scope > video');
      if(!v)return;

      /* Keep the box/cell exactly the same. Reduce crop/zoom inside it. */
      v.style.setProperty('object-fit','contain','important');
      v.style.setProperty('object-position','center center','important');
      v.style.setProperty('background','#111','important');
      v.style.setProperty('transform','scale(.50)','important');
      v.style.setProperty('transform-origin','center center','important');
    });

    var hv=room.querySelector('.ktg13-host>video');
    if(hv)hv.style.setProperty('transform','scaleX(-1) scale(.50)','important');
  }

  apply();
  [40,120,300,700,1400,2600].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostFaceVisual60pctTimer);
      window.__ktG9HostFaceVisual60pctTimer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();