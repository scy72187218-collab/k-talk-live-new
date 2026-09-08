/* K-Talk 아이콘 추가: 버튼을 누르면 실제 PWA 설치창을 열고, 설치 완료 전까지 버튼을 유지한다. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktInstallIconSetup)return;
  window.__ktInstallIconSetup=true;

  var INSTALL_FLAG='ktalk_install_completed_once';

  function addLink(rel,href,attrs){
    var old=document.querySelector('link[rel="'+rel+'"]');
    if(old){old.href=href;return old;}
    var l=document.createElement('link');
    l.rel=rel;l.href=href;
    if(attrs)Object.keys(attrs).forEach(function(k){l.setAttribute(k,attrs[k]);});
    document.head.appendChild(l);
    return l;
  }
  addLink('manifest','/manifest.webmanifest?v=20260908-install2');
  addLink('icon','/ktalk-icon-192.png?v=20260907-icon1',{type:'image/png',sizes:'192x192'});
  addLink('apple-touch-icon','/ktalk-icon-192.png?v=20260907-icon1',{sizes:'192x192'});
  var theme=document.querySelector('meta[name="theme-color"]');
  if(!theme){theme=document.createElement('meta');theme.name='theme-color';document.head.appendChild(theme);}
  theme.content='#050307';

  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/sw.js?v=20260908-install2',{scope:'/'}).catch(function(){});
    });
  }

  var deferredPrompt=null;

  function standalone(){
    return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
  }
  function rememberInstalled(){
    try{localStorage.setItem(INSTALL_FLAG,'1');}catch(e){}
  }
  function installedBefore(){
    if(standalone()){
      rememberInstalled();
      return true;
    }
    try{return localStorage.getItem(INSTALL_FLAG)==='1';}catch(e){return false;}
  }
  function removeButton(){var b=document.getElementById('ktInstallIconButton');if(b)b.remove();}

  function inBroadcastOrCreator(){
    try{
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('show'))return true;
      if(document.querySelector('.live-prep-open,.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.ktg13-room'))return true;
    }catch(e){}
    return false;
  }

  function setButtonState(text,disabled){
    var b=document.getElementById('ktInstallIconButton');
    if(!b)return;
    var s=b.querySelector('span');
    if(s)s.textContent=text||'K-Talk 아이콘 추가';
    b.disabled=!!disabled;
    b.style.opacity=disabled?'.78':'1';
  }

  async function openInstallPrompt(){
    if(!deferredPrompt)return false;
    var promptEvent=deferredPrompt;
    deferredPrompt=null;
    setButtonState('설치 창 여는 중…',true);
    try{
      promptEvent.prompt();
      var choice=await promptEvent.userChoice;
      if(choice&&choice.outcome==='accepted'){
        rememberInstalled();
        removeButton();
      }else{
        setButtonState('K-Talk 아이콘 추가',false);
      }
      return true;
    }catch(e){
      setButtonState('K-Talk 아이콘 추가',false);
      return false;
    }
  }

  function showFallbackGuide(){
    var ua=navigator.userAgent||'';
    var isiOS=/iphone|ipad|ipod/i.test(ua);
    var isNaver=/NAVER/i.test(ua);
    if(isiOS){
      alert('K-Talk 아이콘 추가\n\n아래 공유 버튼을 누른 뒤 “홈 화면에 추가”를 눌러 주세요.');
      return;
    }
    if(isNaver){
      alert('K-Talk 아이콘 추가\n\n네이버 안에서는 설치창이 바로 안 뜰 수 있습니다. 브라우저 메뉴에서 “다른 브라우저로 열기”를 누른 뒤 Chrome에서 다시 “K-Talk 아이콘 추가”를 눌러 주세요.');
      return;
    }
    alert('K-Talk 아이콘 추가\n\n설치창을 준비 중입니다. 잠시 뒤 이 버튼을 한 번 더 눌러 주세요. 그래도 안 뜨면 브라우저 메뉴의 “앱 설치” 또는 “홈 화면에 추가”를 눌러 주세요.');
  }

  function ensureButton(){
    if(inBroadcastOrCreator()){removeButton();return;}
    if(installedBefore()||document.getElementById('ktInstallIconButton'))return;

    var b=document.createElement('button');
    b.id='ktInstallIconButton';
    b.type='button';
    b.innerHTML='<img src="/ktalk-icon-192.png?v=20260907-icon1" alt=""><span>K-Talk 아이콘 추가</span>';
    b.setAttribute('aria-label','K-Talk 아이콘 추가');
    b.style.cssText='position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:8px;height:46px;padding:5px 18px 5px 6px;border:1px solid rgba(255,255,255,.30);border-radius:999px;background:linear-gradient(135deg,rgba(35,13,44,.97),rgba(12,9,20,.97));color:#fff;font:950 14px system-ui,-apple-system,sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.48),0 0 16px rgba(255,67,190,.22);touch-action:manipulation;white-space:nowrap';
    var img=b.querySelector('img');if(img)img.style.cssText='width:34px;height:34px;border-radius:9px;display:block';

    b.addEventListener('click',async function(){
      if(await openInstallPrompt())return;
      setButtonState('설치 준비 중…',true);
      try{
        if('serviceWorker' in navigator)await navigator.serviceWorker.ready;
      }catch(e){}
      setTimeout(async function(){
        setButtonState('K-Talk 아이콘 추가',false);
        if(await openInstallPrompt())return;
        showFallbackGuide();
      },350);
    });

    document.body.appendChild(b);
  }

  function hideWhenEnteringBroadcast(){
    if(inBroadcastOrCreator())removeButton();
    else if(!installedBefore())ensureButton();
  }

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    if(installedBefore()){
      deferredPrompt=null;
      removeButton();
      return;
    }
    deferredPrompt=e;
    if(!inBroadcastOrCreator())ensureButton();
  });

  window.addEventListener('appinstalled',function(){
    rememberInstalled();
    deferredPrompt=null;
    removeButton();
  });

  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.kt-bottom .livebtn,.kt-creator-room-shortcuts button,.room-switch,.prep-start,[onclick*="openCreator"],[onclick*="openRoomPrep"],[onclick*="startBroadcast"]'):null;
    if(t)setTimeout(hideWhenEnteringBroadcast,0);
  },true);

  try{
    var obs=new MutationObserver(hideWhenEnteringBroadcast);
    obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}

  setTimeout(function(){
    if(installedBefore()||inBroadcastOrCreator())removeButton();
    else ensureButton();
  },700);
})();
