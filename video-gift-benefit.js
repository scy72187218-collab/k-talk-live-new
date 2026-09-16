/* K-Talk 공개 동영상 장미 혜택/선물 알림 제거. 방송방 선물 기능은 다른 파일에서 그대로 유지. */
(function(){
  if(window.__ktVideoGiftBenefitInstalledV2)return;
  window.__ktVideoGiftBenefitInstalledV2=true;

  function cleanPublicVideoRoseUi(){
    try{
      document.querySelectorAll('.kt-video-rose-rate,.kt-video-gift-toast').forEach(function(el){
        var room=el.closest('.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.ktg13-room');
        if(!room)el.remove();
      });
      document.querySelectorAll('#screen section').forEach(function(sec){
        var isVideo=!!(sec.querySelector('.kt-public-video')||sec.querySelector('#homeVideo')||sec.classList.contains('video-home')||sec.classList.contains('media'));
        if(!isVideo)return;
        sec.querySelectorAll('.kt-video-rose-rate,.kt-video-gift-toast,.kt-feed-rose-button').forEach(function(el){el.remove();});
      });
    }catch(e){}
  }

  cleanPublicVideoRoseUi();
  setTimeout(cleanPublicVideoRoseUi,80);
  setTimeout(cleanPublicVideoRoseUi,300);
  setTimeout(cleanPublicVideoRoseUi,900);
  try{
    var root=document.getElementById('screen')||document.body;
    new MutationObserver(function(){setTimeout(cleanPublicVideoRoseUi,0);}).observe(root,{childList:true,subtree:true});
  }catch(e){}
})();
