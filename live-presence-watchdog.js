/* K-Talk LIVE 연결 감시 전용: 방송 시작 즉시 목록 등록을 보강. 화면/UI는 건드리지 않음. */
(function(){
  if(window.__ktLivePresenceWatchdogInstalled)return;
  window.__ktLivePresenceWatchdogInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='';
  var roomId='';
  var publishing=false;
  var misses=0;
  var broadcastStarted=false;
  var lastDedupeAt=0;

  async function ensureKey(){
    if(KEY)return KEY;
    var r=await fetch('live-presence.js?v=20260913-list1',{cache:'no-store'});
    if(!r.ok)throw new Error('live config');
    var t=await r.text();
    var m=t.match(/var KEY='([^']+)'/);
    if(!m)throw new Error('live config');
    KEY=m[1];
    return KEY;
  }
  async function fetchStable(url,opt){
    var lastError=null;
    for(var attempt=0;attempt<2;attempt++){
      var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
      var timer=ctrl?setTimeout(function(){ctrl.abort();},12000):null;
      try{
        var next=Object.assign({},opt||{});
        if(ctrl)next.signal=ctrl.signal;
        var response=await fetch(url,next);
        if(timer)clearTimeout(timer);
        return response;
      }catch(e){
        if(timer)clearTimeout(timer);
        lastError=e;
        if(attempt===0)await new Promise(function(resolve){setTimeout(resolve,700);});
      }
    }
    throw lastError||new Error('live watchdog network');
  }
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    await ensureKey();
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetchStable(BASE+path,opt);
    if(!r.ok)throw new Error('live watchdog '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function now(){return new Date().toISOString();}
  function hostId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function group9Open(){
    try{
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      if(t==='group9'||n==='9명 방송'){
        if(document.querySelector('.ktg13-room[data-kt-room="9"],.ktg13-room,#ktLiveVideo'))return true;
      }
    }catch(e){}
    try{
      if(document.querySelector('.ktg13-room[data-kt-room="9"]'))return true;
      var air=document.querySelector('.ktg13-air strong');
      if(air&&String(air.textContent||'').indexOf('9명 방송')>-1)return true;
    }catch(e){}
    return false;
  }
  function liveRoomVisible(){
    if(group9Open())return true;
    return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo');
  }
  function shouldBeLive(){
    return broadcastStarted||liveRoomVisible();
  }
  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    if(group9Open()){
      type='group9';name='9명 방송';
      try{var n=document.getElementById('liveTitle');title=n?String(n.value||'').trim():'';}catch(e){}
      if(!title||title==='오늘 라이브 제목을 입력하세요'||title==='13명 방송')title='9명 방송';
      return {type:type,name:name,title:title};
    }
    try{type=String((window.state&&state.liveRoomType)||'solo');name=String((window.state&&state.liveRoomName)||'1인 방송');}catch(e){}
    if(type==='group')type='group13';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }
  function profile(){
    var p={name:'K-Talk 방송자',photo:''};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||p.name);p.photo=String(x.photo||'');}}catch(e){}
    if(!p.photo){
      try{
        var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
        if(sub){
          var raw=localStorage.getItem('ktalk_profile_v1:sub:'+sub);
          if(raw){var sp=JSON.parse(raw)||{};if(sp.name)p.name=String(sp.name);if(sp.photo)p.photo=String(sp.photo);}
        }
      }catch(e){}
    }
    if(p.photo&&p.photo.length>900000)p.photo='';
    return p;
  }
  function refreshViews(){
    try{if(window.ktRefreshLiveCards)window.ktRefreshLiveCards();}catch(e){}
    try{if(window.ktRefreshVideoLivePeek)window.ktRefreshVideoLivePeek();}catch(e){}
  }

  function fastViewerRefresh(){
    try{
      if(document.hidden)return;
      if(document.querySelector('.friends-list')&&typeof window.ktRefreshLiveCards==='function')window.ktRefreshLiveCards();
      if(document.body&&document.body.classList.contains('kt-video-mode')&&typeof window.ktRefreshVideoLivePeek==='function')window.ktRefreshVideoLivePeek();
    }catch(e){}
  }

  async function syncExistingRows(id,stamp,r,p){
    var rows=await req('ktalk_live_rooms?select=id,host_id,active,started_at,updated_at&host_id=eq.'+enc(id)+'&active=eq.true&order=started_at.desc&limit=20');
    rows=Array.isArray(rows)?rows:[];
    if(!rows.length)return false;
    var keep=rows[0];
    roomId=keep.id;
    await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,updated_at:stamp,host_photo:p.photo||null})});
    for(var i=1;i<rows.length;i++){
      try{await req('ktalk_live_rooms?id=eq.'+enc(rows[i].id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});}catch(e){}
    }
    lastDedupeAt=Date.now();
    return true;
  }

  async function publishIfNeeded(force){
    if(publishing||(!force&&!shouldBeLive()))return;
    publishing=true;
    var id=hostId(),stamp=now();
    try{
      var r=roomInfo(),p=profile();
      if(await syncExistingRows(id,stamp,r,p)){
        misses=0;
        refreshViews();
        publishing=false;
        return;
      }
      var made=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:id,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      roomId=made&&made[0]?made[0].id:'';
      if(!roomId)throw new Error('live watchdog no room id');
      lastDedupeAt=Date.now();
      misses=0;
      refreshViews();
    }catch(e){
      roomId='';
      try{window.__ktLiveWatchdogLastError=String(e&&e.message||e);}catch(_){}
    }
    publishing=false;
  }

  async function stopFallbackPresence(){
    broadcastStarted=false;
    misses=0;
    var old=roomId;roomId='';
    if(!old)return;
    try{await req('ktalk_live_rooms?id=eq.'+enc(old),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
    refreshViews();
  }

  function markBroadcastStarted(){
    broadcastStarted=true;
    publishIfNeeded(true);
    [250,700,1600].forEach(function(ms){setTimeout(function(){publishIfNeeded(true);},ms);});
  }

  function wrapStartBroadcast(){
    var old=window.startBroadcast;
    if(typeof old!=='function'||old.__ktWatchdogStartWrapped)return;
    var fn=function(){
      var self=this,args=arguments,r;
      r=old.apply(self,args);
      if(r&&typeof r.then==='function'){
        return r.then(function(v){markBroadcastStarted();return v;});
      }
      markBroadcastStarted();
      return r;
    };
    fn.__ktWatchdogStartWrapped=true;
    window.startBroadcast=fn;
  }

  function wrapStop(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktWatchdogStopWrapped)return;
    var fn=function(){
      stopFallbackPresence();
      return old.apply(this,arguments);
    };
    fn.__ktWatchdogStopWrapped=true;
    window[name]=fn;
  }

  async function heartbeat(){
    if(shouldBeLive()){
      misses=0;
      if(!roomId){await publishIfNeeded(true);return;}
      try{
        var inf=roomInfo(),p=profile(),stamp=now();
        if(Date.now()-lastDedupeAt>9000){
          if(await syncExistingRows(hostId(),stamp,inf,p))return;
        }
        await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_name:p.name,active:true,room_type:inf.type,room_name:inf.name,title:inf.title,updated_at:stamp,host_photo:p.photo||null})});
      }catch(e){
        /* 일시적인 네트워크 실패 때 방 ID를 버리면 새 방이 중복 등록된다. 기존 방을 유지한다. */
        return;
      }
      return;
    }
    if(!roomId)return;
    misses++;
    if(misses<4)return;
    await stopFallbackPresence();
  }

  function startTarget(e){
    var el=e&&e.target&&e.target.closest?e.target.closest('button,.prep-start'):null;
    if(!el)return false;
    if(el.classList&&el.classList.contains('prep-start'))return true;
    return /방송\s*시작/.test(String(el.textContent||''));
  }

  wrapStartBroadcast();
  wrapStop('leaveBroadcastToDashboard');
  wrapStop('endBroadcastEarnings');

  document.addEventListener('pointerdown',function(e){
    if(startTarget(e))markBroadcastStarted();
  },true);

  document.addEventListener('click',function(e){
    if(startTarget(e))markBroadcastStarted();
    var t=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back'):null;
    if(t)stopFallbackPresence();
    setTimeout(function(){publishIfNeeded(false);},650);
  },true);

  document.addEventListener('visibilitychange',function(){if(!document.hidden)fastViewerRefresh();});
  window.addEventListener('focus',fastViewerRefresh);

  var mo=new MutationObserver(function(){setTimeout(function(){publishIfNeeded(false);fastViewerRefresh();},180);});
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-room']});}catch(e){}
  setInterval(function(){wrapStartBroadcast();},1200);
  setInterval(heartbeat,2500);
  setInterval(fastViewerRefresh,1000);
  setTimeout(function(){publishIfNeeded(false);},700);
  setTimeout(function(){publishIfNeeded(false);},1800);
  setTimeout(fastViewerRefresh,220);

  /* 휴대폰에서 pagehide는 앱 전환만으로도 발생한다. 실제 종료는 나가기 버튼에서 처리하고,
     강제 종료된 경우에는 heartbeat 만료로 정리해 불필요한 입퇴장 반복을 막는다. */
})();
