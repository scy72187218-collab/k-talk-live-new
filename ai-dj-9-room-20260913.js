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
    link.href='/manifest.webmanifest?v=20260915-install2';
    document.head.appendChild(link);
  }

  function removeInstallBox(){
    var box=document.getElementById('ktPwaInstallBox');
    if(box&&box.parentNode)box.parentNode.removeChild(box);
  }

  function updateInstallBox(){
    var box=document.getElementById('ktPwaInstallBox');
    if(!box)return;
    var note=box.querySelector('[data-kt-install-note]');
    var btn=document.getElementById('ktPwaInstallBtn');
    if(deferredPrompt){
      if(note)note.textContent='설치를 누르면 홈 화면에 K-Talk 아이콘이 만들어집니다.';
      if(btn)btn.textContent='설치';
    }else{
      if(note)note.textContent='설치 버튼이 준비되면 한 번만 누르시면 됩니다.';
      if(btn)btn.textContent='설치 준비';
    }
  }

  function showInstallBox(){
    if(isInstalled()){removeInstallBox();return;}
    var existing=document.getElementById('ktPwaInstallBox');
    if(existing){updateInstallBox();return;}

    var box=document.createElement('div');
    box.id='ktPwaInstallBox';
    box.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;width:min(92vw,380px);display:flex;align-items:center;gap:10px;padding:10px 11px;border:1px solid rgba(255,92,207,.72);border-radius:17px;background:rgba(8,8,14,.96);box-shadow:0 8px 28px rgba(0,0,0,.55),0 0 16px rgba(255,76,196,.28);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    box.innerHTML='<img src="/ktalk-icon.svg" alt="K-Talk" style="width:42px;height:42px;border-radius:11px;flex:0 0 42px"><div style="min-width:0;flex:1"><b style="display:block;font-size:13px">K-Talk 아이콘 설치</b><span data-kt-install-note style="display:block;margin-top:2px;color:#ddd;font-size:10px">설치 버튼을 준비하고 있습니다.</span></div><button id="ktPwaInstallBtn" type="button" style="height:38px;padding:0 14px;border:0;border-radius:12px;background:linear-gradient(135deg,#ff3ca6,#7b55ff);color:#fff;font-weight:950">설치 준비</button>';
    document.body.appendChild(box);

    var btn=document.getElementById('ktPwaInstallBtn');
    if(btn)btn.addEventListener('click',async function(){
      if(isInstalled()){removeInstallBox();return;}
      if(!deferredPrompt){
        var note=box.querySelector('[data-kt-install-note]');
        if(note)note.textContent='브라우저 설치 기능을 준비 중입니다. 잠시 후 다시 눌러 주세요.';
        try{
          if('serviceWorker' in navigator){
            var reg=await navigator.serviceWorker.ready;
            if(reg&&reg.update)reg.update().catch(function(){});
          }
        }catch(e){}
        return;
      }
      try{
        deferredPrompt.prompt();
        var choice=await deferredPrompt.userChoice;
        if(choice&&choice.outcome==='accepted')removeInstallBox();
      }catch(e){}
      deferredPrompt=null;
      updateInstallBox();
    });
    updateInstallBox();
  }

  ensureManifest();

  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/sw.js?v=20260915-install2').then(function(){
        setTimeout(showInstallBox,250);
      }).catch(function(){
        setTimeout(showInstallBox,250);
      });
    },{once:true});
  }else{
    setTimeout(showInstallBox,500);
  }

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredPrompt=e;
    showInstallBox();
  });

  window.addEventListener('appinstalled',function(){
    deferredPrompt=null;
    removeInstallBox();
  });

  window.addEventListener('pageshow',function(){
    if(isInstalled())removeInstallBox();
    else setTimeout(showInstallBox,350);
  });

  setTimeout(showInstallBox,900);
})();

/* 2026-09-15 촬영/방송 준비 카메라에서 사람 크기만 조금 축소. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktCreatorCameraSlightlySmaller20260915)return;
  window.__ktCreatorCameraSlightlySmaller20260915=true;
  if(document.getElementById('ktCreatorCameraSlightlySmaller20260915'))return;
  var s=document.createElement('style');
  s.id='ktCreatorCameraSlightlySmaller20260915';
  s.textContent='#creator.creator.camera-on:not(.creator-review) video#camera{transform:scaleX(-1) scale(.92)!important;transform-origin:center center!important;}';
  document.head.appendChild(s);
})();
