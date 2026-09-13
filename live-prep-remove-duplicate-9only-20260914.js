/* K-Talk 라이브 준비: 중복된 9명 방송 버튼 하나만 숨김. 다른 UI 변경 없음. */
(function(){
  if(window.__ktRemoveDuplicate9Only20260914)return;
  window.__ktRemoveDuplicate9Only20260914=true;

  function fix(){
    var row=document.querySelector('.live-prep .room-switch-row');
    if(!row)return;
    var nine=[].slice.call(row.querySelectorAll('.room-switch')).filter(function(b){
      return /9\s*명/.test(String(b.textContent||''));
    });
    if(nine.length<2)return;
    var target=nine.find(function(b){
      var t=String(b.textContent||'').replace(/\s+/g,'');
      return t==='9명방송';
    }) || nine[1];
    if(target)target.style.setProperty('display','none','important');
  }

  fix();
  [80,220,500,900,1500,2500].forEach(function(ms){setTimeout(fix,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(fix,20);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
