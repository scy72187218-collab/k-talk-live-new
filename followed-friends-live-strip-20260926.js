/* K-Talk Friends: followed people status strip.
   Red ring = broadcasting, blue ring = not broadcasting.
   Keeps K-Talk's own level badge/name treatment and does not copy another app's UI.
*/
(function(){
  if(window.__ktFollowedFriendsStrip20260926)return;
  window.__ktFollowedFriendsStrip20260926=true;

  var CACHE_KEY='ktalk_followed_friend_cards_20260926';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function loadCache(){
    try{
      var a=JSON.parse(localStorage.getItem(CACHE_KEY)||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return [];}
  }
  function saveCache(a){
    try{localStorage.setItem(CACHE_KEY,JSON.stringify((a||[]).slice(0,80)));}catch(e){}
  }

  function cleanName(s){
    return String(s||'').replace(/\s+/g,' ').replace(/^(친구|팔로워)\s*/,'').trim();
  }

  function levelFrom(el){
    try{
      var d=el&&el.dataset||{};
      var raw=d.level||d.userLevel||d.memberLevel||'';
      if(!raw){
        var m=String(el&&el.textContent||'').match(/Lv\.?\s*(\d+)/i);
        if(m)raw=m[1];
      }
      var n=parseInt(String(raw||'1').replace(/[^0-9]/g,''),10);
      return isFinite(n)&&n>0?n:1;
    }catch(e){return 1;}
  }

  function photoFrom(el){
    try{
      var img=el.querySelector('img');
      if(img)return img.currentSrc||img.src||'';
      var p=el.querySelector('[style*="background-image"]');
      if(p){
        var bg=getComputedStyle(p).backgroundImage||'';
        var m=bg.match(/url\(["']?(.*?)["']?\)/);
        if(m)return m[1];
      }
    }catch(e){}
    return '';
  }

  function rememberOriginalFriendRows(){
    var list=document.querySelector('.friends-list');
    if(!list)return;
    var rows=[].slice.call(list.querySelectorAll('.friend-row'));
    if(!rows.length)return;

    var old=loadCache(),map={};
    old.forEach(function(x){if(x&&x.name)map[x.name]=x;});

    rows.forEach(function(row){
      var b=row.querySelector('.friend-info b,b,strong,.friend-name');
      var name=cleanName(b?b.textContent:row.textContent);
      if(!name||name==='현재 방송목록'||name.indexOf('방송 중인 사람이 없습니다')>-1)return;
      var photo=photoFrom(row),level=levelFrom(row);
      var id='';
      try{id=String(row.dataset.userId||row.dataset.friendId||row.dataset.uid||'');}catch(e){}
      map[name]=Object.assign({},map[name]||{},{
        id:id,name:name,photo:photo||((map[name]||{}).photo||''),level:level||1
      });
    });
    saveCache(Object.keys(map).map(function(k){return map[k];}));
  }

  function liveRooms(){
    try{return (window.__ktLiveRoomsSnapshot20260926||[]).slice();}catch(e){return [];}
  }

  function mergePeople(){
    var cached=loadCache(),rooms=liveRooms(),byName={};

    cached.forEach(function(x){
      if(!x||!x.name)return;
      byName[x.name]={
        id:x.id||'',name:x.name,photo:x.photo||'',level:Number(x.level||1),
        live:false,hostId:''
      };
    });

    rooms.forEach(function(r){
      if(!r)return;
      var name=cleanName(r.host_name||'K-Talk');
      if(!name)return;
      var p=byName[name]||{id:'',name:name,photo:'',level:1,live:false,hostId:''};
      p.live=true;
      p.hostId=String(r.host_id||'');
      p.lastLiveAt=String(r.started_at||r.updated_at||'');
      if(r.host_photo)p.photo=String(r.host_photo);
      if(r.host_level)p.level=Number(r.host_level)||p.level||1;
      byName[name]=p;
    });

    var arr=Object.keys(byName).map(function(k){return byName[k];});
    arr.sort(function(a,b){
      if(a.live!==b.live)return a.live?-1:1;
      return a.name.localeCompare(b.name,'ko');
    });
    return arr.slice(0,40);
  }

  function ensureStyle(){
    if(document.getElementById('ktFollowedFriendsStripStyle20260926'))return;
    var s=document.createElement('style');s.id='ktFollowedFriendsStripStyle20260926';
    s.textContent=''
      +'.kt-follow-strip{margin:8px 8px 12px;padding:10px 8px 8px;border:1px solid #ffffff18;border-radius:16px;background:linear-gradient(180deg,#14151b,#0d0e13);color:#fff;overflow:hidden}'
      +'.kt-follow-strip-head{display:flex;align-items:center;justify-content:space-between;padding:0 3px 8px}.kt-follow-strip-head b{font-size:14px;font-weight:950}.kt-follow-strip-head small{font-size:9px;color:#9da1af}'
      +'.kt-follow-scroll{display:flex;gap:11px;overflow-x:auto;padding:1px 2px 5px;scrollbar-width:none}.kt-follow-scroll::-webkit-scrollbar{display:none}'
      +'.kt-follow-person{position:relative;flex:0 0 69px;border:0;background:none;color:#fff;padding:0;text-align:center;touch-action:manipulation}'
      +'.kt-follow-avatar{position:relative;width:60px;height:60px;margin:0 auto;border-radius:50%;padding:3px;box-sizing:border-box;background:#225cff;box-shadow:0 0 0 1px #56a0ff55}'
      +'.kt-follow-person.live .kt-follow-avatar{background:#ff234f;box-shadow:0 0 10px #ff234f88,0 0 0 1px #ff6b8788}'
      +'.kt-follow-avatar-inner{width:100%;height:100%;border-radius:50%;overflow:hidden;background:linear-gradient(145deg,#25304b,#131722);display:grid;place-items:center;font-size:24px;border:2px solid #0c0d12}'
      +'.kt-follow-avatar-inner img{width:100%;height:100%;object-fit:cover;display:block}'
      +'.kt-follow-level{position:absolute;right:-3px;bottom:0;min-width:25px;height:15px;padding:0 4px;border-radius:8px;background:#171923;border:1px solid #8ad0ff;color:#dff5ff;font:950 8px/14px system-ui,sans-serif;box-sizing:border-box}'
      +'.kt-follow-live{display:none;position:absolute;left:50%;bottom:-5px;transform:translateX(-50%);height:14px;padding:0 5px;border-radius:7px;background:#ff234f;border:1px solid #fff;color:#fff;font:950 7px/13px system-ui,sans-serif}'
      +'.kt-follow-person.live .kt-follow-live{display:block}'
      +'.kt-follow-name{display:block;margin-top:8px;font-size:9px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      +'.kt-follow-state{display:block;margin-top:2px;font-size:7px;color:#62a9ff}.kt-follow-person.live .kt-follow-state{color:#ff6684}'
      +'.kt-live-follow-alert{position:fixed;left:12px;right:12px;top:18px;z-index:2147483001;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(15,16,22,.96);border:1px solid #ff315f88;box-shadow:0 10px 34px #0009;color:#fff}'
      +'.kt-live-follow-alert img,.kt-live-follow-alert .ph{width:44px;height:44px;border-radius:50%;object-fit:cover;display:grid;place-items:center;background:#1a2030;border:3px solid #ff315f;font-size:20px;flex:none}'
      +'.kt-live-follow-alert .tx{min-width:0;flex:1}.kt-live-follow-alert .tx b{display:block;font-size:12px;font-weight:950}.kt-live-follow-alert .tx span{display:block;margin-top:3px;font-size:9px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      +'.kt-live-follow-alert button{border:0;border-radius:9px;background:#ff315f;color:#fff;font-size:9px;font-weight:950;padding:8px 10px}'
      +'@media(max-width:390px){.kt-follow-person{flex-basis:64px}.kt-follow-avatar{width:56px;height:56px}.kt-follow-scroll{gap:9px}}';
    document.head.appendChild(s);
  }

  window.ktOpenFollowedFriend20260926=function(encodedName,hostId,isLive){
    var name='';
    try{name=decodeURIComponent(encodedName||'');}catch(e){name=String(encodedName||'');}
    if(isLive==='1'&&hostId&&typeof window.ktEnterRemoteLive==='function'){
      window.ktEnterRemoteLive(hostId);return;
    }
    try{
      if(typeof window.showSheet==='function'){
        window.showSheet('프로필','<div class="rowbox" style="text-align:center"><b style="font-size:18px">'+esc(name||'K-Talk 친구')+'</b><br><span style="color:#79b7ff">현재 방송 중이 아닙니다.</span></div>');
      }
    }catch(e){}
  };

  function card(p){
    var photo=p.photo&&(/^(https?:|data:image)/.test(p.photo))
      ?'<img src="'+esc(p.photo)+'" alt="">':'👤';
    var encName=encodeURIComponent(p.name||'K-Talk');
    return '<button type="button" class="kt-follow-person'+(p.live?' live':'')+'" onclick="ktOpenFollowedFriend20260926(\''+encName+'\',\''+esc(p.hostId||'')+'\',\''+(p.live?'1':'0')+'\')">'
      +'<span class="kt-follow-avatar"><span class="kt-follow-avatar-inner">'+photo+'</span><span class="kt-follow-level">Lv.'+Math.max(1,Number(p.level||1))+'</span><span class="kt-follow-live">LIVE</span></span>'
      +'<span class="kt-follow-name">'+esc(p.name||'K-Talk')+'</span>'
      +'<span class="kt-follow-state">'+(p.live?'방송 중':'오프라인')+'</span>'
      +'</button>';
  }

  var notifiedLiveKeys={};

  function followedMatch(room){
    var cached=loadCache();
    var rid=String(room&&room.host_id||'');
    var rname=cleanName(room&&room.host_name||'');
    for(var i=0;i<cached.length;i++){
      var x=cached[i]||{};
      if(x.id&&rid&&String(x.id)===rid)return x;
      if(x.hostId&&rid&&String(x.hostId)===rid)return x;
      if(x.name&&rname&&cleanName(x.name)===rname)return x;
    }
    return null;
  }

  function showLiveAlert(room,friend){
    try{
      var key=String(room.host_id||'')+'|'+String(room.started_at||room.updated_at||'');
      if(notifiedLiveKeys[key])return;
      notifiedLiveKeys[key]=1;

      var box=document.createElement('div');
      box.className='kt-live-follow-alert';
      var photo=String(room.host_photo||friend&&friend.photo||'');
      box.innerHTML=(photo&&/^(https?:|data:image)/.test(photo)
        ?'<img src="'+esc(photo)+'" alt="">'
        :'<span class="ph">👤</span>')
        +'<div class="tx"><b>'+esc(room.host_name||friend&&friend.name||'K-Talk 친구')+'님이 방송을 시작했습니다</b>'
        +'<span>'+esc(room.title||room.room_name||'LIVE 방송')+' · 눌러서 바로 입장</span></div>'
        +'<button type="button">입장</button>';
      box.querySelector('button').onclick=function(){
        try{box.remove();}catch(e){}
        if(room.host_id&&typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(room.host_id);
      };
      document.body.appendChild(box);
      setTimeout(function(){try{if(box.isConnected)box.remove();}catch(e){}},8000);
    }catch(e){}
  }

  function notifyFollowedLives(){
    try{
      var rooms=liveRooms().slice(0,50),sent=0;
      for(var i=0;i<rooms.length&&sent<20;i++){
        var fr=followedMatch(rooms[i]);
        if(!fr)continue;
        var key=String(rooms[i].host_id||'')+'|'+String(rooms[i].started_at||rooms[i].updated_at||'');
        if(notifiedLiveKeys[key])continue;
        showLiveAlert(rooms[i],fr);
        sent++;
      }
    }catch(e){}
  }

  function render(){
    ensureStyle();
    var list=document.querySelector('.friends-list');
    if(!list)return;
    var page=list.closest('.friends-page')||list.parentElement;
    if(!page)return;

    var old=page.querySelector('#ktFollowedFriendsStrip20260926');
    if(old)old.remove();

    var people=mergePeople();
    if(!people.length)return;

    var box=document.createElement('section');
    box.id='ktFollowedFriendsStrip20260926';
    box.className='kt-follow-strip';
    box.innerHTML='<div class="kt-follow-strip-head"><b>팔로우한 친구</b><small>빨강 LIVE · 파랑 오프라인</small></div>'
      +'<div class="kt-follow-scroll">'+people.map(card).join('')+'</div>';

    page.insertBefore(box,list);
    notifyFollowedLives();
  }

  var oldFriends=window.friends;
  if(typeof oldFriends==='function'&&!oldFriends.__ktFollowStripWrapped){
    var wrapped=function(){
      var r=oldFriends.apply(this,arguments);
      setTimeout(rememberOriginalFriendRows,0);
      setTimeout(render,90);
      setTimeout(render,180);
      return r;
    };
    wrapped.__ktFollowStripWrapped=true;
    window.friends=wrapped;
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-bottom="friends"]'):null;
    if(!b)return;
    setTimeout(rememberOriginalFriendRows,10);
    setTimeout(render,120);
    setTimeout(render,260);
  },true);

  window.ktRenderFollowedFriendsStrip20260926=render;
  setInterval(function(){
    if(document.querySelector('.friends-list'))render();
    notifyFollowedLives();
  },5000);
})();
