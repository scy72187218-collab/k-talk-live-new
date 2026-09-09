/* K-Talk 홈/동영상 화면 점 세 개 메뉴: 삭제 / 임시 저장 / 친구에게 공유. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktPublicFeedThreeDotInstalled)return;
  window.__ktPublicFeedThreeDotInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';

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

  function closeMenu(){
    var p=document.getElementById('ktPublicFeedMorePopover');
    if(p)p.remove();
  }

  async function rowByUrl(url){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,video_path,video_url&video_url=eq.'+encodeURIComponent(url)+'&limit=1',{headers:headers()});
      var a=r.ok?await r.json():[];
      return a&&a[0]?a[0]:null;
    }catch(e){return null;}
  }

  async function allLocalVideos(){
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

  async function findLocal(row,url){
    var a=await allLocalVideos();
    return a.find(function(x){
      return x && ((row&&row.id&&String(x.publicVideoId||'')===String(row.id)) || String(x.publicVideoUrl||'')===String(url));
    })||null;
  }

  async function putLocal(item){
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
      return true;
    }catch(e){return false;}
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

  async function removePublic(row){
    if(!row||!row.id)throw new Error('not-found');
    var uid=currentUserId();
    if(String(row.author_id||'')!==uid)throw new Error('not-owner');

    try{
      await fetch(SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(row.id),{
        method:'DELETE',headers:headers({'Prefer':'return=minimal'})
      });
    }catch(e){}

    var del=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(row.id)+'&author_id=eq.'+encodeURIComponent(uid),{
      method:'DELETE',headers:headers({'Prefer':'return=minimal'})
    });
    if(!del.ok)throw new Error('delete-failed');

    var check=await rowByUrl(row.video_url||'');
    if(check)throw new Error('delete-failed');

    if(row.video_path){
      try{
        await fetch(SB+'/storage/v1/object/ktalk-videos/'+String(row.video_path).split('/').map(encodeURIComponent).join('/'),{
          method:'DELETE',headers:headers()
        });
      }catch(e){}
    }
  }

  function clearFastFeed(){try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}}

  window.ktPublicFeedDelete=async function(url,section){
    closeMenu();
    if(!confirm('이 동영상을 삭제할까요?'))return;
    var row=await rowByUrl(url);
    if(!row){alert('공개 동영상을 찾지 못했습니다.');return;}
    if(String(row.author_id||'')!==currentUserId()){alert('내가 올린 동영상만 삭제할 수 있습니다.');return;}
    var local=await findLocal(row,url);
    try{
      await removePublic(row);
      await deleteLocal(local);
      clearFastFeed();
      if(section&&section.parentNode)section.remove();
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
      alert('✅ 동영상을 삭제했습니다.');
    }catch(e){
      alert('동영상을 삭제하지 못했습니다.');
    }
  };

  window.ktPublicFeedDraft=async function(url,section){
    closeMenu();
    var row=await rowByUrl(url);
    if(!row){alert('공개 동영상을 찾지 못했습니다.');return;}
    if(String(row.author_id||'')!==currentUserId()){alert('내가 올린 동영상만 임시 저장할 수 있습니다.');return;}
    var local=await findLocal(row,url);
    if(!local||!local.blob){alert('이 기기에 원본 동영상이 없어 임시 저장으로 옮길 수 없습니다.');return;}
    try{
      await removePublic(row);
      local.draft=true;
      local.posted=false;
      local.publicPosted=false;
      local.publicVideoId='';
      local.publicVideoUrl='';
      local.draftAt=Date.now();
      await putLocal(local);
      clearFastFeed();
      if(section&&section.parentNode)section.remove();
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
      alert('✅ 임시 저장으로 옮겼습니다.');
    }catch(e){
      alert('임시 저장으로 옮기지 못했습니다.');
    }
  };

  window.ktPublicFeedShare=async function(url){
    closeMenu();
    try{
      if(typeof window.ktPublicShare==='function'){
        await window.ktPublicShare(url);
        return;
      }
      if(navigator.share){await navigator.share({title:'K-Talk 동영상',url:url});return;}
      if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('친구에게 보낼 동영상 주소를 복사했습니다.');}
    }catch(e){}
  };

  window.ktOpenPublicFeedMore=function(url,anchor,section){
    closeMenu();
    var pop=document.createElement('div');
    pop.id='ktPublicFeedMorePopover';

    function add(label,cls,fn){
      var b=document.createElement('button');
      b.type='button';
      if(cls)b.className=cls;
      b.textContent=label;
      b.onclick=function(e){e.preventDefault();e.stopPropagation();fn();};
      pop.appendChild(b);
    }

    add('🗑  동영상 삭제하기','danger',function(){window.ktPublicFeedDelete(url,section);});
    add('📥  임시 저장','',function(){window.ktPublicFeedDraft(url,section);});
    add('↗  친구한테 공유','',function(){window.ktPublicFeedShare(url);});
    document.body.appendChild(pop);

    try{
      var r=anchor.getBoundingClientRect();
      var w=Math.min(250,Math.max(190,window.innerWidth-24));
      pop.style.width=w+'px';
      pop.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.right-w))+'px';
      pop.style.top=Math.min(window.innerHeight-170,r.bottom+6)+'px';
    }catch(e){}
  };

  function addDots(){
    document.querySelectorAll('.kt-public-video,.video-home video').forEach(function(v){
      var section=v.closest('section');
      if(!section||section.querySelector('.kt-public-feed-more'))return;
      var url=String(v.currentSrc||v.src||'');
      if(!url)return;
      if(getComputedStyle(section).position==='static')section.style.position='relative';
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-public-feed-more';
      b.setAttribute('aria-label','동영상 더보기');
      b.textContent='⋮';
      b.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        window.ktOpenPublicFeedMore(url,b,section);
      };
      section.appendChild(b);
    });
  }

  document.addEventListener('click',function(e){
    var p=document.getElementById('ktPublicFeedMorePopover');
    if(!p)return;
    if(p.contains(e.target)||e.target.closest('.kt-public-feed-more'))return;
    closeMenu();
  },true);

  var st=document.createElement('style');
  st.id='ktPublicFeedThreeDotStyle';
  st.textContent=''
    +'.kt-public-feed-more{position:absolute!important;top:12px!important;right:12px!important;z-index:80!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(0,0,0,.55)!important;color:#fff!important;font-size:30px!important;font-weight:950!important;line-height:1!important;display:grid!important;place-items:center!important;padding:0 0 5px!important;text-shadow:0 1px 4px #000!important;touch-action:manipulation!important;box-shadow:0 2px 12px rgba(0,0,0,.28)!important}'
    +'#ktPublicFeedMorePopover{position:fixed!important;z-index:100001!important;background:#17171b!important;color:#fff!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:16px!important;padding:7px!important;box-shadow:0 12px 36px rgba(0,0,0,.5)!important}'
    +'#ktPublicFeedMorePopover button{width:100%!important;height:48px!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#fff!important;display:flex!important;align-items:center!important;padding:0 12px!important;text-align:left!important;font-size:15px!important;font-weight:850!important;touch-action:manipulation!important}'
    +'#ktPublicFeedMorePopover button:active{background:rgba(255,255,255,.1)!important}#ktPublicFeedMorePopover button.danger{color:#ff7c8f!important}';
  document.head.appendChild(st);

  var queued=false;
  function schedule(){
    if(queued)return;queued=true;
    setTimeout(function(){queued=false;addDots();},30);
  }
  var root=document.getElementById('screen')||document.body;
  try{new MutationObserver(schedule).observe(root,{childList:true,subtree:true});}catch(e){}
  setTimeout(addDots,60);
  setTimeout(addDots,300);
})();
