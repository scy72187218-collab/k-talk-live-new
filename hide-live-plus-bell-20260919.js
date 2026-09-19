/* K-Talk 동영상 LIVE 작은 표시: + 팔로우 / 종 알림만 숨김.
   다른 잠금, 방송방, 카메라, 채팅, 스위치, 프로필 기능은 변경하지 않음. */
(function(){
  if(window.__ktHideLivePlusBell20260919)return;
  window.__ktHideLivePlusBell20260919=true;

  function style(){
    if(document.getElementById('ktHideLivePlusBell20260919Style'))return;
    var s=document.createElement('style');
    s.id='ktHideLivePlusBell20260919Style';
    s.textContent='.kt-video-live-peek .ktvl-follow,.kt-video-live-peek .ktvl-bell{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function clean(root){
    root=root||document;
    try{
      root.querySelectorAll('.kt-video-live-peek .ktvl-follow,.kt-video-live-peek .ktvl-bell').forEach(function(el){
        if(el&&el.parentNode)el.parentNode.removeChild(el);
      });
    }catch(e){}
  }

  function install(){style();clean(document);}
  install();
  [100,300,700,1200,2200].forEach(function(ms){setTimeout(install,ms);});

  try{
    new MutationObserver(function(records){
      var needs=false;
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          if((n.matches&&n.matches('.ktvl-follow,.ktvl-bell,.kt-video-live-peek'))||
             (n.querySelector&&n.querySelector('.ktvl-follow,.ktvl-bell')))needs=true;
        });
      });
      if(needs)setTimeout(function(){clean(document);},0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();