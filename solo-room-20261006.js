(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
window.ktOpenSoloRoom20261006=async function(){
  try{ if(window.ensureLiveCamera) await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user'); }catch(e){}
  var screen=document.getElementById('screen'); if(!screen)return false;
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="kt1-room">'
   +'<video class="kt1-video" autoplay playsinline muted></video>'
   +'<header class="kt1-top"><button class="kt1-close" type="button" aria-label="닫기">×</button><div class="kt1-host">📶 대충그동</div><button class="kt1-heart" type="button">♥ <b>10</b></button><button class="kt1-att" type="button">출석체크</button><div class="kt1-brand">K-Talk LIVE</div></header>'
   +'<div class="kt1-neon">방송 켰어요 🎁　💗 K-Talk LIVE 환영합니다</div>'
   +'<div class="kt1-tools"><button type="button">↻ 되돌리기</button><button class="kt1-treasure" type="button">🎁 보물상자</button><button type="button">⚔ 매치</button></div>'
   +'<div class="kt1-stats"><span>🔥 일일 랭킹</span><span>🎯 미션</span><span>시청자 5명이 시청중</span></div>'
   +'<button class="kt1-earn" type="button">수익률</button>'
   +'<div class="kt1-chatlog"><div>방송을 시작합니다.</div></div>'
   +'<footer class="kt1-bottom"><input class="kt1-input" placeholder="입력하세요...." aria-label="채팅 입력">'
   +'<button class="kt1-send" type="button">➤</button><button class="kt1-people" type="button">👥</button>'
   +'<button class="kt1-rose" type="button">🌹</button><button class="kt1-gift" type="button">🎁</button><button class="kt1-share" type="button">↗</button></footer>'
   +'<div class="kt1-earnbox" hidden><b>1인 방송 수익률</b><div>현재 수익률은 관리자 설정을 따릅니다.</div></div>'
   +'</section>';
  var room=screen.querySelector('.kt1-room'),v=room.querySelector('.kt1-video');
  try{if(window.state&&state.stream){v.srcObject=state.stream;v.play().catch(function(){});}}catch(e){}
  room.querySelector('.kt1-close').onclick=function(){try{if(window.closeCreator)closeCreator();}catch(e){} try{if(window.home)home();}catch(e){}};
  room.querySelector('.kt1-heart').onclick=function(){var b=this.querySelector('b');b.textContent=String((parseInt(b.textContent,10)||0)+1);};
  room.querySelector('.kt1-att').onclick=function(){this.textContent='💗 출석완료';};
  room.querySelector('.kt1-earn').onclick=function(){var x=room.querySelector('.kt1-earnbox');x.hidden=!x.hidden;};
  var input=room.querySelector('.kt1-input'),log=room.querySelector('.kt1-chatlog');
  function send(){var s=input.value.trim();if(!s)return;var d=document.createElement('div');d.textContent=s;log.appendChild(d);input.value='';}
  room.querySelector('.kt1-send').onclick=send; input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
  return true;
};
var st=document.createElement('style');st.textContent=`
.kt1-room{position:fixed;inset:0;background:#050508;color:#fff;z-index:2147482000;overflow:hidden;font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif}
.kt1-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#09090d}
.kt1-room:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.44),transparent 20%,transparent 63%,rgba(0,0,0,.58));pointer-events:none}
.kt1-top{position:absolute;z-index:2;left:8px;right:8px;top:max(8px,env(safe-area-inset-top));display:flex;align-items:center;gap:7px}.kt1-host{font-weight:950}.kt1-brand{margin-left:auto;color:#ff4e86;font-weight:950}.kt1-neon{position:absolute;z-index:2;top:58px;left:8px;right:8px;padding:9px 8px;border:2px solid #ff39c7;border-radius:12px;background:rgba(35,0,28,.68);box-shadow:0 0 10px #ff39c7;color:#ffe744;font-weight:950;text-align:center}.kt1-tools{position:absolute;z-index:2;top:108px;left:8px;right:8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.kt1-tools button{height:48px;border:1px solid rgba(255,255,255,.2);border-radius:13px;background:rgba(20,20,28,.72);color:#fff;font-weight:900}.kt1-stats{position:absolute;z-index:2;top:164px;left:12px;right:12px;display:flex;justify-content:space-between;font-size:12px;font-weight:900}.kt1-earn{position:absolute;z-index:3;right:10px;top:196px}
.kt1-close,.kt1-att,.kt1-heart,.kt1-earn{border:1px solid rgba(255,255,255,.32);background:rgba(5,5,10,.56);color:#fff;border-radius:18px;min-height:34px;padding:6px 10px;font-weight:850}
.kt1-close{width:36px;border-radius:50%;font-size:22px;padding:0}.kt1-title{font-weight:950;margin-right:auto}.kt1-heart{color:#ff4d72}.kt1-heart b{color:#fff}
.kt1-chatlog{position:absolute;z-index:2;left:14px;right:14px;bottom:92px;max-height:26vh;overflow:auto;text-shadow:0 1px 3px #000;font-weight:700}.kt1-chatlog div{margin:4px 0}
.kt1-bottom{position:absolute;z-index:3;left:8px;right:8px;bottom:max(10px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:7px}
.kt1-input{min-width:0;flex:1;height:48px;border-radius:24px;border:1px solid rgba(255,255,255,.28);background:rgba(10,10,16,.66);color:#fff;padding:0 16px;font-size:16px;outline:none}
.kt1-bottom button{width:46px;height:46px;flex:0 0 46px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(10,10,16,.7);color:#fff;font-size:21px}.kt1-send{font-size:25px!important}.kt1-rose{color:#ff466b!important}
.kt1-earnbox{position:absolute;z-index:5;right:10px;top:58px;background:rgba(7,7,12,.92);border:1px solid rgba(255,255,255,.28);border-radius:14px;padding:12px;max-width:230px;font-size:13px}
@media(max-width:430px){.kt1-top{gap:4px}.kt1-att,.kt1-heart,.kt1-earn{font-size:11px;padding:5px 7px}.kt1-bottom{gap:5px}.kt1-bottom button{width:42px;height:42px;flex-basis:42px}.kt1-input{height:44px}}
`;document.head.appendChild(st);
})();