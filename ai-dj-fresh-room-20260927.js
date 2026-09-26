/* K-Talk AI DJ room - independent rebuild 2026-09-27 */
(function(){
  if(window.__ktFreshAiDjIndependent20260927)return;
  window.__ktFreshAiDjIndependent20260927=true;

  function byId(id){return document.getElementById(id);}
  function bars(){var s='';for(var i=0;i<30;i++)s+='<i></i>';return s;}
  function safe(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function speak(t){
    try{
      if('speechSynthesis' in window){
        speechSynthesis.cancel();
        var u=new SpeechSynthesisUtterance(t);
        u.lang='ko-KR';u.rate=1;u.pitch=1;
        speechSynthesis.speak(u);
      }
    }catch(e){}
  }
  function toast(t){
    var x=document.createElement('div');
    x.className='fadj-toast';x.textContent=t;
    document.body.appendChild(x);
    setTimeout(function(){x.classList.add('show');},20);
    setTimeout(function(){x.classList.remove('show');setTimeout(function(){x.remove();},250);},1600);
  }
  function guest(n){
    return '<button class="fadj-slot" onclick="ktFreshDjGuest20260927('+n+')">'+
      '<span class="fadj-num">'+n+'</span><span class="fadj-user">👤</span><span class="fadj-plus">＋</span>'+
      '<b>게스트 '+n+'</b><small>참여하기</small></button>';
  }
  function gift(icon,name,price){
    return '<button class="fadj-gift" onclick="ktFreshDjGift20260927(\''+name+'\','+price+')">'+
      '<i>'+icon+'</i><b>'+name+'</b><small>🪙 '+price+'</small></button>';
  }
  function leave(){
    document.body.classList.remove('kt-fresh-ai-dj');
    var s=byId('screen');
    if(window.openDashboard){openDashboard();return;}
    if(window.home){home();return;}
    if(s)s.innerHTML='';
  }
  function requestSong(){
    var q=prompt('신청곡 제목을 입력해 주세요.','');
    if(!q||!q.trim())return;
    q=q.trim();
    var feed=byId('fadjChatFeed');
    if(feed){
      var d=document.createElement('div');
      d.className='fadj-msg ai';
      d.innerHTML='<b>★ K-Talk AI DJ</b><br>'+safe(q)+' 신청곡으로 접수했어요 🎵';
      feed.appendChild(d);
      feed.scrollTop=feed.scrollHeight;
    }
    speak(q+' 신청곡으로 접수했습니다.');
    toast('신청곡이 접수되었습니다');
  }
  function sendChat(){
    var input=byId('fadjChatInput');if(!input)return;
    var v=input.value.trim();if(!v)return;
    var feed=byId('fadjChatFeed');
    var d=document.createElement('div');d.className='fadj-msg me';
    d.innerHTML='<b>나</b> · '+safe(v);
    feed.appendChild(d);feed.scrollTop=feed.scrollHeight;input.value='';
  }

  window.ktFreshAiDjSong20260927=requestSong;
  window.ktLeaveFreshAiDjRoom20260927=leave;
  window.ktFreshDjGuest20260927=function(n){toast('게스트 '+n+' 참여 준비');};
  window.ktFreshDjGift20260927=function(name,price){toast(name+' 선택 · '+price+'코인');};
  window.ktFreshDjSend20260927=sendChat;
  window.ktFreshDjVoice20260927=function(){speak('신청곡을 말씀해 주세요.');setTimeout(requestSong,300);};
  window.ktFreshDjAttendance20260927=function(){toast('출석체크 완료');};
  window.ktFreshDjShare20260927=function(){
    try{
      if(navigator.share)navigator.share({title:'K-Talk LIVE AI DJ',text:'K-Talk AI DJ 음악방'});
      else toast('공유 준비 완료');
    }catch(e){toast('공유 준비 완료');}
  };
  window.ktFreshDjEffect20260927=function(){toast('효과 메뉴');};
  window.ktFreshDjMore20260927=function(){toast('더보기 메뉴');};

  window.ktOpenFreshAiDjRoom20260927=function(){
    var s=byId('screen');if(!s)return;
    document.body.classList.add('kt-fresh-ai-dj');

    s.innerHTML=
    '<style id="fadj-style">'+
    'body.kt-fresh-ai-dj #screen{padding:0!important;margin:0!important;min-height:100dvh!important;background:#030106!important;overflow:auto!important}.bottom{display:none!important}'+
    '.fadj{min-height:100dvh;box-sizing:border-box;padding:8px 8px calc(12px + env(safe-area-inset-bottom));color:#fff;background:radial-gradient(circle at 22% 8%,#5b004d 0,transparent 26%),radial-gradient(circle at 80% 16%,#1b075e 0,transparent 25%),linear-gradient(#050108,#020104);font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'+
    '.fadj *{box-sizing:border-box}.fadj button{cursor:pointer;-webkit-tap-highlight-color:transparent}.fadj-top{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px}.fadj-back{width:36px;height:36px;border-radius:50%;border:1px solid #ff58d6;background:#130717;color:#fff;font-size:26px}.fadj-logo{text-align:center;font-size:25px;font-weight:1000;font-style:italic;letter-spacing:-1px;text-shadow:0 0 8px #ff3bd5,0 0 20px #8d54ff}.fadj-logo .c{color:#ffd45a}.fadj-on{padding:7px 10px;border-radius:999px;background:#df1749;border:1px solid #ff7899;font-weight:1000;font-size:11px;box-shadow:0 0 14px #ff1744}'+
    '.fadj-bars{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.fadj-bars button{min-height:44px;border-radius:12px;border:2px solid #ff4bd8;background:linear-gradient(180deg,#240729,#120317);color:#ffe66b;font-size:11px;font-weight:1000;box-shadow:0 0 13px #ff36d766}.fadj-bars button:last-child{border-color:#8e64ff;color:#fff}'+
    '.fadj-main{display:grid;grid-template-columns:58% 42%;gap:7px;margin-top:7px}.fadj-dj{position:relative;min-height:400px;overflow:hidden;border:2px solid #ff45cf;border-radius:16px;background:radial-gradient(circle at 60% 42%,#5f1953 0,#21102d 35%,#0b0810 72%);box-shadow:0 0 18px #ff42d377,inset 0 0 28px #8229ff33}.fadj-dj:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,#ff58d40e 40%,transparent 60%),repeating-linear-gradient(90deg,transparent 0 18px,#ffffff05 19px)}.fadj-title{position:absolute;left:12px;top:12px;z-index:2;font-size:27px;font-weight:1000;font-style:italic;text-shadow:0 0 11px #be4cff}.fadj-live{position:absolute;right:10px;top:10px;z-index:2;background:#f02e50;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:1000}.fadj-hello{position:absolute;left:15px;top:78px;z-index:2;font-size:17px;line-height:1.5;font-weight:950;text-shadow:0 0 8px #ff4bdd}.fadj-face{position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);font-size:112px;filter:drop-shadow(0 0 20px #ff67d3)}.fadj-mic{position:absolute;left:17px;bottom:70px;font-size:52px;filter:drop-shadow(0 0 8px #7d6bff)}.fadj-notes{position:absolute;right:13px;top:88px;font-size:36px;line-height:1.9;color:#ff5be1;text-shadow:0 0 10px #ff46da}.fadj-wave{position:absolute;left:10px;right:10px;bottom:38px;height:30px;display:flex;align-items:end;gap:3px}.fadj-wave i{flex:1;height:10px;border-radius:3px;background:#ff3ac8;animation:fadjw .7s ease-in-out infinite alternate}.fadj-wave i:nth-child(3n+2){background:#28d7ff}.fadj-wave i:nth-child(3n){background:#ffd42d}@keyframes fadjw{from{transform:scaleY(.3)}to{transform:scaleY(1)}}.fadj-caption{position:absolute;left:10px;right:10px;bottom:7px;text-align:center;font-size:9px;font-weight:900}'+
    '.fadj-guests{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:6px}.fadj-slot{position:relative;min-height:125px;border-radius:12px;border:1px solid #6257ff;background:linear-gradient(160deg,#12142d,#0a0910);color:#fff;box-shadow:inset 0 0 14px #4b41ff22}.fadj-num{position:absolute;left:6px;top:6px;width:23px;height:23px;border-radius:7px;background:#248bff;display:grid;place-items:center;font-weight:1000}.fadj-user{display:block;font-size:34px;opacity:.72}.fadj-plus{display:inline-grid;place-items:center;width:27px;height:27px;border-radius:50%;border:2px solid #ff46d1;margin-top:-5px;box-shadow:0 0 10px #ff46d1}.fadj-slot b,.fadj-slot small{display:block;font-size:10px;margin-top:3px}.fadj-wait{border-color:#6d6d79;color:#aaa}.fadj-wait .fadj-num{background:#514f5b}'+
    '.fadj-lower{display:grid;grid-template-columns:54% 46%;gap:7px;margin-top:7px}.fadj-chat,.fadj-gifts{height:260px;border:1px solid #ff44d06b;border-radius:14px;background:#0b0910;padding:8px;box-shadow:0 0 14px #ff36cf22}.fadj-tabs{display:flex;gap:13px;font-size:11px;font-weight:900;border-bottom:1px solid #ffffff18;padding-bottom:6px}.fadj-tabs b{color:#ff5ad8}.fadj-feed{height:176px;overflow:auto;padding-right:2px}.fadj-msg{font-size:10px;line-height:1.45;margin:7px 0}.fadj-msg.ai{background:#171322;border-radius:8px;padding:7px}.fadj-msg.me{color:#8feaff}.fadj-input{display:flex;gap:5px}.fadj-input input{flex:1;min-width:0;border-radius:9px;border:1px solid #ffffff22;background:#14111a;color:#fff;padding:9px;font-size:10px}.fadj-input button{border:0;border-radius:9px;background:#9d35ff;color:#fff;font-weight:900;padding:0 12px}'+
    '.fadj-gifts{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;overflow:auto}.fadj-gifts h3{grid-column:1/-1;margin:0 0 3px;font-size:13px;color:#ff70df}.fadj-gift{min-height:68px;border:1px solid #75501f;border-radius:9px;background:linear-gradient(160deg,#160d0a,#0b0808);color:#fff;padding:5px 2px}.fadj-gift i{display:block;font-style:normal;font-size:27px;filter:drop-shadow(0 0 6px #ff7e6a)}.fadj-gift b,.fadj-gift small{display:block;font-size:9px}.fadj-gift small{color:#ffd35c}'+
    '.fadj-nav{position:sticky;bottom:0;z-index:10;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px;padding:7px 2px 3px;background:linear-gradient(180deg,transparent,#050107 28%)}.fadj-nav button{border:0;background:none;color:#fff;font-size:9px;font-weight:900}.fadj-nav i{display:grid;place-items:center;margin:auto auto 4px;width:39px;height:39px;border-radius:50%;border:1px solid #7a55ff;background:#120c1c;font-style:normal;font-size:20px;box-shadow:0 0 10px #7c4dff55}.fadj-nav button:nth-child(3) i,.fadj-nav button:nth-child(4) i{border-color:#ff5aaf;box-shadow:0 0 10px #ff43c766}.fadj-toast{position:fixed;left:50%;bottom:92px;z-index:99999;transform:translate(-50%,20px);opacity:0;padding:10px 15px;border-radius:999px;background:#17111ddd;border:1px solid #ff55d1;color:#fff;font-size:12px;font-weight:900;transition:.22s}.fadj-toast.show{opacity:1;transform:translate(-50%,0)}'+
    '@media(max-width:390px){.fadj-logo{font-size:20px}.fadj-main{grid-template-columns:55% 45%}.fadj-dj{min-height:360px}.fadj-face{font-size:92px}.fadj-hello{font-size:15px}.fadj-lower{grid-template-columns:52% 48%}.fadj-chat,.fadj-gifts{height:245px}.fadj-feed{height:161px}.fadj-gift i{font-size:23px}.fadj-nav i{width:34px;height:34px}}'+
    '</style>'+
    '<section class="fadj" data-room="ai-dj-independent">'+
      '<div class="fadj-top"><button class="fadj-back" onclick="ktLeaveFreshAiDjRoom20260927()">‹</button><div class="fadj-logo"><span class="c">♛</span> K-Talk LIVE ✨</div><span class="fadj-on">● ON AIR</span></div>'+
      '<div class="fadj-bars"><button onclick="ktFreshDjAttendance20260927()">☑ ★ 출석체크 눌러주세요 ★</button><button onclick="ktFreshAiDjSong20260927()">🎵 신청곡 : AI DJ에게 말씀해 주세요 🎙️</button></div>'+
      '<div class="fadj-main">'+
        '<div class="fadj-dj"><div class="fadj-title">K-Talk AI DJ ♛</div><span class="fadj-live">● LIVE</span><div class="fadj-hello">오늘도<br>좋은 음악과<br>함께해요 ♡</div><div class="fadj-face">👩🏻‍🎤</div><div class="fadj-mic">🎙️</div><div class="fadj-notes">♫<br>♪</div><div class="fadj-wave">'+bars()+'</div><div class="fadj-caption">🎵 AI DJ가 신청곡을 들려드려요 · 좋은 음악과 함께해요 ♡</div></div>'+
        '<div class="fadj-guests">'+guest(1)+guest(2)+guest(3)+guest(4)+guest(5)+'<button class="fadj-slot fadj-wait"><span class="fadj-num">🔒</span><span class="fadj-user">👤</span><b>대기 (6)</b><small>대기중</small></button></div>'+
      '</div>'+
      '<div class="fadj-lower">'+
        '<div class="fadj-chat"><div class="fadj-tabs"><b>채팅 (128)</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="fadj-feed" id="fadjChatFeed"><div class="fadj-msg ai"><b>★ K-Talk AI DJ</b><br>안녕하세요! AI DJ입니다 💜<br>좋은 음악과 함께해요. 신청곡 남겨주세요 🎵✨</div><div class="fadj-msg">한수향 · 역시 DJ 최고예요! 🥰💜</div><div class="fadj-msg">지수 · 오늘도 좋은 음악 부탁해요 💕</div></div><div class="fadj-input"><input id="fadjChatInput" placeholder="메시지를 입력하세요..." onkeydown="if(event.key===\'Enter\')ktFreshDjSend20260927()"><button onclick="ktFreshDjSend20260927()">전송</button></div></div>'+
        '<div class="fadj-gifts"><h3>🎁 선물 / 후원</h3>'+gift('🌹','1송이 장미',10)+gift('💐','10송이 장미',100)+gift('🌹','20송이 장미',200)+gift('💐','30송이 장미',300)+gift('🌹','40송이 장미',400)+gift('💐','50송이 장미',500)+gift('💖','하트',100)+gift('⭐','별',200)+gift('🎈','풍선',300)+gift('🎁','선물상자',1000)+'</div>'+
      '</div>'+
      '<div class="fadj-nav"><button onclick="ktFreshAiDjSong20260927()"><i>🎵</i>신청곡</button><button onclick="ktFreshDjVoice20260927()"><i>🎙️</i>말하기</button><button onclick="ktFreshDjGift20260927(\'장미\',10)"><i>🌹</i>장미</button><button onclick="ktFreshDjGift20260927(\'선물\',100)"><i>🎁</i>선물</button><button onclick="ktFreshDjShare20260927()"><i>↗</i>공유</button><button onclick="ktFreshDjEffect20260927()"><i>🪄</i>효과</button><button onclick="ktFreshDjMore20260927()"><i>•••</i>더보기</button></div>'+
    '</section>';
    window.scrollTo(0,0);
  };
})();