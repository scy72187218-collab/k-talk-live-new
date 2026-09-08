/* K-Talk LIVE: move ONLY the single right-side gift button. Keep all other live-room UI unchanged. */
(function(){
  if(window.__ktGiftPositionOnlyFixLoaded)return;
  window.__ktGiftPositionOnlyFixLoaded=true;

  function findGift(){
    var room=document.getElementById('ktSept2Live');
    if(!room)return null;
    var side=room.querySelector('.kt-s2-right');
    if(!side)return null;
    var buttons=[].slice.call(side.querySelectorAll('button'));
    for(var i=0;i<buttons.length;i++){
      var b=buttons[i];
      var oc=String(b.getAttribute('onclick')||'');
      var txt=String(b.textContent||'');
      if(oc.indexOf('openGifts')>-1||txt.indexOf('🎁')>-1||txt.indexOf('선물')>-1)return b;
    }
    return null;
  }

  function placeGift(){
    var room=document.getElementById('ktSept2Live');
    if(!room)return;
    var gift=findGift();
    if(!gift)return;

    var side=gift.parentNode;
    if(side&&side.classList&&side.classList.contains('kt-s2-right')){
      var ph=document.getElementById('ktGiftPositionPlaceholder');
      if(!ph){
        ph=document.createElement('span');
        ph.id='ktGiftPositionPlaceholder';
        ph.setAttribute('aria-hidden','true');
        ph.style.cssText='display:block;width:54px;height:54px;visibility:hidden;pointer-events:none;';
        side.insertBefore(ph,gift);
      }
      room.appendChild(gift);
    }

    gift.id='ktMovedGiftButton';
    gift.style.setProperty('position','fixed','important');
    gift.style.setProperty('right','auto','important');
    gift.style.setProperty('bottom','auto','important');
    gift.style.setProperty('transform','translateX(-50%)','important');
    gift.style.setProperty('z-index','18','important');

    var earn=document.getElementById('myEarnHud');
    if(earn){
      var er=earn.getBoundingClientRect();
      var gr=gift.getBoundingClientRect();
      var h=gr.height||54;
      gift.style.setProperty('left',(er.left+er.width/2)+'px','important');
      gift.style.setProperty('top',Math.max(8,er.top-h-10)+'px','important');
    }else{
      gift.style.setProperty('left','50%','important');
      gift.style.setProperty('top','auto','important');
      gift.style.setProperty('bottom','118px','important');
    }
  }

  function tick(){
    var moved=document.getElementById('ktMovedGiftButton');
    if(moved){
      var earn=document.getElementById('myEarnHud');
      if(earn){
        var er=earn.getBoundingClientRect();
        var gr=moved.getBoundingClientRect();
        moved.style.setProperty('left',(er.left+er.width/2)+'px','important');
        moved.style.setProperty('top',Math.max(8,er.top-(gr.height||54)-10)+'px','important');
      }
      return;
    }
    placeGift();
  }

  try{
    new MutationObserver(function(){setTimeout(tick,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(tick,0);});
  setInterval(tick,700);
  setTimeout(tick,100);
  setTimeout(tick,500);
})();
