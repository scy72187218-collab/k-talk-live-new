/* K-Talk 구독 요금/혜택 규칙만 적용. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktSubscriptionTierRulesInstalled)return;
  window.__ktSubscriptionTierRulesInstalled=true;

  var PLANS={
    9900:{price:9900,discount:0,minDiscountQty:500,coinBonus:10,minBonusQty:500,allRooms:true,weeklyRoses:14,contactPost:false,label:'구독자'},
    14900:{price:14900,discount:10,minDiscountQty:500,coinBonus:20,minBonusQty:500,allRooms:true,weeklyRoses:14,contactPost:true,label:'중회원'},
    19900:{price:19900,discount:20,minDiscountQty:500,coinBonus:30,minBonusQty:500,allRooms:true,weeklyRoses:14,contactPost:true,label:'VIP'}
  };

  function digits(v){return parseInt(String(v==null?'':v).replace(/[^0-9]/g,''),10)||0;}
  function normalizePlan(v){
    var n=digits(v);
    if(n===9900||n===14900||n===19900)return n;
    var s=String(v==null?'':v).toLowerCase();
    if(s.indexOf('vip')>-1)return 19900;
    if(s.indexOf('중회원')>-1||s.indexOf('middle')>-1)return 14900;
    if(s.indexOf('구독')>-1||s.indexOf('subscriber')>-1)return 9900;
    return 0;
  }

  window.ktSubscriptionPlans=PLANS;
  window.ktGetSubscriptionPrice=function(){
    var vals=[];
    try{
      if(window.state){
        vals.push(state.subscriptionPrice,state.subPrice,state.planPrice,state.membershipPrice,state.memberPrice,
          state.subscriptionTier,state.memberGrade,state.memberType,state.membership,state.grade,
          state.isSubscriber===true?'구독자':'',state.vip===true?'VIP':'');
      }
    }catch(e){}
    try{
      ['ktalk_subscription_price','ktalk_sub_price','ktalk_plan_price','ktalk_membership_price','subscriptionPrice','memberPrice',
       'ktalk_subscription_tier','ktalk_member_grade','memberGrade','memberType','membership','grade'].forEach(function(k){
        var v=localStorage.getItem(k);if(v)vals.push(v);
      });
    }catch(e){}
    for(var i=0;i<vals.length;i++){
      var p=normalizePlan(vals[i]);
      if(p)return p;
    }
    return 0;
  };

  window.ktGetSubscriptionPlan=function(){
    var p=window.ktGetSubscriptionPrice();
    return PLANS[p]||null;
  };

  window.ktIsPaidSubscriber=function(){return !!window.ktGetSubscriptionPlan();};
  window.ktCanPostContactInfo=function(){
    var plan=window.ktGetSubscriptionPlan();
    return !!(plan&&plan.contactPost);
  };
  window.ktCoinDiscountPercent=function(qty){
    var plan=window.ktGetSubscriptionPlan();
    qty=parseInt(qty,10)||0;
    if(!plan||qty<plan.minDiscountQty)return 0;
    return plan.discount||0;
  };
  window.ktCoinTierBonus=function(qty){
    var plan=window.ktGetSubscriptionPlan();
    qty=parseInt(qty,10)||0;
    if(!plan||qty<plan.minBonusQty)return 0;
    return plan.coinBonus||0;
  };
  window.ktCoinDiscountedAmount=function(amount,qty){
    var rate=window.ktCoinDiscountPercent(qty);
    var a=Number(amount)||0;
    return Math.round(a*(100-rate)/100);
  };

  /* 구독자는 모든 방 입장/생성 가능. 비구독자는 기존 13명방 20 / 15명방 35 기준 그대로. */
  var oldCanEnter=window.ktCanEnterRoomByLevel;
  var oldCanCreate=window.ktCanCreateRoomByLevel;
  window.ktCanEnterRoomByLevel=function(roomType,level,isSubscriber){
    if(isSubscriber===true||window.ktIsPaidSubscriber())return true;
    return typeof oldCanEnter==='function'?oldCanEnter(roomType,level,isSubscriber):true;
  };
  window.ktCanCreateRoomByLevel=function(roomType,level){
    if(window.ktIsPaidSubscriber())return true;
    return typeof oldCanCreate==='function'?oldCanCreate(roomType,level):true;
  };

  /* 코인 500개부터: 9,900원 보너스 10개 / 14,900원 보너스 20개+10% 할인 / 19,900원 보너스 30개+20% 할인. */
  var oldSelectCoinCharge=window.selectCoinCharge;
  if(typeof oldSelectCoinCharge==='function'){
    window.selectCoinCharge=function(amount,base,bonus){
      var plan=window.ktGetSubscriptionPlan();
      if(!plan)return oldSelectCoinCharge.apply(this,arguments);
      var rate=window.ktCoinDiscountPercent(base);
      var tierBonus=window.ktCoinTierBonus(base);
      if(!rate&&!tierBonus)return oldSelectCoinCharge.apply(this,arguments);
      var pay=window.ktCoinDiscountedAmount(amount,base);
      var total=(Number(base)||0)+(Number(bonus)||0)+tierBonus;
      var msg=[];
      if(rate)msg.push('할인 '+rate+'%');
      if(tierBonus)msg.push('보너스 '+tierBonus+'개');
      try{if(window.ktSpeak)window.ktSpeak('코인 '+Number(base).toLocaleString('ko-KR')+'개 구매에 '+msg.join(' 그리고 ')+'가 적용됩니다.');}catch(e){}
      alert(msg.join(' · ')+' 적용 · 기본 '+Number(base).toLocaleString('ko-KR')+'개 · 결제 '+pay.toLocaleString('ko-KR')+'원 · 총 '+total.toLocaleString('ko-KR')+'개');
    };
  }

  var oldOpenCharge=window.openCharge;
  if(typeof oldOpenCharge==='function'){
    window.openCharge=function(){
      var r=oldOpenCharge.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('[data-kt-sub-discount-note]'))return;
          var plan=window.ktGetSubscriptionPlan();
          var note=document.createElement('div');
          note.className='rowbox';
          note.setAttribute('data-kt-sub-discount-note','1');
          if(!plan)note.innerHTML='<b>구독 코인 혜택</b><br>500개부터 9,900원 보너스 10개 · 14,900원 보너스 20개+10% 할인 · 19,900원 보너스 30개+20% 할인';
          else if(plan.price===9900)note.innerHTML='<b>9,900원 구독</b><br>코인 500개부터 보너스 10개 · 구매 할인 없음';
          else note.innerHTML='<b>'+plan.price.toLocaleString('ko-KR')+'원 구독</b><br>코인 500개부터 보너스 '+plan.coinBonus+'개 · '+plan.discount+'% 할인';
          body.insertBefore(note,body.firstChild);
        }catch(e){}
      },0);
      return r;
    };
  }

  /* 혜택 화면만 정확한 3개 요금제로 표시. */
  window.openSubscriberBenefits=function(){
    var html=''
      +'<div class="rowbox"><b>9,900원 구독</b><br>모든 방송방 입장·방 만들기 가능 · 코인 500개부터 보너스 10개 · 구매 할인 없음 · 7일 방송 시 장미 14송이 · 전화번호/계좌번호 등록 불가</div>'
      +'<div class="rowbox"><b>14,900원 구독</b><br>모든 방송방 이용 가능 · 코인 500개부터 보너스 20개 + 10% 할인 · 전화번호/계좌번호 등록 가능</div>'
      +'<div class="rowbox"><b>19,900원 구독</b><br>모든 방송방 이용 가능 · 코인 500개부터 보너스 30개 + 20% 할인 · 전화번호/계좌번호 등록 가능</div>';
    if(window.showSheet)showSheet('💎 K-Talk 구독자 혜택',html);
  };

  window.openWeeklyBroadcastReward=function(){
    var plan=window.ktGetSubscriptionPlan();
    var reward=(plan&&plan.weeklyRoses)||14;
    if(window.showSheet)showSheet('📅 7일 방송 보상',
      '<div class="rowbox"><b>보상</b><br>7일 동안 방송 조건을 채우면 장미 '+reward+'송이를 받습니다.</div>'
      +'<div class="rowbox"><b>확인</b><br>혜택 · 보상 센터에서 7일 방송 진행 상태와 지급 여부를 확인합니다.</div>');
  };

  /* 9,900원 구독자는 전화번호/계좌번호를 게시·전송하지 못하게 차단. */
  function restrictedText(text){
    text=String(text||'');
    var phone=/(01[016789])[-.\s]?\d{3,4}[-.\s]?\d{4}/.test(text);
    var account=/\b\d{2,6}[-\s]\d{2,6}[-\s]\d{2,8}\b/.test(text)||/(계좌|은행)[^0-9]{0,8}\d{8,20}/.test(text.replace(/[-\s]/g,''));
    return phone||account;
  }
  function collectText(root){
    if(!root||!root.querySelectorAll)return '';
    var out=[];
    root.querySelectorAll('input[type="text"],input[type="tel"],input:not([type]),textarea').forEach(function(el){if(el.value)out.push(el.value);});
    return out.join(' ');
  }
  function shouldCheckButton(btn){
    var t=String(btn&&((btn.innerText||btn.textContent)||'')).replace(/\s+/g,'');
    return /(보내|전송|등록|저장|게시|올리|작성|업로드)/.test(t);
  }
  function blockIfNeeded(e,root){
    var plan=window.ktGetSubscriptionPlan();
    if(!plan||plan.price!==9900)return false;
    if(!restrictedText(collectText(root)))return false;
    if(e){e.preventDefault();e.stopImmediatePropagation();}
    alert('9,900원 구독자는 전화번호·계좌번호를 올릴 수 없습니다. 14,900원 이상부터 가능합니다.');
    return true;
  }
  document.addEventListener('submit',function(e){blockIfNeeded(e,e.target);},true);
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('button,input[type="submit"]'):null;
    if(!btn||!shouldCheckButton(btn))return;
    var root=btn.closest('form')||btn.closest('#sheetBody')||btn.parentElement;
    blockIfNeeded(e,root);
  },true);

  /* 매치 구독 혜택: 구독자는 자신이 받은 매치 보상에 10%를 추가한다. */
  window.ktMatchSubscriberBonusPercent=function(){
    return window.ktIsPaidSubscriber()?10:0;
  };
  window.ktApplyMatchSubscriberBonus=function(amount){
    var n=Number(amount)||0;
    if(!window.ktIsPaidSubscriber())return Math.round(n);
    return Math.round(n*1.10);
  };

  /* 월 1회 매치 랭킹 보상. */
  window.ktMatchMonthlyPrizes={1:100,2:80,3:50,4:30,5:30};
  window.ktGetMatchMonthlyPrize=function(rank){
    rank=parseInt(rank,10)||0;
    return window.ktMatchMonthlyPrizes[rank]||0;
  };

  function decorateMatchArena(){
    try{
      var arena=document.querySelector('.kt-match-arena');
      if(!arena)return;
      var old=arena.querySelector('[data-kt-match-sub-benefit]');
      if(old)old.remove();
      var box=document.createElement('div');
      box.setAttribute('data-kt-match-sub-benefit','1');
      box.style.cssText='margin:8px 0;padding:10px 11px;border:1px solid #ffffff22;border-radius:14px;background:#101118;color:#fff;font-size:11px;line-height:1.55;font-weight:800';
      box.innerHTML='<b style="color:#ffd85a">⚔ 매치 구독 혜택</b><br>구독자는 매치에서 받은 보상에 <b>10% 추가</b><br><span style="color:#d7d7dd">월 1회 랭킹: 1등 100개 · 2등 80개 · 3등 50개 · 4등 30개 · 5등 30개</span>';
      var rewards=arena.querySelector('.kt-match-rewards');
      if(rewards&&rewards.parentNode)rewards.parentNode.insertBefore(box,rewards.nextSibling);
      else arena.appendChild(box);

      if(window.ktIsPaidSubscriber()){
        var items=arena.querySelectorAll('.kt-match-rewards b');
        items.forEach(function(b){
          var m=String(b.textContent||'').match(/\+(\d+)P/);
          if(!m)return;
          var base=parseInt(m[1],10)||0;
          b.textContent='+'+window.ktApplyMatchSubscriberBonus(base)+'P';
        });
      }
    }catch(e){}
  }

  var oldRenderMatch=window.ktRenderMatchArena;
  if(typeof oldRenderMatch==='function'&&!oldRenderMatch.__ktSubscriberMatchWrapped){
    var wrappedRender=function(){
      var r=oldRenderMatch.apply(this,arguments);
      setTimeout(decorateMatchArena,0);
      return r;
    };
    wrappedRender.__ktSubscriberMatchWrapped=true;
    window.ktRenderMatchArena=wrappedRender;
  }
})();
