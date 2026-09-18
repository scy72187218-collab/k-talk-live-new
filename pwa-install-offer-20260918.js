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
      +'.kt-pwa-install-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.kt-pwa-install-actions button{height:42px;border-radius:12px;font-size:13px;font-weight:950;touch-action:manipulation}'
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
      +'<span class="kt-pwa-install-icon"><img src="/ktalk-icon-192.png?v=20260918-install4" alt="K-Talk"></span>'
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

  window.ktPwaInstallNow=async function(){
    if(isStandalone()){removeOffer();return false;}
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      }catch(e){}
      deferredPrompt=null;
      removeOffer();
      return false;
    }

    var ua=navigator.userAgent||'';
    if(/iphone|ipad|ipod/i.test(ua)){
      try{alert('Safari 아래의 공유 버튼을 누른 뒤 “홈 화면에 추가”를 선택해 주세요.');}catch(e){}
    }else{
      try{alert('브라우저 메뉴에서 “앱 설치” 또는 “홈 화면에 추가”를 선택해 주세요.');}catch(e){}
    }
    removeOffer();
    return false;
  };

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
        navigator.serviceWorker.register('/sw.js?v=20260918-install4').catch(function(){});
      });
    }
  }catch(e){}

  /* 브라우저가 beforeinstallprompt를 주지 않는 환경(네이버/일부 Android/iOS)에도
     K-Talk 자체 설치 안내 카드를 표시한다. 실제 설치는 사용자가 설치하기를 눌러 진행한다. */
  setTimeout(function(){
    if(isStandalone()||offerShown)return;
    var ua=navigator.userAgent||'';
    if(/android|iphone|ipad|ipod|naver/i.test(ua))showOffer();
  },1500);

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