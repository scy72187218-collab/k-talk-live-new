/* K-Talk 수익률 본인 화면 전용 — 5555
   방송자 본인 화면에서는 유지하고, 다른 사람이 시청하는 화면에서는 숨김.
   다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktEarningsOwnerOnly5555)return;
  window.__ktEarningsOwnerOnly5555=true;

  function isRemoteViewer(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing')) return true;
      if(document.body && document.body.classList.contains('kt-remote-viewing')) return true;
      var hostId=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();
      if(hostId) return true;
      var ss=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();
      if(ss) return true;
    }catch(e){}
    return false;
  }

  function apply(){
    try{
      var hide=isRemoteViewer();
      var selectors=[
        '#myEarnHud',
        '#ktSubscriberEarnHud',
        '.ktsolo-earn',
        '.ktg13-earn',
        '.ktsubscriber-earn',
        '.ktsecret-earn-row'
      ];
      document.querySelectorAll(selectors.join(',')).forEach(function(el){
        if(hide){
          el.style.setProperty('display','none','important');
          el.setAttribute('data-kt-earn-hidden-remote','1');
        }else if(el.getAttribute('data-kt-earn-hidden-remote')==='1'){
          el.style.removeProperty('display');
          el.removeAttribute('data-kt-earn-hidden-remote');
        }
      });
    }catch(e){}
  }

  apply();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktEarnOwnerOnlyTimer);
      window.__ktEarnOwnerOnlyTimer=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();