/* K-Talk 비밀방: 2026-09-14 오전 11:00 상태 복구. 다른 방은 변경하지 않음. */
(function(){
  if(window.__ktSecretReturnDown20260914)return;
  window.__ktSecretReturnDown20260914=true;

  function isSecretRoom(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='password'||String(n).indexOf('비밀')>-1||String(title).indexOf('비밀')>-1;
    }catch(e){return false;}
  }

  function forceFive(){
    try{if(isSecretRoom()&&window.state)state.liveRoomMax=5;}catch(e){}
  }

  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(58px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{transform:translateX(-52px)!important;}'
    +'.prep-card #ktSecretPasswordBox.on{position:fixed!important;left:18px!important;right:18px!important;bottom:86px!important;z-index:10000!important;display:block!important;margin:0!important;width:auto!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(6){display:none!important;}';
  document.head.appendChild(s);

  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,name,max){
      var r=oldSelect.apply(this,arguments);
      if(window.state&&(type==='password'||String(name||'').indexOf('비밀')>-1)){
        state.liveRoomType='password';
        state.liveRoomName='비밀방';
        state.liveRoomMax=5;
      }
      return r;
    };
  }

  var oldOpenRoomPrep=window.openRoomPrep;
  if(typeof oldOpenRoomPrep==='function'){
    window.openRoomPrep=function(name,max){
      var r=oldOpenRoomPrep.apply(this,arguments);
      if(window.state&&String(name||'').indexOf('비밀')>-1){
        state.liveRoomType='password';
        state.liveRoomName='비밀방';
        state.liveRoomMax=5;
      }
      return r;
    };
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=function(){
      forceFive();
      return oldStart.apply(this,arguments);
    };
  }

  new MutationObserver(function(){forceFive();}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(forceFive,100);
})();

/* 오전 11시 이후 비밀방에만 추가된 위치/상단/공용파장 보정을 비밀방에서만 해제. */
(function(){
  if(window.__ktSecret1100Restore20260915)return;
  window.__ktSecret1100Restore20260915=true;

  var st=document.createElement('style');
  st.id='ktSecret1100RestoreStyle20260915';
  st.textContent=''
    +'html body #screen .ktsecret-room .ktsecret-wave,'
    +'html body #screen .ktsecret-room .kt-secret-wave,'
    +'html body #screen .ktsecret-room .secret-wave{display:none!important;animation:none!important;}';
  document.head.appendChild(st);

  function fix(){
    ['ktSecretEarningsLeft20260914','ktSecretRightControlsUp20260914'].forEach(function(id){
      var el=document.getElementById(id);
      if(el&&el.parentNode)el.parentNode.removeChild(el);
    });

    document.querySelectorAll('.ktsecret-room>.kt-live-top-quickbar,.ktsecret-room>.ktsecret-top-three').forEach(function(el){
      try{el.remove();}catch(e){}
    });

    var left=(window.matchMedia&&window.matchMedia('(max-width:390px)').matches)?'4px':'5px';
    document.querySelectorAll('.ktsecret-room .ktsecret-slot.host>.kt-allhost-profile,.ktsecret-room .ktsecret-host>.kt-allhost-profile').forEach(function(el){
      el.style.setProperty('left',left,'important');
      el.style.setProperty('right','auto','important');
      el.style.setProperty('top',left,'important');
      el.style.setProperty('transform','none','important');
    });
  }

  fix();
  [40,120,300,700,1400].forEach(function(ms){setTimeout(fix,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSecret1100RestoreTimer20260915);
      window.__ktSecret1100RestoreTimer20260915=setTimeout(fix,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
