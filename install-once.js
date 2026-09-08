/* K-Talk 첫 방문 설치 안내: 한 번만 표시하고 이후에는 다시 띄우지 않는다. */
(function(){
  if(window.__ktInstallOnceInstalled)return;
  window.__ktInstallOnceInstalled=true;

  var SEEN_KEY='kt_install_offer_seen_v1';
  var INSTALLED_KEY='kt_install_completed_v1';
  var deferredPrompt=null;

  function isStandalone(){
    try{
      return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
    }catch(e){return false;}
  }

  function alreadySeen(){
    try{return localStorage.getItem(SEEN_KEY)==='1'||localStorage.getItem(INSTALLED_KEY)==='1';}catch(e){return false;}
  }

  function markSeen(){try{localStorage.setItem(SEEN_KEY,'1');}catch(e){}}
  function markInstalled(){
    try{localStorage.setItem(INSTALLED_KEY,'1');localStorage.setItem(SEEN_KEY,'1');}catch(e){}
  }

  function removeOffer(){
    var el=document.getElementById('ktInstallOnceOverlay');
    if(el)el.remove();
  }

  function ensureManifestAndSW(){
    try{
      if(!document.querySelector('link[rel="manifest"]')){
        var link=document.createElement('link');
        link.rel='manifest';
        link.href='/manifest.webmanifest';
        document.head.appendChild(link);
      }
    }catch(e){}
    try{
      if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){});}
    }catch(e){}
  }

  function showFallback(){
    alert('이 브라우저에서 바로 설치창이 열리지 않으면 브라우저 메뉴에서 “홈 화면에 추가” 또는 “앱 설치”를 눌러 주세요.');
  }

  async function installNow(){
    markSeen();
    removeOffer();
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        var choice=await deferredPrompt.userChoice;
        if(choice&&choice.outcome==='accepted')markInstalled();
      }catch(e){showFallback();}
      deferredPrompt=null;
      return;
    }
    showFallback();
  }

  function showOffer(){
    if(isStandalone()||alreadySeen()||document.getElementById('ktInstallOnceOverlay'))return;
    markSeen();

    var style=document.createElement('style');
    style.id='ktInstallOnceStyle';
    style.textContent=''
      +'#ktInstallOnceOverlay{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.58);font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'#ktInstallOnceCard{width:min(92vw,360px);border:1px solid rgba(255,255,255,.16);border-radius:24px;padding:22px 18px 17px;background:linear-gradient(160deg,#17131f,#08090e 72%);color:#fff;box-shadow:0 20px 60px #000,0 0 28px rgba(255,61,171,.22);text-align:center}'
      +'#ktInstallOnceIcon{width:72px;height:72px;margin:0 auto 10px;border-radius:20px;display:grid;place-items:center;background:#0c0b12;border:1px solid rgba(255,255,255,.15);box-shadow:0 0 18px rgba(255,73,194,.28);overflow:hidden}'
      +'#ktInstallOnceIcon img{width:58px;height:58px;object-fit:contain}'
      +'#ktInstallOnceCard h3{margin:5px 0 7px;font-size:22px;font-weight:950}'
      +'#ktInstallOnceCard p{margin:0 0 16px;color:#ddd;font-size:13px;line-height:1.45;font-weight:700}'
      +'#ktInstallOnceInstall{width:100%;height:48px;border:0;border-radius:15px;background:linear-gradient(135deg,#ff3f9d,#8f59ff);color:#fff;font-size:17px;font-weight:950;box-shadow:0 9px 22px rgba(255,61,157,.23)}'
      +'#ktInstallOnceLater{margin-top:8px;width:100%;height:38px;border:0;background:transparent;color:#aaa;font-size:13px;font-weight:800}';
    document.head.appendChild(style);

    var wrap=document.createElement('div');
    wrap.id='ktInstallOnceOverlay';
    wrap.innerHTML='<div id="ktInstallOnceCard" role="dialog" aria-modal="true" aria-label="K-Talk 설치 안내">'
      +'<div id="ktInstallOnceIcon"><img src="/ktalk-icon.svg" alt="K-Talk"></div>'
      +'<h3>K-Talk 설치</h3>'
      +'<p>처음 오셨다면 휴대폰에 설치해 두면 다음부터 아이콘으로 바로 들어올 수 있습니다.</p>'
      +'<button id="ktInstallOnceInstall" type="button">설치</button>'
      +'<button id="ktInstallOnceLater" type="button">지금은 닫기</button>'
      +'</div>';
    document.body.appendChild(wrap);

    document.getElementById('ktInstallOnceInstall').addEventListener('click',installNow);
    document.getElementById('ktInstallOnceLater').addEventListener('click',function(){markSeen();removeOffer();});
  }

  window.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault();}catch(err){}
    deferredPrompt=e;
  });

  window.addEventListener('appinstalled',function(){markInstalled();removeOffer();});

  ensureManifestAndSW();
  if(isStandalone()){markInstalled();return;}
  if(!alreadySeen()){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(showOffer,700);},{once:true});
    else setTimeout(showOffer,700);
  }
})();
