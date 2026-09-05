/* K-Talk LIVE: active broadcasts are visible OUTSIDE the room on dashboard/home. No live-room layout changes. */
(function(){
  if(window.__ktLiveHomeIndicatorLoaded)return;
  window.__ktLiveHomeIndicatorLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var busy=false;
  var lastLives=[];

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function js(v){return String(v==null?'':v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r?\n/g,' ');}

  async function getLives(){
    try{
      /* Heartbeat is normally every 20s. Keep a 3-minute freshness window so stale rooms disappear. */
      var since=new Date(Date.now()-180000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,title,room_type,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=12';
      var r=await fetch(u,{headers:headers(),cache:'no-store'});
      if(!r.ok)return[];
      var rows=await r.json();
      var seen={};
      return (Array.isArray(rows)?rows:[]).filter(function(x){
        var k=String(x.host_id||x.id||'guest');
        if(seen[k])return false;seen[k]=1;return true;
      });
    }catch(e){return[];}
  }

  function join(x){
    var hid=js(x.host_id||'guest');
    var title=js(x.title||x.room_name||'K-Talk LIVE');
    var room=js(x.room_name||'라이브 방송');
    return "if(window.ktJoinLive)ktJoinLive('"+hid+"','"+title+"','"+room+"');else if(window.openBroadcastList)openBroadcastList();";
  }

  function dashboardMarkup(lives){
    return '<section id="ktOutsideLiveNow" style="margin:0 0 14px;padding:10px;border:1px solid #ff315f66;border-radius:17px;background:linear-gradient(135deg,#210811,#0a090f);box-shadow:0 0 17px #ff315f22">'
      +'<div style="display:flex;align-items:center;gap:8px;margin:0 2px 8px;color:#fff"><span style="width:10px;height:10px;border-radius:50%;background:#ff315f;box-shadow:0 0 12px #ff315f;animation:ktLivePulse 1.1s infinite"></span><b style="font-size:14px">지금 방송 중</b><small style="margin-left:auto;color:#ff8ca5;font-size:10px">'+lives.length+'개 LIVE</small></div>'
      +'<div style="display:grid;gap:7px">'+lives.slice(0,4).map(function(x){
        var name=esc(x.host_name||'K-Talk');
        var title=esc(x.title||x.room_name||'라이브 방송');
        var room=esc(x.room_name||'라이브 방송');
        return '<button type="button" onclick="'+join(x)+'" style="width:100%;min-height:54px;display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid #ffffff20;border-radius:13px;background:#111118;color:#fff;text-align:left">'
          +'<span style="position:relative;width:38px;height:38px;flex:0 0 38px;border-radius:50%;display:grid;place-items:center;border:2px solid #ff315f;background:#25252d;font-size:16px;font-weight:950">'+esc(name.slice(0,1))+'<i style="position:absolute;right:-3px;bottom:-3px;padding:1px 4px;border-radius:7px;background:#ff315f;color:#fff;font-style:normal;font-size:7px;font-weight:950">LIVE</i></span>'
          +'<span style="min-width:0;flex:1"><b style="display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🔴 '+name+'</b><small style="display:block;margin-top:3px;color:#d7d7df;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+title+' · '+room+'</small></span>'
          +'<strong style="color:#ff6f8d;font-size:10px;white-space:nowrap">입장 ›</strong></button>';
      }).join('')+'</div></section>';
  }

  function renderDashboard(lives){
    var dash=document.querySelector('.kt-dashboard');
    if(!dash)return;
    var old=document.getElementById('ktOutsideLiveNow');
    if(!lives.length){if(old)old.remove();return;}
    var wrap=document.createElement('div');wrap.innerHTML=dashboardMarkup(lives);
    var fresh=wrap.firstElementChild;
    if(old){old.replaceWith(fresh);return;}
    var notice=dash.querySelector('.kt-notice');
    if(notice)notice.insertAdjacentElement('afterend',fresh);
    else{var grid=dash.querySelector('.kt-room-grid');if(grid)grid.insertAdjacentElement('beforebegin',fresh);else dash.appendChild(fresh);}
  }

  function renderVideoHome(lives){
    var home=document.querySelector('.video-home');
    var old=document.getElementById('ktOutsideLiveFloat');
    if(!home||document.getElementById('ktUnifiedFeed')||!lives.length){if(old)old.remove();return;}
    var x=lives[0];
    var name=esc(x.host_name||'K-Talk');
    var room=esc(x.room_name||'라이브 방송');
    var html='<button id="ktOutsideLiveFloat" type="button" onclick="'+join(x)+'" style="position:absolute;left:12px;right:12px;top:58px;z-index:18;height:49px;border:1px solid #ff315f88;border-radius:15px;background:rgba(12,9,14,.90);box-shadow:0 0 18px #ff315f44;color:#fff;display:flex;align-items:center;gap:9px;padding:0 12px;text-align:left">'
      +'<span style="width:11px;height:11px;border-radius:50%;background:#ff315f;box-shadow:0 0 11px #ff315f;animation:ktLivePulse 1.1s infinite"></span><span style="min-width:0;flex:1"><b style="display:block;font-size:12px">'+name+' 방송 중</b><small style="display:block;margin-top:2px;color:#ddd;font-size:9px">'+room+' · 눌러서 들어가기</small></span><strong style="color:#ff6687;font-size:10px">LIVE ›</strong></button>';
    var w=document.createElement('div');w.innerHTML=html;
    if(old)old.replaceWith(w.firstElementChild);else home.appendChild(w.firstElementChild);
  }

  function ensureCss(){
    if(document.getElementById('ktLiveHomeIndicatorCss'))return;
    var s=document.createElement('style');s.id='ktLiveHomeIndicatorCss';
    s.textContent='@keyframes ktLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.78)}}';
    document.head.appendChild(s);
  }

  function render(lives){
    if(document.getElementById('ktSept2Live'))return;
    renderDashboard(lives);
    renderVideoHome(lives);
  }

  async function tick(){
    if(busy)return;busy=true;
    try{lastLives=await getLives();render(lastLives);}catch(e){}
    busy=false;
  }

  ensureCss();
  setTimeout(tick,250);
  setInterval(tick,2500);
  try{new MutationObserver(function(){setTimeout(function(){render(lastLives);},40);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
