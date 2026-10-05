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
    try{
      var card=findCard(hostId);
      var txt=card?String(card.textContent||''):'';
      var cached=window.__ktLastLiveRoom||{};
      var sameHost=!cached.host_id||String(cached.host_id||'')===String(hostId||'');
      var cachedTxt=sameHost?[cached.room_type,cached.room_name,cached.title].join(' '):'';
      var all=String(txt+' '+cachedTxt);

      if(/9\s*명|group9/i.test(all))return true;

      /* 빨간 LIVE 첫 입장 순간에는 방 메타가 아직 늦게 들어오는 기기가 있다.
         이때 사람 전체 화면으로 떨어지지 않게, 다른 방이라는 정보가 명확하지 않으면
         현재 기본 그룹방(9명방) 화면을 먼저 보여준다. */
      if(/1\s*인|solo|13\s*명|group13|15\s*명|group15|subscriber|구독|secret|비밀/i.test(all))return false;
      return true;
    }catch(e){return true;}
  }

  function showNine(hostId){
    try{
      if(String(window.__ktForceNineViewerShellHost20261003||'')!==String(hostId||''))return;
      if(typeof window.ktShowNineViewerShellImmediately20261003==='function'){
        window.__ktRemoteRoomType='group9';
        window.__ktRemoteRoomName='9명 방송';
        window.ktShowNineViewerShellImmediately20261003();
      }
    }catch(e){}
  }

  function liveCardStream(hostId){
    try{
      var card=findCard(hostId);if(!card)return null;
      var vids=[].slice.call(card.querySelectorAll('video'));
      for(var i=0;i<vids.length;i++){
        var st=vids[i]&&vids[i].srcObject||null;
        var vt=st&&st.getVideoTracks&&st.getVideoTracks()[0]||null;
        if(vt&&vt.readyState==='live')return st;
      }
    }catch(e){}
    return null;
  }

  function startHostFaceNow(hostId){
    try{
      hostId=String(hostId||'').trim();if(!hostId)return;
      var st=liveCardStream(hostId);
      if(st){
        window.__ktEntryHostStream20260925=st;
        window.__ktRemoteHostStream=st;
        window.__ktLastApprovedGuestHostStream=st;
      }
      if(typeof window.ktStartRemoteHostVideoNow20261003==='function'){
        window.ktStartRemoteHostVideoNow20261003(hostId,st||null);
      }else{
        window.dispatchEvent(new CustomEvent('kt-remote-host-selected',{detail:{host_id:hostId,entry_stream:st||null,at:Date.now()}}));
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
          var cached=window.__ktLastLiveRoom||{};
          window.__ktForceNineViewerShellHost20261003=String(hostId||'');
          window.__ktLastLiveRoom=Object.assign({},cached,{
            host_id:String(hostId||''),
            room_type:'group9',
            room_name:'9명 방송',
            title:String(cached.title||cached.room_name||'9명 방송')
          });
        }catch(e){}
        /* LIVE 카드에 이미 재생 중인 호스트 영상을 방 입장 첫 프레임으로 즉시 넘긴다. */
        startHostFaceNow(hostId);
      }
      var out=original.apply(this,arguments);
      if(nine){
        [0,30,80,160,300,600,1000].forEach(function(ms){
          setTimeout(function(){showNine(hostId);},ms);
        });
        [0,25,70,140].forEach(function(ms){
          setTimeout(function(){startHostFaceNow(hostId);},ms);
        });
      }
      return out;
    }

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
      startHostFaceNow(hostId);
      [0,40,100,220,450].forEach(function(ms){setTimeout(function(){showNine(hostId);},ms);});
      [20,60,120].forEach(function(ms){setTimeout(function(){startHostFaceNow(hostId);},ms);});
    }catch(_e){}
  },true);

  window.addEventListener('pageshow',function(){setTimeout(install,0);});
})();