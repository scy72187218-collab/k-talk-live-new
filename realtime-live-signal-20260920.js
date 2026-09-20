/* K-Talk LIVE realtime signal only.
   영상/채팅/방 배치는 건드리지 않는다. */
(function(){
  if(window.__ktRealtimeLiveSignalInstalled)return;
  window.__ktRealtimeLiveSignalInstalled=true;

  var SUPA='https://zupwbfmacwzexyvznlzq.supabase.co';
  var channel=null,client=null,ready=false;
  var liveMap={};
  var lastSentLive=false;
  var sendTimer=null;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function roomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo');
    }catch(e){return false;}
  }

  function roomInfo(){
    var type='solo',name='1인 방송',title='';
    try{
      type=String((window.state&&state.liveRoomType)||'solo');
      name=String((window.state&&state.liveRoomName)||'1인 방송');
    }catch(e){}
    if(type==='group')type='group13';
    try{
      var t=document.getElementById('liveTitle');
      title=t?String(t.value||'').trim():'';
    }catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;
    return {type:type,name:name,title:title};
  }

  function profile(){
    var p={name:'K-Talk 방송자'};
    try{
      if(window.ktProfileLoad){
        var x=window.ktProfileLoad()||{};
        p.name=String(x.name||p.name);
      }
    }catch(e){}
    return p;
  }

  async function pollActiveRooms(){
    try{
      var key=await readAnonKey();
      if(!key)return;
      var cut=new Date(Date.now()-50000).toISOString();
      var url=SUPA+'/rest/v1/ktalk_live_rooms?select=host_id,host_name,title,room_type,room_name,updated_at&active=eq.true&updated_at=gte.'+encodeURIComponent(cut)+'&order=started_at.desc&limit=30';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:key,Authorization:'Bearer '+key}});
      if(!r.ok)return;
      var rows=await r.json();
      if(!Array.isArray(rows))rows=[];
      var now=Date.now(),fresh={};
      rows.forEach(function(x){
        var id=String(x&&x.host_id||'');
        if(!id)return;
        x._seen=now;
        fresh[id]=x;
      });
      /* REST 조회가 성공했을 때만 현재 목록으로 맞춘다. 영상/방/채팅은 건드리지 않는다. */
      liveMap=fresh;
      showSignal();
    }catch(e){}
  }

  async function readAnonKey(){
    try{
      var r=await fetch('live-presence.js?v=20260920-speed1',{cache:'no-store'});
      if(!r.ok)return '';
      var t=await r.text();
      var m=t.match(/var KEY='([^']+)'/);
      return m?m[1]:'';
    }catch(e){return '';}
  }

  function loadSupabase(){
    if(window.supabase&&window.supabase.createClient)return Promise.resolve(window.supabase);
    return new Promise(function(resolve,reject){
      var old=document.getElementById('ktSupabaseRealtimeLib');
      if(old){
        var n=0;
        var timer=setInterval(function(){
          n++;
          if(window.supabase&&window.supabase.createClient){
            clearInterval(timer);resolve(window.supabase);
          }else if(n>50){clearInterval(timer);reject(new Error('supabase lib timeout'));}
        },100);
        return;
      }
      var s=document.createElement('script');
      s.id='ktSupabaseRealtimeLib';
      s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.async=true;
      s.onload=function(){
        if(window.supabase&&window.supabase.createClient)resolve(window.supabase);
        else reject(new Error('supabase lib missing'));
      };
      s.onerror=function(){
        var u=document.createElement('script');
        u.src='https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js';
        u.async=true;
        u.onload=function(){
          if(window.supabase&&window.supabase.createClient)resolve(window.supabase);
          else reject(new Error('supabase fallback missing'));
        };
        u.onerror=function(){reject(new Error('supabase load failed'));};
        document.head.appendChild(u);
      };
      document.head.appendChild(s);
    });
  }

  function cleanup(){
    var now=Date.now();
    Object.keys(liveMap).forEach(function(id){
      if(now-(liveMap[id]._seen||0)>8000)delete liveMap[id];
    });
  }

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.body&&document.body.classList.contains('kt-video-mode'))return true;
      return !!document.querySelector('#screen .kt-public-video,#screen .kt-hard-public-video,#homeVideo,.video-home,#screen .media');
    }catch(e){return false;}
  }

  function showSignal(){
    cleanup();
    var badge=document.getElementById('ktRealtimeLiveBadge');
    var inVideo=inVideoView();
    var rows=Object.keys(liveMap).map(function(id){return liveMap[id];}).sort(function(a,b){
      return (b._seen||0)-(a._seen||0);
    });
    if(!inVideo||!rows.length){
      if(badge)badge.remove();
      return;
    }
    var r=rows[0];
    if(!badge){
      badge=document.createElement('div');
      badge.id='ktRealtimeLiveBadge';
      badge.style.cssText='position:fixed;top:78px;right:14px;z-index:2147483000;display:flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;background:#e6002d;color:#fff;font:900 13px/1.1 system-ui,-apple-system,sans-serif;box-shadow:0 3px 15px rgba(230,0,45,.45);pointer-events:none';
      document.body.appendChild(badge);
    }
    badge.innerHTML='<span style="width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.25)"></span><b>LIVE</b><span style="max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r.host_name||'방송 중')+'</span>';
  }

  function onLive(payload){
    var p=payload&&payload.payload?payload.payload:payload||{};
    var id=String(p.host_id||'');
    if(!id)return;
    p._seen=Date.now();
    liveMap[id]=p;
    showSignal();
  }

  function onEnd(payload){
    var p=payload&&payload.payload?payload.payload:payload||{};
    var id=String(p.host_id||'');
    if(id)delete liveMap[id];
    showSignal();
  }

  async function send(event,payload){
    if(!ready||!channel)return false;
    try{
      var x=await channel.send({type:'broadcast',event:event,payload:payload});
      return x==='ok'||x===true;
    }catch(e){return false;}
  }

  async function tick(force){
    var open=roomVisible();
    var id=deviceId();
    if(open){
      var r=roomInfo(),p=profile();
      await send('live',{
        host_id:id,
        host_name:p.name,
        title:r.title,
        room_type:r.type,
        room_name:r.name,
        updated_at:new Date().toISOString()
      });
      lastSentLive=true;
    }else if(lastSentLive){
      await send('end',{host_id:id,updated_at:new Date().toISOString()});
      lastSentLive=false;
    }
    showSignal();
  }

  async function boot(){
    try{
      var pair=await Promise.all([readAnonKey(),loadSupabase()]);
      var key=pair[0],lib=pair[1];
      if(!key||!lib||!lib.createClient)return;
      client=lib.createClient(SUPA,key,{
        auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
        realtime:{params:{eventsPerSecond:10}}
      });
      channel=client.channel('ktalk-live-signal-v1',{config:{broadcast:{self:false,ack:false}}});
      channel.on('broadcast',{event:'live'},onLive);
      channel.on('broadcast',{event:'end'},onEnd);
      channel.subscribe(function(status){
        ready=status==='SUBSCRIBED';
        if(ready){
          tick(true);
          setTimeout(function(){tick(true);},350);
          setTimeout(function(){tick(true);},900);
        }
      });
      sendTimer=setInterval(function(){tick(false);},2200);
      var mo=new MutationObserver(function(){
        clearTimeout(window.__ktRealtimeLiveSignalMo);
        window.__ktRealtimeLiveSignalMo=setTimeout(function(){tick(true);},120);
      });
      try{mo.observe(document.body,{childList:true,subtree:true});}catch(e){}
      document.addEventListener('visibilitychange',function(){
        if(!document.hidden)setTimeout(function(){tick(true);},120);
      });
      window.addEventListener('pagehide',function(){
        if(lastSentLive)send('end',{host_id:deviceId(),updated_at:new Date().toISOString()});
      });
    }catch(e){}
  }

  setInterval(showSignal,1000);
  /* Realtime 이벤트를 놓쳐도 빨간 LIVE 신호가 보이도록 활성 방송만 짧게 확인한다. */
  setInterval(pollActiveRooms,1800);
  setTimeout(pollActiveRooms,250);
  setTimeout(pollActiveRooms,900);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(pollActiveRooms,120);});
  window.addEventListener('focus',function(){setTimeout(pollActiveRooms,120);});
  boot();
})();