/* K-Talk 라이브방 출석체크: 시청자가 1회 누르면 호스트에게 장미 1송이. 호스트 본인 self 지급은 차단. */
(function(){
  if(window.__ktRoomAttendanceHostRoseFinal20260913)return;
  window.__ktRoomAttendanceHostRoseFinal20260913=true;

  var originalAttendanceCheck=window.ktAttendanceCheck;
  var originalOpenAttendanceBenefits=window.openAttendanceBenefits;
  var roomSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';

  function visibleHostRoom(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return null;
    var rooms=[].slice.call(document.querySelectorAll(roomSelector));
    if(!rooms.length)return null;
    for(var i=0;i<rooms.length;i++){
      try{
        var cs=getComputedStyle(rooms[i]);
        var rect=rooms[i].getBoundingClientRect();
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&rect.width>0&&rect.height>0)return rooms[i];
      }catch(e){}
    }
    return rooms[0]||null;
  }

  /* 호스트 자신의 방에서 출석 버튼을 눌러도 안내창/음성은 띄우지 않는다. */
  function explainHostAttendance(){
    return;
  }

  /* 호스트 자신의 방에서는 self 보상을 절대 주지 않는다. 실제 지급은 원격 시청자의 ktRemoteAttendance → 호스트 동기화 경로에서만 처리한다. */
  window.ktAttendanceCheck=function(){
    if(visibleHostRoom()){
      explainHostAttendance();
      return;
    }
    if(document.documentElement.classList.contains('kt-remote-viewing')&&typeof window.ktRemoteAttendance==='function'){
      return window.ktRemoteAttendance();
    }
    if(typeof originalAttendanceCheck==='function')return originalAttendanceCheck.apply(this,arguments);
  };

  window.openAttendanceBenefits=function(){
    if(visibleHostRoom()){
      explainHostAttendance();
      return;
    }
    if(document.documentElement.classList.contains('kt-remote-viewing')&&typeof window.ktRemoteAttendance==='function'){
      return window.ktRemoteAttendance();
    }
    if(typeof originalOpenAttendanceBenefits==='function')return originalOpenAttendanceBenefits.apply(this,arguments);
  };
})();

/* 방송 시작 순서만 고정: 시작 버튼을 누르는 즉시 5→4→3→2→1을 전부 보여준 뒤 약 1초 후 기존 방송 시작 흐름을 실행한다. 다른 UI/방/선물/버튼은 변경하지 않음. */
(function(){
  if(window.__ktFullFiveSecondStartGate20260917)return;
  window.__ktFullFiveSecondStartGate20260917=true;

  var previousStart=window.startBroadcast;
  var previousCountdown=window.ktLiveStartCountdown;
  if(typeof previousStart!=='function')return;

  var launching=false;
  var bypassNestedCountdown=false;

  function sleep(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}

  function removeCountdown(){
    var old=document.getElementById('ktLiveCountdown');
    if(old&&old.parentNode)old.parentNode.removeChild(old);
  }

  async function showFullCountdown(){
    removeCountdown();
    var wrap=document.createElement('div');
    wrap.id='ktLiveCountdown';
    wrap.style.cssText='position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:transparent;overflow:hidden;pointer-events:none;';

    /* 카운트다운 5초 동안 검은 화면 대신 준비 화면의 같은 카메라 영상을 그대로 유지한다. 새 카메라는 열지 않는다. */
    var previewStream=null;
    try{
      previewStream=(window.state&&state.stream)||((document.getElementById('camera')||{}).srcObject)||null;
      if(previewStream&&previewStream.getVideoTracks&&!previewStream.getVideoTracks().some(function(t){return t.readyState==='live';}))previewStream=null;
    }catch(e){previewStream=null;}
    if(previewStream){
      var bg=document.createElement('video');
      bg.autoplay=true;bg.muted=true;bg.defaultMuted=true;bg.playsInline=true;
      bg.setAttribute('autoplay','');bg.setAttribute('muted','');bg.setAttribute('playsinline','');bg.setAttribute('webkit-playsinline','');
      bg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#000;transform:scaleX(-1);';
      try{bg.srcObject=previewStream;var bp=bg.play();if(bp&&bp.catch)bp.catch(function(){});}catch(e){}
      wrap.appendChild(bg);
    }
    var shade=document.createElement('div');
    shade.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.16);';
    wrap.appendChild(shade);

    var num=document.createElement('div');
    num.style.cssText='position:relative;z-index:2;width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.74);border:4px solid rgba(255,255,255,.94);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.72);text-shadow:0 0 12px rgba(255,255,255,.72);';
    wrap.appendChild(num);
    document.body.appendChild(wrap);

    for(var n=5;n>=1;n--){
      num.textContent=String(n);
      num.style.transform='scale(1)';
      setTimeout(function(){try{num.style.transform='scale(.92)';}catch(e){}},650);
      await sleep(1000);
    }
    removeCountdown();
  }

  /* 기존 내부 코드가 또 카운트다운을 부르면 중복 표시하지 않는다. */
  window.ktLiveStartCountdown=async function(){
    if(bypassNestedCountdown)return true;
    if(typeof previousCountdown==='function')return previousCountdown.apply(this,arguments);
    return true;
  };

  window.startBroadcast=async function(){
    if(launching)return;
    launching=true;
    bypassNestedCountdown=true;
    var self=this,args=arguments;

    try{
      await showFullCountdown();
      return await previousStart.apply(self,args);
    }finally{
      removeCountdown();
      bypassNestedCountdown=false;
      setTimeout(function(){launching=false;},300);
    }
  };
})();

/* 동영상 화면 위 LIVE 표시만 정리: 이 휴대폰의 방송방이 실제로 열려 있지 않으면 이 휴대폰의 오래된 LIVE 배지/팔로우 표시를 숨긴다. 다른 사람의 실제 LIVE 표시는 건드리지 않음. */
(function(){
  if(window.__ktHideStaleSelfLiveBadge20260917)return;
  window.__ktHideStaleSelfLiveBadge20260917=true;

  function localHostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'');}catch(e){return '';}
  }

  function hostRoomVisible(){
    var q='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';
    var list=[].slice.call(document.querySelectorAll(q));
    for(var i=0;i<list.length;i++){
      try{
        var r=list[i].getBoundingClientRect(),cs=getComputedStyle(list[i]);
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0)return true;
      }catch(e){}
    }
    return false;
  }

  function hasHostId(root,id){
    if(!root||!id)return false;
    var tagged=root.querySelectorAll('[data-host]');
    for(var i=0;i<tagged.length;i++){
      if(String(tagged[i].getAttribute('data-host')||'')===id)return true;
    }
    return false;
  }

  function cleanStaleSelf(){
    if(hostRoomVisible())return;
    var id=localHostId();
    if(!id)return;

    var peek=document.getElementById('ktVideoLivePeek');
    if(peek&&hasHostId(peek,id))peek.remove();

    var strip=document.getElementById('ktFollowLiveStrip');
    if(strip){
      [].slice.call(strip.querySelectorAll('.kt-follow-person[data-host]')).forEach(function(b){
        if(String(b.getAttribute('data-host')||'')===id)b.remove();
      });
      if(!strip.querySelector('.kt-follow-person')){
        strip.remove();
        try{document.body.classList.remove('kt-follow-status-open');}catch(e){}
      }
    }
  }

  setInterval(cleanStaleSelf,700);
  try{
    new MutationObserver(function(){setTimeout(cleanStaleSelf,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setTimeout(cleanStaleSelf,100);
})();
