/* K-Talk 구독자 방송 전용. 이 파일은 구독자방 화면만 구성한다. */
(function(){
  if(window.__ktSubscriberApprovedRoomInstalled)return;
  window.__ktSubscriberApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;
  window.ktSubscriberChatMessages=window.ktSubscriberChatMessages||[];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isSubscriber(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='subscriber'||String(n).indexOf('구독자')>-1||String(title).indexOf('구독자 방송')>-1;
    }catch(e){return false;}
  }

  function gift(icon,count,label,img){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<span class="ktsubscriber-emoji">'+icon+'</span>';
    return '<button class="ktsubscriber-gift" onclick="openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function guestSlots(){
    var s='';
    for(var i=1;i<=9;i++){
      s+='<div class="ktsubscriber-guest" data-guest-slot="'+i+'"><span>👤</span><b>게스트 '+i+'</b></div>';
    }
    return s;
  }

  function renderChat(){
    var box=document.getElementById('ktsubscriberChatList');
    if(!box)return;
    var msgs=window.ktSubscriberChatMessages||[];
    if(!msgs.length){
      box.innerHTML='<div class="ktsubscriber-chat-hint">채팅을 입력하면 아래에서 위로 올라옵니다</div>';
      return;
    }
    box.innerHTML=msgs.slice(-4).map(function(m){
      return '<div class="ktsubscriber-chat-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  window.ktSubscriberSendChat=function(){
    var input=document.getElementById('ktsubscriberChatInput');
    if(!input)return;
    var text=String(input.value||'').trim();
    if(!text)return;
    window.ktSubscriberChatMessages.push({name:'나',text:text});
    try{closeSheet();}catch(e){}
    setTimeout(renderChat,30);
  };

  window.ktSubscriberOpenMessage=function(){
    showSheet('메시지','<div class="rowbox"><b>구독자 방송 채팅</b><br>입력한 글이 방송 화면 채팅으로 표시됩니다.</div><input id="ktsubscriberChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSubscriberSendChat()"><button class="act" onclick="ktSubscriberSendChat()">보내기</button>');
    setTimeout(function(){var i=document.getElementById('ktsubscriberChatInput');if(i)i.focus();},80);
  };

  window.ktSubscriberEffect=function(){
    if(window.openEditEffectPanel){
      try{if(window.creator)creator.classList.add('show');openEditEffectPanel();return;}catch(e){}
    }
    try{showSheet('효과','<div class="rowbox"><b>방송 효과</b><br>라이브 효과를 선택할 수 있습니다.</div>');}catch(e){}
  };

  window.ktSubscriberTreasure=function(){
    try{
      if(window.openTreasureBox){openTreasureBox();return;}
      if(window.openTreasure){openTreasure();return;}
      if(window.openGifts)openGifts();
    }catch(e){}
  };

  function equalizerBars(){
    var s='';
    for(var i=0;i<48;i++){
      s+='<i style="--d:'+(0.50+(i%8)*0.07).toFixed(2)+'s;--h:'+(9+(i*13)%31)+'px"></i>';
    }
    return s;
  }

  function renderApprovedSubscriber(){
    var screen=document.getElementById('screen');
    if(!screen)return;

    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    screen.innerHTML='<style id="ktSubscriberApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.ktsubscriber-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:5px 8px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktsubscriber-head{flex:0 0 58px;border-radius:18px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 9px;box-shadow:inset 0 0 16px #ffffff08}.ktsubscriber-left{display:flex;align-items:center;gap:6px;min-width:0}.ktsubscriber-back{width:32px;height:32px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:26px;line-height:26px}.ktsubscriber-title{font-size:18px;font-weight:950;white-space:nowrap}.ktsubscriber-title i{font-style:normal;color:#ff2e67}.ktsubscriber-brand{justify-self:end;color:#ff3d78;font-size:18px;font-weight:950;white-space:nowrap}'
      +'.ktsubscriber-att{justify-self:center;height:30px;min-width:96px;padding:0 5px;border-radius:18px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:12px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;display:flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}.ktsubscriber-att img{width:14px;height:14px;object-fit:contain}'
      +'.ktsubscriber-air{flex:0 0 32px;display:flex;align-items:center;padding:0 10px;font-size:14px;font-weight:950}.ktsubscriber-air .on{color:#ff315f;margin-right:8px}'
      +'.ktsubscriber-led{flex:0 0 50px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsubscriber-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktsubscriberMarquee 12s linear infinite;font-size:22px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsubscriber-led-track span{display:inline-block;padding-right:65px}.ktsubscriber-led-track b{color:#ff59c9}@keyframes ktsubscriberMarquee{from{transform:translateX(42%)}to{transform:translateX(-100%)}}'
      +'.ktsubscriber-main{flex:1 1 0;min-height:0;display:flex;flex-direction:column;background:#000;overflow:hidden}'
      +'.ktsubscriber-stage{flex:1 1 0;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 54px;gap:5px;overflow:hidden}'
      +'.ktsubscriber-people{min-height:0;display:grid;grid-template-columns:40% 30% 30%;grid-template-rows:repeat(4,minmax(0,1fr));gap:3px;overflow:hidden}'
      +'.ktsubscriber-host,.ktsubscriber-guest{position:relative;min-width:0;min-height:0;border:1px solid rgba(255,45,189,.18);border-radius:8px;overflow:hidden;background:linear-gradient(145deg,#17181d,#0e0f13);box-shadow:0 0 2px rgba(255,45,189,.06)}'
      +'.ktsubscriber-host{grid-column:1;grid-row:1/3}.ktsubscriber-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transform:scaleX(-1);background:#111}.ktsubscriber-host-label{position:absolute;left:5px;top:5px;z-index:3;padding:3px 9px;border-radius:11px;background:#ff315f;color:#fff;font-size:10px;font-weight:950}'
      +'.ktsubscriber-guest{display:grid;place-items:center;align-content:center;color:#ddd;text-align:center}.ktsubscriber-guest span{font-size:20px;line-height:1;opacity:.8}.ktsubscriber-guest b{position:absolute;left:4px;bottom:4px;padding:2px 6px;border-radius:9px;background:rgba(0,0,0,.72);color:#fff;font-size:8px;font-weight:900}'
      +'.ktsubscriber-guest:nth-child(2){grid-column:2;grid-row:1}.ktsubscriber-guest:nth-child(3){grid-column:3;grid-row:1}.ktsubscriber-guest:nth-child(4){grid-column:2;grid-row:2}.ktsubscriber-guest:nth-child(5){grid-column:3;grid-row:2}.ktsubscriber-guest:nth-child(6){grid-column:1;grid-row:3}.ktsubscriber-guest:nth-child(7){grid-column:2;grid-row:3}.ktsubscriber-guest:nth-child(8){grid-column:3;grid-row:3}.ktsubscriber-guest:nth-child(9){grid-column:1/2;grid-row:4}.ktsubscriber-guest:nth-child(10){grid-column:2/4;grid-row:4}'
      +'.ktsubscriber-right{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;min-width:0}.ktsubscriber-right button{width:48px;height:48px;border-radius:50%;border:1px solid #ffffff38;background:#101014;color:#fff;font-size:17px;font-weight:950;box-shadow:0 2px 8px #000a}.ktsubscriber-right .like{height:58px;border-radius:21px;border-color:#ff65b788;background:#321024}.ktsubscriber-right small{display:block;font-size:8px;line-height:1.05;margin-top:1px;white-space:nowrap}.ktsubscriber-right .like b{display:block;font-size:8px}'
      +'.ktsubscriber-info{flex:0 0 48px;display:grid;grid-template-columns:minmax(0,1fr) 210px;align-items:center;gap:5px;padding:2px 0}.ktsubscriber-chat{min-width:0;max-height:44px;overflow:hidden;padding:0 7px;display:flex;flex-direction:column;justify-content:flex-end;cursor:pointer}.ktsubscriber-chat-hint{font-size:11px;font-weight:850;color:#eee}.ktsubscriber-chat-line{display:flex;gap:6px;font-size:10px;font-weight:850}.ktsubscriber-chat-line b{color:#65c8ff}.ktsubscriber-chat-line span{color:#fff}'
      +'.ktsubscriber-earn #myEarnHud{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:100%!important;margin:0!important;padding:5px 8px!important;border:1px solid #d2a936!important;border-radius:13px!important;background:linear-gradient(135deg,#17140b,#0d0d12)!important;color:#fff!important}'
      +'.ktsubscriber-wave{flex:0 0 38px;display:flex;align-items:center;gap:2px;padding:0 4px;overflow:hidden}.ktsubscriber-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;box-shadow:0 0 5px currentColor;animation:ktsubscriberWave var(--d) ease-in-out infinite alternate}.ktsubscriber-wave i:nth-child(6n+2){background:#6f5cff}.ktsubscriber-wave i:nth-child(6n+3){background:#28d9ff}.ktsubscriber-wave i:nth-child(6n+4){background:#41e968}.ktsubscriber-wave i:nth-child(6n+5){background:#ffd43b}.ktsubscriber-wave i:nth-child(6n){background:#ff774f}@keyframes ktsubscriberWave{from{transform:scaleY(.45)}to{transform:scaleY(1)}}'
      +'.ktsubscriber-gifts{position:relative!important;z-index:2;flex:0 0 64px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktsubscriber-gift{min-width:0;border:1px solid #ffffff33;border-radius:8px;background:linear-gradient(180deg,#15151b,#09090c);color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.ktsubscriber-gift img{width:36px;max-width:84%;height:29px;object-fit:contain}.ktsubscriber-emoji{height:29px;display:grid;place-items:center;font-size:23px;line-height:1;filter:drop-shadow(0 0 5px #ff5bd4)}.ktsubscriber-gift b{color:#ffe23e;font-size:8.5px;line-height:1}.ktsubscriber-gift small{display:block;margin-top:1px;color:#fff;font-size:7px;line-height:1.05;font-weight:900;text-align:center}'
      +'.ktsubscriber-bottom{flex:0 0 64px;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;background:#000}.ktsubscriber-bottom button{border:0;background:none;color:#ddd;display:grid;justify-items:center;gap:2px;font-size:9px;font-weight:900}.ktsubscriber-bottom i{font-style:normal;font-size:25px;line-height:1}.ktsubscriber-bottom .live i{width:58px;height:50px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#27bfff,#874cff 55%,#ff42b6);font-size:34px;color:#fff;box-shadow:0 0 13px #a54fff77}.ktsubscriber-bottom .live span{font-size:9px}'
      +'@media(max-width:390px){.ktsubscriber-room{padding-left:4px;padding-right:4px;gap:3px}.ktsubscriber-head{flex-basis:55px;padding:4px 6px}.ktsubscriber-title,.ktsubscriber-brand{font-size:16px}.ktsubscriber-att{min-width:82px;height:27px;font-size:10px}.ktsubscriber-air{flex-basis:29px;font-size:12px}.ktsubscriber-led{flex-basis:46px}.ktsubscriber-led-track{font-size:19px}.ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 46px;gap:3px}.ktsubscriber-people{gap:2px}.ktsubscriber-host,.ktsubscriber-guest{border-width:1px;border-color:rgba(255,45,189,.16);border-radius:6px}.ktsubscriber-right{gap:5px}.ktsubscriber-right button{width:40px;height:40px;font-size:14px}.ktsubscriber-right .like{height:48px;border-radius:17px}.ktsubscriber-info{grid-template-columns:minmax(0,1fr) 165px;flex-basis:44px}.ktsubscriber-chat-hint{font-size:9px}.ktsubscriber-wave{flex-basis:34px}.ktsubscriber-gifts{flex-basis:58px}.ktsubscriber-gift img,.ktsubscriber-emoji{height:25px}.ktsubscriber-bottom{flex-basis:58px}.ktsubscriber-bottom i{font-size:22px}.ktsubscriber-bottom .live i{width:52px;height:46px;font-size:31px}}'
      +'</style>'
      +'<section class="ktsubscriber-room">'
        +'<div class="ktsubscriber-head"><div class="ktsubscriber-left"><button class="ktsubscriber-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsubscriber-title"><i>●</i> 구독자 방송</div></div><button class="ktsubscriber-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button><div class="ktsubscriber-brand">K-Talk LIVE</div></div>'
        +'<div class="ktsubscriber-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span></div>'
        +'<div class="ktsubscriber-led"><div class="ktsubscriber-led-track"><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span><span><b>K LIVE</b> · 환영합니다 ✨ 💗</span></div></div>'
        +'<div class="ktsubscriber-main">'
          +'<div class="ktsubscriber-stage">'
            +'<div class="ktsubscriber-people"><div class="ktsubscriber-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="ktsubscriber-host-label">호스트</span></div>'+guestSlots()+'</div>'
            +'<div class="ktsubscriber-right"><button class="like" onclick="if(window.addHostLike)addHostLike(1)">💗<small>좋아요</small><b id="hostLikeCount">0</b></button><button onclick="ktSubscriberEffect()">✨<small>효과</small></button><button onclick="ktSubscriberTreasure()">🎁<small>보물상자</small></button><button onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')">⚔<small>매치</small></button></div>'
          +'</div>'
          +'<div class="ktsubscriber-info"><div id="ktsubscriberChatList" class="ktsubscriber-chat" onclick="ktSubscriberOpenMessage()"></div><div class="ktsubscriber-earn"><button id="myEarnHud" onclick="toggleMyEarnings()"><div style="display:flex;align-items:center;justify-content:center;gap:5px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익 · 본인만 표시</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div><div id="myEarnDetail" style="display:none;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;font-size:7px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span style="text-align:right">팬레벨점 35%</span><span>구독자회원 40%</span><span style="text-align:right">소속사 65%</span></div></button></div></div>'
          +'<div class="ktsubscriber-wave">'+equalizerBars()+'</div>'
          +'<div class="ktsubscriber-gifts">'
            +gift('','1개','장미','rose-single.svg')
            +gift('','50개','장미다발','rose-bouquet-50.svg')
            +gift('','100개','특대장미','rose-bouquet-100.svg')
            +gift('💗','10개','하트','')
            +gift('👑','100개','왕관','')
            +gift('🏎️','50개','스포츠카','')
            +gift('','선물상자','큰 선물 보기','gift-box.svg')
          +'</div>'
        +'</div>'
        +'<div class="ktsubscriber-bottom"><button onclick="if(window.home)home()"><i>⌂</i><span>홈</span></button><button onclick="if(window.friends)friends()"><i>👥</i><span>친구</span></button><button class="live" onclick="if(window.openCreator)openCreator()"><i>＋</i><span>방송하기</span></button><button onclick="if(window.openHelpMenu)openHelpMenu();else if(window.openHelp)openHelp()"><i>?</i><span>사용방법</span></button><button onclick="if(window.openProfile)openProfile();else if(window.profile)profile()"><i>♙</i><span>프로필</span></button></div>'
      +'</section>';

    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&window.state&&state.stream){
        v.srcObject=state.stream;
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
    renderChat();
    try{if(window.ktRenderTreasure)ktRenderTreasure();}catch(e){}
  }

  window.startBroadcast=async function(){
    var subscriber=isSubscriber();
    if(subscriber){
      try{if(window.state)state.cameraFacing='user';}catch(e){}
      try{if(window.ensureLiveCamera)await window.ensureLiveCamera('user');}catch(e){}
    }
    var result=await oldStartBroadcast.apply(this,arguments);
    if(subscriber)setTimeout(renderApprovedSubscriber,0);
    return result;
  };
})();