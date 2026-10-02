/* K-Talk 15-person approved guest layout fix — 2026-10-02
   Only the approved guest view of the 15-person/subscriber room.
   Keeps host/approval/media/chat/LED logic unchanged. */
(function(){
  if(window.__ktGuest15ApprovedLayoutFix20261002)return;
  window.__ktGuest15ApprovedLayoutFix20261002=true;

  function is15Room(){
    var t='';
    try{
      var r=window.__ktLastLiveRoom||{};
      t+=' '+String(r.room_type||'')+' '+String(r.room_name||'')+' '+String(r.title||'');
    }catch(e){}
    try{
      t+=' '+String(window.__ktRemoteRoomType||'')+' '+String(window.__ktRemoteRoomName||'');
    }catch(e){}
    try{
      var root=document.querySelector('.kt-remote-live');
      if(root)t+=' '+String(root.textContent||'');
    }catch(e){}
    return /15\s*명|subscriber|구독자/i.test(t);
  }

  function style(){
    if(document.getElementById('ktGuest15ApprovedLayoutStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktGuest15ApprovedLayoutStyle20261002';
    s.textContent=''
      +'#screen .kt-guest-hostlike-room[data-kt-room="15"] .kgh-main{'
      +'display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;'
      +'grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:2px!important;}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="15"] .kgh-cell.host{'
      +'grid-column:1!important;grid-row:1/span 2!important;}'
      +'#screen .kt-guest-hostlike-room[data-kt-room="15"] .kgh-cell{'
      +'min-width:0!important;min-height:0!important;overflow:hidden!important;}';
    (document.head||document.documentElement).appendChild(s);
  }

  function makeEmptyCell(){
    var d=document.createElement('div');
    d.className='kgh-cell';
    var span=document.createElement('span');
    span.className='kgh-label';
    span.textContent='게스트';
    d.appendChild(span);
    return d;
  }

  function apply(){
    if(!is15Room())return;
    var room=document.querySelector('#screen .kt-guest-hostlike-room');
    if(!room)return;
    var grid=room.querySelector('.kgh-main');
    if(!grid)return;

    style();
    room.setAttribute('data-kt-room','15');
    grid.classList.remove('is13');
    grid.classList.add('is15');

    var cells=[].slice.call(grid.querySelectorAll(':scope > .kgh-cell'));
    while(cells.length<15){
      grid.appendChild(makeEmptyCell());
      cells=[].slice.call(grid.querySelectorAll(':scope > .kgh-cell'));
    }
    while(cells.length>15){
      var last=cells[cells.length-1];
      if(last&&!last.classList.contains('host')&&!last.classList.contains('self'))last.remove();
      else break;
      cells=[].slice.call(grid.querySelectorAll(':scope > .kgh-cell'));
    }

    try{
      var title=room.querySelector('.kgh-air strong');
      if(title)title.innerHTML='<i>●</i> 15명 방송';
      var viewers=room.querySelector('.kgh-viewers');
      if(viewers&&/시청자/.test(viewers.textContent||''))viewers.textContent='시청자 15명이 시청중 🏃';
    }catch(e){}

    try{
      if(typeof window.ktRefreshApprovedGuestRoster20260924==='function')window.ktRefreshApprovedGuestRoster20260924();
    }catch(e){}
  }

  apply();
  [0,30,80,160,320,700,1400].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,0);});
  window.addEventListener('kt-any-guest-approved',function(){setTimeout(apply,0);});
  window.addEventListener('kt-approved-guest-stream-ready',function(){setTimeout(apply,0);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest15ApprovedLayoutTimer20261002);
      window.__ktGuest15ApprovedLayoutTimer20261002=setTimeout(apply,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
