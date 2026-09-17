/* 2026-09-17: 9명방 상단만 오늘 아침 6시 당시 동작으로 복귀. 게스트/수신/선물/하단메뉴/다른 방은 변경하지 않음. 13명방 LED 안정화는 유지. */
(function(){
  if(window.__ktGroup13LedStabilityOnly20260917)return;
  window.__ktGroup13LedStabilityOnly20260917=true;

  var LED_HTML='<span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span>';

  function ensureStyle(){
    if(document.getElementById('ktGroup13LedStabilityOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktGroup13LedStabilityOnly20260917Style';
    s.textContent=''
      /* 13명방은 현재 안정화 상태 그대로 유지 */
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;flex:0 0 38px!important;min-height:38px!important;height:38px!important;width:100%!important;box-sizing:border-box!important;border:2px solid #ff28c4!important;border-radius:16px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;transform:none!important;animation:none!important;filter:none!important;color:#ffe34e!important;font-size:15px!important;font-weight:950!important;text-shadow:0 0 5px #ffb000,0 0 10px #ff35ce!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span{display:inline-block!important;padding:0!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span+span{display:none!important}'
      /* 9명방 상단은 오전 6시 당시 스타일: 강제 재배치 없이 원래 13명방 구조/마퀴를 그대로 사용 */
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led{flex:0 0 38px!important;min-height:38px!important;height:38px!important;border-radius:16px!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led>.ktg13-led-track{font-size:18px!important;font-weight:950!important;display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;width:auto!important;height:100%!important;align-items:center!important;justify-content:flex-start!important;white-space:nowrap!important;animation:ktg13Marquee 12s linear infinite!important;filter:none!important;color:#ffd62d!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led>.ktg13-led-track span{display:inline-block!important;padding-right:80px!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-led>.ktg13-led-track span+span{display:inline-block!important}'
      +'@media(max-width:390px){#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{font-size:13px!important}#screen .ktg13-room[data-kt-room="9"]>.ktg13-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}#screen .ktg13-room[data-kt-room="9"]>.ktg13-led>.ktg13-led-track{font-size:17px!important}}';
    document.head.appendChild(s);
  }

  function imp(el,name,value){
    if(!el)return;
    try{el.style.setProperty(name,value,'important');}catch(e){}
  }

  function force13Led(room){
    if(!room||!room.isConnected)return;
    var led=room.querySelector(':scope > .ktg13-led');
    var head=room.querySelector(':scope > .ktg13-head');
    if(!led&&head){
      led=document.createElement('div');
      led.className='ktg13-led';
      led.innerHTML='<div class="ktg13-led-track">'+LED_HTML+'</div>';
      if(head.nextSibling)room.insertBefore(led,head.nextSibling);else room.appendChild(led);
    }
    if(!led)return;
    var mobile=window.innerWidth<=390,h=mobile?'36px':'38px';
    try{led.hidden=false;led.removeAttribute('hidden');}catch(e){}
    imp(led,'display','block');imp(led,'visibility','visible');imp(led,'opacity','1');imp(led,'position','relative');imp(led,'flex','0 0 '+h);imp(led,'min-height',h);imp(led,'height',h);imp(led,'width','100%');
    var track=led.querySelector('.ktg13-led-track');
    if(!track){track=document.createElement('div');track.className='ktg13-led-track';track.innerHTML=LED_HTML;led.appendChild(track);}
    else if(!String(track.textContent||'').trim())track.innerHTML=LED_HTML;
    imp(track,'display','flex');imp(track,'visibility','visible');imp(track,'opacity','1');imp(track,'position','absolute');imp(track,'inset','0px');imp(track,'width','100%');imp(track,'height','100%');imp(track,'align-items','center');imp(track,'justify-content','center');imp(track,'transform','none');imp(track,'animation','none');imp(track,'filter','none');imp(track,'font-size',mobile?'13px':'15px');
  }

  function cleanNineLaterOverlay(){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var peek=document.getElementById('ktVideoLivePeek');
    var strip=document.getElementById('ktFollowLiveStrip');
    if(peek)try{peek.remove();}catch(e){}
    if(strip)try{strip.remove();}catch(e){}
    try{document.body.classList.remove('kt-follow-status-open');}catch(e){}
  }

  function sync(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"])').forEach(force13Led);
    cleanNineLaterOverlay();
  }

  sync();
  [40,120,300,700,1400].forEach(function(ms){setTimeout(sync,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13LedStabilityTimer20260917);
      window.__ktGroup13LedStabilityTimer20260917=setTimeout(sync,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
