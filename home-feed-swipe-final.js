/* K-Talk: final home feed owner. First item is a real video; swipe keeps videos moving; LIVE is entered only by tap. */
(function(){
  if(window.__ktHomeFeedSwipeFinalLoaded)return;
  window.__ktHomeFeedSwipeFinalLoaded=true;
  window.__ktManualLiveEntryOnly=true;
  window.__ktFinalHomeOwner=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var SOUND_KEY='kt_home_sound_enabled';
  var busy=false;
  var refreshDone=false;
  var activeIndex=0;
  var scrollTimer=null;
  var SEED=[
    {id:'seed-1',author_name:'K-Talk',title:'14254.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4',likes:0},
    {id:'seed-2',author_name:'K-Talk',title:'14402.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516656323-4elqcf.mp4',likes:0},
    {id:'seed-3',author_name:'K-Talk',title:'14402.mp4',video_url:'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516653502-crprae.mp4',likes:0}
  ];

  function headers(){return {apikey:KEY,Accept:'application/json'};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
  function safe(){
    if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return false;
    var c=document.getElementById('creator');
    if(c&&c.classList.contains('show'))return false;
    return true;
  }
  function root(){return document.getElementById('screen');}
  function feed(){return document.getElementById('ktUnifiedFeed');}
  function soundOn(){try{return localStorage.getItem(SOUND_KEY)==='1';}catch(e){return false;}}
  function rememberSound(){try{localStorage.setItem(SOUND_KEY,'1');}catch(e){}}

  function videoCard(x,i){
    var id=esc(x.id||''),u=esc(x.video_url||''),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    var source=i===0?' src="'+u+'"':' data-kt-src="'+u+'"';
    return '<section class="kt-feed-card" data-kind="video" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline webkit-playsinline preload="'+(i===0?'auto':'metadata')+'"'+source+' style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
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
      if(vi<videos.length)out.push(videoCard(videos[vi],vi++));
      if(li<lives.length)out.push(liveCard(lives[li++]));
    }
    return out.join('');
  }

  function cards(f){return f?[].slice.call(f.querySelectorAll('.kt-feed-card')):[];}
  function videos(f){return f?[].slice.call(f.querySelectorAll('video.kt-public-video')):[];}
  function ensureSource(v){
    if(!v)return;
    var lazy=v.getAttribute('data-kt-src');
    if(lazy&&!v.getAttribute('src')){
      v.src=lazy;
      v.removeAttribute('data-kt-src');
      v.preload='auto';
      try{v.load();}catch(e){}
    }
  }
  function setSound(v,on){
    if(!v)return;
    try{
      v.volume=on?1:0;
      v.muted=!on;
      v.defaultMuted=!on;
      if(on)v.removeAttribute('muted');else v.setAttribute('muted','');
    }catch(e){}
  }
  function playVideo(v,on){
    if(!v)return;
    ensureSource(v);
    setSound(v,on);
    try{
      var p=v.play();
      if(p&&p.catch)p.catch(function(){
        if(!on)return;
        try{setSound(v,false);var p2=v.play();if(p2&&p2.catch)p2.catch(function(){});}catch(e){}
      });
    }catch(e){}
  }
  function nearestIndex(f){
    var cs=cards(f);if(!cs.length)return 0;
    var top=f.getBoundingClientRect().top,best=0,dist=Infinity;
    cs.forEach(function(c,i){var d=Math.abs(c.getBoundingClientRect().top-top);if(d<dist){dist=d;best=i;}});
    return best;
  }
  function activate(i,gesture){
    var f=feed();if(!f)return;
    var cs=cards(f);if(!cs.length)return;
    if(i<0)i=0;if(i>=cs.length)i=cs.length-1;
    activeIndex=i;
    var on=soundOn();
    cs.forEach(function(c,n){
      var v=c.querySelector('video.kt-public-video');
      if(!v)return;
      if(n===i){playVideo(v,on);}else{try{v.pause();}catch(e){}}
    });
    for(var n=i+1;n<=Math.min(i+2,cs.length-1);n++){
      var nv=cs[n].querySelector('video.kt-public-video');
      if(nv){ensureSource(nv);nv.preload='metadata';}
    }
  }
  function unlockCurrentSound(){
    var f=feed();if(!f)return;
    var cs=cards(f);if(!cs.length)return;
    activeIndex=nearestIndex(f);
    var v=cs[activeIndex]&&cs[activeIndex].querySelector('video.kt-public-video');
    if(!v)return;
    rememberSound();
    ensureSource(v);
    setSound(v,true);
    try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }

  function bind(f){
    if(!f||f.dataset.ktFinalBound==='1')return;
    f.dataset.ktFinalBound='1';
    videos(f).forEach(function(v){
      v.removeAttribute('poster');
      v.loop=true;
      v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.setAttribute('loop','');
      setSound(v,soundOn());
      v.addEventListener('click',function(ev){
        ev.stopPropagation();
        if(!soundOn()){unlockCurrentSound();return;}
        try{if(v.paused)playVideo(v,true);else v.pause();}catch(e){}
      });
      v.addEventListener('ended',function(){try{v.currentTime=0;playVideo(v,soundOn());}catch(e){};});
      v.addEventListener('stalled',function(){setTimeout(function(){if(v.closest('.kt-feed-card')===cards(f)[activeIndex])playVideo(v,soundOn());},180);});
    });

    f.addEventListener('touchstart',function(){if(!soundOn())unlockCurrentSound();},{passive:true});
    f.addEventListener('pointerdown',function(){if(!soundOn())unlockCurrentSound();},{passive:true});
    f.addEventListener('touchend',function(){setTimeout(function(){activate(nearestIndex(f),true);},0);},{passive:true});
    f.addEventListener('scroll',function(){
      clearTimeout(scrollTimer);
      scrollTimer=setTimeout(function(){activate(nearestIndex(f),false);},70);
    },{passive:true});

    [].slice.call(f.querySelectorAll('.kt-live-feed-card')).forEach(function(card){
      card.onclick=function(){
        var vs=videos(f);vs.forEach(function(v){try{v.pause();}catch(e){}});
        if(window.ktJoinLive)window.ktJoinLive(card.getAttribute('data-live-host')||'guest',card.getAttribute('data-live-title')||'K-Talk LIVE',card.getAttribute('data-live-room')||'라이브 방송');
      };
    });
    activate(0,false);
  }

  function render(videosList,lives){
    if(!safe())return false;
    var r=root();if(!r)return false;
    try{document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');}catch(e){}
    r.innerHTML='<div id="ktUnifiedFeed" data-kt-final-home="1" style="height:calc(100dvh - 78px);overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;scroll-snap-type:y mandatory;background:#000">'+compose(videosList,lives)+'</div>';
    bind(feed());
    return true;
  }

  async function refresh(){
    if(busy||refreshDone||!safe())return;
    busy=true;
    try{
      var since=new Date(Date.now()-20000).toISOString();
      var vu=SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=12';
      var lu=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_name,host_photo,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=updated_at.desc&limit=8';
      var rs=await Promise.all([fetch(vu,{headers:headers(),cache:'no-store'}),fetch(lu,{headers:headers(),cache:'no-store'})]);
      var list=rs[0].ok?await rs[0].json():SEED;
      var lives=rs[1].ok?await rs[1].json():[];
      if(!Array.isArray(list)||!list.length)list=SEED;
      if(!Array.isArray(lives))lives=[];
      if(safe())render(list,lives);
      refreshDone=true;
    }catch(e){}finally{busy=false;}
  }

  function startHome(force){
    if(!safe())return;
    var f=feed();
    if(f&&f.getAttribute('data-kt-final-home')==='1'&&!force){bind(f);activate(nearestIndex(f),false);return;}
    refreshDone=false;
    render(SEED,[]);
    setTimeout(refresh,80);
  }

  window.ktHomeFeedStart=function(){startHome(true);};
  window.home=function(){try{if(window.activate)window.activate('home');}catch(e){}startHome(true);};
  window.media=function(type){try{if(window.activate)window.activate(type);}catch(e){}startHome(true);};

  function boot(){if(safe())startHome(false);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
  setTimeout(boot,40);
  setTimeout(boot,180);
  setTimeout(boot,500);
  setTimeout(boot,1000);
  setTimeout(boot,1800);
})();
