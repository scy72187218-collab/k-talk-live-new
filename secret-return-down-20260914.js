/* K-Talk 비밀방: 되돌리기 버튼줄을 조금 더 아래로, 수익창만 오른쪽으로 조금 이동. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktSecretReturnDown20260914)return;
  window.__ktSecretReturnDown20260914=true;
  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(58px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{transform:translateX(8px)!important;}';
  document.head.appendChild(s);
})();
