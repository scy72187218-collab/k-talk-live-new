/* K-Talk 비밀방: 되돌리기 버튼줄 위치는 그대로 두고, 매치가 가리지 않게 수익창만 옆으로 더 이동. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktSecretReturnDown20260914)return;
  window.__ktSecretReturnDown20260914=true;
  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(58px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{transform:translateX(-52px)!important;}';
  document.head.appendChild(s);
})();
