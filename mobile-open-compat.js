/* K-Talk mobile opening compatibility guard.
   Only runs when the main screen failed to render; normal phones are left untouched. */
(function(){
  if(window.__ktMobileOpenCompatInstalled)return;
  window.__ktMobileOpenCompatInstalled=true;

  function creatorIsOpen(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList&&c.classList.contains('show'));
  }

  function screenLooksEmpty(){
    var s=document.getElementById('screen');
    if(!s)return true;
    if(s.children&&s.children.length)return false;
    return !String(s.innerHTML||'').replace(/\s+/g,'');
  }

  function tryRecoverHome(){
    if(creatorIsOpen()||!screenLooksEmpty())return;
    try{
      if(typeof window.home==='function'){
        window.home();
        return;
      }
    }catch(e){}

    var s=document.getElementById('screen');
    if(!s)return;
    s.innerHTML='<section style="min-height:100vh;background:#050309;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:system-ui,-apple-system,sans-serif"><div><b style="display:block;font-size:24px;margin-bottom:10px">♛ K-Talk LIVE</b><span style="display:block;font-size:14px;line-height:1.5;color:#ddd">화면을 다시 불러오는 중입니다.</span><button type="button" onclick="location.reload()" style="margin-top:16px;padding:12px 18px;border:0;border-radius:12px;background:#ff3b8d;color:#fff;font-weight:900">다시 열기</button></div></section>';
  }

  function scheduleRecovery(){
    setTimeout(tryRecoverHome,250);
    setTimeout(tryRecoverHome,900);
    setTimeout(tryRecoverHome,1800);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',scheduleRecovery);
  }else{
    scheduleRecovery();
  }
  window.addEventListener('load',scheduleRecovery);
  window.addEventListener('pageshow',function(){setTimeout(tryRecoverHome,180);});
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(tryRecoverHome,220);
  });
})();
