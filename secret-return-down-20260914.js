/* K-Talk 비밀방: 기존 위치 조정은 그대로 두고, 비밀번호 입력창만 라이브 시작 버튼 위에 보이게. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktSecretReturnDown20260914)return;
  window.__ktSecretReturnDown20260914=true;
  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(58px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{transform:translateX(-52px)!important;}'
    +'.prep-card #ktSecretPasswordBox.on{position:fixed!important;left:18px!important;right:18px!important;bottom:86px!important;z-index:10000!important;display:block!important;margin:0!important;width:auto!important;}';
  document.head.appendChild(s);
})();
