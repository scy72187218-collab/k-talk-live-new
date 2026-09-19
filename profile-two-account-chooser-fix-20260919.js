/* K-Talk 프로필 진입 시 태권1/하이네2 두 계정 사진 선택 화면 복구.
   프로필 진입 동작만 수정하고 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfileTwoChooserFix20260919)return;
  window.__ktProfileTwoChooserFix20260919=true;

  function openChooser(){
    try{
      if(typeof window.openAccountChooser==='function'){
        window.openAccountChooser();
        return false;
      }
    }catch(e){}
    return false;
  }

  /* 프로필 메뉴는 항상 두 계정 선택 화면부터 */
  window.openProfile=openChooser;

  /* 하단 프로필/상단 프로필 탭이 다른 코드에 의해 직접 프로필로 넘어가도 차단 */
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('[data-bottom="profile"],[data-tab="profile"]'):null;
    if(!t)return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    openChooser();
  },true);

  /* 다른 코드가 openProfile을 다시 덮어써도 프로필 진입만 원래 방식으로 복구 */
  function restore(){
    if(window.openProfile!==openChooser)window.openProfile=openChooser;
  }
  window.addEventListener('pageshow',restore);
  window.addEventListener('focus',restore);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')restore();
  });
  setInterval(restore,1500);
})();