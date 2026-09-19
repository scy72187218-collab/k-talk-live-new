/* K-Talk 호스트방 퇴장 게스트 자동 정리
   - fresh viewer heartbeat가 7초 이상 없으면 서버 active=false
   - 해당 호스트 게스트 칸도 즉시 '게스트' 빈칸으로 복구
   - 방 배치/채팅/스위치에는 손대지 않음 */
(function(){
  if(window.__ktHostStaleGuestCleanup20260920)return;
  window.__ktHostStaleGuestCleanup20260920=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var running=false;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('cleanup '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function hostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'');}catch(e){return '';}
  }
  function hostRoomVisible(){
    try{
      return !!document.querySelector('#screen .ktg13-room:not(.kt-remote-live .ktg13-room)');
    }catch(e){return false;}
  }
  function restoreSlot(slot){
    if(!slot)return;
    try{
      var vid=String(slot.dataset.ktGuestViewerId||'');
      if(window.ktGuestGiftTarget&&String(window.ktGuestGiftTarget.viewerId||'')===vid)window.ktGuestGiftTarget=null;
      slot.classList.remove('kt-gift-target','kt-guest-live','kt-guest-connected','kt-peer-guest');
      delete slot.dataset.ktGuestViewerId;
      delete slot.dataset.viewerId;
      slot.innerHTML='';
      slot.textContent='게스트';
    }catch(e){}
  }
  function clearMissingFresh(fresh){
    try{
      document.querySelectorAll('.ktg13-room .ktg13-guest[data-kt-guest-viewer-id]').forEach(function(slot){
        var id=String(slot.dataset.ktGuestViewerId||'');
        if(id&&!fresh[id])restoreSlot(slot);
      });
    }catch(e){}
  }

  async function cleanup(){
    if(running||document.hidden||!hostRoomVisible())return;
    var hid=hostId();if(!hid)return;
    running=true;
    try{
      var cut=new Date(Date.now()-7000).toISOString();

      var freshRows=await req('ktalk_live_viewers?select=viewer_id&host_id=eq.'+enc(hid)+'&active=eq.true&updated_at=gte.'+enc(cut)+'&limit=100')||[];
      var fresh={};
      freshRows.forEach(function(x){fresh[String(x.viewer_id||'')]=true;});

      var staleRows=await req('ktalk_live_viewers?select=viewer_id&host_id=eq.'+enc(hid)+'&active=eq.true&updated_at=lt.'+enc(cut)+'&limit=100')||[];
      for(var i=0;i<staleRows.length;i++){
        var vid=String(staleRows[i].viewer_id||'');if(!vid)continue;
        try{
          await req('ktalk_live_viewers?host_id=eq.'+enc(hid)+'&viewer_id=eq.'+enc(vid)+'&active=eq.true',{
            method:'PATCH',headers:{Prefer:'return=minimal'},
            body:JSON.stringify({active:false,updated_at:new Date().toISOString()})
          });
        }catch(e){}
        try{
          await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hid)+'&viewer_id=eq.'+enc(vid)+'&active=eq.true',{
            method:'PATCH',headers:{Prefer:'return=minimal'},
            body:JSON.stringify({active:false,updated_at:new Date().toISOString()})
          });
        }catch(e){}
        try{
          await req('ktalk_webrtc_sessions?host_id=eq.'+enc(hid)+'&viewer_id=eq.'+enc('guest:'+vid)+'&active=eq.true',{
            method:'PATCH',headers:{Prefer:'return=minimal'},
            body:JSON.stringify({active:false,updated_at:new Date().toISOString()})
          });
        }catch(e){}
      }

      clearMissingFresh(fresh);
    }catch(e){}
    finally{running=false;}
  }

  [300,900,1800].forEach(function(ms){setTimeout(cleanup,ms);});
  window.__ktHostStaleGuestCleanupTimer=setInterval(cleanup,2200);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(cleanup,150);});
  window.addEventListener('focus',function(){setTimeout(cleanup,150);});
})();