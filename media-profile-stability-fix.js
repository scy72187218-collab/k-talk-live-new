/* K-Talk: 동영상 페이지 이탈 시 정지 + 가짜/중복 영상 제거 + 같은 계정 프로필 사진 복구. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktMediaProfileStabilityFixInstalled)return;
  window.__ktMediaProfileStabilityFixInstalled=true;

  function isCameraMedia(m){
    if(!m)return false;
    return m.id==='camera'||m.id==='cameraBg'||m.id==='ktCreatorPreview';
  }

  window.ktStopPageMedia=function(){
    try{
      document.querySelectorAll('video,audio').forEach(function(m){
        if(isCameraMedia(m))return;
        try{m.pause();}catch(e){}
        try{m.muted=true;m.volume=0;}catch(e){}
        try{m.removeAttribute('autoplay');}catch(e){}
      });
    }catch(e){}
    try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
  };

  function stopOtherVideos(current){
    try{
      document.querySelectorAll('video').forEach(function(v){
        if(v===current||isCameraMedia(v))return;
        try{v.pause();}catch(e){}
      });
    }catch(e){}
  }

  /* 한 번에 실제 동영상 하나만 재생 */
  document.addEventListener('play',function(e){
    var v=e.target;
    if(!v||v.tagName!=='VIDEO'||isCameraMedia(v))return;
    stopOtherVideos(v);
  },true);

  /* 다른 페이지/메뉴로 넘어가는 순간 현재 동영상 정지 */
  document.addEventListener('click',function(e){
    var nav=e.target&&e.target.closest?e.target.closest('[data-tab],[data-bottom]'):null;
    if(nav)window.ktStopPageMedia();
  },true);

  function wrapStop(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktStopBeforePage)return;
    var wrapped=function(){
      window.ktStopPageMedia();
      return fn.apply(this,arguments);
    };
    wrapped.__ktStopBeforePage=true;
    wrapped.__ktOriginal=fn;
    window[name]=wrapped;
  }

  function installPageStops(){
    ['friends','openProfile','openProfileDirect','openMenu','openSiteGuide'].forEach(wrapStop);
  }
  installPageStops();
  setTimeout(installPageStops,500);
  setTimeout(installPageStops,1600);

  function srcOf(v){
    try{return String(v.currentSrc||v.getAttribute('src')||'');}catch(e){return '';}
  }

  function isDemoFlower(v){
    var s=srcOf(v);
    return s.indexOf('interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4')>-1;
  }

  function cleanupFeed(){
    try{
      document.querySelectorAll('video').forEach(function(v){
        if(!isDemoFlower(v))return;
        try{v.pause();}catch(e){}
        var sec=v.closest&&v.closest('section');
        if(sec&&!sec.querySelector('.kt-public-video'))sec.remove();
        else v.remove();
      });
    }catch(e){}

    /* 같은 실제 주소가 중복으로 생기면 첫 번째만 남김 */
    try{
      var seen={};
      document.querySelectorAll('video.kt-public-video').forEach(function(v){
        var s=srcOf(v);
        if(!s)return;
        if(seen[s]){
          try{v.pause();}catch(e){}
          var sec=v.closest&&v.closest('section');
          if(sec)sec.remove();else v.remove();
          return;
        }
        seen[s]=1;
      });
    }catch(e){}
  }

  cleanupFeed();
  var cleanTimer=0;
  var ob=new MutationObserver(function(){
    clearTimeout(cleanTimer);
    cleanTimer=setTimeout(cleanupFeed,0);
  });
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}

  /* 예전과 현재 프로필 저장 키가 달라졌어도 같은 계정 이름의 사진만 복구 */
  function canonName(v){
    v=String(v||'').replace(/\s+/g,'').toLowerCase();
    if(v==='태권이'||v==='k-톡태권'||v==='k톡태권'||v==='k-톡태권1'||v==='k톡태권1')return 'taekwon1';
    if(v==='하이네'||v==='k-톡하이네'||v==='k톡하이네'||v==='k-톡하이네2'||v==='k톡하이네2')return 'haine2';
    return v;
  }

  function recoverPhotoFor(profile){
    if(!profile||profile.photo)return profile;
    var wanted=[];
    try{if(profile.name)wanted.push(profile.name);}catch(e){}
    try{var a=localStorage.getItem('ktalk_active_account_name');if(a)wanted.push(a);}catch(e){}
    try{if(window.ktCurrentVerifiedAccountName){var n=window.ktCurrentVerifiedAccountName();if(n)wanted.push(n);}}catch(e){}
    var wantedCanon=wanted.map(canonName).filter(Boolean);
    if(!wantedCanon.length)return profile;

    var found='';
    try{
      for(var i=0;i<localStorage.length;i++){
        var key=localStorage.key(i)||'';
        if(key.indexOf('ktalk_profile_v1:')!==0)continue;
        var raw=localStorage.getItem(key);
        if(!raw)continue;
        var p=JSON.parse(raw)||{};
        if(!p.photo)continue;
        var c=canonName(p.name||'');
        if(c&&wantedCanon.indexOf(c)>-1){found=String(p.photo);break;}
      }
    }catch(e){}
    if(!found)return profile;

    profile.photo=found;
    try{
      if(window.ktProfileStorageKey){
        var currentKey=window.ktProfileStorageKey();
        var cur={};
        try{cur=JSON.parse(localStorage.getItem(currentKey)||'{}')||{};}catch(e){}
        cur.photo=found;
        if(!cur.name&&profile.name)cur.name=profile.name;
        localStorage.setItem(currentKey,JSON.stringify(cur));
      }
    }catch(e){}
    return profile;
  }

  function installProfileRecovery(){
    var old=window.ktProfileLoad;
    if(typeof old!=='function'||old.__ktPhotoRecovery)return;
    var wrapped=function(){return recoverPhotoFor(old.apply(this,arguments));};
    wrapped.__ktPhotoRecovery=true;
    wrapped.__ktOriginal=old;
    window.ktProfileLoad=wrapped;
  }
  installProfileRecovery();
  setTimeout(installProfileRecovery,500);
  setTimeout(installProfileRecovery,1600);
})();
