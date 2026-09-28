/* 촬영 화면: 되돌리기 바로 밑 편집효과 버튼 고정 */
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
      '#creator .creator-top{overflow:visible!important}'+
      '#creator .kt-edit-under-rotate{position:absolute!important;right:0!important;top:62px!important;width:82px!important;height:82px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.30)!important;background:rgba(92,92,98,.58)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;z-index:40!important;box-shadow:0 7px 18px rgba(0,0,0,.22)!important;backdrop-filter:blur(7px)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-edit-under-rotate b{font-size:25px!important;line-height:1!important}'+
      '#creator .kt-edit-under-rotate small{font-size:14px!important;font-weight:950!important;letter-spacing:-.7px!important;color:#fff!important;text-shadow:0 1px 4px rgba(0,0,0,.7)!important;white-space:nowrap!important}'+
      '#creator .creator-tools button[aria-label="편집 효과"]{display:none!important}'+
      '#creator .kt-creator-edit-shop-20260928{display:none!important}';
    document.head.appendChild(st);
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    ensureStyle();

    creator.querySelectorAll('.kt-creator-edit-shop-20260928').forEach(function(x){try{x.remove();}catch(e){}});

    var top=creator.querySelector('.creator-top');
    var rotate=creator.querySelector('.creator-top .creator-rotate');
    if(!top||!rotate)return;

    var btn=top.querySelector('.kt-edit-under-rotate');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-edit-under-rotate';
      btn.setAttribute('aria-label','편집효과');
      btn.innerHTML='<b>✨</b><small>편집효과</small>';
      btn.addEventListener('click',openEffects);
      top.appendChild(btn);
    }
  }

  ensure();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(ensure,ms);});

  try{
    var creator=document.getElementById('creator');
    if(creator){
      new MutationObserver(function(){setTimeout(ensure,20);})
        .observe(creator,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
  }catch(e){}
})();