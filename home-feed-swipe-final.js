/* K-Talk: final home feed lock. First item is always a real video; active LIVE cards appear while swiping. */
(function(){
  if(window.__ktHomeFeedSwipeFinalLoaded)return;
  window.__ktHomeFeedSwipeFinalLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var busy=false;
  var ob=null;
  var SEED=[
    {id:'seed-1',author_name:'K-Talk',title:'14254.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4',likes:0},
    {id:'seed-2',author_name:'K-Talk',title:'14402.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516656323-4elqcf.mp4',likes:0},
    {id:'seed-3',author_name:'K-Talk',title:'14402.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516653502-crprae.mp4',likes:0}
  ];

  function headers(){return {apikey:KEY,Accept:'application/json'};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function safe(){
    if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return false;
    var c=document.getElementById('creator');
    if(c&&c.classList.contains('show'))return false;
    return true;
  }
  function root(){return document.getElementById('screen');}
  function feed(){return document.getElementById('ktUnifiedFeed');}

  function videoCard(x,i){
    var id=esc(x.id||''),u=esc(x.video_url||''),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    var source=i===0?' src="'+u+'"':' data-kt-src="'+u+'"';
    return '<section class="kt-feed-card" data-kind="video" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline webkit-playsinline preload="'+(i===0?'auto':'none')+'"'+source+' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button aria-label="검색">⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
      +'<button onclick="if(window.ktPublicLike)ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button>'
      +'<button onclick="if(window.ktPublicComments)ktPublicComments(\''+id+'\')">💬<small>댓글</small></button>'
      +'<button onclick="if(window.openGifts)openGifts()">🎁<small>선물</small></button>'
      +'<button onclick="if(window.ktPublicShare)ktPublicShare(\''+u.replace(/'/g,"\\'")+'\')">↗<small>공유</small></button>'
      +'</div></section>';
  }

  function liveCard(x){
    var host=esc(x.host_id||'guest'),name=esc(x.host_name||'K-Talk'),title=esc(x.title||x.room_name||'K-Talk LIVE'),room=esc(x.room_name||'라이브 방송'),photo=esc(x.host_photo||'');
    var bg=photo?'<img src="'+photo+'" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.55)">':'';
    return '<section class="kt-feed-card kt-live-feed-card" data-kind="live" data-live-host="'+host+'" data-live-title="'+title+'" data-live-room="'+room+'" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;overflow:hidden;background:radial-gradient(circle at 50% 30%,#35102c 0,#120914 42%,#030305 80%);cursor:pointer">'
      +bg
      +'<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:30px;color:#fff;background:linear-gradient(180deg,#0002,#0007)"><div><div style="display:inline-block;padding:10px 18px;border-radius:999px;background:#ff2d55;font-size:20px;font-weight:950;box-shadow:0 0 24px #ff2d5577">● LIVE</div><div style="font-size:62px;margin:24px 0 12px">📡</div><b style="display:block;font-size:27px">'+name+'</b><span style="display:block;margin-top:8px;font-size:18px">'+title+'</span><small style="display:block;margin-top:9px;font-size:14px;opacity:.82">'+room+' · 방송 중</small><strong style="display:block;margin-top:18px;padding:12px 18px;border-radius:999px;background:#ffffff18;border:1px solid #ffffff33;font-size:16px">눌러서 방송 들어가기</strong></div></div>'
      +'<div class="vh-tabs"><span class="on">LIVE</span><span>커뮤니티</span><span>팔로잉</span><span>추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>🔴 '+name+'</b><span>'+title+'</span></div></section>';
  }

  function compose(videos,lives){
    var out=[];
    videos=(Array.isArray(videos)&&videos.length)?videos:SEED;
    lives=Array.isArray(lives)?lives:[];
    if(videos[0])out.push(videoCard(videos[0],0));
    var vi=1,li=0;
    while(vi<videos.length||li<lives.length){
      if(li<lives.length)out.push(liveCard(lives[li++]));
      if(vi<videos.length)out.push(videoCard(videos[vi],vi++));
    }
    return out.join('');
  }

  function bind(f){
    if(!f)return;
    var vs=[].slice.call(f.querySelectorAll('video.kt-public-video'));
    vs.forEach(function(v){
      v.removeAttribute('poster');
      v.muted=true;v.defaultMuted=true;v.autoplay=true;v.loop=true;
      v.setAttribute('muted','');v.setAttribute('autoplay','');v.setAttribute('loop','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
      v.onclick=function(){try{if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();}catch(e){}};
    });
    if(ob){try{ob.disconnect();}catch(e){}}
    if('IntersectionObserver' in window){
      ob=new IntersectionObserver(function(entries){entries.forEach(function(entry){
        var v=entry.target;
        if(entry.isIntersecting&&entry.intersectionRatio>.35){
          var lazy=v.getAttribute('data-kt-src');
          if(lazy&&!v.getAttribute('src')){v.src=lazy;try{v.load();}catch(e){}}
          try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        }else{try{v.pause();}catch(e){}}
      });},{root:f,threshold:[.35]});
      vs.forEach(function(v){ob.observe(v);});
    }
    [].slice.call(f.querySelectorAll('.kt-live-feed-card')).forEach(function(card){
      card.onclick=function(){
        if(window.ktJoinLive)window.ktJoinLive(card.getAttribute('data-live-host')||'guest',card.getAttribute('data-live-title')||'K-Talk LIVE',card.getAttribute('data-live-room')||'라이브 방송');
      };
    });
    if(vs[0]){try{var p0=vs[0].play();if(p0&&p0.catch)p0.catch(function(){});}catch(e){}}
  }

  function render(videos,lives){
    if(!safe())return false;
    var r=root();if(!r)return false;
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    r.innerHTML='<div id="ktUnifiedFeed" style="height:calc(100dvh - 78px);overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;scroll-snap-type:y mandatory;background:#000">'+compose(videos,lives)+'</div>';
    bind(feed());
    return true;
  }

  async function refresh(){
    if(busy||!safe())return;
    busy=true;
    try{
      var since=new Date(Date.now()-20000).toISOString();
      var vu=SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=12';
      var lu=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_name,host_photo,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=8';
      var rs=await Promise.all([fetch(vu,{headers:headers(),cache:'no-store'}),fetch(lu,{headers:headers(),cache:'no-store'})]);
      var videos=rs[0].ok?await rs[0].json():SEED;
      var lives=rs[1].ok?await rs[1].json():[];
      if(!Array.isArray(videos)||!videos.length)videos=SEED;
      if(!Array.isArray(lives))lives=[];
      if(safe())render(videos,lives);
    }catch(e){}finally{busy=false;}
  }

  function startHome(){
    if(!safe())return;
    render(SEED,[]);
    setTimeout(refresh,120);
  }

  window.ktHomeFeedStart=startHome;
  window.home=function(){try{if(window.activate)window.activate('home');}catch(e){}startHome();};
  window.media=function(type){try{if(window.activate)window.activate(type);}catch(e){}startHome();};

  function boot(){
    if(!safe())return;
    var f=feed();
    if(!f)startHome();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
  setTimeout(boot,120);
  setTimeout(boot,500);
  setTimeout(boot,1200);
})();
