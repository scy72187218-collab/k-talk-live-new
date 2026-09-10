/* K-Talk: 동영상 시청 중 현재 방송자를 작게 표시. 기존 화면/방송 UI는 건드리지 않음. */
(function(){
  if(window.__ktLiveVideoDiscoveryInstalled)return;
  window.__ktLiveVideoDiscoveryInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var STALE_MS=50000;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  async function activeRooms(){
    var cut=new Date(Date.now()-STALE_MS).toISOString();
    try{
      var r=await fetch(BASE+'ktalk_live_rooms?select=host_id,host_name,title,room_name,host_photo,updated_at&active=eq.true&updated_at=gte.'+enc(cut)+'&order=started_at.desc&limit=5',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(!r.ok)return [];
      var rows=await r.json();return Array.isArray(rows)?rows:[];
    }catch(e){return [];}
  }

  function ensureStyle(){
    if(document.getElementById('ktLiveVideoDiscoveryStyle'))return;
    var s=document.createElement('style');s.id='ktLiveVideoDiscoveryStyle';
    s.textContent=''
      +'@keyframes ktVideoLivePulse{0%,45%{opacity:1}55%,100%{opacity:.45}}'
      +'.kt-video-live-peek{position:absolute!important;left:10px!important;top:56px!important;z-index:18!important;max-width:230px!important;height:48px!important;padding:5px 10px 5px 5px!important;border:1px solid rgba(255,64,103,.75)!important;border-radius:999px!important;background:rgba(8,8,12,.78)!important;color:#fff!important;display:flex!important;align-items:center!important;gap:7px!important;box-shadow:0 0 14px rgba(255,35,82,.3)!important;backdrop-filter:blur(5px)!important;touch-action:manipulation!important}'
      +'.kt-video-live-peek .ktvl-avatar{width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#70214e,#193d79)!important;font-size:19px!important;border:2px solid #ff315f!important}'
      +'.kt-video-live-peek .ktvl-avatar img{width:100%!important;height:100%!important;object-fit:cover!important}'
      +'.kt-video-live-peek .ktvl-copy{min-width:0!important;text-align:left!important;line-height:1.15!important}.kt-video-live-peek .ktvl-copy b{display:block!important;color:#fff!important;font-size:11px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.kt-video-live-peek .ktvl-copy small{display:block!important;margin-top:3px!important;color:#ddd!important;font-size:9px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.kt-video-live-peek .ktvl-live{flex:0 0 auto!important;color:#fff!important;background:#e91845!important;border-radius:999px!important;padding:3px 6px!important;font-size:8px!important;font-weight:950!important;animation:ktVideoLivePulse .9s linear infinite!important}'
      +'@media(max-width:390px){.kt-video-live-peek{max-width:205px!important;height:44px!important;top:52px!important}.kt-video-live-peek .ktvl-avatar{width:32px!important;height:32px!important;flex-basis:32px!important}}';
    document.head.appendChild(s);
  }

  async function render(){
    ensureStyle();
    var old=document.getElementById('ktVideoLivePeek');if(old)old.remove();
    if(document.documentElement.classList.contains('kt-remote-viewing'))return;
    var host=document.querySelector('.video-home')||document.querySelector('#screen .media');
    if(!host)return;
    var rooms=await activeRooms();if(!rooms.length)return;
    var r=rooms[0];
    var photo=(r.host_photo&&(/^data:image/.test(r.host_photo)||/^https?:/.test(r.host_photo)))?'<img src="'+esc(r.host_photo)+'" alt="">':'🎥';
    var b=document.createElement('button');
    b.id='ktVideoLivePeek';b.type='button';b.className='kt-video-live-peek';
    b.innerHTML='<span class="ktvl-avatar">'+photo+'</span><span class="ktvl-copy"><b>'+esc(r.host_name||'K-Talk 방송자')+'</b><small>'+esc(r.title||r.room_name||'방송 중')+'</small></span><span class="ktvl-live">● LIVE</span>';
    b.onclick=function(){if(window.ktEnterRemoteLive)window.ktEnterRemoteLive(String(r.host_id||''));};
    host.appendChild(b);
  }

  window.ktRefreshVideoLivePeek=render;
  var mo=new MutationObserver(function(){setTimeout(render,80);});
  var screen=document.getElementById('screen');if(screen)mo.observe(screen,{childList:true,subtree:false});
  setInterval(render,5000);
  setTimeout(render,1000);
})();