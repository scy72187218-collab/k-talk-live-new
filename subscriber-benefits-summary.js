/* K-Talk 구독자 혜택 안내문만 정리. 방 화면/기능은 변경하지 않음. */
(function(){
  function install(){
    window.openSubscriberBenefits=function(){
      var html=''
        +'<div class="rowbox"><b>🥉 9,900원 구독 · 동메달</b><br>'
          +'닉네임 옆 동메달 표시 · 모든 방송방 입장·방 만들기 가능 · '
          +'코인 500개부터 보너스 10개 · 코인 구매 할인 없음 · '
          +'7일 방송 시 장미 14송이 · 전화번호·계좌번호 등록 불가 · '
          +'매치에서 받은 보상 10% 추가</div>'
        +'<div class="rowbox"><b>🥈 14,900원 구독 · 은메달</b><br>'
          +'닉네임 옆 은메달 표시 · 모든 방송방 입장·방 만들기 가능 · '
          +'코인 500개부터 보너스 20개 + 10% 할인 · '
          +'7일 방송 시 장미 14송이 · 전화번호·계좌번호 등록 가능 · '
          +'매치에서 받은 보상 10% 추가</div>'
        +'<div class="rowbox"><b>🥇 VIP 19,900원 구독 · 금메달</b><br>'
          +'닉네임 옆 🥇 VIP 표시 · 모든 방송방 입장·방 만들기 가능 · '
          +'코인 500개부터 보너스 30개 + 20% 할인 · '
          +'7일 방송 시 장미 14송이 · 전화번호·계좌번호 등록 가능 · '
          +'매치에서 받은 보상 10% 추가</div>'
        +'<div class="rowbox"><b>⚔ 월 1회 매치 랭킹 보상</b><br>'
          +'1등 100개 · 2등 80개 · 3등 50개 · 4등 30개 · 5등 30개</div>';
      if(window.showSheet)showSheet('💎 K-Talk 구독자 혜택',html);
    };
  }

  install();
  setTimeout(install,0);
  setTimeout(install,200);
  setTimeout(install,700);
})();
