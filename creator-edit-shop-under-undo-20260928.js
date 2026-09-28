/* 촬영 화면 오른쪽 최종 3개: 되돌리기 / 편집효과 / 글 입력하기 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openEffects(e){
    try{if(e){e.preventDefault();e.stopPropagation();}}catch(_e){}
    try{
      if(typeof window.openEditEffectPanel==='function'){
        window.openEditEffectPanel('face');
        return false;
      }
    }catch(err){}
    return false;
  }

  function openText(e){
    try{if(e){e.preventDefault();e.stopPropagation();}}catch(_e){}
    try{
      var txt=window.prompt('화면에 넣을 글을 입력하세요.','');
      if(txt==null)return false;
      txt=String(txt).trim();
      if(!txt)return false;

      var creator=document.getElementById('creator');
      if(!creator)return false;

      var old=document.getElementById('ktCreatorTextOverlay20260928');
      if(old)old.remove();

      var box=document.createElement('div');
      box.id='ktCreatorTextOverlay20260928';
      box.textContent=txt;
      box.style.cssText='position:absolute;left:50%;top:33%;transform:translate(-50%,-50%);z-index:75;max-width:82%;padding:8px 12px;border-radius:12px;background:rgba(0,0,0,.28);color:#fff;font:900 24px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif;text-align:center;text-shadow:0 2px 5px #000;pointer-events:none;white-space:pre-wrap;';
      creator.appendChild(box);
    }catch(err){}
    return false;
  }

  function installStyle(){
    if(document.getElementById('ktCreatorMinimalRightStyle20260928'))return;
    var st=document.createElement('style');
    st.id='ktCreatorMinimalRightStyle20260928';
    st.textContent=
      '#creator .kt-min-right-btn{position:absolute!important;z-index:10002!important;width:58px!important;height:58px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.28)!important;background:rgba(70,70,76,.52)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;box-shadow:0 5px 14px rgba(0,0,0,.20)!important;pointer-events:auto!important;touch-action:manipulation!important}'+
      '#creator .kt-min-right-btn b{font-size:20px!important;line-height:1!important}'+
      '#creator .kt-min-right-btn small{font-size:9px!important;font-weight:950!important;color:#fff!important;white-space:nowrap!important;text-shadow:0 1px 3px #000!important}';
    document.head.appendChild(st);
  }

  function makeBtn(cls,icon,label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-min-right-btn '+cls;
    b.setAttribute('aria-label',label);
    b.innerHTML='<b>'+icon+'</b><small>'+label+'</small>';
    b.onclick=fn;
    return b;
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    installStyle();

    creator.querySelectorAll('.kt-edit-under-rotate,.kt-creator-edit-shop-20260928').forEach(function(x){try{x.remove();}catch(e){}});

    var rotate=creator.querySelector('.creator-rotate');
    if(!rotate)return;

    var edit=creator.querySelector('.kt-min-edit');
    if(!edit){
      edit=makeBtn('kt-min-edit','🎨','편집효과',openEffects);
      creator.appendChild(edit);
    }

    var textBtn=creator.querySelector('.kt-min-text');
    if(!textBtn){
      textBtn=makeBtn('kt-min-text','Aa','글 입력',openText);
      creator.appendChild(textBtn);
    }

    try{
      var cr=creator.getBoundingClientRect();
      var rr=rotate.getBoundingClientRect();
      var size=58;
      var left=(rr.left-cr.left)+(rr.width-size)/2;
      var editTop=(rr.bottom-cr.top)+10;
      var textTop=editTop+size+10;

      [edit,textBtn].forEach(function(btn){
        btn.style.setProperty('left',Math.round(left)+'px','important');
        btn.style.setProperty('right','auto','important');
        btn.style.setProperty('bottom','auto','important');
      });
      edit.style.setProperty('top',Math.round(editTop)+'px','important');
      textBtn.style.setProperty('top',Math.round(textTop)+'px','important');
    }catch(e){}
  }

  ensure();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
  window.addEventListener('resize',function(){setTimeout(ensure,60);});
  window.addEventListener('orientationchange',function(){setTimeout(ensure,180);});
})();