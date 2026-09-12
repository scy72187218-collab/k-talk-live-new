/* K-Talk 동영상/방송 화면: 왼쪽 위에 '📶 대중교통' 표시. 공유 버튼과 겹치지 않음. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktWifiStatusIndicatorInstalled)return;
  window.__ktWifiStatusIndicatorInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktWifiStatusIndicatorStyle'))return;
    var s=document.createElement('style');
    s.id='ktWifiStatusIndicatorStyle';
    s.textContent=''
      +'#ktWifiStatusIndicator{position:fixed!important;left:10px!important;right:auto!important;top:12px!important;bottom:auto!important;z-index:2147483000!important;display:inline-flex!important;align-items:center!important;gap:5px!important;height:30px!important;padding:0 10px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.30)!important;background:rgba(10,10,14,.82)!important;color:#fff!important;box-shadow:0 4px 14px rgba(0,0,0,.35)!important;font-size:11px!important;font-weight:900!important;line-height:1!important;white-space:nowrap!important;opacity:1!important;pointer-events:auto!important;touch-action:manipulation!important;transition:opacity .16s ease,transform .16s ease!important}'
      +'#ktWifiStatusIndicator .kt-net-icon{font-size:15px!important;line-height:1!important}'
      +'#ktWifiStatusIndicator.kt-hide{opacity:0!important;transform:scale(.92)!important;pointer-events:none!important}'
      +'@media(max-width:390px){#ktWifiStatusIndicator{left:8px!important;right:auto!important;top:10px!important;bottom:auto!important;height:28px!important;padding:0 8px!important;font-size:10px!important}}'
      +'@media(min-width:700px){#ktWifiStatusIndicator{left:14px!important;right:auto!important;top:14px!important;bottom:auto!important;height:32px!important;font-size:12px!important}}';
    document.head.appendChild(s);
  }

  function show(){
    ensureStyle();
    var old=document.getElementById('ktWifiStatusIndicator');
    if(old)return old;
    var el=document.createElement('button');
    el.type='button';
    el.id='ktWifiStatusIndicator';
    el.setAttribute('aria-label','대중교통 와이파이 표시 닫기');
    el.innerHTML='<span class="kt-net-icon">📶</span><span>대중교통</span>';
    el.addEventListener('click',function(){
      el.classList.add('kt-hide');
      setTimeout(function(){if(el&&el.parentNode)el.remove();},170);
    });
    document.body.appendChild(el);
    return el;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});
  else show();
})();
