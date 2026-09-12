/* K-Talk LIVE 연결 감시 전용: 방송방이 실제로 열려 있는데 목록 등록이 빠질 때만 보강. 화면/UI는 건드리지 않음. */
(function(){
  if(window.__ktLivePresenceWatchdogInstalled)return;
  window.__ktLivePresenceWatchdogInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='';
  var roomId='';
  var publishing=false;
  var misses=0;

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
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    await ensureKey();
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
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
  function streamIsLive(s){
    try{return !!(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}));}catch(e){return false;}
  }
  function liveStream(){
    try{
      var s=window.state&&state.stream;
      if(streamIsLive(s))return true;
    }catch(e){}
    try{
      var videos=document.querySelectorAll('.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo,video#camera');
      for(var i=0;i<videos.length;i++)if(streamIsLive(videos[i].srcObject))return true;
    }catch(e){}
    return false;
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
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
  }
  function refreshViews(){
    try{if(window.ktRefreshLiveCards)window.ktRefreshLiveCards();}catch(e){}
    try{if(window.ktRefreshVideoLivePeek)window.ktRefreshVideoLivePeek();}catch(e){}
  }

  async function publishIfNeeded(){
    if(publishing||!liveRoomVisible())return;
    publishing=true;
    var id=hostId(),stamp=now();
    try{
      var rows=await req('ktalk_live_rooms?select=id,active,updated_at&host_id=eq.'+enc(id)+'&active=eq.true&order=started_at.desc&limit=1');
      if(rows&&rows[0]){
        roomId=rows[0].id;
        var inf=roomInfo();
        await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,room_type:inf.type,room_name:inf.name,title:inf.title,updated_at:stamp})});
      }else{
        var r=roomInfo(),p=profile();
        await req('ktalk_live_rooms?host_id=eq.'+enc(id)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
        var made=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:id,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
        roomId=made&&made[0]?made[0].id:'';
      }
      misses=0;
      refreshViews();
    }catch(e){
      roomId='';
      try{window.__ktLiveWatchdogLastError=String(e&&e.message||e);}catch(_){}
    }
    publishing=false;
  }

  async function heartbeat(){
    if(liveRoomVisible()){
      misses=0;
      if(!roomId){await publishIfNeeded();return;}
      try{
        var inf=roomInfo();
        await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,room_type:inf.type,room_name:inf.name,title:inf.title,updated_at:now()})});
      }catch(e){roomId='';}
      return;
    }
    if(!roomId)return;
    misses++;
    if(misses<4)return;
    var old=roomId;roomId='';misses=0;
    try{await req('ktalk_live_rooms?id=eq.'+enc(old),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:now()})});}catch(e){}
    refreshViews();
  }

  document.addEventListener('click',function(){setTimeout(publishIfNeeded,650);},true);
  var mo=new MutationObserver(function(){setTimeout(publishIfNeeded,180);});
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-room']});}catch(e){}
  setInterval(heartbeat,2500);
  setTimeout(publishIfNeeded,700);
  setTimeout(publishIfNeeded,1800);

  window.addEventListener('pagehide',function(){
    if(!roomId)return;
    ensureKey().then(function(){
      try{fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:now()}),keepalive:true});}catch(e){}
    }).catch(function(){});
  });
})();
