/* K-Talk desktop-only live layout fix. Mobile is intentionally untouched. */
(function(){
  if(window.__ktDesktopLiveFullscreenLoaded)return;
  window.__ktDesktopLiveFullscreenLoaded=true;

  function isDesktop(){return window.matchMedia&&window.matchMedia('(min-width: 768px)').matches;}
  function roomType(){try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}}

  function apply(){
    if(!isDesktop())return;

    var app=document.querySelector('.app');
    if(app){
      app.style.setProperty('max-width','none','important');
      app.style.setProperty('width','100vw','important');
      app.style.setProperty('margin','0','important');
    }
    var screenEl=document.getElementById('screen');
    if(screenEl){
      screenEl.style.setProperty('width','100%','important');
      screenEl.style.setProperty('padding','0','important');
    }

    /* Viewer on a computer: fill the browser instead of leaving a small phone-sized black area. */
    var remote=document.getElementById('ktRemoteLive');
    if(remote){
      remote.style.setProperty('position','absolute','important');
      remote.style.setProperty('inset','0','important');
      remote.style.setProperty('width','100%','important');
      remote.style.setProperty('height','100%','important');
      remote.style.setProperty('object-fit','cover','important');
      remote.style.setProperty('object-position','50% 50%','important');
      remote.style.setProperty('background','#000','important');
    }

    /* Host on a computer. 13-person/subscriber rooms keep their existing host + guest grid. */
    var live=document.getElementById('ktLiveVideo');
    if(live){
      var t=roomType();
      if(t==='group13'||t==='subscriber'){
        if(window.ktApplyTikTokMultiRoomLayout)window.ktApplyTikTokMultiRoomLayout();
      }else{
        live.style.setProperty('position','absolute','important');
        live.style.setProperty('inset','0','important');
        live.style.setProperty('width','100%','important');
        live.style.setProperty('height','100%','important');
        live.style.setProperty('object-fit','cover','important');
        live.style.setProperty('object-position','50% 50%','important');
        live.style.setProperty('transform','scaleX(-1)','important');
        live.style.setProperty('transform-origin','50% 50%','important');
        live.style.setProperty('background','#000','important');
        var layer=document.getElementById('ktLiveEffectLayer');
        if(layer){
          layer.style.setProperty('transform','none','important');
          layer.style.setProperty('transform-origin','50% 50%','important');
        }
      }
    }
  }

  try{
    var obs=new MutationObserver(function(){setTimeout(apply,20);});
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',apply);
  setInterval(apply,700);
  setTimeout(apply,100);
})();

/* Desktop viewer connection stability only. Phone behavior/layout is untouched. */
(function(){
  if(window.__ktDesktopLiveReconnectLoaded)return;
  window.__ktDesktopLiveReconnectLoaded=true;

  function isDesktop(){return window.matchMedia&&window.matchMedia('(min-width: 768px)').matches;}
  var lastJoin=null;
  var retryTimer=null;
  var lastTime=-1;
  var stalled=0;

  function installJoinWrapper(){
    var fn=window.ktJoinLive;
    if(typeof fn!=='function'||fn.__ktDesktopStableWrapped)return;
    function wrapped(hostId,title,roomName){
      if(isDesktop()){
        lastJoin={hostId:hostId,title:title,roomName:roomName};
        lastTime=-1;
        stalled=0;
      }
      return fn.apply(this,arguments);
    }
    wrapped.__ktDesktopStableWrapped=true;
    wrapped.__ktDesktopOriginal=fn;
    window.ktJoinLive=wrapped;
  }

  function scheduleRetry(delay){
    if(!isDesktop()||!lastJoin||retryTimer)return;
    if(!document.getElementById('ktRemoteLive'))return;
    retryTimer=setTimeout(function(){
      retryTimer=null;
      if(!isDesktop()||!lastJoin||!document.getElementById('ktRemoteLive'))return;
      try{window.ktJoinLive(lastJoin.hostId,lastJoin.title,lastJoin.roomName);}catch(e){}
    },delay||1500);
  }

  setInterval(function(){
    installJoinWrapper();
    if(!isDesktop())return;

    var remote=document.getElementById('ktRemoteLive');
    if(!remote){lastTime=-1;stalled=0;return;}

    var status=document.getElementById('ktRemoteLiveStatus');
    var text=status?(status.textContent||''):'';
    if(text.indexOf('끊겼')>=0||text.indexOf('실패')>=0||text.indexOf('늦습니다')>=0){
      scheduleRetry(1200);
      return;
    }

    var t=Number(remote.currentTime||0);
    if(remote.readyState>=2&&t>0){
      if(lastTime>=0&&Math.abs(t-lastTime)<0.08)stalled++;
      else stalled=0;
      lastTime=t;
      if(stalled>=4){
        stalled=0;
        scheduleRetry(1000);
      }
    }else if(remote.readyState<2){
      stalled++;
      if(stalled>=4){stalled=0;scheduleRetry(1000);}
    }
  },2500);

  window.addEventListener('online',function(){
    if(isDesktop()&&document.getElementById('ktRemoteLive'))scheduleRetry(500);
  });
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&isDesktop()&&document.getElementById('ktRemoteLive')){
      setTimeout(function(){
        var v=document.getElementById('ktRemoteLive');
        if(v&&v.readyState<2)scheduleRetry(500);
      },600);
    }
  });

  installJoinWrapper();
})();

/* Mobile 1-person LIVE only: remove the 72% shrink that caused black sidebars. */
(function(){
  if(window.__ktMobileSoloLiveFillLoaded)return;
  window.__ktMobileSoloLiveFillLoaded=true;

  function isMobile(){return window.matchMedia&&window.matchMedia('(max-width: 767px)').matches;}
  function isSolo(){
    try{
      if(!window.state)return false;
      return state.liveRoomType==='solo'||Number(state.liveRoomMax)===1||state.liveRoomName==='1인 방송';
    }catch(e){return false;}
  }
  function fillSolo(){
    if(!isMobile()||!isSolo())return;
    var v=document.getElementById('ktLiveVideo');
    if(!v)return;
    var hostScreen=document.getElementById('ktSoloHostLive');
    if(hostScreen){
      var bg=document.getElementById('ktSoloBgVideo');
      if(!bg){
        bg=document.createElement('video');
        bg.id='ktSoloBgVideo';
        bg.autoplay=true;bg.playsInline=true;bg.muted=true;
        hostScreen.insertBefore(bg,hostScreen.firstChild);
      }
      try{bg.srcObject=v.srcObject||(window.state&&state.stream)||null;var bp=bg.play();if(bp&&bp.catch)bp.catch(function(){});}catch(e){}
      bg.style.cssText='position:absolute;inset:-5%;width:110%;height:110%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1);filter:blur(18px) brightness(.56);opacity:.72;background:#000;z-index:0';
      v.style.setProperty('position','absolute','important');
      v.style.setProperty('left','8%','important');
      v.style.setProperty('top','8%','important');
      v.style.setProperty('right','auto','important');
      v.style.setProperty('bottom','auto','important');
      v.style.setProperty('width','84%','important');
      v.style.setProperty('height','84%','important');
      v.style.setProperty('object-fit','contain','important');
      v.style.setProperty('object-position','50% 50%','important');
      v.style.setProperty('transform','scaleX(-1)','important');
      v.style.setProperty('transform-origin','50% 50%','important');
      v.style.setProperty('background','transparent','important');
      v.style.setProperty('border-radius','14px','important');
      v.style.setProperty('z-index','1','important');
    }else{
      v.style.setProperty('width','100%','important');
      v.style.setProperty('height','100%','important');
      v.style.setProperty('object-fit','cover','important');
      v.style.setProperty('object-position','50% 50%','important');
      v.style.setProperty('transform','scaleX(-1)','important');
      v.style.setProperty('transform-origin','50% 50%','important');
      v.style.setProperty('background','#000','important');
    }
    var layer=document.getElementById('ktLiveEffectLayer');
    if(layer){
      layer.style.setProperty('transform','none','important');
      layer.style.setProperty('transform-origin','50% 50%','important');
    }
  }

  var lastSoloVideo=null;
  function applySoloForNewVideo(){
    if(!isMobile()||!isSolo())return;
    var v=document.getElementById('ktLiveVideo');
    if(!v){lastSoloVideo=null;return;}
    if(v===lastSoloVideo)return;
    lastSoloVideo=v;
    setTimeout(function(){if(v===document.getElementById('ktLiveVideo'))fillSolo();},40);
  }
  try{
    var obs=new MutationObserver(applySoloForNewVideo);
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  applySoloForNewVideo();
})();

/* 1-person LIVE start fix: broadcaster stays on the real camera screen so outside devices can connect to the actual stream. */
(function(){
  if(window.__ktSoloHostLiveStartFixLoaded)return;
  window.__ktSoloHostLiveStartFixLoaded=true;

  function isSolo(){
    try{
      return !!window.state&&(state.liveRoomType==='solo'||Number(state.liveRoomMax)===1||state.liveRoomName==='1인 방송');
    }catch(e){return false;}
  }

  function install(){
    var original=window.startBroadcast;
    if(typeof original!=='function'||original.__ktSoloHostLiveFixed)return;

    async function fixedStartBroadcast(){
      if(!isSolo())return original.apply(this,arguments);

      var ok=false;
      try{
        if(window.ensureLiveCamera)ok=await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
        else ok=!!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().length);
      }catch(e){ok=false;}
      if(!ok)return;

      var stream=null;
      try{stream=state.stream;}catch(e){}
      if(!stream||!stream.getVideoTracks||!stream.getVideoTracks().length)return;

      var title='1인 방송';
      try{
        var input=document.getElementById('liveTitle');
        title=(input&&input.value&&input.value!=='오늘 라이브 제목을 입력하세요')?input.value:(state.liveRoomName||'1인 방송');
        state.currentLiveRoomTitle=title;
        state.liveRoomType='solo';
        state.liveRoomName='1인 방송';
        state.liveRoomMax=1;
      }catch(e){}

      try{
        var creatorEl=document.getElementById('creator')||window.creator;
        if(creatorEl&&creatorEl.classList)creatorEl.classList.remove('show','live-prep-open');
        document.body.classList.remove('kt-home');
        document.body.classList.add('kt-solo-host-live');
        var bottom=document.querySelector('.bottom');
        var header=document.querySelector('.header');
        if(bottom)bottom.style.setProperty('display','none','important');
        if(header)header.style.setProperty('display','none','important');
      }catch(e){}

      var s=document.getElementById('screen');
      if(!s)return;
      s.style.setProperty('height','100dvh','important');
      s.style.setProperty('min-height','100dvh','important');
      s.style.setProperty('padding','0','important');
      s.style.setProperty('margin','0','important');
      s.style.setProperty('overflow','hidden','important');
      s.style.setProperty('background','#000','important');
      s.innerHTML='<section id="ktSoloHostLive" style="position:relative;width:100%;height:100dvh;overflow:hidden;background:#000;color:#fff">'
        +'<video id="ktLiveVideo" autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;background:#000;transform:scaleX(-1)"></video>'
        +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
        +'<div id="ktSoloCountdownNumber" style="position:absolute;z-index:9;left:50%;top:50%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.58);border:2px solid rgba(255,255,255,.85);font-size:48px;font-weight:950;text-shadow:0 2px 8px #000">5</div>'
        +'<div style="position:absolute;z-index:8;left:12px;right:12px;top:12px;display:flex;align-items:center;gap:9px">'
          +'<span id="ktSoloLiveBadge" style="padding:9px 13px;border-radius:999px;background:#555;font-size:13px;font-weight:950;box-shadow:0 0 14px #0006">방송 준비</span>'
          +'<div style="min-width:0;flex:1;padding:8px 11px;border-radius:14px;background:#08080b99"><b style="display:block;font-size:14px">K-Talk · 1인 방송</b><small style="display:block;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+String(title).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];})+'</small></div>'
          +'<button onclick="ktEndSoloHostLive()" style="width:44px;height:44px;border:0;border-radius:50%;background:#08080bbb;color:#fff;font-size:28px;line-height:1">×</button>'
        +'</div>'
        +'<div id="ktSoloLiveStatus" style="position:absolute;z-index:8;left:50%;bottom:22px;transform:translateX(-50%);padding:9px 14px;border-radius:999px;background:#08080baa;border:1px solid #ffffff22;font-size:12px;font-weight:850;white-space:nowrap">방송 시작까지 5초</div>'
      +'</section>';

      var video=document.getElementById('ktLiveVideo');
      if(video){
        video.srcObject=stream;
        try{var p=video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
      }

      try{if(window.applyBeautyPreview)setTimeout(window.applyBeautyPreview,60);}catch(e){}
      try{
        clearInterval(window.__ktSoloCountdownTimer);window.__ktSoloCountdownTimer=null;
        clearInterval(window.__ktSoloElapsedTimer);window.__ktSoloElapsedTimer=null;
        var remain=5;
        var badge=document.getElementById('ktSoloLiveBadge');
        var status=document.getElementById('ktSoloLiveStatus');
        var num=document.getElementById('ktSoloCountdownNumber');
        function showReady(){
          if(num)num.textContent=String(remain);
          if(status)status.textContent='방송 시작까지 '+remain+'초';
        }
        showReady();
        window.__ktSoloCountdownTimer=setInterval(function(){
          remain--;
          if(remain>0){showReady();return;}
          clearInterval(window.__ktSoloCountdownTimer);window.__ktSoloCountdownTimer=null;
          if(num)num.style.display='none';
          if(badge){badge.textContent='● LIVE';badge.style.background='#ff2d55';badge.style.boxShadow='0 0 18px #ff2d5577';}
          var started=Date.now();
          try{if(window.state)state.soloLiveStartedAt=started;}catch(e){}
          function tick(){
            var sec=Math.max(0,Math.floor((Date.now()-started)/1000));
            var mm=String(Math.floor(sec/60)).padStart(2,'0');
            var ss=String(sec%60).padStart(2,'0');
            if(status)status.textContent='1인 방송 · '+mm+':'+ss;
          }
          tick();
          window.__ktSoloElapsedTimer=setInterval(tick,1000);
          try{if(window.ktSetLivePresence)window.ktSetLivePresence(true);}catch(e){}
        },1000);
      }catch(e){}
    }

    fixedStartBroadcast.__ktSoloHostLiveFixed=true;
    fixedStartBroadcast.__ktSoloHostLiveOriginal=original;
    window.startBroadcast=fixedStartBroadcast;
  }

  window.ktEndSoloHostLive=function(){
    try{clearInterval(window.__ktSoloCountdownTimer);window.__ktSoloCountdownTimer=null;clearInterval(window.__ktSoloElapsedTimer);window.__ktSoloElapsedTimer=null;}catch(e){}
    try{if(window.ktSetLivePresence)window.ktSetLivePresence(false);}catch(e){}
    try{
      if(window.state&&state.stream){
        state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
        state.stream=null;
      }
    }catch(e){}
    try{
      document.body.classList.remove('kt-solo-host-live');
      var bottom=document.querySelector('.bottom');
      var header=document.querySelector('.header');
      if(bottom)bottom.style.removeProperty('display');
      if(header)header.style.removeProperty('display');
      var s=document.getElementById('screen');
      if(s){s.style.removeProperty('height');s.style.removeProperty('min-height');s.style.removeProperty('padding');s.style.removeProperty('margin');s.style.removeProperty('overflow');s.style.removeProperty('background');}
    }catch(e){}
    try{if(window.home)window.home();}catch(e){}
  };

  install();
  setTimeout(install,80);
  setTimeout(install,500);
})();

/* Complete subscriber benefits page: keep every agreed subscriber benefit visible in one place. */
(function(){
  if(window.__ktSubscriberBenefitsCompleteLoaded)return;
  window.__ktSubscriberBenefitsCompleteLoaded=true;

  function install(){
    if(typeof window.showSheet!=='function')return;
    window.openSubscriberBenefits=function(){
      var html='<div class="kt-subscriber-benefits" style="display:grid;gap:10px">'
        +'<div style="padding:16px;border-radius:18px;background:linear-gradient(135deg,#251036,#0c1524);border:1px solid #a968ff66">'
          +'<div style="font-size:28px">💎</div><b style="display:block;margin-top:6px;font-size:20px">K-Talk 구독자 전체 혜택</b><small style="display:block;margin-top:5px;line-height:1.5;color:#ddd">구독자가 받을 수 있는 혜택을 한곳에 모았습니다.</small>'
        +'</div>'
        +'<div class="rowbox"><b>💰 방송 정산 40%</b><br>구독자 호스트는 방송 수익 정산을 40% 기준으로 계산합니다. 일반회원은 35%입니다.</div>'
        +'<div class="rowbox"><b>📊 방송 종료 후 수익 바로 확인</b><br>방송이 끝나면 받은 장미와 정산 기준으로 본인 수익을 바로 확인할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🚪 모든 이용 가능 방송방 입장</b><br>1인 방송 · 13명 방송 · 구독자 방송 · 비밀방 등 이용 가능한 방송방에 들어갈 수 있습니다.</div>'
        +'<div class="rowbox"><b>🎥 모든 방송 종류 만들기</b><br>구독자는 방송 종류를 선택해 직접 호스트 방을 만들 수 있습니다.</div>'
        +'<div class="rowbox"><b>👑 구독자 전용방 이용</b><br>구독자 전용방과 구독자 전용 기능을 이용할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🔒 비밀방 이용</b><br>비밀번호가 있는 비밀방 등 구독자에게 허용된 방을 이용할 수 있습니다.</div>'
        +'<div class="rowbox"><b>✍️ 내 방송 제목 직접 설정</b><br>구독자 호스트는 라이브 시작 전에 자기 방 제목을 직접 입력할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🏦 후원 계좌 등록</b><br>구독자 호스트는 방송 준비 화면에서 은행명 · 계좌번호 · 예금주를 등록해 방송 정보에 표시할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🪙 장미 · 코인 충전 추가 혜택</b><br>구독자는 충전할 때 일반회원보다 추가 혜택을 받을 수 있으며 실제 지급 수량은 충전 화면에서 확인합니다.</div>'
        +'<div class="rowbox"><b>♡ 팬클럽 기능</b><br>팬클럽과 구독자 전용 팬 기능을 이용하고 팬과 더 쉽게 소통할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🎁 팬에게 혜택 주기</b><br>장미 · 선물 · 이벤트 보상 등 제공 가능한 혜택을 팬에게 보낼 수 있습니다.</div>'
        +'<div class="rowbox"><b>🏆 이벤트 · 미션 · 보상</b><br>구독자 대상 이벤트와 이용 가능한 미션 · 보상 기능을 확인하고 참여할 수 있습니다.</div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:2px">'
          +'<button class="act" style="margin:0" onclick="openCharge()">🪙 충전 혜택</button>'
          +'<button class="act" style="margin:0" onclick="openGifts()">🎁 선물 보기</button>'
        +'</div>'
        +'<div class="note">구독자 전용 기능은 구독 상태가 활성화된 계정에 적용됩니다.</div>'
      +'</div>';
      showSheet('💎 구독자 전체 혜택',html);
    };

    window.openGiveBenefits=function(){
      showSheet('💝 혜택 주기',
        '<div class="rowbox"><b>🌹 장미 보내기</b><br>팬이나 방송 참여자에게 장미를 선물할 수 있습니다.</div>'
        +'<div class="rowbox"><b>🎁 선물 보내기</b><br>선물함에서 이용 가능한 선물을 골라 보낼 수 있습니다.</div>'
        +'<div class="rowbox"><b>🏆 이벤트 보상 주기</b><br>진행 중인 이벤트나 미션에서 제공 가능한 보상을 팬에게 줄 수 있습니다.</div>'
        +'<div class="rowbox"><b>♡ 팬클럽 혜택</b><br>팬클럽에서 제공 가능한 응원 · 이벤트 혜택을 안내하고 줄 수 있습니다.</div>'
        +'<div class="rowbox"><b>사용 방법</b><br>보낼 혜택을 고르고 받을 사람을 선택한 다음 보내기를 누릅니다.</div>'
        +'<button class="act" onclick="openGifts()">🌹 장미 · 선물 보내기</button>');
    };
  }

  install();
  setTimeout(install,100);
  setTimeout(install,600);
})();
