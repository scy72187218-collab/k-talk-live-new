/* 2026-09-17: 13명방 LED 전광판만 안정 복구. 다른 UI/게스트/수신/버튼은 변경하지 않음. */
(function(){
  if(window.__ktGroup13LedStabilityOnly20260917)return;
  window.__ktGroup13LedStabilityOnly20260917=true;

  var LED_HTML='<span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span>';

  function ensureStyle(){
    if(document.getElementById('ktGroup13LedStabilityOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktGroup13LedStabilityOnly20260917Style';
    s.textContent=''
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;flex:0 0 38px!important;min-height:38px!important;height:38px!important;width:100%!important;box-sizing:border-box!important;border:2px solid #ff28c4!important;border-radius:16px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;transform:none!important;animation:none!important;color:#ffe34e!important;font-size:15px!important;font-weight:950!important;text-shadow:0 0 5px #ffb000,0 0 10px #ff35ce!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span{display:inline-block!important;padding:0!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span+span{display:none!important}'
      +'@media(max-width:390px){#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{font-size:13px!important}}';
    document.head.appendChild(s);
  }

  function repair(room){
    if(!room||!room.isConnected)return;
    var head=room.querySelector(':scope > .ktg13-head');
    var led=room.querySelector(':scope > .ktg13-led');
    if(!led&&head&&head.parentNode===room){
      led=document.createElement('div');
      led.className='ktg13-led';
      led.innerHTML='<div class="ktg13-led-track">'+LED_HTML+'</div>';
      if(head.nextSibling)room.insertBefore(led,head.nextSibling);else room.appendChild(led);
    }
    if(!led)return;
    var track=led.querySelector('.ktg13-led-track');
    if(!track){
      track=document.createElement('div');
      track.className='ktg13-led-track';
      track.innerHTML=LED_HTML;
      led.appendChild(track);
    }else if(!String(track.textContent||'').trim()){
      track.innerHTML=LED_HTML;
    }
  }

  function sync(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room:not([data-kt-room="15"])').forEach(repair);
  }

  sync();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(sync,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13LedStabilityTimer20260917);
      window.__ktGroup13LedStabilityTimer20260917=setTimeout(sync,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
