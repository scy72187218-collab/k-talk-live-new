/* K-Talk 1인방 채팅 위치 최종 보강.
   1인방 채팅만 파장 아래쪽에서 시작해 위로 쌓이게 한다.
   다른 방/버튼/카메라/선물/프로필/스위치는 변경하지 않음. */
(function(){
  if(window.__ktSoloChatUnderWave20260920)return;
  window.__ktSoloChatUnderWave20260920=true;

  function install(){
    var old=document.getElementById('ktSoloChatUnderWaveStyle20260920');
    if(old)old.remove();

    var s=document.createElement('style');
    s.id='ktSoloChatUnderWaveStyle20260920';
    s.textContent=[
      '.ktsolo-main{position:relative!important}',
      '.ktsolo-main .ktsolo-chat{',
        'position:absolute!important;',
        'left:10px!important;',
        'right:108px!important;',
        'top:auto!important;',
        'bottom:60px!important;',
        'width:auto!important;',
        'height:185px!important;',
        'min-height:0!important;',
        'max-height:185px!important;',
        'display:flex!important;',
        'flex-direction:column!important;',
        'justify-content:flex-end!important;',
        'overflow:hidden!important;',
        'padding:4px 5px!important;',
        'margin:0!important;',
        'background:transparent!important;',
        'border:0!important;',
        'box-shadow:none!important;',
        'transform:none!important;',
        'z-index:40!important;',
        'pointer-events:none!important;',
      '}',
      '.ktsolo-main .ktsolo-chat-line{',
        'flex:0 0 auto!important;',
        'margin-top:4px!important;',
        'animation:ktSoloChatFromUnderWave .24s ease-out both!important;',
      '}',
      '.ktsolo-main .ktsolo-chat:empty:before{',
        'align-self:flex-start!important;',
        'margin:0!important;',
      '}',
      '@keyframes ktSoloChatFromUnderWave{',
        'from{opacity:.05;transform:translateY(18px)}',
        'to{opacity:1;transform:translateY(0)}',
      '}',
      '@media(max-width:390px){',
        '.ktsolo-main .ktsolo-chat{left:7px!important;right:98px!important;bottom:56px!important;height:165px!important;max-height:165px!important}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  function placeOldHint(){
    try{
      var main=document.querySelector('.ktsolo-main');
      if(!main)return;
      var target='채팅을 입력하면 아래에서 위로 올라옵니다';
      main.querySelectorAll('*').forEach(function(el){
        if(el.children.length)return;
        var t=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(t!==target)return;
        el.style.setProperty('position','absolute','important');
        el.style.setProperty('left','14px','important');
        el.style.setProperty('right','108px','important');
        el.style.setProperty('top','auto','important');
        el.style.setProperty('bottom','62px','important');
        el.style.setProperty('z-index','41','important');
        el.style.setProperty('background','transparent','important');
        el.style.setProperty('border','0','important');
        el.style.setProperty('pointer-events','none','important');
      });
    }catch(e){}
  }

  function run(){
    install();
    placeOldHint();
    try{
      var box=document.getElementById('ktsoloChatList');
      if(box)box.scrollTop=box.scrollHeight;
    }catch(e){}
  }

  run();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(run,ms)});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloChatUnderWaveTimer);
      window.__ktSoloChatUnderWaveTimer=setTimeout(run,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();