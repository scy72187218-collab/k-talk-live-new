/* K-Talk 촬영 화면: 편집효과 바로 아래에 보물상자 버튼만 추가. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktCreatorTreasureButtonInstalled)return;
  window.__ktCreatorTreasureButtonInstalled=true;

  /* 비밀방 버튼과 겹치지 않도록 보물상자 버튼만 조금 작게 하고 위로 당긴다. */
  if(!document.getElementById('ktCreatorTreasurePositionFix')){
    var style=document.createElement('style');
    style.id='ktCreatorTreasurePositionFix';
    style.textContent=''
      +'#creator .creator-tools [data-kt-creator-treasure]{width:42px!important;height:42px!important;min-height:42px!important;margin-top:-16px!important;align-self:center!important;padding:0!important;z-index:45!important}'
      +'#creator .creator-tools [data-kt-creator-treasure] b{font-size:22px!important;line-height:1!important}'
      +'#creator .creator-tools [data-kt-creator-treasure] small{font-size:7px!important;line-height:1!important;margin-top:1px!important}';
    document.head.appendChild(style);
  }

  window.openCreatorTreasureBox=window.openCreatorTreasureBox||function(){
    try{
      if(window.showSheet){
        window.showSheet('🎁 보물상자','<div class="rowbox"><b>보물상자</b><br>방송 중 사용할 보물상자 메뉴입니다.</div>');
      }
    }catch(e){}
  };

  function ensureButton(){
    var tools=document.querySelector('#creator .creator-tools');
    if(!tools)return false;
    if(tools.querySelector('[data-kt-creator-treasure]'))return true;
    var effect=tools.querySelector('button[aria-label="편집 효과"]');
    if(!effect)return false;

    var btn=document.createElement('button');
    btn.type='button';
    btn.className='creator-tool-text';
    btn.setAttribute('aria-label','보물상자');
    btn.setAttribute('data-kt-creator-treasure','1');
    btn.innerHTML='<b>🎁</b><small>보물상자</small>';
    btn.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      if(window.openCreatorTreasureBox)window.openCreatorTreasureBox();
    });

    if(effect.nextSibling)tools.insertBefore(btn,effect.nextSibling);
    else tools.appendChild(btn);
    return true;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureButton,{once:true});
  else ensureButton();
  setTimeout(ensureButton,100);
  setTimeout(ensureButton,500);
})();
