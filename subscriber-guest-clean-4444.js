/* 4444: 구독자 15명방 게스트 전용 새 화면. 다른 방/호스트는 건드리지 않는다. */
(function(){
  if(window.__ktSubscriberGuestClean4444)return;
  window.__ktSubscriberGuestClean4444=true;
  function isSubscriberGuest(){
    var r=window.__ktLastLiveRoom||{};
    var t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ');
    return /subscriber|구독자/i.test(t) && !!document.querySelector('.kt-remote-live');
  }
  function clean(){
    if(!isSubscriberGuest())return;
    var root=document.querySelector('.kt-remote-live');
    if(!root)return;
    root.querySelectorAll('.kt-viewer-quick-20261001,.kt-remote-guest-upper-quick-5555,.kt-sub-approved-quick-5555,.kgh-quick').forEach(function(x){try{x.remove();}catch(e){}});
    root.querySelectorAll('button,a,div,span').forEach(function(x){
      var s=(x.textContent||'').trim();
      if(s==='퇴장'||s==='되돌리기'||s==='보물상자'||s==='매치'){try{x.style.display='none';}catch(e){}}
    });
  }
  new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(clean,500);
  clean();
})();