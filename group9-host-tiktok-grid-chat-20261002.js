/* 9-room HOST only: TikTok-like people grid.
   Visual only. Do not change top bars, quick buttons, earnings, bottom tools, signaling or actions. */
(function(){
  if(window.__ktG9HostTikTokGridChat20261002)return;
  window.__ktG9HostTikTokGridChat20261002=true;

  function apply(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!room)return;

    var grid=room.querySelector('.ktg13-main');
    if(grid){
      grid.style.setProperty('width','calc(100% - 28px)','important');
      grid.style.setProperty('margin','2px auto 0','important');
      grid.style.setProperty('height','calc(72vw - 8px)','important');
      grid.style.setProperty('min-height','0','important');
      grid.style.setProperty('max-height','calc(72vw - 8px)','important');
      grid.style.setProperty('flex','0 0 calc(72vw - 8px)','important');
      grid.style.setProperty('display','grid','important');
      grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('gap','2px','important');
      grid.style.setProperty('overflow','hidden','important');
    }


  }

  apply();
  [30,100,250,500,900,1600,2800].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,50);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostTikTokGridChatTimer20261002);
      window.__ktG9HostTikTokGridChatTimer20261002=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();