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

/* K-Talk: when a LIVE broadcast exists, viewers see it immediately without tapping a placeholder card. */
(function(){
  if(window.__ktLiveAutoEntryLoaded)return;
  window.__ktLiveAutoEntryLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var joining=false;
  var snoozeUntil=0;
  var lastAttemptHost='';
  var lastAttemptAt=0;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}

  function hostDeviceBusy(){
    try{
      if(document.body.classList.contains('kt-solo-host-live'))return true;
      if(document.getElementById('ktLiveVideo'))return true;
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
      var creator=document.getElementById('creator')||window.creator;
      if(creator&&creator.classList&&creator.classList.contains('show'))return true;
    }catch(e){}
    return false;
  }

  function viewerAreaVisible(){
    try{
      if(document.getElementById('ktRemoteLive'))return false;
      if(document.getElementById('ktUnifiedFeed'))return true;
      if(document.querySelector('.kt-live-feed-card'))return true;
      if(document.body.classList.contains('kt-home'))return true;
    }catch(e){}
    return false;
  }

  function canAutoEnter(){
    if(joining||Date.now()<snoozeUntil)return false;
    if(typeof window.ktJoinLive!=='function')return false;
    if(hostDeviceBusy())return false;
    if(!viewerAreaVisible())return false;
    return true;
  }

  function markCardConnecting(card){
    try{
      var strong=card&&card.querySelector('strong');
      if(strong)strong.textContent='방송 자동 연결 중...';
      if(card)card.style.cursor='default';
    }catch(e){}
  }

  async function joinLive(host,title,room){
    host=String(host||'guest');
    if(!canAutoEnter())return;
    if(lastAttemptHost===host&&Date.now()-lastAttemptAt<3500)return;
    lastAttemptHost=host;
    lastAttemptAt=Date.now();
    joining=true;
    try{
      await window.ktJoinLive(host,title||'K-Talk LIVE',room||'라이브 방송');
    }catch(e){}
    setTimeout(function(){joining=false;},900);
  }

  function joinVisibleCard(){
    if(!canAutoEnter())return false;
    var card=document.querySelector('.kt-live-feed-card');
    if(!card)return false;
    markCardConnecting(card);
    joinLive(card.dataset.liveHost||'guest',card.dataset.liveTitle||'K-Talk LIVE',card.dataset.liveRoom||'라이브 방송');
    return true;
  }

  async function findAndJoinLive(){
    if(!canAutoEnter())return;
    if(joinVisibleCard())return;
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var url=SB+'/rest/v1/ktalk_live_rooms?select=host_id,host_name,title,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=1';
      var r=await fetch(url,{headers:headers()});
      if(!r.ok)return;
      var a=await r.json();
      var live=a&&a[0];
      if(!live)return;
      joinLive(live.host_id||'guest',live.title||live.host_name||'K-Talk LIVE',live.room_name||'라이브 방송');
    }catch(e){}
  }

  function installLeaveSnooze(){
    var fn=window.ktLeaveRemoteLive;
    if(typeof fn!=='function'||fn.__ktAutoLeaveWrapped)return;
    function wrapped(){
      snoozeUntil=Date.now()+30000;
      return fn.apply(this,arguments);
    }
    wrapped.__ktAutoLeaveWrapped=true;
    window.ktLeaveRemoteLive=wrapped;
  }

  try{
    new MutationObserver(function(){
      installLeaveSnooze();
      setTimeout(joinVisibleCard,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(function(){installLeaveSnooze();findAndJoinLive();},450);
  setInterval(function(){installLeaveSnooze();findAndJoinLive();},1500);
})();

/* K-Talk: one upload should create and show only one public video. */
(function(){
  if(window.__ktSingleVideoUploadFixLoaded)return;
  window.__ktSingleVideoUploadFixLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var locks={};
  var duplicateUrls={};
  var scanning=false;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function normalize(u){try{return new URL(u,location.href).href;}catch(e){return String(u||'');}}

  function lockCall(key,fn,ctx,args){
    if(locks[key])return locks[key];
    var p=Promise.resolve().then(function(){return fn.apply(ctx,args);});
    locks[key]=p;
    p.finally(function(){setTimeout(function(){if(locks[key]===p)delete locks[key];},2500);});
    return p;
  }

  function wrapUploadFunctions(){
    var stored=window.postStoredVideo;
    if(typeof stored==='function'&&!stored.__ktSingleUploadWrapped){
      var sw=function(id,btn){
        if(btn){try{btn.disabled=true;}catch(e){}}
        return lockCall('stored:'+String(id||''),stored,this,arguments);
      };
      sw.__ktSingleUploadWrapped=true;
      sw.__ktOriginal=stored;
      window.postStoredVideo=sw;
    }

    var creator=window.postCreatorRecording;
    if(typeof creator==='function'&&!creator.__ktSingleUploadWrapped){
      var cw=function(){return lockCall('creator',creator,this,arguments);};
      cw.__ktSingleUploadWrapped=true;
      cw.__ktOriginal=creator;
      window.postCreatorRecording=cw;
    }
  }

  async function scanDuplicates(){
    if(scanning)return;
    scanning=true;
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,created_at&order=created_at.desc&limit=100',{headers:headers()});
      if(!r.ok)return;
      var rows=await r.json();
      var newest={};
      var dup={};
      rows.forEach(function(x){
        var who=String(x.author_id||x.author_name||'');
        var title=String(x.title||'');
        var key=who+'\n'+title;
        var t=Date.parse(x.created_at||'')||0;
        if(newest[key]!=null&&Math.abs(newest[key]-t)<=30000){
          dup[normalize(x.video_url)]=true;
        }else{
          newest[key]=t;
        }
      });
      duplicateUrls=dup;
    }catch(e){}
    finally{scanning=false;}
  }

  function hideDuplicateCards(){
    document.querySelectorAll('.kt-feed-card .kt-public-video').forEach(function(v){
      var card=v.closest('.kt-feed-card');
      if(!card)return;
      var src=normalize(v.currentSrc||v.src||v.getAttribute('src')||'');
      card.style.display=duplicateUrls[src]?'none':'';
    });
  }

  async function refresh(){
    wrapUploadFunctions();
    await scanDuplicates();
    hideDuplicateCards();
  }

  wrapUploadFunctions();
  refresh();
  try{
    new MutationObserver(function(){wrapUploadFunctions();hideDuplicateCards();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setInterval(refresh,1800);
})();
