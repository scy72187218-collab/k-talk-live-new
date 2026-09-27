/* K-Talk AI DJ 전용 6명방
   비밀방과 같은 3x2 모양만 사용한다.
   비밀방과는 완전히 별도이며 비밀번호를 사용하지 않는다.
   내부 통신은 기존 group9 경로를 그대로 사용해 다른 통신 코드는 건드리지 않는다. */
(function(){
  if(window.__ktAiDjSixRoom20260927)return;
  window.__ktAiDjSixRoom20260927=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isAiDj(){
    try{
      return !!(window.state&&state.ktAiDjRoom) &&
        String((state.liveRoomName||'')+' '+((document.getElementById('liveTitle')||{}).value||'')).indexOf('AI DJ')>-1;
    }catch(e){return false;}
  }

  function bars(){
    var s='';
    for(var i=0;i<36;i++)s+='<i style="--d:'+(0.48+(i%8)*0.07).toFixed(2)+'s;--h:'+(10+(i*9)%34)+'px"></i>';
    return s;
  }

  function render(){
    if(!isAiDj())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;

    var dj='';
    try{dj=window.KT_AI_DJ_PHOTO||'';}catch(e){}
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:25:32';

    screen.innerHTML=''
      +'<style id="ktAiDjSixStyle20260928">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#020205!important}.bottom{display:none!important}'
      +'.kt-ai-dj-six-room{width:100%;height:100dvh;overflow:hidden;background:radial-gradient(circle at 12% 10%,#25002f 0,transparent 28%),radial-gradient(circle at 86% 18%,#06183d 0,transparent 30%),#020205;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:5px;display:flex;flex-direction:column;gap:4px}'
      +'.ktadj-top{flex:0 0 48px;display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:6px}.ktadj-onair{height:32px;padding:0 10px;border-radius:999px;border:1px solid #ff4b8e;background:#ff255e;color:#fff;font-size:11px;font-weight:950;box-shadow:0 0 12px #ff2d78}.ktadj-clock{font-size:12px;font-weight:950}.ktadj-logo{text-align:center;font-size:24px;font-weight:1000;font-style:italic;letter-spacing:-1px;color:#fff;text-shadow:0 0 8px #ff35cb,0 0 16px #6d52ff}.ktadj-view{height:31px;padding:0 9px;border-radius:999px;border:1px solid #4ec7ff;background:#071326;color:#fff;font-size:10px;font-weight:900;box-shadow:0 0 10px #5b65ff}'
      +'.ktadj-banners{flex:0 0 46px;display:grid;grid-template-columns:1fr 1fr;gap:4px}.ktadj-banner{border:1px solid #ff48d6;border-radius:12px;background:#120714;display:flex;align-items:center;justify-content:center;padding:0 6px;font-size:10px;font-weight:950;box-shadow:inset 0 0 12px #ff34d522,0 0 7px #ff2dc855}.ktadj-banner.gold{color:#ffe45f}.ktadj-banner.song{color:#fff}.ktadj-banner.song b{color:#ff80df}'
      +'.ktadj-main{flex:1 1 0;min-height:0;display:grid;grid-template-columns:57% 43%;gap:4px}'
      +'.ktadj-djcard{position:relative;min-height:0;overflow:hidden;border-radius:12px;border:2px solid #ff45da;background:#100613;box-shadow:0 0 12px #ff39d488}.ktadj-dj-title{position:absolute;left:8px;top:7px;z-index:6;font-size:18px;font-weight:1000;font-style:italic;text-shadow:0 0 8px #9c6cff}.ktadj-live{position:absolute;right:7px;top:7px;z-index:6;padding:4px 8px;border-radius:999px;background:#ff275c;color:#fff;font-size:9px;font-weight:950}.ktadj-dj-photo{position:absolute;inset:0;background:#120714 center 34%/cover no-repeat;transform:scale(1.08)}.ktadj-dj-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.18),transparent 28%,transparent 65%,rgba(0,0,0,.72))}.ktadj-dj-copy{position:absolute;left:10px;top:54px;z-index:6;color:#fff;font-size:13px;font-weight:950;line-height:1.45;text-shadow:0 0 8px #ff45e8}.ktadj-dj-note{position:absolute;left:8px;right:8px;bottom:40px;z-index:6;padding:4px 6px;border-radius:8px;background:rgba(6,3,12,.62);font-size:8px;text-align:center;font-weight:850}.ktadj-wave{position:absolute;left:7px;right:7px;bottom:6px;height:29px;z-index:6;display:flex;align-items:end;gap:2px}.ktadj-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;animation:ktadjwave var(--d) ease-in-out infinite alternate}.ktadj-wave i:nth-child(4n+2){background:#28d9ff}.ktadj-wave i:nth-child(4n+3){background:#41e968}.ktadj-wave i:nth-child(4n){background:#ffd43b}@keyframes ktadjwave{from{transform:scaleY(.35)}to{transform:scaleY(1)}}'
      +'.ktadj-guests{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;min-height:0}.ktadj-slot{position:relative;overflow:hidden;border-radius:10px;border:1px solid #5f79ff;background:linear-gradient(145deg,#101224,#070812);box-shadow:inset 0 0 16px #3a4eff22}.ktadj-slot.off{border-color:#70809a}.ktadj-num{position:absolute;left:5px;top:5px;width:22px;height:22px;border-radius:7px;background:#218dff;display:grid;place-items:center;font-size:10px;font-weight:950}.ktadj-slot.off .ktadj-num{background:#ff961f}.ktadj-wait{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:8px;font-weight:900;color:#fff}.ktadj-avatar{width:34px;height:34px;border-radius:50%;border:1px solid #9ba7ff;background:radial-gradient(circle,#7d68d0,#29223c 55%,#111);display:grid;place-items:center;font-size:18px}.ktadj-plus{width:28px;height:28px;border-radius:50%;border:2px solid #ff54d0;display:grid;place-items:center;font-size:20px;box-shadow:0 0 9px #ff38c6}'
      +'.ktadj-lower{flex:0 0 245px;display:grid;grid-template-columns:55% 45%;gap:4px;min-height:0}.ktadj-chat,.ktadj-gifts{min-height:0;border:1px solid #ff3ec488;border-radius:12px;background:#070910;box-shadow:0 0 10px #ff2bbd33;overflow:hidden}.ktadj-tabs{height:31px;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #ff4bd055}.ktadj-tabs span{display:grid;place-items:center;font-size:9px;font-weight:900}.ktadj-tabs span.on{background:linear-gradient(180deg,#ff41d0,#9d2cff);color:#fff}.ktadj-chatbody{height:165px;padding:7px;overflow:hidden}.ktadj-msg{display:grid;grid-template-columns:25px 1fr;gap:6px;margin-bottom:5px}.ktadj-pic{width:25px;height:25px;border-radius:50%;background:#29133a;display:grid;place-items:center;font-size:13px;border:1px solid #ff59d1}.ktadj-line b{display:block;color:#ff78de;font-size:8px}.ktadj-line span{display:block;color:#eef;font-size:7px;line-height:1.35}.ktadj-chatinput{height:31px;margin:5px 7px 7px;display:grid;grid-template-columns:1fr auto;gap:4px}.ktadj-chatinput div{border:1px solid #ffffff30;border-radius:9px;background:#111728;color:#9fa7bc;font-size:8px;display:flex;align-items:center;padding:0 8px}.ktadj-chatinput button{border:0;border-radius:9px;background:linear-gradient(135deg,#8d47ff,#ff32c8);color:#fff;font-size:8px;font-weight:950;padding:0 10px}'
      +'.ktadj-gifthead{height:31px;padding:0 8px;display:flex;align-items:center;font-size:12px;font-weight:950;color:#ff8de3;border-bottom:1px solid #ff4bd055}.ktadj-gifttabs{height:28px;display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:2px 4px}.ktadj-gifttabs span{display:grid;place-items:center;font-size:7px;font-weight:850}.ktadj-gifttabs span.on{border-radius:8px;background:#ff37c8}.ktadj-giftgrid{height:171px;padding:4px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:4px}.ktadj-gift{border:1px solid #ffb02eaa;border-radius:8px;background:#100b10;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;text-align:center;min-width:0}.ktadj-gift i{font-style:normal;font-size:24px;line-height:1}.ktadj-gift b{font-size:7px;margin-top:2px;line-height:1.15}.ktadj-gift.special i{font-size:26px}.ktadj-gift.special b{font-size:7px}.ktadj-gift.box b{font-size:6px}'
      +'.ktadj-tools{flex:0 0 53px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px;align-items:center}.ktadj-tool{border:0;background:none;color:#fff;display:grid;justify-items:center;gap:1px;font-weight:900}.ktadj-tool i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#0d0d15;border:2px solid #ff46d4;font-style:normal;font-size:18px;box-shadow:0 0 10px #ff42d255}.ktadj-tool:nth-child(4) i,.ktadj-tool:nth-child(6) i{border-color:#ffb72d;box-shadow:0 0 10px #ff9f2d66}.ktadj-tool:nth-child(5) i{border-color:#488bff;box-shadow:0 0 10px #3e74ff66}.ktadj-tool span{font-size:7px}'
      +'@media(max-width:390px){.kt-ai-dj-six-room{gap:3px;padding:3px}.ktadj-logo{font-size:20px}.ktadj-main{grid-template-columns:56% 44%}.ktadj-lower{flex-basis:228px}.ktadj-chatbody{height:151px}.ktadj-giftgrid{height:157px}.ktadj-dj-copy{font-size:12px}.ktadj-tool i{width:32px;height:32px;font-size:16px}}'
      +'</style>'
      +'<section class="kt-ai-dj-six-room" data-kt-ai-dj="1" data-kt-room="ai-dj-6">'
        +'<div class="ktadj-top"><button class="ktadj-onair">● ON AIR</button><span id="ktLiveClock" class="ktadj-clock">'+esc(clock)+'</span><div class="ktadj-logo">♛ K-Talk LIVE ✦</div><div class="ktadj-view">👤 접속 1,286명</div></div>'
        +'<div class="ktadj-banners"><button class="ktadj-banner gold" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">☑ ★ 출석체크 눌러주세요 ★</button><button class="ktadj-banner song" onclick="if(window.ktAiDjOpenRequest20260927)ktAiDjOpenRequest20260927()">🎵 신청곡 : <b>AI DJ에게 말씀해 주세요</b> 🎤</button></div>'
        +'<div class="ktadj-main">'
          +'<div class="ktadj-djcard"><div class="ktadj-dj-photo" style="background-image:url(&quot;'+esc(dj)+'&quot;)"></div><div class="ktadj-dj-shade"></div><div class="ktadj-dj-title">K-Talk AI DJ ♛</div><div class="ktadj-live">● LIVE</div><div class="ktadj-dj-copy">오늘도<br>좋은 음악과<br>함께해요 ♡</div><div class="ktadj-dj-note">🎵 AI DJ가 신청곡을 들려드려요 &nbsp; 🎵 좋은 음악과 함께해요 ♡</div><div class="ktadj-wave">'+bars()+'</div></div>'
          +'<div class="ktadj-guests">'
            +'<div class="ktadj-slot"><span class="ktadj-num">1</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><div class="ktadj-plus">+</div><span>게스트 1<br>참여하기</span></div></div>'
            +'<div class="ktadj-slot"><span class="ktadj-num">2</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><div class="ktadj-plus">+</div><span>게스트 2<br>참여하기</span></div></div>'
            +'<div class="ktadj-slot"><span class="ktadj-num">3</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><div class="ktadj-plus">+</div><span>게스트 3<br>참여하기</span></div></div>'
            +'<div class="ktadj-slot"><span class="ktadj-num">4</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><div class="ktadj-plus">+</div><span>게스트 4<br>참여하기</span></div></div>'
            +'<div class="ktadj-slot"><span class="ktadj-num">5</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><div class="ktadj-plus">+</div><span>게스트 5<br>참여하기</span></div></div>'
            +'<div class="ktadj-slot off"><span class="ktadj-num">6</span><div class="ktadj-wait"><div class="ktadj-avatar">👤</div><span>대기 (6)<br>대기 중</span></div></div>'
          +'</div>'
        +'</div>'
        +'<div class="ktadj-lower">'
          +'<div class="ktadj-chat"><div class="ktadj-tabs"><span class="on">채팅 (128)</span><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="ktadj-chatbody">'
            +'<div class="ktadj-msg"><div class="ktadj-pic">🎧</div><div class="ktadj-line"><b>★ K-Talk AI DJ · AI</b><span>안녕하세요! AI DJ 수아예요 💜<br>좋은 음악과 함께하는 즐거운 시간!<br>신청곡 많이 남겨주세요 🎵✨</span></div></div>'
            +'<div class="ktadj-msg"><div class="ktadj-pic">👤</div><div class="ktadj-line"><b style="color:#45d7ff">한수향</b><span>역시 수아 DJ 최고예요! 🥰💜</span></div></div>'
            +'<div class="ktadj-msg"><div class="ktadj-pic">🎧</div><div class="ktadj-line"><b>★ K-Talk AI DJ · AI</b><span>신청곡 남겨주시면 바로 들려드릴게요! 🎧🎵</span></div></div>'
            +'<div class="ktadj-msg"><div class="ktadj-pic">🌼</div><div class="ktadj-line"><b style="color:#ffd85a">지수</b><span>오늘도 힐링되는 목소리네요 💕</span></div></div>'
          +'</div><div class="ktadj-chatinput"><div>메시지를 입력하세요...</div><button>전송</button></div></div>'
          +'<div class="ktadj-gifts"><div class="ktadj-gifthead">🎁 선물 / 후원</div><div class="ktadj-gifttabs"><span class="on">전체</span><span>인기</span><span>스페셜</span><span>컬렉션</span></div><div class="ktadj-giftgrid">'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>🌹</i><b>1송이 장미</b></button>'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>💐</i><b>10송이 장미</b></button>'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>💐</i><b>20송이 장미</b></button>'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>💐</i><b>30송이 장미</b></button>'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>💐</i><b>40송이 장미</b></button>'
            +'<button class="ktadj-gift" onclick="if(window.openGifts)openGifts()"><i>🌹</i><b>50송이 장미</b></button>'
            +'<button class="ktadj-gift special" onclick="if(window.openGifts)openGifts()"><i>💖</i><b>하트 10개</b></button>'
            +'<button class="ktadj-gift special" onclick="if(window.openGifts)openGifts()"><i>⭐</i><b>별 20개</b></button>'
            +'<button class="ktadj-gift special" onclick="if(window.openGifts)openGifts()"><i>🎈</i><b>풍선 30개</b></button>'
            +'<button class="ktadj-gift special box" onclick="if(window.openGifts)openGifts()"><i>🎁</i><b>선물박스<br>열면 큰 선물 많아요</b></button>'
          +'</div></div>'
        +'</div>'
        +'<div class="ktadj-tools">'
          +'<button class="ktadj-tool" onclick="if(window.ktAiDjOpenRequest20260927)ktAiDjOpenRequest20260927()"><i>🎵</i><span>신청곡</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.ktAiDjVoiceSongRequest20260927)ktAiDjVoiceSongRequest20260927()"><i>🎤</i><span>말하기</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.openGifts)openGifts()"><i>🌹</i><span>장미</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.openGifts)openGifts()"><i>🎁</i><span>선물</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.openEditEffectPanel)openEditEffectPanel()"><i>✨</i><span>효과</span></button>'
          +'<button class="ktadj-tool" onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'
        +'</div>'
      +'</section>';

    return true;
  }

  window.ktRenderAiDjSixRoom20260927=render;

  var greetedGuests=window.__ktAiDjGreetedGuests20260927||{};
  window.__ktAiDjGreetedGuests20260927=greetedGuests;

  function guestNameFromEvent(e){
    var d=e&&e.detail||{};
    var vid=String(d.viewer_id||d.viewerId||d.id||'').trim();
    var name=String(d.name||d.nickname||d.display_name||'').trim();
    if(!name&&vid){
      try{
        var map=window.__ktApprovedGuestNames20260924||{};
        name=String(map[vid]||'').trim();
      }catch(_e){}
    }
    if(!name)name='게스트';
    return {id:vid||name,name:name};
  }

  function greetGuest(e){
    if(!aiSelected())return;
    var g=guestNameFromEvent(e);
    if(!g.id||greetedGuests[g.id])return;
    greetedGuests[g.id]=Date.now();

    var msg=g.name+'님, 안녕하세요. K-Talk AI DJ 방에 오신 걸 환영합니다. 만나서 반갑습니다요. 편하게 즐기시고, 듣고 싶은 노래가 있으면 말씀해 주세요.';
    try{
      if(typeof window.ktSpeak==='function')window.ktSpeak(msg);
      else if('speechSynthesis' in window){
        var u=new SpeechSynthesisUtterance(msg);
        u.lang='ko-KR';
        window.speechSynthesis.speak(u);
      }
    }catch(_e){}

    try{
      var chat=document.querySelector('.kt-ai-dj-six-room .ktadj6-chat');
      if(chat){
        var line=document.createElement('div');
        line.textContent='🤖 '+g.name+'님, 안녕하세요! 만나서 반갑습니다요 😊';
        chat.insertBefore(line,chat.querySelector('.ktadj6-chat-input')||null);
      }
    }catch(_e){}
  }

  ['kt-any-guest-approved','kt-guest-approval-received','kt-approved-guest-stream-ready']
    .forEach(function(ev){
      window.addEventListener(ev,function(e){
        setTimeout(function(){greetGuest(e);},120);
      });
    });

  function aiSelected(){
    try{
      return isAiDj() || localStorage.getItem('kt_ai_dj_selected_20260927')==='1';
    }catch(e){return isAiDj();}
  }

  function creatorPrepOpen(){
    try{
      var creator=document.getElementById('creator');
      return !!(creator&&creator.classList.contains('live-prep-open'));
    }catch(e){return false;}
  }

  function forceAiRoom(){
    if(!aiSelected()||creatorPrepOpen())return;
    var room=document.querySelector('#screen .kt-ai-dj-six-room');
    if(room)return;
    var screen=document.getElementById('screen');
    if(!screen)return;

    /* 기존 9명방/카메라/동영상 화면이 뒤늦게 덮어써도 AI DJ 전용방으로 되돌린다. */
    var liveLike=screen.querySelector('.ktg13-room,.ktg9-room,.ktsecret-room,.solo-room,video,[data-kt-room]');
    if(liveLike || (window.state&&state.ktAiDjRoom)){
      try{
        if(!window.state)window.state={};
        state.ktAiDjRoom=true;
        state.liveRoomType='group9';
        state.liveRoomName='AI DJ 음악방';
        state.liveRoomMax=6;
      }catch(e){}
      render();
    }
  }

  /* startBroadcast가 다른 스크립트에서 다시 감싸져도 끝까지 따라가도록 매번 최신 함수를 감싼다. */
  var lastWrapped=null;
  function hookLatest(){
    if(typeof window.startBroadcast!=='function')return;
    if(window.startBroadcast===lastWrapped||window.startBroadcast.__ktAiDjSixWrapped)return;
    var prev=window.startBroadcast;
    var next=async function(){
      var ai=aiSelected();
      var r=await prev.apply(this,arguments);
      if(ai){
        [20,80,180,420,800,1400].forEach(function(ms){setTimeout(forceAiRoom,ms);});
      }
      return r;
    };
    next.__ktAiDjSixWrapped=true;
    lastWrapped=next;
    window.startBroadcast=next;
  }

  hookLatest();
  [80,220,500,1000,1800,2800].forEach(function(ms){setTimeout(function(){hookLatest();forceAiRoom();},ms);});

  setInterval(function(){
    hookLatest();
    forceAiRoom();
  },350);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAiDjSixGuardTimer20260927);
      window.__ktAiDjSixGuardTimer20260927=setTimeout(forceAiRoom,35);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();