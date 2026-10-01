/* 9-room HOST only: show chat area in the blank space under the 3x3 grid,
   like the approved visual reference. Visual positioning only.
   Do not touch grid, bottom tools, top controls, earnings, signaling or actions. */
(function(){
  if(window.__ktG9HostChatPanelLikeMockup20261002)return;
  window.__ktG9HostChatPanelLikeMockup20261002=true;

  function apply(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var chat=room.querySelector('.ktg13-chat');
    var tools=room.querySelector('.ktg13-tools');
    if(!chat||!tools)return;

    try{
      var rr=room.getBoundingClientRect();
      var tr=tools.getBoundingClientRect();
      var h=Math.max(105,Math.min(160,Math.round(window.innerHeight*0.17)));
      var top=Math.round(tr.top-h-10);

      chat.style.setProperty('position','fixed','important');
      chat.style.setProperty('left',Math.round(rr.left+10)+'px','important');
      chat.style.setProperty('right','auto','important');
      chat.style.setProperty('top',top+'px','important');
      chat.style.setProperty('bottom','auto','important');
      chat.style.setProperty('width',Math.max(250,Math.round((rr.width||window.innerWidth)-20))+'px','important');
      chat.style.setProperty('height',h+'px','important');
      chat.style.setProperty('min-height',h+'px','important');
      chat.style.setProperty('max-height',h+'px','important');
      chat.style.setProperty('padding','8px 10px','important');
      chat.style.setProperty('margin','0','important');
      chat.style.setProperty('display','flex','important');
      chat.style.setProperty('flex-direction','column','important');
      chat.style.setProperty('justify-content','flex-end','important');
      chat.style.setProperty('overflow','hidden','important');
      chat.style.setProperty('background','linear-gradient(180deg,rgba(31,23,38,.76),rgba(17,17,22,.86))','important');
      chat.style.setProperty('border','1px solid rgba(255,255,255,.12)','important');
      chat.style.setProperty('border-radius','14px','important');
      chat.style.setProperty('box-shadow','0 0 14px rgba(255,56,190,.10)','important');
      chat.style.setProperty('transform','none','important');
      chat.style.setProperty('z-index','500','important');
      chat.style.setProperty('pointer-events','none','important');
    }catch(e){}
  }

  apply();
  [30,100,250,500,900,1600,2800].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,700);
  window.addEventListener('resize',function(){setTimeout(apply,60);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,150);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostChatPanelLikeMockupTimer20261002);
      window.__ktG9HostChatPanelLikeMockupTimer20261002=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();