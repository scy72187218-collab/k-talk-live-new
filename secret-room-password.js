/* K-Talk 비밀방 전용: 비밀번호 + 다른 방송방과 같은 라이브 화면. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSecretPasswordInstalled)return;
  window.__ktSecretPasswordInstalled=true;
  window.ktSecretChatMessages=window.ktSecretChatMessages||[];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isSecretRoom(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='password'||String(n).indexOf('비밀')>-1||String(title).indexOf('비밀')>-1;
    }catch(e){return false;}
  }

  function getSaved(){
    try{return String(localStorage.getItem('kt_secret_room_password')||'').replace(/\D/g,'').slice(0,4);}catch(e){return '';}
  }

  function savePassword(v){
    v=String(v||'').replace(/\D/g,'').slice(0,4);
    try{localStorage.setItem('kt_secret_room_password',v);}catch(e){}
    if(window.state)state.liveRoomPassword=v;
    return v;
  }

  function ensureStyle(){
    if(document.getElementById('ktSecretPasswordStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretPasswordStyle';
    s.textContent='\
      #ktSecretPasswordBox{display:none;margin:5px 0 2px;padding:7px 8px;border:1px solid rgba(255,190,60,.45);border-radius:13px;background:rgba(30,20,5,.52);color:#fff} \
      #ktSecretPasswordBox.on{display:block;margin-bottom:58px!important} \
      #ktSecretPasswordBox label{display:block;margin-bottom:4px;color:#ffe16b;font-size:11px;font-weight:950} \
      #ktSecretPasswordRow{display:flex;gap:7px;align-items:center} \
      #ktSecretPassword{flex:1;min-width:0;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);color:#fff;font-size:16px;font-weight:900;letter-spacing:7px;text-align:center;outline:none} \
      #ktSecretPasswordSave{height:34px;padding:0 13px;border:0;border-radius:11px;background:linear-gradient(135deg,#ffb62f,#ff7a2f);color:#17100a;font-weight:950} \
      #ktSecretPasswordHelp{margin-top:3px;color:#ddd;font-size:9px} \
      #ktSecretPasswordError{display:none;margin-top:4px;color:#ff7c92;font-size:10px;font-weight:900} \
      #ktSecretPasswordBox.on + .prep-start{position:fixed!important;left:12px!important;right:12px!important;bottom:8px!important;width:auto!important;z-index:9999!important;margin:0!important;padding:12px!important}';
    document.head.appendChild(s);
  }

  function ensurePasswordBox(){
    ensureStyle();
    var card=document.querySelector('.prep-card');
    if(!card)return null;
    var box=document.getElementById('ktSecretPasswordBox');
    if(!box){
      box=document.createElement('div');
      box.id='ktSecretPasswordBox';
      box.innerHTML='<label>🔒 비밀방 비밀번호</label><div id="ktSecretPasswordRow"><input id="ktSecretPassword" type="password" inputmode="numeric" maxlength="4" placeholder="4자리" aria-label="비밀방 비밀번호 4자리"><button id="ktSecretPasswordSave" type="button">저장</button></div><div id="ktSecretPasswordHelp">비밀방에 들어올 때 사용할 숫자 4자리를 입력하세요.</div><div id="ktSecretPasswordError">비밀번호 4자리를 입력해 주세요.</div>';
      var start=card.querySelector('.prep-start');
      card.insertBefore(box,start||null);
      var input=box.querySelector('#ktSecretPassword');
      var saved=(window.state&&state.liveRoomPassword)||getSaved();
      if(saved)input.value=saved;
      input.addEventListener('input',function(){
        this.value=this.value.replace(/\D/g,'').slice(0,4);
        var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='none';
      });
      box.querySelector('#ktSecretPasswordSave').addEventListener('click',function(){
        var v=savePassword(input.value);
        var er=document.getElementById('ktSecretPasswordError');
        if(er)er.style.display=v.length===4?'none':'block';
        if(v.length===4){this.textContent='저장됨';setTimeout(function(){var b=document.getElementById('ktSecretPasswordSave');if(b)b.textContent='저장';},900);}
      });
    }
    box.classList.toggle('on',isSecretRoom());
    return box;
  }

  function updatePrep(){
    var box=ensurePasswordBox();
    if(!box)return;
    box.classList.toggle('on',isSecretRoom());
    if(isSecretRoom()){
      var input=document.getElementById('ktSecretPassword');
      var saved=(window.state&&state.liveRoomPassword)||getSaved();
      if(input&&saved&&!input.value)input.value=saved;
    }
  }

  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,name,max){
      var r=oldSelect.apply(this,arguments);
      if(window.state&&type==='password'){
        state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=max||7;
      }
      setTimeout(updatePrep,0);
      return r;
    };
  }

  var oldOpenRoomPrep=window.openRoomPrep;
  if(typeof oldOpenRoomPrep==='function'){
    window.openRoomPrep=function(name,max){
      var r=oldOpenRoomPrep.apply(this,arguments);
      if(String(name||'').indexOf('비밀')>-1&&window.state){
        state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=max||7;
      }
      setTimeout(updatePrep,30);
      return r;
    };
  }

  function gift(icon,count,label,img){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<span class="ktsecret-emoji">'+icon+'</span>';
    return '<button class="ktsecret-gift" onclick="openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function equalizerBars(){
    var s='';
    for(var i=0;i<52;i++)s+='<i style="--d:'+(0.52+(i%8)*0.07).toFixed(2)+'s;--h:'+(10+(i*13)%34)+'px"></i>';
    return s;
  }

  function renderSecretChat(){
    var box=document.getElementById('ktsecretChatList');
    if(!box)return;
    var msgs=window.ktSecretChatMessages||[];
    box.innerHTML=msgs.slice(-5).map(function(m){return '<div class="ktsecret-chat-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';}).join('');
  }

  window.ktSecretSendChat=function(){
    var input=document.getElementById('ktsecretChatInput');
    if(!input)return;
    var text=String(input.value||'').trim();
    if(!text)return;
    window.ktSecretChatMessages.push({name:'나',text:text});
    try{closeSheet();}catch(e){}
    setTimeout(renderSecretChat,30);
  };

  window.ktSecretOpenMessage=function(){
    showSheet('메시지','<div class="rowbox"><b>비밀방 채팅</b><br>입력한 글이 카메라 화면 위에 표시됩니다.</div><input id="ktsecretChatInput" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSecretSendChat()"><button class="act" onclick="ktSecretSendChat()">보내기</button>');
    setTimeout(function(){var i=document.getElementById('ktsecretChatInput');if(i)i.focus();},80);
  };

  window.ktSecretEffect=function(){
    if(window.openEditEffectPanel){try{if(window.creator)creator.classList.add('show');openEditEffectPanel();return;}catch(e){}}
    showSheet('효과','<div class="rowbox"><b>방송 효과</b><br>라이브 효과를 선택할 수 있습니다.</div>');
  };

  window.ktSecretMore=function(){
    showSheet('더보기','<button class="act" onclick="closeSheet();if(window.openLiveSettings)openLiveSettings()">⚙ 설정</button><button class="act" onclick="closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()" style="background:linear-gradient(135deg,#d9274c,#ff4669)">■ 방송 종료</button>');
  };

  window.ktSecretChangePassword=function(){
    var old=(window.state&&state.liveRoomPassword)||getSaved();
    var v=prompt('비밀방 비밀번호 4자리',old||'');
    if(v===null)return;
    v=savePassword(v);
    if(v.length!==4)alert('숫자 4자리로 입력해 주세요.');
  };

  function startSecretClock(initial){
    if(window.__ktSecretClockTimer)clearInterval(window.__ktSecretClockTimer);
    var p=String(initial||'00:00:00').split(':').map(Number);
    var sec=(p[0]||0)*3600+(p[1]||0)*60+(p[2]||0);
    window.__ktSecretClockTimer=setInterval(function(){
      sec++;
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      var el=document.getElementById('ktLiveClock');if(el)el.textContent=h+':'+m+':'+s;
    },1000);
  }

  function renderSecretRoom(){
    if(!isSecretRoom())return;
    var screen=document.getElementById('screen');
    if(!screen)return;
    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var rate=(document.getElementById('hudEarnRate')||{}).textContent||'일반회원 · 35%';
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    screen.innerHTML='<style id="ktSecretApprovedStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.ktsecret-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktsecret-head{flex:0 0 64px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px}.ktsecret-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsecret-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px}.ktsecret-title{font-size:20px;font-weight:950;white-space:nowrap}.ktsecret-title i{font-style:normal;color:#ff2e67}.ktsecret-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'
      +'.ktsecret-att{justify-self:center;height:29px;min-width:88px;padding:0 3px;border-radius:18px;border:2px solid #ff2bbd;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.4px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:11px;font-weight:950;box-shadow:0 0 8px #ff2bbd;display:flex;align-items:center;justify-content:center;gap:1px;white-space:nowrap}.ktsecret-att img{width:14px;height:14px}'
      +'.ktsecret-airrow{flex:0 0 36px;display:flex;align-items:center;gap:8px;padding:0 8px;font-size:14px;font-weight:950}.ktsecret-airrow .on{color:#ff315f}.ktsecret-lock{margin-left:auto;border:1px solid #d7ad39;border-radius:999px;background:#17140be8;color:#ffe071;padding:5px 9px;font-size:10px;font-weight:950}'
      +'.ktsecret-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsecret-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktsecretMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsecret-led-track span{display:inline-block;padding-right:80px}.ktsecret-led-track b{color:#ff59c9}@keyframes ktsecretMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'.ktsecret-main{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-radius:10px;background:#111;border:1px solid rgba(255,196,73,.35)}.ktsecret-main video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1);background:#111;filter:brightness(1.08) contrast(.95) saturate(1.02)}.ktsecret-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.06) 65%,rgba(0,0,0,.55) 100%);pointer-events:none}'
      +'.ktsecret-right{position:absolute;right:8px;bottom:158px;z-index:9;display:grid;gap:6px}.ktsecret-right button{width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#101014d9;color:#fff;font-size:16px;font-weight:950}.ktsecret-right .like{height:50px;border-radius:16px;border-color:#ff65b788;background:#321024d9}.ktsecret-right small{display:block;font-size:8px}'
      +'.ktsecret-wave{position:absolute;left:10px;right:62px;bottom:143px;height:44px;z-index:4;display:flex;align-items:end;gap:2px;opacity:.88}.ktsecret-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;animation:ktsecretWave var(--d) ease-in-out infinite alternate}.ktsecret-wave i:nth-child(6n+2){background:#6f5cff}.ktsecret-wave i:nth-child(6n+3){background:#28d9ff}.ktsecret-wave i:nth-child(6n+4){background:#41e968}.ktsecret-wave i:nth-child(6n+5){background:#ffd43b}.ktsecret-wave i:nth-child(6n){background:#ff774f}@keyframes ktsecretWave{from{transform:scaleY(.45)}to{transform:scaleY(1)}}'
      +'.ktsecret-earn{position:absolute;right:8px;bottom:70px;z-index:10;width:155px;max-width:38%}.ktsecret-earn #myEarnHud{position:static!important;transform:none!important;width:100%!important;margin:0!important;padding:4px 7px!important;border:1px solid #d2a936!important;border-radius:14px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important}'
      +'.ktsecret-chat{position:absolute;left:8px;right:170px;bottom:70px;z-index:8;max-height:94px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:5px 5px 6px;background:linear-gradient(90deg,rgba(0,0,0,.52),rgba(0,0,0,.15) 74%,transparent);border-radius:9px}.ktsecret-chat:empty:before{content:"💬 채팅 메시지가 여기에 표시됩니다";color:#ddd;font-size:11px;font-weight:850}.ktsecret-chat-line{display:flex;gap:7px;margin-top:4px;font-size:11px;font-weight:850}.ktsecret-chat-line b{color:#65c8ff}.ktsecret-chat-line span{color:#fff}'
      +'.ktsecret-gifts{position:absolute;left:3px;right:3px;bottom:3px;z-index:11;height:64px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ktsecret-gift{min-width:0;border:1px solid #ffffff33;border-radius:7px;background:linear-gradient(180deg,rgba(17,17,22,.76),rgba(9,9,12,.84));color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}.ktsecret-gift img{width:36px;max-width:84%;height:29px;object-fit:contain}.ktsecret-emoji{height:29px;display:grid;place-items:center;font-size:23px}.ktsecret-gift b{color:#ffe23e;font-size:8.5px;line-height:1}.ktsecret-gift small{margin-top:1px;color:#fff;font-size:7px;line-height:1.05;font-weight:900;text-align:center}'
      +'.ktsecret-tools{flex:0 0 55px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px}.ktsecret-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktsecret-tool i{width:37px;height:37px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:18px}.ktsecret-tool span{font-size:8px;white-space:nowrap}'
      +'@media(max-width:390px){.ktsecret-room{padding-left:4px;padding-right:4px;gap:3px}.ktsecret-head{flex-basis:58px;padding:4px 7px}.ktsecret-title,.ktsecret-brand{font-size:17px}.ktsecret-att{min-width:82px;height:27px;font-size:10px}.ktsecret-att img{width:13px;height:13px}.ktsecret-airrow{flex-basis:31px;font-size:12px}.ktsecret-led{flex-basis:50px}.ktsecret-led-track{font-size:20px}.ktsecret-right{bottom:150px}.ktsecret-right button{width:40px;height:40px}.ktsecret-right .like{height:46px}.ktsecret-earn{right:5px;bottom:64px;width:128px;max-width:40%}.ktsecret-chat{right:140px;bottom:64px;max-height:88px}.ktsecret-gifts{height:58px}.ktsecret-gift img,.ktsecret-emoji{height:26px}.ktsecret-tools{flex-basis:50px}.ktsecret-tool i{width:33px;height:33px;font-size:16px}}'
      +'</style>'
      +'<section class="ktsecret-room">'
        +'<div class="ktsecret-head"><div class="ktsecret-left"><button class="ktsecret-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsecret-title"><i>●</i> 비밀방</div></div><button class="ktsecret-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button><div class="ktsecret-brand">K-Talk LIVE</div></div>'
        +'<div class="ktsecret-airrow"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><button class="ktsecret-lock" onclick="ktSecretChangePassword()">🔒 비밀번호</button></div>'
        +'<div class="ktsecret-led"><div class="ktsecret-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'
        +'<div class="ktsecret-main"><video id="ktLiveVideo" autoplay playsinline muted></video><div class="ktsecret-shade"></div>'
          +'<div class="ktsecret-right"><button class="like" onclick="if(window.addHostLike)addHostLike(1)">💗<small>좋아요</small><b id="hostLikeCount" style="display:block;font-size:8px">0</b></button><button onclick="openGifts()">🎁</button><button onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')">⚔<small>매치</small></button><button onclick="ktSecretEffect()">✨<small>효과</small></button></div>'
          +'<div class="ktsecret-wave">'+equalizerBars()+'</div>'
          +'<div class="ktsecret-earn"><button id="myEarnHud" onclick="toggleMyEarnings()"><div style="display:flex;align-items:center;justify-content:center;gap:5px"><span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익</span><b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+esc(net)+'</b></div><div id="myEarnDetail" style="display:none;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px;font-size:7px;color:#ddd"><span id="hudEarnRoses">'+esc(roses)+'</span><span id="hudEarnRate" style="text-align:right">'+esc(rate)+'</span></div></button></div>'
          +'<div id="ktsecretChatList" class="ktsecret-chat"></div>'
          +'<div class="ktsecret-gifts">'+gift('','1개','장미','rose-single.svg')+gift('','50개','장미다발','rose-bouquet-50.svg')+gift('','100개','특대장미','rose-bouquet-100.svg')+gift('💗','10개','하트','')+gift('👑','100개','왕관','')+gift('🏎️','50개','스포츠카','')+gift('','선물상자','큰 선물 보기','gift-box.svg')+'</div>'
        +'</div>'
        +'<div class="ktsecret-tools"><button class="ktsecret-tool" onclick="if(window.openHostMatchArena)openHostMatchArena(\'1대1\')"><i>🔗</i><span>매치</span></button><button class="ktsecret-tool" onclick="shareApp()"><i>👥</i><span>친구</span></button><button class="ktsecret-tool" onclick="ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button><button class="ktsecret-tool" onclick="shareApp()"><i>↗</i><span>공유</span></button><button class="ktsecret-tool" onclick="ktSecretEffect()"><i>🪄</i><span>효과</span></button><button class="ktsecret-tool" onclick="ktSecretMore()"><i>•••</i><span>더보기</span></button></div>'
      +'</section>';

    var v=document.getElementById('ktLiveVideo');
    try{if(v&&window.state&&state.stream){v.srcObject=state.stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
    renderSecretChat();
    startSecretClock(clock);
    try{if(window.ktRenderTreasure)ktRenderTreasure();}catch(e){}
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var secret=isSecretRoom();
      if(secret){
        updatePrep();
        var input=document.getElementById('ktSecretPassword');
        var v=savePassword(input?input.value:((window.state&&state.liveRoomPassword)||getSaved()));
        if(v.length!==4){
          var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='block';
          if(input){input.focus();input.select();}
          return;
        }
        try{if(window.state)state.cameraFacing='user';}catch(e){}
        try{if(window.ensureLiveCamera)await window.ensureLiveCamera('user');}catch(e){}
      }
      var result=await oldStart.apply(this,arguments);
      if(secret)setTimeout(renderSecretRoom,30);
      return result;
    };
  }

  new MutationObserver(function(){updatePrep();}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(updatePrep,100);
})();
