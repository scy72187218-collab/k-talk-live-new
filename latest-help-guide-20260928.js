/* K-Talk 최신 주요 기능/사용방법 안내.
   기능 동작은 변경하지 않고 안내문만 보강한다. */
(function(){
  if(window.__ktLatestHelpGuide20260928)return;
  window.__ktLatestHelpGuide20260928=true;

  function guideHtml(){
    return ''
      +'<div class="rowbox"><b>📺 방송방 바로 입장</b><br>1인방 · 9명방 · 13명방 · 구독방 · 비밀방은 라이브 시작을 누르면 선택한 방으로 바로 들어갑니다.</div>'
      +'<div class="rowbox"><b>🔥 일일 랭킹 · 🎯 미션 · 👥 시청자</b><br>방 상단 첫 줄에서 일일 랭킹, 미션, 시청자 현황을 확인합니다.</div>'
      +'<div class="rowbox"><b>↻ 되돌리기 · 🎁 보물상자 · ⚔ 매치</b><br>첫 줄 바로 아래에서 되돌리기, 보물상자, 매치를 사용합니다.</div>'
      +'<div class="rowbox"><b>📷 카메라 · 🎤 마이크</b><br>맨 아래에서 카메라와 마이크를 직접 켜고 끌 수 있습니다. 카메라와 마이크는 바로 옆에 배치되어 있습니다.</div>'
      +'<div class="rowbox"><b>🎬 영화 · TV · 유튜브</b><br>호스트와 운영진용 영화 기능입니다. 저작권이 없거나 본인이 방송 권한을 가진 영상만 이용합니다.</div>'
      +'<div class="rowbox"><b>👤 게스트 사진 크게 보기</b><br>게스트 사진이나 영상을 누르면 크게 볼 수 있습니다. 호스트 화면은 좋아요 사용을 위해 확대 대상에서 제외합니다.</div>'
      +'<div class="rowbox"><b>🎁 사진을 누르면 선물 바로 선택</b><br>게스트 사진을 크게 열면 선물상자를 다시 누르지 않아도 작은 선물부터 큰 선물까지 선물 목록이 바로 펼쳐집니다. 선택한 사람에게 바로 보낼 수 있습니다.</div>'
      +'<div class="rowbox"><b>🎁 서로 선물 보내기</b><br>호스트↔게스트, 게스트↔게스트 모두 사람 사진을 선택해 그 사람에게 선물을 보낼 수 있습니다.</div>'
      +'<div class="rowbox"><b>🌹 받은 장미 확인</b><br>받은 장미 숫자를 누르면 누가 몇 개를 줬는지 보낸 사람별 합계와 최근 내역을 확인할 수 있습니다.</div>'
      +'<div class="rowbox"><b>📷 카메라 OFF 5가지 선택</b><br>카메라를 끄면 여성 캐릭터 2개 · 남성 캐릭터 2개 · 배경 화면 1개, 총 5가지 중 하나를 직접 골라 사용할 수 있습니다. 다시 카메라를 켜면 영상으로 돌아옵니다.</div>'
      +'<div class="rowbox"><b>🎤 노래 중 게스트 마이크 자동 잠금</b><br>노래가 시작되면 호스트·운영진은 그대로 두고 게스트 마이크만 자동 잠금됩니다. 노래가 끝나면 이전 상태로 자동 복원됩니다.</div>'
      +'<div class="rowbox"><b>♥ 좋아요</b><br>방송 시간 바로 옆의 ♥ 숫자를 눌러 좋아요를 올릴 수 있습니다.</div>'
      +'<div class="rowbox"><b>🎁 보물상자</b><br>보물상자는 방에서 확인할 수 있고 시간이 끝나면 자동으로 사라집니다.</div>'
      +'<div class="rowbox"><b>🎯 미션 1단계</b><br>🌹 장미 50개 깨기</div>'
      +'<div class="rowbox"><b>🎯 미션 2단계</b><br>💗 하트 30개짜리 20개 깨기</div>'
      +'<div class="rowbox"><b>🎯 미션 3단계</b><br>🎈 풍선 80개짜리 10개 깨기</div>'
      +'<div class="rowbox" style="border-color:#ffd84f;background:rgba(255,216,79,.08)"><b>🎉 미션 전체 완료</b><br>1·2·3단계를 모두 완료하면 회사에서 🌹 장미 50개를 지급합니다.</div>'
      +'<div class="rowbox"><b>💬 채팅 · 👥 친구 · ↗ 공유 · 🪄 효과 · ••• 더보기</b><br>방 하단의 기존 기능을 그대로 사용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>✅ 모든 스위치 작동</b><br>방 선택, 라이브 준비, 카메라 전환, AI 보정, 편집 효과, 설정, 관리자 스위치 등 앱 안의 스위치는 터치해서 실제 작동하도록 유지합니다.</div>'
      +'<div class="rowbox"><b>✅ 출석체크</b><br>방송방 출석체크 기능과 출석 혜택을 이용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>🔒 비밀방</b><br>비밀방은 설정된 이용 조건과 비밀번호에 따라 입장합니다.</div>'
      +'<div class="rowbox"><b>👑 구독방</b><br>구독자 전용방과 구독 등급별 혜택을 이용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>📶 연결 안내</b><br>Wi-Fi 또는 모바일 데이터 상태에 따라 영상 연결 속도가 달라질 수 있습니다.</div>';
  }

  window.openSiteGuide=function(){
    if(typeof window.showSheet==='function'){
      window.showSheet('❔ K-Talk 전체 사용방법',guideHtml());
    }
  };

  window.openLatestFeatureGuide=function(){
    window.openSiteGuide();
  };

  function addBenefitGuideButton(){
    try{
      var body=document.getElementById('sheetBody');
      if(!body)return;
      var home=body.querySelector('.kt-benefit-home');
      if(!home||home.querySelector('[data-kt-latest-feature-guide]'))return;

      var b=document.createElement('button');
      b.type='button';
      b.setAttribute('data-kt-latest-feature-guide','1');
      b.className='act';
      b.style.cssText='margin:8px 0!important;background:linear-gradient(135deg,#4338ca,#0ea5e9)!important;color:#fff!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:9!important';
      b.innerHTML='📖 주요 기능 · 전체 사용방법';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        window.openSiteGuide();
      };
      home.insertBefore(b,home.firstChild);
    }catch(e){}
  }

  function wrapBenefit(){
    if(typeof window.openBenefitHub!=='function'||window.openBenefitHub.__ktLatestGuideWrapped)return;
    var old=window.openBenefitHub;
    var fn=function(){
      var r=old.apply(this,arguments);
      [0,40,120].forEach(function(ms){setTimeout(addBenefitGuideButton,ms);});
      return r;
    };
    fn.__ktLatestGuideWrapped=true;
    window.openBenefitHub=fn;
  }

  function run(){
    wrapBenefit();
    addBenefitGuideButton();
  }

  run();
  [100,300,700,1500].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktLatestHelpGuideTimer);
      window.__ktLatestHelpGuideTimer=setTimeout(run,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();