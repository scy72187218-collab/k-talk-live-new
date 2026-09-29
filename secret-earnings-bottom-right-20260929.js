/* K-Talk 비밀방 수익률 위치만 수정: 오른쪽 아래, 공유/효과/더보기 바로 위 */
(function(){
  if(window.__ktSecretEarningsBottomRight20260929)return;
  window.__ktSecretEarningsBottomRight20260929=true;

  function install(){
    var old=document.getElementById('ktSecretEarningsBottomRightStyle20260929');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktSecretEarningsBottomRightStyle20260929';
    s.textContent=''
      +'#screen .ktsecret-room .ktsecret-main{position:relative!important;}'
      +'#screen .ktsecret-room .ktsecret-earn-row{'
        +'position:absolute!important;'
        +'right:6px!important;'
        +'left:auto!important;'
        +'top:auto!important;'
        +'bottom:4px!important;'
        +'width:92px!important;'
        +'height:50px!important;'
        +'margin:0!important;'
        +'padding:0!important;'
        +'z-index:45!important;'
        +'display:flex!important;'
        +'align-items:flex-end!important;'
        +'justify-content:flex-end!important;'
        +'transform:none!important;'
      +'}'
      +'#screen .ktsecret-room .ktsecret-earn-row #myEarnHud{'
        +'width:92px!important;max-width:92px!important;min-width:92px!important;'
        +'height:50px!important;max-height:50px!important;'
        +'margin:0!important;transform:none!important;'
      +'}'
      +'@media(max-width:390px){'
        +'#screen .ktsecret-room .ktsecret-earn-row{right:4px!important;bottom:3px!important;}'
      +'}';
    document.head.appendChild(s);
  }

  install();
  [100,300,700,1400].forEach(function(ms){setTimeout(install,ms);});
})();