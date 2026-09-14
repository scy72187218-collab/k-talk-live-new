/* K-Talk 호스트 방송 화면 채팅 높이/위치만 보강: 1인·9명·13명·구독자·비밀방 공통. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktHostChatFloatAllRooms20260914)return;
  window.__ktHostChatFloatAllRooms20260914=true;

  function install(){
    if(document.getElementById('ktHostChatFloatAllRoomsStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostChatFloatAllRoomsStyle';
    s.textContent=''
      /* 1인 방송: 카메라 위 채팅을 어깨 높이까지 위로 쌓이게 */
      +'.ktsolo-main{position:relative!important}'
      +'.ktsolo-chat{left:8px!important;right:120px!important;bottom:70px!important;height:min(36vh,280px)!important;max-height:min(36vh,280px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 5px 7px!important;background:transparent!important;border-radius:0!important;z-index:12!important;pointer-events:none!important}'
      +'.ktsolo-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsolo-chat-line b,.ktsolo-chat-line span{font-size:11.5px!important}'

      /* 9명/13명 방송: 아래 짧은 칸이 아니라 메인 화면 위로 떠서 위쪽까지 표시 */
      +'.ktg13-mid{position:relative!important;overflow:visible!important}'
      +'.ktg13-chat{position:absolute!important;left:6px!important;right:auto!important;bottom:0!important;width:57%!important;height:min(35vh,285px)!important;max-height:min(35vh,285px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 6px 7px!important;background:transparent!important;border-radius:0!important;z-index:35!important;pointer-events:none!important}'
      +'.ktg13-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktg13-chat-line b,.ktg13-chat-line span{font-size:11.5px!important}'
      +'.ktg13-chat .ktGuestPendingLine{pointer-events:auto!important}'

      /* 구독자 방송: 정보칸 안에 갇히지 않고 화면 위로 떠서 표시 */
      +'.ktsubscriber-main{position:relative!important}'
      +'.ktsubscriber-info{overflow:visible!important;position:relative!important;z-index:12!important}'
      +'.ktsubscriber-leftinfo{overflow:visible!important;position:relative!important}'
      +'.ktsubscriber-chat{position:absolute!important;left:5px!important;right:4px!important;bottom:0!important;width:auto!important;height:min(35vh,285px)!important;max-height:min(35vh,285px)!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:5px 5px 7px!important;background:transparent!important;border-radius:0!important;z-index:20!important;pointer-events:none!important}'
      +'.ktsubscriber-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsubscriber-chat-line b,.ktsubscriber-chat-line span{font-size:11.5px!important}'

      /* 비밀방: 기존 위치는 유지하고 높이만 같은 느낌으로 위까지 확장 */
      +'.ktsecret-main{position:relative!important}'
      +'.ktsecret-chat{bottom:70px!important;height:min(38vh,300px)!important;max-height:min(38vh,300px)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;background:transparent!important;z-index:22!important;pointer-events:none!important}'
      +'.ktsecret-chat-line{margin-top:5px!important;font-size:11.5px!important;line-height:1.28!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsecret-chat-line b,.ktsecret-chat-line span{font-size:11.5px!important}'

      +'@media(max-width:390px){'
        +'.ktsolo-chat{right:105px!important;bottom:64px!important;height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktg13-chat{left:4px!important;width:60%!important;height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktsubscriber-chat{height:min(34vh,250px)!important;max-height:min(34vh,250px)!important}'
        +'.ktsecret-chat{bottom:64px!important;height:min(36vh,270px)!important;max-height:min(36vh,270px)!important}'
        +'.ktsolo-chat-line,.ktsolo-chat-line b,.ktsolo-chat-line span,.ktg13-chat-line,.ktg13-chat-line b,.ktg13-chat-line span,.ktsubscriber-chat-line,.ktsubscriber-chat-line b,.ktsubscriber-chat-line span,.ktsecret-chat-line,.ktsecret-chat-line b,.ktsecret-chat-line span{font-size:10.5px!important}'
      +'}';
    document.head.appendChild(s);
  }

  install();
  document.addEventListener('DOMContentLoaded',install);
})();
