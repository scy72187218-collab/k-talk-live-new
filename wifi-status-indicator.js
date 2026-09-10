/* K-Talk 네트워크 안내: 동영상/방송 중 연결 상태가 바뀔 때만 잠깐 표시. 연결되면 자동으로 사라지고 탭해도 닫힘. */
(function(){
  if(window.__ktWifiStatusIndicatorInstalled)return;
  window.__ktWifiStatusIndicatorInstalled=true;

  var hideTimer=null;

  function style(){
    if(document.getElementById('ktWifiStatusIndicatorStyle'))return;
    var s=document.createElement('style');
    s.id='ktWifiStatusIndicatorStyle';
    s.textContent=''
      +'#ktWifiStatusIndicator{position:fixed!important;left:50%!important;top:88px!important;transform:translate(-50%,-8px)!important;z-index:2147483000!important;display:flex!important;align-items:center!important;gap:7px!important;max-width:88vw!important;padding:7px 11px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.28)!important;background:rgba(10,10,14,.82)!important;color:#fff!important;box-shadow:0 5px 18px rgba(0,0,0,.28)!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important;opacity:0!important;pointer-events:auto!important;touch-action:manipulation!important;transition:.18s ease!important}'
      +'#ktWifiStatusIndicator.show{opacity:1!important;transform:translate(-50%,0)!important}'
      +'#ktWifiStatusIndicator.offline{border-color:rgba(255,87,112,.72)!important;background:rgba(45,8,15,.88)!important}'
      +'#ktWifiStatusIndicator .kt-net-icon{font-size:15px!important;line-height:1!important}'
      +'@media(max-width:390px){#ktWifiStatusIndicator{top:78px!important;font-size:10px!important;padding:6px 9px!important}}';
    document.head.appendChild(s);
  }

  function ensure(){
    var el=document.getElementById('ktWifiStatusIndicator');
    if(!el){
      el=document.createElement('button');
      el.type='button';
      el.id='ktWifiStatusIndicator';
      el.setAttribute('aria-label','네트워크 상태 안내 닫기');
      el.addEventListener('click',function(){hide(true);});
      document.body.appendChild(el);
    }
    return el;
  }

  function hide(immediate){
    if(hideTimer){clearTimeout(hideTimer);hideTimer=null;}
    var el=document.getElementById('ktWifiStatusIndicator');
    if(!el)return;
    el.classList.remove('show');
    if(immediate)setTimeout(function(){if(el&&el.parentNode)el.remove();},160);
  }

  function show(text,offline,autoMs){
    style();
    if(hideTimer){clearTimeout(hideTimer);hideTimer=null;}
    var el=ensure();
    el.classList.toggle('offline',!!offline);
    el.innerHTML='<span class="kt-net-icon">'+(offline?'📡':'📶')+'</span><span>'+text+'</span>';
    requestAnimationFrame(function(){el.classList.add('show');});
    if(autoMs>0){
      hideTimer=setTimeout(function(){hide(true);},autoMs);
    }
  }

  function onOffline(){
    show('연결이 끊겼습니다 · 다시 연결 중',true,0);
  }

  function onOnline(){
    show('인터넷 연결됨',false,1800);
  }

  /* 처음 들어왔을 때도 상태를 아주 잠깐만 보여준다. */
  if(navigator.onLine===false)onOffline();
  else show('인터넷 연결됨',false,1600);

  window.addEventListener('online',onOnline);
  window.addEventListener('offline',onOffline);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState!=='visible')return;
    setTimeout(function(){
      if(navigator.onLine===false)onOffline();
    },80);
  });
})();
