/* K-Talk AI DJ 음악방 비활성화. 다른 방/기능은 변경하지 않음. */
(function(){
  window.__ktAiDj9Room20260913=true;
})();

/* K-Talk 홈화면 아이콘 설치 전용. 다른 화면/방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktPwaInstallOnly20260915)return;
  window.__ktPwaInstallOnly20260915=true;

  var deferredPrompt=null;

  function isInstalled(){
    try{
      return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||(navigator.standalone===true);
    }catch(e){return false;}
  }

  function ensureManifest(){
    if(document.querySelector('link[rel="manifest"]'))return;
    var link=document.createElement('link');
    link.rel='manifest';
    link.href='/manifest.webmanifest?v=20260915-install1';
    document.head.appendChild(link);
  }

  function removeInstallBox(){
    var box=document.getElementById('ktPwaInstallBox');
    if(box&&box.parentNode)box.parentNode.removeChild(box);
  }

  function showInstallBox(){
    if(isInstalled()||!deferredPrompt){removeInstallBox();return;}
    if(document.getElementById('ktPwaInstallBox'))return;

    var box=document.createElement('div');
    box.id='ktPwaInstallBox';
    box.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;width:min(92vw,380px);display:flex;align-items:center;gap:10px;padding:10px 11px;border:1px solid rgba(255,92,207,.72);border-radius:17px;background:rgba(8,8,14,.96);box-shadow:0 8px 28px rgba(0,0,0,.55),0 0 16px rgba(255,76,196,.28);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    box.innerHTML='<img src="/ktalk-icon.svg" alt="K-Talk" style="width:42px;height:42px;border-radius:11px;flex:0 0 42px"><div style="min-width:0;flex:1"><b style="display:block;font-size:13px">K-Talk 아이콘 설치</b><span style="display:block;margin-top:2px;color:#ddd;font-size:10px">한 번만 누르면 홈 화면에 설치됩니다.</span></div><button id="ktPwaInstallBtn" type="button" style="height:38px;padding:0 14px;border:0;border-radius:12px;background:linear-gradient(135deg,#ff3ca6,#7b55ff);color:#fff;font-weight:950">설치</button>';
    document.body.appendChild(box);

    var btn=document.getElementById('ktPwaInstallBtn');
    if(btn)btn.addEventListener('click',async function(){
      if(!deferredPrompt)return;
      try{
        deferredPrompt.prompt();
        var choice=await deferredPrompt.userChoice;
        if(choice&&choice.outcome==='accepted')removeInstallBox();
      }catch(e){}
      deferredPrompt=null;
    });
  }

  ensureManifest();

  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/sw.js').catch(function(){});
    },{once:true});
  }

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredPrompt=e;
    setTimeout(showInstallBox,180);
  });

  window.addEventListener('appinstalled',function(){
    deferredPrompt=null;
    removeInstallBox();
  });

  if(isInstalled())removeInstallBox();
})();
