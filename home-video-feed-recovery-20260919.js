/* K-Talk 첫 동영상 화면 복구 전용
   - 앱 첫 화면이 검게 비거나 첫 공개 동영상이 멈춘 경우만 복구
   - 1인/9명/13명/구독자/비밀방, 채팅, 스위치, 잠금은 변경하지 않음 */
(function(){
  if(window.__ktHomeVideoFeedRecovery20260919)return;
  window.__ktHomeVideoFeedRecovery20260919=true;

  var homeRetryCount=0;
  var cacheRefreshDone=false;

  function inLiveOrCreator(){
    try{
      if(document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live'))return true;
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return true;
    }catch(e){}
    return false;
  }

  function visible(v){
    if(!v||!v.isConnected)return false;
    try{
      var cs=getComputedStyle(v);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      var r=v.getBoundingClientRect();
      var vw=innerWidth||document.documentElement.clientWidth||0;
      var vh=innerHeight||document.documentElement.clientHeight||0;
      return r.width>4&&r.height>4&&r.right>0&&r.bottom>0&&r.left<vw&&r.top<vh;
    }catch(e){return false;}
  }

  function play(v){
    if(!v||document.hidden)return;
    try{
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.preload='auto';
      v.muted=true;
      v.defaultMuted=true;
      v.volume=0;
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function attach(v){
    if(!v||v.dataset.ktHomeRecoveryBound==='1')return;
    v.dataset.ktHomeRecoveryBound='1';

    v.addEventListener('loadeddata',function(){
      if(visible(v))play(v);
    });
    v.addEventListener('canplay',function(){
      if(visible(v))play(v);
    });
    v.addEventListener('error',function(){
      if(inLiveOrCreator())return;
      var list=[].slice.call(document.querySelectorAll('#screen .kt-public-video,#screen #homeVideo'));
      var next=list.find(function(x){return x!==v&&!x.dataset.ktVideoFailed;});
      v.dataset.ktVideoFailed='1';
      if(next){
        try{next.scrollIntoView({block:'start'});}catch(e){}
        setTimeout(function(){play(next);},50);
        return;
      }

      /* 저장된 피드 주소가 오래되어 전부 안 열릴 때 한 번만 새 목록을 받음 */
      if(!cacheRefreshDone&&typeof window.home==='function'){
        cacheRefreshDone=true;
        try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
        setTimeout(function(){try{window.home();}catch(e){}},80);
      }
    });
  }

  function recover(){
    if(inLiveOrCreator()||document.hidden)return;
    var screen=document.getElementById('screen');
    if(!screen)return;

    var videos=[].slice.call(screen.querySelectorAll('.kt-public-video,#homeVideo'));
    if(videos.length){
      videos.forEach(attach);
      var target=videos.find(visible)||videos[0];
      play(target);
      setTimeout(function(){
        try{
          if(target.paused&&visible(target))play(target);
        }catch(e){}
      },250);
      return;
    }

    /* 첫 로딩 때 posted-feed.js가 뒤늦게 준비되어 화면이 빈 경우 홈을 다시 한 번 그림 */
    var txt=String(screen.textContent||'').trim();
    var meaningful=screen.querySelector('.media,.friends-page,.kt-dashboard,.profile-page,.kt-public-video,#homeVideo');
    if(!meaningful&&homeRetryCount<2&&typeof window.home==='function'){
      homeRetryCount++;
      try{window.home();}catch(e){}
    }
  }

  function sequence(){
    [50,180,450,900,1500,2600].forEach(function(ms){setTimeout(recover,ms);});
  }

  sequence();
  window.addEventListener('pageshow',sequence);
  window.addEventListener('focus',function(){setTimeout(recover,80);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)sequence();});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHomeVideoFeedRecoveryTimer);
      window.__ktHomeVideoFeedRecoveryTimer=setTimeout(recover,60);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();