/* K-Talk: 게스트폰에서 같은 9/13명 방이 위아래로 두 번 생기는 경우 하나만 유지. 다른 기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestOneRoomOnly20260918v2)return;
  window.__ktApprovedGuestOneRoomOnly20260918v2=true;
  window.__ktApprovedGuestOneRoomOnly20260918=true;

  function remove(el){try{if(el&&el.parentNode)el.parentNode.removeChild(el);}catch(e){}}

  function scoreRoot(root){
    var score=0;
    try{
      if(root.querySelector('.kt-approved-guest-grid'))score+=100;
      if(root.querySelector('.kt-approved-guest-cell.host video'))score+=35;
      if(root.querySelector('.kt-approved-guest-cell.self video'))score+=35;
      if(root.querySelector('#ktRemoteLiveVideo'))score+=10;
      if(root.querySelector('.kt-remote-top'))score+=5;
      var r=root.getBoundingClientRect();
      if(r.width>0&&r.height>0)score+=5;
    }catch(e){}
    return score;
  }

  function keepOne(list,prefer){
    list=[].slice.call(list||[]);
    if(list.length<=1)return list[0]||null;
    var keep=(prefer&&list.find(prefer))||list[0];
    list.forEach(function(el){if(el!==keep)remove(el);});
    return keep;
  }

  function cleanApprovedRoot(root){
    if(!root)return;

    root.classList.add('kt-approved-guest-room');
    root.classList.remove('kt-prejoin-room-view');

    /* 승인된 게스트 방이 생긴 뒤 남아 있는 승인 전 방 묶음만 제거 */
    root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(remove);

    /* 승인 방 묶음은 LED/통계/격자 각각 하나만 유지 */
    keepOne(root.querySelectorAll('.kt-approved-guest-grid'),function(g){
      return !!(g.querySelector('.kt-approved-guest-cell.host video')&&g.querySelector('.kt-approved-guest-cell.self video'));
    });
    keepOne(root.querySelectorAll('.kt-approved-guest-led'));
    keepOne(root.querySelectorAll('.kt-approved-guest-stats'));
  }

  function cleanPrejoinRoot(root){
    if(!root)return;
    if(root.querySelectorAll('.kt-prejoin-room-grid').length>1){
      keepOne(root.querySelectorAll('.kt-prejoin-room-grid'));
      keepOne(root.querySelectorAll('.kt-prejoin-room-led'));
      keepOne(root.querySelectorAll('.kt-prejoin-room-stats'));
    }
  }

  function run(){
    try{
      /* #screen 안팎 모두 확인: 게스트 화면이 두 컨테이너로 생기는 경우까지 정리 */
      var roots=[].slice.call(document.querySelectorAll('.kt-remote-live'));
      var approvedRoots=roots.filter(function(r){
        return !!r.querySelector('.kt-approved-guest-grid');
      });

      if(approvedRoots.length){
        var keep=approvedRoots.slice().sort(function(a,b){return scoreRoot(b)-scoreRoot(a);})[0];

        /* 승인된 게스트 화면에서는 승인 전 방 조각이 어디에 남아 있어도 제거 */
        document.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(remove);

        /* 같은 remote-live 방이 위/아래로 하나 더 생겼으면 정상 방 하나만 유지 */
        roots.forEach(function(r){
          if(r===keep)return;
          if(r.querySelector('.kt-approved-guest-grid,.kt-prejoin-room-grid,.kt-approved-guest-led,.kt-prejoin-room-led'))remove(r);
        });

        cleanApprovedRoot(keep);

        /* 정상 방 밖에 남은 승인방 조각도 제거 */
        document.querySelectorAll('.kt-approved-guest-led,.kt-approved-guest-stats,.kt-approved-guest-grid').forEach(function(el){
          if(!keep.contains(el))remove(el);
        });

        /* 같은 정상 방 안에서 재생성되는 중복도 다시 하나만 유지 */
        cleanApprovedRoot(keep);
        return;
      }

      /* 승인 전에는 기존 동작 그대로, 같은 묶음이 중복된 경우만 정리 */
      roots.forEach(cleanPrejoinRoot);
    }catch(e){}
  }

  run();
  [0,20,50,100,180,300,500,800,1200,1800,2600,4000].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,120);
  try{
    new MutationObserver(function(){setTimeout(run,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();