/* K-Talk 모든 방송방 게스트 장미/닉네임/레벨 통일 (2026-09-22)
   1인방 / 9명방 / 13명방 / 구독방 / 비밀방.
   실제 사람이 들어온 게스트 칸만 표시.
   방 배치/통신/채팅/버튼/수익률은 변경하지 않음. */
(function(){
  if(window.__ktAllRoomGuestRoseNameLevel20260922)return;
  window.__ktAllRoomGuestRoseNameLevel20260922=true;

  var SEL=[
    '#screen .ktg13-room .ktg13-guest',
    '#screen .ktg9-room .ktg9-guest',
    '#screen .ktsubscriber-room .ktsubscriber-guest',
    '#screen .ktsecret-room .ktsecret-slot:not(.host)',
    '#screen .ktsecret-room .ktsecret-guest-slot',
    '#screen .kt-guest-hostlike-room .kgh-cell.self',
    '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self',
    '#screen .kt-prejoin-room-grid .kt-prejoin-room-cell.self',
    '#screen .kt-guest-room-grid .kt-guest-room-cell.self'
  ].join(',');

  function profile(){
    try{if(typeof window.ktProfileLoad==='function')return window.ktProfileLoad()||{};}catch(e){}
    return {};
  }
  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }
  function hasLiveVideo(tile){
    try{
      var v=videoOf(tile),s=v&&v.srcObject;
      return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }
  function isSelf(tile){
    if(!tile)return false;
    try{
      if(tile.matches('.kgh-cell.self,.kt-approved-guest-cell.self,.kt-prejoin-room-cell.self,.kt-guest-room-cell.self'))return true;
      var d=tile.dataset||{};
      if(d.self==='1'||d.me==='1'||d.local==='1'||d.own==='1')return true;
      var v=videoOf(tile);
      if(window.__ktApprovedGuestSelfStream&&v&&v.srcObject===window.__ktApprovedGuestSelfStream)return true;
      if(window.state&&state.stream&&v&&v.srcObject===state.stream&&!tile.classList.contains('ktg13-host'))return true;
    }catch(e){}
    return false;
  }
  function occupied(tile){
    if(!tile)return false;
    if(isSelf(tile))return true;
    try{
      var d=tile.dataset||{};
      if(d.ktGuestViewerId||d.ktDirectGuest||d.userId||d.participantId||d.memberId||d.uid||d.occupied==='1'||d.approved==='1')return true;
      if(hasLiveVideo(tile))return true;
    }catch(e){}
    return false;
  }
  function value(tile,names){
    var d=tile&&tile.dataset?tile.dataset:{};
    var v=videoOf(tile),md=v&&v.dataset?v.dataset:{};
    for(var i=0;i<names.length;i++){
      var k=names[i];
      if(d[k]!=null&&String(d[k]).trim())return String(d[k]).trim();
      if(md[k]!=null&&String(md[k]).trim())return String(md[k]).trim();
    }
    return '';
  }
  function localName(){
    var p=profile(),n=p.nickname||p.name||p.displayName||'';
    try{n=n||localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'';}catch(e){}
    return String(n||'게스트').trim();
  }
  function guestName(tile){
    if(isSelf(tile))return localName();
    var n=value(tile,['nickname','displayName','userName','username','name','guestName','profileName']);
    if(n)return n;
    try{
      var el=tile.querySelector('.kt-guest-name,.ktsecret-guest-name,.kt-guest-nickname,.kgh-label');
      if(el){
        n=String(el.textContent||'').replace(/^\s*👤\s*/,'').trim();
        if(n&&n!=='나 · 게스트'&&!/^게스트\s*\d*$/i.test(n))return n;
      }
    }catch(e){}
    return '게스트';
  }
  function guestLevel(tile){
    var raw=value(tile,['level','userLevel','memberLevel','guestLevel','profileLevel']);
    if(!raw){
      try{
        var txt=String(tile&&tile.textContent||'');
        var m=txt.match(/Lv\.?\s*(\d+)/i);
        if(m)raw=m[1];
      }catch(e){}
    }
    if(!raw&&isSelf(tile)){
      try{
        var s=window.state||{};
        raw=s.level||s.userLevel||s.memberLevel||s.profileLevel||'';
      }catch(e){}
      if(!raw){
        var p=profile();
        raw=p.level||p.userLevel||p.memberLevel||p.profileLevel||'';
      }
      if(!raw){
        try{raw=localStorage.getItem('ktalk_level')||localStorage.getItem('level')||'';}catch(e){}
      }
    }
    var n=parseInt(String(raw||'').replace(/[^0-9]/g,''),10);
    if(!isFinite(n)||n<1)n=1;
    try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
    if(!isFinite(n)||n<1)n=1;
    return n;
  }
  function roseCount(tile){
    if(isSelf(tile)){
      var ge=document.getElementById('ktGuestEarnRoses');
      if(ge){
        var m=String(ge.textContent||'').replace(/,/g,'').match(/\d+/);
        if(m)return parseInt(m[0],10)||0;
      }
    }
    var raw=value(tile,['roses','roseCount','receivedRoses','roseReceived','giftRoses']);
    if(raw){
      var n=parseInt(String(raw).replace(/[^0-9]/g,''),10);
      if(isFinite(n))return Math.max(0,n);
    }
    try{
      var old=tile.querySelector(':scope > .kt-rose-count-badge');
      if(old){
        var m2=String(old.textContent||'').replace(/,/g,'').match(/\d+/);
        if(m2)return parseInt(m2[0],10)||0;
      }
    }catch(e){}
    return 0;
  }

  function style(){
    if(document.getElementById('ktAllRoomGuestRoseNameLevelStyle20260922'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomGuestRoseNameLevelStyle20260922';
    s.textContent=''
      +'#screen .kt-allguest-rose{position:absolute!important;left:4px!important;top:4px!important;z-index:96!important;height:15px!important;min-width:28px!important;padding:0 5px!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;background:rgba(30,30,34,.90)!important;border:1px solid rgba(255,255,255,.48)!important;color:#fff!important;font:950 8px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 1px 4px #0008!important;pointer-events:none!important}'
      +'#screen .kt-allguest-rose:before{content:"🌹";font-size:8px!important}'
      +'#screen .kt-allguest-profile{position:absolute!important;left:3px!important;bottom:2px!important;z-index:96!important;height:14px!important;max-width:calc(100% - 6px)!important;padding:0 4px!important;border-radius:7px!important;display:flex!important;align-items:center!important;gap:3px!important;background:rgba(0,0,0,.68)!important;color:#fff!important;overflow:hidden!important;pointer-events:none!important;box-sizing:border-box!important}'
      +'#screen .kt-allguest-name{display:block!important;max-width:62px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font:950 7px/12px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;color:#fff!important}'
      +'#screen .kt-allguest-level{display:inline-flex!important;align-items:center!important;height:11px!important;padding:0 3px!important;border-radius:4px!important;background:rgba(18,18,22,.86)!important;color:#fff!important;font:950 7px/10px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important}'
      +'#screen .kgh-cell.self>.kgh-label,#screen .kt-approved-guest-cell.self>.kt-approved-guest-label,#screen .kt-prejoin-room-cell.self>.kt-prejoin-room-label,#screen .kt-guest-room-cell.self>.kt-guest-room-label{display:none!important}'
      +'#screen .ktsubscriber-guest.kt-allguest-occupied>b{display:none!important}'
      +'#screen .ktsubscriber-guest.kt-allguest-occupied>span:not(.kt-allguest-rose){display:none!important}'
      +'#screen .ktsecret-guest-slot.kt-allguest-occupied>.ktsecret-guest-empty{display:none!important}'
      +'@media(max-width:390px){#screen .kt-allguest-rose{left:3px!important;top:3px!important;height:14px!important;min-width:26px!important;padding:0 4px!important;font-size:7px!important}#screen .kt-allguest-profile{left:2px!important;bottom:1px!important;height:13px!important;padding:0 3px!important;gap:2px!important}#screen .kt-allguest-name,#screen .kt-allguest-level{font-size:6.5px!important}}';
    document.head.appendChild(s);
  }

  function render(tile){
    if(!tile)return;
    style();
    var yes=occupied(tile);
    var r=tile.querySelector(':scope > .kt-allguest-rose');
    var p=tile.querySelector(':scope > .kt-allguest-profile');
    if(!yes){
      tile.classList.remove('kt-allguest-occupied');
      if(r)r.remove();
      if(p)p.remove();
      return;
    }
    tile.classList.add('kt-allguest-occupied');
    try{tile.style.setProperty('position','relative','important');}catch(e){}

    if(!r){
      r=document.createElement('span');
      r.className='kt-allguest-rose';
      tile.appendChild(r);
    }
    r.textContent=String(roseCount(tile));

    if(!p){
      p=document.createElement('div');
      p.className='kt-allguest-profile';
      p.innerHTML='<span class="kt-allguest-name"></span><span class="kt-allguest-level"></span>';
      tile.appendChild(p);
    }
    var n=p.querySelector('.kt-allguest-name');
    var l=p.querySelector('.kt-allguest-level');
    if(n)n.textContent=guestName(tile);
    var lv=guestLevel(tile);
    if(l){
      l.textContent='Lv.'+lv;
      l.style.display='inline-flex';
    }

    /* Hide only the old generic guest-name labels in an occupied tile. */
    try{
      tile.querySelectorAll(':scope > .kt-guest-name,:scope > .ktsecret-guest-name').forEach(function(x){
        if(x!==p)x.style.setProperty('display','none','important');
      });
    }catch(e){}
  }

  function apply(){
    document.querySelectorAll(SEL).forEach(render);
  }

  apply();
  [60,160,350,700,1300,2200].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,650);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomGuestRoseNameLevelTimer20260922);
      window.__ktAllRoomGuestRoseNameLevelTimer20260922=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{
      childList:true,subtree:true,attributes:true,
      attributeFilter:['data-kt-guest-viewer-id','data-kt-direct-guest','data-user-id','data-level','data-user-level','data-member-level','data-guest-level','data-nickname','data-display-name','class']
    });
  }catch(e){}
})();