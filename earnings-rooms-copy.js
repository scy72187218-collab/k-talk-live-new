/* K-Talk: 13명 방의 내 수익 지급표를 1인/구독자/비밀방에도 동일하게 표시. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktEarningsRoomsCopyInstalled)return;
  window.__ktEarningsRoomsCopyInstalled=true;

  /* 9명/13명 계열 방송의 수익표는 폭을 과하게 줄이지 않고, 상세내용만 기본 접기. */
  if(!document.getElementById('ktCompactGroupEarningsStyle')){
    var compact=document.createElement('style');
    compact.id='ktCompactGroupEarningsStyle';
    compact.textContent=''
      +'.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 34%!important}'
      +'.ktg13-room .ktg13-earn #myEarnHud{overflow:hidden!important}'
      +'.ktg13-room .ktg13-earn #myEarnDetail{font-size:6px!important;gap:1px 2px!important;line-height:1.08!important}'
      +'@media(max-width:390px){.ktg13-room .ktg13-mid{grid-template-columns:minmax(0,1fr) 34%!important}}';
    document.head.appendChild(compact);
  }

  function compactGroupEarnings(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    var detail=room.querySelector('#myEarnDetail');
    if(detail&&detail.getAttribute('data-kt-compact-init')!=='1'){
      detail.style.display='none';
      detail.setAttribute('data-kt-compact-init','1');
    }
  }

  function isTargetRoom(){
    return !!document.querySelector('.ktsolo-room,.ktsubscriber-room,.ktsecret-room');
  }

  function applyEarningsCopy(){
    compactGroupEarnings();
    if(!isTargetRoom())return;

    var subscriberRoom=!!document.querySelector('.ktsubscriber-room');
    var hud=document.getElementById('myEarnHud');
    if(!hud&&subscriberRoom)hud=document.getElementById('ktSubscriberEarnHud');
    if(!hud||hud.getAttribute('data-kt-earnings-copy')==='1')return;

    var netEl=document.getElementById('hudEarnNet')||document.getElementById('ktSubscriberEarnNet');
    var rosesEl=document.getElementById('hudEarnRoses')||document.getElementById('ktSubscriberEarnRoses');
    var net=netEl?netEl.textContent:'0원';
    var roses=rosesEl?rosesEl.textContent:'🌹 0송이';

    var isSubscriberHud=hud.id==='ktSubscriberEarnHud';
    var netId=isSubscriberHud?'ktSubscriberEarnNet':'hudEarnNet';
    var detailId=isSubscriberHud?'ktSubscriberEarnDetail':'myEarnDetail';
    var rosesId=isSubscriberHud?'ktSubscriberEarnRoses':'hudEarnRoses';
    var rateId=isSubscriberHud?'ktSubscriberEarnRate':'hudEarnRate';

    hud.innerHTML=''
      +'<div style="display:flex;align-items:center;justify-content:center;gap:4px">'
        +'<span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익 · 본인만 표시</span>'
        +'<b id="'+netId+'" style="font-size:12px;color:#ffe071;white-space:nowrap">'+net+'</b>'
      +'</div>'
      +'<div id="'+detailId+'" style="display:none;grid-template-columns:1fr auto;gap:1px 4px;margin-top:1px;font-size:7px;color:#ddd;line-height:1.15">'
        +'<span id="'+rosesId+'">'+roses+'</span>'
        +'<span id="'+rateId+'" style="text-align:right;white-space:nowrap">일반회원 35%</span>'
        +'<span style="grid-column:1/-1;text-align:right;white-space:nowrap">구독자회원 40% · 소속사 65%</span>'
        +'<span style="grid-column:1/-1;text-align:right;color:#ffe071;white-space:nowrap">소속사 가입은 소속사가 결정</span>'
      +'</div>';
    hud.setAttribute('data-kt-earnings-copy','1');
  }

  var obs=new MutationObserver(function(){setTimeout(applyEarningsCopy,0);});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',applyEarningsCopy);
  setTimeout(applyEarningsCopy,0);
})();

/* 1인·구독자·비밀방 오른쪽: 기존 선물 버튼만 숨기고, 효과 바로 아래에 보물상자만 추가. */
(function(){
  if(window.__ktEffectTreasureRightSideInstalled)return;
  window.__ktEffectTreasureRightSideInstalled=true;

  window.ktRoomQuickTreasure=function(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts)window.openGifts();}catch(e){}
  };

  function fixSide(selector,effectFn){
    var side=document.querySelector(selector);
    if(!side)return;

    var buttons=Array.from(side.children).filter(function(el){return el&&el.tagName==='BUTTON';});
    var like=buttons.find(function(b){return b.classList.contains('like');})||null;
    var effect=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf(effectFn)>-1;})||null;
    var match=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('openHostMatchArena')>-1;})||null;

    buttons.forEach(function(btn){
      var oc=String(btn.getAttribute('onclick')||'');
      if(oc.indexOf('openGifts')>-1 && !btn.hasAttribute('data-kt-quick-treasure')){
        btn.style.setProperty('display','none','important');
      }
    });

    if(!effect){
      effect=document.createElement('button');
      effect.type='button';
      effect.setAttribute('onclick','if(window.'+effectFn+')window.'+effectFn+'()');
      effect.innerHTML='✨<small>효과</small>';
    }
    effect.style.removeProperty('display');

    var chest=side.querySelector('[data-kt-quick-treasure]');
    if(!chest){
      chest=document.createElement('button');
      chest.type='button';
      chest.setAttribute('data-kt-quick-treasure','1');
      chest.setAttribute('aria-label','보물상자');
      chest.setAttribute('onclick','ktRoomQuickTreasure()');
      chest.innerHTML='🎁<small>보물상자</small>';
    }

    if(like && like.nextElementSibling!==effect){
      side.insertBefore(effect,like.nextElementSibling);
    }else if(!like && effect.parentNode!==side){
      side.insertBefore(effect,side.firstChild);
    }

    if(effect.nextElementSibling!==chest){
      side.insertBefore(chest,effect.nextElementSibling);
    }

    if(match && chest.nextElementSibling!==match){
      side.insertBefore(match,chest.nextElementSibling);
    }
  }

  function applyRightSide(){
    fixSide('.ktsolo-right','ktSoloEffect');
    fixSide('.ktsubscriber-right','ktSubscriberEffect');
    fixSide('.ktsecret-right','ktSecretEffect');
  }

  var obs2=new MutationObserver(function(){setTimeout(applyRightSide,0);});
  obs2.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',applyRightSide);
  setTimeout(applyRightSide,0);
})();

/* 방송목록 등록 보강: 이 파일은 모든 방송방에서 이미 로드되므로 라이브 시작 터치 즉시 서버에 직접 등록한다. */
(function(){
  if(window.__ktDirectPresenceFallbackInstalled)return;
  window.__ktDirectPresenceFallbackInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='';
  var roomId='';
  var live=false;
  var busy=false;

  async function ensureKey(){
    if(KEY)return KEY;
    var r=await fetch('live-presence.js?v=20260913-direct3',{cache:'no-store'});
    if(!r.ok)throw new Error('live config');
    var t=await r.text();
    var m=t.match(/var KEY='([^']+)'/);
    if(!m)throw new Error('live config');
    KEY=m[1];
    return KEY;
  }
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    await ensureKey();
    opt=opt||{};
    opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('direct live '+r.status);
    if(r.status===204)return null;
    var t=await r.text();
    return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function now(){return new Date().toISOString();}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function profile(){
    var p={name:'K-Talk 방송자',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||p.name);p.photo=String(x.photo||'');}}catch(e){}
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
  }
  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    try{type=String((window.state&&state.liveRoomType)||'solo');name=String((window.state&&state.liveRoomName)||'1인 방송');}catch(e){}
    if(type==='group')type='group13';
    if(type==='group9')name='9명 방송';
    if(type==='group13')name=name||'13명 방송';
    if(type==='group15')name='15명 방송';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }

  async function startPresence(){
    live=true;
    if(busy)return;
    busy=true;
    var id=deviceId(),stamp=now();
    try{
      var p=profile(),r=roomInfo();
      var rows=await req('ktalk_live_rooms?select=id&host_id=eq.'+enc(id)+'&order=updated_at.desc&limit=1');
      if(rows&&rows[0]){
        roomId=rows[0].id;
        await req('ktalk_live_rooms?host_id=eq.'+enc(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
        await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      }else{
        var made=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:id,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
        roomId=made&&made[0]?made[0].id:'';
      }
      if(window.ktRefreshLiveCards)try{window.ktRefreshLiveCards();}catch(e){}
      window.__ktDirectPresenceError='';
    }catch(e){
      roomId='';
      window.__ktDirectPresenceError=String(e&&e.message||e);
    }
    busy=false;
  }

  async function pulse(){
    if(!live)return;
    if(!roomId){startPresence();return;}
    try{
      var r=roomInfo();
      await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,room_type:r.type,room_name:r.name,title:r.title,updated_at:now()})});
    }catch(e){roomId='';}
  }

  async function stopPresence(){
    live=false;
    var old=roomId;roomId='';
    if(!old)return;
    try{await req('ktalk_live_rooms?id=eq.'+enc(old),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
  }

  document.addEventListener('click',function(e){
    var target=e.target&&e.target.closest?e.target:null;
    if(!target||!target.closest)return;
    if(target.closest('.prep-start')){
      startPresence();
      setTimeout(startPresence,900);
      setTimeout(startPresence,2200);
      return;
    }
    var back=target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back');
    var btn=target.closest('button');
    var oc=btn?String(btn.getAttribute('onclick')||''):'';
    if(back||oc.indexOf('endBroadcastEarnings')>-1||oc.indexOf('leaveBroadcastToDashboard')>-1)stopPresence();
  },true);

  setInterval(pulse,10000);
  window.addEventListener('pagehide',function(){
    live=false;
    if(!roomId||!KEY)return;
    try{fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:now()}),keepalive:true});}catch(e){}
  });
})();
