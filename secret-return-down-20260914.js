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

  function showSecretPasswordBox(){
    try{
      if(!isSecretRoom())return;
      var box=document.getElementById('ktSecretPasswordBox');
      if(box)box.classList.add('on');
    }catch(e){}
  }

  var s=document.createElement('style');
  s.id='ktSecretReturnDown20260914Style';
  s.textContent=''
    +'.ktsecret-room .ktsecret-right{transform:translateY(58px)!important;}'
    +'.ktsecret-room .ktsecret-return{transform:none!important;}'
    +'.ktsecret-room .ktsecret-earn-row #myEarnHud{transform:translateX(-52px)!important;}'
    +'.prep-card #ktSecretPasswordBox.on{position:fixed!important;left:18px!important;right:18px!important;bottom:86px!important;z-index:10000!important;display:block!important;margin:0!important;width:auto!important;}'
    +'.ktsecret-room .ktsecret-six-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:minmax(0,1fr) 104px!important;gap:5px!important;padding:3px!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot.host{grid-column:1 / -1!important;grid-row:1!important;border-radius:12px!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(2){grid-column:1!important;grid-row:2!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(3){grid-column:2!important;grid-row:2!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(4){grid-column:3!important;grid-row:2!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(5){grid-column:4!important;grid-row:2!important;}'
    +'.ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(6){display:none!important;}'
    +'@media(max-width:390px){.ktsecret-room .ktsecret-six-grid{grid-template-rows:minmax(0,1fr) 86px!important;gap:4px!important;}}';
  document.head.appendChild(s);

  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,name,max){
      var r=oldSelect.apply(this,arguments);
      if(window.state&&(type==='password'||String(name||'').indexOf('비밀')>-1)){
        state.liveRoomType='password';
        state.liveRoomName='비밀방';
        state.liveRoomMax=5;
        setTimeout(showSecretPasswordBox,0);
        setTimeout(showSecretPasswordBox,120);
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
        setTimeout(showSecretPasswordBox,30);
        setTimeout(showSecretPasswordBox,150);
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

  new MutationObserver(function(){forceFive();showSecretPasswordBox();}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(function(){forceFive();showSecretPasswordBox();},100);
})();
