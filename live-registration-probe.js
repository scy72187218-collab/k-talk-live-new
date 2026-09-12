/* K-Talk LIVE 접속 진단 전용. 화면/UI는 변경하지 않음. */
(function(){
  if(window.__ktLiveRegistrationProbeInstalled)return;
  window.__ktLiveRegistrationProbeInstalled=true;
  var last='';
  function ping(stage,detail){
    try{
      var key=stage+'|'+(detail||'');
      if(key===last)return;
      last=key;
      fetch('/api/live-debug?stage='+encodeURIComponent(stage)+'&detail='+encodeURIComponent(detail||''),{cache:'no-store'}).catch(function(){});
    }catch(e){}
  }
  function state(){
    try{
      var root=document.getElementById('screen')||document.body;
      if(!root)return 'no-root';
      var q='';
      if(root.querySelector('.ktg13-room'))q='group13';
      else if(root.querySelector('.ktg9-room'))q='group9';
      else if(root.querySelector('.ktsolo-room'))q='solo';
      else if(root.querySelector('.ktsubscriber-room'))q='subscriber';
      else if(root.querySelector('.ktsecret-room'))q='secret';
      var t=String(root.innerText||root.textContent||'');
      if(t.indexOf('ON AIR')>-1)return 'onair:'+q;
      if(t.indexOf('방송 중')>-1)return 'live-text:'+q;
      if(q)return 'room:'+q;
      return 'idle';
    }catch(e){return 'error';}
  }
  ping('probe_loaded',location.href);
  document.addEventListener('click',function(e){
    try{
      var b=e.target&&e.target.closest?e.target.closest('button,[role="button"],.prep-start'):null;
      var text=b?String(b.innerText||b.textContent||'').replace(/\s+/g,' ').trim():'';
      if(text.indexOf('방송 시작')>-1||text.indexOf('방송시작')>-1||(b&&b.matches&&b.matches('.prep-start')))ping('probe_start_click',text);
    }catch(x){}
  },true);
  setInterval(function(){ping('probe_state',state());},1000);
})();