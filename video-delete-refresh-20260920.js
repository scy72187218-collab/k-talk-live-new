/* K-Talk 동영상 삭제 전용
   - 내 동영상 삭제를 확실히 처리
   - 공개로 올린 영상이면 공개 목록에서도 삭제 시도
   - 첫 동영상 빠른 표시/통신/방송 화면은 변경하지 않음 */
(function(){
  if(window.__ktVideoDeleteRefresh20260920)return;
  window.__ktVideoDeleteRefresh20260920=true;

  function refresh(){
    setTimeout(function(){
      try{
        if(typeof window.ktShowSharedServerFeed==='function')window.ktShowSharedServerFeed();
        else if(typeof window.home==='function')window.home();
      }catch(e){}
    },180);
  }

  async function localItem(id){
    try{
      var db=await ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').get(id);
        req.onsuccess=function(){var x=req.result||null;try{db.close();}catch(e){}resolve(x);};
        req.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  function install(){
    var old=window.deleteStoredVideo;
    if(typeof old!=='function'||old.__ktDeletePublicWrapped)return;

    var wrapped=async function(id,btn,fromPlayer){
      var item=await localItem(id);
      var publicId=String(item&&item.publicVideoId||'').trim();
      var publicUrl=String(item&&item.publicVideoUrl||'').trim();

      if(publicId||publicUrl){
        try{
          if(typeof window.ktDeletePublicVideo==='function'){
            await window.ktDeletePublicVideo({
              id:publicId,
              publicVideoId:publicId,
              video_url:publicUrl,
              publicVideoUrl:publicUrl
            });
          }else if(typeof window.ktRememberDeletedPublicVideo==='function'){
            window.ktRememberDeletedPublicVideo(publicId,publicUrl);
          }
        }catch(e){
          try{
            if(typeof window.ktRememberDeletedPublicVideo==='function'){
              window.ktRememberDeletedPublicVideo(publicId,publicUrl);
            }
          }catch(x){}
        }
      }

      var result=await old.call(this,id,btn,fromPlayer);
      refresh();
      return result;
    };
    wrapped.__ktDeletePublicWrapped=true;
    wrapped.__ktDeletePublicOriginal=old;
    window.deleteStoredVideo=wrapped;
  }

  install();
  setTimeout(install,60);
  setTimeout(install,300);
  window.addEventListener('pageshow',function(){setTimeout(install,40);});
  window.ktRefreshVideosAfterDelete=refresh;
})();