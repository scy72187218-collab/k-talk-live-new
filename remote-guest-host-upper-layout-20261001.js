/* K-Talk 2026-10-01
   5555 exact scope: REMOTE guest/viewer upper layout only.
   - add back/package-box/match row under stats
   - naturally reduce guest grid height by that row
   - match guest earnings HUD dimensions to host style
   DO NOT change bottom chat/input/tools, video, LIVE, approval, exit. */
(function(){
  if(window.__ktRemoteGuestHostUpperLayout20261001)return;
  window.__ktRemoteGuestHostUpperLayout20261001=true;

  function ensureStyle(){
    if(document.getElementById('ktRemoteGuestHostUpperLayoutStyle20261001'))return;
    var s=document.createElement('style');
    s.id='ktRemoteGuestHostUpperLayoutStyle20261001';
    s.textContent=''
      +'html.kt-remote-viewing #screen .ktg13-room .kt-remote-guest-upper-quick-5555{flex:0 0 35px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;min-height:35px!important;position:relative!important;z-index:35!important}'
      +'html.kt-remote-viewing #screen .ktg13-room .kt-remote-guest-upper-quick-5555 button{min-width:0!important;border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important}'
      +'html.kt-remote-viewing .kt-remote-live>#ktAllRoomGuestEarnHud20260921{width:38%!important;min-width:0!important;max-width:170px!important;height:64px!important;max-height:64px!important;padding:2px 6px!important;border:1px solid #d2a936!important;border-radius:10px!important;background:linear-gradient(135deg,rgba(23,20,11,.94),rgba(13,13,18,.94))!important}'
      +'@media(max-width:390px){html.kt-remote-viewing #screen .ktg13-room .kt-remote-guest-upper-quick-5555{flex-basis:31px!important;min-height:31px!important;gap:4px!important}html.kt-remote-viewing #screen .ktg13-room .kt-remote-guest-upper-quick-5555 button{font-size:10px!important}html.kt-remote-viewing .kt-remote-live>#ktAllRoomGuestEarnHud20260921{width:40%!important;max-width:150px!important;height:62px!important;max-height:62px!important;padding:2px 5px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function install(){
    ensureStyle();
    if(!document.documentElement.classList.contains('kt-remote-viewing'))return;

    var rooms=[].slice.call(document.querySelectorAll('#screen .ktg13-room'));
    rooms.forEach(function(room){
      if(!room||room.querySelector('.kt-remote-guest-upper-quick-5555'))return;
      var stats=room.querySelector(':scope > .ktg13-stats')||room.querySelector('.ktg13-stats');
      var main=room.querySelector(':scope > .ktg13-main')||room.querySelector('.ktg13-main');
      if(!stats||!main||!stats.parentNode)return;

      var bar=document.createElement('div');
      bar.className='kt-remote-guest-upper-quick-5555';
      bar.innerHTML='<button type="button">↩ 되돌리기</button>'
        +'<button type="button">📦 패키지 상자</button>'
        +'<button type="button">⚔ 매치</button>';
      stats.insertAdjacentElement('afterend',bar);
    });
  }

  install();
  [30,100,220,500,900,1600,2800].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemoteGuestHostUpperLayoutTimer20261001);
      window.__ktRemoteGuestHostUpperLayoutTimer20261001=setTimeout(install,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();