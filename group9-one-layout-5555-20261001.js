/* K-Talk 9-room ONE visual layout — 2026-10-01 — PIN 5555
   Single visual rule for ALL 9-person room states:
   host / remote pre-approval / approved guest.
   Reference = the user's preferred first/left room: square 3x3 grid.
   VISUAL ONLY. Do not change signaling, camera, approval, entry/exit, buttons, chat, gifts, switches.
*/
(function(){
  if(window.__ktGroup9OneVisual5555_20261001)return;
  window.__ktGroup9OneVisual5555_20261001=true;

  function directKids(el){
    return [].slice.call((el&&el.children)||[]).filter(function(x){return x&&x.nodeType===1;});
  }

  function nineGridCandidates(){
    var out=[];
    function add(el){if(el&&out.indexOf(el)<0)out.push(el);}

    /* host / remote-host-body 9 room */
    document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"] .ktg13-main').forEach(add);

    /* approved guest 9 room */
    document.querySelectorAll('#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main').forEach(add);

    /* pre-approval / transition grids */
    document.querySelectorAll(
      '#screen .kt-remote-live .kt-prejoin-room-grid,'+
      '#screen .kt-remote-live .kt-approved-guest-grid,'+
      '#screen .kt-remote-live .kt-guest-room-grid'
    ).forEach(function(el){
      var kids=directKids(el);
      if(kids.length===9)add(el);
    });

    /* fallback: any visible 9-cell remote grid containing host/guest labels or video */
    document.querySelectorAll('#screen .kt-remote-live div,#screen .kt-remote-live section,#screen .kt-remote-live main').forEach(function(el){
      if(el.closest('.kt-remote-bottom,.kt-remote-chat,.kgh-chat,.kgh-quick'))return;
      var kids=directKids(el);
      if(kids.length!==9)return;
      var score=0;
      kids.forEach(function(k){
        if(/게스트|호스트/.test(String(k.textContent||'')))score++;
        if(k.querySelector&&k.querySelector('video'))score+=2;
      });
      if(score>=4)add(el);
    });
    return out;
  }

  function applyGrid(grid){
    var r;
    try{r=grid.getBoundingClientRect();}catch(e){return;}
    var w=Math.round(r.width||0);
    if(w<180)return;

    /* Preferred first-room rule: grid height = visible grid width. */
    var h=w+'px';
    grid.setAttribute('data-kt-one-9-layout-5555','1');
    grid.style.setProperty('display','grid','important');
    grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('gap','2px','important');
    grid.style.setProperty('flex','0 0 '+h,'important');
    grid.style.setProperty('height',h,'important');
    grid.style.setProperty('min-height',h,'important');
    grid.style.setProperty('max-height','none','important');
    grid.style.setProperty('overflow','hidden','important');

    directKids(grid).forEach(function(cell){
      cell.style.setProperty('min-width','0','important');
      cell.style.setProperty('min-height','0','important');
      cell.style.setProperty('width','auto','important');
      cell.style.setProperty('height','auto','important');
    });
  }

  function apply(){
    nineGridCandidates().forEach(applyGrid);
  }

  apply();
  [30,100,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,50);});
  window.addEventListener('pageshow',function(){setTimeout(apply,80);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9OneVisual5555Timer);
      window.__ktGroup9OneVisual5555Timer=setTimeout(apply,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();