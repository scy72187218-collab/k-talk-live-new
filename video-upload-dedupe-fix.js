/* K-Talk: 동영상 한 번 올리면 한 개만 등록되게 중복 업로드를 막는다. 다른 화면/기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoUploadDedupeInstalled)return;
  window.__ktVideoUploadDedupeInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var creatorBusy=false;
  var storedBusy={};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function me(){
    var name='K-Talk',id='guest';
    try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return {name:String(name),id:String(id)};
  }
  function currentTitle(){
    try{return window.ktImportedVideoName||ktImportedVideoName||('K-Talk 동영상 '+new Date().toLocaleString('ko-KR'));}catch(e){return 'K-Talk 동영상';}
  }
  async function allLocal(){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return [];
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly'),rq=tx.objectStore('videos').getAll();
        rq.onsuccess=function(){var a=rq.result||[];try{db.close();}catch(e){}resolve(a);};
        rq.onerror=function(){try{db.close();}catch(e){}resolve([]);};
      });
    }catch(e){return [];}
  }
  async function localById(id){
    var a=await allLocal();
    return a.find(function(v){return v&&String(v.id)===String(id);})||null;
  }
  async function newestLocal(title,after){
    var a=(await allLocal()).filter(function(v){
      if(!v||v.draft)return false;
      if(after&&Number(v.createdAt||0)<after-5000)return false;
      if(title&&String(v.name||'')!==String(title))return false;
      return true;
    }).sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
    if(a[0])return a[0];
    var b=(await allLocal()).filter(function(v){return v&&!v.draft;}).sort(function(a,b){return Number(b.createdAt||0)-Number(a.createdAt||0);});
    return b[0]||null;
  }
  async function putLocal(item){
    if(!item)return;
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
    }catch(e){}
  }
  async function findRemote(title,when){
    var a=me();
    try{
      var url=SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,created_at&author_id=eq.'+encodeURIComponent(a.id)+'&title=eq.'+encodeURIComponent(title||'K-Talk 동영상')+'&order=created_at.desc&limit=5';
      var r=await fetch(url,{headers:headers()});
      var rows=r.ok?await r.json():[];
      if(!rows.length)return null;
      if(!when)return rows[0];
      var best=rows.find(function(x){
        var t=Date.parse(x.created_at||'')||0;
        return t&&Math.abs(t-when)<90000;
      });
      return best||rows[0];
    }catch(e){return null;}
  }
  async function linkLocalToRemote(item,row){
    if(!item||!row||!row.id)return false;
    item.posted=true;
    item.postedAt=item.postedAt||Date.now();
    item.publicPosted=true;
    item.publicVideoId=String(row.id);
    item.publicVideoUrl=String(row.video_url||'');
    await putLocal(item);
    return true;
  }
  function finishButton(btn){
    if(!btn)return;
    try{btn.disabled=true;btn.textContent='✓ 올리기 완료';btn.classList.add('done');}catch(e){}
  }

  /* 공개 피드에 이미 생긴 즉시 중복은 화면에서 한 개만 보이게 정리한다. 원본 데이터는 삭제하지 않는다. */
  function dedupeRows(rows){
    var kept=[];
    (rows||[]).forEach(function(x){
      var xt=Date.parse(x.created_at||'')||0;
      var same=kept.some(function(y){
        if(String(y.author_name||'')!==String(x.author_name||''))return false;
        if(String(y.title||'')!==String(x.title||''))return false;
        var yt=Date.parse(y.created_at||'')||0;
        return xt&&yt&&Math.abs(yt-xt)<=15000;
      });
      if(!same)kept.push(x);
    });
    return kept;
  }
  async function refreshFastFeed(){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{headers:headers()});
      if(!r.ok)return;
      var rows=dedupeRows(await r.json());
      localStorage.setItem('ktalk_fast_feed',JSON.stringify(rows));
    }catch(e){}
  }

  /* 촬영/휴대폰 영상의 게시 버튼이 한 번 눌렸는데 이벤트가 두 번 들어와도 실제 등록은 한 번만 실행한다. */
  var oldCreator=window.postCreatorRecording;
  if(typeof oldCreator==='function'&&!oldCreator.__ktDedupeGuard){
    var creatorWrap=async function(){
      if(creatorBusy)return;
      creatorBusy=true;
      var started=Date.now(),title=currentTitle();
      try{
        var result=await oldCreator.apply(this,arguments);
        var item=await newestLocal(title,started);
        if(item&&!item.publicVideoId){
          var row=await findRemote(item.name||title,Number(item.postedAt||item.createdAt||Date.now()));
          if(row)await linkLocalToRemote(item,row);
        }
        await refreshFastFeed();
        return result;
      }finally{
        setTimeout(function(){creatorBusy=false;},1200);
      }
    };
    creatorWrap.__ktDedupeGuard=true;
    window.postCreatorRecording=creatorWrap;
  }

  /* 내 동영상의 '올리기'도 같은 영상이 이미 공개되어 있으면 다시 업로드하지 않는다. */
  var oldStored=window.postStoredVideo;
  if(typeof oldStored==='function'&&!oldStored.__ktDedupeGuard){
    var storedWrap=async function(id,btn){
      id=String(id||'');
      if(!id)return;
      if(storedBusy[id])return;
      storedBusy[id]=true;
      try{
        var item=await localById(id);
        if(item&&item.publicVideoId){finishButton(btn);return;}
        if(item&&item.posted){
          var existing=await findRemote(item.name||'K-Talk 동영상',Number(item.postedAt||item.createdAt||Date.now()));
          if(existing){
            await linkLocalToRemote(item,existing);
            finishButton(btn);
            await refreshFastFeed();
            return;
          }
        }
        var result=await oldStored.apply(this,arguments);
        var updated=await localById(id);
        if(updated&&!updated.publicVideoId){
          var row=await findRemote(updated.name||'K-Talk 동영상',Number(updated.postedAt||updated.createdAt||Date.now()));
          if(row)await linkLocalToRemote(updated,row);
        }
        await refreshFastFeed();
        return result;
      }finally{
        setTimeout(function(){delete storedBusy[id];},1200);
      }
    };
    storedWrap.__ktDedupeGuard=true;
    window.postStoredVideo=storedWrap;
  }

  /* 홈/동영상 목록을 열기 전에 중복 표시를 한 번 정리한다. */
  var oldHome=window.home;
  if(typeof oldHome==='function'&&!oldHome.__ktDedupeFeed){
    var homeWrap=async function(){await refreshFastFeed();return oldHome.apply(this,arguments);};
    homeWrap.__ktDedupeFeed=true;
    window.home=homeWrap;
  }
  var oldMedia=window.media;
  if(typeof oldMedia==='function'&&!oldMedia.__ktDedupeFeed){
    var mediaWrap=async function(){await refreshFastFeed();return oldMedia.apply(this,arguments);};
    mediaWrap.__ktDedupeFeed=true;
    window.media=mediaWrap;
  }

  refreshFastFeed();
})();
