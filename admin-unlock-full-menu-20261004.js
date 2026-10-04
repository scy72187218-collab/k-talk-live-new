/* K-Talk: 관리자 진입 후 전체 메뉴를 먼저 표시 */
(function(){
  function openFullMenu(){
    try{
      if(typeof window.closeSheet==='function')window.closeSheet();
      if(typeof window.openProfileDirect==='function')window.openProfileDirect();
      else if(typeof window.openProfile==='function')window.openProfile();

      [40,120,300,700].forEach(function(ms){
        setTimeout(function(){
          try{
            var box=document.getElementById('ktTotalAdminWrap');
            if(box)box.classList.add('open');
          }catch(e){}
        },ms);
      });
    }catch(e){}
    return false;
  }

  function install(){
    if(typeof window.ktEnterAdminAfterUnlock20261002!=='function')return;
    if(window.ktEnterAdminAfterUnlock20261002.__ktFullMenuFirst)return;
    var fn=function(){return openFullMenu();};
    fn.__ktFullMenuFirst=true;
    window.ktEnterAdminAfterUnlock20261002=fn;
  }

  install();
  [100,300,800,1500,2600].forEach(function(ms){setTimeout(install,ms);});
  window.addEventListener('pageshow',install);
})();
