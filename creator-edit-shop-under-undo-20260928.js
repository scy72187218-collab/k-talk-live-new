/* 촬영 화면: 되돌리기 바로 아래 독립 편집효과 버튼 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  function openHub(){
    try{
      if(typeof window.showSheet!=='function')return false;
      var html=''
        +'<div class="rowbox"><b>✨ 편집효과</b><br>원하는 기능을 선택하세요.</div>'
        +'<button class="act" type="button" onclick="closeSheet();setTimeout(function(){if(window.openBeautyPanel)openBeautyPanel();},60)">✨ 얼굴 보정</button>'
        +'<button class="act" type="button" onclick="closeSheet();setTimeout(function(){if(window.openEditEffectPanel)openEditEffectPanel(\'background\');},60)">🌊 뒷배경</button>';
      showSheet('✨ 편집효과',html);
    }catch(e){}
    return false;
  }

  function ensureStyle(){
    if(document.getElementById('ktCreatorEditShopStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktCreatorEditShopStyle20260928';
    s.textContent=
      '#creator .kt-creator-edit-shop-20260928{position:absolute!important;z-index:80!important;width:88px!important;height:88px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.32)!important;background:rgba(76,76,82,.58)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;box-shadow:0 7px 20px rgba(0,0,0,.24)!important;backdrop-filter:blur(7px)!important;pointer-events:auto!important;touch-action:manipulation!important;padding:0!important}'+
      '#creator .kt-creator-edit-shop-20260928 .ico{font-size:25px!important;line-height:1!important}'+
      '#creator .kt-creator-edit-shop-20260928 .txt{font-size:14px!important;font-weight:950!important;letter-spacing:-.7px!important;color:#fff!important;text-shadow:0 1px 4px rgba(0,0,0,.65)!important;white-space:nowrap!important}';
    document.head.appendChild(s);
  }

  function ensureButton(){
    var creator=document.getElementById('creator');
    if(!creator)return null;
    ensureStyle();

    /* 기존 중복 편집효과/편집숍 커스텀 버튼은 숨김 */
    creator.querySelectorAll('.kt-creator-edit-shop-20260928').forEach(function(x,i){
      if(i>0){try{x.remove();}catch(e){}}
    });

    var b=creator.querySelector('.kt-creator-edit-shop-20260928');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-creator-edit-shop-20260928';
      b.setAttribute('aria-label','편집효과');
      b.innerHTML='<span class="ico">✨</span><span class="txt">편집효과</span>';
      b.onclick=function(e){
        if(e){e.preventDefault();e.stopPropagation();}
        return openHub();
      };
      creator.appendChild(b);
    }
    return b;
  }

  function place(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    var b=ensureButton();
    var rotate=creator.querySelector('.creator-rotate');
    if(!b||!rotate)return;

    try{
      var cr=creator.getBoundingClientRect();
      var rr=rotate.getBoundingClientRect();
      var size=88;
      var left=(rr.left-cr.left)+((rr.width-size)/2);
      var top=(rr.bottom-cr.top)+12;
      b.style.setProperty('left',Math.round(left)+'px','important');
      b.style.setProperty('right','auto','important');
      b.style.setProperty('top',Math.round(top)+'px','important');
      b.style.setProperty('bottom','auto','important');
      b.style.setProperty('display','flex','important');
    }catch(e){}
  }

  place();
  [80,180,350,700,1200,2000].forEach(function(ms){setTimeout(place,ms);});
  window.addEventListener('resize',function(){setTimeout(place,80);});
  window.addEventListener('orientationchange',function(){setTimeout(place,220);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCreatorEditShopTimer20260928);
      window.__ktCreatorEditShopTimer20260928=setTimeout(place,50);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();