/* K-Talk LIVE 사람 접속 등록 전용 V6: 방송 등록 실패 원인 추적 추가. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktDirectLiveStartRegisterV6)return;
  window.__ktDirectLiveStartRegisterV6=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var registering=false,active=false,beatTimer=null;

  function dbg(stage,detail){
    try{fetch('/api/live-debug?stage='+encodeURIComponent(stage)+'&detail='+encodeURIComponent(String(detail||'').slice(0,160)),{cache:'no-store'}).catch(function(){});}catch(e){}
  }
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok){
      var err='';try{err=await r.text();}catch(e){}
      dbg('reg_req_error',r.status+' '+err);
      throw new Error('live-register '+r.status);
    }
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function nowIso(){return new Date().toISOString();}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function profileName(){
    var name='K-Talk 방송자';
    try{if(window.ktProfileLoad){var p=window.ktProfileLoad()||{};name=String(p.name||name);}}catch(e){}
    try{if((!name||name==='K-Talk 방송자')&&window.ktGetSelectedSubAccount&&window.ktSubProfileCard){var sub=window.ktGetSelectedSubAccount();if(sub){var q=window.ktSubProfileCard(sub)||{};name=String(q.name||name);}}}catch(e){}
    return name||'K-Talk 방송자';
  }
  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    try{if(window.state){type=String(window.state.liveRoomType||type);name=String(window.state.liveRoomName||name);}}catch(e){}
    try{
      if(document.querySelector('.ktg13-room')){type='group13';name='13명 방송';}
      else if(document.querySelector('.ktg9-room')){type='group9';name='9명 방송';}
      else if(document.querySelector('.ktsubscriber-room')){type='subscriber';name='구독자 방송';}
      else if(document.querySelector('.ktsecret-room')){type='password';name='비밀방';}
      else if(document.querySelector('.ktsolo-room')){type='solo';name='1인 방송';}
    }catch(e){}
    if(type==='group')type='group13';
    try{var t=document.getElementById('liveTitle');title=t?String(t.value||'').trim():'';}catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }
  function onAir(){
    try{
      var root=document.getElementById('screen')||document.body;
      if(!root)return false;
      if(root.querySelector&&root.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room'))return true;
      var txt=String(root.innerText||root.textContent||'');
      return txt.indexOf('ON AIR')>-1||txt.indexOf('방송 중')>-1;
    }catch(e){return false;}
  }
  async function heartbeat(){
    if(!active)return;
    try{await req('ktalk_live_rooms?host_id=eq.'+enc(deviceId())+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});}
    catch(e){active=false;dbg('reg_heartbeat_error',e.message||'error');}
  }
  async function registerNow(){
    if(registering||active||!onAir())return;
    registering=true;
    var hostId=deviceId(),stamp=nowIso(),r=roomInfo();
    dbg('reg_attempt',r.type);
    try{
      var exists=await req('ktalk_live_rooms?select=id&host_id=eq.'+enc(hostId)+'&active=eq.true&limit=1');
      if(exists&&exists.length){
        active=true;
        dbg('reg_existing','ok');
        await heartbeat();
      }else{
        var resp=await fetch(BASE+'ktalk_live_rooms',{method:'POST',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({host_id:hostId,host_name:profileName(),title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp})});
        if(!resp.ok){
          var err='';try{err=await resp.text();}catch(e){}
          dbg('reg_post_error',resp.status+' '+err);
          throw new Error('live-register '+resp.status);
        }
        active=true;
        dbg('reg_post_ok',r.type);
      }
      clearInterval(beatTimer);
      beatTimer=setInterval(heartbeat,10000);
    }catch(e){active=false;dbg('reg_catch',e.message||'error');}
    registering=false;
  }
  async function stop(){
    active=false;clearInterval(beatTimer);beatTimer=null;
    try{await req('ktalk_live_rooms?host_id=eq.'+enc(deviceId())+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
  }

  dbg('reg_loaded','v6');
  document.addEventListener('click',function(e){
    try{
      var b=e.target&&e.target.closest?e.target.closest('button,[role="button"],.prep-start'):null;
      var text=b?String(b.innerText||b.textContent||'').replace(/\s+/g,' ').trim():'';
      if((b&&b.matches&&b.matches('.prep-start'))||text.indexOf('방송 시작')>-1||text.indexOf('방송시작')>-1){[100,400,900,1600,2600].forEach(function(ms){setTimeout(registerNow,ms);});}
      var leave=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back,.ktg9-back'):null;
      if(leave)stop();
    }catch(err){}
  },true);

  setInterval(function(){if(onAir())registerNow();},1000);
  setTimeout(registerNow,500);
  window.addEventListener('pageshow',function(){setTimeout(registerNow,300);});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(registerNow,300);});
  window.addEventListener('pagehide',function(){
    if(!active)return;
    try{fetch(BASE+'ktalk_live_rooms?host_id=eq.'+enc(deviceId())+'&active=eq.true',{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});}catch(e){}
  });
})();