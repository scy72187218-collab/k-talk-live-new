/* K-Talk: 승인된 게스트 방에서 중복으로 생긴 LED/통계/격자 묶음만 하나로 정리. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestSingleRoomDedupeOnly20260917)return;
  window.__ktApprovedGuestSingleRoomDedupeOnly20260917=true;

  function keepBest(root,selector){
    try{
      var list=[].slice.call(root.querySelectorAll(selector));
      if(list.length<=1)return;
      var keep=null;
      if(selector==='.kt-approved-guest-grid'){
        keep=list.find(function(g){
          return !!(g.querySelector('.kt-approved-guest-cell.host video')&&g.querySelector('.kt-approved-guest-cell.self video'));
        })||list[0];
      }else{
        keep=list[0];
      }
      list.forEach(function(el){if(el!==keep){try{el.remove();}catch(e){}}});
    }catch(e){}
  }

  function dedupe(root){
    try{
      if(!root||!root.classList||!root.classList.contains('kt-approved-guest-room'))return;

      /* 직접 자식/중첩 여부와 관계없이 승인방 안의 각 묶음은 하나만 유지 */
      keepBest(root,'.kt-approved-guest-led');
      keepBest(root,'.kt-approved-guest-stats');
      keepBest(root,'.kt-approved-guest-grid');

      /* 같은 승인방 컨테이너가 안쪽에 또 생긴 경우만 제거 */
      var nested=[].slice.call(root.querySelectorAll('.kt-remote-live.kt-approved-guest-room'));
      nested.forEach(function(el){if(el!==root){try{el.remove();}catch(e){}}});
    }catch(e){}
  }

  function run(){
    try{
      document.querySelectorAll('.kt-remote-live.kt-approved-guest-room').forEach(dedupe);
    }catch(e){}
  }

  run();
  [20,50,100,180,300,500,800,1200,1800].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,250);
  try{
    new MutationObserver(function(){setTimeout(run,10);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
