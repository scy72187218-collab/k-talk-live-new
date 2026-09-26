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
    for(var i=0;i<34;i++)s+='<i style="--d:'+(0.52+(i%7)*0.08).toFixed(2)+'s;--h:'+(10+(i*11)%30)+'px"></i>';
    return s;
  }

  function render(){
    if(!isAiDj()&&!window.__ktAiDjSixActive20260927)return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;

    var dj='';
    try{dj=window.KT_AI_DJ_PHOTO||'';}catch(e){}
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    window.__ktAiDjSixActive20260927=true;
    try{
      if(!window.state)window.state={};
      state.ktAiDjRoom=true;
      state.liveRoomType='group9';
      state.liveRoomName='AI DJ 음악방';
      state.liveRoomMax=6;
    }catch(e){}

    screen.innerHTML=''
      +'<style id="ktAiDjSixStyle20260927">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.kt-ai-dj-six-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#020205;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 6px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktadj6-head{flex:0 0 58px;border-radius:14px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:4px 8px;border:1px solid #ffffff12}'
      +'.ktadj6-left{display:flex;align-items:center;gap:6px;min-width:0}.ktadj6-back{width:32px;height:32px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:25px}.ktadj6-title{font-size:18px;font-weight:950;white-space:nowrap}.ktadj6-title i{font-style:normal;color:#ff2e67}.ktadj6-brand{justify-self:end;color:#ff3d78;font-size:17px;font-weight:950;white-space:nowrap}.ktadj6-att{justify-self:center;height:27px;min-width:82px;padding:0 5px;border-radius:18px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:9px;font-weight:950;box-shadow:0 0 8px #ff2bbd}'
      +'.ktadj6-air{flex:0 0 29px;display:flex;align-items:center;gap:7px;padding:0 7px;font-size:12px;font-weight:950}.ktadj6-air .on{color:#ff315f}.ktadj6-public{margin-left:auto;border:1px solid #53cfff88;border-radius:999px;background:#081b24;color:#8fe8ff;padding:3px 7px;font-size:8px;font-weight:950}'
      +'.ktadj6-ticker{flex:0 0 38px;display:grid;grid-template-columns:1fr 1fr;gap:4px}.ktadj6-ticker>div{border:1px solid #ff2bbd88;border-radius:10px;background:#130714;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#ffe071;box-shadow:inset 0 0 10px #ff2bbd22;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 5px}.ktadj6-ticker .song{color:#fff}.ktadj6-ticker .song b{color:#ff77d8}'
      +'.ktadj6-stage{flex:1 1 0;min-height:0;display:grid;grid-template-columns:38% 62%;gap:4px}'
      +'.ktadj6-djcard{position:relative;overflow:hidden;border-radius:10px;border:1px solid #ff3ec488;background:#120714;box-shadow:0 0 12px #ff2bbd33}.ktadj6-dj-photo{position:absolute;inset:0;background:#111 center/cover no-repeat}.ktadj6-dj-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05),transparent 45%,rgba(0,0,0,.72))}.ktadj6-dj-name{position:absolute;left:7px;top:7px;z-index:4;padding:4px 7px;border-radius:999px;background:#190d18cc;border:1px solid #ff6bd088;color:#ffe071;font-size:9px;font-weight:950}.ktadj6-dj-note{position:absolute;left:7px;right:7px;bottom:48px;z-index:4;text-align:center;font-size:8px;font-weight:900;color:#fff;text-shadow:0 1px 3px #000}.ktadj6-wave{position:absolute;left:7px;right:7px;bottom:7px;height:34px;z-index:3;display:flex;align-items:end;gap:2px;opacity:.9}.ktadj6-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;animation:ktadj6wave var(--d) ease-in-out infinite alternate}.ktadj6-wave i:nth-child(4n+2){background:#28d9ff}.ktadj6-wave i:nth-child(4n+3){background:#41e968}.ktadj6-wave i:nth-child(4n){background:#ffd43b}@keyframes ktadj6wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}'
      +'.ktadj6-guests{min-width:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px}.ktadj6-slot{position:relative;min-width:0;min-height:0;overflow:hidden;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:linear-gradient(145deg,#17171d,#09090d);display:flex;align-items:center;justify-content:center}.ktadj6-num{position:absolute;left:4px;top:4px;width:17px;height:17px;border-radius:5px;background:#ff9a16;color:#fff;display:grid;place-items:center;font-size:8px;font-weight:950}.ktadj6-wait{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#bdbdc7;font-size:8px;font-weight:850}.ktadj6-wait b{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,255,255,.25);font-size:16px;color:#fff}'
      +'.ktadj6-gifts{min-width:0;border-radius:10px;border:1px solid #ff3ec466;background:linear-gradient(180deg,#150a16,#09090d);padding:5px 4px;display:flex;flex-direction:column;gap:4px;overflow:hidden}.ktadj6-gifts h4{margin:0 0 2px;font-size:9px;color:#ffd65f;text-align:center}.ktadj6-gift{min-height:43px;border:1px solid #ffffff24;border-radius:8px;background:#131319;color:#fff;display:grid;grid-template-columns:28px 1fr;align-items:center;gap:4px;padding:3px 4px;text-align:left}.ktadj6-gift i{font-style:normal;font-size:21px;text-align:center}.ktadj6-gift b{display:block;font-size:8px;color:#fff}.ktadj6-gift small{display:block;margin-top:1px;font-size:7px;color:#ffd85a}.ktadj6-gift.big{margin-top:auto;background:linear-gradient(135deg,#251125,#3c1536);border-color:#ff57ce88}.ktadj6-gift.big i{font-size:25px}'
      +'.ktadj6-lower{flex:0 0 118px;display:grid;grid-template-columns:44% 56%;gap:4px}.ktadj6-chat{border:1px solid #ffffff20;border-radius:10px;background:#0d0d12;padding:5px;overflow:hidden}.ktadj6-chat h5{margin:0 0 4px;font-size:8px;color:#ff77d8}.ktadj6-chat div{font-size:7px;line-height:1.45;color:#ddd}.ktadj6-chat-input{margin-top:5px;height:24px;border-radius:7px;border:1px solid #ffffff22;background:#18181f;color:#aaa;font-size:7px;display:flex;align-items:center;padding:0 6px}.ktadj6-rosebar{border:1px solid #ff3ec466;border-radius:10px;background:linear-gradient(180deg,#150a16,#09090d);padding:4px;display:grid;grid-template-columns:repeat(3,1fr);gap:3px;overflow:hidden}.ktadj6-rosebar h5{grid-column:1/-1;margin:0;font-size:8px;color:#ffd65f;text-align:center}.ktadj6-rosebtn{border:1px solid #ffffff24;border-radius:7px;background:#131319;color:#fff;display:flex;align-items:center;justify-content:center;gap:2px;font-size:7px;font-weight:950}.ktadj6-rosebtn i{font-style:normal;font-size:14px}'
      +'.ktadj6-tools{flex:0 0 50px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.ktadj6-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:1px}.ktadj6-tool i{width:33px;height:33px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:15px}.ktadj6-tool span{font-size:7px;white-space:nowrap}'
      +'@media(max-width:390px){.kt-ai-dj-six-room{padding-left:3px;padding-right:3px;gap:3px}.ktadj6-head{flex-basis:54px}.ktadj6-title,.ktadj6-brand{font-size:15px}.ktadj6-stage{grid-template-columns:37% 63%;gap:3px}.ktadj6-lower{flex-basis:108px;grid-template-columns:43% 57%}.ktadj6-tools{flex-basis:46px}.ktadj6-tool i{width:30px;height:30px;font-size:14px}}'
      +'</style>'
      +'<section class="kt-ai-dj-six-room" data-kt-ai-dj="1" data-kt-room="ai-dj-6">'
        +'<div class="ktadj6-head"><div class="ktadj6-left"><button class="ktadj6-back" onclick="window.__ktAiDjSixActive20260927=false;try{localStorage.removeItem('kt_ai_dj_selected_20260927')}catch(e){};try{if(window.state)state.ktAiDjRoom=false}catch(e){};if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktadj6-title"><i>●</i> AI DJ 방</div></div><button class="ktadj6-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">출석체크</button><div class="ktadj6-brand">K-Talk LIVE</div></div>'
        +'<div class="ktadj6-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><span class="ktadj6-public">🔓 공개 · 6명</span></div>'
        +'<div class="ktadj6-ticker"><div>⭐ 출석체크 눌러주세요 ⭐</div><div class="song">🎵 <b>신청곡</b> · AI DJ에게 말해 주세요</div></div>'
        +'<div class="ktadj6-stage">'
          +'<div class="ktadj6-djcard"><div class="ktadj6-dj-photo" style="background-image:url(&quot;'+esc(dj)+'&quot;)"></div><div class="ktadj6-dj-shade"></div><span class="ktadj6-dj-name">🎧 K-Talk AI DJ</span><div class="ktadj6-dj-note">신청곡을 받아 저작권 허용 음원만 재생합니다.</div><div class="ktadj6-wave">'+bars()+'</div></div>'
          +'<div class="ktadj6-guests">'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">1</span><div class="ktadj6-wait"><b>+</b><span>게스트 1</span></div></div>'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">2</span><div class="ktadj6-wait"><b>+</b><span>게스트 2</span></div></div>'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">3</span><div class="ktadj6-wait"><b>+</b><span>게스트 3</span></div></div>'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">4</span><div class="ktadj6-wait"><b>+</b><span>게스트 4</span></div></div>'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">5</span><div class="ktadj6-wait"><b>+</b><span>게스트 5</span></div></div>'
            +'<div class="ktadj6-slot"><span class="ktadj6-num">6</span><div class="ktadj6-wait"><b>+</b><span>대기</span></div></div>'
          +'</div>'

        +'</div>'
        +'<div class="ktadj6-lower">'
          +'<div class="ktadj6-chat"><h5>채팅</h5><div>AI DJ 음악방에 오신 것을 환영합니다.</div><div>신청곡은 🎤 말하기 또는 신청곡 버튼을 이용하세요.</div><div class="ktadj6-chat-input">메시지를 입력하세요…</div></div>'
          +'<div class="ktadj6-rosebar"><h5>🌹 장미 선물</h5>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>1송</button>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>10송</button>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>20송</button>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>30송</button>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>40송</button>'
            +'<button class="ktadj6-rosebtn" onclick="if(window.openGifts)openGifts()"><i>🌹</i>50송</button>'
          +'</div>'
        +'</div>'
        +'<div class="ktadj6-tools">'
          +'<button class="ktadj6-tool" onclick="if(window.ktAiDjOpenRequest20260927)ktAiDjOpenRequest20260927()"><i>🎵</i><span>신청곡</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.ktAiDjVoiceSongRequest20260927)ktAiDjVoiceSongRequest20260927()"><i>🎤</i><span>말하기</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openGifts)openGifts()"><i>🌹</i><span>장미</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openGifts)openGifts()"><i>🎁</i><span>선물</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openEditEffectPanel)openEditEffectPanel()"><i>✨</i><span>효과</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'
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
    /* 방송 시작을 누른 뒤에는 creator에 준비 클래스가 잠깐 남아 있어도
       검은 화면으로 두지 말고 DJ 전용방을 바로 그린다. */
    if(creatorPrepOpen()&&!window.__ktAiDjSixActive20260927)return;
    if(!window.__ktAiDjSixActive20260927&&!aiSelected())return;
    var room=document.querySelector('#screen .kt-ai-dj-six-room');
    if(room)return;
    var screen=document.getElementById('screen');
    if(!screen)return;

    /* 방송 중 예전 9명방·동영상·빈 화면이 잠깐 올라와도 새 DJ 전용방 하나만 유지한다. */
    try{
      window.__ktAiDjSixActive20260927=true;
      if(!window.state)window.state={};
      state.ktAiDjRoom=true;
      state.liveRoomType='group9';
      state.liveRoomName='AI DJ 음악방';
      state.liveRoomMax=6;
    }catch(e){}
    render();
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
        window.__ktAiDjSixActive20260927=true;
        [0,20,80,180,420,800,1400,2400].forEach(function(ms){setTimeout(forceAiRoom,ms);});
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