/* 촬영 화면 오른쪽 3버튼: 되돌리기 / 편집효과 / 글 입력 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openEffects(){
    try{
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('face');
      }else{
        return false;
      }
      var sh=document.getElementById('sheet');
      if(sh){
        sh.style.removeProperty('pointer-events');
        sh.classList.add('show');
      }
      setTimeout(function(){
        try{
          var s=document.getElementById('sheet');
          if(s){
            s.style.removeProperty('pointer-events');
            s.classList.add('show');
          }
        }catch(e){}
      },30);
      return false;
    }catch(e){}
    return false;
  }

  function addText(){
    var creator=document.getElementById('creator');
    if(!creator)return false;
    var input=prompt('화면에 넣을 글을 입력하세요.');
    if(!input)return false;
    var old=creator.querySelector('.kt-creator-text-overlay');
    if(!old){
      old=document.createElement('div');
      old.className='kt-creator-text-overlay';
      old.style.cssText='position:absolute;left:50%;top:24%;transform:translateX(-50%);z-index:90;max-width:78%;padding:7px 10px;border-radius:10px;background:rgba(0,0,0,.30);color:#fff;font-size:28px;font-weight:900;text-align:center;text-shadow:0 2px 5px #000;pointer-events:none;white-space:pre-wrap;word-break:break-word';
      creator.appendChild(old);
    }
    old.textContent=input;
    return false;
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktCreatorEditShopStyle20260928';
    st.textContent=
      '#creator.live-prep-open .kt-edit-under-rotate,#creator.live-prep-open .kt-text-under-effect{display:none!important;pointer-events:none!important}'+
'#creator .kt-edit-under-rotate,#creator .kt-text-under-effect{position:absolute!important;right:16px!important;left:auto!important;z-index:10002!important;width:56px!important;height:56px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.28)!important;background:rgba(70,70,76,.50)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;box-shadow:0 5px 14px rgba(0,0,0,.20)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-edit-under-rotate{top:300px!important}'+
      '#creator .kt-text-under-effect{top:366px!important}'+
      '#creator .kt-edit-under-rotate b,#creator .kt-text-under-effect b{font-size:19px!important;line-height:1!important}'+
      '#creator .kt-edit-under-rotate small,#creator .kt-text-under-effect small{font-size:9px!important;font-weight:950!important;color:#fff!important;white-space:nowrap!important;text-shadow:0 1px 3px #000!important}';
    document.head.appendChild(st);
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    ensureStyle();

    creator.querySelectorAll('.kt-edit-under-rotate').forEach(function(el,i){if(i>0)try{el.remove();}catch(e){}});
    creator.querySelectorAll('.kt-text-under-effect').forEach(function(el,i){if(i>0)try{el.remove();}catch(e){}});

    var fx=creator.querySelector('.kt-edit-under-rotate');
    if(!fx){
      fx=document.createElement('button');
      fx.type='button';
      fx.className='kt-edit-under-rotate';
      fx.setAttribute('aria-label','편집효과');
      fx.innerHTML='<b>🎨</b><small>편집효과</small>';
      fx.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(_e){}return openEffects();};
      creator.appendChild(fx);
    }

    var txt=creator.querySelector('.kt-text-under-effect');
    if(!txt){
      txt=document.createElement('button');
      txt.type='button';
      txt.className='kt-text-under-effect';
      txt.setAttribute('aria-label','글 입력하기');
      txt.innerHTML='<b>Aa</b><small>글 입력</small>';
      txt.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(_e){}return addText();};
      creator.appendChild(txt);
    }
  }

  ensure();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
})();