/* Stop page playback on navigation without stopping capture tracks or broadcasts. */
(function(){
  'use strict';
  if(window.__ktPageMediaLifecycle20261013)return;
  window.__ktPageMediaLifecycle20261013=true;
  var seen=new Set(),retired=new WeakSet(),stopping=false;
  var nativePlay=HTMLMediaElement.prototype.play;
  window.__ktPageNavigationEpoch20261013=Number(window.__ktPageNavigationEpoch20261013)||0;
  function capture(m){
    if(!m)return false;
    if(m.id==='camera'||m.id==='cameraBg')return true;
    return !!(m.tagName==='VIDEO'&&m.srcObject&&(m.muted||(window.state&&m.srcObject===window.state.stream)));
  }
  function pause(m){try{m.pause();}catch(e){}}
  function remember(m){if(m&&typeof m.pause==='function')seen.add(m);}
  function collect(){
    document.querySelectorAll('audio,video').forEach(remember);
    [window.ktSoundAudio,window.ktCreatorMusicAudio,window.ktCreatorMusicCapture&&window.ktCreatorMusicCapture.audio].forEach(remember);
  }
  function retire(m){
    if(!m||capture(m))return;
    retired.add(m);pause(m);
  }
  function stop(){
    if(stopping)return;
    stopping=true;
    try{
      var creatorMusic=!!window.ktCreatorMusicAudio;
      var previewMusic=!!(window.ktSoundAudio&&!window.ktSoundAudio.paused);
      collect();seen.forEach(retire);
      // Source-owning helpers also cancel pending song loads and release detached players.
      try{if(creatorMusic&&typeof window.ktStopCreatorMusic==='function')window.ktStopCreatorMusic();}catch(e){}
      try{if(previewMusic&&typeof window.ktStopSoundPreview==='function')window.ktStopSoundPreview();}catch(e){}
    }finally{
      seen.forEach(function(m){if(!m.isConnected&&retired.has(m))seen.delete(m);});
      stopping=false;
    }
  }
  function navigate(){
    window.__ktPageNavigationEpoch20261013++;
    stop();
    try{if(typeof window.ktCancelLiveEntryFeedback20261013==='function')window.ktCancelLiveEntryFeedback20261013();}catch(e){}
  }
  window.ktStopPageMedia=stop;
  window.ktBeginPageNavigation20261013=navigate;
  HTMLMediaElement.prototype.play=function(){
    var m=this;remember(m);
    if(!capture(m)&&(retired.has(m)||document.hidden)){
      retire(m);
      return Promise.reject(new DOMException('Playback cancelled after page navigation','AbortError'));
    }
    var result=nativePlay.apply(m,arguments);
    if(result&&typeof result.then==='function'){
      return result.then(function(value){if(retired.has(m)&&!capture(m))pause(m);return value;});
    }
    return result;
  };
  document.addEventListener('play',function(e){
    var m=e.target;remember(m);
    if(!capture(m)&&(retired.has(m)||document.hidden))retire(m);
  },true);
  // A deliberate tap on the current visible player may start it again.
  document.addEventListener('pointerdown',function(e){
    var m=e.target&&e.target.closest?e.target.closest('audio,video'):null;
    if(m&&m.isConnected&&!document.hidden){
      var r=m.getBoundingClientRect();
      if(r.width>0&&r.height>0)retired.delete(m);
    }
  },true);
  function wrap(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktMediaNavigation20261013)return;
    var wrapped=function(){navigate();return fn.apply(this,arguments);};
    Object.keys(fn).forEach(function(k){try{wrapped[k]=fn[k];}catch(e){}});
    wrapped.__ktMediaNavigation20261013=true;
    window[name]=wrapped;
  }
  function install(){
    ['home','friends','profile','openCreator','openTikLivePrep','closeCreator','openMyVideoLibrary','openMyVideoPicker',
     'ktLeaveRemoteLive','ktCloseRemoteFallbackInApp20260923','ktDirectRemoteLeaveNow20260924'].forEach(wrap);
  }
  new MutationObserver(function(records){
    records.forEach(function(r){Array.prototype.forEach.call(r.removedNodes,function(n){
      if(n.matches&&n.matches('audio,video'))retire(n);
      if(n.querySelectorAll)n.querySelectorAll('audio,video').forEach(retire);
    });});
  }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();});
  window.addEventListener('pagehide',navigate);
  window.addEventListener('popstate',navigate);
  window.addEventListener('hashchange',navigate);
  install();setInterval(install,500);
})();