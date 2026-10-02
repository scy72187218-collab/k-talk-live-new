/* K-Talk 비밀방 최종 단일 화면 1111
   비밀번호 UI 없음. 비밀방 레이아웃만 두 번째 사진형으로 고정.
   다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSecretCleanSecondLayout1111)return;
  window.__ktSecretCleanSecondLayout1111=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function isSecret(){
    try{
      var t=String(window.state&&state.liveRoomType||'');
      var n=String(window.state&&state.liveRoomName||'');
      return t==='password'||n.indexOf('비밀')>-1;
    }catch(e){return false;}
  }
  function liveStream(){
    try{
      return (window.state&&state.stream)||window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;
    }catch(e){return null;}
  }
  function clockText(){
    try{
      var old=document.getElementById('ktLiveClock');
      return old&&old.textContent||'00:00:00';
    }catch(e){return '00:00:00';}
  }
  function render(){
    if(!isSecret())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;
    var current=screen.querySelector('.ktsecret-room.kt-secret-second-layout-1111');
    if(current)return true;

    var oldRoom=screen.querySelector('.ktsecret-room');
    if(!oldRoom)return false;

    var clock=clockText();
    var net='0원',roses='🌹 0송이',rate='일반회원 · 35%';
    try{
      net=(oldRoom.querySelector('#hudEarnNet')||{}).textContent||net;
      roses=(oldRoom.querySelector('#hudEarnRoses')||{}).textContent||roses;
      rate=(oldRoom.querySelector('#hudEarnRate')||{}).textContent||rate;
    }catch(e){}

    screen.innerHTML=`
<style id="ktSecretSecondLayoutStyle1111">
#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}
body>.bottom,.bottom{display:none!important}
.ktsecret-room.kt-secret-second-layout-1111{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:5px 8px calc(6px + env(safe-area-inset-bottom));gap:5px}
.ktsecret-head{flex:0 0 64px;border-radius:18px;background:linear-gradient(180deg,#17171a,#0b0b0f);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 11px;border:1px solid #ffffff0d}
.ktsecret-left{display:flex;align-items:center;gap:8px;min-width:0}.ktsecret-back{width:36px;height:36px;border-radius:50%;border:1px solid #ffffff33;background:#111;color:#fff;font-size:27px}.ktsecret-title{font-size:21px;font-weight:950;white-space:nowrap}.ktsecret-title i{font-style:normal;color:#ff2e67}.ktsecret-brand{justify-self:end;color:#ff3f7d;font-size:20px;font-weight:950;white-space:nowrap}
.ktsecret-att{justify-self:center;height:36px;min-width:112px;padding:0 9px;border-radius:18px;border:2px solid #ff2bbd;background-color:#160716;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:9px 9px;color:#ffd52f;font-size:13px;font-weight:950;box-shadow:0 0 11px #ff2bbd}
.ktsecret-airrow{flex:0 0 42px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:16px;font-weight:950}.ktsecret-airrow .on{color:#ff315f}.ktsecret-heart{border:1px solid #ff4a91;border-radius:999px;background:#28101d;color:#fff;padding:6px 14px;font-weight:900}.ktsecret-invite{margin-left:auto;border:1px solid #d7ad39;border-radius:999px;background:#17140be8;color:#ffe071;padding:7px 13px;font-size:12px;font-weight:950}
.ktsecret-led{flex:0 0 66px;position:relative;border:3px solid #ff28c4;border-radius:24px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 10px #ff28c4,0 0 24px #ff28c466}
.ktsecret-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktsecretMarquee1111 12s linear infinite;font-size:26px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsecret-led-track span{display:inline-block;padding-right:100px}.ktsecret-led-track b{color:#ff59c9}@keyframes ktsecretMarquee1111{from{transform:translateX(30%)}to{transform:translateX(-100%)}}
.ktsecret-stats{flex:0 0 46px;display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:5px}.ktsecret-stats button,.ktsecret-viewers{border:0;border-radius:14px;background:#111114;color:#fff;font-size:14px;font-weight:950;display:flex;align-items:center;justify-content:center}
.ktsecret-quick{flex:0 0 48px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.ktsecret-quick button{border:0;border-radius:14px;background:#101014;color:#fff;font-size:14px;font-weight:950}
.ktsecret-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);grid-template-rows:minmax(0,1fr) 225px;gap:5px;overflow:hidden}
.ktsecret-stage{grid-column:1/-1;min-height:0;display:grid;grid-template-columns:56% 44%;gap:4px;border:2px solid #ff28c4;border-radius:12px;background:#09090c;padding:4px;overflow:hidden}
.ktsecret-host{position:relative;min-width:0;min-height:0;border:1px solid #ff38c8;border-radius:9px;overflow:hidden;background:#111}.ktsecret-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111;transform:scaleX(-1)}
.ktsecret-guests{min-width:0;min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px}
.ktsecret-guest{position:relative;min-width:0;min-height:0;border:1px solid #3a3a42;border-radius:9px;display:grid;place-items:center;background:linear-gradient(145deg,#17181d,#0e0f13);color:#ddd;font-weight:900;overflow:hidden}
.ktsecret-guest video,.ktsecret-guest img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.ktsecret-guest .wait{display:grid;place-items:center;gap:4px;font-size:11px}.ktsecret-guest .wait b{font-size:30px;line-height:1}
.ktsecret-host-label,.ktsecret-guest-label{position:absolute;left:5px;bottom:5px;z-index:4;padding:2px 6px;border-radius:999px;background:#000b;font-size:9px;font-weight:950}.ktsecret-host-label{color:#ffe071}
.ktsecret-earn-row{position:absolute!important;right:8px!important;bottom:8px!important;z-index:30!important;width:118px!important;height:58px!important}.ktsecret-earn-row #myEarnHud{width:118px!important;height:58px!important;border:1px solid #d2a936!important;border-radius:12px!important;background:linear-gradient(135deg,#17140bf0,#0d0d12f0)!important;color:#fff!important;padding:4px!important;overflow:hidden!important}
.ktsecret-chatbox,.ktsecret-giftbox{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:12px;background:#09090c;overflow:hidden}
.ktsecret-chatbox{display:flex;flex-direction:column}.ktsecret-panel-head{height:38px;display:flex;align-items:center;gap:16px;padding:0 11px;border-bottom:1px solid #ff28c477;font-size:12px;font-weight:950}.ktsecret-panel-head b{color:#ff45cf}.ktsecret-chat{flex:1 1 0;min-height:0;padding:7px 10px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}.ktsecret-chat-line{display:flex;gap:7px;margin-top:5px;font-size:11px;font-weight:850}.ktsecret-chat-line b{color:#65c8ff}.ktsecret-chat-input{height:44px;margin:5px 7px 7px;border:1px solid #3d5270;border-radius:9px;display:flex;align-items:center;padding:0 10px;color:#9ab1ce;font-size:11px}
.ktsecret-giftbox{display:flex;flex-direction:column}.ktsecret-gifts{flex:1 1 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:6px}.ktsecret-gift{min-width:0;border:1px solid #d5a80e;border-radius:8px;background:#0f0f12;color:#fff;display:grid;place-items:center;align-content:center;gap:3px;font-size:10px;font-weight:900}.ktsecret-gift .emoji{font-size:28px;line-height:1}.ktsecret-gift img{width:40px;height:32px;object-fit:contain}.ktsecret-gift .gift-name{font-size:9px;color:#fff}.ktsecret-gift .gift-price{display:none!important}
.ktsecret-tools{flex:0 0 58px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px}.ktsecret-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;font-size:9px;display:grid;justify-items:center;gap:2px}.ktsecret-tool i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:17px}.ktsecret-tool span{font-size:8px}
#ktSecretPasswordBox,[id*="SecretPassword"],[class*="secret-password"],.ktsecret-password{display:none!important}
@media(max-width:430px){
 .ktsecret-room.kt-secret-second-layout-1111{padding-left:5px;padding-right:5px;gap:4px}
 .ktsecret-head{flex-basis:58px;padding:4px 7px}.ktsecret-title,.ktsecret-brand{font-size:17px}.ktsecret-att{min-width:98px;height:31px;font-size:11px}
 .ktsecret-airrow{flex-basis:36px;font-size:13px}.ktsecret-led{flex-basis:57px}.ktsecret-led-track{font-size:22px}
 .ktsecret-stats{flex-basis:42px}.ktsecret-stats button,.ktsecret-viewers{font-size:12px}
 .ktsecret-quick{flex-basis:44px}.ktsecret-quick button{font-size:12px}
 .ktsecret-main{grid-template-rows:minmax(0,1fr) 205px}
 .ktsecret-stage{grid-template-columns:56% 44%;gap:3px;padding:3px}.ktsecret-guests{gap:3px}
 .ktsecret-panel-head{height:34px;font-size:10px;gap:11px;padding:0 8px}.ktsecret-chat-input{height:40px}
 .ktsecret-gifts{gap:3px;padding:4px}.ktsecret-gift .emoji{font-size:23px}.ktsecret-gift img{width:34px;height:27px}.ktsecret-gift .gift-name{font-size:8px}
 .ktsecret-tools{flex-basis:52px}.ktsecret-tool i{width:32px;height:32px;font-size:15px}.ktsecret-tool span{font-size:7px}
}
</style>
<section class="ktsecret-room kt-secret-second-layout-1111">
 <div class="ktsecret-head">
  <div class="ktsecret-left"><button class="ktsecret-back" type="button">‹</button><div class="ktsecret-title"><i>●</i> 비밀방</div></div>
  <button class="ktsecret-att" type="button">🪽 출석체크 🪽</button>
  <div class="ktsecret-brand">K-Talk LIVE</div>
 </div>
 <div class="ktsecret-airrow"><span class="on">● ON AIR</span><span id="ktLiveClock">${esc(clock)}</span><span class="ktsecret-heart">♥ 109</span><button class="ktsecret-invite" type="button">👥 초청</button></div>
 <div class="ktsecret-led"><div class="ktsecret-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>
 <div class="ktsecret-stats"><button type="button">🔥 일일 랭킹</button><button type="button">🎯 미션</button><div class="ktsecret-viewers">시청자 <span id="ktSecretViewerCount">0</span>명 시청중 🏃</div></div>
 <div class="ktsecret-quick"><button type="button" class="ktsecret-flip">↻ 되돌리기</button><button type="button" class="ktsecret-treasure">🎁 보물상자</button><button type="button" class="ktsecret-match">⚔ 매치</button></div>
 <div class="ktsecret-main">
  <div class="ktsecret-stage">
   <div class="ktsecret-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="ktsecret-host-label">호스트</span></div>
   <div class="ktsecret-guests">
    ${[1,2,3,4,5,6].map(function(i){return '<div class="ktsecret-guest" data-secret-guest-slot="'+i+'"><div class="wait"><b>＋</b><span>게스트</span></div><span class="ktsecret-guest-label">게스트</span></div>';}).join('')}
   </div>
   <div class="ktsecret-earn-row"><button id="myEarnHud" type="button"><div style="display:flex;align-items:center;justify-content:center;gap:4px"><span style="font-size:7px;color:#8fe8ff;font-weight:950">🔒 내 수익</span><b id="hudEarnNet" style="font-size:10px;color:#ffe071">${esc(net)}</b></div><div id="myEarnDetail" style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:2px;font-size:6px;color:#ddd"><span id="hudEarnRoses">${esc(roses)}</span><span id="hudEarnRate" style="text-align:right">${esc(rate)}</span></div></button></div>
  </div>
  <div class="ktsecret-chatbox"><div class="ktsecret-panel-head"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div id="ktsecretChatList" class="ktsecret-chat"></div><button class="ktsecret-chat-input" type="button">메시지를 입력하세요...</button></div>
  <div class="ktsecret-giftbox"><div class="ktsecret-panel-head"><b>🎁 선물 / 후원</b><span style="margin-left:auto">후원 랭킹 ›</span></div><div class="ktsecret-gifts">
   <button class="ktsecret-gift" type="button"><img src="rose-single.svg" alt=""><span class="gift-name">장미</span></button>
   <button class="ktsecret-gift" type="button"><img src="rose-bouquet-50.svg" alt=""><span class="gift-name">장미다발</span></button>
   <button class="ktsecret-gift" type="button"><img src="rose-bouquet-100.svg" alt=""><span class="gift-name">특대장미</span></button>
   <button class="ktsecret-gift" type="button"><span class="emoji">💗</span><span class="gift-name">하트</span></button>
   <button class="ktsecret-gift" type="button"><span class="emoji">⭐</span><span class="gift-name">별</span></button>
   <button class="ktsecret-gift" type="button"><span class="emoji">🎈</span><span class="gift-name">풍선</span></button>
   <button class="ktsecret-gift" type="button"><span class="emoji">👑</span><span class="gift-name">왕관</span></button>
   <button class="ktsecret-gift" type="button"><span class="emoji">🏰</span><span class="gift-name">스페셜 선물</span></button>
   <button class="ktsecret-gift" type="button"><img src="gift-box.svg" alt=""><span class="gift-name">비밀 선물</span></button>
  </div></div>
 </div>
 <div class="ktsecret-tools">
  <button class="ktsecret-tool" type="button" data-action="camera"><i>📷</i><span>카메라</span></button>
  <button class="ktsecret-tool" type="button" data-action="mic"><i>🎤</i><span>마이크</span></button>
  <button class="ktsecret-tool" type="button" data-action="friends"><i>👥</i><span>친구</span></button>
  <button class="ktsecret-tool" type="button" data-action="message"><i>💬</i><span>메시지</span></button>
  <button class="ktsecret-tool" type="button" data-action="movie"><i>🎬</i><span>영화</span></button>
  <button class="ktsecret-tool" type="button" data-action="share"><i>↗</i><span>공유</span></button>
  <button class="ktsecret-tool" type="button" data-action="effect"><i>🪄</i><span>효과</span></button>
  <button class="ktsecret-tool" type="button" data-action="more"><i>•••</i><span>더보기</span></button>
 </div>
</section>`;

    var room=screen.querySelector('.ktsecret-room');
    var v=room&&room.querySelector('#ktLiveVideo');
    var s=liveStream();
    if(v&&s){try{v.srcObject=s;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}catch(e){}}

    function click(sel,fn){var el=room&&room.querySelector(sel);if(el)el.addEventListener('click',fn);}
    click('.ktsecret-back',function(){try{if(window.leaveBroadcastToDashboard)window.leaveBroadcastToDashboard();else if(window.home)window.home();}catch(e){}});
    click('.ktsecret-att',function(){try{if(window.openAttendanceBenefits)window.openAttendanceBenefits();}catch(e){}});
    click('.ktsecret-invite',function(){try{if(window.ktOpenSecretInvite20260928)window.ktOpenSecretInvite20260928();}catch(e){}});
    click('.ktsecret-flip',function(){try{if(window.ktAllRoomsFlipCamera)window.ktAllRoomsFlipCamera();}catch(e){}});
    click('.ktsecret-treasure',function(){try{if(window.openTreasureBox)window.openTreasureBox();else if(window.ktRenderTreasure)window.ktRenderTreasure();}catch(e){}});
    click('.ktsecret-match',function(){try{if(window.openMatch)window.openMatch();}catch(e){}});
    click('#myEarnHud',function(){try{if(window.toggleMyEarnings)window.toggleMyEarnings();}catch(e){}});
    click('.ktsecret-chat-input',function(){try{if(window.ktSecretOpenMessage)window.ktSecretOpenMessage();else if(window.openMessages)window.openMessages();}catch(e){}});
    room.querySelectorAll('.ktsecret-gift').forEach(function(b){b.addEventListener('click',function(){try{if(window.openGifts)window.openGifts();}catch(e){}});});
    room.querySelectorAll('.ktsecret-tool').forEach(function(b){b.addEventListener('click',function(){
      var a=b.dataset.action;
      try{
        if(a==='camera'&&window.ktBottomCameraToggle)return window.ktBottomCameraToggle(b);
        if(a==='mic'&&window.ktBottomMicToggle)return window.ktBottomMicToggle(b);
        if(a==='friends'&&window.shareApp)return window.shareApp();
        if(a==='message'&&window.openMessages)return window.openMessages();
        if(a==='movie'&&window.ktBottomMovieOpen)return window.ktBottomMovieOpen();
        if(a==='share'&&window.shareApp)return window.shareApp();
        if(a==='effect'&&window.openEditEffectPanel)return window.openEditEffectPanel();
        if(a==='more'&&window.ktSecretMore)return window.ktSecretMore();
      }catch(e){}
    });});

    return true;
  }

  /* 비밀번호 관련 UI/함수는 비밀방에서 사용하지 않음 */
  window.openPasswordRoomSetup=function(){
    try{if(window.openRoomPrep)window.openRoomPrep('비밀방',7);}catch(e){}
  };
  window.confirmPasswordRoom=function(){
    try{
      if(window.state){state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=7;delete state.roomPassword;delete state.liveRoomPassword;}
      if(window.closeSheet)window.closeSheet();
      if(window.directCreator)window.directCreator();
    }catch(e){}
  };

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'&&!oldStart.__ktSecretClean1111){
    var wrapped=async function(){
      var secret=isSecret();
      var r=await oldStart.apply(this,arguments);
      if(secret){setTimeout(render,20);setTimeout(render,100);setTimeout(render,350);}
      return r;
    };
    wrapped.__ktSecretClean1111=true;
    window.startBroadcast=wrapped;
  }

  function cleanPasswordArtifacts(){
    try{
      document.querySelectorAll('#ktSecretPasswordBox,[id*="SecretPassword"],[class*="secret-password"],.ktsecret-password').forEach(function(x){x.remove();});
    }catch(e){}
  }

  setInterval(function(){cleanPasswordArtifacts();if(isSecret())render();},300);
  try{
    new MutationObserver(function(){cleanPasswordArtifacts();if(isSecret())setTimeout(render,20);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  cleanPasswordArtifacts();
  setTimeout(render,80);
})();