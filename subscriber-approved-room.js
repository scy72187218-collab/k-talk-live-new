/* K-Talk 구독자 방송 전용: 전면 카메라를 길게 보여주고 채팅/선물은 카메라 위에 겹쳐 표시. 다른 방은 건드리지 않음. */
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
    showSheet('메시지','<div class="rowbox"><b>구독자 방송 채팅</b><br>입력한 글이 카메라 화면 위 채팅으로 표시됩니다.</div><input id="ktsubscriberChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSubscriberSendChat()"><button class="act" onclick="ktSubscriberSendChat()">보내기</button>');
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

  function equalizerBars(){
    var s='';
    for(var i=0;i<52;i++){
      s+='<i style="--d:'+(0.52+(i%8)*0.07).toFixed(2)+'s;--h:'+(10+(i*13)%34)+'px"></i>';
    }
    return s;
  }

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
      +'.ktsubscriber-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px}.ktsubscriber-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsubscriber-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px;line-height:28px}.ktsubscriber-title{font-size:20px;font-weight:950;white-space:nowrap}.ktsubscriber-title i{font-style:normal;color:#ff2e67}.ktsubscriber-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktsubscriber-att{justify-self:center;height:31px;min-width:98px;padding:0 4px;border-radius:19px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:13px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;display:flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}.ktsubscriber-att img{width:15px;height:15px;object-fit:contain;filter:drop-shadow(0 0 5px #41b8ff)}'
      +'.ktsubscriber-air{flex:0 0 36px;display:flex;align-items:center;padding:0 8px;font-size:14px;font-weight:950}.ktsubscriber-air .on{color:#ff315f;margin-right:7px}'
      +'.ktsubscriber-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsubscriber-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktsubscriberMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsubscriber-led-track span{display:inline-block;padding-right:80px}.ktsubscriber-led-track b{color:#ff59c9}@keyframes ktsubscriberMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'.ktsubscriber-main{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-radius:10px;background:#111}.ktsubscriber-main video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktsubscriber-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.06) 65%,rgba(0,0,0,.55) 100%);pointer-events:none}'
      +'.ktsubscriber-right{position:absolute;right:8px;bottom:158px;z-index:9;display:grid;gap:6px}.ktsubscriber-right button{width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#101014d9;color:#fff;font-size:16px;font-weight:950}.ktsubscriber-right .like{height:50px;border-radius:16px;border-color:#ff65b788;background:#321024d9}.ktsubscriber-right small{display:block;font-size:8px;margin-top:1px}'
      +'.ktsubscriber-wave{position:absolute;left:10px;right:62px;bottom:143px;height:44px;z-index:4;display:flex;align-items:end;gap:2px;opacity:.88}.ktsubscriber-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;box-shadow:0 0 5px currentColor;animation:ktsubscriberWave var(--d) ease-in-out infinite alternate}.ktsubscriber-wave i:nth-child(6n+2){background:#6f5cff}.ktsubscriber-wave i:nth-child(6n+3){background:#28d9ff}.ktsubscriber-wave i:nth-child(6n+4){background:#41e968}.ktsubscriber-wave i:nth-child(6n+5){background:#ffd43b}.ktsubscriber-wave i:nth-child(6n){background:#ff774f}@keyframes ktsubscriberWave{from{transform:scaleY(.45)}to{transform:scaleY(1)}}'
      +'.ktsubscriber-earn{position:absolute;left:auto;right:8px;bottom:70px;transform:none;z-index:10;width:155px;max-width:38%}.ktsubscriber-earn #myEarnHud{position:static!important;transform:none!important;width:100%!important;margin:0!important;padding:4px 7px!important;border:1px solid #d2a936!important;border-radius:14px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktsubscriber-chat{position:absolute;left:8px;right:170px;bottom:70px;z-index:8;max-height:94px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:5px 5px 6px;background:linear-gradient(90deg,rgba(0,0,0,.52),rgba(0,0,0,.15) 74%,transparent);border-radius:9px}.ktsubscriber-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#ddd;font-size:11px;font-weight:850;text-shadow:0 1px 3px #000}.ktsubscriber-chat-line{display:flex;gap:7px;align-items:baseline;margin-top:4px;font-size:11px;font-weight:850;text-shadow:0 1px 3px #000}.ktsubscriber-chat-line b{color:#65c8ff;font-weight:950}.ktsubscriber-chat-line span{color:#fff}'
      +'.ktsubscriber-gifts{position:absolute;left:3px;right:3px;bottom:3px;z-index:11;height:64px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktsubscriber-gift{min-width:0;border:1px solid #ffffff33;border-radius:7px;background:linear-gradient(180deg,rgba(17,17,22,.76),rgba(9,9,12,.84));color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden;backdrop-filter:blur(2px)}.ktsubscriber-gift img{width:36px;max-width:84%;height:29px;object-fit:contain;filter:drop-shadow(0 2px 4px #000)}.ktsubscriber-emoji{height:29px;display:grid;place-items:center;font-size:23px;line-height:1;filter:drop-shadow(0 0 5px #ff5bd4)}.ktsubscriber-gift b{color:#ffe23e;font-size:8.5px;line-height:1}.ktsubscriber-gift small{display:block;margin-top:1px;color:#fff;font-size:7px;line-height:1.05;font-weight:900;text-align:center}'
      +'.ktsubscriber-tools{flex:0 0 55px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;align-items:start}.ktsubscriber-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktsubscriber-tool i{width:37px;height:37px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px;box-shadow:inset 0 0 13px #ffffff08}.ktsubscriber-tool:first-child i{box-shadow:0 0 12px #a53fff66,inset 0 0 13px #ffffff08}.ktsubscriber-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.ktsubscriber-room{padding-left:4px;padding-right:4px;gap:3px}.ktsubscriber-head{flex-basis:58px;padding:4px 7px}.ktsubscriber-title{font-size:17px}.ktsubscriber-brand{font-size:17px}.ktsubscriber-att{min-width:88px;height:28px;font-size:11px;padding:0 3px}.ktsubscriber-att img{width:14px;height:14px}.ktsubscriber-air{flex-basis:31px;font-size:12px}.ktsubscriber-led{flex-basis:50px}.ktsubscriber-led-track{font-size:20px}.ktsubscriber-right{bottom:150px}.ktsubscriber-right button{width:40px;height:40px}.ktsubscriber-right .like{height:46px}.ktsubscriber-earn{left:auto;right:5px;bottom:64px;transform:none;width:128px;max-width:40%}.ktsubscriber-chat{right:140px;bottom:64px;max-height:88px}.ktsubscriber-gifts{height:58px}.ktsubscriber-gift img,.ktsubscriber-emoji{height:26px}.ktsubscriber-tools{flex-basis:50px}.ktsubscriber-tool i{width:33px;height:33px;font-size:16px}}'
      +'</style>'
      +'<section class="ktsubscriber-room">'
        +'<div class="ktsubscriber-head"><div class="ktsubscriber-left"><button class="ktsubscriber-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsubscriber-title"><i>●</i> 구독자 방송</div></div><button class="ktsubscriber-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button><div class="ktsubscriber-brand">K-Talk LIVE</div></div>'
        +'<div class="ktsubscriber-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span></div>'
        +'<div class="ktsubscriber-led"><div class="ktsubscriber-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'
        +'<div class="ktsubscriber-main">'
          +'<video id="ktLiveVideo" autoplay playsinline muted></video>'
          +'<div class="ktsubscriber-shade"></div>'
          +'<div class="ktsubscriber-right"><button class="like" onclick="if(window.addHostLike)addHostLike(1)">💗<small>좋아요</small><b id="hostLikeCount" style="display:block;font-size:8px">0</b></button><button onclick="openGifts()">🎁</button><button onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')">⚔<small>매치</small></button><button onclick="ktSubscriberEffect()">✨<small>효과</small></button></div>'
          +'<div class="ktsubscriber-wave">'+equalizerBars()+'</div>'
          +'<div class="ktsubscriber-earn"><button id="myEarnHud" onclick="toggleMyEarnings()"><div style="display:flex;align-items:center;justify-content:center;gap:5px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div><div id="myEarnDetail" style="display:none;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;font-size:7px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right">'+esc(rate)+'</span></div></button></div>'
          +'<div id="ktsubscriberChatList" class="ktsubscriber-chat"></div>'
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

/* 2026-09-11 구독자방 전용: 호스트 1명 + 게스트 9명 칸, 좋아요/효과/보물상자/매치만 오른쪽 안쪽에 띄움. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSubscriberTenLayoutInSubscriberFile)return;
  window.__ktSubscriberTenLayoutInSubscriberFile=true;

  function ensureSubscriberTenStyle(){
    if(document.getElementById('ktSubscriberTenLayoutInSubscriberFileStyle'))return;
    var st=document.createElement('style');
    st.id='ktSubscriberTenLayoutInSubscriberFileStyle';
    st.textContent=''
      +'.ktsubscriber-main .ktsubscriber-people{position:absolute;left:3px;top:3px;right:56px;bottom:150px;z-index:3;display:grid;grid-template-columns:minmax(0,40%) minmax(0,60%);gap:3px;pointer-events:none}'
      +'.ktsubscriber-main .ktsubscriber-host-tile{position:relative;min-width:0;min-height:0;overflow:hidden;border:2px solid #ff31bd;border-radius:9px;background:#16161a;box-shadow:0 0 8px rgba(255,49,189,.22)}'
      +'.ktsubscriber-main .ktsubscriber-host-tile #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important;transform:scaleX(-1)!important;background:#111!important}'
      +'.ktsubscriber-main .ktsubscriber-host-label{position:absolute;left:6px;top:6px;z-index:4;padding:3px 8px;border-radius:11px;background:#ff3168;color:#fff;font-size:10px;font-weight:950;box-shadow:0 2px 8px #0008}'
      +'.ktsubscriber-main .ktsubscriber-guest-grid{min-width:0;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:2px}'
      +'.ktsubscriber-main .ktsubscriber-guest-slot{min-width:0;min-height:0;overflow:hidden;border:1px solid #ff31bd;border-radius:7px;background:linear-gradient(145deg,#17181d,#0f1014);display:grid;place-items:center;align-content:center;color:#d7d7dd;text-align:center;box-shadow:inset 0 0 10px #ffffff08}'
      +'.ktsubscriber-main .ktsubscriber-guest-avatar{display:block;font-size:20px;line-height:1;margin-bottom:2px;opacity:.8}.ktsubscriber-main .ktsubscriber-guest-slot b{display:block;font-size:8px;line-height:1;color:#eee;font-weight:900}'
      +'.ktsubscriber-main>.ktsubscriber-shade{z-index:1!important}'
      +'.ktsubscriber-main .ktsubscriber-right{right:4px!important;top:10px!important;bottom:auto!important;z-index:15!important;display:grid!important;gap:5px!important;width:46px!important;justify-items:center!important}'
      +'.ktsubscriber-main .ktsubscriber-right button{width:42px!important;height:42px!important;min-width:42px!important;border-radius:50%!important;background:rgba(16,16,20,.82)!important;backdrop-filter:blur(3px);box-shadow:0 2px 9px #0009!important;padding:0!important;pointer-events:auto!important}'
      +'.ktsubscriber-main .ktsubscriber-right .like{height:46px!important;border-radius:16px!important;background:rgba(50,16,36,.86)!important}'
      +'.ktsubscriber-main .ktsubscriber-right small{display:block!important;font-size:7px!important;line-height:1.05!important;margin-top:0!important;white-space:nowrap!important}'
      +'@media(max-width:390px){.ktsubscriber-main .ktsubscriber-people{right:50px;bottom:136px;grid-template-columns:minmax(0,39%) minmax(0,61%)}.ktsubscriber-main .ktsubscriber-right{right:3px!important;top:8px!important;width:42px!important}.ktsubscriber-main .ktsubscriber-right button{width:38px!important;height:38px!important;min-width:38px!important;font-size:14px!important}.ktsubscriber-main .ktsubscriber-right .like{height:42px!important}.ktsubscriber-main .ktsubscriber-guest-avatar{font-size:17px}.ktsubscriber-main .ktsubscriber-guest-slot b{font-size:7px}}';
    document.head.appendChild(st);
  }

  function orderSubscriberRightButtons(main){
    var box=main.querySelector('.ktsubscriber-right');
    if(!box)return;
    var buttons=[].slice.call(box.querySelectorAll('button'));
    var like=buttons.find(function(b){return b.classList.contains('like');});
    var effect=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('ktSubscriberEffect')>-1;});
    var gift=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('openGifts')>-1;});
    var match=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('openHostMatchArena')>-1;});
    if(gift)gift.innerHTML='🎁<small>보물상자</small>';
    [like,effect,gift,match].forEach(function(b){if(b)box.appendChild(b);});
  }

  function setupSubscriberTenLayout(){
    var room=document.querySelector('.ktsubscriber-room');
    var main=room&&room.querySelector('.ktsubscriber-main');
    if(!main)return;
    ensureSubscriberTenStyle();
    orderSubscriberRightButtons(main);
    if(main.getAttribute('data-kt-ten-layout')==='1')return;
    var video=main.querySelector('#ktLiveVideo');
    if(!video)return;

    var people=document.createElement('div');
    people.className='ktsubscriber-people';
    var host=document.createElement('div');
    host.className='ktsubscriber-host-tile';
    var label=document.createElement('span');
    label.className='ktsubscriber-host-label';
    label.textContent='호스트';
    host.appendChild(video);
    host.appendChild(label);

    var guests=document.createElement('div');
    guests.className='ktsubscriber-guest-grid';
    for(var i=1;i<=9;i++){
      var slot=document.createElement('div');
      slot.className='ktsubscriber-guest-slot';
      slot.setAttribute('data-guest-slot',String(i));
      slot.innerHTML='<span class="ktsubscriber-guest-avatar">👤</span><b>게스트 '+i+'</b>';
      guests.appendChild(slot);
    }

    people.appendChild(host);
    people.appendChild(guests);
    main.insertBefore(people,main.firstChild);
    main.setAttribute('data-kt-ten-layout','1');
  }

  setTimeout(setupSubscriberTenLayout,0);
  var tries=0;
  var timer=setInterval(function(){
    tries++;
    setupSubscriberTenLayout();
    if(tries>80)clearInterval(timer);
  },250);
  if('MutationObserver' in window){
    var ob=new MutationObserver(function(){setupSubscriberTenLayout();});
    var target=document.getElementById('screen')||document.body;
    if(target)ob.observe(target,{childList:true,subtree:true});
  }
})();
