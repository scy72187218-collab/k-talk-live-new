/* K-Talk: 첫 페이지 시작 안정화 + 홈 화면 아이콘 메타/진입 안내만 담당. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktFirstPageIconBootstrapInstalled)return;
  window.__ktFirstPageIconBootstrapInstalled=true;

  function ensureLink(rel,href,id){
    try{
      var old=id?document.getElementById(id):null;
      if(old)return old;
      var link=document.createElement('link');
      if(id)link.id=id;
      link.rel=rel;
      link.href=href;
      document.head.appendChild(link);
      return link;
    }catch(e){return null;}
  }

  ensureLink('manifest','/manifest.webmanifest?v=20260910-icon2','ktManifestLink');
  ensureLink('icon','/ktalk-icon.svg?v=20260910-icon2','ktShortcutIcon');
  ensureLink('apple-touch-icon','/ktalk-icon.svg?v=20260910-icon2','ktAppleTouchIcon');

  function firstPageReady(){
    try{
      var screen=document.getElementById('screen');
      if(!screen)return true;
      if(screen.children&&screen.children.length>0)return true;
      return !!String(screen.innerHTML||'').trim();
    }catch(e){return true;}
  }

  function openFirstPageIfBlank(){
    if(firstPageReady())return;
    try{
      if(typeof window.home==='function')window.home();
    }catch(e){}
  }

  function standalone(){
    try{return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}catch(e){return false;}
  }

  var installEvent=null;
  window.addEventListener('beforeinstallprompt',function(e){
    try{e.preventDefault();installEvent=e;}catch(err){}
  });

  function removeOffer(){
    var old=document.getElementById('ktFirstJoinIconOffer');
    if(old)old.remove();
  }

  function showEntryIconOffer(){
    if(document.getElementById('ktFirstJoinIconOffer'))return;
    var installed=standalone();
    var box=document.createElement('div');
    box.id='ktFirstJoinIconOffer';
    box.innerHTML='<img src="/ktalk-icon.svg?v=20260910-icon2" alt="K-Talk"><div><b>K-Talk 새 아이콘</b><span>'+(installed?'새 아이콘이 적용된 K-Talk입니다':'홈 화면에 바로 추가하세요')+'</span></div><button id="ktAddHomeIcon" type="button">'+(installed?'확인':'아이콘 추가')+'</button><button id="ktIconLater" type="button" aria-label="나중에">×</button>';
    box.style.cssText='position:fixed;left:10px;right:10px;bottom:18px;z-index:2147483646;display:grid;grid-template-columns:48px 1fr auto 34px;align-items:center;gap:9px;padding:10px;border-radius:18px;background:rgba(10,10,16,.96);border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 30px rgba(0,0,0,.45);color:#fff;font-family:system-ui,-apple-system,Noto Sans KR,sans-serif';
    var img=box.querySelector('img');if(img)img.style.cssText='width:48px;height:48px;border-radius:13px;display:block';
    var text=box.querySelector('div');if(text)text.style.cssText='min-width:0';
    var b=box.querySelector('b');if(b)b.style.cssText='display:block;font-size:14px;font-weight:950';
    var span=box.querySelector('span');if(span)span.style.cssText='display:block;margin-top:2px;font-size:11px;color:#ddd';
    var add=box.querySelector('#ktAddHomeIcon');if(add)add.style.cssText='height:38px;padding:0 12px;border:0;border-radius:12px;background:linear-gradient(135deg,#ff3c91,#8b5cff);color:#fff;font-size:12px;font-weight:950;white-space:nowrap';
    var later=box.querySelector('#ktIconLater');if(later)later.style.cssText='width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;font-size:22px';
    document.body.appendChild(box);

    if(add)add.onclick=async function(){
      if(installed){removeOffer();return;}
      if(installEvent){
        try{
          installEvent.prompt();
          var choice=await installEvent.userChoice;
          if(choice&&choice.outcome==='accepted')removeOffer();
          installEvent=null;
          return;
        }catch(e){}
      }
      alert('브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 눌러 주세요. K-Talk 아이콘으로 설치됩니다.');
    };
    if(later)later.onclick=removeOffer;
  }

  window.addEventListener('appinstalled',removeOffer);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){
      setTimeout(openFirstPageIfBlank,120);
      setTimeout(showEntryIconOffer,120);
      setTimeout(openFirstPageIfBlank,700);
    },{once:true});
  }else{
    setTimeout(openFirstPageIfBlank,120);
    setTimeout(showEntryIconOffer,120);
    setTimeout(openFirstPageIfBlank,700);
  }
})();
