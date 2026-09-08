/* K-Talk: 내 동영상 재생 화면 삭제 보강 + 길게 누르기 메뉴. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktMyVideoDeleteLongPress20260908)return;
  window.__ktMyVideoDeleteLongPress20260908=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var longTimer=0,downX=0,downY=0,longFired=false,suppressUntil=0;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function getDb(){
    try{
      if(typeof window.ktOpenVideoDB==='function')return window.ktOpenVideoDB();
      if(typeof ktOpenVideoDB==='function')return ktOpenVideoDB();
    }catch(e){}
    return Promise.reject(new Error('video db unavailable'));
  }

  async function getItem(id){
    try{
      var db=await getDb();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').get(id);
        req.onsuccess=function(){var item=req.result||null;try{db.close();}catch(e){}resolve(item);};
        req.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  async function deleteLocal(id){
    try{
      var db=await getDb();
      await new Promise(function(resolve,reject){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').delete(id);
        tx.oncomplete=resolve;
        tx.onerror=function(){reject(tx.error);};
        tx.onabort=function(){reject(tx.error);};
      });
      try{db.close();}catch(e){}
      return true;
    }catch(e){return false;}
  }

  async function deletePublicIfNeeded(item){
    var videoId=item&&item.publicVideoId?String(item.publicVideoId):'';
    if(!videoId)return true;
    try{
      var q=await fetch(SB+'/rest/v1/ktalk_videos?select=author_id,video_path&id=eq.'+encodeURIComponent(videoId)+'&limit=1',{headers:headers()});
      var rows=q.ok?await q.json():[];
      var row=rows&&rows[0]?rows[0]:null;
      if(!row)return true;
      var owner=String(row.author_id||'');
      var path=String(row.video_path||'');
      if(!owner)return false;
      var ownerHeaders={'x-ktalk-author-id':owner};
      try{
        await fetch(SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(videoId),{method:'DELETE',headers:headers(Object.assign({'Prefer':'return=minimal'},ownerHeaders))});
      }catch(e){}
      var r=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(videoId)+'&author_id=eq.'+encodeURIComponent(owner),{method:'DELETE',headers:headers(Object.assign({'Prefer':'return=representation'},ownerHeaders))});
      if(!r.ok)return false;
      var deleted=[];try{deleted=await r.json();}catch(e){}
      if(!deleted||!deleted.length)return false;
      if(path){
        try{
          await fetch(SB+'/storage/v1/object/ktalk-videos/'+path.split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:headers(ownerHeaders)});
        }catch(e){}
      }
      try{
        var cache=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
        if(Array.isArray(cache))localStorage.setItem('ktalk_fast_feed',JSON.stringify(cache.filter(function(x){return String(x.id)!==videoId;})));
      }catch(e){}
      return true;
    }catch(e){return false;}
  }

  async function deleteStoredVideoNow(id,fromPlayer){
    var item=await getItem(id);
    if(!item){alert('동영상을 찾지 못했습니다.');return;}
    if(!confirm('이 동영상을 삭제할까요?'))return;

    var publicOk=await deletePublicIfNeeded(item);
    var localOk=await deleteLocal(id);
    if(!localOk){alert('동영상 삭제가 되지 않았습니다.');return;}

    try{if(window.ktStopVideoAudioOnLeave)window.ktStopVideoAudioOnLeave();}catch(e){}
    try{if(fromPlayer&&window.closeSheet)window.closeSheet();}catch(e){}
    try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
    try{window.__ktCurrentStoredVideoId='';}catch(e){}
    alert(publicOk?'동영상을 삭제했습니다.':'내 동영상은 삭제했습니다. 공개 목록은 다시 확인해 주세요.');
  }

  /* 기존 점 3개 메뉴의 삭제 버튼도 이 삭제 로직을 사용한다. */
  window.deleteStoredVideo=function(id,btn,fromPlayer){
    return deleteStoredVideoNow(id,!!fromPlayer);
  };

  /* 재생 중인 동영상 ID를 기억한다. */
  var oldPlay=window.playStoredVideo;
  if(typeof oldPlay==='function'&&!oldPlay.__ktDeleteLongWrapped){
    var wrappedPlay=function(id){
      window.__ktCurrentStoredVideoId=String(id||'');
      var out=oldPlay.apply(this,arguments);
      setTimeout(ensurePlayerMore,40);
      setTimeout(ensurePlayerMore,180);
      return out;
    };
    wrappedPlay.__ktDeleteLongWrapped=true;
    window.playStoredVideo=wrappedPlay;
  }

  function ensurePlayerMore(){
    try{
      var player=document.getElementById('ktLibraryPlayer');
      var id=String(window.__ktCurrentStoredVideoId||'');
      if(!player||!id||typeof window.ktOpenMyVideoMore!=='function')return;
      var host=player.closest('.kt-myvideo-player')||player.parentElement;
      if(!host)return;
      host.classList.add('kt-myvideo-player');
      if(host.querySelector('.kt-myvideo-more'))return;
      var b=document.createElement('button');
      b.type='button';b.className='kt-myvideo-more';b.textContent='⋮';b.setAttribute('aria-label','동영상 더보기');
      b.onclick=function(ev){ev.preventDefault();ev.stopPropagation();window.ktOpenMyVideoMore(id,b,true);};
      host.appendChild(b);
    }catch(e){}
  }

  function targetInfo(target){
    try{
      var row=target.closest&&target.closest('.kt-myvideo-row[data-video-id]');
      if(row)return {id:String(row.getAttribute('data-video-id')||''),host:row,fromPlayer:false};
      var player=target.closest&&target.closest('#ktLibraryPlayer,.kt-myvideo-player');
      if(player){
        var id=String(window.__ktCurrentStoredVideoId||'');
        if(id)return {id:id,host:(player.id==='ktLibraryPlayer'?(player.parentElement||player):player),fromPlayer:true};
      }
    }catch(e){}
    return null;
  }

  function openLongMenu(info){
    if(!info||!info.id||typeof window.ktOpenMyVideoMore!=='function')return;
    longFired=true;suppressUntil=Date.now()+900;
    try{window.ktOpenMyVideoMore(info.id,info.host,info.fromPlayer);}catch(e){}
  }

  document.addEventListener('pointerdown',function(ev){
    var info=targetInfo(ev.target);if(!info)return;
    clearTimeout(longTimer);longFired=false;downX=ev.clientX||0;downY=ev.clientY||0;
    longTimer=setTimeout(function(){openLongMenu(info);},650);
  },true);
  document.addEventListener('pointermove',function(ev){
    if(!longTimer)return;
    if(Math.abs((ev.clientX||0)-downX)>14||Math.abs((ev.clientY||0)-downY)>14){clearTimeout(longTimer);longTimer=0;}
  },true);
  ['pointerup','pointercancel'].forEach(function(name){document.addEventListener(name,function(){clearTimeout(longTimer);longTimer=0;},true);});

  document.addEventListener('contextmenu',function(ev){
    var info=targetInfo(ev.target);if(!info)return;
    ev.preventDefault();ev.stopPropagation();openLongMenu(info);
  },true);

  document.addEventListener('click',function(ev){
    if(Date.now()<suppressUntil&&targetInfo(ev.target)){ev.preventDefault();ev.stopImmediatePropagation();}
  },true);

  try{new MutationObserver(function(){ensurePlayerMore();}).observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(ensurePlayerMore,0);
})();
