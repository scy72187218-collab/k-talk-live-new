/* K-Talk: hide guest request/approval notices from bottom chat only.
   Keep upper guest request UI and all normal chat untouched. 1150617 */
(function(){
  if(window.__ktHideGuestRequestBottomChat20261005)return;
  window.__ktHideGuestRequestBottomChat20261005=true;

  function isGuestNotice(text){
    text=String(text||'').replace(/\s+/g,' ').trim();
    if(!text)return false;
    return /방송 참여 신청|방송 참여를 신청|참여 신청 취소|참여를 승인|참여 승인|승인되었습니다|승인됐습니다/.test(text);
  }

  function cleanBox(box){
    if(!box)return;
    Array.prototype.slice.call(box.children||[]).forEach(function(line){
      try{
        if(isGuestNotice(line.textContent||''))line.remove();
      }catch(e){}
    });
  }

  function clean(){
    try{
      document.querySelectorAll(
        '#screen .ktg13-chat,'+
        '#screen .kt-remote-chat,'+
        '#screen .ktsolo-chat,'+
        '#screen .ktsubscriber-chat,'+
        '#screen .ktsecret-chat'
      ).forEach(cleanBox);
    }catch(e){}
  }

  clean();
  try{
    new MutationObserver(function(){clean();})
      .observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  }catch(e){}
  setInterval(clean,700);
})();