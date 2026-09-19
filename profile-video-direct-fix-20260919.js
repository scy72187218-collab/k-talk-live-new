/* K-Talk 프로필/동영상 재생 전용 보강 (2026-09-19)
   - 프로필 버튼/사진: 현재 선택 계정의 내 프로필을 바로 연다.
   - 공개 동영상: 화면 전환 뒤 멈췄을 때 보이는 영상만 다시 재생한다.
   - 기존 방송/게스트/채팅/카메라/스위치 로직은 변경하지 않는다.
*/
(function(){
  if(window.__ktProfileVideoDirectFix20260919)return;
  window.__ktProfileVideoDirectFix20260919=true;

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.body.classList.contains('kt-video-mode'))return true;
      return !!document.querySelector('#screen .kt-public-video,#screen #homeVideo,#screen .video-home');
    }catch(e){return false;}
  }

  function directProfile(){
    try{
      if(typeof window.openProfileDirect==='function'){
        window.openProfileDirect();
        return true;
      }
    }catch(e){}
    return false;
  }

  /* 하단 프로필 버튼은 계정 선택창이 아니라 현재 계정 프로필을 바로 연다.
     계정 변경은 프로필 안의 '계정 선택' 버튼으로 그대로 가능. */
  function installProfileDirect(){
    if(typeof window.openProfileDirect!=='function')return;
    var fn=function(){
      return window.openProfileDirect();
    };
    fn.__ktProfileDirect20260919=true;
    window.openProfile=fn;
  }

  /* 동영상 화면 오른쪽의 '프로필' 사진/버튼도 내 프로필로 바로 연결 */
  document.addEventListener('click',function(e){
    if(!inVideoView())return;
    var t=e.target;
    if(!t||!t.closest)return;
    var hit=t.closest('button,[role="button"],.right-actions>*,.vh-actions>*');
    if(!hit)return;
    var label=(String(hit.getAttribute('aria-label')||'')+' '+String(hit.textContent||'')).replace(/\s+/g,'');
    if(label.indexOf('프로필')<0)return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    directProfile();
  },true);

  function visible(v){
    if(!v||!v.isConnected)return false;
    try{
      var cs=getComputedStyle(v);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      var r=v.getBoundingClientRect();
      var vw=innerWidth||document.documentElement.clientWidth||0;
      var vh=innerHeight||document.documentElement.clientHeight||0;
      return r.width>2&&r.height>2&&r.right>0&&r.bottom>0&&r.left<vw&&r.top<vh;
    }catch(e){return false;}
  }

  function candidates(){
    try{return [].slice.call(document.querySelectorAll('#screen .kt-public-video,#screen #homeVideo'));}
    catch(e){return [];}
  }

  function nearestVisible(){
    var list=candidates(),best=null,dist=Infinity;
    var cy=(innerHeight||document.documentElement.clientHeight||0)/2;
    list.forEach(function(v){
      if(!visible(v))return;
      try{
        var r=v.getBoundingClientRect();
        var d=Math.abs((r.top+r.bottom)/2-cy);
        if(d<dist){dist=d;best=v;}
      }catch(e){}
    });
    return best;
  }

  function mutedFallbackPlay(v){
    if(!v||document.hidden||!inVideoView())return;
    try{
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.preload='auto';
    }catch(e){}

    function playMuted(){
      try{
        v.muted=true;
        v.defaultMuted=true;
        var p2=v.play();
        if(p2&&p2.catch)p2.catch(function(){});
      }catch(e){}
    }

    try{
      var p=v.play();
      if(p&&p.catch){
        p.catch(function(err){
          var n=String(err&&err.name||'');
          if(n==='NotAllowedError'||n==='AbortError'||v.paused)playMuted();
        });
      }
    }catch(e){playMuted();}

    /* 모바일 브라우저가 첫 시도를 무시한 경우 한 번 더 무음 재생 */
    setTimeout(function(){
      try{if(v.paused&&visible(v)&&!document.hidden)playMuted();}catch(e){}
    },220);
  }

  function resumeVisible(){
    if(document.hidden||!inVideoView())return;
    var target=nearestVisible();
    if(!target)return;
    candidates().forEach(function(v){
      if(v!==target){try{v.pause();}catch(e){}}
    });
    mutedFallbackPlay(target);
  }

  function resumeSequence(){
    [0,80,220,500,900].forEach(function(ms){setTimeout(resumeVisible,ms);});
  }

  /* 피드가 새로 그려지거나 다음 영상으로 넘어갈 때 재생 보강 */
  document.addEventListener('scroll',function(){
    if(!inVideoView())return;
    clearTimeout(window.__ktProfileVideoScrollTimer);
    window.__ktProfileVideoScrollTimer=setTimeout(resumeVisible,80);
  },true);

  document.addEventListener('touchend',function(){
    if(inVideoView())setTimeout(resumeVisible,60);
  },true);

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)resumeSequence();
  });
  window.addEventListener('pageshow',resumeSequence);
  window.addEventListener('focus',resumeSequence);

  /* 시트(프로필/댓글 등)를 닫고 동영상으로 돌아오면 보이는 영상 재생 */
  function wrapCloseSheet(){
    var old=window.closeSheet;
    if(typeof old!=='function'||old.__ktProfileVideoResume20260919)return;
    var fn=function(){
      var r=old.apply(this,arguments);
      if(inVideoView())resumeSequence();
      return r;
    };
    fn.__ktProfileVideoResume20260919=true;
    window.closeSheet=fn;
  }

  function ensureStyle(){
    if(document.getElementById('ktProfileVideoDirectFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktProfileVideoDirectFixStyle';
    /* 요청한 + / 종은 동영상 위 방송표시에서 숨김. LIVE/이름/사진은 유지. */
    s.textContent='.kt-video-live-peek .ktvl-follow,.kt-video-live-peek .ktvl-bell{display:none!important}';
    document.head.appendChild(s);
  }

  function clearOldVideoLock(){
    try{
      document.querySelectorAll('.kt-video-lock-cover').forEach(function(el){el.remove();});
      document.querySelectorAll('video[data-kt-video-locked]').forEach(function(v){
        v.removeAttribute('data-kt-video-locked');
        v.style.removeProperty('pointer-events');
        v.controls=false;
      });
    }catch(e){}
  }

  function install(){
    clearOldVideoLock();
    installProfileDirect();
    wrapCloseSheet();
    ensureStyle();
    resumeSequence();
  }

  install();
  [100,350,900,1800].forEach(function(ms){setTimeout(install,ms);});

  try{
    new MutationObserver(function(list){
      var need=false;
      list.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          if((n.matches&&n.matches('.kt-public-video,#homeVideo,.video-home'))||
             (n.querySelector&&n.querySelector('.kt-public-video,#homeVideo,.video-home')))need=true;
        });
      });
      if(need)resumeSequence();
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();