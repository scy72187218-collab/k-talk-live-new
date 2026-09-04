/* K-Talk: owner-only three-dot actions for uploaded public videos. */
(function(){
  if(window.__ktPublicVideoOwnerActionsLoaded)return;
  window.__ktPublicVideoOwnerActionsLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var rows=[];
  var loading=false;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function me(){
    var id='guest',name='K-Talk';
    try{
      id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;
      name=(window.state&&(state.profileName||state.currentProfileName||state.accountName))||name;
    }catch(e){}
    try{
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
    }catch(e){}
    return {id:String(id),name:String(name)};
  }
  async function loadRows(){
    if(loading)return;
    loading=true;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,video_path,created_at&order=created_at.desc&limit=100',{headers:headers()});
      rows=r.ok?await r.json():[];
    }catch(e){rows=[];}
    loading=false;
  }
  function normalize(u){
    try{return new URL(u,location.href).href;}catch(e){return String(u||'');}
  }
  function findRow(video){
    var src=normalize(video.currentSrc||video.src||video.getAttribute('src')||'');
    return rows.find(function(x){return normalize(x.video_url)===src;})||null;
  }
  function isMine(row){
    if(!row)return false;
    var a=me();
    if(row.author_id&&a.id&&a.id!=='guest'&&String(row.author_id)===a.id)return true;
    if(row.author_name&&a.name&&a.name!=='K-Talk'&&String(row.author_name)===a.name)return true;
    return false;
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  window.ktOpenPublicVideoOwnerMenu=function(id,url,path){
    var qid=String(id||'').replace(/'/g,"\\'");
    var qurl=String(url||'').replace(/'/g,"\\'");
    var qpath=String(path||'').replace(/'/g,"\\'");
    var html='<div style="display:grid;gap:10px;padding:2px">'
      +'<button class="act" style="margin:0" onclick="ktSavePublicVideo(\''+qurl+'\')">⬇ 동영상 저장</button>'
      +'<button class="act" style="margin:0;background:#7b1824;border-color:#b93245" onclick="ktDeletePublicVideo(\''+qid+'\',\''+qpath+'\')">🗑 동영상 삭제</button>'
      +'<div class="note">삭제해도 휴대폰의 ‘내 동영상’ 원본은 그대로 남습니다.</div>'
      +'</div>';
    if(window.showSheet)showSheet('동영상 관리',html);
    else alert('동영상 관리 메뉴를 열 수 없습니다.');
  };

  window.ktSavePublicVideo=async function(url){
    try{
      var r=await fetch(url);
      if(!r.ok)throw new Error('download');
      var b=await r.blob();
      var u=URL.createObjectURL(b);
      var a=document.createElement('a');
      a.href=u;a.download='K-Talk-'+Date.now()+'.mp4';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){try{URL.revokeObjectURL(u);}catch(e){}},3000);
      if(window.ktSpeak)ktSpeak('동영상을 저장했습니다.');
    }catch(e){alert('동영상 저장을 완료하지 못했습니다.');}
  };

  window.ktDeletePublicVideo=async function(id,path){
    if(!id)return;
    if(!confirm('이 동영상을 공개 목록에서 삭제할까요?\n내 동영상 원본은 그대로 남습니다.'))return;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});
      if(!r.ok)throw new Error('row delete');
      if(path){
        try{await fetch(SB+'/storage/v1/object/ktalk-videos/'+String(path).split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:headers()});}catch(e){}
      }
      try{if(window.closeSheet)closeSheet();}catch(e){}
      rows=rows.filter(function(x){return String(x.id)!==String(id);});
      alert('동영상을 삭제했습니다.');
      if(window.ktRefreshUnifiedFeed)window.ktRefreshUnifiedFeed();
      else if(window.home)window.home();
    }catch(e){
      alert('삭제가 안 됐습니다. 다시 한 번 눌러 주세요.');
    }
  };

  function decorate(){
    document.querySelectorAll('.kt-feed-card').forEach(function(card){
      var v=card.querySelector('.kt-public-video');
      if(!v||card.querySelector('.kt-owner-video-menu'))return;
      var row=findRow(v);
      if(!isMine(row))return;
      card.style.position=card.style.position||'relative';
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-owner-video-menu';
      b.textContent='⋮';
      b.setAttribute('aria-label','내 동영상 관리');
      b.style.cssText='position:absolute;right:14px;bottom:18px;z-index:25;width:46px;height:46px;border:0;border-radius:50%;background:rgba(10,10,12,.68);color:#fff;font-size:31px;font-weight:900;line-height:1;display:grid;place-items:center;box-shadow:0 2px 12px #0008';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();ktOpenPublicVideoOwnerMenu(row.id,row.video_url,row.video_path||'');};
      card.appendChild(b);
    });
  }
  async function refresh(){await loadRows();decorate();}
  refresh();
  try{new MutationObserver(function(){decorate();}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(function(){if(document.querySelector('.kt-feed-card .kt-public-video'))refresh();},2500);
})();
