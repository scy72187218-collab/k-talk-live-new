/* K-Talk 동영상 방송자 표시: + 팔로우 / 종 버튼만 숨김.
   이름, 사진, LIVE, 영상, 다른 버튼/방은 변경하지 않음. */
(function(){
  if(window.__ktLivePeekHidePlusBell20260919)return;
  window.__ktLivePeekHidePlusBell20260919=true;

  function ensureStyle(){
    if(document.getElementById('ktLivePeekHidePlusBellStyle'))return;
    var s=document.createElement('style');
    s.id='ktLivePeekHidePlusBellStyle';
    s.textContent=
      '.kt-video-live-peek .ktvl-follow,'+
      '.kt-video-live-peek .ktvl-bell{display:none!important;visibility:hidden!important;pointer-events:none!important}'+
      '.kt-video-live-peek{height:38px!important;padding:4px!important;gap:4px!important;max-width:min(88vw,270px)!important;border:none!important;outline:none!important;box-shadow:none!important;background:rgba(0,0,0,.58)!important}'+
      '.kt-video-live-peek .ktvl-person{height:30px!important;gap:5px!important;border:none!important;outline:none!important;box-shadow:none!important;background:transparent!important}'+
      '.kt-video-live-peek .ktvl-avatar{width:28px!important;height:28px!important;flex:0 0 28px!important;font-size:15px!important}'+
      '.kt-video-live-peek .ktvl-copy b{font-size:9px!important}'+
      '.kt-video-live-peek .ktvl-copy small{font-size:8px!important;margin-top:1px!important}'+
      '.kt-video-live-peek .ktvl-live{padding:4px 5px!important;font-size:7px!important;border:none!important;outline:none!important;box-shadow:none!important}';
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

  ensureStyle();
  clean(document);

  try{
    new MutationObserver(function(records){
      var need=false;
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(n&&n.nodeType===1)need=true;
        });
      });
      if(need){ensureStyle();clean(document);}
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  [100,300,800,1500,3000].forEach(function(ms){
    setTimeout(function(){ensureStyle();clean(document);},ms);
  });
})();