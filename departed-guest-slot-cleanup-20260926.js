/* K-Talk 2026-09-26: departed guest slot cleanup only.
   Does not change room layout, buttons, public video, or camera direction. */
(function(){
  if(window.__ktDepartedGuestSlotCleanup20260926)return;
  window.__ktDepartedGuestSlotCleanup20260926=true;

  function escId(v){
    v=String(v||'');
    try{return CSS.escape(v);}catch(e){return v.replace(/["\\]/g,'\\$&');}
  }

  function liveVideo(slot){
    try{
      var v=slot&&slot.querySelector&&slot.querySelector('video');
      var s=v&&v.srcObject;
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){
        return t&&t.readyState==='live'&&t.enabled!==false;
      }));
    }catch(e){return false;}
  }

  function resetSlot(slot,vid){
    if(!slot)return;
    try{
      var v=slot.querySelector('video');
      if(v){try{v.pause();}catch(e){} try{v.srcObject=null;}catch(e){}}
      if(String(slot.dataset.ktDirectGuest||'')===String(vid||''))delete slot.dataset.ktDirectGuest;
      if(String(slot.dataset.ktGuestViewerId||'')===String(vid||''))delete slot.dataset.ktGuestViewerId;
      delete slot.dataset.ktGuestGoneSince20260926;
      delete slot.dataset.ktGuestLastLive20260926;
      slot.classList.remove('kt-guest-approved','kt-peer-guest');

      if(slot.classList.contains('ktg13-guest')){
        slot.innerHTML='<span>게스트</span>';
      }else if(slot.classList.contains('ktsubscriber-guest')){
        var n=String(slot.getAttribute('data-guest-slot')||'').trim();
        slot.innerHTML='<span>👤</span><b>게스트'+(n?' '+n:'')+'</b>';
      }else if(slot.classList.contains('ktsecret-guest-slot')){
        var empty=slot.querySelector('.ktsecret-guest-empty');
        var name=slot.querySelector('.ktsecret-guest-name');
        if(empty)empty.style.display='';
        if(name)name.textContent='게스트';
      }else if(slot.classList.contains('kgh-cell')||
               slot.classList.contains('kt-approved-guest-cell')||
               slot.classList.contains('kt-guest-room-cell')){
        slot.innerHTML='<span>게스트</span>';
      }else{
        var sm=slot.querySelector('small');
        if(sm){sm.style.display='';sm.textContent='게스트';}
        var nm=slot.querySelector('.kt-guest-name');
        if(nm)nm.textContent='게스트';
      }
    }catch(e){}
  }

  function clearViewer(vid){
    vid=String(vid||'').trim();
    if(!vid)return;
    var q='[data-kt-direct-guest="'+escId(vid)+'"],[data-kt-guest-viewer-id="'+escId(vid)+'"]';
    try{document.querySelectorAll(q).forEach(function(slot){resetSlot(slot,vid);});}catch(e){}
    try{
      if(window.__ktApprovedGuestIds20260924)delete window.__ktApprovedGuestIds20260924[vid];
      if(window.__ktApprovedGuestNames20260924)delete window.__ktApprovedGuestNames20260924[vid];
    }catch(e){}
  }

  window.addEventListener('kt-any-guest-left',function(e){
    try{
      var d=e&&e.detail||{};
      clearViewer(String(d.viewer_id||''));
    }catch(_e){}
  });

  /* If the guest uses an in-app back/leave button, send the existing direct
     leave signal before the room DOM is replaced. */
  document.addEventListener('pointerdown',function(e){
    try{
      var room=e.target&&e.target.closest&&e.target.closest(
        '.kt-remote-live,.kt-guest-hostlike-room,.kt-approved-guest-room'
      );
      if(!room)return;
      var b=e.target&&e.target.closest&&e.target.closest('button');
      if(!b)return;
      var txt=String(b.textContent||'').replace(/\s+/g,'');
      if(b.classList.contains('kt-remote-back')||/나가기|방송나가기/.test(txt)){
        if(typeof window.ktDirectGuestLeaveNow20260923==='function'){
          window.ktDirectGuestLeaveNow20260923();
        }
      }
    }catch(_e){}
  },true);

  /* Do not clear a guest just because video frames pause for a few seconds.
     Mobile WebRTC can temporarily report no live video while reconnecting.
     A slot is cleared only by an explicit guest-left/cancel signal above. */
})();
