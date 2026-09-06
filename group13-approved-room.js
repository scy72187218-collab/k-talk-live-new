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

  function renderApprovedGroup13(){
    var s=document.getElementById('screen');
    if(!s)return;
    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var rate=(document.getElementById('hudEarnRate')||{}).textContent||'35%';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    s.innerHTML='<style id="ktg13ApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}'
      +'.bottom{display:none!important}'
      +'.ktg13-room{width:100%;height:100dvh;min-height:620px;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktg13-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 12px}'
      +'.ktg13-air{font-weight:950;line-height:1.05}.ktg13-air strong{display:block;font-size:20px;white-space:nowrap}.ktg13-air strong i{font-style:normal;color:#ff2e67}.ktg13-air small{display:block;margin-top:5px;color:#fff;font-size:12px;font-weight:900;white-space:nowrap}.ktg13-air small i{font-style:normal;color:#ff315f}.ktg13-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktg13-attend{justify-self:center;min-width:132px;height:43px;padding:0 14px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:20px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;white-space:nowrap}'
      +'.ktg13-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}'
      +'.ktg13-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktg13Marquee 12s linear infinite;font-size:25px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktg13-led-track span{display:inline-block;padding-right:80px}.ktg13-led-track b{color:#ff59c9}@keyframes ktg13Marquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}'
      +'.ktg13-stats{flex:0 0 47px;display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:7px}.ktg13-stats button,.ktg13-viewers{border:0;border-radius:14px;background:#111114;color:#fff;font-size:15px;font-weight:950;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;overflow:hidden}'
      +'.ktg13-main{position:relative;flex:1 1 auto;min-height:0;display:grid;grid-template-columns:43% 57%;gap:3px;overflow:hidden}.ktg13-host{position:relative;min-width:0;overflow:hidden;border-radius:9px;background:#17171a}.ktg13-host video{width:100%;height:100%;display:block;object-fit:cover;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktg13-host-label{position:absolute;left:8px;top:8px;z-index:3;padding:4px 9px;border-radius:13px;background:#222a;color:#fff;font-size:14px;font-weight:950}'
      +'.ktg13-guests{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:2px;min-width:0;min-height:0}.ktg13-guest{display:grid;place-items:center;min-width:0;min-height:0;border:1px solid #28282d;border-radius:7px;background:linear-gradient(145deg,#17181b,#111214);color:#bdbdc4;font-size:14px;font-weight:900}'
      +'.ktg13-chat{position:static;flex:0 0 86px;width:100%;max-height:86px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;pointer-events:none;padding:2px 10px 4px;background:#000}.ktg13-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#777;font-size:11px;font-weight:800;margin:auto 0 4px}.ktg13-chat-line{display:flex;gap:7px;align-items:baseline;margin-top:5px;color:#fff;font-size:12px;font-weight:800;text-shadow:0 1px 2px #000,0 0 4px #000}.ktg13-chat-line b{color:#65c8ff;font-weight:950}.ktg13-chat-line span{color:#fff}'
      +'.ktg13-gifts{flex:0 0 93px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktg13-gift{min-width:0;border:1px solid #33343a;border-radius:7px;background:linear-gradient(180deg,#111116,#09090c);color:#fff;padding:4px 1px 3px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.ktg13-gift img{width:46px;max-width:88%;height:43px;object-fit:contain;filter:drop-shadow(0 2px 4px #000)}.ktg13-emoji{height:43px;display:grid;place-items:center;font-size:34px;line-height:1;filter:drop-shadow(0 0 5px #ff5bd4)}.ktg13-gift b{color:#ffe23e;font-size:11px;line-height:1.05}.ktg13-gift small{display:block;margin-top:2px;color:#fff;font-size:9px;line-height:1.05;font-weight:900;text-align:center;white-space:normal}'
      +'.ktg13-earn{order:1;flex:0 0 49px;display:flex;align-items:center;justify-content:center}.ktg13-earn #myEarnHud{position:static!important;left:auto!important;bottom:auto!important;transform:none!important;width:auto!important;min-width:230px!important;max-width:82%!important;margin:0!important;padding:5px 12px!important;border:1px solid #d2a936!important;border-radius:15px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktg13-tools{order:2;flex:0 0 78px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;align-items:start}.ktg13-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;font-size:10px;display:grid;justify-items:center;gap:3px}.ktg13-tool i{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:25px;box-shadow:inset 0 0 13px #ffffff08}.ktg13-tool:first-child i{color:#fff;box-shadow:0 0 12px #a53fff66,inset 0 0 13px #ffffff08}.ktg13-tool span{font-size:10px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.ktg13-room{padding-left:4px;padding-right:4px;gap:3px}.ktg13-head{flex-basis:58px;padding:4px 8px}.ktg13-air strong{font-size:18px}.ktg13-air small{font-size:10px}.ktg13-brand{font-size:17px}.ktg13-attend{min-width:112px;height:38px;font-size:17px;padding:0 9px}.ktg13-led{flex-basis:50px}.ktg13-led-track{font-size:21px}.ktg13-stats{flex-basis:42px;gap:4px}.ktg13-stats button,.ktg13-viewers{font-size:12px}.ktg13-main{grid-template-columns:42% 58%}.ktg13-guest{font-size:12px}.ktg13-chat{flex-basis:76px;max-height:76px;padding-left:6px;padding-right:6px}.ktg13-chat-line{font-size:10px}.ktg13-gifts{flex-basis:84px}.ktg13-gift img{height:36px}.ktg13-emoji{height:36px;font-size:29px}.ktg13-gift b{font-size:9px}.ktg13-gift small{font-size:7px}.ktg13-earn{flex-basis:43px}.ktg13-tools{flex-basis:67px}.ktg13-tool i{width:42px;height:42px;font-size:21px}.ktg13-tool span{font-size:9px}}'
      +'</style>'
      +'<section class="ktg13-room">'
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
        +'<div class="ktg13-earn"><button id="myEarnHud" onclick="toggleMyEarnings()">'
          +'<div style="display:flex;align-items:center;justify-content:center;gap:7px"><span style="font-size:10px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익 · 본인만 표시</span><b id="hudEarnNet" style="font-size:15px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div>'
          +'<div id="myEarnDetail" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:3px;font-size:10px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right">일반회원 · '+esc(rate)+'</span></div>'
        +'</button></div>'
        +'<div id="ktg13ChatList" class="ktg13-chat"></div>'
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
          +'<button class="ktg13-tool" onclick="shareApp()"><i>↗</i><span>공유</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13Effect()"><i>🪄</i><span>효과</span></button>'
          +'<button class="ktg13-tool" onclick="ktGroup13More()"><i>•••</i><span>더보기</span></button>'
        +'</div>'
      +'</section>';

    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&window.state&&state.stream){v.srcObject=state.stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}
    }catch(e){}
    renderChat();
    try{if(window.ktRenderTreasure)ktRenderTreasure();}catch(e){}
  }

  window.startBroadcast=async function(){
    if(!isGroup13())return oldStartBroadcast.apply(this,arguments);
    var result=await oldStartBroadcast.apply(this,arguments);
    setTimeout(renderApprovedGroup13,0);
    return result;
  };
})();