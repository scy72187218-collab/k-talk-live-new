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
  function photo(x){
    var p=String((x&&x.host_photo)||'');
    return (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(p)||/^https:\/\//i.test(p))?p:'';
  }
  function avatar(x,size){
    var name=String((x&&x.host_name)||'K-Talk');
    var p=photo(x);
    var n=size||48;
    var inner=p?'<img src="'+esc(p)+'" alt="호스트" style="width:100%;height:100%;display:block;object-fit:cover;border-radius:inherit">':esc(name.slice(0,1));
    return '<span style="position:relative;width:'+n+'px;height:'+n+'px;flex:0 0 '+n+'px;border-radius:50%;display:grid;place-items:center;overflow:visible;border:2px solid #ff315f;background:#25252d;font-size:18px;font-weight:950;box-shadow:0 0 12px #ff315f55">'
      +'<span style="width:100%;height:100%;display:grid;place-items:center;overflow:hidden;border-radius:50%">'+inner+'</span>'
      +'<i style="position:absolute;right:-4px;bottom:-3px;padding:2px 5px;border-radius:7px;background:#ff315f;color:#fff;font-style:normal;font-size:7px;font-weight:950">LIVE</i></span>';
  }

  async function getLives(){
    try{
      var since=new Date(Date.now()-180000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name,host_photo,title,room_type,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=12';
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
        return '<button type="button" onclick="'+join(x)+'" style="width:100%;min-height:70px;display:flex;align-items:center;gap:12px;padding:9px 11px;border:1px solid #ffffff20;border-radius:14px;background:#111118;color:#fff;text-align:left">'
          +avatar(x,52)
          +'<span style="min-width:0;flex:1"><small style="display:block;color:#ff7894;font-size:9px;font-weight:950;margin-bottom:2px">호스트 LIVE</small><b style="display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🔴 '+name+'</b><small style="display:block;margin-top:3px;color:#d7d7df;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+title+' · '+room+'</small></span>'
          +'<strong style="color:#ff6f8d;font-size:10px;white-space:nowrap">눌러서 입장 ›</strong></button>';
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
    var html='<button id="ktOutsideLiveFloat" type="button" onclick="'+join(x)+'" style="position:absolute;left:12px;right:12px;top:58px;z-index:18;height:64px;border:1px solid #ff315f88;border-radius:15px;background:rgba(12,9,14,.92);box-shadow:0 0 18px #ff315f44;color:#fff;display:flex;align-items:center;gap:10px;padding:0 10px;text-align:left">'
      +avatar(x,44)+'<span style="min-width:0;flex:1"><b style="display:block;font-size:12px">'+name+' 호스트 방송 중</b><small style="display:block;margin-top:2px;color:#ddd;font-size:9px">'+room+' · 눌러서 들어가기</small></span><strong style="color:#ff6687;font-size:10px">LIVE ›</strong></button>';
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
