/* K-Talk 비밀방 1111: 두 번째 기준사진 레이아웃 전용.
   비밀방만: 위=호스트+게스트, 아래=채팅+선물/후원. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktSecretSecondLayout1111)return;
  window.__ktSecretSecondLayout1111=true;

  function ensureStyle(){
    var old=document.getElementById('ktSecretSecondLayout1111Style');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktSecretSecondLayout1111Style';
    s.textContent=''
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-main{display:grid!important;grid-template-columns:58% 42%!important;grid-template-rows:58% 42%!important;gap:4px!important;position:relative!important;overflow:hidden!important;background:#050507!important;border:1px solid rgba(255,196,73,.35)!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-six-grid{position:relative!important;inset:auto!important;grid-column:1 / span 2!important;grid-row:1!important;display:grid!important;grid-template-columns:58% 21% 21%!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important;padding:3px!important;width:100%!important;height:100%!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-six-grid>.ktsecret-slot{display:flex!important;min-width:0!important;min-height:0!important;height:auto!important;width:auto!important;aspect-ratio:auto!important;align-self:stretch!important;justify-self:stretch!important;border-radius:8px!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-six-grid>.ktsecret-slot.host{grid-column:1!important;grid-row:1 / span 3!important;display:flex!important;height:auto!important;width:auto!important;max-width:none!important;aspect-ratio:auto!important;align-self:stretch!important;justify-self:stretch!important;border:2px solid #ff2fc8!important;border-radius:10px!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-six-grid>.ktsecret-slot:not(.host){grid-column:auto!important;grid-row:auto!important;display:flex!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-six-grid>.ktsecret-slot:nth-child(6){display:flex!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-chat{position:relative!important;grid-column:1!important;grid-row:2!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:34px 8px 8px!important;overflow:hidden!important;background:linear-gradient(180deg,#0a0810,#050508)!important;border:2px solid #ff2fc8!important;border-radius:10px!important;box-shadow:inset 0 0 16px rgba(255,35,198,.10)!important;z-index:20!important;pointer-events:auto!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-chat:before{content:"채팅";position:absolute;left:0;right:0;top:0;height:29px;display:flex;align-items:center;padding-left:12px;background:linear-gradient(90deg,#ff20c7,#6d125f 52%,#09090d);border-bottom:1px solid rgba(255,75,216,.7);color:#fff;font-size:12px;font-weight:950;z-index:1}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-chat:empty:after{content:"채팅 메시지가 여기에 표시됩니다";color:#bcbcc6;font-size:10px;font-weight:800}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gifts{position:relative!important;grid-column:2!important;grid-row:2!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto!important;height:auto!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:29px repeat(3,minmax(0,1fr))!important;gap:3px!important;margin:0!important;padding:3px!important;overflow:hidden!important;background:linear-gradient(180deg,#0a0810,#050508)!important;border:2px solid #ff2fc8!important;border-radius:10px!important;z-index:19!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gifts-title{grid-column:1 / span 3!important;display:flex!important;align-items:center!important;padding:0 7px!important;color:#fff!important;font-size:11px!important;font-weight:950!important;border-bottom:1px solid rgba(255,75,216,.7)!important;background:linear-gradient(90deg,#ff20c755,#08080c)!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift{min-width:0!important;min-height:0!important;height:auto!important;padding:1px!important;border:1px solid #d9a930!important;border-radius:7px!important;background:#08080c!important;justify-content:center!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift img{width:34px!important;height:28px!important;max-width:88%!important}.ktsecret-room.kt-secret-second-layout-1111 .ktsecret-emoji{height:28px!important;font-size:22px!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift b{display:none!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift small{font-size:6.8px!important;line-height:1!important;margin-top:1px!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-wave{display:none!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-shade{pointer-events:none!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-earn-row{position:absolute!important;left:auto!important;right:3px!important;top:38.9%!important;bottom:auto!important;width:calc(21% - 4px)!important;height:19.1%!important;margin:0!important;z-index:40!important;display:flex!important;align-items:stretch!important;justify-content:stretch!important;transform:none!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-earn-row #myEarnHud{width:100%!important;max-width:none!important;min-width:0!important;height:100%!important;max-height:none!important;margin:0!important;padding:4px 3px!important;border:2px solid #d9a930!important;border-radius:8px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;overflow:hidden!important;transform:none!important;left:auto!important}'
      +'html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-earn-row #myEarnHud span{font-size:5.4px!important}html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-earn-row #myEarnHud b{font-size:8px!important}'
      +'@media(max-width:390px){html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-main{grid-template-columns:58% 42%!important;grid-template-rows:58% 42%!important}html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-chat{padding:31px 6px 6px!important}html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift img{width:29px!important;height:24px!important}html body .ktsecret-room.kt-secret-second-layout-1111 .ktsecret-gift small{font-size:6px!important}}';
    document.head.appendChild(s);
  }

  function ensureFifthGuest(room){
    var grid=room.querySelector('.ktsecret-six-grid');
    if(!grid)return;
    var slots=[].slice.call(grid.querySelectorAll(':scope > .ktsecret-slot'));
    if(slots.length<6){
      var d=document.createElement('div');
      d.className='ktsecret-slot';
      d.innerHTML='<div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div>';
      grid.appendChild(d);
    }
  }

  function ensureGiftTitle(room){
    var gifts=room.querySelector('.ktsecret-gifts');
    if(!gifts)return;
    var t=gifts.querySelector('.ktsecret-gifts-title');
    if(!t){
      t=document.createElement('div');
      t.className='ktsecret-gifts-title';
      t.textContent='🎁 선물 / 후원';
      gifts.insertBefore(t,gifts.firstChild);
    }
  }

  function resetChat(room){
    var chat=room.querySelector('.ktsecret-chat');
    if(!chat)return;
    [
      'position','left','right','top','bottom','width','height','min-height','max-height',
      'margin','padding','display','flex-direction','justify-content','overflow','background',
      'border','border-radius','box-shadow','transform','z-index','pointer-events'
    ].forEach(function(k){try{chat.style.removeProperty(k);}catch(e){}});
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .ktsecret-room').forEach(function(room){
      room.classList.add('kt-secret-second-layout-1111');
      ensureFifthGuest(room);
      ensureGiftTitle(room);
      resetChat(room);
    });
  }

  apply();
  [0,50,120,260,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretSecondLayout1111Timer);
      window.__ktSecretSecondLayout1111Timer=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(apply,40);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,140);});
})();