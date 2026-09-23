/* K-Talk 호스트방 게스트 표시 통일 (2026-09-23)
   9명방 / 13명방 / 구독자방 / 비밀방의 실제 입장 게스트만
   위: 🌹 0(실제 수량이 있으면 그 수량)
   아래: 닉네임 + Lv.레벨
   빈 게스트 칸, 방 배치, 통신, 채팅, 버튼, 선물, 수익률은 건드리지 않음. */
(function(){
  if(window.__ktAllRoomGuestRoseNameLevel20260923)return;
  window.__ktAllRoomGuestRoseNameLevel20260923=true;

  var SEL=[
    '#screen .ktg13-room .ktg13-guest',
    '#screen .ktg9-room .ktg9-guest',
    '#screen .ktsubscriber-room .ktsubscriber-guest',
    '#screen .ktsecret-room .ktsecret-slot:not(.host)',
    '#screen .ktsecret-room .ktsecret-guest-slot:not(.host)'
  ].join(',');

  function videoOf(tile){
    try{return tile&&tile.querySelector?tile.querySelector('video'):null;}catch(e){return null;}
  }

  function value(tile,names){
    var d=tile&&tile.dataset?tile.dataset:{};
    var v=videoOf(tile),vd=v&&v.dataset?v.dataset:{};
    for(var i=0;i<names.length;i++){
      var k=names[i];
      if(d[k]!=null&&String(d[k]).trim())return String(d[k]).trim();
      if(vd[k]!=null&&String(vd[k]).trim())return String(vd[k]).trim();
    }
    return '';
  }

  function hasRealVideo(tile){
    try{
      var v=videoOf(tile);
      if(!v)return false;
      var s=v.srcObject;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
      if(v.currentSrc&&v.readyState>=1)return true;
    }catch(e){}
    return false;
  }

  function occupied(tile){
    if(!tile)return false;
    try{
      var d=tile.dataset||{};
      if(d.ktGuestViewerId||d.ktDirectGuest||d.userId||d.participantId||d.memberId||d.uid||d.occupied==='1'||d.approved==='1')return true;
      if(tile.classList.contains('kt-guest-approved'))return true;
      if(hasRealVideo(tile))return true;
      if(tile.querySelector('.ktsecret-guest-photo'))return true;
    }catch(e){}
    return false;
  }

  function cleanName(s){
    s=String(s||'').replace(/^\s*[👤🌹🪙]+\s*/,'').trim();
    s=s.replace(/\s+Lv\.?\s*\d+.*$/i,'').trim();
    if(!s||/^게스트\s*\d*$/i.test(s)||s==='선물대상')return '';
    return s;
  }

  function guestName(tile){
    var n=value(tile,['nickname','displayName','userName','username','name','guestName','profileName']);
    n=cleanName(n);
    if(n)return n;

    try{
      var sels=[
        ':scope > .kt-guest-name',
        ':scope > .kt-guest-nickname',
        ':scope > .ktsecret-guest-name',
        ':scope > .kt-hg-name',
        ':scope > .kgh-label'
      ];
      for(var i=0;i<sels.length;i++){
        var el=tile.querySelector(sels[i]);
        if(!el)continue;
        n=cleanName(el.textContent);
        if(n)return n;
      }
    }catch(e){}

    try{
      var txt=String(tile.textContent||'').replace(/\s+/g,' ').trim();
      var m=txt.match(/(?:^|\s)([^\s]{1,18})\s+Lv\.?\s*\d+/i);
      if(m){
        n=cleanName(m[1]);
        if(n)return n;
      }
    }catch(e){}
    return '게스트';
  }

  function guestLevel(tile){
    var raw=value(tile,['level','userLevel','memberLevel','guestLevel','profileLevel']);
    if(!raw){
      try{
        var el=tile.querySelector(':scope > .kt-hg-level,:scope > .kt-guest-level');
        if(el)raw=el.textContent||'';
      }catch(e){}
    }
    if(!raw){
      try{
        var m=String(tile.textContent||'').match(/Lv\.?\s*(\d+)/i);
        if(m)raw=m[1];
      }catch(e){}
    }
    var n=parseInt(String(raw||'').replace(/[^0-9]/g,''),10);
    if(!isFinite(n)||n<1)n=1;
    try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
    if(!isFinite(n)||n<1)n=1;
    return n;
  }

  function roseCount(tile){
    var raw=value(tile,['roses','roseCount','receivedRoses','roseReceived','giftRoses']);
    if(raw){
      var n=parseInt(String(raw).replace(/[^0-9]/g,''),10);
      if(isFinite(n))return Math.max(0,n);
    }
    try{
      var old=tile.querySelector(':scope > .kt-rose-count-badge,:scope > .kt-guest-reward-badge');
      if(old){
        var m=String(old.textContent||'').replace(/,/g,'').match(/\d+/);
        if(m)return Math.max(0,parseInt(m[0],10)||0);
      }
    }catch(e){}
    return 0;
  }

  function ensureStyle(){
    var id='ktAllRoomGuestRoseNameLevelStyle20260923';
    var s=document.getElementById(id);
    if(s)return;
    s=document.createElement('style');
    s.id=id;
    s.textContent=''
      +'#screen .kt-allguest-occupied{position:relative!important}'
      +'#screen .kt-allguest-rose{position:absolute!important;left:4px!important;top:4px!important;z-index:96!important;height:16px!important;min-width:30px!important;padding:0 5px!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;background:rgba(30,30,34,.92)!important;border:1px solid rgba(255,255,255,.48)!important;color:#fff!important;font:950 8px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 1px 4px #0008!important;pointer-events:none!important}'
      +'#screen .kt-allguest-rose:before{content:"🌹";font-size:8px!important}'
      +'#screen .kt-allguest-profile{position:absolute!important;left:4px!important;bottom:3px!important;z-index:96!important;max-width:calc(100% - 8px)!important;height:16px!important;padding:0 5px!important;border-radius:8px!important;display:flex!important;align-items:center!important;gap:4px!important;background:rgba(0,0,0,.72)!important;color:#fff!important;overflow:hidden!important;white-space:nowrap!important;pointer-events:none!important;box-sizing:border-box!important}'
      +'#screen .kt-allguest-name{display:block!important;min-width:0!important;max-width:68px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font:950 8px/13px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;color:#fff!important}'
      +'#screen .kt-allguest-level{display:inline-flex!important;align-items:center!important;height:12px!important;padding:0 3px!important;border-radius:4px!important;background:rgba(20,20,24,.92)!important;color:#fff!important;font:950 7.5px/11px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;flex:none!important}'
      +'#screen .kt-allguest-occupied>.kt-rose-count-badge,#screen .kt-allguest-occupied>.kt-guest-reward-badge,#screen .kt-allguest-occupied>.kt-guest-identity{display:none!important}'
      +'#screen .ktg13-guest.kt-allguest-occupied.kt-gift-target{outline:none!important;box-shadow:none!important}'+'#screen .ktg13-guest.kt-allguest-occupied.kt-gift-target:after{content:none!important;display:none!important}'+'#screen .ktg13-guest.kt-allguest-occupied>.kt-guest-name{display:none!important}'
      +'#screen .ktsubscriber-guest.kt-allguest-occupied>b,#screen .ktsubscriber-guest.kt-allguest-occupied>span:not(.kt-allguest-rose){display:none!important}'
      +'#screen .ktsecret-slot.kt-allguest-occupied>.ktsecret-guest-wait,#screen .ktsecret-slot.kt-allguest-occupied>.ktsecret-slot-label,#screen .ktsecret-guest-slot.kt-allguest-occupied>.ktsecret-guest-empty,#screen .ktsecret-guest-slot.kt-allguest-occupied>.ktsecret-guest-name{display:none!important}'
      +'@media(max-width:390px){#screen .kt-allguest-rose{left:3px!important;top:3px!important;height:14px!important;min-width:27px!important;padding:0 4px!important;font-size:7px!important}#screen .kt-allguest-profile{left:3px!important;bottom:2px!important;height:14px!important;padding:0 4px!important;gap:3px!important}#screen .kt-allguest-name{max-width:56px!important;font-size:7px!important}#screen .kt-allguest-level{height:11px!important;font-size:6.5px!important;padding:0 2px!important}}';
    document.head.appendChild(s);
  }

  function render(tile){
    if(!tile)return;
    ensureStyle();

    var yes=occupied(tile);
    var rose=tile.querySelector(':scope > .kt-allguest-rose');
    var profile=tile.querySelector(':scope > .kt-allguest-profile');

    if(!yes){
      tile.classList.remove('kt-allguest-occupied');
      if(rose)rose.remove();
      if(profile)profile.remove();
      return;
    }

    tile.classList.add('kt-allguest-occupied');

    if(!rose){
      rose=document.createElement('span');
      rose.className='kt-allguest-rose';
      tile.appendChild(rose);
    }
    rose.textContent=String(roseCount(tile));

    if(!profile){
      profile=document.createElement('div');
      profile.className='kt-allguest-profile';
      profile.innerHTML='<span class="kt-allguest-name"></span><span class="kt-allguest-level"></span>';
      tile.appendChild(profile);
    }

    var nameEl=profile.querySelector('.kt-allguest-name');
    var levelEl=profile.querySelector('.kt-allguest-level');
    if(nameEl)nameEl.textContent=guestName(tile);
    if(levelEl)levelEl.textContent='Lv.'+guestLevel(tile);
  }

  function apply(){
    try{document.querySelectorAll(SEL).forEach(render);}catch(e){}
  }

  apply();
  [50,150,350,700,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,600);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAllRoomGuestRoseNameLevelTimer20260923);
      window.__ktAllRoomGuestRoseNameLevelTimer20260923=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{
      childList:true,
      subtree:true,
      attributes:true,
      attributeFilter:[
        'class','data-kt-guest-viewer-id','data-kt-direct-guest','data-user-id',
        'data-participant-id','data-member-id','data-uid','data-occupied','data-approved',
        'data-nickname','data-display-name','data-level','data-user-level',
        'data-member-level','data-guest-level','data-roses','data-rose-count'
      ]
    });
  }catch(e){}
})();