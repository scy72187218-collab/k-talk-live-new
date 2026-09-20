/* K-Talk LIVE 신호 전용 보조 연결: 방 UI/영상/채팅은 건드리지 않음 */
(function(){
  if(window.__ktLiveSignalBridgeInstalled)return;
  window.__ktLiveSignalBridgeInstalled=true;

  var EDGE='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-live-signal';
  var wasHost=false;
  var lastPublish=0;
  var busy=false;

  function hostId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function roomVisible(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,#ktLiveVideo');
    }catch(e){return false;}
  }

  function hasHostVideo(){
    try{
      var s=window.state&&state.stream;
      if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
    }catch(e){}
    try{
      var v=document.getElementById('ktLiveVideo');
      var s2=v&&v.srcObject;
      if(s2&&s2.getVideoTracks&&s2.getVideoTracks().some(function(t){return t.readyState==='live';}))return true;
    }catch(e){}
    return false;
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
    var p={name:'K-Talk 방송자',photo:''};
    try{
      if(window.ktProfileLoad){
        var x=window.ktProfileLoad()||{};
        p.name=String(x.name||p.name);
        p.photo=String(x.photo||'');
      }
    }catch(e){}
    if(p.photo&&p.photo.length>150000)p.photo='';
    return p;
  }

  async function send(action){
    if(busy&&action!=='end')return false;
    busy=true;
    try{
      var r=roomInfo(),p=profile();
      var res=await fetch(EDGE,{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          action:action,
          host_id:hostId(),
          host_name:p.name,
          host_photo:p.photo||null,
          title:r.title,
          room_type:r.type,
          room_name:r.name
        })
      });
      return !!res.ok;
    }catch(e){
      return false;
    }finally{
      busy=false;
    }
  }

  async function tick(force){
    var live=roomVisible()&&hasHostVideo();
    if(live){
      var now=Date.now();
      if(force||!wasHost||now-lastPublish>24000){
        var ok=await send('publish');
        if(ok){wasHost=true;lastPublish=now;}
      }else{
        await send('heartbeat');
        wasHost=true;
      }
    }else if(wasHost){
      await send('end');
      wasHost=false;
      lastPublish=0;
    }
  }

  window.ktForcePublishLiveSignalNow=function(){tick(true);};

  setTimeout(function(){tick(true);},500);
  setInterval(function(){tick(false);},4000);

  var mo=new MutationObserver(function(){setTimeout(function(){tick(false);},180);});
  try{mo.observe(document.body,{childList:true,subtree:true});}catch(e){}

  window.addEventListener('pagehide',function(){
    if(!wasHost)return;
    try{
      fetch(EDGE,{
        method:'POST',
        keepalive:true,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'end',host_id:hostId()})
      });
    }catch(e){}
  });
})();