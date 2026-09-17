/* K-Talk: 승인된 게스트 방에서 겹쳐 보이는 작은 영상만 정리하고 9/13명 격자를 유지. 다른 화면/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestGridCleanOnly20260917)return;
  window.__ktApprovedGuestGridCleanOnly20260917=true;

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestGridCleanOnlyStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestGridCleanOnlyStyle';
    s.textContent=''
      +'.kt-remote-live.kt-approved-guest-room{display:flex!important;flex-direction:column!important;gap:4px!important;padding:5px 6px calc(62px + env(safe-area-inset-bottom))!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-approved-guest-room>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 58px!important;border-radius:16px!important;padding:6px 9px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important}'
      +'.kt-remote-live.kt-approved-guest-room>.kt-remote-shade{display:none!important}'
      +'.kt-approved-guest-led{flex:0 0 44px!important;border:2px solid #ff28c4!important;border-radius:20px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.4px)!important;background-size:12px 12px!important;box-shadow:0 0 9px #ff28c4,0 0 18px #ff28c455!important;color:#ffd62d!important;font-size:17px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;white-space:nowrap!important}'
      +'.kt-approved-guest-stats{flex:0 0 42px!important;display:grid!important;grid-template-columns:1fr 1fr 1.3fr!important;gap:5px!important}.kt-approved-guest-stats>div{border-radius:12px!important;background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important}'
      +'.kt-approved-guest-grid{flex:1 1 0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important;overflow:hidden!important}.kt-approved-guest-grid.is13{grid-template-columns:repeat(4,minmax(0,1fr))!important}'
      +'.kt-approved-guest-cell{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid #292a30!important;border-radius:8px!important;background:linear-gradient(145deg,#17181d,#0e0f13)!important;color:#bfc0c7!important;display:grid!important;place-items:center!important;font-size:12px!important;font-weight:900!important}'
      +'.kt-approved-guest-cell>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;object-fit:contain!important;object-position:center center!important;background:#08090c!important;box-shadow:none!important}'
      +'.kt-approved-guest-cell.host>video{transform:none!important}.kt-approved-guest-cell.self>video{transform:scaleX(-1)!important}'
      +'.kt-approved-guest-cell>label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}.kt-approved-guest-cell.self{outline:2px solid #61d9ff!important;outline-offset:-2px!important}'
      +'.kt-remote-live.kt-approved-guest-room>.kt-remote-host-preview,.kt-remote-live.kt-approved-guest-room>#ktRemoteHostPreview{display:none!important}'
      +'.kt-remote-live.kt-approved-guest-room .kt-remote-attendance{top:69px!important;right:12px!important;height:29px!important;font-size:10px!important;padding:0 9px!important}'
      +'.kt-remote-live.kt-approved-guest-room .kt-remote-chat{bottom:60px!important;max-height:105px!important;right:58px!important}.kt-remote-live.kt-approved-guest-room .kt-remote-bottom{bottom:calc(5px + env(safe-area-inset-bottom))!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-approved-guest-room{gap:3px!important;padding-left:4px!important;padding-right:4px!important}.kt-approved-guest-led{flex-basis:40px!important;font-size:15px!important}.kt-approved-guest-stats{flex-basis:39px!important}.kt-approved-guest-stats>div{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function roomText(){
    var m=document.querySelector('.kt-remote-meta');
    return m?String(m.textContent||''):'';
  }

  function videoLive(v){
    try{
      var st=v&&v.srcObject,ts=st&&st.getVideoTracks?st.getVideoTracks():[];
      return !!(ts&&ts.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function makeCell(cls,label){
    var d=document.createElement('div');
    d.className='kt-approved-guest-cell '+(cls||'');
    if(label){var l=document.createElement('label');l.textContent=label;d.appendChild(l);}else d.textContent='게스트';
    return d;
  }

  function cleanCell(cell,preferredId){
    if(!cell)return;
    var videos=[].slice.call(cell.querySelectorAll(':scope > video'));
    var keep=null;
    if(preferredId)keep=cell.querySelector(':scope > #'+preferredId);
    if(!keep&&videos.length)keep=videos[0];
    videos.forEach(function(v){if(v!==keep){try{v.remove();}catch(e){}}});
    if(keep){
      keep.classList.remove('kt-remote-host-preview');
      keep.style.cssText='';
      keep.autoplay=true;
      keep.playsInline=true;
      try{var p=keep.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
  }

  function cleanup(root){
    if(!root)return;
    var grid=root.querySelector('.kt-approved-guest-grid');
    if(!grid)return;
    cleanCell(grid.querySelector('.kt-approved-guest-cell.host'),'ktRemoteLiveVideo');
    cleanCell(grid.querySelector('.kt-approved-guest-cell.self'),'ktRemoteGuestSelfVideo');
    root.querySelectorAll('.kt-remote-host-preview,#ktRemoteHostPreview').forEach(function(v){
      if(!grid.contains(v)){try{v.remove();}catch(e){}}
    });
    var status=document.getElementById('ktRemoteLiveStatus');
    var host=document.getElementById('ktRemoteLiveVideo');
    if(status&&videoLive(host))status.style.setProperty('display','none','important');
  }

  function build(){
    try{
      ensureStyle();
      var root=document.querySelector('.kt-remote-live');
      if(!root)return;
      if(root.querySelector('.kt-approved-guest-grid')){root.classList.add('kt-approved-guest-room');cleanup(root);return;}

      var selfVideo=document.getElementById('ktRemoteLiveVideo');
      var hostPreview=document.getElementById('ktRemoteHostPreview');
      if(!selfVideo||!hostPreview)return;
      var selfStream=selfVideo.srcObject||null;
      var hostStream=hostPreview.srcObject||null;
      if(!selfStream||!hostStream)return;

      root.querySelectorAll('.kt-approved-guest-led,.kt-approved-guest-stats,.kt-approved-guest-grid').forEach(function(x){try{x.remove();}catch(e){}});

      selfVideo.id='ktRemoteGuestSelfVideo';
      selfVideo.className='';
      selfVideo.style.cssText='';
      selfVideo.muted=true;
      selfVideo.autoplay=true;
      selfVideo.playsInline=true;
      selfVideo.srcObject=selfStream;

      hostPreview.id='ktRemoteLiveVideo';
      hostPreview.className='';
      hostPreview.style.cssText='';
      hostPreview.muted=false;
      hostPreview.autoplay=true;
      hostPreview.playsInline=true;
      hostPreview.srcObject=hostStream;

      root.classList.add('kt-approved-guest-room');

      var led=document.createElement('div');
      led.className='kt-approved-guest-led';
      led.textContent='💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송';
      var stats=document.createElement('div');
      stats.className='kt-approved-guest-stats';
      stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';

      var txt=roomText();
      var is13=txt.indexOf('13명')>-1;
      var total=is13?13:9;
      var grid=document.createElement('div');
      grid.className='kt-approved-guest-grid'+(is13?' is13':'');
      var hostCell=makeCell('host','호스트');
      hostCell.appendChild(hostPreview);
      grid.appendChild(hostCell);
      var selfCell=makeCell('self','나 · 게스트');
      selfCell.appendChild(selfVideo);
      grid.appendChild(selfCell);
      for(var i=2;i<total;i++)grid.appendChild(makeCell('',''));

      var top=root.querySelector('.kt-remote-top');
      if(top&&top.nextSibling)root.insertBefore(led,top.nextSibling);else root.appendChild(led);
      if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
      if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);

      cleanup(root);
    }catch(e){}
  }

  build();
  [80,180,350,700,1200].forEach(function(ms){setTimeout(build,ms);});
  setInterval(build,700);
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktApprovedGuestGridCleanTimer);window.__ktApprovedGuestGridCleanTimer=setTimeout(build,30);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
