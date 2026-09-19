/* K-Talk 바깥 프로필 버튼: 계정 선택 화면을 먼저 보여준다.
   태권1/하이네2 선택 후에만 해당 프로필로 들어감.
   프로필 내부 저장/사진/총관리/방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfileEntryChooser20260919)return;
  window.__ktProfileEntryChooser20260919=true;

  var openedAt=0;

  function bottomProfile(el){
    return !!(el&&el.closest&&el.closest('[data-bottom="profile"]'));
  }

  function openChooser(){
    var now=Date.now();
    if(now-openedAt<500)return;
    openedAt=now;
    try{
      if(typeof window.openAccountChooser==='function'){
        window.openAccountChooser();
        return;
      }
      if(typeof window.showSheet==='function'){
        window.showSheet('계정 선택','<div class="rowbox">태권1 또는 하이네2 계정을 선택해 주세요.</div>');
      }
    }catch(e){}
  }

  function intercept(e){
    if(!bottomProfile(e.target))return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    openChooser();
  }

  /* 앱 바깥쪽 프로필 버튼은 무조건 계정 선택을 먼저 거친다. */
  window.addEventListener('pointerup',intercept,true);
  window.addEventListener('touchend',intercept,true);

  /* pointerup 뒤 자동 click이 기존 openProfileDirect 쪽으로 새지 않게 막는다. */
  window.addEventListener('click',function(e){
    if(!bottomProfile(e.target))return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    openChooser();
  },true);
})();