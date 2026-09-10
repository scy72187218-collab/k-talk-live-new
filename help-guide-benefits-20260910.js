/* K-Talk 사용방법·혜택 안내 보강: 카메라/보정 사용법 + 혜택 버튼/AI 읽기 복구. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktHelpBeautyGuideInstalled)return;
  window.__ktHelpBeautyGuideInstalled=true;

  function speakText(text){
    text=String(text||'').replace(/\s+/g,' ').trim();
    if(!text)return;
    try{
      if(typeof window.ktSpeak==='function'){
        window.ktSpeak(text);
        return;
      }
    }catch(e){}
    try{
      if(!('speechSynthesis' in window))return;
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang='ko-KR';
      u.rate=1;
      u.pitch=1;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  window.ktReadCurrentBenefit=function(){
    try{
      var body=document.getElementById('sheetBody');
      if(!body)return;
      var clone=body.cloneNode(true);
      clone.querySelectorAll('button,input,select,textarea').forEach(function(el){el.remove();});
      var text=String(clone.textContent||'').replace(/\s+/g,' ').trim();
      if(text)speakText(text);
    }catch(e){}
  };

  function decorateBenefitHub(){
    try{
      var sheet=document.getElementById('sheet');
      var body=document.getElementById('sheetBody');
      if(!sheet||!body||!body.querySelector('.kt-benefit-home'))return;
      sheet.classList.add('benefit-center-sheet');
      body.querySelectorAll('.kt-benefit-home button').forEach(function(btn){
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('position','relative','important');
        btn.style.setProperty('z-index','5','important');
      });

      /* 정산 금액 카드만 보강: 장미 1개=30원, 일반 35%, 구독자 40%를 함께 계산해 표시 */
      try{
        var top=body.querySelector('.kt-benefit-top');
        if(top&&top.children&&top.children.length>=3){
          var roseStrong=top.children[0].querySelector('strong');
          var payoutStrong=top.children[2].querySelector('strong');
          var roses=parseInt(String(roseStrong&&roseStrong.textContent||'').replace(/[^0-9]/g,''),10)||0;
          if(roses>0&&payoutStrong){
            var total=roses*30;
            var general=Math.round(total*0.35);
            var subscriber=Math.round(total*0.40);
            payoutStrong.innerHTML='<span style="display:block;white-space:nowrap;font-size:.78em">일반 35% · '+general.toLocaleString('ko-KR')+'원</span>'
              +'<span style="display:block;white-space:nowrap;font-size:.78em;margin-top:2px">구독자 40% · '+subscriber.toLocaleString('ko-KR')+'원</span>';
          }
        }
      }catch(e){}

      if(!body.querySelector('[data-kt-benefit-reader]')){
        var read=document.createElement('button');
        read.type='button';
        read.setAttribute('data-kt-benefit-reader','1');
        read.className='act';
        read.style.cssText='margin:8px 0 4px!important;background:linear-gradient(135deg,#6d5cff,#24b8ff)!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:8!important';
        read.textContent='🔊 AI가 혜택 내용 읽어주기';
        read.onclick=function(e){
          if(e){e.preventDefault();e.stopPropagation();}
          window.ktReadCurrentBenefit();
        };
        var home=body.querySelector('.kt-benefit-home');
        home.insertBefore(read,home.firstChild);
      }
    }catch(e){}
  }

  function installBenefitHubFix(){
    if(typeof window.openBenefitHub==='function'&&!window.openBenefitHub.__ktBenefitButtonFixed){
      var oldBenefit=window.openBenefitHub;
      var wrappedBenefit=function(){
        var r=oldBenefit.apply(this,arguments);
        setTimeout(decorateBenefitHub,0);
        return r;
      };
      wrappedBenefit.__ktBenefitButtonFixed=true;
      window.openBenefitHub=wrappedBenefit;
    }
  }

  function runBenefitAction(btn){
    var txt=String(btn&&btn.textContent||'').replace(/\s+/g,' ').trim();
    var fn=null;
    if(txt.indexOf('7일 방송 보상')>-1)fn=window.openWeeklyBroadcastReward;
    else if(txt.indexOf('제비뽑기')>-1)fn=window.openRaffleGuide;
    else if(txt.indexOf('출석 · 참여')>-1||txt.indexOf('출석·참여')>-1)fn=window.openAttendanceBenefits;
    else if(txt.indexOf('구독자 혜택')>-1)fn=window.openSubscriberBenefits;
    else if(txt.indexOf('장미 · 코인 충전')>-1||txt.indexOf('장미·코인 충전')>-1)fn=window.openChargeBenefits;
    else if(txt.indexOf('방 이용 혜택')>-1)fn=window.openRoomBenefits;
    else if(txt.indexOf('장미 · 선물')>-1||txt.indexOf('장미·선물')>-1)fn=window.openGifts;
    else if(txt.indexOf('혜택 주기')>-1)fn=window.openGiveBenefits;
    else if(txt.indexOf('미션 · 랭킹')>-1||txt.indexOf('미션·랭킹')>-1)fn=window.openRewardCenter;
    else if(txt.indexOf('팬클럽 혜택')>-1)fn=window.openSubs;
    else if(txt.indexOf('판매 · 정산')>-1||txt.indexOf('판매·정산')>-1)fn=window.openSellerCenter;
    else if(txt.indexOf('혜택 알림')>-1)fn=window.openBenefitAlerts;
    else if(txt.indexOf('보상 혜택')>-1)fn=window.openReceiveBenefits;
    else if(txt.indexOf('전체 사용방법')>-1)fn=window.openSiteGuide;
    if(typeof fn==='function'){
      fn();
      return true;
    }
    return false;
  }

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.kt-benefit-home button'):null;
    if(!btn||btn.hasAttribute('data-kt-benefit-reader'))return;
    if(runBenefitAction(btn)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  function installGuide(){
    if(typeof window.openMenu!=='function'||typeof window.showSheet!=='function')return false;
    installBenefitHubFix();
    var oldOpenMenu=window.openMenu;
    if(oldOpenMenu.__ktBeautyGuideWrapped)return true;

    window.openBeautyUseGuide=function(){
      showSheet('✨ 카메라·보정 사용법',
        '<div class="rowbox"><b>1. 카메라 켜기</b><br>방송하기 또는 촬영 화면에 들어가면 카메라 화면을 확인할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>2. AI 보정 열기</b><br>촬영 화면의 AI 보정을 누르면 보정 메뉴가 열립니다.</div>'+ 
        '<div class="rowbox"><b>3. 1~100 조절</b><br>피부·주름 완화·눈·코·입·턱 항목을 하나씩 선택한 뒤 슬라이더를 1~100 사이에서 조절합니다.</div>'+ 
        '<div class="rowbox"><b>4. 부위별 따로 조절</b><br>눈, 코, 입, 턱은 각각 따로 조절할 수 있어 원하는 정도만 적용할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>5. 기본 보정</b><br>카메라를 켜면 기본 자연 보정이 적용되며, 필요하면 각 항목을 다시 조절하거나 초기화할 수 있습니다.</div>'+ 
        '<div class="rowbox"><b>6. 편집 효과</b><br>하트·모자·선글라스 같은 화면 효과와 무대·바다 같은 배경 효과는 편집 효과 메뉴에서 선택합니다.</div>'+ 
        '<div class="note">보정과 효과는 화면 연출 기능입니다. 기기 성능이나 조명에 따라 보이는 정도가 달라질 수 있습니다.</div>');
    };

    window.openMenu=function(){
      oldOpenMenu.apply(this,arguments);
      setTimeout(function(){
        try{
          installBenefitHubFix();
          var body=document.getElementById('sheetBody');
          if(!body)return;
          var grid=body.querySelector('div[style*="grid-template-columns"]');
          if(!grid)return;

          if(!body.querySelector('[data-kt-benefit-main]')){
            var benefit=document.createElement('button');
            benefit.type='button';
            benefit.setAttribute('data-kt-benefit-main','1');
            benefit.onclick=function(){if(typeof window.openBenefitHub==='function')window.openBenefitHub();};
            benefit.style.cssText='display:flex;min-height:118px;border-radius:22px;padding:16px 14px;align-items:center;gap:12px;text-align:left;color:#fff;background:linear-gradient(145deg,#10111b,#07070d);font-weight:900;border:1.5px solid #ffd46e;box-shadow:0 0 18px #ff9e22,inset 0 0 24px #ff9e2233;pointer-events:auto;touch-action:manipulation';
            benefit.innerHTML='<span style="width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;flex:0 0 54px;background:radial-gradient(circle,#ffd85a,#6b4200);box-shadow:0 0 20px #ff9e22">🎁</span><span><b style="display:block;font-size:17px;line-height:1.15;margin-bottom:5px;color:#ffd46e">혜택 · 보상</b><small style="display:block;font-size:11px;color:#c9c9d1;font-weight:700">눌러서 내용 보기 · AI 읽어주기</small></span>';
            grid.insertBefore(benefit,grid.firstChild);
          }

          if(!body.querySelector('[data-kt-beauty-guide]')){
            var b=document.createElement('button');
            b.setAttribute('data-kt-beauty-guide','1');
            b.onclick=function(){window.openBeautyUseGuide();};
            b.style.cssText='display:flex;min-height:118px;border-radius:22px;padding:16px 14px;align-items:center;gap:12px;text-align:left;color:#fff;background:linear-gradient(145deg,#10111b,#07070d);font-weight:900;border:1.5px solid #9ff7d1;box-shadow:0 0 18px #35d89b,inset 0 0 24px #35d89b33';
            b.innerHTML='<span style="width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:28px;flex:0 0 54px;background:radial-gradient(circle,#58efb5,#145b43);box-shadow:0 0 20px #35d89b">✨</span><span><b style="display:block;font-size:17px;line-height:1.15;margin-bottom:5px;color:#9ff7d1">카메라·보정 사용법</b><small style="display:block;font-size:11px;color:#c9c9d1;font-weight:700">1~100 · 눈·코·입·턱 조절</small></span>';
            grid.insertBefore(b,grid.firstChild);
          }
        }catch(e){}
      },0);
    };
    window.openMenu.__ktBeautyGuideWrapped=true;
    return true;
  }

  if(!installGuide()){
    var tries=0;
    var t=setInterval(function(){
      tries++;
      if(installGuide()||tries>40)clearInterval(t);
    },100);
  }
})();
