/* K-Talk: 동영상 위 방송자 표시에서 + 팔로우/종 알림만 숨김.
   프로필, 이름, LIVE, 영상, 방송/채팅/게스트는 변경하지 않음. */
(function(){
  if(window.__ktHideLivePlusBell20260919)return;
  window.__ktHideLivePlusBell20260919=true;

  function style(){
    if(document.getElementById('ktHideLivePlusBellStyle20260919'))return;
    var s=document.createElement('style');
    s.id='ktHideLivePlusBellStyle20260919';
    s.textContent=
      '#ktVideoLivePeek .ktvl-follow,'+
      '#ktVideoLivePeek .ktvl-bell{display:none!important;visibility:hidden!important;pointer-events:none!important;width:0!important;height:0!important;min-width:0!important;max-width:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}';
    document.head.appendChild(s);
  }

  function clean(){
    style();
    var box=document.getElementById('ktVideoLivePeek');
    if(!box)return;
    [].slice.call(box.querySelectorAll('.ktvl-follow,.ktvl-bell')).forEach(function(el){
      try{el.remove();}catch(e){}
    });
  }

  clean();
  [100,300,700,1200,2500].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){setTimeout(clean,20);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();