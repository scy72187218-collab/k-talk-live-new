/* K-Talk: 일부 휴대폰에서 앞카메라 요청 실패 시 뒷카메라로 떨어지는 경우만 보강. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktFrontCameraUserFallback20260914)return;
  window.__ktFrontCameraUserFallback20260914=true;

  function attachStream(stream){
    if(!stream)return;
    try{
      document.querySelectorAll('#camera,.ktsolo-room video,.ktg13-room video,.ktsubscriber-room video,.ktsecret-room video,#ktLiveVideo').forEach(function(v){
        try{
          v.srcObject=stream;
          v.style.setProperty('transform','scaleX(-1)','important');
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }

  async function forceFrontOnce(){
    try{
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.state)return false;
      var current=state.stream;
      var currentVideo=current&&current.getVideoTracks?current.getVideoTracks()[0]:null;
      if(currentVideo&&currentVideo.__ktFrontVerified)return true;

      var front=null;
      try{
        front=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:'user'},width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }catch(e){
        if(currentVideo)currentVideo.__ktFrontVerified=true;
        return false;
      }

      var frontTrack=front&&front.getVideoTracks?front.getVideoTracks()[0]:null;
      if(!frontTrack){try{front&&front.getTracks().forEach(function(t){t.stop();});}catch(e){}return false;}
      frontTrack.__ktFrontVerified=true;

      var audioTracks=current&&current.getAudioTracks?current.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];
      var merged=new MediaStream([frontTrack].concat(audioTracks));
      if(current&&current.getVideoTracks){current.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});}
      state.stream=merged;
      state.cameraFacing='user';
      attachStream(merged);
      return true;
    }catch(e){return false;}
  }

  function install(){
    var old=window.ensureLiveCamera;
    if(typeof old!=='function'||old.__ktFrontCameraUserFallbackWrapped)return;
    var wrapped=async function(facing){
      var want=facing||((window.state&&state.cameraFacing)||'user');
      var ok=await old.apply(this,arguments);
      if(ok&&want==='user')await forceFrontOnce();
      return ok;
    };
    wrapped.__ktFrontCameraUserFallbackWrapped=true;
    window.ensureLiveCamera=wrapped;
  }

  install();
  setTimeout(install,0);
  setTimeout(install,500);
})();

/* 게스트 승인 뒤 본인 얼굴만 전체화면으로 커지는 부분만 보강.
   호스트 영상과 승인된 게스트 본인 영상을 같은 방송방 격자 안에 표시한다. */
(function(){
  if(window.__ktApprovedGuestSameRoomGrid20260917)return;
  window.__ktApprovedGuestSameRoomGrid20260917=true;

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestSameRoomGridStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestSameRoomGridStyle';
    s.textContent=''
      +'.kt-remote-live.kt-guest-same-room{display:flex!important;flex-direction:column!important;gap:5px!important;padding:5px 6px calc(62px + env(safe-area-inset-bottom))!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-guest-same-room>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 58px!important;border-radius:16px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important;padding:6px 9px!important}'
      +'.kt-remote-live.kt-guest-same-room>.kt-remote-shade{display:none!important}'
      +'.kt-guest-room-led{flex:0 0 46px!important;position:relative!important;border:2px solid #ff28c4!important;border-radius:20px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.4px)!important;background-size:12px 12px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 18px #ff28c455!important;color:#ffd62d!important;font-size:18px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;text-shadow:0 0 6px #ff8b00!important}'
      +'.kt-guest-room-stats{flex:0 0 43px!important;display:grid!important;grid-template-columns:1fr 1fr 1.3fr!important;gap:5px!important}.kt-guest-room-stats>div{border-radius:12px!important;background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important}'
      +'.kt-guest-room-grid{flex:1 1 0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important;overflow:hidden!important}.kt-guest-room-grid.is13{grid-template-columns:repeat(4,minmax(0,1fr))!important}'
      +'.kt-guest-room-cell{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid #292a30!important;border-radius:8px!important;background:linear-gradient(145deg,#17181d,#0e0f13)!important;color:#bfc0c7!important;display:grid!important;place-items:center!important;font-size:12px!important;font-weight:900!important}.kt-guest-room-cell video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#111!important}.kt-guest-room-cell.host video{transform:none!important}.kt-guest-room-cell.self video{transform:scaleX(-1)!important}.kt-guest-room-cell label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}.kt-guest-room-cell.self{outline:2px solid #61d9ff!important;outline-offset:-2px!important}'
      +'.kt-remote-live.kt-guest-same-room #ktRemoteLiveStatus{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;z-index:12!important;font-size:10px!important;padding:7px 9px!important}'
      +'.kt-remote-live.kt-guest-same-room .kt-remote-attendance{top:69px!important;right:12px!important;height:29px!important;font-size:10px!important;padding:0 9px!important}'
      +'.kt-remote-live.kt-guest-same-room .kt-remote-chat{bottom:60px!important;max-height:105px!important;right:58px!important}.kt-remote-live.kt-guest-same-room .kt-remote-bottom{bottom:calc(5px + env(safe-area-inset-bottom))!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-guest-same-room{gap:3px!important;padding-left:4px!important;padding-right:4px!important}.kt-remote-live.kt-guest-same-room>.kt-remote-top{flex-basis:54px!important}.kt-guest-room-led{flex-basis:40px!important;font-size:16px!important}.kt-guest-room-stats{flex-basis:39px!important}.kt-guest-room-stats>div{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function roomText(){
    var m=document.querySelector('.kt-remote-meta span');
    return m?String(m.textContent||''):'';
  }

  function makeCell(cls,label){
    var d=document.createElement('div');
    d.className='kt-guest-room-cell '+(cls||'');
    if(label){var l=document.createElement('label');l.textContent=label;d.appendChild(l);}else d.textContent='게스트';
    return d;
  }

  function apply(){
    try{
      ensureStyle();
      var root=document.querySelector('.kt-remote-live');
      var main=document.getElementById('ktRemoteLiveVideo');
      var preview=document.getElementById('ktRemoteHostPreview');
      if(!root||!main||!preview||root.classList.contains('kt-guest-same-room'))return;

      var text=roomText();
      var is13=text.indexOf('13명')>-1;
      var is9=text.indexOf('9명')>-1;
      if(!is9&&!is13)return;

      var guestStream=main.srcObject||null;
      var hostStream=preview.srcObject||null;

      main.id='ktRemoteGuestSelfVideo';
      main.className='';
      main.muted=true;
      main.playsInline=true;
      main.autoplay=true;
      main.style.cssText='';
      if(guestStream)main.srcObject=guestStream;

      preview.id='ktRemoteLiveVideo';
      preview.className='';
      preview.muted=false;
      preview.playsInline=true;
      preview.autoplay=true;
      preview.style.cssText='';
      if(hostStream)preview.srcObject=hostStream;

      root.classList.add('kt-guest-same-room');

      var led=document.createElement('div');
      led.className='kt-guest-room-led';
      led.textContent='💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송';

      var stats=document.createElement('div');
      stats.className='kt-guest-room-stats';
      stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';

      var grid=document.createElement('div');
      grid.className='kt-guest-room-grid'+(is13?' is13':'');
      var total=is13?13:9;

      var hostCell=makeCell('host','호스트');
      hostCell.appendChild(preview);
      grid.appendChild(hostCell);

      var selfCell=makeCell('self','나 · 게스트');
      selfCell.appendChild(main);
      grid.appendChild(selfCell);

      for(var i=2;i<total;i++)grid.appendChild(makeCell('',''));

      var top=root.querySelector('.kt-remote-top');
      if(top&&top.nextSibling){root.insertBefore(led,top.nextSibling);}else root.appendChild(led);
      if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
      if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);

      var status=document.getElementById('ktRemoteLiveStatus');
      if(status&&hostStream)status.style.display='none';

      try{var p1=preview.play();if(p1&&p1.catch)p1.catch(function(){});}catch(e){}
      try{var p2=main.play();if(p2&&p2.catch)p2.catch(function(){});}catch(e){}
    }catch(e){}
  }

  var mo=new MutationObserver(function(){setTimeout(apply,30);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(apply,700);
  setTimeout(apply,300);
})();
