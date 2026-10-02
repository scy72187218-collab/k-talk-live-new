/* K-Talk 비밀방 - 사용자 승인 두번째 사진 기준 최종 1111
   2026-10-03
   비밀방에서만 적용. 다른 방 미수정. */
(function(){
  if(window.__ktSecretSecondPhotoFinal1111)return;
  window.__ktSecretSecondPhotoFinal1111=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function isSecret(){
    try{
      var s=document.getElementById('screen');
      var st=window.state||{};
      var txt=String(s&&s.textContent||'');
      var n=String(st.liveRoomName||st.roomName||'');
      var t=String(st.liveRoomType||st.roomType||'').toLowerCase();
      return txt.indexOf('비밀방')>-1 || n.indexOf('비밀')>-1 || t==='secret' || t==='password';
    }catch(e){return false;}
  }
  function currentText(sel,def){
    try{var e=document.querySelector(sel);return String(e&&e.textContent||def);}catch(e){return def;}
  }
  function liveStreams(){
    var out=[];
    try{
      document.querySelectorAll('#screen video').forEach(function(v){
        var s=v.srcObject;
        if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';})&&out.indexOf(s)<0)out.push(s);
      });
    }catch(e){}
    try{
      [window.__ktRemoteHostStream,window.__ktLastApprovedGuestHostStream,window.__ktApprovedGuestSelfStream,window.__ktLocalGuestCameraStream20260926,window.state&&window.state.stream].forEach(function(s){
        if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';})&&out.indexOf(s)<0)out.push(s);
      });
    }catch(e){}
    return out;
  }
  function killPassword(){
    try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
    try{if(window.state){state.liveRoomPassword='';state.roomPassword='';}}catch(e){}
    try{document.querySelectorAll('#ktSecretPasswordBox,#ktSecretPasswordRow,#ktSecretPassword,#ktSecretPasswordSave,#ktSecretPasswordHelp,#ktSecretPasswordError,[data-secret-password]').forEach(function(x){x.remove();});}catch(e){}
  }
  function guest(){
    return '<div class="k2-guest"><div class="k2-plus">+</div><b>게스트</b></div>';
  }
  function gift(icon,name,price){
    return '<button class="k2-gift" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><b>'+esc(name)+'</b><small>🟡 '+esc(price)+'</small></button>';
  }
  function attach(streams){
    try{
      var host=document.getElementById('ktLiveVideo');
      if(host&&streams[0]){host.srcObject=streams[0];host.muted=true;var p=host.play();if(p&&p.catch)p.catch(function(){});}
      var gs=[].slice.call(document.querySelectorAll('.k2-guest video'));
      gs.forEach(function(v,i){if(streams[i+1]){v.srcObject=streams[i+1];v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}});
    }catch(e){}
  }
  function render(){
    if(!isSecret())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;
    if(screen.querySelector('.k2-room')){killPassword();cleanForeign();return true;}

    var streams=liveStreams();
    var clock=currentText('#ktLiveClock','00:00:00');
    var heart=(currentText('.heart-count,.ktsecret-heart,.ktsubscriber-heart','109').match(/\d+/)||['109'])[0];
    var viewers=currentText('.ktsecret-viewers,.ktg13-viewers,.ktsubscriber-viewers','시청자 0명 시청중 🏃');
    if(viewers.indexOf('시청자')<0)viewers='시청자 0명 시청중 🏃';
    var net=currentText('#hudEarnNet','0원');
    var roses=currentText('#hudEarnRoses','🌹 0송이');

    killPassword();
    screen.innerHTML =
    '<style id="k2-style">'+
    '#screen{padding:0!important;margin:0!important;width:100%!important;height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'+
    '.k2-room{width:100%;height:100dvh;box-sizing:border-box;padding:4px 5px calc(4px + env(safe-area-inset-bottom));display:grid;grid-template-rows:58px 34px 54px 39px 39px minmax(0,1fr) 48px;gap:4px;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'+
    '.k2-head{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;padding:5px 8px;border-radius:15px;background:linear-gradient(180deg,#17171a,#0c0c0f)}'+
    '.k2-headleft{display:flex;align-items:center;min-width:0}.k2-back{width:30px;height:30px;border-radius:50%;border:1px solid #ffffff44;background:#111;color:#fff;font-size:24px;line-height:1}.k2-title{font-weight:950;font-size:18px;white-space:nowrap}.k2-att{height:34px;min-width:105px;border:2px solid #ff2ac7;border-radius:19px;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.2px);background-size:9px 9px;color:#ffd92e;font-size:13px;font-weight:950;box-shadow:0 0 9px #ff2ac7}.k2-brand{justify-self:end;color:#ff3f78;font-size:18px;font-weight:950;white-space:nowrap}'+
    '.k2-air{display:grid;grid-template-columns:auto auto auto 1fr;align-items:center;gap:8px;padding:0 8px;font-weight:950;white-space:nowrap}.k2-on{color:#ff315f;font-size:14px}.k2-clock{font-size:14px}.k2-heart{border:1px solid #ff4f91;border-radius:999px;padding:3px 9px;font-size:12px}.k2-invite{justify-self:end;border:1px solid #d7ad39;border-radius:999px;background:#17140b;color:#ffe071;padding:5px 12px;font-size:12px;font-weight:950;white-space:nowrap}'+
    '.k2-led{position:relative;overflow:hidden;border:2px solid #ff28c4;border-radius:21px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;box-shadow:0 0 9px #ff28c4}.k2-ledtrack{position:absolute;inset:0 auto 0 0;display:flex;align-items:center;white-space:nowrap;animation:k2mar 12s linear infinite;font-size:22px;font-weight:950;color:#ffd62d}.k2-ledtrack b{color:#ff59c9}.k2-ledtrack span{padding-right:70px}@keyframes k2mar{from{transform:translateX(40%)}to{transform:translateX(-100%)}}'+
    '.k2-row{display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:4px}.k2-row>*{border:0;border-radius:12px;background:#111114;color:#fff;font-size:11px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}'+
    '.k2-main{min-height:0;display:grid;grid-template-columns:1.08fr .92fr;grid-template-rows:minmax(0,1fr) 198px;gap:5px}.k2-stage{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:1.08fr .92fr;gap:5px}.k2-host{position:relative;min-height:0;border:2px solid #ff28c4;border-radius:10px;overflow:hidden;background:#111}.k2-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.k2-hostbadge{position:absolute;left:7px;top:7px;z-index:3;padding:3px 8px;border:1px solid #d7ad39;border-radius:999px;background:#221f2ae8;font-size:9px;font-weight:950}.k2-hostline{position:absolute;left:8px;right:6px;bottom:8px;z-index:3;font-size:9px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px #000}.k2-hostline b{color:#78ff77;margin-right:5px}'+
    '.k2-guests{min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:4px;padding:4px;border:2px solid #ff28c4;border-radius:10px;background:#09090c}.k2-guest,.k2-earn{position:relative;min-width:0;min-height:0;border:1px solid #4a4a55;border-radius:8px;background:linear-gradient(145deg,#15151a,#09090c);display:grid;place-items:center;overflow:hidden}.k2-guest video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.k2-plus{width:30px;height:30px;border:1px solid #777;border-radius:50%;display:grid;place-items:center;font-size:23px;font-weight:900}.k2-guest b{font-size:9px;color:#ddd}.k2-earn{border-color:#d2a936;text-align:center}.k2-earn .top{color:#8fe8ff;font-size:7px;font-weight:950}.k2-earn strong{color:#ffe071;font-size:9px}.k2-earn small{font-size:6.5px;color:#ddd}'+
    '.k2-chat,.k2-gifts{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden;display:flex;flex-direction:column}.k2-tabs{height:30px;display:flex;align-items:center;gap:12px;padding:0 9px;border-bottom:1px solid #ff28c477;font-size:10px;font-weight:950}.k2-tabs .on{color:#ff45cf}.k2-chatlist{flex:1;overflow:hidden;padding:4px 7px;font-size:8.5px;line-height:1.55}.k2-msg{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k2-msg b{margin-right:5px}.k2-msg:nth-child(1) b,.k2-msg:nth-child(2) b{color:#66ff8d}.k2-msg:nth-child(3) b{color:#ffd65b}.k2-msg:nth-child(4) b{color:#60dfff}.k2-msg:nth-child(5) b{color:#52e5ff}.k2-inputrow{height:36px;margin:3px 5px 5px;display:grid;grid-template-columns:1fr 44px 32px;gap:4px}.k2-input{border:1px solid #3d5270;border-radius:8px;display:flex;align-items:center;padding:0 7px;color:#9ab1ce;font-size:8px}.k2-send,.k2-present{border:0;border-radius:7px;color:#fff;font-size:9px;font-weight:950}.k2-send{background:linear-gradient(135deg,#8a24ff,#6c18e8)}.k2-present{background:#1b0b1d;font-size:18px}'+
    '.k2-ghead{height:30px;display:flex;align-items:center;padding:0 8px;font-size:10px;font-weight:950}.k2-ghead b{color:#ff45cf}.k2-rank{margin-left:auto;border:1px solid #ff4bd1;border-radius:999px;padding:2px 6px;color:#ff76dc}.k2-cats{height:22px;display:grid;grid-template-columns:repeat(4,1fr);font-size:7px}.k2-cats span{display:grid;place-items:center}.k2-cats .on{background:#ff12d8;border-radius:7px}.k2-grid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:3px;padding:4px}.k2-gift{min-width:0;border:1px solid #d5a80e;border-radius:6px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden}.k2-gift i{font-style:normal;font-size:19px;line-height:1}.k2-gift b{font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.k2-gift small{font-size:6.5px;color:#ffd53d}'+
    '.k2-tools{display:grid;grid-template-columns:repeat(8,1fr);gap:2px;align-items:start}.k2-tool{min-width:0;border:0;background:none;color:#fff;display:grid;justify-items:center;gap:1px}.k2-tool i{width:30px;height:30px;border-radius:50%;border:1px solid #35363d;background:linear-gradient(145deg,#1b1b20,#0b0b0f);display:grid;place-items:center;font-style:normal;font-size:15px}.k2-tool span{font-size:7px;white-space:nowrap;font-weight:900}'+
    '@media(max-width:390px){.k2-room{grid-template-rows:56px 32px 51px 37px 37px minmax(0,1fr) 45px;padding-left:4px;padding-right:4px;gap:3px}.k2-title,.k2-brand{font-size:16px}.k2-att{min-width:90px;font-size:11px}.k2-main{grid-template-rows:minmax(0,1fr) 190px}.k2-ledtrack{font-size:19px}.k2-row>*{font-size:10px}.k2-tabs{gap:8px;font-size:9px}.k2-tool i{width:28px;height:28px;font-size:14px}.k2-tool span{font-size:6px}}'+
    '</style>'+
    '<section class="k2-room ktsecret-room">'+
      '<div class="k2-head"><div class="k2-headleft"><button class="k2-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="k2-title">비밀방</div></div><button class="k2-att" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()">🪽 출석체크 🪽</button><div class="k2-brand">K-Talk LIVE</div></div>'+
      '<div class="k2-air"><span class="k2-on">● ON AIR</span><span class="k2-clock" id="ktLiveClock">'+esc(clock)+'</span><span class="k2-heart">♥ '+esc(heart)+'</span><button class="k2-invite" onclick="if(window.ktOpenSecretInvite20260928)ktOpenSecretInvite20260928();else if(window.shareApp)shareApp()">👥 초청</button></div>'+
      '<div class="k2-led"><div class="k2-ledtrack"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
      '<div class="k2-row"><button>🔥 일일 랭킹</button><button>🎯 미션</button><div class="ktsecret-viewers">'+esc(viewers)+'</div></div>'+
      '<div class="k2-row"><button onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()">↻ 되돌리기</button><button onclick="if(window.ktRenderTreasure)ktRenderTreasure();else if(window.openGifts)openGifts()">🎁 보물상자</button><button onclick="if(window.openMatch)openMatch()">⚔ 매치</button></div>'+
      '<div class="k2-main">'+
        '<div class="k2-stage">'+
          '<div class="k2-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="k2-hostbadge">🌹 1000</span><div class="k2-hostline"><b>● 운영진</b> 노래 종료 · 게스트 마이크 해제</div></div>'+
          '<div class="k2-guests">'+guest()+guest()+guest()+guest()+guest()+'<div class="k2-earn"><div><div class="top">🔒 내 수익 <strong id="hudEarnNet">'+esc(net)+'</strong></div><small id="hudEarnRoses">'+esc(roses)+'</small><br><small>일반회원 · 35%</small></div></div></div>'+
        '</div>'+
        '<div class="k2-chat"><div class="k2-tabs"><span class="on">채팅 (128)</span><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="k2-chatlist">'+
          '<div class="k2-msg"><b>● 운영진</b> 노래 종료 · 게스트 마이크 해제</div>'+
          '<div class="k2-msg"><b>● 운영진</b> 노래 종료 · 게스트 마이크 해제</div>'+
          '<div class="k2-msg"><b>● 지우</b> 분위기 너무 좋아요 💕</div>'+
          '<div class="k2-msg"><b>● 하늘</b> 다음 노래는 뭐예요? 🎵</div>'+
          '<div class="k2-msg"><b>● 민준</b> 완전 힐링되는 시간이에요 😍</div>'+
        '</div><div class="k2-inputrow"><div class="k2-input" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">☺ 메시지를 입력하세요...</div><button class="k2-send">전송</button><button class="k2-present" onclick="if(window.openGifts)openGifts()">🎁</button></div></div>'+
        '<div class="k2-gifts"><div class="k2-ghead"><b>🎁 선물 / 후원</b><span class="k2-rank">후원 랭킹 ›</span></div><div class="k2-cats"><span class="on">전체</span><span>인기</span><span>스페셜</span><span>컬렉션</span></div><div class="k2-grid">'+
          gift('🌹','1송이 장미','10')+gift('💐','10송이 장미','100')+gift('🌺','30송이 장미','300')+
          gift('💗','하트','10')+gift('⭐','별','20')+gift('🎈','풍선','30')+
          gift('👑','황금 왕관','100')+gift('🏰','스페셜 선물','500')+gift('🎁','비밀 선물','1,000')+
        '</div></div>'+
      '</div>'+
      '<div class="k2-tools">'+
        '<button class="k2-tool" onclick="return window.ktBottomCameraToggle?ktBottomCameraToggle(this):false"><i>📷</i><span>카메라</span></button>'+
        '<button class="k2-tool" onclick="return window.ktBottomMicToggle?ktBottomMicToggle(this):false"><i>🎤</i><span>마이크</span></button>'+
        '<button class="k2-tool" onclick="if(window.shareApp)shareApp()"><i>👥</i><span>친구</span></button>'+
        '<button class="k2-tool" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button>'+
        '<button class="k2-tool" onclick="return window.ktBottomMovieOpen?ktBottomMovieOpen():false"><i>🎬</i><span>영화</span></button>'+
        '<button class="k2-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'+
        '<button class="k2-tool" onclick="if(window.ktSecretEffect)ktSecretEffect();else if(window.openEditEffectPanel)openEditEffectPanel()"><i>🪄</i><span>효과</span></button>'+
        '<button class="k2-tool" onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'+
      '</div>'+
    '</section>';

    attach(streams);
    killPassword();
    cleanForeign();
    return true;
  }

  function cleanForeign(){
    try{
      var room=document.querySelector('#screen .k2-room');
      if(!room)return;
      document.querySelectorAll('#screen .k2-room *').forEach(function(el){
        var t=(el.textContent||'').trim();
        if((t==='♥ 109'||t==='♡ 109')&&!el.classList.contains('k2-heart')&&!el.closest('.k2-heart'))el.remove();
      });
      var host=room.querySelector('.k2-host');
      if(host){
        [].slice.call(host.children).forEach(function(el){
          if(el.id!=='ktLiveVideo'&&!el.classList.contains('k2-hostbadge')&&!el.classList.contains('k2-hostline'))el.remove();
        });
      }
    }catch(e){}
  }

  window.ktRenderSecretReferenceFinal1111=render;
  window.ktRenderSecretReference20261003=render;

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=async function(){
      var out=await oldStart.apply(this,arguments);
      [0,50,150,350,700].forEach(function(ms){setTimeout(function(){if(isSecret())render();},ms);});
      return out;
    };
  }

  [0,60,180,420,900,1600].forEach(function(ms){setTimeout(function(){if(isSecret())render();},ms);});
  setInterval(function(){if(isSecret()){var s=document.getElementById('screen');if(s&&!s.querySelector('.k2-room'))render();else cleanForeign();killPassword();}},350);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__k2secretTimer);
      window.__k2secretTimer=setTimeout(function(){if(isSecret()){var s=document.getElementById('screen');if(s&&!s.querySelector('.k2-room'))render();else cleanForeign();}},30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
