/* K-Talk 구독자 방송 전용: 기존 상단/선물/도구는 유지하고 호스트+게스트 칸을 복원. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSubscriberApprovedRoomInstalled)return;
  window.__ktSubscriberApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;
  window.ktSubscriberChatMessages=window.ktSubscriberChatMessages||[];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch];
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
    for(var i=0;i<14;i++)s+='<div class="ktsubscriber-guest"><span>게스트</span></div>';
    return s;
  }

  function renderChat(){
    var box=document.getElementById('ktsubscriberChatList');
    if(!box)return;
    var msgs=window.ktSubscriberChatMessages||[];
    box.innerHTML=msgs.slice(-5).map(function(m){
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
    showSheet('메시지','<div class="rowbox"><b>구독자 방송 채팅</b><br>입력한 글이 채팅창에 표시됩니다.</div><input id="ktsubscriberChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSubscriberSendChat()"><button class="act" onclick="ktSubscriberSendChat()">보내기</button>');
    setTimeout(function(){var i=document.getElementById('ktsubscriberChatInput');if(i)i.focus();},80);
  };

  window.ktSubscriberEffect=function(){
    if(window.openEditEffectPanel){
      try{if(window.creator)creator.classList.add('show');openEditEffectPanel();return;}catch(e){}
    }
    showSheet('효과','<div class="rowbox"><b>방송 효과</b><br>라이브 효과를 선택할 수 있습니다.</div>');
  };

  window.ktSubscriberMore=function(){
    showSheet('더보기','<button class="act" onclick="closeSheet();if(window.openLiveSettings)openLiveSettings()">⚙ 설정</button><button class="act" onclick="closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()" style="background:linear-gradient(135deg,#d9274c,#ff4669)">■ 방송 종료</button>');
  };

  function renderApprovedSubscriber(){
    var screen=document.getElementById('screen');
    if(!screen)return;

    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var rate=(document.getElementById('hudEarnRate')||{}).textContent||'구독회원 · 40%';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    screen.innerHTML='<style id="ktSubscriberApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.ktsubscriber-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktsubscriber-head{flex:0 0 64px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px}.ktsubscriber-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsubscriber-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px;line-height:28px}.ktsubscriber-title{font-size:20px;font-weight:950;white-space:nowrap}.ktsubscriber-title i{font-style:normal;color:#ff2e67}.ktsubscriber-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktsubscriber-att{justify-self:center;height:31px;min-width:98px;padding:0 4px;border-radius:19px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:13px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;display:flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}.ktsubscriber-att img{width:15px;height:15px;object-fit:contain}'
      +'.ktsubscriber-air{flex:0 0 36px;display:flex;align-items:center;padding:0 8px;font-size:14px;font-weight:950}.ktsubscriber-air .on{color:#ff315f;margin-right:7px}'
      +'.ktsubscriber-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsubscriber-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktsubscriberMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsubscriber-led-track span{display:inline-block;padding-right:80px}.ktsubscriber-led-track b{color:#ff59c9}@keyframes ktsubscriberMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'.ktsubscriber-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:42% 58%;gap:3px;overflow:hidden}.ktsubscriber-host{position:relative;min-width:0;min-height:0;overflow:hidden;border-radius:9px;background:#17171a}.ktsubscriber-host video{width:100%;height:100%;display:block;object-fit:cover;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktsubscriber-host-label{position:absolute;left:7px;top:7px;z-index:3;padding:4px 9px;border-radius:13px;background:#222a;color:#fff;font-size:13px;font-weight:950}'
      +'.ktsubscriber-guests{display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(7,1fr);gap:2px;min-width:0;min-height:0}.ktsubscriber-guest{display:grid;place-items:center;min-width:0;min-height:0;border:1px solid #34343a;border-radius:6px;background:linear-gradient(145deg,#17181b,#111214);color:#bdbdc4;font-size:12px;font-weight:900}'
      +'.ktsubscriber-mid{flex:0 0 70px;display:grid;grid-template-columns:minmax(0,1fr) 38%;gap:7px;align-items:end}.ktsubscriber-chat{height:70px;max-height:70px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:2px 6px;background:#000}.ktsubscriber-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#777;font-size:10px;font-weight:800;margin:auto 0 3px}.ktsubscriber-chat-line{display:flex;gap:6px;align-items:baseline;margin-top:3px;color:#fff;font-size:11px;font-weight:800}.ktsubscriber-chat-line b{color:#65c8ff;font-weight:950}.ktsubscriber-chat-line span{color:#fff}'
      +'.ktsubscriber-earn{height:64px;display:flex;align-items:flex-end}.ktsubscriber-earn #myEarnHud{position:static!important;transform:none!important;width:100%!important;margin:0!important;padding:3px 6px!important;border:1px solid #d2a936!important;border-radius:10px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktsubscriber-gifts{flex:0 0 58px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktsubscriber-gift{min-width:0;border:1px solid #33343a;border-radius:7px;background:linear-gradient(180deg,#111116,#09090c);color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.ktsubscriber-gift img{width:34px;max-width:84%;height:26px;object-fit:contain}.ktsubscriber-emoji{height:26px;display:grid;place-items:center;font-size:22px}.ktsubscriber-gift b{color:#ffe23e;font-size:8px;line-height:1}.ktsubscriber-gift small{display:block;margin-top:1px;color:#fff;font-size:6.5px;line-height:1.02;font-weight:900;text-align:center}'
      +'.ktsubscriber-tools{flex:0 0 52px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;align-items:start}.ktsubscriber-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktsubscriber-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px}.ktsubscriber-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.ktsubscriber-room{padding-left:4px;padding-right:4px;gap:3px}.ktsubscriber-head{flex-basis:58px;padding:4px 7px}.ktsubscriber-title{font-size:17px}.ktsubscriber-brand{font-size:17px}.ktsubscriber-att{min-width:88px;height:28px;font-size:11px}.ktsubscriber-air{flex-basis:31px;font-size:12px}.ktsubscriber-led{flex-basis:50px}.ktsubscriber-led-track{font-size:20px}.ktsubscriber-main{grid-template-columns:40% 60%}.ktsubscriber-guest{font-size:10px}.ktsubscriber-mid{flex-basis:64px}.ktsubscriber-chat{height:64px}.ktsubscriber-gifts{flex-basis:54px}.ktsubscriber-tools{flex-basis:48px}.ktsubscriber-tool i{width:31px;height:31px;font-size:16px}}'
      +'</style>'
      +'<section class="ktsubscriber-room">'
        +'<div class="ktsubscriber-head"><div class="ktsubscriber-left"><button class="ktsubscriber-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsubscriber-title"><i>●</i> 구독자 방송</div></div><button class="ktsubscriber-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button><div class="ktsubscriber-brand">K-Talk LIVE</div></div>'
        +'<div class="ktsubscriber-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span></div>'
        +'<div class="ktsubscriber-led"><div class="ktsubscriber-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'
        +'<div class="ktsubscriber-main"><div class="ktsubscriber-host"><video id="ktLiveVideo" autoplay playsinline muted></video><div class="ktsubscriber-host-label">호스트</div></div><div class="ktsubscriber-guests">'+guestSlots()+'</div></div>'
        +'<div class="ktsubscriber-mid"><div id="ktsubscriberChatList" class="ktsubscriber-chat"></div><div class="ktsubscriber-earn"><button id="myEarnHud" onclick="toggleMyEarnings()"><div style="display:flex;align-items:center;justify-content:center;gap:5px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div><div id="myEarnDetail" style="display:none;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;font-size:7px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right">'+esc(rate)+'</span></div></button></div></div>'
        +'<div class="ktsubscriber-gifts">'
          +gift('','1개','장미','rose-single.svg')
          +gift('','50개','장미다발','rose-bouquet-50.svg')
          +gift('','100개','특대장미','rose-bouquet-100.svg')
          +gift('💗','10개','하트','')
          +gift('👑','100개','왕관','')
          +gift('🏎️','50개','스포츠카','')
          +gift('','선물상자','큰 선물 보기','gift-box.svg')
        +'</div>'
        +'<div class="ktsubscriber-tools"><button class="ktsubscriber-tool" onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')"><i>🔗</i><span>매치</span></button><button class="ktsubscriber-tool" onclick="shareApp()"><i>👥</i><span>친구</span></button><button class="ktsubscriber-tool" onclick="ktSubscriberOpenMessage()"><i>💬</i><span>메시지</span></button><button class="ktsubscriber-tool" onclick="shareApp()"><i>↗</i><span>공유</span></button><button class="ktsubscriber-tool" onclick="ktSubscriberEffect()"><i>🪄</i><span>효과</span></button><button class="ktsubscriber-tool" onclick="ktSubscriberMore()"><i>•••</i><span>더보기</span></button></div>'
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