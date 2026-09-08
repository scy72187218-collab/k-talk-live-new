/* K-Talk 1인/구독자/비밀방 오른쪽 퀵버튼만 정리: 좋아요 아래 선물 버튼 제거 -> 효과 -> 보물상자 -> 매치. */
(function(){
  if(window.__ktThreeRoomSideActionsInstalled)return;
  window.__ktThreeRoomSideActionsInstalled=true;

  function treasure(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts)window.openGifts();}catch(e){}
  }
  window.ktRoomQuickTreasure=treasure;

  function fixBox(selector,effectFn){
    var box=document.querySelector(selector);
    if(!box)return;

    var buttons=Array.from(box.children).filter(function(el){return el&&el.tagName==='BUTTON';});
    var like=buttons.find(function(b){return b.classList.contains('like');})||null;
    var effect=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf(effectFn)>-1;})||null;
    var match=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('openHostMatchArena')>-1;})||null;

    buttons.forEach(function(b){
      var oc=String(b.getAttribute('onclick')||'');
      if(oc.indexOf('openGifts()')>-1 && !b.hasAttribute('data-kt-quick-treasure')){
        b.remove();
      }
    });

    if(!effect){
      effect=document.createElement('button');
      effect.type='button';
      effect.setAttribute('onclick','if(window.'+effectFn+')window.'+effectFn+'()');
      effect.innerHTML='✨<small>효과</small>';
    }

    var chest=box.querySelector('[data-kt-quick-treasure]');
    if(!chest){
      chest=document.createElement('button');
      chest.type='button';
      chest.setAttribute('data-kt-quick-treasure','1');
      chest.setAttribute('aria-label','보물상자');
      chest.setAttribute('onclick','ktRoomQuickTreasure()');
      chest.innerHTML='🎁<small>보물상자</small>';
    }

    var keep=Array.from(box.children).filter(function(el){
      return el!==like&&el!==effect&&el!==chest&&el!==match;
    });
    if(like)box.appendChild(like);
    box.appendChild(effect);
    box.appendChild(chest);
    if(match)box.appendChild(match);
    keep.forEach(function(el){box.appendChild(el);});
  }

  function apply(){
    fixBox('.ktsolo-right','ktSoloEffect');
    fixBox('.ktsubscriber-right','ktSubscriberEffect');
    fixBox('.ktsecret-right','ktSecretEffect');
  }

  var observer=new MutationObserver(function(){apply();});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setInterval(apply,900);
})();
