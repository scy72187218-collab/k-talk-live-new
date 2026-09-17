/* K-Talk: 친구/원격 방송에 이미 입장한 뒤 채팅 UI가 늦게 로드된 경우만 자동 복구. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktRemoteViewerRecoveryInstalled)return;
  window.__ktRemoteViewerRecoveryInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var busy=false,lastHost='',lastAt=0;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){try{return localStorage.getItem('kt_live_device_id')||'';}catch(e){return '';}}

  async function currentRemoteHost(){
    var id=deviceId();
    if(!id)return '';
    try{
      var viewerId='viewer_'+id;
      var url=BASE+'ktalk_live_viewers?select=host_id,viewer_id,active,updated_at&viewer_id=eq.'+enc(viewerId)+'&active=eq.true&order=updated_at.desc&limit=1';
      var r=await fetch(url,{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(!r.ok)return '';
      var rows=await r.json();
      return rows&&rows[0]&&rows[0].host_id?String(rows[0].host_id):'';
    }catch(e){return '';}
  }

  async function recover(){
    if(busy)return;
    var root=document.querySelector('.kt-remote-live');
    if(!root)return;
    if(document.getElementById('ktRemoteBottom')&&document.getElementById('ktRemoteChatList'))return;

    var enter=window.ktEnterRemoteLive;
    if(typeof enter!=='function'||!enter.__ktInteractionWrapped)return;

    busy=true;
    try{
      var hostId=await currentRemoteHost();
      if(!hostId)return;
      var now=Date.now();
      if(hostId===lastHost&&now-lastAt<10000)return;
      lastHost=hostId;lastAt=now;
      await enter(hostId);
    }catch(e){}
    finally{busy=false;}
  }

  setTimeout(recover,250);
  setInterval(recover,900);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(recover,120);});
})();
