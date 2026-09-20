/* K-Talk 다른 휴대폰 동영상의 빨간 LIVE 신호 전용.
   - 호스트 방송 중: 전용 beacon 서버에 2초마다 방송 신호 유지
   - 다른 휴대폰 동영상 화면: beacon 서버를 조회해 빨간 점 표시
   - 방송방/동영상 재생/채팅/버튼/스위치/프로필은 변경하지 않음 */
(function(){
  if(window.__ktCrossDeviceRedLiveSignalBeacon20260920)return;
  window.__ktCrossDeviceRedLiveSignalBeacon20260920=true;

  var EDGE='https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-live-beacon';
  var wasHost=false;
  var busy=false;

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

  function hostRoomOpen(){return !!hostRoom();}

  function videoWatching(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(hostRoomOpen())return false;
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

  function visibleVideo(){
    try{
      var list=[].slice.call(document.querySelectorAll(
        '#screen .kt-public-video,#screen #homeVideo,#screen .kt-hard-public-video,.video-home video,.media video'
      ));
      if(!list.length)return null;
      var vh=window.innerHeight||document.documentElement.clientHeight||0;
      var best=null,dist=Infinity;
      list.forEach(function(v){
        try{
          var r=v.getBoundingClientRect();
          if(r.width<4||r.height<4||r.bottom<=0||r.top>=vh)return;
          var d=Math.abs((r.top+r.bottom)/2-vh/2);
          if(d<dist){dist=d;best=v;}
        }catch(e){}
      });
      return best||list[0];
    }catch(e){return null;}
  }

  function ensureStyle(){
    if(document.getElementById('ktCrossDeviceRedLiveSignalStyle'))return;
    var s=document.createElement('style');
    s.id='ktCrossDeviceRedLiveSignalStyle';
    s.textContent=''
      +'@keyframes ktCrossRedPulse{0%,45%{opacity:1;box-shadow:0 0 6px #ff153c,0 0 15px #ff153c}55%,100%{opacity:.45;box-shadow:0 0 2px #ff153c}}'
      +'#ktCrossDeviceRedLiveDot{position:absolute!important;right:9px!important;top:9px!important;z-index:2147482500!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#ff153c!important;border:2px solid #fff!important;box-sizing:border-box!important;animation:ktCrossRedPulse .9s linear infinite!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function holder(){
    var v=visibleVideo();
    if(v){
      var h=v.closest('.kt-hard-video-card,.video-home,.media,section,div');
      if(h)return h;
      if(v.parentElement)return v.parentElement;
    }
    try{return document.getElementById('screen');}catch(e){return null;}
  }

  function setDot(on){
    ensureStyle();
    var old=document.getElementById('ktCrossDeviceRedLiveDot');
    if(!on||!videoWatching()){
      if(old)old.remove();
      return;
    }
    var h=holder();
    if(!h)return;
    try{
      if(getComputedStyle(h).position==='static')h.style.setProperty('position','relative','important');
    }catch(e){}
    if(!old){
      old=document.createElement('i');
      old.id='ktCrossDeviceRedLiveDot';
      old.setAttribute('aria-hidden','true');
    }
    if(old.parentElement!==h)h.appendChild(old);
  }

  async function sendBeacon(action){
    try{
      var x=roomInfo();
      var r=await fetch(EDGE,{
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
      return r.ok;
    }catch(e){return false;}
  }

  async function hostBeat(){
    var open=hostRoomOpen();
    if(open){
      await sendBeacon(wasHost?'heartbeat':'publish');
      wasHost=true;
      return;
    }
    if(wasHost){
      await sendBeacon('end');
      wasHost=false;
    }
  }

  async function viewerRead(){
    if(busy)return;
    busy=true;
    try{
      if(!videoWatching()){setDot(false);return;}
      var r=await fetch(EDGE+'?t='+Date.now(),{cache:'no-store'});
      if(!r.ok){setDot(false);return;}
      var rows=await r.json();
      setDot(Array.isArray(rows)&&rows.length>0);
    }catch(e){
      setDot(false);
    }finally{
      busy=false;
    }
  }

  function tick(){
    hostBeat();
    viewerRead();
  }

  tick();
  [100,300,700,1300,2200,3600].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(hostBeat,1800);
  setInterval(viewerRead,1800);

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){setTimeout(hostBeat,30);setTimeout(viewerRead,80);}
  });
  window.addEventListener('focus',function(){setTimeout(hostBeat,30);setTimeout(viewerRead,80);});
  window.addEventListener('online',function(){setTimeout(hostBeat,30);setTimeout(viewerRead,100);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCrossDeviceRedLiveBeaconTimer);
      window.__ktCrossDeviceRedLiveBeaconTimer=setTimeout(tick,40);
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