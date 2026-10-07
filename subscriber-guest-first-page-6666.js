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
   +'.kt-sub6666-top-att{position:absolute;left:50%;top:9px;transform:translateX(-50%);z-index:80;height:28px;min-width:92px;padding:0 8px;border:2px solid #ff2bbd;border-radius:16px;background:#130714;color:#ffd52f;box-shadow:0 0 7px #ff2bbd,0 0 14px #ff2bbd66;font-size:11px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap}'
   +'.kt-sub6666-air{flex:0 0 28px;display:flex;align-items:center;gap:8px;padding:0 10px;color:#fff;font-size:13px;font-weight:950}.kt-sub6666-air .on{color:#ff315f}.kt-sub6666-clock{font-variant-numeric:tabular-nums}.kt-sub6666-heart{height:24px;min-width:48px;padding:0 9px;border:2px solid #b83d79;border-radius:15px;display:inline-flex;align-items:center;justify-content:center;gap:4px;color:#fff;font-size:12px;font-weight:950}.kt-sub6666-heart b{color:#ff4b9b}'
   +'.kt-sub6666-led{flex:0 0 34px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.kt-sub6666-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktSub6666Marquee 12s linear infinite;font-size:16px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.kt-sub6666-led-track span{display:inline-block;padding-right:65px}.kt-sub6666-led-track b{color:#ff59c9}@keyframes ktSub6666Marquee{from{transform:translateX(42%)}to{transform:translateX(-100%)}}'
   +'.kt-sub6666-stats{flex:0 0 46px;display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:5px}.kt-sub6666-stats>div{border-radius:12px;background:#111114;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900}'
   +'.kt-sub6666-grid{flex:0 0 min(44dvh,395px);min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:3px;overflow:hidden}.kt-sub6666-grid>.kt-sub6666-cell.host{grid-column:1/2;grid-row:1/3}.kt-sub6666-cell{position:relative;min-width:0;min-height:0;overflow:hidden;border:1px solid #292a30;border-radius:8px;background:linear-gradient(145deg,#17181d,#0e0f13);color:#ddd;display:grid;place-items:center;font-size:11px;font-weight:900}.kt-sub6666-cell.host>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#08090c!important}.kt-sub6666-cell label{position:absolute;left:5px;bottom:5px;z-index:3;padding:2px 6px;border-radius:8px;background:#000b;color:#fff;font-size:8px;font-weight:950}'
   +'.kt-remote-live.kt-sub-first-6666 .kt-remote-top button:has(>span),.kt-remote-live.kt-sub-first-6666 .kt-remote-top [class*="tv"],.kt-remote-live.kt-sub-first-6666 .kt-remote-top [class*="television"]{display:none!important}'
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-guest-upper-quick-5555,.kt-remote-live.kt-sub-first-6666>.kgh-quick{display:none!important}.kt-remote-live.kt-sub-first-6666 .kt-remote-top [class*="attendance"],.kt-remote-live.kt-sub-first-6666 .kt-remote-top [id*="Attendance"]{display:flex!important}';
  s.textContent+='.kt-remote-live.kt-sub-first-6666>.kt-fresh-three-1111{order:3!important;flex:0 0 34px!important;margin:0 0 3px!important}.kt-remote-live.kt-sub-first-6666>.kt-sub6666-grid{order:4!important}.kt-remote-live.kt-sub-first-6666 .kt-remote-bottom{position:absolute!important;left:6px!important;right:6px!important;bottom:10px!important;order:21!important;margin:0!important}.kt-remote-live.kt-sub-first-6666 .kt-live-like,.kt-remote-live.kt-sub-first-6666 .kt-like-count,.kt-remote-live.kt-sub-first-6666 [class*="heart-count"]{display:none!important}';document.head.appendChild(s);
 }
 function apply(){
  if(!isSub())return;
  var root=document.querySelector('.kt-remote-live');var main=document.getElementById('ktRemoteLiveVideo');if(!root||!main)return;
  if(root.querySelector('.kt-sub6666-grid'))return;
  style();root.classList.add('kt-sub-first-6666');
  var topAtt=document.createElement('button');topAtt.type='button';topAtt.className='kt-sub6666-top-att';topAtt.textContent='👼 출석체크 👼';topAtt.onclick=function(){if(typeof window.ktRemoteAttendance==='function')return window.ktRemoteAttendance();if(typeof window.openAttendanceBenefits==='function')return window.openAttendanceBenefits();};root.appendChild(topAtt);
  var air=document.createElement('div');air.className='kt-sub6666-air';air.innerHTML='<span class="on">● ON AIR</span><span class="kt-sub6666-clock">00:00:00</span><span class="kt-sub6666-heart"><b>♥</b><span class="kt-sub6666-heart-count">0</span></span>';
  root.querySelectorAll('.kt-remote-top button,.kt-remote-top [class*="attendance"],.kt-remote-top [id*="Attendance"],.kt-remote-top [class*="tv"],.kt-remote-top [class*="television"]').forEach(function(x){var tx=(x.textContent||'').trim();if(x!==topAtt&&(/출석체크/.test(tx)||/📺|tv/i.test(tx)||/tv|television/i.test(x.className||'')))x.style.setProperty('display','none','important');});
  var led=document.createElement('div');led.className='kt-sub6666-led';led.innerHTML='<div class="kt-sub6666-led-track"><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span></div>';
  var stats=document.createElement('div');stats.className='kt-sub6666-stats';stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';
  var grid=document.createElement('div');grid.className='kt-sub6666-grid';
  var host=document.createElement('div');host.className='kt-sub6666-cell host';var lab=document.createElement('label');lab.textContent='호스트';host.appendChild(lab);host.appendChild(main);grid.appendChild(host);
  for(var i=1;i<15;i++){var c=document.createElement('div');c.className='kt-sub6666-cell';c.textContent='게스트';grid.appendChild(c);}
  var top=root.querySelector('.kt-remote-top');if(top&&top.nextSibling)root.insertBefore(air,top.nextSibling);else root.appendChild(air);if(air.nextSibling)root.insertBefore(led,air.nextSibling);else root.appendChild(led);
  if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
  if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid); setTimeout(function(){var q=root.querySelector(':scope > .kt-fresh-three-1111');if(q&&stats.nextElementSibling!==q)stats.insertAdjacentElement('afterend',q);},80);
  try{var p=main.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  var started=Date.now();try{var rr=window.__ktLastLiveRoom||{};var raw=rr.started_at||rr.startedAt||rr.created_at||rr.createdAt;if(raw){var d=new Date(raw).getTime();if(isFinite(d)&&d>0)started=d;}}catch(e){} function tick(){var el=root.querySelector('.kt-sub6666-clock');if(!el||!root.isConnected)return;var sec=Math.max(0,Math.floor((Date.now()-started)/1000));var h=String(Math.floor(sec/3600)).padStart(2,'0'),m=String(Math.floor((sec%3600)/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0');el.textContent=h+':'+m+':'+s;var hc=root.querySelector('.kt-sub6666-heart-count');if(hc){var n=0;try{n=Number((window.__ktLastLiveRoom||{}).heart_count||(window.__ktLastLiveRoom||{}).likes||(window.__ktLastLiveRoom||{}).like_count||0)||0;}catch(e){}hc.textContent=n;}} tick();var timer=setInterval(function(){if(!root.isConnected){clearInterval(timer);return;}tick();},1000);
 }
 new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
 ['kt-livekit-state','kt-remote-room-opened'].forEach(function(e){window.addEventListener(e,apply);});
 setInterval(apply,700);apply();
})();