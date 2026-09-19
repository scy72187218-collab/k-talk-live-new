/* K-Talk 내 프로필 사진 클릭 복구 (2026-09-19)
   내 프로필 사진 클릭만 처리. 방송/채팅/게스트/카메라/스위치 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktOwnerProfilePhotoOpen20260919)return;
  window.__ktOwnerProfilePhotoOpen20260919=true;

  var lastAt=0,lastEl=null;

  function selectedKey(){
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var k=String(window.ktGetSelectedSubAccount()||'');
        if(k==='taekwon1'||k==='haine2')return k;
      }
    }catch(e){}
    return '';
  }

  function ownerName(){
    var k=selectedKey();
    if(k==='taekwon1')return '태권1';
    if(k==='haine2')return '하이네2';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        if(p.name)return String(p.name);
      }
    }catch(e){}
    return '';
  }

  function localHostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'');}catch(e){return '';}
  }

  function visible(el){
    if(!el||!el.isConnected)return false;
    try{
      var cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)!==0&&r.width>4&&r.height>4;
    }catch(e){return false;}
  }

  function photoTarget(t){
    if(!t||!t.closest)return null;
    return t.closest(
      '.kt-allhost-photo,.kt-allhost-fallback,'+
      '#ktVideoLivePeek img,#ktFollowLiveStrip img,.kt-follow-person img,'+
      '.kt-live-list-thumb img,.kt-live-card img,'+
      '[data-host] img'
    );
  }

  function isMine(el){
    if(!el)return false;

    /* 내 방송방의 호스트 사진 */
    if(el.matches('.kt-allhost-photo,.kt-allhost-fallback')){
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return true;
    }

    var hostEl=el.closest('[data-host]');
    if(hostEl){
      var hid=String(hostEl.getAttribute('data-host')||'');
      var me=localHostId();
      if(hid&&me&&hid===me)return true;
    }

    var name=ownerName();
    if(name){
      var p=el;
      for(var i=0;i<5&&p;i++,p=p.parentElement){
        var txt=String(p.textContent||'').replace(/\s+/g,'');
        if(txt.indexOf(name.replace(/\s+/g,''))>-1)return true;
      }
    }
    return false;
  }

  function openMine(){
    try{
      if(typeof window.openProfileDirect==='function'){
        window.openProfileDirect();
        return true;
      }
      if(typeof window.openProfile==='function'){
        window.openProfile();
        return true;
      }
    }catch(e){}
    return false;
  }

  function handle(e){
    var el=photoTarget(e.target);
    if(!el||!visible(el)||!isMine(el))return;

    var now=Date.now();
    if(lastEl===el&&now-lastAt<500)return;
    if(!openMine())return;

    lastEl=el;lastAt=now;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
  }

  /* 클릭이 다른 레이어에 막히는 경우를 위해 손을 뗄 때도 처리 */
  document.addEventListener('pointerup',handle,true);
  document.addEventListener('click',handle,true);

  function unlock(){
    document.querySelectorAll(
      '.kt-allhost-profile,.kt-allhost-photo,.kt-allhost-fallback,'+
      '#ktVideoLivePeek img,#ktFollowLiveStrip img,.kt-follow-person img,'+
      '[data-host] img'
    ).forEach(function(el){
      try{
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      }catch(e){}
    });
  }

  unlock();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(unlock,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktOwnerProfilePhotoOpenTimer);
      window.__ktOwnerProfilePhotoOpenTimer=setTimeout(unlock,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();