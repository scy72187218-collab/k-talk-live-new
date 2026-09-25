/* K-Talk critical button touch rescue (2026-09-24).
   ONLY: PWA install/later, public-video rose, Site Usage AI guide, and switches.
   No room layout, video playback, live transport, chat, gifts, or other UI changes. */
(function(){
  if(window.__ktCriticalTouchRescue20260924)return;
  window.__ktCriticalTouchRescue20260924=true;

  var lastEl=null,lastAt=0;

  function visible(el){
    if(!el||!el.isConnected)return false;
    try{
      var cs=getComputedStyle(el);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      var r=el.getBoundingClientRect();
      return r.width>3&&r.height>3;
    }catch(e){return false;}
  }

  function containsPoint(el,x,y){
    if(!visible(el))return false;
    try{
      var r=el.getBoundingClientRect();
      return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
    }catch(e){return false;}
  }

  function selectors(){
    return [
      '.kt-pwa-install-later',
      '.kt-pwa-install-go',
      '.kt-feed-final-rose',
      '.kt-feed-one-rose',
      '[onclick*="openSiteGuide"]',
      '.kt-switch',
      '[role="switch"]'
    ];
  }

  function findControl(e,x,y){
    try{
      if(e.target&&e.target.closest){
        var direct=e.target.closest(selectors().join(','));
        if(direct&&visible(direct))return direct;
      }
    }catch(z){}

    var sels=selectors();
    for(var s=0;s<sels.length;s++){
      var list=[];
      try{list=[].slice.call(document.querySelectorAll(sels[s]));}catch(z){}
      for(var i=list.length-1;i>=0;i--){
        if(containsPoint(list[i],x,y))return list[i];
      }
    }
    return null;
  }

  function roseId(btn){
    try{
      var box=btn.closest('.vh-actions');
      var sec=btn.closest('section');
      var id=String(box&&box.dataset&&box.dataset.ktFeedVideoId||'');
      if(!id&&sec)id=String(sec.getAttribute('data-kt-feed-video-id')||'');
      if(!id){
        var oc=String(btn.getAttribute('onclick')||'');
        var m=oc.match(/ktPublicSendRose\(\s*['"]([^'"]+)['"]/);
        if(m)id=m[1];
      }
      return id;
    }catch(e){return '';}
  }

  function roseName(btn){
    try{
      var sec=btn.closest('section');
      var b=sec&&sec.querySelector('.vh-title b');
      return String(b&&b.textContent||'동영상 게시자').replace(/^\s*♛\s*/,'').trim()||'동영상 게시자';
    }catch(e){return '동영상 게시자';}
  }

  function run(el){
    if(!el)return false;
    try{
      if(el.classList.contains('kt-pwa-install-later')){
        if(typeof window.ktPwaInstallLater==='function'){window.ktPwaInstallLater();return true;}
        var o=document.getElementById('ktPwaInstallOffer');if(o)o.remove();
        return true;
      }

      if(el.classList.contains('kt-pwa-install-go')){
        if(typeof window.ktPwaInstallNow==='function'){window.ktPwaInstallNow();return true;}
        return false;
      }

      if(el.classList.contains('kt-feed-final-rose')||el.classList.contains('kt-feed-one-rose')){
        var id=roseId(el);
        if(id&&typeof window.ktPublicSendRose==='function'){
          window.ktPublicSendRose(id,roseName(el),el);
          return true;
        }
        return false;
      }

      if(String(el.getAttribute('onclick')||'').indexOf('openSiteGuide')>-1){
        try{
          if(window.state)state.aiVoiceOn=true;
          localStorage.setItem('ktalk_ai_voice','on');
        }catch(z){}
        if(typeof window.openSiteGuide==='function'){
          window.openSiteGuide();
          try{if(typeof window.ktReadCurrentHelpSheet==='function')window.ktReadCurrentHelpSheet(true);}catch(z){}
          return true;
        }
        return false;
      }

      if(el.classList.contains('kt-switch')){
        var row=el.closest('.kt-setting-row');
        var label=String(row&&row.textContent||'').replace(/\s+/g,'');
        if(label.indexOf('AI음성안내')>-1&&typeof window.toggleAIVoice==='function'){
          window.toggleAIVoice(el);return true;
        }
        if(typeof window.toggleLiveSetting==='function'){
          window.toggleLiveSetting(el);return true;
        }
      }

      if(el.getAttribute('role')==='switch'){
        var attr=el.hasAttribute('aria-checked')?'aria-checked':'aria-pressed';
        var on=el.getAttribute(attr)==='true'||el.classList.contains('on');
        el.classList.toggle('on',!on);
        el.setAttribute(attr,!on?'true':'false');
        return true;
      }
    }catch(e){}
    return false;
  }

  function point(e){
    if(e.touches&&e.touches[0])return {x:e.touches[0].clientX,y:e.touches[0].clientY};
    if(e.changedTouches&&e.changedTouches[0])return {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    return {x:e.clientX,y:e.clientY};
  }

  function rescue(e){
    var p=point(e);
    if(!isFinite(p.x)||!isFinite(p.y))return;
    var el=findControl(e,p.x,p.y);
    if(!el)return;
    var now=Date.now();
    if(lastEl===el&&now-lastAt<700){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}
      return;
    }
    if(!run(el))return;
    lastEl=el;lastAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}
  }

  if(!document.getElementById('ktCriticalTouchRescueStyle20260924')){
    var st=document.createElement('style');
    st.id='ktCriticalTouchRescueStyle20260924';
    st.textContent=''
      +'.kt-pwa-install-offer{z-index:2147483647!important;pointer-events:auto!important}'
      +'.kt-pwa-install-actions,.kt-pwa-install-actions button,.kt-feed-final-rose,.kt-feed-one-rose,.kt-switch,[role="switch"],[onclick*="openSiteGuide"]{pointer-events:auto!important;touch-action:manipulation!important}';
    document.head.appendChild(st);
  }

  window.addEventListener('pointerdown',rescue,true);
  if(!window.PointerEvent)window.addEventListener('touchstart',rescue,true);
})();