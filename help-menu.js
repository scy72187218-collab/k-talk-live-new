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
      +neonCard('#ffe071','#ffb500','radial-gradient(circle,#ffd85a,#6b4200)','💼','투자자 안내','사업·투자 안내','openInvestorInfo()')
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
      '<div class="rowbox" style="border-color:#7f6cff66;box-shadow:0 0 14px #6a58ff33"><b style="color:#c9c1ff">💎 구독자 혜택</b><br>구독자는 구독자 전용방을 이용할 수 있고, 일반방과 1인 방송 등 이용 가능한 방송방을 더 편하게 확인할 수 있습니다.</div>'+
      '<div class="rowbox" style="border-color:#ff5ea566;box-shadow:0 0 14px #ff4b9b33"><b style="color:#ffb0d1">🌹 장미 충전 할인</b><br>구독자는 500개 이상 충전할 때 할인 혜택을 적용하는 방식으로 안내합니다. 실제 할인율과 결제 조건은 결제 화면에서 명확하게 표시해야 합니다.</div>'+
      '<div class="rowbox" style="border-color:#43d7ff66;box-shadow:0 0 14px #32c8ff33"><b style="color:#91eaff">🔓 이용 가능한 방</b><br>일반 13명방 · 1인 방송 · 구독자 전용방을 이용할 수 있으며, 비밀번호방은 방장이 정한 비밀번호가 있어야 입장할 수 있습니다. 기타 제한 방은 해당 이용 조건을 충족해야 합니다.</div>'+
      '<div class="rowbox" style="border-color:#ffd45c66;box-shadow:0 0 14px #ffca3633"><b style="color:#ffe899">👑 VIP 안내</b><br>VIP 전용 혜택과 입장 권한은 회원 등급 확인 후 적용되도록 구성합니다.</div>'+
      '<div class="note">구독·VIP 혜택과 할인 내용은 실제 서비스 정책과 결제 조건에 맞춰 최종 확정해야 합니다.</div></div>');
  };

  window.openInvestorInfo=function(){
    showSheet('💼 투자자 안내','<div class="rowbox"><b>K-Talk 사업·투자 안내</b><br>사업 구조, 투자 조건, 정산 방식, 비용과 위험을 계약 전에 충분히 확인해야 합니다.</div><div class="note">투자에는 손실 위험이 있으며 원금이나 수익을 확정적으로 보장할 수 없습니다.</div>');
  };
})();