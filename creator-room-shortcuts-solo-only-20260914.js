/* K-Talk 촬영 화면: 방송 바로가기 줄은 숨기고, 라이브 준비 기본방은 1인 방송으로 맞춤. 다른 UI 변경 없음. */
(function(){
  if(window.__ktCreatorRoomShortcutsSoloOnly20260914)return;
  window.__ktCreatorRoomShortcutsSoloOnly20260914=true;

  var s=document.createElement('style');
  s.id='ktCreatorRoomShortcutsSoloOnly20260914Style';
  s.textContent='.creator .kt-creator-room-shortcuts{display:none!important;}';
  document.head.appendChild(s);

  function setSoloDefault(){
    try{
      if(window.state){
        state.liveRoomType='solo';
        state.liveRoomName='1인 방송';
        state.liveRoomMax=1;
      }
      var buttons=[].slice.call(document.querySelectorAll('.live-prep .room-switch'));
      buttons.forEach(function(b){
        var on=String(b.textContent||'').replace(/\s+/g,'').indexOf('1인방송')>-1;
        b.classList.toggle('on',on);
        b.setAttribute('aria-pressed',on?'true':'false');
      });
    }catch(e){}
  }

  var oldOpen=window.openTikLivePrep;
  if(typeof oldOpen==='function'){
    window.openTikLivePrep=function(){
      setSoloDefault();
      return oldOpen.apply(this,arguments);
    };
  }
})();
