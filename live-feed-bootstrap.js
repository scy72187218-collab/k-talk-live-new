/* K-Talk: 다른 기능은 건드리지 않고, 실제 방송 등록 + 추천 동영상 피드에 LIVE 방송 카드 삽입만 담당. */
(function(){
  if(window.__ktLiveFeedBootstrapInstalled)return;
  window.__ktLiveFeedBootstrapInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFjZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var STALE_MS=65000;
  var syncing=false;
  var lastSignature='';

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}
    catch(e){return false;}
  }

  function roomOpen(){
    try{return !!document.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room');}
    catch(e){return false;}
  }

  function findLiveStream(){
    try{if(window.state&&hasLiveVideo(state.stream))return state.stream;}catch(e){}
    try{
      var vs=document.querySelectorAll('#ktLiveVideo,#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,.ktg9-room video');
      for(var i=0;i<vs.length;i++){
        var s=vs[i]&&vs[i].srcObject;
        if(hasLiveVideo(s))return s;
      }
    }catch(e){}
    return null;
  }

  function ensureHostPresence(){
    if(!roomOpen())return;
    var stream=findLiveStream();
    if(!stream)return;
    try{if(window.state)state.stream=stream;}catch(e){}
    try{if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();}catch(e){}
  }

  async function activeRooms(){
    var cut=new Date(Date.now()-STALE_MS).toISOString();
    try{
      var q='ktalk_live_rooms?select=host_id,host_name,title,room_name,host_photo,updated_at&active=eq.true&updated_at=gte.'+enc(cut)+'&order=started_at.desc&limit=8';
      var r=await fetch(BASE+q,{headers:headers(),cache:'no-store'});
      if(!r.ok)return [];
      var rows=await r.json();
      return Array.isArray(rows)?rows:[];
    }catch(e){return [];}
  }

  function ensureStyle(){
    if(document.getElementById('ktLiveFeedBootstrapStyle'))return;
    var s=document.createElement('style');
    s.id='ktLiveFeedBootstrapStyle';
    s.textContent=''
      +'.kt-live-feed-card{height:calc(100dvh - 78px)!important;min-height:560px!important;position:relative!important;scroll-snap-align:start!important;background:radial-gradient(circle at 50% 36%,#3c1834 0,#151018 34%,#050507 78%)!important;overflow:hidden!important;color:#fff!important;cursor:pointer!important}'
      +'.kt-live-feed-photo{position:absolute!important;inset:0!important;background-position:center!important;background-size:cover!important;filter:brightness(.62)!important}'
      +'.kt-live-feed-photo.none{display:grid!important;place-items:center!important;font-size:96px!important;background:radial-gradient(circle,#5b2148,#11121a 55%,#050507)!important;filter:none!important}'
      +'.kt-live-feed-shade{position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(0,0,0,.42),rgba(0,0,0,.08) 35%,rgba(0,0,0,.72))!important}'
      +'.kt-live-feed-top{position:absolute!important;left:14px!important;right:14px!important;top:18px!important;z-index:2!important;display:flex!important;align-items:center!important;justify-content:space-between!important}'
      +'.kt-live-feed-badge{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:8px 12px!important;border-radius:999px!important;background:#e51b45!important;color:#fff!important;font-size:12px!important;font-weight:950!important;box-shadow:0 0 16px rgba(255,36,79,.55)!important}'
      +'.kt-live-feed-dot{width:9px!important;height:9px!important;border-radius:50%!important;background:#fff!important;box-shadow:0 0 8px #fff!important}'
      +'.kt-live-feed-brand{font-size:18px!important;font-weight:950!important;color:#ff67ce!important;text-shadow:0 2px 7px #000!important}'
      +'.kt-live-feed-info{position:absolute!important;left:18px!important;right:18px!important;bottom:34px!important;z-index:2!important;text-shadow:0 2px 7px #000!important}'
      +'.kt-live-feed-info strong{display:block!important;font-size:24px!important;font-weight:950!important;line-height:1.18!important}'
      +'.kt-live-feed-info span{display:block!important;margin-top:8px!important;font-size:14px!important;font-weight:800!important;color:#eee!important}'
      +'.kt-live-feed-enter{display:inline-block!important;margin-top:14px!important;padding:11px 16px!important;border-radius:13px!important;background:#ff315f!important;color:#fff!important;font-size:14px!important;font-weight:950!important;box-shadow:0 0 16px rgba(255,49,95,.45)!important}'
      +'.kt-live-feed-hint{position:absolute!important;right:16px!important;bottom:36px!important;z-index:2!important;width:70px!important;text-align:center!important;font-size:11px!important;font-weight:900!important;color:#fff!important;text-shadow:0 2px 6px #000!important}'
      +'.kt-live-feed-hint b{display:block!important;font-size:34px!important;margin-bottom:4px!important}';
    document.head.appendChild(s);
  }

  function feedContainer(){
    var v=document.querySelector('#screen .kt-public-video');
    if(!v)return null;
    var sec=v.closest('section');
    return sec&&sec.parentElement?sec.parentElement:null;
  }

  function safePhoto(v){
    v=String(v||'');
    return /^https?:\/\//.test(v)||/^data:image\//.test(v)?v:'';
  }

  function makeCard(r){
    var sec=document.createElement('section');
    sec.className='kt-live-feed-card';
    sec.dataset.hostId=String(r.host_id||'');
    sec.setAttribute('role','button');
    sec.setAttribute('tabindex','0');

    var photo=safePhoto(r.host_photo);
    var bg=document.createElement('div');
    bg.className='kt-live-feed-photo'+(photo?'':' none');
    if(photo)bg.style.backgroundImage='url("'+photo.replace(/"/g,'%22')+'")';
    else bg.textContent='🎥';
    sec.appendChild(bg);

    var shade=document.createElement('div');shade.className='kt-live-feed-shade';sec.appendChild(shade);

    var top=document.createElement('div');top.className='kt-live-feed-top';
    top.innerHTML='<span class="kt-live-feed-badge"><i class="kt-live-feed-dot"></i> 지금 LIVE</span><span class="kt-live-feed-brand">K-Talk LIVE</span>';
    sec.appendChild(top);

    var info=document.createElement('div');info.className='kt-live-feed-info';
    var name=document.createElement('strong');name.textContent=String(r.host_name||'K-Talk 방송자');
    var title=document.createElement('span');title.textContent=String(r.title||r.room_name||'라이브 방송 중');
    var enter=document.createElement('b');enter.className='kt-live-feed-enter';enter.textContent='방송 들어가기 ›';
    info.appendChild(name);info.appendChild(title);info.appendChild(enter);sec.appendChild(info);

    var hint=document.createElement('div');hint.className='kt-live-feed-hint';hint.innerHTML='<b>●</b>눌러서 입장';sec.appendChild(hint);

    function enterLive(e){
      if(e){e.preventDefault();e.stopPropagation();}
      var id=sec.dataset.hostId;
      if(!id)return;
      try{document.querySelectorAll('.kt-public-video').forEach(function(v){try{v.pause();}catch(err){}});}catch(err){}
      if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(id);
      else alert('방송 연결을 준비 중입니다. 잠시 후 다시 눌러 주세요.');
    }
    sec.addEventListener('click',enterLive);
    sec.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){enterLive(e);}});
    return sec;
  }

  function signature(rooms){return rooms.map(function(r){return String(r.host_id||'')+'@'+String(r.updated_at||'');}).join('|');}

  async function syncFeed(){
    if(syncing)return;
    syncing=true;
    try{
      ensureHostPresence();
      var container=feedContainer();
      if(!container){lastSignature='';return;}
      var rooms=await activeRooms();
      var sig=signature(rooms);
      var existing=[].slice.call(container.querySelectorAll('.kt-live-feed-card'));
      if(sig===lastSignature&&existing.length===Math.min(rooms.length,3))return;
      existing.forEach(function(x){x.remove();});
      lastSignature=sig;
      if(!rooms.length)return;
      ensureStyle();

      var videos=[].slice.call(container.querySelectorAll('section')).filter(function(x){return !x.classList.contains('kt-live-feed-card');});
      if(!videos.length)return;
      rooms.slice(0,3).forEach(function(r,i){
        var card=makeCard(r);
        var anchor=videos[Math.min(videos.length-1,1+(i*3))];
        if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(card,anchor.nextSibling);
        else container.appendChild(card);
      });
    }finally{syncing=false;}
  }

  ensureStyle();
  ensureHostPresence();
  [0,120,400,900,1800,3000].forEach(function(ms){setTimeout(ensureHostPresence,ms);});
  setInterval(ensureHostPresence,1300);

  var screen=document.getElementById('screen');
  if(screen){
    try{new MutationObserver(function(){setTimeout(syncFeed,120);setTimeout(ensureHostPresence,80);}).observe(screen,{childList:true,subtree:true});}catch(e){}
  }
  setTimeout(syncFeed,700);
  setInterval(syncFeed,3500);
})();
