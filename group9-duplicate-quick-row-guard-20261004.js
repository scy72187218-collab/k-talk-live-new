/* 9명 호스트방 중복 상단 버튼줄 제거 — 2026-10-04
   유지: 되돌리기 / 보물상자 / 매치
   제거: 뒤늦게 다시 생기는 되돌리기 / 패키지 상자 / 매치
   다른 방/배치/버튼은 변경하지 않는다. */
(function(){
  if(window.__ktG9DuplicateQuickRowGuard20261004)return;
  window.__ktG9DuplicateQuickRowGuard20261004=true;

  function norm(el){return String(el&&el.textContent||'').replace(/\s+/g,'');}
  function isHost9(room){
    if(!room)return false;
    if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
    return String(room.getAttribute('data-kt-room')||'')==='9';
  }
  function rows(room){
    return [].slice.call(room.querySelectorAll('div,section,nav')).filter(function(el){
      var t=norm(el);
      if(t.indexOf('되돌리기')<0||t.indexOf('매치')<0)return false;
      var bs=el.querySelectorAll(':scope > button, :scope > * > button');
      return bs.length>=3&&bs.length<=6;
    });
  }
  function clean(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!isHost9(room))return;
    rows(room).forEach(function(r){
      var t=norm(r);
      /* 정확히 아래 중복줄만 삭제:
         되돌리기 + 패키지 상자 + 매치
         보물상자/일일랭킹/미션/시청자/게스트칸/하단도구는 건드리지 않는다. */
      if(t.indexOf('되돌리기')>-1&&t.indexOf('패키지상자')>-1&&t.indexOf('매치')>-1){
        try{r.remove();}catch(e){}
      }
    });
  }

  clean();
  [30,100,250,600,1200,2500].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9DuplicateQuickRowGuardTimer);
      window.__ktG9DuplicateQuickRowGuardTimer=setTimeout(clean,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
