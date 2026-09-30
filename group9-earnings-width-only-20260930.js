/* 9명방 수익률 노란칸 가로폭만 축소 — 5555
   다른 방/버튼/위치/기능은 변경하지 않음 */
(function(){
  if(window.__ktGroup9EarningsWidthOnly5555)return;
  window.__ktGroup9EarningsWidthOnly5555=true;

  function isGroup9(){
    try{
      if(window.state){
        if(state.liveRoomType==='group9') return true;
        if(String(state.liveRoomName||'').indexOf('9명')>-1) return true;
        if(String(state.currentLiveRoomTitle||'').indexOf('9명')>-1) return true;
      }
    }catch(e){}
    var s=document.getElementById('screen');
    if(!s)return false;
    var txt=String(s.innerText||'');
    return txt.indexOf('9명 방송')>-1 && txt.indexOf('ON AIR')>-1;
  }

  function apply(){
    if(!isGroup9())return;

    var nodes=[].slice.call(document.querySelectorAll('#screen button,#screen div'));
    nodes.forEach(function(el){
      try{
        var t=String(el.innerText||'').replace(/\s+/g,' ');
        if(t.indexOf('내 수익')<0)return;
        if(t.indexOf('송이')<0 && t.indexOf('%')<0)return;

        var r=el.getBoundingClientRect();
        if(r.width<120 || r.width>360)return;

        el.style.setProperty('width','210px','important');
        el.style.setProperty('min-width','0','important');
        el.style.setProperty('max-width','210px','important');
        el.style.setProperty('box-sizing','border-box','important');
        el.style.setProperty('left','auto','important');
        el.style.setProperty('right','8px','important');
        el.style.setProperty('transform','none','important');
        el.style.setProperty('animation','none','important');
        el.style.setProperty('transition','none','important');

        var p=el.parentElement;
        if(p){
          var pt=String(p.innerText||'').replace(/\s+/g,' ');
          if(pt.indexOf('내 수익')>-1 && p.children.length<=3){
            p.style.setProperty('width','210px','important');
            p.style.setProperty('min-width','0','important');
            p.style.setProperty('max-width','210px','important');
            p.style.setProperty('left','auto','important');
            p.style.setProperty('right','8px','important');
            p.style.setProperty('transform','none','important');
          }
        }
      }catch(e){}
    });
  }

  apply();
  [80,180,350,700,1200,2000].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,900);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9EarnWidthTimer);
      window.__ktG9EarnWidthTimer=setTimeout(apply,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();