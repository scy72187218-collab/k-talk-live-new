/* K-Talk 비밀방 최종 고정 1111
   - 비밀방 + ON AIR에서만 적용
   - 승인된 두번째 참고 화면 구조
   - 비밀번호 UI 제거
   - 선물 금액 숨김
   - 다른 방 미수정 */
(function(){
  if(window.__ktSecretForceReferenceFinal1111)return;
  window.__ktSecretForceReferenceFinal1111=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function isSecretOnAir(){
    try{
      var s=document.getElementById('screen');
      if(!s)return false;
      var txt=String(s.textContent||'');
      var st=window.state||{};
      var name=String(st.liveRoomName||st.roomName||'');
      var type=String(st.liveRoomType||st.roomType||'').toLowerCase();
      var secret=(txt.indexOf('비밀방')>-1||name.indexOf('비밀')>-1||type==='secret'||type==='password');
      var air=(txt.indexOf('ON AIR')>-1||txt.indexOf('방송중')>-1||!!st.live);
      return secret&&air;
    }catch(e){return false;}
  }

  function liveStreams(){
    var out=[];
    try{
      document.querySelectorAll('#screen video').forEach(function(v){
        var s=v.srcObject;
        if(!s||!s.getVideoTracks)return;
        var ok=s.getVideoTracks().some(function(t){return t&&t.readyState==='live';});
        if(!ok)return;
        if(out.indexOf(s)<0)out.push(s);
      });
    }catch(e){}
    try{
      var extras=[
        window.__ktRemoteHostStream,
        window.__ktLastApprovedGuestHostStream,
        window.__ktApprovedGuestSelfStream,
        window.__ktLocalGuestCameraStream20260926,
        window.state&&window.state.stream
      ];
      extras.forEach(function(s){
        if(!s||!s.getVideoTracks)return;
        var ok=s.getVideoTracks().some(function(t){return t&&t.readyState==='live';});
        if(ok&&out.indexOf(s)<0)out.push(s);
      });
    }catch(e){}
    return out;
  }

  function currentText(sel,def){
    try{
      var e=document.querySelector(sel);
      return String(e&&e.textContent||def);
    }catch(e){return def;}
  }

  function gift(icon,label){
    return '<button class="ktsff-gift" type="button" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><span>'+esc(label)+'</span></button>';
  }

  function renderChat(){
    var box=document.getElementById('ktsffChat');
    if(!box)return;
    var msgs=[];
    try{msgs=(window.ktSecretChatMessages||[]).slice(-5);}catch(e){}
    if(!msgs.length){
      box.innerHTML='<div class="ktsff-empty">채팅 메시지가 여기에 표시됩니다.</div>';
      return;
    }
    box.innerHTML=msgs.map(function(m){
      return '<div class="ktsff-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';
    }).join('');
  }

  function killPassword(){
    try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
    try{
      if(window.state){
        state.liveRoomPassword='';
        state.roomPassword='';
      }
    }catch(e){}
    try{
      document.querySelectorAll('#ktSecretPasswordBox,#ktSecretPasswordRow,#ktSecretPassword,#ktSecretPasswordSave,#ktSecretPasswordHelp,#ktSecretPasswordError,[data-secret-password]').forEach(function(x){x.remove();});
    }catch(e){}
  }

  function attachStreams(streams){
    try{
      var vids=[].slice.call(document.querySelectorAll('#screen .ktsff-video'));
      vids.forEach(function(v,i){
        var s=streams[i]||null;
        if(!s)return;
        v.srcObject=s;
        v.muted=true;
        v.defaultMuted=true;
        try{
          var p=v.play();
          if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      });
    }catch(e){}
  }

  function render(){
    if(!isSecretOnAir())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;
    if(screen.querySelector('.ktsff-room')){killPassword();return true;}

    var streams=liveStreams();
    var clock=currentText('#ktLiveClock','00:00:00');
    var viewers=currentText('.ktsecret-viewers,.ktg13-viewers,.ktsubscriber-viewers','시청자 0명 시청중 🏃');
    if(viewers.indexOf('시청자')<0)viewers='시청자 0명 시청중 🏃';
    var heart=currentText('.heart-count,.ktsecret-heart,.ktsubscriber-heart','109');
    heart=(heart.match(/\d+/)||['109'])[0];
    var net=currentText('#hudEarnNet','0원');
    var roses=currentText('#hudEarnRoses','🌹 0송이');

    killPassword();

    screen.innerHTML='<style id="ktsffStyle">'+
      '#screen{padding:0!important;margin:0!important;width:100%!important;height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'+
      '.ktsff-room{box-sizing:border-box;width:100%;height:100dvh;padding:4px 7px calc(4px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:4px;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'+
      '.ktsff-head{flex:0 0 62px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 10px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10)}'+
      '.ktsff-left{display:flex;align-items:center;gap:7px}.ktsff-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff38;background:#111;color:#fff;font-size:27px}.ktsff-title{font-size:19px;font-weight:950;white-space:nowrap}.ktsff-title i{font-style:normal;color:#ff315f}.ktsff-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}'+
      '.ktsff-att{min-width:112px;height:36px;border-radius:20px;border:2px solid #ff2bc8;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.1px);background-size:9px 9px;color:#ffd52f;font-size:14px;font-weight:950;box-shadow:0 0 9px #ff2bbd}'+
      '.ktsff-air{flex:0 0 38px;display:flex;align-items:center;gap:8px;padding:0 8px;font-size:14px;font-weight:950}.ktsff-air .on{color:#ff315f}.ktsff-heart{padding:4px 10px;border:1px solid #ff4c91;border-radius:999px;color:#fff}.ktsff-invite{margin-left:auto;padding:6px 13px;border:1px solid #d7ad39;border-radius:999px;background:#17140be8;color:#ffe071;font-weight:950}'+
      '.ktsff-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 20px #ff28c455}.ktsff-ledtrack{position:absolute;inset:0 auto 0 0;display:flex;align-items:center;white-space:nowrap;animation:ktsffmar 12s linear infinite;font-size:23px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsff-ledtrack b{color:#ff59c9}.ktsff-ledtrack span{padding-right:80px}@keyframes ktsffmar{from{transform:translateX(35%)}to{transform:translateX(-100%)}}'+
      '.ktsff-stats,.ktsff-quick{display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:5px;flex:0 0 42px}.ktsff-stats>*,.ktsff-quick>*{border:0;border-radius:13px;background:#111114;color:#fff;font-size:12px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}'+
      '.ktsff-main{flex:1 1 0;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);grid-template-rows:minmax(0,1fr) 205px;gap:5px}'+
      '.ktsff-stage{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr);gap:5px}.ktsff-host{position:relative;border:2px solid #ff28c4;border-radius:10px;overflow:hidden;background:#111}.ktsff-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.ktsff-hostbadge{position:absolute;left:8px;top:8px;z-index:3;padding:3px 8px;border:1px solid #d7ad39;border-radius:999px;background:#221f2ae8;color:#fff;font-size:9px;font-weight:950}'+
      '.ktsff-guests{min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:4px;border:2px solid #ff28c4;border-radius:10px;background:#09090c}.ktsff-guest,.ktsff-earn{position:relative;min-width:0;min-height:0;border:1px solid #4a4a55;border-radius:8px;background:linear-gradient(145deg,#15151a,#09090c);overflow:hidden;display:grid;place-items:center}.ktsff-guest video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ktsff-wait{display:grid;place-items:center;gap:3px;color:#ddd;font-size:10px;font-weight:900}.ktsff-wait b{width:32px;height:32px;border:1px solid #777;border-radius:50%;display:grid;place-items:center;font-size:24px}.ktsff-earn{border-color:#d2a936;text-align:center}.ktsff-earn span{font-size:7px;color:#8fe8ff;font-weight:950}.ktsff-earn b{font-size:9px;color:#ffe071}.ktsff-earn small{font-size:6.5px;color:#ddd}'+
      '.ktsff-chatbox,.ktsff-giftbox{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden;display:flex;flex-direction:column}.ktsff-panelhead{height:34px;display:flex;align-items:center;gap:12px;padding:0 10px;border-bottom:1px solid #ff28c477;font-size:11px;font-weight:950}.ktsff-panelhead b{color:#ff45cf}.ktsff-chat{flex:1 1 0;overflow:hidden;padding:6px 8px;font-size:10px}.ktsff-line{display:flex;gap:7px;margin:3px 0}.ktsff-line b{color:#65c8ff}.ktsff-empty{color:#aaa}.ktsff-input{height:40px;margin:4px 6px 6px;padding:0 9px;border:1px solid #3d5270;border-radius:8px;display:flex;align-items:center;color:#9ab1ce;font-size:10px}'+
      '.ktsff-gifts{flex:1 1 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:5px}.ktsff-gift{min-width:0;border:1px solid #d5a80e;border-radius:7px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}.ktsff-gift i{font-style:normal;font-size:23px}.ktsff-gift span{font-size:8px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}'+
      '.ktsff-tools{flex:0 0 50px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px}.ktsff-tool{border:0;background:none;color:#fff;display:grid;justify-items:center;gap:2px;font-weight:900}.ktsff-tool i{width:32px;height:32px;border:1px solid #35363d;border-radius:50%;background:linear-gradient(145deg,#1b1b20,#0b0b0f);display:grid;place-items:center;font-style:normal;font-size:16px}.ktsff-tool span{font-size:7px;white-space:nowrap}'+
      '@media(max-width:390px){.ktsff-room{padding-left:4px;padding-right:4px;gap:3px}.ktsff-head{flex-basis:58px;padding:4px 7px}.ktsff-title,.ktsff-brand{font-size:17px}.ktsff-att{min-width:92px;height:33px;font-size:12px}.ktsff-led{flex-basis:50px}.ktsff-ledtrack{font-size:20px}.ktsff-main{grid-template-rows:minmax(0,1fr) 195px}}'+
      '</style>'+
      '<section class="ktsff-room ktsecret-room kt-secret-second-layout-1111">'+
        '<div class="ktsff-head"><div class="ktsff-left"><button class="ktsff-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard();else if(window.home)home()">‹</button><div class="ktsff-title"><i>●</i> 비밀방</div></div><button class="ktsff-att" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()">🪽 출석체크 🪽</button><div class="ktsff-brand">K-Talk LIVE</div></div>'+
        '<div class="ktsff-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><span class="ktsff-heart">♥ '+esc(heart)+'</span><button class="ktsff-invite" onclick="if(window.ktOpenSecretInvite20260928)ktOpenSecretInvite20260928();else if(window.shareApp)shareApp()">👥 초청</button></div>'+
        '<div class="ktsff-led"><div class="ktsff-ledtrack"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
        '<div class="ktsff-stats"><button>🔥 일일 랭킹</button><button>🎯 미션</button><div>'+esc(viewers)+'</div></div>'+
        '<div class="ktsff-quick"><button onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()">↻ 되돌리기</button><button onclick="if(window.ktRenderTreasure)ktRenderTreasure();else if(window.openGifts)openGifts()">🎁 보물상자</button><button onclick="if(window.openMatch)openMatch()">⚔ 매치</button></div>'+
        '<div class="ktsff-main">'+
          '<div class="ktsff-stage">'+
            '<div class="ktsff-host"><video class="ktsff-video" id="ktLiveVideo" autoplay playsinline muted></video><span class="ktsff-hostbadge">🌹1000</span></div>'+
            '<div class="ktsff-guests">'+
              '<div class="ktsff-guest"><video class="ktsff-video" autoplay playsinline muted></video><div class="ktsff-wait"><b>+</b><span>게스트</span></div></div>'+
              '<div class="ktsff-guest"><video class="ktsff-video" autoplay playsinline muted></video><div class="ktsff-wait"><b>+</b><span>게스트</span></div></div>'+
              '<div class="ktsff-guest"><video class="ktsff-video" autoplay playsinline muted></video><div class="ktsff-wait"><b>+</b><span>게스트</span></div></div>'+
              '<div class="ktsff-guest"><video class="ktsff-video" autoplay playsinline muted></video><div class="ktsff-wait"><b>+</b><span>게스트</span></div></div>'+
              '<div class="ktsff-guest"><video class="ktsff-video" autoplay playsinline muted></video><div class="ktsff-wait"><b>+</b><span>게스트</span></div></div>'+
              '<div class="ktsff-earn"><div><span>🔒 내 수익 </span><b id="hudEarnNet">'+esc(net)+'</b><br><small id="hudEarnRoses">'+esc(roses)+'</small> <small>일반회원 · 35%</small></div></div>'+
            '</div>'+
          '</div>'+
          '<div class="ktsff-chatbox"><div class="ktsff-panelhead"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div id="ktsffChat" class="ktsff-chat"></div><div class="ktsff-input" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">메시지를 입력하세요...</div></div>'+
          '<div class="ktsff-giftbox"><div class="ktsff-panelhead"><b>🎁 선물 / 후원</b><span style="margin-left:auto">후원 랭킹 ›</span></div><div class="ktsff-gifts">'+
            gift('🌹','장미')+gift('💐','장미다발')+gift('🌺','특대장미')+
            gift('💗','하트')+gift('⭐','별')+gift('🎈','풍선')+
            gift('👑','황금 왕관')+gift('🏰','스페셜 선물')+gift('🎁','비밀 선물')+
          '</div></div>'+
        '</div>'+
        '<div class="ktsff-tools">'+
          '<button class="ktsff-tool" onclick="return window.ktBottomCameraToggle?ktBottomCameraToggle(this):false"><i>📷</i><span>카메라</span></button>'+
          '<button class="ktsff-tool" onclick="return window.ktBottomMicToggle?ktBottomMicToggle(this):false"><i>🎤</i><span>마이크</span></button>'+
          '<button class="ktsff-tool" onclick="if(window.shareApp)shareApp()"><i>👥</i><span>친구</span></button>'+
          '<button class="ktsff-tool" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button>'+
          '<button class="ktsff-tool" onclick="return window.ktBottomMovieOpen?ktBottomMovieOpen():false"><i>🎬</i><span>영화</span></button>'+
          '<button class="ktsff-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'+
          '<button class="ktsff-tool" onclick="if(window.ktSecretEffect)ktSecretEffect();else if(window.openEditEffectPanel)openEditEffectPanel()"><i>🪄</i><span>효과</span></button>'+
          '<button class="ktsff-tool" onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'+
        '</div>'+
      '</section>';

    attachStreams(streams);
    renderChat();
    killPassword();
    try{if(window.ktForceApprovedGuestGridNow20260924)window.ktForceApprovedGuestGridNow20260924();}catch(e){}
    return true;
  }

  window.ktRenderSecretReferenceFinal1111=render;
  try{window.ktRenderSecretReference20261003=render;}catch(e){}

  function enforce(){
    killPassword();
    if(!isSecretOnAir())return;
    var s=document.getElementById('screen');
    if(!s)return;
    if(s.querySelector('.ktsff-room'))return;
    render();
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var out=await oldStart.apply(this,arguments);
      setTimeout(enforce,0);
      setTimeout(enforce,60);
      setTimeout(enforce,180);
      setTimeout(enforce,450);
      return out;
    };
  }

  var oldChange=window.ktSecretChangePassword;
  window.ktSecretChangePassword=function(){killPassword();return false;};

  [0,40,100,220,450,900,1600,2600].forEach(function(ms){setTimeout(enforce,ms);});
  setInterval(enforce,300);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktsffTimer);
      window.__ktsffTimer=setTimeout(enforce,20);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('pageshow',function(){setTimeout(enforce,20);});
  window.addEventListener('focus',function(){setTimeout(enforce,20);});
})();
