/* 촬영 화면: 실제 되돌리기 버튼의 화면 위치 바로 아래에 편집효과 고정 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openEffects(e){
    if(e){try{e.preventDefault();e.stopPropagation();}catch(_){}}
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('show');
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('face');
        return false;
      }
    }catch(err){}
    return false;
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktCreatorEditShopStyle20260928';
    st.textContent=
      '#creator .creator-tools button[aria-label="편집 효과"]{display:none!important}'+
      '#creator .kt-creator-edit-shop-20260928{display:none!important}'+
      '#creator .kt-edit-under-rotate{position:absolute!important;z-index:60!important;width:62px!important;height:62px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.30)!important;background:rgba(92,92,98,.58)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;box-shadow:0 7px 18px rgba(0,0,0,.22)!important;backdrop-filter:blur(7px)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-edit-under-rotate b{font-size:20px!important;line-height:1!important}'+
      '#creator .kt-edit-under-rotate small{font-size:11px!important;font-weight:950!important;letter-spacing:-.7px!important;color:#fff!important;text-shadow:0 1px 4px rgba(0,0,0,.7)!important;white-space:nowrap!important}';
    document.head.appendChild(st);
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    ensureStyle();

    creator.querySelectorAll('.kt-creator-edit-shop-20260928').forEach(function(x){try{x.remove();}catch(e){}});

    var rotate=creator.querySelector('.creator-rotate');
    if(!rotate)return;

    var btn=creator.querySelector('.kt-edit-under-rotate');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-edit-under-rotate';
      btn.setAttribute('aria-label','편집효과');
      btn.innerHTML='<b>✨</b><small>편집효과</small>';
      btn.addEventListener('click',function(e){
        if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
        try{
          if(typeof window.openEditEffectPanel==='function'){
            window.openEditEffectPanel('face');
            return false;
          }
        }catch(err){}
        return openEffects(e);
      },true);
      creator.appendChild(btn);
    }

    try{
      var cr=creator.getBoundingClientRect();
      var rr=rotate.getBoundingClientRect();
      var size=62;
      var left=(rr.left-cr.left)+(rr.width-size)/2;
      var top=(rr.bottom-cr.top)+14;
      btn.style.setProperty('left',Math.round(left)+'px','important');
      btn.style.setProperty('top',Math.round(top)+'px','important');
      btn.style.setProperty('right','auto','important');
      btn.style.setProperty('bottom','auto','important');
    }catch(e){}
  }

  ensure();
  [50,120,250,450,700,1000,1500].forEach(function(ms){setTimeout(ensure,ms);});
  window.addEventListener('resize',function(){setTimeout(ensure,50);});
  window.addEventListener('orientationchange',function(){setTimeout(ensure,180);});

  try{
    var creator=document.getElementById('creator');
    if(creator){
      new MutationObserver(function(){
        clearTimeout(window.__ktEditPosTimer20260928);
        window.__ktEditPosTimer20260928=setTimeout(ensure,30);
      }).observe(creator,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
    }
  }catch(e){}
})();