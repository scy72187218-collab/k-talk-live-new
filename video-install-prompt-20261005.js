/* K-Talk video install prompt v2 - 2026-10-05 - 1150617
   Install prompt only. No live room, gift, chat, attendance, layout or signaling changes. */
(function(){
  if(window.__ktVideoInstallPromptV220261005)return;
  window.__ktVideoInstallPromptV220261005=true;

  var deferredPrompt=null;
  var shown=false;
  var APP_URL='https://k-talk-live-final.vercel.app';

  try{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js?v=20261005-install-v2').catch(function(){});
    }
  }catch(e){}

  function removeCard(){
    try{
      var el=document.getElementById('ktVideoInstallPromptV220261005');
      if(el)el.remove();
    }catch(e){}
  }

  function hideForSession(){
    try{sessionStorage.setItem('kt_install_prompt_closed_20261005','1');}catch(e){}
    removeCard();
  }
  window.ktCloseVideoInstallPromptV220261005=hideForSession;

  function isInstalled(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches ||
             window.navigator.standalone===true;
    }catch(e){return false;}
  }

  function inPublicVideo(){
    try{
      if(document.querySelector('#screen .kt-remote-live,#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room'))return false;
      return !!document.querySelector('#screen .kt-public-video,#screen #ktPublicFirstPaintVideo');
    }catch(e){return false;}
  }

  function closed(){
    try{return sessionStorage.getItem('kt_install_prompt_closed_20261005')==='1';}catch(e){return false;}
  }

  function inAppBrowser(){
    var ua='';
    try{ua=navigator.userAgent||'';}catch(e){}
    return /KAKAOTALK|Instagram|FBAN|FBAV|Line\//i.test(ua);
  }

  function installNow(){
    if(deferredPrompt){
      try{
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(res){
          if(res&&res.outcome==='accepted')hideForSession();
          deferredPrompt=null;
        }).catch(function(){});
        return;
      }catch(e){}
    }
    if(inAppBrowser()){
      alert('이 화면에서는 바로 설치가 안 될 수 있습니다. 오른쪽 아래 ⋮ 메뉴에서 외부 브라우저로 열기 후 홈 화면에 추가를 눌러주세요.');
    }else{
      alert('브라우저 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 눌러주세요.');
    }
  }
  window.ktVideoInstallNowV220261005=installNow;

  function show(){
    if(shown||closed()||isInstalled()||!inPublicVideo())return;
    shown=true;

    var d=document.createElement('div');
    d.id='ktVideoInstallPromptV220261005';
    d.style.cssText='position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:2147482000;width:min(92vw,350px);display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:15px;background:rgba(8,8,12,.94);border:1px solid rgba(255,255,255,.24);box-shadow:0 8px 26px rgba(0,0,0,.46);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    d.innerHTML=
      '<img src="/ktalk-icon-192.png?v=20260918-install7" alt="K-Talk" style="width:40px;height:40px;border-radius:10px;flex:0 0 40px">'+
      '<div style="min-width:0;flex:1"><b style="display:block;font-size:14px">K-Talk LIVE 설치</b>'+
      '<span style="display:block;font-size:10px;opacity:.78;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+APP_URL+'</span></div>'+
      '<button type="button" onclick="ktVideoInstallNowV220261005()" style="border:0;border-radius:11px;padding:8px 11px;background:linear-gradient(135deg,#6a5cff,#ff3db8);color:#fff;font-weight:900;font-size:12px">설치</button>'+
      '<button type="button" aria-label="닫기" onclick="ktCloseVideoInstallPromptV220261005()" style="border:0;background:transparent;color:#fff;font-size:19px;padding:3px 2px">×</button>';
    document.body.appendChild(d);
  }

  window.addEventListener('beforeinstallprompt',function(e){
    try{
      e.preventDefault();
      deferredPrompt=e;
      if(!shown&&!closed())setTimeout(show,50);
    }catch(err){}
  });

  window.addEventListener('appinstalled',function(){
    hideForSession();
  });

  [700,1500,2800].forEach(function(ms){setTimeout(show,ms);});
})();