/* K-Talk 친구 화면 전용: 방송중=빨강, 방송 안 함=파랑, 위쪽 방송 확인, 아래쪽 쪽지. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktFriendsLiveMessageStatus20260915)return;
  window.__ktFriendsLiveMessageStatus20260915=true;

  var apiPromise=null;
  var cache={at:0,people:[]};
  var loading=false;
  var profileCache={};
  var renderTimer=null;
  var lastDrawSignature='';

  function val(v){return v==null?'':String(v).trim();}
  function esc(v){return val(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(val(v));}
  function currentUserId(){
    var id='';
    try{if(typeof window.ktProfileAccountKey==='function')id=val(window.ktProfileAccountKey());}catch(e){}
    if(!id||id==='default'){
      try{var sub=window.ktGetSelectedSubAccount?val(window.ktGetSelectedSubAccount()):'';if(sub)id='sub:'+sub;}catch(e){}
    }
    if(!id||id==='default'){
      try{id=val(localStorage.getItem('kt_live_device_id'));}catch(e){}
      if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    }
    return id.slice(0,80);
  }
  function currentUserName(){
    try{if(typeof window.ktProfileLoad==='function'){var p=window.ktProfileLoad()||{};if(p.name)return val(p.name);}}catch(e){}
    return 'K-Talk 사용자';
  }

  function apiConfig(){
    if(apiPromise)return apiPromise;
    apiPromise=fetch('profile-device-sync.js?v=20260914-profile2',{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('config');return r.text();})
      .then(function(t){
        var bm=t.match(/var BASE='([^']+)'/);
        var km=t.match(/var KEY='([^']+)'/);
        if(!bm||!km)throw new Error('config');
        return {base:bm[1],key:km[1]};
      });
    return apiPromise;
  }

  async function rest(path,opt){
    var c=await apiConfig();
    opt=opt||{};
    var headers=Object.assign({apikey:c.key,Authorization:'Bearer '+c.key,'Content-Type':'application/json','x-ktalk-user-id':currentUserId()},opt.headers||{});
    var r=await fetch(c.base+path,Object.assign({},opt,{headers:headers}));
    if(!r.ok)throw new Error('friends '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }

  function ensureStyle(){
    if(document.getElementById('ktFriendsLiveMessageStatusStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktFriendsLiveMessageStatusStyle20260915';
    s.textContent=''
      +'.friends-page{background:#07070b!important;color:#fff!important;min-height:100dvh!important;padding-bottom:90px!important}'
      +'.friends-page .friends-head{padding:16px 16px 8px!important}.friends-page .friends-head b{font-size:21px!important;font-weight:950!important}'
      +'.kt-friend-status-wrap{padding:6px 12px 16px!important}'
      +'.kt-friend-status-head{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:2px 4px 10px!important}.kt-friend-status-head b{font-size:15px!important}.kt-friend-status-head span{font-size:10px!important;color:#b9bac3!important}'
      +'.kt-friend-status-scroll{display:flex!important;gap:12px!important;overflow-x:auto!important;padding:3px 2px 9px!important;scrollbar-width:none!important}.kt-friend-status-scroll::-webkit-scrollbar{display:none!important}'
      +'.kt-friend-bubble{width:74px!important;min-width:74px!important;border:0!important;background:none!important;color:#fff!important;padding:0!important;text-align:center!important;touch-action:manipulation!important}'
      +'.kt-friend-bubble-photo{position:relative!important;width:66px!important;height:66px!important;margin:auto!important;border-radius:50%!important;padding:3px!important;background:#1677ff!important;box-shadow:0 0 0 1px #1677ff!important}'
      +'.kt-friend-bubble.live .kt-friend-bubble-photo{background:#ff315f!important;box-shadow:0 0 0 1px #ff315f,0 0 14px rgba(255,49,95,.42)!important}'
      +'.kt-friend-bubble-photo img,.kt-friend-bubble-fallback{width:100%!important;height:100%!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;background:#171722!important;color:#fff!important;font-size:22px!important;font-weight:950!important;border:2px solid #07070b!important;overflow:hidden!important}'
      +'.kt-friend-live-badge{position:absolute!important;left:50%!important;bottom:-5px!important;transform:translateX(-50%)!important;border-radius:999px!important;padding:2px 6px!important;background:#ff315f!important;color:#fff!important;font-size:8px!important;font-weight:950!important;white-space:nowrap!important;border:2px solid #07070b!important}'
      +'.kt-friend-off-badge{position:absolute!important;right:-1px!important;bottom:2px!important;width:15px!important;height:15px!important;border-radius:50%!important;background:#1680ff!important;border:2px solid #07070b!important}'
      +'.kt-friend-bubble-name{display:block!important;margin-top:8px!important;font-size:10px!important;font-weight:850!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.kt-friend-legend{display:flex!important;gap:12px!important;align-items:center!important;margin:5px 4px 0!important;color:#c5c6cd!important;font-size:10px!important}.kt-friend-legend i{display:inline-block!important;width:9px!important;height:9px!important;border-radius:50%!important;margin-right:4px!important;vertical-align:-1px!important}.kt-friend-legend .red{background:#ff315f!important}.kt-friend-legend .blue{background:#1680ff!important}'
      +'.kt-friend-contact-title{margin:8px 4px 9px!important;font-size:15px!important;font-weight:950!important}'
      +'.kt-friend-contact-list{display:grid!important;gap:8px!important}'
      +'.kt-friend-contact{display:grid!important;grid-template-columns:52px minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important;padding:10px!important;border:1px solid #23232c!important;border-radius:15px!important;background:#101017!important;color:#fff!important}'
      +'.kt-friend-contact-photo{width:52px!important;height:52px!important;border-radius:50%!important;padding:2px!important;background:#1680ff!important}.kt-friend-contact.live .kt-friend-contact-photo{background:#ff315f!important}.kt-friend-contact-photo img,.kt-friend-contact-fallback{width:100%!important;height:100%!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;background:#1c1c27!important;border:2px solid #101017!important;font-size:18px!important;font-weight:950!important}'
      +'.kt-friend-contact-info{min-width:0!important;cursor:pointer!important}.kt-friend-contact-info b{display:block!important;font-size:13px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.kt-friend-contact-info span{display:block!important;margin-top:4px!important;font-size:10px!important;color:#b9bac3!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.kt-friend-contact.live .kt-friend-contact-info span{color:#ff728d!important;font-weight:850!important}'
      +'.kt-friend-contact-actions{display:grid!important;gap:5px!important}.kt-friend-contact-actions button{min-width:58px!important;border:0!important;border-radius:9px!important;padding:8px 8px!important;background:#23232d!important;color:#fff!important;font-size:10px!important;font-weight:950!important;touch-action:manipulation!important}.kt-friend-contact-actions .livebtn{background:#ff315f!important}'
      +'.kt-friend-empty{padding:24px 12px!important;text-align:center!important;color:#a8a9b0!important;font-size:12px!important}'
      +'.kt-dm-wrap{padding:3px 0 6px!important}.kt-dm-person{display:flex!important;align-items:center!important;gap:10px!important;margin-bottom:10px!important}.kt-dm-person-photo{width:42px!important;height:42px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:#20202a!important;font-weight:950!important}.kt-dm-person-photo img{width:100%!important;height:100%!important;object-fit:cover!important}.kt-dm-person b{font-size:14px!important;color:#fff!important}'
      +'.kt-dm-history{max-height:42dvh!important;overflow:auto!important;display:flex!important;flex-direction:column!important;gap:7px!important;padding:10px!important;border-radius:13px!important;background:#09090e!important;border:1px solid #24242d!important}.kt-dm-msg{max-width:82%!important;padding:8px 10px!important;border-radius:12px!important;background:#24242d!important;color:#fff!important;font-size:12px!important;line-height:1.45!important;word-break:break-word!important}.kt-dm-msg.me{align-self:flex-end!important;background:#2e6cf6!important}.kt-dm-msg small{display:block!important;margin-top:4px!important;opacity:.65!important;font-size:8px!important}'
      +'.kt-dm-compose{display:grid!important;grid-template-columns:1fr auto!important;gap:7px!important;margin-top:9px!important}.kt-dm-compose textarea{min-height:48px!important;max-height:110px!important;resize:vertical!important;border:1px solid #30303a!important;border-radius:11px!important;background:#0f0f15!important;color:#fff!important;padding:10px!important;font-size:13px!important;outline:0!important}.kt-dm-compose button{border:0!important;border-radius:11px!important;background:#2e6cf6!important;color:#fff!important;padding:0 15px!important;font-size:12px!important;font-weight:950!important}'
      +'@media(max-width:390px){.kt-friend-contact{grid-template-columns:46px minmax(0,1fr) auto!important}.kt-friend-contact-photo{width:46px!important;height:46px!important}.kt-friend-contact-actions button{min-width:52px!important;padding:7px 6px!important}}';
    document.head.appendChild(s);
  }

  async function profileFor(id,name){
    id=val(id);if(!id)return {id:'',name:name||'K-Talk',photo:''};
    if(profileCache[id])return profileCache[id];
    var out={id:id,name:name||'K-Talk',photo:''};
    try{
      var rows=await rest('ktalk_profiles?select=account_key,nickname,photo&account_key=eq.'+enc(id)+'&limit=1');
      if(Array.isArray(rows)&&rows[0]){out.name=val(rows[0].nickname)||out.name;out.photo=val(rows[0].photo);}
    }catch(e){}
    profileCache[id]=out;return out;
  }

  async function loadPeople(){
    var me=currentUserId();
    var cut=new Date(Date.now()-55000).toISOString();
    var follows=[],rooms=[];
    try{follows=await rest('ktalk_user_follows?select=following_id,following_name&follower_id=eq.'+enc(me)+'&order=updated_at.desc&limit=50');}catch(e){}
    try{rooms=await rest('ktalk_live_rooms?select=host_id,host_name,host_photo,title,room_name,active,updated_at&active=eq.true&updated_at=gte.'+enc(cut)+'&order=started_at.desc&limit=30');}catch(e){}
    follows=Array.isArray(follows)?follows:[];rooms=Array.isArray(rooms)?rooms:[];

    var map={};
    follows.forEach(function(f){
      var id=val(f.following_id);if(!id||id===me)return;
      map[id]={id:id,name:val(f.following_name)||'K-Talk 사용자',photo:'',following:true,live:false,title:'',roomName:''};
    });
    rooms.forEach(function(r){
      var id=val(r.host_id);if(!id||id===me)return;
      if(!map[id])map[id]={id:id,name:val(r.host_name)||'K-Talk 방송자',photo:'',following:false,live:true,title:'',roomName:''};
      map[id].live=true;
      map[id].name=val(r.host_name)||map[id].name;
      map[id].photo=val(r.host_photo)||map[id].photo;
      map[id].title=val(r.title)||val(r.room_name)||'라이브';
      map[id].roomName=val(r.room_name)||'방송';
    });

    var people=Object.keys(map).map(function(k){return map[k];});
    var need=people.filter(function(p){return !p.photo&&p.following;}).slice(0,24);
    await Promise.all(need.map(async function(p){var pr=await profileFor(p.id,p.name);if(pr){p.name=pr.name||p.name;p.photo=pr.photo||p.photo;}}));
    people.sort(function(a,b){if(a.live!==b.live)return a.live?-1:1;if(a.following!==b.following)return a.following?-1:1;return a.name.localeCompare(b.name,'ko');});
    cache={at:Date.now(),people:people};
    return people;
  }

  function photoHtml(p,cls){
    if(p.photo)return '<img src="'+esc(p.photo)+'" alt="">';
    return '<span class="'+cls+'">'+esc((p.name||'K').charAt(0)||'K')+'</span>';
  }

  function draw(people){
    var page=document.querySelector('.friends-page');
    var list=document.querySelector('.friends-list');
    if(!page||!list)return;
    ensureStyle();
    var head=page.querySelector('.friends-head b');if(head)head.textContent='친구 · 방송';
    people=Array.isArray(people)?people:[];
    var signature=people.map(function(p){
      return [p.id,p.name,p.photo,p.live?'1':'0',p.title,p.roomName].join('|');
    }).join('||')||'empty';
    if(signature===lastDrawSignature&&list.querySelector('.kt-friend-status-wrap'))return;
    lastDrawSignature=signature;
    if(!people.length){
      list.innerHTML='<div class="kt-friend-status-wrap"><div class="kt-friend-status-head"><b>방송 확인</b><span>빨강 방송중 · 파랑 방송 안 함</span></div><div class="kt-friend-empty">팔로우한 사람이나 현재 방송 중인 사람이 표시됩니다.</div></div>';
      return;
    }
    var top=people.slice(0,24).map(function(p){
      var click=p.live?"ktFriendEnterLive('"+esc(p.id).replace(/'/g,"\\'")+"')":"ktFriendOpenMessage('"+esc(p.id).replace(/'/g,"\\'")+"','"+esc(p.name).replace(/'/g,"\\'")+"','"+esc(p.photo).replace(/'/g,"\\'")+"')";
      return '<button type="button" class="kt-friend-bubble '+(p.live?'live':'offline')+'" onclick="'+click+'"><span class="kt-friend-bubble-photo">'+photoHtml(p,'kt-friend-bubble-fallback')+(p.live?'<i class="kt-friend-live-badge">LIVE</i>':'<i class="kt-friend-off-badge"></i>')+'</span><span class="kt-friend-bubble-name">'+esc(p.name)+'</span></button>';
    }).join('');
    var rows=people.map(function(p){
      var id=esc(p.id).replace(/'/g,"\\'"),name=esc(p.name).replace(/'/g,"\\'"),photo=esc(p.photo).replace(/'/g,"\\'");
      return '<div class="kt-friend-contact '+(p.live?'live':'offline')+'"><div class="kt-friend-contact-photo">'+photoHtml(p,'kt-friend-contact-fallback')+'</div><div class="kt-friend-contact-info" onclick="ktFriendOpenMessage(\''+id+'\',\''+name+'\',\''+photo+'\')"><b>'+esc(p.name)+'</b><span>'+(p.live?'🔴 방송 중 · '+esc(p.title||p.roomName||'라이브'):'🔵 현재 방송 안 함')+'</span></div><div class="kt-friend-contact-actions"><button type="button" onclick="ktFriendOpenMessage(\''+id+'\',\''+name+'\',\''+photo+'\')">쪽지</button>'+(p.live?'<button type="button" class="livebtn" onclick="ktFriendEnterLive(\''+id+'\')">방송입장</button>':'')+'</div></div>';
    }).join('');
    list.innerHTML='<div class="kt-friend-status-wrap"><div class="kt-friend-status-head"><b>방송 확인</b><span>위에서 누가 방송 중인지 바로 확인</span></div><div class="kt-friend-status-scroll">'+top+'</div><div class="kt-friend-legend"><span><i class="red"></i>방송 중</span><span><i class="blue"></i>방송 안 함</span></div><div class="kt-friend-contact-title">친구 · 쪽지</div><div class="kt-friend-contact-list">'+rows+'</div></div>';
  }

  async function render(force){
    if(!document.querySelector('.friends-page')||!document.querySelector('.friends-list'))return;
    if(loading)return;
    if(!force&&cache.people.length&&Date.now()-cache.at<3500){draw(cache.people);return;}
    loading=true;
    try{draw(await loadPeople());}catch(e){if(cache.people.length)draw(cache.people);}
    loading=false;
  }
  function schedule(force){clearTimeout(renderTimer);renderTimer=setTimeout(function(){render(!!force);},40);}

  window.ktFriendEnterLive=function(id){
    id=val(id);if(!id)return;
    try{if(typeof window.ktEnterRemoteLive==='function'){window.ktEnterRemoteLive(id);return;}}catch(e){}
    try{alert('방송 연결을 다시 눌러 주세요.');}catch(e){}
  };

  async function dmHistory(targetId){
    var me=currentUserId();
    try{
      var rows=await rest('ktalk_direct_messages?select=sender_id,sender_name,recipient_id,recipient_name,body,created_at&or=(sender_id.eq.'+enc(me)+',recipient_id.eq.'+enc(me)+')&order=created_at.desc&limit=100');
      rows=Array.isArray(rows)?rows:[];
      return rows.filter(function(x){return (val(x.sender_id)===me&&val(x.recipient_id)===targetId)||(val(x.sender_id)===targetId&&val(x.recipient_id)===me);}).slice(0,40).reverse();
    }catch(e){return [];}
  }

  async function renderDmHistory(targetId){
    var box=document.getElementById('ktFriendDmHistory');if(!box)return;
    var me=currentUserId(),rows=await dmHistory(targetId);
    if(!document.getElementById('ktFriendDmHistory'))return;
    if(!rows.length){box.innerHTML='<div style="padding:18px;text-align:center;color:#9c9ca5;font-size:11px">아직 주고받은 쪽지가 없습니다.</div>';return;}
    box.innerHTML=rows.map(function(x){var mine=val(x.sender_id)===me;var tm='';try{tm=new Date(x.created_at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){}return '<div class="kt-dm-msg '+(mine?'me':'')+'">'+esc(x.body)+'<small>'+esc(tm)+'</small></div>';}).join('');
    try{box.scrollTop=box.scrollHeight;}catch(e){}
  }

  window.ktFriendOpenMessage=function(id,name,photo){
    id=val(id);name=val(name)||'K-Talk 사용자';photo=val(photo);
    if(!id||id===currentUserId())return;
    ensureStyle();
    var avatar=photo?'<img src="'+esc(photo)+'" alt="">':esc((name||'K').charAt(0)||'K');
    var html='<div class="kt-dm-wrap"><div class="kt-dm-person"><div class="kt-dm-person-photo">'+avatar+'</div><b>'+esc(name)+'</b></div><div id="ktFriendDmHistory" class="kt-dm-history"><div style="padding:15px;text-align:center;color:#aaa;font-size:11px">쪽지를 불러오는 중…</div></div><div class="kt-dm-compose"><textarea id="ktFriendDmText" maxlength="500" placeholder="쪽지를 입력하세요"></textarea><button type="button" onclick="ktFriendSendMessage(\''+esc(id).replace(/'/g,"\\'")+'\',\''+esc(name).replace(/'/g,"\\'")+'\')">보내기</button></div></div>';
    if(typeof window.showSheet==='function')window.showSheet('✉ '+esc(name)+'님에게 쪽지',html);
    setTimeout(function(){renderDmHistory(id);},20);
  };

  window.ktFriendSendMessage=async function(id,name){
    id=val(id);name=val(name)||'K-Talk 사용자';
    var input=document.getElementById('ktFriendDmText');var body=input?val(input.value):'';
    if(!id||!body)return;
    if(body.length>500)body=body.slice(0,500);
    try{
      await rest('ktalk_direct_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({sender_id:currentUserId(),sender_name:currentUserName(),recipient_id:id,recipient_name:name,body:body})});
      if(input)input.value='';
      await renderDmHistory(id);
    }catch(e){try{alert('쪽지 전송을 다시 눌러 주세요.');}catch(x){}}
  };

  function hookFriends(){
    var old=window.friends;
    if(typeof old!=='function'||old.__ktFriendStatusWrapped)return;
    var fn=function(){var r=old.apply(this,arguments);setTimeout(function(){schedule(true);},30);return r;};
    fn.__ktFriendStatusWrapped=true;window.friends=fn;
  }

  function hookLiveRefresh(){
    var old=window.ktRefreshLiveCards;
    if(typeof old!=='function'||old.__ktFriendStatusWrapped)return;
    var fn=function(){
      if(document.querySelector('.friends-page')){schedule(false);return Promise.resolve();}
      return old.apply(this,arguments);
    };
    fn.__ktFriendStatusWrapped=true;window.ktRefreshLiveCards=fn;
  }

  ensureStyle();
  hookFriends();hookLiveRefresh();
  setInterval(function(){hookFriends();hookLiveRefresh();if(document.querySelector('.friends-page'))schedule(false);},1200);
  try{var mo=new MutationObserver(function(){if(document.querySelector('.friends-page'))schedule(false);});mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('focus',function(){if(document.querySelector('.friends-page'))schedule(true);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&document.querySelector('.friends-page'))schedule(true);});
})();
