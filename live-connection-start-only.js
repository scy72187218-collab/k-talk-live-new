/* K-Talk 사람 접속 전용 보강: 방송 시작 등록/재등록만 담당. 화면·스위치·하트·보물상자 등 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktLiveConnectionStartOnlyInstalled)return;
  window.__ktLiveConnectionStartOnlyInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var fallbackRoomId='';
  var fallbackHeartbeat=null;
  var fallbackBusy=false;
  var lastServerCheck=0;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};
    opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('live api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();
    return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function nowIso(){return new Date().toISOString();}
  function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function profile(){
    var p={name:'K-Talk 방송자',photo:''};
    try{
      if(window.ktProfileLoad){
        var x=window.ktProfileLoad()||{};
        if(x.name)p.name=String(x.name);
        if(x.photo)p.photo=String(x.photo);
      }
    }catch(e){}
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
  }

  function currentRoom(){
    var type='solo',name='1인 방송',title='';
    try{
      if(window.state){
        type=String(window.state.liveRoomType||type);
        name=String(window.state.liveRoomName||name);
      }
    }catch(e){}
    if(type==='group')type='group13';
    try{
      var t=document.getElementById('liveTitle');
      title=t?String(t.value||'').trim():'';
    }catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }

  function hasLiveVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(track){return track&&track.readyState==='live';}));}
    catch(e){return false;}
  }

  function inLiveRoom(){
    try{
      var screen=document.getElementById('screen');
      if(!screen)return false;
      if(screen.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room'))return true;
      var txt=String(screen.innerText||'');
      return txt.indexOf('ON AIR')>-1;
    }catch(e){return false;}
  }

  function findRoomStream(){
    try{if(window.state&&hasLiveVideo(window.state.stream))return window.state.stream;}catch(e){}
    try{
      var videos=document.querySelectorAll('#screen video,video');
      for(var i=0;i<videos.length;i++){
        var stream=videos[i]&&videos[i].srcObject;
        if(hasLiveVideo(stream))return stream;
      }
    }catch(e){}
    return null;
  }

  async function deactivateFallback(){
    var id=fallbackRoomId;
    fallbackRoomId='';
    clearInterval(fallbackHeartbeat);fallbackHeartbeat=null;
    if(!id)return;
    try{
      await req('ktalk_live_rooms?id=eq.'+enc(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});
    }catch(e){}
  }

  function startFallbackHeartbeat(){
    clearInterval(fallbackHeartbeat);
    fallbackHeartbeat=setInterval(async function(){
      if(!fallbackRoomId||!inLiveRoom())return;
      try{
        await req('ktalk_live_rooms?id=eq.'+enc(fallbackRoomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});
      }catch(e){}
    },10000);
  }

  async function ensureServerPresence(){
    if(fallbackBusy||!inLiveRoom())return;
    var stream=findRoomStream();
    if(!stream)return;
    var now=Date.now();
    if(now-lastServerCheck<2200)return;
    lastServerCheck=now;
    fallbackBusy=true;
    try{
      try{
        if(window.state)window.state.stream=stream;
        else if(typeof state!=='undefined')state.stream=stream;
      }catch(e){}

      try{if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();}catch(e){}
      await delay(650);

      var hostId=deviceId();
      var rows=await req('ktalk_live_rooms?select=id,host_id,active,started_at,updated_at&host_id=eq.'+enc(hostId)+'&active=eq.true&order=started_at.desc&limit=5');
      if(rows&&rows.length){
        if(fallbackRoomId){
          var other=rows.some(function(r){return r.id!==fallbackRoomId;});
          if(other)await deactivateFallback();
        }
        return;
      }

      var p=profile(),r=currentRoom(),stamp=nowIso();
      var created=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      fallbackRoomId=created&&created[0]?created[0].id:'';
      if(fallbackRoomId)startFallbackHeartbeat();
    }catch(e){}
    finally{fallbackBusy=false;}
  }

  function startPresence(){
    if(!inLiveRoom()){
      if(fallbackRoomId)deactivateFallback();
      return;
    }
    var stream=findRoomStream();
    if(!stream)return;
    try{
      if(window.state)window.state.stream=stream;
      else if(typeof state!=='undefined')state.stream=stream;
    }catch(e){}
    try{if(typeof window.ktStartHostPresence==='function')window.ktStartHostPresence();}catch(e){}
    ensureServerPresence();
  }

  function retryStart(){
    [0,80,180,320,600,1000,1600,2400,3600,5200,7500,10000].forEach(function(ms){setTimeout(startPresence,ms);});
  }

  function wrapBroadcastStart(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktConnectionStartOnlyWrapped)return false;
    var wrapped=async function(){
      retryStart();
      var result=await original.apply(this,arguments);
      retryStart();
      return result;
    };
    wrapped.__ktConnectionStartOnlyWrapped=true;
    window.startBroadcast=wrapped;
    return true;
  }

  wrapBroadcastStart();
  var tries=0;
  var wrapTimer=setInterval(function(){
    tries++;
    wrapBroadcastStart();
    if(tries>120)clearInterval(wrapTimer);
  },100);

  document.addEventListener('click',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.prep-start'):null;
      if(btn)retryStart();
      var back=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back,.ktg9-back'):null;
      if(back&&fallbackRoomId)deactivateFallback();
    }catch(err){}
  },true);

  try{
    new MutationObserver(function(){if(inLiveRoom())setTimeout(startPresence,80);}).observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  setInterval(startPresence,800);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')retryStart();});
  window.addEventListener('pageshow',retryStart);
  window.addEventListener('pagehide',function(){
    if(!fallbackRoomId)return;
    try{
      fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(fallbackRoomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});
    }catch(e){}
  });
})();
