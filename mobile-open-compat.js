/* K-Talk mobile opening compatibility guard.
   Only repairs the first screen when a phone/tablet renders blank or zero-height. */
(function(){
  if(window.__ktMobileOpenCompatInstalled)return;
  window.__ktMobileOpenCompatInstalled=true;

  var freshTried=false;
  var retryTimer=null;

  function creatorIsOpen(){
    var c=document.getElementById('creator');
    return !!(c&&c.classList&&c.classList.contains('show'));
  }

  function liveIsOpen(){
    return !!(document.getElementById('ktLiveVideo')||document.getElementById('ktSept2Live')||document.getElementById('ktRemoteLive')||document.querySelector('.ktg13-room'));
  }

  function screenIsBroken(){
    var s=document.getElementById('screen');
    var r,cs,html;
    if(!s)return true;
    html=String(s.innerHTML||'').replace(/\s+/g,'');
    if(!html)return true;
    try{
      r=s.getBoundingClientRect();
      if(r.width<20||r.height<80)return true;
    }catch(e){}
    try{
      cs=window.getComputedStyle?window.getComputedStyle(s):null;
      if(cs&&(cs.display==='none'||cs.visibility==='hidden'))return true;
    }catch(e){}
    return false;
  }

  function forceScreenBox(){
    var s=document.getElementById('screen');
    var h=window.innerHeight||document.documentElement.clientHeight||640;
    if(!s)return;
    try{
      s.style.setProperty('display','block','important');
      s.style.setProperty('visibility','visible','important');
      s.style.setProperty('width','100%','important');
      if(s.getBoundingClientRect().height<80){
        s.style.setProperty('min-height',Math.max(420,h-68)+'px','important');
      }
    }catch(e){}
  }

  function freshReload(){
    var base=location.pathname||'/';
    var q='ktfresh=20260910a';
    try{
      if(location.search&&location.search.indexOf('ktfresh=20260910a')>-1){
        location.reload();
      }else{
        location.replace(base+'?'+q);
      }
    }catch(e){
      try{location.reload();}catch(_e){}
    }
  }
  window.ktCompatFreshReload=freshReload;

  function showFallback(){
    var s=document.getElementById('screen');
    if(!s||creatorIsOpen()||liveIsOpen())return;
    forceScreenBox();
    s.innerHTML='<section style="min-height:520px;height:100%;background:#050309;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:Arial,sans-serif"><div><b style="display:block;font-size:24px;margin-bottom:10px">♛ K-Talk LIVE</b><span style="display:block;font-size:14px;line-height:1.5;color:#ddd">화면 연결을 다시 잡고 있습니다.</span><button type="button" onclick="ktCompatFreshReload()" style="margin-top:16px;padding:12px 18px;border:0;border-radius:12px;background:#ff3b8d;color:#fff;font-size:15px;font-weight:900">다시 열기</button></div></section>';
  }

  function loadFreshApp(){
    if(freshTried)return;
    freshTried=true;
    try{
      var x=document.createElement('script');
      x.src='app.js?v=20260910-phonefresh1';
      x.async=false;
      x.onload=function(){setTimeout(tryRecoverHome,80);};
      x.onerror=function(){setTimeout(showFallback,80);};
      document.head.appendChild(x);
    }catch(e){showFallback();}
  }

  function tryRecoverHome(){
    if(creatorIsOpen()||liveIsOpen())return;
    if(!screenIsBroken())return;
    forceScreenBox();
    try{
      if(typeof window.home==='function'){
        window.home();
        setTimeout(function(){
          if(screenIsBroken())loadFreshApp();
        },280);
        return;
      }
    }catch(e){}
    loadFreshApp();
    clearTimeout(retryTimer);
    retryTimer=setTimeout(function(){
      if(screenIsBroken())showFallback();
    },1200);
  }

  function scheduleRecovery(){
    setTimeout(tryRecoverHome,120);
    setTimeout(tryRecoverHome,450);
    setTimeout(tryRecoverHome,1100);
    setTimeout(tryRecoverHome,2200);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',scheduleRecovery);
  }else{
    scheduleRecovery();
  }
  window.addEventListener('load',scheduleRecovery);
  window.addEventListener('pageshow',function(){setTimeout(tryRecoverHome,100);});
  window.addEventListener('online',function(){setTimeout(tryRecoverHome,100);});
  window.addEventListener('resize',function(){setTimeout(tryRecoverHome,100);});
  window.addEventListener('orientationchange',function(){setTimeout(tryRecoverHome,220);});
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(tryRecoverHome,120);
  });
})();
