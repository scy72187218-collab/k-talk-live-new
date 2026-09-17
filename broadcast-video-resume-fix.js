/* K-Talk: 방송 화면을 다녀온 뒤 동영상 화면으로 돌아오면 보이는 영상만 다시 재생. 동영상 소리는 한 번에 하나만 재생. 다른 UI/방송 기능은 건드리지 않음. */
(function(){
  if(window.__ktBroadcastVideoResumeFixInstalled)return;
  window.__ktBroadcastVideoResumeFixInstalled=true;

  function liveRoomActive(){
    try{return !!document.querySelector('.kt-remote-live,.ktg13-room,.ktsolo-room,.ktsubscriber-room,.ktsecret-room');}
    catch(e){return false;}
  }

  function isCameraOrLiveMedia(m){
    if(!m)return false;
    var id=m.id||'';
    if(id==='camera'||id==='cameraBg'||id==='ktLiveVideo'||id==='ktSept2Live'||id==='ktRemoteLive'||id==='ktRemoteLiveVideo'||id==='ktRemoteHostPreview'||id==='ktRemoteGuestSelfVideo')return true;
    try{
      if(m.closest&&m.closest('.kt-remote-live,.ktg13-room,.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.kt-approved-guest-grid'))return true;
    }catch(e){}
    return false;
  }

  function stopCompetingMedia(target){
    try{
      document.querySelectorAll('audio,video').forEach(function(m){
        if(!m||m===target||isCameraOrLiveMedia(m))return;
        try{m.pause();}catch(e){}
        try{m.muted=true;}catch(e){}
      });
    }catch(e){}
    try{
      if(window.ktSoundAudio&&window.ktSoundAudio!==target)window.ktSoundAudio.pause();
    }catch(e){}
    try{
      if(window.ktCreatorMusicCapture&&window.ktCreatorMusicCapture.audio&&window.ktCreatorMusicCapture.audio!==target){
        window.ktCreatorMusicCapture.audio.pause();
      }
    }catch(e){}
    try{if(window.ktStopSoundPreview)window.ktStopSoundPreview();}catch(e){}
  }

  function visible(v){
    if(!v||!v.isConnected)return false;
    try{
      var cs=getComputedStyle(v);
      if(cs.display==='none'||cs.visibility==='hidden')return false;
      var r=v.getBoundingClientRect();
      var vh=innerHeight||document.documentElement.clientHeight||0;
      var vw=innerWidth||document.documentElement.clientWidth||0;
      return r.width>1&&r.height>1&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw;
    }catch(e){return false;}
  }

  function resumeVisibleVideo(){
    if(document.hidden||liveRoomActive())return;
    try{window.__ktPageMediaStopUntil=0;}catch(e){}
    var list=[].slice.call(document.querySelectorAll('.kt-public-video,#homeVideo'));
    if(!list.length)return;
    var target=null,dist=Infinity;
    var cy=(innerHeight||document.documentElement.clientHeight||0)/2;
    list.forEach(function(v){
      if(!visible(v))return;
      try{
        var r=v.getBoundingClientRect();
        var d=Math.abs((r.top+r.bottom)/2-cy);
        if(d<dist){dist=d;target=v;}
      }catch(e){}
    });
    if(!target)return;
    stopCompetingMedia(target);
    try{
      target.preload='auto';
      target.setAttribute('playsinline','');
      target.setAttribute('webkit-playsinline','');
      var p=target.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  document.addEventListener('play',function(e){
    var v=e.target;
    if(!v||!v.matches)return;
    if(!v.matches('.kt-public-video,#homeVideo,#ktLibraryPlayer'))return;
    /* 방송방이 열려 있을 때 뒤쪽 피드 영상이 다시 재생되어 통신을 뺏지 않게 한다. */
    if(liveRoomActive()&&!isCameraOrLiveMedia(v)){
      try{v.pause();}catch(err){}
      return;
    }
    stopCompetingMedia(v);
  },true);

  function resumeSequence(){
    if(liveRoomActive())return;
    resumeVisibleVideo();
    [30,120,350,800].forEach(function(ms){setTimeout(resumeVisibleVideo,ms);});
  }

  function wrap(name){
    var old=window[name];
    if(typeof old!=='function'||old.__ktBroadcastVideoResume)return;
    var fn=function(){
      try{window.__ktPageMediaStopUntil=0;}catch(e){}
      var r=old.apply(this,arguments);
      resumeSequence();
      return r;
    };
    fn.__ktBroadcastVideoResume=true;
    window[name]=fn;
  }

  wrap('home');
  wrap('media');

  /* 다른 스크립트가 home/media를 다시 감싸도 마지막에 한 번 더 연결한다. */
  setTimeout(function(){wrap('home');wrap('media');},200);
  setTimeout(function(){wrap('home');wrap('media');},800);

  try{
    new MutationObserver(function(list){
      var found=false;
      list.forEach(function(rec){
        [].slice.call(rec.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          if((n.matches&&n.matches('.kt-public-video,#homeVideo'))||(n.querySelector&&n.querySelector('.kt-public-video,#homeVideo')))found=true;
        });
      });
      if(found)resumeSequence();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
