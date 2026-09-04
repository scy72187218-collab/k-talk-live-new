/* K-Talk: followed people status strip. LIVE = red ring, followed but offline = blue ring. */
(function(){
  if(window.__ktFollowLiveStatusLoaded)return;
  window.__ktFollowLiveStatusLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var STORE='ktalk_followed_people_v1';
  var refreshTimer=null;

  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function cleanName(v){return String(v||'K-Talk').replace(/^\s*[♛🔴●]+\s*/,'').trim().slice(0,40)||'K-Talk';}
  function keyOf(id,name){return String(id||name||'').trim().toLowerCase();}

  function loadFollowing(){
    try{
      var a=JSON.parse(localStorage.getItem(STORE)||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return[];}
  }
  function saveFollowing(a){try{localStorage.setItem(STORE,JSON.stringify(a.slice(0,100)));}catch(e){}}
  function isFollowing(id,name){
    var k=keyOf(id,name),n=cleanName(name).toLowerCase();
    return loadFollowing().some(function(x){return keyOf(x.id,x.name)===k||cleanName(x.name).toLowerCase()===n;});
  }

  window.ktFollowPerson=function(id,name){
    name=cleanName(name);
    id=String(id||name);
    var a=loadFollowing();
    if(!isFollowing(id,name))a.unshift({id:id,name:name,at:Date.now()});
    saveFollowing(a);
    decorateFollowButtons();
    if(document.getElementById('ktFollowStatusPage'))renderFriendsPage();
  };

  window.ktUnfollowPerson=function(id,name){
    var k=keyOf(id,name),n=cleanName(name).toLowerCase();
    saveFollowing(loadFollowing().filter(function(x){return !(keyOf(x.id,x.name)===k||cleanName(x.name).toLowerCase()===n);}));
    decorateFollowButtons();
    if(document.getElementById('ktFollowStatusPage'))renderFriendsPage();
  };

  window.ktToggleFollowPerson=function(id,name,btn){
    if(isFollowing(id,name))ktUnfollowPerson(id,name); else ktFollowPerson(id,name);
    if(btn)btn.textContent=isFollowing(id,name)?'팔로잉':'＋ 팔로우';
  };

  async function getLives(){
    try{
      var since=new Date(Date.now()-120000).toISOString();
      var u=SB+'/rest/v1/ktalk_live_rooms?select=host_id,host_name,title,room_name,started_at,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(since)+'&order=started_at.desc&limit=30';
      var r=await fetch(u,{headers:headers()});
      return r.ok?await r.json():[];
    }catch(e){return[];}
  }

  function circle(person,live){
    var name=cleanName(person.name||person.host_name||'K-Talk');
    var id=String(person.id||person.host_id||name);
    var ring=live?'#ff315f':'#258cff';
    var glow=live?'rgba(255,49,95,.42)':'rgba(37,140,255,.34)';
    var initial=esc(name.slice(0,1));
    var action=live?"ktJoinLive('"+String(person.host_id||id).replace(/'/g,"\\'")+"','"+String(person.title||name).replace(/'/g,"\\'")+"','"+String(person.room_name||'라이브 방송').replace(/'/g,"\\'")+"')":"alert('현재 방송 중이 아닙니다.')";
    return '<button type="button" onclick="'+action+'" style="width:78px;flex:0 0 78px;border:0;background:none;color:#fff;padding:0;text-align:center">'
      +'<span style="position:relative;width:66px;height:66px;margin:0 auto 7px;display:grid;place-items:center;border-radius:50%;border:4px solid '+ring+';box-shadow:0 0 15px '+glow+';background:linear-gradient(145deg,#282832,#101016);font-size:27px;font-weight:950">'+initial
      +(live?'<small style="position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);padding:2px 7px;border-radius:999px;background:#ff315f;color:#fff;border:2px solid #08080c;font-size:9px;font-weight:950;line-height:1.2">LIVE</small>':'')
      +'</span><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px">'+esc(name)+'</b>'
      +'<small style="display:block;margin-top:3px;color:'+(live?'#ff8ca5':'#75baff')+';font-size:9px;font-weight:850">'+(live?'방송 중':'팔로우')+'</small></button>';
  }

  async function renderFriendsPage(){
    var root=document.getElementById('ktFollowStatusPage');
    if(!root)return;
    var lives=await getLives();
    var following=loadFollowing();
    var liveKeys={};
    lives.forEach(function(x){liveKeys[keyOf(x.host_id,x.host_name)]=true;liveKeys[cleanName(x.host_name).toLowerCase()]=true;});
    var offline=following.filter(function(x){return !liveKeys[keyOf(x.id,x.name)]&&!liveKeys[cleanName(x.name).toLowerCase()];});
    var items=lives.map(function(x){return circle({id:x.host_id,name:x.host_name,title:x.title,room_name:x.room_name,host_id:x.host_id},true);})
      .concat(offline.map(function(x){return circle(x,false);})).join('');
    var row=document.getElementById('ktFollowStatusRow');
    if(row)row.innerHTML=items||'<div style="padding:14px 6px;color:#aeb0bb;font-size:12px">방송 중인 사람이 생기거나 팔로우하면 여기에 표시됩니다.</div>';

    var list=document.getElementById('ktLiveRoomList');
    if(list){
      list.innerHTML=lives.length?lives.map(function(x){
        var n=esc(cleanName(x.host_name));
        var t=esc(x.title||x.room_name||'라이브 방송');
        var hid=String(x.host_id||'guest').replace(/'/g,"\\'");
        var tt=String(x.title||x.host_name||'K-Talk LIVE').replace(/'/g,"\\'");
        var rn=String(x.room_name||'라이브 방송').replace(/'/g,"\\'");
        return '<button type="button" onclick="ktJoinLive(\''+hid+'\',\''+tt+'\',\''+rn+'\')" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #ff315f55;border-radius:15px;background:#111118;color:#fff;text-align:left"><span style="width:42px;height:42px;border-radius:50%;display:grid;place-items:center;border:3px solid #ff315f;background:#24242c;font-size:18px;font-weight:950">'+n.slice(0,1)+'</span><span style="min-width:0;flex:1"><b style="display:block;font-size:14px">🔴 '+n+'</b><small style="display:block;margin-top:3px;color:#d5d5dd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+t+'</small></span><strong style="color:#ff6f8d;font-size:11px">입장</strong></button>';
      }).join(''):'<div style="padding:16px;color:#aeb0bb;text-align:center;font-size:12px">현재 방송 중인 방이 없습니다.</div>';
    }
  }

  function installFriendsPage(){
    var old=window.friends;
    if(typeof old==='function'&&old.__ktFollowStatusWrapped)return;
    function friendsPage(){
      try{document.body.classList.remove('kt-home','kt-video-mode');}catch(e){}
      var screenEl=document.getElementById('screen')||window.screen;
      if(!screenEl){if(old)return old();return;}
      screenEl.innerHTML='<section id="ktFollowStatusPage" style="min-height:calc(100dvh - 78px);padding:16px 14px 92px;background:linear-gradient(180deg,#0b0b11,#050508);color:#fff">'
        +'<div style="font-size:23px;font-weight:950;margin-bottom:12px">친구 · 팔로우</div>'
        +'<div style="font-size:11px;color:#aeb0bb;margin-bottom:8px">빨간색은 방송 중 · 파란색은 팔로우했지만 방송 안 함</div>'
        +'<div id="ktFollowStatusRow" style="display:flex;gap:10px;overflow-x:auto;padding:8px 2px 13px;scrollbar-width:none"></div>'
        +'<div style="height:1px;background:#ffffff12;margin:2px 0 14px"></div>'
        +'<div style="font-size:15px;font-weight:950;margin-bottom:9px">현재 방송 중</div>'
        +'<div id="ktLiveRoomList" style="display:grid;gap:8px"></div>'
      +'</section>';
      renderFriendsPage();
    }
    friendsPage.__ktFollowStatusWrapped=true;
    friendsPage.__ktOriginal=old;
    window.friends=friendsPage;
  }

  function decorateFollowButtons(){
    document.querySelectorAll('.kt-feed-card').forEach(function(card){
      if(card.querySelector('.kt-follow-toggle'))return;
      var title=card.querySelector('.vh-title');
      if(!title)return;
      var b=title.querySelector('b');
      var name=cleanName(b?b.textContent:'K-Talk');
      var id=card.dataset.liveHost||name;
      var btn=document.createElement('button');
      btn.type='button';btn.className='kt-follow-toggle';
      btn.textContent=isFollowing(id,name)?'팔로잉':'＋ 팔로우';
      btn.style.cssText='margin-top:7px;padding:6px 10px;border-radius:999px;border:1px solid #ffffff55;background:rgba(0,0,0,.42);color:#fff;font-size:10px;font-weight:900';
      btn.onclick=function(e){e.preventDefault();e.stopPropagation();ktToggleFollowPerson(id,name,btn);};
      title.appendChild(btn);
    });
  }

  installFriendsPage();
  decorateFollowButtons();
  try{new MutationObserver(function(){installFriendsPage();decorateFollowButtons();}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(function(){installFriendsPage();decorateFollowButtons();if(document.getElementById('ktFollowStatusPage'))renderFriendsPage();},4000);
})();
