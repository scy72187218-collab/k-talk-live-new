/* K-Talk 9명방 하단 도구줄만 조금 아래로 이동.
   매치/친구/메시지/장미/선물/공유/효과/더보기 외 다른 화면은 변경하지 않음. */
(function(){
  if(window.__ktGroup9BottomToolsLower20260919)return;
  window.__ktGroup9BottomToolsLower20260919=true;

  function install(){
    if(document.getElementById('ktGroup9BottomToolsLowerStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup9BottomToolsLowerStyle';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-tools{'
      +'transform:translateY(10px)!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-tool span{'
      +'color:#fff!important;'
      +'position:relative!important;'
      +'z-index:32!important;'
      +'}';
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();