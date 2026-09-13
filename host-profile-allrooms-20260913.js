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
      +'.kt-allhost-profile{position:absolute!important;left:5px!important;top:5px!important;z-index:40!important;display:flex!important;align-items:center!important;gap:4px!important;max-width:calc(100% - 10px)!important;padding:2px 6px 2px 2px!important;border-radius:999px!important;background:rgba(0,0,0,.70)!important;color:#fff!important;box-sizing:border-box!important;pointer-events:none!important;box-shadow:0 1px 5px rgba(0,0,0,.35)!important}'
      +'.kt-allhost-photo,.kt-allhost-fallback{width:25px!important;height:25px!important;min-width:25px!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.72)!important;background:#24242a!important;color:#fff!important;font-size:12px!important;font-weight:950!important}'
      +'.kt-allhost-level{height:17px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:0 5px!important;border-radius:999px!important;background:#f6b82f!important;color:#261700!important;font-size:8px!important;font-weight:950!important;white-space:nowrap!important;line-height:1!important}'
      +'.kt-allhost-name{display:block!important;min-width:0!important;max-width:90px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#fff!important;font-size:9px!important;font-weight:950!important;line-height:1!important;text-shadow:0 1px 2px #000!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-profile{left:3px!important;top:3px!important;gap:2px!important;padding:1px 4px 1px 1px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-photo,.ktg13-room[data-kt-room="9"] .kt-allhost-fallback{width:20px!important;height:20px!important;min-width:20px!important;font-size:10px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-level{height:14px!important;padding:0 3px!important;font-size:7px!important}'
      +'.ktg13-room[data-kt-room="9"] .kt-allhost-name{max-width:55px!important;font-size:8px!important}'
      +'.ktsolo-main>.kt-allhost-profile{left:7px!important;top:7px!important}'
      +'@media(max-width:390px){.kt-allhost-profile{left:4px!important;top:4px!important;gap:3px!important;padding:1px 4px 1px 1px!important}.kt-allhost-photo,.kt-allhost-fallback{width:22px!important;height:22px!important;min-width:22px!important;font-size:11px!important}.kt-allhost-level{height:15px!important;padding:0 4px!important;font-size:7px!important}.kt-allhost-name{max-width:72px!important;font-size:8px!important}}';
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
