/* 9-room HOST only: TikTok-like people grid + wider chat area.
   Visual only. Do not change top bars, quick buttons, earnings, bottom tools, signaling or actions. */
(function(){
  if(window.__ktG9HostTikTokGridChat20261002)return;
  window.__ktG9HostTikTokGridChat20261002=true;

  function apply(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!room)return;

    var grid=room.querySelector('.ktg13-main');
    if(grid){
      grid.style.setProperty('width','calc(100% - 12px)','important');
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

    var chat=room.querySelector('.ktg13-chat');
    var tools=room.querySelector('.ktg13-tools');
    if(chat&&tools){
      try{
        var tr=tools.getBoundingClientRect();
        var rr=room.getBoundingClientRect();
        var h=150;
        var top=Math.round(tr.top-h-8);
        chat.style.setProperty('position','fixed','important');
        chat.style.setProperty('left',Math.round(rr.left+10)+'px','important');
        chat.style.setProperty('right','auto','important');
        chat.style.setProperty('top',top+'px','important');
        chat.style.setProperty('bottom','auto','important');
        chat.style.setProperty('width',Math.max(240,Math.round((rr.width||window.innerWidth)*0.88))+'px','important');
        chat.style.setProperty('height',h+'px','important');
        chat.style.setProperty('min-height',h+'px','important');
        chat.style.setProperty('max-height',h+'px','important');
        chat.style.setProperty('padding','4px 8px 5px','important');
        chat.style.setProperty('margin','0','important');
        chat.style.setProperty('display','flex','important');
        chat.style.setProperty('flex-direction','column','important');
        chat.style.setProperty('justify-content','flex-end','important');
        chat.style.setProperty('overflow','hidden','important');
        chat.style.setProperty('background','transparent','important');
        chat.style.setProperty('border','0','important');
        chat.style.setProperty('box-shadow','none','important');
        chat.style.setProperty('transform','none','important');
        chat.style.setProperty('z-index','500','important');
        chat.style.setProperty('pointer-events','none','important');
      }catch(e){}
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