(function(){
'use strict';
window.ktOpenSoloRoom20261006=async function(){
 try{if(window.ensureLiveCamera)await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
 var screen=document.getElementById('screen');if(!screen)return false;
 document.body.classList.remove('kt-home');
 screen.innerHTML='<section class="kt1-room"><video class="kt1-video" autoplay playsinline muted></video>'
 +'<header class="kt1-top"><button class="kt1-close">×</button><div class="kt1-onair"><strong>📶 1인 방송</strong><small>🔴 ON AIR <b>00:00:00</b></small></div><button class="kt1-heart">♥ <b>10</b></button><button class="kt1-att">🪽 출석체크 🪽</button><div class="kt1-brand">K-Talk LIVE</div></header>'
 +'<div class="kt1-neon"><div class="kt1-marquee"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹　　💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div></div>'
 +'<div class="kt1-tools"><button>↻ 되돌리기</button><button>🎁 보물상자</button><button>⚔ 매치</button></div>'
 +'<div class="kt1-stats"><span>🔥 일일 랭킹</span><span>🎯 미션</span><span>시청자 5명이 시청중</span></div>'
 +'<button class="kt1-earn">수익률</button><div class="kt1-chatlog"></div>'
 +'<footer class="kt1-bottom"><input class="kt1-input" placeholder="입력하세요...."><button class="kt1-send">➤</button><button>👥</button><button>🌹</button><button>🎁</button><button>↗</button></footer>'
 +'<div class="kt1-earnbox" hidden><b>1인 방송 수익률</b><div>현재 수익률은 관리자 설정을 따릅니다.</div></div></section>';
 var room=screen.querySelector('.kt1-room'),v=room.querySelector('.kt1-video');
 try{
   if(window.state&&state.stream){
    v.srcObject=state.stream;v.muted=true;
    var playNow=function(){v.play().catch(function(){});};
    v.onloadedmetadata=playNow;playNow();
   }else if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){
    var s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:true});
    if(window.state)state.stream=s;v.srcObject=s;v.muted=true;v.play().catch(function(){});
   }
  }catch(e){}
 room.querySelector('.kt1-close').onclick=function(){try{if(window.home)home();}catch(e){}};
 room.querySelector('.kt1-heart').onclick=function(){var b=this.querySelector('b');b.textContent=String((+b.textContent||0)+1);};
 room.querySelector('.kt1-att').onclick=function(){this.textContent='💗 출석완료';}; var sec=0,timer=setInterval(function(){if(!document.body.contains(room)){clearInterval(timer);return;}sec++;var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60,b=room.querySelector('.kt1-onair b');if(b)b.textContent=[h,m,s].map(function(n){return String(n).padStart(2,'0');}).join(':');},1000);
 room.querySelector('.kt1-earn').onclick=function(){var x=room.querySelector('.kt1-earnbox');x.hidden=!x.hidden;};
 var input=room.querySelector('.kt1-input'),log=room.querySelector('.kt1-chatlog');
 function send(){var s=input.value.trim();if(!s)return;var d=document.createElement('div');d.textContent=s;log.appendChild(d);input.value='';}
 room.querySelector('.kt1-send').onclick=send;input.onkeydown=function(e){if(e.key==='Enter')send();};
 return true;
};
var st=document.createElement('style');st.textContent=`
body:has(.kt1-room)>#ktMainBottomNav,body:has(.kt1-room)>.bottom{display:none!important}
.kt1-room{position:fixed;inset:0;background:#050508;color:#fff;z-index:2147483000;overflow:hidden;font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif}
.kt1-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#08080c}.kt1-room:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.42),transparent 30%,transparent 68%,rgba(0,0,0,.58));pointer-events:none}
.kt1-top{position:absolute;z-index:3;left:8px;right:8px;top:max(8px,env(safe-area-inset-top));display:flex;align-items:center;gap:6px}.kt1-close,.kt1-att,.kt1-heart,.kt1-earn{border:1px solid #ffffff42;background:#090910a8;color:#fff;border-radius:18px;min-height:34px;padding:6px 9px;font-weight:900}.kt1-close{width:35px;border-radius:50%;font-size:22px;padding:0}.kt1-onair{font-weight:950;line-height:1.05;white-space:nowrap}.kt1-onair strong{display:block;font-size:14px}.kt1-onair small{display:block;margin-top:4px;font-size:10px}.kt1-onair b{font-variant-numeric:tabular-nums}.kt1-att{border:2px solid #ff2bbd!important;background:#130714!important;color:#ffd52f!important;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66!important}.kt1-heart{color:#ff4b7c}.kt1-heart b{color:#fff}.kt1-brand{margin-left:auto;color:#ff4e86;font-weight:950}
.kt1-neon{position:absolute;z-index:3;top:58px;left:8px;right:8px;height:44px;padding:0;border:2px solid #ff28c4;border-radius:14px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466;color:#ffd62d;font-weight:950;overflow:hidden;white-space:nowrap}.kt1-neon b{color:#ff59c9}.kt1-marquee{overflow:hidden;width:100%}.kt1-marquee span{display:inline-block;min-width:max-content;padding-right:80px;animation:kt1marquee 12s linear infinite;font-size:16px;line-height:40px;text-shadow:0 0 7px #ff8b00}@keyframes kt1marquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}
.kt1-tools{position:absolute;z-index:3;top:108px;left:8px;right:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.kt1-tools button{height:48px;border:1px solid #ffffff30;border-radius:13px;background:#15151dbd;color:#fff;font-weight:900}
.kt1-stats{position:absolute;z-index:3;top:166px;left:12px;right:12px;display:flex;justify-content:space-between;font-size:12px;font-weight:900}.kt1-earn{position:absolute;z-index:3;right:10px;top:198px}
.kt1-chatlog{position:absolute;z-index:3;left:14px;right:14px;bottom:78px;max-height:27vh;overflow:auto;text-shadow:0 1px 3px #000;font-weight:700}.kt1-chatlog div{margin:4px 0}
.kt1-bottom{position:absolute;z-index:4;left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:6px}.kt1-input{min-width:0;flex:1;height:46px;border-radius:23px;border:1px solid #ffffff45;background:#0a0a10b8;color:#fff;padding:0 15px;font-size:16px;outline:none}.kt1-bottom button{width:44px;height:44px;flex:0 0 44px;border-radius:50%;border:1px solid #ffffff45;background:#0a0a10c7;color:#fff;font-size:20px}.kt1-send{font-size:24px!important}
.kt1-earnbox{position:absolute;z-index:6;right:10px;top:238px;background:#08080eef;border:1px solid #ffffff42;border-radius:14px;padding:12px;max-width:230px;font-size:13px}
@media(max-width:430px){.kt1-top{gap:4px}.kt1-host,.kt1-brand{font-size:12px}.kt1-att,.kt1-heart,.kt1-earn{font-size:11px;padding:5px 7px}.kt1-bottom{gap:5px}.kt1-bottom button{width:40px;height:40px;flex-basis:40px}.kt1-input{height:42px}}
`;document.head.appendChild(st);
})();