/* K-Talk 최신 주요 기능/사용방법 안내.
   기능 동작은 변경하지 않고 안내문만 보강한다. */
(function(){
  if(window.__ktLatestHelpGuide20260928)return;
  window.__ktLatestHelpGuide20260928=true;

  function guideHtml(){
    return ''
      +'<div class="rowbox"><b>📺 방송방 이용</b><br>1인방 · 9명방 · 13명방 · 구독방 · 비밀방을 이용할 수 있습니다. 라이브 시작을 누르면 선택한 방송방으로 바로 들어갑니다.</div>'
      +'<div class="rowbox"><b>👤 게스트 사진 크게 보기</b><br>방송방에서 게스트 사진이나 영상을 누르면 크게 볼 수 있습니다. 호스트 사진은 좋아요를 눌러야 하므로 확대되지 않습니다.</div>'
      +'<div class="rowbox"><b>📷 게스트 확대 화면 기능</b><br>게스트를 크게 본 화면 안에서 📷 카메라 · 🎤 마이크 · ↻ 되돌리기 · 👥 초대 버튼을 사용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>♥ 좋아요</b><br>모든 방송방에서 방송 시간 바로 옆의 ♥ 숫자를 누르면 좋아요가 1씩 올라갑니다.</div>'
      +'<div class="rowbox"><b>🔥 일일 랭킹 · 🎯 미션 · 👥 시청자</b><br>방 상단 안내 줄에서 일일 랭킹, 현재 미션, 시청자 현황을 확인할 수 있습니다.</div>'
      +'<div class="rowbox"><b>↻ 되돌리기 · 🎁 보물상자 · ⚔ 매치</b><br>일일 랭킹 · 미션 · 시청자 줄 바로 아래에서 되돌리기, 보물상자, 매치를 사용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>🎁 보물상자</b><br>보물상자 버튼은 아이콘과 글씨가 옆으로 표시됩니다. 방에 올라온 보물상자는 시간이 끝나면 자동으로 사라집니다.</div>'
      +'<div class="rowbox"><b>🎯 미션 1단계</b><br>🌹 장미 50개 깨기</div>'
      +'<div class="rowbox"><b>🎯 미션 2단계</b><br>💗 하트 30개짜리 20개 깨기</div>'
      +'<div class="rowbox"><b>🎯 미션 3단계</b><br>🎈 풍선 80개짜리 10개 깨기</div>'
      +'<div class="rowbox" style="border-color:#ffd84f;background:rgba(255,216,79,.08)"><b>🎉 미션 완료 보상</b><br>1·2·3단계를 모두 완료하면 회사에서 🌹 장미 50개를 지급하는 방식으로 안내합니다.</div>'
      +'<div class="rowbox"><b>💬 채팅</b><br>방송 중 채팅은 방 화면 아래쪽에서 확인하고 메시지를 입력할 수 있습니다.</div>'
      +'<div class="rowbox"><b>🌹 장미 · 🎁 선물</b><br>방송 중 장미와 선물을 보낼 수 있고, 큰 선물은 선물상자에서 확인할 수 있습니다.</div>'
      +'<div class="rowbox"><b>⚔ 매치</b><br>방송 중 매치 버튼을 눌러 1대1 매치 기능을 사용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>✅ 출석체크</b><br>방송방의 출석체크 버튼을 눌러 출석 혜택을 확인할 수 있습니다.</div>'
      +'<div class="rowbox"><b>🔒 비밀방</b><br>비밀방은 방장이 정한 비밀번호를 이용해 입장하며, 해당 방의 이용 조건을 따라야 합니다.</div>'
      +'<div class="rowbox"><b>👑 구독방</b><br>구독자 전용방과 구독 등급별 혜택은 구독·VIP 혜택에서 확인할 수 있습니다.</div>'
      +'<div class="rowbox"><b>✨ 카메라 · 보정</b><br>카메라, AI 보정, 편집 효과를 이용해 방송 화면을 조절할 수 있습니다.</div>'
      +'<div class="rowbox"><b>📶 연결 안내</b><br>Wi-Fi 또는 모바일 데이터로 이용할 수 있으며 통신 상태에 따라 영상 연결 속도가 달라질 수 있습니다.</div>';
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