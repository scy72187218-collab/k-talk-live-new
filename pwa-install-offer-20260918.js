/* K-Talk PWA 설치 안내 전용.
   사이트 방문자가 설치/나중에를 직접 선택할 수 있게 함.
   방송/카메라/채팅/방 기능은 변경하지 않음. */
(function(){
  if(window.__ktPwaInstallOffer20260918)return;
  window.__ktPwaInstallOffer20260918=true;

  var deferredPrompt=null;
  var offerShown=false;

  function isStandalone(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone===true;
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktPwaInstallOfferStyle'))return;
    var s=document.createElement('style');
    s.id='ktPwaInstallOfferStyle';
    s.textContent=''
      +'.kt-pwa-install-offer{position:fixed;left:12px;right:12px;bottom:18px;z-index:1000000;max-width:520px;margin:0 auto;padding:14px;border-radius:18px;background:rgba(8,8,14,.97);border:1px solid rgba(99,174,255,.55);box-shadow:0 10px 35px rgba(0,0,0,.55);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'.kt-pwa-install-top{display:flex;align-items:center;gap:11px}.kt-pwa-install-icon{width:46px;height:46px;flex:0 0 46px;border-radius:13px;overflow:hidden;background:#000;border:1px solid #ffffff24}.kt-pwa-install-icon img{width:100%;height:100%;object-fit:cover}'
      +'.kt-pwa-install-copy{min-width:0;flex:1}.kt-pwa-install-copy b{display:block;font-size:15px;color:#fff}.kt-pwa-install-copy small{display:block;margin-top:4px;color:#cfd8e3;font-size:11px;line-height:1.4}'
      +'.kt-pwa-install-offer{pointer-events:auto!important;touch-action:manipulation!important}'
      +'.kt-pwa-install-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;position:relative;z-index:2;pointer-events:auto!important}.kt-pwa-install-actions button{height:42px;border-radius:12px;font-size:13px;font-weight:950;touch-action:manipulation!important;pointer-events:auto!important;position:relative;z-index:3;-webkit-tap-highlight-color:transparent!important}'
      +'.kt-pwa-install-later{border:1px solid #ffffff25;background:#16161d;color:#ddd}.kt-pwa-install-go{border:0;background:linear-gradient(135deg,#2388ff,#754cff);color:#fff}';
    document.head.appendChild(s);
  }

  function removeOffer(){
    var el=document.getElementById('ktPwaInstallOffer');
    if(el&&el.parentNode)el.parentNode.removeChild(el);
  }

  function showOffer(){
    if(isStandalone()||offerShown||document.getElementById('ktPwaInstallOffer'))return;
    ensureStyle();
    offerShown=true;
    var box=document.createElement('div');
    box.id='ktPwaInstallOffer';
    box.className='kt-pwa-install-offer';
    box.innerHTML=''
      +'<div class="kt-pwa-install-top">'
      +'<span class="kt-pwa-install-icon"><img src="/ktalk-icon.svg?v=20260918-install7stall4" alt="K-Talk"></span>'
      +'<span class="kt-pwa-install-copy"><b>K-Talk 아이콘을 설치할까요?</b><small>휴대폰 홈 화면에서 바로 K-Talk을 열 수 있습니다.</small></span>'
      +'</div>'
      +'<div class="kt-pwa-install-actions">'
      +'<button class="kt-pwa-install-later" type="button" onclick="ktPwaInstallLater()">나중에</button>'
      +'<button class="kt-pwa-install-go" type="button" onclick="ktPwaInstallNow()">설치하기</button>'
      +'</div>';
    document.body.appendChild(box);
  }

  window.ktPwaInstallLater=function(){
    removeOffer();
    return false;
  };

  var lastInstallTapAt=0;
  function directInstallTap(e){
    var t=e&&e.target;
    if(!t||!t.closest)return;
    var btn=t.closest('.kt-pwa-install-later,.kt-pwa-install-go');
    if(!btn)return;
    var now=Date.now();
    if(now-lastInstallTapAt<500){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
      return;
    }
    lastInstallTapAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    if(btn.classList.contains('kt-pwa-install-later')){
      window.ktPwaInstallLater();
      return;
    }
    window.ktPwaInstallNow();
  }

  function showInstallFallback(){
    try{
      var old=document.getElementById('ktPwaInstallFallback');
      if(old)old.remove();

      var ua=navigator.userAgent||'';
      var isAndroid=/android/i.test(ua);
      var isNaver=/naver|whale/i.test(ua);

      var box=document.createElement('div');
      box.id='ktPwaInstallFallback';
      box.style.cssText='position:fixed;left:12px;right:12px;bottom:20px;z-index:2147483647;max-width:520px;margin:auto;padding:14px;border-radius:18px;background:#0b0c12;color:#fff;border:1px solid #5b8cff;box-shadow:0 10px 35px #000b;font-family:system-ui';
      box.innerHTML=''
        +'<b style="display:block;font-size:16px">K-Talk 설치</b>'
        +'<span style="display:block;margin-top:6px;font-size:11px;line-height:1.5;color:#d7d9e0">'+
          (isNaver?'현재 브라우저에서는 설치 버튼을 직접 띄우지 못할 수 있습니다. 아래에서 Chrome으로 열면 설치할 수 있습니다.':'이 브라우저에서 직접 설치 창을 지원하지 않습니다. 브라우저 메뉴의 “홈 화면에 추가”를 이용해 주세요.')+
        '</span>'
        +(isAndroid?'<button id="ktPwaOpenChrome" type="button" style="width:100%;height:44px;margin-top:11px;border:0;border-radius:12px;background:linear-gradient(135deg,#2388ff,#754cff);color:#fff;font-weight:950">Chrome에서 열기</button>':'')
        +'<button id="ktPwaFallbackClose" type="button" style="width:100%;height:40px;margin-top:7px;border:1px solid #ffffff25;border-radius:12px;background:#171820;color:#fff;font-weight:900">닫기</button>';
      document.body.appendChild(box);

      var close=box.querySelector('#ktPwaFallbackClose');
      if(close)close.onclick=function(){box.remove();};

      var chrome=box.querySelector('#ktPwaOpenChrome');
      if(chrome)chrome.onclick=function(){
        try{
          var u=location.href.replace(/^https?:\/\//,'');
          location.href='intent://'+u+'#Intent;scheme=https;package=com.android.chrome;end';
        }catch(e){}
      };
    }catch(e){}
  }

  window.ktPwaInstallNow=async function(){
    if(isStandalone()){removeOffer();return false;}
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt=null;
        removeOffer();
        return false;
      }catch(e){}
    }

    /* Unsupported in-app browsers must never look like a dead button. */
    removeOffer();
    showInstallFallback();
    return false;
  };

  /* Some Android/Naver in-app browsers swallow the synthetic click behind
     full-screen video overlays. Handle the first physical touch in capture phase. */
  window.addEventListener('pointerdown',directInstallTap,true);
  if(!window.PointerEvent)window.addEventListener('touchstart',directInstallTap,true);

  window.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault();}catch(err){}
    deferredPrompt=e;
    setTimeout(showOffer,350);
  });

  window.addEventListener('appinstalled',function(){
    deferredPrompt=null;
    removeOffer();
  });

  try{
    if('serviceWorker' in navigator){
      window.addEventListener('load',function(){
        navigator.serviceWorker.register('/sw.js?v=20260918-install7stall4').catch(function(){});
      });
    }
  }catch(e){}

  /* 설치된 앱으로 실행한 경우가 아니면 브라우저 종류와 상관없이
     K-Talk 자체 설치 안내 카드를 항상 한 번 표시한다. */
  setTimeout(function(){
    if(isStandalone()||offerShown)return;
    showOffer();
  },800);

  /* 동영상 홈으로 들어왔는데 아직 안내가 안 보인 경우 한 번 더 확인 */
  document.addEventListener('click',function(){
    if(isStandalone()||offerShown)return;
    if(document.querySelector('.video-home,#homeVideo,.vh-video,.vh-actions')){
      setTimeout(function(){
        if(!isStandalone()&&!offerShown)showOffer();
      },450);
    }
  },true);
})();