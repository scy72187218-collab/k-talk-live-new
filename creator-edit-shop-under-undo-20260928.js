/* 촬영 화면: 되돌리기 아래 편집숍 + 기존 편집효과/배경 전체 열기 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openBackgrounds(){
    try{
      var creator=document.getElementById('creator');
      if(creator)creator.classList.add('show');
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('background');
        return false;
      }
    }catch(e){}
    try{alert('편집효과를 불러오는 중입니다. 다시 한 번 눌러 주세요.');}catch(e){}
    return false;
  }

  window.ktOpenCreatorEditShop20260928=function(){
    return openBackgrounds();
  };

  function makeButton(){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-creator-edit-shop-20260928';
    b.setAttribute('aria-label','편집숍');
    b.innerHTML='<span class="kt-editshop-icon">✨</span><span class="kt-editshop-label">편집숍</span>';
    b.onclick=function(e){
      if(e){e.preventDefault();e.stopPropagation();}
      return openBackgrounds();
    };
    return b;
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktCreatorEditShopStyle20260928';
    st.textContent=
      '#creator .kt-creator-edit-shop-20260928{position:absolute!important;right:16px!important;top:480px!important;z-index:30!important;width:112px!important;height:112px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.32)!important;background:rgba(70,70,76,.55)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;box-shadow:0 8px 22px rgba(0,0,0,.22)!important;backdrop-filter:blur(8px)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-creator-edit-shop-20260928 .kt-editshop-icon{font-size:28px!important;line-height:1!important}'+
      '#creator .kt-creator-edit-shop-20260928 .kt-editshop-label{font-size:17px!important;font-weight:950!important;letter-spacing:-.8px!important;text-shadow:0 1px 4px rgba(0,0,0,.6)!important}'+
      '@media(max-height:760px){#creator .kt-creator-edit-shop-20260928{top:430px!important;width:96px!important;height:96px!important}}';
    document.head.appendChild(st);
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    ensureStyle();
    var existing=creator.querySelector('.kt-creator-edit-shop-20260928');
    if(!existing){
      existing=makeButton();
      creator.appendChild(existing);
    }

    /* 화면 크기가 달라도 '되돌리기' 바로 아래에 따라붙게 배치 */
    try{
      var undo=[].slice.call(creator.querySelectorAll('button')).find(function(b){
        return (b.textContent||'').replace(/\\s+/g,'').indexOf('되돌리기')>-1;
      });
      if(undo&&existing){
        var cr=creator.getBoundingClientRect();
        var ur=undo.getBoundingClientRect();
        existing.style.setProperty('top',Math.max(100,ur.bottom-cr.top+12)+'px','important');
        existing.style.setProperty('right',Math.max(10,cr.right-ur.right)+'px','important');
      }
    }catch(e){}

    /* 기존 위쪽 편집효과 버튼도 눌리게 유지하되, 배경 전체 목록으로 바로 연결 */
    var editBtns=[].slice.call(creator.querySelectorAll('button')).filter(function(b){
      var t=(b.textContent||'').replace(/\\s+/g,'');
      return t.indexOf('편집효과')>-1 || b.getAttribute('aria-label')==='편집 효과';
    });
    editBtns.forEach(function(b){
      b.style.setProperty('pointer-events','auto','important');
      b.style.setProperty('touch-action','manipulation','important');
    });
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#creator button'):null;
    if(!b)return;
    var t=(b.textContent||'').replace(/\\s+/g,'');
    if(t.indexOf('편집효과')>-1 || b.getAttribute('aria-label')==='편집 효과'){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      openBackgrounds();
    }
  },true);

  ensure();
  [80,250,600,1200].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCreatorEditShopTimer20260928);
      window.__ktCreatorEditShopTimer20260928=setTimeout(ensure,40);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();