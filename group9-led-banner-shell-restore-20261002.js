/* K-Talk 9-room LED banner shell restore only.
   Scope: restore the historical .ktg13-led marquee between header and stats if missing.
   Do not change room layout, buttons, grid, chat, match, treasure, camera/mic, or attendance. */
(function(){
  if(window.__ktGroup9LedBannerShellRestore20261002)return;
  window.__ktGroup9LedBannerShellRestore20261002=true;

  function ensure(){
    try{
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      var head=room.querySelector(':scope > .ktg13-head');
      var stats=room.querySelector(':scope > .ktg13-stats,:scope > .kt-room-stats-copy');
      if(!head||!stats)return;

      var led=room.querySelector(':scope > .ktg13-led');
      if(!led){
        led=document.createElement('div');
        led.className='ktg13-led';
        led.setAttribute('data-kt-led-shell-restored','1');
        led.innerHTML='<div class="ktg13-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div>';
        head.insertAdjacentElement('afterend',led);
      }else if(led.previousElementSibling!==head){
        head.insertAdjacentElement('afterend',led);
      }

      led.style.removeProperty('display');
      led.style.removeProperty('visibility');
      led.style.removeProperty('opacity');
      led.style.setProperty('display','block','important');
      led.style.setProperty('visibility','visible','important');
      led.style.setProperty('opacity','1','important');
    }catch(e){}
  }

  ensure();
  [40,120,260,500,900,1600,2600].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9LedRestoreTimer20261002);
      window.__ktGroup9LedRestoreTimer20261002=setTimeout(ensure,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();