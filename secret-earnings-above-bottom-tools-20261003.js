/* K-Talk secret room: keep earnings below guest faces, directly above Share/Effect/More row only. */
(function(){
  if(window.__ktSecretEarnAboveBottomTools20261003)return;
  window.__ktSecretEarnAboveBottomTools20261003=true;

  function place(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      var earn=room&&room.querySelector('.ktsecret-earn-row');
      var tools=room&&room.querySelector('.ktsecret-tools');
      if(!room||!earn||!tools)return;

      var buttons=tools.querySelectorAll('.ktsecret-tool');
      var more=buttons&&buttons.length?buttons[buttons.length-1]:null;
      var mr=more&&more.getBoundingClientRect?more.getBoundingClientRect():null;
      var er=earn.getBoundingClientRect?earn.getBoundingClientRect():null;
      if(!mr||!er||!isFinite(mr.top)||!isFinite(mr.right))return;

      earn.style.setProperty('position','fixed','important');
      earn.style.setProperty('left','auto','important');
      earn.style.setProperty('bottom','auto','important');
      earn.style.setProperty('top',Math.max(8,Math.round(mr.top-(er.height||50)-6))+'px','important');
      earn.style.setProperty('right',Math.max(6,Math.round(window.innerWidth-mr.right))+'px','important');
      earn.style.setProperty('z-index','2147483001','important');
      earn.style.setProperty('transform','none','important');
    }catch(e){}
  }

  place();
  [50,150,300,700,1200].forEach(function(ms){setTimeout(place,ms);});
  window.addEventListener('resize',function(){setTimeout(place,30);});
  window.addEventListener('orientationchange',function(){setTimeout(place,120);});
  setInterval(place,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretEarnAboveToolsTimer20261003);
      window.__ktSecretEarnAboveToolsTimer20261003=setTimeout(place,40);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();