/* 촬영 화면 상단 시간 선택줄의 '라이브' 글씨만 '동영상 촬영 시간'으로 변경. 다른 동작/UI 변경 없음. */
(function(){
  if(window.__ktCreatorTopLiveLabelOnly20260914)return;
  window.__ktCreatorTopLiveLabelOnly20260914=true;

  function apply(){
    document.querySelectorAll('.creator-bottom .modes span').forEach(function(el){
      if(String(el.textContent||'').trim()==='라이브'){
        el.textContent='동영상 촬영 시간';
      }
    });
  }

  apply();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(apply,20);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
