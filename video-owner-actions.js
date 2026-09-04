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
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}

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

    var victim=rows.find(function(x){return String(x.id)===String(id);})||null;
    var victimUrl=victim?normalize(victim.video_url):'';

    try{if(window.closeSheet)closeSheet();}catch(e){}
    if(victimUrl){
      try{
        document.querySelectorAll('.kt-feed-card .kt-public-video').forEach(function(v){
          var src=normalize(v.currentSrc||v.src||v.getAttribute('src')||'');
          if(src!==victimUrl)return;
          try{v.pause();}catch(e){}
          var card=v.closest('.kt-feed-card');
          if(card)card.remove();
        });
      }catch(e){}
    }

    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:headers({'Prefer':'return=minimal'})});
      if(!r.ok)throw new Error('row delete');
      if(path){
        try{await fetch(SB+'/storage/v1/object/ktalk-videos/'+String(path).split('/').map(encodeURIComponent).join('/'),{method:'DELETE',headers:headers()});}catch(e){}
      }
      rows=rows.filter(function(x){return String(x.id)!==String(id);});
      setTimeout(function(){
        try{
          if(window.ktRefreshUnifiedFeed)window.ktRefreshUnifiedFeed();
          else if(window.home)window.home();
        }catch(e){}
      },80);
    }catch(e){
      alert('삭제가 안 됐습니다. 다시 한 번 눌러 주세요.');
      try{
        if(window.ktRefreshUnifiedFeed)window.ktRefreshUnifiedFeed();
        else if(window.home)window.home();
      }catch(_e){}
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

/* Advertising inquiry contact details. */
(function(){
  if(window.__ktAdContactDetailsLoaded)return;
  window.__ktAdContactDetailsLoaded=true;
  function install(){
    if(typeof window.showSheet!=='function')return;
    window.openAd=function(){
      showSheet('📣 광고 문의',
        '<div style="display:grid;gap:10px">'
        +'<div class="rowbox"><b>📣 K-Talk 광고 · 판매 문의</b><br>광고 등록, 판매자 광고, 제휴 문의는 아래 연락처로 문의해 주세요.</div>'
        +'<div class="rowbox"><b>👤 담당자</b><br>송충영</div>'
        +'<div class="rowbox"><b>📞 문의 전화</b><br><a href="tel:01075107218" style="color:#7ee7ff;font-size:18px;font-weight:950;text-decoration:none">010-7510-7218</a></div>'
        +'<div class="rowbox"><b>🧾 사업자 번호</b><br>787-48-01170</div>'
        +'<a class="act" href="tel:01075107218" style="display:block;text-align:center;text-decoration:none">📞 광고 문의 전화하기</a>'
        +'</div>');
    };
  }
  install();
  setTimeout(install,100);
  setTimeout(install,600);
})();

/* Raffle has exactly two losing slots and five rose prizes. */
(function(){
  if(window.__ktRaffleTwoBlanksLoaded)return;
  window.__ktRaffleTwoBlanksLoaded=true;
  function install(){
    if(typeof window.showSheet!=='function')return;
    window.openRaffle=function(){
      showSheet('🎯 제비뽑기','<div class="raffle">꽝 · 꽝 · 1 · 2 · 3 · 4 · 5</div><button class="act" onclick="raffle()">제비뽑기</button>');
    };
    window.openRaffleGuide=function(){
      showSheet('🎯 제비뽑기',
        '<div class="rowbox"><b>하루 3번 참여</b><br>아침 1회 · 점심 1회 · 저녁 1회 참여할 수 있습니다.</div>'
        +'<div class="rowbox"><b>사용 방법</b><br>각 시간대에 제비뽑기 버튼을 눌러 참여합니다. 이미 참여한 시간대는 다시 참여할 수 없습니다.</div>'
        +'<div class="rowbox"><b>당첨 구성</b><br>꽝 2개 · 장미 1개 · 2개 · 3개 · 4개 · 5개로 구성됩니다.</div>'
        +'<button class="act" onclick="openRaffle()">🎯 제비뽑기 바로가기</button>');
    };
  }
  install();
  setTimeout(install,100);
  setTimeout(install,600);
})();

/* K-Talk: give locally saved videos an easy custom title instead of showing only file names. */
(function(){
  if(window.__ktMyVideoTitleEditorLoaded)return;
  window.__ktMyVideoTitleEditorLoaded=true;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function q(v){return String(v==null?'':v).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

  async function getAll(){
    try{
      var db=await ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').getAll();
        req.onsuccess=function(){var a=req.result||[];try{db.close();}catch(e){}resolve(a);};
        req.onerror=function(){try{db.close();}catch(e){}resolve([]);};
      });
    }catch(e){return [];}
  }

  async function getOne(id){
    try{
      var db=await ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').get(id);
        req.onsuccess=function(){var x=req.result||null;try{db.close();}catch(e){}resolve(x);};
        req.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  async function putOne(item){
    try{
      var db=await ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve(true);};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve(false);};
      });
    }catch(e){return false;}
  }

  window.ktRenameStoredVideo=async function(id){
    var item=await getOne(id);
    if(!item){alert('동영상을 찾지 못했습니다.');return;}
    var current=String(item.title||'').trim();
    var next=prompt('이 동영상 제목을 입력해 주세요.\n노래 제목이나 알아보기 쉬운 이름으로 적으면 됩니다.',current);
    if(next===null)return;
    next=String(next||'').trim();
    if(!next){alert('제목을 입력해 주세요.');return;}
    item.title=next.slice(0,60);
    var ok=await putOne(item);
    if(!ok){alert('제목을 저장하지 못했습니다.');return;}
    try{if(window.ktSpeak)ktSpeak('동영상 제목을 저장했습니다.');}catch(e){}
    openMyVideoLibrary();
  };

  window.openMyVideoLibrary=async function(){
    try{
      var items=(await getAll()).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
      var html='<div class="kt-myvideo-head"><b>🎬 내 동영상</b><button onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">＋ 휴대폰 동영상 올리기</button></div>';
      if(!items.length){
        html+='<div class="rowbox"><b>아직 올린 동영상이 없습니다.</b><br>휴대폰에 찍어 놓은 동영상을 선택해서 올릴 수 있습니다.</div>';
      }else{
        html+='<div class="kt-myvideo-list">'+items.map(function(v){
          var d=new Date(v.createdAt||Date.now());
          var title=String(v.title||'').trim()||'제목 미입력';
          var id=q(v.id);
          return '<div class="kt-myvideo-row" data-video-id="'+esc(v.id)+'">'
            +'<button type="button" class="play" data-play-video="'+esc(v.id)+'" onclick="playStoredVideo(\''+id+'\')"><span>▶</span><b>'+esc(title)+'</b><small>'+d.toLocaleDateString('ko-KR')+(v.posted?' · 게시됨':'')+'</small></button>'
            +'<div class="kt-myvideo-row-actions">'
              +'<button type="button" style="min-height:42px;border:1px solid #7b5cff88;border-radius:14px;background:#241b49;color:#fff;font-weight:900" onclick="event.preventDefault();event.stopPropagation();ktRenameStoredVideo(\''+id+'\');return false;">✏ 제목</button>'
              +'<button type="button" class="upload" onclick="event.preventDefault();event.stopPropagation();postStoredVideo(\''+id+'\',this);return false;">'+(v.posted?'✓ 올림':'올리기')+'</button>'
              +'<button type="button" class="trash" data-delete-video="'+esc(v.id)+'">삭제</button>'
            +'</div>'
          +'</div>';
        }).join('')+'</div>';
      }
      showSheet('내 동영상',html);
    }catch(e){
      showSheet('내 동영상','<div class="rowbox"><b>내 동영상을 불러오지 못했습니다.</b><br>잠시 후 다시 열어 주세요.</div>');
    }
  };

  var oldPlay=window.playStoredVideo;
  if(typeof oldPlay==='function'&&!oldPlay.__ktTitleWrapped){
    var wrapped=function(id){
      var result=oldPlay.apply(this,arguments);
      [100,300,650].forEach(function(ms){
        setTimeout(async function(){
          var item=await getOne(id);
          var b=document.querySelector('.kt-myvideo-player > b');
          if(item&&item.title&&b)b.textContent=item.title;
        },ms);
      });
      return result;
    };
    wrapped.__ktTitleWrapped=true;
    wrapped.__ktOriginal=oldPlay;
    window.playStoredVideo=wrapped;
  }
})();

