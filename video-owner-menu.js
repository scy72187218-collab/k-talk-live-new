/* K-Talk: 내가 올린 공개 동영상 오른쪽 점 3개 메뉴. 삭제/임시 저장/친구에게 공유만 추가. */
(function(){
  if(window.__ktOwnedVideoMenuInstalled)return;
  window.__ktOwnedVideoMenuInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function me(){
    var name='K-Talk',id='guest';
    try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return {name:String(name),id:String(id)};
  }
  function videoIdFromSection(sec){
    try{
      var b=sec.querySelector('.vh-actions button[onclick*="ktPublicLike"]');
      var s=b?String(b.getAttribute('onclick')||''):'';
      var m=s.match(/ktPublicLike\(['\"]([^'\"]+)/);
      return m?m[1]:'';
    }catch(e){return '';}
  }
  function clearFastFeed(){try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}}
  async function rowFor(id){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_path,video_url&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers:headers()});
      var a=r.ok?await r.json():[];return a&&a[0]?a[0]:null;
    }catch(e){return null;}
  }
  async function localByPublicId(id){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return null;
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly'),rq=tx.objectStore('videos').getAll();
        rq.onsuccess=function(){var x=(rq.result||[]).find(function(v){return v&&String(v.publicVideoId||'')===String(id);})||null;try{db.close();}catch(e){}resolve(x);};
        rq.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }
  async function putLocal(item){
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve,reject){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}reject(new Error('db'));};
      });
      return true;
    }catch(e){return false;}
  }
  async function removeLocal(item){
    if(!item)return;
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');tx.objectStore('videos').delete(item.id);
        tx.oncomplete=tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
    }catch(e){}
  }
  async function mine(id){
    var local=await localByPublicId(id);if(local)return true;
    var row=await rowFor(id);if(!row)return false;
    var a=me();
    return a.id!=='guest'&&String(row.author_id||'')===a.id;
  }
  async function removePublic(row){
    if(!row)return false;
    var a=me();
    try{
      await fetch(SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(row.id),{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});
      var url=SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(row.id);
      if(a.id!=='guest')url+='&author_id=eq.'+encodeURIComponent(a.id);
      var r=await fetch(url,{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});
      if(!r.ok)return false;
      if(row.video_path){
        try{await fetch(SB+'/storage/v1/object/ktalk-videos/'+String(row.video_path).split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:headers()});}catch(e){}
      }
      clearFastFeed();return true;
    }catch(e){return false;}
  }
  function closeMenus(except){
    document.querySelectorAll('.kt-owned-video-menu.open').forEach(function(m){if(m!==except)m.classList.remove('open');});
  }
  window.ktToggleOwnedVideoMenu=function(btn){
    var menu=btn&&btn.parentNode?btn.parentNode.querySelector('.kt-owned-video-menu'):null;if(!menu)return;
    var open=!menu.classList.contains('open');closeMenus(menu);menu.classList.toggle('open',open);
  };
  window.ktOwnedVideoShare=function(url){
    closeMenus();
    try{if(window.ktPublicShare){window.ktPublicShare(url);return;}}catch(e){}
  };
  window.ktOwnedVideoDelete=async function(id,sec){
    closeMenus();
    if(!confirm('이 동영상을 삭제할까요?'))return;
    var row=await rowFor(id),local=await localByPublicId(id);
    if(!row){alert('동영상을 찾지 못했습니다.');return;}
    if(!(await mine(id))){alert('내가 올린 동영상만 삭제할 수 있습니다.');return;}
    var ok=await removePublic(row);
    if(!ok){alert('삭제하지 못했습니다. 다시 한 번 눌러 주세요.');return;}
    await removeLocal(local);
    if(sec&&sec.parentNode)sec.parentNode.removeChild(sec);
    try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
  };
  window.ktOwnedVideoDraft=async function(id,sec){
    closeMenus();
    var row=await rowFor(id);if(!row){alert('동영상을 찾지 못했습니다.');return;}
    if(!(await mine(id))){alert('내가 올린 동영상만 임시 저장할 수 있습니다.');return;}
    var item=await localByPublicId(id);
    if(!item){
      try{
        var vr=await fetch(row.video_url);if(!vr.ok)throw new Error('video');
        var blob=await vr.blob();
        item={id:'draft-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:row.title||'임시 저장 동영상',blob:blob,createdAt:Date.now(),draft:true,posted:false,publicPosted:false,publicVideoId:'',publicVideoUrl:''};
      }catch(e){alert('임시 저장 파일을 만들지 못했습니다.');return;}
    }else{
      item.draft=true;item.posted=false;item.publicPosted=false;item.publicVideoId='';item.publicVideoUrl='';
    }
    if(!(await putLocal(item))){alert('임시 저장에 실패했습니다.');return;}
    var ok=await removePublic(row);
    if(!ok){alert('임시 저장은 됐지만 공개 목록에서 내리지 못했습니다.');return;}
    if(sec&&sec.parentNode)sec.parentNode.removeChild(sec);
    try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
    alert('임시 저장했습니다.');
  };

  function addMenu(sec,id,url){
    if(!sec||sec.querySelector('.kt-owned-video-more'))return;
    var wrap=document.createElement('div');wrap.className='kt-owned-video-more';
    wrap.innerHTML='<button type="button" class="kt-owned-video-more-btn" aria-label="동영상 메뉴" title="동영상 메뉴">⋮</button>'
      +'<div class="kt-owned-video-menu">'
        +'<button type="button" class="danger">🗑 삭제</button>'
        +'<button type="button">📝 임시 저장</button>'
        +'<button type="button">↗ 친구한테 공유</button>'
      +'</div>';
    var bs=wrap.querySelectorAll('.kt-owned-video-menu button');
    wrap.querySelector('.kt-owned-video-more-btn').onclick=function(e){e.stopPropagation();window.ktToggleOwnedVideoMenu(this);};
    bs[0].onclick=function(e){e.stopPropagation();window.ktOwnedVideoDelete(id,sec);};
    bs[1].onclick=function(e){e.stopPropagation();window.ktOwnedVideoDraft(id,sec);};
    bs[2].onclick=function(e){e.stopPropagation();window.ktOwnedVideoShare(url);};
    sec.appendChild(wrap);
  }
  async function scan(){
    var secs=[].slice.call(document.querySelectorAll('.kt-video-mode section'));
    for(var i=0;i<secs.length;i++){
      var sec=secs[i];if(sec.dataset.ktOwnerMenuChecked==='1')continue;
      sec.dataset.ktOwnerMenuChecked='1';
      var id=videoIdFromSection(sec),v=sec.querySelector('video.kt-public-video');if(!id||!v)continue;
      if(await mine(id))addMenu(sec,id,v.currentSrc||v.src||'');
    }
  }
  if(!document.getElementById('ktOwnedVideoMenuStyle')){
    var st=document.createElement('style');st.id='ktOwnedVideoMenuStyle';
    st.textContent='.kt-owned-video-more{position:absolute;right:12px;top:62px;z-index:60}.kt-owned-video-more-btn{width:38px;height:38px;border:0;border-radius:50%;background:rgba(0,0,0,.58);color:#fff;font-size:28px;font-weight:900;line-height:30px;display:grid;place-items:center;box-shadow:0 2px 10px rgba(0,0,0,.35)}.kt-owned-video-menu{display:none;position:absolute;right:0;top:43px;width:154px;padding:6px;border-radius:13px;background:rgba(20,20,22,.96);border:1px solid rgba(255,255,255,.16);box-shadow:0 8px 24px rgba(0,0,0,.45)}.kt-owned-video-menu.open{display:grid;gap:3px}.kt-owned-video-menu button{width:100%;padding:10px 9px;border:0;border-radius:9px;background:transparent;color:#fff;text-align:left;font-size:13px;font-weight:800}.kt-owned-video-menu button:active{background:rgba(255,255,255,.12)}.kt-owned-video-menu button.danger{color:#ff788f}';document.head.appendChild(st);
  }
  document.addEventListener('click',function(){closeMenus();});
  try{new MutationObserver(function(){setTimeout(scan,0);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(scan,200);
})();
