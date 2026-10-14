(function(){
'use strict';
var selector='#myEarnHud,#ktSubscriberEarnHud,#ktGuestEarnHud,#ktAllRoomGuestEarnHud20260921,.kgh-earn,.ktsubscriber-earnhud';
var lastFocus;
function close(){var n=document.getElementById('ktEarningsLarge');if(n)n.remove();if(lastFocus&&lastFocus.isConnected)lastFocus.focus();}
function open(hud){
close();lastFocus=hud;
var box=document.createElement('div');box.id='ktEarningsLarge';
box.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000b;display:grid;place-items:center;padding:18px;color:#fff';
var panel=document.createElement('section');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','내 수익과 수익률');
panel.style.cssText='width:min(100%,440px);max-height:85dvh;overflow:auto;padding:22px;border:1px solid #d2a936;border-radius:20px;background:#15131a;font-size:16px;line-height:1.7;box-shadow:0 15px 60px #000';
var title=document.createElement('h2');title.textContent='내 수익 · 수익률';title.style.cssText='margin:0 0 12px;font-size:24px';panel.appendChild(title);
var amount=document.createElement('p');amount.textContent='현재 표시된 수익: '+(hud.innerText||hud.textContent||'').replace(/\s+/g,' ').trim();panel.appendChild(amount);
var rules=document.createElement('div');rules.innerHTML='<table style="width:100%;border-collapse:collapse;text-align:left"><thead><tr><th>회원</th><th>기본</th><th>미션 1개</th><th>2개</th></tr></thead><tbody><tr><td>일반회원</td><td>35%</td><td>40%</td><td>45%</td></tr><tr><td>구독자</td><td>40%</td><td>45%</td><td>50%</td></tr><tr><td>소속사</td><td colspan="3">70%</td></tr><tr><td>사업자</td><td colspan="3">40%</td></tr></tbody></table><p>미션 성공 혜택은 1일간 적용됩니다. 방송 중 미션과 7일 연속 매일 2시간 방송 미션이 대상입니다.</p><p>중복 보상 없이 적용 가능한 가장 높은 혜택 하나를 적용합니다.</p>';panel.appendChild(rules);
var b=document.createElement('button');b.textContent='닫기';b.style.cssText='width:100%;padding:12px;font-size:18px;background:#51304e;color:white;border:1px solid #ba82b4;border-radius:12px';b.onclick=close;panel.appendChild(b);box.appendChild(panel);box.onclick=function(e){if(e.target===box)close();};document.body.appendChild(box);b.focus();
}
document.addEventListener('click',function(e){var h=e.target.closest&&e.target.closest(selector);if(!h||h.closest('#ktEarningsLarge'))return;e.preventDefault();e.stopImmediatePropagation();open(h);},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();