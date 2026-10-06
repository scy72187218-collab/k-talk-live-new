/* 8888: 큰 카메라·마이크·영화/TV/유튜브 3칸 제거.
   1인방·9명방·13명방·구독자방·비밀방 공통.
   아래 작은 아이콘 줄과 다른 UI/기능은 건드리지 않음. */
(function(){
  function removeLargeMediaBar(){
    try{
      document.querySelectorAll('#screen .kt-host-admin-media-20260928').forEach(function(x){x.remove();});
    }catch(e){}
  }
  function ensureHidden(){
    if(document.getElementById('ktHostAdminBottomMediaRemoved8888'))return;
    var s=document.createElement('style');
    s.id='ktHostAdminBottomMediaRemoved8888';
    s.textContent='#screen .kt-host-admin-media-20260928{display:none!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  ensureHidden();
  removeLargeMediaBar();
  [80,220,500,900,1500,2400].forEach(function(ms){setTimeout(removeLargeMediaBar,ms);});
  try{
    new MutationObserver(function(){setTimeout(removeLargeMediaBar,0);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();