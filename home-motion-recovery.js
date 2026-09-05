/* K-Talk: if the recommendation fallback is visible, make sure a real video starts moving. UI/layout unchanged. */
(function(){
  if(window.__ktHomeMotionRecoveryLoaded)return;
  window.__ktHomeMotionRecoveryLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var busy=false;

  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var cr=document.getElementById('creator');
    if(cr&&cr.classList.contains('show'))return false;
    return true;
  }

  function fallbackVideo(){
    if(document.getElementById('ktUnifiedFeed'))return null;
    return document.querySelector('.video-home video#homeVideo, .video-home video');
  }

  function playMuted(v){
    if(!v)return;
    try{
      v.muted=true;
      v.defaultMuted=true;
      v.autoplay=true;
      v.loop=true;
      v.setAttribute('muted','');
      v.setAttribute('autoplay','');
      v.setAttribute('loop','');
      v.setAttribute('playsinline','');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  async function newestVideoUrl(){
    try{
      var u=SB+'/rest/v1/ktalk_videos?select=video_url&order=created_at.desc&limit=1';
      var r=await fetch(u,{headers:{apikey:KEY,Authorization:'Bearer '+KEY},cache:'no-store'});
      if(!r.ok)return '';
      var rows=await r.json();
      return rows&&rows[0]&&rows[0].video_url?String(rows[0].video_url):'';
    }catch(e){return '';}
  }

  async function rescue(){
    if(busy||!safe())return;
    var v=fallbackVideo();
    if(!v||v.dataset.ktHomeMotionReady==='1')return;
    busy=true;
    v.dataset.ktHomeMotionReady='1';
    playMuted(v);

    var start=Number(v.currentTime||0);
    setTimeout(async function(){
      try{
        if(!safe()||document.getElementById('ktUnifiedFeed'))return;
        var cur=fallbackVideo();
        if(!cur)return;
        var moved=!cur.paused&&Number(cur.currentTime||0)>start+0.08;
        if(moved)return;
        var url=await newestVideoUrl();
        if(url){
          cur.src=url;
          cur.removeAttribute('poster');
          try{cur.load();}catch(e){}
          playMuted(cur);
          setTimeout(function(){playMuted(cur);},350);
          setTimeout(function(){playMuted(cur);},900);
        }else{
          playMuted(cur);
        }
      }finally{busy=false;}
    },700);
  }

  function boot(){
    setTimeout(rescue,120);
    setTimeout(rescue,500);
    setTimeout(rescue,1200);
    setTimeout(rescue,2500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  try{
    new MutationObserver(function(){setTimeout(rescue,80);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
