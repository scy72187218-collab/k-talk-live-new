/* 1111: 1인 방송에서 수익률/되돌리기 위치만 아래로. 다른 기능 금지. */
(function(){
  if(window.__ktSoloEarnUndoLower20261002)return;
  window.__ktSoloEarnUndoLower20261002=true;

  function ensureStyle(){
    if(document.getElementById('ktSoloEarnUndoLowerStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktSoloEarnUndoLowerStyle20261002';
    s.textContent=''
      +'#screen .ktsolo-room .ktsolo-earn{'
        +'top:auto!important;left:auto!important;right:6px!important;bottom:62px!important;'
        +'transform:scale(.58)!important;transform-origin:bottom right!important;z-index:23!important}'
      +'#screen .ktsolo-room .ktsolo-right{'
        +'top:auto!important;right:8px!important;bottom:124px!important;z-index:24!important}'
      +'@media(max-width:390px){'
        +'#screen .ktsolo-room .ktsolo-earn{right:5px!important;bottom:58px!important;transform:scale(.56)!important}'
        +'#screen .ktsolo-room .ktsolo-right{right:6px!important;bottom:116px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    ensureStyle();
    var room=document.querySelector('#screen .ktsolo-room');
    if(!room)return;
    var earn=room.querySelector('.ktsolo-earn');
    if(earn){
      earn.style.setProperty('top','auto','important');
      earn.style.setProperty('left','auto','important');
      earn.style.setProperty('right','6px','important');
      earn.style.setProperty('bottom','62px','important');
      earn.style.setProperty('z-index','23','important');
      earn.style.setProperty('transform','scale(.58)','important');
    }
    var right=room.querySelector('.ktsolo-right');
    if(right){
      right.style.setProperty('top','auto','important');
      right.style.setProperty('right','8px','important');
      right.style.setProperty('bottom','124px','important');
      right.style.setProperty('z-index','24','important');
    }
  }

  apply();
  [60,180,450,900].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSoloEarnUndoLowerTimer20261002);
      window.__ktSoloEarnUndoLowerTimer20261002=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();