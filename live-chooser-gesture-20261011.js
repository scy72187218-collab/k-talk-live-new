/* Live opener owns its entire gesture: releasing over a newly visible room must not select it. */
(function(){
  if(window.__ktLiveChooserGesture20261011)return;
  window.__ktLiveChooserGesture20261011=true;
  var opening=false, openedAt=0, roomGesture=false, roomGestureAt=0;
  function selectSpecialRoom(e){
    var el=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch,.live-prep .kt-room9-general,.live-prep .kt-room-bottom5 button,.kt-creator-room-shortcuts button'):null;
    if(!el)return false;
    var text=String(el.textContent||'').replace(/\s+/g,''),type=/구독/.test(text)?'subscriber':(/비밀/.test(text)?'password':(/13명/.test(text)?'group13':(/15명/.test(text)?'group15':(/9명/.test(text)?'group9':(/1인/.test(text)?'solo':'')))));
    if(!type||typeof window.selectPrepRoom!=='function')return false;
    stop(e);
    roomGesture=true;roomGestureAt=Date.now();
    var defs={subscriber:['구독자 방송',15],password:['비밀방',6],group13:['13명 방송',13],group15:['15명 방송',16],group9:['9명 방송',9],solo:['1인 방송',1]};
    var name=defs[type][0],max=defs[type][1];
    // Keep the existing access gates and secret-password setup in the selection chain.
    var result=window.selectPrepRoom(el,type,name,max);
    if(result===false||!window.state||window.state.liveRoomType!==type)return true;
    choose(el);
    var creator=document.getElementById('creator');
    if(creator)creator.classList.add('show','live-prep-open');
    var title=document.getElementById('liveTitle');
    if(title){title.value=name;title.dataset.autoRoom='1';}
    return true;
  }
  function liveControl(target){
    // Plus opens the existing video creator; only the Live tab opens live preparation.
    var el=target&&target.closest?target.closest('.creator-bottom .modes span,.creator-bottom .modes button,.creator-bottom .creator-foot span,.creator-bottom .creator-foot button'):null;
    return el&&String(el.textContent||'').replace(/\s+/g,'')==='라이브';
  }
  function choose(target){
    var el=target&&target.closest?target.closest('.live-prep .room-switch,.live-prep .kt-room9-general,.live-prep .kt-room-bottom5 button,.kt-creator-room-shortcuts button'):null;
    if(!el)return;
    var text=String(el.textContent||'').replace(/\s+/g,''),choice=null;
    if(/구독/.test(text))choice={type:'subscriber',name:'구독자 방송',max:15};
    else if(/비밀/.test(text))choice={type:'password',name:'비밀방',max:6};
    else if(/13명/.test(text))choice={type:'group13',name:'13명 방송',max:13};
    else if(/15명/.test(text))choice={type:'group15',name:'15명 방송',max:16};
    else if(/9명/.test(text))choice={type:'group9',name:'9명 방송',max:9};
    else if(/1인/.test(text))choice={type:'solo',name:'1인 방송',max:1};
    if(!choice)return;
    window.__ktLiveChooserSelection=choice;
    window.__ktLiveChooserAwaitSelection=false;
    window.ktApplyLiveChooserSelection();
  }
  window.ktApplyLiveChooserSelection=function(){
    var choice=window.__ktLiveChooserSelection,st=window.state;
    if(!choice||!st)return;
    st.liveRoomType=st.prepRoomType=st.roomType=choice.type;
    st.liveRoomName=st.prepRoomName=choice.name;
    st.liveRoomMax=st.prepRoomMax=choice.max;
  };
  function stop(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
  function startSelectedRoom(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
    if(!btn)return false;
    stop(e);roomGesture=true;roomGestureAt=Date.now();
    var choice=window.__ktLiveChooserSelection;
    if(window.__ktLiveChooserAwaitSelection||!choice){
      window.alert('방을 먼저 선택해 주세요.');return true;
    }
    window.ktApplyLiveChooserSelection();
    if(typeof window.ktStartLiveRoomNow==='function'){
      Promise.resolve(window.ktStartLiveRoomNow(choice.type,choice.name,choice.max)).catch(function(){});
    }
    return true;
  }
  function open(e){
    if(typeof window.openTikLivePrep!=='function')return;
    stop(e);opening=true;openedAt=Date.now();
    window.__ktLiveChooserAwaitSelection=true;
    window.__ktLiveChooserSelection=null;
    var creator=document.getElementById('creator');
    if(creator)creator.classList.add('show');
    window.openTikLivePrep();
  }
  window.addEventListener('pointerdown',function(e){
    opening=false;roomGesture=false;
    if(liveControl(e.target)){open(e);return;}
    if(startSelectedRoom(e))return;
    if(selectSpecialRoom(e))return;
    choose(e.target);
  },true);
  ['pointerup','touchend','click'].forEach(function(name){
    window.addEventListener(name,function(e){
      if(opening&&Date.now()-openedAt<900){stop(e);return;}
      // Legacy coordinate hit-testing must not select a different room on release.
      if(roomGesture&&Date.now()-roomGestureAt<900){stop(e);return;}
      opening=false;
      if(name==='click'&&liveControl(e.target)){open(e);return;}
      if(name==='click'&&startSelectedRoom(e))return;
      if(name==='click'&&selectSpecialRoom(e))return;
      if(name==='click')choose(e.target);
    },true);
  });
  window.addEventListener('pointercancel',function(){opening=false;roomGesture=false;},true);
})();
