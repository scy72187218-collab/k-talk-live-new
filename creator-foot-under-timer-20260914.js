/* K-Talk 촬영 화면: 시간 선택줄만 조금 위로, '게시 · 창작하기 · 라이브' 글씨만 더 두껍게. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktCreatorFootUnderTimer20260914)return;
  window.__ktCreatorFootUnderTimer20260914=true;

  var style=document.createElement('style');
  style.id='ktCreatorFootUnderTimer20260914Style';
  style.textContent=''
    +'html #creator .creator-bottom .modes{margin-bottom:4px!important;transform:translateY(-6px)!important;}'
    +'html #creator .creator-bottom .creator-foot{display:flex!important;justify-content:center!important;align-items:center!important;gap:24px!important;margin:0 0 12px!important;font-size:12px!important;font-weight:900!important;line-height:1.1!important;}'
    +'html #creator .creator-bottom .creator-foot span{font-weight:900!important;-webkit-text-stroke:.35px currentColor!important;}';
  document.head.appendChild(style);

  function apply(){
    try{
      var bottom=document.querySelector('#creator .creator-bottom');
      if(!bottom)return;
      var modes=bottom.querySelector('.modes');
      var foot=bottom.querySelector('.creator-foot');
      if(!modes||!foot)return;
      if(modes.nextElementSibling!==foot)modes.insertAdjacentElement('afterend',foot);
    }catch(e){}
  }

  apply();
  [60,180,400,800,1500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(apply,20);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
