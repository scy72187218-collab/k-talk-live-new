/* K-Talk: low-memory startup feed. Keeps approved layout and loads only nearby videos. */
(function(){
  if(window.__ktFeedStartupStabilityLoaded)return;
  window.__ktFeedStartupStabilityLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var started=false;
  var forcing=false;
  var lazyObserver=null;
  var originalHome=window.home;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var cr=document.getElementById('creator');
    if(cr&&cr.classList.contains('show'))return false;
    return true;
  }
  function feedExists(){return !!document.getElementById('ktUnifiedFeed');}

  function fallbackHome(){
    if(feedExists()||!safe())return false;
    try{
      if(originalHome){originalHome();return true;}
    }catch(e){}
    return false;
  }

  function videoCard(x,i){
    var id=esc(x.id||''),u=esc(x.video_url||''),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    var src=i===0?' src="'+u+'"':' data-kt-lazy-src="'+u+'"';
    return '<section class="kt-feed-card" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="'+(i===0?'metadata':'none')+'"'+src+' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
        +'<button onclick="if(window.ktPublicLike)ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button>'
        +'<button onclick="if(window.ktPublicComments)ktPublicComments(\''+id+'\')">💬<small>댓글</small></button>'
        +'<button onclick="if(window.openGifts)openGifts()">🎁<small>선물</small></button>'
        +'<button onclick="if(window.ktPublicShare)ktPublicShare(\''+u.replace(/'/g,"\\'")+'\')">↗<small>공유</small></button>'
      +'</div></section>';
  }

  function liveCard(x){
    var host=esc(x.host_id||'guest'),name=esc(x.host_name||'K-Talk'),title=esc(x.title||x.room_name||'K-Talk LIVE'),room=esc(x.room_name||'라이브 방송');
    return '<section class="kt-feed-card kt-live-feed-card" data-live-host="'+host+'" data-live-title="'+title+'" data-live-room="'+room+'" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;overflow:hidden;background:radial-gradient(circle at 50% 30%,#35102c 0,#120914 40%,#030305 78%);cursor:pointer">'
      +'<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:30px;color:#fff"><div><div style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ff2d55;font-size:20px;font-weight:950;box-shadow:0 0 28px #ff2d5577">● LIVE</div><div style="font-size:72px;margin:28px 0 14px">📡</div><b style="display:block;font-size:27px">'+name+'</b><span style="display:block;margin-top:8px;font-size:19px">'+title+'</span><small style="display:block;margin-top:10px;font-size:15px;opacity:.8">'+room+' · 방송 중</small><strong style="display:block;margin-top:20px;padding:12px 18px;border-radius:999px;background:#ffffff18;border:1px solid #ffffff33;font-size:16px">눌러서 방송 들어가기</strong></div></div>'
      +'<div class="vh-tabs"><span class="on">LIVE</span><span>커뮤니티</span><span>팔로잉</span><span>추천</span><button>⌕</button></div><div class="vh-title"><b>🔴 '+name+'</b><span>'+title+'</span></div></section>';
  }

  function releaseFarVideos(videos,current){
    videos.forEach(function(v,idx){
      if(Math.abs(idx-current)<=1)return;
      if(v.getAttribute('src')){
        try{v.pause();}catch(e){}
        var currentSrc=v.getAttribute('src');
        if(currentSrc&&!v.getAttribute('data-kt-lazy-src'))v.setAttribute('data-kt-lazy-src',currentSrc);
        v.removeAttribute('src');
        try{v.load();}catch(e){}
      }
    });
  }

  function bind(feed){
    var videos=[].slice.call(feed.querySelectorAll('video.kt-public-video'));
    videos.forEach(function(v){
      v.onclick=function(){try{v.muted=false;v.defaultMuted=false;v.volume=1;if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();}catch(e){}};
    });
    if(lazyObserver){try{lazyObserver.disconnect();}catch(e){}}
    if('IntersectionObserver' in window){
      lazyObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){
        var v=entry.target;
        if(entry.isIntersecting){
          var lazy=v.getAttribute('data-kt-lazy-src');
          if(lazy&&!v.getAttribute('src')){v.setAttribute('src',lazy);try{v.load();}catch(e){}}
          var idx=videos.indexOf(v);
          if(idx>-1){
            [idx-1,idx+1].forEach(function(n){
              var near=videos[n];if(!near)return;
              var ns=near.getAttribute('data-kt-lazy-src');
              if(ns&&!near.getAttribute('src')){near.setAttribute('src',ns);try{near.load();}catch(e){}}
            });
            setTimeout(function(){releaseFarVideos(videos,idx);},500);
          }
          try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        }else{try{v.pause();}catch(e){}}
      });},{root:feed,rootMargin:'12% 0px 12% 0px',threshold:[0,.55]});
      videos.forEach(function(v){lazyObserver.observe(v);});
    }
    [].slice.call(feed.querySelectorAll('.kt-live-feed-card')).forEach(function(card){card.onclick=function(){if(window.ktJoinLive)window.ktJoinLive(card.getAttribute('data-live-host')||'guest',card.getAttribute('data-live-title')||'K-Talk LIVE',card.getAttribute('data-live-room')||'라이브 방송');};});
  }

  async function directFeed(useFallback){
    if(feedExists())return true;
    if(forcing||!safe())return false;
    forcing=true;
    try{
      var since=new Date(Date.now()-15000).toISOString();
      var ru=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_name,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=8';
      var vu=SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=20';
      var rs=await Promise.all([fetch(ru,{headers:headers(),cache:'no-store'}),fetch(vu,{headers:headers(),cache:'no-store'})]);
      var lives=rs[0].ok?await rs[0].json():[];
      var videos=rs[1].ok?await rs[1].json():[];
      if(!Array.isArray(lives))lives=[];if(!Array.isArray(videos))videos=[];
      if(!lives.length&&!videos.length){if(useFallback)fallbackHome();return false;}
      var host={};lives=lives.filter(function(x){var k=String(x.host_id||x.id||'guest');if(host[k])return false;host[k]=1;return true;});
      var root=document.getElementById('screen');if(!root){if(useFallback)fallbackHome();return false;}
      document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');
      var firstVideo=videos.length?videoCard(videos[0],0):'';
      var restVideos=videos.slice(1).map(function(v,i){return videoCard(v,i+1);}).join('');
      var html=firstVideo+lives.map(liveCard).join('')+restVideos;
      root.innerHTML='<div id="ktUnifiedFeed" style="height:calc(100dvh - 78px);overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;scroll-snap-type:y mandatory;background:#000">'+html+'</div>';
      var feed=document.getElementById('ktUnifiedFeed');if(feed)bind(feed);
      return !!feed;
    }catch(e){
      if(useFallback)fallbackHome();
      return false;
    }finally{forcing=false;}
  }

  window.ktLowMemoryFeed=function(){return directFeed(true);};
  window.ktRefreshUnifiedFeed=function(){return directFeed(true);};
  window.home=function(){
    try{if(window.activate)window.activate('home');}catch(e){}
    if(feedExists())return;
    if(safe()){
      directFeed(true);
      return;
    }
    fallbackHome();
  };

  function recover(){
    if(feedExists()||!safe())return;
    if(!document.querySelector('.video-home'))return;
    directFeed(false);
  }

  function boot(){
    if(started)return;started=true;
    setTimeout(function(){if(!feedExists()&&safe())directFeed(true);},80);
    setTimeout(function(){if(!feedExists()&&safe())directFeed(true);},500);
    setTimeout(recover,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  try{new MutationObserver(function(){if(!feedExists())setTimeout(recover,120);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();