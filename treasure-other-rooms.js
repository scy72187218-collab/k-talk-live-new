/* K-Talk: 13명 방송에서 쓰는 기존 보물상자 기능을 1인/구독자/비밀방에도 연결. 다른 UI/기능은 건드리지 않음. */
(function(){
  if(window.__ktTreasureOtherRoomsInstalled)return;
  window.__ktTreasureOtherRoomsInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktTreasureOtherRoomsStyle'))return;
    var s=document.createElement('style');
    s.id='ktTreasureOtherRoomsStyle';
    s.textContent=''
      +'.kt-room-treasure-open{border-color:#f2b94f88!important;background:linear-gradient(145deg,#48260ddd,#8c5512dd)!important;color:#fff3a7!important;box-shadow:0 0 10px #f2b94f33!important}'
      +'.kt-room-treasure-open small{display:block!important;font-size:8px!important;line-height:1.05!important;margin-top:1px!important;color:#fff3a7!important;font-weight:950!important}'
      +'.ktsolo-main>.kt-live-treasure-zone,.ktsubscriber-main>.kt-live-treasure-zone,.ktsecret-main>.kt-live-treasure-zone{z-index:14!important;top:18%!important}';
    document.head.appendChild(s);
  }

  function addToRoom(mainSelector,actionsSelector){
    var main=document.querySelector(mainSelector);
    var actions=document.querySelector(actionsSelector);
    if(!main||!actions)return false;

    var zone=document.getElementById('ktLiveTreasureZone');
    if(!zone){
      zone=document.createElement('div');
      zone.id='ktLiveTreasureZone';
      zone.className='kt-live-treasure-zone';
      main.appendChild(zone);
    }

    if(!actions.querySelector('.kt-room-treasure-open')){
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-room-treasure-open';
      b.setAttribute('aria-label','보물상자');
      b.innerHTML='🗝️<small>보물</small>';
      b.onclick=function(e){
        if(e){e.preventDefault();e.stopPropagation();}
        try{if(window.openTreasure)window.openTreasure();}catch(err){}
      };
      actions.appendChild(b);
    }

    try{if(window.ktRenderTreasure)window.ktRenderTreasure();}catch(e){}
    return true;
  }

  function install(){
    ensureStyle();
    var added=false;
    added=addToRoom('.ktsolo-main','.ktsolo-right')||added;
    added=addToRoom('.ktsubscriber-main','.ktsubscriber-right')||added;
    added=addToRoom('.ktsecret-main','.ktsecret-right')||added;
    if(added){
      setTimeout(function(){try{if(window.ktRenderTreasure)window.ktRenderTreasure();}catch(e){}},80);
    }
  }

  install();
  var obs=new MutationObserver(function(){install();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
})();
