/* 동영상 촬영 시작 시 열려 있던 보정/편집효과 창만 자동으로 닫는다. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRecordingSheetHideFixInstalled)return;
  window.__ktRecordingSheetHideFixInstalled=true;

  function closeEffectSheetIfOpen(){
    try{
      var sh=document.getElementById('sheet');
      if(!sh||!sh.classList.contains('show'))return;
      if(sh.classList.contains('camera-effect-sheet')||sh.classList.contains('stage-effect-sheet')||sh.classList.contains('beauty-control-sheet')){
        if(typeof window.closeSheet==='function')window.closeSheet();
        else sh.classList.remove('show');
      }
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#creator .record'):null;
    if(!b)return;
    closeEffectSheetIfOpen();
  },true);

  var t=setInterval(function(){
    try{
      var c=document.getElementById('creator');
      if(c&&c.classList.contains('creator-recording'))closeEffectSheetIfOpen();
    }catch(e){}
  },150);
  window.addEventListener('beforeunload',function(){try{clearInterval(t);}catch(e){}});
})();
