/* K-Talk 선물상자 수량 표시 복구 전용
   다른 기능/배치에는 손대지 않고 각 선물 카드의 개수만 다시 표시 */
(function(){
  if(window.__ktGiftCountRestore20261004)return;
  window.__ktGiftCountRestore20261004=true;

  function ensureStyle(){
    var id='ktGiftCountRestoreStyle20261004';
    var s=document.getElementById(id);
    if(!s){
      s=document.createElement('style');
      s.id=id;
      (document.head||document.documentElement).appendChild(s);
    }
    s.textContent=''
      +'.gift-final-v1 .kt-gift-final-card strong,'
      +'.gift-shop25 .kt-gift-final-card strong,'
      +'.kt-gift-final .kt-gift-final-card strong{'
      +'display:block!important;visibility:visible!important;opacity:1!important;'
      +'position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'
      +'height:auto!important;min-height:0!important;max-height:none!important;'
      +'margin:3px 0 0!important;padding:0!important;'
      +'font-size:11px!important;line-height:1.15!important;font-weight:950!important;'
      +'color:#ffe44d!important;text-align:center!important;white-space:nowrap!important;'
      +'overflow:visible!important;text-overflow:clip!important;transform:none!important;'
      +'}'
      +'@media(max-width:390px){'
      +'.gift-final-v1 .kt-gift-final-card strong,'
      +'.gift-shop25 .kt-gift-final-card strong,'
      +'.kt-gift-final .kt-gift-final-card strong{font-size:10px!important;margin-top:2px!important}'
      +'}';
  }

  function restore(){
    ensureStyle();
    document.querySelectorAll('.kt-gift-final-card').forEach(function(card){
      var idx=parseInt(card.getAttribute('data-index'),10);
      var strong=card.querySelector('strong');
      var g=window.ktalkGifts&&window.ktalkGifts[idx];
      if(!strong&&g){
        strong=document.createElement('strong');
        card.appendChild(strong);
      }
      if(strong&&g){
        strong.textContent=String(g[1]).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'개';
      }
    });
  }

  restore();
  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('[onclick*="openGifts"],.gift-open,.gift-btn')){
      setTimeout(restore,20);
      setTimeout(restore,120);
    }
  },true);
  try{
    new MutationObserver(function(){
      if(document.querySelector('.kt-gift-final-card'))setTimeout(restore,0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();