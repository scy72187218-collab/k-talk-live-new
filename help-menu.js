(function(){
  function neonCard(edge, glow, iconBg, icon, title, subtitle, onclick){
    return '<button onclick="'+onclick+'" style="display:flex;min-height:118px;border-radius:22px;padding:16px 14px;align-items:center;gap:12px;text-align:left;color:#fff;background:linear-gradient(145deg,#10111b,#07070d);font-weight:900;border:1.5px solid '+edge+';box-shadow:0 0 18px '+glow+',inset 0 0 24px '+glow+'33">'
      +'<span style="width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;flex:0 0 54px;background:'+iconBg+';box-shadow:0 0 20px '+glow+'">'+icon+'</span>'
      +'<span><b style="display:block;font-size:17px;line-height:1.15;margin-bottom:5px;color:'+edge+'">'+title+'</b><small style="display:block;font-size:11px;color:#c9c9d1;font-weight:700">'+subtitle+'</small></span></button>';
  }

  window.openMenu=function(){
    var html='<div style="padding:4px 2px 12px">'
      +'<div style="text-align:center;font-size:25px;font-weight:950;color:#fff;margin:7px 0 7px;text-shadow:0 0 16px #ff43c9,0 0 24px #438dff">♛ K-Talk 안내</div>'
      +'<div style="text-align:center;color:#cfcfe0;font-size:11px;margin-bottom:16px">모르는 기능은 여기서 눌러 바로 확인하세요.</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">'
      +neonCard('#d0a2ff','#803cff','radial-gradient(circle,#8f52ff,#321064)','❔','사이트 사용방법','처음부터 쉽게 보기','openSiteGuide()')
      +neonCard('#ff8fc8','#ff2d8a','radial-gradient(circle,#ff4d9f,#68123f)','🚩','신고 게시판','신고·문의 접수','report()')
      +neonCard('#75e4ff','#1bbfff','radial-gradient(circle,#35d4ff,#0b4264)','📣','광고 문의','광고·판매자 문의','openAd()')
      +neonCard('#ffe071','#ffb500','radial-gradient(circle,#ffd85a,#6b4200)','💼','투자자 안내','방송 수익 정산 안내','openInvestorInfo()')
      +neonCard('#c3b7ff','#6558ff','radial-gradient(circle,#8b7dff,#30276a)','👑','구독·VIP 혜택','할인·입장 가능 방','openSubs()')
      +neonCard('#ffb09a','#ff633f','radial-gradient(circle,#ff8a62,#682310)','🎁','선물·보물상자','선물 종류 확인','openGifts()')
      +neonCard('#ff9baa','#ff405d','radial-gradient(circle,#ff6d82,#681724)','🌹','장미 충전','충전 수량 확인','openCharge()')
      +neonCard('#91f3ee','#31cfc7','radial-gradient(circle,#5fe3dc,#145452)','🎯','제비뽑기','이벤트 참여','openRaffle()')
      +neonCard('#a8d0ff','#4a9aff','radial-gradient(circle,#79b8ff,#153968)','✉','쪽지','메시지 확인','openMessages()')
      +neonCard('#8ff6ad','#2bd365','radial-gradient(circle,#52ef8a,#16542d)','♛','프로필','내 정보 확인','openProfile()')
      +'</div></div>';
    showSheet('K-Talk 사용방법·혜택',html);
  };

  window.openSiteGuide=function(){
    showSheet('❔ 사이트 사용방법',
      '<div class="rowbox"><b>1. 홈</b><br>동영상과 쇼츠를 한 화면에서 바로 볼 수 있습니다.</div>'+
      '<div class="rowbox"><b>2. 방송하기</b><br>아래 ＋ 버튼을 누르면 라이브 준비 화면으로 들어갑니다.</div>'+
      '<div class="rowbox"><b>3. 방송목록</b><br>현재 방송 중인 방을 확인할 수 있습니다.</div>'+
      '<div class="rowbox"><b>4. 채팅·내 정보</b><br>하단 메뉴에서 채팅과 프로필을 확인합니다.</div>'+
      '<div class="rowbox"><b>5. 방송방 종류</b><br>일반 13명방, 1인 방송, 비밀번호방, 구독자 전용방 등이 있으며 각 방의 조건에 맞게 이용합니다.</div>'+
      '<div class="rowbox"><b>6. 선물·보물상자</b><br>선물 종류와 보물상자 이벤트는 사용방법 메뉴에서 확인할 수 있습니다.</div>');
  };

  window.openSubs=function(){
    showSheet('👑 구독·VIP 혜택',
      '<div style="padding:3px 0 4px">'+
      '<div class="rowbox" style="border-color:#67e3a066;box-shadow:0 0 14px #35d66b33"><b style="color:#9ff5bd">🙂 일반회원 혜택</b><br>일반회원도 일반 13명방·1인 방송 이용, 출석체크, 제비뽑기, 보물상자 등 기본 이벤트 혜택에 참여할 수 있습니다.</div>'+
      '<div class="rowbox" style="border-color:#ff6d8f66;box-shadow:0 0 14px #ff456c33"><b style="color:#ffb4c5">🌹 7일 출석 보너스</b><br>출석을 7일 연속 완료하면 장미 10개를 보너스로 받는 혜택을 적용합니다.</div>'+
      '<div class="rowbox" style="border-color:#91f3ee66;box-shadow:0 0 14px #31cfc733"><b style="color:#b8fff8">🎯 제비뽑기 혜택</b><br>제비뽑기에 참여해 장미 보상을 받을 수 있습니다. 당첨 보상은 1~5송이이며 꽝 항목도 포함됩니다.</div>'+
      '<div class="rowbox" style="border-color:#ffb09a66;box-shadow:0 0 14px #ff633f33"><b style="color:#ffd0c2">🎁 보물상자·이벤트</b><br>일반회원부터 참여 가능한 보물상자와 출석 이벤트를 통해 추가 장미 보상을 받을 수 있습니다.</div>'+
      '<div class="rowbox" style="border-color:#7f6cff66;box-shadow:0 0 14px #6a58ff33"><b style="color:#c9c1ff">💎 구독자 혜택</b><br>구독자는 구독자 전용방을 이용할 수 있고, 비밀방도 방 이용 조건에 맞으면 입장할 수 있습니다. 유료 구독자는 승인 절차를 간단하게 적용합니다.</div>'+
      '<div class="rowbox" style="border-color:#ff5ea566;box-shadow:0 0 14px #ff4b9b33"><b style="color:#ffb0d1">🌹 장미 할인 혜택</b><br>회원 등급에 따라 장미 할인 혜택을 적용합니다. 일반 등급 5% · 중회원 10% · VIP 15% 할인 기준으로 안내합니다.</div>'+
      '<div class="rowbox" style="border-color:#43d7ff66;box-shadow:0 0 14px #32c8ff33"><b style="color:#91eaff">🔓 이용 가능한 방</b><br>일반회원은 일반 13명방과 1인 방송을 이용할 수 있습니다. 구독자는 구독자 전용방을 이용할 수 있고, 비밀방은 비밀번호와 해당 이용 조건을 충족해야 입장할 수 있습니다.</div>'+
      '<div class="rowbox" style="border-color:#ffd45c66;box-shadow:0 0 14px #ffca3633"><b style="color:#ffe899">👑 VIP 혜택</b><br>VIP는 VIP 등급 표시와 최대 장미 할인 혜택을 적용하며, 구독자 전용방 등 회원 등급에 맞는 혜택을 함께 이용할 수 있습니다.</div>'+
      '<div class="note">회원 혜택은 일반회원도 참여 가능한 기본 이벤트와 구독·VIP 추가 혜택을 함께 적용합니다. 실제 결제 금액과 이용 조건은 결제 화면과 운영 정책에 맞춰 표시합니다.</div></div>');
  };

  window.openInvestorInfo=function(){
    showSheet('💼 투자자 안내',
      '<div class="rowbox"><b>📅 정산일</b><br>투자자 수익금 정산은 매달 1일 진행하는 방식으로 안내합니다.</div>'+
      '<div class="rowbox"><b>📡 정산 대상</b><br>K-Talk 방송에서 발생한 방송 관련 수익만 투자자 수익 분배 대상에 포함합니다.</div>'+
      '<div class="rowbox"><b>🚫 제외 수익</b><br>광고 수익, 상품 판매 수익, 외부 업체와 별도로 체결한 계약에서 발생한 수익은 투자자 분배 대상에서 제외합니다.</div>'+
      '<div class="rowbox"><b>💰 수익금 분배</b><br>방송 수익을 기준으로 계약서에 정한 지분과 정산 기준에 따라 분배합니다. 실제 금액은 해당 월의 방송 실적에 따라 달라질 수 있습니다.</div>'+
      '<div class="note">투자는 손실 위험이 있으며 원금이나 수익을 확정적으로 보장할 수 없습니다. 실제 투자 모집 전에는 계약 조건과 관련 법률을 전문가에게 확인하는 것이 필요합니다.</div>');
  };
})();