/* K-Talk 동영상 열기 전용 복구
   - 휴대폰 동영상 선택 버튼이 모바일에서 바로 열리도록 보강
   - 홈 공개 동영상 첫 화면이 멈췄을 때 재생만 복구
   - 방송방 5개/채팅/스위치/레이아웃/잠금은 변경하지 않음 */
(function(){
  if(window.__ktVideoOpenRecovery20260919)return;
  window.__ktVideoOpenRecovery20260919=true;

  function videoInput(){
    return document.getElementById('ktMyVideoInput');
  }

  function directPicker(){
    var input=videoInput();
    if(!input)return false;
    try{
      input.disabled=false;
      input.removeAttribute('disabled');
      input.value='';
      input.style.setProperty('pointer-events','auto','important');
      input.click();
      return true;
    }catch(e){return false;}
  }

  /* 기존 함수도 같은 직접 열기 방식으로 유지 */
  window.openMyVideoPicker=function(){
    return directPicker();
  };

  /* 내 동영상 목록의 '휴대폰 동영상 올리기/선택'은
     setTimeout 없이 사용자의 실제 터치 순간 바로 파일 선택창을 연다. */
  function isPhoneVideoButton(el){
    if(!el)return false;
    var txt=String(el.textContent||'').replace(/\s+/g,'');
    return txt.indexOf('휴대폰동영상올리기')>-1||
           txt.indexOf('휴대폰동영상선택')>-1;
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!isPhoneVideoButton(b))return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    directPicker();
  },true);

  document.addEventListener('pointerup',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!isPhoneVideoButton(b))return;
    directPicker();
  },true);

  function visible(v){
    if(!v||!v.isConnected)return false;
    try{
      var s=getComputedStyle(v);
      if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
      var r=v.getBoundingClientRect();
      var vw=innerWidth||document.documentElement.clientWidth||0;
      var vh=innerHeight||document.documentElement.clientHeight||0;
      return r.width>2&&r.height>2&&r.right>0&&r.bottom>0&&r.left<vw&&r.top<vh;
    }catch(e){return false;}
  }

  function resumeFirstVisible(){
    if(document.hidden)return;
    var list=[].slice.call(document.querySelectorAll('#screen .kt-public-video,#screen #homeVideo'));
    if(!list.length)return;
    var target=list.find(visible)||list[0];
    list.forEach(function(v){
      if(v!==target){try{v.pause();}catch(e){}}
    });
    try{
      target.setAttribute('playsinline','');
      target.setAttribute('webkit-playsinline','');
      target.preload='auto';
      target.muted=true;
      target.defaultMuted=true;
      target.volume=0;
      var p=target.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function retryVideo(){
    [0,80,220,500,900,1600].forEach(function(ms){setTimeout(resumeFirstVisible,ms);});
  }

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)retryVideo();
  });
  window.addEventListener('pageshow',retryVideo);
  window.addEventListener('focus',function(){setTimeout(resumeFirstVisible,60);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktVideoOpenRecoveryTimer);
      window.__ktVideoOpenRecoveryTimer=setTimeout(resumeFirstVisible,60);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  retryVideo();
})();