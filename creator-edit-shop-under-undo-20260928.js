/* 촬영 화면: 되돌리기 아래 작은 편집효과 1개만 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openEffects(){
    try{
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('face');
        return false;
      }
    }catch(e){}
    return false;
  }

  function style(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktCreatorEditShopStyle20260928';
    st.textContent=
      '#creator .kt-edit-under-rotate{position:absolute!important;z-index:10002!important;width:56px!important;height:56px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.28)!important;background:rgba(70,70,76,.50)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;box-shadow:0 5px 14px rgba(0,0,0,.20)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-edit-under-rotate b{font-size:19px!important;line-height:1!important}'+
      '#creator .kt-edit-under-rotate small{font-size:9px!important;font-weight:950!important;color:#fff!important;white-space:nowrap!important;text-shadow:0 1px 3px #000!important}';
    document.head.appendChild(st);
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    style();

    /* 중복 제거 */
    creator.querySelectorAll('.kt-edit-under-rotate').forEach(function(el,i){
      if(i>0)try{el.remove();}catch(e){}
    });

    var rotate=creator.querySelector('.creator-rotate');
    if(!rotate)return;

    var btn=creator.querySelector('.kt-edit-under-rotate');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-edit-under-rotate';
      btn.setAttribute('aria-label','편집효과');
      btn.innerHTML='<b>🎨</b><small>편집효과</small>';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        return openEffects();
      };
      creator.appendChild(btn);
    }

    try{
      var cr=creator.getBoundingClientRect();
      var rr=rotate.getBoundingClientRect();
      var size=56;
      var left=(rr.left-cr.left)+(rr.width-size)/2;
      var top=(rr.bottom-cr.top)+10;
      btn.style.setProperty('left',Math.round(left)+'px','important');
      btn.style.setProperty('top',Math.round(top)+'px','important');
      btn.style.setProperty('right','auto','important');
      btn.style.setProperty('bottom','auto','important');
    }catch(e){}
  }

  ensure();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
  window.addEventListener('resize',function(){setTimeout(ensure,60);});
})();