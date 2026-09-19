/* K-Talk 프로필 로컬 동영상 표시 복구 전용 (2026-09-19)
   - 프로필 안의 동영상 칸만 복구
   - 휴대폰 IndexedDB에 남아 있는 비초안 동영상을 모두 표시
   - 데이터 삭제/게시 상태 변경 없음
   - 방송/채팅/스위치/배치/잠금 변경 없음 */
(function(){
  if(window.__ktProfileLocalVideoVisibleRecover20260919)return;
  window.__ktProfileLocalVideoVisibleRecover20260919=true;

  var urls=[];
  function clearUrls(){
    urls.splice(0).forEach(function(u){try{URL.revokeObjectURL(u);}catch(e){}});
  }
  function renderLocalProfileVideos(){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return;
      var body=window.sheetBody||document.getElementById('sheetBody');
      if(!body)return;
      window.ktOpenVideoDB().then(function(db){
        try{
          var tx=db.transaction('videos','readonly');
          var req=tx.objectStore('videos').getAll();
          req.onsuccess=function(){
            clearUrls();
            var items=(req.result||[])
              .filter(function(v){return v&&v.blob&&v.draft!==true;})
              .sort(function(a,b){return (b.postedAt||b.createdAt||0)-(a.postedAt||a.createdAt||0);});
            var box=document.getElementById('ktProfilePostedVideos');
            if(!box){
              box=document.createElement('div');
              box.id='ktProfilePostedVideos';
              box.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:14px';
              body.appendChild(box);
            }
            box.innerHTML='';
            if(!items.length){
              box.innerHTML='<div style="grid-column:1/-1;padding:16px;text-align:center;color:#aaa">아직 올린 동영상이 없습니다.</div>';
            }else{
              items.forEach(function(v){
                var u='';
                try{u=URL.createObjectURL(v.blob);urls.push(u);}catch(e){}
                if(!u)return;
                var b=document.createElement('button');
                b.type='button';
                b.style.cssText='position:relative;aspect-ratio:9/16;border:0;padding:0;overflow:hidden;border-radius:8px;background:#111';
                b.innerHTML='<video muted playsinline preload="metadata" src="'+u+'" style="width:100%;height:100%;object-fit:cover"></video><span style="position:absolute;left:7px;bottom:6px;color:#fff">▶</span>';
                b.onclick=function(){if(typeof window.playStoredVideo==='function')window.playStoredVideo(v.id);};
                box.appendChild(b);
              });
            }
            try{db.close();}catch(e){}
          };
          req.onerror=function(){try{db.close();}catch(e){}};
        }catch(e){try{db.close();}catch(x){}}
      }).catch(function(){});
    }catch(e){}
  }

  var oldOpen=window.openProfileDirect;
  if(typeof oldOpen==='function'){
    var wrapped=function(){
      var r=oldOpen.apply(this,arguments);
      [120,260,520].forEach(function(ms){setTimeout(renderLocalProfileVideos,ms);});
      return r;
    };
    wrapped.__ktProfileLocalVideoVisibleRecover20260919=true;
    window.openProfileDirect=wrapped;
  }

  window.ktRecoverProfileLocalVideos=renderLocalProfileVideos;
})();