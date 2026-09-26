/* K-Talk AI DJ room - fresh rebuild 2026-09-27 */
(function(){
  if(window.__ktFreshAiDjRoom20260927)return;
  window.__ktFreshAiDjRoom20260927=true;

  function el(id){return document.getElementById(id);}
  function speak(t){try{if(window.ktSpeak)window.ktSpeak(t);}catch(e){}}

  function guest(n){
    return '<button class="fadj-guest"><span class="fadj-n">'+n+'</span><span class="fadj-av">👤</span><span class="fadj-plus">＋</span><b>게스트 '+n+'</b><small>참여하기</small></button>';
  }
  function gift(icon,name,price){
    return '<button class="fadj-gift" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><b>'+name+'</b><small>🪙 '+price+'</small></button>';
  }
  function openSong(){
    var q=prompt('신청곡 제목을 입력해 주세요.','');
    if(q&&q.trim()) speak(q.trim()+' 신청곡으로 접수했습니다.');
  }
  function leave(){
    document.body.classList.remove('kt-fresh-ai-dj');
    if(window.openDashboard) openDashboard();
    else if(window.home) home();
  }

  window.ktOpenFreshAiDjRoom20260927=function(){
    var s=el('screen'); if(!s)return;
    document.body.classList.add('kt-fresh-ai-dj');

    s.innerHTML=
    '<style id="fadj-style">'+
    'body.kt-fresh-ai-dj #screen{padding:0!important;margin:0!important;background:#030106!important;overflow:auto!important;min-height:100dvh}.bottom{display:none!important}'+
    '.fadj{min-height:100dvh;color:#fff;background:radial-gradient(circle at 25% 10%,#3a0038 0,transparent 28%),radial-gradient(circle at 78% 18%,#13004b 0,transparent 28%),#030106;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:8px 8px calc(12px + env(safe-area-inset-bottom));box-sizing:border-box}'+
    '.fadj-top{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px}.fadj-back{width:36px;height:36px;border-radius:50%;border:1px solid #ff4fd8;background:#120516;color:#fff;font-size:26px}.fadj-logo{text-align:center;font-size:25px;font-weight:1000;font-style:italic;color:#fff;text-shadow:0 0 10px #ff37e2,0 0 20px #7c4dff}.fadj-on{padding:7px 10px;border-radius:999px;background:#d81742;border:1px solid #ff6c92;font-weight:900;font-size:12px;box-shadow:0 0 14px #ff1744}'+
    '.fadj-bars{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.fadj-bars button{min-height:44px;border-radius:12px;border:2px solid #ff4bd8;background:#160619;color:#ffe26b;font-size:12px;font-weight:900;box-shadow:0 0 13px #ff36d766}.fadj-bars button:last-child{border-color:#8a6cff;color:#fff}'+
    '.fadj-main{display:grid;grid-template-columns:58% 42%;gap:7px;margin-top:7px}.fadj-dj{position:relative;min-height:390px;border:2px solid #ff43d1;border-radius:15px;overflow:hidden;background:linear-gradient(160deg,#2b0632,#0a0614);box-shadow:0 0 18px #ff42d377}.fadj-dj:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 65% 34%,#ff7ad733,transparent 22%),radial-gradient(circle at 30% 28%,#744bff33,transparent 28%)}.fadj-title{position:absolute;left:12px;top:12px;font-size:28px;font-weight:1000;font-style:italic;text-shadow:0 0 12px #a64cff}.fadj-live{position:absolute;right:10px;top:10px;background:#f32d4e;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:1000}.fadj-person{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);font-size:112px;filter:drop-shadow(0 0 18px #ff62d0)}.fadj-hello{position:absolute;left:14px;top:82px;font-weight:900;line-height:1.5;color:#fff;font-size:18px;text-shadow:0 0 8px #ff4bdb}.fadj-mic{position:absolute;left:18px;bottom:72px;font-size:54px}.fadj-wave{position:absolute;left:10px;right:10px;bottom:40px;height:28px;display:flex;align-items:end;gap:3px}.fadj-wave i{flex:1;background:#ff3ac8;border-radius:3px;animation:fadjw .65s ease-in-out infinite alternate}.fadj-wave i:nth-child(3n+2){background:#2dd8ff}.fadj-wave i:nth-child(3n){background:#ffd42d}@keyframes fadjw{from{height:7px}to{height:27px}}.fadj-caption{position:absolute;left:10px;right:10px;bottom:8px;text-align:center;font-size:10px;font-weight:900}'+
    '.fadj-guests{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:6px}.fadj-guest{position:relative;border-radius:12px;border:1px solid #5750ff;background:linear-gradient(160deg,#11122a,#090811);color:#fff;min-height:120px}.fadj-n{position:absolute;left:6px;top:6px;width:23px;height:23px;border-radius:7px;background:#278bff;display:grid;place-items:center;font-weight:900}.fadj-av{display:block;font-size:34px;opacity:.72}.fadj-plus{display:inline-grid;place-items:center;width:27px;height:27px;border-radius:50%;border:2px solid #ff42d1;margin-top:-6px;box-shadow:0 0 10px #ff42d1}.fadj-guest b,.fadj-guest small{display:block;font-size:10px;margin-top:3px}.fadj-wait{border-color:#8a8aa0;color:#aaa}.fadj-wait .fadj-n{background:#514f5b}'+
    '.fadj-lower{display:grid;grid-template-columns:54% 46%;gap:7px;margin-top:7px}.fadj-chat,.fadj-gifts{border:1px solid #ff44d06b;border-radius:14px;background:#0b0910;padding:8px;box-shadow:0 0 14px #ff36cf22}.fadj-tabs{display:flex;gap:14px;font-size:11px;font-weight:900;border-bottom:1px solid #ffffff18;padding-bottom:6px}.fadj-tabs b{color:#ff5ad8}.fadj-msg{font-size:10px;line-height:1.45;margin:7px 0}.fadj-msg.ai{background:#171322;border-radius:8px;padding:7px}.fadj-input{display:flex;gap:5px}.fadj-input input{flex:1;min-width:0;border-radius:9px;border:1px solid #ffffff22;background:#14111a;color:#fff;padding:9px;font-size:10px}.fadj-input button{border:0;border-radius:9px;background:#9d35ff;color:#fff;font-weight:900;padding:0 12px}'+
    '.fadj-gifts{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.fadj-gifts h3{grid-column:1/-1;margin:0 0 3px;font-size:13px;color:#ff70df}.fadj-gift{border:1px solid #74471e;border-radius:9px;background:#120d0a;color:#fff;padding:5px 2px}.fadj-gift i{display:block;font-style:normal;font-size:28px}.fadj-gift b,.fadj-gift small{display:block;font-size:9px}.fadj-gift small{color:#ffd35c}'+
    '.fadj-nav{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px}.fadj-nav button{border:0;background:none;color:#fff;font-size:9px;font-weight:900}.fadj-nav i{display:grid;place-items:center;margin:auto auto 4px;width:38px;height:38px;border-radius:50%;border:1px solid #7a55ff;background:#120c1c;font-style:normal;font-size:20px;box-shadow:0 0 10px #7c4dff55}.fadj-nav button:nth-child(3) i,.fadj-nav button:nth-child(4) i{border-color:#ff5aaf;box-shadow:0 0 10px #ff43c766}'+
    '@media(max-width:390px){.fadj-logo{font-size:21px}.fadj-main{grid-template-columns:55% 45%}.fadj-dj{min-height:350px}.fadj-person{font-size:92px}.fadj-hello{font-size:15px}.fadj-lower{grid-template-columns:52% 48%}.fadj-gift i{font-size:23px}.fadj-nav i{width:34px;height:34px}}'+
    '</style>'+
    '<section class="fadj">'+
      '<div class="fadj-top"><button class="fadj-back" onclick="ktLeaveFreshAiDjRoom20260927()">‹</button><div class="fadj-logo">♛ K-Talk LIVE</div><span class="fadj-on">● ON AIR</span></div>'+
      '<div class="fadj-bars"><button onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">☑ ★ 출석체크 눌러주세요 ★</button><button onclick="ktFreshAiDjSong20260927()">🎵 신청곡 : AI DJ에게 말씀해 주세요 🎙️</button></div>'+
      '<div class="fadj-main">'+
        '<div class="fadj-dj"><div class="fadj-title">K-Talk AI DJ ♛</div><span class="fadj-live">● LIVE</span><div class="fadj-hello">오늘도<br>좋은 음악과<br>함께해요 ♡</div><div class="fadj-person">👩🏻‍🎤</div><div class="fadj-mic">🎙️</div><div class="fadj-wave">'+Array.from({length:28},()=>'<i></i>').join('')+'</div><div class="fadj-caption">🎵 AI DJ가 신청곡을 들려드려요 · 좋은 음악과 함께해요 ♡</div></div>'+
        '<div class="fadj-guests">'+guest(1)+guest(2)+guest(3)+guest(4)+guest(5)+'<button class="fadj-guest fadj-wait"><span class="fadj-n">🔒</span><span class="fadj-av">👤</span><b>대기 (6)</b><small>대기중</small></button></div>'+
      '</div>'+
      '<div class="fadj-lower">'+
        '<div class="fadj-chat"><div class="fadj-tabs"><b>채팅 (128)</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="fadj-msg ai">★ K-Talk AI DJ<br>안녕하세요! AI DJ입니다 💜<br>신청곡 많이 남겨주세요 🎵✨</div><div class="fadj-msg">한수향 · 역시 DJ 최고예요! 🥰</div><div class="fadj-msg">지수 · 오늘도 좋은 음악 부탁해요 💕</div><div class="fadj-input"><input placeholder="메시지를 입력하세요..."><button>전송</button></div></div>'+
        '<div class="fadj-gifts"><h3>🎁 선물 / 후원</h3>'+gift('🌹','1송이','10')+gift('💐','10송이','100')+gift('🌹','20송이','200')+gift('💐','30송이','300')+gift('🌹','40송이','400')+gift('💐','50송이','500')+gift('💖','하트','100')+gift('⭐','별','200')+gift('🎁','선물상자','1,000')+'</div>'+
      '</div>'+
      '<div class="fadj-nav"><button onclick="ktFreshAiDjSong20260927()"><i>🎵</i>신청곡</button><button onclick="speakFreshAiDj20260927()"><i>🎙️</i>말하기</button><button onclick="if(window.openGifts)openGifts()"><i>🌹</i>장미</button><button onclick="if(window.openGifts)openGifts()"><i>🎁</i>선물</button><button onclick="if(window.shareApp)shareApp()"><i>↗</i>공유</button><button><i>🪄</i>효과</button><button><i>•••</i>더보기</button></div>'+
    '</section>';
    window.scrollTo(0,0);
  };
  window.ktFreshAiDjSong20260927=openSong;
  window.speakFreshAiDj20260927=function(){speak('신청곡을 말씀해 주세요.'); openSong();};
  window.ktLeaveFreshAiDjRoom20260927=leave;
})();