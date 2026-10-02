/* K-Talk secret room HARD reference final - 1111
   Secret room only. No password UI. No gift prices. */
(function(){
  if(window.__ktSecretHardReference1111)return;
  window.__ktSecretHardReference1111=true;

  function isSecret(){
    try{
      var st=window.state||{};
      var t=String(st.liveRoomType||st.roomType||'').toLowerCase();
      var n=String(st.liveRoomName||st.roomName||'');
      var s=document.getElementById('screen');
      var txt=String(s&&s.textContent||'');
      return t==='password'||t==='secret'||n.indexOf('비밀')>-1||txt.indexOf('비밀방')>-1;
    }catch(e){return false;}
  }

  function clearPassword(){
    try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
    try{localStorage.removeItem('kt_secret_password');}catch(e){}
    try{
      if(window.state){
        state.liveRoomPassword='';
        state.roomPassword='';
        if(String(state.liveRoomType||'').toLowerCase()==='password')state.liveRoomType='secret';
      }
    }catch(e){}
    try{
      document.querySelectorAll('#ktSecretPasswordBox,#ktSecretPasswordRow,#ktSecretPassword,#ktSecretPasswordSave,#ktSecretPasswordHelp,#ktSecretPasswordError,[data-secret-password]').forEach(function(x){x.remove();});
    }catch(e){}
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function collectStreams(){
    var out=[];
    function add(s){
      try{
        if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t&&t.readyState==='live';})&&out.indexOf(s)<0)out.push(s);
      }catch(e){}
    }
    try{document.querySelectorAll('#screen video').forEach(function(v){add(v.srcObject);});}catch(e){}
    try{add(window.state&&window.state.stream);}catch(e){}
    try{add(window.__ktRemoteHostStream);}catch(e){}
    try{add(window.__ktLastApprovedGuestHostStream);}catch(e){}
    try{add(window.__ktApprovedGuestSelfStream);}catch(e){}
    try{add(window.__ktLocalGuestCameraStream20260926);}catch(e){}
    return out;
  }

  function attach(v,s){
    if(!v||!s)return;
    try{
      v.srcObject=s;
      v.muted=true;
      v.playsInline=true;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function gift(icon,name){
    return '<button class="kh-gift" type="button" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><b>'+esc(name)+'</b></button>';
  }

  function guestSlots(){
    var s='';
    for(var i=0;i<5;i++){
      s+='<div class="kh-guest"><video autoplay playsinline muted></video><div class="kh-guest-empty"><strong>+</strong><span>게스트</span></div></div>';
    }
    return s;
  }

  function render(){
    if(!isSecret())return false;
    clearPassword();

    var screen=document.getElementById('screen');
    if(!screen)return false;
    if(screen.querySelector('.kh-secret-final')){
      clearPassword();
      return true;
    }

    var streams=collectStreams();
    var oldClock='00:00:00';
    try{oldClock=String((document.getElementById('ktLiveClock')||{}).textContent||oldClock);}catch(e){}
    var viewers='시청자 0명 시청중 🏃';
    try{
      var vtxt=String((document.querySelector('.ktsecret-viewers,.ktg13-viewers,.ktsubscriber-viewers')||{}).textContent||'');
      if(vtxt.indexOf('시청자')>-1)viewers=vtxt;
    }catch(e){}
    var heart='109';
    try{
      var h=String((document.querySelector('.heart-count,.ktsecret-heart,.ktsubscriber-heart')||{}).textContent||'');
      var m=h.match(/\d+/);if(m)heart=m[0];
    }catch(e){}

    screen.innerHTML=
    '<style id="khSecretFinalStyle">'+
    '#screen{padding:0!important;margin:0!important;width:100%!important;height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'+
    '.kh-secret-final{width:100%;height:100dvh;box-sizing:border-box;padding:4px 7px calc(5px + env(safe-area-inset-bottom));display:grid;grid-template-rows:60px 36px 56px 42px 42px minmax(0,1fr) 210px 52px;gap:4px;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'+
    '.kh-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10)}.kh-left{display:flex;align-items:center;gap:6px}.kh-back{width:32px;height:32px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:25px}.kh-title{font-size:18px;font-weight:950;white-space:nowrap}.kh-title i{color:#ff315f;font-style:normal}.kh-att{height:34px;min-width:106px;border-radius:18px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:13px;font-weight:950;box-shadow:0 0 8px #ff2bbd}.kh-brand{justify-self:end;color:#ff3d78;font-size:18px;font-weight:950;white-space:nowrap}'+
    '.kh-air{display:flex;align-items:center;gap:8px;padding:0 8px;font-size:14px;font-weight:950}.kh-air .on{color:#ff315f}.kh-heart{padding:4px 11px;border:1px solid #ff4380;border-radius:999px;color:#fff}.kh-invite{margin-left:auto;border:1px solid #d7ad39;border-radius:999px;background:#17140b;color:#ffe071;padding:5px 10px;font-weight:950}'+
    '.kh-led{position:relative;overflow:hidden;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;box-shadow:0 0 9px #ff28c4}.kh-led span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.kh-led b{color:#ff59c9}'+
    '.kh-row{display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:5px}.kh-row button,.kh-row div{border:0;border-radius:13px;background:#111114;color:#fff;font-size:12px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}'+
    '.kh-stage{min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:5px}.kh-host{position:relative;min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;overflow:hidden;background:#111}.kh-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.kh-host-badge{position:absolute;left:7px;top:7px;z-index:2;padding:3px 7px;border-radius:999px;background:#1e1d23;border:1px solid #d2a936;font-size:9px;font-weight:950}.kh-guests{min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;border:2px solid #ff28c4;border-radius:10px;padding:4px;background:#09090c}.kh-guest{position:relative;min-width:0;min-height:0;border:1px solid #4a4a55;border-radius:8px;overflow:hidden;background:#111}.kh-guest video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.kh-guest-empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#ddd;font-size:10px;font-weight:900}.kh-guest-empty strong{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;border:1px solid #777;font-size:24px}.kh-earn{display:flex;align-items:center;justify-content:center;border:1px solid #d2a936;border-radius:8px;background:#17140b;color:#fff;text-align:center;font-size:7px;font-weight:900}'+
    '.kh-panels{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:5px;min-height:0}.kh-chat,.kh-gifts{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden;display:flex;flex-direction:column}.kh-panel-head{height:34px;display:flex;align-items:center;gap:12px;padding:0 9px;border-bottom:1px solid #ff28c477;font-size:11px;font-weight:950}.kh-panel-head b{color:#ff45cf}.kh-chat-body{flex:1;padding:6px 8px;overflow:hidden;font-size:10px}.kh-chat-input{height:38px;margin:4px 6px 6px;border:1px solid #3d5270;border-radius:8px;display:flex;align-items:center;padding:0 9px;color:#9ab1ce;font-size:10px}.kh-gift-grid{flex:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:5px}.kh-gift{border:1px solid #d5a80e;border-radius:7px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;overflow:hidden}.kh-gift i{font-style:normal;font-size:22px;line-height:1}.kh-gift b{font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}'+
    '.kh-tools{display:grid;grid-template-columns:repeat(8,1fr);gap:2px}.kh-tool{border:0;background:none;color:#fff;font-weight:900;display:grid;justify-items:center;gap:2px}.kh-tool i{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:17px}.kh-tool span{font-size:8px;white-space:nowrap}'+
    '@media(max-width:390px){.kh-secret-final{padding-left:4px;padding-right:4px;grid-template-rows:56px 32px 50px 39px 39px minmax(0,1fr) 198px 48px;gap:3px}.kh-title,.kh-brand{font-size:16px}.kh-att{min-width:92px;height:30px;font-size:11px}.kh-led span{font-size:18px}.kh-row button,.kh-row div{font-size:10px}.kh-tool i{width:31px;height:31px;font-size:15px}.kh-tool span{font-size:7px}}'+
    '</style>'+
    '<section class="kh-secret-final">'+
      '<div class="kh-head"><div class="kh-left"><button class="kh-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="kh-title"><i>●</i> 비밀방</div></div><button class="kh-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">🪽 출석체크 🪽</button><div class="kh-brand">K-Talk LIVE</div></div>'+
      '<div class="kh-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(oldClock)+'</span><span class="kh-heart">♥ '+esc(heart)+'</span><button class="kh-invite" onclick="if(window.ktOpenSecretInvite20260928)ktOpenSecretInvite20260928();else if(window.shareApp)shareApp()">👥 초청</button></div>'+
      '<div class="kh-led"><span>💗 ✨ <b>K-Talk LIVE</b>&nbsp; 환영합니다 ✨ 💗</span></div>'+
      '<div class="kh-row"><button>🔥 일일 랭킹</button><button>🎯 미션</button><div class="ktsecret-viewers">'+esc(viewers)+'</div></div>'+
      '<div class="kh-row"><button onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()">↻ 되돌리기</button><button onclick="if(window.ktRenderTreasure)ktRenderTreasure()">🎁 보물상자</button><button>⚔ 매치</button></div>'+
      '<div class="kh-stage">'+
        '<div class="kh-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="kh-host-badge">🌹1000</span></div>'+
        '<div class="kh-guests">'+guestSlots()+'<div class="kh-earn">🔒 내 수익&nbsp; <b id="hudEarnNet">0원</b><br>🌹 0송이&nbsp; 일반회원 · 35%</div></div>'+
      '</div>'+
      '<div class="kh-panels">'+
        '<div class="kh-chat"><div class="kh-panel-head"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div id="ktsecretChatList" class="kh-chat-body"></div><div class="kh-chat-input" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">메시지를 입력하세요...</div></div>'+
        '<div class="kh-gifts"><div class="kh-panel-head"><b>🎁 선물 / 후원</b><span style="margin-left:auto">후원 랭킹 ›</span></div><div class="kh-gift-grid">'+
          gift('🌹','장미')+gift('💐','장미다발')+gift('🌺','특대장미')+
          gift('💗','하트')+gift('⭐','별')+gift('🎈','풍선')+
          gift('👑','황금 왕관')+gift('🏰','스페셜 선물')+gift('🎁','비밀 선물')+
        '</div></div>'+
      '</div>'+
      '<div class="kh-tools">'+
        '<button class="kh-tool" onclick="return window.ktBottomCameraToggle?ktBottomCameraToggle(this):false"><i>📷</i><span>카메라</span></button>'+
        '<button class="kh-tool" onclick="return window.ktBottomMicToggle?ktBottomMicToggle(this):false"><i>🎤</i><span>마이크</span></button>'+
        '<button class="kh-tool" onclick="if(window.shareApp)shareApp()"><i>👥</i><span>친구</span></button>'+
        '<button class="kh-tool" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button>'+
        '<button class="kh-tool" onclick="return window.ktBottomMovieOpen?ktBottomMovieOpen():false"><i>🎬</i><span>영화</span></button>'+
        '<button class="kh-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'+
        '<button class="kh-tool" onclick="if(window.ktSecretEffect)ktSecretEffect();else if(window.openEditEffectPanel)openEditEffectPanel()"><i>🪄</i><span>효과</span></button>'+
        '<button class="kh-tool" onclick="if(window.ktSecretMore)ktSecretMore();else if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'+
      '</div>'+
    '</section>';

    var vids=[].slice.call(screen.querySelectorAll('.kh-host video,.kh-guest video'));
    streams.forEach(function(s,i){if(vids[i])attach(vids[i],s);});
    try{
      screen.querySelectorAll('.kh-guest video').forEach(function(v){
        var e=v.parentElement&&v.parentElement.querySelector('.kh-guest-empty');
        if(v.srcObject&&e)e.style.display='none';
      });
    }catch(e){}
    try{if(window.ktForceApprovedGuestGridNow20260924)window.ktForceApprovedGuestGridNow20260924();}catch(e){}
    return true;
  }

  window.ktRenderSecretHardReference1111=render;

  function enforce(){
    if(!isSecret())return;
    clearPassword();
    var s=document.getElementById('screen');
    if(!s)return;
    if(!s.querySelector('.kh-secret-final'))render();
  }

  var oldOpen=window.openPasswordRoomSetup;
  window.openPasswordRoomSetup=function(){
    clearPassword();
    try{
      if(window.state){
        state.liveRoomType='secret';
        state.liveRoomName='비밀방';
        state.liveRoomMax=6;
      }
    }catch(e){}
    if(typeof window.openRoomPrep==='function')return window.openRoomPrep('비밀방',6);
    if(typeof oldOpen==='function')return oldOpen.apply(this,arguments);
  };

  window.confirmPasswordRoom=function(){
    clearPassword();
    try{
      if(window.state){
        state.liveRoomType='secret';
        state.liveRoomName='비밀방';
        state.liveRoomMax=6;
      }
    }catch(e){}
    if(typeof window.startBroadcast==='function')return window.startBroadcast();
  };

  new MutationObserver(function(){
    clearTimeout(window.__khSecretHardTimer);
    window.__khSecretHardTimer=setTimeout(enforce,20);
  }).observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('pageshow',function(){setTimeout(enforce,30);});
  window.addEventListener('focus',function(){setTimeout(enforce,30);});
  window.addEventListener('kt-room-opened',function(){setTimeout(enforce,20);});

  [30,100,250,500,900,1600,2600].forEach(function(ms){setTimeout(enforce,ms);});
  setInterval(enforce,500);
})();