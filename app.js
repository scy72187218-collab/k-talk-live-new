var state={joined:false,adult:false,stream:null,raffle:3,saved:false,mic:true,ai:true};
var screen=document.getElementById('screen');
var creator=document.getElementById('creator');
var camera=document.getElementById('camera');
var sheet=document.getElementById('sheet');
var sheetTitle=document.getElementById('sheetTitle');
var sheetBody=document.getElementById('sheetBody');

window.activate=function(name){document.querySelectorAll('[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});};
window.showSheet=function(title,html){sheetTitle.innerHTML=title;sheetBody.innerHTML=html;sheet.classList.add('show');};
window.closeSheet=function(){sheet.classList.remove('show');sheet.classList.remove('gift-exact');};

window.home=function(){
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>홈 동영상 보기</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};
window.media=function(type){
  document.body.classList.remove('kt-home');
  var label=type==='shorts'?'쇼츠':'동영상';
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>'+label+' 보기 화면</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};
window.friends=function(){document.body.classList.remove('kt-home');screen.innerHTML='<section class="friends-page"><div class="friends-head"><b>방송목록</b></div><div class="friends-list"><div class="friend-row"><div class="friend-info"><b>현재 방송목록</b><span>방송이 시작되면 여기에 표시됩니다.</span></div></div></div></section>';};

state.cameraFacing=state.cameraFacing||'user';
state.beautyOn=!!state.beautyOn;
state.effectOn=!!state.effectOn;

window.openCreator=function(){
  creator.classList.add('show');
  var live=state.stream&&state.stream.getTracks&&state.stream.getTracks().some(function(t){return t.readyState==='live';});
  if(live){
    camera.srcObject=state.stream;
    creator.classList.add('camera-on');
    try{camera.play();}catch(e){}
  }
};
window.closeCreator=function(){
  creator.classList.remove('show','camera-on');
  if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;if(camera)camera.srcObject=null;}
};

window.ensureLiveCamera=async function(facing){
  try{
    var live=state.stream&&state.stream.getTracks&&state.stream.getTracks().some(function(t){return t.readyState==='live';});
    if(live){
      camera.srcObject=state.stream;
      creator.classList.add('camera-on');
      try{await camera.play();}catch(e){}
      return true;
    }
    state.cameraFacing=facing||state.cameraFacing||'user';
    state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:state.cameraFacing}},audio:true});
    camera.srcObject=state.stream;
    camera.muted=true;
    creator.classList.add('camera-on');
    try{await camera.play();}catch(e){}
    return true;
  }catch(e){
    creator.classList.remove('camera-on');
    return false;
  }
};

window.startBroadcast=async function(){
  var ok=await ensureLiveCamera(state.cameraFacing||'user');
  if(!ok)return;
};

window.prepTap=async function(el,name){
  if(el){el.classList.add('test-active');setTimeout(function(){el.classList.remove('test-active');},180);}
  if(name==='보정'||name==='뷰티'){
    openBeautyPanel();
    return;
  }
  if(name==='편집효과'){
    state.effectOn=!state.effectOn;
    creator.classList.toggle('effect-on',state.effectOn);
    if(el)el.classList.toggle('prep-on',state.effectOn);
    return;
  }
  if(name==='전환'){
    state.cameraFacing=(state.cameraFacing==='environment')?'user':'environment';
    try{
      if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;}
      if(camera)camera.srcObject=null;
      await ensureLiveCamera(state.cameraFacing);
    }catch(e){}
    return;
  }
  if(name==='설정'){ showSheet('⚙ 라이브 설정','<div class="rowbox"><b>카메라 · 마이크 · 방송 설정</b><br>방송 전 필요한 설정을 확인할 수 있습니다.</div>'); return; }
  if(name==='멀티게스트'){ if(window.openRoomTypeChooser)openRoomTypeChooser(); return; }
  if(name==='서비스'){ showSheet('서비스+','<div class="rowbox"><b>K-Talk 라이브 서비스+</b><br>라이브 방송 관련 기능을 이용할 수 있습니다.</div>'); return; }
  if(name==='팬클럽'){ if(window.openSubs)openSubs(); return; }
  if(name==='소통하기'){ showSheet('💬 소통하기','<div class="rowbox"><b>채팅 · 시청자 소통</b><br>방송 중 시청자와 소통하는 기능입니다.</div>'); return; }
  if(name==='공유'){ if(window.shareApp)shareApp(); return; }
  if(name==='프로모션'){ showSheet('🔥 프로모션','<div class="rowbox"><b>방송 홍보</b><br>방송을 더 많은 사람에게 알리는 기능입니다.</div>'); return; }
  if(name==='라이브 보상'){ showSheet('★ 라이브 보상','<div class="rowbox"><b>라이브 보상</b><br>방송 참여 보상과 이벤트를 확인하는 곳입니다.</div>'); return; }
};

window.openBeautyPanel=function(){
  var html='<div class="beauty-choice-grid">'
    +'<button onclick="setBeautyMode(\'natural\',\'\')"><b>✨</b><span>자연 보정</span></button>'
    +'<button onclick="setBeautyMode(\'bright\',\'\')"><b>☀️</b><span>밝게</span></button>'
    +'<button onclick="setBeautyMode(\'soft\',\'\')"><b>🌸</b><span>부드럽게</span></button>'
    +'<button onclick="setBeautyMode(\'glow\',\'\')"><b>💖</b><span>화사하게</span></button>'
    +'<button onclick="setBeautyMode(\'natural\',\'🐰\')"><b>🐰</b><span>토끼 캐릭터</span></button>'
    +'<button onclick="setBeautyMode(\'natural\',\'🐱\')"><b>🐱</b><span>고양이 캐릭터</span></button>'
    +'<button onclick="setBeautyMode(\'natural\',\'👑\')"><b>👑</b><span>왕관 캐릭터</span></button>'
    +'<button onclick="setBeautyMode(\'off\',\'\')"><b>↺</b><span>보정 해제</span></button>'
    +'</div>';
  showSheet('✨ 보정 · 캐릭터',html);
};

window.setBeautyMode=function(mode,char){
  state.beautyMode=mode;
  creator.classList.remove('beauty-natural','beauty-bright','beauty-soft','beauty-glow');
  if(mode!=='off')creator.classList.add('beauty-'+mode);
  if(char)creator.setAttribute('data-beauty-char',char);
  else creator.removeAttribute('data-beauty-char');
  closeSheet();
  var btn=[].slice.call(document.querySelectorAll('.prep-item')).find(function(b){return b.textContent.indexOf('보정')>-1;});
  if(btn)btn.classList.toggle('prep-on',mode!=='off'||!!char);
};

window.selectPrepRoom=function(el,type,label,max){
  state.liveRoomType=type;
  state.liveRoomName=label;
  state.liveRoomMax=max;
  document.querySelectorAll('.room-switch').forEach(function(b){b.classList.remove('on');});
  if(el)el.classList.add('on');
  var title=document.getElementById('liveTitle');
  if(title && (!title.value || title.value==='오늘 라이브 제목을 입력하세요' || title.dataset.autoRoom==='1')){
    title.value=label;
    title.dataset.autoRoom='1';
  }
};

window.prepBottomTap=function(el,name){
  document.querySelectorAll('.prep-bottom span').forEach(function(s){s.classList.remove('on');});
  if(el)el.classList.add('on');
};

window.needJoin=function(msg){showSheet('가입하기','<div class="note">'+msg+'</div><button class="act social naver" onclick="join(\'네이버\')">네이버로 계속하기</button><button class="act social kakao" onclick="join(\'카카오\')">카카오로 계속하기</button><button class="act social google" onclick="join(\'Google\')">Google로 계속하기</button><div class="note">현재는 화면 작동 확인용 테스트입니다.</div>');};
window.join=function(provider){showSheet('로그인 확인','<div class="rowbox"><b>'+provider+' 로그인 버튼 작동 확인</b></div><button class="act" onclick="closeSheet()">확인</button>');};
window.finishJoin=function(){closeSheet();};

function helpCard(edge,glow,icon,title,sub,action){
  return '<button onclick="'+action+'" style="min-height:68px;border-radius:16px;padding:8px 9px;display:flex;align-items:center;gap:8px;text-align:left;color:#fff;background:linear-gradient(145deg,#11121b,#07070d);border:1.3px solid '+edge+';box-shadow:0 0 10px '+glow+'66,inset 0 0 16px '+glow+'22">'
    +'<span style="width:36px;height:36px;flex:0 0 36px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:#111;box-shadow:0 0 12px '+glow+'99">'+icon+'</span>'
    +'<span style="min-width:0"><b style="display:block;color:'+edge+';font-size:13px;line-height:1.05;white-space:nowrap">'+title+'</b><small style="display:block;color:#c9c9d1;font-size:9px;margin-top:3px;white-space:nowrap">'+sub+'</small></span></button>';
}
window.openMenu=function(){
  var html='<div style="padding:0 0 2px">'
    +'<div style="text-align:center;font-size:19px;font-weight:950;color:#fff;margin:0 0 8px;text-shadow:0 0 12px #ff43c9,0 0 20px #438dff">♛ K-Talk 안내</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">'
    +helpCard('#d0a2ff','#803cff','❔','사이트 사용방법','처음부터 쉽게','openSiteGuide()')
    +helpCard('#ff8fc8','#ff2d8a','🚩','신고 게시판','신고·문의','report()')
    +helpCard('#75e4ff','#1bbfff','📣','광고 문의','광고·판매자','openAd()')
    +helpCard('#ffe071','#ffb500','💼','투자자 안내','방송수익 정산','openInvestorInfo()')
    +helpCard('#c3b7ff','#6558ff','👑','구독·VIP 혜택','할인·입장방','openSubs()')
    +helpCard('#ffb09a','#ff633f','🎁','선물·보물상자','선물 종류','openGifts()')
    +helpCard('#ff9baa','#ff405d','🌹','장미 충전','충전 수량','openCharge()')
    +helpCard('#91f3ee','#31cfc7','🎯','제비뽑기','이벤트','openRaffle()')
    +helpCard('#a8d0ff','#4a9aff','✉','쪽지','메시지','openMessages()')
    +helpCard('#8ff6ad','#2bd365','♛','프로필','내 정보','openProfile()')
    +'</div></div>';
  showSheet('K-Talk 사용방법·혜택',html);
};

window.openSiteGuide=function(){
  showSheet('❔ 사이트 사용방법','<div class="rowbox"><b>1. 홈</b><br>동영상과 쇼츠를 한 화면에서 바로 볼 수 있습니다.</div><div class="rowbox"><b>2. 방송하기</b><br>아래 ＋ 버튼을 눌러 라이브 준비 화면으로 들어갑니다.</div><div class="rowbox"><b>3. 방송목록</b><br>현재 방송 중인 방을 확인합니다.</div><div class="rowbox"><b>4. 채팅·내 정보</b><br>하단 메뉴에서 채팅과 프로필을 이용합니다.</div><div class="rowbox"><b>5. 방송방 종류</b><br>일반 13명방, 1인 방송, 비밀번호방, 구독자 전용방 등이 있으며 방별 조건에 맞게 이용합니다.</div>');
};
window.openInvestorInfo=function(){
  showSheet('💼 투자자 안내','<div class="rowbox"><b>📅 정산일</b><br>투자자 수익금 정산은 매달 1일 진행하는 방식으로 안내합니다.</div><div class="rowbox"><b>📡 정산 대상</b><br>K-Talk 방송에서 발생한 방송 관련 수익만 투자자 수익 분배 대상에 포함합니다.</div><div class="rowbox"><b>🚫 제외 수익</b><br>광고 수익, 상품 판매 수익, 외부 업체와 별도로 체결한 계약에서 발생한 수익은 투자자 분배 대상에서 제외합니다.</div><div class="rowbox"><b>💰 수익금 분배</b><br>방송 수익을 기준으로 계약서에 정한 지분과 정산 기준에 따라 분배하며 실제 금액은 해당 월의 방송 실적에 따라 달라질 수 있습니다.</div><div class="note">투자에는 손실 위험이 있으며 원금이나 수익을 확정적으로 보장할 수 없습니다.</div>');
};
window.openSubs=function(){
  showSheet('👑 구독·VIP 혜택','<div class="rowbox"><b>💎 구독자 혜택</b><br>구독자는 구독자 전용방을 이용할 수 있고 일반방과 1인 방송 등 이용 가능한 방을 확인할 수 있습니다.</div><div class="rowbox"><b>🌹 장미 충전 할인</b><br>구독자는 500개 이상 충전할 때 할인 혜택을 적용하는 방식으로 안내합니다. 실제 할인율과 결제 조건은 결제 화면에서 명확하게 표시해야 합니다.</div><div class="rowbox"><b>🔓 이용 가능한 방</b><br>일반 13명방 · 1인 방송 · 구독자 전용방을 이용할 수 있으며 비밀번호방은 방장이 정한 비밀번호가 있어야 입장할 수 있습니다. 기타 제한 방은 해당 이용 조건을 충족해야 합니다.</div><div class="rowbox"><b>👑 VIP 안내</b><br>VIP 전용 혜택과 입장 권한은 회원 등급 확인 후 적용되도록 구성합니다.</div>');
};

window.showHostCrown=function(kind){var old=document.getElementById('hostGiftCrown');if(old)old.remove();var badge=document.createElement('div');badge.id='hostGiftCrown';badge.textContent=(kind==='다이아 왕관'||kind==='다이아몬드 왕관')?'💎👑':'👑';badge.style.cssText='position:fixed;z-index:9999;top:86px;left:50%;transform:translateX(-50%);font-size:52px;filter:drop-shadow(0 0 15px #ffd85a);pointer-events:none';document.body.appendChild(badge);setTimeout(function(){if(badge&&badge.parentNode)badge.remove();},6000);};
window.giftSend=function(name,cost){if(name.indexOf('왕관')>-1||name.indexOf('크라운')>-1){showHostCrown(name);}alert(name+' · '+cost+'개 선물을 선택했습니다.');};
window.ktalkGifts=[
  ['장미','1'],['장미 꽃다발','5'],['장미 박스','10'],['장미 20송이','20'],['장미 50송이','50'],
  ['장미 100송이','100'],['장미 200송이','200'],['장미 300송이','300'],['장미 400송이','400'],['장미 500송이','500'],
  ['로열 장미','1,000'],['보라 장미','2,000'],['핑크 장미','3,000'],['레전드 장미','5,000'],['황금 장미','10,000'],
  ['킹 크라운','100'],['다이아 왕관','200'],['럭셔리 자동차','300'],['로열 요트','400'],['골든 캐슬','500'],
  ['갤럭시 무대','1,000'],['프리미엄 로즈','1'],['로즈 부케','5'],['로즈 박스','10'],['골든 부케','50'],
  ['로열 하트','100'],['황금 왕관','200'],['사랑 하트','300'],['다이아 하트','500'],['K-Talk 카드','700'],
  ['VIP 크라운','1,000'],['골드 패키지','1,500'],['로열 패키지','2,000'],['프리미엄 캐슬','3,000'],['프라이빗 제트','5,000'],
  ['황금 드래곤','500,000'],['황제 궁전','300,000'],['초대형 크루즈','200,000'],['달 착륙선','150,000'],['황금 열차','30,000']
];
window.giftSendByIndex=function(i){
  var g=window.ktalkGifts[i];
  if(!g)return;
  giftSend(g[0],g[1]);
};
window.openGifts=function(){
  var buttons=window.ktalkGifts.map(function(g,i){
    return '<button class="gift-exact-hit" onclick="giftSendByIndex('+i+')" aria-label="'+g[0]+'"></button>';
  }).join('');
  var html='<div class="gift-exact-wrap">'
    +'<img class="gift-exact-img" src="gift-panel-exact.svg?v=20260831-1527" alt="K-Talk 선물 40종">'
    +'<button class="gift-exact-close" onclick="closeSheet()" aria-label="닫기"></button>'
    +'<div class="gift-exact-hotspots">'+buttons+'</div>'
    +'</div>';
  showSheet('',html);
  sheet.classList.add('gift-exact');
};
window.openTreasure=function(){showSheet('🎁 보물상자','<div class="premium-grid"><button class="premium" onclick="alert(\'보물상자 50 선택\')"><span>🎁</span><b>보물상자 50</b></button><button class="premium" onclick="alert(\'보물상자 100 선택\')"><span>🎁</span><b>보물상자 100</b></button><button class="premium" onclick="alert(\'보물상자 150 선택\')"><span>🎁</span><b>보물상자 150</b></button></div>');};
window.selectCoinCharge=function(amount,base,bonus){
  var total=base+bonus;
  alert(Number(amount).toLocaleString('ko-KR')+'원 · 기본 장미 '+base.toLocaleString('ko-KR')+'개 · 보너스 '+bonus.toLocaleString('ko-KR')+'개 · 총 '+total.toLocaleString('ko-KR')+'개');
};
window.openCharge=function(){
  var packs=[
    {base:300},
    {base:500},
    {base:1000},
    {base:1500},
    {base:2000},
    {base:2500},
    {base:3000},
    {base:3300}
  ];
  var html='<div class="coin-charge-note">'
    +'<div style="font-size:16px;font-weight:950;color:#fff">🌹 장미 충전</div>'
    +'<div style="margin-top:7px;color:#ffe17b;font-weight:950">장미 1개 = 30원</div>'
    +'<div style="margin-top:5px;color:#ffd86b">500개부터 500개마다 <b style="color:#fff">보너스 +10개</b></div>'
    +'<div style="margin-top:5px;color:#bbb">최대 충전 100,000원</div>'
    +'</div>'
    +'<div class="coin-charge-grid">'+packs.map(function(p){
      var amount=p.base*30;
      var bonus=p.base>=500?Math.floor(p.base/500)*10:0;
      var total=p.base+bonus;
      return '<button class="coin-charge-card" onclick="selectCoinCharge('+amount+','+p.base+','+bonus+')">'
        +'<span class="coin-art">🌹</span>'
        +'<b>'+p.base.toLocaleString('ko-KR')+'개</b>'
        +'<small style="font-size:13px;color:#fff">'+amount.toLocaleString('ko-KR')+'원</small>'
        +(bonus>0
          ?'<span class="charge-bonus-badge">🎁 보너스 +'+bonus.toLocaleString('ko-KR')+'개</span>'
          :'<span class="charge-bonus-none">보너스 없음</span>')
        +'<small style="color:#ffe17b;font-weight:950">총 '+total.toLocaleString('ko-KR')+'개 지급</small>'
        +'</button>';
    }).join('')+'</div>';
  showSheet('🌹 장미 충전',html);
};
window.openRaffle=function(){showSheet('🎯 제비뽑기','<div class="raffle">꽝 · 1 · 2 · 3 · 4 · 5</div><button class="act" onclick="raffle()">제비뽑기</button>');};
window.raffle=function(){if(state.raffle<=0){alert('오늘 참여 횟수를 모두 사용했습니다.');return;}state.raffle--;var p=[0,0,1,2,3,4,5];var x=p[Math.floor(Math.random()*p.length)];alert(x?'장미 '+x+'개 당첨!':'꽝입니다.');};
window.openMessages=function(){showSheet('✉ 쪽지','<div class="rowbox"><b>쪽지 화면</b><br>메시지 기능 버튼이 정상 작동합니다.</div>');};
window.openComments=function(){showSheet('💬 댓글','<div class="rowbox"><b>댓글 화면</b><br>댓글 버튼이 정상 작동합니다.</div>');};
window.openProfile=function(){showSheet('♛ 프로필','<div class="profile-pic">K</div><div style="text-align:center"><h3 style="color:#ffe07a">K-Talk</h3></div>');};
window.openAI=function(){showSheet('🔊 AI 읽기','<div class="rowbox"><b>AI 읽기 보조</b></div>');};
window.openSong=function(){showSheet('🎵 노래·배경','<div class="rowbox"><b>노래·배경 설정</b></div>');};
window.report=function(){showSheet('🚩 신고 게시판','<div class="rowbox"><b>신고 접수 화면</b></div>');};
window.openAd=function(){showSheet('📣 광고·판매자 등록','<div class="rowbox"><b>광고 문의 화면</b></div>');};
window.toggleSave=function(btn){state.saved=!state.saved;if(btn)btn.style.color=state.saved?'#ffe07a':'#fff';};
window.toggleMic=function(btn){state.mic=!state.mic;if(btn)btn.textContent=state.mic?'🎤 마이크':'🔇 마이크';};
window.shareApp=function(){if(navigator.share){navigator.share({title:'K-Talk LIVE',text:'K-Talk LIVE'}).catch(function(){});}else{alert('공유 버튼이 정상 작동합니다.');}};
window.render=function(name){if(name==='home')home();else if(name==='shorts'||name==='video')media(name);else if(name==='profile')openProfile();};

document.addEventListener('click',function(e){var tab=e.target.closest('[data-tab]');if(tab){activate(tab.dataset.tab);render(tab.dataset.tab);return;}var bottom=e.target.closest('[data-bottom]');if(bottom){var k=bottom.dataset.bottom;if(k==='home'){activate('home');home();}else if(k==='friends'){friends();}else if(k==='plus'){openCreator();}else if(k==='help'){openMenu();}else if(k==='profile'){openProfile();}}});

home();

setTimeout(function(){
  var directCreator=window.openCreator;
  window.openRoomTypeChooser=function(){showSheet('라이브 방송 선택','<div class="aux-grid"><button class="aux-card" onclick="selectLiveRoom(\'1인 방송\',1,\'solo\')"><b>🎙️ 1인 방송</b><small>나만의 라이브</small></button><button class="aux-card" onclick="selectLiveRoom(\'일반 13명방\',13,\'group\')"><b>👥 일반 13명방</b><small>최대 13명</small></button><button class="aux-card" onclick="selectLiveRoom(\'VIP 방송\',10,\'vip\')"><b>💎 VIP 방송</b><small>VIP 권한 확인 후 이용</small></button><button class="aux-card" onclick="openPasswordRoomSetup()"><b>🔒 비밀번호방</b><small>방장이 비밀번호 설정</small></button></div>');};
  window.selectLiveRoom=function(name,max,type){state.liveRoomType=type;state.liveRoomName=name;state.liveRoomMax=max;closeSheet();directCreator();var title=document.getElementById('liveTitle');if(title)title.value=name+' · 최대 '+max+'명';};
  window.openPasswordRoomSetup=function(){showSheet('🔒 비밀번호방 설정','<div class="note">방에 들어올 때 사용할 비밀번호를 설정하세요.</div><input id="roomPasswordInput" class="form" type="password" inputmode="numeric" maxlength="8" placeholder="비밀번호 입력"><button class="act" onclick="confirmPasswordRoom()">비밀번호 설정하고 계속</button>');};
  window.confirmPasswordRoom=function(){var input=document.getElementById('roomPasswordInput');var pw=input?input.value.trim():'';if(pw.length<4){alert('비밀번호를 4자리 이상 입력해 주세요.');return;}state.roomPassword=pw;state.liveRoomType='password';state.liveRoomName='비밀번호방';state.liveRoomMax=7;closeSheet();directCreator();var title=document.getElementById('liveTitle');if(title)title.value='비밀번호방 · 호스트 1 + 게스트 6';};
  var oldPrepBottom=window.prepBottomTap;
  window.prepBottomTap=function(el,name){if(oldPrepBottom)oldPrepBottom(el,name);};
},0);

