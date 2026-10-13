/* K-Talk 2026-10-03: 9명방 LIVE 입장 통신 화면만 보강. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktNineLiveCardDirectFix20261003V2)return;
  window.__ktNineLiveCardDirectFix20261003V2=true;

  function findCard(hostId){
    var nodes=document.querySelectorAll('[data-host]');
    for(var i=0;i<nodes.length;i++){
      if(String(nodes[i].getAttribute('data-host')||'')===String(hostId||''))return nodes[i];
    }
    return null;
  }

  function isNine(hostId){
    var root=document.querySelector('#screen .kt-remote-live');
    return !!(root&&String(root.getAttribute('data-kt-host-id')||'')===String(hostId||'')&&root.getAttribute('data-kt-room-type')==='group9');
  }

  function showNine(hostId){
    try{
      if(!isNine(hostId))return;
      if(/subscriber|구독|password|secret|비밀/i.test(String(window.__ktRemoteRoomType||'')+' '+String(window.__ktRemoteRoomName||'')))return;
      if(String(window.__ktForceNineViewerShellHost20261003||'')!==String(hostId||''))return;
      if(typeof window.ktShowNineViewerShellImmediately20261003==='function'){
        window.__ktRemoteRoomType='group9';
        window.__ktRemoteRoomName='9명 방송';
        window.ktShowNineViewerShellImmediately20261003();
      }
    }catch(e){}
  }

  function install(){
    var original=window.ktEnterRemoteLive;
    if(typeof original!=='function')return false;
    if(original.__ktNineLiveCardDirectWrapped20261003V2)return true;

    function wrapped(hostId){
      var nine=isNine(hostId);
      if(nine){
        try{
          window.__ktForceNineViewerShellHost20261003=String(hostId||'');
        }catch(e){}
      }else{
        window.__ktForceNineViewerShellHost20261003='';
      }
      var out=original.apply(this,arguments);
      if(nine){
        [0,30,80,160,300,600,1000].forEach(function(ms){
          setTimeout(function(){showNine(hostId);},ms);
        });
      }
      return out;
    }

    Object.keys(original).forEach(function(k){try{wrapped[k]=original[k];}catch(e){}});
    wrapped.__ktNineLiveCardDirectWrapped20261003V2=true;
    wrapped.__ktNineLiveCardDirectOriginal20261003=original;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(install()&&tries>4)clearInterval(timer);
    if(tries>120)clearInterval(timer);
  },50);

  document.addEventListener('pointerdown',function(e){
    try{
      var card=e.target&&e.target.closest?e.target.closest('[data-host]'):null;
      if(!card)return;
      var hostId=String(card.getAttribute('data-host')||'');
      if(!hostId||!isNine(hostId))return;
      window.__ktForceNineViewerShellHost20261003=hostId;
      [0,40,100,220,450].forEach(function(ms){setTimeout(function(){showNine(hostId);},ms);});
    }catch(_e){}
  },true);

  window.addEventListener('pageshow',function(){setTimeout(install,0);});
})();
