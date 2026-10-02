/* K-Talk 비밀방 전용 최종 화면 1111
   - 비밀번호 UI/검사 제거
   - 두 번째 기준 화면으로 고정
   - 선물 금액/코인 금액 표시 안 함
   - 다른 방은 건드리지 않음 */
(function(){
  if(window.__ktSecretSecondLayout1111)return;
  window.__ktSecretSecondLayout1111=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isSecret(){
    try{
      if(document.querySelector('#screen .ktsecret-room'))return true;
      var t=String(window.state&&state.liveRoomType||'');
      var n=String(window.state&&state.liveRoomName||'');
      return t==='password'||n.indexOf('비밀')>-1;
    }catch(e){return false;}
  }

  function clearPassword(){
    try{
      localStorage.removeItem('kt_secret_room_password');
      localStorage.removeItem('ktalk_secret_room_password');
    }catch(e){}
    try{
      if(window.state){
        state.liveRoomPassword='';
        state.roomPassword='';
      }
    }catch(e){}
    try{
      document.querySelectorAll('#ktSecretPasswordBox,#ktSecretPassword,#ktSecretPasswordSave,#ktSecretPasswordError').forEach(function(el){
        var box=el.id==='ktSecretPasswordBox'?el:el.closest&&el.closest('#ktSecretPasswordBox');
        if(box&&box.remove)box.remove();else if(el&&el.remove)el.remove();
      });
    }catch(e){}
  }

  window.ktSecretChangePassword=function(){ return false; };
  window.ktSecretMore=function(){
    if(typeof window.showSheet!=='function')return;
    showSheet('더보기',
      '<button class="act" onclick="closeSheet();if(window.openLiveSettings)openLiveSettings()">⚙ 설정</button>'+
      '<button class="act" onclick="closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()" style="background:linear-gradient(135deg,#d9274c,#ff4669)">■ 방송 종료</button>'
    );
  };

  function clockText(){
    try{return String((document.getElementById('ktLiveClock')||{}).textContent||'00:00:00');}catch(e){return '00:00:00';}
  }
  function viewerText(){
    try{
      var txt=String((document.querySelector('.ktg13-viewers,.ktsecret-viewers,.kt-viewer-count')||{}).textContent||'');
      var m=txt.match(/(\d+)/);
      return m?m[1]:'0';
    }catch(e){return '0';}
  }
  function likeText(){
    try{
      var el=document.querySelector('.kt-like-count,.ktsecret-like-count,[data-like-count]');
      var v=String(el&&el.textContent||'');
      var m=v.match(/(\d+)/);
      return m?m[1]:'0';
    }catch(e){return '0';}
  }
  function netText(){
    try{return String((document.getElementById('hudEarnNet')||{}).textContent||'0원');}catch(e){return '0원';}
  }
  function roseText(){
    try{return String((document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이');}catch(e){return '🌹 0송이';}
  }

  function gift(icon,name,img){
    var art=img?'<img src="'+img+'" alt="'+esc(name)+'">':'<span class="ktsecret2-gift-emoji">'+icon+'</span>';
    return '<button class="ktsecret2-gift" type="button" onclick="if(window.openGifts)openGifts()">'+art+'<b>'+esc(name)+'</b></button>';
  }

  function chatHtml(){
    try{
      var msgs=Array.isArray(window.ktSecretChatMessages)?window.ktSecretChatMessages.slice(-5):[];
      if(!msgs.length)return '<div class="ktsecret2-chat-empty">메시지를 입력하세요...</div>';
      return msgs.map(function(m){
        return '<div class="ktsecret2-chat-line"><b>'+esc(m.name||'나')+'</b><span>'+esc(m.text||'')+'</span></div>';
      }).join('');
    }catch(e){return '';}
  }

  function render(){
    if(!isSecret())return false;
    clearPassword();
    var screen=document.getElementById('screen');
    if(!screen)return false;

    var oldStream=null;
    try{
      var oldVideo=screen.querySelector('#ktLiveVideo,.ktsecret-slot.host video');
      oldStream=(oldVideo&&oldVideo.srcObject)||(window.state&&state.stream)||null;
    }catch(e){}

    var clock=clockText(), viewers=viewerText(), likes=likeText(), net=netText(), roses=roseText();

    screen.innerHTML='<style id="ktSecretSecondLayout1111Style">'+
      '#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'+
      '.ktsecret-room.kt-secret-second-layout-1111{width:100%;height:100dvh;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:4px 7px calc(4px + env(safe-area-inset-bottom));overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'+
      '.ktsecret2-head{height:58px;flex:0 0 58px;border-radius:18px;background:linear-gradient(180deg,#17171a,#0c0c0f);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:4px 10px}.ktsecret2-left{display:flex;align-items:center;gap:7px;min-width:0}.ktsecret2-back{width:32px;height:32px;border:1px solid #ffffff35;border-radius:50%;background:#111;color:#fff;font-size:25px}.ktsecret2-title{font-size:19px;font-weight:950;white-space:nowrap}.ktsecret2-title i{font-style:normal;color:#ff315f}.ktsecret2-att{justify-self:center;height:30px;min-width:100px;border:2px solid #ff2bbd;border-radius:18px;background-color:#130714;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:8px 8px;color:#ffd52f;font-size:12px;font-weight:950;box-shadow:0 0 8px #ff2bbd}.ktsecret2-brand{justify-self:end;color:#ff3d78;font-size:19px;font-weight:950;white-space:nowrap}'+
      '.ktsecret2-air{height:33px;flex:0 0 33px;display:flex;align-items:center;padding:0 10px;font-weight:950}.ktsecret2-air .on{color:#ff315f;margin-right:8px}.ktsecret2-like{margin-left:14px;border:1px solid #e33a75;border-radius:999px;padding:4px 12px;color:#fff;background:#2b0d1a}.ktsecret2-invite{margin-left:auto;border:1px solid #d4a82a;border-radius:999px;background:#17140b;color:#ffe071;padding:6px 14px;font-weight:950}'+
      '.ktsecret2-led{height:52px;flex:0 0 52px;position:relative;border:2px solid #ff28c4;border-radius:22px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466}.ktsecret2-ledtrack{position:absolute;inset:0 auto 0 0;display:flex;align-items:center;white-space:nowrap;animation:ktsecret2Marquee 12s linear infinite;font-size:22px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktsecret2-ledtrack span{padding-right:75px}.ktsecret2-ledtrack b{color:#ff59c9}@keyframes ktsecret2Marquee{from{transform:translateX(40%)}to{transform:translateX(-100%)}}'+
      '.ktsecret2-stats,.ktsecret2-quick{height:44px;flex:0 0 44px;display:grid;gap:4px}.ktsecret2-stats{grid-template-columns:1fr 1fr 1.35fr}.ktsecret2-quick{grid-template-columns:1fr 1fr 1fr}.ktsecret2-stats button,.ktsecret2-quick button,.ktsecret2-viewers{border:0;border-radius:13px;background:#111114;color:#fff;font-size:14px;font-weight:950;display:flex;align-items:center;justify-content:center;gap:5px}'+
      '.ktsecret2-main{flex:1 1 0;min-height:0;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);grid-template-rows:minmax(0,1fr) minmax(170px,34%);gap:5px;overflow:hidden}'+
      '.ktsecret2-stage{grid-column:1/-1;display:grid;grid-template-columns:57% 43%;gap:4px;min-height:0;border:2px solid #ff28c4;border-radius:10px;padding:3px;background:#09090c;overflow:hidden}.ktsecret2-host{position:relative;min-width:0;min-height:0;border-radius:8px;overflow:hidden;background:#111}.ktsecret2-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transform:scaleX(-1);background:#111}.ktsecret2-hostbadge{position:absolute;left:6px;top:6px;z-index:4;border:1px solid #caa332;border-radius:999px;background:#18140d;color:#fff;padding:3px 7px;font-size:9px;font-weight:950}'+
      '.ktsecret2-guestgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;min-height:0}.ktsecret-guest-slot{position:relative;min-width:0;min-height:0;border:1px solid #44454d;border-radius:7px;background:#111116;overflow:hidden;display:grid;place-items:center;color:#ddd}.ktsecret-guest-slot video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#111}.ktsecret-guest-empty{display:grid;place-items:center;gap:3px;font-size:12px;font-weight:900}.ktsecret-guest-empty b{width:34px;height:34px;border:1px solid #686975;border-radius:50%;display:grid;place-items:center;font-size:26px}.ktsecret-guest-name{position:absolute;left:4px;bottom:4px;z-index:3;font-size:8px;background:#000b;border-radius:8px;padding:2px 5px}.ktsecret2-earn{position:relative;min-width:0;min-height:0;border:1px solid #d1a62c;border-radius:8px;background:linear-gradient(135deg,#17140b,#0d0d12);display:grid;place-items:center;padding:4px;text-align:center}.ktsecret2-earn b{color:#ffe071}.ktsecret2-earn small{font-size:8px;color:#ddd}'+
      '.ktsecret2-chatbox,.ktsecret2-giftbox{min-width:0;min-height:0;border:2px solid #ff28c4;border-radius:10px;background:#09090c;overflow:hidden;display:flex;flex-direction:column}.ktsecret2-panelhead{height:32px;flex:0 0 32px;display:flex;align-items:center;gap:13px;padding:0 9px;border-bottom:1px solid #ff28c477;font-size:11px;font-weight:950}.ktsecret2-panelhead b{color:#ff45cf}.ktsecret2-chatlist{flex:1 1 0;overflow:hidden;padding:5px 8px;display:flex;flex-direction:column;justify-content:flex-end}.ktsecret2-chat-line{display:flex;gap:7px;margin-top:4px;font-size:10px;font-weight:850}.ktsecret2-chat-line b{color:#65c8ff}.ktsecret2-chat-line span{color:#fff}.ktsecret2-chat-empty{color:#8fa2bf;font-size:10px}.ktsecret2-chatinput{height:38px;flex:0 0 38px;margin:4px 6px 6px;border:1px solid #405779;border-radius:8px;display:flex;align-items:center;padding:0 8px;color:#9ab1ce;font-size:10px}'+
      '.ktsecret2-gifts{flex:1 1 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;padding:5px}.ktsecret2-gift{min-width:0;border:1px solid #d5a80e;border-radius:7px;background:#0f0f12;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;overflow:hidden}.ktsecret2-gift img{width:40px;height:31px;object-fit:contain}.ktsecret2-gift-emoji{font-size:25px;line-height:1}.ktsecret2-gift b{font-size:8px;line-height:1.05}'+
      '.ktsecret2-tools{height:55px;flex:0 0 55px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px}.ktsecret2-tool{border:0;background:none;color:#fff;display:grid;justify-items:center;gap:2px;font-weight:900}.ktsecret2-tool i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:17px}.ktsecret2-tool span{font-size:8px;white-space:nowrap}'+
      '@media(max-width:390px){.ktsecret-room.kt-secret-second-layout-1111{padding-left:4px;padding-right:4px;gap:3px}.ktsecret2-head{height:54px;flex-basis:54px;padding:4px 6px}.ktsecret2-title,.ktsecret2-brand{font-size:16px}.ktsecret2-att{min-width:82px;height:27px;font-size:10px}.ktsecret2-led{height:46px;flex-basis:46px}.ktsecret2-ledtrack{font-size:19px}.ktsecret2-stats,.ktsecret2-quick{height:40px;flex-basis:40px}.ktsecret2-stats button,.ktsecret2-quick button,.ktsecret2-viewers{font-size:11px}.ktsecret2-main{grid-template-rows:minmax(0,1fr) minmax(160px,35%)}.ktsecret2-tools{height:50px;flex-basis:50px}.ktsecret2-tool i{width:32px;height:32px;font-size:15px}.ktsecret2-tool span{font-size:7px}}'+
      '</style>'+
      '<section class="ktsecret-room kt-secret-second-layout-1111">'+
        '<div class="ktsecret2-head"><div class="ktsecret2-left"><button class="ktsecret2-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktsecret2-title"><i>●</i> 비밀방</div></div><button class="ktsecret2-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">🪽 출석체크 🪽</button><div class="ktsecret2-brand">K-Talk LIVE</div></div>'+
        '<div class="ktsecret2-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><span class="ktsecret2-like">♥ '+esc(likes)+'</span><button class="ktsecret2-invite" onclick="if(window.ktOpenSecretInvite20260928)ktOpenSecretInvite20260928()">👥 초청</button></div>'+
        '<div class="ktsecret2-led"><div class="ktsecret2-ledtrack"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
        '<div class="ktsecret2-stats"><button type="button" onclick="if(window.showSheet)showSheet(\'🔥 일일 랭킹\',\'<div class=rowbox>오늘의 라이브 랭킹</div>\')">🔥 일일 랭킹</button><button type="button" onclick="if(window.showSheet)showSheet(\'🎯 미션\',\'<div class=rowbox>오늘의 미션</div>\')">🎯 미션</button><div class="ktsecret2-viewers">시청자 '+esc(viewers)+'명 시청중 🏃</div></div>'+
        '<div class="ktsecret2-quick"><button type="button" onclick="return window.ktAllRoomsFlipCamera?ktAllRoomsFlipCamera():false">↻ 되돌리기</button><button type="button" onclick="if(window.ktRenderTreasure)ktRenderTreasure();else if(window.openTreasure)openTreasure()">🎁 보물상자</button><button type="button" onclick="if(window.openMatch)openMatch();else if(window.showSheet)showSheet(\'⚔ 매치\',\'<div class=rowbox>매치</div>\')">⚔ 매치</button></div>'+
        '<div class="ktsecret2-main">'+
          '<div class="ktsecret2-stage">'+
            '<div class="ktsecret2-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span class="ktsecret2-hostbadge">🌹1000</span><span class="ktsecret-slot-label" style="display:none">호스트</span></div>'+
            '<div class="ktsecret2-guestgrid">'+
              '<div class="ktsecret-guest-slot ktsecret-slot" data-guest-slot="1"><div class="ktsecret-guest-empty"><b>+</b><span>게스트</span></div><span class="ktsecret-guest-name">게스트</span></div>'+
              '<div class="ktsecret-guest-slot ktsecret-slot" data-guest-slot="2"><div class="ktsecret-guest-empty"><b>+</b><span>게스트</span></div><span class="ktsecret-guest-name">게스트</span></div>'+
              '<div class="ktsecret-guest-slot ktsecret-slot" data-guest-slot="3"><div class="ktsecret-guest-empty"><b>+</b><span>게스트</span></div><span class="ktsecret-guest-name">게스트</span></div>'+
              '<div class="ktsecret-guest-slot ktsecret-slot" data-guest-slot="4"><div class="ktsecret-guest-empty"><b>+</b><span>게스트</span></div><span class="ktsecret-guest-name">게스트</span></div>'+
              '<div class="ktsecret-guest-slot ktsecret-slot" data-guest-slot="5"><div class="ktsecret-guest-empty"><b>+</b><span>게스트</span></div><span class="ktsecret-guest-name">게스트</span></div>'+
              '<div class="ktsecret2-earn"><div>🔒 내 수익 <b>'+esc(net)+'</b></div><small>'+esc(roses)+' · 일반회원 35%</small></div>'+
            '</div>'+
          '</div>'+
          '<div class="ktsecret2-chatbox"><div class="ktsecret2-panelhead"><b>채팅</b><span>참가자</span><span>팬클럽</span><span>공지</span></div><div id="ktsecretChatList" class="ktsecret2-chatlist">'+chatHtml()+'</div><div class="ktsecret2-chatinput" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()">☺　메시지를 입력하세요...</div></div>'+
          '<div class="ktsecret2-giftbox"><div class="ktsecret2-panelhead"><b>🎁 선물 / 후원</b><span style="margin-left:auto">후원 랭킹 ›</span></div><div class="ktsecret2-gifts">'+
            gift('','장미','rose-single.svg')+gift('','장미다발','rose-bouquet-50.svg')+gift('','특대장미','rose-bouquet-100.svg')+
            gift('💗','하트','')+gift('⭐','별','')+gift('🎈','풍선','')+
            gift('👑','황금 왕관','')+gift('🏰','스페셜 선물','')+gift('🎁','비밀 선물','')+
          '</div></div>'+
        '</div>'+
        '<div class="ktsecret2-tools">'+
          '<button class="ktsecret2-tool" onclick="return window.ktBottomCameraToggle?ktBottomCameraToggle(this):false"><i>📷</i><span>카메라</span></button>'+
          '<button class="ktsecret2-tool" onclick="return window.ktBottomMicToggle?ktBottomMicToggle(this):false"><i>🎤</i><span>마이크</span></button>'+
          '<button class="ktsecret2-tool" onclick="if(window.shareApp)shareApp()"><i>👥</i><span>친구</span></button>'+
          '<button class="ktsecret2-tool" onclick="if(window.ktSecretOpenMessage)ktSecretOpenMessage()"><i>💬</i><span>메시지</span></button>'+
          '<button class="ktsecret2-tool" onclick="return window.ktBottomMovieOpen?ktBottomMovieOpen():false"><i>🎬</i><span>영화</span></button>'+
          '<button class="ktsecret2-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'+
          '<button class="ktsecret2-tool" onclick="if(window.ktSecretEffect)ktSecretEffect()"><i>🪄</i><span>효과</span></button>'+
          '<button class="ktsecret2-tool" onclick="if(window.ktSecretMore)ktSecretMore()"><i>•••</i><span>더보기</span></button>'+
        '</div>'+
      '</section>';

    var v=document.getElementById('ktLiveVideo');
    try{
      var stream=oldStream||(window.state&&state.stream)||null;
      if(v&&stream){v.srcObject=stream;var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}
    }catch(e){}

    try{
      window.dispatchEvent(new CustomEvent('kt-secret-second-layout-ready',{detail:{at:Date.now()}}));
      if(typeof window.ktForceApprovedGuestGridNow20260924==='function')setTimeout(window.ktForceApprovedGuestGridNow20260924,80);
    }catch(e){}
    return true;
  }

  window.ktRenderSecretSecondLayout1111=render;

  /* 비밀방 선택 시 비밀번호 상태를 만들지 않음 */
  document.addEventListener('click',function(e){
    try{
      var b=e.target&&e.target.closest&&e.target.closest('button');
      if(!b)return;
      var t=String(b.textContent||'');
      if(t.indexOf('비밀방')>-1){
        clearPassword();
        if(window.state){state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=7;}
      }
    }catch(err){}
  },true);

  /* 방송 시작 전 준비화면은 절대 건드리지 않는다.
     실제 비밀방이 열린 뒤에만 두 번째 사진 레이아웃으로 교체한다. */
  var busy=false;
  function secretBroadcastHasStarted(){
    try{
      var room=document.querySelector('#screen .ktsecret-room');
      if(room)return true;
      var cr=window.creator||document.getElementById('creator');
      if(cr&&(cr.classList.contains('show')||cr.classList.contains('live-prep-open')))return false;
      var s=document.getElementById('screen');
      var txt=String(s&&s.textContent||'');
      return isSecret() && txt.indexOf('ON AIR')>-1;
    }catch(e){return false;}
  }
  function enforce(){
    if(busy)return;
    if(!secretBroadcastHasStarted())return;
    var room=document.querySelector('#screen .ktsecret-room');
    if(room&&room.classList.contains('kt-secret-second-layout-1111')){clearPassword();return;}
    busy=true;
    try{render();}finally{setTimeout(function(){busy=false;},60);}
  }

  [60,160,320,650,1100,1800].forEach(function(ms){setTimeout(enforce,ms);});
  setInterval(enforce,500);
  try{
    new MutationObserver(function(){setTimeout(enforce,20);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();