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

window.openCreator=function(){
  creator.classList.add('show');
};
window.closeCreator=function(){
  creator.classList.remove('show');
  if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;if(camera)camera.srcObject=null;}
};
window.startBroadcast=function(){
  alert('라이브 시작 버튼이 정상 작동합니다. 현재는 시험 모드입니다.');
};

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
window.join=function(provider){
  showSheet('로그인 확인','<div class="rowbox"><b>'+provider+' 로그인 버튼 작동 확인</b></div><button class="act" onclick="closeSheet()">확인</button>');
};
window.finishJoin=function(){closeSheet();};

window.openMenu=function(){
  showSheet('K-Talk 사용방법·혜택','<div class="aux-grid"><button class="aux-card" onclick="openGifts()"><b>🎁 선물·보물상자</b><small>선물 보기</small></button><button class="aux-card" onclick="openCharge()"><b>🌹 장미 충전</b><small>충전 화면</small></button><button class="aux-card" onclick="openSubs()"><b>👑 구독·VIP</b><small>회원 혜택</small></button><button class="aux-card" onclick="openRaffle()"><b>🎯 제비뽑기</b><small>이벤트</small></button><button class="aux-card" onclick="openMessages()"><b>✉ 쪽지</b><small>메시지</small></button><button class="aux-card" onclick="openProfile()"><b>♛ 프로필</b><small>내 정보</small></button></div>');
};

window.giftSend=function(name,cost){alert(name+' · '+cost+'개 선물을 선택했습니다.');};
window.openGifts=function(){
  var gifts=[['🌹','장미','1'],['💐','꽃다발','5'],['🎁','보물상자','10'],['🎡','관람차','50'],['🎆','불꽃놀이','100'],['🏎️','럭셔리 자동차','200'],['🦄','유니콘','300'],['🦁','황금 사자','500'],['🦋','별빛 나비','700'],['✈️','로열 비행기','1,000'],['🏰','골든 캐슬','1,500'],['🏆','챔피언 트로피','2,000'],['🎸','스타 기타','2,500'],['🌌','갤럭시 무대','3,000'],['💎','다이아 왕관','3,500'],['🚀','우주선','4,000']];
  var html='<div class="gift-grid">'+gifts.map(function(g){return '<button class="gift-big" onclick="giftSend(\''+g[1]+'\',\''+g[2]+'\')"><span>'+g[0]+'</span><b>'+g[1]+'</b><small style="display:block;margin-top:4px;color:#ffd86b;font-weight:900">🌹 '+g[2]+'개</small></button>';}).join('')+'</div>';
  showSheet('🎁 K-Talk 선물',html);
};
window.openTreasure=function(){
  showSheet('🎁 보물상자','<div class="premium-grid"><button class="premium" onclick="alert(\'보물상자 50 선택\')"><span>🎁</span><b>보물상자 50</b></button><button class="premium" onclick="alert(\'보물상자 100 선택\')"><span>🎁</span><b>보물상자 100</b></button><button class="premium" onclick="alert(\'보물상자 150 선택\')"><span>🎁</span><b>보물상자 150</b></button></div>');
};
window.openCharge=function(){
  showSheet('🌹 장미 충전','<div class="rowbox"><b>장미 1개 = 30원 기준</b></div><div class="rowbox"><b>100개</b> · 서비스 포함 110개</div><div class="rowbox"><b>200개</b> · 서비스 포함 210개</div><div class="rowbox"><b>300개</b> · 서비스 포함 310개</div><div class="rowbox"><b>500개</b> · 서비스 포함 510개</div><div class="rowbox"><b>1,000개</b> · 서비스 포함 1,010개</div><div class="rowbox"><b>2,000개</b> · 서비스 포함 2,010개</div>');
};
window.openSubs=function(){showSheet('👑 구독·회원 혜택','<div class="rowbox"><b>구독·VIP 안내</b><br>회원 혜택 화면입니다.</div>');};
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

document.addEventListener('click',function(e){
  var tab=e.target.closest('[data-tab]');
  if(tab){activate(tab.dataset.tab);render(tab.dataset.tab);return;}
  var bottom=e.target.closest('[data-bottom]');
  if(bottom){var k=bottom.dataset.bottom;if(k==='home'){activate('home');home();}else if(k==='friends'){friends();}else if(k==='plus'){openCreator();}else if(k==='help'){openMenu();}else if(k==='profile'){openProfile();}}
});

home();