/* K-Talk 아이콘/설치 연결: 설치 전 사용자에게만 안내하고, 한 번 설치가 완료되면 같은 기기에서는 다시 표시하지 않는다. 다른 기능은 건드리지 않음. */
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
  addLink('manifest','/manifest.webmanifest?v=20260907-icon1');
  addLink('icon','/ktalk-icon-192.png?v=20260907-icon1',{type:'image/png',sizes:'192x192'});
  addLink('apple-touch-icon','/ktalk-icon-192.png?v=20260907-icon1',{sizes:'192x192'});
  var theme=document.querySelector('meta[name="theme-color"]');
  if(!theme){theme=document.createElement('meta');theme.name='theme-color';document.head.appendChild(theme);}
  theme.content='#050307';

  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/sw.js?v=20260907-icon1',{scope:'/'}).catch(function(){});
    });
  }

  var deferredPrompt=null;
  function standalone(){
    return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
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
  function ensureButton(){
    if(installedBefore()||document.getElementById('ktInstallIconButton'))return;
    var b=document.createElement('button');
    b.id='ktInstallIconButton';
    b.type='button';
    b.innerHTML='<img src="/ktalk-icon-192.png?v=20260907-icon1" alt=""><span>K-Talk 아이콘 추가</span>';
    b.setAttribute('aria-label','K-Talk 아이콘을 홈 화면에 추가');
    b.style.cssText='position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:8px;height:44px;padding:4px 14px 4px 5px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(10,8,16,.94);color:#fff;font:800 13px system-ui,-apple-system,sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45);touch-action:manipulation';
    var img=b.querySelector('img');if(img)img.style.cssText='width:34px;height:34px;border-radius:9px;display:block';
    b.addEventListener('click',async function(){
      if(deferredPrompt){
        try{
          deferredPrompt.prompt();
          var choice=await deferredPrompt.userChoice;
          if(choice&&choice.outcome==='accepted')rememberInstalled();
        }catch(e){}
        deferredPrompt=null;
        removeButton();
        return;
      }
      var isiOS=/iphone|ipad|ipod/i.test(navigator.userAgent||'');
      alert(isiOS?'공유 버튼을 누른 뒤 “홈 화면에 추가”를 눌러 주세요.':'브라우저 메뉴에서 “홈 화면에 추가” 또는 “앱 설치”를 눌러 주세요.');
    });
    document.body.appendChild(b);
  }

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    if(installedBefore()){
      deferredPrompt=null;
      removeButton();
      return;
    }
    deferredPrompt=e;
    ensureButton();
  });
  window.addEventListener('appinstalled',function(){
    rememberInstalled();
    deferredPrompt=null;
    removeButton();
  });
  setTimeout(function(){
    if(installedBefore())removeButton();
    else ensureButton();
  },900);
})();
