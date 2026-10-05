/* K-Talk video install prompt only - 2026-10-05 - 1150617
   Shows a small install card on public-video view only.
   Does not touch live rooms, gifts, chat, signaling, attendance or layouts. */
(function(){
  if(window.__ktVideoInstallPrompt20261005)return;
  window.__ktVideoInstallPrompt20261005=true;

  var deferredPrompt=null, shownAt=0, hideTimer=0;
  var APP_URL='https://k-talk-live-final.vercel.app';

  window.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault();deferredPrompt=e;}catch(err){}
  });

  function inPublicVideo(){
    try{
      if(document.querySelector('#screen .kt-remote-live,#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'))return false;
      return !!document.querySelector('#screen .kt-public-video,#screen #ktPublicFirstPaintVideo,#screen video');
    }catch(e){return false;}
  }

  function installed(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone===true ||
             localStorage.getItem('kt_install_prompt_done_20261005')==='1';
    }catch(e){return false;}
  }

  function removeCard(){
    try{
      var x=document.getElementById('ktVideoInstallPrompt20261005');
      if(x)x.remove();
    }catch(e){}
  }

  function installNow(){
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(r){
          if(r&&r.outcome==='accepted'){
            try{localStorage.setItem('kt_install_prompt_done_20261005','1');}catch(e){}
            removeCard();
          }
          deferredPrompt=null;
        }).catch(function(){});
        return;
      }catch(e){}
    }
    alert('브라우저 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 눌러주세요.');
  }
  window.ktVideoInstallNow20261005=installNow;

  function show(){
    if(!inPublicVideo()||installed())return;
    var now=Date.now();
    if(now-shownAt<2500)return;
    shownAt=now;
    removeCard();

    var d=document.createElement('div');
    d.id='ktVideoInstallPrompt20261005';
    d.style.cssText='position:fixed;left:50%;top:78px;transform:translateX(-50%);z-index:2147482000;width:min(92vw,360px);display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:16px;background:rgba(8,8,12,.92);border:1px solid rgba(255,255,255,.22);box-shadow:0 8px 28px rgba(0,0,0,.45);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    d.innerHTML=
      '<img src="/ktalk-icon-192.png?v=20260918-install7" alt="K-Talk" style="width:42px;height:42px;border-radius:11px;flex:0 0 42px">'+
      '<div style="min-width:0;flex:1"><b style="display:block;font-size:14px">K-Talk LIVE 설치</b>'+
      '<span style="display:block;font-size:10px;opacity:.78;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+APP_URL+'</span></div>'+
      '<button type="button" onclick="ktVideoInstallNow20261005()" style="border:0;border-radius:12px;padding:9px 12px;background:linear-gradient(135deg,#6a5cff,#ff3db8);color:#fff;font-weight:900;font-size:12px">설치</button>'+
      '<button type="button" aria-label="닫기" style="border:0;background:transparent;color:#fff;font-size:18px;padding:3px 2px" onclick="this.parentNode.remove()">×</button>';
    document.body.appendChild(d);

    clearTimeout(hideTimer);
    hideTimer=setTimeout(removeCard,12000);
  }

  window.addEventListener('appinstalled',function(){
    try{localStorage.setItem('kt_install_prompt_done_20261005','1');}catch(e){}
    removeCard();
  });

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktInstallPromptPaintTimer20261005);
      window.__ktInstallPromptPaintTimer20261005=setTimeout(show,220);
    }).observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  }catch(e){}

  [400,1000,2200].forEach(function(ms){setTimeout(show,ms);});
})();