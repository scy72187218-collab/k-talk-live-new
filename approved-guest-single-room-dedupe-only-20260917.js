/* K-Talk: 승인된 게스트 방에서 중복으로 생긴 LED/통계/격자 묶음만 하나로 정리. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestSingleRoomDedupeOnly20260917)return;
  window.__ktApprovedGuestSingleRoomDedupeOnly20260917=true;

  function dedupe(root){
    try{
      if(!root||!root.classList||!root.classList.contains('kt-approved-guest-room'))return;

      ['.kt-approved-guest-led','.kt-approved-guest-stats','.kt-approved-guest-grid'].forEach(function(sel){
        var list=[].slice.call(root.querySelectorAll(':scope > '+sel));
        if(list.length<=1)return;
        list.slice(1).forEach(function(el){try{el.remove();}catch(e){}});
      });

      /* 혹시 중첩된 승인방 컨테이너가 생겨도 바깥쪽 하나만 유지 */
      var nested=[].slice.call(root.querySelectorAll(':scope > .kt-remote-live.kt-approved-guest-room'));
      nested.forEach(function(el){try{el.remove();}catch(e){}});
    }catch(e){}
  }

  function run(){
    try{
      document.querySelectorAll('.kt-remote-live.kt-approved-guest-room').forEach(dedupe);
    }catch(e){}
  }

  run();
  [50,120,250,500,900,1500].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,500);
  try{
    new MutationObserver(function(){setTimeout(run,20);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
