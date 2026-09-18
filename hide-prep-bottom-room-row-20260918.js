/* K-Talk 방송 준비화면 하단 방 선택 5개 줄 숨김.
   방 권한/레벨/방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktHidePrepBottomRoomRow20260918)return;
  window.__ktHidePrepBottomRoomRow20260918=true;

  function ensureStyle(){
    if(document.getElementById('ktHidePrepBottomRoomRowStyle'))return;
    var s=document.createElement('style');
    s.id='ktHidePrepBottomRoomRowStyle';
    s.textContent=''
      +'.live-prep .prep-bottom.kt-room-bottom5{display:none!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}'
      +'.live-prep .kt-room-bottom5{display:none!important}';
    document.head.appendChild(s);
  }

  function hide(){
    ensureStyle();
    try{
      document.querySelectorAll('.live-prep .prep-bottom.kt-room-bottom5,.live-prep .kt-room-bottom5').forEach(function(el){
        el.style.setProperty('display','none','important');
        el.style.setProperty('height','0','important');
        el.style.setProperty('margin','0','important');
        el.style.setProperty('padding','0','important');
      });
    }catch(e){}
  }

  hide();
  new MutationObserver(function(){setTimeout(hide,0);}).observe(document.documentElement,{childList:true,subtree:true});
})();