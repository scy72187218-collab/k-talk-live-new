/* K-Talk 동영상 삭제 후 남은 공개 영상 자동 복구 */
(function(){
  if(window.__ktVideoDeleteRefresh20260920)return;
  window.__ktVideoDeleteRefresh20260920=true;

  function refresh(){
    try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
    setTimeout(function(){
      try{
        if(typeof window.ktShowSharedServerFeed==='function'){
          window.ktShowSharedServerFeed();
        }else if(typeof window.ktShowSharedServerFeed==='function'){
          window.ktShowSharedServerFeed();
        }else if(typeof window.ktForceHomeVideoRecovery==='function'){
          window.ktForceHomeVideoRecovery(true);
        }else if(typeof window.home==='function'){
          window.home();
        }
      }catch(e){}
    },120);
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button,[role="button"]'):null;
    if(!b)return;
    var t=String(b.textContent||'').replace(/\s+/g,'');
    if(/동영상삭제|영상삭제|삭제하기|삭제/.test(t)){
      /* 실제 삭제 처리 코드가 먼저 실행된 뒤 남은 목록을 다시 받는다. */
      setTimeout(refresh,350);
      setTimeout(refresh,900);
    }
  },false);

  window.ktRefreshVideosAfterDelete=refresh;
})();