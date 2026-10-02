/* K-Talk 9-room LED banner restore only.
   Keeps the old pink marquee shell between the top header and stats.
   No other room controls/layout are changed. */
(function(){
  if(window.__ktGroup9LedBannerShellRestore20261002V3)return;
  window.__ktGroup9LedBannerShellRestore20261002V3=true;

  function ensureStyle(){
    if(document.getElementById('ktG9LedHistoricalStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktG9LedHistoricalStyle20261002';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led,'
      +'#screen .ktg9-room>.ktg13-led{'
        +'display:block!important;visibility:visible!important;opacity:1!important;'
        +'position:relative!important;flex:0 0 34px!important;min-height:34px!important;height:34px!important;'
        +'width:100%!important;margin:0!important;border:2px solid #ff28c4!important;border-radius:14px!important;'
        +'background-color:#120712!important;'
        +'background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;'
        +'background-size:13px 13px!important;overflow:hidden!important;'
        +'box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important;'
        +'z-index:24!important;box-sizing:border-box!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led .ktg13-led-track,'
      +'#screen .ktg9-room>.ktg13-led .ktg13-led-track{'
        +'position:absolute!important;left:0!important;top:0!important;height:100%!important;'
        +'display:flex!important;align-items:center!important;white-space:nowrap!important;'
        +'visibility:visible!important;opacity:1!important;'
        +'animation:ktg13Marquee 12s linear infinite!important;'
        +'font-size:16px!important;font-weight:950!important;color:#ffd62d!important;'
        +'text-shadow:0 0 7px #ff8b00!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led .ktg13-led-track span,'
      +'#screen .ktg9-room>.ktg13-led .ktg13-led-track span{display:inline-block!important;padding-right:80px!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led .ktg13-led-track b,'
      +'#screen .ktg9-room>.ktg13-led .ktg13-led-track b{color:#ff59c9!important}'
      +'@keyframes ktg13Marquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function ensure(){
    try{
      ensureStyle();
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"],#screen .ktg9-room');
      if(!room)return;

      var head=room.querySelector('.ktg13-head,.ktg9-head');
      var stats=room.querySelector('.ktg13-stats,.ktg9-stats,.kt-room-stats-copy');
      if(!head||!stats)return;

      var led=room.querySelector('.ktg13-led');
      if(!led){
        led=document.createElement('div');
        led.className='ktg13-led';
        led.setAttribute('data-kt-led-shell-restored','1');
        led.innerHTML='<div class="ktg13-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div>';
      }

      if(led.parentElement!==room || led.previousElementSibling!==head){
        head.insertAdjacentElement('afterend',led);
      }
    }catch(e){}
  }

  ensure();
  [30,80,160,300,600,1000,1800,3000,5000,8000,12000].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,500);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9LedHistoricalTimer20261002);
      window.__ktG9LedHistoricalTimer20261002=setTimeout(ensure,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();