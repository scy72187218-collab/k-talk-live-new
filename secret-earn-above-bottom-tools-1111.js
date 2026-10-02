/* K-Talk: 비밀방 수익률 위치 전용 1111
   다른 방/기능은 건드리지 않음.
   수익률을 공유·효과·더보기 쪽으로 더 내려서 고정. */
(function(){
  if(window.__ktSecretEarnAboveBottomTools1111)return;
  window.__ktSecretEarnAboveBottomTools1111=true;

  function place(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(!room)return;
      var e=room.querySelector('.ktsecret-earn-row');
      var tools=room.querySelector('.ktsecret-tools');
      if(!e||!tools)return;

      /* 카메라 영역 안에 있으면 툴바 바로 앞으로 빼서 얼굴을 가리지 않게 함 */
      if(e.parentElement!==room){
        room.insertBefore(e,tools);
      }else if(e.nextElementSibling!==tools){
        room.insertBefore(e,tools);
      }

      var btns=[].slice.call(tools.querySelectorAll('.ktsecret-tool'));
      var share=btns.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf('공유')>-1;});
      var effect=btns.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf('효과')>-1;});
      var more=btns.find(function(b){return String(b.textContent||'').replace(/\s+/g,'').indexOf('더보기')>-1;});
      if(!share||!effect||!more)return;

      var rr=room.getBoundingClientRect();
      var sr=share.getBoundingClientRect();
      var mr=more.getBoundingClientRect();
      var hud=e.querySelector('#myEarnHud')||e;
      if(hud!==e){hud.style.setProperty('left','0','important');hud.style.setProperty('transform','none','important');}
      var hr=hud.getBoundingClientRect();
      var w=Math.max(100,Math.round(hr.width||110));
      var h=Math.max(46,Math.round(hr.height||50));
      var left=Math.round(mr.right-w-2);

      e.style.setProperty('position','fixed','important');
      e.style.setProperty('top',Math.round(mr.top-h+44)+'px','important');
      e.style.setProperty('bottom','auto','important');
      e.style.setProperty('left',left+'px','important');
      e.style.setProperty('right','auto','important');
      e.style.setProperty('width',w+'px','important');
      e.style.setProperty('height',h+'px','important');
      e.style.setProperty('margin','0','important');
      e.style.setProperty('z-index','999','important');
      e.style.setProperty('pointer-events','auto','important');
      e.style.setProperty('display','flex','important');
    }catch(e){}
  }

  place();
  [0,60,120,240,500,900,1500,2500].forEach(function(ms){setTimeout(place,ms);});
  setInterval(place,500);
  window.addEventListener('resize',place);
  window.addEventListener('orientationchange',function(){setTimeout(place,120);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretEarnAboveBottomTools1111Timer);
      window.__ktSecretEarnAboveBottomTools1111Timer=setTimeout(place,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();