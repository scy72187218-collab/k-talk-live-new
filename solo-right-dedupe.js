/* K-Talk 1인방 오른쪽 중복 버튼만 정리: 효과 1개, 보물상자 1개만 유지. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktSoloRightDedupeInstalled)return;
  window.__ktSoloRightDedupeInstalled=true;

  function buttonKind(btn){
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var onclick=String(btn.getAttribute('onclick')||'');
    if(text.indexOf('효과')>-1||onclick.indexOf('ktSoloEffect')>-1)return 'effect';
    if(text.indexOf('보물상자')>-1||onclick.indexOf('ktRenderTreasure')>-1)return 'treasure';
    return '';
  }

  function dedupe(){
    var box=document.querySelector('.ktsolo-right');
    if(!box)return;
    var seen={effect:false,treasure:false};
    Array.prototype.slice.call(box.querySelectorAll('button')).forEach(function(btn){
      var kind=buttonKind(btn);
      if(!kind)return;
      if(seen[kind])btn.remove();
      else seen[kind]=true;
    });
  }

  dedupe();
  var observer=new MutationObserver(function(){dedupe();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
