/* K-Talk 빨간 LIVE 신호 수신 전용 잠금 2026-09-30
   범위: 동영상 화면에서 방송 신호를 직접 받아 빨간 LIVE를 표시.
   동영상/입장퇴장/WebRTC/게스트/수익률/방 배치는 변경하지 않음. */
(function(){
  if(window.__ktRedLiveSignalReceiverLock20260930)return;
  window.__ktRedLiveSignalReceiverLock20260930=true;

  function inVideoView(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(document.documentElement.classList.contains('kt-inside-broadcast-room'))return false;
      if(document.body.classList.contains('kt-video-mode'))return true;
      return !!document.querySelector('#screen .kt-public-video,#screen #homeVideo,#screen .video-home,#screen .media');
    }catch(e){return false;}
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function removeFallback(){
    try{
      var x=document.getElementById('ktRedLiveReceiverFallback20260930');
      if(x)x.remove();
    }catch(e){}
  }

  var endedHosts20261001={};
  function markEnded20261001(hostId){
    try{
      hostId=String(hostId||'').trim();
      if(!hostId)return;
      endedHosts20261001[hostId]=Date.now();
      removeFallback();
      var peek=document.getElementById('ktVideoLivePeek');
      if(peek){
        var hit=peek.querySelector('[data-host="'+CSS.escape(hostId)+'"]');
        if(hit)peek.remove();
      }
    }catch(e){}
  }
  function recentlyEnded20261001(hostId){
    try{
      var at=Number(endedHosts20261001[String(hostId||'')]||0);
      if(!at)return false;
      if(Date.now()-at>12000){delete endedHosts20261001[String(hostId||'')];return false;}
      return true;
    }catch(e){return false;}
  }
  window.addEventListener('kt-live-off',function(e){
    try{markEnded20261001(e&&e.detail&&e.detail.host_id);}catch(_e){}
  });
  window.addEventListener('kt-room-closed',function(e){
    try{markEnded20261001(e&&e.detail&&e.detail.host_id);}catch(_e){}
  });
  window.addEventListener('kt-broadcast-ended',function(e){
    try{markEnded20261001(e&&e.detail&&e.detail.host_id);}catch(_e){}
  });

  function ensureStyle(){
    if(document.getElementById('ktRedLiveReceiverFallbackStyle20260930'))return;
    var s=document.createElement('style');
    s.id='ktRedLiveReceiverFallbackStyle20260930';
    s.textContent=
      '#ktRedLiveReceiverFallback20260930{position:fixed;left:10px;top:56px;z-index:19;height:38px;padding:4px 5px;border-radius:999px;background:rgba(8,8,12,.78);color:#fff;display:flex;align-items:center;gap:6px;box-sizing:border-box;backdrop-filter:blur(5px)}'+
      '#ktRedLiveReceiverFallback20260930 .kt-rx-name{font-size:9px;font-weight:900;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
      '#ktRedLiveReceiverFallback20260930 .kt-rx-live{border:0;border-radius:999px;background:#e91845;color:#fff;padding:4px 6px;font-size:8px;font-weight:950;touch-action:manipulation}';
    document.head.appendChild(s);
  }

  function showRoom(room){
    if(!room||!room.host_id||!inVideoView()){removeFallback();return;}
    if(recentlyEnded20261001(room.host_id)){removeFallback();return;}
    if(document.getElementById('ktVideoLivePeek')){removeFallback();return;}
    ensureStyle();
    var box=document.getElementById('ktRedLiveReceiverFallback20260930');
    if(!box){
      box=document.createElement('div');
      box.id='ktRedLiveReceiverFallback20260930';
      document.body.appendChild(box);
    }
    var hostId=String(room.host_id||'');
    var hostName=String(room.host_name||'K-Talk 방송자');
    box.innerHTML='<span class="kt-rx-name">'+esc(hostName)+'</span><button type="button" class="kt-rx-live">● LIVE</button>';
    var b=box.querySelector('.kt-rx-live');
    if(b)b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      try{if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(hostId);}catch(_e){}
    };
  }

  async function poll(){
    if(!inVideoView()){removeFallback();return;}
    try{
      var r=await fetch('/api/live-beacon-memory?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      var j=await r.json();
      var rooms=Array.isArray(j&&j.rooms)?j.rooms:[];
      if(rooms.length)showRoom(rooms[0]);
      else removeFallback();
    }catch(e){}
  }

  setInterval(poll,450);
  [60,180,420,800,1400].forEach(function(ms){setTimeout(poll,ms);});
  window.addEventListener('pageshow',function(){setTimeout(poll,80);});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(poll,80);});
})();