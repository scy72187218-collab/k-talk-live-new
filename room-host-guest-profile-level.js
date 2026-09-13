/* 9명방·13명방·구독자방·비밀방: 호스트/게스트의 프로필 사진 + 레벨 + 닉네임 표시만 추가. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktHostGuestProfileLevelInstalled)return;
  window.__ktHostGuestProfileLevelInstalled=true;

  var hostSelector='.ktg13-room .ktg13-host,.ktsubscriber-room .ktsubscriber-host,.ktsecret-room .ktsecret-slot.host,.ktsecret-room .ktsecret-host';
  var guestSelector='.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot:not(.host),.ktsecret-room .ktsecret-guest-slot:not(.host)';

  function ensureStyle(){
    if(document.getElementById('ktHostGuestProfileLevelStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostGuestProfileLevelStyle';
    s.textContent=''
      +'.kt-hg-host-identity{position:absolute!important;left:4px!important;top:4px!important;z-index:26!important;max-width:calc(100% - 8px)!important;display:flex!important;align-items:center!important;gap:4px!important;padding:2px 5px 2px 2px!important;border-radius:999px!important;background:rgba(0,0,0,.68)!important;color:#fff!important;pointer-events:none!important;box-sizing:border-box!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host>.ktg13-host-label{left:4px!important;top:5px!important;padding:2px 5px!important;border-radius:8px!important;font-size:9px!important;line-height:1!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity{left:48px!important;top:4px!important;max-width:calc(100% - 52px)!important;gap:2px!important;padding:1px 4px 1px 1px!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-photo,.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-fallback{width:18px!important;height:18px!important;min-width:18px!important;font-size:9px!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-level{height:13px!important;padding:0 3px!important;font-size:7px!important}'
      +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-name{max-width:46px!important;font-size:8px!important}'
      +'.kt-hg-photo,.kt-hg-fallback{width:22px!important;height:22px!important;min-width:22px!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;background:#25252c!important;border:1px solid rgba(255,255,255,.55)!important;font-size:12px!important;overflow:hidden!important}'
      +'.kt-hg-level{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:16px!important;padding:0 4px!important;border-radius:999px!important;background:rgba(255,196,54,.92)!important;color:#241500!important;font-size:8px!important;font-weight:950!important;line-height:1!important;white-space:nowrap!important}'
      +'.kt-hg-name{display:block!important;min-width:0!important;max-width:72px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#fff!important;font-size:9px!important;font-weight:950!important;line-height:1.1!important;text-shadow:0 1px 2px #000!important}'
      +'.kt-guest-identity>.kt-hg-level{flex:none!important}'
      +'@media(max-width:390px){.kt-hg-host-identity{left:3px!important;top:3px!important;gap:3px!important;padding:1px 4px 1px 1px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.ktg13-host-label{left:3px!important;top:4px!important;padding:2px 4px!important;font-size:8px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity{left:43px!important;top:3px!important;max-width:calc(100% - 46px)!important;gap:2px!important;padding:1px 3px 1px 1px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-photo,.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-fallback{width:17px!important;height:17px!important;min-width:17px!important;font-size:9px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-level{height:12px!important;padding:0 2px!important;font-size:6.5px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-name{max-width:42px!important;font-size:7px!important}.kt-hg-photo,.kt-hg-fallback{width:19px!important;height:19px!important;min-width:19px!important;font-size:10px!important}.kt-hg-level{height:14px!important;padding:0 3px!important;font-size:7px!important}.kt-hg-name{max-width:58px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function mediaOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function datasetValue(tile,names){
    var d=tile&&tile.dataset?tile.dataset:{};
    var m=mediaOf(tile);var md=m&&m.dataset?m.dataset:{};
    for(var i=0;i<names.length;i++){
      var k=names[i];
      if(d[k]!=null&&String(d[k]).trim())return String(d[k]).trim();
      if(md[k]!=null&&String(md[k]).trim())return String(md[k]).trim();
    }
    return '';
  }

  function localProfile(){
    try{if(typeof window.ktProfileLoad==='function')return window.ktProfileLoad()||{};}catch(e){}
    return {};
  }

  function ownStream(tile){
    try{
      var v=mediaOf(tile);
      return !!(window.state&&state.stream&&v&&v.srcObject&&v.srcObject===state.stream);
    }catch(e){return false;}
  }

  function stateValue(names){
    var s=window.state||{};
    for(var i=0;i<names.length;i++){
      var v=s[names[i]];
      if(v!=null&&String(v).trim())return String(v).trim();
    }
    return '';
  }

  function nameFor(tile,isHost){
    var n=datasetValue(tile,['nickname','displayName','userName','username','name','guestName','profileName','hostName']);
    if(n)return n;
    if(isHost||ownStream(tile)){
      n=stateValue(['nickname','nickName','displayName','userName','username','profileName','name','accountName']);
      if(n)return n;
      var p=localProfile();
      if(p&&p.name)return String(p.name);
    }
    return isHost?'호스트':'게스트';
  }

  function photoFor(tile,isHost){
    var u=datasetValue(tile,['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl','image']);
    if(u)return u;
    if(isHost||ownStream(tile)){
      u=stateValue(['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl']);
      if(u)return u;
      var p=localProfile();
      if(p&&p.photo)return String(p.photo);
    }
    return '';
  }

  function levelFor(tile,isHost){
    var v=datasetValue(tile,['level','userLevel','memberLevel','hostLevel','profileLevel']);
    if(!v&&(isHost||ownStream(tile)))v=stateValue(['level','userLevel','memberLevel','hostLevel','profileLevel']);
    if(!v&&(isHost||ownStream(tile))){
      try{
        var keys=['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'];
        for(var i=0;i<keys.length;i++){
          var x=localStorage.getItem(keys[i]);
          if(x!=null&&String(x).trim()){v=String(x).trim();break;}
        }
      }catch(e){}
    }
    var n=parseInt(String(v||'1').replace(/[^0-9-]/g,''),10);
    if(!isFinite(n)||n<1)n=1;
    try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
    return n;
  }

  function makeFallback(name){
    var s=document.createElement('span');
    s.className='kt-hg-fallback';
    var c=String(name||'').trim().charAt(0)||'👤';
    s.textContent=(c==='호'||c==='게')?'👤':c;
    return s;
  }

  function renderHost(tile){
    if(!tile)return;
    ensureStyle();
    var name=nameFor(tile,true),photo=photoFor(tile,true),level=levelFor(tile,true);
    var box=tile.querySelector(':scope > .kt-hg-host-identity');
    if(!box){
      box=document.createElement('div');
      box.className='kt-hg-host-identity';
      tile.appendChild(box);
    }
    box.innerHTML='';
    if(photo){
      var img=document.createElement('img');
      img.className='kt-hg-photo';img.alt='프로필';img.src=photo;
      img.onerror=function(){try{this.replaceWith(makeFallback(name));}catch(e){}};
      box.appendChild(img);
    }else box.appendChild(makeFallback(name));
    var lv=document.createElement('span');
    lv.className='kt-hg-level';lv.textContent='Lv.'+level;box.appendChild(lv);
    var nm=document.createElement('span');
    nm.className='kt-hg-name';nm.textContent=name;box.appendChild(nm);
  }

  function renderGuest(tile){
    if(!tile)return;
    var ident=tile.querySelector(':scope > .kt-guest-identity');
    if(!ident)return;
    ensureStyle();
    var level=levelFor(tile,false);
    var lv=ident.querySelector(':scope > .kt-hg-level');
    if(!lv){
      lv=document.createElement('span');
      lv.className='kt-hg-level';
      var nameEl=ident.querySelector('.kt-guest-nickname');
      ident.insertBefore(lv,nameEl||null);
    }
    lv.textContent='Lv.'+level;
  }

  function install(){
    ensureStyle();
    document.querySelectorAll(hostSelector).forEach(renderHost);
    document.querySelectorAll(guestSelector).forEach(renderGuest);
  }

  function applyEventLevel(e){
    var d=e&&e.detail?e.detail:{};
    var tile=d.tile||null;
    if(!tile&&d.selector){try{tile=document.querySelector(d.selector);}catch(err){tile=null;}}
    if(!tile)return;
    var v=d.level!=null?d.level:d.userLevel!=null?d.userLevel:d.memberLevel!=null?d.memberLevel:d.hostLevel;
    if(v!=null&&tile.dataset)tile.dataset.level=String(v);
    setTimeout(install,0);
  }

  ['kt-guest-joined','kt-guest-profile','kt-host-profile','kt-user-profile'].forEach(function(name){document.addEventListener(name,applyEventLevel);});
  install();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktHostGuestProfileLevelTimer);
      window.__ktHostGuestProfileLevelTimer=setTimeout(install,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-level','data-user-level','data-member-level','data-host-level','data-nickname','data-profile-photo']});
  }catch(e){}
})();
