/* K-Talk: 동영상 중복 게시 방지 + 삭제 즉시 반영. 다른 화면/기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoDuplicateDeleteFixInstalled)return;
  window.__ktVideoDuplicateDeleteFixInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var creatorBusy=false;
  var storedBusy={};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function currentUserId(){
    var id='guest';
    try{id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return String(id||'guest').slice(0,80);
  }

  function currentBlob(){
    try{if(window.ktCreatorBlob)return window.ktCreatorBlob;}catch(e){}
    try{return typeof ktCreatorBlob!=='undefined'?ktCreatorBlob:null;}catch(e){return null;}
  }

  async function fingerprint(blob){
    if(!blob)return '';
    try{
      var size=Number(blob.size||0),take=Math.min(65536,size);
      var first=take?new Uint8Array(await blob.slice(0,take).arrayBuffer()):new Uint8Array(0);
      var last=take?new Uint8Array(await blob.slice(Math.max(0,size-take),size).arrayBuffer()):new Uint8Array(0);
      var hash=2166136261>>>0;
      function mix(arr){for(var i=0;i<arr.length;i++){hash^=arr[i];hash=Math.imul(hash,16777619)>>>0;}}
      mix(first);mix(last);
      return [size,String(blob.type||''),hash.toString(16)].join('|');
    }catch(e){
      return [Number(blob.size||0),String(blob.type||'')].join('|');
    }
  }

  function recentGet(key){
    try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch(e){return null;}
  }
  function recentSet(key,val){try{sessionStorage.setItem(key,JSON.stringify(val));}catch(e){}}
  function isFresh(rec,fp,ms){return !!(rec&&rec.fp===fp&&Date.now()-Number(rec.at||0)<ms);}

  async function getItem(id){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return null;
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var rq=tx.objectStore('videos').get(id);
        rq.onsuccess=function(){var x=rq.result||null;try{db.close();}catch(e){}resolve(x);};
        rq.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  async function putItem(item){
    if(!item)return;
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
    }catch(e){}
  }

  async function allLocal(){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return [];
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var rq=tx.objectStore('videos').getAll();
        rq.onsuccess=function(){var a=rq.result||[];try{db.close();}catch(e){}resolve(a);};
        rq.onerror=function(){try{db.close();}catch(e){}resolve([]);};
      });
    }catch(e){return [];}
  }

  async function deleteLocal(item){
    if(!item)return;
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').delete(item.id);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
    }catch(e){}
  }

  async function rowByUrl(url){
    if(!url)return null;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,title,video_path,video_url&video_url=eq.'+encodeURIComponent(url)+'&limit=1',{headers:headers()});
      var a=r.ok?await r.json():[];
      return a&&a[0]?a[0]:null;
    }catch(e){return null;}
  }

  async function rowById(id){
    if(!id)return null;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,title,video_path,video_url&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers:headers()});
      var a=r.ok?await r.json():[];
      return a&&a[0]?a[0]:null;
    }catch(e){return null;}
  }

  async function removePublic(row,ownerId){
    if(!row||!row.id)return false;
    var owner=String(ownerId||row.author_id||currentUserId()||'guest');
    var ownerHeaders={'Prefer':'return=minimal','x-ktalk-author-id':owner};
    try{
      await fetch(SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(row.id),{method:'DELETE',headers:headers(ownerHeaders)});
    }catch(e){}
    try{
      var d=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(row.id),{method:'DELETE',headers:headers(ownerHeaders)});
      if(!d.ok)return false;
    }catch(e){return false;}
    if(row.video_path){
      try{
        await fetch(SB+'/storage/v1/object/ktalk-videos/'+String(row.video_path).split('/').map(encodeURIComponent).join('/'),{
          method:'DELETE',headers:headers({'x-ktalk-author-id':owner})
        });
      }catch(e){}
    }
    return true;
  }

  function clearFastFeedBy(row,item){
    try{
      var a=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(!Array.isArray(a))a=[];
      var rid=String((row&&row.id)||(item&&item.publicVideoId)||'');
      var url=String((row&&row.video_url)||(item&&item.publicVideoUrl)||'');
      a=a.filter(function(x){
        if(!x)return false;
        if(rid&&String(x.id||'')===rid)return false;
        if(url&&String(x.video_url||'')===url)return false;
        return true;
      });
      localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));
    }catch(e){try{localStorage.removeItem('ktalk_fast_feed');}catch(err){}}
  }

  function removeVisible(url){
    if(!url)return;
    try{
      document.querySelectorAll('.kt-public-video,.video-home video').forEach(function(v){
        var u=String(v.currentSrc||v.src||'');
        if(u===String(url)){
          var sec=v.closest('section');
          if(sec)sec.remove();
        }
      });
    }catch(e){}
  }

  /* 촬영 후 게시 버튼이 연속/중복으로 호출돼도 같은 영상은 한 번만 게시한다. */
  var oldCreatorPost=window.postCreatorRecording;
  if(typeof oldCreatorPost==='function'&&!oldCreatorPost.__ktNoDuplicate){
    var guardedCreatorPost=async function(){
      if(creatorBusy)return;
      creatorBusy=true;
      var blob=currentBlob(),fp='';
      try{
        fp=await fingerprint(blob);
        var rec=recentGet('kt_last_creator_public_post');
        if(fp&&isFresh(rec,fp,120000))return;
        var result=await oldCreatorPost.apply(this,arguments);
        if(fp)recentSet('kt_last_creator_public_post',{fp:fp,at:Date.now()});
        return result;
      }finally{
        creatorBusy=false;
      }
    };
    guardedCreatorPost.__ktNoDuplicate=true;
    window.postCreatorRecording=guardedCreatorPost;
  }

  /* 내 동영상의 '올리기'도 같은 항목이 동시에 두 번 올라가지 않게 한다. */
  var oldStoredPost=window.postStoredVideo;
  if(typeof oldStoredPost==='function'&&!oldStoredPost.__ktNoDuplicate){
    var guardedStoredPost=async function(id,btn){
      id=String(id||'');
      if(storedBusy[id])return;
      storedBusy[id]=true;
      try{
        var item=await getItem(id);
        if(item&&item.publicVideoId){
          if(btn){btn.disabled=true;btn.textContent='✓ 올리기 완료';btn.classList.add('done');}
          return;
        }
        var fp=item&&item.blob?await fingerprint(item.blob):'';
        var rec=recentGet('kt_last_stored_public_post');
        if(fp&&isFresh(rec,fp,120000)&&rec.id){
          item.posted=true;item.publicPosted=true;item.publicVideoId=rec.id;item.publicVideoUrl=rec.url||'';
          await putItem(item);
          if(btn){btn.disabled=true;btn.textContent='✓ 올리기 완료';btn.classList.add('done');}
          try{if(window.closeSheet)window.closeSheet();}catch(e){}
          return;
        }
        var r=await oldStoredPost.apply(this,arguments);
        var after=await getItem(id);
        if(fp&&after&&after.publicVideoId){
          recentSet('kt_last_stored_public_post',{fp:fp,at:Date.now(),id:after.publicVideoId,url:after.publicVideoUrl||''});
        }
        return r;
      }finally{
        delete storedBusy[id];
      }
    };
    guardedStoredPost.__ktNoDuplicate=true;
    window.postStoredVideo=guardedStoredPost;
  }

  /* 내 동영상에서 삭제하면 공개 목록/캐시도 바로 같이 지운다. */
  var oldDeleteStored=window.deleteStoredVideo;
  if(typeof oldDeleteStored==='function'&&!oldDeleteStored.__ktDeletePublicToo){
    var deleteStoredAndPublic=async function(id,btn,fromPlayer){
      var item=await getItem(id);
      var row=null;
      if(item&&item.publicVideoId)row=await rowById(item.publicVideoId);
      if(!row&&item&&item.publicVideoUrl)row=await rowByUrl(item.publicVideoUrl);
      if(row){
        clearFastFeedBy(row,item);
        removeVisible(row.video_url||'');
      }else if(item){
        clearFastFeedBy(null,item);
        removeVisible(item.publicVideoUrl||'');
      }

      var result=await oldDeleteStored.apply(this,arguments);

      if(row){
        var ok=await removePublic(row,row.author_id||currentUserId());
        if(!ok)alert('내 동영상은 삭제됐지만 공개 목록 삭제가 바로 되지 않았습니다. 다시 한 번 삭제해 주세요.');
      }
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
      return result;
    };
    deleteStoredAndPublic.__ktDeletePublicToo=true;
    window.deleteStoredVideo=deleteStoredAndPublic;
  }

  /* 홈 점 세 개 삭제: 예전에 guest로 올라간 내 영상도 이 기기의 원본과 맞으면 바로 삭제한다. */
  if(typeof window.ktPublicFeedDelete==='function'){
    window.ktPublicFeedDelete=async function(url,section){
      try{var pop=document.getElementById('ktPublicFeedMorePopover');if(pop)pop.remove();}catch(e){}
      if(!confirm('이 동영상을 삭제할까요?'))return;
      var row=await rowByUrl(url);
      if(!row){
        clearFastFeedBy(null,{publicVideoUrl:url});
        if(section&&section.parentNode)section.remove();
        return;
      }
      var locals=await allLocal();
      var local=locals.find(function(x){
        return x&&(
          String(x.publicVideoId||'')===String(row.id||'') ||
          String(x.publicVideoUrl||'')===String(url||'') ||
          (x.posted&&String(x.name||'')===String(row.title||''))
        );
      })||null;
      var mine=String(row.author_id||'')===currentUserId()||!!local;
      if(!mine){alert('내가 올린 동영상만 삭제할 수 있습니다.');return;}

      clearFastFeedBy(row,local);
      if(section&&section.parentNode)section.remove();
      removeVisible(url);

      var ok=await removePublic(row,row.author_id||currentUserId());
      if(local)await deleteLocal(local);
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
      if(ok)alert('✅ 동영상을 삭제했습니다.');
      else alert('동영상을 삭제하지 못했습니다.');
    };
  }
})();
