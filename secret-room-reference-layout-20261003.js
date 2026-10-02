/* K-Talk secret room final reference layout - 2026-10-03
   Secret room only. No password prompt. No gift prices. */
(function(){
  if(window.__ktSecretReferenceLayout20261003)return;
  window.__ktSecretReferenceLayout20261003=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function isSecret(){
    try{
      var st=window.state||{};
      var t=String(st.liveRoomType||st.roomType||'').toLowerCase();
      var n=String(st.liveRoomName||st.roomName||'');
      if(t==='password'||t==='secret'||n.indexOf('비밀')>-1)return true;
      var s=document.getElementById('screen');
      var txt=String(s&&s.textContent||'');
      return txt.indexOf('비밀방')>-1 && (txt.indexOf('ON AIR')>-1 || txt.indexOf('방송')>-1);
    }catch(e){return false;}
  }
  function gift(icon,label,img){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<span class="ktsr-emoji">'+icon+'</span>';
    return '<button class="ktsr-gift" type="button" onclick="if(window.openGifts)openGifts()">'+art+'<span>'+esc(label)+'</span></button>';
  }
  function guestSlots(){
    var s='';
    for(var i=0;i<5;i++)s+='<div class="ktsecret-slot"><div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div></div>';
    return s;
  }
  function currentText(sel,def){
    try{var e=document.querySelector(sel);return String(e&&e.textContent||def);}catch(e){return def;}
  }
  function render(){
    if(!isSecret())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;

    try{
      var oldVideo=document.getElementById('ktLiveVideo');
      var keepStream=(oldVideo&&oldVideo.srcObject)||(window.state&&state.stream)||null;
      var clock=currentText('#ktLiveClock','00:00:00');
      var viewers=currentText('.ktsecret-viewers,.ktg13-viewers,.ktsubscriber-viewers','시청자 0명 시청중 🏃');
      if(viewers.indexOf('시청자')<0)viewers='시청자 0명 시청중 🏃';
      var net=currentText('#hudEarnNet','0원');
      var roses=currentText('#hudEarnRoses','🌹 0송이');

      screen.innerHTML='<style id="ktSecretReferenceStyle20261003">'+
      '#screen{padding:0!important;margin:0!important;width:100%!important;height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'+
      '.ktsr-room{width:100%;height:100dvh;display:flex;flex-direction:column;gap:4px;padding:4px 7px calc(5px + env(safe-area-inset-bottom));box-sizing:border-box;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'+
      '.ktsr-head{flex:0 0 64px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px}.ktsr-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsr-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px}.ktsr-title{font-size:20px;font-weight:950;white-space:nowrap}.ktsr-title i{font-style:normal;color:#ff2e67}.ktsr-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}.ktsr-att{justify-self:center;min-width:116px;height:38px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:15px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 16px #ff2bbd55}'+
      '.ktsr-air{flex:0 0 36px;display:flex;align-items:center;gap:9px;padding:0 8px;font-size:14px;font-weight:950}.ktsr-air .on{color:#ff315f}.ktsr-invite{margin-left:auto;border:1px solid #d7ad39;border-radius:999px;background:#17140be8;color:#ffe071;padding:6px 12px;font-weight:950}'+
      '.ktsr-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsr-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktsrMarquee 12s linear infinite;font-size:24px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsr-led-track span{display:inline-block;padding-right:80px}.ktsr-led-track b{color:#ff59c9}@keyframes ktsrMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'+
      '.ktsr-stats,.ktsr-quick{display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:5px}.ktsr-stats{flex:0 0 42px}.ktsr-quick{flex:0 0 42px}.ktsr-stats button,.ktsr-stats div,.ktsr-quick button{border:0;border-radius:13px;background:#111114;color:#fff;font-size:12px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}'+
      '.ktsr-main{flex:1 1 0;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);grid-template-rows:minmax(0,1fr) 205px;gap:5px}.ktsr-stage{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:5px}.ktsr-host{position:relative;min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;overflow:hidden;background:#111}.ktsr-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#111}.ktsr-host-badge{position:absolute;left:8px;top:8px;z-index:3;padding:3px 8px;border-radius:999px;background:#221f2ae8;border:1px solid #d7ad39;color:#fff;font-size:9px;font-weight:950}'+
      '.ktsr-guests{min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;border:2px solid #ff28c4;border-radius:10px;padding:4px;background:#09090c}.ktsecret-slot{position:relative;min-width:0;min-height:0;display:grid;place-items:center;border:1px solid #4a4a55;border-radius:8px;background:linear-gradient(145deg,#15151a,#09090c);overflow:hidden}.ktsecret-slot video,.ktsecret-slot .ktsecret-guest-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ktsecret-guest-wait{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#ddd;font-size:10px;font-weight:900}.ktsecret-guest-wait b{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid #777;font-size:24px}'+
      '.ktsr-earn{display:flex;align-items:center;justify-content:center;border:1px solid #d2a936;border-radius:10px;background:linear-gradient(135deg,#17140be8,#0d0d12e8);padding:3px 4px;color:#fff;text-align:center;overflow:hidden}.ktsr-earn span{font-size:7px;color:#8fe8ff;font-weight:950}.ktsr-earn b{font-size:9px;color:#ffe071}.ktsr-earn small{font-size:6.5px;color:#ddd}'+
      '.ktsr-chatbox,.ktsr-giftbox{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden}.ktsr-panelhead{height:34px;display:flex;align-items:center;gap:12px;padding:0 10px;border-bottom:1px solid #ff28c477;font-size:11px;font-weight:950}.ktsr-panelhead b{color:#ff45cf}.ktsr-chatbox{display:flex;flex-direction:column}.ktsr-chat{flex:1 1 0;overflow:hidden;padding:6px 8px;font-size:10px}.ktsr-chatinput{height:40px;margin:4px 6px 6px;border:1px solid #3d5270;border-radius:8px;display:flex;align-items:center;padding:0 9px;color:#9ab1ce;font-size:10px}.ktsr-giftbox{display:flex;flex-direction:column}.ktsr-gifts{flex:1 1 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:5px}.ktsr-gift{min-width:0;border:1px solid #d5a80e;border-radius:7px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;overflow:hidden}.ktsr-gift img{width:40px;height:31px;object-fit:contain}.ktsr-emoji{font-size:24px;line-height:1}.ktsr-gift span{font-size:8px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}'+
      '.ktsr-tools{flex:0 0 52px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;align-items:start}.ktsr-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktsr-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:17px}.ktsr-tool span{font-size:8px;white-space:nowrap}'+
      '@media(max-width:390px){.ktsr-room{padding-left:4px;padding-right:4px;gap:3px}.ktsr-head{flex-basis:58px;padding:4px 7px}.ktsr-title,.ktsr-brand{font-size:17px}.ktsr-att{min-width:95px;height:34px;font-size:13px}.ktsr-led{flex-basis:50px}.ktsr-led-track{font-size:20px}.ktsr-main{grid-template-rows:minmax(0,1fr) 195px}.ktsr-tools{flex-basis:48px}.ktsr-tool i{width:31px;height:31px;font-size:15px}.ktsr-tool span{font-size:7px}}'+
      '</style>'+
      '<section class="ktsr-room ktsecret-room">'+
        '<div class="ktsr-head"><div class="ktsr-left"><button class="ktsr-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsr-title"><i>●</i> 비밀방</div></div><button class="ktsr-att" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()">🪽 출석체크 🪽</button><div class="ktsr-brand">K-Talk LIVE</div></div>'+
        '<div class="ktsr-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><button class="ktsr-invite" onclick="if(window.ktOpenSecretInvite20260928)ktOpenSecretInvite20260928();else if(window.shareApp)shareApp()">👥 초청</button></div>'+
        '<div class="ktsr-led"><div class="ktsr-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
        '<div class="ktsr-stats"><button>🔥 일일 랭킹</button><button>🎯 미션</button><div class="ktsecret-viewers">'+esc(viewers)+'</div></div>'+
        '<div class="ktsr-quick"><button onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()">↻ 되돌리기</button><button onclick="if(window.ktRenderTreasure)ktRenderTreasure()">🎁 보물상자</button><button>⚔ 매치</button></div>'+
        '<div class="ktsr-main">'+
          '<div class="ktsr-stage">'+
            '<div class="ktsr-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="ktsr-host-badge">🌹1000</span></div>'+
            '<div class="ktsr-guests">'+guestSlots()+'<div class="ktsr-earn"><div><span>🔒 내 수익 </span><b id="hudEarnNet">'+esc(net)+'</b><br><small id="hudEarnRoses">'+esc(roses)+'</small> <small>일반회원 · 35%</small></div></div></div>'+
          '</div>'+
          '<div class="ktsr-chatbox"><div class="ktsr-panelhead"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div id="ktsecretChatList" class="ktsr-chat"></div><div class="ktsr-chatinput" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">메시지를 입력하세요...</div></div>'+
          '<div class="ktsr-giftbox"><div class="ktsr-panelhead"><b>🎁 선물 / 후원</b><span style="margin-left:auto">후원 랭킹 ›</span></div><div class="ktsr-gifts">'+
             gift('','장미','rose-single.svg')+gift('','장미다발','rose-bouquet-50.svg')+gift('','특대장미','rose-bouquet-100.svg')+
             gift('💗','하트','')+gift('⭐','별','')+gift('🎈','풍선','')+
             gift('👑','황금 왕관','')+gift('🏰','스페셜 선물','')+gift('🎁','비밀 선물','')+
          '</div></div>'+
        '</div>'+
        '<div class="ktsr-tools">'+
          '<button class="ktsr-tool" onclick="return window.ktBottomCameraToggle?ktBottomCameraToggle(this):false"><i>📷</i><span>카메라</span></button>'+
          '<button class="ktsr-tool" onclick="return window.ktBottomMicToggle?ktBottomMicToggle(this):false"><i>🎤</i><span>마이크</span></button>'+
          '<button class="ktsr-tool" onclick="if(window.shareApp)shareApp()"><i>👥</i><span>친구</span></button>'+
          '<button class="ktsr-tool" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button>'+
          '<button class="ktsr-tool" onclick="return window.ktBottomMovieOpen?ktBottomMovieOpen():false"><i>🎬</i><span>영화</span></button>'+
          '<button class="ktsr-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'+
          '<button class="ktsr-tool" onclick="if(window.ktSecretEffect)ktSecretEffect();else if(window.openEditEffectPanel)openEditEffectPanel()"><i>🪄</i><span>효과</span></button>'+
          '<button class="ktsr-tool" onclick="if(window.ktSecretMore)ktSecretMore();else if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'+
        '</div>'+
      '</section>';

      var v=document.getElementById('ktLiveVideo');
      if(v&&keepStream){v.srcObject=keepStream;try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
      try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
      try{if(window.state){state.liveRoomPassword='';state.roomPassword='';}}catch(e){}
      try{var box=document.getElementById('ktSecretPasswordBox');if(box)box.remove();}catch(e){}
      try{if(window.ktForceApprovedGuestGridNow20260924)window.ktForceApprovedGuestGridNow20260924();}catch(e){}
      return true;
    }catch(e){return false;}
  }

  window.ktRenderSecretReference20261003=render;

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var secret=isSecret();
      if(secret){
        try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
        try{if(window.state){state.liveRoomPassword='';state.roomPassword='';}}catch(e){}
        try{var box=document.getElementById('ktSecretPasswordBox');if(box)box.remove();}catch(e){}
      }
      var out=await oldStart.apply(this,arguments);
      if(secret){
        setTimeout(render,40);
        setTimeout(render,220);
      }
      return out;
    };
  }

  function enforceSecretReference(){
    if(!isSecret())return;
    var s=document.getElementById('screen');
    if(!s)return;
    if(s.querySelector('.ktsr-room'))return;
    var txt=String(s.textContent||'');
    if(txt.indexOf('비밀방')>-1)render();
  }

  window.addEventListener('kt-room-opened',function(){setTimeout(enforceSecretReference,40);});
  window.addEventListener('pageshow',function(){setTimeout(enforceSecretReference,60);});
  window.addEventListener('focus',function(){setTimeout(enforceSecretReference,60);});

  new MutationObserver(function(){
    clearTimeout(window.__ktSecretReferenceEnforceTimer20261003);
    window.__ktSecretReferenceEnforceTimer20261003=setTimeout(enforceSecretReference,25);
  }).observe(document.documentElement,{childList:true,subtree:true});

  [80,220,500,900,1500,2500].forEach(function(ms){setTimeout(enforceSecretReference,ms);});
  setInterval(enforceSecretReference,700);
})();