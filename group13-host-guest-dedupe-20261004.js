/* K-Talk 13명 호스트방 게스트 중복/잔상 전용 정리 — 2026-10-04
   다른 방/배치/버튼/통신 로직은 변경하지 않는다. */
(function(){
  if(window.__ktG13HostGuestDedupe20261004)return;
  window.__ktG13HostGuestDedupe20261004=true;

  function local13(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var st=window.state||{};
      return String(st.liveRoomType||'')==='group13'||
        (String(st.liveRoomType||'')==='group'&&Number(st.liveRoomMax||0)===13)||
        String(st.liveRoomName||'')==='13명 방송'||
        !!document.querySelector('#screen .ktg13-room[data-kt-approved13="1"],#screen .ktg13-room[data-kt-room="13"]');
    }catch(e){return false;}
  }

  function idOf(slot){
    if(!slot)return '';
    return String(
      slot.dataset.ktGuestViewerId||
      slot.dataset.ktDirectGuest||
      slot.dataset.viewerId||
      slot.getAttribute('data-kt-livekit-guest')||
      slot.getAttribute('data-kt-peer-viewer')||
      ''
    ).trim();
  }

  function clearSlot(slot){
    try{
      var v=slot.querySelector('video');
      if(v){
        try{v.pause();}catch(e){}
        try{v.srcObject=null;}catch(e){}
        v.removeAttribute('poster');
        v.style.removeProperty('background-image');
      }
      ['ktGuestViewerId','ktDirectGuest','viewerId','ktLivekitGuest','ktPeerViewer'].forEach(function(k){
        try{delete slot.dataset[k];}catch(e){}
      });
      slot.removeAttribute('data-kt-livekit-guest');
      slot.removeAttribute('data-kt-peer-viewer');
      slot.classList.remove('kt-guest-approved');
      slot.innerHTML='<span>게스트</span>';
    }catch(e){}
  }

  function clean(){
    if(!local13())return;
    var slots=[].slice.call(document.querySelectorAll('#screen .ktg13-room .ktg13-guest'));
    var byId={};
    slots.forEach(function(slot){
      var id=idOf(slot);
      if(!id)return;
      if(!byId[id]){byId[id]=slot;return;}
      var keep=byId[id];
      var kv=keep.querySelector('video'),sv=slot.querySelector('video');
      var kLive=!!(kv&&kv.srcObject&&kv.srcObject.getVideoTracks&&kv.srcObject.getVideoTracks().some(function(t){return t.readyState==='live';}));
      var sLive=!!(sv&&sv.srcObject&&sv.srcObject.getVideoTracks&&sv.srcObject.getVideoTracks().some(function(t){return t.readyState==='live';}));
      if(!kLive&&sLive){clearSlot(keep);byId[id]=slot;}
      else clearSlot(slot);
    });

    var byTrack={};
    slots=[].slice.call(document.querySelectorAll('#screen .ktg13-room .ktg13-guest'));
    slots.forEach(function(slot){
      var v=slot.querySelector('video'),tr=null;
      try{tr=v&&v.srcObject&&v.srcObject.getVideoTracks&&v.srcObject.getVideoTracks()[0]||null;}catch(e){}
      var tid=tr&&tr.id?String(tr.id):'';
      if(!tid)return;
      if(!byTrack[tid]){byTrack[tid]=slot;return;}
      if(byTrack[tid]!==slot)clearSlot(slot);
    });
  }

  ['kt-host-guest-approved','kt-three-person-sync-now','kt-livekit-state'].forEach(function(ev){
    window.addEventListener(ev,function(){setTimeout(clean,20);setTimeout(clean,120);});
  });
  try{
    new MutationObserver(function(){clearTimeout(window.__ktG13DedupeTimer);window.__ktG13DedupeTimer=setTimeout(clean,30);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(clean,500);
})();
