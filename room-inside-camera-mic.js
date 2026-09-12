/* 9명방·13명방·구독자방·비밀방 전용: 카메라/마이크는 칸 안쪽에 숨겨 두고, 사람이 있는 칸을 눌렀을 때만 잠깐 표시. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktInsideCameraMicInstalledV2)return;
  window.__ktInsideCameraMicInstalledV2=true;

  function ensureStyle(){
    var old=document.getElementById('ktInsideCameraMicStyle');
    if(old)old.remove();
    if(document.getElementById('ktInsideCameraMicStyleV2'))return;
    var s=document.createElement('style');
    s.id='ktInsideCameraMicStyleV2';
    s.textContent=''
      +'.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot{position:relative!important;overflow:hidden!important}'
      +'.ktg13-room .ktg13-host>.kt-person-mic,.ktg13-room .ktg13-guest>.kt-person-mic,.ktg13-room .kt-913-camera,.ktg13-room .ktg13-camera-toggle,.ktsubscriber-room .kt-person-mic,.ktsubscriber-room .kt-host-camera-toggle,.ktsecret-room .kt-person-mic,.ktsecret-room .kt-host-camera-toggle{display:none!important}'
      +'.kt-inside-av-controls{position:absolute!important;left:6px!important;bottom:6px!important;z-index:45!important;display:flex!important;align-items:center!important;gap:4px!important;max-width:calc(100% - 12px)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(3px)!important;transition:opacity .16s ease,transform .16s ease,visibility .16s!important}'
      +'.kt-av-open>.kt-inside-av-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}'
      +'.kt-inside-av-btn{width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.52)!important;border-radius:50%!important;background:rgba(8,8,12,.72)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:13px!important;line-height:1!important;box-shadow:0 1px 4px rgba(0,0,0,.45)!important;backdrop-filter:blur(3px)!important;touch-action:manipulation!important}'
      +'.kt-inside-av-btn.off{background:rgba(112,18,32,.82)!important}'
      +'@media(max-width:390px){.kt-inside-av-controls{left:4px!important;bottom:4px!important;gap:3px!important}.kt-inside-av-btn{width:25px!important;height:25px!important;min-width:25px!important;min-height:25px!important;font-size:12px!important}}';
    document.head.appendChild(s);
  }

  function isHost(tile){
    if(!tile||!tile.classList)return false;
    return tile.classList.contains('ktg13-host')||tile.classList.contains('ktsubscriber-host')||(tile.classList.contains('ktsecret-slot')&&tile.classList.contains('host'));
  }

  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function hasPerson(tile){
    if(!tile)return false;
    if(isHost(tile))return true;
    try{
      if(tile.querySelector('video,img'))return true;
      if(tile.dataset&&(tile.dataset.userId||tile.dataset.participantId||tile.dataset.memberId||tile.dataset.occupied==='1'))return true;
    }catch(e){}
    return false;
  }

  function tracks(tile,kind){
    if(isHost(tile)){
      try{
        if(window.state&&state.stream){
          var a=kind==='audio'&&state.stream.getAudioTracks?state.stream.getAudioTracks():kind==='video'&&state.stream.getVideoTracks?state.stream.getVideoTracks():[];
          if(a&&a.length)return a;
        }
      }catch(e){}
    }
    var v=videoOf(tile);
    try{
      if(v&&v.srcObject){
        if(kind==='audio'&&v.srcObject.getAudioTracks)return v.srcObject.getAudioTracks();
        if(kind==='video'&&v.srcObject.getVideoTracks)return v.srcObject.getVideoTracks();
      }
    }catch(e){}
    return [];
  }

  function mediaOn(tile,kind,btn){
    var a=tracks(tile,kind);
    if(a.length)return a.some(function(t){return t.enabled!==false;});
    var v=videoOf(tile);
    if(kind==='audio'&&v)return !v.muted;
    if(kind==='video'&&v)return v.style.visibility!=='hidden';
    return btn&&btn.dataset.off!=='1';
  }

  function sync(tile,kind,btn){
    var on=mediaOn(tile,kind,btn);
    btn.dataset.off=on?'0':'1';
    btn.classList.toggle('off',!on);
    if(kind==='video'){
      btn.textContent=on?'📷':'🔒';
      btn.title=on?'카메라 끄기':'카메라 켜기';
    }else{
      btn.textContent=on?'🎤':'🔇';
      btn.title=on?'마이크 끄기':'마이크 켜기';
    }
    btn.setAttribute('aria-label',btn.title);
  }

  function toggle(tile,kind,btn){
    var on=mediaOn(tile,kind,btn);
    var a=tracks(tile,kind);
    if(a.length){
      a.forEach(function(t){try{t.enabled=!on;}catch(e){}});
    }else{
      var v=videoOf(tile);
      if(kind==='audio'&&v){
        try{v.muted=on;}catch(e){}
      }else if(kind==='video'&&v){
        try{v.style.setProperty('visibility',on?'hidden':'visible','important');}catch(e){}
      }else{
        btn.dataset.off=on?'1':'0';
      }
    }
    sync(tile,kind,btn);
  }

  function closeLater(tile){
    try{clearTimeout(tile.__ktAvHideTimer);}catch(e){}
    tile.__ktAvHideTimer=setTimeout(function(){try{tile.classList.remove('kt-av-open');}catch(e){}},2600);
  }

  function addToTile(tile){
    if(!tile)return;
    var box=tile.querySelector(':scope > .kt-inside-av-controls');
    if(!hasPerson(tile)){
      if(box)box.remove();
      tile.classList.remove('kt-av-open');
      return;
    }
    if(!box){
      box=document.createElement('div');
      box.className='kt-inside-av-controls';

      var cam=document.createElement('button');
      cam.type='button';
      cam.className='kt-inside-av-btn kt-inside-camera';
      cam.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'video',this);closeLater(tile);};

      var mic=document.createElement('button');
      mic.type='button';
      mic.className='kt-inside-av-btn kt-inside-mic';
      mic.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(err){} toggle(tile,'audio',this);closeLater(tile);};

      box.appendChild(cam);
      box.appendChild(mic);
      tile.appendChild(box);

      tile.addEventListener('click',function(e){
        if(e.target&&e.target.closest&&e.target.closest('.kt-inside-av-controls'))return;
        this.classList.add('kt-av-open');
        closeLater(this);
      });
    }
    var c=box.querySelector('.kt-inside-camera');
    var m=box.querySelector('.kt-inside-mic');
    if(c)sync(tile,'video',c);
    if(m)sync(tile,'audio',m);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot').forEach(addToTile);
  }

  install();
  [40,120,260,520,900,1500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktInsideCameraMicTimerV2);
      window.__ktInsideCameraMicTimerV2=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 카메라·마이크가 있는 안쪽 메뉴에 게스트 자리 이동 버튼만 추가. */
(function(){
  if(window.__ktInsideSeatMoveInstalled)return;
  window.__ktInsideSeatMoveInstalled=true;
  var source=null;
  var guestSelector='.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot:not(.host)';

  function ensureStyle(){
    if(document.getElementById('ktInsideSeatMoveStyle'))return;
    var s=document.createElement('style');
    s.id='ktInsideSeatMoveStyle';
    s.textContent='.kt-seat-move-source{outline:2px solid #ffd95a!important;outline-offset:-2px!important}.kt-inside-move-seat{font-size:14px!important}.kt-seat-move-source>.kt-inside-av-controls .kt-inside-move-seat{background:rgba(149,96,8,.88)!important}';
    document.head.appendChild(s);
  }

  function controlNode(n){
    return !!(n&&n.nodeType===1&&n.matches&&n.matches('.kt-inside-av-controls,.kt-913-camera,.kt-person-mic,.ktg13-camera-toggle,.kt-host-camera-toggle'));
  }

  function takeContent(tile){
    var f=document.createDocumentFragment();
    [].slice.call(tile.childNodes).forEach(function(n){if(!controlNode(n))f.appendChild(n);});
    return f;
  }

  function putContent(tile,frag){
    var controls=tile.querySelector(':scope > .kt-inside-av-controls');
    tile.insertBefore(frag,controls||null);
  }

  function swapData(a,b){
    ['userId','participantId','memberId','occupied'].forEach(function(k){
      var av=a.dataset?a.dataset[k]:undefined;
      var bv=b.dataset?b.dataset[k]:undefined;
      if(a.dataset){if(bv===undefined)delete a.dataset[k];else a.dataset[k]=bv;}
      if(b.dataset){if(av===undefined)delete b.dataset[k];else b.dataset[k]=av;}
    });
  }

  function swapSeats(a,b){
    if(!a||!b||a===b)return;
    var af=takeContent(a),bf=takeContent(b);
    swapData(a,b);
    putContent(a,bf);
    putContent(b,af);
  }

  function clearMove(){
    if(source)source.classList.remove('kt-seat-move-source');
    source=null;
  }

  function addButton(tile){
    var box=tile.querySelector(':scope > .kt-inside-av-controls');
    if(!box||box.querySelector('.kt-inside-move-seat'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-inside-av-btn kt-inside-move-seat';
    b.textContent='↔';
    b.title='자리 이동';
    b.setAttribute('aria-label','자리 이동');
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(err){}
      if(source===tile){clearMove();return;}
      clearMove();
      source=tile;
      tile.classList.add('kt-seat-move-source','kt-av-open');
    };
    box.appendChild(b);
  }

  document.addEventListener('click',function(e){
    if(!source)return;
    if(e.target&&e.target.closest&&e.target.closest('.kt-inside-move-seat'))return;
    var dest=e.target&&e.target.closest?e.target.closest(guestSelector):null;
    if(!dest||dest===source)return;
    var sameRoom=source.closest('.ktg13-room,.ktsubscriber-room,.ktsecret-room')===dest.closest('.ktg13-room,.ktsubscriber-room,.ktsecret-room');
    if(!sameRoom)return;
    try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
    var from=source;
    clearMove();
    swapSeats(from,dest);
    setTimeout(install,30);
  },true);

  function install(){
    ensureStyle();
    document.querySelectorAll(guestSelector).forEach(function(tile){
      if(tile.querySelector(':scope > .kt-inside-av-controls'))addButton(tile);
    });
  }

  install();
  [80,220,500,1000].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
})();

/* 사용방법에 네 방송방 카메라·마이크·자리 이동 설명만 추가. */
(function(){
  if(window.__ktRoomAvGuideInstalled)return;
  window.__ktRoomAvGuideInstalled=true;

  function addGuide(){
    var page=document.querySelector('.kt-guide-page');
    if(!page||page.querySelector('.kt-room-av-guide'))return;
    var cards=page.querySelector('.kt-guide-cards');
    if(!cards)return;
    var d=document.createElement('div');
    d.className='kt-room-av-guide';
    d.innerHTML='<span>🎛️</span><b>방송방 카메라·마이크·자리 이동</b><small>9명방 · 13명방 · 구독자방 · 비밀방에서 사람이 있는 화면을 누르면 📷 카메라 · 🎤 마이크 · ↔ 자리 이동 버튼이 표시됩니다. 자리를 옮기려면 ↔를 누른 뒤 이동할 자리를 누르세요.</small>';
    cards.appendChild(d);
  }

  var old=window.openSiteGuide;
  if(typeof old==='function'){
    window.openSiteGuide=function(){
      var r=old.apply(this,arguments);
      setTimeout(addGuide,0);
      return r;
    };
  }
})();

/* 네 방송방 권한만 구분: 호스트·운영진은 관리, 게스트는 본인 카메라·마이크만. */
(function(){
  if(window.__ktRoomAvRolePermissionInstalled)return;
  window.__ktRoomAvRolePermissionInstalled=true;

  var tileSelector='.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot';

  function roleText(){
    var s=window.state||{};
    var vals=[s.role,s.userRole,s.memberRole,s.levelName,s.gradeName,s.rankName,s.membershipName,s.userGrade,s.userLevel];
    try{
      ['kt_role','kt_user_role','kt_member_role','kt_grade','kt_level_name'].forEach(function(k){var v=localStorage.getItem(k);if(v)vals.push(v);});
    }catch(e){}
    return vals.filter(Boolean).join(' ');
  }

  function isManager(){
    var s=window.state||{};
    if(s.isHost===true||s.isAdmin===true||s.isOperator===true||s.isStaff===true||window.KT_IS_ADMIN===true||window.KT_IS_OPERATOR===true)return true;
    if(/최고\s*운영자|운영자|관리자|admin|operator|staff/i.test(roleText()))return true;
    try{
      if(s.stream){
        var host=document.querySelector('.ktg13-host video,.ktsubscriber-host video,.ktsecret-slot.host video');
        if(host&&host.srcObject&&host.srcObject===s.stream)return true;
      }
    }catch(e){}
    return false;
  }

  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function isOwnTile(tile){
    if(!tile)return false;
    var s=window.state||{};
    try{
      if(tile.dataset&&(tile.dataset.self==='1'||tile.dataset.me==='1'||tile.dataset.local==='1'||tile.dataset.own==='1'))return true;
      if(tile.classList&&(tile.classList.contains('me')||tile.classList.contains('self')||tile.classList.contains('local')))return true;
      var v=videoOf(tile);
      if(s.stream&&v&&v.srcObject&&v.srcObject===s.stream)return true;
      var mine=[s.userId,s.currentUserId,s.memberId,s.profileId,s.uid].filter(Boolean).map(String);
      var theirs=[];
      if(tile.dataset)theirs=[tile.dataset.userId,tile.dataset.participantId,tile.dataset.memberId,tile.dataset.uid].filter(Boolean).map(String);
      for(var i=0;i<mine.length;i++)if(theirs.indexOf(mine[i])>-1)return true;
    }catch(e){}
    return false;
  }

  function ensureStyle(){
    if(document.getElementById('ktRoomAvRolePermissionStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomAvRolePermissionStyle';
    s.textContent=''
      +'.kt-av-no-access>.kt-inside-av-controls{display:none!important}'
      +'.kt-av-self-only>.kt-inside-av-controls .kt-inside-move-seat{display:none!important}'
      +'.kt-inside-manager-key{width:23px!important;height:23px!important;min-width:23px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:rgba(176,124,15,.88)!important;border:1px solid rgba(255,224,115,.72)!important;font-size:12px!important;line-height:1!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function managerHearOpenMics(){
    if(!isManager())return;
    var s=window.state||{};
    document.querySelectorAll(tileSelector).forEach(function(tile){
      var v=videoOf(tile);
      if(!v)return;
      try{
        if(s.stream&&v.srcObject===s.stream)return;
        if(v.dataset&&v.dataset.ktManagerMicLocked==='1')return;
        v.muted=false;
        v.volume=1;
        if(v.paused&&typeof v.play==='function')v.play().catch(function(){});
      }catch(e){}
    });
  }

  function apply(){
    ensureStyle();
    var manager=isManager();
    document.querySelectorAll(tileSelector).forEach(function(tile){
      var box=tile.querySelector(':scope > .kt-inside-av-controls');
      if(!box)return;
      var own=isOwnTile(tile);
      tile.classList.toggle('kt-av-no-access',!manager&&!own);
      tile.classList.toggle('kt-av-self-only',!manager&&own);
      var move=box.querySelector('.kt-inside-move-seat');
      if(move){
        move.style.setProperty('display',manager?'grid':'none','important');
        move.disabled=!manager;
      }
      var key=box.querySelector('.kt-inside-manager-key');
      if(manager){
        if(!key){
          key=document.createElement('span');
          key.className='kt-inside-manager-key';
          key.textContent='🔑';
          key.title='호스트·운영진 관리 권한';
          box.insertBefore(key,box.firstChild);
        }
      }else if(key){
        key.remove();
      }
    });
    managerHearOpenMics();
  }

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.kt-inside-camera,.kt-inside-mic,.kt-inside-move-seat'):null;
    if(!btn)return;
    var tile=btn.closest(tileSelector);
    if(!tile)return;
    var manager=isManager();
    if(btn.classList.contains('kt-inside-move-seat')){
      if(manager)return;
      try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
      return;
    }
    if(manager||isOwnTile(tile))return;
    try{e.preventDefault();e.stopImmediatePropagation();}catch(err){}
  },true);

  document.addEventListener('pointerdown',function(){setTimeout(managerHearOpenMics,0);},true);
  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,900);
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktRoomAvRoleTimer);window.__ktRoomAvRoleTimer=setTimeout(apply,30);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  var oldGuide=window.openSiteGuide;
  if(typeof oldGuide==='function'){
    window.openSiteGuide=function(){
      var r=oldGuide.apply(this,arguments);
      setTimeout(function(){
        var t=document.querySelector('.kt-room-av-guide small');
        if(t)t.textContent='9명방 · 13명방 · 구독자방 · 비밀방에서 호스트·운영진은 🔑 관리 권한으로 게스트 카메라·마이크 잠금/해제와 자리 이동을 관리합니다. 게스트는 본인 화면의 카메라·마이크만 켜고 끌 수 있으며 자리 이동은 할 수 없습니다. 게스트가 열어 둔 마이크는 호스트·운영진에게 들립니다.';
      },0);
      return r;
    };
  }
})();