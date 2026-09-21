/* K-Talk 모든 방송방: '호스트' 글자 대신 프로필 사진 + 레벨 + 닉네임 표시. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktHostProfileAllRooms20260913)return;
  window.__ktHostProfileAllRooms20260913=true;

  function text(v){return v==null?'':String(v).trim();}
  function first(obj,keys){
    obj=obj||{};
    for(var i=0;i<keys.length;i++){
      var v=text(obj[keys[i]]);
      if(v)return v;
    }
    return '';
  }
  function ls(keys){
    try{
      for(var i=0;i<keys.length;i++){
        var v=text(localStorage.getItem(keys[i]));
        if(v)return v;
      }
    }catch(e){}
    return '';
  }
  function profile(){
    var p={};
    try{if(typeof window.ktProfileLoad==='function')p=window.ktProfileLoad()||{};}catch(e){}
    return p||{};
  }
  function currentName(tile){
    var d=(tile&&tile.dataset)||{};
    var n=first(d,['nickname','displayName','userName','username','name','hostName','profileName']);
    if(n)return n;
    n=first(window.state||{},['nickname','nickName','displayName','userName','username','profileName','name','accountName']);
    if(n)return n;
    var p=profile();
    n=first(p,['nickname','name','displayName','username']);
    if(n)return n;
    n=ls(['ktalk_nickname','kt_nickname','kt_profile_name','ktalk_profile_name','nickname','username']);
    return n||'K-Talk';
  }
  function currentPhoto(tile){
    var d=(tile&&tile.dataset)||{};
    var u=first(d,['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl','image']);
    if(u)return u;
    u=first(window.state||{},['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl']);
    if(u)return u;
    var p=profile();
    u=first(p,['photo','profilePhoto','profileImage','avatar','avatarUrl']);
    if(u)return u;
    return ls(['ktalk_profile_photo','kt_profile_photo','profilePhoto','profileImage','avatarUrl']);
  }
  function currentLevel(tile){
    var d=(tile&&tile.dataset)||{};
    var v=first(d,['level','userLevel','memberLevel','hostLevel','profileLevel']);
    if(!v)v=first(window.state||{},['level','userLevel','memberLevel','hostLevel','profileLevel']);
    if(!v){
      var p=profile();
      v=first(p,['level','userLevel','memberLevel','hostLevel']);
    }
    if(!v)v=ls(['ktalk_level','ktalk_user_level','kt_user_level','ktalk_member_level','level','userLevel']);
    var n=parseInt(String(v||'1').replace(/[^0-9]/g,''),10);
    if(!isFinite(n)||n<1)n=1;
    try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
    return n;
  }
  function fallback(name){
    var s=document.createElement('span');
    s.className='kt-allhost-fallback';
    var c=text(name).charAt(0);
    s.textContent=c||'👤';
    return s;
  }

  function ensureStyle(){
    if(document.getElementById('ktHostProfileAllRoomsStyle20260913'))return;
    var st=document.createElement('style');
    st.id='ktHostProfileAllRoomsStyle20260913';
    st.textContent=''
      +'.ktg13-host-label,.ktsubscriber-host-label,.ktsecret-slot.host>.ktsecret-slot-label,.ktsecret-host-label,.ktg9-host-label{display:none!important}'
      +'.kt-allhost-profile{position:absolute!important;left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;z-index:40!important;display:flex!important;align-items:center!important;gap:2px!important;max-width:calc(100% - 8px)!important;padding:1px 3px 1px 1px!important;border-radius:999px!important;background:rgba(0,0,0,.70)!important;color:#fff!important;box-sizing:border-box!important;pointer-events:none!important;box-shadow:0 1px 4px rgba(0,0,0,.35)!important;transform:none!important}'
      +'.kt-allhost-photo,.kt-allhost-fallback{width:13px!important;height:13px!important;min-width:13px!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.72)!important;background:#24242a!important;color:#fff!important;font-size:6px!important;font-weight:950!important}'
      +'.kt-allhost-level{height:9px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0 2px!important;border-radius:999px!important;background:#f6b82f!important;color:#261700!important;font-size:4px!important;font-weight:950!important;white-space:nowrap!important;line-height:1!important}'
      +'.kt-allhost-name{display:block!important;min-width:0!important;max-width:46px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#fff!important;font-size:5px!important;font-weight:950!important;line-height:1!important;text-shadow:0 1px 2px #000!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-profile{left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;gap:2px!important;padding:1px 3px 1px 1px!important;transform:none!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-photo,.ktg13-room[data-kt-room="9"] .kt-allhost-fallback{width:13px!important;height:13px!important;min-width:13px!important;font-size:6px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-level{height:9px!important;padding:0 2px!important;font-size:4px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-name{max-width:46px!important;font-size:5px!important}'
      +'.ktsolo-main>.kt-allhost-profile{left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;transform:none!important}'
      +'@media(max-width:390px){.kt-allhost-profile{left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;gap:2px!important;padding:1px 3px 1px 1px!important;transform:none!important}.kt-allhost-photo,.kt-allhost-fallback{width:13px!important;height:13px!important;min-width:13px!important;font-size:6px!important}.kt-allhost-level{height:9px!important;padding:0 2px!important;font-size:4px!important}.kt-allhost-name{max-width:46px!important;font-size:5px!important}}'
      +'.ktsecret-room .ktsecret-slot.host>.kt-allhost-profile,.ktsecret-room .ktsecret-host>.kt-allhost-profile{left:4px!important;right:auto!important;top:auto!important;bottom:4px!important;transform:none!important}';
    document.head.appendChild(st);
  }

  function render(tile){
    if(!tile)return;
    ensureStyle();
    try{tile.style.setProperty('position','relative','important');}catch(e){}
    var name=currentName(tile),photo=currentPhoto(tile),level=currentLevel(tile);
    var box=tile.querySelector(':scope > .kt-allhost-profile');
    if(!box){
      box=document.createElement('div');
      box.className='kt-allhost-profile';
      tile.appendChild(box);
    }
    box.innerHTML='';
    if(photo){
      var img=document.createElement('img');
      img.className='kt-allhost-photo';
      img.alt='프로필';
      img.src=photo;
      img.onerror=function(){try{this.replaceWith(fallback(name));}catch(e){}};
      box.appendChild(img);
    }else{
      box.appendChild(fallback(name));
    }
    var lv=document.createElement('span');
    lv.className='kt-allhost-level';
    lv.textContent='Lv.'+level;
    box.appendChild(lv);
    var nm=document.createElement('span');
    nm.className='kt-allhost-name';
    nm.textContent=name;
    box.appendChild(nm);
  }

  function removeHostWords(){
    var sels=['.ktg13-host-label','.ktsubscriber-host-label','.ktsecret-slot.host>.ktsecret-slot-label','.ktsecret-host-label','.ktg9-host-label'];
    sels.forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){el.style.setProperty('display','none','important');});});
  }

  function apply(){
    ensureStyle();
    removeHostWords();
    document.querySelectorAll('.ktsolo-room .ktsolo-main,.ktg13-room .ktg13-host,.ktsubscriber-room .ktsubscriber-host,.ktsecret-room .ktsecret-slot.host,.ktsecret-room .ktsecret-host,.ktg9-room .ktg9-host').forEach(render);
  }

  apply();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktHostProfileAllRoomsTimer);
      window.__ktHostProfileAllRoomsTimer=setTimeout(apply,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-nickname','data-profile-photo','data-level','data-user-level','data-host-level']});
  }catch(e){}
  ['kt-host-profile','kt-user-profile','kt-profile-updated'].forEach(function(ev){document.addEventListener(ev,function(){setTimeout(apply,0);});});
})();

/* 방송 중 사람 사진 클릭 → 프로필/팔로우 전용. 기존 방송 화면과 버튼은 변경하지 않음. */
(function(){
  if(window.__ktLiveProfileFollowCard20260915)return;
  window.__ktLiveProfileFollowCard20260915=true;

  var apiPromise=null;
  var currentCard=null;

  function val(v){return v==null?'':String(v).trim();}
  function esc(v){return val(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function num(v){var n=parseInt(String(v==null?'':v).replace(/[^0-9-]/g,''),10);return isFinite(n)&&n>0?n:0;}
  function enc(v){return encodeURIComponent(val(v));}

  function ensureFollowStyle(){
    if(document.getElementById('ktLiveProfileFollowStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktLiveProfileFollowStyle20260915';
    s.textContent=''
      +'.kt-allhost-photo,.kt-allhost-fallback,.kt-guest-profile-photo,.kt-guest-profile-fallback,.kt-hg-photo,.kt-hg-fallback{pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'
      +'.kt-live-profile-pop{position:fixed!important;inset:0!important;z-index:2147483645!important;background:#fff!important;color:#111!important;overflow:auto!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'.kt-live-profile-head{height:58px!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;padding:8px 14px!important;border-bottom:1px solid #eee!important;position:sticky!important;top:0!important;background:#fff!important;z-index:2!important}'
      +'.kt-live-profile-close{width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:#f4f4f5!important;color:#222!important;font-size:28px!important;line-height:1!important;font-weight:500!important}'
      +'.kt-live-profile-body{max-width:520px!important;margin:0 auto!important;padding:22px 22px 40px!important;text-align:center!important}'
      +'.kt-live-profile-avatar{width:112px!important;height:112px!important;margin:0 auto 13px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:#111!important;color:#fff!important;border:1px solid #e6e6e6!important;font-size:43px!important;font-weight:900!important}'
      +'.kt-live-profile-avatar img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'
      +'.kt-live-profile-name{font-size:24px!important;line-height:1.15!important;font-weight:950!important;letter-spacing:-.5px!important}'
      +'.kt-live-profile-id{margin-top:5px!important;color:#777!important;font-size:14px!important;font-weight:700!important;word-break:break-all!important}'
      +'.kt-live-profile-stats{display:grid!important;grid-template-columns:repeat(3,1fr)!important;margin:24px auto 20px!important;max-width:390px!important}'
      +'.kt-live-profile-stat{padding:0 8px!important;border-left:1px solid #ececef!important}.kt-live-profile-stat:first-child{border-left:0!important}.kt-live-profile-stat b{display:block!important;color:#111!important;font-size:22px!important;line-height:1!important;font-weight:950!important}.kt-live-profile-stat span{display:block!important;margin-top:7px!important;color:#858589!important;font-size:13px!important;font-weight:800!important}'
      +'.kt-live-profile-follow{width:min(330px,88%)!important;height:48px!important;border:0!important;border-radius:7px!important;background:#fe2c55!important;color:#fff!important;font-size:17px!important;font-weight:950!important;touch-action:manipulation!important}.kt-live-profile-follow.following{background:#f1f1f2!important;color:#222!important;border:1px solid #ddd!important}.kt-live-profile-follow:disabled{opacity:.62!important}'
      +'.kt-live-profile-note{max-width:390px!important;margin:14px auto 0!important;color:#777!important;font-size:12px!important;line-height:1.45!important;font-weight:700!important}'
      +'.kt-live-profile-bio{max-width:390px!important;margin:20px auto 0!important;padding-top:18px!important;border-top:1px solid #eee!important;text-align:left!important;color:#333!important;font-size:14px!important;line-height:1.5!important;white-space:pre-wrap!important}'
      +'.kt-follow-rose-toast{position:fixed!important;left:50%!important;bottom:110px!important;transform:translateX(-50%)!important;z-index:2147483647!important;max-width:88vw!important;padding:12px 17px!important;border-radius:999px!important;background:rgba(25,10,28,.96)!important;color:#fff!important;border:1px solid #ff5a99!important;box-shadow:0 0 18px rgba(255,50,130,.35)!important;font-size:13px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'@media(max-width:390px){.kt-live-profile-body{padding:18px 14px 34px!important}.kt-live-profile-avatar{width:100px!important;height:100px!important}.kt-live-profile-name{font-size:22px!important}.kt-live-profile-stat b{font-size:20px!important}}';
    document.head.appendChild(s);
  }

  function currentViewerId(){
    var id='';
    try{if(typeof window.ktProfileAccountKey==='function')id=val(window.ktProfileAccountKey());}catch(e){}
    if(!id||id==='default'){
      try{var sub=window.ktGetSelectedSubAccount?val(window.ktGetSelectedSubAccount()):'';if(sub)id='sub:'+sub;}catch(e){}
    }
    if(!id||id==='default'){
      try{id=val(localStorage.getItem('kt_live_device_id'));}catch(e){}
      if(!id){
        id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
        try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
      }
    }
    return id.slice(0,80);
  }

  function currentViewerName(){
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

  async function rpc(name,body){
    var c=await apiConfig();
    var r=await fetch(c.base+'rpc/'+name,{
      method:'POST',
      headers:{apikey:c.key,Authorization:'Bearer '+c.key,'Content-Type':'application/json','x-ktalk-user-id':currentViewerId()},
      body:JSON.stringify(body||{})
    });
    if(!r.ok)throw new Error('follow '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):null;
  }

  async function remoteProfile(id){
    if(!id)return null;
    try{
      var c=await apiConfig();
      var r=await fetch(c.base+'ktalk_profiles?account_key=eq.'+enc(id)+'&select=account_key,nickname,photo,bio&limit=1',{
        headers:{apikey:c.key,Authorization:'Bearer '+c.key,'x-ktalk-user-id':currentViewerId()}
      });
      if(!r.ok)return null;
      var x=await r.json();
      return Array.isArray(x)&&x[0]?x[0]:null;
    }catch(e){return null;}
  }

  function tileFor(node){
    try{return node.closest('.ktsolo-main,.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-host,.ktsecret-guest-slot,.ktg9-host,.ktg9-guest');}catch(e){return null;}
  }

  function dataValue(tile,names){
    var d=tile&&tile.dataset?tile.dataset:{};
    for(var i=0;i<names.length;i++){
      var v=d[names[i]];
      if(v!=null&&val(v))return val(v);
    }
    return '';
  }

  function isLocalTile(tile){
    try{
      var v=tile&&tile.querySelector?tile.querySelector('video'):null;
      return !!(window.state&&state.stream&&v&&v.srcObject&&v.srcObject===state.stream);
    }catch(e){return false;}
  }

  function personFrom(node){
    var tile=tileFor(node);
    var name='',photo='',id='',likes=0,bio='';
    try{
      var n=tile&&tile.querySelector?tile.querySelector('.kt-allhost-name,.kt-guest-nickname,.kt-hg-name'):null;
      name=n?val(n.textContent):'';
    }catch(e){}
    if(!name)name=dataValue(tile,['nickname','displayName','userName','username','name','guestName','hostName','profileName'])||'K-Talk 사용자';
    if(node&&node.tagName==='IMG')photo=val(node.currentSrc||node.src);
    if(!photo)photo=dataValue(tile,['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl','image']);

    if(isLocalTile(tile))id=currentViewerId();
    if(!id)id=dataValue(tile,['accountKey','profileId','userId','participantId','memberId','uid','guestId','hostId']);
    if(!id){
      try{if(window.__ktCurrentRemoteHostId&&tile&&tile.matches('.ktg13-host,.ktsubscriber-host,.ktsecret-slot.host,.ktsecret-host,.ktg9-host'))id=val(window.__ktCurrentRemoteHostId);}catch(e){}
    }
    if(!id)id=('name:'+name.toLowerCase().replace(/\s+/g,'_')).slice(0,80);
    likes=num(dataValue(tile,['likes','likeCount','receivedLikes','totalLikes']));
    if(id===currentViewerId()){
      try{if(typeof window.ktProfileLoad==='function'){var p=window.ktProfileLoad()||{};likes=num(p.likes);bio=val(p.bio);if(!photo)photo=val(p.photo);if(!name||name==='K-Talk 사용자')name=val(p.name)||name;}}catch(e){}
    }
    return {id:id.slice(0,80),name:name,photo:photo,likes:likes,bio:bio};
  }

  function handleOf(id,name){
    var s=val(id).replace(/^sub:/,'').replace(/^name:/,'').replace(/[^0-9A-Za-z가-힣_.-]+/g,'_');
    if(!s)s=val(name).replace(/\s+/g,'_');
    return '@'+s.slice(0,28);
  }

  function showRoseToast(name){
    var old=document.querySelector('.kt-follow-rose-toast');if(old)old.remove();
    var d=document.createElement('div');d.className='kt-follow-rose-toast';
    d.textContent='🌹 회사에서 '+(name||'상대방')+'님에게 장미 1송이를 지급했습니다.';
    document.body.appendChild(d);
    setTimeout(function(){if(d&&d.parentNode)d.remove();},2400);
  }

  function closeCard(){
    var old=document.getElementById('ktLiveProfileCard');
    if(old)old.remove();
    currentCard=null;
  }
  window.ktCloseLiveProfileCard=closeCard;

  function updateStats(row){
    if(!currentCard||!row)return;
    var f1=currentCard.querySelector('[data-kt-following-count]');
    var f2=currentCard.querySelector('[data-kt-follower-count]');
    var btn=currentCard.querySelector('.kt-live-profile-follow');
    if(f1)f1.textContent=Number(row.following_count||0).toLocaleString('ko-KR');
    if(f2)f2.textContent=Number(row.follower_count||0).toLocaleString('ko-KR');
    if(btn&&!btn.dataset.self){
      var following=!!row.is_following;
      btn.classList.toggle('following',following);
      btn.textContent=following?'팔로잉':'팔로우';
      btn.dataset.following=following?'1':'0';
    }
  }

  async function toggleFollow(person,btn){
    if(!person||!btn||btn.disabled)return;
    btn.disabled=true;
    var before=btn.textContent;
    btn.textContent='처리 중…';
    try{
      var out=await rpc('ktalk_toggle_follow',{p_target_id:person.id,p_target_name:person.name,p_viewer_name:currentViewerName()});
      var row=Array.isArray(out)?out[0]:out;
      if(row){
        row.is_following=!!row.now_following;
        updateStats(row);
        if(row.reward_granted)showRoseToast(person.name);
      }
    }catch(e){
      btn.textContent=before;
      try{alert('팔로우 연결을 다시 눌러 주세요.');}catch(x){}
    }
    btn.disabled=false;
  }

  async function openCard(person){
    if(!person)return;
    ensureFollowStyle();closeCard();
    var pop=document.createElement('div');pop.id='ktLiveProfileCard';pop.className='kt-live-profile-pop';
    var self=person.id===currentViewerId();
    var avatar=person.photo?'<img src="'+esc(person.photo)+'" alt="프로필 사진">':esc((person.name||'K').charAt(0)||'K');
    pop.innerHTML=''
      +'<div class="kt-live-profile-head"><button type="button" class="kt-live-profile-close" aria-label="닫기">×</button></div>'
      +'<div class="kt-live-profile-body">'
        +'<div class="kt-live-profile-avatar">'+avatar+'</div>'
        +'<div class="kt-live-profile-name">'+esc(person.name)+'</div>'
        +'<div class="kt-live-profile-id">'+esc(handleOf(person.id,person.name))+'</div>'
        +'<div class="kt-live-profile-stats">'
          +'<div class="kt-live-profile-stat"><b data-kt-following-count>0</b><span>팔로잉</span></div>'
          +'<div class="kt-live-profile-stat"><b data-kt-follower-count>0</b><span>팔로워</span></div>'
          +'<div class="kt-live-profile-stat"><b>'+Number(person.likes||0).toLocaleString('ko-KR')+'</b><span>좋아요</span></div>'
        +'</div>'
        +'<button type="button" class="kt-live-profile-follow"'+(self?' data-self="1" disabled':'')+'>'+(self?'내 프로필':'팔로우')+'</button>'
        +'<div class="kt-live-profile-note">처음 팔로우가 성립하면 회사에서 이 사람에게 🌹 장미 1송이를 1회 지급합니다.</div>'
        +'<div class="kt-live-profile-bio" style="display:'+(person.bio?'block':'none')+'">'+esc(person.bio)+'</div>'
      +'</div>';
    document.body.appendChild(pop);currentCard=pop;
    pop.querySelector('.kt-live-profile-close').onclick=closeCard;
    var btn=pop.querySelector('.kt-live-profile-follow');
    if(!self)btn.onclick=function(){toggleFollow(person,btn);};

    var remote=await remoteProfile(person.id);
    if(currentCard!==pop)return;
    if(remote){
      if(remote.nickname){person.name=val(remote.nickname);var ne=pop.querySelector('.kt-live-profile-name');if(ne)ne.textContent=person.name;}
      if(remote.photo){person.photo=val(remote.photo);var av=pop.querySelector('.kt-live-profile-avatar');if(av)av.innerHTML='<img src="'+esc(person.photo)+'" alt="프로필 사진">';}
      if(remote.bio){person.bio=val(remote.bio);var be=pop.querySelector('.kt-live-profile-bio');if(be){be.textContent=person.bio;be.style.display='block';}}
    }
    try{
      var out=await rpc('ktalk_profile_follow_stats',{p_target_id:person.id});
      var row=Array.isArray(out)?out[0]:out;
      if(currentCard===pop&&row)updateStats(row);
    }catch(e){}
  }

  function photoTarget(t){
    if(!t||!t.closest)return null;
    return t.closest('.kt-allhost-photo,.kt-allhost-fallback,.kt-guest-profile-photo,.kt-guest-profile-fallback,.kt-hg-photo,.kt-hg-fallback');
  }

  function onPhoto(e){
    var p=photoTarget(e.target);if(!p)return;
    if(!p.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room'))return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    openCard(personFrom(p));
  }

  ensureFollowStyle();
  document.addEventListener('click',onPhoto,true);
})();

/* 프로필 카드 안에 사용 방법·보상·혜택 안내만 추가. 다른 화면/버튼은 변경하지 않음. */
(function(){
  if(window.__ktLiveProfileGuide20260915)return;
  window.__ktLiveProfileGuide20260915=true;

  function ensureGuideStyle(){
    if(document.getElementById('ktLiveProfileGuideStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktLiveProfileGuideStyle20260915';
    s.textContent=''
      +'.kt-live-profile-guide{max-width:390px!important;margin:20px auto 0!important;padding:16px!important;border:1px solid #e7e7eb!important;border-radius:16px!important;background:#fafafa!important;text-align:left!important;color:#222!important;box-sizing:border-box!important}'
      +'.kt-live-profile-guide-title{display:flex!important;align-items:center!important;gap:7px!important;margin-bottom:11px!important;font-size:16px!important;font-weight:950!important;color:#111!important}'
      +'.kt-live-profile-guide-item{padding:10px 0!important;border-top:1px solid #e9e9ec!important}.kt-live-profile-guide-item:first-of-type{border-top:0!important;padding-top:0!important}'
      +'.kt-live-profile-guide-item b{display:block!important;margin-bottom:5px!important;font-size:13px!important;font-weight:950!important;color:#111!important}'
      +'.kt-live-profile-guide-item span{display:block!important;font-size:12px!important;line-height:1.58!important;color:#555!important;font-weight:700!important}'
      +'.kt-live-profile-guide-reward{margin-top:4px!important;padding:9px 11px!important;border-radius:11px!important;background:#fff4f7!important;border:1px solid #ffd2dc!important;color:#b51d42!important;font-size:12px!important;font-weight:900!important;line-height:1.5!important}'
      +'@media(max-width:390px){.kt-live-profile-guide{padding:14px!important}.kt-live-profile-guide-title{font-size:15px!important}.kt-live-profile-guide-item span,.kt-live-profile-guide-reward{font-size:11px!important}}';
    document.head.appendChild(s);
  }

  function installGuide(){
    ensureGuideStyle();
    var card=document.getElementById('ktLiveProfileCard');
    if(!card)return;
    var body=card.querySelector('.kt-live-profile-body');
    if(!body||body.querySelector('.kt-live-profile-guide'))return;
    var box=document.createElement('section');
    box.className='kt-live-profile-guide';
    box.innerHTML=''
      +'<div class="kt-live-profile-guide-title">📘 사용 방법 · 보상 · 혜택</div>'
      +'<div class="kt-live-profile-guide-item"><b>사용 방법</b><span>① 방송 중 사람의 프로필 사진을 누릅니다.<br>② 프로필에서 <strong>팔로우</strong>를 누릅니다.<br>③ 팔로잉·팔로워·좋아요와 소개글을 확인할 수 있습니다.</span></div>'
      +'<div class="kt-live-profile-guide-item"><b>🎁 첫 팔로우 보상</b><span>처음 팔로우가 새로 성립하면 회사가 <strong>팔로우 받은 사람</strong>에게 🌹 장미 1송이를 자동 지급합니다.</span><div class="kt-live-profile-guide-reward">지급 주체: 회사 · 받는 사람: 팔로우 받은 사람 · 수량: 장미 1송이 · 횟수: 최초 1회</div></div>'
      +'<div class="kt-live-profile-guide-item"><b>✅ 혜택 기준</b><span>팔로우하면 상대의 팔로워 수와 내 팔로잉 수에 바로 반영됩니다. 같은 두 사람 사이의 장미 보상은 최초 1회만 적용되며, 언팔 후 다시 팔로우해도 중복 지급되지 않습니다.</span></div>'
      +'<div class="kt-live-profile-guide-item"><b>👤 내 프로필</b><span>내 프로필에서는 팔로우 버튼이 작동하지 않으며 팔로우 보상도 지급되지 않습니다.</span></div>';
    var bio=body.querySelector('.kt-live-profile-bio');
    if(bio)body.insertBefore(box,bio);else body.appendChild(box);
  }

  ensureGuideStyle();
  installGuide();
  try{
    var mo=new MutationObserver(function(){setTimeout(installGuide,0);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();