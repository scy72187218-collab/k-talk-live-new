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
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 58px!important}'
   +'.kt-sub6666-led{flex:0 0 44px;border:2px solid #ff28c4;border-radius:20px;background:#120712;color:#ffd62d;font-size:17px;font-weight:950;display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap}'
   +'.kt-sub6666-stats{flex:0 0 42px;display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:5px}.kt-sub6666-stats>div{border-radius:12px;background:#111114;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900}'
   +'.kt-sub6666-grid{flex:1 1 0;min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:3px;overflow:hidden}.kt-sub6666-cell{position:relative;min-width:0;min-height:0;overflow:hidden;border:1px solid #292a30;border-radius:8px;background:linear-gradient(145deg,#17181d,#0e0f13);color:#ddd;display:grid;place-items:center;font-size:11px;font-weight:900}.kt-sub6666-cell.host>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#08090c!important}.kt-sub6666-cell label{position:absolute;left:5px;bottom:5px;z-index:3;padding:2px 6px;border-radius:8px;background:#000b;color:#fff;font-size:8px;font-weight:950}'
   +'.kt-remote-live.kt-sub-first-6666>.kt-remote-guest-upper-quick-5555,.kt-remote-live.kt-sub-first-6666>.kgh-quick{display:none!important}';
  s.textContent+='.kt-remote-live.kt-sub-first-6666 .kt-remote-guest-upper-quick-5555{display:grid!important;position:relative!important;order:20!important;flex:0 0 48px!important;margin:0!important;width:100%!important}.kt-remote-live.kt-sub-first-6666 .kt-remote-bottom{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;order:21!important;margin:0!important}';document.head.appendChild(s);
 }
 function apply(){
  if(!isSub())return;
  var root=document.querySelector('.kt-remote-live');var main=document.getElementById('ktRemoteLiveVideo');if(!root||!main)return;
  if(root.querySelector('.kt-sub6666-grid'))return;
  style();root.classList.add('kt-sub-first-6666');
  var led=document.createElement('div');led.className='kt-sub6666-led';led.textContent='💗 K-Talk LIVE · 구독자 방송';
  var stats=document.createElement('div');stats.className='kt-sub6666-stats';stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';
  var grid=document.createElement('div');grid.className='kt-sub6666-grid';
  var host=document.createElement('div');host.className='kt-sub6666-cell host';var lab=document.createElement('label');lab.textContent='호스트';host.appendChild(lab);host.appendChild(main);grid.appendChild(host);
  for(var i=1;i<8;i++){var c=document.createElement('div');c.className='kt-sub6666-cell';c.textContent='게스트';grid.appendChild(c);}
  var top=root.querySelector('.kt-remote-top');if(top&&top.nextSibling)root.insertBefore(led,top.nextSibling);else root.appendChild(led);
  if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
  if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);
  try{var p=main.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
 }
 new MutationObserver(function(){setTimeout(apply,0);}).observe(document.documentElement,{childList:true,subtree:true});
 ['kt-livekit-state','kt-remote-room-opened'].forEach(function(e){window.addEventListener(e,apply);});
 setInterval(apply,700);apply();
})();