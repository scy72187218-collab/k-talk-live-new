/* K-Talk 다른 휴대폰 동영상의 빨간 LIVE 신호 전용.
   호스트는 전용 beacon 서버에 실시간 heartbeat를 보내고,
   다른 휴대폰 동영상 화면은 beacon을 읽어 빨간 점을 표시한다.
   방송방/동영상 재생/채팅/버튼/스위치/프로필은 변경하지 않음. */
(function(){
  if(window.__ktCrossDeviceRedLiveSignalBeacon20260920)return;
  window.__ktCrossDeviceRedLiveSignalBeacon20260920=true;

  var EDGE='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-live-beacon';
  var wasHost=false;
  var reading=false;

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function hostRoom(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return null;
      return document.querySelector(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      );
    }catch(e){return null;}
  }

  function videoWatching(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(hostRoom())return false;
      var s=document.getElementById('screen')||document;
      return !!s.querySelector(
        '.video-home,.media,.kt-public-video,#homeVideo,.kt-hard-public-video,.kt-hard-video-card,.kt-hard-video-scroller'
      );
    }catch(e){return false;}
  }

  function roomInfo(){
    var st=window.state||{},type='solo',name='1인 방송',title='';
    try{
      type=String(st.liveRoomType||'solo');
      name=String(st.liveRoomName||'1인 방송');
      if(type==='group')type='group13';
      if(type==='password')type='secret';
      var t=document.getElementById('liveTitle');
      title=t?String(t.value||'').trim():'';
    }catch(e){}
    if(!title||title==='오늘 라이브 제목을 입력하세요')title=name;

    var host='K-Talk 방송자';
    try{
      if(window.ktProfileLoad){
        var p=window.ktProfileLoad()||{};
        host=String(p.name||host);
      }
    }catch(e){}

    return {type:type,name:name,title:title,host:host};
  }

  function currentVideoHolder(){
    try{
      var list=[].slice.call(document.querySelectorAll(
        '#screen .kt-public-video,#screen #homeVideo,#screen .kt-hard-public-video,.video-home video,.media video'
      ));
      if(!list.length)return document.getElementById('screen');

      var vh=window.innerHeight||document.documentElement.clientHeight||0;
      var best=null,dist=Infinity;
      list.forEach(function(v){
        try{
          var b=v.getBoundingClientRect();
          if(b.width<4||b.height<4||b.bottom<=0||b.top>=vh)return;
          var d=Math.abs(((b.top+b.bottom)/2)-(vh/2));
          if(d<dist){dist=d;best=v;}
        }catch(e){}
      });

      var v=best||list[0];
      return v.closest('.kt-hard-video-card,.video-home,.media,section,div')||v.parentElement||document.getElementById('screen');
    }catch(e){
      return document.getElementById('screen');
    }
  }

  function ensureStyle(){
    if(document.getElementById('ktCrossDeviceRedLiveSignalStyle'))return;
    var s=document.createElement('style');
    s.id='ktCrossDeviceRedLiveSignalStyle';
    s.textContent=''
      +'@keyframes ktCrossLivePulse{0%,45%{opacity:1;box-shadow:0 0 6px #ff153c,0 0 15px #ff153c}55%,100%{opacity:.45;box-shadow:0 0 2px #ff153c}}'
      +'#ktCrossDeviceRedLiveDot{position:absolute!important;right:10px!important;top:10px!important;z-index:2147482500!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#ff153c!important;border:2px solid #fff!important;box-sizing:border-box!important;animation:ktCrossLivePulse .9s linear infinite!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function setDot(on){
    ensureStyle();
    var dot=document.getElementById('ktCrossDeviceRedLiveDot');

    if(!on||!videoWatching()){
      if(dot)dot.remove();
      return;
    }

    var holder=currentVideoHolder();
    if(!holder)return;
    try{
      if(getComputedStyle(holder).position==='static'){
        holder.style.setProperty('position','relative','important');
      }
    }catch(e){}

    if(!dot){
      dot=document.createElement('i');
      dot.id='ktCrossDeviceRedLiveDot';
      dot.setAttribute('aria-hidden','true');
    }
    if(dot.parentElement!==holder)holder.appendChild(dot);
  }

  async function send(action){
    try{
      var x=roomInfo();
      var res=await fetch(EDGE,{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          action:action,
          host_id:deviceId(),
          host_name:x.host,
          title:x.title,
          room_type:x.type,
          room_name:x.name
        })
      });
      return res.ok;
    }catch(e){
      return false;
    }
  }

  async function hostTick(){
    var open=!!hostRoom();

    if(open){
      await send(wasHost?'heartbeat':'publish');
      wasHost=true;
      return;
    }

    if(wasHost){
      await send('end');
      wasHost=false;
    }
  }

  async function viewerTick(){
    if(reading)return;
    reading=true;
    try{
      if(!videoWatching()){
        setDot(false);
        return;
      }

      var res=await fetch(EDGE+'?t='+Date.now(),{cache:'no-store'});
      if(!res.ok){
        setDot(false);
        return;
      }

      var rows=await res.json();
      setDot(Array.isArray(rows)&&rows.length>0);
    }catch(e){
      setDot(false);
    }finally{
      reading=false;
    }
  }

  function kick(){
    hostTick();
    viewerTick();
  }

  kick();
  [80,220,500,900,1500,2500,4000].forEach(function(ms){setTimeout(kick,ms);});
  setInterval(hostTick,1500);
  setInterval(viewerTick,1500);

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){
      setTimeout(hostTick,30);
      setTimeout(viewerTick,80);
    }
  });

  window.addEventListener('focus',function(){
    setTimeout(hostTick,30);
    setTimeout(viewerTick,80);
  });

  window.addEventListener('online',function(){
    setTimeout(hostTick,30);
    setTimeout(viewerTick,100);
  });

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCrossDeviceRedLiveSignalTimer);
      window.__ktCrossDeviceRedLiveSignalTimer=setTimeout(kick,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pagehide',function(){
    if(!wasHost)return;
    try{
      fetch(EDGE,{
        method:'POST',
        keepalive:true,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'end',host_id:deviceId()})
      });
    }catch(e){}
  });
})();