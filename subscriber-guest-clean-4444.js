/* 4444: 구독자 15명방 게스트 전용 새 화면. 호스트/통신/다른 방은 건드리지 않는다. */
(function(){
 if(window.__ktSubscriberGuestClean4444)return; window.__ktSubscriberGuestClean4444=true;
 function sub(){
  var r=window.__ktLastLiveRoom||{},t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ');
  return /subscriber|구독자|15\s*명|16\s*명/i.test(t);
 }
 function approved(){
  var v=document.getElementById('ktRemoteLiveVideo');
  return !!(v&&v.srcObject&&v.srcObject.getVideoTracks&&v.srcObject.getVideoTracks().some(function(x){return x.readyState==='live';}));
 }
 function render(){
  var root=document.querySelector('.kt-remote-live'); if(!root||!sub()||!approved())return;
  if(root.querySelector('.kt4444-subscriber-guest'))return;
  var host=document.getElementById('ktRemoteHostPreview');
  var main=document.getElementById('ktRemoteLiveVideo');
  var hostStream=host&&host.srcObject||null,selfStream=main&&main.srcObject||null;
  root.querySelectorAll('.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-prejoin-room-grid,.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-viewer-quick-20261001,.kt-remote-guest-upper-quick-5555,.kgh-quick').forEach(function(x){try{x.remove();}catch(e){}});
  root.classList.remove('kt-guest-hostlike-active','kt-prejoin-room-view');
  var room=document.createElement('section'); room.className='kt4444-subscriber-guest';
  room.innerHTML='<div class="k4head"><b>👑 구독자 방송</b><span>K-Talk LIVE</span></div><div class="k4air">🔴 ON AIR · 구독자 15명 방송</div><div class="k4led">✦ K-LIVE · 환영합니다 ✦</div><div class="k4grid"></div>';
  var grid=room.querySelector('.k4grid');
  for(var i=0;i<16;i++){var cell=document.createElement('div');cell.className='k4cell '+(i===0?'host':i===1?'self':'');cell.innerHTML='<span>'+(i===0?'호스트':i===1?'나':'게스트')+'</span>';grid.appendChild(cell);}
  function put(cell,stream,id){if(!stream)return;var v=document.createElement('video');v.autoplay=true;v.playsInline=true;v.muted=id==='self';v.srcObject=stream;cell.insertBefore(v,cell.firstChild);try{v.play();}catch(e){}}
  put(grid.children[0],hostStream,'host');put(grid.children[1],selfStream,'self');
  root.insertBefore(room,root.firstChild);
  var s=document.getElementById('kt4444SubscriberGuestStyle');if(!s){s=document.createElement('style');s.id='kt4444SubscriberGuestStyle';s.textContent='.kt-remote-live:has(.kt4444-subscriber-guest)>:not(.kt4444-subscriber-guest):not(.kt-remote-chat):not(.kt-remote-bottom){display:none!important}.kt4444-subscriber-guest{height:calc(100dvh - 62px);padding:5px;background:#050509;color:#fff;display:flex;flex-direction:column;gap:4px}.k4head{height:48px;border:1px solid #ff4ad8;border-radius:12px;display:flex;align-items:center;justify-content:space-between;padding:0 10px}.k4head b{color:#ffd75e}.k4head span{color:#ff62d8;font-weight:900}.k4air{font-size:11px;color:#ff5b75}.k4led{height:38px;border:2px solid #ff3bd4;border-radius:12px;display:grid;place-items:center;color:#ffd95d;font-weight:900}.k4grid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:2px}.k4cell{position:relative;overflow:hidden;background:#17171c;border:1px solid #34343c;border-radius:5px}.k4cell video{width:100%;height:100%;object-fit:cover}.k4cell span{position:absolute;left:3px;bottom:2px;font-size:8px;background:#0009;padding:1px 3px;border-radius:4px}.k4cell.host{grid-row:span 2}.k4cell.self{outline:1px solid #ff4ad8}.kt4444-subscriber-guest~.kt-remote-chat{z-index:90!important}.kt4444-subscriber-guest~.kt-remote-bottom{display:flex!important;z-index:91!important}';document.head.appendChild(s);}
 }
 window.addEventListener('kt-guest-approval-received',function(){setTimeout(render,80);});
 new MutationObserver(render).observe(document.documentElement,{childList:true,subtree:true}); setInterval(render,500); render();
})();