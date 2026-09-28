/* 촬영 화면: 실제 되돌리기(.creator-rotate) 바로 아래 편집효과 1개 고정 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openAll(){
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('show');
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('background');
        return false;
      }
    }catch(e){}
    return false;
  }

  function style(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktCreatorEditShopStyle20260928';
    s.textContent=
      '#creator .creator-tools button[aria-label="편집 효과"]{position:absolute!important;z-index:40!important;width:86px!important;height:86px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.30)!important;background:rgba(74,74,80,.58)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;box-shadow:0 7px 18px rgba(0,0,0,.22)!important;backdrop-filter:blur(7px)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .creator-tools button[aria-label="편집 효과"] b{font-size:24px!important;line-height:1!important}'+
      '#creator .creator-tools button[aria-label="편집 효과"] small{display:block!important;font-size:14px!important;font-weight:950!important;letter-spacing:-.6px!important;color:#fff!important;text-shadow:0 1px 4px rgba(0,0,0,.65)!important}'+
      '#creator .kt-creator-edit-shop-20260928{display:none!important}';
    document.head.appendChild(s);
  }

  function place(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    style();

    /* 예전에 만든 별도 편집숍 버튼은 제거 */
    creator.querySelectorAll('.kt-creator-edit-shop-20260928').forEach(function(x){try{x.remove();}catch(e){}});

    var rotate=creator.querySelector('.creator-rotate');
    var edit=creator.querySelector('.creator-tools button[aria-label="편집 효과"]');
    if(!rotate||!edit)return;

    edit.innerHTML='<b>✨</b><small>편집효과</small>';
    edit.onclick=function(e){
      if(e){e.preventDefault();e.stopPropagation();}
      return openAll();
    };

    try{
      var cr=creator.getBoundingClientRect();
      var rr=rotate.getBoundingClientRect();
      var size=86;
      var left=(rr.left-cr.left)+((rr.width-size)/2);
      var top=(rr.bottom-cr.top)+14;
      edit.style.setProperty('left',Math.round(left)+'px','important');
      edit.style.setProperty('right','auto','important');
      edit.style.setProperty('top',Math.round(top)+'px','important');
      edit.style.setProperty('bottom','auto','important');
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#creator .creator-tools button[aria-label="편집 효과"]'):null;
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    openAll();
  },true);

  place();
  [60,160,350,700,1200].forEach(function(ms){setTimeout(place,ms);});
  window.addEventListener('resize',function(){setTimeout(place,60);});
  window.addEventListener('orientationchange',function(){setTimeout(place,180);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCreatorEditShopTimer20260928);
      window.__ktCreatorEditShopTimer20260928=setTimeout(place,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();