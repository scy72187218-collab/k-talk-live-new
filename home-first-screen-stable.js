/* K-Talk: one stable first-screen video recovery. No room/chat/camera layout changes. */
(function(){
  if(window.__ktHomeFirstScreenStableLoaded)return;
  window.__ktHomeFirstScreenStableLoaded=true;

  var SOURCES=[
    'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516701116-emysxm.mp4',
    'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516656323-4elqcf.mp4',
    'https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516618159-4ep5ki.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  ];
  var sourceIndex=0;
  var feedRequested=false;
  var stable=false;
  var checking=false;

  function safe(){
    if(document.getElementById('ktSept2Live'))return false;
    if(document.getElementById('ktRemoteLive'))return false;
    var c=document.getElementById('creator');
    return !(c&&c.classList.contains('show'));
  }

  function firstVideo(){
    if(!safe())return null;
    return document.querySelector('#ktUnifiedFeed video.kt-public-video, #ktUnifiedFeed video, .video-home video#homeVideo, .video-home video');
  }

  function prepare(v){
    if(!v)return;
    try{
      v.removeAttribute('poster');
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      v.autoplay=true;
      v.loop=true;
      v.preload='auto';
      v.setAttribute('muted','');
      v.setAttribute('autoplay','');
      v.setAttribute('loop','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
    }catch(e){}
  }

  function play(v){
    if(!v)return;
    prepare(v);
    try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }

  function switchSource(v){
    if(!v||stable)return;
    sourceIndex=Math.min(sourceIndex+1,SOURCES.length-1);
    try{
      v.pause();
      while(v.firstChild)v.removeChild(v.firstChild);
      v.removeAttribute('poster');
      v.src=SOURCES[sourceIndex];
      v.load();
      play(v);
    }catch(e){}
  }

  function bind(v){
    if(!v||v.dataset.ktStableFirstBound==='1')return;
    v.dataset.ktStableFirstBound='1';
    v.addEventListener('error',function(){if(!stable)switchSource(v);});
    v.addEventListener('loadeddata',function(){play(v);});
    v.addEventListener('canplay',function(){play(v);});
    v.addEventListener('playing',function(){
      setTimeout(function(){
        try{if(v.currentTime>0.15)stable=true;}catch(e){}
      },500);
    });
  }

  function requestFeed(){
    if(feedRequested||!safe()||document.getElementById('ktUnifiedFeed'))return;
    if(typeof window.ktLowMemoryFeed!=='function')return;
    feedRequested=true;
    try{
      var r=window.ktLowMemoryFeed();
      if(r&&typeof r.finally==='function')r.finally(function(){feedRequested=false;});
      else setTimeout(function(){feedRequested=false;},1200);
    }catch(e){feedRequested=false;}
  }

  function check(){
    if(stable||checking||!safe())return;
    checking=true;
    try{
      requestFeed();
      var v=firstVideo();
      if(!v)return;
      bind(v);
      prepare(v);
      var legacy=!document.getElementById('ktUnifiedFeed');
      var src=String(v.getAttribute('src')||v.currentSrc||'');
      if(legacy&&(src.indexOf('zupwbfmacwzexyvznlzq.supabase.co')===-1&&src.indexOf('interactive-examples.mdn.mozilla.net')===-1)){
        try{
          v.pause();
          while(v.firstChild)v.removeChild(v.firstChild);
          v.src=SOURCES[sourceIndex];
          v.load();
        }catch(e){}
      }
      var before=Number(v.currentTime||0);
      play(v);
      setTimeout(function(){
        try{
          if(stable)return;
          var cur=firstVideo();
          if(!cur)return;
          var now=Number(cur.currentTime||0);
          if(!cur.paused&&now>before+0.12){stable=true;return;}
          switchSource(cur);
        }catch(e){}
      },1800);
    }finally{
      checking=false;
    }
  }

  [0,120,350,800,1500,2600,4200,6500,9000].forEach(function(ms){setTimeout(check,ms);});
  window.addEventListener('pageshow',function(){stable=false;sourceIndex=0;setTimeout(check,40);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&!stable)setTimeout(check,40);});
})();
