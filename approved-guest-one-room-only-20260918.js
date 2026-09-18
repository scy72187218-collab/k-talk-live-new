/* K-Talk: 게스트폰에서 같은 9/13명 방이 위아래로 두 번 생기는 경우 하나만 유지. 다른 기능 변경 없음. */
(function(){
  if(window.__ktApprovedGuestOneRoomOnly20260918)return;
  window.__ktApprovedGuestOneRoomOnly20260918=true;

  function remove(el){try{if(el&&el.parentNode)el.parentNode.removeChild(el);}catch(e){}}

  function scoreRoot(root){
    var score=0;
    try{
      if(root.querySelector('.kt-approved-guest-grid'))score+=100;
      if(root.querySelector('.kt-approved-guest-cell.host video'))score+=20;
      if(root.querySelector('.kt-approved-guest-cell.self video'))score+=20;
      if(root.querySelector('#ktRemoteLiveVideo'))score+=10;
      if(root.querySelector('.kt-remote-top'))score+=5;
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

  function cleanRoot(root){
    if(!root)return;
    var approved=[].slice.call(root.querySelectorAll('.kt-approved-guest-grid'));
    var prejoin=[].slice.call(root.querySelectorAll('.kt-prejoin-room-grid'));

    if(approved.length){
      root.classList.add('kt-approved-guest-room');
      root.classList.remove('kt-prejoin-room-view');

      /* 승인 후에는 승인 전 방 묶음을 전부 제거 */
      root.querySelectorAll('.kt-prejoin-room-led,.kt-prejoin-room-stats,.kt-prejoin-room-grid').forEach(remove);

      /* 승인 방 묶음은 각각 하나만 유지 */
      keepOne(root.querySelectorAll('.kt-approved-guest-grid'),function(g){
        return !!(g.querySelector('.kt-approved-guest-cell.host video')&&g.querySelector('.kt-approved-guest-cell.self video'));
      });
      keepOne(root.querySelectorAll('.kt-approved-guest-led'));
      keepOne(root.querySelectorAll('.kt-approved-guest-stats'));
    }else if(prejoin.length>1){
      /* 승인 전에도 9/13명 방은 하나만 유지 */
      keepOne(root.querySelectorAll('.kt-prejoin-room-grid'));
      keepOne(root.querySelectorAll('.kt-prejoin-room-led'));
      keepOne(root.querySelectorAll('.kt-prejoin-room-stats'));
    }
  }

  function run(){
    try{
      var screen=document.getElementById('screen')||document;
      var roots=[].slice.call(screen.querySelectorAll('.kt-remote-live'));

      /* 승인된 게스트 화면에서 remote-live 자체가 두 개 생긴 경우 정상 방 하나만 남김 */
      var approvedRoots=roots.filter(function(r){return !!r.querySelector('.kt-approved-guest-grid');});
      if(approvedRoots.length){
        var keep=approvedRoots.slice().sort(function(a,b){return scoreRoot(b)-scoreRoot(a);})[0];
        roots.forEach(function(r){if(r!==keep)remove(r);});
        cleanRoot(keep);
        return;
      }

      /* 승인 전에는 각 root 내부 중복만 정리 */
      roots.forEach(cleanRoot);
    }catch(e){}
  }

  run();
  [0,20,50,100,180,300,500,800,1200,1800,2600].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,120);
  try{
    new MutationObserver(function(){setTimeout(run,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
