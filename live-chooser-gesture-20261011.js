/* Live opener owns its entire gesture: releasing over a newly visible room must not select it. */
(function(){
  if(window.__ktLiveChooserGesture20261011)return;
  window.__ktLiveChooserGesture20261011=true;
  var opening=false, openedAt=0;
  function liveControl(target){
    if(target&&target.closest&&target.closest('.bottom .plus,.kt-bottom .livebtn'))return true;
    var el=target&&target.closest?target.closest('.creator-bottom .modes span,.creator-bottom .modes button,.creator-bottom .creator-foot span,.creator-bottom .creator-foot button'):null;
    return el&&String(el.textContent||'').replace(/\s+/g,'')==='라이브';
  }
  function choose(target){
    var el=target&&target.closest?target.closest('.live-prep .room-switch,.live-prep .kt-room9-general,.live-prep .kt-room-bottom5 button'):null;
    if(!el)return;
    var text=String(el.textContent||'').replace(/\s+/g,''),choice=null;
    if(/구독/.test(text))choice={type:'subscriber',name:'구독자 방송',max:15};
    else if(/비밀/.test(text))choice={type:'password',name:'비밀방',max:5};
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
    opening=false;
    if(liveControl(e.target)){open(e);return;}
    choose(e.target);
  },true);
  ['pointerup','touchend','click'].forEach(function(name){
    window.addEventListener(name,function(e){
      if(opening&&Date.now()-openedAt<900){stop(e);return;}
      opening=false;
      if(name==='click'&&liveControl(e.target)){open(e);return;}
      if(name==='click')choose(e.target);
    },true);
  });
  window.addEventListener('pointercancel',function(){opening=false;},true);
})();
