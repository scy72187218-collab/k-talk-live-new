(function(){
'use strict';
var selector='#myEarnHud,#ktSubscriberEarnHud,#ktGuestEarnHud,#ktAllRoomGuestEarnHud20260921,.kgh-earn,.ktsubscriber-earnhud,.kt-allroom-guest-earn,.kt-sgfh-earn';
var lastFocus,earnObserver=null;
function currentAmount(hud){var text=String(hud.innerText||hud.textContent||'');var match=text.match(/[0-9][0-9,]*(?:\.[0-9]+)?\s*원/);return match?match[0].replace(/\s+/g,''):'금액 확인 중';}
function close(){if(earnObserver){earnObserver.disconnect();earnObserver=null;}var n=document.getElementById('ktEarningsLarge');if(n)n.remove();if(lastFocus&&lastFocus.isConnected)lastFocus.focus();}
function open(hud){
close();lastFocus=hud;
var box=document.createElement('div');box.id='ktEarningsLarge';
box.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000b;display:grid;place-items:center;padding:18px;color:#fff';
var panel=document.createElement('section');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','내 수익 크게 보기');
panel.style.cssText='width:min(100%,560px);max-height:88dvh;overflow:auto;padding:22px;border:1px solid #d2a936;border-radius:20px;background:#15131a;font-size:18px;line-height:1.8;box-shadow:0 15px 60px #000';
var title=document.createElement('h2');title.textContent='현재 내 수익';title.style.cssText='margin:0 0 12px;font-size:24px';panel.appendChild(title);
var amount=document.createElement('p');amount.textContent=currentAmount(hud);amount.style.cssText='margin:20px 0 26px;font-size:clamp(38px,10vw,60px);font-weight:950;line-height:1.3;text-align:center;color:#ffe071;overflow-wrap:anywhere';panel.appendChild(amount);
var note=document.createElement('p');note.textContent='본인에게 표시되는 현재 수익입니다.';note.style.cssText='font-size:16px;text-align:center;color:#c9c6ce';panel.appendChild(note);
earnObserver=new MutationObserver(function(){var next=currentAmount(hud);if(amount.textContent!==next)amount.textContent=next;});earnObserver.observe(hud,{childList:true,subtree:true,characterData:true});
var b=document.createElement('button');b.textContent='닫기';b.style.cssText='width:100%;padding:12px;font-size:18px;background:#51304e;color:white;border:1px solid #ba82b4;border-radius:12px';b.onclick=close;panel.appendChild(b);box.appendChild(panel);box.onclick=function(e){if(e.target===box)close();};document.body.appendChild(box);b.focus();
}
var tap=null,lastOpened=null,lastOpenedAt=0;
function activate(e,h){
if(!h||h.closest('#ktEarningsLarge'))return;
e.preventDefault();e.stopImmediatePropagation();
if(h===lastOpened&&Date.now()-lastOpenedAt<800&&document.getElementById('ktEarningsLarge'))return;
lastOpened=h;lastOpenedAt=Date.now();open(h);
}
document.addEventListener('pointerdown',function(e){var h=e.target.closest&&e.target.closest(selector);tap=h?{hud:h,id:e.pointerId,x:e.clientX,y:e.clientY}:null;},true);
document.addEventListener('pointerup',function(e){var t=tap;tap=null;if(!t||t.id!==e.pointerId||Math.abs(e.clientX-t.x)>10||Math.abs(e.clientY-t.y)>10)return;var h=e.target.closest&&e.target.closest(selector);if(h===t.hud)activate(e,h);},true);
document.addEventListener('pointercancel',function(){tap=null;},true);
document.addEventListener('click',function(e){activate(e,e.target.closest&&e.target.closest(selector));},true);
var style=document.createElement('style');style.textContent=selector+'{pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important}';document.head.appendChild(style);
function markHuds(){document.querySelectorAll(selector).forEach(function(h){if(!h.hasAttribute('tabindex'))h.setAttribute('tabindex','0');if(h.tagName!=='BUTTON'&&!h.hasAttribute('role'))h.setAttribute('role','button');h.setAttribute('aria-label','내 수익 크게 보기');});}
markHuds();new MutationObserver(markHuds).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();else if(e.key==='Enter'||e.key===' '){var h=e.target.closest&&e.target.closest(selector);if(h)activate(e,h);}});
})();