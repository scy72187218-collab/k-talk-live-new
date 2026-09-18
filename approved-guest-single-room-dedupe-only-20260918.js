/* K-Talk: 승인된 게스트 화면에서 위/아래로 중복되는 방 묶음만 하나로 정리. 호스트/통신/버튼 변경 없음. */
(function(){
  if(window.__ktApprovedGuestSingleRoomDedupeOnly20260918)return;
  window.__ktApprovedGuestSingleRoomDedupeOnly20260918=true;

  function keepOne(root,selector,preferred){
    try{
      var list=[].slice.call(root.querySelectorAll(selector));
      if(list.length<=1)return list[0]||null;
      var keep=(preferred&&list.find(preferred))||list[0];
      list.forEach(function(el){if(el!==keep){try{el.remove();}catch(e){}}});
      return keep;
    }catch(e){return null;}
  }

  function clean(root){
    try{
      if(!root)return;
      var grids=[].slice.call(root.querySelectorAll('.kt-approved-guest-grid'));
      if(!grids.length)return;

      root.classList.add('kt-approved-guest-room');
      root.classList.remove('kt-prejoin-room-view');

      /* 승인 전 화면이 남아 있으면 그것만 제거 */
      root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(function(el){
        try{el.remove();}catch(e){}
      });

      /* 승인된 방은 LED/통계/격자 각각 하나만 유지 */
      keepOne(root,'.kt-approved-guest-led');
      keepOne(root,'.kt-approved-guest-stats');
      keepOne(root,'.kt-approved-guest-grid',function(g){
        return !!(g.querySelector('.kt-approved-guest-cell.host video')&&g.querySelector('.kt-approved-guest-cell.self video'));
      });

      /* 승인방 컨테이너가 안쪽에 중복 생성된 경우만 제거 */
      var nested=[].slice.call(root.querySelectorAll('.kt-remote-live.kt-approved-guest-room'));
      nested.forEach(function(el){if(el!==root){try{el.remove();}catch(e){}}});
    }catch(e){}
  }

  function run(){
    try{
      document.querySelectorAll('.kt-remote-live').forEach(clean);
    }catch(e){}
  }

  run();
  [20,50,100,180,300,500,800,1200,1800,2600].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,180);
  try{
    new MutationObserver(function(){setTimeout(run,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
