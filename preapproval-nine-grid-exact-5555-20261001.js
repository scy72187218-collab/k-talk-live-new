/* K-Talk pre-approval 9-grid exact visual fix — 2026-10-01 — PIN 5555
   Exact scope: remote viewer PRE-APPROVAL 9-person grid geometry only.
   Do not modify signaling, camera, approval, entry/exit, buttons, chat, gifts, or approved hostlike room.
*/
(function(){
  if(window.__ktPreapprovalNineGridExact5555_20261001)return;
  window.__ktPreapprovalNineGridExact5555_20261001=true;

  function isRemoteNine(root){
    if(!root)return false;
    if(root.querySelector('.kt-guest-hostlike-room'))return false; // approved screen: leave untouched
    try{
      var txt=String(root.textContent||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.title||'')+' '+String(last.room_type||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      if(/9\s*명|group9/i.test(txt))return true;
    }catch(e){}
    return false;
  }

  function directElements(el){
    return [].slice.call((el&&el.children)||[]).filter(function(x){return x&&x.nodeType===1;});
  }

  function looksLikeNineGrid(el){
    if(!el)return false;
    if(el.closest('.kt-remote-bottom,.kt-remote-chat,.kgh-chat,.kgh-quick,.kt-prejoin-quick-5555,.kt-approved-roster-quick-5555'))return false;
    var kids=directElements(el);
    if(kids.length!==9)return false;
    var videoCount=0, guestCount=0;
    kids.forEach(function(k){
      if(k.querySelector&&k.querySelector('video'))videoCount++;
      if(/게스트|호스트/.test(String(k.textContent||'')))guestCount++;
    });
    if(videoCount>0||guestCount>=4)return true;
    return false;
  }

  function findGrid(root){
    var known=root.querySelector('.kt-prejoin-room-grid,.kt-approved-guest-grid,.kt-guest-room-grid');
    if(known&&directElements(known).length===9)return known;

    var candidates=[].slice.call(root.querySelectorAll('div,section,main'));
    var best=null,bestArea=0;
    candidates.forEach(function(el){
      if(!looksLikeNineGrid(el))return;
      var r;
      try{r=el.getBoundingClientRect();}catch(e){return;}
      if(!r||r.width<180)return;
      var area=r.width*Math.max(r.height,1);
      if(area>bestArea){best=el;bestArea=area;}
    });
    return best;
  }

  function exactHeight(){
    var h=Math.round(window.innerHeight*0.29);
    var w=Math.max(0,window.innerWidth-14);
    return Math.max(220,Math.min(w,h));
  }

  function forceRemoteViewingNineMain(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return;
      var room=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(!room)return;
      /* 승인 후 hostlike 화면은 건드리지 않음 */
      if(document.querySelector('#screen .kt-remote-live .kt-guest-hostlike-room'))return;
      var grid=room.querySelector(':scope > .ktg13-main')||room.querySelector('.ktg13-main');
      if(!grid)return;

      grid.setAttribute('data-kt-preapproval-nine-main-5555','1');
      grid.style.setProperty('display','grid','important');
      grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      grid.style.setProperty('gap','2px','important');
      grid.style.setProperty('flex','0 0 auto','important');
      grid.style.setProperty('height','calc(100vw - 14px)','important');
      grid.style.setProperty('min-height','0','important');
      grid.style.setProperty('max-height','calc(100dvh - 355px)','important');
      grid.style.setProperty('overflow','hidden','important');

      var host=grid.querySelector('.ktg13-host');
      if(host){
        host.style.setProperty('min-width','0','important');
        host.style.setProperty('min-height','0','important');
        host.style.setProperty('width','auto','important');
        host.style.setProperty('height','auto','important');
      }
      grid.querySelectorAll('.ktg13-guest').forEach(function(cell){
        cell.style.setProperty('min-width','0','important');
        cell.style.setProperty('min-height','0','important');
        cell.style.setProperty('width','auto','important');
        cell.style.setProperty('height','auto','important');
      });
    }catch(e){}
  }

  function apply(){
    forceRemoteViewingNineMain();
    var root=document.querySelector('#screen .kt-remote-live,.kt-remote-live');
    if(!root||!isRemoteNine(root))return;
    var grid=findGrid(root);
    if(!grid)return;

    var px=exactHeight()+'px';
    grid.setAttribute('data-kt-preapproval-nine-5555','1');
    grid.style.setProperty('display','grid','important');
    grid.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    grid.style.setProperty('gap','2px','important');
    grid.style.setProperty('flex','0 0 auto','important');
    grid.style.setProperty('height',px,'important');
    grid.style.setProperty('min-height',px,'important');
    grid.style.setProperty('max-height',px,'important');
    grid.style.setProperty('overflow','hidden','important');

    directElements(grid).forEach(function(cell){
      cell.style.setProperty('min-width','0','important');
      cell.style.setProperty('min-height','0','important');
      cell.style.setProperty('width','auto','important');
      cell.style.setProperty('height','auto','important');
    });
  }

  apply();
  [30,100,250,500,900,1500,2500].forEach(function(ms){setTimeout(forceRemoteViewingNineMain,ms);});
  [30,100,250,500,900,1500,2500].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('resize',function(){setTimeout(apply,30);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktPreapprovalNineGridExact5555Timer);
      window.__ktPreapprovalNineGridExact5555Timer=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();