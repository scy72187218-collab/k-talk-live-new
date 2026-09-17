/* 2026-09-17: 9명방 상단 영역만 아침 7시 상태처럼 안정 유지. 게스트/수신/선물/하단메뉴/다른 방은 변경하지 않음. */
(function(){
  if(window.__ktGroup13LedStabilityOnly20260917)return;
  window.__ktGroup13LedStabilityOnly20260917=true;

  var LED_HTML='<span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span>';
  var savedNine={head:null,led:null,bar:null,stats:null};

  function ensureStyle(){
    if(document.getElementById('ktGroup13LedStabilityOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktGroup13LedStabilityOnly20260917Style';
    s.textContent=''
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;flex:0 0 38px!important;min-height:38px!important;height:38px!important;width:100%!important;box-sizing:border-box!important;border:2px solid #ff28c4!important;border-radius:16px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;transform:none!important;animation:none!important;filter:none!important;color:#ffe34e!important;font-size:15px!important;font-weight:950!important;text-shadow:0 0 5px #ffb000,0 0 10px #ff35ce!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span{display:inline-block!important;padding:0!important}'
      +'#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track span+span{display:none!important}'
      +'#screen .ktg13-room[data-kt-room="9"]>.ktg13-head,#screen .ktg13-room[data-kt-room="9"]>.kt-live-top-quickbar,#screen .ktg13-room[data-kt-room="9"]>.ktg13-stats{visibility:visible!important;opacity:1!important}'
      +'@media(max-width:390px){#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led{flex-basis:36px!important;min-height:36px!important;height:36px!important}#screen .ktg13-room:not([data-kt-room="15"])>.ktg13-led>.ktg13-led-track{font-size:13px!important}}';
    document.head.appendChild(s);
  }

  function imp(el,name,value){
    if(!el)return;
    try{
      if(el.style.getPropertyValue(name)!==value||el.style.getPropertyPriority(name)!=='important')el.style.setProperty(name,value,'important');
    }catch(e){}
  }

  function forceLed(led){
    if(!led)return;
    var mobile=window.innerWidth<=390,h=mobile?'36px':'38px';
    try{led.hidden=false;led.removeAttribute('hidden');}catch(e){}
    imp(led,'display','block');imp(led,'visibility','visible');imp(led,'opacity','1');
    imp(led,'position','relative');imp(led,'flex','0 0 '+h);imp(led,'min-height',h);imp(led,'height',h);imp(led,'width','100%');
    imp(led,'box-sizing','border-box');imp(led,'overflow','hidden');
    var track=led.querySelector('.ktg13-led-track');
    if(!track){track=document.createElement('div');track.className='ktg13-led-track';track.innerHTML=LED_HTML;led.appendChild(track);}
    else if(!String(track.textContent||'').trim())track.innerHTML=LED_HTML;
    try{track.hidden=false;track.removeAttribute('hidden');}catch(e){}
    imp(track,'display','flex');imp(track,'visibility','visible');imp(track,'opacity','1');imp(track,'position','absolute');
    imp(track,'inset','0px');imp(track,'width','100%');imp(track,'height','100%');imp(track,'align-items','center');imp(track,'justify-content','center');
    imp(track,'transform','none');imp(track,'animation','none');imp(track,'filter','none');imp(track,'font-size',mobile?'13px':'15px');
  }

  function forceNineHead(el){
    if(!el)return;
    var mobile=window.innerWidth<=390,h=mobile?'58px':'64px';
    try{el.hidden=false;el.removeAttribute('hidden');}catch(e){}
    imp(el,'display','grid');imp(el,'visibility','visible');imp(el,'opacity','1');imp(el,'position','relative');
    imp(el,'flex','0 0 '+h);imp(el,'min-height',h);imp(el,'height',h);imp(el,'width','100%');imp(el,'box-sizing','border-box');
  }

  function forceNineRow(el,type){
    if(!el)return;
    var mobile=window.innerWidth<=390,h=type==='stats'?(mobile?'42px':'47px'):(mobile?'36px':'38px');
    try{el.hidden=false;el.removeAttribute('hidden');}catch(e){}
    imp(el,'display','grid');imp(el,'visibility','visible');imp(el,'opacity','1');imp(el,'position','relative');
    imp(el,'flex','0 0 '+h);imp(el,'min-height',h);imp(el,'height',h);imp(el,'width','100%');imp(el,'box-sizing','border-box');
  }

  function removeLaterBannerOnly(){
    var peek=document.getElementById('ktVideoLivePeek');
    var strip=document.getElementById('ktFollowLiveStrip');
    if(peek)try{peek.remove();}catch(e){}
    if(strip)try{strip.remove();}catch(e){}
    try{document.body.classList.remove('kt-follow-status-open');}catch(e){}
  }

  function repair(room){
    if(!room||!room.isConnected)return;
    var isNine=String(room.getAttribute('data-kt-room')||'')==='9';
    var head=room.querySelector(':scope > .ktg13-head');
    var led=room.querySelector(':scope > .ktg13-led');

    if(isNine){
      removeLaterBannerOnly();
      if(head)savedNine.head=head; else if(savedNine.head)head=savedNine.head;
      if(head&&head.parentNode!==room)room.insertBefore(head,room.firstChild);
      forceNineHead(head);
    }

    if(isNine&&led)savedNine.led=led;
    if(!led&&isNine&&savedNine.led)led=savedNine.led;
    if(!led&&head){led=document.createElement('div');led.className='ktg13-led';led.innerHTML='<div class="ktg13-led-track">'+LED_HTML+'</div>';}
    if(led&&led.parentNode!==room&&head){if(head.nextSibling)room.insertBefore(led,head.nextSibling);else room.appendChild(led);}
    if(led&&head&&led.previousElementSibling!==head)room.insertBefore(led,head.nextSibling);
    forceLed(led);

    if(!isNine)return;
    if(led)savedNine.led=led;

    var bar=room.querySelector(':scope > .kt-live-top-quickbar');
    var stats=room.querySelector(':scope > .ktg13-stats');
    if(bar)savedNine.bar=bar; else if(savedNine.bar)bar=savedNine.bar;
    if(stats)savedNine.stats=stats; else if(savedNine.stats)stats=savedNine.stats;

    if(bar&&bar.parentNode!==room){if(led&&led.nextSibling)room.insertBefore(bar,led.nextSibling);else room.appendChild(bar);}
    if(stats&&stats.parentNode!==room){if(bar&&bar.nextSibling)room.insertBefore(stats,bar.nextSibling);else if(led&&led.nextSibling)room.insertBefore(stats,led.nextSibling);else room.appendChild(stats);}
    if(bar&&led&&bar.previousElementSibling!==led)room.insertBefore(bar,led.nextSibling);
    if(stats&&bar&&stats.previousElementSibling!==bar)room.insertBefore(stats,bar.nextSibling);

    forceNineRow(bar,'bar');
    forceNineRow(stats,'stats');
  }

  function sync(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room:not([data-kt-room="15"])').forEach(repair);
  }

  sync();
  [20,60,120,250,500,900,1500,2500].forEach(function(ms){setTimeout(sync,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13LedStabilityTimer20260917);
      window.__ktGroup13LedStabilityTimer20260917=setTimeout(sync,0);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden','data-kt-room']});
  }catch(e){}
})();
