/* K-Talk 라이브 영상 빨간 신호등 전용 (2026-09-20)
   실제 영상 트랙이 살아 있을 때만 빨간 불을 표시.
   다른 UI/방/채팅/카메라/스위치 동작은 변경하지 않음. */
(function(){
  if(window.__ktLiveVideoRedSignal20260920)return;
  window.__ktLiveVideoRedSignal20260920=true;

  var VIDEO_SEL=[
    '.ktsolo-room video',
    '.ktg13-room video',
    '.ktsubscriber-room video',
    '.ktsecret-room video',
    '.kt-remote-live video',
    '.kt-guest-hostlike-room video',
    '.kt-approved-guest-grid video',
    '.kt-guest-room-grid video',
    '.kt-prejoin-room-grid video'
  ].join(',');

  function ensureStyle(){
    if(document.getElementById('ktLiveVideoRedSignalStyle'))return;
    var s=document.createElement('style');
    s.id='ktLiveVideoRedSignalStyle';
    s.textContent=''
      +'@keyframes ktVideoSignalPulse{0%,45%{opacity:1;box-shadow:0 0 5px #ff163e,0 0 12px #ff163e}55%,100%{opacity:.45;box-shadow:0 0 2px #ff163e}}'
      +'.kt-live-video-signal{position:absolute!important;right:6px!important;top:6px!important;z-index:40!important;width:12px!important;height:12px!important;border-radius:50%!important;background:#ff163e!important;border:2px solid #fff!important;box-sizing:border-box!important;animation:ktVideoSignalPulse .9s linear infinite!important;pointer-events:none!important;display:none!important}'
      +'.kt-live-video-signal.on{display:block!important}';
    document.head.appendChild(s);
  }

  function trackLive(video){
    try{
      var st=video.srcObject;
      if(st&&st.getVideoTracks){
        var tracks=st.getVideoTracks();
        if(tracks&&tracks.some(function(t){return t&&t.readyState==='live'&&t.enabled!==false;}))return true;
      }
      /* 원격 영상이 이미 재생 중이면 srcObject 교체 순간에도 신호 유지 */
      if(video.readyState>=2&&!video.paused&&video.videoWidth>0)return true;
    }catch(e){}
    return false;
  }

  function holderFor(video){
    if(!video||!video.parentElement)return null;
    var p=video.parentElement;
    try{
      if(getComputedStyle(p).position==='static')p.style.setProperty('position','relative','important');
    }catch(e){}
    return p;
  }

  function signalFor(video){
    var p=holderFor(video);
    if(!p)return null;
    var d=p.querySelector(':scope > .kt-live-video-signal');
    if(!d){
      d=document.createElement('i');
      d.className='kt-live-video-signal';
      d.setAttribute('aria-hidden','true');
      p.appendChild(d);
    }
    return d;
  }

  function updateOne(video){
    if(!video||!video.isConnected)return;
    var d=signalFor(video);
    if(!d)return;
    d.classList.toggle('on',trackLive(video));
  }

  function scan(){
    ensureStyle();
    try{
      document.querySelectorAll(VIDEO_SEL).forEach(updateOne);
    }catch(e){}
  }

  document.addEventListener('playing',function(e){
    var v=e.target;
    if(v&&v.matches&&v.matches(VIDEO_SEL))updateOne(v);
  },true);

  document.addEventListener('pause',function(e){
    var v=e.target;
    if(v&&v.matches&&v.matches(VIDEO_SEL))setTimeout(function(){updateOne(v);},80);
  },true);

  scan();
  [120,400,900,1600,2600].forEach(function(ms){setTimeout(scan,ms);});
  setInterval(scan,1000);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLiveVideoRedSignalTimer);
      window.__ktLiveVideoRedSignalTimer=setTimeout(scan,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 동영상 홈 빨간 LIVE 신호 보강.
   방송중인 방이 서버에 실제로 있을 때만 동영상 화면 오른쪽 위에 빨간 불 표시.
   동영상 재생/업로드/방송방/채팅/스위치는 변경하지 않음. */
(function(){
  if(window.__ktVideoFeedLivePresenceSignal20260920)return;
  window.__ktVideoFeedLivePresenceSignal20260920=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var key='';
  var busy=false;

  function ensureFeedStyle(){
    if(document.getElementById('ktVideoFeedLiveSignalStyle'))return;
    var s=document.createElement('style');
    s.id='ktVideoFeedLiveSignalStyle';
    s.textContent=''
      +'@keyframes ktFeedLivePulse{0%,45%{opacity:1;box-shadow:0 0 6px #ff163e,0 0 15px #ff163e}55%,100%{opacity:.48;box-shadow:0 0 2px #ff163e}}'
      +'.kt-video-feed-live-signal{position:absolute!important;right:10px!important;top:10px!important;z-index:80!important;width:15px!important;height:15px!important;border-radius:50%!important;background:#ff163e!important;border:2px solid #fff!important;box-sizing:border-box!important;animation:ktFeedLivePulse .9s linear infinite!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  async function readKey(){
    if(key)return key;
    try{
      var res=await fetch('live-presence.js?v=20260920-relief1',{cache:'no-store'});
      if(!res.ok)return '';
      var t=await res.text();
      var m=t.match(/var KEY='([^']+)'/);
      key=m?m[1]:'';
    }catch(e){}
    return key;
  }

  function feedHolder(){
    try{
      return document.querySelector('.video-home,.kt-public-feed-scroller,.kt-hard-public-video-wrap')||null;
    }catch(e){return null;}
  }

  function setBadge(on){
    ensureFeedStyle();
    var h=feedHolder();
    var old=document.querySelector('.kt-video-feed-live-signal');
    if(!on||!h){
      if(old)old.remove();
      return;
    }
    try{
      if(getComputedStyle(h).position==='static')h.style.setProperty('position','relative','important');
    }catch(e){}
    if(!old){
      old=document.createElement('i');
      old.className='kt-video-feed-live-signal';
      old.setAttribute('aria-hidden','true');
      h.appendChild(old);
    }else if(old.parentElement!==h){
      h.appendChild(old);
    }
  }

  async function refresh(){
    if(busy)return;
    busy=true;
    try{
      var k=await readKey();
      if(!k){setBadge(false);return;}
      var cut=new Date(Date.now()-50000).toISOString();
      var url=BASE+'ktalk_live_rooms?select=id&active=eq.true&updated_at=gte.'+encodeURIComponent(cut)+'&limit=1';
      var res=await fetch(url,{
        cache:'no-store',
        headers:{apikey:k,Authorization:'Bearer '+k}
      });
      if(!res.ok){setBadge(false);return;}
      var rows=await res.json();
      setBadge(Array.isArray(rows)&&rows.length>0);
    }catch(e){
      setBadge(false);
    }finally{
      busy=false;
    }
  }

  refresh();
  [250,800,1800].forEach(function(ms){setTimeout(refresh,ms);});
  setInterval(refresh,3000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(refresh,80);});
  window.addEventListener('focus',function(){setTimeout(refresh,80);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktFeedLiveSignalMo);
      window.__ktFeedLiveSignalMo=setTimeout(refresh,70);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
