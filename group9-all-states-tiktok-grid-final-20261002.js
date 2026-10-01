/* K-Talk 9-room FINAL compact TikTok-like 3x3 grid.
   Applies visually to:
   1) host 9-room
   2) guest/viewer before approval
   3) approved guest after entry
   Grid only. Do not change buttons, chat logic, earnings, signaling, approval or media actions.
*/
(function(){
  if(window.__ktG9AllStatesTikTokGridFinal20261002)return;
  window.__ktG9AllStatesTikTokGridFinal20261002=true;

  function kids(el){
    return [].slice.call((el&&el.children)||[]).filter(function(x){return x&&x.nodeType===1;});
  }

  function isNineRemote(root){
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      var st=window.state||{}, last=window.__ktLastLiveRoom||{};
      var txt=[
        st.liveRoomType,st.liveRoomName,st.liveRoomMax,
        last.room_type,last.room_name,last.title,
        root.textContent
      ].join(' ');
      return /group9|9\s*명/i.test(String(txt));
    }catch(e){return false;}
  }

  function collect(){
    var out=[];
    function add(g){
      if(!g||out.indexOf(g)>=0)return;
      out.push(g);
    }

    document.querySelectorAll(
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'+
      '#screen .ktg9-room .ktg9-main,'+
      '#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main,'+
      '#screen .kt-remote-live .kt-prejoin-room-grid,'+
      '#screen .kt-remote-live .kt-approved-guest-grid,'+
      '#screen .kt-remote-live .kt-guest-room-grid'
    ).forEach(function(g){
      if(kids(g).length===9)add(g);
    });

    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNineRemote(root))return;
      root.querySelectorAll('div,section,main').forEach(function(g){
        if(g.closest('.kt-remote-bottom,.kt-remote-chat,.kgh-chat,.kgh-quick'))return;
        var c=kids(g);
        if(c.length!==9)return;
        var score=0;
        c.forEach(function(x){
          if(/게스트|호스트/.test(String(x.textContent||'')))score++;
          if(x.querySelector&&x.querySelector('video'))score+=2;
        });
        if(score>=4)add(g);
      });
    });
    return out;
  }

  function applyGrid(g){
    try{
      g.setAttribute('data-kt-g9-tiktok-final','1');
      g.style.setProperty('display','grid','important');
      g.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
      g.style.setProperty('gap','3px','important');
      g.style.setProperty('width','calc(100% - 20px)','important');
      g.style.setProperty('margin','4px auto 0','important');
      g.style.setProperty('height','min(64vw, calc(100dvh - 520px))','important');
      g.style.setProperty('min-height','0','important');
      g.style.setProperty('max-height','64vw','important');
      g.style.setProperty('flex','0 0 min(64vw, calc(100dvh - 520px))','important');
      g.style.setProperty('overflow','hidden','important');

      kids(g).forEach(function(cell){
        cell.style.setProperty('min-width','0','important');
        cell.style.setProperty('min-height','0','important');
        cell.style.setProperty('width','auto','important');
        cell.style.setProperty('height','auto','important');
        cell.style.setProperty('border','0','important');
        cell.style.setProperty('outline','0','important');
        cell.style.setProperty('box-shadow','none','important');
        cell.style.setProperty('border-radius','9px','important');
        cell.style.setProperty('overflow','hidden','important');
      });
    }catch(e){}
  }

  function apply(){
    collect().forEach(applyGrid);
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  ['resize','pageshow','orientationchange','kt-guest-approval-received','kt-any-guest-approved','kt-approved-guest-stream-ready'].forEach(function(name){
    window.addEventListener(name,function(){[0,60,180,400].forEach(function(ms){setTimeout(apply,ms);});});
  });
  setInterval(apply,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9AllStatesTikTokGridTimer20261002);
      window.__ktG9AllStatesTikTokGridTimer20261002=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();