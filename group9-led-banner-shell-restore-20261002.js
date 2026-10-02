/* K-Talk 9-room LED banner shell restore only.
   Scope: keep the historical LED marquee between header and stats.
   Nothing else in the room is changed. */
(function(){
  if(window.__ktGroup9LedBannerShellRestore20261002)return;
  window.__ktGroup9LedBannerShellRestore20261002=true;

  function findRoom(){
    return document.querySelector(
      '#screen .ktg13-room[data-kt-room="9"],'+
      '#screen .ktg9-room'
    );
  }

  function ensure(){
    try{
      var room=findRoom();
      if(!room)return;

      var head=room.querySelector(':scope > .ktg13-head,:scope > .ktg9-head');
      var stats=room.querySelector(
        ':scope > .ktg13-stats,'+
        ':scope > .ktg9-stats,'+
        ':scope > .kt-room-stats-copy'
      );
      if(!head||!stats)return;

      var led=room.querySelector(':scope > .ktg13-led,:scope > .ktg9-led');
      if(!led){
        led=document.createElement('div');
        led.className='ktg13-led';
        led.setAttribute('data-kt-led-shell-restored','1');
        led.innerHTML='<div class="ktg13-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div>';
      }

      if(led.previousElementSibling!==head){
        head.insertAdjacentElement('afterend',led);
      }

      led.style.setProperty('display','block','important');
      led.style.setProperty('visibility','visible','important');
      led.style.setProperty('opacity','1','important');
      led.style.setProperty('flex','0 0 34px','important');
      led.style.setProperty('min-height','34px','important');
      led.style.setProperty('height','34px','important');

      var track=led.querySelector('.ktg13-led-track,.ktg9-led-track');
      if(track){
        track.style.setProperty('display','flex','important');
        track.style.setProperty('visibility','visible','important');
        track.style.setProperty('opacity','1','important');
      }
    }catch(e){}
  }

  ensure();
  [40,120,260,500,900,1600,2600,4500,7000,10000].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9LedRestoreTimer20261002);
      window.__ktGroup9LedRestoreTimer20261002=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();