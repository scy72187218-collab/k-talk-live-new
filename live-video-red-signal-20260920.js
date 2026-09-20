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