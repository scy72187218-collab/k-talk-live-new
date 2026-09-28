/* 촬영 화면: 되돌리기 아래 편집숍 - 기존 보정/배경 재사용 */
(function(){
  if(window.__ktCreatorEditShopUnderUndo20260928)return;
  window.__ktCreatorEditShopUnderUndo20260928=true;

  window.ktOpenCreatorEditShop20260928=function(){
    if(typeof window.showSheet!=='function')return false;
    var html=''
      +'<div class="rowbox"><b>✨ 편집숍</b><br>기존에 만들어 둔 보정과 배경 기능을 그대로 사용합니다.</div>'
      +'<button class="act" type="button" onclick="closeSheet();if(window.openBeautyPanel)openBeautyPanel()">✨ 얼굴 보정</button>'
      +'<button class="act" type="button" onclick="closeSheet();if(window.openEditEffectPanel)openEditEffectPanel(\'background\')">🎭 배경 · 무대 · 바다</button>';
    showSheet('✨ 편집숍',html);
    return false;
  };

  function makeButton(){
    var b=document.createElement('button');
    b.type='button';
    b.className='creator-tool-text kt-creator-edit-shop-20260928';
    b.setAttribute('aria-label','편집숍');
    b.innerHTML='<b>✨</b><small>편집숍</small>';
    b.onclick=function(){return window.ktOpenCreatorEditShop20260928();};
    return b;
  }

  function ensure(){
    var creator=document.getElementById('creator');
    if(!creator)return;
    if(creator.querySelector('.kt-creator-edit-shop-20260928'))return;

    var buttons=[].slice.call(creator.querySelectorAll('button'));
    var undo=buttons.find(function(b){return (b.textContent||'').replace(/\s+/g,'').indexOf('되돌리기')>-1;});
    var btn=makeButton();

    if(undo&&undo.parentNode){
      undo.insertAdjacentElement('afterend',btn);
      return;
    }

    var tools=creator.querySelector('.creator-tools');
    if(tools){
      var edit=[].slice.call(tools.querySelectorAll('button')).find(function(b){
        return (b.textContent||'').replace(/\s+/g,'').indexOf('편집효과')>-1;
      });
      if(edit)edit.insertAdjacentElement('afterend',btn);
      else tools.appendChild(btn);
    }
  }

  ensure();
  [80,250,600,1200].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktCreatorEditShopTimer20260928);
      window.__ktCreatorEditShopTimer20260928=setTimeout(ensure,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();