/* K-Talk — 승인 전/후 동일 방 배치. 2026-10-02
   승인 후 별도 kgh 화면을 만들지 않고 승인 전 prejoin 칸을 그대로 유지한다. */
(function(){
  if(window.__ktApprovedUsePrejoinLayout20261002)return;
  window.__ktApprovedUsePrejoinLayout20261002=true;

  function live(st){
    try{return !!(st&&st.getVideoTracks&&st.getVideoTracks().some(function(t){return t.readyState==='live';}));}
    catch(e){return false;}
  }

  function roomTotal(){
    var t='';
    try{var r=window.__ktLastLiveRoom||{};t+=' '+(r.room_name||'')+' '+(r.room_type||'')+' '+(r.title||'');}catch(e){}
    try{t+=' '+(window.__ktRemoteRoomName||'')+' '+(window.__ktRemoteRoomType||'');}catch(e){}
    if(/16\s*명|15\s*명|subscriber|구독자/i.test(t))return 16;
    if(/13\s*명|group13/i.test(t))return 13;
    return 9;
  }

  function ensureStyle(){
    if(document.getElementById('ktApprovedPrejoinSameStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktApprovedPrejoinSameStyle20261002';
    s.textContent=''
      +'.kt-prejoin-room-cell.self{outline:2px solid #61d9ff!important;outline-offset:-2px!important;position:relative!important}'
      +'.kt-prejoin-room-cell.self>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important;background:#08090c!important}'
      +'.kt-prejoin-room-cell.self>label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return false;
    ensureStyle();

    var hostStream=null,selfStream=null;
    try{hostStream=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{selfStream=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}

    var old=root.querySelector('.kt-guest-hostlike-room');
    if(old){
      try{
        var hv=old.querySelector('.kgh-cell.host video');
        var sv=old.querySelector('.kgh-cell.self video');
        if(hv&&live(hv.srcObject))hostStream=hv.srcObject;
        if(sv&&live(sv.srcObject))selfStream=sv.srcObject;
      }catch(e){}
      try{old.remove();}catch(e){}
    }
    root.classList.remove('kt-guest-hostlike-active','kt-approved-guest-room');
    root.classList.add('kt-prejoin-room-view');

    var total=roomTotal();
    var grid=root.querySelector('.kt-prejoin-room-grid');
    if(!grid || Number(grid.getAttribute('data-kt-total')||0)!==total){
      root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(x){try{x.remove();}catch(e){}});

      var led=document.createElement('div');
      led.className='kt-prejoin-room-led';
      led.textContent='💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송';

      var stats=document.createElement('div');
      stats.className='kt-prejoin-room-stats';
      stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';

      grid=document.createElement('div');
      grid.className='kt-prejoin-room-grid'+(total===16?' is16':(total===13?' is13':''));
      grid.setAttribute('data-kt-total',String(total));

      var host=document.createElement('div');
      host.className='kt-prejoin-room-cell host';
      var hl=document.createElement('label');hl.textContent='호스트';host.appendChild(hl);
      var hv=document.createElement('video');
      hv.id='ktRemoteHostPreview';
      hv.autoplay=true;hv.playsInline=true;hv.muted=true;hv.defaultMuted=true;
      if(hostStream)hv.srcObject=hostStream;
      host.appendChild(hv);grid.appendChild(host);

      for(var i=1;i<total;i++){
        var cell=document.createElement('div');
        cell.className='kt-prejoin-room-cell';
        cell.textContent='게스트';
        grid.appendChild(cell);
      }

      var top=root.querySelector('.kt-remote-top');
      if(top&&top.nextSibling)root.insertBefore(led,top.nextSibling);else root.appendChild(led);
      if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
      if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);
      try{var p=hv.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }else{
      var hostV=grid.querySelector('.kt-prejoin-room-cell.host video');
      if(hostV&&hostStream&&hostV.srcObject!==hostStream){hostV.srcObject=hostStream;try{var hp=hostV.play();if(hp&&hp.catch)hp.catch(function(){});}catch(e){}}
    }

    var selfCell=grid.querySelector('.kt-prejoin-room-cell.self');
    if(!selfCell){
      var cells=[].slice.call(grid.querySelectorAll('.kt-prejoin-room-cell:not(.host)'));
      selfCell=cells[0]||null;
      if(selfCell){
        selfCell.classList.add('self');
        selfCell.textContent='';
        var lab=document.createElement('label');lab.textContent='나 · 게스트';selfCell.appendChild(lab);
        var sv=document.createElement('video');
        sv.id='ktRemoteLiveVideo';
        sv.autoplay=true;sv.playsInline=true;sv.muted=true;
        selfCell.appendChild(sv);
      }
    }
    if(selfCell){
      var selfV=selfCell.querySelector('video');
      if(selfV&&selfStream&&selfV.srcObject!==selfStream){
        selfV.srcObject=selfStream;
        try{var sp=selfV.play();if(sp&&sp.catch)sp.catch(function(){});}catch(e){}
      }
    }
    return true;
  }

  window.ktApplyApprovedPrejoinLayout20261002=apply;
  window.ktForceApprovedGuestGridNow20260924=function(){return apply();};

  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-three-person-sync-now','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){apply();setTimeout(apply,60);setTimeout(apply,220);});
  });
  [0,80,240,700].forEach(function(ms){setTimeout(apply,ms);});
})();
