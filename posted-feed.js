/* K-Talk public video feed: only post/save/feed behavior. */
(function(){
  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k]});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function blobNow(){try{if(window.ktCreatorBlob)return window.ktCreatorBlob;}catch(e){}try{return typeof ktCreatorBlob!=='undefined'?ktCreatorBlob:null;}catch(e){return null;}}
  function titleNow(){try{return window.ktImportedVideoName||ktImportedVideoName||('K-Talk 동영상 '+new Date().toLocaleString('ko-KR'));}catch(e){return 'K-Talk 동영상';}}
  function who(){var name='K-Talk',id='guest';try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}return {name:String(name).slice(0,80),id:String(id).slice(0,80)};}
  async function markLocalPosted(){try{var db=await ktOpenVideoDB(),tx=db.transaction('videos','readwrite'),st=tx.objectStore('videos'),rq=st.getAll();await new Promise(function(ok){rq.onsuccess=function(){var a=(rq.result||[]).filter(function(v){return v&&!v.draft;}).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);}),x=a[0];if(x){x.posted=true;x.postedAt=x.postedAt||Date.now();st.put(x);}ok();};rq.onerror=ok;});await new Promise(function(ok){tx.oncomplete=ok;tx.onerror=ok;tx.onabort=ok;});try{db.close();}catch(e){}try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}}catch(e){}}
  function ext(t){t=String(t||'').toLowerCase();if(t.indexOf('mp4')>=0)return'mp4';if(t.indexOf('quicktime')>=0)return'mov';if(t.indexOf('m4v')>=0)return'm4v';return'webm';}
  async function publicUpload(blob,title){var a=who(),clean=a.id.replace(/[^a-zA-Z0-9_-]/g,'_')||'guest',path=clean+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext(blob.type);var up=await fetch(SB+'/storage/v1/object/ktalk-videos/'+path,{method:'POST',headers:headers({'Content-Type':blob.type||'video/webm','x-upsert':'false'}),body:blob});if(!up.ok)throw new Error('upload');var url=SB+'/storage/v1/object/public/ktalk-videos/'+path;var ins=await fetch(SB+'/rest/v1/ktalk_videos',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify({author_id:a.id,author_name:a.name,title:title||'K-Talk 동영상',video_path:path,video_url:url})});if(!ins.ok)throw new Error('insert');}

  var oldPost=window.postCreatorRecording;
  if(oldPost&&!oldPost.__ktPublic){var wrap=async function(){var b=blobNow(),t=titleNow();await oldPost.apply(this,arguments);await markLocalPosted();if(b){try{await publicUpload(b,t);setTimeout(function(){try{window.home();}catch(e){}},80);}catch(e){alert('동영상은 내 프로필에 저장됐지만 공개 목록 등록에 실패했습니다.');}}};wrap.__ktPublic=true;window.postCreatorRecording=wrap;}
  window.saveCreatorDraft=async function(){if(!blobNow()){alert('저장할 동영상이 없습니다.');return;}if(window.postCreatorRecording)await window.postCreatorRecording();};

  async function getFeed(){try{var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{headers:headers()});return r.ok?await r.json():[];}catch(e){return[];}}
  function card(x,i){var id=esc(x.id),u=esc(x.video_url),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');return '<section style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden"><video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="metadata" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video><div class="vh-shade"></div><div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div><div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div><div class="vh-actions"><button onclick="ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="ktPublicShare(\''+u+'\')">↗<small>공유</small></button></div></section>';}
  function bind(){var vs=[].slice.call(document.querySelectorAll('.kt-public-video'));vs.forEach(function(v){v.onclick=function(){v.muted=false;v.volume=1;if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}};});if('IntersectionObserver'in window){var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.6){e.target.play().catch(function(){});}else{e.target.pause();}});},{threshold:[.6]});vs.forEach(function(v){ob.observe(v);});}}
  window.ktPublicLike=async function(id,btn){try{var r=await fetch(SB+'/rest/v1/rpc/ktalk_like_video',{method:'POST',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify({video_id:id})});if(r.ok){var n=await r.json(),s=btn&&btn.querySelector('small');if(s)s.textContent='좋아요 '+Number(n||0);}}catch(e){}};
  window.ktPublicShare=async function(url){try{if(navigator.share){await navigator.share({title:'K-Talk 동영상',url:url});return;}if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('동영상 주소를 복사했습니다.');return;}if(window.shareApp)shareApp();}catch(e){}};
  var oldHome=window.home,oldMedia=window.media;
  async function show(fallback){var a=await getFeed();if(!a.length){if(fallback)fallback();return;}document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');screen.innerHTML='<div style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+a.map(card).join('')+'</div>';bind();}
  window.home=function(){try{if(window.activate)activate('home');}catch(e){}show(oldHome);};
  window.media=function(type){try{if(window.activate)activate(type);}catch(e){}show(function(){if(oldMedia)oldMedia(type);});};

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
