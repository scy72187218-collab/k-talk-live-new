/* K-Talk: 첫 페이지 동영상 즉시 시작 + 아이콘 메타만 유지. 설치 팝업은 만들지 않음. */
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

  function removeOffer(){
    try{
      ['ktFirstJoinIconOffer','ktInstallOffer','ktInstallPrompt','ktHomeInstallBanner'].forEach(function(id){
        var el=document.getElementById(id);
        if(el)el.remove();
      });
    }catch(e){}
  }

  var firstEntryOpened=false;
  function wakeHomeVideo(){
    var v=document.getElementById('homeVideo');
    if(!v)return false;
    try{
      v.muted=true;
      v.defaultMuted=true;
      v.autoplay=true;
      v.preload='auto';
      v.setAttribute('muted','');
      v.setAttribute('autoplay','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      if(v.readyState===0){try{v.load();}catch(e){}}
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
      if(v.dataset.ktFirstVideoWake!=='1'){
        v.dataset.ktFirstVideoWake='1';
        v.addEventListener('loadeddata',function(){try{v.play().catch(function(){});}catch(e){}});
        v.addEventListener('canplay',function(){try{v.play().catch(function(){});}catch(e){}});
      }
    }catch(e){}
    return true;
  }

  function openFirstVideoPage(){
    removeOffer();
    if(firstEntryOpened){wakeHomeVideo();return;}
    if(typeof window.home!=='function'){
      setTimeout(openFirstVideoPage,40);
      return;
    }
    try{
      firstEntryOpened=true;
      window.home();
    }catch(e){
      firstEntryOpened=false;
      setTimeout(openFirstVideoPage,60);
      return;
    }
    setTimeout(removeOffer,0);
    setTimeout(wakeHomeVideo,0);
    setTimeout(wakeHomeVideo,80);
    setTimeout(wakeHomeVideo,320);
    setTimeout(wakeHomeVideo,900);
  }

  try{
    var offerObserver=new MutationObserver(function(){removeOffer();});
    offerObserver.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',function(){removeOffer();setTimeout(wakeHomeVideo,30);});
  window.addEventListener('focus',function(){removeOffer();setTimeout(wakeHomeVideo,30);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden){removeOffer();setTimeout(wakeHomeVideo,30);}
  });

  setTimeout(openFirstVideoPage,0);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){
      removeOffer();
      setTimeout(openFirstVideoPage,0);
      setTimeout(wakeHomeVideo,500);
    },{once:true});
  }else{
    removeOffer();
    setTimeout(openFirstVideoPage,0);
    setTimeout(wakeHomeVideo,500);
  }
})();

/* AI 보정·편집효과 버튼만 터치/클릭 작동 보강. 다른 버튼과 화면은 건드리지 않음. */
(function(){
  if(window.__ktCreatorBeautyEffectButtonFix20260910)return;
  window.__ktCreatorBeautyEffectButtonFix20260910=true;

  var lastTapAt=0;
  var lastAction='';

  function getAction(btn){
    if(!btn)return '';
    var label=String(btn.getAttribute('aria-label')||'');
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    if(label==='AI 보정'||text.indexOf('AI보정')>-1||text==='보정')return 'beauty';
    if(label==='편집 효과'||text.indexOf('편집효과')>-1)return 'edit';
    return '';
  }

  function isTarget(btn){
    if(!btn)return false;
    if(btn.closest('#creator .creator-tools'))return !!getAction(btn);
    if(btn.closest('#creator .live-prep')&&btn.classList.contains('prep-item'))return !!getAction(btn);
    return false;
  }

  function runAction(action){
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('show');
      if(action==='beauty'&&typeof window.openBeautyPanel==='function'){
        window.openBeautyPanel();
        return true;
      }
      if(action==='edit'&&typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel();
        return true;
      }
    }catch(e){}
    return false;
  }

  function handle(e){
    var btn=e.target&&e.target.closest?e.target.closest('button'):null;
    if(!isTarget(btn))return;
    var action=getAction(btn);
    var now=Date.now();

    if(e.type==='click'&&lastAction===action&&(now-lastTapAt)<500){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    lastTapAt=now;
    lastAction=action;
    runAction(action);
  }

  document.addEventListener('pointerup',handle,true);
  document.addEventListener('click',handle,true);

  if(!document.getElementById('ktCreatorBeautyEffectButtonFixStyle')){
    var s=document.createElement('style');
    s.id='ktCreatorBeautyEffectButtonFixStyle';
    s.textContent=''
      +'#creator .creator-tools .creator-tool-text[aria-label="AI 보정"],#creator .creator-tools .creator-tool-text[aria-label="편집 효과"]{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:60!important}'
      +'#creator .live-prep .prep-item{pointer-events:auto!important;touch-action:manipulation!important}';
    document.head.appendChild(s);
  }
})();
