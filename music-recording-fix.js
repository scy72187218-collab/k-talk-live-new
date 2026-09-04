/* K-Talk: record the selected in-app/free music together with mic audio. */
(function(){
  if(window.__ktMusicRecordingFixInstalled)return;
  window.__ktMusicRecordingFixInstalled=true;

  var oldSelect=window.selectCreatorSound;
  var oldSelectByIndex=window.selectCreatorSoundByIndex;
  var oldPlayRemote=window.ktPlayRemoteSound;
  var oldPlayPreview=window.ktPlaySoundPreview;
  var oldMake=window.makeEffectRecordingStream;
  var oldStart=window.startCreatorRecording;
  var oldStop=window.stopCreatorRecording;
  var oldDelete=window.deleteCreatorRecording;

  window.ktLastCreatorSoundPreviewUrl='';
  window.ktLastCreatorSoundPreviewName='';
  window.ktCreatorMusicCapture=null;

  function setChosen(name,url){
    try{
      state.creatorSound=name||state.creatorSound||'';
      state.creatorSoundUrl=url||'';
    }catch(e){}
    if(url){
      window.ktLastCreatorSoundPreviewUrl=url;
      window.ktLastCreatorSoundPreviewName=name||'';
    }
    try{
      var b=document.getElementById('creatorSoundBtn');
      if(b&&name)b.textContent='♪ '+name;
    }catch(e){}
  }

  if(typeof oldSelect==='function'){
    window.selectCreatorSound=function(name,url){
      var useUrl=url||'';
      if(!useUrl && name && name===window.ktLastCreatorSoundPreviewName){
        useUrl=window.ktLastCreatorSoundPreviewUrl||'';
      }
      setChosen(name,useUrl);
      return oldSelect.apply(this,[name]);
    };
  }

  if(typeof oldSelectByIndex==='function'){
    window.selectCreatorSoundByIndex=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url){
        setChosen(t.name,t.url);
        if(typeof oldSelect==='function')return oldSelect.call(this,t.name);
      }
      return oldSelectByIndex.apply(this,arguments);
    };
  }

  if(typeof oldPlayPreview==='function'){
    window.ktPlaySoundPreview=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url)setChosen(t.name,t.url);
      return oldPlayPreview.apply(this,arguments);
    };
  }

  if(typeof oldPlayRemote==='function'){
    window.ktPlayRemoteSound=function(url,ev){
      var name='';
      try{
        var row=ev&&ev.currentTarget&&ev.currentTarget.closest?ev.currentTarget.closest('.kt-sound-row'):null;
        var b=row&&row.querySelector?row.querySelector('.kt-sound-info b'):null;
        name=b?String(b.textContent||'').trim():'';
      }catch(e){}
      setChosen(name||'선택한 음악',url||'');
      return oldPlayRemote.apply(this,arguments);
    };
  }

  function stopCapture(closeContext){
    var c=window.ktCreatorMusicCapture;
    if(!c)return;
    try{c.audio.pause();}catch(e){}
    try{c.audio.currentTime=0;}catch(e){}
    if(closeContext){
      try{c.ctx.close();}catch(e){}
      try{c.audio.remove();}catch(e){}
      window.ktCreatorMusicCapture=null;
    }
  }

  function buildMixedStream(base,url){
    if(!base || !url)return base;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return base;
    try{
      stopCapture(true);
      var out=new MediaStream();
      base.getVideoTracks().forEach(function(t){out.addTrack(t);});

      var ctx=new AC();
      var dest=ctx.createMediaStreamDestination();
      var micTracks=base.getAudioTracks?base.getAudioTracks():[];
      if(!micTracks.length && window.state&&state.stream&&state.stream.getAudioTracks){
        micTracks=state.stream.getAudioTracks();
      }
      if(micTracks&&micTracks.length){
        var micStream=new MediaStream(micTracks);
        var micSource=ctx.createMediaStreamSource(micStream);
        var micGain=ctx.createGain();
        micGain.gain.value=1.0;
        micSource.connect(micGain);
        micGain.connect(dest);
      }

      var audio=document.createElement('audio');
      audio.id='ktCreatorMusicCapture';
      audio.preload='auto';
      audio.loop=true;
      audio.crossOrigin='anonymous';
      audio.src=url;
      audio.volume=1;
      audio.playsInline=true;
      document.body.appendChild(audio);

      var musicSource=ctx.createMediaElementSource(audio);
      var musicGain=ctx.createGain();
      musicGain.gain.value=0.62;
      musicSource.connect(musicGain);
      musicGain.connect(dest);
      musicGain.connect(ctx.destination);

      dest.stream.getAudioTracks().forEach(function(t){out.addTrack(t);});
      window.ktCreatorMusicCapture={ctx:ctx,audio:audio,dest:dest};
      return out;
    }catch(e){
      try{stopCapture(true);}catch(err){}
      return base;
    }
  }

  if(typeof oldMake==='function'){
    window.makeEffectRecordingStream=function(){
      var base=oldMake.apply(this,arguments);
      var url='';
      try{url=state.creatorSoundUrl||'';}catch(e){}
      if(!url)return base;
      return buildMixedStream(base,url);
    };
  }

  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      var result=await oldStart.apply(this,arguments);
      var c=window.ktCreatorMusicCapture;
      if(c){
        try{if(c.ctx.state==='suspended')await c.ctx.resume();}catch(e){}
        try{c.audio.currentTime=0;}catch(e){}
        try{
          var p=c.audio.play();
          if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      }
      return result;
    };
  }

  if(typeof oldStop==='function'){
    window.stopCreatorRecording=function(){
      var result=oldStop.apply(this,arguments);
      stopCapture(false);
      setTimeout(function(){stopCapture(true);},700);
      return result;
    };
  }

  if(typeof oldDelete==='function'){
    window.deleteCreatorRecording=function(){
      stopCapture(true);
      return oldDelete.apply(this,arguments);
    };
  }

  /* Sound-only playback fix: do not change any layout or other feature. */
  function soundOn(v){
    if(!v)return;
    try{
      v.defaultMuted=false;
      v.muted=false;
      v.volume=1;
      if(v.paused){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  document.addEventListener('click',function(ev){
    var v=null;
    try{v=ev.target&&ev.target.closest?ev.target.closest('.kt-public-video,#ktLibraryPlayer'):null;}catch(e){}
    if(!v)return;
    if(v.muted){
      try{ev.preventDefault();ev.stopImmediatePropagation();}catch(e){}
      soundOn(v);
    }
  },true);

  try{
    var observer=new MutationObserver(function(){
      document.querySelectorAll('.kt-public-video,#ktLibraryPlayer').forEach(function(v){
        try{v.defaultMuted=false;v.muted=false;v.volume=1;}catch(e){}
      });
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* Camera framing only: request a portrait camera stream so the person stays smaller
     with both shoulders visible. No UI/layout/feature changes. */
  var oldEnsureLiveCamera=window.ensureLiveCamera;
  if(typeof oldEnsureLiveCamera==='function' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    window.ensureLiveCamera=async function(){
      var md=navigator.mediaDevices;
      var originalGetUserMedia=md.getUserMedia;
      try{
        md.getUserMedia=function(constraints){
          try{
            if(constraints && constraints.video && typeof constraints.video==='object'){
              var next={};
              Object.keys(constraints).forEach(function(k){next[k]=constraints[k];});
              var v={};
              Object.keys(constraints.video).forEach(function(k){v[k]=constraints.video[k];});
              v.width={ideal:1080};
              v.height={ideal:1920};
              v.aspectRatio={ideal:9/16};
              next.video=v;
              constraints=next;
            }
          }catch(e){}
          return originalGetUserMedia.call(md,constraints);
        };
        return await oldEnsureLiveCamera.apply(this,arguments);
      }finally{
        try{md.getUserMedia=originalGetUserMedia;}catch(e){}
      }
    };
  }

  /* Own-post menu only: add ⋮ to videos I uploaded, with Save and Delete. */
  var KT_MENU_SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KT_MENU_KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  window.__ktOwnVideoRows=window.__ktOwnVideoRows||{};

  function ktMenuHeaders(extra){
    var h={apikey:KT_MENU_KEY,Authorization:'Bearer '+KT_MENU_KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function ktMenuWho(){
    var name='K-Talk',id='guest';
    try{
      name=state.profileName||state.currentProfileName||state.accountName||name;
      id=state.profileId||state.currentAccountId||state.accountId||id;
    }catch(e){}
    try{
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    return {name:String(name).slice(0,80),id:String(id).slice(0,80)};
  }

  function ktMenuVideoId(section){
    try{
      var b=section.querySelector('button[onclick*="ktPublicLike"]');
      var s=b&&b.getAttribute('onclick')||'';
      var m=s.match(/ktPublicLike\('([^']+)'/);
      return m?m[1]:'';
    }catch(e){return '';}
  }

  async function ktLoadOwnVideoRows(){
    var me=ktMenuWho();
    var url=KT_MENU_SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,video_path&author_id=eq.'+encodeURIComponent(me.id)+'&order=created_at.desc&limit=100';
    if(me.id==='guest')url+='&author_name=eq.'+encodeURIComponent(me.name);
    try{
      var r=await fetch(url,{headers:ktMenuHeaders()});
      if(!r.ok)return {};
      var rows=await r.json(),map={};
      (rows||[]).forEach(function(x){map[String(x.id)]=x;});
      window.__ktOwnVideoRows=map;
      return map;
    }catch(e){return {};}
  }

  async function ktInjectOwnVideoMenus(){
    var sections=[].slice.call(document.querySelectorAll('section'));
    if(!sections.length)return;
    var own=await ktLoadOwnVideoRows();
    sections.forEach(function(section){
      if(section.dataset.ktOwnerMenuChecked==='1')return;
      var v=section.querySelector('.kt-public-video');
      if(!v)return;
      section.dataset.ktOwnerMenuChecked='1';
      var id=ktMenuVideoId(section);
      if(!id||!own[id])return;
      var b=document.createElement('button');
      b.type='button';
      b.textContent='⋮';
      b.setAttribute('aria-label','내 동영상 메뉴');
      b.style.cssText='position:absolute;z-index:30;right:12px;top:70px;width:46px;height:46px;border:0;border-radius:50%;background:rgba(0,0,0,.48);color:#fff;font-size:30px;line-height:42px;font-weight:900;backdrop-filter:blur(7px)';
      b.onclick=function(ev){try{ev.preventDefault();ev.stopPropagation();}catch(e){}window.ktOpenOwnVideoMenu(id);};
      section.appendChild(b);
    });
  }

  async function ktGetOwnVideoRow(id){
    id=String(id||'');
    if(window.__ktOwnVideoRows[id])return window.__ktOwnVideoRows[id];
    var me=ktMenuWho();
    try{
      var u=KT_MENU_SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,video_path&id=eq.'+encodeURIComponent(id)+'&limit=1';
      var r=await fetch(u,{headers:ktMenuHeaders()});
      var a=r.ok?await r.json():[];
      var row=a&&a[0];
      if(!row||String(row.author_id)!==me.id)return null;
      if(me.id==='guest'&&String(row.author_name)!==me.name)return null;
      window.__ktOwnVideoRows[id]=row;
      return row;
    }catch(e){return null;}
  }

  window.ktOpenOwnVideoMenu=async function(id){
    var row=await ktGetOwnVideoRow(id);
    if(!row)return;
    var safe=String(id).replace(/'/g,"\\'");
    var html='<div style="display:grid;gap:12px;padding:8px 0 4px">'
      +'<button class="act" style="margin:0;padding:16px;font-size:18px" onclick="ktSaveOwnPublicVideo(\''+safe+'\')">💾 동영상 저장</button>'
      +'<button style="border:1px solid #ff5a6b;background:#4a1218;color:#fff;border-radius:14px;padding:16px;font-size:18px;font-weight:900" onclick="ktDeleteOwnPublicVideo(\''+safe+'\')">🗑 동영상 삭제</button>'
      +'</div>';
    if(window.showSheet)showSheet('내 동영상 관리',html);
  };

  window.ktSaveOwnPublicVideo=async function(id){
    var row=await ktGetOwnVideoRow(id);
    if(!row||!row.video_url)return;
    try{
      var r=await fetch(row.video_url);
      if(!r.ok)throw new Error('download');
      var blob=await r.blob();
      var url=URL.createObjectURL(blob);
      var a=document.createElement('a');
      var suffix='mp4';
      try{var m=String(row.video_path||'').match(/\.([a-zA-Z0-9]+)$/);if(m)suffix=m[1];}catch(e){}
      a.href=url;
      a.download=(row.title||'K-Talk-동영상').replace(/[\\/:*?"<>|]/g,'_')+'.'+suffix;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){try{URL.revokeObjectURL(url);}catch(e){}},1500);
    }catch(e){
      try{window.open(row.video_url,'_blank');}catch(err){}
    }
  };

  async function ktUnmarkLocalPublicVideo(id,row){
    try{
      if(!window.ktOpenVideoDB)return;
      var db=await ktOpenVideoDB();
      var tx=db.transaction('videos','readwrite');
      var st=tx.objectStore('videos');
      var rq=st.getAll();
      await new Promise(function(ok){
        rq.onsuccess=function(){
          (rq.result||[]).forEach(function(x){
            if(String(x.publicVideoId||'')===String(id)||String(x.publicVideoUrl||'')===String(row.video_url||'')){
              x.posted=false;x.publicPosted=false;x.publicVideoId='';x.publicVideoUrl='';st.put(x);
            }
          });
          ok();
        };
        rq.onerror=ok;
      });
      try{db.close();}catch(e){}
      try{if(window.ktRenderProfilePostedVideos)ktRenderProfilePostedVideos();}catch(e){}
    }catch(e){}
  }

  window.ktDeleteOwnPublicVideo=async function(id){
    var row=await ktGetOwnVideoRow(id);
    if(!row)return;
    if(!confirm('이 동영상을 삭제할까요?'))return;
    var me=ktMenuWho();
    try{
      try{await fetch(KT_MENU_SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:ktMenuHeaders({'Prefer':'return=minimal'})});}catch(e){}
      var del=await fetch(KT_MENU_SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(id)+'&author_id=eq.'+encodeURIComponent(me.id),{method:'DELETE',headers:ktMenuHeaders({'Prefer':'return=minimal'})});
      if(!del.ok)throw new Error('delete');
      if(row.video_path){
        try{await fetch(KT_MENU_SB+'/storage/v1/object/ktalk-videos/'+row.video_path,{method:'DELETE',headers:ktMenuHeaders()});}catch(e){}
      }
      await ktUnmarkLocalPublicVideo(id,row);
      try{delete window.__ktOwnVideoRows[String(id)];}catch(e){}
      try{if(window.closeSheet)closeSheet();}catch(e){}
      setTimeout(function(){try{if(window.home)home();}catch(e){}},80);
    }catch(e){
      alert('삭제하지 못했습니다. 잠시 후 다시 눌러 주세요.');
    }
  };

  try{
    var ownerMenuObserver=new MutationObserver(function(){setTimeout(function(){ktInjectOwnVideoMenus();},60);});
    ownerMenuObserver.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(function(){ktInjectOwnVideoMenus();},300);
  }catch(e){}
})();
