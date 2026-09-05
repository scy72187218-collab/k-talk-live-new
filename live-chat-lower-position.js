/* K-Talk LIVE: keep the chat closer to the bottom without changing room layouts. */
(function(){
  if(window.__ktLiveChatLowerPositionLoaded)return;
  window.__ktLiveChatLowerPositionLoaded=true;
  var s=document.createElement('style');
  s.id='ktLiveChatLowerPositionCss';
  s.textContent='\
#ktRoomChat{bottom:72px!important;}\
#ktRoomChat.host-only{bottom:115px!important;}\
#ktRoomChatLog{max-height:100px!important;}\
@media(max-width:430px){#ktRoomChat{bottom:68px!important;}#ktRoomChat.host-only{bottom:108px!important;}#ktRoomChatLog{max-height:92px!important;}}';
  document.head.appendChild(s);
})();
