/* Enlarge only the owner's already visible earnings; never recalculate or fetch balances. */
(function(){
  if(window.__ktEarningsZoom20261018)return;
  window.__ktEarningsZoom20261018=true;
  var selector='#myEarnHud,#ktSubscriberEarnHud,.ktsubscriber-earnhud,#ktGuestEarnHud,#ktAllRoomGuestEarnHud20260921,.kgh-earn';
  var overlay=null,source=null,timer=0,previousFocus=null,sourceId='',closeTimer=0,lastPointerOpenAt=0;
  function close(){
    clearInterval(timer);timer=0;
    clearTimeout(closeTimer);closeTimer=0;
    if(overlay)overlay.remove();overlay=null;source=null;sourceId='';
    if(previousFocus&&previousFocus.isConnected&&previousFocus.focus)previousFocus.focus();
    previousFocus=null;
  }
  function refresh(){
    if(!overlay)return;
    // Room renderers replace the small HUD. Keep the dialog and reconnect its text source.
    if(!source||!source.isConnected){
      var replacement=sourceId?document.getElementById(sourceId):null;
      if(!replacement){
        replacement=Array.prototype.find.call(document.querySelectorAll(selector),function(el){return el.closest('#screen')&&el.getClientRects().length>0;});
      }
      if(!replacement||!replacement.closest('#screen')||replacement.getClientRects().length===0)return;
      source=replacement;
    }
    var text=String(source.innerText||source.textContent||'').trim();
    var display=overlay.querySelector('[data-earnings-value]');
    if(display.textContent!==text)display.textContent=text;
  }
  function open(hud){
    close();source=hud;sourceId=hud.id||'';previousFocus=document.activeElement;
    overlay=document.createElement('div');overlay.id='ktEarningsZoom20261018';
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#000b;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
    var panel=document.createElement('section');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','내 수익 크게 보기');
    panel.style.cssText='width:100%;max-width:420px;max-height:85vh;overflow:auto;box-sizing:border-box;padding:24px;border:2px solid #dfbd64;border-radius:22px;background:#18150f;color:#ffe396;text-align:center;box-shadow:0 12px 50px #0009';
    var title=document.createElement('h2');title.textContent='내 수익';title.style.cssText='margin:0 0 18px;font-size:26px;color:#ffe396';
    var value=document.createElement('div');value.setAttribute('data-earnings-value','');value.setAttribute('aria-live','polite');value.style.cssText='font-size:24px;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere;font-weight:800;color:#fff';
    var button=document.createElement('button');button.type='button';button.textContent='닫기';button.style.cssText='margin-top:22px;min-height:48px;width:100%;border:1px solid #dfbd64;border-radius:12px;background:#3b3018;color:#ffe396;font-size:20px;font-weight:800';button.onclick=close;
    panel.appendChild(title);panel.appendChild(value);panel.appendChild(button);overlay.appendChild(panel);document.body.appendChild(overlay);
    overlay.addEventListener('click',function(e){if(e.target===overlay)close();});
    overlay.addEventListener('keydown',function(e){if(e.key==='Tab'){e.preventDefault();button.focus();}});
    refresh();timer=setInterval(refresh,500);closeTimer=setTimeout(close,3000);button.focus();
  }
  function earningsTap(e){
    var hud=e.target&&e.target.closest&&e.target.closest(selector);
    if(!hud||!hud.closest('#screen')||hud.getClientRects().length===0)return;
    if(e.button>0)return;
    if(e.cancelable)e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    // Consume the whole touch gesture before older HUD toggle handlers can run.
    if(e.type==='pointerup'){lastPointerOpenAt=Date.now();open(hud);}
    else if(e.type==='click'&&Date.now()-lastPointerOpenAt>800)open(hud);
  }
  ['pointerdown','pointerup','click'].forEach(function(type){window.addEventListener(type,earningsTap,true);});
  ['touchstart','touchend'].forEach(function(type){window.addEventListener(type,earningsTap,{capture:true,passive:false});});
  window.addEventListener('keydown',function(e){if(overlay&&e.key==='Escape'){e.preventDefault();close();}});
  window.addEventListener('kt-broadcast-ended',close);
  window.addEventListener('kt-remote-host-left',close);
})();