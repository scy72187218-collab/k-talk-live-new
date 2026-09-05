/* K-Talk: keep active LIVE cards visible inside the video feed. No auto-entry and no layout changes elsewhere. */
(function(){
  if(window.__ktLiveFeedSyncLoaded)return;
  window.__ktLiveFeedSyncLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var busy=false;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function hostKey(x){return String((x&&x.host_id)||'guest');}
  function photo(x){
    var p=String((x&&x.host_photo)||'');
    return (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(p)||/^https:\/\//i.test(p))?p:'';
  }

  async function getLives(){
    try{
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,host_photo,title,room_name,room_type,started_at,updated_at&active=eq.true&order=started_at.desc&limit=20';
      var r=await fetch(u,{headers:headers(),cache:'no-store'});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  function makeCard(x){
    var card=document.createElement('section');
    var host=hostKey(x);
    var name=String(x.host_name||'K-Talk');
    var title=String(x.title||x.room_name||'K-Talk LIVE');
    var room=String(x.room_name||'라이브 방송');
    var p=photo(x);
    card.className='kt-feed-card kt-live-feed-card kt-live-feed-sync-card';
    card.dataset.liveHost=host;
    card.dataset.liveTitle=title;
    card.dataset.liveRoom=room;
    card.dataset.liveSync='1';
    card.style.cssText='height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;overflow:hidden;background:radial-gradient(circle at 50% 30%,#35102c 0,#120914 40%,#030305 78%);cursor:pointer';
    var hostVisual=p
      ?'<div style="width:min(64vw,250px);height:min(82vw,330px);max-height:42vh;border-radius:24px;overflow:hidden;border:3px solid #ff315f;box-shadow:0 0 30px #ff315f66;background:#15151b"><img src="'+esc(p)+'" alt="호스트" style="width:100%;height:100%;display:block;object-fit:cover"></div>'
      :'<div style="width:150px;height:150px;border-radius:50%;display:grid;place-items:center;border:4px solid #ff315f;background:#1a1a22;box-shadow:0 0 30px #ff315f66;font-size:64px;font-weight:950">'+esc(name.slice(0,1))+'</div>';
    card.innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:30px;color:#fff">'
      +'<div><div style="display:inline-block;padding:8px 16px;border-radius:999px;background:#ff2d55;font-size:16px;font-weight:950;box-shadow:0 0 28px #ff2d5577">● 호스트 LIVE</div>'
      +'<div style="display:grid;place-items:center;margin:20px 0 14px">'+hostVisual+'</div>'
      +'<b style="display:block;font-size:25px">'+esc(name)+'</b>'
      +'<span style="display:block;margin-top:8px;font-size:18px">'+esc(title)+'</span>'
      +'<small style="display:block;margin-top:8px;font-size:14px;opacity:.82">'+esc(room)+' · 방송 중</small>'
      +'<strong style="display:block;margin-top:18px;padding:12px 18px;border-radius:999px;background:#ffffff18;border:1px solid #ffffff33;font-size:16px">호스트 눌러서 방송 들어가기</strong></div></div>'
      +'<div class="vh-tabs"><span class="on">LIVE</span><span>커뮤니티</span><span>팔로잉</span><span>추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>🔴 '+esc(name)+'</b><span>'+esc(title)+'</span></div>';
    card.onclick=function(){
      if(typeof window.ktJoinLive==='function')window.ktJoinLive(host,title,room);
    };
    return card;
  }

  function currentCard(feed){
    var cards=[].slice.call(feed.querySelectorAll('.kt-feed-card'));
    if(!cards.length)return null;
    var center=window.innerHeight/2;
    var best=cards[0],dist=Infinity;
    cards.forEach(function(c){
      var r=c.getBoundingClientRect();
      var d=Math.abs(((r.top+r.bottom)/2)-center);
      if(d<dist){dist=d;best=c;}
    });
    return best;
  }

  function syncCards(lives){
    var feed=document.getElementById('ktUnifiedFeed');
    if(!feed)return;
    var active={};
    lives.forEach(function(x){active[hostKey(x)]=x;});

    [].slice.call(feed.querySelectorAll('.kt-live-feed-card')).forEach(function(card){
      var h=String(card.dataset.liveHost||'guest');
      if(!active[h])card.remove();
      else if(active[h]&&photo(active[h])&&!card.querySelector('img[alt="호스트"]')){
        var fresh=makeCard(active[h]);
        card.replaceWith(fresh);
      }
    });

    var anchor=currentCard(feed);
    lives.slice().reverse().forEach(function(x){
      var h=hostKey(x);
      if([].slice.call(feed.querySelectorAll('.kt-live-feed-card')).some(function(c){return String(c.dataset.liveHost||'guest')===h;}))return;
      var card=makeCard(x);
      if(anchor&&anchor.parentNode===feed){anchor.insertAdjacentElement('afterend',card);anchor=card;}
      else feed.appendChild(card);
    });
  }

  async function tick(){
    if(busy||!document.getElementById('ktUnifiedFeed'))return;
    busy=true;
    try{syncCards(await getLives());}catch(e){}
    busy=false;
  }

  setTimeout(tick,500);
  setInterval(tick,2500);
  try{new MutationObserver(function(){setTimeout(tick,80);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
