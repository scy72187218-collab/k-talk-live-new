/* K-Talk 동영상 화면 전용: 현재 영상 작성자 팔로우/방송 상태 + 최종 주소 공유만 보강. 다른 화면/방송 UI는 변경하지 않음. */
(function(){
  if(window.__ktVideoSocialCanonicalFixInstalled)return;
  window.__ktVideoSocialCanonicalFixInstalled=true;

  var CANON='https://k-talk-live-final.vercel.app/';
  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var metaCache={};
  var busy=false;

  window.KTALK_FINAL_URL=CANON;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function me(){
    var name='K-Talk',id='';
    try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    if(!id){
      try{id=localStorage.getItem('ktalk_device_user_id')||'';}catch(e){}
      if(!id){id='device_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);try{localStorage.setItem('ktalk_device_user_id',id);}catch(e){}}
    }
    return {id:String(id).slice(0,80),name:String(name||'K-Talk').slice(0,80)};
  }
  function headers(extra){
    var m=me();
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'x-ktalk-user-id':m.id};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  /* 앱에서 복사·공유하는 K-Talk 주소는 최종 주소 하나만 사용한다. */
  window.ktFinalShareUrl=function(){return CANON;};
  window.shareToTarget=async function(target){
    if(target==='copy'){
      try{await navigator.clipboard.writeText(CANON);alert('K-Talk 최종 주소를 복사했습니다.');}
      catch(e){alert(CANON);}
      return;
    }
    if(navigator.share){
      try{await navigator.share({title:'K-Talk LIVE',text:'K-Talk LIVE 방송을 함께 보세요.',url:CANON});return;}catch(e){if(e&&e.name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(CANON);alert('K-Talk 최종 주소를 복사했습니다.');}catch(e){alert(CANON);}
  };
  window.ktPublicShare=async function(){
    if(navigator.share){
      try{await navigator.share({title:'K-Talk 동영상',text:'K-Talk에서 함께 보세요.',url:CANON});return;}catch(e){if(e&&e.name==='AbortError')return;}
    }
    try{await navigator.clipboard.writeText(CANON);alert('K-Talk 최종 주소를 복사했습니다.');}catch(e){alert(CANON);}
  };
  try{
    var canonical=document.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}
    canonical.href=CANON;
  }catch(e){}

  function ensureStyle(){
    if(document.getElementById('ktVideoSocialCanonicalStyle'))return;
    var s=document.createElement('style');
    s.id='ktVideoSocialCanonicalStyle';
    s.textContent=''
      +'.kt-video-mode #screen .vh-tabs{position:absolute!important;top:10px!important;left:8px!important;right:8px!important;z-index:31!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;color:#fff!important;font-size:12px!important;font-weight:900!important;text-shadow:0 2px 6px #000!important;pointer-events:auto!important}'
      +'.kt-video-mode #screen .vh-tabs span{display:inline-block!important;opacity:.78!important;white-space:nowrap!important;color:#fff!important}.kt-video-mode #screen .vh-tabs span.on{opacity:1!important;border-bottom:2px solid #fff!important;padding-bottom:5px!important}.kt-video-mode #screen .vh-tabs button{margin-left:auto!important;width:32px!important;height:32px!important;border:0!important;background:transparent!important;color:#fff!important;font-size:23px!important;padding:0!important}'
      +'.kt-video-author-social{position:absolute!important;left:10px!important;top:55px!important;z-index:32!important;max-width:calc(100% - 20px)!important;height:46px!important;padding:4px 6px!important;border-radius:999px!important;background:rgba(7,8,13,.76)!important;border:1px solid rgba(255,255,255,.18)!important;display:flex!important;align-items:center!important;gap:6px!important;color:#fff!important;backdrop-filter:blur(6px)!important;box-shadow:0 3px 15px rgba(0,0,0,.25)!important}'
      +'body.kt-follow-status-open .kt-video-author-social{top:124px!important}'
      +'.kt-video-author-social button{border:0!important;touch-action:manipulation!important}'
      +'.kt-video-author-main{height:36px!important;min-width:0!important;max-width:155px!important;padding:0 5px 0 0!important;background:transparent!important;color:#fff!important;display:flex!important;align-items:center!important;gap:7px!important;text-align:left!important}'
      +'.kt-video-author-avatar{width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:50%!important;border:2px solid #2b8cff!important;background:linear-gradient(135deg,#183d70,#222)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:16px!important;font-weight:950!important;box-sizing:border-box!important;overflow:hidden!important}'
      +'.kt-video-author-social.live .kt-video-author-avatar{border-color:#ff244f!important;box-shadow:0 0 10px rgba(255,36,79,.72)!important}'
      +'.kt-video-author-name{display:block!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:11px!important;font-weight:950!important;color:#fff!important}'
      +'.kt-video-author-follow{height:30px!important;padding:0 10px!important;border-radius:999px!important;background:#e91845!important;color:#fff!important;font-size:10px!important;font-weight:950!important;white-space:nowrap!important}'
      +'.kt-video-author-follow.on{background:#44454d!important}'
      +'.kt-video-author-state{height:30px!important;padding:0 9px!important;border-radius:999px!important;background:#246fd1!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important}'
      +'.kt-video-author-social.live .kt-video-author-state{background:#e91845!important;box-shadow:0 0 10px rgba(255,36,79,.45)!important}'
      +'@media(max-width:390px){.kt-video-mode #screen .vh-tabs{gap:9px!important;font-size:11px!important}.kt-video-author-social{left:6px!important;top:51px!important;max-width:calc(100% - 12px)!important}.kt-video-author-main{max-width:128px!important}.kt-video-author-follow{padding:0 8px!important}.kt-video-author-state{padding:0 7px!important}body.kt-follow-status-open .kt-video-author-social{top:121px!important}}';
    document.head.appendChild(s);
  }

  function activeVideo(){
    var list=[].slice.call(document.querySelectorAll('#screen .kt-public-video'));
    if(!list.length)return null;
    var best=null,bestScore=-1;
    list.forEach(function(v){
      var r=v.getBoundingClientRect();
      var top=Math.max(0,r.top),bottom=Math.min(window.innerHeight,r.bottom);
      var score=Math.max(0,bottom-top);
      if(!v.paused)score+=window.innerHeight;
      if(score>bestScore){bestScore=score;best=v;}
    });
    return best;
  }

  async function videoMeta(src){
    src=String(src||'');if(!src)return null;
    if(metaCache[src])return metaCache[src];
    try{
      var r=await fetch(BASE+'ktalk_videos?select=author_id,author_name,video_url&video_url=eq.'+enc(src)+'&limit=1',{headers:headers()});
      if(!r.ok)return null;
      var rows=await r.json();
      var x=rows&&rows[0]?rows[0]:null;
      if(x)metaCache[src]=x;
      return x;
    }catch(e){return null;}
  }

  async function socialState(authorId){
    var m=me(),following=false,live=false,photo='';
    if(!authorId)return {following:false,live:false,photo:''};
    if(authorId!==m.id){
      try{
        var fr=await fetch(BASE+'ktalk_user_follows?select=following_id&follower_id=eq.'+enc(m.id)+'&following_id=eq.'+enc(authorId)+'&limit=1',{headers:headers()});
        if(fr.ok){var fa=await fr.json();following=!!(fa&&fa[0]);}
      }catch(e){}
    }
    try{
      var cut=new Date(Date.now()-55000).toISOString();
      var lr=await fetch(BASE+'ktalk_live_rooms?select=host_id,host_photo&host_id=eq.'+enc(authorId)+'&active=eq.true&updated_at=gte.'+enc(cut)+'&order=updated_at.desc&limit=1',{headers:headers()});
      if(lr.ok){var la=await lr.json();if(la&&la[0]){live=true;photo=String(la[0].host_photo||'');if(photo.length>240000)photo='';}}
    }catch(e){}
    return {following:following,live:live,photo:photo};
  }

  function avatarHtml(name,photo){
    if(photo&&(/^data:image/.test(photo)||/^https?:/.test(photo)))return '<img src="'+esc(photo)+'" alt="" style="width:100%;height:100%;object-fit:cover">';
    return esc(String(name||'K').trim().charAt(0)||'K');
  }

  async function renderCurrent(){
    if(busy)return;
    var v=activeVideo();
    if(!v){document.querySelectorAll('.kt-video-author-social').forEach(function(x){x.remove();});return;}
    var section=v.closest('section')||v.parentElement;
    if(!section)return;
    busy=true;
    try{
      var src=v.currentSrc||v.src;
      var meta=await videoMeta(src);
      if(!meta||!meta.author_id){document.querySelectorAll('.kt-video-author-social').forEach(function(x){x.remove();});return;}
      var authorId=String(meta.author_id),authorName=String(meta.author_name||'K-Talk');
      var st=await socialState(authorId),m=me();
      document.querySelectorAll('.kt-video-author-social').forEach(function(x){if(x.parentNode!==section)x.remove();});
      var box=section.querySelector('.kt-video-author-social');
      if(!box){box=document.createElement('div');box.className='kt-video-author-social';section.appendChild(box);}
      box.classList.toggle('live',st.live);
      box.dataset.authorId=authorId;
      box.innerHTML=''
        +'<button type="button" class="kt-video-author-main" aria-label="'+esc(authorName)+' 프로필"><span class="kt-video-author-avatar">'+avatarHtml(authorName,st.photo)+'</span><span class="kt-video-author-name">'+esc(authorName)+'</span></button>'
        +(authorId===m.id?'<span style="font-size:9px;font-weight:900;color:#ddd;padding:0 5px">내 영상</span>':'<button type="button" class="kt-video-author-follow'+(st.following?' on':'')+'">'+(st.following?'✓ 팔로잉':'+ 팔로우')+'</button>')
        +'<button type="button" class="kt-video-author-state">'+(st.live?'● LIVE':'● 방송 안 함')+'</button>';
      var main=box.querySelector('.kt-video-author-main');
      if(main)main.onclick=function(e){e.stopPropagation();if(window.ktOpenLiveHostActions)window.ktOpenLiveHostActions(authorId,authorName,st.photo);};
      var follow=box.querySelector('.kt-video-author-follow');
      if(follow)follow.onclick=function(e){e.stopPropagation();if(window.ktToggleLiveHostFollow){window.ktToggleLiveHostFollow(authorId,authorName,this).then(function(){setTimeout(renderCurrent,80);});}};
      var stateBtn=box.querySelector('.kt-video-author-state');
      if(stateBtn)stateBtn.onclick=function(e){e.stopPropagation();if(st.live&&window.ktEnterRemoteLive)window.ktEnterRemoteLive(authorId);};
    }catch(e){}finally{busy=false;}
  }

  ensureStyle();
  var scanTimer=null;
  function schedule(){clearTimeout(scanTimer);scanTimer=setTimeout(renderCurrent,100);}
  try{
    new MutationObserver(function(mutations){
      for(var i=0;i<mutations.length;i++){
        var t=mutations[i].target;
        if(t&&t.closest&&t.closest('.kt-video-author-social'))continue;
        schedule();
        break;
      }
    }).observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  }catch(e){}
  document.addEventListener('scroll',schedule,true);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('focus',schedule);
  setTimeout(renderCurrent,100);
  setTimeout(renderCurrent,700);
  setInterval(renderCurrent,8000);
})();
