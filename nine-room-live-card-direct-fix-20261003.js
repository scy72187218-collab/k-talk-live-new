/* K-Talk 2026-10-03: LIVE 카드에서 9명방을 누를 때 검은 단독 영상 화면보다 9명방 틀을 먼저 표시. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktNineLiveCardDirectFix20261003)return;
  window.__ktNineLiveCardDirectFix20261003=true;

  function findCard(hostId){
    var nodes=document.querySelectorAll('[data-host]');
    for(var i=0;i<nodes.length;i++){
      if(String(nodes[i].getAttribute('data-host')||'')===String(hostId||''))return nodes[i];
    }
    return null;
  }

  function install(){
    var original=window.ktEnterRemoteLive;
    if(typeof original!=='function')return false;
    if(original.__ktNineLiveCardDirectWrapped20261003)return true;

    function wrapped(hostId){
      try{
        var card=findCard(hostId);
        var txt=card?String(card.textContent||''):'';
        var cached=window.__ktLastLiveRoom||{};
        var cachedTxt=[cached.room_type,cached.room_name,cached.title].join(' ');
        if(/9\s*명|group9/i.test(txt+' '+cachedTxt)){
          window.__ktForceNineViewerShellHost20261003=String(hostId||'');
          window.__ktLastLiveRoom=Object.assign({},cached,{
            host_id:String(hostId||''),
            room_type:String(cached.room_type||'group9'),
            room_name:String(cached.room_name||'9명 방송'),
            title:String(cached.title||cached.room_name||'9명 방송')
          });
        }
      }catch(e){}
      return original.apply(this,arguments);
    }
    wrapped.__ktNineLiveCardDirectWrapped20261003=true;
    wrapped.__ktNineLiveCardDirectOriginal20261003=original;
    window.ktEnterRemoteLive=wrapped;
    return true;
  }

  if(!install()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(install()||tries>80)clearInterval(timer);
    },50);
  }
  window.addEventListener('pageshow',function(){setTimeout(install,0);});
})();