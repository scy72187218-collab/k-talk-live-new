/* K-Talk first public video paint speed only (2026-09-24)
   Shows the cached first public video immediately after app.js, before the
   heavier room scripts finish loading. It does not touch live rooms, guest
   approval, direction, buttons or layout logic. */
(function(){
  if(window.__ktPublicFirstPaint20260924)return;
  window.__ktPublicFirstPaint20260924=true;

  function firstUrl(){
    /* Never let an older phone cache replace the first painted video. */
    return 'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4';
  }

  function run(){
    try{
      var s=document.getElementById('screen');
      var creator=document.getElementById('creator');
      if(!s||document.hidden)return;
      if(creator&&creator.classList.contains('show'))return;
      if(s.querySelector('.kt-public-video,.kt-remote-live,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'))return;

      var u=firstUrl();
      if(!u)return;

      document.body.classList.remove('kt-home');
      document.body.classList.add('kt-video-mode');

      var holder=document.createElement('section');
      holder.id='ktPublicFirstPaint';
      holder.style.cssText='height:calc(100dvh - 78px);min-height:560px;position:relative;background:#000;overflow:hidden';

      var v=document.createElement('video');
      v.id='ktPublicFirstPaintVideo';
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      v.autoplay=true;
      v.loop=true;
      v.playsInline=true;
      v.preload='auto';
      v.src=u;
      v.setAttribute('autoplay','');
      v.setAttribute('muted','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.setAttribute('fetchpriority','high');
      v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000';

      holder.appendChild(v);
      s.replaceChildren(holder);
      window.__ktPublicFirstPaintUrl20260924=u;
      window.__ktPublicFirstPaintVideo20260924=v;

      /* Do not call load(): it can restart the same first-video request. */
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
      [40,120,260,520].forEach(function(ms){
        setTimeout(function(){
          try{if(v.isConnected&&v.paused){var q=v.play();if(q&&q.catch)q.catch(function(){});}}catch(e){}
        },ms);
      });
    }catch(e){}
  }

  run();
})();