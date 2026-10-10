/* Fresh isolated 13-person guest room. Preserve original live video elements and signaling. */
(function(){
  if(window.ktBuildFresh13GuestRoom)return;
  window.ktBuildFresh13GuestRoom=function(root){
    if(!root||root.querySelector('.kt-guest-hostlike-room'))return;
    var main=document.getElementById('ktRemoteLiveVideo');
    var preview=document.getElementById('ktRemoteHostPreview');
    if(!main&&!preview)return;
    var style=document.getElementById('kt-fresh13-guest-style');
    if(!style){
      style=document.createElement('style');style.id='kt-fresh13-guest-style';
      style.textContent='.kt-remote-live.kt-fresh13-on{background:#09090b!important}.kt-fresh13-room{position:relative;display:flex;flex-direction:column;height:100dvh;min-height:560px;background:#0c0c10;color:white;padding:8px;gap:7px;box-sizing:border-box}.kt-fresh13-head{font-size:14px;font-weight:800;display:flex;justify-content:space-between;align-items:center;padding:9px;background:#202027;border-radius:12px} .kt-fresh13-brand{position:absolute;left:50%;transform:translateX(-50%);color:#ff3131;font-weight:900;white-space:nowrap}.kt-fresh13-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:3px;flex:1;min-height:0}.kt-fresh13-cell{position:relative;min-height:0;background:#17171d;border:1px solid #34343c;border-radius:6px;overflow:hidden;display:grid;place-items:center;font-size:12px}.kt-fresh13-cell video{width:100%;height:100%;object-fit:cover}.kt-fresh13-cell small{position:absolute;bottom:2px;left:3px;font-size:9px;background:#0008}.kt-fresh13-bottom{height:65px;display:flex;align-items:flex-end;font-size:12px;padding:5px}.kt-remote-live.kt-fresh13-on>.kt-remote-chat,.kt-remote-live.kt-fresh13-on>.kt-remote-bottom{position:relative!important;z-index:30!important}';
      document.head.appendChild(style);
    }
    var room=document.createElement('section');room.className='kt-guest-hostlike-room kt-fresh13-room';room.dataset.ktRoom='13';
    var head=document.createElement('div');head.className='kt-fresh13-head';head.innerHTML='<span>🔴 13명 방송</span><span class="kt-fresh13-brand">K-Talk LIVE</span><span aria-hidden="true"></span>';room.appendChild(head);
    var grid=document.createElement('div');grid.className='kt-fresh13-grid';
    var hostCell=null,selfCell=null;
    for(var i=0;i<13;i++){
      var cell=document.createElement('div');cell.className='kt-fresh13-cell '+(i===0?'host':i===1?'self':'');
      if(i===0){hostCell=cell;cell.appendChild(preview||main);}
      else if(i===1){selfCell=cell;if(preview&&main&&preview!==main)cell.appendChild(main);else cell.textContent='게스트';}
      else cell.textContent='게스트';
      if(i<2){var label=document.createElement('small');label.textContent=i===0?'호스트':'나 · 게스트';cell.appendChild(label);}
      grid.appendChild(cell);
    }
    room.appendChild(grid);
    var bottom=document.createElement('div');bottom.className='kt-fresh13-bottom';bottom.textContent='채팅';room.appendChild(bottom);
    root.classList.remove('kt-approved-guest-room','kt-prejoin-room-view');root.classList.add('kt-guest-hostlike-active','kt-fresh13-on');
    /* 13-person guest only: remove obsolete visual panels, retain signaling and toolbar. */
    Array.from(root.children).forEach(function(el){
      if(el===room||el.matches('.kt-remote-bottom,.kt-remote-chat,.kt-remote-toolbar,.kt-remote-controls'))return;
      if(el.matches('.kt-remote-header,.kt-remote-banner,.kt-remote-actions,.kt-remote-stats,.kt-prejoin-room-grid,.kt-prejoin-room-view,.kt-approved-guest-room,.kt-guest-hostlike-room,.kt-remote-watch-tv,.kt-remote-co-watch,.kt-remote-attendance'))el.style.setProperty('display','none','important');
    });
    root.appendChild(room);
    var videos=room.querySelectorAll('video');videos.forEach(function(v){v.autoplay=true;v.playsInline=true;try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}});
  };
})();