/* K-Talk 방송 채팅만 영상 위에 공중에 떠 보이게 배치. 입력/순서/다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktFloatingChatInstalled)return;
  window.__ktFloatingChatInstalled=true;

  var style=document.createElement('style');
  style.id='ktFloatingChatStyle';
  style.textContent=''
    +'.ktsolo-chat,.ktsubscriber-chat,.ktsecret-chat{'
      +'position:absolute!important;left:12px!important;right:92px!important;bottom:168px!important;'
      +'height:auto!important;max-height:148px!important;padding:0!important;margin:0!important;'
      +'background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;'
      +'display:flex!important;flex-direction:column!important;justify-content:flex-end!important;gap:4px!important;'
      +'overflow:hidden!important;pointer-events:none!important;z-index:45!important}'
    +'.ktg13-room .ktg13-chat{'
      +'position:fixed!important;left:12px!important;right:auto!important;bottom:168px!important;width:min(48vw,520px)!important;'
      +'height:auto!important;max-height:148px!important;padding:0!important;margin:0!important;'
      +'background:transparent!important;border:0!important;box-shadow:none!important;'
      +'display:flex!important;flex-direction:column!important;justify-content:flex-end!important;gap:4px!important;'
      +'overflow:hidden!important;pointer-events:none!important;z-index:45!important}'
    +'.ktsolo-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.ktg13-chat-line{'
      +'width:max-content!important;max-width:100%!important;align-self:flex-start!important;'
      +'margin:0!important;padding:4px 8px!important;border-radius:12px!important;'
      +'background:rgba(0,0,0,.34)!important;box-shadow:0 3px 10px rgba(0,0,0,.22)!important;'
      +'text-shadow:0 1px 3px #000,0 0 5px #000!important}'
    +'.ktsolo-chat:empty::before,.ktsubscriber-chat:empty::before,.ktsecret-chat:empty::before,.ktg13-chat:empty::before{'
      +'background:rgba(0,0,0,.24)!important;border-radius:10px!important;padding:4px 7px!important;width:max-content!important;max-width:100%!important}'
    +'@media(max-width:390px){'
      +'.ktsolo-chat,.ktsubscriber-chat,.ktsecret-chat{left:8px!important;right:70px!important;bottom:154px!important;max-height:132px!important}'
      +'.ktg13-room .ktg13-chat{left:8px!important;bottom:154px!important;width:calc(100vw - 82px)!important;max-height:132px!important}'
      +'.ktsolo-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,.ktg13-chat-line{padding:3px 6px!important;border-radius:10px!important}'
    +'}';
  document.head.appendChild(style);
})();
