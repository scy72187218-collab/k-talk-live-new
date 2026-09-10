/* K-Talk 네트워크 표시: 동영상/방송 화면에서 우측 구석 장미 위에 작은 안테나 표시. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktWifiStatusIndicatorInstalled)return;
  window.__ktWifiStatusIndicatorInstalled=true;

  function ensure(){
    var el=document.getElementById('ktWifiStatusIndicator');
    if(!el){
      el=document.createElement('div');
      el.id='ktWifiStatusIndicator';
      el.setAttribute('aria-label','네트워크 연결 상태');
      el.innerHTML='<span class="kt-wifi-arc a1"></span><span class="kt-wifi-arc a2"></span><span class="kt-wifi-dot"></span>';
      document.body.appendChild(el);
    }
    return el;
  }

  function style(){
    if(document.getElementById('ktWifiStatusIndicatorStyle'))return;
    var s=document.createElement('style');
    s.id='ktWifiStatusIndicatorStyle';
    s.textContent=''
      +'#ktWifiStatusIndicator{position:fixed!important;right:10px!important;bottom:155px!important;width:30px!important;height:26px!important;z-index:2147483000!important;pointer-events:none!important;filter:drop-shadow(0 1px 2px #000);opacity:.95!important}'
      +'#ktWifiStatusIndicator .kt-wifi-arc{position:absolute!important;left:50%!important;transform:translateX(-50%) rotate(45deg)!important;border-style:solid!important;border-color:#fff!important;border-left-color:transparent!important;border-top-color:transparent!important;border-radius:50%!important}'
      +'#ktWifiStatusIndicator .a1{width:24px!important;height:24px!important;top:-4px!important;border-width:3px!important}'
      +'#ktWifiStatusIndicator .a2{width:14px!important;height:14px!important;top:5px!important;border-width:3px!important}'
      +'#ktWifiStatusIndicator .kt-wifi-dot{position:absolute!important;left:50%!important;bottom:1px!important;width:5px!important;height:5px!important;transform:translateX(-50%)!important;border-radius:50%!important;background:#fff!important}'
      +'#ktWifiStatusIndicator.offline .kt-wifi-arc,#ktWifiStatusIndicator.offline .kt-wifi-dot{opacity:.28!important}'
      +'#ktWifiStatusIndicator.offline:after{content:"×"!important;position:absolute!important;right:-2px!important;top:-7px!important;color:#fff!important;font-size:18px!important;font-weight:950!important}'
      +'@media(min-width:700px){#ktWifiStatusIndicator{right:14px!important;bottom:170px!important;width:34px!important;height:29px!important}}';
    document.head.appendChild(s);
  }

  function update(){
    style();
    var el=ensure();
    el.classList.toggle('offline',navigator.onLine===false);
    el.title=navigator.onLine===false?'인터넷 연결 없음':'인터넷 연결됨';
  }

  update();
  window.addEventListener('online',update);
  window.addEventListener('offline',update);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(update,50);});
  window.addEventListener('pageshow',function(){setTimeout(update,50);});

  if(window.MutationObserver){
    var obs=new MutationObserver(function(){
      var el=document.getElementById('ktWifiStatusIndicator');
      if(!el)update();
    });
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }
})();
