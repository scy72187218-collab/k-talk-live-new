var state={joined:false,adult:false,stream:null,raffle:3,saved:false,mic:true,ai:true};
var screen=document.getElementById('screen');
var creator=document.getElementById('creator');
var camera=document.getElementById('camera');
var sheet=document.getElementById('sheet');
var sheetTitle=document.getElementById('sheetTitle');
var sheetBody=document.getElementById('sheetBody');

window.activate=function(name){
  document.querySelectorAll('[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});
};

window.showSheet=function(title,html){
  sheetTitle.innerHTML=title;
  sheetBody.innerHTML=html;
  sheet.classList.add('show');
};
window.closeSheet=function(){sheet.classList.remove('show');};

window.home=function(){
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>홈 동영상 보기</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};

window.media=function(type){
  document.body.classList.remove('kt-home');
  var label=type==='shorts'?'쇼츠':'동영상';
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>'+label+' 보기 화면</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};

window.friends=function(){
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="friends-page"><div class="friends-head"><b>방송목록</b></div><div class="friends-list"><div class="friend-row"><div class="friend-info"><b>현재 방송목록</b><span>방송이 시작되면 여기에 표시됩니다.</span></div></div></div></section>';
};

window.openCreator=function(){creator.classList.add('show');};
window.closeCreator=function(){
  creator.classList.remove('show');
  if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;if(camera)camera.srcObject=null;}
};
window.startBroadcast=function(){alert('라이브 시작 버튼이 정상 작동합니다. 현재는 시험 모드입니다.');};

window.prepTap=function(el,name){
  if(el){el.classList.add('test-active');setTimeout(function(){el.classList.remove('test-active');},180);}
  alert(name+' 버튼이 정상 작동합니다.');
};
window.prepBottomTap=function(el,name){
  document.querySelectorAll('.prep-bottom span').forEach(function(s){s.classList.remove('on');});
  if(el)el.classList.add('on');
  alert(name+' 메뉴가 정상 작동합니다.');
};

window.needJoin=function(msg){
  showSheet('가입하기','<div class="note">'+msg+'</div><button class="act social naver" onclick="join(\'네이버\')">네이버로 계속하기</button><button class="act social kakao" onclick="join(\'카카오\')">카카오로 계속하기</button><button class="act social google" onclick="join(\'Google\')">Google로 계속하기</button><div class="note">현재는 화면 작동 확인용 테스트입니다.</div>');
};
window.join=function(provider){showSheet('로그인 확인','<div class="rowbox"><b>'+provider+' 로그인 버튼 작동 확인</b></div><button class="act" onclick="closeSheet()">확인</button>');};
window.finishJoin=function(){closeSheet();};

window.openMenu=function(){
  var card='display:flex;min-height:118px;border-radius:22px;padding:16px 14px;align-items:center;gap:12px;text-align:left;color:#fff;background:linear-gradient(145deg,#10111b,#07070d);font-weight:900;box-shadow:inset 0 0 24px rgba(255,255,255,.03);';
  var icon='width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;flex:0 0 54px;';
  var txt='display:block;font-size:17px;line-height:1.15;margin-bottom:5px;';
  var sub='display:block;font-size:11px;color:#c9c9d1;font-weight:700;';
  var html='<div style="padding:4px 2px 10px"><div style="text-align:center;font-size:23px;font-weight:950;color:#fff;margin:6px 0 16px;text-shadow:0 0 16px #ff43c9">♛ K-Talk 안내</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
    +'<button style="'+card+'border:1.5px solid #a95cff;box-shadow:0 0 18px #7d36ff55,inset 0 0 24px #8d45ff1f" onclick="openSiteGuide()"><span style="'+icon+'background:radial-gradient(circle,#8f52ff,#321064);box-shadow:0 0 20px #9b55ff88">❔</span><span><b style="'+txt+'color:#d7b2ff">사이트 사용방법</b><small style="'+sub+'">처음부터 쉽게 보기</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #ff3b9c;box-shadow:0 0 18px #ff2d8a55,inset 0 0 24px #ff3b9c1f" onclick="report()"><span style="'+icon+'background:radial-gradient(circle,#ff4d9f,#68123f);box-shadow:0 0 20px #ff3b9c88">🚩</span><span><b style="'+txt+'color:#ff9dca">신고 게시판</b><small style="'+sub+'">신고·문의 접수</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #27c6ff;box-shadow:0 0 18px #1bbfff55,inset 0 0 24px #27c6ff1f" onclick="openAd()"><span style="'+icon+'background:radial-gradient(circle,#35d4ff,#0b4264);box-shadow:0 0 20px #27c6ff88">📣</span><span><b style="'+txt+'color:#75e4ff">광고 문의</b><small style="'+sub+'">광고·판매자 문의</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #ffbd22;box-shadow:0 0 18px #ffb50055,inset 0 0 24px #ffbd221f" onclick="openInvestorInfo()"><span style="'+icon+'background:radial-gradient(circle,#ffd85a,#6b4200);box-shadow:0 0 20px #ffbd2288">💼</span><span><b style="'+txt+'color:#ffe071">투자자 안내</b><small style="'+sub+'">사업·투자 관련 안내</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #7b6cff;box-shadow:0 0 18px #6558ff55,inset 0 0 24px #7b6cff1f" onclick="openSubs()"><span style="'+icon+'background:radial-gradient(circle,#8b7dff,#30276a);box-shadow:0 0 20px #7b6cff88">👑</span><span><b style="'+txt+'color:#b9b1ff">구독·VIP 혜택</b><small style="'+sub+'">할인·입장 가능 방 안내</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #ff6b45;box-shadow:0 0 18px #ff633f55,inset 0 0 24px #ff6b451f" onclick="openGifts()"><span style="'+icon+'background:radial-gradient(circle,#ff8a62,#682310);box-shadow:0 0 20px #ff6b4588">🎁</span><span><b style="'+txt+'color:#ffb09a">선물·보물상자</b><small style="'+sub+'">선물 종류 확인</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #ff4864;box-shadow:0 0 18px #ff405d55,inset 0 0 24px #ff48641f" onclick="openCharge()"><span style="'+icon+'background:radial-gradient(circle,#ff6d82,#681724);box-shadow:0 0 20px #ff486488">🌹</span><span><b style="'+txt+'color:#ff9baa">장미 충전</b><small style="'+sub+'">충전 수량 확인</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #45d8d1;box-shadow:0 0 18px #31cfc755,inset 0 0 24px #45d8d11f" onclick="openRaffle()"><span style="'+icon+'background:radial-gradient(circle,#5fe3dc,#145452);box-shadow:0 0 20px #45d8d188">🎯</span><span><b style="'+txt+'color:#91f3ee">제비뽑기</b><small style="'+sub+'">이벤트 참여</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #5ba6ff;box-shadow:0 0 18px #4a9aff55,inset 0 0 24px #5ba6ff1f" onclick="openMessages()"><span style="'+icon+'background:radial-gradient(circle,#79b8ff,#153968);box-shadow:0 0 20px #5ba6ff88">✉</span><span><b style="'+txt+'color:#a8d0ff">쪽지</b><small style="'+sub+'">메시지 확인</small></span></button>'
    +'<button style="'+card+'border:1.5px solid #37df71;box-shadow:0 0 18px #2bd36555,inset 0 0 24px #37df711f" onclick="openProfile()"><span style="'+icon+'background:radial-gradient(circle,#52ef8a,#16542d);box-shadow:0 0 20px #37df7188">♛</span><span><b style="'+txt+'color:#8ff6ad">프로필</b><small style="'+sub+'">내 정보 확인</small></span></button>'
    +'</div></div>';
  showSheet('K-Talk 사용방법·혜택',html);
};

window.openSiteGuide=function(){
  showSheet('❔ 사이트 사용방법','<div class="rowbox"><b>1. 홈</b><br>동영상과 쇼츠를 바로 볼 수 있습니다.</div><div class="rowbox"><b>2. 방송하기</b><br>아래 ＋ 버튼을 눌러 라이브 준비 화면으로 들어갑니다.</div><div class="rowbox"><b>3. 방송목록</b><br>현재 방송 중인 방을 확인합니다.</div><div class="rowbox"><b>4. 채팅·내 정보</b><br>하단 메뉴에서 채팅과 프로필을 이용합니다.</div><div class="rowbox"><b>5. 이용 가능한 방송방</b><br>일반 13명방, 1인 방송, 비밀번호방, 구독자 전용방 등이 있으며 방별 조건에 따라 입장할 수 있습니다.</div>');
};
window.openInvestorInfo=function(){
  showSheet('💼 투자자 안내','<div class="rowbox"><b>K-Talk 사업·투자 안내</b><br>투자 조건과 위험, 정산 방식은 계약 전 충분히 확인해야 합니다.</div><div class="note">투자에는 손실 위험이 있으며 원금이나 수익은 보장되지 않을 수 있습니다.</div>');
};

window.showHostCrown=function(kind){
  var old=document.getElementById('hostGiftCrown');
  if(old)old.remove();
  var badge=document.createElement('div');
  badge.id='hostGiftCrown';
  badge.textContent=kind==='다이아 왕관'?'💎👑':'👑';
  badge.style.cssText='position:fixed;z-index:9999;top:86px;left:50%;transform:translateX(-50%);font-size:52px;filter:drop-shadow(0 0 15px #ffd85a);pointer-events:none;animation:crownGiftPop .35s ease-out';
  document.body.appendChild(badge);
  setTimeout(function(){if(badge&&badge.parentNode)badge.remove();},6000);
};

window.giftSend=function(name,cost){
  if(name==='킹 크라운'||name==='다이아 왕관'){showHostCrown(name);}
  alert(name+' · '+cost+'개 선물을 선택했습니다.');
};

window.openGifts=function(){
  var gifts=[
    ['🌹','장미','1'],['💐','꽃다발','5'],['🎁','보물상자','10'],['❤️','하트 목걸이','30'],['💍','다이아 반지','50'],
    ['👠','크리스탈 구두','100'],['🎂','케이크','100'],['⌚','명품 시계','200'],['🧴','명품 향수','200'],['🏎️','스포츠카','300'],
    ['🚘','럭셔리 자동차','500'],['🛥️','요트','700'],['✈️','전용기','1,000'],['👑','킹 크라운','1,500'],['💎','다이아 왕관','2,000'],
    ['🏰','황금 성','3,000'],['🎆','불꽃놀이','3,000'],['🗼','에펠탑','5,000'],['🌌','갤럭시 무대','10,000'],['🪽','천사 날개','20,000'],
    ['🐉','황금 드래곤','30,000'],['🔥','불사조','50,000'],['🚂','황금 기차','70,000'],['🌍','황금 지구','100,000'],['🏝️','럭셔리 리조트','150,000']
  ];
  var html='<div class="gift-grid gift-grid-25">'+gifts.map(function(g,i){return '<button class="gift-big gift-no-'+(i+1)+'" onclick="giftSend(\''+g[1]+'\',\''+g[2]+'\')"><span>'+g[0]+'</span><b>'+g[1]+'</b><small style="display:block;margin-top:4px;color:#ffd86b;font-weight:900">🌹 '+g[2]+'개</small></button>';}).join('')+'</div>';
  showSheet('🎁 K-Talk 선물 · 25종',html);
};

window.openTreasure=function(){
  showSheet('🎁 보물상자','<div class="premium-grid"><button class="premium" onclick="alert(\'보물상자 50 선택\')"><span>🎁</span><b>보물상자 50</b></button><button class="premium" onclick="alert(\'보물상자 100 선택\')"><span>🎁</span><b>보물상자 100</b></button><button class="premium" onclick="alert(\'보물상자 150 선택\')"><span>🎁</span><b>보물상자 150</b></button></div>');
};
window.openCharge=function(){
  showSheet('🌹 장미 충전','<div class="rowbox"><b>장미 1개 = 30원 기준</b></div><div class="rowbox"><b>100개</b> · 서비스 포함 110개</div><div class="rowbox"><b>200개</b> · 서비스 포함 210개</div><div class="rowbox"><b>300개</b> · 서비스 포함 310개</div><div class="rowbox"><b>500개</b> · 서비스 포함 510개</div><div class="rowbox"><b>1,000개</b> · 서비스 포함 1,010개</div><div class="rowbox"><b>2,000개</b> · 서비스 포함 2,010개</div>');
};
window.openSubs=function(){
  showSheet('👑 구독·VIP 혜택','<div class="rowbox"><b>일반 구독</b><br>장미 충전 5% 할인 혜택 · 구독자 전용방 이용</div><div class="rowbox"><b>중회원</b><br>장미 충전 10% 할인 혜택 · 구독자 전용방과 비밀번호방 이용 가능</div><div class="rowbox"><b>VIP</b><br>장미 충전 15% 할인 혜택 · 일반 13명방, 1인 방송, 비밀번호방, 구독자 전용방 등 이용 가능</div><div class="note">실제 입장은 각 방의 비밀번호·초대·운영 설정 등 이용 조건을 함께 따릅니다.</div>');
};
window.openRaffle=function(){showSheet('🎯 제비뽑기','<div class="raffle">꽝 · 1 · 2 · 3 · 4 · 5</div><button class="act" onclick="raffle()">제비뽑기</button>');};
window.raffle=function(){if(state.raffle<=0){alert('오늘 참여 횟수를 모두 사용했습니다.');return;}state.raffle--;var p=[0,0,1,2,3,4,5];var x=p[Math.floor(Math.random()*p.length)];alert(x?'장미 '+x+'개 당첨!':'꽝입니다.');};
window.openMessages=function(){showSheet('✉ 쪽지','<div class="rowbox"><b>쪽지 화면</b><br>메시지 기능 버튼이 정상 작동합니다.</div>');};
window.openComments=function(){showSheet('💬 댓글','<div class="rowbox"><b>댓글 화면</b><br>댓글 버튼이 정상 작동합니다.</div>');};
window.openProfile=function(){showSheet('♛ 프로필','<div class="profile-pic">K</div><div style="text-align:center"><h3 style="color:#ffe07a">K-Talk</h3></div>');};
window.openAI=function(){showSheet('🔊 AI 읽기','<div class="rowbox"><b>AI 읽기 보조</b></div>');};
window.openSong=function(){showSheet('🎵 노래·배경','<div class="rowbox"><b>노래·배경 설정</b></div>');};
window.report=function(){showSheet('🚩 신고 게시판','<div class="rowbox"><b>신고 접수 화면</b><br>신고 대상과 내용을 입력해 접수하는 화면으로 연결할 수 있습니다.</div>');};
window.openAd=function(){showSheet('📣 광고 문의','<div class="rowbox"><b>광고 문의 화면</b><br>광고·판매자 등록 문의를 확인하는 화면입니다.</div>');};
window.toggleSave=function(btn){state.saved=!state.saved;if(btn)btn.style.color=state.saved?'#ffe07a':'#fff';};
window.toggleMic=function(btn){state.mic=!state.mic;if(btn)btn.textContent=state.mic?'🎤 마이크':'🔇 마이크';};
window.shareApp=function(){if(navigator.share){navigator.share({title:'K-Talk LIVE',text:'K-Talk LIVE'}).catch(function(){});}else{alert('공유 버튼이 정상 작동합니다.');}};

window.render=function(name){if(name==='home')home();else if(name==='shorts'||name==='video')media(name);else if(name==='profile')openProfile();};

document.addEventListener('click',function(e){
  var tab=e.target.closest('[data-tab]');
  if(tab){activate(tab.dataset.tab);render(tab.dataset.tab);return;}
  var bottom=e.target.closest('[data-bottom]');
  if(bottom){var k=bottom.dataset.bottom;if(k==='home'){activate('home');home();}else if(k==='friends'){friends();}else if(k==='plus'){openCreator();}else if(k==='help'){openMenu();}else if(k==='profile'){openProfile();}}
});

home();

setTimeout(function(){
  var directCreator=window.openCreator;
  window.openRoomTypeChooser=function(){
    showSheet('라이브 방송 선택','<div class="aux-grid"><button class="aux-card" onclick="selectLiveRoom(\'1인 방송\',1,\'solo\')"><b>🎙️ 1인 방송</b><small>나만의 라이브</small></button><button class="aux-card" onclick="selectLiveRoom(\'일반 13명방\',13,\'group\')"><b>👥 일반 13명방</b><small>최대 13명</small></button><button class="aux-card" onclick="selectLiveRoom(\'VIP 방송\',10,\'vip\')"><b>💎 VIP 방송</b><small>VIP 권한 확인 후 이용</small></button><button class="aux-card" onclick="openPasswordRoomSetup()"><b>🔒 비밀번호방</b><small>방장이 비밀번호 설정</small></button></div><div class="note">방 종류를 고른 다음 라이브 준비 화면으로 이동합니다.</div>');
  };
  window.selectLiveRoom=function(name,max,type){
    state.liveRoomType=type;state.liveRoomName=name;state.liveRoomMax=max;closeSheet();directCreator();
    var title=document.getElementById('liveTitle');if(title)title.value=name+' · 최대 '+max+'명';
    if(type==='vip'){setTimeout(function(){alert('VIP 방송은 실제 서비스에서 VIP 권한 확인 후 시작되도록 연결됩니다.');},80);}
  };
  window.openPasswordRoomSetup=function(){
    showSheet('🔒 비밀번호방 설정','<div class="note">방에 들어올 때 사용할 비밀번호를 설정하세요.</div><input id="roomPasswordInput" class="form" type="password" inputmode="numeric" maxlength="8" placeholder="비밀번호 입력"><button class="act" onclick="confirmPasswordRoom()">비밀번호 설정하고 계속</button>');
  };
  window.confirmPasswordRoom=function(){
    var input=document.getElementById('roomPasswordInput');var pw=input?input.value.trim():'';
    if(pw.length<4){alert('비밀번호를 4자리 이상 입력해 주세요.');return;}
    state.roomPassword=pw;state.liveRoomType='password';state.liveRoomName='비밀번호방';state.liveRoomMax=7;closeSheet();directCreator();
    var title=document.getElementById('liveTitle');if(title)title.value='비밀번호방 · 호스트 1 + 게스트 6';
  };
  var oldPrepBottom=window.prepBottomTap;
  window.prepBottomTap=function(el,name){
    document.querySelectorAll('.prep-bottom span').forEach(function(s){s.classList.remove('on');});if(el)el.classList.add('on');
    if(name==='라이브'){openRoomTypeChooser();return;}if(oldPrepBottom)oldPrepBottom(el,name);
  };
},0);

setTimeout(function(){
  var previousPrepTap=window.prepTap;
  window.prepTap=function(el,name){
    if(name==='목표 설정'){if(el){el.classList.add('test-active');setTimeout(function(){el.classList.remove('test-active');},180);}return;}
    if(previousPrepTap)previousPrepTap(el,name);
  };
},0);