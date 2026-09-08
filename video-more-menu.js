/* K-Talk 내 동영상 전용 점 세 개 메뉴: 삭제 / 임시 저장 / 친구 공유. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktVideoMoreMenuInstalled)return;
  window.__ktVideoMoreMenuInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}

  function identities(){
    var ids=[],names=[];
    function add(a,v){v=String(v||'').trim();if(v&&a.indexOf(v)<0)a.push(v);}
    try{add(ids,state.profileId);add(ids,state.currentAccountId);add(ids,state.accountId);add(names,state.profileName);add(names,state.currentProfileName);add(names,state.accountName);}catch(e){}
    try{add(ids,localStorage.getItem('ktalk_active_account'));add(ids,localStorage.getItem('ktalk_profile_id'));add(names,localStorage.getItem('ktalk_profile_name'));add(names,localStorage.getItem('ktalk_active_account_name'));}catch(e){}
    try{if(window.ktProfileAccountKey)add(ids,ktProfileAccountKey());}catch(e){}
    try{if(window.ktProfileLoad){var p=ktProfileLoad();add(names,p&&p.name);}}catch(e){}
    try{if(window.ktGetSelectedSubAccount){var s=ktGetSelectedSubAccount();add(ids,s);if(s)add(ids,'sub:'+s);if(s&&window.ktSubAccountInfo)add(names,ktSubAccountInfo(s).name);}}catch(e){}
    return {ids:ids,names:names};
  }

  async function rowById(id){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_path,video_url&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers:headers()});
      if(!r.ok)return null;var a=await r.json();return a&&a[0]?a[0]:null;
    }catch(e){return null;}
  }
  function isMine(row){
    if(!row)return false;var me=identities();
    return me.ids.indexOf(String(row.author_id||''))>=0||me.names.indexOf(String(row.author_name||''))>=0;
  }
  function pathFrom(row,url){
    var p=String((row&&row.video_path)||'');if(p)return p;
    var u=String((row&&row.video_url)||url||''),m=u.match(/\/ktalk-videos\/(.+)$/);return m?decodeURIComponent(m[1]):'';
  }
  function clearFastFeed(id){
    try{var a=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');a=a.filter(function(x){return String(x.id)!==String(id);});localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));}catch(e){}
  }
  async function remoteRemove(id,row,url){
    try{await fetch(SB+'/rest/v1/ktalk_video_comments?video_id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});}catch(e){}
    var r=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});
    if(!r.ok)throw new Error('row delete');
    var p=pathFrom(row,url);if(p){try{await fetch(SB+'/storage/v1/object/ktalk-videos/'+p.split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:headers()});}catch(e){}}
    clearFastFeed(id);return true;
  }

  async function getAllLocal(){
    try{var db=await ktOpenVideoDB();return await new Promise(function(resolve){var tx=db.transaction('videos','readonly'),q=tx.objectStore('videos').getAll();q.onsuccess=function(){var a=q.result||[];try{db.close();}catch(e){}resolve(a);};q.onerror=function(){try{db.close();}catch(e){}resolve([]);};});}catch(e){return[];}
  }
  async function putLocal(item){
    try{var db=await ktOpenVideoDB();await new Promise(function(resolve){var tx=db.transaction('videos','readwrite');tx.objectStore('videos').put(item);tx.oncomplete=resolve;tx.onerror=tx.onabort=resolve;});try{db.close();}catch(e){}}catch(e){}
  }
  async function deleteLocalMatches(publicId,url){
    try{var db=await ktOpenVideoDB();var items=await new Promise(function(resolve){var tx=db.transaction('videos','readonly'),q=tx.objectStore('videos').getAll();q.onsuccess=function(){resolve(q.result||[]);};q.onerror=function(){resolve([]);};});await new Promise(function(resolve){var tx=db.transaction('videos','readwrite'),st=tx.objectStore('videos');items.forEach(function(x){if(String(x.publicVideoId||'')===String(publicId)||String(x.publicVideoUrl||'')===String(url||''))st.delete(x.id);});tx.oncomplete=resolve;tx.onerror=tx.onabort=resolve;});try{db.close();}catch(e){}}catch(e){}
  }
  async function saveAsDraft(publicId,url,title){
    var items=await getAllLocal(),item=items.find(function(x){return String(x.publicVideoId||'')===String(publicId)||String(x.publicVideoUrl||'')===String(url||'');});
    if(!item){
      try{var r=await fetch(url);if(r.ok){var b=await r.blob();item={id:'draft-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:title||'임시 저장 동영상',type:b.type||'video/mp4',blob:b,createdAt:Date.now()};}}catch(e){}
    }
    if(!item)throw new Error('draft');
    item.draft=true;item.posted=false;item.publicPosted=false;item.publicVideoId='';item.publicVideoUrl='';item.postedAt=0;await putLocal(item);return item;
  }

  window.ktVideoFriendShare=async function(url,title){
    try{if(navigator.share){await navigator.share({title:title||'K-Talk 동영상',text:'K-Talk 동영상',url:url});return;}if(navigator.clipboard){await navigator.clipboard.writeText(url);alert('친구에게 보낼 동영상 주소를 복사했습니다.');return;}}catch(e){}
    alert('이 기기에서는 공유창을 열 수 없습니다.');
  };

  window.ktVideoDelete=async function(id,url,section){
    var row=await rowById(id);if(!isMine(row)){alert('내가 올린 동영상만 삭제할 수 있습니다.');return;}
    if(!confirm('이 동영상을 삭제할까요?'))return;
    try{await remoteRemove(id,row,url);await deleteLocalMatches(id,url);try{if(section&&section.remove)section.remove();}catch(e){}try{closeSheet();}catch(e){}alert('동영상을 삭제했습니다.');}catch(e){alert('공개 동영상 삭제에 실패했습니다. 다시 눌러 주세요.');}
  };

  window.ktVideoDraft=async function(id,url,title,section){
    var row=await rowById(id);if(!isMine(row)){alert('내가 올린 동영상만 임시 저장할 수 있습니다.');return;}
    try{await saveAsDraft(id,url,title);await remoteRemove(id,row,url);try{if(section&&section.remove)section.remove();}catch(e){}try{closeSheet();}catch(e){}alert('내 동영상에 임시 저장했습니다. 공개 화면에서는 내렸습니다.');}catch(e){alert('임시 저장에 실패했습니다. 다시 눌러 주세요.');}
  };

  window.ktVideoMore=async function(id,url,title,section){
    var row=await rowById(id),mine=isMine(row),qId=String(id).replace(/'/g,"\\'"),qUrl=String(url||'').replace(/'/g,"\\'"),qTitle=String(title||'K-Talk 동영상').replace(/'/g,"\\'");
    var html='<div class="kt-video-more-sheet">'
      +(mine?'<button class="danger" onclick="ktVideoDelete(\''+qId+'\',\''+qUrl+'\',window.__ktVideoMoreSection)">🗑 <b>삭제</b><small>올린 동영상을 지웁니다</small></button>':'')
      +(mine?'<button onclick="ktVideoDraft(\''+qId+'\',\''+qUrl+'\',\''+qTitle+'\',window.__ktVideoMoreSection)">📥 <b>임시 저장</b><small>내 동영상에 보관하고 공개에서는 내립니다</small></button>':'')
      +'<button onclick="ktVideoFriendShare(\''+qUrl+'\',\''+qTitle+'\')">👥 <b>친구 공유</b><small>친구에게 동영상을 보냅니다</small></button>'
      +'</div>';
    window.__ktVideoMoreSection=section||null;
    if(window.showSheet)showSheet('동영상 메뉴',html);
  };

  async function localMore(id){
    var items=await getAllLocal(),x=items.find(function(v){return String(v.id)===String(id);});if(!x)return;
    var q=String(id).replace(/'/g,"\\'"),share=x.publicVideoUrl||'';
    var html='<div class="kt-video-more-sheet">'
      +'<button class="danger" onclick="deleteStoredVideo(\''+q+'\',this,true)">🗑 <b>삭제</b><small>내 동영상에서 지웁니다</small></button>'
      +'<button onclick="ktLocalMakeDraft(\''+q+'\')">📥 <b>임시 저장</b><small>임시 보관으로 바꿉니다</small></button>'
      +(share?'<button onclick="ktVideoFriendShare(\''+String(share).replace(/'/g,"\\'")+'\',\''+String(x.name||'K-Talk 동영상').replace(/'/g,"\\'")+'\')">👥 <b>친구 공유</b><small>친구에게 동영상을 보냅니다</small></button>':'')
      +'</div>';
    showSheet('동영상 메뉴',html);
  }
  window.ktLocalVideoMore=localMore;
  window.ktLocalMakeDraft=async function(id){var a=await getAllLocal(),x=a.find(function(v){return String(v.id)===String(id);});if(!x)return;x.draft=true;x.posted=false;await putLocal(x);try{openMyVideoLibrary();}catch(e){}alert('임시 저장으로 바꿨습니다.');};

  function addStyle(){if(document.getElementById('ktVideoMoreStyle'))return;var s=document.createElement('style');s.id='ktVideoMoreStyle';s.textContent=''
    +'.kt-video-more-btn{position:absolute!important;right:12px!important;top:58px!important;z-index:35!important;width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.35)!important;background:rgba(0,0,0,.48)!important;color:#fff!important;font-size:28px!important;font-weight:950!important;line-height:1!important;display:grid!important;place-items:center!important;touch-action:manipulation!important}'
    +'.kt-video-more-sheet{display:grid;gap:9px;padding:4px 0 8px}.kt-video-more-sheet button{width:100%;min-height:58px;border:1px solid rgba(255,255,255,.14);border-radius:15px;background:#171820;color:#fff;text-align:left;padding:9px 14px;font-size:18px}.kt-video-more-sheet button b{margin-left:7px}.kt-video-more-sheet button small{display:block;margin:4px 0 0 33px;color:#bbb;font-size:11px}.kt-video-more-sheet button.danger{border-color:rgba(255,78,105,.5);color:#ff8096}'
    +'.kt-myvideo-player{position:relative!important}.kt-local-more-btn{position:absolute;right:10px;top:10px;z-index:20;width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.58);color:#fff;font-size:28px;font-weight:950;line-height:1}';document.head.appendChild(s);}

  function scanPublic(){
    document.querySelectorAll('section').forEach(function(sec){var v=sec.querySelector('video.kt-public-video');if(!v||sec.querySelector('.kt-video-more-btn'))return;var like=sec.querySelector('.vh-actions button[onclick*="ktPublicLike"]');if(!like)return;var m=String(like.getAttribute('onclick')||'').match(/ktPublicLike\(['\"]([^'\"]+)/);if(!m)return;var id=m[1],url=v.currentSrc||v.src||'',title='K-Talk 동영상';try{var t=sec.querySelector('.vh-title span');if(t)title=t.textContent||title;}catch(e){}var b=document.createElement('button');b.type='button';b.className='kt-video-more-btn';b.setAttribute('aria-label','동영상 더보기');b.textContent='⋮';b.onclick=function(e){e.preventDefault();e.stopPropagation();ktVideoMore(id,url,title,sec);};sec.appendChild(b);});
  }
  function scanLocal(){var box=document.querySelector('.kt-myvideo-player');if(!box||box.querySelector('.kt-local-more-btn'))return;var up=box.querySelector('button[onclick*="postStoredVideo"]');if(!up)return;var m=String(up.getAttribute('onclick')||'').match(/postStoredVideo\(['\"]([^'\"]+)/);if(!m)return;var b=document.createElement('button');b.type='button';b.className='kt-local-more-btn';b.setAttribute('aria-label','동영상 더보기');b.textContent='⋮';b.onclick=function(e){e.preventDefault();e.stopPropagation();localMore(m[1]);};box.appendChild(b);}
  function scan(){scanPublic();scanLocal();}
  addStyle();setTimeout(scan,80);setInterval(scan,900);
  try{new MutationObserver(function(){setTimeout(scan,20);}).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();
