/* K-Talk 채팅 잠금 해제 전용 (2026-09-19)
   채팅 입력/메시지 버튼만 해제. 위치/방송/게스트/카메라/기타 UI는 변경하지 않음. */
(function(){
  if(window.__ktChatUnlock20260919)return;
  window.__ktChatUnlock20260919=true;

  var chatRoots=[
    '.ktsolo-chat',
    '.ktg13-chat',
    '.ktsubscriber-chat',
    '.ktsecret-chat',
    '.kgh-chat',
    '.kgh-chatbox',
    '.kt-remote-chat',
    '.kt-remote-bottom',
    '[class*="chat"]'
  ].join(',');

  function unlockEl(el){
    if(!el)return;
    try{
      if('disabled' in el)el.disabled=false;
      if(el.hasAttribute('readonly'))el.removeAttribute('readonly');
      if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
      if(el.hasAttribute('inert'))el.removeAttribute('inert');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
    }catch(e){}
  }

  function unlock(root){
    root=root||document;
    var roots=[];
    try{
      if(root.matches&&root.matches(chatRoots))roots.push(root);
      if(root.querySelectorAll)roots=roots.concat([].slice.call(root.querySelectorAll(chatRoots)));
    }catch(e){}

    roots.forEach(function(box){
      unlockEl(box);
      try{
        box.querySelectorAll('input,textarea,button,[contenteditable],[role="button"]').forEach(unlockEl);
      }catch(e){}
    });

    /* 채팅 열기/메시지 버튼도 해제 */
    try{
      document.querySelectorAll(
        '.ktsolo-tool,.ktg13-tool,.ktsubscriber-tool,.ktsecret-tool,.kgh-tool,'+
        'button[aria-label*="메시지"],button[aria-label*="채팅"]'
      ).forEach(function(btn){
        var txt=String(btn.textContent||btn.getAttribute('aria-label')||'').replace(/\s+/g,'');
        if(txt.indexOf('메시지')>-1||txt.indexOf('채팅')>-1)unlockEl(btn);
      });
    }catch(e){}
  }

  function refresh(){unlock(document);}
  refresh();
  [80,220,500,1000,1800,3000].forEach(function(ms){setTimeout(refresh,ms);});

  try{
    new MutationObserver(function(records){
      var need=false;
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(n&&n.nodeType===1)need=true;
        });
      });
      if(need){
        clearTimeout(window.__ktChatUnlockTimer);
        window.__ktChatUnlockTimer=setTimeout(refresh,25);
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
})();