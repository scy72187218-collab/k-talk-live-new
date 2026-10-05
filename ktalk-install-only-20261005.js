/* K-Talk install helper only - 1150617
   Does not touch live room, chat, gifts, signaling or layouts. */
(function(){
  if(window.__ktInstallOnly20261005)return;
  window.__ktInstallOnly20261005=true;

  var deferred=null, shown=false;

  function standalone(){
    try{
      return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
    }catch(e){return false;}
  }

  function inApp(){
    var ua='';
    try{ua=navigator.userAgent||'';}catch(e){}
    return /KAKAOTALK|Instagram|FBAN|FBAV|Line\//i.test(ua);
  }

  function closeBox(){
    var x=document.getElementById('ktInstallOnlyBox20261005');
    if(x)x.remove();
    try{sessionStorage.setItem('kt_install_box_closed_20261005','1');}catch(e){}
  }
  window.ktCloseInstallOnly20261005=closeBox;

  function installNow(){
    if(deferred){
      try{
        deferred.prompt();
        deferred.userChoice.then(function(r){
          if(r&&r.outcome==='accepted')closeBox();
          deferred=null;
        }).catch(function(){});
        return;
      }catch(e){}
    }
    if(inApp()){
      alert('오른쪽 아래 ⋮ 메뉴에서 다른 브라우저로 열기를 누른 뒤, 홈 화면에 추가 또는 앱 설치를 눌러주세요.');
    }else{
      alert('브라우저 메뉴(⋮)에서 홈 화면에 추가 또는 앱 설치를 눌러주세요.');
    }
  }
  window.ktInstallNow20261005=installNow;

  function show(){
    if(shown||standalone())return;
    try{if(sessionStorage.getItem('kt_install_box_closed_20261005')==='1')return;}catch(e){}
    shown=true;
    var d=document.createElement('div');
    d.id='ktInstallOnlyBox20261005';
    d.style.cssText='position:fixed;left:50%;top:78px;transform:translateX(-50%);z-index:2147483000;width:min(92vw,360px);display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:16px;background:rgba(8,8,12,.95);border:1px solid rgba(255,255,255,.22);box-shadow:0 8px 28px rgba(0,0,0,.45);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    d.innerHTML=
      '<img src="/ktalk-icon-192.png?v=20261005-newphone1150617" style="width:42px;height:42px;border-radius:11px">'+
      '<div style="min-width:0;flex:1"><b style="display:block;font-size:14px">K-Talk 설치</b><span style="display:block;font-size:10px;opacity:.78">홈 화면에 K-Talk 아이콘 설치</span></div>'+
      '<button onclick="ktInstallNow20261005()" style="border:0;border-radius:12px;padding:9px 12px;background:linear-gradient(135deg,#6a5cff,#ff3db8);color:#fff;font-weight:900;font-size:12px">설치</button>'+
      '<button onclick="ktCloseInstallOnly20261005()" style="border:0;background:transparent;color:#fff;font-size:18px">×</button>';
    document.body.appendChild(d);
  }

  window.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault();deferred=e;show();}catch(err){}
  });

  window.addEventListener('appinstalled',function(){closeBox();});

  // If browser doesn't fire install event, still show one clear install entry.
  setTimeout(show,1200);
})();