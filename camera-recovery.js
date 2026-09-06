/* K-Talk: camera recovery is now handled by permission-reuse.js. Keep this loader harmless. */
(function(){
  window.__ktCameraRecoveryLoaded=true;

  if(!document.querySelector('script[data-kt-live-bottom-tools]')){
    var s=document.createElement('script');
    s.src='live-bottom-tiktok.js?v=20260905-bottom01';
    s.defer=true;
    s.setAttribute('data-kt-live-bottom-tools','1');
    document.head.appendChild(s);
  }

  if(!document.querySelector('script[data-kt-group13-layout]')){
    var g=document.createElement('script');
    g.src='group13-reference-layout.js?v=20260905-group13-08';
    g.defer=true;
    g.setAttribute('data-kt-group13-layout','1');
    document.head.appendChild(g);
  }

  if(!document.querySelector('script[data-kt-password-layout]')){
    var p=document.createElement('script');
    p.src='password-room-reference-layout.js?v=20260905-password01';
    p.defer=true;
    p.setAttribute('data-kt-password-layout','1');
    document.head.appendChild(p);
  }

  if(!document.querySelector('script[data-kt-password-host-cover]')){
    var ph=document.createElement('script');
    ph.src='password-host-cover-fix.js?v=20260905-password-host04';
    ph.defer=true;
    ph.setAttribute('data-kt-password-host-cover','1');
    document.head.appendChild(ph);
  }

  if(!document.querySelector('script[data-kt-live-home-indicator]')){
    var lh=document.createElement('script');
    lh.src='live-home-indicator.js?v=20260905-livehome03';
    lh.defer=true;
    lh.setAttribute('data-kt-live-home-indicator','1');
    document.head.appendChild(lh);
  }

  if(!document.querySelector('script[data-kt-live-host-thumbnail]')){
    var ht=document.createElement('script');
    ht.src='live-host-thumbnail.js?v=20260905-hostthumb01';
    ht.defer=true;
    ht.setAttribute('data-kt-live-host-thumbnail','1');
    document.head.appendChild(ht);
  }

  if(!document.querySelector('script[data-kt-playable-sounds]')){
    var snd=document.createElement('script');
    snd.src='sound-playable-original.js?v=20260905-vocal02';
    snd.defer=true;
    snd.setAttribute('data-kt-playable-sounds','1');
    document.head.appendChild(snd);
  }

  /* 첫 주소 접속에서는 예전 도로 포스터 화면이 먼저 그려진 뒤
     feed-home-fix.js가 함수만 바꾸고 실제 피드를 호출하지 않아 그대로 남는다.
     기존 피드 함수를 한 번만 호출해 실제 업로드 동영상으로 즉시 전환한다.
     방송방/채팅/카메라 레이아웃은 건드리지 않는다. */
  var homeFeedStarted=false;
  function startRealHomeFeed(){
    try{
      if(homeFeedStarted)return;
      if(document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive'))return;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return;
      if(typeof window.ktRefreshUnifiedFeed!=='function')return;
      homeFeedStarted=true;
      var r=window.ktRefreshUnifiedFeed();
      if(r&&typeof r.catch==='function')r.catch(function(){homeFeedStarted=false;});
    }catch(e){homeFeedStarted=false;}
  }
  setTimeout(startRealHomeFeed,50);
  setTimeout(startRealHomeFeed,180);
  setTimeout(startRealHomeFeed,500);
  setTimeout(startRealHomeFeed,1200);
})();
