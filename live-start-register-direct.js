/* K-Talk LIVE 사람 접속 전용: 방송 시작 버튼에서 서버 등록만 직접 보강. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktDirectLiveStartRegisterInstalled)return;
  window.__ktDirectLiveStartRegisterInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var armedUntil=0,registering=false,active=false,roomId='',beatTimer=null;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('direct live '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function nowIso(){return new Date().toISOString();}
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
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||p.name);p.photo=String(x.photo||'');}}catch(e){}
    try{if((!p.name||p.name==='K-Talk 방송자')&&window.ktGetSelectedSubAccount&&window.ktSubProfileCard){var sub=window.ktGetSelectedSubAccount();if(sub){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.name||p.name);p.photo=String(s.photo||p.photo);}}}catch(e){}
    if(p.photo&&p.photo.length>240000)p.photo='';
    return p;
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

  async function registerNow(){
    if(active||registering||Date.now()>armedUntil)return;
    registering=true;
    var hostId=deviceId(),p=profile(),r=roomInfo(),stamp=nowIso();
    try{
      await req('ktalk_live_rooms?host_id=eq.'+enc(hostId)+'&active=eq.true',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:stamp})});
      var rows=await req('ktalk_live_rooms',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({host_id:hostId,host_name:p.name,title:r.title,room_type:r.type,room_name:r.name,active:true,started_at:stamp,updated_at:stamp,host_photo:p.photo||null})});
      roomId=rows&&rows[0]?rows[0].id:'';
      active=!!roomId;
      if(active){
        clearInterval(beatTimer);
        beatTimer=setInterval(async function(){
          if(!active||!roomId)return;
          try{await req('ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:true,updated_at:nowIso()})});}catch(e){}
        },10000);
      }
    }catch(e){active=false;roomId='';}
    registering=false;
  }

  function arm(){
    armedUntil=Date.now()+60000;
    [0,100,250,500,900,1400,2200,3500,5000,8000,12000,18000].forEach(function(ms){setTimeout(registerNow,ms);});
  }

  async function stop(){
    var id=roomId;active=false;roomId='';armedUntil=0;clearInterval(beatTimer);beatTimer=null;
    if(!id)return;
    try{await req('ktalk_live_rooms?id=eq.'+enc(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({active:false,updated_at:nowIso()})});}catch(e){}
  }

  function wrapStart(){
    var old=window.startBroadcast;
    if(typeof old!=='function'||old.__ktDirectLiveStartWrapped)return;
    var fn=function(){
      arm();
      var out=old.apply(this,arguments);
      if(out&&typeof out.then==='function')return out.then(function(v){arm();return v;});
      arm();return out;
    };
    fn.__ktDirectLiveStartWrapped=true;
    window.startBroadcast=fn;
  }

  function screenShowsOnAir(){
    try{
      var screen=document.getElementById('screen');
      if(!screen)return false;
      var txt=String(screen.innerText||'');
      return txt.indexOf('ON AIR')>-1||txt.indexOf('방송 중')>-1||!!screen.querySelector('#ktLiveVideo,.ktsolo-room,.ktg13-room,.ktg9-room,.ktsubscriber-room,.ktsecret-room');
    }catch(e){return false;}
  }

  document.addEventListener('click',function(e){
    try{
      var target=e.target&&e.target.closest?e.target.closest('button,[role="button"],.prep-start'):null;
      var text=target?String(target.innerText||target.textContent||'').replace(/\s+/g,' ').trim():'';
      if((target&&target.matches&&target.matches('.prep-start'))||text.indexOf('방송 시작')>-1||text.indexOf('방송시작')>-1)arm();
      var leave=e.target&&e.target.closest?e.target.closest('.ktsolo-back,.ktsubscriber-back,.ktsecret-back,.ktg13-back,.ktg9-back'):null;
      if(leave&&active)stop();
    }catch(err){}
  },true);

  wrapStart();
  setInterval(function(){
    wrapStart();
    if(!active&&screenShowsOnAir()){
      armedUntil=Date.now()+60000;
      registerNow();
    }
  },700);
  window.addEventListener('pagehide',function(){
    if(active&&roomId){
      try{fetch(BASE+'ktalk_live_rooms?id=eq.'+enc(roomId),{method:'PATCH',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({active:false,updated_at:nowIso()}),keepalive:true});}catch(e){}
    }
  });
})();