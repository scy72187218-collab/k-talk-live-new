/* K-Talk pre-approval 9-room visual clone — 2026-10-01 — PIN 5555
   Only the remote pre-approval 9-cell grid geometry is changed.
   The grid height is copied from its own visible width, matching the first/reference room's square 3x3 layout.
   No signaling, camera, approval, entry/exit, buttons, chat, gifts, or approved-room behavior is changed.
*/
(function(){
  if(window.__ktPreapprovalNineClone5555_20261001)return;
  window.__ktPreapprovalNineClone5555_20261001=true;

  function directKids(el){
    return [].slice.call((el&&el.children)||[]).filter(function(x){return x&&x.nodeType===1;});
  }

  function isNineGrid(el){
    if(!el)return false;
    if(el.closest('.kt-guest-hostlike-room,.kt-remote-bottom,.kt-remote-chat,.kgh-chat,.kgh-quick'))return false;
    var kids=directKids(el);
    if(kids.length!==9)return false;
    var score=0;
    kids.forEach(function(k){
      var t=String(k.textContent||'');
      if(/게스트|호스트/.test(t))score++;
      if(k.querySelector&&k.querySelector('video'))score+=2;
    });
    return score>=4;
  }

  function candidate(root){
    var known=[
      '.kt-prejoin-room-grid',
      '.kt-approved-guest-grid',
      '.kt-guest-room-grid',
      '.ktg13-room[data-kt-room="9"] .ktg13-main'
    ];
    for(var i=0;i<known.length;i++){
      var e=root.querySelector(known[i]);
      if(e&&isNineGrid(e))return e;
    }
    var list=[].slice.call(root.querySelectorAll('div,section,main'));
    var best=null,bestW=0;
    list.forEach(function(el){
      if(!isNineGrid(el))return;
      var r;
      try{r=el.getBoundingClientRect();}catch(e){return;}
      if(r.width>bestW){best=el;bestW=r.width;}
    });
    return best;
  }

  function apply(){
    /* Only remote viewer/pre-approval screen. Host room and approved hostlike room are excluded. */
    var remote=document.querySelector('#screen .kt-remote-live,.kt-remote-live');
    if(!remote)return;
    if(remote.querySelector('.kt-guest-hostlike-room'))return;

    var grid=candidate(remote)||candidate(document.getElementById('screen')||document.body);
    if(!grid)return;

    var rect;
    try{rect=grid.getBoundingClientRect();}catch(e){return;}
    var width=Math.round(rect.width||0);
    if(width<180)return;

    /* Same visual rule as the first/reference room: 3x3 grid height follows its visible width. */
    var h=width;
    grid.setAttribute('data-kt-preapproval-nine-clone-5555','1');
    grid.style.setProperty('display','grid','important');
    grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('gap','2px','important');
    grid.style.setProperty('flex','0 0 '+h+'px','important');
    grid.style.setProperty('height',h+'px','important');
    grid.style.setProperty('min-height',h+'px','important');
    grid.style.setProperty('max-height',h+'px','important');
    grid.style.setProperty('overflow','hidden','important');

    directKids(grid).forEach(function(cell){
      cell.style.setProperty('min-width','0','important');
      cell.style.setProperty('min-height','0','important');
      cell.style.setProperty('width','auto','important');
      cell.style.setProperty('height','auto','important');
    });
  }

  apply();
  [40,120,300,650,1200,2200,3500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,50);});
  window.addEventListener('pageshow',function(){setTimeout(apply,80);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktPreapprovalNineClone5555Timer);
      window.__ktPreapprovalNineClone5555Timer=setTimeout(apply,45);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();