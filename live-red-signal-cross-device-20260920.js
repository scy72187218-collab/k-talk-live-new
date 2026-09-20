/* K-Talk 다른 휴대폰 동영상의 빨간 LIVE 신호 전용.
   - 호스트가 방송 중이면 기존 LIVE 등록 함수를 주기적으로 깨워 서버 신호를 유지
   - 다른 휴대폰의 동영상 화면에서는 서버에 실제 방송이 있을 때 빨간 점 표시
   - 방송방/동영상 재생/채팅/버튼/스위치/프로필 레이아웃은 변경하지 않음 */
(function(){
  if(window.__ktCrossDeviceRedLiveSignal20260920)return;
  window.__ktCrossDeviceRedLiveSignal20260920=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var key='';
  var busy=false;

  function hostRoomOpen(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      return !!document.querySelector(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      );
    }catch(e){return false;}
  }

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

  function kickHostSignal(){
    if(!hostRoomOpen())return;
    try{if(typeof window.ktForcePublishLiveNow==='function')window.ktForcePublishLiveNow();}catch(e){}
    try{if(typeof window.ktForcePublishLiveSignalNow==='function')window.ktForcePublishLiveSignalNow();}catch(e){}
    try{if(typeof window.ktForceLiveSignalNow==='function')window.ktForceLiveSignalNow();}catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById('ktCrossDeviceRedLiveSignalStyle'))return;
    var s=document.createElement('style');
    s.id='ktCrossDeviceRedLiveSignalStyle';
    s.textContent=''
      +'@keyframes ktCrossRedPulse{0%,45%{opacity:1;box-shadow:0 0 6px #ff153c,0 0 15px #ff153c}55%,100%{opacity:.45;box-shadow:0 0 2px #ff153c}}'
      +'#ktCrossDeviceRedLiveDot{position:fixed!important;right:14px!important;top:64px!important;z-index:2147482500!important;width:16px!important;height:16px!important;border-radius:50%!important;background:#ff153c!important;border:2px solid #fff!important;box-sizing:border-box!important;animation:ktCrossRedPulse .9s linear infinite!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function setDot(on){
    ensureStyle();
    var old=document.getElementById('ktCrossDeviceRedLiveDot');
    if(!on||!videoWatching()){
      if(old)old.remove();
      return;
    }
    if(!old){
      old=document.createElement('i');
      old.id='ktCrossDeviceRedLiveDot';
      old.setAttribute('aria-hidden','true');
      document.body.appendChild(old);
    }
  }

  async function readKey(){
    if(key)return key;
    try{
      var r=await fetch('live-presence.js?v=20260920-relief1',{cache:'no-store'});
      if(!r.ok)return '';
      var t=await r.text();
      var m=t.match(/var KEY='([^']+)'/);
      key=m?m[1]:'';
    }catch(e){}
    return key;
  }

  async function readLive(){
    if(busy)return;
    busy=true;
    try{
      kickHostSignal();

      if(!videoWatching()){
        setDot(false);
        return;
      }

      var k=await readKey();
      if(!k){setDot(false);return;}

      /* 느린 기기 heartbeat도 놓치지 않게 75초 안의 실제 활성 방송을 인정 */
      var cut=new Date(Date.now()-75000).toISOString();
      var url=BASE+'ktalk_live_rooms?select=id,host_id,updated_at&active=eq.true&updated_at=gte.'
        +encodeURIComponent(cut)+'&order=updated_at.desc&limit=1';
      var r=await fetch(url,{
        cache:'no-store',
        headers:{apikey:k,Authorization:'Bearer '+k}
      });
      if(!r.ok){setDot(false);return;}
      var rows=await r.json();
      setDot(Array.isArray(rows)&&rows.length>0);
    }catch(e){
      setDot(false);
    }finally{
      busy=false;
    }
  }

  readLive();
  [120,350,800,1500,2600,4200].forEach(function(ms){setTimeout(readLive,ms);});
  setInterval(readLive,2000);
  setInterval(kickHostSignal,1800);

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){setTimeout(kickHostSignal,50);setTimeout(readLive,100);}
  });
  window.addEventListener('focus',function(){setTimeout(kickHostSignal,50);setTimeout(readLive,100);});
  window.addEventListener('online',function(){setTimeout(kickHostSignal,50);setTimeout(readLive,120);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCrossDeviceRedLiveSignalTimer);
      window.__ktCrossDeviceRedLiveSignalTimer=setTimeout(function(){
        kickHostSignal();
        readLive();
      },50);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();