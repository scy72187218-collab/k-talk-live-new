/* 9명방·13명방·구독자방·비밀방: 입장한 게스트 칸에 프로필 사진/닉네임 + 오른쪽 위 동전/받은 장미 수만 표시. */
(function(){
  if(window.__ktGuestTileProfileBadgeInstalled)return;
  window.__ktGuestTileProfileBadgeInstalled=true;

  var selector='.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot:not(.host),.ktsecret-room .ktsecret-guest-slot:not(.host)';

  function ensureStyle(){
    if(document.getElementById('ktGuestTileProfileBadgeStyle'))return;
    var s=document.createElement('style');
    s.id='ktGuestTileProfileBadgeStyle';
    s.textContent=''
      +'.kt-guest-occupied{position:relative!important}'
      +'.kt-guest-occupied>[data-kt-guest-placeholder="1"]{display:none!important}'
      +'.kt-guest-identity{position:absolute!important;left:4px!important;bottom:4px!important;z-index:26!important;max-width:calc(100% - 8px)!important;display:flex!important;align-items:center!important;gap:4px!important;padding:2px 5px 2px 2px!important;border-radius:999px!important;background:rgba(0,0,0,.68)!important;color:#fff!important;pointer-events:none!important;box-sizing:border-box!important}'
      +'.kt-guest-profile-photo,.kt-guest-profile-fallback{width:22px!important;height:22px!important;min-width:22px!important;border-radius:50%!important;object-fit:cover!important;display:grid!important;place-items:center!important;background:#25252c!important;border:1px solid rgba(255,255,255,.55)!important;font-size:12px!important;overflow:hidden!important}'
      +'.kt-guest-nickname{display:block!important;min-width:0!important;max-width:72px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#fff!important;font-size:9px!important;font-weight:950!important;line-height:1.1!important;text-shadow:0 1px 2px #000!important}'
      +'.kt-guest-reward-badge{position:absolute!important;right:29px!important;top:4px!important;z-index:27!important;min-height:22px!important;padding:2px 5px!important;border-radius:999px!important;display:flex!important;align-items:center!important;gap:3px!important;background:rgba(24,17,4,.86)!important;border:1px solid rgba(255,211,77,.66)!important;color:#ffe06b!important;font-size:9px!important;font-weight:950!important;line-height:1!important;white-space:nowrap!important;pointer-events:none!important;box-shadow:0 1px 4px rgba(0,0,0,.45)!important}'
      +'.kt-guest-reward-badge .rose{color:#ff759e!important}'
      +'@media(max-width:390px){.kt-guest-identity{left:3px!important;bottom:3px!important;gap:3px!important;padding:1px 4px 1px 1px!important}.kt-guest-profile-photo,.kt-guest-profile-fallback{width:19px!important;height:19px!important;min-width:19px!important;font-size:10px!important}.kt-guest-nickname{max-width:58px!important;font-size:8px!important}.kt-guest-reward-badge{right:27px!important;top:3px!important;min-height:19px!important;padding:2px 4px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function mediaOf(tile){
    try{return tile.querySelector('video,img:not(.kt-guest-profile-photo)');}catch(e){return null;}
  }

  function hasPerson(tile){
    if(!tile)return false;
    try{
      if(mediaOf(tile))return true;
      var d=tile.dataset||{};
      if(d.userId||d.participantId||d.memberId||d.uid||d.occupied==='1'||d.self==='1'||d.me==='1'||d.local==='1')return true;
    }catch(e){}
    return false;
  }

  function isOwn(tile){
    var s=window.state||{};
    try{
      var d=tile.dataset||{};
      if(d.self==='1'||d.me==='1'||d.local==='1'||d.own==='1')return true;
      var m=mediaOf(tile);
      if(s.stream&&m&&m.srcObject&&m.srcObject===s.stream)return true;
      var mine=[s.userId,s.currentUserId,s.memberId,s.profileId,s.uid].filter(Boolean).map(String);
      var theirs=[d.userId,d.participantId,d.memberId,d.uid].filter(Boolean).map(String);
      for(var i=0;i<mine.length;i++)if(theirs.indexOf(mine[i])>-1)return true;
    }catch(e){}
    return false;
  }

  function localProfile(){
    try{if(typeof window.ktProfileLoad==='function')return window.ktProfileLoad()||{};}catch(e){}
    return {};
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

  function guestId(tile){
    return datasetValue(tile,['userId','participantId','memberId','uid','guestId']);
  }

  function nickname(tile){
    var n=datasetValue(tile,['nickname','displayName','userName','name','guestName']);
    if(n)return n;
    if(isOwn(tile)){
      var p=localProfile();
      if(p&&p.name)return String(p.name);
    }
    try{
      var b=[].slice.call(tile.children||[]).find(function(el){
        if(!el||!el.textContent||el.classList.contains('kt-guest-reward-badge'))return false;
        var t=String(el.textContent||'').trim();
        return t&&!/^게스트\s*\d*$/i.test(t)&&t!=='👤';
      });
      if(b)return String(b.textContent||'').trim();
    }catch(e){}
    return '게스트';
  }

  function profilePhoto(tile){
    var u=datasetValue(tile,['profilePhoto','profileImage','avatar','avatarUrl','photo','photoUrl','image']);
    if(u)return u;
    try{
      var img=tile.querySelector('img:not(.kt-guest-profile-photo)');
      if(img&&img.src)return img.src;
    }catch(e){}
    if(isOwn(tile)){
      var p=localProfile();
      if(p&&p.photo)return String(p.photo);
    }
    return '';
  }

  function roseCount(tile){
    var v=datasetValue(tile,['roses','roseCount','receivedRoses','roseReceived','giftRoses']);
    if(v){var n=parseInt(String(v).replace(/[^0-9-]/g,''),10);if(isFinite(n))return Math.max(0,n);}
    try{
      var id=guestId(tile);
      if(id&&window.ktGuestRewards&&typeof window.ktGuestRewardKey==='function'){
        var key=window.ktGuestRewardKey(id);
        var r=window.ktGuestRewards[key];
        if(r&&isFinite(Number(r.roses)))return Math.max(0,Number(r.roses));
      }
    }catch(e){}
    return 0;
  }

  function markPlaceholders(tile){
    [].slice.call(tile.children||[]).forEach(function(el){
      if(!el||el.classList.contains('kt-guest-identity')||el.classList.contains('kt-guest-reward-badge')||el.classList.contains('kt-inside-av-controls')||el.classList.contains('kt-person-seat-number'))return;
      var t=String(el.textContent||'').trim();
      if(/^게스트\s*\d*$/i.test(t)||t==='👤')el.setAttribute('data-kt-guest-placeholder','1');
    });
  }

  function render(tile){
    if(!tile)return;
    ensureStyle();
    var occupied=hasPerson(tile);
    tile.classList.toggle('kt-guest-occupied',occupied);
    var ident=tile.querySelector(':scope > .kt-guest-identity');
    var reward=tile.querySelector(':scope > .kt-guest-reward-badge');
    if(!occupied){
      if(ident)ident.remove();
      if(reward)reward.remove();
      return;
    }

    markPlaceholders(tile);
    var name=nickname(tile);
    var photo=profilePhoto(tile);
    var roses=roseCount(tile);

    if(!ident){
      ident=document.createElement('div');
      ident.className='kt-guest-identity';
      tile.appendChild(ident);
    }
    ident.innerHTML='';
    if(photo){
      var img=document.createElement('img');
      img.className='kt-guest-profile-photo';
      img.alt='프로필';
      img.src=photo;
      img.onerror=function(){
        try{this.replaceWith(makeFallback(name));}catch(e){}
      };
      ident.appendChild(img);
    }else{
      ident.appendChild(makeFallback(name));
    }
    var nm=document.createElement('span');
    nm.className='kt-guest-nickname';
    nm.textContent=name;
    ident.appendChild(nm);

    if(!reward){
      reward=document.createElement('span');
      reward.className='kt-guest-reward-badge';
      tile.appendChild(reward);
    }
    reward.innerHTML='<span>🪙</span><span class="rose">🌹</span><b>'+roses+'</b>';
    reward.title='받은 장미 '+roses+'송이';
  }

  function makeFallback(name){
    var s=document.createElement('span');
    s.className='kt-guest-profile-fallback';
    var c=String(name||'게스트').trim().charAt(0)||'👤';
    s.textContent=c==='게'?'👤':c;
    return s;
  }

  function install(){
    document.querySelectorAll(selector).forEach(render);
  }

  window.ktSetGuestProfileBadge=function(target,data){
    var tile=target;
    if(typeof target==='string'){
      try{tile=document.querySelector(target);}catch(e){tile=null;}
    }
    if(!tile||!tile.matches||!tile.matches(selector))return false;
    data=data||{};
    try{
      if(data.nickname!=null)tile.dataset.nickname=String(data.nickname);
      if(data.photo!=null)tile.dataset.profilePhoto=String(data.photo);
      if(data.roses!=null)tile.dataset.roses=String(Math.max(0,Number(data.roses)||0));
      if(data.userId!=null)tile.dataset.userId=String(data.userId);
      tile.dataset.occupied='1';
    }catch(e){}
    render(tile);
    return true;
  };

  document.addEventListener('kt-guest-joined',function(e){
    var d=e&&e.detail?e.detail:{};
    if(d.tile)window.ktSetGuestProfileBadge(d.tile,d);
    else if(d.selector)window.ktSetGuestProfileBadge(d.selector,d);
  });
  document.addEventListener('kt-guest-profile',function(e){
    var d=e&&e.detail?e.detail:{};
    if(d.tile)window.ktSetGuestProfileBadge(d.tile,d);
    else if(d.selector)window.ktSetGuestProfileBadge(d.selector,d);
  });
  document.addEventListener('kt-guest-roses',function(e){
    var d=e&&e.detail?e.detail:{};
    if(d.tile)window.ktSetGuestProfileBadge(d.tile,d);
    else if(d.selector)window.ktSetGuestProfileBadge(d.selector,d);
  });

  install();
  [60,180,400,800,1400].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGuestTileProfileBadgeTimer);
      window.__ktGuestTileProfileBadgeTimer=setTimeout(install,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-user-id','data-participant-id','data-member-id','data-occupied','data-nickname','data-profile-photo','data-roses']});
  }catch(e){}
})();
