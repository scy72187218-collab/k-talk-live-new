/* K-Talk 1인방 오른쪽 중복 버튼만 정리: 효과 1개, 보물상자 1개만 유지. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktSoloRightDedupeInstalled)return;
  window.__ktSoloRightDedupeInstalled=true;

  /* 1인 방송 오른쪽 버튼 묶음만 조금 아래로 내린다. 13명/구독자/비밀방은 변경하지 않음. */
  if(!document.getElementById('ktSoloRightLower20260912')){
    var st=document.createElement('style');
    st.id='ktSoloRightLower20260912';
    st.textContent='html.kt-att-led-target:not(.kt-compact-two-room) body #ktSept2Live.kt-added-ui-room .kt-s2-right{bottom:135px!important;}';
    document.head.appendChild(st);
  }

  function buttonKind(btn){
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var onclick=String(btn.getAttribute('onclick')||'');
    if(text.indexOf('효과')>-1||text.indexOf('✨')>-1||onclick.indexOf('ktSoloEffect')>-1||onclick.indexOf('openEditEffectPanel')>-1)return 'effect';
    if(text.indexOf('보물상자')>-1||text.indexOf('🎁')>-1||onclick.indexOf('openTreasure')>-1||onclick.indexOf('openGifts')>-1||onclick.indexOf('ktRenderTreasure')>-1)return 'treasure';
    return '';
  }

  function dedupe(){
    var box=document.querySelector('.ktsolo-right');
    if(!box)return;
    var seen={effect:false,treasure:false};
    Array.prototype.slice.call(box.querySelectorAll('button')).forEach(function(btn){
      var kind=buttonKind(btn);
      if(!kind)return;
      if(seen[kind])btn.remove();
      else seen[kind]=true;
    });
  }

  dedupe();
  setTimeout(dedupe,60);
  setTimeout(dedupe,250);
  var observer=new MutationObserver(function(){dedupe();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();

/* 내 프로필 복구 전용 파일만 연결. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(document.querySelector('script[data-kt-profile-restore-only]'))return;
  var s=document.createElement('script');
  s.src='profile-restore-only.js?v=20260912-profile1';
  s.async=false;
  s.setAttribute('data-kt-profile-restore-only','1');
  document.head.appendChild(s);
})();

/* 프로필 사진만 예전 저장값에서 복구하고, 프로필을 닫으면 뒤에 보던 영상만 다시 재생한다. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfilePhotoAndReturnFixInstalled)return;
  window.__ktProfilePhotoAndReturnFixInstalled=true;

  function clean(v){return String(v==null?'':v).trim();}
  function validPhoto(v){v=clean(v);return !!v&&(v.indexOf('data:image/')===0||v.indexOf('blob:')===0||/^https?:\/\//i.test(v));}

  function findLegacyPhoto(){
    var direct=['ktalk_profile_photo','ktalk_profile_image','ktalk_profile_avatar','profile_photo','profile_image','profile_avatar'];
    try{
      for(var i=0;i<direct.length;i++){
        var v=localStorage.getItem(direct[i])||'';
        if(validPhoto(v))return v;
      }
    }catch(e){}

    try{
      for(var j=0;j<localStorage.length;j++){
        var key=localStorage.key(j)||'';
        if(key.indexOf('ktalk_profile_v1:')!==0)continue;
        var raw=localStorage.getItem(key)||'';
        if(!raw)continue;
        var p=JSON.parse(raw)||{};
        if(validPhoto(p.photo))return p.photo;
      }
    }catch(e){}

    var jsonKeys=['ktalk_profile','ktalkProfile','profile','user_profile','ktalk_user_profile'];
    try{
      for(var k=0;k<jsonKeys.length;k++){
        var r=localStorage.getItem(jsonKeys[k]);
        if(!r)continue;
        var x=JSON.parse(r)||{};
        var img=x.photo||x.image||x.avatar||x.profilePhoto||x.profile_image||'';
        if(validPhoto(img))return img;
      }
    }catch(e){}
    return '';
  }

  function restorePhoto(){
    try{
      if(typeof window.ktProfileLoad!=='function'||typeof window.ktProfileStorageKey!=='function')return;
      var p=window.ktProfileLoad()||{};
      if(validPhoto(p.photo))return;
      var found=findLegacyPhoto();
      if(!found)return;
      p.photo=found;
      localStorage.setItem(window.ktProfileStorageKey(),JSON.stringify(p));
      var box=document.querySelector('.kt-my-profile-photo');
      if(box){
        var img=box.querySelector('img');
        if(!img){img=document.createElement('img');img.alt='프로필 사진';box.insertBefore(img,box.firstChild);}
        img.src=found;
      }
    }catch(e){}
  }

  function resumeVisibleVideo(){
    try{
      var list=document.querySelectorAll('.kt-public-video,#homeVideo');
      for(var i=0;i<list.length;i++){
        var v=list[i];
        if(!v||!v.isConnected)continue;
        var r=v.getBoundingClientRect();
        var vh=window.innerHeight||document.documentElement.clientHeight||0;
        var vw=window.innerWidth||document.documentElement.clientWidth||0;
        if(r.width>1&&r.height>1&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw){
          var play=v.play();
          if(play&&play.catch)play.catch(function(){});
          break;
        }
      }
    }catch(e){}
  }

  function install(){
    if(typeof window.openProfileDirect==='function'&&!window.openProfileDirect.__ktPhotoReturnFix){
      var oldOpen=window.openProfileDirect;
      var open=function(){
        window.__ktProfileWasOpened=true;
        restorePhoto();
        var r=oldOpen.apply(this,arguments);
        setTimeout(restorePhoto,60);
        return r;
      };
      open.__ktPhotoReturnFix=true;
      window.openProfileDirect=open;
    }

    if(typeof window.closeSheet==='function'&&!window.closeSheet.__ktPhotoReturnFix){
      var oldClose=window.closeSheet;
      var close=function(){
        var wasProfile=!!window.__ktProfileWasOpened;
        var r=oldClose.apply(this,arguments);
        if(wasProfile){
          window.__ktProfileWasOpened=false;
          resumeVisibleVideo();
          setTimeout(resumeVisibleVideo,80);
        }
        return r;
      };
      close.__ktPhotoReturnFix=true;
      window.closeSheet=close;
    }
  }

  restorePhoto();
  install();
  [100,300,700,1500].forEach(function(ms){setTimeout(function(){install();restorePhoto();},ms);});
})();

/* 내 동영상의 '동영상 올리기'만 보강. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktVideoUploadOnlyFixInstalled)return;
  window.__ktVideoUploadOnlyFixInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBiYXNlIiwicmVmIjoienVwd2JmbWFjd3pleHl2em5senEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4ODQ2MTA3NiwiZXhwIjoyMTA0MDM3MDc2fQ.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var MAX=100*1024*1024;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function who(){
    var name='K-Talk',id='guest';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad();
        if(p&&p.name)name=p.name;
      }
    }catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return {name:String(name||'K-Talk').slice(0,80),id:String(id||'guest').slice(0,80)};
  }
  function mime(blob,name){
    var t=String(blob&&blob.type||'').toLowerCase();
    var n=String(name||'').toLowerCase();
    if(t==='video/mp4'||t==='video/quicktime'||t==='video/x-m4v'||t==='video/webm')return t;
    if(/\.mov$/.test(n))return 'video/quicktime';
    if(/\.m4v$/.test(n))return 'video/x-m4v';
    if(/\.webm$/.test(n))return 'video/webm';
    return 'video/mp4';
  }
  function ext(type){
    if(type==='video/quicktime')return 'mov';
    if(type==='video/x-m4v')return 'm4v';
    if(type==='video/webm')return 'webm';
    return 'mp4';
  }
  async function getItem(id){
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
  async function putItem(item){
    var db=await ktOpenVideoDB();
    await new Promise(function(resolve,reject){
      var tx=db.transaction('videos','readwrite');
      tx.objectStore('videos').put(item);
      tx.oncomplete=resolve;
      tx.onerror=function(){reject(tx.error||new Error('save'));};
      tx.onabort=function(){reject(tx.error||new Error('save'));};
    });
    try{db.close();}catch(e){}
  }
  function clearFeedCache(){
    try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
    try{sessionStorage.removeItem('kt_feed_fresh_at');}catch(e){}
  }
  async function upload(item){
    var blob=item&&item.blob;
    if(!blob)throw new Error('파일 없음');
    if(Number(blob.size||0)>MAX)throw new Error('100MB보다 큰 동영상은 올릴 수 없습니다.');
    var type=mime(blob,item.name);
    var a=who();
    var clean=String(a.id||'guest').replace(/[^a-zA-Z0-9_-]/g,'_')||'guest';
    var path=clean+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext(type);
    var up=await fetch(SB+'/storage/v1/object/ktalk-videos/'+path,{method:'POST',headers:headers({'Content-Type':type,'x-upsert':'false'}),body:blob});
    if(!up.ok){
      var ut='';try{ut=await up.text();}catch(e){}
      throw new Error(up.status===413?'100MB보다 큰 동영상은 올릴 수 없습니다.':('영상 전송 실패 '+up.status+(ut?' '+ut:'')));
    }
    var url=SB+'/storage/v1/object/public/ktalk-videos/'+path;
    var ins=await fetch(SB+'/rest/v1/ktalk_videos',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify({author_id:a.id,author_name:a.name,title:item.name||'K-Talk 동영상',video_path:path,video_url:url})});
    if(!ins.ok){
      var it='';try{it=await ins.text();}catch(e){}
      throw new Error('목록 등록 실패 '+ins.status+(it?' '+it:''));
    }
    var rows=await ins.json();
    return rows&&rows[0]?rows[0]:{id:'',video_url:url};
  }

  window.postStoredVideo=async function(id,btn){
    if(btn&&btn.dataset.ktUploading==='1')return;
    if(btn){btn.dataset.ktUploading='1';btn.disabled=true;btn.textContent='올리는 중...';}
    try{
      var item=await getItem(id);
      if(!item||!item.blob)throw new Error('동영상을 찾지 못했습니다.');
      if(!item.publicVideoId){
        var row=await upload(item);
        item.publicPosted=true;
        item.publicVideoId=row&&row.id?row.id:'';
        item.publicVideoUrl=row&&row.video_url?row.video_url:'';
      }
      item.posted=true;
      item.postedAt=item.postedAt||Date.now();
      await putItem(item);
      clearFeedCache();
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
      if(btn){btn.textContent='✓ 올리기 완료';btn.classList.add('done');}
      try{if(window.closeSheet)window.closeSheet();}catch(e){}
      setTimeout(function(){try{if(window.home)window.home();}catch(e){}},120);
    }catch(e){
      if(btn){btn.disabled=false;btn.dataset.ktUploading='0';btn.textContent='다시 올리기';}
      alert(String(e&&e.message||'동영상을 올리지 못했습니다. 다시 눌러 주세요.'));
      return;
    }
    if(btn)btn.dataset.ktUploading='0';
  };
})();
