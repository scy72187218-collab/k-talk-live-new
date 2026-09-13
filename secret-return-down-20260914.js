/* K-Talk 비밀방: 되돌리기 버튼이 좋아요 위에서 보이도록 오른쪽 버튼 묶음만 조금 아래로. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktSecretReturnDown20260914)return;
  window.__ktSecretReturnDown20260914=true;
  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(34px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}';
  document.head.appendChild(s);
})();
