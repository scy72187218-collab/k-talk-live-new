/* K-Talk: 첫 페이지 시작 안정화 + 홈 화면 아이콘 메타 연결만 담당. 다른 기능은 건드리지 않음. */
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

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){
      setTimeout(openFirstPageIfBlank,120);
      setTimeout(openFirstPageIfBlank,700);
    },{once:true});
  }else{
    setTimeout(openFirstPageIfBlank,120);
    setTimeout(openFirstPageIfBlank,700);
  }
})();
