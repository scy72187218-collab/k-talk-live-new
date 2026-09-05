/* K-Talk: camera recovery is now handled by permission-reuse.js. Keep this loader harmless. */
(function(){
  window.__ktCameraRecoveryLoaded=true;

  if(!document.querySelector('script[data-kt-permission-once]')){
    var po=document.createElement('script');
    po.src='permission-once-fix.js?v=20260905-permission01';
    po.defer=true;
    po.setAttribute('data-kt-permission-once','1');
    document.head.appendChild(po);
  }

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

  if(!document.querySelector('script[data-kt-guest-participation]')){
    var gp=document.createElement('script');
    gp.src='guest-participation.js?v=20260905-guest01';
    gp.defer=true;
    gp.setAttribute('data-kt-guest-participation','1');
    document.head.appendChild(gp);
  }

  if(!document.querySelector('script[data-kt-song-guest-mic-lock]')){
    var gm=document.createElement('script');
    gm.src='song-guest-mic-lock.js?v=20260906-songmic02';
    gm.defer=true;
    gm.setAttribute('data-kt-song-guest-mic-lock','1');
    document.head.appendChild(gm);
  }

  if(!document.querySelector('script[data-kt-live-viewer-join-chat]')){
    var vc=document.createElement('script');
    vc.src='live-viewer-join-chat.js?v=20260905-joinchat02';
    vc.defer=true;
    vc.setAttribute('data-kt-live-viewer-join-chat','1');
    document.head.appendChild(vc);
  }

  if(!document.querySelector('script[data-kt-live-room-chat]')){
    var rc=document.createElement('script');
    rc.src='live-room-chat.js?v=20260905-roomchat03';
    rc.defer=true;
    rc.setAttribute('data-kt-live-room-chat','1');
    document.head.appendChild(rc);
  }

  if(!document.querySelector('script[data-kt-live-chat-lower]')){
    var cl=document.createElement('script');
    cl.src='live-chat-lower-position.js?v=20260906-chatlower01';
    cl.defer=true;
    cl.setAttribute('data-kt-live-chat-lower','1');
    document.head.appendChild(cl);
  }

  if(!document.querySelector('script[data-kt-seated-camera-framing]')){
    var cf=document.createElement('script');
    cf.src='seated-camera-framing-fix.js?v=20260906-seated01';
    cf.defer=true;
    cf.setAttribute('data-kt-seated-camera-framing','1');
    document.head.appendChild(cf);
  }

  if(!document.querySelector('script[data-kt-attendance-size-position]')){
    var at=document.createElement('script');
    at.src='attendance-size-position-fix.js?v=20260905-attendance04';
    at.defer=true;
    at.setAttribute('data-kt-attendance-size-position','1');
    document.head.appendChild(at);
  }

  if(!document.querySelector('script[data-kt-subscriber-title-fix]')){
    var sf=document.createElement('script');
    sf.src='subscriber-title-position-fix.js?v=20260905-subtitle01';
    sf.defer=true;
    sf.setAttribute('data-kt-subscriber-title-fix','1');
    document.head.appendChild(sf);
  }

  if(!document.querySelector('script[data-kt-viewer-live-reconnect]')){
    var vr=document.createElement('script');
    vr.src='viewer-live-reconnect-fix.js?v=20260905-viewer01';
    vr.defer=true;
    vr.setAttribute('data-kt-viewer-live-reconnect','1');
    document.head.appendChild(vr);
  }

  if(!document.querySelector('script[data-kt-live-first-feed]')){
    var lf=document.createElement('script');
    lf.src='live-first-feed-fix.js?v=20260905-livefirst01';
    lf.defer=true;
    lf.setAttribute('data-kt-live-first-feed','1');
    document.head.appendChild(lf);
  }

  if(!document.querySelector('script[data-kt-live-presence-fast]')){
    var fp=document.createElement('script');
    fp.src='live-presence-fast-fix.js?v=20260905-fastpresence01';
    fp.defer=true;
    fp.setAttribute('data-kt-live-presence-fast','1');
    document.head.appendChild(fp);
  }

  if(!document.querySelector('script[data-kt-feed-startup-stability]')){
    var fs=document.createElement('script');
    fs.src='feed-startup-stability-fix.js?v=20260906-feedstable03';
    fs.defer=true;
    fs.setAttribute('data-kt-feed-startup-stability','1');
    document.head.appendChild(fs);
  }

  if(!document.querySelector('script[data-kt-playable-sounds]')){
    var snd=document.createElement('script');
    snd.src='sound-playable-original.js?v=20260905-vocal02';
    snd.defer=true;
    snd.setAttribute('data-kt-playable-sounds','1');
    document.head.appendChild(snd);
  }

  /* 주소 직접 접속 시 전체 동영상을 한꺼번에 열지 않고 저메모리 피드만 기다려서 연다. */
  function forcePublicFeed(){
    try{
      if(document.getElementById('ktUnifiedFeed'))return;
      if(!document.querySelector('.video-home'))return;
      if(typeof window.ktLowMemoryFeed!=='function')return;
      var r=window.ktLowMemoryFeed();
      if(r&&typeof r.then==='function'){
        r.then(function(){
          var feed=document.getElementById('ktUnifiedFeed');
          if(feed){
            feed.style.setProperty('overflow-y','scroll','important');
            feed.style.setProperty('-webkit-overflow-scrolling','touch','important');
            feed.style.setProperty('touch-action','pan-y','important');
          }
        }).catch(function(){});
      }
    }catch(e){}
  }
  setTimeout(forcePublicFeed,150);
  setTimeout(forcePublicFeed,500);
  setTimeout(forcePublicFeed,1000);
  setTimeout(forcePublicFeed,1800);
  setTimeout(forcePublicFeed,3200);
})();