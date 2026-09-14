/* K-Talk 비밀방 전용: 기존 위치/비밀번호 조정은 그대로 두고, 방 정원만 호스트 1명 + 게스트 4명 = 총 5명으로 제한. 다른 UI/기능 변경 없음. */
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
    +'.ktsecret-room .ktsecret-six-grid{grid-template-columns:48% repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:4px!important;padding:4px!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot.host{grid-column:1!important;grid-row:1 / span 2!important;border-radius:10px!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:not(.host){grid-column:auto!important;grid-row:auto!important;border-radius:8px!important;}'
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
