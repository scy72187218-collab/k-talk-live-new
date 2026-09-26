/* K-Talk AI DJ clean rebuild - dedicated room only */
(function(){
  if(window.__ktAiDjCleanRoomV2Loaded20260927)return;
  window.__ktAiDjCleanRoomV2Loaded20260927=true;

  var KEY='kt_ai_dj_clean_selected_20260927';
  var active=false;
  var greeted={};

  function selected(){try{return localStorage.getItem(KEY)==='1';}catch(e){return false;}}
  function setSelected(on){
    try{on?localStorage.setItem(KEY,'1'):localStorage.removeItem(KEY);}catch(e){}
    try{
      if(!window.state)window.state={};
      state.ktAiDjRoom=!!on;
      if(on){
        state.liveRoomType='group9';
        state.liveRoomName='AI DJ 음악방';
        state.liveRoomMax=6;
        state.prepRoomType='group9';
        state.prepRoomName='AI DJ 음악방';
        state.prepRoomMax=6;
        state.roomType='group9';
      }
    }catch(e){}
  }

  function selectAiDj(btn){
    document.querySelectorAll('.live-prep .room-switch,.live-prep .kt-ai-dj-room-button,.live-prep .kt-ai-dj-clean-pick')
      .forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false');});
    if(btn){btn.classList.add('on');btn.setAttribute('aria-pressed','true');}
    setSelected(true);
    var t=document.getElementById('liveTitle');if(t)t.value='AI DJ 음악방';
  }
  window.ktSelectAiDjClean20260927=function(btn){selectAiDj(btn||document.getElementById('ktAiDjVisiblePrepButton20260927'));};

  function ensureButton(){
    var b=document.getElementById('ktAiDjVisiblePrepButton20260927');
    if(!b){
      var row=document.querySelector('.live-prep .room-switch-row');
      if(!row)return;
      b=document.createElement('button');
      b.type='button';b.id='ktAiDjVisiblePrepButton20260927';b.className='kt-ai-dj-room-button';b.textContent='🎧 AI DJ';
      row.appendChild(b);
    }
    if(!b.__ktCleanBound){
      b.__ktCleanBound=true;
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();}catch(_e){}
        selectAiDj(b);
        return false;
      };
      b.onpointerup=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        selectAiDj(b);
      };
    }
    b.disabled=false;b.removeAttribute('disabled');b.style.pointerEvents='auto';
    b.classList.toggle('on',selected());
    b.setAttribute('aria-pressed',selected()?'true':'false');

    if(!document.getElementById('ktAiDjCleanPickStyle')){
      var s=document.createElement('style');s.id='ktAiDjCleanPickStyle';
      s.textContent=''
        +'.kt-ai-dj-room-button{min-height:48px!important;border:1px solid #3a3a42!important;border-radius:16px!important;background:#1b1b20!important;color:#fff!important;font-weight:900!important;position:relative!important;pointer-events:auto!important}'
        +'.kt-ai-dj-room-button.on{background:linear-gradient(135deg,#ff2f8c,#8a4cff)!important;outline:2px solid #ff62d0!important;box-shadow:0 0 14px #ff3fb177!important}'
        +'.kt-ai-dj-room-button.on:after{content:"";position:absolute;right:8px;top:7px;width:9px;height:9px;border-radius:50%;background:#ff2424;box-shadow:0 0 9px #ff2424}';
      document.head.appendChild(s);
    }
  }

  document.addEventListener('click',function(e){
    var x=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(!x)return;
    setSelected(false);
    var b=document.getElementById('ktAiDjVisiblePrepButton20260927');
    if(b){b.classList.remove('on');b.setAttribute('aria-pressed','false');}
  },true);

  function bars(){var s='';for(var i=0;i<30;i++)s+='<i></i>';return s;}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}

  function requestSong(){
    var title=prompt('신청곡 제목을 입력해 주세요.\n저작권 허용 음원만 재생합니다.','');
    if(!title)return;
    try{
      var a=JSON.parse(localStorage.getItem('kt_ai_dj_song_requests_20260927')||'[]');
      a.push({text:String(title).trim(),at:Date.now(),via:'text'});
      localStorage.setItem('kt_ai_dj_song_requests_20260927',JSON.stringify(a.slice(-100)));
    }catch(e){}
    try{if(window.ktSpeak)window.ktSpeak(String(title)+' 신청곡으로 접수했습니다.');}catch(e){}
  }
  window.ktAiDjOpenRequest20260927=requestSong;

  window.ktAiDjVoiceSongRequest20260927=function(){
    var Ctor=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Ctor){requestSong();return;}
    var r=new Ctor();r.lang='ko-KR';r.interimResults=false;r.continuous=false;
    r.onstart=function(){try{if(window.ktSpeak)window.ktSpeak('노래 제목을 말씀해 주세요.');}catch(e){}};
    r.onresult=function(ev){
      var t='';try{t=String(ev.results[0][0].transcript||'').trim();}catch(e){}
      if(!t)return;
      try{
        var a=JSON.parse(localStorage.getItem('kt_ai_dj_song_requests_20260927')||'[]');
        a.push({text:t,at:Date.now(),via:'voice'});
        localStorage.setItem('kt_ai_dj_song_requests_20260927',JSON.stringify(a.slice(-100)));
      }catch(e){}
      try{if(window.ktSpeak)window.ktSpeak(t+' 신청곡으로 접수했습니다.');}catch(e){}
    };
    r.onerror=function(){requestSong();};
    try{r.start();}catch(e){requestSong();}
  };

  function giftButton(icon,label,kind){
    return '<button class="ktdj-gift '+(kind||'')+'" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><b>'+label+'</b></button>';
  }

  function render(){
    if(!active)return;
    var screen=document.getElementById('screen');if(!screen)return;
    var dj='';try{dj=window.KT_AI_DJ_PHOTO||'';}catch(e){}

    screen.innerHTML=''
      +'<style id="ktDjCleanRoomStyle">'
      +'#screen{padding:0!important;margin:0!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#030306!important}.bottom{display:none!important}'
      +'.ktdj{height:100dvh;display:flex;flex-direction:column;gap:5px;padding:5px 7px calc(6px + env(safe-area-inset-bottom));background:radial-gradient(circle at 25% 13%,#250027 0,transparent 24%),radial-gradient(circle at 78% 22%,#120031 0,transparent 22%),#030306;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'.ktdj-head{flex:0 0 52px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;border:1px solid #ff3acb66;border-radius:15px;background:#0c0c12;box-shadow:0 0 15px #ff33c522;padding:0 8px}.ktdj-head .left{display:flex;align-items:center;gap:7px}.ktdj-back{width:31px;height:31px;border-radius:50%;border:1px solid #ffffff28;background:#121218;color:#fff;font-size:23px}.ktdj-head b{font-size:15px;white-space:nowrap}.ktdj-check{justify-self:center;padding:6px 14px;border-radius:999px;border:2px solid #ff3acb;background:#170518;color:#ffe66d;font-size:10px;font-weight:950;box-shadow:0 0 13px #ff3acb88}.ktdj-brand{justify-self:end;color:#ff4f8b;font-size:16px;font-weight:950;white-space:nowrap}'
      +'.ktdj-live{flex:0 0 29px;display:flex;align-items:center;gap:8px;font-size:11px;font-weight:900;padding:0 3px}.ktdj-live .on{color:#ff315f}.ktdj-live .count{padding:4px 9px;border-radius:999px;border:1px solid #ff4ecb55;background:#120714}.ktdj-live .pub{margin-left:auto;color:#8fe8ff;border:1px solid #53cfff66;border-radius:999px;padding:4px 8px;background:#07151d}'
      +'.ktdj-banners{flex:0 0 42px;display:grid;grid-template-columns:1fr 1fr;gap:5px}.ktdj-banners button{border:1px solid #ff38cb99;border-radius:10px;background:#140814;color:#ffe56b;font-size:9px;font-weight:950;box-shadow:0 0 10px #ff35cf22}.ktdj-banners button:last-child{color:#fff}'
      +'.ktdj-main{flex:1 1 0;min-height:0;display:grid;grid-template-columns:52% 48%;gap:5px}.ktdj-dj{position:relative;overflow:hidden;border:2px solid #ff3fc3;border-radius:12px;background:#100612;box-shadow:0 0 14px #ff39c744}.ktdj-photo{position:absolute;inset:0;background:#111 center/cover no-repeat}.ktdj-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.02) 50%,rgba(0,0,0,.68))}.ktdj-name{position:absolute;left:7px;top:7px;padding:4px 8px;border-radius:999px;background:#180817dd;border:1px solid #ff61d088;color:#ffe66c;font-size:8px;font-weight:950}.ktdj-note{position:absolute;left:8px;right:8px;bottom:42px;text-align:center;font-size:7px;font-weight:900;color:#fff;text-shadow:0 1px 4px #000}.ktdj-wave{position:absolute;left:7px;right:7px;bottom:7px;height:29px;display:flex;align-items:end;gap:2px}.ktdj-wave i{flex:1;height:17px;border-radius:3px;background:#ff3dc7;animation:ktdjw .72s ease-in-out infinite alternate}.ktdj-wave i:nth-child(4n+2){height:28px;background:#23ddff}.ktdj-wave i:nth-child(4n+3){height:12px;background:#54ec63}.ktdj-wave i:nth-child(4n){height:22px;background:#ffd93e}@keyframes ktdjw{from{transform:scaleY(.35)}to{transform:scaleY(1)}}'
      +'.ktdj-guests{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:5px}.ktdj-slot{position:relative;overflow:hidden;border:1px solid #ffffff27;border-radius:10px;background:linear-gradient(145deg,#17171d,#0a0a0e);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#cfcfd7}.ktdj-num{position:absolute;left:5px;top:5px;width:19px;height:19px;border-radius:6px;background:#ff991c;color:#fff;display:grid;place-items:center;font-size:9px;font-weight:950}.ktdj-avatar{width:31px;height:31px;border-radius:50%;border:1px solid #777b8f;display:grid;place-items:center;font-size:17px;color:#9ca0b3}.ktdj-plus{width:25px;height:25px;border-radius:50%;border:2px solid #ff48cf;display:grid;place-items:center;color:#fff;font-size:18px;box-shadow:0 0 8px #ff48cf77}.ktdj-slot small{font-size:8px;font-weight:900}.ktdj-slot.wait .ktdj-plus{border-color:#666;color:#777;box-shadow:none}'
      +'.ktdj-lower{flex:0 0 174px;display:grid;grid-template-columns:52% 48%;gap:5px}.ktdj-chat,.ktdj-gifts{border:1px solid #ff40c755;border-radius:11px;background:#0b0b10;padding:6px;overflow:hidden}.ktdj-tabs{display:flex;gap:9px;align-items:center;margin-bottom:5px;color:#bbb;font-size:8px}.ktdj-tabs b{color:#ff6fdb}.ktdj-msg{font-size:7px;line-height:1.45;color:#ddd;margin:3px 0}.ktdj-msg.ai{padding:5px;border-radius:7px;background:#151523;color:#fff}.ktdj-input{margin-top:6px;height:28px;border:1px solid #ffffff25;border-radius:8px;background:#18181f;color:#999;font-size:7px;display:flex;align-items:center;padding:0 7px}.ktdj-gifts{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:auto repeat(3,1fr);gap:4px}.ktdj-gifts h5{grid-column:1/-1;margin:0;text-align:center;color:#ffe270;font-size:8px}.ktdj-gift{border:1px solid #ffffff25;border-radius:8px;background:linear-gradient(145deg,#15151c,#0c0c11);color:#fff;display:grid;place-items:center;padding:2px;font-size:7px;font-weight:900}.ktdj-gift i{font-style:normal;font-size:18px;filter:drop-shadow(0 0 4px rgba(255,76,196,.45))}.ktdj-gift b{font-size:7px}'
      +'.ktdj-tools{flex:0 0 51px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.ktdj-tools button{border:0;background:none;color:#fff;font-size:7px;font-weight:900;min-width:0}.ktdj-tools i{display:block;margin:auto;width:31px;height:31px;border-radius:50%;background:linear-gradient(145deg,#17171d,#09090d);border:1px solid #454654;font-style:normal;font-size:15px;line-height:31px;box-shadow:0 0 9px #000}'
      +'@media(max-width:390px){.ktdj{padding-left:4px;padding-right:4px}.ktdj-main,.ktdj-lower{grid-template-columns:50% 50%}.ktdj-brand{font-size:14px}.ktdj-check{padding:5px 10px}.ktdj-lower{flex-basis:166px}.ktdj-gift{font-size:6px}.ktdj-gift i{font-size:16px}.ktdj-tools i{width:29px;height:29px;line-height:29px}}'
      +'</style>'
      +'<section class="ktdj" data-kt-room="ai-dj-clean">'
        +'<div class="ktdj-head"><div class="left"><button class="ktdj-back" onclick="ktAiDjCleanLeave20260927()">‹</button><b>🎧 AI DJ 방</b></div><button class="ktdj-check" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">♡ 출석체크 ♡</button><span class="ktdj-brand">K-Talk LIVE</span></div>'
        +'<div class="ktdj-live"><span class="on">● ON AIR</span><span class="count">💗 0</span><span class="pub">🔓 공개 · 6명</span></div>'
        +'<div class="ktdj-banners"><button onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">★ 출석체크 눌러주세요 ★</button><button onclick="ktAiDjVoiceSongRequest20260927()">🎵 신청곡 : AI DJ에게 말해 주세요 🎤</button></div>'
        +'<div class="ktdj-main">'
          +'<div class="ktdj-dj"><div class="ktdj-photo" style="background-image:url(&quot;'+esc(dj)+'&quot;)"></div><div class="ktdj-shade"></div><span class="ktdj-name">K-Talk AI DJ</span><div class="ktdj-note">오늘도 좋은 음악과 함께해요 ♡</div><div class="ktdj-wave">'+bars()+'</div></div>'
          +'<div class="ktdj-guests">'
            +'<div class="ktdj-slot"><span class="ktdj-num">1</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">＋</div><small>게스트 1</small></div>'
            +'<div class="ktdj-slot"><span class="ktdj-num">2</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">＋</div><small>게스트 2</small></div>'
            +'<div class="ktdj-slot"><span class="ktdj-num">3</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">＋</div><small>게스트 3</small></div>'
            +'<div class="ktdj-slot"><span class="ktdj-num">4</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">＋</div><small>게스트 4</small></div>'
            +'<div class="ktdj-slot"><span class="ktdj-num">5</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">＋</div><small>게스트 5</small></div>'
            +'<div class="ktdj-slot wait"><span class="ktdj-num">6</span><div class="ktdj-avatar">👤</div><div class="ktdj-plus">·</div><small>대기</small></div>'
          +'</div>'
        +'</div>'
        +'<div class="ktdj-lower">'
          +'<div class="ktdj-chat"><div class="ktdj-tabs"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="ktdj-msg ai">🤖 AI DJ 음악방에 오신 것을 환영합니다.<br>신청곡은 말하기 또는 신청곡 버튼을 이용하세요.</div><div class="ktdj-msg">💬 닉네임을 읽고 친근하게 인사해 드립니다.</div><div class="ktdj-input">메시지를 입력하세요…</div></div>'
          +'<div class="ktdj-gifts"><h5>🎁 선물 / 후원</h5>'
            +giftButton('🌹','1송','rose')+giftButton('💐','10송','rose')+giftButton('💐','20송','rose')+giftButton('🌹','30송','rose')+giftButton('🌺','40송','rose')+giftButton('💐','50송','rose')
            +giftButton('💗','하트','extra')+giftButton('⭐','별','extra')+giftButton('🎈','풍선','extra')+giftButton('🎁','선물상자','extra')
          +'</div>'
        +'</div>'
        +'<div class="ktdj-tools">'
          +'<button onclick="ktAiDjOpenRequest20260927()"><i>🎵</i>신청곡</button><button onclick="ktAiDjVoiceSongRequest20260927()"><i>🎤</i>말하기</button><button onclick="if(window.openGifts)openGifts()"><i>🌹</i>장미</button><button onclick="if(window.openGifts)openGifts()"><i>🎁</i>선물</button><button onclick="if(window.shareApp)shareApp()"><i>↗</i>공유</button><button onclick="if(window.openEditEffectPanel)openEditEffectPanel()"><i>✨</i>효과</button><button onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i>더보기</button>'
        +'</div>'
      +'</section>';
  }

  window.ktAiDjCleanLeave20260927=function(){
    active=false;setSelected(false);
    try{if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard();}catch(e){}
  };

  function guestInfo(e){
    var d=e&&e.detail||{};
    var id=String(d.viewer_id||d.viewerId||'').trim();
    var name=String(d.name||d.nickname||d.display_name||'').trim();
    if(!name&&id)try{name=String((window.__ktApprovedGuestNames20260924||{})[id]||'').trim();}catch(_e){}
    if(!name)name='게스트';
    return {id:id||name,name:name};
  }
  function greet(e){
    if(!active)return;
    var g=guestInfo(e);if(greeted[g.id])return;greeted[g.id]=1;
    var msg=g.name+'님, 안녕하세요. K-Talk AI DJ 방에 오신 걸 환영합니다. 만나서 반갑습니다요. 편하게 즐기시고, 듣고 싶은 노래가 있으면 말씀해 주세요.';
    try{if(window.ktSpeak)window.ktSpeak(msg);}catch(_e){}
    try{
      var chat=document.querySelector('.ktdj-chat');
      if(chat){
        var line=document.createElement('div');line.className='ktdj-msg ai';
        line.textContent='🤖 '+g.name+'님, 안녕하세요! 만나서 반갑습니다요 😊';
        chat.insertBefore(line,chat.querySelector('.ktdj-input'));
      }
    }catch(_e){}
  }
  ['kt-any-guest-approved','kt-guest-approval-received','kt-approved-guest-stream-ready'].forEach(function(n){window.addEventListener(n,greet);});

  function hookStart(){
    if(typeof window.startBroadcast!=='function'||window.startBroadcast.__ktAiDjCleanV2Wrapped)return;
    var prev=window.startBroadcast;
    var fn=function(){
      var ai=selected();
      if(!ai)return prev.apply(this,arguments);

      active=true;setSelected(true);
      render();

      /* 기존 방송 초기화는 뒤에서 계속 돌리되 화면은 새 DJ방 하나로 고정 */
      var out;
      try{out=prev.apply(this,arguments);}catch(e){out=null;}
      Promise.resolve(out).catch(function(){}).finally(function(){if(active)render();});
      [30,100,250,500,900,1500,2400].forEach(function(ms){setTimeout(function(){if(active&&!document.querySelector('#screen .ktdj'))render();},ms);});
      return out;
    };
    fn.__ktAiDjCleanV2Wrapped=true;
    window.startBroadcast=fn;
  }

  try{
    new MutationObserver(function(){
      if(active&&!document.querySelector('#screen .ktdj')){
        clearTimeout(window.__ktDjCleanGuard);
        window.__ktDjCleanGuard=setTimeout(render,25);
      }
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  function tick(){ensureButton();hookStart();}
  tick();[80,200,450,900,1600,2600].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(tick,700);
})();