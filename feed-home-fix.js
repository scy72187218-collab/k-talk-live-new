/* K-Talk home feed fix: show uploaded videos + active LIVE cards in one vertical swipe feed. */
(function(){
  if(window.__ktHomeFeedFixInstalled)return;
  window.__ktHomeFeedFixInstalled=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var heartbeatTimer=null;
  var livePresenceOn=false;

  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY};if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});return h;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
  function who(){var name='K-Talk',id='guest';try{name=state.profileName||state.currentProfileName||state.accountName||name;id=state.profileId||state.currentAccountId||state.accountId||id;}catch(e){}try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}return {name:String(name).slice(0,80),id:String(id).slice(0,80)};}

  async function getVideos(){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{headers:headers()});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  async function getLives(){
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=20';
      var r=await fetch(u,{headers:headers()});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  function videoCard(x,i){
    var id=esc(x.id),u=esc(x.video_url),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    return '<section class="kt-feed-card" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="metadata" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
        +'<button onclick="ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button>'
        +'<button onclick="ktPublicComments(\''+id+'\')">💬<small>댓글</small></button>'
        +'<button onclick="openGifts()">🎁<small>선물</small></button>'
        +'<button onclick="ktPublicShare(\''+u+'\')">↗<small>공유</small></button>'
      +'</div>'
    +'</section>';
  }

  function liveCard(x){
    var name=esc(x.host_name||'K-Talk'),title=esc(x.title||x.room_name||'K-Talk LIVE'),room=esc(x.room_name||'라이브 방송');
    return '<section class="kt-feed-card kt-live-feed-card" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;overflow:hidden;background:radial-gradient(circle at 50% 30%,#35102c 0,#120914 40%,#030305 78%)">'
      +'<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:30px;color:#fff">'
        +'<div><div style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ff2d55;font-size:20px;font-weight:950;box-shadow:0 0 28px #ff2d5577">● LIVE</div>'
        +'<div style="font-size:72px;margin:28px 0 14px">📡</div>'
        +'<b style="display:block;font-size:27px">'+name+'</b><span style="display:block;margin-top:8px;font-size:19px">'+title+'</span><small style="display:block;margin-top:10px;font-size:15px;opacity:.8">'+room+' · 방송 중</small></div>'
      +'</div>'
      +'<div class="vh-tabs"><span class="on">LIVE</span><span>커뮤니티</span><span>팔로잉</span><span>추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>🔴 '+name+'</b><span>'+title+'</span></div>'
    +'</section>';
  }

  function bindVideos(){
    var vs=[].slice.call(document.querySelectorAll('.kt-public-video'));
    vs.forEach(function(v){
      v.onclick=function(){
        try{v.muted=false;v.defaultMuted=false;v.volume=1;}catch(e){}
        if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}
      };
    });
    if('IntersectionObserver'in window){
      var ob=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.6){e.target.play().catch(function(){});}else{e.target.pause();}});},{threshold:[.6]});
      vs.forEach(function(v){ob.observe(v);});
    }
  }

  var fallbackHome=window.home;
  var fallbackMedia=window.media;

  async function showFeed(fallback){
    var results=await Promise.all([getLives(),getVideos()]);
    var lives=results[0]||[],videos=results[1]||[];
    if(!lives.length&&!videos.length){if(fallback)fallback();return;}
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    var html=lives.map(liveCard).join('')+videos.map(function(v,i){return videoCard(v,i+lives.length);}).join('');
    screen.innerHTML='<div id="ktUnifiedFeed" style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+html+'</div>';
    bindVideos();
  }

  window.home=function(){try{if(window.activate)activate('home');}catch(e){}showFeed(fallbackHome);};
  window.media=function(type){try{if(window.activate)activate(type);}catch(e){}showFeed(function(){if(fallbackMedia)fallbackMedia(type);});};
  window.ktRefreshUnifiedFeed=function(){return showFeed(fallbackHome);};

  async function setPresence(active){
    var me=who();
    var title='K-Talk LIVE',roomType='solo',roomName='1인 방송';
    try{title=state.currentLiveRoomTitle||document.getElementById('liveTitle')&&document.getElementById('liveTitle').value||title;roomType=state.liveRoomType||roomType;roomName=state.liveRoomName||roomName;}catch(e){}
    try{
      if(active){
        var body={host_id:me.id,host_name:me.name,title:String(title||roomName).slice(0,120),room_type:String(roomType).slice(0,40),room_name:String(roomName).slice(0,80),active:true,started_at:new Date().toISOString(),updated_at:new Date().toISOString()};
        var r=await fetch(SB+'/rest/v1/ktalk_live_rooms?on_conflict=host_id',{method:'POST',headers:headers({'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(body)});
        if(r.ok){livePresenceOn=true;clearInterval(heartbeatTimer);heartbeatTimer=setInterval(function(){touchPresence();},20000);}
      }else{
        clearInterval(heartbeatTimer);heartbeatTimer=null;livePresenceOn=false;
        await fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:false,updated_at:new Date().toISOString()})});
      }
    }catch(e){}
  }

  async function touchPresence(){
    if(!livePresenceOn)return;
    var me=who();
    try{await fetch(SB+'/rest/v1/ktalk_live_rooms?host_id=eq.'+encodeURIComponent(me.id),{method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({active:true,updated_at:new Date().toISOString()})});}catch(e){}
  }

  /* 방송이 열리면 바깥 피드에 즉시 LIVE로 등록한다. */
  window.ktSetLivePresence=setPresence;
  function announceLiveSoon(){
    setTimeout(function(){
      try{
        var liveView=document.getElementById('ktLiveVideo');
        var liveTrack=state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';});
        if(liveView||liveTrack)setPresence(true);
      }catch(e){}
    },120);
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var r=await oldStart.apply(this,arguments);
      announceLiveSoon();
      return r;
    };
  }

  var oldTestStart=window.startTestBroadcast;
  if(typeof oldTestStart==='function'){
    window.startTestBroadcast=async function(){
      var r=await oldTestStart.apply(this,arguments);
      announceLiveSoon();
      return r;
    };
  }

  var oldEnd=window.endBroadcastEarnings;
  if(typeof oldEnd==='function'){
    window.endBroadcastEarnings=function(){setPresence(false);return oldEnd.apply(this,arguments);};
  }
  var oldTestEnd=window.endTestBroadcast;
  if(typeof oldTestEnd==='function'){
    window.endTestBroadcast=function(){setPresence(false);return oldTestEnd.apply(this,arguments);};
  }

  /* 혹시 다른 시작 버튼이 startBroadcast를 다시 덮어써도 실제 라이브 화면이 뜨면 자동 등록한다. */
  var liveDomObserver=null;
  try{
    liveDomObserver=new MutationObserver(function(){
      var liveView=document.getElementById('ktLiveVideo');
      if(liveView&&!livePresenceOn)setPresence(true);
    });
    liveDomObserver.observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pagehide',function(){if(livePresenceOn)setPresence(false);});

  setTimeout(function(){
    try{
      var creatorOpen=window.creator&&creator.classList&&creator.classList.contains('show');
      var liveOpen=document.getElementById('ktLiveVideo');
      if(liveOpen&&!livePresenceOn)setPresence(true);
      if(!creatorOpen&&!liveOpen)window.home();
    }catch(e){}
  },450);
})();