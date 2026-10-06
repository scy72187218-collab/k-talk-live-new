/* 1111: 1인 방송만 9명방 사진 기준 상/중/하단 구성으로 재구성.
   다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSoloNineStyle1111)return;
  window.__ktSoloNineStyle1111=true;
  var oldStart=window.startTestBroadcast;

  function isSolo(){
    try{
      var st=window.state||{};
      var txt=[st.liveRoomType,st.liveRoomName,st.prepRoomType,st.prepRoomName,(document.getElementById('liveTitle')||{}).value].join(' ');
      return /1\s*인|solo/.test(String(txt)) && !/9\s*명|13\s*명|15\s*명|구독|비밀/.test(String(txt));
    }catch(e){return false;}
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function clockText(){try{return (document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';}catch(e){return '00:00:00';}}
  function style(){
    if(document.getElementById('ktSoloNineStyle1111'))return;
    var s=document.createElement('style');s.id='ktSoloNineStyle1111';s.textContent=`
#screen{padding:0!important;margin:0!important;height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}
.ktsolo-room{width:100%;height:100dvh;display:flex;flex-direction:column;gap:4px;padding:4px 7px calc(5px + env(safe-area-inset-bottom));background:#000;color:#fff;overflow:hidden;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}
.ktsolo-head{flex:0 0 64px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 12px}.ktsolo-air strong{display:block;font-size:20px;font-weight:950}.ktsolo-air strong i,.ktsolo-air small i{font-style:normal;color:#ff315f}.ktsolo-air small{display:block;margin-top:5px;font-size:12px;font-weight:900}.ktsolo-brand{justify-self:end;color:#ff3d78;font-size:20px;font-weight:950;white-space:nowrap}.ktsolo-attend{justify-self:center;min-width:132px;height:43px;padding:0 14px;border-radius:19px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:18px;font-weight:950;box-shadow:0 0 8px #ff2bbd,0 0 18px #ff2bbd66;white-space:nowrap}
.ktsolo-led{flex:0 0 58px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsolo-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktSoloMarquee 12s linear infinite;font-size:23px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsolo-led-track span{display:inline-block;padding-right:80px}.ktsolo-led-track b{color:#ff59c9}@keyframes ktSoloMarquee{from{transform:translateX(55%)}to{transform:translateX(-100%)}}
.ktsolo-three{flex:0 0 46px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.ktsolo-three button{border:1px solid #ffffff20;border-radius:12px;background:#111114;color:#fff;font-size:13px;font-weight:950}
.ktsolo-stats{flex:0 0 42px;display:grid;grid-template-columns:.92fr .72fr 1.36fr;gap:3px}.ktsolo-stats button,.ktsolo-viewers{border:0;border-radius:10px;background:#111114;color:#fff;font-size:12px;font-weight:950;display:flex;align-items:center;justify-content:center;white-space:nowrap}
.ktsolo-main{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-radius:8px;background:#08080b}.ktsolo-main video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}.ktsolo-earn{position:absolute;left:50%;bottom:6px;transform:translateX(-50%);z-index:5;min-width:150px;padding:6px 12px;border:1px solid #d2a936;border-radius:999px;background:#11100ddd;color:#ffe071;font-weight:950;text-align:center}
.ktsolo-bottom{flex:0 0 54px;display:grid;grid-template-columns:minmax(0,1.8fr) repeat(4,52px);gap:5px;align-items:center}.ktsolo-chat{height:44px;border:1px solid #ffffff44;border-radius:999px;background:#111114;color:#fff;padding:0 13px;min-width:0}.ktsolo-bottom button{height:44px;border:1px solid #ffffff2b;border-radius:50%;background:#15151a;color:#fff;font-size:21px;font-weight:950}.ktsolo-bottom .rose{color:#ff436d}.ktsolo-bottom .gift{background:#5a371d}
@media(max-width:390px){.ktsolo-room{padding-left:4px;padding-right:4px;gap:3px}.ktsolo-head{flex-basis:58px;padding:4px 8px}.ktsolo-air strong{font-size:18px}.ktsolo-air small{font-size:10px}.ktsolo-brand{font-size:17px}.ktsolo-attend{min-width:112px;height:38px;font-size:15px;padding:0 8px}.ktsolo-led{flex-basis:50px}.ktsolo-led-track{font-size:20px}.ktsolo-three{flex-basis:42px}.ktsolo-stats{flex-basis:38px}.ktsolo-stats button,.ktsolo-viewers{font-size:10px}.ktsolo-bottom{grid-template-columns:minmax(0,1.7fr) repeat(4,44px)}}
`;document.head.appendChild(s);
  }
  function flip(btn){try{if(window.ktUnifiedQuickFlip)return ktUnifiedQuickFlip(btn);if(window.flipCamera)return flipCamera();}catch(e){}}
  function treasure(){try{if(window.placeTreasureChest)return placeTreasureChest();if(window.openTreasureBox)return openTreasureBox();if(window.openTreasure)return openTreasure();if(window.openPackageBox)return openPackageBox();}catch(e){}}
  function match(){try{if(window.openHostMatchArena)return openHostMatchArena('1대1');if(window.openMatchArena)return openMatchArena('1대1');if(window.openMatch)return openMatch();}catch(e){}}
  function ranking(){try{if(window.ktGroup13Ranking)return ktGroup13Ranking();if(window.showSheet)return showSheet('🔥 일일 랭킹','<div class="rowbox"><b>일일 랭킹</b><br>오늘의 방송 랭킹을 확인합니다.</div>');}catch(e){}}
  function mission(){try{if(window.showSheet)return showSheet('🎯 미션','<div class="rowbox"><b>1단계 🌹 장미</b><br>장미 50개 깨기</div><div class="rowbox"><b>2단계 💗 하트</b><br>하트 30개짜리 20개 깨기</div><div class="rowbox"><b>3단계 🎈 풍선</b><br>풍선 80개짜리 10개 깨기</div>');}catch(e){}}
  function render(){
    style();var s=document.getElementById('screen');if(!s)return;
    var n=window.__ktDemoViewerCount||8;window.__ktDemoViewerCount=n;
    s.innerHTML='<section class="ktsolo-room">'
      +'<div class="ktsolo-head"><div class="ktsolo-air"><strong><i>●</i> 1인 방송</strong><small><i>● ON AIR</i> <span id="ktLiveClock">'+esc(clockText())+'</span></small></div><button class="ktsolo-attend" type="button">🪽 출석체크 🪽</button><div class="ktsolo-brand">K-Talk LIVE</div></div>'
      +'<div class="ktsolo-led"><div class="ktsolo-led-track"><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span><span>💗 <b>K-Talk LIVE</b> 환영합니다 ✨ 즐거운 방송 되세요 🌹</span></div></div>'
      +'<div class="ktsolo-three"><button data-solo-flip>↻ 되돌리기</button><button data-solo-treasure>🎁 보물상자</button><button data-solo-match>⚔ 매치</button></div>'
      +'<div class="ktsolo-stats"><button data-solo-rank>🔥 일일 랭킹</button><button data-solo-mission>🎯 미션</button><div class="ktsolo-viewers">시청자 '+n+'명이 시청중 🏃</div></div>'
      +'<div class="ktsolo-main"><video id="ktLiveVideo" autoplay playsinline muted></video><button class="ktsolo-earn" type="button">🔒 내 수익&nbsp; <b id="hudEarnNet">0원</b></button></div>'
      +'<div class="ktsolo-bottom"><input id="ktSoloChatInput" class="ktsolo-chat" placeholder="채팅 보내기"><button data-solo-person title="사람">👥</button><button class="rose" data-solo-rose title="장미">🌹</button><button class="gift" data-solo-gift title="선물박스">🎁</button><button data-solo-share title="공유">↗</button></div>'
      +'</section>';
    var v=document.getElementById('ktLiveVideo');try{var st=window.state||{},stream=st.stream||((document.getElementById('camera')||{}).srcObject);if(v&&stream){v.srcObject=stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
    var q=function(sel,fn){var e=s.querySelector(sel);if(e)e.onclick=fn;};
    q('.ktsolo-attend',function(){try{if(window.ktAttendanceCheck)ktAttendanceCheck();}catch(e){}});
    q('[data-solo-flip]',function(){flip(this)});q('[data-solo-treasure]',treasure);q('[data-solo-match]',match);q('[data-solo-rank]',ranking);q('[data-solo-mission]',mission);
    q('[data-solo-person]',function(){try{if(window.ktGroup13Friends)return ktGroup13Friends();if(window.openFriends)return openFriends();}catch(e){}});
    q('[data-solo-rose]',function(){try{if(window.openGifts)return openGifts();}catch(e){}});
    q('[data-solo-gift]',function(){try{if(window.openGifts)return openGifts();if(window.openPackageBox)return openPackageBox();}catch(e){}});
    q('[data-solo-share]',function(){try{if(window.shareApp)return shareApp();}catch(e){}});
  }
  window.ktOpenSoloNineStyle1111=render;
  if(typeof oldStart==='function')window.startTestBroadcast=async function(){
    if(!isSolo())return oldStart.apply(this,arguments);
    var ok=true;try{if(window.ensureLiveCamera)ok=await ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
    try{if(window.creator)creator.classList.remove('show','live-prep-open');document.body.classList.remove('kt-home');}catch(e){}
    render();return ok;
  };
})();