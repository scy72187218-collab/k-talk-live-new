/* K-Talk 9-room ONE unified visual screen — 2026-10-02
   Make host / guest-before-entry / approved guest use the same compact visual proportions.
   VISUAL ONLY: do not change approval, signaling, camera, mic, gifts, chat send, or entry logic.
*/
(function(){
  if(window.__ktG9OneUnifiedScreenFinal20261002)return;
  window.__ktG9OneUnifiedScreenFinal20261002=true;

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

  function styleGrid(g){
    if(!g)return;
    g.style.setProperty('display','grid','important');
    g.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
    g.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
    g.style.setProperty('gap','3px','important');
    g.style.setProperty('width','calc(100% - 20px)','important');
    g.style.setProperty('margin','4px auto 0','important');
    g.style.setProperty('height','78vw','important');
    g.style.setProperty('min-height','0','important');
    g.style.setProperty('max-height','78vw','important');
    g.style.setProperty('flex','0 0 78vw','important');
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
    fillVideos(g);
  }

  function fillVideos(g){
    try{
      g.querySelectorAll('video').forEach(function(v){
        v.style.setProperty('position','absolute','important');
        v.style.setProperty('inset','0','important');
        v.style.setProperty('width','100%','important');
        v.style.setProperty('height','100%','important');
        v.style.setProperty('object-fit','cover','important');
        v.style.setProperty('object-position','center','important');
        v.style.setProperty('background','#000','important');
      });
    }catch(e){}
  }

  function styleRemoteChat(root){
    if(!root)return;
    var chat=root.querySelector(':scope > .kt-remote-chat')||root.querySelector('.kt-remote-chat');
    if(chat){
      chat.style.setProperty('background','transparent','important');
      chat.style.setProperty('border','0','important');
      chat.style.setProperty('outline','0','important');
      chat.style.setProperty('box-shadow','none','important');
      chat.style.setProperty('border-radius','0','important');
    }

    var room=root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]');
    if(room){
      var wrap=room.querySelector('.kgh-chat');
      var box=room.querySelector('.kgh-chatbox');
      if(wrap){
        wrap.style.setProperty('background','transparent','important');
        wrap.style.setProperty('border','0','important');
        wrap.style.setProperty('box-shadow','none','important');
      }
      if(box){
        box.style.setProperty('display','flex','important');
        box.style.setProperty('flex-direction','column','important');
        box.style.setProperty('justify-content','flex-end','important');
        box.style.setProperty('background','transparent','important');
        box.style.setProperty('border','0','important');
        box.style.setProperty('outline','0','important');
        box.style.setProperty('box-shadow','none','important');
        box.style.setProperty('border-radius','0','important');
        box.style.setProperty('height','92px','important');
        box.style.setProperty('min-height','92px','important');
        box.style.setProperty('max-height','92px','important');
        box.style.setProperty('overflow','hidden','important');
      }

      var quick=room.querySelector('.kgh-quick');
      if(quick){
        quick.style.setProperty('height','29px','important');
        quick.style.setProperty('min-height','29px','important');
        quick.style.setProperty('max-height','29px','important');
        quick.style.setProperty('flex','0 0 29px','important');
        quick.style.setProperty('gap','4px','important');
        quick.querySelectorAll('button').forEach(function(b){
          b.style.setProperty('height','29px','important');
          b.style.setProperty('min-height','29px','important');
          b.style.setProperty('padding','0 4px','important');
          b.style.setProperty('font-size','10px','important');
          b.style.setProperty('border-radius','9px','important');
        });
      }

      var stats=room.querySelector('.kgh-stats');
      if(stats){
        stats.style.setProperty('min-height','31px','important');
        stats.style.setProperty('height','31px','important');
        stats.style.setProperty('max-height','31px','important');
        stats.style.setProperty('flex','0 0 31px','important');
      }
    }
  }

  function collectRemoteGrids(root){
    var out=[];
    root.querySelectorAll(
      '.kt-prejoin-room-grid,'+
      '.kt-approved-guest-grid,'+
      '.kt-guest-room-grid,'+
      '.kt-guest-hostlike-room[data-kt-room="9"] .kgh-main'
    ).forEach(function(g){
      if(kids(g).length===9 && out.indexOf(g)<0)out.push(g);
    });
    return out;
  }


  function removeDuplicateNineGrids(){
    /* 2222: 정상 9명방이 이미 떠 있으면 위에 남는 예전 9칸만 제거.
       정상 방/영상/채팅/버튼/다른 방은 건드리지 않는다. */
    try{
      document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
        if(!isNineRemote(root))return;
        var stable=root.querySelector(':scope > .ktg13-room[data-kt-room="9"]');
        if(!stable)return;
        root.querySelectorAll(':scope > .kt-prejoin-room-grid,:scope > .kt-approved-guest-grid,:scope > .kt-guest-room-grid,:scope > .kt-guest-hostlike-room').forEach(function(x){
          if(x!==stable&&!stable.contains(x)){
            try{x.remove();}catch(e){}
          }
        });
      });
    }catch(e){}
  }

  function apply(){
    removeDuplicateNineGrids();
    /* Host */
    document.querySelectorAll(
      '#screen .ktg13-room[data-kt-room="9"] .ktg13-main,'+
      '#screen .ktg9-room .ktg9-main'
    ).forEach(styleGrid);

    /* Guest before approval + approved guest */
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(!isNineRemote(root))return;
      collectRemoteGrids(root).forEach(styleGrid);
      styleRemoteChat(root);
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  ['pageshow','resize','orientationchange','kt-guest-approval-received','kt-any-guest-approved','kt-approved-guest-stream-ready'].forEach(function(n){
    window.addEventListener(n,function(){[0,60,180,400].forEach(function(ms){setTimeout(apply,ms);});});
  });
  setInterval(apply,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9OneUnifiedScreenFinalTimer20261002);
      window.__ktG9OneUnifiedScreenFinalTimer20261002=setTimeout(apply,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();