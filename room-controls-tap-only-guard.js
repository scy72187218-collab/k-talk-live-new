/* 카메라·마이크·자리이동 표시 전용 보정: 방 입장 시 숨김, 사람 칸을 눌렀을 때만 표시, 한 번 사용하면 즉시 숨김. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomControlsTapOnlyGuardInstalled)return;
  window.__ktRoomControlsTapOnlyGuardInstalled=true;

  var tileSelector='.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest,.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest,.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot';
  var roomSelector='.ktg13-room,.ktsubscriber-room,.ktsecret-room';
  var controlSelector='.kt-inside-camera,.kt-inside-mic,.kt-inside-move-seat,.kt-inside-seat-up,.kt-inside-seat-down';

  function ensureStyle(){
    if(document.getElementById('ktRoomControlsTapOnlyGuardStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomControlsTapOnlyGuardStyle';
    s.textContent=''
      +'.kt-room-controls-hidden>.kt-inside-av-controls{opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(3px)!important}'
      +'.kt-room-controls-tap-open>.kt-inside-av-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}';
    document.head.appendChild(s);
  }

  function hide(tile){
    if(!tile)return;
    try{clearTimeout(tile.__ktTapOnlyHideTimer);}catch(e){}
    tile.classList.remove('kt-room-controls-tap-open');
    tile.classList.add('kt-room-controls-hidden');
  }

  function hideRoom(room){
    if(!room)return;
    try{room.querySelectorAll(tileSelector).forEach(hide);}catch(e){}
  }

  function open(tile){
    if(!tile||!tile.querySelector(':scope > .kt-inside-av-controls'))return;
    var room=tile.closest(roomSelector);
    if(room)hideRoom(room);
    tile.classList.remove('kt-room-controls-hidden');
    tile.classList.add('kt-room-controls-tap-open');
    try{clearTimeout(tile.__ktTapOnlyHideTimer);}catch(e){}
    tile.__ktTapOnlyHideTimer=setTimeout(function(){hide(tile);},2600);
  }

  function install(){
    ensureStyle();
    document.querySelectorAll(tileSelector).forEach(function(tile){
      if(!tile.classList.contains('kt-room-controls-tap-open'))tile.classList.add('kt-room-controls-hidden');
    });
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest(controlSelector);
    if(btn){
      var tile=btn.closest(tileSelector);
      var room=btn.closest(roomSelector);
      setTimeout(function(){
        if(tile)hide(tile);
        if(room)hideRoom(room);
      },0);
      return;
    }
    if(t.closest('.kt-inside-av-controls'))return;
    var tile=t.closest(tileSelector);
    if(tile)open(tile);
  },true);

  install();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktRoomControlsTapOnlyGuardTimer);
      window.__ktRoomControlsTapOnlyGuardTimer=setTimeout(install,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 9명 일반방 버튼 터치 선택만 보정하고, 사용방법에 9명 일반방 문구가 빠졌으면 다시 표시. */
(function(){
  if(window.__ktNineGeneralPrepTouchGuideFixInstalled)return;
  window.__ktNineGeneralPrepTouchGuideFixInstalled=true;

  function ensureNineButton(){
    try{
      document.querySelectorAll('.live-prep .kt-room9-general,.live-prep .kt-room9-switch').forEach(function(btn){
        btn.classList.add('room-switch');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('position','relative','important');
        btn.style.setProperty('z-index','31','important');
      });
    }catch(e){}
  }

  function installGuidePatch(){
    if(typeof window.openSiteGuide!=='function'||window.openSiteGuide.__ktNineGeneralGuideFixed)return false;
    var old=window.openSiteGuide;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body)return;
          var rows=[].slice.call(body.querySelectorAll('.rowbox'));
          var row=rows.find(function(el){return String(el.textContent||'').indexOf('방송방 종류')>-1;});
          if(!row)return;
          var txt=String(row.textContent||'');
          if(txt.indexOf('9명 일반방')>-1)return;
          if(row.innerHTML.indexOf('일반 13명방')>-1){
            row.innerHTML=row.innerHTML.replace('일반 13명방','9명 일반방, 13명 방송');
          }else{
            row.innerHTML+='<br>9명 일반방은 호스트 1명과 게스트 8명이 함께 이용합니다.';
          }
        }catch(e){}
      },0);
      return r;
    };
    wrapped.__ktNineGeneralGuideFixed=true;
    window.openSiteGuide=wrapped;
    return true;
  }

  ensureNineButton();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(ensureNineButton,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktNineGeneralPrepTouchTimer);
      window.__ktNineGeneralPrepTouchTimer=setTimeout(ensureNineButton,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  if(!installGuidePatch()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(installGuidePatch()||tries>40)clearInterval(timer);
    },100);
  }
})();

/* 지금까지 적용된 기능 중 사용방법/혜택에 필요한 내용만 안내 화면에 추가. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktCurrentGuideBenefitSummaryInstalled)return;
  window.__ktCurrentGuideBenefitSummaryInstalled=true;

  function row(title,text){
    return '<div class="rowbox"><b>'+title+'</b><br>'+text+'</div>';
  }

  function guideHtml(){
    return '<div id="ktCurrentGuideSummary">'
      +'<div class="kt-guide-title" style="margin-top:14px">📌 지금까지 적용된 사용방법</div>'
      +row('방송방 5개','1인 방송 · 9명 일반방 · 13명 방송 · 구독자방 · 비밀방 중 원하는 방을 선택해 라이브를 시작합니다.')
      +row('카메라 · 마이크 · 자리 이동','9명·13명·구독자·비밀방에서는 사람 칸을 누르면 카메라, 마이크, 자리 이동 버튼이 잠깐 나타납니다. 한 번 사용하면 자동으로 사라지고, 필요하면 사람 칸을 다시 누릅니다. 자리 이동은 위·아래 이동도 사용할 수 있습니다.')
      +row('프로필 표시','9명·13명·구독자·비밀방의 호스트와 게스트 칸에는 프로필 사진, 레벨, 닉네임이 표시됩니다.')
      +row('동전 · 장미 내역','게스트 칸 왼쪽 위에 동전과 받은 장미 개수가 표시됩니다. 표시를 누르면 누가 장미를 보냈는지 받은 내역을 확인할 수 있습니다.')
      +row('좋아요 · 상단 하트','오른쪽 좋아요를 누르거나 호스트 얼굴·카메라 화면을 누르면 위쪽 하트 숫자가 1씩 올라갑니다.')
      +row('출석체크','1인·9명·13명·구독자·비밀방 모두 출석체크 옆에 출석 인원 숫자가 표시됩니다. 방 안 출석체크는 별도 보상창을 띄우지 않고 처리되며 AI가 “출석 체크했다”라고 읽어줍니다.')
      +row('미션','미션에는 장미 1개짜리 30개 깨기 · 스포츠카 50개짜리 10개 깨기 · 다이아몬드 하트 400개짜리 10개 깨기가 표시됩니다.')
      +row('좋아요 · 효과 · 보물상자 · 매치','다섯 방의 오른쪽 퀵 기능은 테두리와 배경 없이 아이콘과 글자만 떠 있는 형태로 표시됩니다.')
      +row('카메라 · AI 보정','AI 보정에서 피부·주름·눈·코·입·턱 등을 1~100으로 조절할 수 있고, 편집효과에서 화면 효과와 배경 효과를 선택할 수 있습니다. 카메라·보정 사용법 화면은 AI가 내용을 읽어줍니다.')
      +row('테스트 시청자 표시','테스트 방송에서는 테스트 시청자 5~10명 표시가 보일 수 있습니다.')
      +'</div>';
  }

  function benefitHtml(){
    return '<div id="ktCurrentBenefitSummary" style="margin-top:12px">'
      +'<div class="kt-guide-title">🎁 현재 적용된 주요 혜택</div>'
      +row('출석 보상','다섯 방송방에서 그날 첫 출석체크를 하면 장미 1송이가 지급되고 출석 인원 숫자가 올라갑니다.')
      +row('게스트 좋아요 보상','게스트는 좋아요 30개를 달성하면 장미 1송이를 받을 수 있습니다. 1시간에 1번, 최대 5시간 동안 최대 장미 5송이까지 적용되는 보상 안내가 있습니다.')
      +row('장미 정산 안내','장미 1개는 30원 기준으로 표시되며, 현재 혜택 화면의 정산 안내는 일반회원 35% · 구독자 40% 기준을 함께 보여줍니다.')
      +row('미션 참여','장미 · 스포츠카 · 다이아몬드 하트 미션을 방송 중 확인하고 목표 달성에 참여할 수 있습니다.')
      +row('AI 혜택 안내','혜택·보상 화면은 AI 읽기 기능으로 화면 내용을 음성으로 들을 수 있습니다.')
      +'</div>';
  }

  function appendGuide(){
    try{
      var body=document.getElementById('sheetBody');
      if(!body||document.getElementById('ktCurrentGuideSummary'))return;
      body.insertAdjacentHTML('beforeend',guideHtml());
    }catch(e){}
  }

  function appendBenefit(){
    try{
      var body=document.getElementById('sheetBody');
      if(!body||document.getElementById('ktCurrentBenefitSummary'))return;
      var home=body.querySelector('.kt-benefit-home');
      (home||body).insertAdjacentHTML('beforeend',benefitHtml());
    }catch(e){}
  }

  function wrapGuide(){
    if(typeof window.openSiteGuide!=='function'||window.openSiteGuide.__ktCurrentSummaryWrapped)return false;
    var old=window.openSiteGuide;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(appendGuide,0);
      return r;
    };
    wrapped.__ktCurrentSummaryWrapped=true;
    window.openSiteGuide=wrapped;
    return true;
  }

  function wrapBenefit(){
    if(typeof window.openBenefitHub!=='function'||window.openBenefitHub.__ktCurrentSummaryWrapped)return false;
    var old=window.openBenefitHub;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(appendBenefit,0);
      return r;
    };
    wrapped.__ktCurrentSummaryWrapped=true;
    window.openBenefitHub=wrapped;
    return true;
  }

  function install(){wrapGuide();wrapBenefit();}
  install();
  var tries=0;
  var timer=setInterval(function(){
    tries++;
    install();
    if((window.openSiteGuide&&window.openSiteGuide.__ktCurrentSummaryWrapped)&&(window.openBenefitHub&&window.openBenefitHub.__ktCurrentSummaryWrapped)||tries>50)clearInterval(timer);
  },100);
})();
