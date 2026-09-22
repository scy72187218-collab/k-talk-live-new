/* K-Talk 13명 방송: 사용자가 승인한 화면만 적용. 다른 방은 기존 startBroadcast 그대로 사용. */
(function(){
  if(window.__ktGroup13ApprovedRoomInstalled)return;
  window.__ktGroup13ApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;
  window.ktGroup13ChatMessages=window.ktGroup13ChatMessages||[];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
  }
  function isGroup13(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      return t==='group'||t==='group13'||n==='13명 방송';
    }catch(e){return false;}
  }

  /* 13명방 전환 중 예전 방 화면이 한 프레임이라도 보이지 않게 가린다.
     승인된 현재 13명방을 그린 직후 바로 해제한다. */
  function ensureNoOld13FlashStyle(){
    if(document.getElementById('ktNoOld13FlashStyle'))return;
    var st=document.createElement('style');
    st.id='ktNoOld13FlashStyle';
    st.textContent='html.kt-g13-opening #screen{background:#000!important}html.kt-g13-opening #screen>*:not(.ktg13-room[data-kt-approved13="1"]){opacity:0!important;pointer-events:none!important}html.kt-g13-opening #screen .ktg13-room[data-kt-approved13="1"]{opacity:1!important;pointer-events:auto!important}html.kt-g13-opening #ktLiveInstantHandoff{display:none!important;opacity:0!important;visibility:hidden!important}';
    (document.head||document.documentElement).appendChild(st);
  }
  function markGroup13Opening(){
    try{
      ensureNoOld13FlashStyle();
      document.documentElement.classList.add('kt-g13-opening');
      clearTimeout(window.__ktG13OpeningFailsafe);
      window.__ktG13OpeningFailsafe=setTimeout(function(){
        try{
          if(!document.querySelector('#screen .ktg13-room[data-kt-approved13="1"]')){
            document.documentElement.classList.remove('kt-g13-opening');
          }
        }catch(e){}
      },8000);
    }catch(e){}
  }

  function setupStandaloneShell(){
    try{
      var head=document.head||document.getElementsByTagName('head')[0];
      if(!head)return;
      if(!document.querySelector('link[rel="manifest"]')){
        var link=document.createElement('link');
        link.rel='manifest';
        link.href='/manifest.webmanifest?v=20260907-fullscreen13';
        head.appendChild(link);
      }
      var theme=document.querySelector('meta[name="theme-color"]');
      if(!theme){theme=document.createElement('meta');theme.name='theme-color';head.appendChild(theme);}
      theme.content='#000000';
      var cap=document.querySelector('meta[name="mobile-web-app-capable"]');
      if(!cap){cap=document.createElement('meta');cap.name='mobile-web-app-capable';head.appendChild(cap);}
      cap.content='yes';
      var acap=document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if(!acap){acap=document.createElement('meta');acap.name='apple-mobile-web-app-capable';head.appendChild(acap);}
      acap.content='yes';
      var ast=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if(!ast){ast=document.createElement('meta');ast.name='apple-mobile-web-app-status-bar-style';head.appendChild(ast);}
      ast.content='black-translucent';
      document.documentElement.style.background='#000';
      if(document.body)document.body.style.background='#000';
    }catch(e){}
  }
  setupStandaloneShell();

  function requestGroup13Fullscreen(){
    try{
      var standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||(navigator.standalone===true);
      if(standalone||document.fullscreenElement||document.webkitFullscreenElement)return;
      var el=document.documentElement;
      var fn=el.requestFullscreen||el.webkitRequestFullscreen;
      if(fn){
        var r;
        try{r=fn.call(el,{navigationUI:'hide'});}catch(e){r=fn.call(el);}
        if(r&&r.catch)r.catch(function(){});
      }else{
        setTimeout(function(){try{window.scrollTo(0,1);}catch(e){}},40);
      }
    }catch(e){}
  }

  function gift(icon,count,label,img){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<span class="ktg13-emoji">'+icon+'</span>';
    return '<button class="ktg13-gift" onclick="openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }
  function guestSlots(){
    var s='';
    for(var i=0;i<12;i++)s+='<div class="ktg13-guest"><span>게스트</span></div>';
    return s;
  }
  function renderChat(){
    var box=document.getElementById('ktg13ChatList');
    if(!box)return;
    var msgs=window.ktGroup13ChatMessages||[];
    box.innerHTML=msgs.slice(-6).map(function(m){
      return '<div class="ktg13-chat-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  window.ktGroup13SendChat=function(){
    var input=document.getElementById('ktg13ChatInput');
    if(!input)return;
    var text=String(input.value||'').trim();
    if(!text)return;
    window.ktGroup13ChatMessages.push({name:'나',text:text});
    closeSheet();
    setTimeout(renderChat,30);
  };
  window.ktGroup13OpenMessage=function(){
    showSheet('메시지','<div class="rowbox"><b>방송 채팅</b><br>입력한 글은 선물판을 가리지 않고 아래에서 위로 올라갑니다.</div><input id="ktg13ChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktGroup13SendChat()"><button class="act" onclick="ktGroup13SendChat()">보내기</button>');
    setTimeout(function(){var i=document.getElementById('ktg13ChatInput');if(i)i.focus();},80);
  };
  window.ktGroup13Friends=function(){
    showSheet('친구','<div class="rowbox"><b>친구 초대</b><br>친구에게 현재 13명 방송을 알려 함께 들어올 수 있습니다.</div><button class="act" onclick="closeSheet();shareApp()">친구에게 공유</button>');
  };
  window.ktGroup13Ranking=function(){
    showSheet('🔥 일일 랭킹','<div class="rowbox"><b>오늘의 라이브 랭킹</b><br>방송 참여와 응원 현황을 확인하는 자리입니다.</div>');
  };
  window.ktGroup13Invite=function(){
    showSheet('🎯 지금 추가','<div class="rowbox"><b>게스트 추가</b><br>빈 게스트 자리에 참여자를 초대할 수 있습니다.</div><button class="act" onclick="closeSheet();shareApp()">초대 링크 공유</button>');
  };
  window.ktGroup13Effect=function(){
    if(window.openEditEffectPanel){try{openEditEffectPanel();return;}catch(e){}}
    showSheet('효과','<div class="rowbox"><b>방송 효과</b><br>라이브 효과를 선택할 수 있습니다.</div>');
  };
  window.ktGroup13More=function(){
    showSheet('더보기','<button class="act" onclick="closeSheet();if(window.openLiveSettings)openLiveSettings()">⚙ 설정</button><button class="act" onclick="closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()" style="background:linear-gradient(135deg,#d9274c,#ff4669)">■ 방송 종료</button>');
  };

  function renderApprovedGroup13(keepOpeningGuard){
    var s=document.getElementById('screen');
    if(!s)return;
    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var rate=(document.getElementById('hudEarnRate')||{}).textContent||'35%';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    s.innerHTML='<style id="ktg13ApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}'
      +'.bottom{display:none!important}'
      +'.ktg13-room{width:100%;height:100dvh;min-height:0;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktg13-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 12px}'
      +'.ktg13-air{font-weight:950;line-height:1.05}.ktg13-air strong{display:block;font-size:20px;white-space:nowrap}.ktg13-air strong i{font-style:normal;color:#ff2e67}.ktg13-air small{display:block;margin-top:5px;color:#fff;font-size:12px;font-weight:900;white-space:nowrap}.ktg13-air small i{font-style:normal;color:#ff315f}.ktg13-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktg13-attend{justify-self:center;min-width:132px;height:43px;padding:0 14px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:20px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;white-space:nowrap}'
      +'.ktg13-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}'
      +'.ktg13-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktg13Marquee 12s linear infinite;font-size:25px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktg13-led-track span{display:inline-block;padding-right:80px}.ktg13-led-track b{color:#ff59c9}@keyframes ktg13Marquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}'
      +'.ktg13-stats{flex:0 0 47px;display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:7px}.ktg13-stats button,.ktg13-viewers{border:0;border-radius:14px;background:#111114;color:#fff;font-size:15px;font-weight:950;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;overflow:hidden}'
      +'.ktg13-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:2px;overflow:hidden}.ktg13-host{position:relative;min-width:0;min-height:0;display:grid;place-items:center;overflow:hidden;border:1px solid #28282d;border-radius:7px;background:linear-gradient(145deg,#17181b,#111214)}.ktg13-host video{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;object-position:center center;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktg13-host-label{display:none!important}'
      +'.ktg13-guests{display:contents}.ktg13-guest{display:grid;place-items:center;min-width:0;min-height:0;border:1px solid #28282d;border-radius:7px;background:linear-gradient(145deg,#17181b,#111214);color:#bdbdc4;font-size:14px;font-weight:900}'
      +'.ktg13-mid{flex:0 0 74px;display:grid;grid-template-columns:minmax(0,1fr) 38%;gap:7px;align-items:end;min-height:0}.ktg13-chat{position:relative;width:100%;height:74px;max-height:74px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;pointer-events:none;padding:1px 6px 2px;background:transparent;transform:none;z-index:6}.ktg13-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#777;font-size:10px;font-weight:800;margin:auto 0 3px}.ktg13-chat-line{display:flex;gap:6px;align-items:baseline;margin-top:3px;color:#fff;font-size:11px;font-weight:800;text-shadow:0 1px 2px #000,0 0 4px #000}.ktg13-chat-line b{color:#65c8ff;font-weight:950}.ktg13-chat-line span{color:#fff}'
      +'.ktg13-earn{height:64px;display:flex;align-items:flex-end;justify-content:flex-end}.ktg13-earn #myEarnHud{position:static!important;left:auto!important;bottom:auto!important;transform:none!important;width:100%!important;min-width:0!important;max-width:none!important;margin:0!important;padding:2px 6px!important;border:1px solid #d2a936!important;border-radius:10px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktg13-gifts{flex:0 0 56px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktg13-gift{min-width:0;border:1px solid #33343a;border-radius:7px;background:linear-gradient(180deg,#111116,#09090c);color:#fff;padding:2px 1px 2px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.ktg13-gift img{width:34px;max-width:84%;height:24px;object-fit:contain;filter:drop-shadow(0 2px 4px #000)}.ktg13-emoji{height:24px;display:grid;place-items:center;font-size:21px;line-height:1;filter:drop-shadow(0 0 5px #ff5bd4)}.ktg13-gift b{color:#ffe23e;font-size:8px;line-height:1.02}.ktg13-gift small{display:block;margin-top:1px;color:#fff;font-size:6.5px;line-height:1.02;font-weight:900;text-align:center;white-space:normal}'
      +'.ktg13-tools{flex:0 0 50px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;align-items:start}.ktg13-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;font-size:9px;display:grid;justify-items:center;gap:2px}.ktg13-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px;box-shadow:inset 0 0 13px #ffffff08}.ktg13-tool:first-child i{color:#fff;box-shadow:0 0 12px #a53fff66,inset 0 0 13px #ffffff08}.ktg13-tool:nth-child(5) i{transform:translateY(-2px)}.ktg13-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.ktg13-room{padding-left:4px;padding-right:4px;gap:3px}.ktg13-head{flex-basis:58px;padding:4px 8px}.ktg13-air strong{font-size:18px}.ktg13-air small{font-size:10px}.ktg13-brand{font-size:17px}.ktg13-attend{min-width:112px;height:38px;font-size:17px;padding:0 9px}.ktg13-led{flex-basis:50px}.ktg13-led-track{font-size:21px}.ktg13-stats{flex-basis:42px;gap:4px}.ktg13-stats button,.ktg13-viewers{font-size:12px}.ktg13-main{grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}.ktg13-guest{font-size:12px}.ktg13-mid{flex-basis:70px;grid-template-columns:minmax(0,1fr) 40%;gap:5px}.ktg13-chat{height:70px;max-height:70px;padding-left:3px;padding-right:3px;transform:none}.ktg13-chat-line{font-size:9px}.ktg13-earn{height:62px}.ktg13-earn #myEarnHud{padding:2px 4px!important}.ktg13-gifts{flex-basis:52px}.ktg13-gift img{height:23px}.ktg13-emoji{height:23px;font-size:20px}.ktg13-gift b{font-size:8px}.ktg13-gift small{font-size:6.5px}.ktg13-tools{flex-basis:47px}.ktg13-tool i{width:32px;height:32px;font-size:16px}.ktg13-tool span{font-size:8px}}'
      +'</style>'
      +'<section class="ktg13-room" data-kt-approved13="1">'
        +'<div class="ktg13-head">'
          +'<div class="ktg13-air"><strong><i>●</i> 13명 방송</strong><small><i>● ON AIR</i> <span id="ktLiveClock">'+esc(clock)+'</span></small></div>'
          +'<button class="ktg13-attend" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()">🪽 출석체크 🪽</button>'
          +'<div class="ktg13-brand">K-Talk LIVE</div>'
        +'</div>'
        +'<div class="ktg13-led"><div class="ktg13-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div></div>'
        +'<div class="ktg13-stats"><button onclick="ktGroup13Ranking()">🔥 일일 랭킹</button><button onclick="ktGroup13Invite()">🎯 지금 추가</button><div class="ktg13-viewers">시청자 4명이 시청중 🏃</div></div>'
        +'<div class="ktg13-main">'
          +'<div class="ktg13-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="ktg13-host-label">호스트</span></div>'
          +'<div class="ktg13-guests">'+guestSlots()+'</div>'
        +'</div>'
        +'<div class="ktg13-mid">'
          +'<div id="ktg13ChatList" class="ktg13-chat"></div>'
          +'<div class="ktg13-earn"><button id="myEarnHud" onclick="toggleMyEarnings()">'
            +'<div style="display:flex;align-items:center;justify-content:center;gap:4px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익 · 본인만 표시</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div>'
            +'<div id="myEarnDetail" style="display:grid;grid-template-columns:1fr auto;gap:1px 4px;margin-top:1px;font-size:7px;color:#ddd;line-height:1.15"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right;white-space:nowrap">일반회원 35%</span><span style="grid-column:1/-1;text-align:right;white-space:nowrap">구독자회원 40% · 소속사 65%</span><span style="grid-column:1/-1;text-align:right;color:#ffe071;white-space:nowrap">소속사 가입은 소속사가 결정</span></div>'
          +'</button></div>'
        +'</div>'
        +'<div class="ktg13-gifts">'
          +gift('','1개','장미','rose-single.svg')
          +gift('','50개','장미다발','rose-bouquet-50.svg')
          +gift('','100개','특대장미','rose-bouquet-100.svg')
          +gift('💗','10개','하트','')
          +gift('👑','100개','왕관','')
          +gift('🏎️','50개','스포츠카','')
          +gift('','선물상자','큰 선물 보기','gift-box.svg')
        +'</div>'
        +'<div class="ktg13-tools">'
          +'<button class="ktg13-tool" onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')"><i>🔗</i><span>매치</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13Friends()"><i>👥</i><span>친구</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13OpenMessage()"><i>💬</i><span>메시지</span></button>'
          +'<button class="ktg13-tool" onclick="openGifts()"><i>🌹</i><span>장미</span></button>'
          +'<button class="ktg13-tool" onclick="openGifts()"><i>🎁</i><span>선물</span></button>'
          +'<button class="ktg13-tool" onclick="shareApp()"><i>↗</i><span>공유</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13Effect()"><i>🪄</i><span>효과</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13More()"><i>•••</i><span>더보기</span></button>'
        +'</div>'
      +'</section>';

    var v=document.getElementById('ktLiveVideo');
    try{
      var liveStream=(window.state&&state.stream)||null;
      if(!liveStream){
        var prepCam=document.getElementById('camera');
        if(prepCam&&prepCam.srcObject)liveStream=prepCam.srcObject;
      }
      if(!liveStream){
        var prepBg=document.getElementById('cameraBg');
        if(prepBg&&prepBg.srcObject)liveStream=prepBg.srcObject;
      }
      if(v&&liveStream){
        v.srcObject=liveStream;
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
    renderChat();
    try{if(window.ktRenderTreasure)ktRenderTreasure();}catch(e){}
    try{
      if(!keepOpeningGuard){
        clearTimeout(window.__ktG13OpeningRelease);
        try{document.documentElement.classList.remove('kt-g13-opening');}catch(e){}
        clearTimeout(window.__ktG13OpeningFailsafe);
      }else{
        document.documentElement.classList.add('kt-g13-opening');
      }
    }catch(e){}
  }

  /* 13명방 시작 전용 안전 진입점: 카운트가 끝났는데 화면 전환만 빠진 경우
     두 번째 버튼 터치 없이 현재 승인된 13명방 화면만 즉시 연다. */
  window.ktOpenApprovedGroup13Now=function(force){
    if(!force&&!isGroup13())return false;
    try{
      if(force&&window.state){
        state.liveRoomType='group13';
        state.liveRoomName='13명 방송';
        state.liveRoomMax=13;
        state.prepRoomType='group13';
        state.prepRoomName='13명 방송';
        state.prepRoomMax=13;
        state.roomType='group13';
      }
      markGroup13Opening();
      renderApprovedGroup13();
      return !!document.querySelector('#screen .ktg13-room');
    }catch(e){return false;}
  };

  window.startBroadcast=async function(){
    if(!isGroup13())return oldStartBroadcast.apply(this,arguments);

    /* 13명방 전용:
       준비 화면 위에서 5→4→3→2→1을 끝까지 보여준 다음,
       1이 사라진 뒤 현재 13명방만 바로 연다.
       카운트 중에는 옛 13명방/현재 13명방을 미리 화면에 보여주지 않는다. */
    if(window.__ktG13SingleCountdownRunning)return;
    window.__ktG13SingleCountdownRunning=true;

    var overlay=null;
    var originalCountdown=window.ktLiveStartCountdown;
    var creatorEl=document.getElementById('creator');
    var result;

    function ensurePrepHoldStyle(){
      if(document.getElementById('ktG13PrepHoldStyle'))return;
      var st=document.createElement('style');
      st.id='ktG13PrepHoldStyle';
      st.textContent=
        'html.kt-g13-prep-hold #creator{display:block!important;visibility:visible!important;opacity:1!important;z-index:2147483644!important}'+
        'html.kt-g13-prep-hold #creator .live-prep{display:flex!important}'+
        'html.kt-g13-prep-hold #creator .creator-top,html.kt-g13-prep-hold #creator .creator-tools,html.kt-g13-prep-hold #creator .creator-bottom{display:none!important}';
      (document.head||document.documentElement).appendChild(st);
    }

    try{
      var oldOverlay=document.getElementById('ktG13SingleCountdown');
      if(oldOverlay)oldOverlay.remove();

      /* 기존 시작 로직의 자체 카운트다운은 13명방에서만 막는다. */
      if(typeof originalCountdown==='function'){
        window.ktLiveStartCountdown=async function(){return;};
      }

      ensurePrepHoldStyle();
      document.documentElement.classList.add('kt-g13-prep-hold');
      if(creatorEl){
        creatorEl.classList.add('show','live-prep-open');
      }

      /* 준비 화면 위에서 숫자만 5→1까지 정확히 보여준다. */
      overlay=document.createElement('div');
      overlay.id='ktG13SingleCountdown';
      overlay.style.cssText='position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;background:rgba(0,0,0,.10);pointer-events:none;color:#fff;text-align:center;text-shadow:0 3px 16px rgba(0,0,0,.72)';
      document.body.appendChild(overlay);

      var num=document.createElement('div');
      num.style.cssText='width:116px;height:116px;border-radius:50%;display:grid;place-items:center;background:rgba(10,10,14,.72);border:4px solid rgba(255,255,255,.92);color:#fff;font:900 64px/1 system-ui,-apple-system,sans-serif;box-shadow:0 0 28px rgba(255,44,130,.7);text-shadow:0 0 12px rgba(255,255,255,.7)';
      overlay.appendChild(num);

      for(var n=5;n>=1;n--){
        num.textContent=String(n);
        num.style.transform='scale(1)';
        await new Promise(function(resolve){
          setTimeout(function(){num.style.transform='scale(.92)';},650);
          setTimeout(resolve,1000);
        });
      }

      /* 1이 모두 끝난 뒤에만 방 전환을 시작한다.
         전환 순간에는 준비 화면을 계속 위에 잡아두므로 옛 버전/검은 화면이 보이지 않는다. */
      markGroup13Opening();

      var startPromise=Promise.resolve(oldStartBroadcast.apply(this,arguments));
      renderApprovedGroup13(true);

      /* 현재 방이 실제 한 프레임 준비된 뒤 준비 화면과 숫자를 동시에 치운다. */
      await new Promise(function(resolve){
        requestAnimationFrame(function(){requestAnimationFrame(resolve);});
      });

      if(overlay){overlay.remove();overlay=null;}
      document.documentElement.classList.remove('kt-g13-prep-hold');
      if(creatorEl)creatorEl.classList.remove('show','live-prep-open');

      result=await startPromise;
      renderApprovedGroup13(false);
      return result;
    }catch(e){
      try{if(overlay)overlay.remove();}catch(_e){}
      try{document.documentElement.classList.remove('kt-g13-prep-hold');}catch(_e){}
      try{if(creatorEl)creatorEl.classList.remove('show','live-prep-open');}catch(_e){}
      try{renderApprovedGroup13(false);}catch(_e){}
      throw e;
    }finally{
      if(originalCountdown)window.ktLiveStartCountdown=originalCountdown;
      window.__ktG13SingleCountdownRunning=false;
    }
  };

  /* 시작 버튼을 누르는 순간부터 옛 13명방 화면을 가려 카운트 후 번쩍임 방지 */
  document.addEventListener('pointerdown',function(e){
    try{
      var btn=e.target&&e.target.closest?e.target.closest('.live-prep .prep-start'):null;
      if(btn&&isGroup13())markGroup13Opening();
    }catch(err){}
  },true);

  ensureNoOld13FlashStyle();
})();