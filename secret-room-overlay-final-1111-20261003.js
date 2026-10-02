/* Secret room absolute final overlay 1111 - second-photo layout only */
(function(){
  if(window.__ktSecretOverlayFinal1111)return;
  window.__ktSecretOverlayFinal1111=true;

  function secretVisible(){
    try{
      var txt=(document.body&&document.body.innerText)||'';
      var st=window.state||{};
      var t=String(st.liveRoomType||st.roomType||'').toLowerCase();
      var n=String(st.liveRoomName||st.roomName||'');
      var visibleText=txt.indexOf('비밀방')>-1 && (txt.indexOf('ON AIR')>-1||txt.indexOf('방송')>-1);
      return visibleText || ((t==='password'||t==='secret'||n.indexOf('비밀')>-1) && txt.indexOf('ON AIR')>-1);
    }catch(e){return false;}
  }
  function stream(){
    var a=[];
    try{a.push(window.__ktRemoteHostStream,window.__ktLastApprovedGuestHostStream,window.state&&window.state.stream);}catch(e){}
    try{
      document.querySelectorAll('video').forEach(function(v){if(v.srcObject)a.push(v.srcObject);});
    }catch(e){}
    for(var i=0;i<a.length;i++){
      var s=a[i];
      try{if(s&&s.getVideoTracks&&s.getVideoTracks().some(function(t){return t.readyState==='live';}))return s;}catch(e){}
    }
    return null;
  }
  function wipePassword(){
    try{localStorage.removeItem('kt_secret_room_password');}catch(e){}
    try{if(window.state){state.liveRoomPassword='';state.roomPassword='';}}catch(e){}
    try{document.querySelectorAll('#ktSecretPasswordBox,#ktSecretPasswordRow,#ktSecretPassword,#ktSecretPasswordSave,#ktSecretPasswordHelp,#ktSecretPasswordError,[data-secret-password]').forEach(function(x){x.remove();});}catch(e){}
  }
  function gift(icon,name){return '<button class="kfo-gift" type="button" onclick="if(window.openGifts)openGifts()"><i>'+icon+'</i><b>'+name+'</b></button>';}
  function guest(){return '<div class="kfo-guest"><div class="kfo-plus">+</div><b>게스트</b></div>';}
  function remove(){var x=document.getElementById('ktSecretFinalOverlay1111');if(x)x.remove();}
  function render(){
    wipePassword();
    if(!secretVisible()){remove();return;}
    if(document.getElementById('ktSecretFinalOverlay1111'))return;
    var d=document.createElement('div');
    d.id='ktSecretFinalOverlay1111';
    d.innerHTML='<style>'+
    '#ktSecretFinalOverlay1111{position:fixed;inset:0;z-index:2147483000;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'+
    '.kfo{height:100dvh;padding:4px 5px calc(4px + env(safe-area-inset-bottom));display:grid;grid-template-rows:58px 34px 54px 39px 39px minmax(0,1fr) 48px;gap:4px;background:#000;box-sizing:border-box}'+
    '.kfo-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 8px;border-radius:15px;background:linear-gradient(180deg,#17171a,#0c0c0f)}.kfo-left{display:flex;align-items:center}.kfo-back{width:30px;height:30px;border-radius:50%;border:1px solid #ffffff44;background:#111;color:#fff;font-size:24px}.kfo-title{font-size:18px;font-weight:950}.kfo-att{height:34px;min-width:96px;border:2px solid #ff2ac7;border-radius:19px;background:#130714;color:#ffd92e;font-weight:950;box-shadow:0 0 9px #ff2ac7}.kfo-brand{justify-self:end;color:#ff3f78;font-size:18px;font-weight:950;white-space:nowrap}'+
    '.kfo-air{display:grid;grid-template-columns:auto auto auto 1fr;align-items:center;gap:8px;padding:0 8px;font-weight:950}.kfo-on{color:#ff315f}.kfo-heart{border:1px solid #ff4f91;border-radius:999px;padding:3px 9px}.kfo-invite{justify-self:end;border:1px solid #d7ad39;border-radius:999px;background:#17140b;color:#ffe071;padding:5px 12px;font-weight:950}'+
    '.kfo-led{position:relative;overflow:hidden;border:2px solid #ff28c4;border-radius:21px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;box-shadow:0 0 9px #ff28c4}.kfo-ledin{height:100%;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:950;color:#ffd62d}.kfo-ledin b{color:#ff59c9}'+
    '.kfo-row{display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:4px}.kfo-row>*{border:0;border-radius:12px;background:#111114;color:#fff;font-size:11px;font-weight:950;display:flex;align-items:center;justify-content:center}'+
    '.kfo-main{min-height:0;display:grid;grid-template-columns:1.08fr .92fr;grid-template-rows:minmax(0,1fr) 184px;gap:5px}.kfo-stage{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:1.08fr .92fr;gap:5px}.kfo-host{position:relative;border:2px solid #ff28c4;border-radius:10px;overflow:hidden;background:#111}.kfo-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.kfo-badge{position:absolute;left:7px;top:7px;padding:3px 8px;border:1px solid #d7ad39;border-radius:999px;background:#221f2ae8;font-size:9px;font-weight:950}.kfo-line{position:absolute;left:8px;bottom:8px;font-size:9px;font-weight:900;text-shadow:0 1px 2px #000}.kfo-line b{color:#78ff77}'+
    '.kfo-guests{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,1fr);gap:4px;padding:4px;border:2px solid #ff28c4;border-radius:10px;background:#09090c}.kfo-guest,.kfo-earn{border:1px solid #4a4a55;border-radius:8px;background:#101014;display:grid;place-items:center;overflow:hidden}.kfo-plus{width:30px;height:30px;border:1px solid #777;border-radius:50%;display:grid;place-items:center;font-size:23px;font-weight:900}.kfo-guest b{font-size:9px;color:#ddd}.kfo-earn{border-color:#d2a936;text-align:center;font-size:7px}.kfo-earn strong{color:#ffe071;font-size:9px}'+
    '.kfo-chat,.kfo-gifts{border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden;display:flex;flex-direction:column}.kfo-tabs,.kfo-gh{height:30px;display:flex;align-items:center;gap:12px;padding:0 9px;border-bottom:1px solid #ff28c477;font-size:10px;font-weight:950}.kfo-tabs .on,.kfo-gh b{color:#ff45cf}.kfo-chatlist{flex:1;padding:5px 7px;font-size:8.5px;line-height:1.55;overflow:hidden}.kfo-input{height:34px;margin:3px 5px 5px;border:1px solid #3d5270;border-radius:8px;display:flex;align-items:center;padding:0 7px;color:#9ab1ce;font-size:8px}.kfo-rank{margin-left:auto;border:1px solid #ff4bd1;border-radius:999px;padding:2px 6px;color:#ff76dc}.kfo-cats{height:22px;display:grid;grid-template-columns:repeat(4,1fr);font-size:7px}.kfo-cats span{display:grid;place-items:center}.kfo-cats .on{background:#ff12d8;border-radius:7px}.kfo-grid{flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:3px;padding:4px}.kfo-gift{border:1px solid #d5a80e;border-radius:6px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;overflow:hidden}.kfo-gift i{font-style:normal;font-size:18px}.kfo-gift b{font-size:7px;white-space:nowrap}'+
    '.kfo-tools{display:grid;grid-template-columns:repeat(8,1fr);gap:2px}.kfo-tool{border:0;background:none;color:#fff;display:grid;justify-items:center;gap:1px}.kfo-tool i{width:30px;height:30px;border-radius:50%;border:1px solid #35363d;background:#111;display:grid;place-items:center;font-style:normal;font-size:15px}.kfo-tool span{font-size:7px;font-weight:900}'+
    '@media(max-width:390px){.kfo{grid-template-rows:54px 30px 48px 35px 35px minmax(0,1fr) 46px}.kfo-title,.kfo-brand{font-size:16px}.kfo-main{grid-template-rows:minmax(0,1fr) 174px}.kfo-ledin{font-size:18px}}'+
    '</style>'+
    '<section class="kfo">'+
    '<div class="kfo-head"><div class="kfo-left"><button class="kfo-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="kfo-title">비밀방</div></div><button class="kfo-att">🪽 출석체크 🪽</button><div class="kfo-brand">K-Talk LIVE</div></div>'+
    '<div class="kfo-air"><span class="kfo-on">● ON AIR</span><span id="kfoClock">00:00:00</span><span class="kfo-heart">♥ 109</span><button class="kfo-invite">👥 초청</button></div>'+
    '<div class="kfo-led"><div class="kfo-ledin">💗 ✨ <b>K-Talk LIVE</b>&nbsp;환영합니다 ✨ 💗</div></div>'+
    '<div class="kfo-row"><button>🔥 일일 랭킹</button><button>🎯 미션</button><div>시청자 0명 시청중 🏃</div></div>'+
    '<div class="kfo-row"><button onclick="if(window.ktAllRoomsFlipCamera)ktAllRoomsFlipCamera()">↻ 되돌리기</button><button onclick="if(window.openGifts)openGifts()">🎁 보물상자</button><button onclick="if(window.openMatch)openMatch()">⚔ 매치</button></div>'+
    '<div class="kfo-main"><div class="kfo-stage"><div class="kfo-host"><video id="kfoVideo" autoplay playsinline muted></video><span class="kfo-badge">🌹 1000</span><div class="kfo-line"><b>● 운영진</b> 노래 종료 · 게스트 마이크 해제</div></div><div class="kfo-guests">'+guest()+guest()+guest()+guest()+guest()+'<div class="kfo-earn">🔒 내 수익 <strong>0원</strong><br>🌹 0송이 · 일반회원 35%</div></div></div>'+
    '<div class="kfo-chat"><div class="kfo-tabs"><span class="on">채팅 (128)</span><span>참가자</span><span>팬클럽</span><span>공지</span></div><div class="kfo-chatlist"><div>● 운영진　노래 종료 · 게스트 마이크 해제</div><div>● 운영진　노래 종료 · 게스트 마이크 해제</div><div>● 지우　분위기 너무 좋아요 💕</div><div>● 하늘　다음 노래는 뭐예요? 🎵</div><div>● 민준　완전 힐링되는 시간이에요 😍</div></div><div class="kfo-input" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">☺ 메시지를 입력하세요...</div></div>'+
    '<div class="kfo-gifts"><div class="kfo-gh"><b>🎁 선물 / 후원</b><span class="kfo-rank">후원 랭킹 ›</span></div><div class="kfo-cats"><span class="on">전체</span><span>인기</span><span>스페셜</span><span>컬렉션</span></div><div class="kfo-grid">'+gift('🌹','장미')+gift('💐','장미다발')+gift('🌺','특대장미')+gift('💗','하트')+gift('⭐','별')+gift('🎈','풍선')+gift('👑','황금 왕관')+gift('🏰','스페셜 선물')+gift('🎁','비밀 선물')+'</div></div></div>'+
    '<div class="kfo-tools"><button class="kfo-tool"><i>📷</i><span>카메라</span></button><button class="kfo-tool"><i>🎤</i><span>마이크</span></button><button class="kfo-tool"><i>👥</i><span>친구</span></button><button class="kfo-tool"><i>💬</i><span>메시지</span></button><button class="kfo-tool"><i>🎬</i><span>영화</span></button><button class="kfo-tool"><i>↗</i><span>공유</span></button><button class="kfo-tool"><i>🪄</i><span>효과</span></button><button class="kfo-tool"><i>•••</i><span>더보기</span></button></div>'+
    '</section>';
    document.body.appendChild(d);
    var v=document.getElementById('kfoVideo'),s=stream();
    if(v&&s){try{v.srcObject=s;v.play().catch(function(){});}catch(e){}}
  }
  setInterval(render,220);
  [40,120,300,700].forEach(function(ms){setTimeout(render,ms);});
  window.addEventListener('focus',render);
  window.addEventListener('pageshow',render);
})();