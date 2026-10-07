/* 6666 — 구독자 15명 게스트 첫 화면 전용. 4444 잠금 영역/통신/호스트/다른 방 수정 금지. */
(function(){
 if(window.__ktSubscriberGuestFirst6666)return; window.__ktSubscriberGuestFirst6666=true;
 function isSub(){
  if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
  var r=window.__ktLastLiveRoom||{},t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ');
  var m=document.querySelector('.kt-remote-meta'); if(m)t+=' '+(m.textContent||'');
  return /subscriber|구독자/i.test(t);
 }
 function style(){
  if(document.getElementById('ktSubGuestFirst6666Style'))return;
  var s=document.createElement('style');s.id='ktSubGuestFirst6666Style';
  s.textContent='.kt-remote-live.kt-sub-first-6666{display:flex!important;flex-direction:column!important;gap:4px!important;padding:5px 6px calc(62px + env(safe-area-inset-bottom))!important;background:#000!important;overflow:hidden!important}'
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-shade,.kt-remote-live.kt-sub-first-6666>.kt-remote-status{display:none!important}'
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 72px!important}'
   +'.kt-sub6666-att{position:absolute;left:50%;top:7px;transform:translateX(-50%);z-index:30;height:30px;min-width:96px;padding:0 5px;border-radius:18px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:12px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;display:flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}.kt-sub6666-att img{width:14px;height:14px;object-fit:contain}'
   +'.kt-sub6666-led{flex:0 0 50px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.kt-sub6666-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktSub6666Marquee 12s linear infinite;font-size:22px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.kt-sub6666-led-track span{display:inline-block;padding-right:65px}.kt-sub6666-led-track b{color:#ff59c9}@keyframes ktSub6666Marquee{from{transform:translateX(42%)}to{transform:translateX(-100%)}}'
   +'.kt-sub6666-stats{flex:0 0 46px;display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:5px}.kt-sub6666-stats>div{border-radius:12px;background:#111114;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900}'
   +'.kt-sub6666-grid{flex:0 0 min(44dvh,395px);min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:3px;overflow:hidden}.kt-sub6666-grid>.kt-sub6666-cell.host{grid-column:1/2;grid-row:1/3}.kt-sub6666-cell{position:relative;min-width:0;min-height:0;overflow:hidden;border:1px solid #292a30;border-radius:8px;background:linear-gradient(145deg,#17181d,#0e0f13);color:#ddd;display:grid;place-items:center;font-size:11px;font-weight:900}.kt-sub6666-cell.host>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#08090c!important}.kt-sub6666-cell label{position:absolute;left:5px;bottom:5px;z-index:3;padding:2px 6px;border-radius:8px;background:#000b;color:#fff;font-size:8px;font-weight:950}'
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-guest-upper-quick-5555,.kt-remote-live.kt-sub-first-6666>.kgh-quick{display:none!important}';
  s.textContent+='.kt-remote-live.kt-sub-first-6666>.kt-fresh-three-1111{order:3!important;flex:0 0 34px!important;margin:0 0 3px!important}.kt-remote-live.kt-sub-first-6666>.kt-sub6666-grid{order:4!important}.kt-remote-live.kt-sub-first-6666 .kt-remote-bottom{position:absolute!important;left:6px!important;right:6px!important;bottom:10px!important;order:21!important;margin:0!important}.kt-remote-live.kt-sub-first-6666 .kt-live-like,.kt-remote-live.kt-sub-first-6666 .kt-like-count,.kt-remote-live.kt-sub-first-6666 [class*="heart-count"]{display:none!important}';document.head.appendChild(s);
 }
 function apply(){
  if(!isSub())return;
  var root=document.querySelector('.kt-remote-live');var main=document.getElementById('ktRemoteLiveVideo');if(!root||!main)return;
  if(root.querySelector('.kt-sub6666-grid'))return;
  style();root.classList.add('kt-sub-first-6666');
  var air=document.createElement('div');air.className='kt-sub6666-air';air.innerHTML='<span class="on">● ON AIR</span><span class="kt-sub6666-clock">00:00:00</span>';
  var led=document.createElement('div');led.className='kt-sub6666-led';led.innerHTML='<div class="kt-sub6666-led-track"><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span></div>';
  var stats=document.createElement('div');stats.className='kt-sub6666-stats';stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';
  var grid=document.createElement('div');grid.className='kt-sub6666-grid';
  var host=document.createElement('div');host.className='kt-sub6666-cell host';var lab=document.createElement('label');lab.textContent='호스트';host.appendChild(lab);host.appendChild(main);grid.appendChild(host);
  for(var i=1;i<15;i++){var c=document.createElement('div');c.className='kt-sub6666-cell';c.textContent='게스트';grid.appendChild(c);}
  var top=root.querySelector('.kt-remote-top');if(top&&top.nextSibling)root.insertBefore(air,top.nextSibling);else root.appendChild(air);if(air.nextSibling)root.insertBefore(led,air.nextSibling);else root.appendChild(led);
  if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
  if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid); setTimeout(function(){var q=root.querySelector(':scope > .kt-fresh-three-1111');if(q&&stats.nextElementSibling!==q)stats.insertAdjacentElement('afterend',q);},80);
  try{var p=main.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  var started=Date.now();try{var rr=window.__ktLastLiveRoom||{};var raw=rr.started_at||rr.startedAt||rr.created_at||rr.createdAt;if(raw){var d=new Date(raw).getTime();if(isFinite(d)&&d>0)started=d;}}catch(e){} function tick(){var el=root.querySelector('.kt-sub6666-clock');if(!el||!root.isConnected)return;var sec=Math.max(0,Math.floor((Date.now()-started)/1000));var h=String(Math.floor(sec/3600)).padStart(2,'0'),m=String(Math.floor((sec%3600)/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0');el.textContent=h+':'+m+':'+s;} tick();var timer=setInterval(function(){if(!root.isConnected){clearInterval(timer);return;}tick();},1000);
 }
 new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
 ['kt-livekit-state','kt-remote-room-opened'].forEach(function(e){window.addEventListener(e,apply);});
 setInterval(apply,700);apply();
})();