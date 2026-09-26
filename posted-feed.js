/* K-Talk public video feed: simple profile + public feed posting behavior. */
(function(){
  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  var FIRST_FAST_FEED=[{"id":"8e1eac73-f54f-4023-93cc-daca7294bd6f","author_name":"K-Talk","title":"4a71d443-4b27-409a-bcce-da3723c44a12-1_all_16890.mp4","video_url":"https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1789742631992-yen8is.mp4","created_at":"2026-09-18T14:44:17.716584+00:00","likes":0}];
  function firstFastUrl(){
    /* First paint must never be replaced by an older phone cache. */
    return FIRST_FAST_FEED[0].video_url;
  }
  function warmFirstVideo(){
    try{
      /* index.html already owns the ONE preload and the real visible video.
         Do not add another preload or hidden warm-up request here: on Android
         duplicate media requests can compete with the visible first frame. */
      var visible=document.getElementById('ktPublicFirstPaintVideo')||window.__ktPublicFirstPaintVideo20260924||null;
      if(!visible)return;
      visible.muted=true;
      visible.defaultMuted=true;
      visible.playsInline=true;
      visible.preload='auto';
      visible.setAttribute('playsinline','');
      visible.setAttribute('webkit-playsinline','');
      visible.setAttribute('fetchpriority','high');
      try{var p=visible.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }catch(e){}
  }
  warmFirstVideo();
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function blobNow(){try{if(window.ktCreatorBlob)return window.ktCreatorBlob;}catch(e){}try{return typeof ktCreatorBlob!=='undefined'?ktCreatorBlob:null;}catch(e){return null;}}
  function titleNow(){try{return window.ktImportedVideoName||ktImportedVideoName||('K-Talk 동영상 '+new Date().toLocaleString('ko-KR'));}catch(e){return 'K-Talk 동영상';}}
  function who(){var name='K-Talk',id='guest';try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}return {name:String(name).slice(0,80),id:String(id).slice(0,80)};}

  function deletedPublic(){
    try{
      var a=JSON.parse(localStorage.getItem('ktalk_deleted_public_videos')||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return [];}
  }
  function isDeletedPublic(x){
    if(!x)return false;
    var id=String(x.id||x.publicVideoId||'');
    var url=String(x.video_url||x.publicVideoUrl||'');
    return deletedPublic().some(function(d){
      return (id&&String(d.id||'')===id)||(url&&String(d.url||'')===url);
    });
  }
  function rememberDeletedPublic(id,url){
    id=String(id||'').trim();url=String(url||'').trim();
    if(!id&&!url)return;
    try{
      var a=deletedPublic().filter(function(d){
        return !((id&&String(d.id||'')===id)||(url&&String(d.url||'')===url));
      });
      a.unshift({id:id,url:url,at:Date.now()});
      if(a.length>200)a=a.slice(0,200);
      localStorage.setItem('ktalk_deleted_public_videos',JSON.stringify(a));
      var fast=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(Array.isArray(fast)){
        fast=fast.filter(function(x){return !isDeletedPublic(x);});
        localStorage.setItem('ktalk_fast_feed',JSON.stringify(fast));
      }
    }catch(e){}
  }
  window.ktRememberDeletedPublicVideo=rememberDeletedPublic;

  async function markLocalPosted(){try{var db=await ktOpenVideoDB(),tx=db.transaction('videos','readwrite'),st=tx.objectStore('videos'),rq=st.getAll();await new Promise(function(ok){rq.onsuccess=function(){var a=(rq.result||[]).filter(function(v){return v&&!v.draft;}).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);}),x=a[0];if(x){x.posted=true;x.postedAt=x.postedAt||Date.now();st.put(x);}ok();};rq.onerror=ok;});await new Promise(function(ok){tx.oncomplete=ok;tx.onerror=ok;tx.onabort=ok;});try{db.close();}catch(e){}try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}}catch(e){}}
  function ext(t){t=String(t||'').toLowerCase();if(t.indexOf('mp4')>=0)return'mp4';if(t.indexOf('quicktime')>=0)return'mov';if(t.indexOf('m4v')>=0)return'm4v';return'webm';}
  async function publicUpload(blob,title){
    var a=who(),clean=a.id.replace(/[^a-zA-Z0-9_-]/g,'_')||'guest';
    var path=clean+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext(blob.type);
    var up=await fetch(SB+'/storage/v1/object/ktalk-videos/'+path,{method:'POST',headers:headers({'Content-Type':blob.type||'video/webm','x-upsert':'false'}),body:blob});
    if(!up.ok)throw new Error('upload');
    var url=SB+'/storage/v1/object/public/ktalk-videos/'+path;
    var ins=await fetch(SB+'/rest/v1/ktalk_videos',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify({author_id:a.id,author_name:a.name,title:title||'K-Talk 동영상',video_path:path,video_url:url})});
    if(!ins.ok)throw new Error('insert');
    var rows=await ins.json();
    return rows&&rows[0]?rows[0]:{id:'',video_url:url};
  }

  window.ktDeletePublicVideo=async function(meta){
    meta=meta||{};
    var id=String(meta.id||meta.publicVideoId||'').trim();
    var url=String(meta.video_url||meta.publicVideoUrl||'').trim();
    rememberDeletedPublic(id,url);

    var rowOk=true;
    if(id){
      try{
        var dr=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(id),{
          method:'DELETE',
          headers:headers({'Prefer':'return=minimal'})
        });
        rowOk=dr.ok;
      }catch(e){rowOk=false;}
    }else if(url){
      try{
        var du=await fetch(SB+'/rest/v1/ktalk_videos?video_url=eq.'+encodeURIComponent(url),{
          method:'DELETE',
          headers:headers({'Prefer':'return=minimal'})
        });
        rowOk=du.ok;
      }catch(e){rowOk=false;}
    }

    var path=String(meta.video_path||'').trim();
    if(!path&&url){
      try{
        var marker='/storage/v1/object/public/ktalk-videos/';
        var p=url.indexOf(marker);
        if(p>=0)path=decodeURIComponent(url.slice(p+marker.length));
      }catch(e){}
    }
    if(path){
      try{
        var encoded=path.split('/').map(encodeURIComponent).join('/');
        await fetch(SB+'/storage/v1/object/ktalk-videos/'+encoded,{
          method:'DELETE',
          headers:headers()
        });
      }catch(e){}
    }
    return {ok:rowOk,id:id,url:url};
  };

  async function getStoredItem(id){
    try{
      var db=await ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly'),req=tx.objectStore('videos').get(id);
        req.onsuccess=function(){var x=req.result||null;try{db.close();}catch(e){}resolve(x);};
        req.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }
  async function putStoredItem(item){
    try{
      var db=await ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
    }catch(e){}
  }

  var oldPost=window.postCreatorRecording;
  if(oldPost&&!oldPost.__ktPublic){
    var wrap=async function(){
      var b=blobNow(),t=titleNow();
      await oldPost.apply(this,arguments);
      await markLocalPosted();
      if(b){
        try{await publicUpload(b,t);setTimeout(function(){try{window.home();}catch(e){}},80);}
        catch(e){alert('동영상은 내 프로필에 저장됐지만 공개 목록 등록에 실패했습니다.');}
      }
    };
    wrap.__ktPublic=true;
    window.postCreatorRecording=wrap;
  }

  /* 내 동영상에서 '동영상 올리기' 한 번만 누르면 프로필 저장 + 전체 공개를 같이 처리한다. */
  window.postStoredVideo=async function(id,btn){
    var item=await getStoredItem(id);
    if(!item||!item.blob){alert('동영상을 찾지 못했습니다.');return;}
    if(btn){btn.disabled=true;btn.textContent='올리는 중...';}

    item.posted=true;
    item.postedAt=item.postedAt||Date.now();
    await putStoredItem(item);
    try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}

    try{
      if(!item.publicVideoId){
        var row=await publicUpload(item.blob,item.name||'K-Talk 동영상');
        item.publicPosted=true;
        item.publicVideoId=row&&row.id?row.id:'';
        item.publicVideoUrl=row&&row.video_url?row.video_url:'';
        await putStoredItem(item);
      }
      if(btn){btn.textContent='✓ 올리기 완료';btn.classList.add('done');}
      try{if(window.closeSheet)closeSheet();}catch(e){}
      setTimeout(function(){try{window.home();}catch(e){}},100);
    }catch(e){
      if(btn){btn.disabled=false;btn.textContent='다시 올리기';}
      alert('내 프로필에는 올라갔습니다. 공개 영상 등록만 다시 눌러 주세요.');
    }
  };

  window.saveCreatorDraft=async function(){if(!blobNow()){alert('저장할 동영상이 없습니다.');return;}if(window.postCreatorRecording)await window.postCreatorRecording();};

  function cachedFeed(){
    var first=FIRST_FAST_FEED[0];
    var out=[];
    if(first&&!isDeletedPublic(first))out.push(first);
    try{
      var old=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(Array.isArray(old)&&old.length){
        old.forEach(function(x){
          if(!x||isDeletedPublic(x))return;
          var u=String(x.video_url||'');
          if(u.indexOf('1789858184221-0lyob9.mp4')!==-1)return;
          if(String(x.id||'')===String(first&&first.id||''))return;
          if(u===String(first&&first.video_url||''))return;
          out.push(x);
        });
      }
    }catch(e){}
    return out;
  }
  async function getFeed(){
    try{
      var r=await fetch('/api/video-feed',{cache:'default'});
      var a=r.ok?await r.json():[];
      a=Array.isArray(a)?a.filter(function(x){return !isDeletedPublic(x);}):[];
      /* Keep the same first item that was already painted. Server/cache updates
         may append items, but they must not swap the visible first video. */
      var first=FIRST_FAST_FEED[0];
      var normalized=[];
      if(first&&!isDeletedPublic(first))normalized.push(first);
      a.forEach(function(x){
        if(!x)return;
        if(String(x.id||'')===String(first&&first.id||''))return;
        if(String(x.video_url||'')===String(first&&first.video_url||''))return;
        normalized.push(x);
      });
      a=normalized;
      try{localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));}catch(e){}
      return a;
    }catch(e){
      return cachedFeed();
    }
  }
  function card(x,i){
    var id=esc(x.id),u=esc(x.video_url),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    return '<section data-kt-feed-video-id="'+id+'" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="'+(i===0?'auto':'metadata')+'" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
        +'<button class="kt-feed-profile-button" onclick="if(window.openProfileDirect){openProfileDirect()}else if(window.openProfile){openProfile()}"><span class="kt-feed-profile-circle">👤</span></button>'
        +'<button class="kt-feed-one-rose" onclick="ktPublicSendRose(\''+id+'\',\''+name.replace(/'/g,"\\'")+'\',this)">🌹<small>'+Number(x.likes||0)+'</small></button>'
        +'<button onclick="ktPublicComments(\''+id+'\')">💬<small>메시지</small></button>'
        +'<button onclick="ktPublicShare(\''+u+'\')">↗<small>공유</small></button>'
      +'</div>'
    +'</section>';
  }
  function bind(){
    try{
      var photo='';
      if(typeof window.ktProfileLoad==='function'){
        var pp=window.ktProfileLoad()||{};
        if(pp.photo)photo=String(pp.photo);
      }
      if(!photo){
        photo=localStorage.getItem('ktalk_profile_photo')||localStorage.getItem('ktalk_profile_image')||localStorage.getItem('ktalk_profile_avatar')||'';
      }
      document.querySelectorAll('.kt-feed-profile-button .kt-feed-profile-circle').forEach(function(el){
        if(photo)el.innerHTML='<img src="'+photo.replace(/"/g,'&quot;')+'" alt="">';
      });
    }catch(e){}
    var vs=[].slice.call(document.querySelectorAll('.kt-public-video'));
    vs.forEach(function(v){v.onclick=function(){v.muted=false;v.volume=1;if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}};});
    if('IntersectionObserver'in window){
      var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.6){e.target.play().catch(function(){});}else{e.target.pause();}});},{threshold:[.6]});
      vs.forEach(function(v){ob.observe(v);});
    }
  }

  window.ktPublicSendRose=async function(id,recipientName,btn){
    if(btn&&btn.disabled)return;
    if(btn)btn.disabled=true;
    try{
      var r=await fetch(SB+'/rest/v1/rpc/ktalk_like_video',{method:'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify({video_id:id})});
      if(!r.ok)throw new Error('rose');
      var n=await r.json(),s=btn&&btn.querySelector('small');
      if(s)s.textContent=Number(n||0).toLocaleString('ko-KR');

      /* 누가 장미를 보냈는지 기존 댓글 테이블에 숨은 기록으로 남긴다.
         일반 메시지/댓글 화면에는 이 기록을 표시하지 않는다. */
      try{
        var giver=who();
        await fetch(SB+'/rest/v1/ktalk_video_comments',{
          method:'POST',
          headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
          body:JSON.stringify({
            video_id:id,
            author_id:giver.id,
            author_name:giver.name,
            body:'__KT_ROSE__|1'
          })
        });
      }catch(logErr){}

      var toast=document.createElement('div');
      toast.style.cssText='position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:99999;padding:12px 18px;border-radius:999px;background:rgba(24,8,28,.94);border:1px solid #ff5aaf;color:#fff;font-weight:950;box-shadow:0 0 18px rgba(255,54,150,.45);white-space:nowrap';
      toast.textContent='🌹 '+(recipientName||'동영상 게시자')+'님에게 장미 1송이를 보냈습니다';
      document.body.appendChild(toast);
      setTimeout(function(){if(toast&&toast.parentNode)toast.remove();},2200);
    }catch(e){alert('장미 전송에 실패했습니다. 다시 눌러 주세요.');}
    finally{if(btn)btn.disabled=false;}
  };

  window.ktPublicRoseHistory=async function(videoId,recipientName){
    try{
      var me=who();
      var owner=String(recipientName||'').trim();
      if(owner&&String(me.name||'').trim()!==owner){
        alert('장미를 받은 동영상 게시자만 보낸 사람을 확인할 수 있습니다.');
        return;
      }

      var r=await fetch(SB+'/rest/v1/ktalk_video_comments?select=author_name,body,created_at&video_id=eq.'+encodeURIComponent(videoId)+'&order=created_at.desc&limit=200',{headers:headers()});
      if(!r.ok)throw new Error('history');
      var rows=await r.json();
      var roses=(Array.isArray(rows)?rows:[]).filter(function(x){
        return String(x&&x.body||'').indexOf('__KT_ROSE__|')===0;
      });

      var grouped={};
      roses.forEach(function(x){
        var name=String(x.author_name||'K-Talk').trim()||'K-Talk';
        if(!grouped[name])grouped[name]={count:0,last:x.created_at||''};
        grouped[name].count++;
        if(String(x.created_at||'')>String(grouped[name].last||''))grouped[name].last=x.created_at||'';
      });

      var names=Object.keys(grouped).sort(function(a,b){
        return grouped[b].count-grouped[a].count;
      });
      var html=names.length?names.map(function(name){
        var d='';
        try{d=grouped[name].last?new Date(grouped[name].last).toLocaleString('ko-KR'):'';}catch(e){}
        return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 2px;border-bottom:1px solid rgba(255,255,255,.1)">'
          +'<div><b>'+esc(name)+'</b><small style="display:block;margin-top:3px;opacity:.65">'+esc(d)+'</small></div>'
          +'<strong style="color:#ff7aa8">🌹 '+grouped[name].count+'송이</strong>'
        +'</div>';
      }).join(''):'<div style="padding:18px 2px;opacity:.75">아직 장미를 보낸 사람이 없습니다.</div>';

      if(typeof window.showSheet==='function'){
        showSheet('🌹 장미 보낸 사람',html);
      }
    }catch(e){
      alert('장미 보낸 사람 목록을 불러오지 못했습니다.');
    }
  };
  window.ktPublicLike=function(id,btn){return ktPublicSendRose(id,'동영상 게시자',btn);};

  window.ktPublicComments=async function(videoId){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_video_comments?select=id,author_name,body,created_at&video_id=eq.'+encodeURIComponent(videoId)+'&order=created_at.asc&limit=100',{headers:headers()});
      var rows=r.ok?await r.json():[];
      rows=(Array.isArray(rows)?rows:[]).filter(function(x){return String(x&&x.body||'').indexOf('__KT_ROSE__|')!==0;});
      var q=String(videoId).replace(/'/g,"\\'");
      var list=rows.length?rows.map(function(c){
        var d='';try{d=new Date(c.created_at).toLocaleString('ko-KR');}catch(e){}
        return '<div style="padding:10px 2px;border-bottom:1px solid rgba(255,255,255,.1)"><b>'+esc(c.author_name||'K-Talk')+'</b><div style="margin-top:4px;line-height:1.45">'+esc(c.body||'')+'</div><small style="opacity:.6">'+esc(d)+'</small></div>';
      }).join(''):'<div style="padding:18px 2px;opacity:.7">아직 댓글이 없습니다. 첫 댓글을 남겨 보세요.</div>';
      showSheet('💬 댓글','<div style="max-height:48vh;overflow:auto">'+list+'</div>'
        +'<div style="display:flex;gap:8px;margin-top:12px">'
          +'<input id="ktPublicCommentInput" maxlength="300" placeholder="댓글을 입력하세요" style="flex:1;min-width:0;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:#151515;color:#fff">'
          +'<button class="act" style="width:auto;min-width:74px;margin:0" onclick="ktAddPublicComment(\''+q+'\')">등록</button>'
        +'</div>');
      setTimeout(function(){try{document.getElementById('ktPublicCommentInput').focus();}catch(e){}},50);
    }catch(e){alert('댓글을 불러오지 못했습니다.');}
  };

  window.ktAddPublicComment=async function(videoId){
    var input=document.getElementById('ktPublicCommentInput');
    var body=input?String(input.value||'').trim():'';
    if(!body)return;
    var a=who();
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_video_comments',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({video_id:videoId,author_id:a.id,author_name:a.name,body:body.slice(0,300)})});
      if(!r.ok)throw new Error('comment');
      ktPublicComments(videoId);
    }catch(e){alert('댓글 등록에 실패했습니다.');}
  };

  window.ktPublicShare=async function(url){try{if(navigator.share){await navigator.share({title:'K-Talk 동영상',url:url});return;}if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('동영상 주소를 복사했습니다.');return;}if(window.shareApp)shareApp();}catch(e){}};

  var oldHome=window.home,oldMedia=window.media;
  var feedRefreshInFlight=null;
  function sameFeed(a,b){
    try{
      if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length)return false;
      for(var i=0;i<a.length;i++){
        if(String(a[i]&&a[i].id||'')!==String(b[i]&&b[i].id||''))return false;
        if(String(a[i]&&a[i].video_url||'')!==String(b[i]&&b[i].video_url||''))return false;
      }
      return true;
    }catch(e){return false;}
  }
  function renderFeedNow(a){
    if(!Array.isArray(a)||!a.length)return false;

    /* If the lightweight first-paint video is already buffering/playing,
       keep that exact element when the full feed UI is built. This avoids
       throwing away its buffered data and starting the first MP4 again. */
    var bootVideo=null,bootUrl='';
    try{
      bootVideo=document.getElementById('ktPublicFirstPaintVideo')||window.__ktPublicFirstPaintVideo20260924||null;
      if(bootVideo){
        bootUrl=String(bootVideo.currentSrc||bootVideo.src||window.__ktPublicFirstPaintUrl20260924||'');
        if(bootVideo.parentNode)bootVideo.parentNode.removeChild(bootVideo);
      }
    }catch(e){bootVideo=null;bootUrl='';}

    document.body.classList.remove('kt-home');
    document.body.classList.add('kt-video-mode');
    screen.innerHTML='<div class="kt-public-feed-scroller" data-kt-shared-feed="1" style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+a.map(card).join('')+'</div>';

    try{
      var firstNew=screen.querySelector('.kt-public-video');
      var wanted=String(a[0]&&a[0].video_url||'');
      if(bootVideo&&firstNew&&bootUrl&&wanted&&bootUrl===wanted){
        bootVideo.id='';
        bootVideo.className='kt-public-video';
        bootVideo.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000';
        firstNew.replaceWith(bootVideo);
      }
    }catch(e){}

    try{
      var sc=screen.querySelector('.kt-public-feed-scroller');
      if(sc)sc.scrollTop=0;
    }catch(e){}
    bind();
    try{
      var first=screen.querySelector('.kt-public-video');
      if(first){
        first.preload='auto';
        first.muted=true;
        first.defaultMuted=true;
        first.setAttribute('playsinline','');
        first.setAttribute('webkit-playsinline','');
        first.setAttribute('fetchpriority','high');
        /* Do not call load() here. If this is the parser-started first video,
           load() can restart the same network request on slower Android phones. */
        var p=first.play();if(p&&p.catch)p.catch(function(){});
        [0,40,120,260].forEach(function(ms){
          setTimeout(function(){try{if(first.paused){var q=first.play();if(q&&q.catch)q.catch(function(){});}}catch(e){}},ms);
        });
      }
    }catch(e){}
    return true;
  }
  function appendMissingFeedItems20260924(fresh){
    if(!Array.isArray(fresh)||!fresh.length)return false;
    var sc=screen.querySelector('.kt-public-feed-scroller');
    if(!sc)return false;
    var existing={};
    try{
      sc.querySelectorAll('[data-kt-feed-video-id]').forEach(function(sec){
        var id=String(sec.getAttribute('data-kt-feed-video-id')||'');
        if(id)existing[id]=true;
      });
    }catch(e){}
    var added=0;
    fresh.forEach(function(x,i){
      var id=String(x&&x.id||'');
      if(!id||existing[id]||isDeletedPublic(x))return;
      try{
        sc.insertAdjacentHTML('beforeend',card(x,sc.querySelectorAll('[data-kt-feed-video-id]').length+added));
        existing[id]=true;
        added++;
      }catch(e){}
    });
    if(added){
      bind();
      try{
        var vids=[].slice.call(sc.querySelectorAll('.kt-public-video'));
        vids.slice(Math.max(1,vids.length-added)).forEach(function(v){
          v.preload='metadata';
          v.muted=true;
          v.defaultMuted=true;
          v.setAttribute('playsinline','');
        });
      }catch(e){}
    }
    return added>0;
  }

  async function refreshFeedInBackground(renderIfDifferent){
    if(feedRefreshInFlight)return feedRefreshInFlight;
    feedRefreshInFlight=(async function(){
      try{
        var fresh=await getFeed();
        if(fresh.length){
          var hasVideo=!!screen.querySelector('.kt-public-video');
          if(!hasVideo&&renderIfDifferent){
            renderFeedNow(fresh);
          }else if(hasVideo){
            /* Preserve the already-playing first video and append only the
               server videos that are missing from the fast one-item cache. */
            appendMissingFeedItems20260924(fresh);
          }
        }
        return fresh;
      }finally{
        feedRefreshInFlight=null;
      }
    })();
    return feedRefreshInFlight;
  }
  async function show(fallback){
    var fast=cachedFeed();
    if(fast.length){
      /* Keep the parser-started first video physically on screen until its first
         decoded frame is ready. Rebuilding the feed before that point can interrupt
         the initial media request on slower phones. */
      var boot=null;
      try{boot=document.getElementById('ktPublicFirstPaintVideo')||window.__ktPublicFirstPaintVideo20260924||null;}catch(e){}
      if(boot&&boot.isConnected&&Number(boot.readyState||0)<2){
        var handed=false;
        var handoff=function(){
          if(handed)return;
          handed=true;
          try{boot.removeEventListener('loadeddata',handoff);boot.removeEventListener('canplay',handoff);boot.removeEventListener('playing',handoff);boot.removeEventListener('error',handoff);}catch(e){}
          renderFeedNow(fast);
        };
        try{
          boot.addEventListener('loadeddata',handoff);
          boot.addEventListener('canplay',handoff);
          boot.addEventListener('playing',handoff);
          boot.addEventListener('error',handoff);
          boot.muted=true;boot.defaultMuted=true;boot.preload='auto';
          boot.setAttribute('fetchpriority','high');
          var bp=boot.play();if(bp&&bp.catch)bp.catch(function(){});
        }catch(e){}
        setTimeout(handoff,5000);
        refreshFeedInBackground(true);
        return;
      }
      renderFeedNow(fast);
      refreshFeedInBackground(true);
      return;
    }

    document.body.classList.remove('kt-home');
    document.body.classList.add('kt-video-mode');
    screen.innerHTML='<div style="height:calc(100dvh - 78px);display:grid;place-items:center;background:#000;color:#ddd;text-align:center;padding:24px"><div><b>공용 동영상 목록 연결 중...</b><br><small style="opacity:.7">잠시 후 자동으로 다시 불러옵니다.</small></div></div>';

    var a=await getFeed();
    if(a.length){
      renderFeedNow(a);
      return;
    }
    setTimeout(function(){try{show(fallback);}catch(e){}},700);
  }
  window.ktRefreshSharedFeedNow=async function(){
    try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
    var a=await getFeed();
    if(a.length)renderFeedNow(a);
    return a;
  };
  window.ktShowSharedServerFeed=function(){return show(oldHome);};
  window.home=function(){try{if(window.activate)activate('home');}catch(e){}return show(oldHome);};
  window.media=function(type){try{if(window.activate)activate(type);}catch(e){}return show(function(){if(oldMedia)oldMedia(type);});};

  /* app.js paints its simple home placeholder before this file loads.
     If that placeholder is still on screen, swap it to the cached feed now
     instead of waiting for a later recovery timer. */
  try{
    var currentScreen=document.getElementById('screen');
    var creatorNow=document.getElementById('creator');
    var initialOnly=!!(currentScreen&&currentScreen.querySelector('.media')) &&
      !currentScreen.querySelector('.kt-public-video,.kt-remote-live,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room') &&
      !(creatorNow&&creatorNow.classList.contains('show'));
    if(initialOnly){
      var bootFeed=cachedFeed();
      if(bootFeed&&bootFeed.length){
        renderFeedNow(bootFeed);
        refreshFeedInBackground(false);
      }
    }
  }catch(e){}

  /* 저장한 동영상은 세로 화면으로 크게 보여 주고, 소리를 켠 상태로 재생한다. */
  window.playStoredVideo=async function(id){
    try{
      var db=await ktOpenVideoDB();
      var tx=db.transaction('videos','readonly');
      var req=tx.objectStore('videos').get(id);
      req.onsuccess=function(){
        var item=req.result;
        try{db.close();}catch(e){}
        if(!item||!item.blob){alert('동영상을 찾지 못했습니다.');return;}
        var safeName=esc(item.name||'내 동영상');
        showSheet('동영상 재생','<div class="kt-myvideo-player" style="padding:0 0 10px;max-width:none">'
          +'<video id="ktLibraryPlayer" controls playsinline preload="auto" style="display:block;width:100%;height:calc(100dvh - 340px);min-height:430px;max-height:720px;object-fit:cover;background:#000;border-radius:18px"></video>'
          +'<b style="display:block;padding:12px 2px 8px">'+safeName+'</b>'
          +'<div class="kt-myvideo-player-actions">'
            +'<button class="back" onclick="openMyVideoLibrary()">← 내 동영상</button>'
            +'<button class="upload" onclick="postStoredVideo(\''+id+'\',this)">⬆ 동영상 올리기</button>'
          +'</div>'
          +'<button type="button" class="kt-myvideo-player-delete" onclick="deleteStoredVideo(\''+id+'\',this,true)">🗑 삭제</button>'
        +'</div>');
        try{var oldUrl=window.ktLibraryPlayUrl||'';if(oldUrl)URL.revokeObjectURL(oldUrl);}catch(e){}
        var url=URL.createObjectURL(item.blob);
        window.ktLibraryPlayUrl=url;
        try{ktLibraryPlayUrl=url;}catch(e){}
        var player=document.getElementById('ktLibraryPlayer');
        if(player){
          player.src=url;
          player.muted=false;
          player.volume=1;
          player.defaultMuted=false;
          player.addEventListener('click',function(){player.muted=false;player.volume=1;if(player.paused){var q=player.play();if(q&&q.catch)q.catch(function(){});}});
          player.load();
          var p=player.play();
          if(p&&p.catch)p.catch(function(){});
        }
      };
      req.onerror=function(){try{db.close();}catch(e){}alert('동영상을 재생하지 못했습니다.');};
    }catch(e){alert('동영상을 재생하지 못했습니다.');}
  };
})();

/* Microphone quality: keep existing screens/features untouched and only tune the live mic track. */
(function(){
  if(window.__ktMicQualityBoostInstalled)return;
  window.__ktMicQualityBoostInstalled=true;

  async function tuneMic(){
    try{
      var s=window.state&&state.stream;
      if(!s||!s.getAudioTracks)return;
      var t=s.getAudioTracks()[0];
      if(!t)return;
      try{t.contentHint='speech';}catch(e){}
      if(!t.applyConstraints)return;
      var supported={};
      try{supported=navigator.mediaDevices&&navigator.mediaDevices.getSupportedConstraints?navigator.mediaDevices.getSupportedConstraints():{};}catch(e){}
      var c={};
      if(supported.echoCancellation)c.echoCancellation=true;
      if(supported.noiseSuppression)c.noiseSuppression=true;
      if(supported.autoGainControl)c.autoGainControl=true;
      if(supported.sampleRate)c.sampleRate={ideal:48000};
      if(supported.sampleSize)c.sampleSize={ideal:16};
      if(supported.channelCount)c.channelCount={ideal:1};
      if(supported.latency)c.latency={ideal:0.02};
      if(supported.voiceIsolation)c.voiceIsolation=true;
      if(Object.keys(c).length)await t.applyConstraints(c);
    }catch(e){}
  }

  var oldEnsure=window.ensureLiveCamera;
  if(typeof oldEnsure==='function'){
    window.ensureLiveCamera=async function(){
      var ok=await oldEnsure.apply(this,arguments);
      if(ok)await tuneMic();
      return ok;
    };
  }
  window.ktTuneMicQuality=tuneMic;
})();

/* Keep the existing save behavior; only simplify the visible label for older users. */
(function(){
  function renameSaveLabel(){
    try{
      document.querySelectorAll('button').forEach(function(btn){
        var text=String(btn.textContent||'').replace(/\s+/g,'').trim();
        if(text==='임시저장')btn.textContent='저장';
      });
    }catch(e){}
  }
  renameSaveLabel();
  try{
    new MutationObserver(renameSaveLabel).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();


/* K-Talk public feed action layout 20260920 */
(function(){
  try{
    if(document.getElementById('ktPublicFeedActionLayout20260920'))return;
    var s=document.createElement('style');
    s.id='ktPublicFeedActionLayout20260920';
    s.textContent=''
      +'.vh-actions .kt-feed-profile-button{background:transparent!important;border:0!important;padding:0!important}'
      +'.vh-actions .kt-feed-profile-circle{display:flex!important;width:48px!important;height:48px!important;border-radius:50%!important;overflow:hidden!important;align-items:center!important;justify-content:center!important;border:2px solid #fff!important;background:#222!important;font-size:28px!important;box-sizing:border-box!important;box-shadow:0 2px 8px rgba(0,0,0,.45)!important}'
      +'.vh-actions .kt-feed-profile-circle img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'
      +'.vh-actions .kt-feed-profile-name{display:block!important;margin-top:3px!important;max-width:66px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:10px!important;font-weight:850!important;color:#fff!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions .kt-feed-one-rose small{font-size:11px!important;font-weight:950!important;margin-top:3px!important;color:#fff!important}'
      +'.vh-actions .kt-feed-one-rose{background:transparent!important;border:0!important}'
      +'@media(max-width:390px){.vh-actions .kt-feed-profile-circle{width:44px!important;height:44px!important}}';
    document.head.appendChild(s);
  }catch(e){}
})();
