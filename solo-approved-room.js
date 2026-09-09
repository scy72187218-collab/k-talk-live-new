/* K-Talk 1인 방송 전용: 전면 카메라를 길게 보여주고 채팅/선물은 카메라 위에 겹쳐 표시. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSoloApprovedRoomInstalled)return;
  window.__ktSoloApprovedRoomInstalled=true;

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast!=='function')return;
  window.ktSoloChatMessages=window.ktSoloChatMessages||[];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isSolo(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='solo'||String(n).indexOf('1인')>-1||String(title).indexOf('1인 방송')>-1;
    }catch(e){return false;}
  }

  function gift(icon,count,label,img){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<span class="ktsolo-emoji">'+icon+'</span>';
    return '<button class="ktsolo-gift" onclick="openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function renderChat(){
    var box=document.getElementById('ktsoloChatList');
    if(!box)return;
    var msgs=window.ktSoloChatMessages||[];
    box.innerHTML=msgs.slice(-5).map(function(m){
      return '<div class="ktsolo-chat-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  window.ktSoloSendChat=function(){
    var input=document.getElementById('ktsoloChatInput');
    if(!input)return;
    var text=String(input.value||'').trim();
    if(!text)return;
    window.ktSoloChatMessages.push({name:'나',text:text});
    try{closeSheet();}catch(e){}
    setTimeout(renderChat,30);
  };

  window.ktSoloOpenMessage=function(){
    showSheet('메시지','<div class="rowbox"><b>1인 방송 채팅</b><br>입력한 글이 카메라 화면 위 채팅으로 표시됩니다.</div><input id="ktsoloChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSoloSendChat()"><button class="act" onclick="ktSoloSendChat()">보내기</button>');
    setTimeout(function(){var i=document.getElementById('ktsoloChatInput');if(i)i.focus();},80);
  };

  window.ktSoloEffect=function(){
    if(window.openEditEffectPanel){
      try{if(window.creator)creator.classList.add('show');openEditEffectPanel();return;}catch(e){}
    }
    showSheet('효과','<div class="rowbox"><b>방송 효과</b><br>라이브 효과를 선택할 수 있습니다.</div>');
  };

  window.ktSoloMore=function(){
    showSheet('더보기','<button class="act" onclick="closeSheet();if(window.openLiveSettings)openLiveSettings()">⚙ 설정</button><button class="act" onclick="closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()" style="background:linear-gradient(135deg,#d9274c,#ff4669)">■ 방송 종료</button>');
  };

  function equalizerBars(){
    var s='';
    for(var i=0;i<52;i++){
      s+='<i style="--d:'+(0.52+(i%8)*0.07).toFixed(2)+'s;--h:'+(10+(i*13)%34)+'px"></i>';
    }
    return s;
  }

  function renderApprovedSolo(){
    var screen=document.getElementById('screen');
    if(!screen)return;

    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var rate=(document.getElementById('hudEarnRate')||{}).textContent||'일반회원 · 35%';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    screen.innerHTML='<style id="ktSoloApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.ktsolo-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktsolo-head{flex:0 0 64px;position:relative;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);box-shadow:inset 0 0 18px #ffffff08;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px}.ktsolo-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsolo-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px;line-height:28px}.ktsolo-title{font-size:20px;font-weight:950;white-space:nowrap}.ktsolo-title i{font-style:normal;color:#ff2e67}.ktsolo-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktsolo-att{justify-self:center;height:31px;min-width:98px;padding:0 4px;border-radius:19px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:13px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;display:flex;align-items:center;justify-content:center;gap:2px;white-space:nowrap}.ktsolo-att img{width:15px;height:15px;object-fit:contain;filter:drop-shadow(0 0 5px #41b8ff)}'
      +'.ktsolo-air{flex:0 0 36px;display:flex;align-items:center;padding:0 8px;font-size:14px;font-weight:950}.ktsolo-air .on{color:#ff315f;margin-right:7px}'
      +'.ktsolo-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsolo-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;will-change:transform;animation:ktsoloMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsolo-led-track span{display:inline-block;padding-right:80px}.ktsolo-led-track b{color:#ff59c9}@keyframes ktsoloMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'.ktsolo-main{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-radius:10px;background:#111}.ktsolo-main video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktsolo-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.06) 65%,rgba(0,0,0,.55) 100%);pointer-events:none}'
      +'.ktsolo-right{position:absolute;right:8px;bottom:158px;z-index:9;display:grid;gap:6px}.ktsolo-right button{width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#101014d9;color:#fff;font-size:16px;font-weight:950}.ktsolo-right .like{height:50px;border-radius:16px;border-color:#ff65b788;background:#321024d9}.ktsolo-right small{display:block;font-size:8px;margin-top:1px}'
      +'.ktsolo-wave{position:absolute;left:10px;right:62px;bottom:143px;height:44px;z-index:4;display:flex;align-items:end;gap:2px;opacity:.88}.ktsolo-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;box-shadow:0 0 5px currentColor;animation:ktsoloWave var(--d) ease-in-out infinite alternate}.ktsolo-wave i:nth-child(6n+2){background:#6f5cff}.ktsolo-wave i:nth-child(6n+3){background:#28d9ff}.ktsolo-wave i:nth-child(6n+4){background:#41e968}.ktsolo-wave i:nth-child(6n+5){background:#ffd43b}.ktsolo-wave i:nth-child(6n){background:#ff774f}@keyframes ktsoloWave{from{transform:scaleY(.45)}to{transform:scaleY(1)}}'
      +'.ktsolo-earn{position:absolute;left:auto;right:8px;bottom:70px;transform:none;z-index:10;width:155px;max-width:38%}.ktsolo-earn #myEarnHud{position:static!important;transform:none!important;width:100%!important;margin:0!important;padding:4px 7px!important;border:1px solid #d2a936!important;border-radius:14px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktsolo-chat{position:absolute;left:8px;right:170px;bottom:70px;z-index:8;max-height:94px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:5px 5px 6px;background:linear-gradient(90deg,rgba(0,0,0,.52),rgba(0,0,0,.15) 74%,transparent);border-radius:9px}.ktsolo-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#ddd;font-size:11px;font-weight:850;text-shadow:0 1px 3px #000}.ktsolo-chat-line{display:flex;gap:7px;align-items:baseline;margin-top:4px;font-size:11px;font-weight:850;text-shadow:0 1px 3px #000}.ktsolo-chat-line b{color:#65c8ff;font-weight:950}.ktsolo-chat-line span{color:#fff}'
      +'.ktsolo-gifts{position:absolute;left:3px;right:3px;bottom:3px;z-index:11;height:64px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktsolo-gift{min-width:0;border:1px solid #ffffff33;border-radius:7px;background:linear-gradient(180deg,rgba(17,17,22,.76),rgba(9,9,12,.84));color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden;backdrop-filter:blur(2px)}.ktsolo-gift img{width:36px;max-width:84%;height:29px;object-fit:contain;filter:drop-shadow(0 2px 4px #000)}.ktsolo-emoji{height:29px;display:grid;place-items:center;font-size:23px;line-height:1;filter:drop-shadow(0 0 5px #ff5bd4)}.ktsolo-gift b{color:#ffe23e;font-size:8.5px;line-height:1}.ktsolo-gift small{display:block;margin-top:1px;color:#fff;font-size:7px;line-height:1.05;font-weight:900;text-align:center}'
      +'.ktsolo-tools{flex:0 0 55px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;align-items:start}.ktsolo-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktsolo-tool i{width:37px;height:37px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px;box-shadow:inset 0 0 13px #ffffff08}.ktsolo-tool:first-child i{box-shadow:0 0 12px #a53fff66,inset 0 0 13px #ffffff08}.ktsolo-tool span{font-size:8px;color:#fff;white-space:nowrap}'
      +'@media(max-width:390px){.ktsolo-room{padding-left:4px;padding-right:4px;gap:3px}.ktsolo-head{flex-basis:58px;padding:4px 7px}.ktsolo-title{font-size:17px}.ktsolo-brand{font-size:17px}.ktsolo-att{min-width:88px;height:28px;font-size:11px;padding:0 3px}.ktsolo-att img{width:14px;height:14px}.ktsolo-air{flex-basis:31px;font-size:12px}.ktsolo-led{flex-basis:50px}.ktsolo-led-track{font-size:20px}.ktsolo-right{bottom:150px}.ktsolo-right button{width:40px;height:40px}.ktsolo-right .like{height:46px}.ktsolo-earn{left:auto;right:5px;bottom:64px;transform:none;width:128px;max-width:40%}.ktsolo-chat{right:140px;bottom:64px;max-height:88px}.ktsolo-gifts{height:58px}.ktsolo-gift img,.ktsolo-emoji{height:26px}.ktsolo-tools{flex-basis:50px}.ktsolo-tool i{width:33px;height:33px;font-size:16px}}'
      +'</style>'
      +'<section class="ktsolo-room">'
        +'<div class="ktsolo-head"><div class="ktsolo-left"><button class="ktsolo-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsolo-title"><i>●</i> 1인 방송</div></div><button class="ktsolo-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button><div class="ktsolo-brand">K-Talk LIVE</div></div>'
        +'<div class="ktsolo-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span></div>'
        +'<div class="ktsolo-led"><div class="ktsolo-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'
        +'<div class="ktsolo-main">'
          +'<video id="ktLiveVideo" autoplay playsinline muted></video>'
          +'<div class="ktsolo-shade"></div>'
          +'<div class="ktsolo-right"><button class="like" onclick="if(window.addHostLike)addHostLike(1)">💗<small>좋아요</small><b id="hostLikeCount" style="display:block;font-size:8px">0</b></button><button onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')">⚔<small>매치</small></button></div>'
          +'<div class="ktsolo-wave">'+equalizerBars()+'</div>'
          +'<div class="ktsolo-earn"><button id="myEarnHud" onclick="toggleMyEarnings()"><div style="display:flex;align-items:center;justify-content:center;gap:5px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div><div id="myEarnDetail" style="display:none;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;font-size:7px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right">'+esc(rate)+'</span></div></button></div>'
          +'<div id="ktsoloChatList" class="ktsolo-chat"></div>'
          +'<div class="ktsolo-gifts">'
            +gift('','1개','장미','rose-single.svg')
            +gift('','50개','장미다발','rose-bouquet-50.svg')
            +gift('','100개','특대장미','rose-bouquet-100.svg')
            +gift('💗','10개','하트','')
            +gift('👑','100개','왕관','')
            +gift('🏎️','50개','스포츠카','')
            +gift('','선물상자','큰 선물 보기','gift-box.svg')
          +'</div>'
        +'</div>'
        +'<div class="ktsolo-tools"><button class="ktsolo-tool" onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')"><i>🔗</i><span>매치</span></button><button class="ktsolo-tool" onclick="shareApp()"><i>👥</i><span>친구</span></button><button class="ktsolo-tool" onclick="ktSoloOpenMessage()"><i>💬</i><span>메시지</span></button><button class="ktsolo-tool" onclick="shareApp()"><i>↗</i><span>공유</span></button><button class="ktsolo-tool" onclick="ktSoloEffect()"><i>🪄</i><span>효과</span></button><button class="ktsolo-tool" onclick="ktSoloMore()"><i>•••</i><span>더보기</span></button></div>'
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
    var solo=isSolo();
    if(solo){
      try{if(window.state)state.cameraFacing='user';}catch(e){}
      try{if(window.ensureLiveCamera)await window.ensureLiveCamera('user');}catch(e){}
    }
    var result=await oldStartBroadcast.apply(this,arguments);
    if(solo)setTimeout(renderApprovedSolo,0);
    return result;
  };
})();