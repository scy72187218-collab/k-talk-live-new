/* 9-room HOST only: compact the two action rows to free vertical space.
   Rows:
   1) 일일 랭킹 / 미션 / 시청자
   2) 되돌리기 / 보물상자 / 매치
   Keep all buttons and actions. Visual spacing only. */
(function(){
  if(window.__ktG9HostTopActionRowsCompact20261002)return;
  window.__ktG9HostTopActionRowsCompact20261002=true;

  function txt(el){return String((el&&el.textContent)||'').replace(/\s+/g,'');}

  function rowFor(room, words){
    var els=[].slice.call(room.querySelectorAll('div,section,nav'));
    return els.find(function(el){
      var t=txt(el);
      if(!words.every(function(w){return t.indexOf(w)>=0;}))return false;
      var buttons=el.querySelectorAll(':scope > button, :scope > * > button');
      return buttons.length>=3 && buttons.length<=6;
    })||null;
  }

  function compact(row,h,up){
    if(!row)return;
    row.style.setProperty('height',h+'px','important');
    row.style.setProperty('min-height',h+'px','important');
    row.style.setProperty('max-height',h+'px','important');
    row.style.setProperty('flex','0 0 '+h+'px','important');
    row.style.setProperty('gap','4px','important');
    row.style.setProperty('margin-top',up+'px','important');
    row.style.setProperty('margin-bottom','2px','important');
    row.style.setProperty('padding-top','0','important');
    row.style.setProperty('padding-bottom','0','important');

    row.querySelectorAll('button').forEach(function(b){
      b.style.setProperty('height',h+'px','important');
      b.style.setProperty('min-height',h+'px','important');
      b.style.setProperty('padding','0 4px','important');
      b.style.setProperty('font-size','10px','important');
      b.style.setProperty('line-height','1','important');
      b.style.setProperty('border-radius','9px','important');
    });
  }

  function apply(){
    var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
    if(!room)return;

    var row1=rowFor(room,['일일랭킹','미션','시청자']);
    var row2=rowFor(room,['되돌리기','보물상자','매치']);

    compact(row1,31,-2);
    compact(row2,29,-2);
  }

  apply();
  [20,60,120,250,500,900,1600,2800].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,50);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9HostTopActionRowsCompactTimer20261002);
      window.__ktG9HostTopActionRowsCompactTimer20261002=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();