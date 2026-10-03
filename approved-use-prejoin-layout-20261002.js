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
    return 0;
  }

  function ensureStyle(){
    if(document.getElementById('ktApprovedPrejoinSameStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktApprovedPrejoinSameStyle20261002';
    s.textContent=''
      +'.kt-prejoin-room-cell.self{outline:2px solid #61d9ff!important;outline-offset:-2px!important;position:relative!important}'
      +'.kt-prejoin-room-cell.self>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important;background:#08090c!important}'
      +'.kt-prejoin-room-cell.self>label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}'
      +'.kt-remote-live.kt-prejoin-room-view .kt-remote-attendance.kt-att-next-like{position:static!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;margin-left:5px!important;height:24px!important;min-width:0!important;padding:0 8px!important;border-radius:12px!important;font-size:10px!important;line-height:24px!important;z-index:auto!important;white-space:nowrap!important}'
      +'.kt-approved-attendance-heart-count{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;margin-left:5px!important;height:24px!important;min-width:38px!important;padding:0 7px!important;border-radius:12px!important;background:#351026!important;border:1px solid #ff4f91aa!important;color:#fff!important;font-size:10px!important;font-weight:950!important;white-space:nowrap!important;box-sizing:border-box!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function approvedAttendanceKey(){
    var d=new Date();
    var day=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    var host='';
    try{host=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'room');}catch(e){host='room';}
    return 'ktalk_remote_attendance_count:'+day+':'+host;
  }

  function approvedAttendanceDoneKey(){
    var viewer='';
    try{viewer=String(localStorage.getItem('kt_live_device_id')||'viewer');}catch(e){viewer='viewer';}
    return approvedAttendanceKey()+':done:'+viewer;
  }

  function approvedAttendanceCount(){
    try{return Math.max(0,parseInt(localStorage.getItem(approvedAttendanceKey())||'0',10)||0);}catch(e){return 0;}
  }

  function paintApprovedAttendanceCount(root){
    if(!root)return;
    var badge=root.querySelector('.kt-approved-attendance-heart-count');
    if(badge)badge.textContent='💗 '+String(approvedAttendanceCount());
  }

  function positionAttendanceBesideHeart(root){
    if(!root)return;
    var attend=root.querySelector('.kt-remote-attendance');
    if(!attend)return;

    var like=root.querySelector('.kt-clock-like-20260927,.kt-live-clock-heart,button[aria-label="좋아요"]');
    if(!like){
      var candidates=[].slice.call(root.querySelectorAll('button,span,div'));
      like=candidates.find(function(el){
        var t=String(el.textContent||'').trim();
        return /[♥♡❤💗]\s*\d+$/.test(t);
      })||null;
    }
    if(!like)return;

    attend.classList.add('kt-att-next-like');
    if(like.nextElementSibling!==attend)like.insertAdjacentElement('afterend',attend);

    var count=root.querySelector('.kt-approved-attendance-heart-count');
    if(!count){
      count=document.createElement('span');
      count.className='kt-approved-attendance-heart-count';
      count.setAttribute('aria-label','출석체크 인원');
    }
    if(attend.nextElementSibling!==count)attend.insertAdjacentElement('afterend',count);
    paintApprovedAttendanceCount(root);

    if(!attend.dataset.ktApprovedAttendanceCountBound){
      attend.dataset.ktApprovedAttendanceCountBound='1';
      attend.addEventListener('click',function(){
        setTimeout(function(){
          try{
            var doneKey=approvedAttendanceDoneKey();
            if(localStorage.getItem(doneKey)!=='1'){
              localStorage.setItem(doneKey,'1');
              localStorage.setItem(approvedAttendanceKey(),String(approvedAttendanceCount()+1));
            }
          }catch(e){}
          paintApprovedAttendanceCount(root);
        },0);
      },false);
    }
  }

  function ensureLeaveButton(root){
    if(!root)return;
    var b=root.querySelector('.kt-remote-leave-fixed-1150617');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-remote-leave-fixed-1150617';
      b.textContent='퇴장';
      b.setAttribute('aria-label','방송방 퇴장');
      b.style.cssText='position:absolute!important;left:8px!important;top:8px!important;z-index:200!important;height:34px!important;padding:0 12px!important;border:1px solid #ffffff55!important;border-radius:17px!important;background:rgba(15,15,20,.88)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;pointer-events:auto!important;touch-action:manipulation!important';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        try{
          if(typeof window.ktLeaveRemoteLive==='function'){
            Promise.resolve(window.ktLeaveRemoteLive(false)).catch(function(){});
          }
        }catch(_e){}
      };
      root.appendChild(b);
    }
  }

  function apply(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return false;
    ensureStyle();
    ensureLeaveButton(root);

    var total=roomTotal();
    if(!total)return false;
    var hostStream=null,selfStream=null;
    try{hostStream=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    try{selfStream=window.__ktLocalGuestCameraStream20260926||window.__ktApprovedGuestSelfStream||null;}catch(e){}

    /* 다른 방은 기존 처리 유지 */
    var old=root.querySelector('.kt-guest-hostlike-room');
    if(old){
      try{
        var ohv=old.querySelector('.kgh-cell.host video');
        var osv=old.querySelector('.kgh-cell.self video');
        if(ohv&&live(ohv.srcObject))hostStream=ohv.srcObject;
        if(osv&&live(osv.srcObject))selfStream=osv.srcObject;
      }catch(e){}
      try{old.remove();}catch(e){}
    }
    root.classList.remove('kt-guest-hostlike-active','kt-approved-guest-room');
    root.classList.add('kt-prejoin-room-view');

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
      var vh=document.createElement('video');
      vh.id='ktRemoteHostPreview';
      vh.autoplay=true;vh.playsInline=true;vh.muted=true;vh.defaultMuted=true;
      if(hostStream)vh.srcObject=hostStream;
      host.appendChild(vh);grid.appendChild(host);

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
      try{var p=vh.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }else{
      var hostV=grid.querySelector('.kt-prejoin-room-cell.host video');
      if(hostV&&hostStream&&hostV.srcObject!==hostStream){hostV.srcObject=hostStream;try{var hp2=hostV.play();if(hp2&&hp2.catch)hp2.catch(function(){});}catch(e){}}
    }

    var selfCell2=grid.querySelector('.kt-prejoin-room-cell.self');
    if(!selfCell2){
      var cells=[].slice.call(grid.querySelectorAll('.kt-prejoin-room-cell:not(.host)'));
      selfCell2=cells[0]||null;
      if(selfCell2){
        selfCell2.classList.add('self');
        selfCell2.textContent='';
        var lab2=document.createElement('label');lab2.textContent='나 · 게스트';selfCell2.appendChild(lab2);
        var sv2=document.createElement('video');
        sv2.autoplay=true;sv2.playsInline=true;sv2.muted=true;
        selfCell2.appendChild(sv2);
      }
    }
    if(selfCell2){
      var selfV2=selfCell2.querySelector('video');
      if(selfV2&&selfStream&&selfV2.srcObject!==selfStream){
        selfV2.srcObject=selfStream;
        try{var sp2=selfV2.play();if(sp2&&sp2.catch)sp2.catch(function(){});}catch(e){}
      }
    }
    positionAttendanceBesideHeart(root);
    return true;
  }

  /* 2026-10-03: 9명방 시청 입장 첫 화면 전용.
     큰 1인 영상 화면을 거치지 않고 호스트 1칸 + 게스트 8칸을 즉시 보여준다.
     승인 전에는 '나 · 게스트' 칸을 만들지 않는다. 기존 승인 후 apply() 동작은 그대로 둔다. */


  window.ktApplyApprovedPrejoinLayout20261002=apply;
  window.ktForceApprovedGuestGridNow20260924=function(){return apply();};

  ['kt-guest-approval-received','kt-approved-guest-stream-ready','kt-any-guest-approved','kt-three-person-sync-now','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){apply();setTimeout(apply,60);setTimeout(apply,220);});
  });
  [0,80,240,700].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(function(){
    var root=document.querySelector('.kt-remote-live.kt-prejoin-room-view');
    if(root)positionAttendanceBesideHeart(root);
  },700);
})();
